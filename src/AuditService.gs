function writeAudit_(action, entityType, entityId, details) {
  const row = {
    audit_id: generateRecordId_('AUD'),
    actor: getActorEmail_(),
    action: String(action || '').trim().toUpperCase(),
    entity_type: String(entityType || '').trim().toUpperCase(),
    entity_id: String(entityId || '').trim(),
    details_json: safeJsonStringify_(details || {}),
    created_at: new Date()
  };
  appendObjectRow_('Audit_Log', row);
  return row;
}

function writeAuditUnlocked_(action, entityType, entityId, details) {
  const row = {
    audit_id: generateRecordIdUnlocked_('AUD'),
    actor: getActorEmail_(),
    action: String(action || '').trim().toUpperCase(),
    entity_type: String(entityType || '').trim().toUpperCase(),
    entity_id: String(entityId || '').trim(),
    details_json: safeJsonStringify_(details || {}),
    created_at: new Date()
  };
  appendObjectRowUnlocked_('Audit_Log', row);
  return row;
}

function safeJsonStringify_(value) {
  return JSON.stringify(value, function(key, item) {
    if (key === '_rowNumber') return undefined;
    if (item instanceof Date) return item.toISOString();
    return item;
  });
}
