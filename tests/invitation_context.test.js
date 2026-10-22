const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('secure link returns only the invited farm and its latest approved profile details', () => {
  const rows = {
    Farm_Water_Sources: [
      { farm_id: 'A', submission_id: 'S25', water_source_code: 'RIVER', is_primary: true },
      { farm_id: 'A', submission_id: 'S26', water_source_code: 'SPRING', is_primary: true },
      { farm_id: 'B', submission_id: 'S26B', water_source_code: 'SHALLOW_WELL', is_primary: true }
    ],
    Plantings: [{ farm_id: 'A', commodity_code: 'COFFEE', variety_code: 'COFFEE_ROBUSTA', year_planted: 2020, record_status: 'ACTIVE' }],
    Planting_Observations: [
      { farm_id: 'A', profiling_round_id: 'R25', commodity_code: 'COFFEE', trees_bearing: 12, area_planted_ha: .2 },
      { farm_id: 'A', profiling_round_id: 'R26', commodity_code: 'COFFEE', trees_bearing: 20, area_planted_ha: .3 }
    ],
    Production: [{ farm_id: 'A', profiling_round_id: 'R26', commodity_code: 'COFFEE', harvest_date: new Date('2026-08-15T00:00:00+08:00'), production_year: 2026, production_volume_kg: 100, selling_price_per_kg: 120 }],
    Facilities: [{ farmer_id: 'F', submission_id: 'S26', description: 'Drying rack', quantity: 1, utilization_status: 'FULLY_UTILIZED' }]
  };
  const context = {
    findById_: () => ({ farmer_id: 'F', first_name: 'Demo' }),
    findRowsByField_: () => [{ farm_id: 'A', farmer_id: 'F', record_status: 'ACTIVE' }, { farm_id: 'B', farmer_id: 'F', record_status: 'ACTIVE' }],
    getLatestApprovedProfilingRounds_: () => [
      { farm_id: 'A', profiling_round_id: 'R26', submission_id: 'S26', reference_year: 2026 },
      { farm_id: 'A', profiling_round_id: 'R25', submission_id: 'S25', reference_year: 2025 }
    ],
    getDatabase_: () => ({}),
    getRowsAsObjects_: name => rows[name] || [],
    parseBoolean_: value => value === true,
    Utilities: { formatDate: () => '2026-08-15' },
    Date
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/InvitationService.gs'), 'utf8'), context);
  context.resolveInvitationTokenReadOnly_ = () => ({ invitation_id: 'I', farmer_id: 'F', farm_id: 'A', reference_year: 2026, purpose: 'ANNUAL_PROFILE', status: 'ACTIVE' });
  context.touchInvitationOpened_ = () => {};
  const result = context.getInvitationContext('test-token');
  assert.equal(result.farms.length, 1);
  assert.equal(result.farms[0].farm_id, 'A');
  assert.equal(result.farms[0].water_sources[0].water_source_code, 'SPRING');
  assert.equal(result.farms[0].crops[0].trees_bearing, 20);
  assert.equal(result.farms[0].crops[0].plantings[0].variety_code, 'COFFEE_ROBUSTA');
  assert.equal(result.farms[0].crops[0].production[0].harvest_date, '2026-08-15');
  assert.equal(result.facilities[0].description, 'Drying rack');
  assert.ok(!JSON.stringify(result).includes('SHALLOW_WELL'));

  context.resolveInvitationTokenReadOnly_ = () => ({ invitation_id: 'I', farmer_id: 'F', farm_id: 'A', reference_year: 2027, purpose: 'ANNUAL_PROFILE', status: 'ACTIVE' });
  assert.equal(context.getInvitationContext('test-token').farms[0].crops[0].production.length, 0);
});
