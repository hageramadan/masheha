const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { test } = require('node:test');

function loadTs(path, bindings) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, FormData, ...bindings }, { filename: path });
  return exports;
}

function setup() {
  const requests = [];
  const replies = [];
  const storage = new Map();
  const fetch = async (url, options) => {
    assert.ok(['register', 'verify/otp', 'resend/otp'].includes(url.split('/user/')[1]), 'Only registration and OTP endpoints are allowed');
    requests.push({ endpoint: url.split('/user/')[1], fields: Object.fromEntries(options.body.entries()), headers: { ...options.headers } });
    const reply = replies.shift();
    assert.ok(reply, 'Every request must have an explicit mocked backend response');
    return { ok: reply.ok !== false, json: async () => reply };
  };
  const service = loadTs('src/services/authService.ts', { fetch });
  const states = [];
  const refs = [];
  let stateIndex = 0;
  let refIndex = 0;
  const React = {
    createContext: () => ({ Provider: 'provider' }),
    useContext: () => {},
    useEffect: () => {},
    useState: (initial) => {
      const index = stateIndex++;
      if (!(index in states)) states[index] = initial;
      return [states[index], value => { states[index] = value; }];
    },
    useRef: initial => {
      const index = refIndex++;
      return refs[index] ||= { current: initial };
    },
  };
  const context = loadTs('src/context/AuthContext.tsx', {
    fetch,
    localStorage: { setItem: (key, value) => storage.set(key, value), getItem: key => storage.get(key), removeItem: key => storage.delete(key) },
    require: name => {
      if (name === 'react') return React;
      if (name === 'react/jsx-runtime') return { jsx: (_type, props) => props };
      if (name === 'react-hot-toast') return { toast: { success() {} } };
      if (name.endsWith('/authService')) return service;
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  const render = () => {
    stateIndex = refIndex = 0;
    return context.AuthProvider({ children: null }).value;
  };
  return { ...service, requests, replies, storage, render };
}

const credentials = { country_code: '+20', phone: '01234567890' };
const registration = { ...credentials, email: 'driver@example.com', date_of_birth: '1990-10-10', license_number: '2155655' };

test('new registration sends all five form fields and authenticates only after backend OTP success', async () => {
  const h = setup();
  h.replies.push({ result: true, data: { user: { id: 42, token: 'pending-token' } } });
  await h.render().register(registration);
  assert.equal(h.render().isAuthenticated, false);
  assert.equal(h.storage.has('token'), false);
  assert.deepEqual(h.requests[0].fields, { ...registration, phone: '1234567890' });
  assert.equal(h.requests[0].headers['Content-Type'], undefined);
  h.replies.push({ result: false, message: 'Invalid code', ok: false });
  await assert.rejects(h.render().verifyOtp(credentials, '9999'), /Invalid code/);
  assert.equal(h.render().isAuthenticated, false);
  assert.equal(h.storage.has('token'), false);
  h.replies.push({ result: true });
  await h.render().verifyOtp(credentials, '1234');
  assert.equal(h.render().isAuthenticated, true);
  assert.equal(h.storage.get('token'), 'pending-token');
  assert.deepEqual(h.requests.at(-1), { endpoint: 'verify/otp', fields: { country_code: '+20', phone: '1234567890', otp: '1234' }, headers: { Accept: 'application/json', 'accept-language': 'ar' } });
});

test('registration, resend failures, and a changed phone cannot bypass verification', async () => {
  const h = setup();
  h.replies.push({ result: true, data: { user: { token: 'registration-token' } } });
  await h.render().register(registration);
  assert.equal(h.requests[0].endpoint, 'register');
  assert.equal(h.render().isAuthenticated, false);
  h.replies.push({ result: false, message: 'Please wait' });
  await assert.rejects(h.render().resendOtp(credentials), /Please wait/);
  h.replies.push({ result: true });
  await h.render().resendOtp(credentials);
  assert.equal(h.requests.at(-1).endpoint, 'resend/otp');
  assert.deepEqual(h.requests.at(-1).fields, { country_code: '+20', phone: '1234567890' });
  await assert.rejects(h.render().verifyOtp({ ...credentials, phone: '01000000000' }, '1234'));
  await assert.rejects(h.render().verifyOtp(credentials, '123456'));
  h.render().clearPendingAuth();
  await assert.rejects(h.render().verifyOtp(credentials, '1234'));
  assert.equal(h.storage.has('token'), false);
});

test('missing verified session token fails closed', async () => {
  const h = setup();
  h.replies.push({ result: true });
  await h.render().register(registration);
  h.replies.push({ result: true });
  await assert.rejects(h.render().verifyOtp(credentials, '1234'));
  assert.equal(h.render().isAuthenticated, false);
});


test('late registration and OTP responses cannot restore a cancelled phone session', async () => {
  const h = setup();
  let resolveRegistration;
  h.replies.push(new Promise(resolve => { resolveRegistration = resolve; }));
  const registrationRequest = h.render().register(registration);
  h.render().clearPendingAuth();
  resolveRegistration({ result: true, data: { user: { token: 'stale-token' } } });
  await assert.rejects(registrationRequest);
  await assert.rejects(h.render().verifyOtp(credentials, '1234'));

  h.replies.push({ result: true, data: { user: { token: 'pending-token' } } });
  await h.render().register(registration);
  let resolveVerification;
  h.replies.push(new Promise(resolve => { resolveVerification = resolve; }));
  const verificationRequest = h.render().verifyOtp(credentials, '1234');
  h.render().clearPendingAuth();
  resolveVerification({ result: true });
  await assert.rejects(verificationRequest);
  assert.equal(h.storage.has('token'), false);
  assert.equal(h.render().isAuthenticated, false);
});
