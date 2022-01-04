import Two from 'two.js'
import _ from 'lodash'
import { DICE_LETTERS } from './dice.js'

function main() {
  const two = new Two({ fullscreen: true }).appendTo(document.body)
  const size = Math.min(window.screen.height, window.screen.width) / 12
  addBackdrop(size)
  const dice = generateDice(two, size)
  const state = {
    dragging: null,
    offsetX: 0,
    offsetY: 0
  }

  window.addEventListener('pointerdown', (e) => pointerDown(dice, state, size, e), false);
  window.addEventListener('pointermove', (e) => pointerMove(two, state, e), false);
  window.addEventListener('pointerup', (e) => pointerUp(two, state, size, e), false);

  two.update()
}

function pointerDown(dice, state, size, e) {
  for (const die of dice) {
    if (!isClicking(die, size, e)) continue
    state.dragging = die
    state.offsetX = e.clientX - die.translation._x
    state.offsetY = e.clientY - die.translation._y
    return
  }
}

function pointerMove(two, state, e) {
  const group = state.dragging
  if (group) {
    group.position.set(e.clientX - state.offsetX, e.clientY - state.offsetY)
    two.update()
  }
}

function pointerUp(two, state, size, e) {
  const group = state.dragging
  if (group) {
    const x = e.clientX - state.offsetX
    const y = e.clientY - state.offsetY
    const snappedX = Math.round(x / size) * size
    const snappedY = Math.round(y / size) * size
    group.translation.set(snappedX, snappedY)
    state.dragging = null
    state.offsetX = null
    state.offsetY = null
    two.update()
  }
}

function isClicking(die, size, e) {
  return e.clientX > die.translation._x - (size / 2)
    && e.clientX < die.translation._x + (size / 2)
    && e.clientY > die.translation._y - (size / 2)
    && e.clientY < die.translation._y + (size / 2)
}

function generateDice(two, size) {
  const styles = {
    size: 36,
    font: 'Comic sans'
  }
  const buffer = 10
  const dice = []
  for (var i = 0; i < DICE_LETTERS.length; i++) {

    const square = two.makeRoundedRectangle(0, 0, size - buffer, size - buffer)
    square.linewidth = 3

    const letter = _.sample(DICE_LETTERS[i])
    const text = two.makeText(letter, 0, 0, styles)

    // we set the positions on the group instead of the children
    // so that we can manipulate them more easily later
    const group = two.makeGroup(square, text)
    const x = size * (i + 1)
    const y = size
    group.translation.set(x, y)
    dice.push(group)
  }
  return dice
}

function addBackdrop(size) {
  const two = new Two({
    type: Two.Types.canvas,
    width: size,
    height: size
  });

  const r = size / 5;
  const center = size / 2;

  const a = two.makeLine(center - r, center, center + r, center);
  const b = two.makeLine(center, center - r, center, center + r);

  a.stroke = b.stroke = '#000000';
  a.linewidth = b.linewidth = 0.25;

  two.update();

  const style = document.body.style;
  style.backgroundImage = `url(${two.renderer.domElement.toDataURL()})`;
  style.backgroundRepeat = 'repeat';
  style.backgroundSize = `${size}px`;

}

main()
