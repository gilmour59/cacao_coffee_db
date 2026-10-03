function listPendingSubmissions() {
  requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR]);
  return getRowsAsObjects_('Submissions')
    .filter(function(row) { return String(row.status || '').toUpperCase() === 'PENDING'; })
    .map(function(row) {
      const payload = parseSubmissionPayload_(row);
      let subjectName = '';
      if (payload.farmer) {
        subjectName = [payload.farmer.first_name, payload.farmer.middle_name, payload.farmer.last_name, payload.farmer.suffix]
          .filter(Boolean).join(' ');
      } else if (row.farmer_id) {
        const farmer = findById_('Farmers', 'farmer_id', row.farmer_id);
        if (farmer) {
          subjectName = [farmer.first_name, farmer.middle_name, farmer.last_name, farmer.suffix]
            .filter(Boolean).join(' ');
        }
      }

      return {
        submission_id: row.submission_id,
        farmer_id: row.farmer_id || '',
        submission_type: row.submission_type,
        reference_year: row.reference_year,
        classification: row.classification,
        flags: parseJsonArray_(row.flag_reasons_json),
        submitted_at: row.submitted_at,
        submitted_by: row.submitted_by,
        subject_name: subjectName
      };
    });
}

function getSubmissionForReview(submissionId) {
  requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR]);
  const row = findById_('Submissions', 'submission_id', submissionId);
  if (!row) throw new Error('Submission not found.');

  const identityReviews = getIdentityReviewsForSubmission_(submissionId).map(function(review) {
    const candidate = review.candidate_farmer_id
      ? findById_('Farmers', 'farmer_id', review.candidate_farmer_id)
      : null;

    return {
      identity_review_id: review.identity_review_id,
      match_tier: review.match_tier,
      match_reasons: review.match_reasons,
      review_status: review.review_status,
      resolution: review.resolution,
      candidate: candidate ? {
        farmer_id: candidate.farmer_id,
        rsbsa_no: candidate.rsbsa_no,
        first_name: candidate.first_name,
        middle_name: candidate.middle_name,
        last_name: candidate.last_name,
        suffix: candidate.suffix,
        contact_no: candidate.contact_no,
        residence_barangay_code: candidate.residence_barangay_code,
        record_status: candidate.record_status
      } : null
    };
  });

  return {
    submission: {
      submission_id: row.submission_id,
      farmer_id: row.farmer_id || '',
      invitation_id: row.invitation_id || '',
      submission_type: row.submission_type,
      reference_year: row.reference_year,
      status: row.status,
      classification: row.classification,
      flags: parseJsonArray_(row.flag_reasons_json),
      comparison: parseJsonObject_(row.comparison_json),
      submitted_at: row.submitted_at,
      submitted_by: row.submitted_by
    },
    payload: parseSubmissionPayload_(row),
    identity_reviews: identityReviews
  };
}

function approveSubmission(submissionId, remarks) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR]);

  return withScriptLock_(function() {
    const submission = findById_('Submissions', 'submission_id', submissionId);
    if (!submission) throw new Error('Submission not found.');
    if (String(submission.status || '').toUpperCase() !== 'PENDING') {
      throw new Error('Only pending submissions can be approved.');
    }

    const payload = parseSubmissionPayload_(submission);
    const reviews = getIdentityReviewsForSubmission_(submissionId);
    const pendingReviews = reviews.filter(function(review) {
      return String(review.review_status || '').toUpperCase() !== 'RESOLVED';
    });
    if (pendingReviews.length) {
      throw new Error('Resolve the pending identity review before approving this submission.');
    }

    const farmerId = resolveFarmerForApprovalUnlocked_(submission, payload, reviews);
    const farmer = findById_('Farmers', 'farmer_id', farmerId);
    if (!farmer) throw new Error('Approved farmer record could not be resolved.');

    if (submission.submission_type !== 'NEW_PROFILE' || reviews.some(function(r) {
      return String(r.resolution || '').toUpperCase() === 'LINK_TO_EXISTING';
    })) {
      patchFarmerMasterUnlocked_(farmerId, payload.farmer || {});
    }

    const profilingType = submissionTypeToProfilingType_(submission.submission_type);
    const createdRounds = [];

    (payload.farms || []).forEach(function(farmPayload) {
      const farm = resolveFarmForProfileUnlocked_(farmerId, farmPayload, submissionId);
      createdRounds.push(
        materializeProfilingForFarmUnlocked_(farmerId, farm, farmPayload, submission, profilingType)
      );
    });

    materializeFarmerSupportDataUnlocked_(farmerId, payload, submissionId);

    patchObjectRowByFieldUnlocked_('Submissions', 'submission_id', submissionId, {
      farmer_id: farmerId,
      status: 'APPROVED',
      validated_at: new Date(),
      validated_by: staff.user_email,
      validation_remarks: cleanText_(remarks),
      updated_at: new Date()
    });

    writeAuditUnlocked_('APPROVE', 'SUBMISSION', submissionId, {
      farmer_id: farmerId,
      profiling_round_ids: createdRounds.map(function(round) { return round.profiling_round_id; }),
      remarks: cleanText_(remarks)
    });

    return {
      ok: true,
      submission_id: submissionId,
      status: 'APPROVED',
      farmer_id: farmerId,
      profiling_round_ids: createdRounds.map(function(round) { return round.profiling_round_id; })
    };
  }, 20000);
}

function returnSubmission(submissionId, remarks) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR]);
  if (!cleanText_(remarks)) throw new Error('Return remarks are required.');

  return withScriptLock_(function() {
    const submission = findById_('Submissions', 'submission_id', submissionId);
    if (!submission) throw new Error('Submission not found.');
    if (String(submission.status || '').toUpperCase() !== 'PENDING') {
      throw new Error('Only pending submissions can be returned.');
    }

    patchObjectRowByFieldUnlocked_('Submissions', 'submission_id', submissionId, {
      status: 'RETURNED',
      validated_at: new Date(),
      validated_by: staff.user_email,
      validation_remarks: cleanText_(remarks),
      updated_at: new Date()
    });

    if (submission.invitation_id) {
      markInvitationReturnedUnlocked_(submission.invitation_id);
    }

    writeAuditUnlocked_('RETURN', 'SUBMISSION', submissionId, {
      remarks: cleanText_(remarks)
    });

    return { ok: true, submission_id: submissionId, status: 'RETURNED' };
  }, 15000);
}

function resolveFarmerForApprovalUnlocked_(submission, payload, reviews) {
  const type = String(submission.submission_type || '').toUpperCase();

  if (type !== 'NEW_PROFILE') {
    const existing = findById_('Farmers', 'farmer_id', submission.farmer_id);
    if (!existing || String(existing.record_status || '').toUpperCase() !== 'ACTIVE') {
      throw new Error('Active farmer not found for this submission.');
    }
    return existing.farmer_id;
  }

  const mergeRequired = reviews.some(function(review) {
    return String(review.resolution || '').toUpperCase() === 'MERGE_REQUIRED';
  });
  if (mergeRequired) {
    throw new Error('Complete the required farmer merge before approving this submission.');
  }

  const linkedIds = Array.from(new Set(
    reviews.filter(function(review) {
      return String(review.resolution || '').toUpperCase() === 'LINK_TO_EXISTING';
    }).map(function(review) {
      return String(review.candidate_farmer_id || '');
    }).filter(Boolean)
  ));

  if (linkedIds.length > 1) {
    throw new Error('Identity reviews link this submission to more than one farmer.');
  }
  if (linkedIds.length === 1) {
    const linked = findById_('Farmers', 'farmer_id', linkedIds[0]);
    if (!linked || String(linked.record_status || '').toUpperCase() !== 'ACTIVE') {
      throw new Error('Linked farmer is not active.');
    }
    return linked.farmer_id;
  }

  const latestSignals = evaluateIdentitySignals_(payload.farmer);
  if (latestSignals.candidateFarmerIds.length && reviews.length === 0) {
    createIdentityReviewsForSubmissionUnlocked_(submission.submission_id, payload.farmer, latestSignals);
    throw new Error('A possible existing farmer was detected. Resolve the new identity review before approval.');
  }

  return materializeNewFarmerUnlocked_(payload.farmer, submission.submission_id).farmer_id;
}

function submissionTypeToProfilingType_(submissionType) {
  const type = String(submissionType || '').toUpperCase();
  if (type === 'EXPANSION_UPDATE') return 'EXPANSION_UPDATE';
  if (type === 'CORRECTION') return 'CORRECTION';
  return 'ANNUAL_PROFILE';
}

function parseJsonArray_(value) {
  try {
    const parsed = JSON.parse(String(value || '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function parseJsonObject_(value) {
  try {
    const parsed = JSON.parse(String(value || '{}'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}
