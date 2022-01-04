import Two from 'https://cdn.skypack.dev/two.js@latest';

addBackdrop(25);

const radius = 40,
      editColor = 'rgb(79, 128, 255)',
      mouse = new Two.Vector(),
      temp = new Two.Vector();

const two = new Two({
  type: Two.Types.canvas,
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

let cx, cy, current = null, isDragging = false;

let svg = document.querySelector('svg');
svg.style.display = 'none';

svg = two.interpret(svg);
svg.center();
svg.linewidth = radius;
svg.cap = svg.join = 'round';
svg.noFill().stroke = '#333';

const points = new Two.Points();
points.size = radius / 4;
points.noStroke().fill = editColor;

for (let i = 0; i < svg.children.length; i++) {

  const child = svg.children[i];
  const vertices = child.vertices;
  
  for (let j = 0; j < vertices.length; j++) {

    const v = child.vertices[j];

    v.relative = false;
    v.controls.left.add(v);
    v.controls.right.add(v);

    if (j === 0 || j === vertices.length - 1) {

      points.vertices.push(v);

    } else {

      points.vertices.push(v, v.controls.left, v.controls.right);
      const vertices = [v.controls.left, v.clone(), v.controls.right];
      const line = new Two.Path(vertices);
      line.noFill().stroke = editColor;
      line.linewidth = 2;

      attach(v, vertices[1]);

      two.add(line);

    }

  }

}

two.add(points);

two.bind('resize', resize);
resize();

window.addEventListener('pointerdown', pointerdown, false);
window.addEventListener('pointermove', pointermove, false);
window.addEventListener('pointerup', pointerup, false);

function resize() {
  cx = two.width * 0.5;
  cy = two.height * 0.5;
  two.scene.position.set(cx, cy);
}

function attach(a, b) {
  a.bind(Two.Events.Types.change, function() {
    b.copy(a);
  });
}

function pointerdown(e) {
  if (current) {
    isDragging = true;
  }
}

function pointermove(e) {

  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (isDragging) {

    current.x = mouse.x - two.scene.position.x;
    current.y = mouse.y - two.scene.position.y;

  } else {

    let matched = false;

    for (let i = 0; i < points.vertices.length; i++) {

      const v = points.vertices[i];
      const dist = temp.copy(v).add(two.scene.position).distanceToSquared(mouse);

      if (dist < 64) {
        two.renderer.domElement.style.cursor = 'pointer';
        matched = true;
        current = v;
      }

    }

    if (!matched) {
      two.renderer.domElement.style.cursor = 'default';
      current = null;
    }

  }

}

function pointerup(e) {
  isDragging = false;
}

function addBackdrop(d) {

  const dimensions = d || 50;
  const two = new Two({
    type: Two.Types.canvas,
    width: dimensions,
    height: dimensions
  });

  const r = dimensions / 5;
  const center = dimensions / 2;

  const a = two.makeLine(center - r, center, center + r, center);
  const b = two.makeLine(center, center - r, center, center + r);

  a.stroke = b.stroke = '#aaa';
  a.linewidth = b.linewidth = 0.25;

  two.update();

  const style = document.body.style;
  style.backgroundImage = `url(${two.renderer.domElement.toDataURL()})`;
  style.backgroundRepeat = 'repeat';
  style.backgroundSize = `${dimensions}px`;

}