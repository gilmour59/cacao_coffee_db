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

function compactRsbsaNo_(value) {
  return normalizeRsbsaNo_(value).replace(/[^A-Z0-9]/g, '');
}

function isAdjacentTransposition_(a, b) {
  if (!a || !b || a.length !== b.length || a === b) return false;

  const differences = [];
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) differences.push(i);
    if (differences.length > 2) return false;
  }

  if (differences.length !== 2) return false;
  const first = differences[0];
  const second = differences[1];

  return second === first + 1 &&
    a[first] === b[second] &&
    a[second] === b[first];
}

function levenshteinDistanceAtMost_(a, b, maxDistance) {
  const left = String(a || '');
  const right = String(b || '');
  const max = Number(maxDistance || 0);

  if (Math.abs(left.length - right.length) > max) return max + 1;
  if (left === right) return 0;

  let previous = Array.from({ length: right.length + 1 }, function(_, index) {
    return index;
  });

  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    let rowMin = current[0];

    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      const value = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
      current[j] = value;
      if (value < rowMin) rowMin = value;
    }

    if (rowMin > max) return max + 1;
    previous = current;
  }

  return previous[right.length];
}

function getRsbsaNearMatchReason_(submitted, existing) {
  const left = compactRsbsaNo_(submitted);
  const right = compactRsbsaNo_(existing);

  if (!left || !right || left === right) return '';
  if (left.length < 8 || right.length < 8) return '';
  if (Math.abs(left.length - right.length) > 1) return '';

  if (isAdjacentTransposition_(left, right)) {
    return 'Possible RSBSA typo: adjacent digits/characters appear transposed';
  }

  const distance = levenshteinDistanceAtMost_(left, right, 1);
  if (distance === 1) {
    return 'Possible RSBSA typo: number differs by one character';
  }

  return '';
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
