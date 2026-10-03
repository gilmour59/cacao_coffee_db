const CHANGE_THRESHOLDS = Object.freeze({
  AREA_MULTIPLIER: 2,
  AREA_ABSOLUTE_HA: 1,
  TREE_MULTIPLIER: 2,
  TREE_ABSOLUTE_COUNT: 100,
  PRODUCTION_MULTIPLIER: 3
});

function classifySubmission_(submissionType, farmerId, payload) {
  if (submissionType === 'NEW_PROFILE') {
    return { classification: 'NEW_ENTRY', flags: [], comparison: {} };
  }

  if (!farmerId) {
    return { classification: 'NEW_ENTRY', flags: [], comparison: {} };
  }

  const previousByFarm = getPreviousMetricsByFarm_(farmerId);
  const incomingByFarm = buildIncomingMetricsByFarm_(payload);
  const flags = [];
  let hasDifference = false;
  let hasExpansion = false;

  Object.keys(incomingByFarm).forEach(function(farmKey) {
    const incoming = incomingByFarm[farmKey];
    const previous = previousByFarm[farmKey];

    if (!previous) {
      hasDifference = true;
      hasExpansion = true;
      flags.push('New farm or farm without a previous approved profiling round');
      return;
    }

    Object.keys(incoming.commodities).forEach(function(commodity) {
      const next = incoming.commodities[commodity];
      const prev = previous.commodities[commodity] || emptyMetric_();

      if (!metricsEqual_(prev, next)) hasDifference = true;
      if (next.area_planted_ha > prev.area_planted_ha || next.trees_newly_planted > 0) {
        hasExpansion = true;
      }

      if (prev.area_planted_ha > 0 &&
          next.area_planted_ha >= prev.area_planted_ha * CHANGE_THRESHOLDS.AREA_MULTIPLIER &&
          (next.area_planted_ha - prev.area_planted_ha) >= CHANGE_THRESHOLDS.AREA_ABSOLUTE_HA) {
        flags.push(commodity + ': large increase in planted area');
      }

      const prevTrees = totalTrees_(prev);
      const nextTrees = totalTrees_(next);
      if (prevTrees > 0 &&
          nextTrees >= prevTrees * CHANGE_THRESHOLDS.TREE_MULTIPLIER &&
          (nextTrees - prevTrees) >= CHANGE_THRESHOLDS.TREE_ABSOLUTE_COUNT) {
        flags.push(commodity + ': large increase in tree count');
      }

      if (prev.production_kg > 0 &&
          next.production_kg >= prev.production_kg * CHANGE_THRESHOLDS.PRODUCTION_MULTIPLIER) {
        flags.push(commodity + ': unusual increase in production');
      }
    });
  });

  let classification = hasDifference ? 'MODIFICATION' : 'NO_CHANGE';
  if (hasExpansion || submissionType === 'EXPANSION_UPDATE') classification = 'EXPANSION';
  if (flags.some(function(flag) { return flag.indexOf('large ') >= 0 || flag.indexOf('unusual ') >= 0; })) {
    classification = 'ANOMALY';
  }

  return {
    classification: classification,
    flags: Array.from(new Set(flags)),
    comparison: {
      previous: previousByFarm,
      incoming: incomingByFarm
    }
  };
}

function getPreviousMetricsByFarm_(farmerId) {
  const rounds = getLatestApprovedProfilingRounds_(farmerId);
  const latestRoundByFarm = {};

  rounds.forEach(function(round) {
    if (!latestRoundByFarm[round.farm_id]) latestRoundByFarm[round.farm_id] = round;
  });

  const result = {};
  Object.keys(latestRoundByFarm).forEach(function(farmId) {
    const round = latestRoundByFarm[farmId];
    const metrics = { commodities: {} };

    findRowsByField_('Planting_Observations', 'profiling_round_id', round.profiling_round_id)
      .forEach(function(obs) {
        const commodity = String(obs.commodity_code || '').toUpperCase();
        metrics.commodities[commodity] = {
          area_planted_ha: Number(obs.area_planted_ha || 0),
          trees_newly_planted: Number(obs.trees_newly_planted || 0),
          trees_non_bearing: Number(obs.trees_non_bearing || 0),
          trees_bearing: Number(obs.trees_bearing || 0),
          mortality_count: Number(obs.mortality_count || 0),
          production_kg: 0
        };
      });

    findRowsByField_('Production', 'profiling_round_id', round.profiling_round_id)
      .forEach(function(prod) {
        const commodity = String(prod.commodity_code || '').toUpperCase();
        if (!metrics.commodities[commodity]) metrics.commodities[commodity] = emptyMetric_();
        metrics.commodities[commodity].production_kg += Number(prod.production_volume_kg || 0);
      });

    result[farmId] = metrics;
  });

  return result;
}

function buildIncomingMetricsByFarm_(payload) {
  const result = {};
  (payload.farms || []).forEach(function(farm, farmIndex) {
    const key = farm.farm_id || ('NEW_FARM_' + farmIndex);
    const metrics = { commodities: {} };

    (farm.crops || []).forEach(function(crop) {
      const commodity = String(crop.commodity_code || '').toUpperCase();
      const metric = {
        area_planted_ha: Number(crop.area_planted_ha || 0),
        trees_newly_planted: Number(crop.trees_newly_planted || 0),
        trees_non_bearing: Number(crop.trees_non_bearing || 0),
        trees_bearing: Number(crop.trees_bearing || 0),
        mortality_count: Number(crop.mortality_count || 0),
        production_kg: 0
      };

      (crop.production || []).forEach(function(prod) {
        metric.production_kg += Number(prod.production_volume_kg || 0);
      });
      metrics.commodities[commodity] = metric;
    });

    result[key] = metrics;
  });
  return result;
}

function emptyMetric_() {
  return {
    area_planted_ha: 0,
    trees_newly_planted: 0,
    trees_non_bearing: 0,
    trees_bearing: 0,
    mortality_count: 0,
    production_kg: 0
  };
}

function metricsEqual_(a, b) {
  const fields = [
    'area_planted_ha','trees_newly_planted','trees_non_bearing',
    'trees_bearing','mortality_count','production_kg'
  ];
  return fields.every(function(field) {
    return Number(a[field] || 0) === Number(b[field] || 0);
  });
}

function totalTrees_(metric) {
  return Number(metric.trees_newly_planted || 0) +
    Number(metric.trees_non_bearing || 0) +
    Number(metric.trees_bearing || 0);
}
