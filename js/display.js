
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

function swiperInit(){
	var swiper = new Swiper(".swiper-container",{
		autoplay:2000,
		pagination:".swiper-pagination",
		paginationClickable:true
	})
}

var slide = $(".swiper-wrapper");
function getGoods(id){
	$.ajax({
		type:"get",
		dataType:"jsonp",
		url:"http://datainfo.duapp.com/shopdata/getGoods.php",
		async:true,
		data:{goodsID:id},
		success:function(data){
			console.log(data[0].imgsUrl.slice(1,-1).split(","));
			var src = data[0].imgsUrl.slice(1,-1).split(",");
			$.each(src, function(index,obj){
					var html = "<div class='swiper-slide'><img src="+obj+"/></div>";
					slide.append(html);
			});
			//初始化swiper
			swiperInit();
			
			$("footer .a1").on("touchstart",function(){
				window.location.href="shopDetail.html?goodsID="+encodeURI(data[0].goodsID);
			});
			$("footer .a2").on("touchstart",function(){
				window.location.href="detail.html?goodsID="+encodeURI(data[0].goodsID);
			});
			$("footer .a3").on("touchstart",function(){
				window.location.href="display.html?goodsID="+encodeURI(data[0].goodsID);
			});
		}
	});
}
