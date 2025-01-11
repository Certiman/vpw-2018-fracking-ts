import './style.css'
import { Terrain } from './terrain.ts'

const Heuven = new Terrain([
  '*****..***...',
  '*****.*****..',
  '*****.*****..',
  '.***..*****..',
])

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>Heuven Fracking Simulator</div>
  <div id="terrain">
    ${Heuven.asTable()}
  </div>
  <button id="nextDay">Next Day (Cycle: ${Heuven.cycleCount})</button>
`

// Add click handler for the nextDay button
document.querySelector('#nextDay')?.addEventListener('click', () => {
  Heuven.nextDay()
  // Update table and button
  const terrain = document.querySelector('#terrain')!
  terrain.innerHTML = `${Heuven.asTable()}`
  const btnLabel = document.querySelector('#nextDay')!
  btnLabel.textContent = `Next Day (Cycle: ${Heuven.cycleCount})`
  // Check if terrain is collapsing
  if (Heuven.isCollapsing) {
    terrain.innerHTML += '<div style="color: red; font-weight: bold;">Heuven is collapsing!</div>'
    btnLabel.setAttribute('disabled', 'true')
  }
})


