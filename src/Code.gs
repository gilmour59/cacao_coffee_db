function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  const config = getAppConfig_();

  template.appName = config.appName;
  template.environment = config.environment;
  template.initialInvitationToken = e && e.parameter && e.parameter.t
    ? String(e.parameter.t)
    : '';

  return template
    .evaluate()
    .setTitle(config.appName)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
