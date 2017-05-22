$(function(){
	var user = localStorage.getItem("user");
	if(user){
		var userID = JSON.parse(user).userID;
		var html = "<p style='margin-top:1.5rem;'>昵称："+userID+"</p>"
		$(".user dd").append(html);
	}else{
		var html = "<p>昵称：未知</p><div><a href='login.html'>登录</a><a href='register.html'>注册</a></div>";
		$(".user dd").append(html);
	}
});
