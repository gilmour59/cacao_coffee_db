const SHEET_SCHEMAS = Object.freeze({
  Farmers: [
    'farmer_id','rsbsa_registration_status','rsbsa_no','rsbsa_capture_method','rsbsa_info_confirmed',
    'first_name','middle_name','last_name','suffix','sex','marital_status_code',
    'contact_no','alternate_contact_no','email','association_name',
    'residence_province_code','residence_lgu_code','residence_barangay_code',
    'residence_sitio_purok_zone','residence_street_road','residence_house_lot_block','residence_landmark_detail',
    'created_from_submission_id','merged_into_farmer_id','record_status',
    'created_at','created_by','updated_at','updated_by'
  ],
  Farms: [
    'farm_id','farmer_id','submission_id','farm_name_local_id','tenure_code','total_farm_area_ha',
    'farm_address','province_code','lgu_code','barangay_code','latitude','longitude',
    'location_capture_method','topography_code','road_distance_km','remarks','record_status',
    'created_at','created_by','updated_at','updated_by'
  ],
  Farm_Water_Sources: [
    'farm_water_source_id','farm_id','submission_id','water_source_code','is_primary','remarks',
    'created_at','updated_at'
  ],
  Plantings: [
    'planting_id','farm_id','submission_id','commodity_code','variety_code','year_planted',
    'remarks','record_status','created_at','updated_at'
  ],
  Profiling_Rounds: [
    'profiling_round_id','farmer_id','farm_id','submission_id','reference_year','profiling_type',
    'profiling_date','status','created_at','updated_at'
  ],
  Planting_Observations: [
    'observation_id','profiling_round_id','farm_id','commodity_code',
    'trees_newly_planted','trees_non_bearing','trees_bearing','mortality_count','area_planted_ha',
    'updated_at'
  ],
  Production: [
    'production_id','profiling_round_id','farm_id','commodity_code','submission_id',
    'harvest_date','production_year','production_volume_kg','selling_price_per_kg','remarks',
    'created_at','updated_at'
  ],
  Facilities: [
    'facility_id','farmer_id','submission_id','description','quantity','capacity',
    'model_description','condition_status','utilization_status','remarks','created_at','updated_at'
  ],
  Interventions: [
    'intervention_id','farmer_id','submission_id','intervention_type_code','provider','year_received',
    'details','remarks','created_at','updated_at'
  ],
  Intervention_Needs: [
    'need_id','farmer_id','submission_id','intervention_type_code','priority',
    'details','remarks','created_at','updated_at'
  ],
  Submissions: [
    'submission_id','farmer_id','invitation_id','submission_type','reference_year','status',
    'payload_json','classification','flag_reasons_json','comparison_json',
    'submitted_at','submitted_by','validated_at','validated_by','validation_remarks',
    'created_at','updated_at'
  ],
  Profiling_Invitations: [
    'invitation_id','farmer_id','farm_id','reference_year','purpose','token_hash','status',
    'expires_at','first_opened_at','last_opened_at','submitted_at',
    'created_by','created_at','revoked_at'
  ],
  Identity_Reviews: [
    'identity_review_id','submission_id','subject_farmer_id','candidate_farmer_id',
    'match_tier','match_reasons','review_status','resolution','requested_by','resolved_by',
    'resolved_at','resolution_notes','created_at','updated_at'
  ],
  Users: [
    'user_email','full_name','role','province_code','lgu_code','is_active','created_at','updated_at'
  ],
  Audit_Log: [
    'audit_id','actor','action','entity_type','entity_id','details_json','created_at'
  ],
  Ref_Provinces: [
    'province_code','province_name','region_code','is_active','sort_order','valid_from','valid_to','source_version'
  ],
  Ref_LGUs: [
    'lgu_code','province_code','lgu_name','lgu_type','is_active','sort_order',
    'valid_from','valid_to','replaced_by_code','source_version'
  ],
  Ref_Barangays: [
    'barangay_code','lgu_code','province_code','barangay_name','urban_rural','is_active','sort_order',
    'valid_from','valid_to','replaced_by_code','source_version'
  ],
  Ref_Commodities: ['commodity_code','commodity_name','is_active','sort_order'],
  Ref_Varieties: ['variety_code','commodity_code','variety_name','is_active','sort_order'],
  Ref_Topographies: ['topography_code','topography_name','is_active','sort_order'],
  Ref_Intervention_Types: ['intervention_type_code','intervention_type_name','is_active','sort_order'],
  Ref_Production_Units: ['unit_code','unit_name','unit_symbol','is_active','sort_order'],
  Ref_Water_Sources: ['water_source_code','water_source_name','is_active','sort_order'],
  Ref_Tenure: ['tenure_code','tenure_name','is_active','sort_order'],
  Ref_Marital_Status: ['marital_status_code','marital_status_name','is_active','sort_order']
});

function setupDatabaseSchema() {
  requireBootstrapAdmin_();
  const db = getDatabase_();
  Object.keys(SHEET_SCHEMAS).forEach(function(sheetName) {
    ensureSheetSchema_(db, sheetName, SHEET_SCHEMAS[sheetName]);
  });
  seedCoreReferenceData_();
  seedBootstrapAdmin_();
  return { ok: true, sheets: Object.keys(SHEET_SCHEMAS) };
}

function ensureSheetSchema_(db, sheetName, requiredHeaders) {
  let sheet = db.getSheetByName(sheetName);
  if (!sheet) sheet = db.insertSheet(sheetName);

  const existingHeaders = getHeaders_(sheet);
  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
    sheet.setFrozenRows(1);
    return;
  }

  const missing = requiredHeaders.filter(function(header) {
    return existingHeaders.indexOf(header) === -1;
  });

  if (missing.length) {
    sheet.getRange(1, existingHeaders.length + 1, 1, missing.length).setValues([missing]);
  }

  sheet.setFrozenRows(1);
}

function seedCoreReferenceData_() {
  seedReferenceRows_('Ref_Commodities', [
    { commodity_code: 'COFFEE', commodity_name: 'Coffee', is_active: true, sort_order: 1 },
    { commodity_code: 'CACAO', commodity_name: 'Cacao', is_active: true, sort_order: 2 }
  ], 'commodity_code');

  seedReferenceRows_('Ref_Varieties', [
    { variety_code: 'COFFEE_ROBUSTA', commodity_code: 'COFFEE', variety_name: 'Robusta', is_active: true, sort_order: 1 },
    { variety_code: 'COFFEE_NATIVE', commodity_code: 'COFFEE', variety_name: 'Native', is_active: true, sort_order: 2 },
    { variety_code: 'CACAO_BR25', commodity_code: 'CACAO', variety_name: 'BR25', is_active: true, sort_order: 1 },
    { variety_code: 'CACAO_UF18', commodity_code: 'CACAO', variety_name: 'UF18', is_active: true, sort_order: 2 },
    { variety_code: 'CACAO_K1', commodity_code: 'CACAO', variety_name: 'K1', is_active: true, sort_order: 3 },
    { variety_code: 'CACAO_K2', commodity_code: 'CACAO', variety_name: 'K2', is_active: true, sort_order: 4 }
  ], 'variety_code');

  seedReferenceRows_('Ref_Topographies', [
    { topography_code: 'HILLY', topography_name: 'Hilly', is_active: true, sort_order: 1 },
    { topography_code: 'SEMI_ROLLING', topography_name: 'Semi-Rolling', is_active: true, sort_order: 2 }
  ], 'topography_code');

  seedReferenceRows_('Ref_Intervention_Types', [
    { intervention_type_code: 'TRAINING', intervention_type_name: 'Training', is_active: true, sort_order: 1 },
    { intervention_type_code: 'PLANTING_MATERIALS', intervention_type_name: 'Planting Materials', is_active: true, sort_order: 2 },
    { intervention_type_code: 'FERTILIZER', intervention_type_name: 'Fertilizer', is_active: true, sort_order: 3 }
  ], 'intervention_type_code');

  seedReferenceRows_('Ref_Production_Units', [
    { unit_code: 'KG', unit_name: 'Kilogram', unit_symbol: 'kg', is_active: true, sort_order: 1 }
  ], 'unit_code');

  seedReferenceRows_('Ref_Water_Sources', [
    { water_source_code: 'SHALLOW_WELL', water_source_name: 'Shallow Well', is_active: true, sort_order: 1 },
    { water_source_code: 'SPRING', water_source_name: 'Spring', is_active: true, sort_order: 2 },
    { water_source_code: 'RIVER', water_source_name: 'River', is_active: true, sort_order: 3 }
  ], 'water_source_code');

  seedReferenceRows_('Ref_Tenure', [
    { tenure_code: 'OWNED', tenure_name: 'Owned', is_active: true, sort_order: 1 },
    { tenure_code: 'LEASED_RENTED', tenure_name: 'Leased/Rented', is_active: true, sort_order: 2 },
    { tenure_code: 'TENANTED', tenure_name: 'Tenanted', is_active: true, sort_order: 3 },
    { tenure_code: 'USUFRUCT', tenure_name: 'Usufruct', is_active: true, sort_order: 4 },
    { tenure_code: 'FAMILY_OWNED', tenure_name: 'Family-owned', is_active: true, sort_order: 5 }
  ], 'tenure_code');

  seedReferenceRows_('Ref_Marital_Status', [
    { marital_status_code: 'SINGLE', marital_status_name: 'Single', is_active: true, sort_order: 1 },
    { marital_status_code: 'MARRIED', marital_status_name: 'Married', is_active: true, sort_order: 2 },
    { marital_status_code: 'WIDOWED', marital_status_name: 'Widowed', is_active: true, sort_order: 3 },
    { marital_status_code: 'SEPARATED', marital_status_name: 'Separated', is_active: true, sort_order: 4 },
    { marital_status_code: 'OTHER', marital_status_name: 'Other', is_active: true, sort_order: 5 }
  ], 'marital_status_code');
}

function seedReferenceRows_(sheetName, rows, keyField) {
  const existing = getRowsAsObjects_(sheetName);
  const existingKeys = {};
  existing.forEach(function(row) {
    existingKeys[String(row[keyField] || '')] = true;
  });

  rows.forEach(function(row) {
    if (!existingKeys[String(row[keyField])]) appendObjectRow_(sheetName, row);
  });
}


function seedBootstrapAdmin_() {
  const email = normalizeEmail_(
    PropertiesService.getScriptProperties().getProperty('BOOTSTRAP_ADMIN_EMAIL')
  );
  if (!email) return;

  const existing = findFirstByField_('Users', 'user_email', email);
  if (existing) return;

  appendObjectRow_('Users', {
    user_email: email,
    full_name: 'Bootstrap Administrator',
    role: 'ADMIN',
    province_code: '',
    lgu_code: '',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  });
}


function requireBootstrapAdmin_() {
  const configured = normalizeEmail_(
    PropertiesService.getScriptProperties().getProperty('BOOTSTRAP_ADMIN_EMAIL')
  );
  if (!configured) {
    throw new Error('BOOTSTRAP_ADMIN_EMAIL must be configured before database setup.');
  }

  const actor = normalizeEmail_(getActorEmail_());
  if (!actor || actor !== configured) {
    throw new Error('Only the configured bootstrap administrator may initialize the database.');
  }
}
