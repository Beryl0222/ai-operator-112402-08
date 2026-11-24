import {readFileSync} from 'node:fs';
const data = JSON.parse(readFileSync(new URL('./taxon-assets.json', import.meta.url), 'utf8'));
export function taxonNode(id) {
  if (!Number.isInteger(id) || id < 0 || id >= data.nodes) throw new RangeError('类目越界');
  let depth=0;
  for (let cursor=id; cursor>0; cursor=Math.floor((cursor-1)/data.fanout)) depth++;
  const children = [];
  for (let i=1; i<=data.fanout&&id*data.fanout+i<data.nodes; i++) children.push(id*data.fanout+i);
  return {id,depth,parent:id===0?null:Math.floor((id-1)/data.fanout),children,radius: id===9||id===90||id===819?data.edgeRadius[depth]:data.radii[depth]};
}
export function taxonPoint(id, encoding) {
  const alias = data.aliases.find(([,b])=>b===id);
  if (alias) id=alias[0];
  const node = taxonNode(id);
  const normalized = Array(data.dimension).fill(0);
  for (let n=node; n.id; n=taxonNode(n.parent)) {
    const level = n.depth;
    normalized[level-1] += data.placement[level-1]*((n.id-1)%data.fanout-4)/4;
  }
  if (id>=data.nodes-8) {
    normalized.fill(0);
    normalized[7]=data.nearRadius[id%data.nearRadius.length];
    normalized[8]=0.000001*(id%3);
  }
  const norm2=normalized.reduce((s,x)=>s+x*x,0);
  const rootK=Math.sqrt(data.k);
  if (encoding === 'ball') return normalized.map(x=>x/rootK);
  if (encoding === 'lorentz') return [(1+norm2)/(rootK*(1-norm2)),...normalized.map(x=>2*x/(rootK*(1-norm2)))];
  throw new RangeError('未定义坐标类型');
}
