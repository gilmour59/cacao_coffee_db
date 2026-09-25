function requireFields_(payload, fields) {
  const missing = fields.filter(function(field) {
    const value = payload[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length) {
    throw new Error('Missing required field(s): ' + missing.join(', '));
  }
}

function normalizeRsbsaNo_(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, '');
}

function validateCoordinates_(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude.');
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw new Error('Invalid longitude.');
  }
}
