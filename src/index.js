import Two from 'two.js'
import { dice } from './dice.js'
import _ from 'lodash'

function main() {
  const two = init()
  const size = Math.min(window.screen.height, window.screen.width) / 12
  addBackdrop(size)
  rollDice(two, size)

  two.update()
}

function rollDice(two, size) {
  for (const die of dice) {
    const letter = sample(die)
    console.log(letter)
    two.makeRectangle(0, 0, size, size)
  }
}

function init() {
  const params = {
    fullscreen: false
  }
  const elem = document.body
  console.log(elem)
  return new Two(params).appendTo(elem)
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

// // Two.js has convenient methods to make shapes and insert them into the scene.
// var radius = 50;
// var x = two.width * 0.5;
// var y = two.height * 0.5 - radius * 1.25;
// var circle = two.makeCircle(x, y, radius);

// y = two.height * 0.5 + radius * 1.25;
// var width = 100;
// var height = 100;
// var rect = two.makeRectangle(x, y, width, height);

// // The object returned has many stylable properties:
// circle.fill = '#FF8000';
// // And accepts all valid CSS color:
// circle.stroke = 'orangered';
// circle.linewidth = 5;

// rect.fill = 'rgb(0, 200, 255)';
// rect.opacity = 0.75;
// rect.noStroke();

// // Don’t forget to tell two to draw everything to the screen
// two.update();
