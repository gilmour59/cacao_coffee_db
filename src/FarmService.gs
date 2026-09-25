function createFarm(payload) {
  requireFields_(payload, [
    'farmer_id',
    'farm_address',
    'province_code',
    'lgu_code',
    'barangay_code',
    'latitude',
    'longitude',
    'location_capture_method',
    'topography_code',
    'road_distance_km'
  ]);

  validateCoordinates_(payload.latitude, payload.longitude);

  const now = new Date();
  const farm = {
    farm_id: generateRecordId_('FRM'),
    farmer_id: payload.farmer_id,
    submission_id: payload.submission_id || '',
    farm_address: String(payload.farm_address || '').trim(),
    province_code: String(payload.province_code || '').trim(),
    lgu_code: String(payload.lgu_code || '').trim(),
    barangay_code: String(payload.barangay_code || '').trim(),
    latitude: Number(payload.latitude),
    longitude: Number(payload.longitude),
    location_capture_method: payload.location_capture_method,
    topography_code: payload.topography_code,
    road_distance_km: Number(payload.road_distance_km),
    remarks: String(payload.remarks || '').trim(),
    record_status: 'ACTIVE',
    created_at: now,
    created_by: getActorEmail_(),
    updated_at: now,
    updated_by: getActorEmail_()
  };

  appendObjectRow_('Farms', farm);

  return {
    ok: true,
    farm: farm
  };
}
