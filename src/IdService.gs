function generateRecordId_(prefix) {
  const year = Utilities.formatDate(new Date(), 'Asia/Manila', 'yyyy');
  const propertyKey = 'SEQ_' + prefix + '_' + year;
  const lock = LockService.getScriptLock();

  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();
    const current = Number(props.getProperty(propertyKey) || '0');
    const next = current + 1;
    props.setProperty(propertyKey, String(next));

    return [
      prefix,
      year,
      String(next).padStart(6, '0')
    ].join('-');
  } finally {
    lock.releaseLock();
  }
}
