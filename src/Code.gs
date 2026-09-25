function doGet() {
  const template = HtmlService.createTemplateFromFile('Index');
  const config = getAppConfig_();

  template.appName = config.appName;
  template.environment = config.environment;

  return template
    .evaluate()
    .setTitle(config.appName)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getBootstrapData() {
  return {
    app: {
      name: getAppConfig_().appName,
      environment: getAppConfig_().environment
    },
    locations: getLocationReferenceData_(),
    commodities: getReferenceRows_('Ref_Commodities'),
    varieties: getReferenceRows_('Ref_Varieties'),
    topographies: getReferenceRows_('Ref_Topographies'),
    interventionTypes: getReferenceRows_('Ref_Intervention_Types'),
    facilityTypes: getReferenceRows_('Ref_Facility_Types'),
    productionUnits: getReferenceRows_('Ref_Production_Units')
  };
}
