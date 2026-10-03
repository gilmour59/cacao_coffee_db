function createFarm() {
  throw new Error('Direct canonical farm creation is disabled. Use the submission workflow.');
}

function materializeFarmUnlocked_(farmerId, payload, submissionId) {
  requireFields_(payload, [
    'tenure_code','total_farm_area_ha','farm_address',
    'province_code','lgu_code','barangay_code',
    'latitude','longitude','location_capture_method',
    'topography_code','road_distance_km'
  ]);

  const coordinates = validateCoordinates_(payload.latitude, payload.longitude);
  const now = new Date();
  const farm = {
    farm_id: generateRecordIdUnlocked_('FRM'),
    farmer_id: farmerId,
    submission_id: submissionId,
    farm_name_local_id: cleanText_(payload.farm_name_local_id),
    tenure_code: String(payload.tenure_code || '').toUpperCase(),
    total_farm_area_ha: requireNonNegativeNumber_(payload.total_farm_area_ha, 'total_farm_area_ha'),
    farm_address: cleanText_(payload.farm_address),
    province_code: cleanText_(payload.province_code),
    lgu_code: cleanText_(payload.lgu_code),
    barangay_code: cleanText_(payload.barangay_code),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    location_capture_method: requireOneOf_(payload.location_capture_method, ['MAP_PIN','DEVICE_GPS'], 'location_capture_method'),
    topography_code: String(payload.topography_code || '').toUpperCase(),
    road_distance_km: requireNonNegativeNumber_(payload.road_distance_km, 'road_distance_km'),
    remarks: cleanText_(payload.remarks),
    record_status: 'ACTIVE',
    created_at: now,
    created_by: getActorEmail_(),
    updated_at: now,
    updated_by: getActorEmail_()
  };

  appendObjectRowUnlocked_('Farms', farm);
  materializeWaterSourcesUnlocked_(farm.farm_id, payload.water_sources || [], submissionId);
  return farm;
}

function resolveFarmForProfileUnlocked_(farmerId, payload, submissionId) {
  if (payload.farm_id) {
    const existing = findById_('Farms', 'farm_id', payload.farm_id);
    if (!existing || String(existing.farmer_id) !== String(farmerId)) {
      throw new Error('Farm does not belong to the selected farmer.');
    }
    return existing;
  }
  return materializeFarmUnlocked_(farmerId, payload, submissionId);
}

function materializeWaterSourcesUnlocked_(farmId, waterSources, submissionId) {
  (waterSources || []).forEach(function(source) {
    const code = requireOneOf_(source.water_source_code, ['SHALLOW_WELL','SPRING','RIVER'], 'water_source_code');
    appendObjectRowUnlocked_('Farm_Water_Sources', {
      farm_water_source_id: generateRecordIdUnlocked_('FWS'),
      farm_id: farmId,
      submission_id: submissionId,
      water_source_code: code,
      is_primary: parseBoolean_(source.is_primary),
      remarks: cleanText_(source.remarks),
      created_at: new Date(),
      updated_at: new Date()
    });
  });
}
