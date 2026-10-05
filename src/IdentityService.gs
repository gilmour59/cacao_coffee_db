function findFarmerByRsbsaNo_(rsbsaNo) {
  const normalized = normalizeRsbsaNo_(rsbsaNo);
  if (!normalized) return null;
  return findFirstByField_('Farmers', 'rsbsa_no', normalized);
}

function evaluateIdentitySignals_(farmerPayload) {
  const result = {
    tier: 'NONE',
    reasons: [],
    candidateFarmerIds: []
  };

  if (!farmerPayload) return result;

  const rsbsa = normalizeRsbsaNo_(farmerPayload.rsbsa_no);
  const first = normalizeNamePart_(farmerPayload.first_name);
  const last = normalizeNamePart_(farmerPayload.last_name);
  const phone = normalizePhone_(farmerPayload.contact_no);
  const barangay = cleanText_(farmerPayload.residence_barangay_code);

  const farmers = getRowsAsObjects_('Farmers');

  farmers.forEach(function(row) {
    if (String(row.record_status || '').toUpperCase() === 'MERGED') return;

    const rowRsbsa = normalizeRsbsaNo_(row.rsbsa_no);
    const rowFirst = normalizeNamePart_(row.first_name);
    const rowLast = normalizeNamePart_(row.last_name);
    const rowPhone = normalizePhone_(row.contact_no);
    const rowBarangay = cleanText_(row.residence_barangay_code);

    if (rsbsa && rowRsbsa && rsbsa === rowRsbsa) {
      result.tier = 'STRONG';
      result.reasons.push('Exact RSBSA number match');
      result.candidateFarmerIds.push(row.farmer_id);
      return;
    }

    const nearRsbsaReason = rsbsa && rowRsbsa
      ? getRsbsaNearMatchReason_(rsbsa, rowRsbsa)
      : '';

    if (nearRsbsaReason) {
      if (result.tier !== 'STRONG') result.tier = 'POSSIBLE';
      result.reasons.push(nearRsbsaReason);
      result.candidateFarmerIds.push(row.farmer_id);
      return;
    }

    if (first && last && phone &&
        first === rowFirst && last === rowLast && phone === rowPhone) {
      if (result.tier !== 'STRONG') result.tier = 'POSSIBLE';
      result.reasons.push('Same normalized name and contact number');
      result.candidateFarmerIds.push(row.farmer_id);
      return;
    }

    if (first && last && barangay &&
        first === rowFirst && last === rowLast && barangay === rowBarangay) {
      if (result.tier === 'NONE') result.tier = 'WEAK';
      result.reasons.push('Same normalized name and residence barangay');
      result.candidateFarmerIds.push(row.farmer_id);
    }
  });

  result.candidateFarmerIds = Array.from(new Set(result.candidateFarmerIds));
  result.reasons = Array.from(new Set(result.reasons));
  return result;
}

function createIdentityReviewsForSubmissionUnlocked_(submissionId, farmerPayload, signals) {
  if (!signals || !signals.candidateFarmerIds || !signals.candidateFarmerIds.length) return [];

  const now = new Date();
  return signals.candidateFarmerIds.map(function(candidateFarmerId) {
    const row = {
      identity_review_id: generateRecordIdUnlocked_('IDR'),
      submission_id: submissionId,
      subject_farmer_id: '',
      candidate_farmer_id: candidateFarmerId,
      match_tier: signals.tier,
      match_reasons: signals.reasons.join('; '),
      review_status: 'PENDING',
      resolution: '',
      requested_by: getActorEmail_(),
      resolved_by: '',
      resolved_at: '',
      resolution_notes: '',
      created_at: now,
      updated_at: now
    };
    appendObjectRowUnlocked_('Identity_Reviews', row);
    return row;
  });
}

function resolveIdentityReview(reviewId, resolution, notes) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR]);
  const allowed = [
    'LINK_TO_EXISTING','CREATE_NEW','CONFIRMED_DIFFERENT',
    'IDENTITY_CORRECTION_APPROVED','MERGE_REQUIRED','MERGED'
  ];
  const normalizedResolution = requireOneOf_(resolution, allowed, 'resolution');
  const current = findById_('Identity_Reviews', 'identity_review_id', reviewId);
  if (!current) throw new Error('Identity review not found.');

  const updated = patchObjectRowByField_('Identity_Reviews', 'identity_review_id', reviewId, {
    review_status: 'RESOLVED',
    resolution: normalizedResolution,
    resolved_by: staff.user_email,
    resolved_at: new Date(),
    resolution_notes: cleanText_(notes),
    updated_at: new Date()
  });

  writeAudit_('RESOLVE_IDENTITY_REVIEW', 'IDENTITY_REVIEW', reviewId, {
    resolution: normalizedResolution,
    notes: cleanText_(notes)
  });
  return updated;
}

function getIdentityReviewsForSubmission_(submissionId) {
  return findRowsByField_('Identity_Reviews', 'submission_id', submissionId);
}


function detectProtectedIdentityChanges_(farmerId, farmerPayload) {
  if (!farmerId || !farmerPayload) return [];
  const current = findById_('Farmers', 'farmer_id', farmerId);
  if (!current) return [];

  const reasons = [];
  if (farmerPayload.rsbsa_no !== undefined &&
      normalizeRsbsaNo_(farmerPayload.rsbsa_no) !== normalizeRsbsaNo_(current.rsbsa_no)) {
    reasons.push('RSBSA number change requested');
  }

  ['first_name','middle_name','last_name','suffix'].forEach(function(field) {
    if (farmerPayload[field] !== undefined &&
        normalizeNamePart_(farmerPayload[field]) !== normalizeNamePart_(current[field])) {
      reasons.push(field + ' change requested');
    }
  });

  return reasons;
}

function createProtectedIdentityReviewForSubmissionUnlocked_(submissionId, farmerId, reasons) {
  if (!reasons || !reasons.length) return null;

  const now = new Date();
  const row = {
    identity_review_id: generateRecordIdUnlocked_('IDR'),
    submission_id: submissionId,
    subject_farmer_id: farmerId,
    candidate_farmer_id: farmerId,
    match_tier: 'STRONG',
    match_reasons: reasons.join('; '),
    review_status: 'PENDING',
    resolution: '',
    requested_by: getActorEmail_(),
    resolved_by: '',
    resolved_at: '',
    resolution_notes: '',
    created_at: now,
    updated_at: now
  };
  appendObjectRowUnlocked_('Identity_Reviews', row);
  return row;
}
