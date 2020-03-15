const $ = document.querySelector.bind(document);
const $$ = (sel, con) => Array.prototype.slice.call((con || document).querySelectorAll(sel));
const DEG = Math.PI / 180;

function rotate({x, y}, a) {
  const { sin, cos } = Math;
  return {
    x: x * cos(a) - y * sin(a),
    y: x * sin(a) + y * cos(a)
  };
}

function translate({x, y}, tx, ty) {
  return {
    x: x + tx,
    y: y + ty
  }
}

$('.darkmode-checkbox').addEventListener('click', () => {
  document.body.classList.toggle('darkmode');
  // old msedge compatibility:
  const isDarkmode = (document.body.classList.contains('darkmode'));
  const shadow = $('.moon-shadow');
  shadow.setAttribute('cx', isDarkmode ? '40' : '60');
    
});

// I could not get the transforms in buggy safari to work
// Workaround: calculate the transformed coords to absolute ones:
const removeTransforms = true;

if (removeTransforms) {
  const rays = $$('.rays path');
  rays.map((ray, i) => {
    const p0 = translate(rotate({x: 0, y: -28}, i * 45 * DEG), 32, 32);
    const p1 = translate(rotate({x: 0, y: -16}, i * 45 * DEG), 32, 32);
    ray.removeAttribute('transform-origin');
    ray.removeAttribute('transform');
    ray.setAttribute('d', `M${p0.x} ${p0.y} L${p1.x} ${p1.y}`);
  });  
}
