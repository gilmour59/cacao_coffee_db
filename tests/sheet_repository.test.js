const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('row reader uses one value fetch and preserves headers and row numbers', () => {
  let reads = 0;
  const spreadsheet = { getSheetByName: () => ({ getDataRange: () => ({ getValues: () => {
    reads++;
    return [[' farmer_id ', 'record_status'], ['F1', 'ACTIVE'], ['F2', 'INACTIVE']];
  } }) }) };
  const context = { SpreadsheetApp: { openById: () => { throw new Error('Unexpected spreadsheet open'); } } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/SheetRepository.gs'), 'utf8'), context);
  const rows = context.getRowsAsObjects_('Farmers', spreadsheet);
  assert.equal(reads, 1);
  assert.equal(JSON.stringify(rows), JSON.stringify([
    { _rowNumber: 2, farmer_id: 'F1', record_status: 'ACTIVE' },
    { _rowNumber: 3, farmer_id: 'F2', record_status: 'INACTIVE' }
  ]));
});
