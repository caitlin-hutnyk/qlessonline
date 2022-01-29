import { X_GRID_LIMIT, Y_GRID_LIMIT } from './constants.js'
import Sound, { SOUND_TYPES } from './Sound.js'

class ClickHandler {
  constructor(two, dice, size) {
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
    this.grid = Array.from(Array(X_GRID_LIMIT + 1), _ => Array(Y_GRID_LIMIT + 1).fill(false))
    for (const die of dice) {
      const [gridX, gridY] = this.nearestSquare(die.translation._x, die.translation._y)
      this.grid[gridX][gridY] = true
    }
  }

  pointerDown(e) {
    for (const die of this.dice) {
      if (this.isClicking(die, e)) {
        this.state.dragging = die
        this.state.offsetX = e.clientX - die.translation._x
        this.state.offsetY = e.clientY - die.translation._y

        const [gridX, gridY] = this.nearestSquare(die.translation._x, die.translation._y)
        this.state.lastGridX = gridX
        this.state.lastGridY = gridY

        this.grid[gridX][gridY] = false
        return
      } 
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
      this.two.update()
    }
  }
  
  pointerUp(e) {
    const group = this.state.dragging
    if (group) {
      const x = e.clientX - this.state.offsetX
      const y = e.clientY - this.state.offsetY
      const [gridX, gridY] = this.nearestSquare(x, y)

      if (this.isValidSquare(gridX, gridY)) {
        group.translation.set(gridX * this.size, gridY * this.size)
        this.grid[gridX][gridY] = true
      } else {
        group.translation.set(this.state.lastGridX * this.size, this.state.lastGridY * this.size)
        this.grid[this.state.lastGridX][this.state.lastGridY] = true
      }
      
      Sound.playSound(SOUND_TYPES.DIE_DROPPED)
      this.resetState()
      this.two.update()
    }
  }

  isClicking(die, e) {
    return e.clientX > die.translation._x - (this.size / 2)
      && e.clientX < die.translation._x + (this.size / 2)
      && e.clientY > die.translation._y - (this.size / 2)
      && e.clientY < die.translation._y + (this.size / 2)
  }

  nearestSquare(x, y) {
    return [Math.round(x / this.size), Math.round(y / this.size)]
  }

  isValidSquare(gridX, gridY) {
    return gridX <= X_GRID_LIMIT && gridY <= Y_GRID_LIMIT && !(this.grid[gridX][gridY]) 
  }

  resetState() {
    this.state.dragging = null
    this.state.offsetX = null
    this.state.offsetY = null
    this.state.lastGridX = null
    this.state.lastGridY = null
  }
}

export default ClickHandler