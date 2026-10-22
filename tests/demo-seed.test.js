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
  assert.equal(first.Farmers, 24);
  assert.equal(first.Profiling_Rounds, 48);
  assert.equal(first.Production, 48);
  assert.equal(context.seedTestDemoData().Farmers, 0);
  assert.equal(rows.Farmers.length, 24);
  assert.ok(rows.Farms.every(row => rows.Farmers.some(f => f.farmer_id === row.farmer_id)));
  assert.ok(rows.Production.every(row => rows.Profiling_Rounds.some(r => r.profiling_round_id === row.profiling_round_id)));
});

test('synthetic seed cannot run against PROD', () => {
  assert.throws(() => contextFor('PROD').context.seedTestDemoData(), /only be seeded in TEST/);
});
