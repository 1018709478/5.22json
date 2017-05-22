$(function(){
	//提交注册
	$("#btn").on("click",function(){
		var obj = getText();
		//console.log(obj);
		if(obj.userName==""){
			alert("请输入用户名");
		}else {
			if(obj.psw==""){
				alert("请输入密码");
			}else if(obj.psw===obj.repsw){
				register(obj);
			}else{
				alert("两次密码不一致！");
			}
		}
	});
	
	//获取注册信息
	function getText(){
		var userName = $("#user").val();
		var psw = $("#psw").val();
		var repsw = $("#repsw").val();
		
		return {"userName":userName,"psw":psw,"repsw":repsw};
	}
	
	function register(obj){
		$.ajax({
			type:"post",//get也可以
			url:"http://datainfo.duapp.com/shopdata/userinfo.php",
			async:true,
			data:{status:"register",userID:obj.userName,password:obj.psw},
			success:function(data){
				if(data == 0){
					alert("用户名已被注册！");
				}else if(data == 2){
					alert("服务器出错了！");
				}else{
					alert("注册成功！请登录");
					window.location.href = "login.html";
				}
			}
		});
	}

});

