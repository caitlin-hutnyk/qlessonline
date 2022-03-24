import Two from 'two.js'
import _ from 'lodash'
import { DICE_LETTERS, X_GRID_LIMIT, Y_GRID_LIMIT, WHITE, BLACK, GREY, YELLOW, GREEN } from './constants.js'
import ClickHandler from './ClickHandler.js'

function main() {
  const two = new Two({ fullscreen: true }).appendTo(document.body)
  const size = Math.min(document.body.clientHeight / 7, document.body.clientWidth / 15.5)
  addBackground(two, size)
  const dice = generateDice(two, size)

  const clickHandler = new ClickHandler(two, dice, size)
  addSideBar(two, size, clickHandler)
  addWinPanel(two, size)

  window.addEventListener('pointermove', clickHandler.pointerMove.bind(clickHandler), false);
  window.addEventListener('pointerup', clickHandler.pointerUp.bind(clickHandler), false);

  document.body.style.backgroundColor = "#2e2e2e"

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
    square.fill = BLACK
    text.stroke = WHITE
    text.fill = WHITE

    // we set the positions on the group instead of the children
    // so that we can manipulate them more easily later
    const group = two.makeGroup(square, text)
    const x = size * (i + 1)
    const y = size
    group.translation.set(x, y)
    dice.push(group)
  }
  two.update()
  for (const die of dice) {
    die._renderer.elem.style.cursor = 'grabbing'
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

      a.stroke = b.stroke = WHITE;
      a.linewidth = b.linewidth = 0.25;

      two.update();
    }
  }
}

function addSideBar(two, size, clickHandler) {
  const titleSquare = addTitleSquare(two, size, clickHandler)
  const buyButton = addBuyButton(two, size)
  const githubButton = addGithub(two, size)
  const newGameButton = addNewGameButton(two, size)
  const refreshButton = addRestartButton(two, size, clickHandler)
  const aboutPanel = addAboutPanel(two, size)

  return [titleSquare, buyButton, githubButton, newGameButton, refreshButton, aboutPanel]
}

function addTitleSquare(two, size, clickHandler) {
  const styles = {
    size: 36,
    font: 'Comic sans'
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * 3 - buffer, size * 2 - buffer)
  square.linewidth = 3

  const text = two.makeText('Q-less Online', 0, 0, styles)
  square.fill = BLACK
  text.stroke = WHITE
  text.fill = WHITE

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 1.5
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.addEventListener('mouseenter', _ => { 
    text.value = '?'
    two.update()
  }, false)
  group._renderer.elem.addEventListener('mouseleave', _ => {
    text.value = 'Q-less Online'
    two.update()
  }, false)

  document.addEventListener('click', event => {
    const aboutPanel = document.getElementsByClassName('aboutPanel')[0]
    const showButton = group._renderer.elem
    if (aboutPanel.style.display === 'block' && !aboutPanel.contains(event.target)) {
      aboutPanel.style.display = 'none'
      clickHandler.unpauseGame()
    } else if (aboutPanel.style.display === 'none' && showButton.contains(event.target)) {
      aboutPanel.style.display = 'block'
      clickHandler.pauseGame()
    }
  })

  group._renderer.elem.style.cursor = 'pointer'
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
  square.fill = BLACK
  text.stroke = WHITE
  text.fill = WHITE

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 3
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.addEventListener('click', _ => window.open('https://www.q-lessgame.com/', '_blank'), false)
  group._renderer.elem.style.cursor = 'pointer'
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
  square.fill = BLACK
  text.stroke = WHITE
  text.fill = WHITE

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 4
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.addEventListener('click', _ => window.open('https://github.com/caitlin-hutnyk/qlessonline', '_blank'), false)
  group._renderer.elem.style.cursor = 'pointer'
}

function addNewGameButton(two, size) {
  const styles = {
    size: 30,
    font: 'Comic sans'
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * 3 - buffer, size - buffer)
  square.linewidth = 3

  const text = two.makeText('New Game', 0, 0, styles)
  square.fill = BLACK
  text.stroke = WHITE
  text.fill = WHITE

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 5
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.addEventListener('click', _ => location.reload(), false)
  group._renderer.elem.style.cursor = 'pointer'
}

function addRestartButton(two, size, clickHandler) {
  const styles = {
    size: 30,
    font: 'Comic sans'
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * 3 - buffer, size - buffer)
  square.linewidth = 3

  const text = two.makeText('Restart', 0, 0, styles)
  square.fill = BLACK
  text.stroke = WHITE
  text.fill = WHITE

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT + 2)
  const y = size * 6
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.addEventListener('click', _ => clickHandler.restart(), false)
  group._renderer.elem.style.cursor = 'pointer'
}

function addWinPanel(two, size) {
  const styles = {
    size: 30,
    font: 'Comic sans'
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * X_GRID_LIMIT / 2 - buffer, size * Y_GRID_LIMIT / 2 - buffer)
  square.linewidth = 3

  const text = two.makeText('You win!', 0, 0, styles)
  square.fill = BLACK
  text.stroke = WHITE
  text.fill = WHITE

  const group = two.makeGroup(square, text)
  const x = size * (X_GRID_LIMIT / 2 + 0.5)
  const y = size * (Y_GRID_LIMIT / 2 + 0.5)
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.classList.add('winPanel')
  group._renderer.elem.style.display = 'none'
}

function addAboutPanel(two, size) {
  const styles = {
    size: 30,
    font: 'Comic sans',
  }
  const buffer = 10
  const square = two.makeRoundedRectangle(0, 0, size * 8 - buffer, size * 4 - buffer)
  square.linewidth = 3

  const t1 = two.makeText('Click and drag the letters to create words.', 0, -90, styles)
  const t2 = two.makeText('Only words with 3 or more letters are allowed!', 0, -30, styles)
  const t3 = two.makeText('Valid words will turn tiles green', 0, 30, styles)
  const t4 = two.makeText('Make a board with all 12 letters to win!', 0, 90, styles)
  square.fill = BLACK
  square.stroke = BLACK

  t1.stroke = WHITE
  t2.stroke = YELLOW
  t3.stroke = GREEN
  t4.stroke = GREEN

  t1.fill = WHITE
  t2.fill = YELLOW
  t3.fill = GREEN
  t4.fill = GREEN

  const group = two.makeGroup(square, t1, t2, t3, t4)
  const x = size * (X_GRID_LIMIT / 2 + 0.5)
  const y = size * (Y_GRID_LIMIT / 2 + 0.5)
  group.translation.set(x, y)

  two.update()

  group._renderer.elem.classList.add('aboutPanel')
  group._renderer.elem.style.display = 'none'
}

main()
