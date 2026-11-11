const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:1/test';
process.env.JWT_SECRET = 'test-only-secret';
process.env.CRON_SECRET = 'test-only-cron-secret';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Exercise the real Nest controllers over HTTP without changing a database.
globalThis.carrosPrisma = prisma;
let configured = true;
prisma.configsite.findFirst = async () => ({ id: 1, whatsapp: '554200000000', apiUrl: configured ? 'https://feed.example/stock' : null, apiType: 'AUTOCERTO' });
let locked = true;
let syncResult = { success: true, totalProcessados: 2 };
let rollbacks = 0;
let syncCalls = 0;
prisma.$transaction = async (callback) => {
  try { return await callback({ $queryRaw: async () => [{ locked }] }); }
  catch (error) { rollbacks++; throw error; }
};
const { VehiclesService } = require('../dist/vehicles/vehicles.service');
VehiclesService.prototype.processFromJson = async (url, type, tx) => {
  syncCalls++;
  assert.equal(url, 'https://feed.example/stock');
  assert.equal(type, 'AUTOCERTO');
  assert.ok(tx.$queryRaw);
  return syncResult;
};
prisma.analytics_log.create = async ({ data }) => ({ id: 1, ...data });
prisma.user.findUnique = async ({ where }) => {
  assert.equal(where.email, 'smoke@example.com');
  return null;
};
prisma.vehicle.findMany = async ({ where }) => {
  assert.equal(where.marca.contains, 'Ford');
  return [{ id: 1, marca: 'Ford', modelo: 'Ka' }];
};
const { handler } = require('../dist/serverless');

test('Nest runs inside the Next API adapter with JSON, query strings and concurrent startup', async () => {
  const server = http.createServer((req, res) => {
    handler(req, res).catch(error => { res.statusCode = 500; res.end(error.message); });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  try {
    const [config, vehicles] = await Promise.all([
      fetch(`${base}/config`), fetch(`${base}/vehicles?marca=Ford`),
    ]);
    assert.equal(config.status, 200);
    assert.equal((await config.json()).whatsapp, '554200000000');
    assert.equal(vehicles.status, 200);
    assert.equal((await vehicles.json())[0].modelo, 'Ka');
    const log = await fetch(`${base}/analytics/log`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'page_view', url: '/estoque' }),
    });
    assert.equal(log.status, 201);
    assert.equal((await log.json()).url, '/estoque');
    const login = await fetch(`${base}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoke@example.com', senha: 'invalid' }),
    });
    assert.equal(login.status, 401);
    assert.equal((await fetch(`${base}/not-found`)).status, 404);
    assert.equal((await fetch(`${base}/cron/sync-stock`)).status, 401);
    assert.equal((await fetch(`${base}/cron/sync-stock`, { headers: { authorization: 'Bearer wrong' } })).status, 401);
    assert.equal(syncCalls, 0);
    const headers = { authorization: `Bearer ${process.env.CRON_SECRET}` };
    const sync = await fetch(`${base}/cron/sync-stock?url=https://untrusted.example`, { headers });
    assert.equal(sync.status, 200);
    assert.equal(sync.headers.get('cache-control'), 'no-store');
    assert.equal((await sync.json()).totalProcessados, 2);
    locked = false;
    assert.equal((await fetch(`${base}/cron/sync-stock`, { headers })).status, 409);
    assert.equal(syncCalls, 1);
    locked = true;
    syncResult = { success: false, message: 'Upstream failure' };
    assert.equal((await fetch(`${base}/cron/sync-stock`, { headers })).status, 502);
    assert.equal(rollbacks, 2);
    configured = false;
    assert.equal((await fetch(`${base}/cron/sync-stock`, { headers })).status, 503);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect();
  }
});
