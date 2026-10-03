function getDatabase_() {
  return SpreadsheetApp.openById(getAppConfig_().spreadsheetId);
}

function getSheetOrThrow_(sheetName) {
  const sheet = getDatabase_().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Missing required sheet: ' + sheetName);
  }
  return sheet;
}

function getHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < 1) return [];
  return sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
    .map(function(header) { return String(header || '').trim(); });
}

function getRowsAsObjects_(sheetName) {
  const sheet = getSheetOrThrow_(sheetName);
  const headers = getHeaders_(sheet);
  const lastRow = sheet.getLastRow();

  if (headers.length === 0 || lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  return values.map(function(row, rowIndex) {
    const obj = { _rowNumber: rowIndex + 2 };
    headers.forEach(function(header, index) {
      if (header) obj[header] = row[index];
    });
    return obj;
  });
}

function rowFromObject_(headers, data) {
  return headers.map(function(header) {
    const value = data[header];
    return value === undefined || value === null ? '' : value;
  });
}

function appendObjectRow_(sheetName, data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return appendObjectRowUnlocked_(sheetName, data);
  } finally {
    lock.releaseLock();
  }
}

function appendObjectRowUnlocked_(sheetName, data) {
  const sheet = getSheetOrThrow_(sheetName);
  const headers = getHeaders_(sheet);
  if (headers.length === 0) {
    throw new Error('Sheet has no header row: ' + sheetName);
  }

  sheet.appendRow(rowFromObject_(headers, data));
  return data;
}

function appendObjectRows_(sheetName, rows) {
  if (!rows || !rows.length) return [];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheetOrThrow_(sheetName);
    const headers = getHeaders_(sheet);
    if (headers.length === 0) {
      throw new Error('Sheet has no header row: ' + sheetName);
    }

    const matrix = rows.map(function(row) {
      return rowFromObject_(headers, row);
    });

    sheet.getRange(sheet.getLastRow() + 1, 1, matrix.length, headers.length).setValues(matrix);
    return rows;
  } finally {
    lock.releaseLock();
  }
}

function normalizeLookup_(value) {
  return String(value === undefined || value === null ? '' : value).trim().toUpperCase();
}

function findFirstByField_(sheetName, fieldName, expectedValue) {
  const normalizedExpected = normalizeLookup_(expectedValue);
  if (!normalizedExpected) return null;

  const rows = getRowsAsObjects_(sheetName);
  return rows.find(function(row) {
    return normalizeLookup_(row[fieldName]) === normalizedExpected;
  }) || null;
}

function findRowsByField_(sheetName, fieldName, expectedValue) {
  const normalizedExpected = normalizeLookup_(expectedValue);
  return getRowsAsObjects_(sheetName).filter(function(row) {
    return normalizeLookup_(row[fieldName]) === normalizedExpected;
  });
}

function findById_(sheetName, idField, idValue) {
  return findFirstByField_(sheetName, idField, idValue);
}

function patchObjectRowByField_(sheetName, fieldName, expectedValue, patch) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheetOrThrow_(sheetName);
    const headers = getHeaders_(sheet);
    const target = findFirstByField_(sheetName, fieldName, expectedValue);
    if (!target) return null;

    const updated = {};
    headers.forEach(function(header) {
      updated[header] = Object.prototype.hasOwnProperty.call(patch, header)
        ? patch[header]
        : target[header];
    });

    sheet.getRange(target._rowNumber, 1, 1, headers.length)
      .setValues([rowFromObject_(headers, updated)]);

    updated._rowNumber = target._rowNumber;
    return updated;
  } finally {
    lock.releaseLock();
  }
}

function withScriptLock_(callback, timeoutMs) {
  const lock = LockService.getScriptLock();
  lock.waitLock(timeoutMs || 15000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}
