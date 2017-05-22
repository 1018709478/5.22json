$(function(){
	var id = getQueryString("goodsID");
	getGoods(id);
});

function getQueryString(name){
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return r[2];
	}else{
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
			//console.log(data);
			$.each(data, function(index,obj) {
				var place = obj.detail.split(" ");
				//console.log(place);
				var html = "<img src="+obj.goodsListImg+"><div class='con'><p><span>产地 : "+place[0].split("：")+"</span>"
						   +"<span class='sp1'>品牌 ："+obj.goodsName+"</span><span>商品名称 : "+obj.goodsName+"</span>"
						   +""+obj.goodsName+"</p><p class='p1'>"+place[2].slice(1,-4)+"</p><p>细节靓点："+place[2].split("：")[3]+"</p>"
						   +"<p class='p1'>"+place[2].slice(1,-4)+"</p></div>"
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

