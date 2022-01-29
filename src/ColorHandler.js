import _ from 'lodash'
import { X_GRID_LIMIT, Y_GRID_LIMIT, BLACK, GREEN, YELLOW, VALID_WORDS } from './constants.js'

class ColorHandler {
  constructor(grid, dice) {
    this.grid = grid
    this.dice = dice
  }

  updateColors() {
    for (const die of this.dice) {
      die.children[0].fill = BLACK
      die.children[0].stroke = BLACK
    }
    // rows
    for(var y = 1; y <= Y_GRID_LIMIT; y++) {
      var currentWord = ''
      var currentGroups = []
      for(var x = 1; x <= X_GRID_LIMIT; x++) {
        if (this.grid[x][y] === null) {
          this.updateWord(currentWord, currentGroups)
          currentWord = ''
          currentGroups = []
        } else {
          const group = this.grid[x][y]
          currentWord = currentWord.concat(group.children[1].value)
          currentGroups.push(group)
        }
      }
      this.updateWord(currentWord, currentGroups)
    }

    //columns
    for(var x = 1; x <= X_GRID_LIMIT; x++) {
      var currentWord = ''
      var currentGroups = []
      for(var y = 1; y <= Y_GRID_LIMIT; y++) {
        if (this.grid[x][y] === null) {
          this.updateWord(currentWord, currentGroups)
          this.two.update()
          currentWord = ''
          currentGroups = []
        } else {
          const group = this.grid[x][y]
          currentWord = currentWord.concat(group.children[1].value)
          currentGroups.push(group)
        }
      }
      this.updateWord(currentWord, currentGroups)
    }
  }

  updateWord(word, groups) {
    if (VALID_WORDS.has(word.toLowerCase())) {
      for (const group of groups) {
        if (group.children[0].fill === BLACK) {
          group.children[0].fill = GREEN
          group.children[0].stroke = GREEN
        }
      }
    } else {
      if (word.length > 1) {
        // the .every() line stops weird cases where a word is partly black and partly yellow
        if (_.every(groups, (group) => group.hasMoved)) {
          for (const group of groups) {
            if (group.hasMoved) {
              group.children[0].fill = YELLOW
              group.children[0].stroke = YELLOW
            }
          }
        }
      }
    }
  }
}

export default ColorHandler