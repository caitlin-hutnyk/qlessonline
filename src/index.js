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
  }

  window.addEventListener('pointerdown', (e) => pointerDown(dice, state, size, e), false);
  window.addEventListener('pointermove', (e) => pointerMove(two, state, e), false);
  window.addEventListener('pointerup', (e) => pointerUp(two, state, e), false);

  two.update()
}

function pointerDown(dice, state, size, e) {
  for (const die of dice) {
    if (!isClicking(die, size, e)) continue
    state.dragging = die
    return
  }
}

function pointerMove(two, state, e) {
  const group = state.dragging
  if (group) {
    group.position.set(e.clientX, e.clientY)
    two.update()
  }
}

function pointerUp(two, state, e) {
  state.dragging = null
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

    const x = size * (i + 1)
    const y = size
    const square = two.makeRoundedRectangle(0, 0, size - buffer, size - buffer)
    square.linewidth = 3

    const letter = _.sample(DICE_LETTERS[i])
    const text = two.makeText(letter, 0, 0, styles)

    const group = two.makeGroup(square, text)
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
