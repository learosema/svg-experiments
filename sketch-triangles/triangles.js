w3="http://www.w3.org/"
svgNS=w3+"2000/svg"
xlinkNS=w3+"1999/xlink"
with(Math)R=random,Q=sqrt

w=svg.width=innerWidth
h=svg.height=innerHeight
this.onresize=function(){
	if(w==innerWidth)return
	w=svg.width=innerWidth
	h=svg.height=innerHeight
	svg.setAttribute("viewBox", [0,0,w,h])
}

function draw(name,attrs){
	el=document.createElementNS(svgNS,name)
	if(attrs)attribs(el,attrs)
	return el
}

function attribs(el,attrs,x){
	for(x in attrs)
		if(attrs.hasOwnProperty(x)&&attrs[x]!==undefined)
			el.setAttribute(x,attrs[x])
}

function raise(el,type){
	var evt = document.createEvent("Event")
	evt.initEvent(type,true,true)
	el.dispatchEvent(evt)
}

function Point(x,y,role){
	var t=this
	if(!(this instanceof Point))return new Point(x,y,role)
	if(role===undefined)role="draggable"
	t.el=draw("circle",{"class":role})
	svg.appendChild(this.el)
	t.x=isNaN(x)?(R()*w)|0:x
	t.y=isNaN(y)?(R()*h)|0:y
	if(role=="draggable"){
		t.el.addEventListener("mousedown",function(){
			t.drag=true;	
		})
		window.addEventListener("mousemove",function(e){
			if(t.drag)t.x=e.clientX,t.y=e.clientY
		})
		t.el.addEventListener("mouseup",function(){
			t.drag=false;
		})
	}
}

Object.defineProperty(Point.prototype,"x",{
	get:function(){return parseFloat(this.el.getAttribute("cx"))},
	set:function(val){this.el.setAttribute("cx",val);raise(this.el,"move")}
})

Object.defineProperty(Point.prototype,"y",{
	get:function(){return parseFloat(this.el.getAttribute("cy"))},
	set:function(val){this.el.setAttribute("cy",val);raise(this.el,"move")}
})

Point.prototype.distanceTo=function(P,dx,dy) {
	dx=P.x-this.x
	dy=P.y-this.y
	return Q(dx*dx+dy*dy)
}

Point.prototype.toString=function(){
	with(this)return x+","+y
}

function Triangle(p1,p2,p3){
	var i,t=this,here
	if(!(t instanceof Triangle))return new Triangle(p1, p2, p3)
	t.p=[p1,p2,p3]
	for(i=3;i--;){
		if(t.p[i] instanceof Point)continue
		if(t.p[i] instanceof Array) {
			t.p[i]=Point(t.p[i][0],t.p[i][1])
		} else {
			t.p[i]=Point()
		}
	}
	t.gravPoint=Point((t.p[0].x+t.p[1].x+t.p[2].x)/3,
					  (t.p[0].y+t.p[1].y+t.p[2].y)/3, "grav-point")
	t.path=draw("path")
	t.innerCircle=draw("circle",{"class":"inner"})
	here=svg.querySelector('.draggable')
	svg.insertBefore(t.path,here)
	svg.insertBefore(t.innerCircle,here)
	t.update()
	for(i=3;i--;)
		t.p[i].el.addEventListener("move", function(e){
			t.update()
		})
}

Triangle.prototype.update=function(){
	//      C
	//     /\
	//   b/  \a
	//   /    \
	//  A------B
	//      c
	var t=this,A=t.p[0],B=t.p[1],C=t.p[2],
		c=A.distanceTo(B),
		a=C.distanceTo(B),
		b=A.distanceTo(C),
		u=a+b+c,
		s=u/2
	t.path.setAttribute("d","M"+A+" L"+B+" L"+C+"Z"),
	t.gravPoint.x=(A.x+B.x+C.x)/3,
	t.gravPoint.y=(A.y+B.y+C.y)/3,
	attribs(t.innerCircle,{
		"cx":Math.round((a*A.x+b*B.x+c*C.x)/u)|0,
		"cy":Math.round((a*A.y+b*B.y+c*C.y)/u)|0,
		"r" :Q((s-a)*(s-b)*(s-c)/s)
	})
}

t=Triangle()
// svg.onclick=function(e){
//	if(e.target==svg)t=Triangle(t.p[1],t.p[2],Point(e.clientX,e.clientY))
// }
