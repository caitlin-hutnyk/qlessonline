class ClickHandler {
  constructor(two, dice, size) {
    this.two = two
    this.dice = dice
    this.size = size
    this.state = {
      dragging: null,
      offsetX: 0,
      offsetY: 0,
      originalGridX: null,
      originalGridY: null,
    }
    this.grid = Array.from(Array(13), _ => Array(7).fill(false))
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
        this.state.originalGridX = gridX
        this.state.originalGridY = gridY

        this.grid[gridX][gridY] = false
        return
      } 
    }
  }
  
  pointerMove(e) {
    const group = this.state.dragging
    if (group) {
      group.position.set(e.clientX - this.state.offsetX, e.clientY - this.state.offsetY)
      this.two.update()
    }
  }
  
  pointerUp(e) {
    const group = this.state.dragging
    if (group) {
      const x = e.clientX - this.state.offsetX
      const y = e.clientY - this.state.offsetY
      const [gridX, gridY] = this.nearestSquare(x, y)

      if (!this.grid[gridX][gridY]) {
        group.translation.set(gridX * this.size, gridY * this.size)
        this.grid[gridX][gridY] = true
      } else {
        group.translation.set(this.state.originalGridX * this.size, this.state.originalGridY * this.size)
        this.grid[this.state.originalGridX][this.state.originalGridY] = true
      }
      
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

  resetState() {
    this.state.dragging = null
    this.state.offsetX = null
    this.state.offsetY = null
    this.state.originalGridX = null
    this.state.originalGridY = null
  }
}

export default ClickHandler