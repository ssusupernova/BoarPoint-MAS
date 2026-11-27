/* global __dirname */
// Run: node --test tests/provider-validation.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');
const filename = path.resolve(__dirname, '../src/features/provider/state.tsx');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = module.paths;
loaded._compile(compiled, filename);
const { seedListings, validateListing } = loaded.exports;
const valid = () => seedListings()[0];
test('sample listings pass complete review', () => {
  for (const listing of seedListings()) assert.equal(validateListing(listing, 'review'), '');
});
test('impossible dates and move-in outside availability are rejected', () => {
  for (const moveIn of ['2026-02-30', '2026-11-30', '2027-12-01'])
    assert.ok(validateListing({ ...valid(), moveIn }, 'terms'));
});
test('private floors cannot exceed public terms', () => {
  assert.ok(validateListing({ ...valid(), minRent: '3501' }, 'agent'));
  assert.ok(validateListing({ ...valid(), minDeposit: '3501' }, 'agent'));
});
test('preferred lease must fit private boundaries', () => {
  assert.ok(validateListing({ ...valid(), minLease: '7' }, 'agent'));
  assert.ok(validateListing({ ...valid(), maxLease: '5' }, 'agent'));
});
test('weights require nonnegative integer values totaling 100', () => {
  for (const weights of [['40','20','20','19'], ['101','-1','0','0'], ['40.5','19.5','20','20']])
    assert.ok(validateListing({ ...valid(), weights }, 'agent'));
  assert.equal(validateListing({ ...valid(), weights: ['100','0','0','0'] }, 'agent'), '');
});
test('final review validates all steps, including edited earlier fields', () => {
  assert.ok(validateListing({ ...valid(), address: ' ' }, 'review'));
  assert.ok(validateListing({ ...valid(), rent: 'abc' }, 'review'));
  assert.ok(validateListing({ ...valid(), moveUntil: '2027-12-01' }, 'review'));
});
