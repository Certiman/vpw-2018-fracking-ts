import './style.css';
import { Parser } from './parse.ts';

const terrains = await Parser.parseFile(`./src/invoer.txt`);
const solutions = await Parser.parseSolution(`./src/uitvoer.txt`);
let index = 0;
let Heuven = terrains[index];

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>Heuven Fracking Simulator</div>
    <div>Terrain number: <span id="t_index">${index}</span></div>
    <div id="terrain">
      ${Heuven.asTable()}
    </div>
    <br>
    <div>Heuven is collapsing in <span id="prediction">${Heuven.predictCollapse()} [Solution: ${solutions[index]}]</span> days</div>
    <button id="nextDay">Next Day (Cycle: ${Heuven.cycleCount})</button>
  `;

// Add click handler for the nextDay button
document.querySelector('#nextDay')?.addEventListener('click', () => {
    Heuven.nextDay();
    // Update table and button
    const terrain = document.querySelector('#terrain')!;
    const btnLabel = document.querySelector('#nextDay')!;
    const predSpan = document.querySelector('#prediction')!;
    const tIndex = document.querySelector('#t_index')!;
    terrain.innerHTML = `${Heuven.asTable()}`;
    btnLabel.textContent = `Next Day (Cycle: ${Heuven.cycleCount})`;
    // Check if terrain is collapsing
    if (Heuven.isCollapsing || Heuven.cycleCount >= solutions[index]) {
        terrain.innerHTML +=
            '<div style="color: red; font-weight: bold;">Heuven collapsed!</div>';
        btnLabel.setAttribute('disabled', 'true');
        
        setTimeout(() => {
            index++;
            if (index < terrains.length) {
                Heuven = terrains[index];
                btnLabel.textContent = `Next Day (Cycle: ${Heuven.cycleCount})`;
                btnLabel.removeAttribute('disabled');
                terrain.innerHTML = `${Heuven.asTable()}`;
                tIndex.textContent = `${index}`;
                predSpan.textContent = `${Heuven.predictCollapse()}[Solution: ${solutions[index]}]`;
            }
        }, 2000);
    }
});
