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

function Point(x,y, cont){
	this.x=x
	this.y=y
	this.el=document.createElementNS(svgNS,"circle")
	this.el.setAttribute("fill", "red")
	this.el.setAttribute("r", "10")
	this.cont=cont||svg
	this.cont.appendChild(this.el)
	this.move()
}

Point.random=function() {
	return new Point((R()*w)|0,(R()*h)|0)
}

Point.prototype.move=function(x,y){
	if(x)this.x=x
	if(y)this.y=y
	this.el.setAttribute("x",x)
	this.el.setAttribute("y",y)
	var onMoveEvent = document.createEvent("Event")
	event.initEvent('move',true,true)
	this.el.dispatchEvent(onMoveEvent)
}

Point.prototype.toString=function(){
	with(this)return x+","+y
}

function Triangle(p1, p2, p3){
	var t=this
	t.p=[p1,p2,p3]
	t.el=document.createElementNS(svgNS,"g")
	t.p.map(function(p){
		if(p instanceof Point==false){
			if(p instanceof Array)p=new Point(p[0],p[1],t.el)
		} else {
			p.cont.removeChild(p.el)
			t.el.appendChild(p.el)
		}
	})
	t.path=document.createElementNS(svgNS,"path")
	t.path.setAttribute("stroke", "white")
	t.path.setAttribute("stroke-width", "4")
}

Triangle.prototype.updatePath=function(){
		t.path.setAttribute("d","M"+p[0]+" L"+p[1]+" L"+p[2]+"Z"),
}
