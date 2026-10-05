const test = require("node:test");
const assert = require("node:assert/strict");
const { isAccessAllowedAt } = require("../middlewares/accessSchedule.middleware");

test("aplica el horario Lima de lunes a viernes", () => {
  assert.equal(isAccessAllowedAt(new Date("2026-10-05T12:00:00Z")), true); // 07:00 Lima
  assert.equal(isAccessAllowedAt(new Date("2026-10-06T00:59:00Z")), true); // 19:59 Lima
  assert.equal(isAccessAllowedAt(new Date("2026-10-06T01:00:00Z")), false); // 20:00 Lima
});

test("aplica el horario Lima de sábado", () => {
  assert.equal(isAccessAllowedAt(new Date("2026-10-10T13:29:00Z")), false); // 08:29 Lima
  assert.equal(isAccessAllowedAt(new Date("2026-10-10T13:30:00Z")), true); // 08:30 Lima
  assert.equal(isAccessAllowedAt(new Date("2026-10-10T17:59:00Z")), true); // 12:59 Lima
  assert.equal(isAccessAllowedAt(new Date("2026-10-10T18:00:00Z")), false); // 13:00 Lima
});

test("bloquea todos los domingos", () => {
  assert.equal(isAccessAllowedAt(new Date("2026-10-11T15:00:00Z")), false);
});
