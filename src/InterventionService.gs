function materializeFarmerSupportDataUnlocked_(farmerId, payload, submissionId) {
  materializeFacilitiesUnlocked_(farmerId, payload.facilities || [], submissionId);
  materializeInterventionsUnlocked_(farmerId, payload.interventions_received || [], submissionId);
  materializeInterventionNeedsUnlocked_(farmerId, payload.intervention_needs || [], submissionId);
}

function materializeFacilitiesUnlocked_(farmerId, facilities, submissionId) {
  facilities.forEach(function(item) {
    if (parseBoolean_(item.none)) return;
    requireFields_(item, ['description']);

    appendObjectRowUnlocked_('Facilities', {
      facility_id: generateRecordIdUnlocked_('FAC'),
      farmer_id: farmerId,
      submission_id: submissionId,
      description: cleanText_(item.description),
      quantity: item.quantity === '' || item.quantity === undefined ? '' : requireNonNegativeNumber_(item.quantity, 'quantity'),
      capacity: cleanText_(item.capacity),
      model_description: cleanText_(item.model_description),
      condition_status: cleanText_(item.condition_status),
      utilization_status: item.utilization_status
        ? requireOneOf_(item.utilization_status, ['FULLY_UTILIZED','PARTIALLY_UTILIZED','NOT_UTILIZED'], 'utilization_status')
        : '',
      remarks: cleanText_(item.remarks),
      created_at: new Date(),
      updated_at: new Date()
    });
  });
}

function materializeInterventionsUnlocked_(farmerId, interventions, submissionId) {
  interventions.forEach(function(item) {
    appendObjectRowUnlocked_('Interventions', {
      intervention_id: generateRecordIdUnlocked_('INT'),
      farmer_id: farmerId,
      submission_id: submissionId,
      intervention_type_code: requireOneOf_(item.intervention_type_code, ['TRAINING','PLANTING_MATERIALS','FERTILIZER'], 'intervention_type_code'),
      provider: cleanText_(item.provider),
      year_received: item.year_received ? requirePositiveYear_(item.year_received, 'year_received') : '',
      details: cleanText_(item.details),
      remarks: cleanText_(item.remarks),
      created_at: new Date(),
      updated_at: new Date()
    });
  });
}

function materializeInterventionNeedsUnlocked_(farmerId, needs, submissionId) {
  needs.forEach(function(item) {
    appendObjectRowUnlocked_('Intervention_Needs', {
      need_id: generateRecordIdUnlocked_('NED'),
      farmer_id: farmerId,
      submission_id: submissionId,
      intervention_type_code: requireOneOf_(item.intervention_type_code, ['TRAINING','PLANTING_MATERIALS','FERTILIZER'], 'intervention_type_code'),
      priority: requireOneOf_(item.priority, ['LOW','MEDIUM','HIGH'], 'priority'),
      details: cleanText_(item.details),
      remarks: cleanText_(item.remarks),
      created_at: new Date(),
      updated_at: new Date()
    });
  });
}
