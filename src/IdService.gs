function generateRecordId_(prefix) {
  return withScriptLock_(function() {
    return generateRecordIdUnlocked_(prefix);
  }, 10000);
}

function generateRecordIdUnlocked_(prefix) {
  const year = Utilities.formatDate(new Date(), 'Asia/Manila', 'yyyy');
  const propertyKey = 'SEQ_' + prefix + '_' + year;
  const props = PropertiesService.getScriptProperties();
  const current = Number(props.getProperty(propertyKey) || '0');
  const next = current + 1;
  props.setProperty(propertyKey, String(next));

  return [
    prefix,
    year,
    String(next).padStart(6, '0')
  ].join('-');
}

function generateSecureToken_() {
  const raw = Utilities.getUuid() + Utilities.getUuid();
  return raw.replace(/-/g, '');
}

function hashToken_(rawToken) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(rawToken || ''),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    const value = b < 0 ? b + 256 : b;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
}
