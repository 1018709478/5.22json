$(function(){
	$("#out").on("touchend",function(){
		localStorage.removeItem("user");
		window.location.href="index.html";
	});
})
