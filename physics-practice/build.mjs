import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url)),read=p=>fs.readFileSync(root+p,'utf8');
const font=fs.readFileSync(root+'assets/lesson-math.otf').toString('base64');
let html=read('source/lesson.html');
for(const [key,value] of Object.entries({FONT:'@font-face{font-family:"Lesson Math";src:url(data:font/otf;base64,'+font+') format("opentype");font-display:swap}',THEME:read('source/theme.css'),CSS:read('source/style.css'),CONTENT:read('source/content.js'),CORE:read('source/core.js'),UNITS:read('source/unit-typography.js').replace('export function','function'),DIAGRAMS:read('source/diagrams.js'),APP:read('source/app.js')}))html=html.replace('/*__'+key+'__*/',()=>value);
if(/\/\*__\w+__\*\//.test(html))throw Error('Unfilled placeholder');
fs.writeFileSync(root+'index.html',html);console.log('Built physics-practice/index.html');
