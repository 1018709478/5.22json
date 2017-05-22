
$(function(){
	//获取跳转页面传进来的goodsID
	var id = getQueryString("goodsID");
	getGoods(id);
});

//获取url参数
function getQueryString(name){
	//设置查找name前缀
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	//进行查找
	var r = window.location.search.substr(1).match(reg);
	//console.log(r);
	if(r!=null){
		return r[2];
	}else {
		return null;
	}
}

var main = $(".main");
function getGoods(id){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		async:true,
		data:{goodsID:id},
		success:function(data){
			console.log(data);
			$.each(data, function(index,obj) {
				var html = "<img src="+obj.goodsListImg+"><div class='shop_label'>¥"+obj.price+obj.goodsName+"</div>"
						   +"<p><span>市场价 : </span><s>¥"+(parseInt(obj.price/(obj.discount)*10))+"</s><span class='sp_gap'>"+obj.discount+"折</span>"
						   +"<span>"+obj.buynumber+"人购买</span></p>";
				main.append(html);
				$("footer .a1").on("touchstart",function(){
					window.location.href="shopDetail.html?goodsID="+encodeURI(obj.goodsID);
				});
				$("footer .a2").on("touchstart",function(){
					window.location.href="detail.html?goodsID="+encodeURI(obj.goodsID);
				});
				$("footer .a3").on("touchstart",function(){
					window.location.href="display.html?goodsID="+encodeURI(obj.goodsID);
				});
			});
			
			
			
		}
	});
}

/*<img src="../img/shop5.jpg"/>
<div class="shop_label">
	￥259 灰色印花短袖
</div>
<p>
	<span>市场价 : </span><s>￥439</s>
	<span class="sp_gap">4.8折</span>
	<span>125人购买</span>
</p>*/