function getDashboardData(referenceYear, geography) {
  const staff = requireStaffRole_([STAFF_ROLES.ADMIN, STAFF_ROLES.VALIDATOR, STAFF_ROLES.ENCODER]);
  const year = Number(referenceYear);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error('Select a valid reference year.');
  }
  geography = geography || {};
  if (typeof geography !== 'object' || Array.isArray(geography)) throw new Error('Invalid geography filter.');
  function code(value) { return value ? String(value).padStart(10, '0') : ''; }
  const province = code(geography.provinceCode);
  const lgu = code(geography.lguCode);
  const barangay = code(geography.barangayCode);
  if ([province, lgu, barangay].some(function(code) { return code && !/^\d{9,10}$/.test(code); })) {
    throw new Error('Invalid geography filter.');
  }
  const lgus = getRowsAsObjects_('Ref_LGUs').filter(function(row) {
    return String(row.is_active).toUpperCase() !== 'FALSE' && inScope(row.province_code, row.lgu_code);
  });
  const provinces = getRowsAsObjects_('Ref_Provinces').filter(function(row) {
    return String(row.is_active).toUpperCase() !== 'FALSE' && lgus.some(function(l) {
      return code(l.province_code) === code(row.province_code);
    });
  });
  const barangays = getRowsAsObjects_('Ref_Barangays').filter(function(row) {
    return String(row.is_active).toUpperCase() !== 'FALSE' && lgus.some(function(l) {
      return code(l.lgu_code) === code(row.lgu_code) && code(l.province_code) === code(row.province_code);
    });
  });
  if ((province && !provinces.some(function(row) { return code(row.province_code) === province; })) ||
      (lgu && !lgus.some(function(row) { return code(row.lgu_code) === lgu && (!province || code(row.province_code) === province); })) ||
      (barangay && !barangays.some(function(row) { return code(row.barangay_code) === barangay &&
        (!lgu || code(row.lgu_code) === lgu) && (!province || code(row.province_code) === province); }))) {
    throw new Error('Select a location within your authorized area.');
  }
  function matches(row) {
    return (!province || code(row.province_code) === province) &&
      (!lgu || code(row.lgu_code) === lgu) &&
      (!barangay || code(row.barangay_code) === barangay);
  }

  function inScope(provinceCode, lguCode) {
    try {
      assertStaffGeographicScope_({ province_code: code(staff.province_code), lgu_code: code(staff.lgu_code) }, code(provinceCode), code(lguCode));
      return true;
    } catch (error) {
      return false;
    }
  }

  const farmers = {};
  getRowsAsObjects_('Farmers').forEach(function(row) {
    if (String(row.record_status || '').toUpperCase() !== 'ACTIVE') return;
    farmers[row.farmer_id] = row;
  });

  const farms = {};
  getRowsAsObjects_('Farms').forEach(function(row) {
    if (String(row.record_status || '').toUpperCase() !== 'ACTIVE') return;
    if (!farmers[row.farmer_id] || !inScope(row.province_code, row.lgu_code) || !matches(row)) return;
    farms[row.farm_id] = row;
  });

  // Latest approved round is the current snapshot for a farm and year; earlier corrections must not double count.
  const latest = {};
  getRowsAsObjects_('Profiling_Rounds').forEach(function(row) {
    if (String(row.status || '').toUpperCase() !== 'APPROVED' || !farms[row.farm_id]) return;
    if (!farmers[row.farmer_id] || farms[row.farm_id].farmer_id !== row.farmer_id) return;
    const key = row.farm_id + ':' + row.reference_year;
    const prior = latest[key];
    const when = new Date(row.updated_at || row.created_at || 0).getTime() || 0;
    const priorWhen = prior ? (new Date(prior.updated_at || prior.created_at || 0).getTime() || 0) : -1;
    if (!prior || when > priorWhen || (when === priorWhen && row._rowNumber > prior._rowNumber)) latest[key] = row;
  });

  const allRounds = Object.keys(latest).map(function(key) { return latest[key]; });
  const selectedRounds = allRounds.filter(function(row) { return Number(row.reference_year) === year; });
  const roundById = {};
  allRounds.forEach(function(row) { roundById[row.profiling_round_id] = row; });
  const selectedIds = {};
  selectedRounds.forEach(function(row) { selectedIds[row.profiling_round_id] = true; });
  const selectedFarmerIds = {};
  selectedRounds.forEach(function(row) { selectedFarmerIds[row.farmer_id] = true; });
  const selectedFarmIds = {};
  selectedRounds.forEach(function(row) { selectedFarmIds[row.farm_id] = true; });
  function countsByCode(sheetName, codeField, selected) {
    const counts = {};
    getRowsAsObjects_(sheetName).forEach(function(row) {
      if (!selected(row)) return;
      const code = String(row[codeField] || 'UNKNOWN');
      counts[code] = (counts[code] || 0) + 1;
    });
    return counts;
  }
  function namedCounts(counts, referenceSheet, codeField, nameField) {
    const names = {};
    getRowsAsObjects_(referenceSheet).forEach(function(row) { names[row[codeField]] = row[nameField]; });
    return Object.keys(counts).map(function(code) { return { name: names[code] || code, count: counts[code] }; })
      .sort(function(a, b) { return b.count - a.count; });
  }
  const farmRows = Object.keys(selectedFarmIds).map(function(id) { return farms[id]; });
  const topographyCounts = {};
  const tenureCounts = {};
  farmRows.forEach(function(farm) {
    const topography = String(farm.topography_code || 'UNKNOWN');
    const tenure = String(farm.tenure_code || 'UNKNOWN');
    topographyCounts[topography] = (topographyCounts[topography] || 0) + 1;
    tenureCounts[tenure] = (tenureCounts[tenure] || 0) + 1;
  });
  const waterCounts = countsByCode('Farm_Water_Sources', 'water_source_code', function(row) {
    return selectedFarmIds[row.farm_id] && (row.is_primary === true || String(row.is_primary).toUpperCase() === 'TRUE');
  });
  const varietyFarms = {};
  getRowsAsObjects_('Plantings').forEach(function(row) {
    if (!selectedFarmIds[row.farm_id] || String(row.record_status).toUpperCase() !== 'ACTIVE') return;
    const code = String(row.variety_code || 'UNKNOWN');
    if (!varietyFarms[code]) varietyFarms[code] = {};
    varietyFarms[code][row.farm_id] = true;
  });
  const varietyCounts = {};
  Object.keys(varietyFarms).forEach(function(code) { varietyCounts[code] = Object.keys(varietyFarms[code]).length; });

  const commodities = {
    COFFEE: { code: 'COFFEE', areaHa: 0, bearingTrees: 0, productionKg: 0 },
    CACAO: { code: 'CACAO', areaHa: 0, bearingTrees: 0, productionKg: 0 }
  };
  getRowsAsObjects_('Planting_Observations').forEach(function(row) {
    if (!selectedIds[row.profiling_round_id]) return;
    const group = commodities[String(row.commodity_code || '').toUpperCase()];
    if (!group) return;
    group.areaHa += Number(row.area_planted_ha || 0);
    group.bearingTrees += Number(row.trees_bearing || 0);
  });

  const productionByYear = {};
  const productionByBarangay = {};
  getRowsAsObjects_('Production').forEach(function(row) {
    const round = roundById[row.profiling_round_id];
    if (!round) return;
    const group = commodities[String(row.commodity_code || '').toUpperCase()];
    if (!group) return;
    const volume = Number(row.production_volume_kg || 0);
    if (!Number.isFinite(volume) || volume < 0) return;
    const roundYear = Number(round.reference_year);
    productionByYear[roundYear] = (productionByYear[roundYear] || 0) + volume;
    if (!selectedIds[row.profiling_round_id]) return;
    group.productionKg += volume;
    const farm = farms[round.farm_id];
    const barangay = String(farm && farm.barangay_code || 'Unknown');
    productionByBarangay[barangay] = (productionByBarangay[barangay] || 0) + volume;
  });

  const barangayNames = {};
  barangays.forEach(function(row) {
    barangayNames[row.barangay_code] = row.barangay_name;
  });
  const needsByType = {};
  const selectedSubmissions = {};
  selectedRounds.forEach(function(row) { selectedSubmissions[row.submission_id] = row.farmer_id; });
  getRowsAsObjects_('Intervention_Needs').forEach(function(row) {
    const farmerId = selectedSubmissions[row.submission_id];
    if (!farmerId) return;
    const type = String(row.intervention_type_code || 'OTHER');
    if (!needsByType[type]) needsByType[type] = {};
    needsByType[type][farmerId] = true;
  });
  const needNames = {};
  getRowsAsObjects_('Ref_Intervention_Types').forEach(function(row) {
    needNames[row.intervention_type_code] = row.intervention_type_name;
  });

  const pendingCount = getRowsAsObjects_('Submissions').filter(function(row) {
    if (String(row.status || '').toUpperCase() !== 'PENDING') return false;
    try {
      const payload = parseSubmissionPayload_(row);
      if (!payload || typeof payload !== 'object') return false;
      if (row.farmer_id && !farmers[row.farmer_id]) return false;
      if (!row.farmer_id && !(payload.farmer || (payload.farms && payload.farms[0]))) return false;
      assertSubmissionScopeForStaff_(staff, row, payload);
      const farm = payload.farms && payload.farms[0];
      const location = farm || payload.farmer || {};
      if (!matches({ province_code: location.province_code || location.residence_province_code,
        lgu_code: location.lgu_code || location.residence_lgu_code,
        barangay_code: location.barangay_code || location.residence_barangay_code })) return false;
      return true;
    } catch (error) {
      return false;
    }
  }).length;
  const cropRows = Object.keys(commodities).map(function(key) { return commodities[key]; });
  return {
    year: year,
    geography: { provinceCode: province, lguCode: lgu, barangayCode: barangay },
    locations: {
      provinces: provinces.map(function(row) { return { code: code(row.province_code), name: row.province_name }; }),
      lgus: lgus.map(function(row) { return { code: code(row.lgu_code), provinceCode: code(row.province_code), name: row.lgu_name }; }),
      barangays: barangays.map(function(row) { return { code: code(row.barangay_code), lguCode: code(row.lgu_code), name: row.barangay_name }; })
    },
    years: Array.from(new Set(allRounds.map(function(row) { return Number(row.reference_year); })
      .filter(function(value) { return Number.isInteger(value) && value >= 2000 && value <= 2100; })
      .concat(year))).sort(),
    farmerCount: Object.keys(selectedFarmerIds).length,
    pendingCount: pendingCount,
    rsbsaRegisteredCount: Object.keys(selectedFarmerIds).filter(function(id) {
      return String(farmers[id].rsbsa_registration_status || '').toUpperCase() === 'REGISTERED';
    }).length,
    areaHa: cropRows.reduce(function(n, row) { return n + row.areaHa; }, 0),
    bearingTrees: cropRows.reduce(function(n, row) { return n + row.bearingTrees; }, 0),
    productionKg: cropRows.reduce(function(n, row) { return n + row.productionKg; }, 0),
    commodities: cropRows,
    trend: Object.keys(productionByYear).map(function(value) {
      return { year: Number(value), productionKg: productionByYear[value] };
    }).sort(function(a, b) { return a.year - b.year; }),
    barangays: Object.keys(productionByBarangay).map(function(code) {
      return { name: barangayNames[code] || code, productionKg: productionByBarangay[code] };
    }).sort(function(a, b) { return b.productionKg - a.productionKg; }).slice(0, 6),
    needs: Object.keys(needsByType).map(function(code) {
      return { name: needNames[code] || code, farmerCount: Object.keys(needsByType[code]).length };
    }).sort(function(a, b) { return b.farmerCount - a.farmerCount; }).slice(0, 5),
    topographies: namedCounts(topographyCounts, 'Ref_Topographies', 'topography_code', 'topography_name'),
    tenure: namedCounts(tenureCounts, 'Ref_Tenure', 'tenure_code', 'tenure_name'),
    waterSources: namedCounts(waterCounts, 'Ref_Water_Sources', 'water_source_code', 'water_source_name'),
    varieties: namedCounts(varietyCounts, 'Ref_Varieties', 'variety_code', 'variety_name'),
    refreshedAt: new Date().toISOString()
  };
}
