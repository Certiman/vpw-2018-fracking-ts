import { Parser } from './parse.ts';
import path from 'path';

const baseDir = process.cwd();
const inputUrl = new URL(path.join(baseDir, 'src', 'invoer.txt'), import.meta.url);
const outputUrl = new URL(path.join(baseDir, 'src', 'uitvoer.txt'), import.meta.url);

const terrains = await Parser.parseFile(inputUrl.href);
const solution = await Parser.parseSolution(outputUrl.href);

for (let i = 0; i < terrains.length; i++) {
    let City = terrains[i];
    let prediction = City.predictCollapse();
    if (prediction !== solution[i]) {
        console.log(`Test failed for terrain ${i + 1}: expected ${solution[i]}, got ${prediction}`);
    }
}
