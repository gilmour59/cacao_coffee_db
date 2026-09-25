function findFarmerByRsbsaNo(rsbsaNo) {
  const normalized = normalizeRsbsaNo_(rsbsaNo);
  if (!normalized) return null;
  return findFirstByField_('Farmers', 'rsbsa_no', normalized);
}

function createFarmer(payload) {
  requireFields_(payload, [
    'rsbsa_registration_status',
    'rsbsa_capture_method',
    'first_name',
    'last_name',
    'sex',
    'contact_no',
    'residence_address'
  ]);

  const registered = payload.rsbsa_registration_status !== 'NOT_REGISTERED';
  const normalizedRsbsa = normalizeRsbsaNo_(payload.rsbsa_no);

  if (registered && !normalizedRsbsa) {
    throw new Error('RSBSA number is required for registered farmers.');
  }

  if (normalizedRsbsa) {
    const existing = findFarmerByRsbsaNo(normalizedRsbsa);
    if (existing) {
      return {
        ok: false,
        duplicate: true,
        farmer: existing
      };
    }
  }

  const now = new Date();
  const farmer = {
    farmer_id: generateRecordId_('FMR'),
    rsbsa_registration_status: payload.rsbsa_registration_status,
    rsbsa_no: normalizedRsbsa,
    rsbsa_capture_method: payload.rsbsa_capture_method,
    rsbsa_info_confirmed: payload.rsbsa_info_confirmed === true,
    first_name: String(payload.first_name || '').trim(),
    middle_name: String(payload.middle_name || '').trim(),
    last_name: String(payload.last_name || '').trim(),
    suffix: String(payload.suffix || '').trim(),
    sex: payload.sex,
    contact_no: String(payload.contact_no || '').trim(),
    residence_address: String(payload.residence_address || '').trim(),
    created_from_submission_id: payload.created_from_submission_id || '',
    record_status: 'ACTIVE',
    created_at: now,
    created_by: getActorEmail_(),
    updated_at: now,
    updated_by: getActorEmail_()
  };

  appendObjectRow_('Farmers', farmer);

  return {
    ok: true,
    duplicate: false,
    farmer: farmer
  };
}
