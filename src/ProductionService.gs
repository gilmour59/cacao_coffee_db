function materializeProductionUnlocked_(profilingRoundId, farmId, crop, submission) {
  const commodity = requireOneOf_(crop.commodity_code, ['COFFEE','CACAO'], 'commodity_code');
  (crop.production || []).forEach(function(item) {
    appendObjectRowUnlocked_('Production', {
      production_id: generateRecordIdUnlocked_('PRD'),
      profiling_round_id: profilingRoundId,
      farm_id: farmId,
      commodity_code: commodity,
      submission_id: submission.submission_id,
      harvest_date: item.harvest_date || '',
      production_year: requirePositiveYear_(item.production_year || submission.reference_year, 'production_year'),
      production_volume_kg: requireNonNegativeNumber_(item.production_volume_kg || 0, 'production_volume_kg'),
      selling_price_per_kg: item.selling_price_per_kg === '' || item.selling_price_per_kg === undefined
        ? ''
        : requireNonNegativeNumber_(item.selling_price_per_kg, 'selling_price_per_kg'),
      remarks: cleanText_(item.remarks),
      created_at: new Date(),
      updated_at: new Date()
    });
  });
}
