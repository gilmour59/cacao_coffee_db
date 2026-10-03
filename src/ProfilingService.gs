function materializeProfilingForFarmUnlocked_(farmerId, farm, farmPayload, submission, profilingType) {
  const round = {
    profiling_round_id: generateRecordIdUnlocked_('PFR'),
    farmer_id: farmerId,
    farm_id: farm.farm_id,
    submission_id: submission.submission_id,
    reference_year: requirePositiveYear_(submission.reference_year, 'reference_year'),
    profiling_type: profilingType,
    profiling_date: new Date(),
    status: 'APPROVED',
    created_at: new Date(),
    updated_at: new Date()
  };
  appendObjectRowUnlocked_('Profiling_Rounds', round);

  const crops = farmPayload.crops || [];
  crops.forEach(function(crop) {
    materializePlantingMasterRowsUnlocked_(farm.farm_id, crop, submission.submission_id);
    appendObjectRowUnlocked_('Planting_Observations', {
      observation_id: generateRecordIdUnlocked_('OBS'),
      profiling_round_id: round.profiling_round_id,
      farm_id: farm.farm_id,
      commodity_code: requireOneOf_(crop.commodity_code, ['COFFEE','CACAO'], 'commodity_code'),
      trees_newly_planted: requireNonNegativeNumber_(crop.trees_newly_planted || 0, 'trees_newly_planted'),
      trees_non_bearing: requireNonNegativeNumber_(crop.trees_non_bearing || 0, 'trees_non_bearing'),
      trees_bearing: requireNonNegativeNumber_(crop.trees_bearing || 0, 'trees_bearing'),
      mortality_count: requireNonNegativeNumber_(crop.mortality_count || 0, 'mortality_count'),
      area_planted_ha: requireNonNegativeNumber_(crop.area_planted_ha || 0, 'area_planted_ha'),
      updated_at: new Date()
    });

    materializeProductionUnlocked_(
      round.profiling_round_id,
      farm.farm_id,
      crop,
      submission
    );
  });

  return round;
}

function materializePlantingMasterRowsUnlocked_(farmId, crop, submissionId) {
  const commodity = requireOneOf_(crop.commodity_code, ['COFFEE','CACAO'], 'commodity_code');
  const plantings = crop.plantings || [];

  plantings.forEach(function(item) {
    requireFields_(item, ['variety_code','year_planted']);
    const varietyCode = String(item.variety_code || '').toUpperCase();
    const yearPlanted = requirePositiveYear_(item.year_planted, 'year_planted');

    const exists = findRowsByField_('Plantings', 'farm_id', farmId).some(function(row) {
      return String(row.commodity_code || '').toUpperCase() === commodity &&
        String(row.variety_code || '').toUpperCase() === varietyCode &&
        Number(row.year_planted || 0) === yearPlanted &&
        String(row.record_status || 'ACTIVE').toUpperCase() !== 'INACTIVE';
    });

    if (!exists) {
      appendObjectRowUnlocked_('Plantings', {
        planting_id: generateRecordIdUnlocked_('PLT'),
        farm_id: farmId,
        submission_id: submissionId,
        commodity_code: commodity,
        variety_code: varietyCode,
        year_planted: yearPlanted,
        remarks: cleanText_(item.remarks),
        record_status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      });
    }
  });
}

function getLatestApprovedProfilingRounds_(farmerId) {
  const rows = findRowsByField_('Profiling_Rounds', 'farmer_id', farmerId)
    .filter(function(row) {
      return String(row.status || '').toUpperCase() === 'APPROVED';
    });

  rows.sort(function(a, b) {
    const yearDiff = Number(b.reference_year || 0) - Number(a.reference_year || 0);
    if (yearDiff !== 0) return yearDiff;
    return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0);
  });
  return rows;
}
