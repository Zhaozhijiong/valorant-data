/**
 * 判断pc还是移动端
 * @returns {boolean}
 */
function isPC() {
  if (/Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(navigator.userAgent)) {
    return false
  } else {
    return true
  }
}

var mapSwiperInit = false;
var mapSwiper2Init = false;
var mapSwiperInitSlide = 0;

/**
 *  弹窗组件
 * @param e
 * @constructor
 */
function TGDialogS(e) {
  // 利用milo库引入dialog组件
  need('biz.dialog', function (Dialog) {
    Dialog.show({
      id: e,
      bgcolor: '#000', //弹出“遮罩”的颜色，格式为"#FF6600"，可修改，默认为"#fff"
      opacity: 70 //弹出“遮罩”的透明度，格式为｛10-100｝，可选
    })
  })
}

function closeDialog() {
  // 利用milo库引入dialog组件
  need('biz.dialog', function (Dialog) {
    Dialog.hide()
  })
}

$(document).on('click', '.view-pic', function () {
    if($(this).parents('.swiper-slide').attr('data-id') === 0 || $(this).parents('.swiper-slide').attr('data-id')) {
        let this_map = gameDataMapsList[$(this).parents('.swiper-slide').attr('data-id')];
        $('#mapDia .swiper-wrapper').html('');
        $.map(this_map.map.location, function(ele) {
            $('#mapDia .swiper-wrapper').append(`
                <div class="swiper-slide">
                <img src="${ele.icon}" alt="">
                </div>
            `);
        });
        $('#mapDia .map-big-title span').text(this_map.name);
        $('#mapDia .map-info-name').text(this_map.name);
        $('#mapDia .map-info-text').text(this_map.feature);
        mapDiaSwiper.update();
    }
  TGDialogS('mapDia');
})

// 切换不同页面
$('.page-tab').on('click', '.page-item', function() {
  skillPlayer && skillPlayer.pause();
    $('.page-tab .page-item').removeClass('on');
    $('.page-tab .page-item:nth-child('+($(this).index()+1)+')').addClass('on');
    $('.inside-page').hide();
    $('.inside-page').eq($(this).index()).show();
    document.querySelector('.wrapper').style.height = document.getElementsByClassName('wrap')[0].offsetHeight * window.innerWidth / 1920 + 'px';
    if($(this).index() !== 0) {
        $('.heropage-bottom-nav').hide();
    }else {
        $('.heropage-bottom-nav').show();
    }
    if($(this).index() === 0) {
        Animate.waitLoading(Animate.titleAni);
        gameDataHerosAni();
        if(location.href.split('heroId=').length > 1) {
          history.replaceState(null,null,location.href.split('?')[0]+'?pageType=1'+'&&heroId='+location.href.split('heroId=')[1].split('&')[0]);
          $('.heronav-swiper .swiper-slide[data-id='+(location.href.split('heroId=')[1].split('&')[0])+']').addClass('on').siblings().removeClass('on');
        }else if(heroId) {
            history.replaceState(null,null,location.href.split('?')[0]+'?pageType=1'+'&&heroId='+heroId);
          $('.heronav-swiper .swiper-slide[data-id='+(heroId-1)+']').addClass('on').siblings().removeClass('on');
        }else {
          history.replaceState(null,null,location.href.split('?')[0]+'?pageType=1');
        }
    }else if($(this).index() == 1) {
        Animate.waitLoading(Animate.titleAni);
        history.replaceState(null,null,location.href.split('?')[0]+'?pageType=2');
        gameDataGunsAni();
    }else if($(this).index() == 2) {
        gameDataMapsAni();
        if(location.href.split('mapId=').length > 1) {
          history.replaceState(null,null,location.href.split('?')[0]+'?pageType=3'+'&&mapId='+location.href.split('mapId=')[1].split('&')[0]);
          if(mapSwiperInit) {
            mapSwiper.slideToLoop(location.href.split('mapId=')[1].split('&')[0]-1);
          }else {
            mapSwiperInitSlide = location.href.split('mapId=')[1].split('&')[0]-1;
          }
        }else {
          history.replaceState(null,null,location.href.split('?')[0]+'?pageType=3');
        }
    }
    if(!isPC()) {
      $('.map-swiper2-box').addClass('hide');
      $('.map-swiper2-box').removeClass('active');
      setTimeout(function() {
          $('.map-swiper2-box').addClass('active');
      },600);
    }
    if($('#common-footer')[0].getBoundingClientRect().top < $(window).height()) {
      $('.heropage-bottom-nav').css({'position': 'absolute','marginBottom': 0});
      if(!isPC()) {
        $('.heropage-bottom-nav').css({'position': 'absolute','marginBottom': $('#common-footer').height()+60});
          $('.ordnance-cont2').css('position','absolute');
          $('.map-swiper2-box').css({'position':'absolute'});
      }
    }else {
      // $('.heropage-bottom-nav').css('position','fixed');
      $('.heropage-bottom-nav').css({'position': 'fixed','marginBottom': 0});
      if(!isPC()) {
          $('.ordnance-cont2').css('position','fixed');
          $('.map-swiper2-box').css('position','fixed');
      }
    }
});

if(window.location.href.split('pageType=').length>1 && window.location.href.split('pageType=')[1].split("&")[0] === '2' ) {
    $('.page-tab').eq(0).find('.page-item').eq(1).click();
}else if(window.location.href.split('pageType=').length>1 && window.location.href.split('pageType=')[1].split("&")[0] === '3') {
    $('.page-tab').eq(0).find('.page-item').eq(2).click();
}else if(window.location.href.split('pageType=').length>1 && window.location.href.split('pageType=')[1].split("&")[0] === '1') {
    $('.page-tab').eq(0).find('.page-item').eq(0).click();
}


// 底部英雄导航show/hide
function heroNavSwitch() {
  var clickHide = true
  $('.nav-switch').on('click', function () {
    $('.heropage-bottom-nav').toggleClass('hide')
    clickHide = !clickHide
  })

  $(window).scroll(function () {
    if (clickHide === false) {
      return false
    }
    var stop = $('.hero-cont2').offset().top
    var top = $(window).scrollTop();
    if (top >= stop) {
      $('.heropage-bottom-nav').removeClass('hide')
    } else {
      $('.heropage-bottom-nav').addClass('hide')
    }
});
    $(window).on('scroll load',function(){
        if(!isPC()) {
            $('.map-swiper2-box').addClass('hide');
            setTimeout(function() {
                $('.map-swiper2-box').addClass('active');
            },600);
        }
        if($('#common-footer')[0].getBoundingClientRect().top < $(window).height()) {
            $('.heropage-bottom-nav').css({'position': 'absolute','marginBottom': 0});
            if(!isPC()) {
              $('.heropage-bottom-nav').css({'position': 'absolute','marginBottom': $('#common-footer').height()+60});
                $('.ordnance-cont2').css('position','absolute');
                $('.map-swiper2-box').css({'position':'absolute'});
            }
        }else {
            // $('.heropage-bottom-nav').css('position','fixed');
            $('.heropage-bottom-nav').css({'position': 'fixed','marginBottom': 0});
            if(!isPC()) {
                $('.ordnance-cont2').css('position','fixed');
                $('.map-swiper2-box').css('position','fixed');
            }
        }
    })
  if ($('.page-hero').css('display') === 'none') {
    $('.heropage-bottom-nav').hide()
  }
}

// 底部地图导航show/hide
function mapNavSwitch() {
  $('.map-swiper2-title').click(function () {
    $('.map-swiper2-box').toggleClass('hide');
  })
  $(window).scroll(function () {
    if ($(window).scrollTop() < 200) {
      $('.map-swiper2-box').removeClass('hide')
    } else {
      $('.map-swiper2-box').addClass('hide')
    }
  });
}

// 枪械分类点击切换
$('.page-ordnance .firearms .swiper-pagination').on('click', 'p', function() {
    $(this).addClass('active').siblings().removeClass('active');
    firearmsSwiper.slideTo($(this).index(),600);
})
// 点击切换当前选中枪械
var initGun = true;
window.GunsMinMaxData = {
    firing_speed: {
        min: NaN,
        max: 0
    },
    moving_speed: {
        min: NaN,
        max: 0
    },
    equipping_speed: {
        min: NaN,
        max: 0
    },
    trajectory_deflection: {
        min: NaN,
        max: 0
    },
    loading_speed: {
        min: NaN,
        max: 0
    },
    cli_size: {
        min: NaN,
        max: 0
    },
}

$('.page-ordnance .firearms-swiper').on('click', '.guns', function() {
    if(!isPC()) {
        if($(this).hasClass('active')) {
            return;
        }
        $('.firearms-swiper').hide();
        $('.guns-type-nav').removeClass('hide');
        $('.show-guns-type').removeClass('active');
        $('.guns-type-name').text(gunsTypeList[$(this).parents('.swiper-slide').attr('data-id')][$(this).index()-1].gun.type_name);
    }
    if($(this).hasClass('active')) {
        return;
    }
    $('.page-ordnance .firearms-swiper .guns').removeClass('active');
    $(this).addClass('active');
    // $('.firearms-img-box img').attr('src','https://game.gtimg.cn/images/val/ag_w/game-data/guns/gun-type'+($(this).parents('.swiper-slide').index()+1)+'-bigimg'+$(this).index()+'.png');
    var this_time = 0;
    if(initGun) {
        Animate.waitLoading(function() {
            gsap.to('.page-ordnance .firearms-img-box img',{x: -100,alpha: 0, duration: 0.65});
            gsap.to('.page-ordnance .firearms-title',{x: -100,alpha: 0, duration: 0.65, delay: 0.1});
            gsap.to('.page-ordnance .firearms-attribute',{x: -100,alpha: 0, duration: 0.65, delay: 0.2});
            gsap.to('.page-ordnance .guns-skin-box',{x: -100,alpha: 0, duration: 0.65, delay: 0.3});
        })
        this_time = 850;
    }else {
        this_time = 0;
    }
    setTimeout(() => {
        if(gunsTypeList[$(this).parents('.swiper-slide').attr('data-id')]) {
            let this_gun = gunsTypeList[$(this).parents('.swiper-slide').attr('data-id')][$(this).index()-1];
            $('.page-ordnance .firearms-img-box img').attr('src',this_gun.icon);
            $('.page-ordnance .firearms-title .firearms-name').text(this_gun.name);
            $('.page-ordnance .firearms-title .price').text(this_gun.gun.price);
            $('.page-ordnance .firearms-title .firearms-type-name > p').text(this_gun.gun.type_name);
            $('.page-ordnance .firearms-title .firearms-type p').eq(0).find('span').text(this_gun.gun.main_firing_mode);
            $('.page-ordnance .firearms-title .firearms-type p').eq(1).find('span').text(this_gun.gun.penetration_name);
            let this_firing_speed = this_gun.gun.firing_speed.slice(0, resetStringMatch(this_gun.gun.firing_speed));
            $('.page-ordnance .attribute-box .attribute').eq(0).find('.num').text(this_firing_speed);
            $('.page-ordnance .attribute-box .attribute').eq(0).find('.progress').css('width',((this_firing_speed-0) - (GunsMinMaxData.firing_speed.min-0)) / ((GunsMinMaxData.firing_speed.max-0) - (GunsMinMaxData.firing_speed.min-0)) * 100 + '%');
            let this_moving_speed = this_gun.gun.moving_speed.slice(0, resetStringMatch(this_gun.gun.moving_speed));
            $('.page-ordnance .attribute-box .attribute').eq(1).find('.num').text(this_moving_speed);
            $('.page-ordnance .attribute-box .attribute').eq(1).find('.progress').css('width',((this_moving_speed-0) - (GunsMinMaxData.moving_speed.min-0)) / ((GunsMinMaxData.moving_speed.max-0) - (GunsMinMaxData.moving_speed.min-0)) * 100 + '%');
            let this_equipping_speed = this_gun.gun.equipping_speed.slice(0, resetStringMatch(this_gun.gun.equipping_speed));
            $('.page-ordnance .attribute-box .attribute').eq(2).find('.num').text(this_equipping_speed);
            $('.page-ordnance .attribute-box .attribute').eq(2).find('.progress').css('width',(100 - ((this_equipping_speed-0) - (GunsMinMaxData.equipping_speed.min-0)) / ((GunsMinMaxData.equipping_speed.max-0) - (GunsMinMaxData.equipping_speed.min-0)) * 100) + '%');
            let this_trajectory_deflection = this_gun.gun.trajectory_deflection.slice(0, resetStringMatch(this_gun.gun.trajectory_deflection));
            let this_sup_trajectory_deflection = this_gun.gun.trajectory_deflection == this_gun.gun.sup_trajectory_deflection ? null : this_gun.gun.sup_trajectory_deflection.slice(0, resetStringMatch(this_gun.gun.sup_trajectory_deflection));
            if(this_sup_trajectory_deflection) {
                $('.page-ordnance .attribute-box .attribute').eq(3).find('.num').text(this_trajectory_deflection+'/'+this_sup_trajectory_deflection);
            }else {
                $('.page-ordnance .attribute-box .attribute').eq(3).find('.num').text(this_trajectory_deflection);
            }
            $('.page-ordnance .attribute-box .attribute').eq(3).find('.progress').css('width',(100 - ((this_trajectory_deflection-0) - (GunsMinMaxData.trajectory_deflection.min-0)) / ((GunsMinMaxData.trajectory_deflection.max-0) - (GunsMinMaxData.trajectory_deflection.min-0)) * 100) + '%');
            let this_loading_speed = this_gun.gun.loading_speed.slice(0, resetStringMatch(this_gun.gun.loading_speed));
            $('.page-ordnance .attribute-box .attribute').eq(4).find('.num').text(this_loading_speed);
            $('.page-ordnance .attribute-box .attribute').eq(4).find('.progress').css('width',(100 - ((this_loading_speed-0) - (GunsMinMaxData.loading_speed.min-0)) / ((GunsMinMaxData.loading_speed.max-0) - (GunsMinMaxData.loading_speed.min-0)) * 100) + '%');
            let this_cli_size = this_gun.gun.cli_size;
            $('.page-ordnance .attribute-box .attribute').eq(5).find('.num').text(this_cli_size);
            $('.page-ordnance .attribute-box .attribute').eq(5).find('.progress').css('width',(((this_cli_size-0) - (GunsMinMaxData.cli_size.min-0)) / ((GunsMinMaxData.cli_size.max-0) - (GunsMinMaxData.cli_size.min-0)) * 100) + '%');
    
            $('.page-ordnance .harm-title strong').html('');
            $('.page-ordnance .harm-data strong').html('');
            for(let i=0; i<this_gun.gun.damage.length; i++) {
                $('.page-ordnance .harm-title strong').append(`<span>${this_gun.gun.damage[i].distance}</span>`);
                $('.page-ordnance .harm-data').eq(0).find('strong').append(`<span>${this_gun.gun.damage[i].head}</span>`);
                $('.page-ordnance .harm-data').eq(1).find('strong').append(`<span>${this_gun.gun.damage[i].body}</span>`);
                $('.page-ordnance .harm-data').eq(2).find('strong').append(`<span>${this_gun.gun.damage[i].leg}</span>`);
            }
            $('.page-ordnance .harm-datum strong span').css('flex-basis',1/this_gun.gun.damage.length * 100 + '%');
            $('.page-ordnance .guns-describe-text').text(this_gun.gun.desc);
            $('.page-ordnance .guns-skin-box .guns-skin img').attr('src',this_gun.icon);
            $('.page-ordnance .guns-skin-box .gun-name').text(this_gun.name);
        }
        if(initGun) {
            Animate.waitLoading(function() {
                gsap.fromTo('.page-ordnance .firearms-img-box img',{x: 100, alpha: 0},{x: 0,alpha: 1, duration: 0.65});
                gsap.fromTo('.page-ordnance .firearms-title',{x: 100, alpha: 0},{x: 0,alpha: 1, duration: 0.65, delay: 0.1});
                gsap.fromTo('.page-ordnance .firearms-attribute',{x: 100, alpha: 0},{x: 0,alpha: 1, duration: 0.65, delay: 0.2});
                gsap.fromTo('.page-ordnance .guns-skin-box',{x: 100, alpha: 0},{x: 0,alpha: 1, duration: 0.65, delay: 0.3});
            })  
        }else {
            initGun = true;
        }
    },this_time);
})

// 切换英雄信息
var heroId = 1;
var skillPlayer = new SuperPlayer({
  container: '#skill-video',
  disableTips: true,
  loop: true,
  autoPlay: false,
  // autoPlayPolicy: 'autoPlayInMuted',
});
function changeHerosMessage(id) {
    id = id ? id : heroId;
    heroId = id;
    var heroData;
    $('.hero-img-box img').removeClass('ani');
    $('.hero-img-box img[data-id=' + id + ']').addClass('active').addClass('ani');
    // 通过接口获取到所有英雄定义在window下
    if(window.allHeroData) {
        for (var hero of window.allHeroData) {
            if (String(hero.id) === String(heroId)) {
                heroData = hero;
                break;
            }
        }

        if (heroData) {
            $('.page-hero .hero-desc .hero-name').text(heroData.name);
    
            window.resetHeroSkill = function() {
                $('.page-hero .skill-tab').html('');
                $('.hero-contract-list .swiper-wrapper').html(`<div class="scroll-tips pc">向左滑动查看更多</div>`);
                if(heroData.agent) {
                    // 渲染技能
                    $.map(heroData.agent.skill,function(ele,ind) {
                        $('.page-hero .skill-tab').append(`
                            <div class="skill-item ${ind === 0 ? 'on' : ''}">
                                <img src="${ele.icon}" alt="">
                            </div>
                        `);
                        Animate.waitLoading(function() {
                            gsap.fromTo($('.page-hero .skill-tab .skill-item').eq(ind)[0],{alpha: 0,x: 100},{alpha: 1,x: 0, duration: 0.65, delay: 0.2 * ind, overwrite: true});
                        })
                        if(heroData.agent.skill.length == ind+1) {
                            Animate.waitLoading(function() {
                                gsap.fromTo($('.page-hero .skill-desc')[0],{alpha: 0,x: 100},{alpha: 1,x: 0, duration: 0.65, delay: 0.2 * ind + 0.2, overwrite: true});
                            })
                        }
                    });
                    // 修改技能文案
                    $('.page-hero .skill-desc').css('opacity',0);
                    $('.page-hero .skill-heading').text(heroData.agent.skill[0].keypad+'-'+heroData.agent.skill[0].name);
                    $('.page-hero .skill-text').text(heroData.agent.skill[0].desc);
                    // 播放技能视频
                    heroData.agent.skill[0].video &&
                      heroData.agent.skill[0].video.vid &&
                      skillPlayer.load({
                        vid: heroData.agent.skill[0].video.vid,
                      });
                    // 修改英雄文案
                    $('.page-hero .hero-occupation').removeClass().addClass('hero-occupation').addClass('hero-occupation'+occupation[heroData.agent.position_name]).text(heroData.agent.position_name);
                    $('.page-hero .hero-text p').text(heroData.agent.desc);
                    // 渲染英雄契约
                    $.map(heroData.agent.contract, function(ele,ind) {
                        $('.hero-contract-list .swiper-wrapper').append(`
                        <div class="swiper-slide">
                            <div class="contract-item">
                            <div class="contract-no">${ele.level > 9 ? ele.level : '0' + ele.level}</div>
                            <img src="${ele.icon}" alt="" class="contract-img">
                            <div class="contract-desc">
                                <h2 class="contract-name">${ele.award}</h2>
                                <p class="contract-exp"><span>${ele.experience}</span>经验</p>
                            </div>
                            </div>
                        </div>
                        `);
                        Animate.waitLoading(function() {
                            gsap.fromTo($('.hero-contract-list .swiper-wrapper .swiper-slide').eq(ind)[0],{alpha: 0,x: 100},{alpha: 1,x: 0, duration: 0.65, delay: 0.2 * ind, overwrite: true});
                        })
                    });
                    heroContractList.update();
                }
            }
            resetHeroSkill();
            setTimeout(() => {
              if(window.location.href.split('pageType=').length>1 && window.location.href.split('pageType=')[1].split("&")[0] === '1') {
                skillPlayer && skillPlayer.play();
              }
            }, 1000);
        }
    }
}
// 点击切换英雄技能介绍
$('.page-hero .skill-tab').on('click', '.skill-item', function() {
    var heroData;
    if(window.allHeroData) {
        for (var hero of window.allHeroData) {
            if (String(hero.id) === String(heroId)) {
                heroData = hero;
                break;
            }
        }

        if (heroData) {
            $('.page-hero .skill-desc').hide();
            $(this).addClass('on').siblings().removeClass('on');
            $('.page-hero .skill-heading').text(heroData.agent.skill[$(this).index()].keypad+'-'+heroData.agent.skill[$(this).index()].name);
            $('.page-hero .skill-text').text(heroData.agent.skill[$(this).index()].desc);
            $('.page-hero .skill-desc').fadeIn(1000);
            // 技能视频
            heroData.agent.skill[$(this).index()].video &&
              heroData.agent.skill[$(this).index()].video.vid &&
              skillPlayer.load({
                vid: heroData.agent.skill[$(this).index()].video.vid,
              });
        }
    }
})

var heronavSwiperIsInit = false;
function init() {
  heroNavSwitch()
  if (isPC()) {
    // 英雄名字swiper
    var initialSlideInd = location.href.split('heroId=').length > 1 ? location.href.split('heroId=')[1].split('&')[0] : 1;

    window.heroNameList = new Swiper('.hero-name-list', {
      direction: "vertical",
      slidesPerView: 6,
      slidesOffsetBefore: -50,
      centeredSlides: true,
      loop: true,
      slideToClickedSlide: true,
      grabCursor: true,
      init: false,
      on:{
        init: function() {
            changeHerosMessage($(this.slides[this.activeIndex]).attr('data-id'));
            setTimeout(function() {
                // $(".page-hero .hero-img-box").css('opacity',1);
                $('.hero-cont-box').addClass('active');
            },650);
            
            if (window.allHeroData) {
                for (var idx = 0; idx < window.allHeroData.length; idx++) {
                    if (String(window.allHeroData[idx].id) === String(initialSlideInd)) {
                        this.slideToLoop(idx);
                        break;
                    }
                }
            }
        },
        slideChangeTransitionStart: function() {
            $(".page-hero .hero-img-box img").removeClass('active');
            $('.page-hero .hero-desc').removeClass('active');
        },
        slideChangeTransitionEnd: function(){
            if($('.page-hero').css('display') !== 'none') {
              history.replaceState(null,null,location.href.split('?')[0]+'?pageType=1'+'&&heroId='+$(this.slides[this.activeIndex]).attr('data-id'));

              // 切换底部导航
              if (window.heronavSwiper) {
                if (!heronavSwiperIsInit) {
                  var heronavSwiperTimer = setInterval(() => {
                    if (heronavSwiperIsInit) {
                      clearInterval(heronavSwiperTimer);
                      window.heronavSwiper.slideTo($(this.slides[this.activeIndex]).attr('data-swiper-slide-index'));
                    }
                  }, 100);
                } else {
                  window.heronavSwiper.slideTo($(this.slides[this.activeIndex]).attr('data-swiper-slide-index'));
                }
              }
            }
            setTimeout(() => {
                changeHerosMessage($(this.slides[this.activeIndex]).attr('data-id'));
                $('.heropage-bottom-nav .swiper-wrapper .swiper-slide').removeClass('on');
                $('.heropage-bottom-nav .swiper-wrapper .swiper-slide[data-id=' + $(this.slides[this.activeIndex]).attr('data-id') + ']').addClass('on');
                $(".page-hero .hero-desc").addClass('active');
            },600)
        },
      },
    })

    // 英雄契约swiper
    window.heroContractList = new Swiper('.hero-contract-list', {
      slidesPerView: 'auto',
      spaceBetween: 34,
      freeMode: true,
      grabCursor: true,
    })

    // 英雄页面相关内容swiper
    var heroRelevantSwiper = new Swiper('.hero-relevant-list', {
      slidesPerView: 'auto',
      spaceBetween: 29,
      slidesPerGroup: 4,
      pagination: {
        el: '.hero-cont5 .hero-relevant-pagination',
        bulletElement: 'li',
        clickable: true
      }
    })

    // 底部英雄导航swiper
    window.heronavSwiper = new Swiper('.heronav-swiper', {
      // loop:true,
      slidesPerView: 10,
      slidesPerGroup: 3,
    //   loopAdditionalSlides: 12,
      loopedSlides: 16,
      grabCursor: true,
      init: false,
      navigation: {
        nextEl: ".heropage-bottom-nav .swiper-button-next",
        prevEl: ".heropage-bottom-nav .swiper-button-prev",
      },
      on: {
        init: function () {
          heronavSwiperIsInit = true;
        }
      },
    })

    // 底部英雄导航点击
    $('.heropage-bottom-nav .swiper-wrapper').on('click', '.swiper-slide', function() {
        heroNameList.slideToLoop($(this).index(),300);
    })

    // 枪械swiper
    window.firearmsSwiper = new Swiper('.page-ordnance .firearms-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 18,
      direction: 'vertical',
      freeMode: true,
      observer: true,
        observeParents: true,
        grabCursor: true,
    })

    // 枪械皮肤swiper
    var gunSkinSwiper = new Swiper('.guns-skin-box', {
      slidesPerView: 'auto',
    })

    // 相关内容
    var ordnanceSwiper = new Swiper('.ordnance-relevant .swiper', {
      slidesPerView: 'auto',
      spaceBetween: 29,
      slidesPerGroup: 4,
      pagination: {
        el: '.ordnance-relevant .swiper-pagination',
        bulletElement: 'li',
        clickable: true,
      }
    })

    // 地图图片swiper
    window.mapSwiper = new Swiper('.map-swiper', {
      loop: true,
      speed: 800,
      resistanceRatio: 0,
      init: false,
      navigation: {
        nextEl: ".map-swiper .swiper-button-next",
        prevEl: ".map-swiper .swiper-button-prev",
      },
      pagination: {
        el: '.map-swiper .swiper-pagination',
        clickable: true,
        bulletElement: 'li',
        renderBullet: function (index, className) {
          return '<li class="' + className + '"><span>' + (index + 1 > 9 ? index + 1 : '0' + (index + 1)) + '</spam></li>';
        },
      },
      on: {
        init: function() {
          mapSwiperInit = true;
          this.slideToLoop(mapSwiperInitSlide);
        },
        slideChangeTransitionEnd: function() {
          if(mapSwiperInit&&mapSwiper2Init) {
            mapSwiper2.slideToLoop(this.realIndex,600,false);
          }
        }
      }
    })

    // 地图图片swiper2
    window.mapSwiper2 = new Swiper(".map-swiper2", {
      slidesPerView: 'auto',
      speed: 800,
      loop: true,
      spaceBetween: 12,
      // freeMode: true,
      init: false,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: ".map-swiper2-box .swiper-button-next",
        prevEl: ".map-swiper2-box .swiper-button-prev",
      },
      watchSlidesVisibility: true,
      grabCursor: true,
      on: {
        init: function() {
          mapSwiper2Init = true;
        },
        slideChangeTransitionEnd: function() {
          if(mapSwiperInit&&mapSwiper2Init) {
            mapSwiper.slideToLoop(this.realIndex,600,false);
          }
        }
      }
    });

    // 地图页面相关内容swiper
    var mapRelevantSwiper = new Swiper('.map-relevant-list', {
      slidesPerView: 'auto',
      spaceBetween: 29,
      slidesPerGroup: 4,
      pagination: {
        el: '.map-cont3 .map-relevant-pagination',
        bulletElement: 'li',
        clickable: true
      }
    })

    // 地图页面弹窗swiper
    window.mapDiaSwiper = new Swiper(".map-dia-swiper", {
      slidesPerView: 'auto',
      speed: 800,
      spaceBetween: 30,
      freeMode: true,
      observer: true,
      observeParents: true,
      slideToClickedSlide: true,
      watchSlidesVisibility: true,
      grabCursor: true,
      navigation: {
        nextEl: ".map-dia-swiper .swiper-button-next",
        prevEl: ".map-dia-swiper .swiper-button-prev",
      },
    });

  } else {
    mapNavSwitch()
    // 英雄名字swiper
    var initialSlideInd = location.href.split('heroId=').length > 1 ? location.href.split('heroId=')[1].split('&')[0] : 1;

    window.heroNameList = new Swiper('.hero-name-list', {
    //   speed: 800,
      observer: true,
      observeParents: true,
      slidesPerView: 'auto',
      spaceBetween: 45,
      loop: true,
    //   freeMode: true,
      slideToClickedSlide: true,
      centeredSlides: true,
      init: false,
      on:{
        init: function() {
          changeHerosMessage($(this.slides[this.activeIndex]).attr('data-id'));
          setTimeout(function() {
              // $(".page-hero .hero-img-box").css('opacity',1);
              $('.hero-cont-box').addClass('active');
          },650);
            
          if (window.allHeroData) {
              for (var idx = 0; idx < window.allHeroData.length; idx++) {
                  if (String(window.allHeroData[idx].id) === String(initialSlideInd)) {
                      this.slideToLoop(idx);
                      break;
                  }
              }
          }
      },
      slideChangeTransitionStart: function() {
          $(".page-hero .hero-img-box img").removeClass('active');
          $('.page-hero .hero-desc').removeClass('active');
      },
      slideChangeTransitionEnd: function(){
          if($('.page-hero').css('display') !== 'none') {
            history.replaceState(null,null,location.href.split('?')[0]+'?pageType=1'+'&&heroId='+$(this.slides[this.activeIndex]).attr('data-id'));
            
            // 切换底部导航
            if (window.heronavSwiper) {
              if (!heronavSwiperIsInit) {
                var heronavSwiperTimer = setInterval(() => {
                  if (heronavSwiperIsInit) {
                    clearInterval(heronavSwiperTimer);
                    window.heronavSwiper.slideTo($(this.slides[this.activeIndex]).attr('data-swiper-slide-index'));
                  }
                }, 100);
              } else {
                window.heronavSwiper.slideTo($(this.slides[this.activeIndex]).attr('data-swiper-slide-index'));
              }
            }
          }
          setTimeout(() => {
              changeHerosMessage($(this.slides[this.activeIndex]).attr('data-id'));
              $('.heropage-bottom-nav .swiper-wrapper .swiper-slide').removeClass('on');
              $('.heropage-bottom-nav .swiper-wrapper .swiper-slide[data-id=' + $(this.slides[this.activeIndex]).attr('data-id') + ']').addClass('on');
              $(".page-hero .hero-desc").addClass('active');
          },600)
      },
      },
    });

    // 英雄契约swiper
    window.heroContractList = new Swiper('.hero-contract-list', {
      slidesPerView: 'auto',
      spaceBetween: 34,
      freeMode: true,
      grabCursor: true,
    });

    // 相关内容swiper
    var relevantSwiper = new Swiper('.hero-relevant-list', {
      slidesPerView: 1,
      pagination: {
        el: '.hero-cont5 .swiper-pagination',
        bulletElement: 'li',
        clickable: true
      }
    });

    // 底部英雄导航swiper
    window.heronavSwiper = new Swiper('.heronav-swiper', {
      slidesPerView: 5,
      slidesPerGroup: 10,
      init: false,
      grid: {
        rows: 2,
      },
      navigation: {
        nextEl: ".heropage-bottom-nav .swiper-button-next",
        prevEl: ".heropage-bottom-nav .swiper-button-prev",
      },
      on: {
        init: function () {
          heronavSwiperIsInit = true;
        }
      },
    })
    // 底部英雄导航点击
    $('.heropage-bottom-nav .swiper-wrapper').on('click', '.swiper-slide', function() {
        heroNameList.slideToLoop($(this).index(),300);
    })

    // 枪械swiper
    window.firearmsSwiper = new Swiper('.firearms-swiper', {
      slidesPerView: 'auto',
      direction: 'vertical',
      observer: true,
      observeParents: true,
      freeMode: true,
    })
    // 头部枪械分类显示更多
    $('.show-guns-type').click(function () {
      if ($(this).hasClass('active')) {
        $('.firearms-swiper').hide();
        $('.guns-type-nav').removeClass('hide');
        $(this).removeClass('active');
      } else {
        $('.firearms-swiper').show();
        $('.guns-type-nav').addClass('hide');
        $(this).addClass('active');
      }
    })

    // 枪械皮肤swiper
    window.gunSkinSwiper = new Swiper('.guns-skin-box', {
      slidesPerView: 'auto',
      observer: true,
    observeParents: true,
      navigation: {
        nextEl: '.ordnance-cont2 .swiper-button-next',
        prevEl: '.ordnance-cont2 .swiper-button-prev',
      },
    //   loop: true,
      centeredSlides: true,
    })
    // 枪械皮肤底部导航
    $('.ordnance-cont2-title').click(function () {
      $('.ordnance-cont2').toggleClass('active');
    })

    // 相关内容
    var ordnanceSwiper = new Swiper('.ordnance-relevant .swiper', {
      slidesPerView: 'auto',
      spaceBetween: 200,
      centeredSlides: true,
      pagination: {
        el: '.ordnance-relevant .swiper-pagination',
        bulletElement: 'li',
        clickable: true,
      }
    })

    // 地图图片swiper
    window.mapSwiper = new Swiper('.map-swiper', {
      speed: 800,
      resistanceRatio: 0,
      init: false,
      loop: true,
      navigation: {
        nextEl: ".map-swiper .swiper-button-next",
        prevEl: ".map-swiper .swiper-button-prev",
      },
      pagination: {
        el: '.map-swiper .swiper-pagination',
        clickable: true,
        bulletElement: 'li',
        renderBullet: function (index, className) {
          return '<li class="' + className + '"><span>' + (index + 1 > 9 ? index + 1 : '0' + (index + 1)) + '</spam></li>';
        },
      },
      on: {
        init: function() {
          mapSwiperInit = true;
          this.slideToLoop(mapSwiperInitSlide);
        },
        slideChangeTransitionEnd: function() {
          if(mapSwiperInit&&mapSwiper2Init) {
            mapSwiper2.slideToLoop(this.realIndex,600,false);
          }
        }
      }
    })

    // 地图图片swiper2
    window.mapSwiper2 = new Swiper(".map-swiper2", {
      slidesPerView: 'auto',
      speed: 800,
      loop: true,
      spaceBetween: 12,
      slideToClickedSlide: true,
      centeredSlides: true,
      init: false,
      navigation: {
        nextEl: ".map-swiper2-box .swiper-button-next",
        prevEl: ".map-swiper2-box .swiper-button-prev",
      },
      watchSlidesVisibility: true,
      grabCursor: true,
      on: {
        init: function() {
          mapSwiper2Init = true;
        },
        slideChangeTransitionEnd: function() {
          if(mapSwiperInit&&mapSwiper2Init) {
            mapSwiper.slideToLoop(this.realIndex,600,false);
          }
        }
      }
    });

    // 地图页面相关内容swiper
    var mapRelevantSwiper = new Swiper('.map-relevant-list', {
      slidesPerView: 'auto',
      spaceBetween: 29,
      pagination: {
        el: '.map-cont3 .map-relevant-pagination',
        bulletElement: 'li',
        clickable: true
      }
    })

    window.mapDiaSwiper = new Swiper(".map-dia-swiper", {
      slidesPerView: 'auto',
      speed: 800,
      spaceBetween: 30,
      observer: true,
      observeParents: true,
      slideToClickedSlide: true,
      watchSlidesVisibility: true,
      grabCursor: true,
      navigation: {
        nextEl: ".map-dia-swiper .swiper-button-next",
        prevEl: ".map-dia-swiper .swiper-button-prev",
      },
    });
  }
}

init()