import _ from 'lodash'
import { X_GRID_LIMIT, Y_GRID_LIMIT, BLACK } from './constants.js'
import Sound, { SOUND_TYPES } from './Sound.js'
import ColorHandler from './ColorHandler.js'

class ClickHandler {
  constructor(two, dice, size) {
    this.inGame = true
    this.two = two
    this.dice = dice
    this.size = size
    this.state = {
      dragging: null,
      offsetX: 0,
      offsetY: 0,
      lastGridX: null,
      lastGridY: null,
    }
    this.grid = Array.from(Array(X_GRID_LIMIT + 1), _ => Array(Y_GRID_LIMIT + 1).fill(null))
    for (const die of dice) {
      const [gridX, gridY] = this.nearestSquare(die.translation._x, die.translation._y)
      this.grid[gridX][gridY] = die
      die.hasMoved = false
      die._renderer.elem.addEventListener('mousedown', e => this.setAsClicked(die, e), false)
    }
    this.colorHandler = new ColorHandler(this.two, this.grid, this.dice)
    this.updateAndCheckWin()
  }

  setAsClicked(die, e) {
    if (this.inGame) {
      this.state.dragging = die
      this.state.offsetX = e.clientX - die.translation._x
      this.state.offsetY = e.clientY - die.translation._y

      const [gridX, gridY] = this.nearestSquare(die.translation._x, die.translation._y)
      this.state.lastGridX = gridX
      this.state.lastGridY = gridY

      this.grid[gridX][gridY] = null
    }
  }
  
  pointerMove(e) {
    const group = this.state.dragging
    if (group) {
      const x = e.clientX - this.state.offsetX
      const y = e.clientY - this.state.offsetY

      const [gridX, gridY] = this.nearestSquare(x, y)
      if (this.isValidSquare(gridX, gridY)) {
        this.state.lastGridX = gridX
        this.state.lastGridY = gridY
      }

      group.position.set(x, y)
      this.updateAndCheckWin()
      this.two.update()
    }
  }
  
  pointerUp(e) {
    const group = this.state.dragging
    if (group) {
      group.hasMoved = true
      const x = e.clientX - this.state.offsetX
      const y = e.clientY - this.state.offsetY
      const [gridX, gridY] = this.nearestSquare(x, y)

      if (this.isValidSquare(gridX, gridY)) {
        group.translation.set(gridX * this.size, gridY * this.size)
        this.grid[gridX][gridY] = group
      } else {
        group.translation.set(this.state.lastGridX * this.size, this.state.lastGridY * this.size)
        this.grid[this.state.lastGridX][this.state.lastGridY] = group
      }
      
      Sound.playSound(SOUND_TYPES.DIE_DROPPED)
      this.resetState()
      
      this.two.update()
      this.updateAndCheckWin()

      this.two.update()
    }
  }

  nearestSquare(x, y) {
    return [Math.round(x / this.size), Math.round(y / this.size)]
  }

  isValidSquare(gridX, gridY) {
    return gridX <= X_GRID_LIMIT && gridY <= Y_GRID_LIMIT && (this.grid[gridX][gridY] === null) 
  }

  resetState() {
    this.state.dragging = null
    this.state.offsetX = null
    this.state.offsetY = null
    this.state.lastGridX = null
    this.state.lastGridY = null
  }

  restart() {
    for (var i = 0; i < this.dice.length; i++) {
      const die = this.dice[i]
      const [oldGridX, oldGridY] = this.nearestSquare(die.translation._x, die.translation._y)
      const newGridX = i + 1
      const newGridY = 1
      die.position.set(newGridX * this.size, newGridY * this.size)
      die.hasMoved = false

      this.grid[newGridX][newGridY] = die
      this.grid[oldGridX][oldGridY] = null

    }
    this.updateAndCheckWin()
    this.two.update()
  }

  updateAndCheckWin() {
    const win = this.colorHandler.updateColors()
    if (win) {
      // document.getElementsByClassName('winPanel')[0].style.display = 'block'
      // this.pauseGame()
    }
  }

  pauseGame() {
    this.inGame = false
  }

  unpauseGame() {
    this.inGame = true
  }
}

export default ClickHandler