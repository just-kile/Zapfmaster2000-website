var ZM = ZM||{};

ZM.Gallery = (function($){
	var leafs,pagination,leafLength,paginationContainer;
	var oldLeaf = 0;
	var interval,isAnimation=false;
	var settings = {
			speed:600,
			interval:15000
	}
	var switchImage=function(index){
		if(!isAnimation){
			isAnimation = true;
		
			var oldLeafTmp = oldLeaf;
			oldLeaf = index;
			$(pagination[oldLeafTmp]).removeClass("page-active");
			$(pagination[index]).addClass("page-active");
		
			if(oldLeafTmp<index){
				$(leafs[oldLeafTmp]).animate({left:"200",opacity:0},settings.speed,"easeInOutQuint",function(){
	
					$(leafs[oldLeafTmp]).hide();
					
				});
				var newLeaf = $(leafs[index]).css("left","1000px").show();
				newLeaf.animate({left:"50%",opacity:"1"},settings.speed,"easeInOutQuint",function(){
					isAnimation = false;
				});
			}else{
				$(leafs[oldLeafTmp]).animate({left:"1000px",opacity:0},settings.speed,"easeInOutQuint",function(){
					$(pagination[oldLeafTmp]).removeClass("page-active");
					$(pagination[index]).addClass("page-active");
					$(leafs[oldLeafTmp]).hide();
				});
				var newLeaf = $(leafs[index]).css("left","200px").show();
				newLeaf.animate({left:"50%",opacity:"1"},settings.speed,"easeInOutQuint",function(){
					isAnimation = false;
				});
			}
		}
		/*$(leafs[oldLeaf]).fadeOut("fast",function(){
			$(pagination[oldLeaf]).removeClass("page-active");
			$(pagination[index]).addClass("page-active");
			oldLeaf = index;
			$(leafs[index]).fadeIn("slow");
			*/
		
	}
	var startSwitch = function(){
		interval = setInterval(function(){
			switchImage((oldLeaf+1)%leafLength);
		},settings.interval)
	}
	var stopSwitch = function(){
		clearInterval(interval)
	}
	var renderPagination = function(container,length){
		container = $(container);
		for(var i =0;i<length;i++){
			container.append($('<div class="page"></div>'));
		}
		container.children(":first").addClass("page-active")
		return container;
	}
	var init = function(){
		leafs = $(".leaf");
		leafLength = leafs.length;
		paginationContainer= renderPagination(".cont .pagination",leafLength);
		pagination = paginationContainer.children();
		$(".cont .pagination").on("click",".page",function(e){
			var ind = $(e.currentTarget).index();
			stopSwitch();
			if(ind!=oldLeaf)switchImage(ind);
			startSwitch();
		});
		//Add click handler
		$(".knowMorebtn").click(function(e){
			var link = $("#"+$(e.currentTarget).attr("zm-href"));
			ZM.navigation.scrollToElement(link);
		})
		
	}
	var pub = {
			init:init,
			startSwitch:startSwitch
	}
	return pub;
})(jQuery);

ZM.storySwipe = (function($){
	var ul,liList,divList,indexOld =0; 
	var animateHeight = "510px";
	var animateSpeed = 400;
	
	animatingList = [];
	var init = function(){
		ul = $(".cont3 .navi ul");
		liList = ul.children();
		divList = $(".cont3 .story");
		ul.on("click","li",function(e){
			//change style of li
			liList.removeClass("active");
			var indexNew = $(e.currentTarget).addClass("active").index();
			if(indexOld !=indexNew){
				animate(indexOld,indexNew);
				indexOld = indexNew;
			}
			
		});
	}
	var animate = function(indexOld,indexNew){
		var divOld = $(divList[indexOld]);
		var divNew = $(divList[indexNew]);
		if(indexOld>indexNew){
			
			divOld.animate({
				top:animateHeight
			},animateSpeed,"easeInOutQuint",function(){
				divOld.hide();
			});
			divNew.css("top","-"+animateHeight).show();
			divNew.animate({
				top:0
			},animateSpeed,"easeInOutQuint",function(){
				
			})
		}else{
			divOld.animate({
				top:"-"+animateHeight
			},animateSpeed,"easeInOutQuint",function(){
				divOld.hide();
			});
			divNew.css("top",animateHeight).show();
			divNew.animate({
				top:0
			},animateSpeed,"easeInOutQuint",function(){
				
			})
		}
	}
	var pub={
			init:init
	}
	return pub;
})(jQuery);
ZM.navigation = function($,document){
	var naviContainer,contentElements,naviElements,bubbles;
	var activeAnimation = false;
	var fadeFlag = true;
	var init = function(){
		naviContainer =$(".zm_navigation");
		contentElements =$(".navi_content");
		bubbles = naviContainer.find(".speechbubble");
		//Add click handler
		naviElements =naviContainer.find("li").bind("click",function(e){
			var el = $(e.currentTarget);
			markNaviPoint(el)
			var index =el.addClass("active").index();
			//scrollToElement(index==0?$(".main"):contentElements[index]);
			scrollToElement(contentElements[index]);
			addHistoryState($(contentElements[index]).attr("id"));
		});
		//Add scroll handler
		$(document).scroll(onScroll);
		
		//add hover handler
		naviElements.bind("mouseenter",function(e){
			fadeFlag =false;
			var index = $(e.currentTarget).index();
			if(fadeFlag){
				fadeFlag =false;
				var index = $(e.currentTarget).index();
				$(bubbles[index])
					.stop();
				$(bubbles[index]).fadeIn();
			}else{
				$(bubbles[index]).fadeIn();
			}
		});
		naviElements.bind("mouseout",function(e){
			if(!fadeFlag){
				fadeFlag=true;
				var index = $(e.currentTarget).index();
				$(bubbles[index])
					.stop()
					.fadeOut();
			}else{
				$(bubbles[index]).fadeOut();
			}
			
		});
		$(".zm_top_navigation li").on("click",function(e){
			var curr = $(e.currentTarget);
			scrollToElement(contentElements[curr.index()]);
		})
		
	}
	var addHistoryState=function(id){
		if(window.history && window.history.pushState){
			history.pushState(null, null,"#"+id);
		}
	}
	var onScroll = function(){
		if(!activeAnimation){
			var elementSetFlag = false;
			var scrollTop = $(window).scrollTop();
			$.each(contentElements,function(ind,val){
				var container = $(val);
				var top = container.offset().top;
				if(top>=scrollTop &&!elementSetFlag ){
					naviElements.removeClass("active");
					$(naviElements[ind]).addClass("active");
					elementSetFlag=true;
					
					//addHistoryState(container.attr("id"));
				}
			})
		};
	}
	var scrollToElement =function(el){
		activeAnimation =true;
		el = $(el);
		var offset = el.offset().top;
		$('body').animate({scrollTop: offset}, 500,"easeInOutQuint",function(){
			activeAnimation =false;
			onScroll();
		});
	}
	var markNaviPoint = function(el){
		naviElements.removeClass("active");
		$(el).addClass("active");
	}
	var pub ={
			init:init,
			scrollToElement:scrollToElement,
			markNaviPoint:markNaviPoint,
			onScroll:onScroll
	}
	return pub;
}(jQuery,document)
$(document).ready(function(){
	ZM.Gallery.init();
	ZM.Gallery.startSwitch();
	ZM.storySwipe.init();
	ZM.navigation.init();


});