const APP_CALLS = Object.freeze({
  getBootstrapData: getBootstrapData,
  getInvitationContext: getInvitationContext,
  submitNewFarmerProfile: submitNewFarmerProfile,
  submitExistingFarmerProfile: submitExistingFarmerProfile,
  submitEncoderProfile: submitEncoderProfile,
  searchActiveFarmersForInvitation: searchActiveFarmersForInvitation,
  listProfilingInvitationsForFarmer: listProfilingInvitationsForFarmer,
  createProfilingInvitation: createProfilingInvitation,
  revokeProfilingInvitation: revokeProfilingInvitation,
  listPendingSubmissions: listPendingSubmissions,
  getSubmissionForReview: getSubmissionForReview,
  resolveIdentityReview: resolveIdentityReview,
  approveSubmission: approveSubmission,
  returnSubmission: returnSubmission,
  voidSubmission: voidSubmission
});

function dispatchAppCall_(name, args) {
  if (!Object.prototype.hasOwnProperty.call(APP_CALLS, name) || !Array.isArray(args)) {
    throw new Error('Unsupported app request.');
  }
  return APP_CALLS[name].apply(null, args);
}

function bridgeCall(name, args) {
  const props = PropertiesService.getScriptProperties();
  const owner = normalizeEmail_(props.getProperty('BOOTSTRAP_ADMIN_EMAIL'));
  const effective = normalizeEmail_(Session.getEffectiveUser().getEmail());
  if (effective === owner) return dispatchAppCall_(name, args);

  const actor = normalizeEmail_(Session.getActiveUser().getEmail());
  if (!actor || actor !== effective) throw new Error('Sign in with your staff Google account.');

  const url = props.getProperty('STAFF_BRIDGE_URL');
  const secret = props.getProperty('STAFF_BRIDGE_SECRET');
  if (!url || !secret) throw new Error('Staff access is not configured.');

  const body = JSON.stringify({ actor: actor, name: name, args: args, issuedAt: Date.now() });
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(body, secret)
  );
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ body: body, signature: signature }),
    muteHttpExceptions: true,
    followRedirects: true
  });
  let result;
  try {
    result = JSON.parse(response.getContentText());
  } catch (error) {
    throw new Error('Staff service is unavailable.');
  }
  if (response.getResponseCode() !== 200 || !result.ok) {
    throw new Error(result.error || 'Staff service request failed.');
  }
  return result.value;
}

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const owner = normalizeEmail_(props.getProperty('BOOTSTRAP_ADMIN_EMAIL'));
    if (normalizeEmail_(Session.getEffectiveUser().getEmail()) !== owner) {
      throw new Error('Staff service is unavailable.');
    }
    const secret = props.getProperty('STAFF_BRIDGE_SECRET');
    if (!secret) throw new Error('Staff service is not configured.');
    const request = JSON.parse(String(e && e.postData && e.postData.contents || '{}'));
    const body = String(request.body || '');
    if (!body || body.length > 100000) throw new Error('Invalid staff request.');
    const expected = Utilities.base64EncodeWebSafe(
      Utilities.computeHmacSha256Signature(body, secret)
    );
    if (!sameSignature_(expected, String(request.signature || ''))) {
      throw new Error('Invalid staff request.');
    }
    const call = JSON.parse(body);
    if (!Number.isFinite(call.issuedAt) || Math.abs(Date.now() - call.issuedAt) > 120000) {
      throw new Error('Expired staff request.');
    }
    const actor = normalizeEmail_(call.actor);
    if (!actor) throw new Error('Invalid staff request.');
    STAFF_BRIDGE_ACTOR_EMAIL = actor;
    try {
      return staffBridgeResponse_({ ok: true, value: dispatchAppCall_(call.name, call.args) });
    } finally {
      STAFF_BRIDGE_ACTOR_EMAIL = '';
    }
  } catch (error) {
    return staffBridgeResponse_({ ok: false, error: String(error.message || error) });
  }
}

function sameSignature_(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function staffBridgeResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
