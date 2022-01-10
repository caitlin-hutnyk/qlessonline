import Two from 'two.js'
import _ from 'lodash'
import { DICE_LETTERS, X_GRID_LIMIT, Y_GRID_LIMIT } from './constants.js'
import ClickHandler from './ClickHandler.js'

function main() {
  const two = new Two({ fullscreen: true }).appendTo(document.body)
  // const size = Math.min(window.screen.height, window.screen.width) / 12 * 1.3
  const size = Math.min(document.body.clientHeight / 7, document.body.clientWidth / 15.5)
  addBackground(two, size)
  const dice = generateDice(two, size)
  const sideBar = addSideBar(two, size)

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

function addBackground(two, size) {
  const len = size / 5
  const center = size / 2

  for (var i = 0; i < X_GRID_LIMIT + 1; i++) {
    for (var j = 0; j < Y_GRID_LIMIT + 1; j++) {
      const a = two.makeLine(size * i + center - len, center + size * j, center + size * i + len, center + size * j);
      const b = two.makeLine(center + size * i, center + size * j - len, center + size * i, center + size * j + len);

      a.stroke = b.stroke = '#000000';
      a.linewidth = b.linewidth = 0.25;

      two.update();
    }
  }
}

function addSideBar(two, size) {
  const titleSquare = addTitleSquare(two, size)
  const buyButton = addBuyButton(two, size)
  const githubButton = addGithub(two, size)

  return [titleSquare, buyButton, githubButton]
}

function addTitleSquare(two, size) {
  const styles = {
    size: 36,
    font: 'Comic sans'
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * 3 - buffer, size * 2 - buffer)
  square.linewidth = 3

  const text = two.makeText('Q-less Online', 0, 0, styles)

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 1.5
  group.translation.set(x, y)
}

function addBuyButton(two, size) {
  const styles = {
    size: 30,
    font: 'Comic sans'
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * 3 - buffer, size - buffer)
  square.linewidth = 3

  const text = two.makeText('Buy the game', 0, 0, styles)

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 3
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.addEventListener('click', _ => window.open('https://www.q-lessgame.com/', '_blank'), false)
}

function addGithub(two, size) {
  const styles = {
    size: 30,
    font: 'Comic sans'
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * 3 - buffer, size - buffer)
  square.linewidth = 3

  const text = two.makeText('Github', 0, 0, styles)

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 4
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.addEventListener('click', _ => window.open('https://github.com/caitlin-hutnyk/qlessonline', '_blank'), false)
}

main()
