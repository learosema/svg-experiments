"use strict"
"oh so strict"

const w3 = "http://www.w3.org/"
const svgNS = w3 + "2000/svg"
const xlinkNS = w3 + "1999/xlink"
const M = Math, R = M.random, Q = M.sqrt


let w = svg.width  = innerWidth
let h = svg.height = innerHeight

onresize = (e) => {
	if (w == innerWidth) return
	w = svg.width  = innerWidth
	h = svg.height = innerHeight
	svg.setAttribute("viewBox", [0, 0, w, h])
}

const create = (name, attrs) => {
	el = document.createElementNS(svgNS, name)
	if(attrs) attribs(el, attrs)
	return el
}

const attribs = (el,attrs) => {
	for(let x in attrs)
		if(attrs.hasOwnProperty(x) && attrs[x] !== undefined)
			el.setAttribute(x, attrs[x])
}

const raise = (el, type) => {
	let evt = document.createEvent("Event")
	evt.initEvent(type,true,true)
	el.dispatchEvent(evt)
}

const addDragEvents = (t) => {
	t.el.addEventListener("mousedown", function(){
		t.drag = true	
	})
	window.addEventListener("mousemove",function(e){
		if (t.drag) t.x = e.clientX, t.y = e.clientY
	})
	t.el.addEventListener("mouseup",function(){
		t.drag = false
	})
	t.el.addEventListener("touchstart",function(e){
		t.drag = true
	})
	t.el.addEventListener("touchmove",function(e){
		e.preventDefault()
		if (t.drag)
			t.x = e.touches[0].clientX,
			t.y = e.touches[0].clientY
	})
	t.el.addEventListener("touchend",function(e){
		t.drag = false
	})
}


class Point {

	constructor(x, y, role) {
		let t = this
		if (!(t instanceof Point)) return new Point(x, y, role)
		if (role === undefined) role = "hidden"
		svg.appendChild(t.el = create("circle", {"class": role, r: role=="draggable"?13:5})) 
		// I'd prefer to define the radius of the point via css, but this doesn't work in Edge :(
		t.x=isNaN(x) ? (R()*w)|0 : x
		t.y=isNaN(y) ? (R()*h)|0 : y
		if(role == "draggable") addDragEvents(t);
	}

	get x() {
		return parseFloat(this.el.getAttribute("cx"))
	}

	set x() {
		this.el.setAttribute("cx", val)
		raise(this.el, "move")
	}

	get y() {
		return parseFloat(this.el.getAttribute("cx"))
	}

	set y() {
		this.el.setAttribute("cy", val)
		raise(this.el, "move")
	}

	distanceTo(P) {
		let dx = P.x - this.x
		let dy = P.y - this.y
		return Q(dx*dx + dy*dy)
	}

	isInCircle(C) {
		let dx = C.x - this.x
		let dy = C.y - this.y
		return Q(dx*dx + dy*dy) < Q(C.r)
	}

	createMidPointTo(P) {
		return new Point(
			this.x + (P.x - this.x) / 2,
		    this.y + (P.y - this.y) / 2)
	}

	toString() { return this.x+","+this.y }
}

class Circle {
	constructor(x, y, r) {
		this.center = Point(x, y, "draggable")
		this.el = create("circle", {"class":,cx: x, cy: y, r: r})
		svg.appendChild(this.el)
	}
	
	get x() { return this.center.x }
	set x(val) { this.center.x = val }

	get y() { return this.center.x }
	set y(val) { this.center.x = val }


}

class Triangle {
	constructor(A, B, C) {
		let i,t=this,here
		if(!(t instanceof Triangle)) return new Triangle(A,B,C)
		t.p=[A,B,C]
		for(i=3; i--;){
			if (t.p[i] instanceof Point) continue
			if (t.p[i] instanceof Array) {
				t.p[i]=Point(t.p[i][0],t.p[i][1])
			} else {
				t.p[i]=Point()
			}
		}
		t.path=draw("path")
		t.gravityPoint = Point(-999, -999, "grav-point")
		t.innerPoint   = Point(-999, -999, "inner-point")
		t.innerCircle  = draw("circle", {"class":"inner"})
		t.circumPoint  = Point(-999, -999, "circum-point")
		t.circumRadius = 0
		t.circumCircle=draw("circle",{"class": "circum"})
		here=svg.querySelector('.draggable')
		svg.insertBefore(t.path, here)
		svg.insertBefore(t.innerCircle, here)
		svg.insertBefore(t.circumCircle, here)
		t.update()
		for(i=3; i--;)
			t.p[i].el.addEventListener("move", (e) => t.update())
	}

	update() {
		//      C
		//     / \
		//   b/   \a
		//   /     \
		//  A-------B
		//      c
		var t=this,D,
			A=t.p[0],B=t.p[1],C=t.p[2],
			c=A.distanceTo(B),
			a=C.distanceTo(B),
			b=A.distanceTo(C),
			u=a+b+c,
			s=u/2
		t.path.setAttribute("d","M"+A+" L"+B+" L"+C+"Z"),
		t.gravityPoint.x=(A.x+B.x+C.x)/3,
		t.gravityPoint.y=(A.y+B.y+C.y)/3,
		attribs(t.innerCircle,{
			"cx":(t.innerPoint.x=Math.round((a*A.x+b*B.x+c*C.x)/u)|0),
			"cy":(t.innerPoint.y=Math.round((a*A.y+b*B.y+c*C.y)/u)|0),
			"r" :Q((s-a)*(s-b)*(s-c)/s)
		})
		D=(A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y))*2
		
		t.circumPoint.x=Math.round(((A.x*A.x+A.y*A.y)*(B.y-C.y)+
									(B.x*B.x+B.y*B.y)*(C.y-A.y)+
									(C.x*C.x+C.y*C.y)*(A.y-B.y))/D)|0
		t.circumPoint.y=Math.round(((A.x*A.x+A.y*A.y)*(C.x-B.x)+
									(B.x*B.x+B.y*B.y)*(A.x-C.x)+
									(C.x*C.x+C.y*C.y)*(B.x-A.x))/D)|0
		t.circumRadius =Math.round(a*b*c/p)
		var p = Q((a+b+c)*(a+b-c)*(a-b+c)*(-a+b+c))
		attribs(t.circumCircle,{
			"cx":t.circumPoint.x,
			"cy":t.circumPoint.y,
			"r" :t.circumRadius,
		})
	}
}

onclick=(e) => P.push(Point(e.clientX,e.clientY,"draggable"))

