import Two from 'two.js'
import _ from 'lodash'
import { DICE_LETTERS } from './dice.js'
import ClickHandler from './ClickHandler.js'

function main() {
  const two = new Two({ fullscreen: true }).appendTo(document.body)
  const size = Math.min(window.screen.height, window.screen.width) / 12
  addBackdrop(size)
  const dice = generateDice(two, size)

  const clickHandler = new ClickHandler(two, dice, size)

  window.addEventListener('pointerdown', clickHandler.pointerDown.bind(clickHandler), false);
  window.addEventListener('pointermove', clickHandler.pointerMove.bind(clickHandler), false);
  window.addEventListener('pointerup', clickHandler.pointerUp.bind(clickHandler), false);

  two.update()
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
