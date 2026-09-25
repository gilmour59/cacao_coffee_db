const APP_DEFAULTS = Object.freeze({
  APP_NAME: 'Coffee and Cacao Farmer Profiling',
  ENVIRONMENT: 'TEST'
});

function getAppConfig_() {
  const props = PropertiesService.getScriptProperties();

  const spreadsheetId = props.getProperty('DATABASE_SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('DATABASE_SPREADSHEET_ID is not configured in Script Properties.');
  }

  return {
    appName: props.getProperty('APP_NAME') || APP_DEFAULTS.APP_NAME,
    environment: props.getProperty('ENVIRONMENT') || APP_DEFAULTS.ENVIRONMENT,
    spreadsheetId: spreadsheetId
  };
}

function getActorEmail_() {
  try {
    return Session.getActiveUser().getEmail() || '';
  } catch (error) {
    return '';
  }
}
