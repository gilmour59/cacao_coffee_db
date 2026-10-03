function requireFields_(payload, fields) {
  const missing = fields.filter(function(field) {
    const value = payload ? payload[field] : undefined;
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length) {
    throw new Error('Missing required field(s): ' + missing.join(', '));
  }
}

function requireArray_(payload, fieldName, minItems) {
  const value = payload ? payload[fieldName] : null;
  if (!Array.isArray(value) || value.length < (minItems || 0)) {
    throw new Error(fieldName + ' must contain at least ' + (minItems || 0) + ' item(s).');
  }
  return value;
}

function requireOneOf_(value, allowed, fieldName) {
  const normalized = String(value || '').trim().toUpperCase();
  if (allowed.indexOf(normalized) === -1) {
    throw new Error((fieldName || 'Value') + ' is invalid.');
  }
  return normalized;
}

function requireNonNegativeNumber_(value, fieldName) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error((fieldName || 'Value') + ' must be a non-negative number.');
  }
  return number;
}

function requirePositiveYear_(value, fieldName) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    throw new Error((fieldName || 'Year') + ' is invalid.');
  }
  return year;
}

function normalizeRsbsaNo_(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, '');
}

function normalizeNamePart_(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');
}

function normalizePhone_(value) {
  return String(value || '').replace(/\D/g, '');
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

  return { latitude: lat, longitude: lng };
}

function parseBoolean_(value) {
  if (value === true || value === false) return value;
  const normalized = String(value || '').trim().toUpperCase();
  return normalized === 'TRUE' || normalized === 'YES' || normalized === '1';
}

function cleanText_(value) {
  return String(value === undefined || value === null ? '' : value).trim();
}
