var llIIll=[],IIllII="38,38,40,40,37,39,37,39,66,65";
document.onkeydown=checkIIllII; //Onkeydown works in IE and chrome as well
function checkIIllII(e){
	e = e || window.event;  //Need to normalize the event object in IE
if(e.keyCode!=0){
llIIll.push(e.keyCode);
}else{
llIIll.push(e.charCode);
}
if(llIIll.toString().indexOf(IIllII)>=0){
document.unlock.submit();
}
};