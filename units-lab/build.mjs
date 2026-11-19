import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
const read=path=>fs.readFileSync(root+path,'utf8');
const font=fs.readFileSync(root+'assets/lesson-math.otf').toString('base64');
const mathFont='@font-face{font-family:"Lesson Math";src:url(data:font/otf;base64,'+font+') format("opentype");font-weight:400;font-style:normal;font-display:swap}';
const out=read('source/lesson.html')
 .replace('/*__MATH_FONT__*/',mathFont)
 .replace('/*__THEME__*/',read('source/theme.css'))
 .replace('/*__CORE__*/',read('source/conversion-core.js'))
 .replace('/*__UNITS__*/',read('source/unit-typography.js').replace('export function','function'))
 .replace('/*__QUIZ__*/',read('source/questions.js'))
 .replace('href="with-skill.html"','href="index.html"');
if(/\/\*__(?:MATH_FONT|THEME|CORE|UNITS|QUIZ)__\*\//.test(out))throw Error('Unfilled lesson placeholder');
fs.writeFileSync(root+'index.html',out);
console.log('Built units-lab/index.html');
