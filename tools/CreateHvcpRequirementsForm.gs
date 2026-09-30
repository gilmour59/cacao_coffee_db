/**
 * One-time helper to create the staff-facing HVCP requirements Google Form.
 *
 * Setup:
 * 1) In the Apps Script project, set Script Property:
 *    HVCP_REQUIREMENTS_RESPONSE_SHEET_ID = <Google Sheet ID>
 * 2) Run createHvcpRequirementsForm().
 *
 * The function is idempotent: if HVCP_REQUIREMENTS_FORM_ID already exists,
 * it reopens the existing form instead of creating a duplicate.
 */
function createHvcpRequirementsForm() {
  const props = PropertiesService.getScriptProperties();
  const existingFormId = props.getProperty('HVCP_REQUIREMENTS_FORM_ID');

  if (existingFormId) {
    const existing = FormApp.openById(existingFormId);
    const result = {
      formId: existing.getId(),
      editUrl: existing.getEditUrl(),
      publishedUrl: existing.getPublishedUrl(),
      responseSpreadsheetId: props.getProperty('HVCP_REQUIREMENTS_RESPONSE_SHEET_ID') || ''
    };
    Logger.log(JSON.stringify(result, null, 2));
    return result;
  }

  const responseSpreadsheetId = props.getProperty('HVCP_REQUIREMENTS_RESPONSE_SHEET_ID');
  if (!responseSpreadsheetId) {
    throw new Error(
      'Missing Script Property HVCP_REQUIREMENTS_RESPONSE_SHEET_ID. ' +
      'Set it to the Google Sheet ID that will receive questionnaire responses.'
    );
  }

  const form = FormApp.create(
    'HVCP Coffee and Cacao Farmer Profiling System - Requirements Clarification'
  );

  form
    .setDescription(
      'This questionnaire confirms the remaining operational and data requirements ' +
      'needed to finalize the MVP of the Coffee and Cacao Farmer Profiling and ' +
      'Information Management System. Target MVP presentation: October 22, 2026.'
    )
    .setConfirmationMessage(
      'Thank you. Your response will be used to finalize the MVP requirements and implementation.'
    )
    .setProgressBar(true)
    .setShowLinkToRespondAgain(false);

  addSection_(form, '1. Coverage');

  addMultipleChoice_(
    form,
    'Should V1 cover the entire Western Visayas or selected provinces/LGUs only?',
    ['Entire Western Visayas', 'Selected provinces/LGUs only'],
    true
  );

  form.addParagraphTextItem()
    .setTitle('If selected provinces/LGUs only, please specify the areas.');

  addSection_(form, '2. RSBSA');

  addYesNo_(form, 'Should farmers who are not yet registered in RSBSA still be allowed to be profiled?', true);
  addYesNo_(form, 'For registered farmers, should the RSBSA number be mandatory?', true);
  addYesNo_(form, 'Can HVCP provide a sample or anonymized RSBSA ID for testing the ID scanner/OCR?', true);
  addYesNo_(
    form,
    'Is it acceptable for the system to use the RSBSA ID image temporarily for OCR, ' +
    'allow the encoder/farmer to verify and correct the extracted text, and save only ' +
    'the verified text while not storing the ID image?',
    true
  );

  addSection_(form, '3. Required Farmer Information');

  addCheckbox_(
    form,
    'Which farmer fields must be mandatory before a profile can be submitted?',
    [
      'Farmer Name',
      'Sex/Gender',
      'Contact Number',
      'Residence Address',
      'RSBSA Number, when applicable'
    ],
    true
  );

  form.addTextItem()
    .setTitle('Other mandatory farmer field/s, if any.');

  addSection_(form, '4. Farm Structure');

  addYesNo_(form, 'Can one farmer have more than one farm?', true);
  addYesNo_(form, 'Can one farm contain both Coffee and Cacao?', true);

  addSection_(form, '5. Coffee and Cacao Reference Lists');

  [
    'Official/current Coffee varieties/types',
    'Official/current Cacao varieties/types',
    'Topography classifications',
    'Post-harvest facilities/equipment categories',
    'Assistance/interventions received categories',
    'Intervention needs categories'
  ].forEach(function(title) {
    form.addParagraphTextItem().setTitle(title);
  });

  addSection_(form, '6. Production Data');

  addMultipleChoice_(
    form,
    'What production unit should be used?',
    ['Kilograms', 'Metric tons', 'Bags', 'Other'],
    true
  );

  form.addTextItem()
    .setTitle('If Other production unit, please specify.');

  addMultipleChoice_(
    form,
    'How should production be recorded?',
    ['Annual', 'Per harvest', 'Per season', 'Other'],
    true
  );

  form.addTextItem()
    .setTitle('If Other production period/basis, please specify.');

  addYesNo_(
    form,
    'Does HVCP need the product form recorded, such as fresh, dried, fermented, parchment, etc.?',
    true
  );

  form.addParagraphTextItem()
    .setTitle('If yes, please provide the required Coffee/Cacao product-form categories.');

  addSection_(form, '7. Farm Location');

  addYesNo_(form, 'Is an approximate farm point on the map sufficient for V1?', true);
  addYesNo_(form, 'Is parcel boundary mapping required?', true);

  form.addParagraphTextItem()
    .setTitle('Please specify any additional GPS/location requirements.');

  addSection_(form, '8. User Roles and Validation');

  addYesNo_(
    form,
    'Are the proposed roles Encoder, Validator, and Admin sufficient?',
    true
  );

  form.addTextItem()
    .setTitle('Additional role/s, if any.');

  addYesNo_(
    form,
    'Is the proposed workflow Encoder → Validator → Approved / Returned acceptable?',
    true
  );

  form.addParagraphTextItem()
    .setTitle('If no, please specify the required approval/validation flow.');

  addSection_(form, '9. Who Will Use the System?');

  addCheckbox_(
    form,
    'Please select all intended users.',
    ['Regional HVCP staff', 'Provincial staff', 'LGU personnel', 'Farmers'],
    true
  );

  form.addTextItem()
    .setTitle('Other intended users, if any.');

  addSection_(form, '10. Production Ownership / Turnover');

  form.addParagraphTextItem()
    .setTitle('What institutional Google account or Shared Drive should own the final production system?');

  addMultipleChoice_(
    form,
    'What type of Google accounts will intended users have?',
    ['DA/HVCP Google Workspace accounts', 'Personal Gmail accounts', 'Both'],
    true
  );

  form.addTextItem()
    .setTitle('Designated HVCP/Cacao focal person for system administration and turnover - Name / Office.');

  addSection_(form, '11. Dashboard / Reports');

  addCheckbox_(
    form,
    'Which indicators should be prioritized in the dashboard?',
    [
      'Number of farmers',
      'Coffee area',
      'Cacao area',
      'Bearing trees',
      'Non-bearing trees',
      'Newly planted trees',
      'Production',
      'Varieties',
      'Interventions received',
      'Intervention needs',
      'Farm location map'
    ],
    true
  );

  form.addTextItem()
    .setTitle('Other dashboard indicator/s, if any.');

  addCheckbox_(
    form,
    'Which dashboard/report filters are required?',
    ['Province', 'Municipality/City', 'Barangay', 'Commodity', 'Variety', 'Year'],
    true
  );

  form.addTextItem()
    .setTitle('Other required filter/s, if any.');

  addCheckbox_(
    form,
    'Required export format/s',
    ['Excel/CSV', 'PDF'],
    true
  );

  form.addTextItem()
    .setTitle('Other export format/s, if any.');

  addSection_(form, '12. Testing / User Acceptance');

  addYesNo_(
    form,
    'Can HVCP provide a few dummy or anonymized farmer records for system testing?',
    true
  );

  form.addParagraphTextItem()
    .setTitle('Who will participate in user acceptance testing before deployment?');

  addSection_(form, 'Current MVP Design Assumptions');

  addCheckbox_(
    form,
    'Please check the design assumptions that are acceptable. Leave an item unchecked if it needs revision.',
    [
      'Google Apps Script + Google Sheets for V1',
      'Client-side RSBSA OCR using Tesseract.js',
      'No RSBSA ID image retention',
      'One farmer may have multiple farms',
      'Approximate farm point using Leaflet/OpenStreetMap',
      'PSA PSGC codes for Province → Municipality/City → Barangay',
      'TEST and PROD environments kept separate',
      'Production owned by HVCP/institutional account',
      'GitHub as source of truth for application code',
      'Human-approved production releases with versioned rollback'
    ],
    false
  );

  form.addParagraphTextItem()
    .setTitle('Please describe any design assumption above that should be changed.');

  form.setDestination(
    FormApp.DestinationType.SPREADSHEET,
    responseSpreadsheetId
  );

  props.setProperty('HVCP_REQUIREMENTS_FORM_ID', form.getId());

  const result = {
    formId: form.getId(),
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl(),
    responseSpreadsheetId: responseSpreadsheetId
  };

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function addSection_(form, title) {
  form.addSectionHeaderItem().setTitle(title);
}

function addYesNo_(form, title, required) {
  return addMultipleChoice_(form, title, ['Yes', 'No'], required);
}

function addMultipleChoice_(form, title, choices, required) {
  return form.addMultipleChoiceItem()
    .setTitle(title)
    .setChoiceValues(choices)
    .setRequired(Boolean(required));
}

function addCheckbox_(form, title, choices, required) {
  return form.addCheckboxItem()
    .setTitle(title)
    .setChoiceValues(choices)
    .setRequired(Boolean(required));
}
