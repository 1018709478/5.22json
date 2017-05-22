
var myScroll;
$(function(){
	var userStr = localStorage.getItem("user");
	if(userStr){
		var id = getUserID();
		getShopCart(id);
		iscrollInit();
	}else{
		$("#con").html("登录后查看您的购物车！");
	}
});

function getUserID(){
	var userStr = localStorage.getItem("user");
	var userObj = JSON.parse(userStr);
	return userObj.userID;
}

function iscrollInit(){
	myScroll = new IScroll(".main",{
		mouseWheel:true,
		scrollbars:true
	})
}

var con = $("#con");
function getShopCart(id){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getCar.php",
		async:true,
		data:{userID:id},
		success:function(data){
			
			//如果有商品就加载
			if(data){
				$.each(data, function(index) {
					var elements = "<div class='shopList'><div class='left'><img src='"+data[index].goodsListImg+"'/></div>"+
						"<div class='right'><p>"+data[index].goodsName+"<span class='fa fa-trash del'></span></p>"+
						"<p>"+data[index].className+"</p><p>单价 ：<span class='price'>¥"+data[index].price+"</span><span>L</span></p>"+
						"<p>数量 ：<button class='reduce'>-</button><input class='inp' type='text' value='"+data[index].number+"'/><button class='add'>+</button></p>"+
						"</div></div>";
					con.append(elements);
					
					//增加商品数量
					$(".add").eq(index).on("touchstart",function(){
						var val = +$(this).prev().val()+1;
						var goodsID = data[index].goodsID;
						//更新购物车
						var flag = renewCart(id,goodsID,val);//这里要用同步加载，因为要等购物车更新完成后，才能进行商品数量的获取
						//renewNum(id,index);这里不应该用这个函数更新数量，性能低，而且有bug
						if(flag){
							$(this).prev().val(val);
						}
						//商品总数，及总价
						shopTotal();
					})
					//减少商品数量
					$(".reduce").eq(index).on("touchstart",function(){
						var val = +$(this).next().val()-1;
						var goodsID = data[index].goodsID;
						//商品数不能小于1
						if(val >0){
							//更新购物车
						var flag = renewCart(id,goodsID,val);//这里要用同步加载，因为要等购物车更新完成后，才能进行商品数量的获取
							//renewNum(id,index);	
						}
						if(flag){
							$(this).next().val(val);
						}
						//商品总数，及总价
						shopTotal();
					})
					
					//删除商品
					$(".del").eq(index).on("touchstart",function(){
						var goodsID = data[index].goodsID;
						var flag = renewCart(id,goodsID,0);
						//当服务器更新成功，删除页面的商品
						if(flag){
							$(".shopList").eq(index).remove();
							shopTotal();
						}
					});
				});
			}else{
				$(".main").empty();
				var elements = "<div class='None'><p>您的购物车空空~~</p><div class='fa fa-rss'></div><div class='Btn'>去逛逛</div></div>";
				$(".main").append(elements);	
				$(".main .Btn").on("touchstart",function(){
					window.location.href="index.html";
				})
			}
			
			//数据加载完成后，刷新myScroll
			myScroll.refresh();
			
			//商品总数，及总价
			shopTotal();
		}
	});
}

//更新购物车
function renewCart(id,goodsID,val){
	var flag = false;
	$.ajax({
		type:"get",
		url:"http://datainfo.duapp.com/shopdata/updatecar.php",
		async:false,//这里要用同步加载，因为要等购物车更新完成后，才能进行商品数量的获取
		data:{userID:id,goodsID:goodsID,number:val},
		success:function(data){
			if(data==1){
				alert("更新成功");
				flag = true;
			}else{
				alert("更新失败");
			}
		}
	});
	return flag;
}

//获取更新后的购物车商品数量
function renewNum(id,index){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getCar.php",
		async:false,
		data:{userID:id},
		success:function(data){
			/*$.each(data, function() {
				//console.log($(".inp").eq(index).val());
				console.log(data[index].number);
				$(".inp").eq(index).val(data[index].number);				
			});*/
			
			//这里不应该再遍历data了，因为每次只改变一个商品的数据，所以直接更新这一个商品的数据就可以了，没必要将所有商品的数据都更新一遍
			console.log(data[index].number);
			$(".inp").eq(index).val(data[index].number);	
		}
	});
}


//商品总数及总价
function shopTotal(){
	var sum = 0;
	var num = 0;
	var inp = $(".inp");
	var arrPrice = $(".price");
	$.each(inp, function(index) {
		num += +inp.eq(index).val();
		sum += +arrPrice.eq(index).text().slice(1)*inp.eq(index).val();
	});
	$(".totallMsg span").eq(0).text("商品数量 : "+num);
	$(".totallMsg span").eq(2).text("¥"+sum);
}
