const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function dashboardContext(authorized = true) {
  const rows = {
    Farmers: [
      { farmer_id: 'F1', record_status: 'ACTIVE', residence_province_code: '603000000', residence_lgu_code: '603037000', rsbsa_registration_status: 'REGISTERED' },
      { farmer_id: 'F2', record_status: 'ACTIVE', residence_province_code: '999', residence_lgu_code: '999', rsbsa_registration_status: 'REGISTERED' }
    ],
    Farms: [
      { farm_id: 'A', farmer_id: 'F1', record_status: 'ACTIVE', province_code: '603000000', lgu_code: '603037000', barangay_code: 'B1' },
      { farm_id: 'B', farmer_id: 'F2', record_status: 'ACTIVE', province_code: '999', lgu_code: '999', barangay_code: 'B2' }
    ],
    Profiling_Rounds: [
      { profiling_round_id: 'R0', farm_id: 'A', farmer_id: 'F1', reference_year: 2025, status: 'APPROVED', submission_id: 'S0', updated_at: '2025-01-01', _rowNumber: 2 },
      { profiling_round_id: 'R1', farm_id: 'A', farmer_id: 'F1', reference_year: 2026, status: 'APPROVED', submission_id: 'S1', updated_at: '2026-01-01', _rowNumber: 3 },
      { profiling_round_id: 'R2', farm_id: 'A', farmer_id: 'F1', reference_year: 2026, status: 'APPROVED', submission_id: 'S2', updated_at: '2026-02-01', _rowNumber: 4 },
      { profiling_round_id: 'RO', farm_id: 'B', farmer_id: 'F2', reference_year: 2026, status: 'APPROVED', submission_id: 'SO', updated_at: '2026-03-01', _rowNumber: 5 }
    ],
    Planting_Observations: [
      { profiling_round_id: 'R1', commodity_code: 'COFFEE', area_planted_ha: .6, trees_bearing: 40 },
      { profiling_round_id: 'R2', commodity_code: 'COFFEE', area_planted_ha: .8, trees_bearing: 60 },
      { profiling_round_id: 'RO', commodity_code: 'CACAO', area_planted_ha: 9, trees_bearing: 900 }
    ],
    Production: [
      { profiling_round_id: 'R0', commodity_code: 'COFFEE', production_volume_kg: 50 },
      { profiling_round_id: 'R1', commodity_code: 'COFFEE', production_volume_kg: 100 },
      { profiling_round_id: 'R2', commodity_code: 'COFFEE', production_volume_kg: 120 },
      { profiling_round_id: 'RO', commodity_code: 'CACAO', production_volume_kg: 900 }
    ],
    Ref_Barangays: [{ barangay_code: 'B1', barangay_name: 'Demo Barangay' }],
    Intervention_Needs: [{ submission_id: 'S2', intervention_type_code: 'TRAINING' }],
    Ref_Intervention_Types: [{ intervention_type_code: 'TRAINING', intervention_type_name: 'Training' }],
    Submissions: [
      { status: 'PENDING', payload: { farmer: { residence_province_code: '603000000', residence_lgu_code: '603037000' } } },
      { status: 'PENDING', payload: { farmer: { residence_province_code: '999', residence_lgu_code: '999' } } },
      { status: 'APPROVED', payload: {} }
    ]
  };
  const context = {
    STAFF_ROLES: { ADMIN: 'ADMIN', VALIDATOR: 'VALIDATOR', ENCODER: 'ENCODER' },
    requireStaffRole_: () => {
      if (!authorized) throw new Error('Authorized staff access is required.');
      return { province_code: '603000000', lgu_code: '603037000' };
    },
    getRowsAsObjects_: name => rows[name],
    assertStaffGeographicScope_: (staff, province, lgu) => {
      if (province !== staff.province_code || lgu !== staff.lgu_code) throw new Error('Outside scope');
    },
    assertSubmissionScopeForStaff_: (staff, _row, payload) => {
      context.assertStaffGeographicScope_(staff, payload.farmer.residence_province_code, payload.farmer.residence_lgu_code);
    },
    parseSubmissionPayload_: row => row.payload,
    Date, Number, Set, Object, Array
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/DashboardService.gs'), 'utf8'), context);
  return context;
}

test('dashboard counts latest approved scoped records and keeps pending separate', () => {
  const data = dashboardContext().getDashboardData(2026);
  assert.equal(data.farmerCount, 1);
  assert.equal(data.areaHa, .8);
  assert.equal(data.bearingTrees, 60);
  assert.equal(data.productionKg, 120);
  assert.equal(data.pendingCount, 1);
  assert.equal(data.rsbsaRegisteredCount, 1);
  assert.equal(data.needs[0].farmerCount, 1);
  assert.equal(data.trend.find(row => row.year === 2025).productionKg, 50);
  assert.ok(!JSON.stringify(data).includes('F1'));
});

test('dashboard rejects unauthorized callers and invalid years', () => {
  assert.throws(() => dashboardContext(false).getDashboardData(2026), /Authorized staff/);
  assert.throws(() => dashboardContext().getDashboardData('bad'), /valid reference year/);
});
