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
  return sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
}

function getRowsAsObjects_(sheetName) {
  const sheet = getSheetOrThrow_(sheetName);
  const headers = getHeaders_(sheet);
  const lastRow = sheet.getLastRow();

  if (headers.length === 0 || lastRow < 2) return [];

  const values = sheet
    .getRange(2, 1, lastRow - 1, headers.length)
    .getDisplayValues();

  return values.map(function(row) {
    const obj = {};
    headers.forEach(function(header, index) {
      obj[header] = row[index];
    });
    return obj;
  });
}

function appendObjectRow_(sheetName, data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheetOrThrow_(sheetName);
    const headers = getHeaders_(sheet);
    if (headers.length === 0) {
      throw new Error('Sheet has no header row: ' + sheetName);
    }

    const row = headers.map(function(header) {
      const value = data[header];
      return value === undefined || value === null ? '' : value;
    });

    sheet.appendRow(row);
    return data;
  } finally {
    lock.releaseLock();
  }
}

function findFirstByField_(sheetName, fieldName, expectedValue) {
  const normalizedExpected = String(expectedValue || '').trim().toUpperCase();
  if (!normalizedExpected) return null;

  const rows = getRowsAsObjects_(sheetName);
  return rows.find(function(row) {
    return String(row[fieldName] || '').trim().toUpperCase() === normalizedExpected;
  }) || null;
}
