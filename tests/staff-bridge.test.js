const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function makeBridge() {
  const props = {
    BOOTSTRAP_ADMIN_EMAIL: 'admin@example.com',
    STAFF_BRIDGE_URL: 'https://test.example/exec',
    STAFF_BRIDGE_SECRET: 'test-only-secret'
  };
  let effective = 'validator@example.com';
  let active = 'validator@example.com';
  const calls = {};
  const names = [
    'getBootstrapData', 'getInvitationContext', 'submitNewFarmerProfile',
    'submitExistingFarmerProfile', 'submitEncoderProfile',
    'searchActiveFarmersForInvitation', 'listProfilingInvitationsForFarmer',
    'createProfilingInvitation', 'revokeProfilingInvitation', 'listPendingSubmissions',
    'getSubmissionForReview', 'resolveIdentityReview', 'approveSubmission',
    'returnSubmission', 'voidSubmission'
  ];
  const context = {
    STAFF_BRIDGE_ACTOR_EMAIL: '',
    normalizeEmail_: value => String(value || '').trim().toLowerCase(),
    Session: {
      getEffectiveUser: () => ({ getEmail: () => effective }),
      getActiveUser: () => ({ getEmail: () => active })
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => props[key] }) },
    Utilities: {
      computeHmacSha256Signature: (body, secret) => Array.from(
        crypto.createHmac('sha256', secret).update(body).digest()
      ),
      base64EncodeWebSafe: bytes => Buffer.from(bytes).toString('base64url')
    },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: body => ({
        setMimeType() { return this; },
        getContentText() { return body; },
        getResponseCode() { return 200; }
      })
    }
  };
  for (const name of names) {
    context[name] = (...args) => {
      calls[name] = { actor: context.STAFF_BRIDGE_ACTOR_EMAIL, args };
      if (name === 'approveSubmission' && context.STAFF_BRIDGE_ACTOR_EMAIL !== 'validator@example.com') {
        throw new Error('You are not authorized to perform this action.');
      }
      return { actor: context.STAFF_BRIDGE_ACTOR_EMAIL, args };
    };
  }
  context.UrlFetchApp = {
    fetch: (_url, options) => {
      const prior = effective;
      effective = 'admin@example.com';
      try {
        return context.doPost({ postData: { contents: options.payload } });
      } finally {
        effective = prior;
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/StaffBridge.gs'), 'utf8'), context);
  return {
    context, calls, props,
    setIdentity: (nextEffective, nextActive) => { effective = nextEffective; active = nextActive; }
  };
}

test('staff identity reaches the owner database call and is reset afterward', () => {
  const { context, calls } = makeBridge();
  const result = context.bridgeCall('getBootstrapData', []);
  assert.equal(result.actor, 'validator@example.com');
  assert.equal(calls.getBootstrapData.actor, 'validator@example.com');
  assert.equal(context.STAFF_BRIDGE_ACTOR_EMAIL, '');
});

test('an unsigned visitor, forged request, and unsupported call are rejected', () => {
  const { context, setIdentity } = makeBridge();
  setIdentity('visitor@example.com', '');
  assert.throws(() => context.bridgeCall('getBootstrapData', []), /Sign in/);
  setIdentity('admin@example.com', '');
  const forged = context.doPost({ postData: { contents: JSON.stringify({
    body: JSON.stringify({ actor: 'admin@example.com', name: 'approveSubmission', args: [], issuedAt: Date.now() }),
    signature: 'forged'
  }) } });
  assert.equal(JSON.parse(forged.getContentText()).ok, false);
  assert.throws(() => context.bridgeCall('setupDatabaseSchema', []), /Unsupported/);
});

test('staff request cannot claim a different signed-in account', () => {
  const { context, setIdentity } = makeBridge();
  setIdentity('validator@example.com', 'admin@example.com');
  assert.throws(() => context.bridgeCall('approveSubmission', ['SUB-1']), /Sign in/);
});
