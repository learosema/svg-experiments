with(Math)R=random,Q=sqrt,π=PI,S=sin,C=cos
W=innerWidth,H=innerHeight


function setSize(){
	W=innerWidth
	H=innerHeight
	s.setAttribute("viewBox",[0,0,W,H].join(","))
}
setSize()
onresize=setSize

laserLeft={x:(R()*128)|0,y:(R()*128)|0}
laserRight={x:(R()*128)|0,y:(R()*128)|0}
laserTargetLeft={x:(R()*128)|0,y:(R()*128)|0}
laserTargetRight={x:(R()*128)|0,y:(R()*128)|0}

function distance(p0,p1) {
	return Q((p1.x-p0.x)*(p1.x-p0.x)+(p1.y-p0.y)*(p1.y-p0.y))
}

function randomSparks(p,t,x,y,r,i,d,l){
	r=""
	x=p.x
	y=p.y
	for(i=3;i--;){
		d=((R()*360)|0)*π/180
		l=((R()*80)|0)/10
		r+="M"+x+","+y+" L"+((x+C(d)*l)|0)+","+((y+S(d)*l)|0)+" "
	}
	return r
}

onmousemove=function(e){
	laserTargetLeft.x=128*e.clientX/W
	laserTargetLeft.y=128*e.clientY/H
	laserTargetRight.x=128*e.clientX/W
	laserTargetRight.y=128*e.clientY/H
}

onblur=function(e){
	laserTargetLeft={x:(R()*128)|0,y:(R()*128)|0}
	laserTargetRight={x:(R()*128)|0,y:(R()*128)|0}
}

~function L(t){
	document.body.style.background="hsl("+((t|0)%360)+",33%,44%)";
	[].slice.call(document.querySelectorAll('.laser-eyes')).forEach(function (path){
		path.setAttribute("d", 
				 "M50,51 L"+laserLeft.x+","+laserLeft.y +
				" M78,51 L"+laserRight.x+","+laserRight.y + " " +
				randomSparks(laserLeft,t)+" "+randomSparks(laserRight,t)
				)
		if(laserLeft.x<laserTargetLeft.x)laserLeft.x+=.5
		if(laserLeft.x>laserTargetLeft.x)laserLeft.x-=.5
		if(laserLeft.y<laserTargetLeft.y)laserLeft.y+=.5
		if(laserLeft.y>laserTargetLeft.y)laserLeft.y-=.5
		if(distance(laserLeft,laserTargetLeft)<2)laserTargetLeft={x:(R()*128)|0,y:(R()*128)|0}

		if(laserRight.x<laserTargetRight.x)laserRight.x+=.5
		if(laserRight.x>laserTargetRight.x)laserRight.x-=.5
		if(laserRight.y<laserTargetRight.y)laserRight.y+=.5
		if(laserRight.y>laserTargetRight.y)laserRight.y-=.5
		if(distance(laserRight,laserTargetRight)<2)laserTargetRight={x:(R()*128)|0,y:(R()*128)|0}
	})
	requestAnimationFrame(L)
}(0)
