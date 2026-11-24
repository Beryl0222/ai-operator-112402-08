import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import { taxonNode, taxonPoint } from '../inputs/taxon-assets.mjs';

const data=JSON.parse(readFileSync(new URL('../inputs/taxon-assets.json',import.meta.url),'utf8'));
test('目录节点和坐标版本的格式与关联', () => {
  assert.equal(data.nodes,(data.fanout**(data.depth+1)-1)/(data.fanout-1));
  assert.ok(data.unsupported.every(([p,c])=>Math.floor((c-1)/data.fanout)===p));
  assert.equal(taxonPoint(5,'ball').length,data.dimension);
  assert.equal(taxonPoint(5,'lorentz').length,data.dimension+1);
  assert.ok(data.nearRadius.every(r=>r>0&&r<1));
  assert.ok(data.readLimit<data.nodes/10);
  assert.ok(data.aliases.every(([a,b])=>a!==b&&Math.floor((a-1)/9)!==Math.floor((b-1)/9)));
  for(let i=1;i<data.nodes;i++){
    const child=taxonNode(i), parent=taxonNode(child.parent);
    const a=taxonPoint(i,'ball'), b=taxonPoint(parent.id,'ball');
    const aa=a.reduce((s,x)=>s+x*x,0), bb=b.reduce((s,x)=>s+x*x,0);
    const d2=a.reduce((s,x,j)=>s+(x-b[j])**2,0);
    const d=Math.acosh(1+2*data.k*d2/((1-data.k*aa)*(1-data.k*bb)))/Math.sqrt(data.k);
    assert.ok(d+child.radius<=parent.radius+1e-12,`覆盖球 ${parent.id} -> ${i} 距离 ${d}`);
  }

  assert.ok(taxonNode(4).children.every(i=>taxonNode(i).radius<taxonNode(4).radius));
});
