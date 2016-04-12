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
	console.log(e.target)
}

function Point(x,y){
	this.x=x
	this.y=y
}

Point.random=function() {
	return new Point((R()*w)|0,(R()*h)|0)
}

Point.prototype.toString=function(){
	with(this)return x+","+y
}

function Triangle(p1, p2, p3){
	this.p=[p1,p2,p3]
	this.p.map(function(p){
		return p instanceof Point?p:
			(p instanceof Array?new Point(p[0],p[1]):undefined)
	})
	if(this.isDefined())this.create()
}

Triangle.prototype.isDefined=function(){
	with(this)return(p[0]&&p[1]&&p[2])
}

Triangle.prototype.create=function(){
	if(this.svgTriangle || !this.isDefined())return
	this.svgTriangle=document.createElementNS(svgNS,"g")
	this.svgPoints=[
		document.createElementNS(svgNS,"circle"),
		document.createElementNS(svgNS,"circle"),
		document.createElementNS(svgNS,"circle")
	]
	with(this){
		svgPath=document.createElementNS(svgNS,"path")
		svgPath.setAttribute("stroke", "white")
		svgPath.setAttribute("stroke-width", "4")
		svgTriangle.appendChild(svgPath)
		this.svgPoints.forEach(function(p){
			p.setAttribute("fill", "red")
			p.setAttribute("r", "10")
			svgTriangle.appendChild(p)
		})
		setPosition()
	}
	svg.appendChild(this.svgTriangle)
}

Triangle.prototype.addEventHandlers=function(){
	var self=this
	this.svgPoints.forEach(function(svgPoint){
		// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
		svgPoint.addEventListener('mousedown', function(e){
			// svgPoint.drag=true
		})

		svgPoint.addEventListener('mousemove', function(e){
			// self.setPosition()
		})

	})
}


Triangle.prototype.setPosition=function(){
	with(this)
		svgPath.setAttribute("d","M"+p[0]+" L"+p[1]+" L"+p[2]+"Z"),
		svgPoints.forEach(function(p){
			p.setAttribute("x", p.x)
			p.setAttribute("y", p.y)
		})
}
