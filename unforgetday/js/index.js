var swiperA = new Swiper('.swiper-container-1', {
	direction: 'vertical',
	slidesPerView: 'auto',
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
	mousewheel: true,
});

var swiperB = new Swiper('.swiper-container-2', {
	direction: 'vertical',
	slidesPerView: 'auto',
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
	mousewheel: true,
});
var swiperC = new Swiper('.swiper-container-3', {
	direction: 'vertical',
	slidesPerView: 'auto',
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
	mousewheel: true,
});
var swiperD = new Swiper('.swiper-container-4', {
	direction: 'vertical',
	slidesPerView: 'auto',
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
	mousewheel: true,
});
var swiperE = new Swiper('.swiper-container-5', {
	direction: 'vertical',
	slidesPerView: 'auto',
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
	mousewheel: true,
});
$(".tab-btn li").on("click", function() {
	var index = $(this).index();
	$(".tabCon-" + (index + 1)).show().siblings().hide();
	$(this).addClass("active").siblings().removeClass("active")
	swiperA.update()
	swiperB.update()
	swiperC.update()
	swiperD.update()
	swiperE.update()
})
$(".tabCon-1 li").on("click", function() {
	var index = $(this).index()
	game.elementA[1].loadTexture("a_0" + (index + 1))
})

$(".tabCon-2 li").on("click", function() {
	var index = $(this).index()
	game.elementB[1].visible = true
	game.elementB[1].loadTexture("b_0" + (index + 1))	
	game.world.bringToTop(game.elementB[0])
})

$(".tabCon-3 li").on("click", function() {
	var index = $(this).index()
	game.elementC[1].visible = true
	game.elementC[1].loadTexture("c_0" + (index + 1))
	game.world.bringToTop(game.elementC[0])
})

$(".tabCon-4 li").on("click", function() {
	var index = $(this).index()
	game.elementD[1].visible = true
	game.elementD[1].loadTexture("d_0" + (index + 1))
	game.world.bringToTop(game.elementD[0])
})

$(".tabCon-5 li").on("click", function() {
	var index = $(this).index()
	game.elementE[1].visible = true
	game.elementE[1].loadTexture("e_0" + (index + 1))
	game.world.bringToTop(game.elementE[0])
})
$(".btn_return").on("click", function() {
	$(".tk-load").addClass("none")
})
$(".btn_next_d").on("click", function() {
	$(".tk-loading").removeClass("none")
	var len = game.world.children.length
	for(var i = 0; i < len; i++) {
		if(game.world.children[i].name == "group") {
			if(game.world.children[i].children[0].key) {
				if(game.world.children[i].children[0].key.indexOf("a") < 0) {
					//console.log(game.world.children[i].children[0].key)
					game.world.children[i].children[0].children[0].alpha = 0
					game.world.children[i].children[0].children[1].alpha = 0
					game.world.children[i].children[0].children[2].alpha = 0
					game.world.children[i].children[0].children[3].alpha = 0
					//console.log(i)

				}
			}

		}
		if(i == len - 1) {
			game.musicIcon.alpha = 0
			setTimeout(function() {

				$(".tk-loading").addClass("none")
				$(".tk-result").removeClass("none")
				var preHc = game.canvas.toDataURL('image/png');
				$(".canvasImg").attr("src", preHc)
				hcFunc(preHc)
			}, 1000)

		}
	}

})