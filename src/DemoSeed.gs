// Official PSA PSGC 2026-09-30 codes; farmer and farm records below are fictional.
const DEMO_LOCATIONS = [
  { province: ['0600400000', 'Aklan'], lgu: ['0600403000', 'Banga', 'MUNICIPALITY'], barangays: [['0600403001', 'Agbanawan'], ['0600403002', 'Bacan'], ['0600403003', 'Badiangan']] },
  { province: ['0600400000', 'Aklan'], lgu: ['0600407000', 'Kalibo', 'MUNICIPALITY'], barangays: [['0600407001', 'Andagaw'], ['0600407002', 'Bachaw Norte'], ['0600407003', 'Bachaw Sur']] },
  { province: ['0600600000', 'Antique'], lgu: ['0600613000', 'San Jose', 'MUNICIPALITY'], barangays: [['0600613001', 'Atabay'], ['0600613002', 'Badiang'], ['0600613003', 'Barangay 1']] },
  { province: ['0600600000', 'Antique'], lgu: ['0600616000', 'Sibalom', 'MUNICIPALITY'], barangays: [['0600616002', 'Alangan'], ['0600616003', 'Valentin Grasparil'], ['0600616004', 'Bari']] },
  { province: ['0601900000', 'Capiz'], lgu: ['0601909000', 'Panay', 'MUNICIPALITY'], barangays: [['0601909001', 'Agbalo'], ['0601909002', 'Agbanban'], ['0601909003', 'Agojo']] },
  { province: ['0601900000', 'Capiz'], lgu: ['0601914000', 'City of Roxas', 'CITY'], barangays: [['0601914001', 'Adlawan'], ['0601914002', 'Bago'], ['0601914003', 'Balijuagan']] },
  { province: ['0603000000', 'Iloilo'], lgu: ['0603025000', 'Lambunao', 'MUNICIPALITY'], barangays: [['0603025001', 'Agsirab'], ['0603025002', 'Agtuman'], ['0603025003', 'Alugmawa']] },
  { province: ['0603000000', 'Iloilo'], lgu: ['0603028000', 'Leon', 'MUNICIPALITY'], barangays: [['0603028001', 'Agboy Norte'], ['0603028002', 'Agboy Sur'], ['0603028003', 'Agta']] },
  { province: ['0603000000', 'Iloilo'], lgu: ['0603037000', 'Pototan', 'MUNICIPALITY'], barangays: [['0603037001', 'Abangay'], ['0603037002', 'Amamaros'], ['0603037003', 'Bagacay']] },
  { province: ['0607900000', 'Guimaras'], lgu: ['0607901000', 'Buenavista', 'MUNICIPALITY'], barangays: [['0607901001', 'Agsanayan'], ['0607901002', 'Avila'], ['0607901003', 'Banban']] },
  { province: ['0607900000', 'Guimaras'], lgu: ['0607902000', 'Jordan', 'MUNICIPALITY'], barangays: [['0607902002', 'Alaguisoc'], ['0607902005', 'Balcon Maravilla'], ['0607902006', 'Balcon Melliza']] }
];

function seedTestDemoLocations_() {
  const rows = { Ref_Provinces: [], Ref_LGUs: [], Ref_Barangays: [] };
  DEMO_LOCATIONS.forEach(function(location) {
    rows.Ref_Provinces.push({ province_code: location.province[0], province_name: location.province[1], region_code: '0600000000', is_active: true, source_version: 'PSGC 2026-09-30' });
    rows.Ref_LGUs.push({ lgu_code: location.lgu[0], province_code: location.province[0], lgu_name: location.lgu[1], lgu_type: location.lgu[2], is_active: true, source_version: 'PSGC 2026-09-30' });
    location.barangays.forEach(function(barangay) {
      rows.Ref_Barangays.push({ barangay_code: barangay[0], lgu_code: location.lgu[0], province_code: location.province[0], barangay_name: barangay[1], is_active: true, source_version: 'PSGC 2026-09-30' });
    });
  });
  const keys = { Ref_Provinces: 'province_code', Ref_LGUs: 'lgu_code', Ref_Barangays: 'barangay_code' };
  Object.keys(rows).forEach(function(sheetName) {
    const key = keys[sheetName];
    const existing = new Set(getRowsAsObjects_(sheetName).map(function(row) { return String(row[key]).padStart(10, '0'); }));
    appendObjectRows_(sheetName, rows[sheetName].filter(function(row) {
      const code = String(row[key]).padStart(10, '0');
      if (existing.has(code)) return false;
      existing.add(code);
      return true;
    }));
  });
}

// Run manually from the TEST Apps Script editor. Deterministic IDs make reruns safe after partial writes.
function seedTestDemoData() {
  requireBootstrapAdmin_();
  if (getAppConfig_().environment !== 'TEST') throw new Error('Demo data can only be seeded in TEST.');

  seedTestDemoLocations_();

  const rows = {
    Farmers: [], Farms: [], Submissions: [], Profiling_Rounds: [],
    Plantings: [], Planting_Observations: [], Production: [], Intervention_Needs: [],
    Farm_Water_Sources: [], Facilities: [], Interventions: []
  };
  const now = new Date();
  for (let n = 1; n <= 120; n++) {
    const suffix = String(n).padStart(3, '0');
    const registered = n <= 12 || (n > 24 && n % 2 === 1);
    const farmerId = 'DEMO-F-2026-' + suffix;
    const farmId = 'DEMO-A-2026-' + suffix;
    const location = DEMO_LOCATIONS[n <= 24 ? 8 : (n - 25) % DEMO_LOCATIONS.length];
    const barangay = location.barangays[(n - 1) % location.barangays.length];
    const commodity = n % 3 === 0 ? 'CACAO' : 'COFFEE';
    rows.Farmers.push({
      farmer_id: farmerId, first_name: 'Synthetic', last_name: 'Farmer ' + suffix,
      rsbsa_registration_status: registered ? 'REGISTERED' : 'NOT_REGISTERED',
      rsbsa_no: registered ? 'rsbsa_' + n : '',
      rsbsa_capture_method: registered ? 'MANUAL' : 'NOT_APPLICABLE',
      rsbsa_info_confirmed: registered,
      sex: n % 2 ? 'FEMALE' : 'MALE', marital_status_code: n % 4 ? 'MARRIED' : 'SINGLE',
      email: 'demo-farmer-' + suffix + '@example.invalid', association_name: 'Fictional growers group',
      residence_province_code: location.province[0],
      residence_lgu_code: location.lgu[0], residence_barangay_code: barangay[0],
      residence_sitio_purok_zone: 'Demo Purok ' + (n % 5 + 1),
      record_status: 'ACTIVE', created_from_submission_id: 'DEMO-S-2026-' + suffix,
      created_at: now, created_by: getActorEmail_(), updated_at: now, updated_by: getActorEmail_()
    });
    rows.Farms.push({
      farm_id: farmId, farmer_id: farmerId, submission_id: 'DEMO-S-2026-' + suffix,
      farm_name_local_id: 'Synthetic farm ' + suffix, province_code: location.province[0],
      lgu_code: location.lgu[0], barangay_code: barangay[0],
      farm_address: barangay[1] + ', ' + location.lgu[1] + ', ' + location.province[1],
      tenure_code: ['OWNED', 'FAMILY_OWNED', 'LEASED_RENTED', 'TENANTED'][n % 4],
      topography_code: n % 4 ? 'HILLY' : 'SEMI_ROLLING', road_distance_km: 0.5 + n % 8,
      total_farm_area_ha: 0.4 + (n % 7) * 0.2, record_status: 'ACTIVE', remarks: 'Fictional TEST farm',
      created_at: now, updated_at: now
    });
    rows.Farm_Water_Sources.push({ farm_water_source_id: 'DEMO-W-2026-' + suffix, farm_id: farmId,
      submission_id: 'DEMO-S-2026-' + suffix, water_source_code: ['SPRING', 'RIVER', 'SHALLOW_WELL'][n % 3],
      is_primary: true, created_at: now, updated_at: now });
    rows.Plantings.push({ planting_id: 'DEMO-T-2026-' + suffix, farm_id: farmId,
      submission_id: 'DEMO-S-2026-' + suffix, commodity_code: commodity,
      variety_code: commodity === 'COFFEE' ? (n % 5 ? 'COFFEE_ROBUSTA' : 'COFFEE_NATIVE') : (n % 2 ? 'CACAO_BR25' : 'CACAO_UF18'),
      year_planted: 2014 + n % 10, record_status: 'ACTIVE', created_at: now, updated_at: now });
    rows.Facilities.push({ facility_id: 'DEMO-X-2026-' + suffix, farmer_id: farmerId,
      submission_id: 'DEMO-S-2026-' + suffix, description: n % 2 ? 'Drying rack' : 'Storage shed',
      quantity: 1, condition_status: 'Good', utilization_status: 'FULLY_UTILIZED', created_at: now, updated_at: now });
    rows.Interventions.push({ intervention_id: 'DEMO-I-2026-' + suffix, farmer_id: farmerId,
      submission_id: 'DEMO-S-2026-' + suffix, intervention_type_code: n % 2 ? 'TRAINING' : 'PLANTING_MATERIALS',
      provider: 'Synthetic demo provider', year_received: 2025, created_at: now, updated_at: now });
    [2025, 2026].forEach(function(year) {
      const submissionId = 'DEMO-S-' + year + '-' + suffix;
      const roundId = 'DEMO-R-' + year + '-' + suffix;
      const area = 0.25 + (n % 6) * 0.15 + (year === 2026 ? 0.08 : 0);
      const volume = (commodity === 'CACAO' ? 65 : 120) + n * (year === 2026 ? 9 : 6);
      rows.Submissions.push({
        submission_id: submissionId, farmer_id: farmerId, submission_type: 'ANNUAL_PROFILE',
        reference_year: year, status: 'APPROVED', payload_json: '{}',
        classification: 'NEW_ENTRY', submitted_at: now, validated_at: now,
        validated_by: getActorEmail_(), created_at: now, updated_at: now
      });
      rows.Profiling_Rounds.push({
        profiling_round_id: roundId, farmer_id: farmerId, farm_id: farmId,
        submission_id: submissionId, reference_year: year, profiling_type: 'ANNUAL_PROFILE',
        profiling_date: now, status: 'APPROVED', created_at: now, updated_at: now
      });
      rows.Planting_Observations.push({
        observation_id: 'DEMO-O-' + year + '-' + suffix, profiling_round_id: roundId,
        farm_id: farmId, commodity_code: commodity, area_planted_ha: area,
        trees_newly_planted: n % 9, trees_non_bearing: 12 + n % 20,
        trees_bearing: 35 + n * 4 + (year === 2026 ? 8 : 0), mortality_count: n % 4, updated_at: now
      });
      rows.Production.push({
        production_id: 'DEMO-P-' + year + '-' + suffix, profiling_round_id: roundId,
        farm_id: farmId, commodity_code: commodity, submission_id: submissionId,
        production_year: year, harvest_date: new Date(year, 7, 15), production_volume_kg: volume,
        selling_price_per_kg: commodity === 'COFFEE' ? 120 + n % 20 : 140 + n % 25,
        remarks: 'Fictional TEST production', created_at: now, updated_at: now
      });
    });
    rows.Intervention_Needs.push({
      need_id: 'DEMO-N-2026-' + suffix, farmer_id: farmerId,
      submission_id: 'DEMO-S-2026-' + suffix,
      intervention_type_code: n % 3 === 0 ? 'PLANTING_MATERIALS' : (n % 2 === 0 ? 'FERTILIZER' : 'TRAINING'),
      priority: n % 3 ? 'MEDIUM' : 'HIGH', details: 'Fictional demo need',
      created_at: now, updated_at: now
    });
  }

  const added = {};
  const keys = {
    Farmers: 'farmer_id', Farms: 'farm_id', Submissions: 'submission_id',
    Profiling_Rounds: 'profiling_round_id', Planting_Observations: 'observation_id',
    Production: 'production_id', Intervention_Needs: 'need_id', Plantings: 'planting_id',
    Farm_Water_Sources: 'farm_water_source_id', Facilities: 'facility_id', Interventions: 'intervention_id'
  };
  Object.keys(rows).forEach(function(sheetName) {
    const key = keys[sheetName];
    const existingRows = getRowsAsObjects_(sheetName);
    const existing = new Set(existingRows.map(function(row) { return String(row[key]); }));
    const missing = rows[sheetName].filter(function(row) { return !existing.has(row[key]); });
    appendObjectRows_(sheetName, missing);
    added[sheetName] = missing.length;
    // Fill only blank fields on our deterministic demo rows; retain any existing TEST edits.
    rows[sheetName].filter(function(row) { return existing.has(row[key]); }).forEach(function(desired) {
      const current = existingRows.find(function(row) { return String(row[key]) === String(desired[key]); });
      const patch = {};
      Object.keys(desired).forEach(function(field) {
        if (field === key || field.indexOf('rsbsa_') === 0) return;
        if ((current[field] === '' || current[field] == null) && desired[field] !== '') patch[field] = desired[field];
      });
      if (Object.keys(patch).length) patchObjectRowByField_(sheetName, key, desired[key], patch);
    });
  });
  const existingFarmers = getRowsAsObjects_('Farmers');
  const rsbsaUpdates = rows.Farmers.filter(function(desired) {
    if (!desired.rsbsa_no) return false;
    const current = existingFarmers.find(function(row) { return row.farmer_id === desired.farmer_id; });
    if (current.rsbsa_registration_status === 'REGISTERED' && current.rsbsa_no === desired.rsbsa_no) return false;
    if (current.rsbsa_registration_status !== 'NOT_REGISTERED' || current.rsbsa_no) {
      throw new Error('Demo farmer has a different RSBSA value: ' + desired.farmer_id);
    }
    if (existingFarmers.some(function(row) { return row.farmer_id !== desired.farmer_id &&
      normalizeRsbsaNo_(row.rsbsa_no) === normalizeRsbsaNo_(desired.rsbsa_no); })) {
      throw new Error('Demo RSBSA label already belongs to another farmer: ' + desired.rsbsa_no);
    }
    return true;
  });
  rsbsaUpdates.forEach(function(desired) {
    patchObjectRowByField_('Farmers', 'farmer_id', desired.farmer_id, {
      rsbsa_registration_status: desired.rsbsa_registration_status,
      rsbsa_no: desired.rsbsa_no,
      rsbsa_capture_method: desired.rsbsa_capture_method,
      rsbsa_info_confirmed: desired.rsbsa_info_confirmed,
      updated_at: now
    });
  });
  added.rsbsaUpdated = rsbsaUpdates.length;
  writeAudit_('SEED_TEST_DEMO', 'TEST_DATA', 'DEMO-2026', { added: added });
  return added;
}
