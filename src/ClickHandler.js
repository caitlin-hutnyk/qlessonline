class ClickHandler {
  constructor(two, dice, size) {
    this.two = two
    this.dice = dice
    this.size = size
    this.state = {
      dragging: null,
      offsetX: 0,
      offsetY: 0
    }
  }

  pointerDown(e) {
    for (const die of this.dice) {
      if (!this.isClicking(die, e)) continue
      this.state.dragging = die
      this.state.offsetX = e.clientX - die.translation._x
      this.state.offsetY = e.clientY - die.translation._y
      return
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
      const snappedX = Math.round(x / this.size) * this.size
      const snappedY = Math.round(y / this.size) * this.size
      group.translation.set(snappedX, snappedY)
      this.state.dragging = null
      this.state.offsetX = null
      this.state.offsetY = null
      this.two.update()
    }
  }

  isClicking(die, e) {
    return e.clientX > die.translation._x - (this.size / 2)
      && e.clientX < die.translation._x + (this.size / 2)
      && e.clientY > die.translation._y - (this.size / 2)
      && e.clientY < die.translation._y + (this.size / 2)
  }
}

export default ClickHandler