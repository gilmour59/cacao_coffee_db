// Run manually from the TEST Apps Script editor. Deterministic IDs make reruns safe after partial writes.
function seedTestDemoData() {
  requireBootstrapAdmin_();
  if (getAppConfig_().environment !== 'TEST') throw new Error('Demo data can only be seeded in TEST.');

  const lgu = getRowsAsObjects_('Ref_LGUs').find(function(row) {
    return String(row.lgu_code).padStart(10, '0') === '0603037000' && String(row.is_active).toUpperCase() !== 'FALSE';
  });
  const barangays = getRowsAsObjects_('Ref_Barangays').filter(function(row) {
    return String(row.lgu_code).padStart(10, '0') === '0603037000' && String(row.is_active).toUpperCase() !== 'FALSE';
  });
  if (!lgu || !barangays.length) throw new Error('Pototan TEST location references are missing.');

  const rows = {
    Farmers: [], Farms: [], Submissions: [], Profiling_Rounds: [],
    Planting_Observations: [], Production: [], Intervention_Needs: []
  };
  const now = new Date();
  for (let n = 1; n <= 24; n++) {
    const suffix = String(n).padStart(3, '0');
    const farmerId = 'DEMO-F-2026-' + suffix;
    const farmId = 'DEMO-A-2026-' + suffix;
    const barangay = barangays[(n - 1) % barangays.length];
    const commodity = n % 3 === 0 ? 'CACAO' : 'COFFEE';
    rows.Farmers.push({
      farmer_id: farmerId, first_name: 'Synthetic', last_name: 'Farmer ' + suffix,
      rsbsa_registration_status: 'NOT_REGISTERED', residence_province_code: lgu.province_code,
      residence_lgu_code: lgu.lgu_code, residence_barangay_code: barangay.barangay_code,
      record_status: 'ACTIVE', created_from_submission_id: 'DEMO-S-2026-' + suffix,
      created_at: now, updated_at: now
    });
    rows.Farms.push({
      farm_id: farmId, farmer_id: farmerId, submission_id: 'DEMO-S-2026-' + suffix,
      farm_name_local_id: 'Synthetic farm ' + suffix, province_code: lgu.province_code,
      lgu_code: lgu.lgu_code, barangay_code: barangay.barangay_code,
      total_farm_area_ha: 0.4 + (n % 7) * 0.2, record_status: 'ACTIVE',
      created_at: now, updated_at: now
    });
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
        trees_bearing: 35 + n * 4 + (year === 2026 ? 8 : 0), updated_at: now
      });
      rows.Production.push({
        production_id: 'DEMO-P-' + year + '-' + suffix, profiling_round_id: roundId,
        farm_id: farmId, commodity_code: commodity, submission_id: submissionId,
        production_year: year, production_volume_kg: volume, created_at: now, updated_at: now
      });
    });
    rows.Intervention_Needs.push({
      need_id: 'DEMO-N-2026-' + suffix, farmer_id: farmerId,
      submission_id: 'DEMO-S-2026-' + suffix,
      intervention_type_code: n % 3 === 0 ? 'PLANTING_MATERIALS' : (n % 2 === 0 ? 'FERTILIZER' : 'TRAINING'),
      created_at: now, updated_at: now
    });
  }

  const added = {};
  const keys = {
    Farmers: 'farmer_id', Farms: 'farm_id', Submissions: 'submission_id',
    Profiling_Rounds: 'profiling_round_id', Planting_Observations: 'observation_id',
    Production: 'production_id', Intervention_Needs: 'need_id'
  };
  Object.keys(rows).forEach(function(sheetName) {
    const key = keys[sheetName];
    const existing = new Set(getRowsAsObjects_(sheetName).map(function(row) { return String(row[key]); }));
    const missing = rows[sheetName].filter(function(row) { return !existing.has(row[key]); });
    appendObjectRows_(sheetName, missing);
    added[sheetName] = missing.length;
  });
  writeAudit_('SEED_TEST_DEMO', 'TEST_DATA', 'DEMO-2026', { added: added });
  return added;
}
