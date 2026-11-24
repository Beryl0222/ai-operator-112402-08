import {readFileSync} from 'node:fs';
import * as input from './inputs/taxon-assets.mjs';

const source=JSON.parse(readFileSync(new URL('./inputs/taxon-assets.json',import.meta.url),'utf8'));
console.log(JSON.stringify({名称:'目录节点和坐标版本',首项:source['dimension'],字段:Object.keys(source),取数函数:Object.keys(input)},null,2));
