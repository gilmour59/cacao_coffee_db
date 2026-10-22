const INVITATION_PURPOSES = Object.freeze({
  ANNUAL_PROFILE: 'ANNUAL_PROFILE',
  EXPANSION_UPDATE: 'EXPANSION_UPDATE',
  CORRECTION: 'CORRECTION',
  NEW_FARM: 'NEW_FARM'
});


function searchActiveFarmersForInvitation(query) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const needle = cleanText_(query).toLowerCase();
  if (needle.length < 2) return [];

  return getRowsAsObjects_('Farmers')
    .filter(function(farmer) {
      if (String(farmer.record_status || '').toUpperCase() !== 'ACTIVE') return false;

      try {
        assertStaffGeographicScope_(staff, farmer.residence_province_code, farmer.residence_lgu_code);
      } catch (error) {
        return false;
      }

      const haystack = [
        farmer.farmer_id,
        farmer.rsbsa_no,
        farmer.first_name,
        farmer.middle_name,
        farmer.last_name,
        farmer.suffix,
        farmer.contact_no
      ].map(function(value) {
        return cleanText_(value).toLowerCase();
      }).join(' ');

      return haystack.indexOf(needle) !== -1;
    })
    .slice(0, 20)
    .map(function(farmer) {
      const farms = findRowsByField_('Farms', 'farmer_id', farmer.farmer_id)
        .filter(function(farm) {
          return String(farm.record_status || '').toUpperCase() === 'ACTIVE';
        })
        .map(function(farm) {
          return {
            farm_id: farm.farm_id,
            farm_name_local_id: farm.farm_name_local_id || '',
            farm_address: farm.farm_address || '',
            barangay_code: farm.barangay_code || ''
          };
        });

      return {
        farmer_id: farmer.farmer_id,
        rsbsa_no: farmer.rsbsa_no || '',
        first_name: farmer.first_name || '',
        middle_name: farmer.middle_name || '',
        last_name: farmer.last_name || '',
        suffix: farmer.suffix || '',
        contact_no: farmer.contact_no || '',
        residence_barangay_code: farmer.residence_barangay_code || '',
        farms: farms
      };
    });
}

function listProfilingInvitationsForFarmer(farmerId) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const farmer = findById_('Farmers', 'farmer_id', farmerId);
  if (!farmer) throw new Error('Farmer not found.');

  assertStaffGeographicScope_(staff, farmer.residence_province_code, farmer.residence_lgu_code);

  return findRowsByField_('Profiling_Invitations', 'farmer_id', farmerId)
    .sort(function(a, b) {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    })
    .slice(0, 20)
    .map(function(invitation) {
      return {
        invitation_id: invitation.invitation_id,
        farmer_id: invitation.farmer_id,
        farm_id: invitation.farm_id || '',
        reference_year: invitation.reference_year,
        purpose: invitation.purpose,
        status: invitation.status,
        expires_at: toClientDateTime_(invitation.expires_at),
        created_at: toClientDateTime_(invitation.created_at),
        submitted_at: toClientDateTime_(invitation.submitted_at),
        revoked_at: toClientDateTime_(invitation.revoked_at)
      };
    });
}

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

  let baseUrl = PropertiesService.getScriptProperties().getProperty('FARMER_WEB_APP_URL') || '';
  if (!baseUrl) {
    try {
      baseUrl = ScriptApp.getService().getUrl() || '';
    } catch (error) {}
  }

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

  const rounds = getLatestApprovedProfilingRounds_(invitation.farmer_id);
  const database = getDatabase_();
  const waterSources = getRowsAsObjects_('Farm_Water_Sources', database);
  const plantings = getRowsAsObjects_('Plantings', database);
  const observations = getRowsAsObjects_('Planting_Observations', database);
  const production = getRowsAsObjects_('Production', database);
  const facilitySubmissionId = rounds.length ? rounds[0].submission_id : '';
  const facilities = getRowsAsObjects_('Facilities', database).filter(function(row) {
    return String(row.farmer_id) === String(invitation.farmer_id) &&
      String(row.submission_id) === String(facilitySubmissionId);
  }).map(function(row) {
    return { description: row.description || '', quantity: row.quantity, capacity: row.capacity || '',
      model_description: row.model_description || '', condition_status: row.condition_status || '',
      utilization_status: row.utilization_status || '' };
  });

  const farms = findRowsByField_('Farms', 'farmer_id', invitation.farmer_id)
    .filter(function(farm) {
      if (String(farm.record_status || '').toUpperCase() !== 'ACTIVE') return false;
      if (invitation.farm_id && String(farm.farm_id) !== String(invitation.farm_id)) return false;
      return true;
    })
    .map(function(farm) {
      const round = rounds.find(function(row) {
        return String(row.farm_id) === String(farm.farm_id) &&
          Number(row.reference_year) <= Number(invitation.reference_year);
      });
      const farmWater = waterSources.filter(function(row) { return String(row.farm_id) === String(farm.farm_id); });
      const waterSubmissionId = farmWater.some(function(row) { return round && row.submission_id === round.submission_id; })
        ? round.submission_id : (farmWater.length ? farmWater[farmWater.length - 1].submission_id : '');
      const selectedWater = farmWater.filter(function(row) { return row.submission_id === waterSubmissionId; })
        .sort(function(a, b) { return Number(parseBoolean_(b.is_primary)) - Number(parseBoolean_(a.is_primary)); });
      const farmPlantings = plantings.filter(function(row) {
        return String(row.farm_id) === String(farm.farm_id) && String(row.record_status || '').toUpperCase() === 'ACTIVE';
      });
      const cropProfiles = round ? observations.filter(function(row) {
        return String(row.profiling_round_id) === String(round.profiling_round_id) &&
          String(row.farm_id) === String(farm.farm_id);
      }).map(function(row) {
        const code = String(row.commodity_code || '').toUpperCase();
        return { commodity_code: code, trees_newly_planted: row.trees_newly_planted || 0,
          trees_non_bearing: row.trees_non_bearing || 0, trees_bearing: row.trees_bearing || 0,
          mortality_count: row.mortality_count || 0, area_planted_ha: row.area_planted_ha || 0,
          plantings: farmPlantings.filter(function(item) { return String(item.commodity_code).toUpperCase() === code; })
            .map(function(item) { return { variety_code: item.variety_code, year_planted: item.year_planted }; }),
          production: production.filter(function(item) {
            // Prior-year harvests are history, not defaults for a new annual submission.
            if (Number(round.reference_year) !== Number(invitation.reference_year)) return false;
            return String(item.profiling_round_id) === String(round.profiling_round_id) &&
              String(item.farm_id) === String(farm.farm_id) && String(item.commodity_code).toUpperCase() === code;
          }).map(function(item) {
            const date = item.harvest_date ? new Date(item.harvest_date) : null;
            return { harvest_date: date && !isNaN(date.getTime())
                ? Utilities.formatDate(date, 'Asia/Manila', 'yyyy-MM-dd') : '',
              production_year: item.production_year || round.reference_year,
              production_volume_kg: item.production_volume_kg || 0,
              selling_price_per_kg: item.selling_price_per_kg === '' ? '' : item.selling_price_per_kg };
          }) };
      }) : [];
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
        remarks: farm.remarks,
        water_sources: selectedWater.map(function(row) {
          return { water_source_code: row.water_source_code, is_primary: parseBoolean_(row.is_primary) };
        }),
        crops: cropProfiles
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
    farms: farms,
    facilities: facilities
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
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const invitation = findById_('Profiling_Invitations', 'invitation_id', invitationId);
  if (!invitation) throw new Error('Invitation not found.');

  const farmer = findById_('Farmers', 'farmer_id', invitation.farmer_id);
  if (!farmer) throw new Error('Farmer not found.');
  assertStaffGeographicScope_(staff, farmer.residence_province_code, farmer.residence_lgu_code);

  const status = String(invitation.status || '').toUpperCase();
  if (status === 'REVOKED') {
    return { ok: true, invitation_id: invitationId, status: 'REVOKED' };
  }

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
