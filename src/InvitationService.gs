const INVITATION_PURPOSES = Object.freeze({
  ANNUAL_PROFILE: 'ANNUAL_PROFILE',
  EXPANSION_UPDATE: 'EXPANSION_UPDATE',
  CORRECTION: 'CORRECTION',
  NEW_FARM: 'NEW_FARM'
});

function createProfilingInvitation(farmerId, referenceYear, purpose, farmId, expiresAt) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const farmer = findById_('Farmers', 'farmer_id', farmerId);
  if (!farmer || String(farmer.record_status || '').toUpperCase() !== 'ACTIVE') {
    throw new Error('Active farmer not found.');
  }

  assertStaffGeographicScope_(staff, farmer.residence_province_code, farmer.residence_lgu_code);
  const normalizedPurpose = requireOneOf_(
    purpose,
    Object.keys(INVITATION_PURPOSES),
    'purpose'
  );
  const year = requirePositiveYear_(referenceYear, 'reference_year');

  if (farmId) {
    const farm = findById_('Farms', 'farm_id', farmId);
    if (!farm || String(farm.farmer_id) !== String(farmerId)) {
      throw new Error('Selected farm does not belong to the farmer.');
    }
  }

  const rawToken = generateSecureToken_();
  const now = new Date();
  const invitation = {
    invitation_id: generateRecordId_('INV'),
    farmer_id: farmerId,
    farm_id: farmId || '',
    reference_year: year,
    purpose: normalizedPurpose,
    token_hash: hashToken_(rawToken),
    status: 'ACTIVE',
    expires_at: expiresAt || '',
    first_opened_at: '',
    last_opened_at: '',
    submitted_at: '',
    created_by: staff.user_email,
    created_at: now,
    revoked_at: ''
  };

  appendObjectRow_('Profiling_Invitations', invitation);
  writeAudit_('CREATE_INVITATION', 'PROFILING_INVITATION', invitation.invitation_id, {
    farmer_id: farmerId,
    farm_id: farmId || '',
    reference_year: year,
    purpose: normalizedPurpose
  });

  let baseUrl = '';
  try {
    baseUrl = ScriptApp.getService().getUrl() || '';
  } catch (error) {}

  return {
    invitation_id: invitation.invitation_id,
    status: invitation.status,
    token: rawToken,
    url: baseUrl ? (baseUrl + '?t=' + encodeURIComponent(rawToken)) : '',
    reference_year: year,
    purpose: normalizedPurpose
  };
}

function getInvitationContext(rawToken) {
  const invitation = resolveInvitationTokenReadOnly_(rawToken);
  touchInvitationOpened_(invitation.invitation_id);

  const farmer = findById_('Farmers', 'farmer_id', invitation.farmer_id);
  if (!farmer) throw new Error('Farmer record is no longer available.');

  const farms = findRowsByField_('Farms', 'farmer_id', invitation.farmer_id)
    .filter(function(farm) {
      if (String(farm.record_status || '').toUpperCase() !== 'ACTIVE') return false;
      if (invitation.farm_id && String(farm.farm_id) !== String(invitation.farm_id)) return false;
      return true;
    })
    .map(function(farm) {
      return {
        farm_id: farm.farm_id,
        farm_name_local_id: farm.farm_name_local_id,
        tenure_code: farm.tenure_code,
        total_farm_area_ha: farm.total_farm_area_ha,
        farm_address: farm.farm_address,
        province_code: farm.province_code,
        lgu_code: farm.lgu_code,
        barangay_code: farm.barangay_code,
        latitude: farm.latitude,
        longitude: farm.longitude,
        location_capture_method: farm.location_capture_method,
        topography_code: farm.topography_code,
        road_distance_km: farm.road_distance_km,
        remarks: farm.remarks
      };
    });

  const safeFarmer = {
    first_name: farmer.first_name,
    middle_name: farmer.middle_name,
    last_name: farmer.last_name,
    suffix: farmer.suffix,
    sex: farmer.sex,
    marital_status_code: farmer.marital_status_code,
    contact_no: farmer.contact_no,
    alternate_contact_no: farmer.alternate_contact_no,
    email: farmer.email,
    association_name: farmer.association_name,
    residence_province_code: farmer.residence_province_code,
    residence_lgu_code: farmer.residence_lgu_code,
    residence_barangay_code: farmer.residence_barangay_code,
    residence_sitio_purok_zone: farmer.residence_sitio_purok_zone,
    residence_street_road: farmer.residence_street_road,
    residence_house_lot_block: farmer.residence_house_lot_block,
    residence_landmark_detail: farmer.residence_landmark_detail,
    rsbsa_registration_status: farmer.rsbsa_registration_status,
    rsbsa_no: farmer.rsbsa_no
  };

  return {
    invitation: {
      invitation_id: invitation.invitation_id,
      reference_year: invitation.reference_year,
      purpose: invitation.purpose,
      status: invitation.status
    },
    farmer: safeFarmer,
    farms: farms
  };
}

function resolveInvitationTokenReadOnly_(rawToken) {
  const tokenHash = hashToken_(rawToken);
  if (!tokenHash) throw new Error('Invalid profiling link.');

  const invitation = findFirstByField_('Profiling_Invitations', 'token_hash', tokenHash);
  if (!invitation) throw new Error('Invalid profiling link.');

  const status = String(invitation.status || '').toUpperCase();
  if (['ACTIVE','RETURNED'].indexOf(status) === -1) {
    throw new Error('This profiling link is no longer active.');
  }

  if (invitation.expires_at) {
    const expiry = new Date(invitation.expires_at);
    if (!isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) {
      throw new Error('This profiling link has expired.');
    }
  }
  return invitation;
}

function touchInvitationOpened_(invitationId) {
  const current = findById_('Profiling_Invitations', 'invitation_id', invitationId);
  if (!current) return;

  patchObjectRowByField_('Profiling_Invitations', 'invitation_id', invitationId, {
    first_opened_at: current.first_opened_at || new Date(),
    last_opened_at: new Date()
  });
}

function markInvitationSubmittedUnlocked_(invitationId) {
  if (!invitationId) return;
  patchObjectRowByFieldUnlocked_('Profiling_Invitations', 'invitation_id', invitationId, {
    status: 'SUBMITTED',
    submitted_at: new Date(),
    last_opened_at: new Date()
  });
}

function markInvitationReturnedUnlocked_(invitationId) {
  if (!invitationId) return;
  patchObjectRowByFieldUnlocked_('Profiling_Invitations', 'invitation_id', invitationId, {
    status: 'RETURNED'
  });
}

function revokeProfilingInvitation(invitationId) {
  requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const invitation = findById_('Profiling_Invitations', 'invitation_id', invitationId);
  if (!invitation) throw new Error('Invitation not found.');

  const updated = patchObjectRowByField_('Profiling_Invitations', 'invitation_id', invitationId, {
    status: 'REVOKED',
    revoked_at: new Date()
  });
  writeAudit_('REVOKE_INVITATION', 'PROFILING_INVITATION', invitationId, {});
  return { ok: true, invitation_id: invitationId, status: updated.status };
}

function purposeToSubmissionType_(purpose) {
  const normalized = String(purpose || '').toUpperCase();
  if (normalized === 'ANNUAL_PROFILE') return 'ANNUAL_PROFILE';
  if (normalized === 'EXPANSION_UPDATE') return 'EXPANSION_UPDATE';
  if (normalized === 'CORRECTION') return 'CORRECTION';
  if (normalized === 'NEW_FARM') return 'NEW_FARM';
  throw new Error('Unsupported profiling invitation purpose.');
}
