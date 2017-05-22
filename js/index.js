
var myScroll;
var navScroll;

$(function(){
	
	document.addEventListener("plusready", onPlusReady, false);
	iscrollInit();
	getBanner();
	swiperInit();
	getHotShop();
	getNavIcon();
	iscrollNavInit();
	

	var toast = function(text){
		$("<div class='hint'>"+text+"</div>").appendTo("body");
		$(".hint").animate({opacity:"0.2"},2000,function(){
			$(".hint").remove();
		});
		
	}
	
	
	function onPlusReady(){
		alert("硬件调试准备完毕");
		var first = null;
		plus.key.addEventListener("backbutton",function(){
			if(!first){
				first = new Date().getTime();
				//mui.toast("再按一次退出");
				toast("再按一次退出");
				//alert("hahah")
				setTimeout(function(){first = null;},1000);
			}else{
				if(new Date().getTime() - first < 1000){
					plus.runtime.quit();
				}
			}
			
//			plus.nativeUI.confirm("退出程序？", function(event) {
//              if (event.index) {
//                  plus.runtime.quit();
//              }
//          }, null, ["取消", "确定"]);
		},false)
	}
	
	var userId = getQueryString("userID");
	if(userId){
		getCartNum(userId);
	}
	
	//阻止触摸移动的默认事件
	document.addEventListener("touchmove",function(e){
		e.preventDefault();
	})
	
	document.addEventListener("touchend",function(){
		//下拉刷新页面
		if(myScroll.y>10){
			$(".con").empty();
			getHotShop();
		}
		
		//上拉加载商品
		//maxScrollY,指的是当滚动到底部时，myScroll.y的值，所以是一个负值
		if(myScroll.y<myScroll.maxScrollY-30){
			getHotShop();
		}
	})
});

//获取url参数
function getQueryString(name){
	//设置查找name前缀
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	//进行查找
	var r = window.location.search.substr(1).match(reg);
	if (r!=null){
		return decodeURI(r[2]);
	}
	return null;
}

function swiperInit(){
	var swiper = new Swiper(".swiper-container",{
		autoplay:2000,
		loop:true,
		pagination:".swiper-pagination",
		paginationClickable:true,
		observer:true,//修改swiper自己或子元素时，自动初始化swiper
    	observeParents:true,//修改swiper的父元素时，自动初始化swiper
	})
}

function iscrollInit(){
	myScroll = new IScroll("#main",{
		mouseWheel:true,
		scrollbars:true,
		fadeScrollbars:true
	})
}
//导航栏滚动初始化
function iscrollNavInit(){
	navScroll = new IScroll("#nav",{
		mouseWheel:true,
		scrollX:true,
		click:true
	});
}

//获取导航栏商品分类
function getNavIcon(){
	$.ajax({
		type:"get",
		url:"http://datainfo.duapp.com/shopdata/getclass.php",
		async:true,
		success:function(data){
			var obj = JSON.parse(data);
			//console.log(obj);
			var $nav = $(".nav");
			var navWidth=0;
			$.each(obj, function(index) {
				var icon = "<li class='icon iconfont fontBox'>"+obj[index].icon+"</li>";
				$nav.append(icon);
				navWidth += 50;
				$(".icon").eq(index).on("touchend",function(){
					$(".con").empty();
					getShop(obj[index].classID);
				});
			});
			
			$nav.width(navWidth);
			navScroll.refresh();
		}
	});
}


//获取swiper-wrapper
var $wrapper = $(".swiper-wrapper");
//获取banner图
function getBanner(){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getBanner.php",
		async:true,
		success:function(data){
			$.each(data, function(index,obj){
				var str = obj.goodsBenUrl.slice(1,-1);
				var arr = str.split(",")[0];
				var html = "<div class="+"swiper-slide"+"><img src="+arr+"/></div>";
				$wrapper.append(html);
			});
		}
	});
}

var con = $(".con");
//获取首页热推商品
function getHotShop(){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		async:true,
		success:function(data){
			//console.log(data);
			$.each(data, function(index) {
				var src = data[index].imgsUrl.slice(1,-1).split(",")[0];
				var elements = "<div class='shop'><div class='left'><img class='Img' src="+src+"/></div>"+
				"<div class='right'><p class='p1'>"+data[index].goodsName+"</p><p class='p2'><span>¥ "+data[index].price+"</span>"+
				"<s>¥ "+(+data[index].price+300)+"</s></p><p class='p3'>"+data[index].discount+"折</p></div>"+
				"<div class='fa fa-shopping-cart btn'></div></div>";
				
				con.append(elements);
	
				//跳转到商品详情页,一定要加eq(index)这样才能确定当前元素
				$(".Img").eq(index).on("touchstart",function(){
					window.location.href="shopDetail.html?goodsID="+encodeURI(data[index].goodsID);
				});
				
				var user = localStorage.getItem("user");
				//加入购物车
				$(".btn").eq(index).on("touchstart",function(){
					if(user){
						renewCart(data,index);
						var num = +$("#shopCart").text();
						$("#shopCart").text(num+1);
					}else{
						window.location.href="login.html";
					}
					
				});
			});
			/*刷新myScroll,获得最新高度*/
			myScroll.refresh();
		}
	})
}


function getShop(id){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		async:true,
		data:{classID:id},
		success:function(data){
			//console.log(data);
			$.each(data, function(index) {
				var src = data[index].imgsUrl.slice(1,-1).split(",")[0];
				var elements = "<div class='shop'><div class='left'><img class='Img' src="+src+"/></div>"+
				"<div class='right'><p class='p1'>"+data[index].goodsName+"</p><p class='p2'><span>¥ "+data[index].price+"</span>"+
				"<s>¥ "+(+data[index].price+300)+"</s></p><p class='p3'>"+data[index].discount+"折</p></div>"+
				"<div class='fa fa-shopping-cart btn'></div></div>";
				
				con.append(elements);
	
				//跳转到商品详情页,一定要加eq(index)这样才能确定当前元素
				$(".Img").eq(index).on("touchstart",function(){
					window.location.href="shopDetail.html?goodsID="+encodeURI(data[index].goodsID);
				});
				
				var user = localStorage.getItem("user");
				//加入购物车
				$(".btn").eq(index).on("touchstart",function(){
					if(user){
						renewCart(data,index);
					}else{
						window.location.href="login.html";
					}
					
				});
			});
			/*刷新myScroll,获得最新高度*/
			myScroll.refresh();
		}
	})
}


//更新购物车
function renewCart(data,index){
	//获取当前用户信息
	var userStr = localStorage.getItem("user");
	var userObj = JSON.parse(userStr);
	//更新购物车
	$.ajax({
		type:"get",
		url:"http://datainfo.duapp.com/shopdata/updatecar.php",
		async:true,
		data:{userID:userObj.userID,goodsID:data[index].goodsID},
		success:function(data){
			if(data==1){
				alert("数据成功更新");
				
			}
		}
	})
}

//获取当前用户下购物车商品数量
function getCartNum(id){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getCar.php",
		async:true,
		data:{userID:id},
		success:function(data){
			var len = data.length;
			if(len>0){
				$("#shopCart").addClass("flag").html(len);
			}
		}
	});
}


/*$cart.on("touchstart",function(){
	//获取当前用户名下的信息
	var userStr = localStorage.getItem("user");
	var userObj = JSON.parse(userStr);
	//存储商品ID
	//当用户已经存过商品id了，就在其后用&符链接新添加的商品id，否则直接添加
	if(userObj.goodsID){
		var id = userObj.goodsID;
		var arr = id.split("&");
		var len = arr.length;
		var flag = false;
		//遍历存入的goodsID，是否与要存入的一样
		for(var i=0; i<len; i++){
			if(arr[i] == data[index].goodsID){
				flag = true;
			}
		}
		//已存的goodsID，不再存入
		if(!flag){
			userObj["goodsID"] += "&"+data[index].goodsID;
			var str = JSON.stringify(userObj);
			localStorage.setItem("user",str);
		}
	}else{
		userObj["goodsID"] = data[index].goodsID;
		var str = JSON.stringify(userObj);
		localStorage.setItem("user",str);
	}
	console.log(localStorage.getItem("user"));
});*/