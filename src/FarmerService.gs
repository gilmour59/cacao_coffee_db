function findFarmerByRsbsaNo(rsbsaNo) {
  requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  return findFarmerByRsbsaNo_(rsbsaNo);
}

function createFarmer() {
  throw new Error('Direct canonical farmer creation is disabled. Use the submission workflow.');
}

function materializeNewFarmerUnlocked_(payload, submissionId) {
  requireFields_(payload, [
    'rsbsa_registration_status','rsbsa_capture_method',
    'first_name','last_name','sex','marital_status_code','contact_no',
    'residence_province_code','residence_lgu_code','residence_barangay_code'
  ]);

  const registered = String(payload.rsbsa_registration_status) !== 'NOT_REGISTERED';
  const normalizedRsbsa = normalizeRsbsaNo_(payload.rsbsa_no);
  if (registered && !normalizedRsbsa) {
    throw new Error('RSBSA number is required for registered farmers.');
  }

  const now = new Date();
  const farmer = {
    farmer_id: generateRecordIdUnlocked_('FMR'),
    rsbsa_registration_status: payload.rsbsa_registration_status,
    rsbsa_no: normalizedRsbsa,
    rsbsa_capture_method: payload.rsbsa_capture_method,
    rsbsa_info_confirmed: parseBoolean_(payload.rsbsa_info_confirmed),
    first_name: cleanText_(payload.first_name),
    middle_name: cleanText_(payload.middle_name),
    last_name: cleanText_(payload.last_name),
    suffix: cleanText_(payload.suffix),
    sex: String(payload.sex || '').toUpperCase(),
    marital_status_code: String(payload.marital_status_code || '').toUpperCase(),
    contact_no: cleanText_(payload.contact_no),
    alternate_contact_no: cleanText_(payload.alternate_contact_no),
    email: normalizeEmail_(payload.email),
    association_name: cleanText_(payload.association_name),
    residence_province_code: cleanText_(payload.residence_province_code),
    residence_lgu_code: cleanText_(payload.residence_lgu_code),
    residence_barangay_code: cleanText_(payload.residence_barangay_code),
    residence_sitio_purok_zone: cleanText_(payload.residence_sitio_purok_zone),
    residence_street_road: cleanText_(payload.residence_street_road),
    residence_house_lot_block: cleanText_(payload.residence_house_lot_block),
    residence_landmark_detail: cleanText_(payload.residence_landmark_detail),
    created_from_submission_id: submissionId,
    merged_into_farmer_id: '',
    record_status: 'ACTIVE',
    created_at: now,
    created_by: getActorEmail_(),
    updated_at: now,
    updated_by: getActorEmail_()
  };

  appendObjectRowUnlocked_('Farmers', farmer);
  return farmer;
}

function getFarmerForStaff(farmerId) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const farmer = findById_('Farmers', 'farmer_id', farmerId);
  if (!farmer) throw new Error('Farmer not found.');
  assertStaffGeographicScope_(staff, farmer.residence_province_code, farmer.residence_lgu_code);
  delete farmer._rowNumber;
  return farmer;
}


function patchFarmerMasterUnlocked_(farmerId, payload) {
  if (!payload) return findById_('Farmers', 'farmer_id', farmerId);

  const current = findById_('Farmers', 'farmer_id', farmerId);
  if (!current) throw new Error('Farmer not found.');

  const patch = {
    sex: payload.sex ? String(payload.sex).toUpperCase() : current.sex,
    marital_status_code: payload.marital_status_code
      ? String(payload.marital_status_code).toUpperCase()
      : current.marital_status_code,
    contact_no: payload.contact_no !== undefined ? cleanText_(payload.contact_no) : current.contact_no,
    alternate_contact_no: payload.alternate_contact_no !== undefined
      ? cleanText_(payload.alternate_contact_no)
      : current.alternate_contact_no,
    email: payload.email !== undefined ? normalizeEmail_(payload.email) : current.email,
    association_name: payload.association_name !== undefined
      ? cleanText_(payload.association_name)
      : current.association_name,
    residence_province_code: payload.residence_province_code !== undefined
      ? cleanText_(payload.residence_province_code)
      : current.residence_province_code,
    residence_lgu_code: payload.residence_lgu_code !== undefined
      ? cleanText_(payload.residence_lgu_code)
      : current.residence_lgu_code,
    residence_barangay_code: payload.residence_barangay_code !== undefined
      ? cleanText_(payload.residence_barangay_code)
      : current.residence_barangay_code,
    residence_sitio_purok_zone: payload.residence_sitio_purok_zone !== undefined
      ? cleanText_(payload.residence_sitio_purok_zone)
      : current.residence_sitio_purok_zone,
    residence_street_road: payload.residence_street_road !== undefined
      ? cleanText_(payload.residence_street_road)
      : current.residence_street_road,
    residence_house_lot_block: payload.residence_house_lot_block !== undefined
      ? cleanText_(payload.residence_house_lot_block)
      : current.residence_house_lot_block,
    residence_landmark_detail: payload.residence_landmark_detail !== undefined
      ? cleanText_(payload.residence_landmark_detail)
      : current.residence_landmark_detail,
    updated_at: new Date(),
    updated_by: getActorEmail_()
  };

  return patchObjectRowByFieldUnlocked_('Farmers', 'farmer_id', farmerId, patch);
}
