$(function(){
	$("#btn").on("click",function(){
		var obj = getText();
		if(obj.userName==""){
			alert("请输入用户名")
		}else if(obj.psw==""){
			alert("请输入密码");
		}else{
			login(obj);
		}
	});
});

function getText(){
	var userName = $("#user").val();
	var psw = $("#psw").val();
	
	return {"userName":userName,"psw":psw};
}


function login(obj){
	$.ajax({
		type:"post",
		url:"http://datainfo.duapp.com/shopdata/userinfo.php",
		async:true,
		data:{status:"login",userID:obj.userName,password:obj.psw},
		success:function(data){
			if(data==0){
				alert("用户名不存在");
			}else if(data==2){
				alert("密码错误！");
			}else {
				//console.log(data);
				if(data.charAt(0)=="{"){
					var check = $("#check").is(":checked");
					var dataToObj = JSON.parse(data);
					if(check){
						//var str = "{'userID':"+dataToObj.userID+",'password':"+dataToObj.password+"}";
						var obj = {userID:dataToObj.userID,password:dataToObj.password};
						console.log(obj);
						var str = JSON.stringify(obj);
						//密码保存在本地
						localStorage.setItem("user",str);
						window.location.href="index.html?userID="+encodeURI(obj.userID);
					}
				}
			}
		}
	});
}
