const SUBMISSION_TYPES = Object.freeze([
  'NEW_PROFILE','ANNUAL_PROFILE','EXPANSION_UPDATE','CORRECTION','NEW_FARM'
]);

function submitNewFarmerProfile(payload) {
  const cleanPayload = sanitizeSubmissionPayload_(payload || {});
  cleanPayload.submission_type = 'NEW_PROFILE';
  cleanPayload.farmer_id = '';
  return createPendingSubmission_(cleanPayload, {
    source: 'PUBLIC',
    invitation_id: ''
  });
}

function submitExistingFarmerProfile(rawToken, payload) {
  const invitation = resolveInvitationTokenReadOnly_(rawToken);
  const cleanPayload = sanitizeSubmissionPayload_(payload || {});

  cleanPayload.submission_type = purposeToSubmissionType_(invitation.purpose);
  cleanPayload.farmer_id = invitation.farmer_id;
  cleanPayload.reference_year = Number(invitation.reference_year);

  if (invitation.farm_id) {
    (cleanPayload.farms || []).forEach(function(farm) {
      if (!farm.farm_id) farm.farm_id = invitation.farm_id;
    });
  }

  const result = createPendingSubmission_(cleanPayload, {
    source: 'SECURE_LINK',
    invitation_id: invitation.invitation_id
  });

  return result;
}

function submitEncoderProfile(payload) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const cleanPayload = sanitizeSubmissionPayload_(payload || {});
  const type = requireOneOf_(cleanPayload.submission_type, SUBMISSION_TYPES, 'submission_type');
  cleanPayload.submission_type = type;

  if (type !== 'NEW_PROFILE') {
    requireFields_(cleanPayload, ['farmer_id']);
    const farmer = findById_('Farmers', 'farmer_id', cleanPayload.farmer_id);
    if (!farmer) throw new Error('Farmer not found.');
    assertStaffGeographicScope_(staff, farmer.residence_province_code, farmer.residence_lgu_code);
  }

  return createPendingSubmission_(cleanPayload, {
    source: 'ENCODER',
    invitation_id: cleanPayload.invitation_id || ''
  });
}

function createPendingSubmission_(payload, context) {
  validateSubmissionPayload_(payload);
  const type = requireOneOf_(payload.submission_type, SUBMISSION_TYPES, 'submission_type');
  const farmerId = type === 'NEW_PROFILE' ? '' : cleanText_(payload.farmer_id);
  const year = requirePositiveYear_(payload.reference_year, 'reference_year');

  const identitySignals = type === 'NEW_PROFILE'
    ? evaluateIdentitySignals_(payload.farmer)
    : { tier: 'NONE', reasons: [], candidateFarmerIds: [] };

  const change = classifySubmission_(type, farmerId, payload);
  const identityFlags = identitySignals.tier !== 'NONE'
    ? ['Possible existing farmer/identity match requires Validator review']
    : [];
  const flags = Array.from(new Set((change.flags || []).concat(identityFlags)));

  return withScriptLock_(function() {
    const submissionId = generateRecordIdUnlocked_('SUB');
    const now = new Date();
    const submittedBy = getActorEmail_() || context.source || 'PUBLIC';

    const row = {
      submission_id: submissionId,
      farmer_id: farmerId,
      invitation_id: context.invitation_id || '',
      submission_type: type,
      reference_year: year,
      status: 'PENDING',
      payload_json: serializeSubmissionPayload_(payload),
      classification: change.classification,
      flag_reasons_json: safeJsonStringify_(flags),
      comparison_json: safeJsonStringify_(change.comparison || {}),
      submitted_at: now,
      submitted_by: submittedBy,
      validated_at: '',
      validated_by: '',
      validation_remarks: '',
      created_at: now,
      updated_at: now
    };

    appendObjectRowUnlocked_('Submissions', row);

    const identityReviews = createIdentityReviewsForSubmissionUnlocked_(
      submissionId,
      payload.farmer,
      identitySignals
    );

    if (context.invitation_id) {
      markInvitationSubmittedUnlocked_(context.invitation_id);
    }

    writeAuditUnlocked_('SUBMIT', 'SUBMISSION', submissionId, {
      submission_type: type,
      reference_year: year,
      source: context.source || '',
      classification: change.classification,
      flags: flags,
      identity_review_count: identityReviews.length
    });

    return {
      ok: true,
      submission_id: submissionId,
      status: 'PENDING',
      classification: change.classification,
      flags: flags,
      identity_review_required: identityReviews.length > 0
    };
  }, 15000);
}

function validateSubmissionPayload_(payload) {
  requireFields_(payload, ['submission_type','reference_year']);
  const type = requireOneOf_(payload.submission_type, SUBMISSION_TYPES, 'submission_type');
  requirePositiveYear_(payload.reference_year, 'reference_year');

  if (type === 'NEW_PROFILE') {
    if (!payload.farmer || typeof payload.farmer !== 'object') {
      throw new Error('Farmer information is required.');
    }
    requireFields_(payload.farmer, [
      'rsbsa_registration_status','rsbsa_capture_method',
      'first_name','last_name','sex','marital_status_code','contact_no',
      'residence_province_code','residence_lgu_code','residence_barangay_code'
    ]);
  } else {
    requireFields_(payload, ['farmer_id']);
  }

  const farms = requireArray_(payload, 'farms', 1);
  farms.forEach(function(farm, farmIndex) {
    if (!farm.farm_id) {
      requireFields_(farm, [
        'tenure_code','total_farm_area_ha','farm_address',
        'province_code','lgu_code','barangay_code',
        'latitude','longitude','location_capture_method',
        'topography_code','road_distance_km'
      ]);
    }

    requireArray_(farm, 'crops', 1).forEach(function(crop, cropIndex) {
      requireOneOf_(crop.commodity_code, ['COFFEE','CACAO'], 'commodity_code');
      requireNonNegativeNumber_(crop.trees_newly_planted || 0, 'trees_newly_planted');
      requireNonNegativeNumber_(crop.trees_non_bearing || 0, 'trees_non_bearing');
      requireNonNegativeNumber_(crop.trees_bearing || 0, 'trees_bearing');
      requireNonNegativeNumber_(crop.mortality_count || 0, 'mortality_count');
      requireNonNegativeNumber_(crop.area_planted_ha || 0, 'area_planted_ha');

      (crop.plantings || []).forEach(function(planting) {
        requireFields_(planting, ['variety_code','year_planted']);
        requirePositiveYear_(planting.year_planted, 'year_planted');
      });

      (crop.production || []).forEach(function(production) {
        requireNonNegativeNumber_(production.production_volume_kg || 0, 'production_volume_kg');
        if (production.selling_price_per_kg !== '' && production.selling_price_per_kg !== undefined) {
          requireNonNegativeNumber_(production.selling_price_per_kg, 'selling_price_per_kg');
        }
      });
    });
  });
}

function sanitizeSubmissionPayload_(payload) {
  const clone = JSON.parse(JSON.stringify(payload || {}));

  function scrub(value) {
    if (!value || typeof value !== 'object') return;
    Object.keys(value).forEach(function(key) {
      if (/image|photo|base64|data_url|blob/i.test(key)) {
        delete value[key];
        return;
      }
      scrub(value[key]);
    });
  }

  scrub(clone);
  return clone;
}

function serializeSubmissionPayload_(payload) {
  const json = JSON.stringify(payload);
  if (json.length > 45000) {
    throw new Error('Submission is too large for the V1 staging record. Please reduce repeated/free-text data.');
  }
  return json;
}

function parseSubmissionPayload_(submissionRow) {
  try {
    return JSON.parse(String(submissionRow.payload_json || '{}'));
  } catch (error) {
    throw new Error('Stored submission payload is invalid JSON.');
  }
}
