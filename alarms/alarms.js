const w3      = "http://www.w3.org/"
const svgNS   = w3+"2000/svg"
const xlinkNS = w3+"1999/xlink"
let w = svg.width = innerWidth
let h = svg.height = innerHeight
const AC = new AudioContext();
const masterVolume = AC.createGain();
masterVolume.connect(AC.destination)
const { random, round, min, max } = Math;

const maxModulatorFrequency = 8;
const maxCarrierFrequency = 1000;


function setViewBox() {
	if(w==innerWidth)return
	w=svg.width=innerWidth
	h=svg.height=innerHeight
	svg.setAttribute("viewBox", [0,0,w,h])
}

const draw = (name,attrs) => {
	el=document.createElementNS(svgNS, name)
	if (attrs) attribs(el, attrs)
	return el
}

const attribs = (el, attrs, x) => {
	for(x in attrs)
		if(attrs.hasOwnProperty(x)&&attrs[x]!==undefined)
			el.setAttribute(x,attrs[x])
}

const raise = (el,type) => {
	var evt = document.createEvent("Event")
	evt.initEvent(type,true,true)
	el.dispatchEvent(evt)
}

class Point {
	
	constructor(x,y) {
		if (isNaN(x)) x = random() * w;
		if (isNaN(y)) y = random() * h;
		this.el = draw("circle", {"class": "noisy", "cx": x, "cy": y, "r": 20})
		this.volume = AC.createGain();
		this.volume.gain.value = 0.0;
		this.carrier = {
			osc: AC.createOscillator(),
			gain: AC.createGain()
		}
		this.modulator = {
			osc: AC.createOscillator(),
			gain: AC.createGain()
		}
		this.carrier.gain.gain.value = 1.0;
		this.modulator.gain.gain.value = 500.0;
		this.carrier.osc.frequency.value = round(maxCarrierFrequency * x/w);
		this.modulator.osc.frequency.value = round(maxModulatorFrequency * y/h);
		this.carrier.osc.connect(this.carrier.gain);               // carOsc.connect(carGain);
		this.modulator.osc.connect(this.modulator.gain)            // modOsc.connect(modGain);
		this.modulator.gain.connect(this.carrier.osc.frequency)    // modGain.connect(carOsc.frequency);
		this.carrier.gain.connect(this.volume);					   // carGain.connect(outGain);
		this.volume.connect(masterVolume);		   			   	   // outGain.connect(ac.destination);
		this.carrier.osc.start();
		this.modulator.osc.start();
		this.drag = false;
		svg.appendChild(this.el);
		this.el.addEventListener("dblclick", (e) => {
			this.enabled=!this.enabled; 
		})
		this.el.addEventListener("mousedown", (e) => { this.drag = true; })
		this.el.addEventListener("mouseup", (e) => { this.drag = false; })	
		window.addEventListener("mousemove", (e) => {
			if (this.drag) {
				this.x=e.clientX;
				this.y=e.clientY;
			}
		})	
	}

	set enabled(val) {
		if (val) this.el.setAttribute("class", "noisy noisy-enabled");
		if (!val) this.el.setAttribute("class", "noisy");
		this.volume.gain.value = val ? 1.0: 0.0;
		masterVolume.gain.value = 1.0 / max(svg.querySelectorAll('.noisy-enabled').length, 1)
	}

	get enabled() {
		return this.el.getAttribute("class").indexOf("noisy-enabled") > -1
	}

	set x(val) {
		this.el.setAttribute("cx",val)
		this.carrier.osc.frequency.value = round(maxCarrierFrequency * val/w);
		raise(this.el,"move")
	}

	get x() {
		return parseFloat(this.el.getAttribute("cx"))
	}

	set y(val) {
		this.el.setAttribute("cy",val)
		this.modulator.osc.frequency.value = round(maxModulatorFrequency * val/h);
		raise(this.el,"move")
	}

	get y() {
		return parseFloat(this.el.getAttribute("cy"))
	}
	
}


window.addEventListener('resize', setViewBox);
setViewBox()
window.addEventListener('click', (e) => {
	if (e.target === svg) new Point(e.clientX, e.clientY);
})