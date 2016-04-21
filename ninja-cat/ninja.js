W=innerWidth,H=innerHeight


function setSize(){
	W=innerWidth
	H=innerHeight
	s.setAttribute("viewBox",[0,0,W,H].join(","))
}
setSize()
onresize=setSize

~function L(t){
	document.body.style.background="hsl("+((t|0)%360)+",33%,44%)"
	requestAnimationFrame(L)
}(0)
