const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function contextFor(environment) {
  const rows = {
    Ref_LGUs: [{ lgu_code: '0603037000', province_code: '0603000000', is_active: true }],
    Ref_Barangays: [{ barangay_code: 'B1', lgu_code: '0603037000', is_active: true }]
  };
  const context = {
    requireBootstrapAdmin_: () => {},
    getAppConfig_: () => ({ environment }),
    getRowsAsObjects_: name => rows[name] || [],
    appendObjectRows_: (name, added) => { rows[name] = (rows[name] || []).concat(added); },
    patchObjectRowByField_: (name, field, value, patch) => {
      const row = rows[name].find(item => item[field] === value);
      Object.assign(row, patch);
      return row;
    },
    normalizeRsbsaNo_: value => String(value || '').trim().toUpperCase(),
    writeAudit_: () => {},
    getActorEmail_: () => 'admin@example.com',
    Date, String, Number, Object, Set
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/DemoSeed.gs'), 'utf8'), context);
  return { context, rows };
}

test('synthetic TEST seed is coherent and safe to rerun', () => {
  const { context, rows } = contextFor('TEST');
  const first = context.seedTestDemoData();
  assert.equal(first.Farmers, 120);
  assert.equal(first.Profiling_Rounds, 240);
  assert.equal(first.Production, 240);
  assert.equal(first.rsbsaUpdated, 0);
  assert.deepEqual(rows.Farmers.slice(0, 12).map(row => row.rsbsa_no),
    Array.from({ length: 12 }, (_, i) => `rsbsa_${i + 1}`));
  assert.ok(rows.Farmers.slice(0, 12).every(row => row.rsbsa_registration_status === 'REGISTERED'));
  assert.ok(rows.Farmers.slice(12, 24).every(row => row.rsbsa_registration_status === 'NOT_REGISTERED'));
  assert.equal(context.seedTestDemoData().Farmers, 0);
  assert.equal(rows.Farmers.length, 120);
  assert.equal(rows.Ref_Provinces.length, 5);
  rows.Farms[0].tenure_code = '';
  rows.Farms[0].remarks = 'Presenter edit';
  context.seedTestDemoData();
  assert.ok(rows.Farms[0].tenure_code);
  assert.equal(rows.Farms[0].remarks, 'Presenter edit');
  assert.equal(new Set(rows.Farms.map(row => row.province_code)).size, 5);
  assert.equal(new Set(rows.Farms.map(row => row.lgu_code)).size, 11);
  assert.equal(new Set(rows.Ref_Provinces.map(row => row.province_code)).size, 5);
  assert.ok(rows.Farms.every(row => row.topography_code && row.tenure_code));
  assert.ok(rows.Plantings.every(row => row.variety_code));
  assert.ok(rows.Farms.every(row => rows.Farmers.some(f => f.farmer_id === row.farmer_id)));
  assert.ok(rows.Production.every(row => rows.Profiling_Rounds.some(r => r.profiling_round_id === row.profiling_round_id)));

  rows.Farmers.slice(0, 12).forEach(row => {
    row.rsbsa_registration_status = 'NOT_REGISTERED';
    row.rsbsa_no = '';
  });
  assert.equal(context.seedTestDemoData().rsbsaUpdated, 12);
  assert.equal(context.seedTestDemoData().rsbsaUpdated, 0);
});

test('synthetic seed cannot run against PROD', () => {
  assert.throws(() => contextFor('PROD').context.seedTestDemoData(), /only be seeded in TEST/);
});
