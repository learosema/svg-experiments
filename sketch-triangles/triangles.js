N=15
w3="http://www.w3.org/"
svgNS=w3+"2000/svg"
xlinkNS=w3+"1999/xlink"
with(Math)R=random,S=sin,C=cos

w=svg.width=innerWidth
h=svg.height=innerHeight
this.onresize=function(){
	if(w==innerWidth)return
	w=svg.width=innerWidth
	h=svg.height=innerHeight
	svg.setAttribute("viewBox", [0,0,w,h])
}

svg.onclick=function(e) {
	console.log(e.target);
}

function Triangle(p1, p2, p3) {
	this.p1=p1
	this.p2=p2
	this.p3=p3
}

Triangle.prototype.render = function() {
	if(this.svgTriangle) {
		this.svgTriangle=document.createElementNS(svgNS,"g")
		svgTriangle.appendChild(this.svgP1=document.createElementNS(svgNS,"circle"))
		svgTriangle.appendChild(this.svgP2=document.createElementNS(svgNS,"circle"))
		svgTriangle.appendChild(this.svgP3=document.createElementNS(svgNS,"circle"))
		svgTriangle.appendChild(this.svgPath=document.createElementNS(svgNS,"path"))
		svg.appendChild(svgTriangle)
	}
}
