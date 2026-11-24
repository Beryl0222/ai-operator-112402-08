import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const d = JSON.parse(readFileSync(new URL('../inputs/session.json', import.meta.url), 'utf8'));

test("相机条带按矩形覆盖", () => {
  assert.ok(d.fragments.every(f=>f.codes.length===(f.rect[2]-f.rect[0])*(f.rect[3]-f.rect[1])*f.channels));
});

test("真实接缝与外缘跨相位", () => {
  assert.ok(d.fragments[1].rect[0]-d.origin[0]===3 && d.extent[3]-d.origin[1]===3);
});

test("真实的两种量化来源和不同接收能力", () => {
  assert.ok(d.profiles[0].allow.length!==d.profiles[1].allow.length && d.fragments[0].scale!==d.fragments[1].scale);
});
