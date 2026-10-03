const STAFF_ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  VALIDATOR: 'VALIDATOR',
  ENCODER: 'ENCODER'
});

function getCurrentStaffUser_() {
  const email = normalizeEmail_(getActorEmail_());
  if (!email) return null;

  const user = findFirstByField_('Users', 'user_email', email);
  if (!user) return null;

  const active = String(user.is_active || '').trim().toUpperCase();
  if (active && active !== 'TRUE' && active !== 'YES' && active !== '1') return null;

  return user;
}

function requireStaffRole_(allowedRoles) {
  const user = getCurrentStaffUser_();
  if (!user) throw new Error('Authorized staff access is required.');

  const role = String(user.role || '').trim().toUpperCase();
  if (allowedRoles.indexOf(role) === -1) {
    throw new Error('You are not authorized to perform this action.');
  }
  return user;
}

function assertStaffGeographicScope_(user, provinceCode, lguCode) {
  const userProvince = String(user.province_code || '').trim();
  const userLgu = String(user.lgu_code || '').trim();

  if (userProvince && userProvince !== String(provinceCode || '').trim()) {
    throw new Error('Record is outside your authorized province scope.');
  }
  if (userLgu && userLgu !== String(lguCode || '').trim()) {
    throw new Error('Record is outside your authorized LGU scope.');
  }
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}
