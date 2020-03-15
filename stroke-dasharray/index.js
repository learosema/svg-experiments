const path = document.querySelector('path');

const pathLength = path.getTotalLength();

path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength;
path.style.stroke = '#fff';

window.setTimeout(() => {
  path.classList.add('stroke--transition'); 
}, 1);

function toggleStroke() {
  path.classList.toggle('stroke--reset');
}

window.setTimeout(toggleStroke, 1000);
window.addEventListener('click', toggleStroke);
