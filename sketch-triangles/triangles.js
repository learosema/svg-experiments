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

function raiseEvent(el,type,obj){
	var evt = document.createEvent("Event")
	evt.initEvent(type,true,true)
	evt.obj=obj
	el.dispatchEvent(evt)
}

function Point(x,y){
	if(!(this instanceof Point))return new Point(x,y)
	this.el=document.createElementNS(svgNS,"circle")
	svg.appendChild(this.el)
	this.x=x
	this.y=y
	var that=this
	this.el.addEventListener("mousedown",function(){
		that.drag=true;	
	})
	window.addEventListener("mousemove",function(e){
		if(that.drag)that.x=e.clientX,that.y=e.clientY
	})
	this.el.addEventListener("mouseup",function(){
		that.drag=false;
	})

}

Object.defineProperty(Point.prototype,"x",{
	get:function(){return parseFloat(this.el.getAttribute("cx"))},
	set:function(val){this.el.setAttribute("cx",val);raiseEvent(this.el,"move",this)}
})

Object.defineProperty(Point.prototype,"y",{
	get:function(){return this.el.getAttribute("cy")},
	set:function(val){this.el.setAttribute("cy",val);raiseEvent(this.el,"move",this)}
})

Point.random=function() {
	return new Point((R()*w)|0,(R()*h)|0)
}

Point.prototype.toString=function(){
	with(this)return x+","+y
}

function Triangle(p1, p2, p3){
	var i,t=this
	if(!(t instanceof Triangle))return new Triangle(p1, p2, p3)
	t.p=[p1,p2,p3]
	for(i=3;i--;){
		if(t.p[i] instanceof Point)continue
		if(t.p[i] instanceof Array) {
			t.p[i]=new Point(t.p[i][0],t.p[i][1])
		} else {
			t.p[i]=Point.random()
		}
	}
	t.path=document.createElementNS(svgNS,"path")
	svg.insertBefore(t.path,svg.querySelector('circle'))
	t.updatePath()
	for(i=3;i--;)
		t.p[i].el.addEventListener("move", function(e){
			t.updatePath()
		})
}

Triangle.prototype.updatePath=function(){
	with(this)path.setAttribute("d","M"+p[0]+" L"+p[1]+" L"+p[2]+"Z")
}

t=Triangle()

