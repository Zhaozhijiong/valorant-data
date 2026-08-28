// 标题动画
// function fadeTitle(el, scroll_h, scrollTop) {
//   var self_top = $(el).offset().top
//   var self_h = $(el).height()
//   if (scroll_h > self_top + self_h / 2 && scrollTop < self_top + self_h / 2) {
//     $(el).addClass('moveAnimate')
//   }
// }

function EASPTTSendClick(l, b, n) {
    LOLSendClickAT(l, b, n);
}

/**
 * 将对象转换成浏览器url字符串
 * @param {Object} params
 * @returns &xxx&xxx
 */
var formatUrlParams = function formatUrlParams(params, slice) {
    var src = '';
    for (var key in params) {
        src += '&' + key + '=' + params[key];
    }
    return slice ? src.slice(1) : src;
};

/**
 * 获取参数
 * @param {*} objString
 * @returns { key: value }
 */
var getQueryObject = function getQueryObject() {
    var objString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;

    objString = objString.replace(/#.*\?/, '&');
    if (/\?.*#/.test(objString)) {
        objString = objString.replace(/#.*/, '');
    }
    if (objString.startsWith('&')) {
        objString = objString.substr(1);
    }
    if (objString.endsWith('&')) {
        objString = objString.substr(0, objString.length - 1);
    }
    var result = {};
    objString.replace(/([^?&=]+)=([^?&=]*)/g, function (rs, $1, $2) {
        result[decodeURI($1)] = String(decodeURI($2));
        return rs;
    });
    return result;
};

/**
 * 更新链接参数
 */
var updateQueryParam = function updateQueryParam(params) {
    var config = Object.assign({
        link: '',
        params: {},
        change: false
    }, params);

    var updateParams = Object.assign(getQueryObject(), config.params);

    console.debug('更新的链接参数', updateParams);

    var newUrl = '';

    if (config.link) {
        newUrl = config.link + '?' + formatUrlParams(updateParams, true) + window.location.hash;
    } else {
        newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + formatUrlParams(updateParams, true) + window.location.hash;
    }

    console.debug('更新的链接', newUrl);

    if (config.change) {
        window.history.replaceState(null, '', newUrl);
    } else {
        return newUrl;
    }
};

/**
 * 寻找元素下标
 */
function findIndex(collection, predicate) {
    for (let i = 0; i < collection.length; i++) {
        if (predicate(collection[i])) {
            return i; // 返回找到的元素的索引
        }
    }
    return -1; // 如果没有找到匹配的元素，则返回 -1
}

// 搜索文章 - 通过标题搜索
function searchGicpArticleByTitle (params = {}, callback) {
    const option = {
        ibiz: 329,
        source: 'val_gw',
        action: 'search',
        keyword: encodeURIComponent(params.keyword || ''),
        ctype: params.type || '1',
        start: +params.page ? (+params.page - 1) * +params.pageSize : 0,
        limit: params.pageSize || 10,
        tagids: params.tagids || '125139',
        sort: params.sort || 'sIdxTime',
    };
    const url = `https://apps.game.qq.com/cmc/keywordSearch?${ formatUrlParams(option) }`;
    $.ajax({
        url: url,
        success: function (response) {
            if (typeof callback === 'function') {
                if (response.status === 0 && response.data && response.data.items) {
                    callback(response.data);
                } else {
                    callback({
                        items: [],
                        total: 0,
                    });
                }
            }
        },
        error: function (error) {
            console.log(error);
        }
    })
}

let agent = navigator.userAgent.toLowerCase();
let iLastTouchTime = null;
if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
    // document.body.addEventListener("touchmove", function (event) { event.preventDefault();}, { passive: false });
    document.body.addEventListener('touchend',function (event) {
        let iNowTime = new Date().getTime();
        iLastTouchTime = iLastTouchTime || iNowTime+ 1;
        let delta = iNowTime- iLastTouchTime;
        if (delta < 500 && delta > 0) {
            event.preventDefault();
            return false;
        }
        iLastTouchTime = iNowTime;
    }, { passive: false });
};

const isPhone = /(iPhone|iPad|iPod|iOS|Android|Windows Phone|BlackBerry|SymbianOS)/i.test(navigator.userAgent);

//   回到首屏
window.scrollTo(0,0);
$('html, body').css({ 'height': '100vh' });
var body_seti = setInterval(() => {
    window.scrollTo(0,0);
}, 20);
setTimeout(function() {
    clearInterval(body_seti);
    $('html, body').css({'height': '',});
    $('html,body').css({ 'overflow-y': 'auto', 'overflow-x': 'hidden' });
}, 600);

// 移动PC端切换刷新
$(window).on('load', function() {
    localStorage.setItem('isPC',!isPhone);
})
$(window).on('resize', function() {
    if(localStorage.getItem('isPC') !== (!/(iPhone|iPad|iPod|iOS|Android|Windows Phone|BlackBerry|SymbianOS)/i.test(navigator.userAgent) + '')) {
        location.reload();
    }
})

/*
 * 视觉差动画
 */
var onFrame = function (el, scrollTop, type = 0) {
  var innerHeight = window.innerHeight,
    innerWidth = window.innerWidth
  var top = scrollTop,
    bottom = scrollTop,
    depth = -3,
    isPC = innerWidth >= 1024,
    minY = -9999,
    maxY = 9999
  var offset = innerWidth > innerHeight ? 1 : (innerWidth / innerHeight) * 0.75
  if (!el) return
  if (!isPC) {
    el.style.transform = 'translateY(0)'
    return
  }
  var center = (top + bottom) * 2
  var value = 2.0 * (center / innerHeight - 0.5)
  value = type === 1 ? -value : value
  var y = Math.min(Math.max(value * depth * offset, minY), maxY)
  var transform = 'translateY(' + y + 'px)'
  top = top - scrollTop + y
  bottom = bottom - scrollTop + y
  el.style.transform = transform
  el.style.transition = 'transform ease-in-out .5s'
}

// 引入md5加密文件
function addScript(url, callback){
    var script = document.createElement('script');
    script.setAttribute('type','text/javascript');
    script.setAttribute('src',url);
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = function() {
        if(callback) {
            callback();
        }
    }
}

// 职业名
const occupation = {
    "哨卫": 1,
    "先锋": 2,
    "决斗": 3,
    "控场": 4
}

// 数据接口前缀切换
// 正式接口 'https://api.val.qq.com/'
// 测试接口 'https://test-api.val.qq.com/'
const linkPre = 'https://api.val.qq.com/'

// 新闻拉取
const dataList = {
    start: 0,
    maxLength: 10,
    // 获取新闻列表
    /**
     *
     * @param {*} data.start 从第几条开始
     * @param {*} data.maxLength 最大长度
     * @param {*} data.callback 回调方法,需传入items新闻详情对象
     * @param {*} data.docid 传入当前新闻详情id进行过滤
     */
    getNewsList: function(data) {
        $.ajax({
            url: `https://apps.game.qq.com/cmc/cross?serviceId=329&source=val_gw&tagids=125139&typeids=1&start=${data.start ? data.start : this.start }&limit=${data.maxLength ? data.maxLength : this.maxLength}&withtop=yes`,
            success: function (res) {
                if(!res.data.items) {
                    return;
                }
                if(data.docid) {
                    res.data.items = res.data.items.filter(function(ele) {
                        return data.docid.indexOf(ele.iDocID) === -1;
                    })
                }
                console.log(res.data.items);
                if(data.callback) {
                    data.callback(res.data.items);
                }
                // return res.data.items;
            },
            error:function (msg) {
                console.log("错误内容"+msg);
            }
        });
    },
    // 获取新闻详情
    /**
     *
     * @param {*} data.iDocID 当前查询新闻id
     * @param {*} data.callback 传入的回调方法
     */
    readerNews: function(data) {
        const docid = data.iDocID || window.location.href.split("docid=")[1].split("&")[0];
        const ibiz = 329;
        const source = "val_gw";
        const t = parseInt(new Date().getTime() / 1000);
        // const t = parseInt(milo.getSeverDateTime().getTime() / 1000);
        const sign = hex_md5(source + source + ibiz + t).toLowerCase();
        $.ajax({
          url: `https://apps.game.qq.com/cmc/complexDetail?sign=${sign}&source=${source}&ibiz=${ibiz}&subBiz=0&t=${t}&id=${docid}&detailFlag=1&status=1`,
          success: (res) => {
            const v = res.data[0];
            console.log(v);
            if(!v) {
                return;
            }
            // console.log(v);
            if(data.callback) {
                data.callback(v);
            }
            document.querySelector('.wrapper').style.height = document.getElementsByClassName('wrap')[0].offsetHeight * window.innerWidth / 1920 + 'px';
          },
          error: (err) => console.log(err),
        });
    },
    // 获取所有英雄列表
    /**
     *
     * @param {*} data.callback 回调函数
     */
    getAllHeroList: function(data) {
        $.ajax({
            url: `${linkPre}go/agame/graphql/graphiQL?query=%7B%0A%20%20agents%20%7B%0A%20%20%20%20id%0A%20%20%20%20name%0A%20%20%20%20e_name%0A%20%20%20%20icon%0A%20%20%7D%0A%7D%0A`,
            success: (res) => {
                console.log('获取所有英雄列表',res)
                if(!res.data.agents) {
                    return;
                }
                if(data.callback) {
                    data.callback(res.data.agents);
                }
            },
            error: (err) => console.log(err),
        });
    },
    // 获取单个英雄信息
    /**
     *
     * @param {*} data.callback 回调函数
     * @param {*} data.id 英雄id
     */
    getHeroMessage: function(data) {
        $.ajax({
            url: `${linkPre}go/agame/graphql/graphiQL?query=%7B%0A%20%20agent(id%3A${data.id ? data.id : 1})%7B%0A%20%20%20%20name%20%0A%20%20%20%20e_name%0A%20%20%20%20desc%0A%20%20%20%20position_name%0A%20%20%20%20skill%20%7B%0A%20%20%20%20%20%20cost%0A%20%20%20%20%20%20desc%0A%20%20%20%20%20%20e_name%0A%20%20%20%20%20%20icon%0A%20%20%20%20%20%20keypad%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20type%0A%20%20%20%20%20%20type_name%0A%20%20%20%20%20%20video%7B%0A%20%20%20%20%20%20%20%20vid%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20contract%20%7B%0A%20%20%20%20%20%20award%0A%20%20%20%20%20%20experience%0A%20%20%20%20%20%20icon%0A%20%20%20%20%20%20level%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D`,
            success: (res) => {
                console.log('获取单个英雄信息',res)
                if(!res.data.agent) {
                    return;
                }
                if(data.callback) {
                    data.callback(res.data.agent);
                }
            },
            error: (err) => console.log(err),
        });
    },
    // 获取所有枪械数据
    /**
     *
     * @param {*} data.callback 回调函数
     */
    getAllGunList: function(data) {
        $.ajax({
            url: `${linkPre}go/agame/graphql/graphiQL?query={
                guns {
                    name
                    id
                    e_name
                    icon
                }
            }`,
            success: (res) => {
                if(!res.data.guns) {
                    return;
                }
                window.gunsList = res.data.guns;
                window.gunsTypeList = {};
                let this_getLength = res.data.guns.length;
                let estimateLength = 0;
                let estimateData = function(id,this_gun) {
                    var index = findIndex(gunsList, (item) => item.id === id);
                    gunsList[index].gun = this_gun;
                    estimateLength++;

                    if(gunsTypeList[gunsList[index].gun.type_name]) {
                        gunsTypeList[gunsList[index].gun.type_name].push(gunsList[index]);
                    }else {
                        gunsTypeList[gunsList[index].gun.type_name] = [gunsList[index]];
                    }
                    function resetMinMaxData() {
                        let this_firing_speed = this_gun.firing_speed.slice(0, resetStringMatch(this_gun.firing_speed));
                        if(!GunsMinMaxData.firing_speed.min || GunsMinMaxData.firing_speed.min-0 > this_firing_speed-0) {
                            GunsMinMaxData.firing_speed.min = this_firing_speed;
                        }
                        if(GunsMinMaxData.firing_speed.max-0 < this_firing_speed-0) {
                            GunsMinMaxData.firing_speed.max = this_firing_speed;
                        }
                        let this_moving_speed = this_gun.moving_speed.slice(0, resetStringMatch(this_gun.moving_speed));
                        if(!GunsMinMaxData.moving_speed.min || GunsMinMaxData.moving_speed.min-0 > this_moving_speed-0) {
                            GunsMinMaxData.moving_speed.min = this_moving_speed;
                        }
                        if(GunsMinMaxData.moving_speed.max-0 < this_moving_speed-0) {
                            GunsMinMaxData.moving_speed.max = this_moving_speed;
                        }
                        let this_equipping_speed = this_gun.equipping_speed.slice(0, resetStringMatch(this_gun.equipping_speed));
                        if(!GunsMinMaxData.equipping_speed.min || GunsMinMaxData.equipping_speed.min-0 > this_equipping_speed-0) {
                            GunsMinMaxData.equipping_speed.min = this_equipping_speed;
                        }
                        if(GunsMinMaxData.equipping_speed.max-0 < this_equipping_speed-0) {
                            GunsMinMaxData.equipping_speed.max = this_equipping_speed;
                        }
                        let this_trajectory_deflection = this_gun.trajectory_deflection.slice(0, resetStringMatch(this_gun.trajectory_deflection));
                        if(!GunsMinMaxData.trajectory_deflection.min || GunsMinMaxData.trajectory_deflection.min-0 > this_trajectory_deflection-0) {
                            GunsMinMaxData.trajectory_deflection.min = this_trajectory_deflection;
                        }
                        if(GunsMinMaxData.trajectory_deflection.max-0 < this_trajectory_deflection-0) {
                            GunsMinMaxData.trajectory_deflection.max = this_trajectory_deflection;
                        }
                        let this_loading_speed = this_gun.loading_speed.slice(0, resetStringMatch(this_gun.loading_speed));
                        if(!GunsMinMaxData.loading_speed.min || GunsMinMaxData.loading_speed.min-0 > this_loading_speed-0) {
                            GunsMinMaxData.loading_speed.min = this_loading_speed;
                        }
                        if(GunsMinMaxData.loading_speed.max-0 < this_loading_speed-0) {
                            GunsMinMaxData.loading_speed.max = this_loading_speed;
                        }
                        let this_cli_size = this_gun.cli_size;
                        if(!GunsMinMaxData.cli_size.min || GunsMinMaxData.cli_size.min-0 > this_cli_size-0) {
                            GunsMinMaxData.cli_size.min = this_cli_size;
                        }
                        if(GunsMinMaxData.cli_size.max-0 < this_cli_size-0) {
                            GunsMinMaxData.cli_size.max = this_cli_size;
                        }
                    }
                    resetMinMaxData();
                    if(estimateLength >= this_getLength) {
                        // 数据加载完毕，调用回调方法渲染
                        console.log('ok');
                        for(let key in gunsTypeList) {
                            gunsTypeList[key].sort((a,b) => {
                                return (Number(a.gun.price) ? Number(a.gun.price) : 0) - (Number(b.gun.price) ? Number(b.gun.price) : 0);
                            })
                        }
                        if(data&&data.callback) {
                            data.callback(gunsTypeList);
                        }
                    }
                }
                $.map(res.data.guns, (ele,ind) => {
                    this.getGunData({id: ele.id, callback: estimateData});
                })
            },
            error: (err) => console.log(err),
        });
    },
    // 获取单个枪械详情数据
    /**
     *
     * @param {*} data.id 枪械id
     */
    getGunData: function(data) {
        $.ajax({
            url: `${linkPre}go/agame/graphql/graphiQL?query=%7B%0A%20%20gun(id%3A${data.id})%7B%0A%20%20%20%20name%20%0A%20%20%20%20e_name%0A%20%20%20%20icon%0A%20%20%20%20desc%0A%20%20%20%20cli_size%0A%20%20%20%20type_name%0A%20%20%20%20price%0A%20%20%20%20firing_speed%0A%20%20%20%20equipping_speed%0A%20%20%20%20loading_speed%0A%20%20%20%20moving_speed%0A%20%20%20%20trajectory_deflection%0A%20%20%20%20main_firing_mode%0A%20%20%20%20penetration_name%0A%20%20%20%20sup_trajectory_deflection%0A%20%20%20%20damage%20%7B%0A%20%20%20%20%20%20body%0A%20%20%20%20%20%20distance%0A%20%20%20%20%20%20head%0A%20%20%20%20%20%20leg%0A%20%20%20%20%7D%0A%20%20%20%20skin%20%7B%0A%20%20%20%20%20%20e_name%0A%20%20%20%20%20%20icon%0A%20%20%20%20%20%20level%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D`,
            success: (res) => {
                if(!res.data.gun) {
                    return;
                }
                if(data&&data.callback) {
                    data.callback(data.id,res.data.gun);
                }
            },
            error: (err) => console.log(err),
        });
    },
    // 获取全部地图
    /**
     *
     * @param {*} data.callback 回调
     */
    getAllMap(data) {
        $.ajax({
            url: `${linkPre}go/agame/graphql/graphiQL?query=%7B%0A%20%20maps%7B%0A%20%20%20%20name%20%0A%20%20%20%20e_name%0A%20%20%20%20icon%0A%20%20%7D%0A%7D`,
            success: (res) => {
                if(!res.data.maps) {
                    return;
                }
                if(data&&data.callback) {
                    data.callback(res.data.maps);
                }
            },
            error: (err) => console.log(err),
        });
    },
    // 获取单个地图信息
    /**
     *
     * @param {*} data.callback 回调
     * @param {*} data.id 地图id
     */
    getMapData(data) {
        $.ajax({
            url: `${linkPre}go/agame/graphql/graphiQL?query=%7B%0A%20%20map(id%3A${data.id})%7B%0A%20%20%20%20name%20%0A%20%20%20%20e_name%0A%20%20%20%20icon%0A%20%20%20%20feature%0A%20%20%20%20location%20%7B%0A%20%20%20%20%20%20icon%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20plane_img%20%7B%0A%20%20%20%20%20%20img_url%0A%20%20%20%20%20%20title%0A%20%20%20%20%7D%0A%20%20%20%20plant_num%0A%20%20%20%20preview%0A%20%20%7D%0A%7D`,
            success: (res) => {
                if(!res.data.map) {
                    return;
                }
                if(data&&data.callback) {
                    data.callback(res.data.map);
                }
            },
            error: (err) => console.log(err),
        });
    },
};

// 渲染首页新闻资讯
function mainNews() {
    $('.newsinfo-list').html('');
    let resetNews = function(this_news) {
        $.map(this_news, function(ele,key) {
            $('.newsinfo-list').append(
                `
                <div class="newsinfo-item">
                    <a href="./newsdetails.html?docid=${ele.iDocID}&goback=main" class="her-link" onclick="LOLSendClickAT('her','her-link','新闻资讯')"></a>
                    <div class="img-box">
                        <img src="${ele.sIMG}" alt="">
                    </div>
                    <div class="newsinfo-log">
                        <p class="time">${ele.sIdxTime.split(' ')[0]}</p>
                        <p class="type">${ele.sTagInfo.split(',')[0].split('|')[1]}</p>
                    </div>
                    <p class="newsinfo-title">${ele.sTitle}</p>
                </div>
                `
            )
        })
        Animate.showRight($('.newsinfo-list .newsinfo-item'));
    }
    dataList.getNewsList({start: 0, maxLength: 3, callback: resetNews});
    // let resetSlideNews = function(this_news) {
    //     $('.cont3-swiper .swiper-wrapper').html('');
    //     $.map(this_news, function(ele, key) {
    //         $('.cont3-swiper .swiper-wrapper').append(
    //             `
    //             <div class="swiper-slide">
    //                 <img src="${ele.sIMG}" class="propagandize">
    //                 <div class="propagandize-cent">
    //                 <p class="propagandize-title">${ele.sTitle}</p>
    //                 <p class="propagandize-txt">
    //                     ${ele.sDesc}
    //                 </p>
    //                 <a href="./newsdetails.html?docid=${ele.iDocID}&goback=main" class="btn btn-interest">
    //                     <div class="btn-cent">
    //                     <span class="btn-hover"></span>
    //                     <span class="text">我感兴趣</span>
    //                     </div>
    //                 </a>
    //                 </div>
    //             </div>
    //             `
    //         );
    //     });
    //     newsSwiper.init();
    // }
    // dataList.getNewsList({start: 0, maxLength: 5, callback: resetSlideNews});
}

// 渲染首页英雄
function mainHeros() {
    let resetHeros = function(this_heros) {
        $('.hero-name-list .swiper-wrapper').html('');
        $('.hero-img-list').html('');
        window.allHeroData = this_heros;
        $.map(this_heros, function(ele,ind) {
            var heroId = ele.id;
            $('.hero-name-list .swiper-wrapper').append(`
                <p class="hero-name swiper-slide" data-id="${heroId}"><span class="hero-no">${ind+1 > 9 ? ind+1 : '0'+(ind+1)}</span><span class="name">${ele.name}</span></p>
            `);
            $('.hero-img-list').append(`
                <div data-id="${heroId}" class="hero-img ${ind === 0 ? 'active' : ''}">
                <img src="https://game.gtimg.cn/images/val/agamezlk/bigpic/${heroId > 9 ? heroId : '0'+(heroId)}.png">
                </div>
            `);
            dataList.getHeroMessage({id: heroId,callback: function(this_hero) {
                allHeroData[ind].agent = this_hero;
                if((heroId) === 1) {
                    getHeroData(1);
                }
            }});
        })

        heroSwiper.init();
    }
    dataList.getAllHeroList({callback: resetHeros});
}

// 渲染首页地图
function mainMaps() {
    let resetMaps = function(this_maps) {
        $('.cont6-swiper .swiper-wrapper').html('');
        $.map(this_maps, function(ele,ind) {
            $('.cont6-swiper .swiper-wrapper').append(`
                <div class="swiper-slide" data-id="${ind+1}" data-name="${ele.name}">
                    <picture>
                        <img src="${ele.icon}" alt="地图" class="cont6-map">
                    </picture>
                </div>
            `)
        });
        mapSwiper.init();
    }
    dataList.getAllMap({callback: resetMaps});
}

// 渲染新闻页资讯
function newsPage() {
    let resetSlideNews = function(this_news) {
        $('.news-swiper .swiper-wrapper').html('');
        $.map(this_news, function(ele,ind) {
            $('.news-swiper .swiper-wrapper').append(
                `
                <div class="swiper-slide">
                    <img src="${ele.sIMG}" alt="news" class="news-thumb">
                    <p class="nub">${ind+1 > 9 ? ind+1 : '0'+(ind+1)}</p>
                    <p class="time">${ele.sIdxTime.split(' ')[0]}</p>
                    <p class="news-title">${ele.sTitle}</p>
                    <p class="news-preview">
                        ${ele.sDesc}
                    </p>
                    <a href="./newsdetails.html?docid=${ele.iDocID}&goback=news" class="news-detail"></a>
                </div>
                `
            );
        });
        newsSwiper.init();
    };
    dataList.getNewsList({start: 0, maxLength: 3, callback: resetSlideNews});

    let searchPagination = {
        total: 0, // 总数
        page: 1, // 当前页
        pageSize: isPhone ? 10 : 10, // 每页显示数量
    };
    let resetNewsList = function(data) {
        searchPagination.total = data.total;
        let isShowPagination = searchPagination.total / searchPagination.pageSize > 1 ? true : false;
        if (isShowPagination) { $('.search-pagination').show() } else { $('.search-pagination').hide() }
        $('.news-list').html('');
        if (data && data.items.length) {
            $.map(data.items, function(ele) {
                $('.news-list').append(
                    `
                    <div class="news news${ele.iDocID}" onclick="EASPTTSendClick('btn', 'news-${ele.iDocID}', '文章${ele.iDocID}');">
                        <img src="${ele.sIMG}" alt="news" class="news-img">
                        <div class="news-text">
                            <p class="time">${ele.sIdxTime.split(' ')[0]}</p>
                            <p class="news-title">${ele.sTitle}</p>
                            <p class="news-preview">${ele.sDesc}</p>
                            <div class="news-details">
                                <a href="./newsdetails.html?docid=${ele.iDocID}&goback=news" class="news-detailsbtn">阅读新闻</a>
                            </div>
                        </div>
                    </div>
                    `
                );
                Animate.waitLoading(function() {
                    if(!isPhone) {
                        ScrollTrigger.create({
                            animation: gsap.to($('.news-list .news'+ele.iDocID)[0],{y: 0, alpha: 1, duration: 0.65,onStart: function() {
                                let this_parent = $('.news-list .news'+ele.iDocID);
                                var delayTime = 0;
                                if(this_parent.find('.news-preview').text() == '') {
                                    delayTime = 1;
                                }
                                gsap.to(this_parent.find('.time')[0],{x: 0, alpha: 1, duration: 0.65});
                                gsap.to(this_parent.find('.news-title')[0],{x: 0, alpha: 1, duration: 0.65, delay: 0.15});
                                gsap.to(this_parent.find('.news-preview')[0],{x: 0, alpha: 1, duration: 0.65, delay: (0.15 * 2)});
                                gsap.to(this_parent.find('.news-details')[0],{x: 0, alpha: 1, duration: 0.65, delay: (0.15 * (3 - delayTime))});
                            }}),
                            trigger: $('.news-list .news'+ele.iDocID)[0],
                            start: "top bottom",
                            // markers: true,
                            once: true,
                        })
                    }else {
                        ScrollTrigger.create({
                            animation: gsap.to($('.news-list .news'+ele.iDocID)[0],{alpha: 1, duration: 0.65,onStart: function() {
                                let this_parent = $('.news-list .news'+ele.iDocID);
                                var delayTime = 0;
                                if(this_parent.find('.news-preview').text() == '') {
                                    delayTime = 1;
                                }
                                gsap.to(this_parent.find('.time')[0],{y: 0, alpha: 1, duration: 0.65});
                                gsap.to(this_parent.find('.news-img')[0],{y: 0, alpha: 1, duration: 0.65, delay: 0.15});
                                gsap.to(this_parent.find('.news-title')[0],{y: 0, alpha: 1, duration: 0.65, delay: 0.3});
                                gsap.to(this_parent.find('.news-preview')[0],{y: 0, alpha: 1, duration: 0.65, delay: (0.15 * 3)});
                                gsap.to(this_parent.find('.news-details')[0],{y: 0, alpha: 1, duration: 0.65, delay: (0.15 * (4 - delayTime))});
                            }}),
                            trigger: $('.news-list .news'+ele.iDocID)[0],
                            start: "top bottom",
                            // markers: true,
                            once: true,
                        })
                    }
                })
            })
            Animate.waitLoading(function() {
                gsap.set('.search-pagination',{y: 100, alpha: 0});
                ScrollTrigger.create({
                    animation: gsap.to('.search-pagination',{y: 0, alpha: 1,duration: 0.65 }),
                    trigger: ".search-pagination",
                    start: "top bottom",
                    once: true,
                })
            })
        } else {
            $('.news-list').html('<div class="no-data">很抱歉，没有找到您要的内容</div>');
        }
        document.querySelector('.wrapper').style.height = document.getElementsByClassName('wrap')[0].offsetHeight * window.innerWidth / 1920 + 'px';
        layui.use(function () {
            var laypage = layui.laypage;
            // 完整显示
            laypage.render({
                elem: 'search-pagination', // 元素 id
                count: searchPagination.total, // 数据总数
                limit: searchPagination.pageSize,
                curr: searchPagination.page,
                groups: isPhone ? 3 : 5,
                layout: ['prev', 'page', 'next', 'skip'], // 功能布局
                prev: '<i class="icon-arrow-prev"></i>',
                next: '<i class="icon-arrow-next"></i>',
                skipText: ['跳转至', '页', '<i class="icon-arrow"></i>'],
                jump: function (obj, first) {
                    if (!first) {
                        searchPagination.page = obj.curr;
                        getSearch();
                        window.scrollTo(0, $('.cont2').offset().top - 70);
                    }
                }
            });
        });
    };
    // 搜索内容
    let searchInputValue = '';
    // 监听搜索栏输入
    function handleSearchInput (event) {
        searchInputValue = event.target.value;

        if (searchInputValue) {
            $('.search-clear').show();
        } else {
            $('.search-clear').hide();
        }
    }
    // 搜索栏按键监听
    function handleSearchInputKeydown (event) {
        if (+event.keyCode === 13 || +event.keyCode === 10) {
            handleSearchSubmit();
        }
    }
    // 搜索内容
    function handleSearchSubmit () {
        searchPagination.page = 1;
        getSearch();
    }
    // 获取内容
    function getSearch (params) {
        let searchParams = Object.assign({
            page: searchPagination.page,
            keyword: searchInputValue,
        }, params);
        searchGicpArticleByTitle(Object.assign({
            pageSize: searchPagination.pageSize,
        }, searchParams), resetNewsList);
        updateQueryParam({
            params: searchParams,
            change: true,
        });
    }

    let urlParams = getQueryObject(window.location.href);
    if (urlParams.page) {
        searchPagination.page = urlParams.page;
    }
    if (urlParams.keyword) {
        searchInputValue = urlParams.keyword;
        $('.search-input').get(0).value = urlParams.keyword;
        $('.search-clear').show();
    }
    getSearch();

    $('.search-input').on('input', handleSearchInput);
    $('.search-input').on('keydown', handleSearchInputKeydown);
    $('.search-submit').on('click', handleSearchSubmit);
    $('.search-clear').on('click', function () {
        $('.search-input').get(0).value = '';
        searchPagination.page = 1;
        searchInputValue = '';
        $('.search-clear').hide();
        getSearch();
    });
}

// 新闻详情页
function newsDetails() {
    addScript('js/md5.js',function() {
        let docid = window.location.href.split("docid=")[1].split("&")[0];
        // 渲染更多新闻列表
        function resetNewsDetailsList(this_news) {
            $('.news-relevant .swiper-wrapper').html('');
            $.map(this_news, function(ele,ind) {
                $('.news-relevant .swiper-wrapper').append(
                    `
                        <div class="swiper-slide">
                            <img src="${ele.sIMG}" class="news-img">
                            <h4 class="news-nub">${ind+1 > 9 ? ind+1 : '0'+(ind+1)}</h4>
                            <p class="news-time">${ele.sIdxTime.split(' ')[0]}</p>
                            <p class="news-caption">${ele.sTitle}</p>
                            <a href="./newsdetails.html?docid=${ele.iDocID}" class="go-details"></a>
                        </div>
                    `
                );
            })
            Animate.showRight($('.news-relevant .swiper-wrapper .swiper-slide'));
            newsSwiper.init();
        };
        dataList.getNewsList({start: 0, maxLength: 8, callback: resetNewsDetailsList, docid: docid});
        // 渲染新闻详情
        function resetNewsDetails(this_news) {
            $('.news-message .news-time').text(this_news.sIdxTime.split(' ')[0]);
            $('.news-message .news-type').text(this_news.sTagInfo.split(',')[0].split('|')[1]);
            $('.news-tags').html('<p>标签</p>');
            $.map(this_news.sTagInfo.split(','),function(ele) {
                $('.news-tags').append(`<p class="news-tag">${ele.split('|')[1]}</p>`);
            })
            $('.news-title').text(this_news.sTitle);
            $('.news-text').html(this_news.sContent);
            $('.cont1 img').attr('src',this_news.sIMG);
        }
        dataList.readerNews({iDocID: docid, callback: resetNewsDetails});
    });
}

// 渲染游戏资料页英雄列表
function gameDataHeros() {
    let resetHeros = function(this_heros) {
        $('.page-hero .hero-name-list .swiper-wrapper').html('');
        $('.page-hero .hero-img-box').html('');
        window.allHeroData = this_heros;
        $.map(this_heros, function(ele,ind) {
            var heroId = ele.id;
            $('.page-hero .hero-name-list .swiper-wrapper').append(`
                <div class="swiper-slide" data-id="${heroId}">
                    <div class="hero-name">
                    <span>${ind+1 > 9 ? ind+1 : '0'+(ind+1)}</span>
                    <p>${ele.name}</p>
                    </div>
                </div>
            `);
            $('.page-hero .hero-img-box').append(`
                <img data-id="${heroId}" src="https://game.gtimg.cn/images/val/agamezlk/bigpic/${heroId > 9 ? heroId : '0'+(heroId)}.png" class="${ind === 0 ? 'active' : ''}">
            `);
            dataList.getHeroMessage({id: heroId,callback: function(this_hero) {
                allHeroData[ind].agent = this_hero;
                if((heroId) === 1) {
                    resetHeroSkill();
                }
            }});
        })
        heroNameList.init();

        // 渲染底部英雄列表
        $('.heropage-bottom-nav .swiper-wrapper').html('');
        $.map(this_heros, function(ele,ind) {
            $('.heropage-bottom-nav .swiper-wrapper').append(
                `
                <div class="swiper-slide swiper-slide${ind} heronav-item ${ind === 0 ? 'on' : ''}"  data-id="${ele.id}">
                    <div class="heronav-img">
                    <img src="${ele.icon}" alt="">
                </div>
                `
            );
        });
        heronavSwiper.init();

    }
    dataList.getAllHeroList({callback: resetHeros});
}

// 渲染游戏资料页枪械列表
function gameDataGuns() {
    let resetGameGuns = function (this_data) {
        $('.page-ordnance .firearms-swiper .swiper-wrapper').html('');
        $('.ordnance-cont1 .firearms .swiper-pagination').html('');

        // 根据枪械列表收集类型
        let thisSequence = [];
        for (var gunItem of window.gunsList) {
            var gunTypeName = gunItem.gun && gunItem.gun.type_name;
            if (gunTypeName && thisSequence.indexOf(gunTypeName) === -1) {
                thisSequence.push(gunTypeName);
            }
        }

        // 分组展示枪械
        for(let i=0; i<thisSequence.length; i++) {
            let this_gun = `<div class="swiper-slide" data-id="${thisSequence[i]}"><p class="classify-name">${thisSequence[i]}</p>`;
            $.map(this_data[thisSequence[i]], function(ele,ind) {
                this_gun +=
                `
                  <div class="guns ${i == 0 && ind == 0 ? '' : ''}">
                    <img src="${ele.icon}" class="guns-img">
                    <p class="guns-name">${ele.name}</p>
                  </div>
                `;
            })
            this_gun += `</div>`;
            $('.page-ordnance .firearms-swiper .swiper-wrapper').append(this_gun);
            $('.ordnance-cont1 .firearms .swiper-pagination').append(`<p${i === 0 ? ' class="active"' : ''}>${thisSequence[i]}</p>`);
        }
        firearmsSwiper.update();
        $('.page-ordnance .firearms-swiper .swiper-wrapper .swiper-slide').eq(0).find('.guns').eq(0).click();
    }

    dataList.getAllGunList({callback: resetGameGuns});
}

// 渲染游戏资料页地图列表
function gameDataMaps() {
    let resetMaps = function(this_maps) {
        $('.page-map .map-swiper .swiper-wrapper').html('');
        $('.page-map .map-swiper2 .swiper-wrapper').html('');
        window.gameDataMapsList = this_maps;
        $.map(this_maps, function(ele,ind) {
            $('.page-map .map-swiper .swiper-wrapper').append(`
                <div class="swiper-slide swiper-slide${ind}">
                    <img src="${ele.icon}" alt="">
                    <div class="map-desc">
                        <div class="map-desc-name">${ele.name}</div>
                        <div class="map-desc-text">
                        </div>
                    </div>
                </div>
            `);

            $('.page-map .map-swiper2 .swiper-wrapper').append(`
                <div class="swiper-slide" data-id="${ind}">
                    <div class="view-pic"></div>
                    <div class="tag-num">${ind+1 > 9 ? ind+1 : '0'+(ind+1)}</div>
                    <img src="${ele.icon}" alt="">
                </div>
            `);

            // 获取每个地图详情挂载在window下
            dataList.getMapData({id: (ind+1),callback: function(thisMap) {
                gameDataMapsList[ind].map = thisMap;
                $('.page-map .map-swiper .swiper-slide'+ind+' .map-desc-text').text(thisMap.feature);
            }})
        });
        mapSwiper.init();
        mapSwiper2.init();
    }
    dataList.getAllMap({callback: resetMaps});
}

// 首页动画
function mainAni() {
    // kv ani
    if(!isPhone) {
        function kv() {
            var this_ani = gsap.timeline();
            this_ani
                .to('.cont1-cent',{y: 160, ease: 'none'});
            ScrollTrigger.create({
                animation: this_ani,
                trigger: ".cont1-cent",
                start: "top " + $('body').css('paddingTop'),
                end: "435px " + $('body').css('paddingTop'),
                // markers: true,
                scrub: true,
            })
        }
        Animate.waitLoading(kv);
    }else {
        Animate.waitLoading(function() {
            ScrollTrigger.create({
                animation: gsap.to('.cont1-cent',{y: 0, alpha: 1, duration: 0.65}),
                trigger: '.cont1-cent',
                start: "top bottom",
                // markers: true,
                once: true,
            })
        })
    }

    // cont3 ani
    function cont3() {
        ScrollTrigger.create({
            animation: gsap.to('.cont3',{y: 0, alpha: 1}),
            trigger: ".cont3",
            start: "top bottom-=80",
            once: true,
        })
    }
    Animate.waitLoading(cont3);

    // cont4
    if(!isPhone) {
        Animate.showRight([$('.cont4 .mode-box')[0],$('.cont4 .video-box')[0]]);
    }else {
        Animate.waitLoading(function() {
            gsap.set('.cont4 .val-box',{y: 100, alpha: 0});
            ScrollTrigger.create({
                animation: gsap.to('.cont4 .val-box',{y: 0, alpha: 1, duration: 0.65}),
                trigger: '.cont4 .val-box',
                start: "top bottom",
                // markers: true,
                once: true,
            })
        })
    }

    // cont5
    Animate.showRight({eleArr: [$('.cont5 .hero-name-list')[0],$('.cont5 .hero-img-list')[0],[$('.cont5 .hero-text-list')[0],$('.cont5 .btn-herointroduce')[0]]] , triggerEle: '.cont5', callback: function() {
        $('.cont5 .btn-herointroduce').attr('style','');
    }});

    // cont6
    if(!isPhone) {
        Animate.showRight([$('.cont6-swiper-mask')[0]]);
    }else {
        function cont6swiper() {
            gsap.set('.cont6-swiper-mask',{alpha: 0}),
            ScrollTrigger.create({
                animation: gsap.to('.cont6-swiper-mask',{alpha: 1}),
                trigger: ".cont6-swiper-mask",
                start: "top bottom-=80",
                once: true,
            })
        }
        Animate.waitLoading(cont6swiper);
    }

    // cont7
    Animate.showRight({eleArr: $('.cont7 .guides-item'), trigger: '.cont7 .guides-box'});

    // grid-box
    function gridAni() {
        ScrollTrigger.create({
            animation: gsap.to('.cont8 .grid-box',{y: 0, alpha: 1}),
            trigger: ".cont8 .grid-box",
            start: "top bottom-=80",
            once: true,
        })
    }
    Animate.waitLoading(gridAni);
}

// 新闻页动画
function newsAni() {
    // cont1 ani
    function cont1() {
        gsap.set('.cont1-title',{y: 100, alpha: 0});
        ScrollTrigger.create({
            animation: gsap.to('.cont1-title',{y: 0, alpha: 1,duration: 0.65 }),
            trigger: ".cont1-title",
            start: "top bottom-=80",
            once: true,
        })
    }
    Animate.waitLoading(cont1);

    if(isPhone) {
        Animate.waitLoading(function() {
            gsap.set('.news-swiper',{y: 100, alpha: 0});
            ScrollTrigger.create({
                animation: gsap.to('.news-swiper',{y: 0, alpha: 1,duration: 0.65 }),
                trigger: ".news-swiper",
                start: "top bottom-=80",
                once: true,
            })
        })
    }
}

// 游戏资料页英雄动画
function gameDataHerosAni() {
    if(!isPhone) {
        // cont2
        Animate.showRight([$('.page-hero .hero-cont2 .skill-panel')[0],$('.page-hero .hero-cont2 .skill-demo')[0]]);
        // hero-contract-cont
        Animate.showRight([$('.hero-contract-cont')[0]]);
    }else {
        // cont2
        Animate.waitLoading(function() {
            gsap.set('.page-hero .hero-cont2 .skill-panel',{y: 100,alpha: 0});
            gsap.set('.page-hero .hero-cont2 .skill-demo',{y: 100,alpha: 0});
            ScrollTrigger.create({
                animation: gsap.to('.page-hero .hero-cont2 .skill-panel',{y: 0, alpha: 1,duration: 0.65, delay: 0.6 }),
                trigger: ".page-hero .hero-cont2 .skill-panel",
                start: "top bottom-=80",
                once: true,
            });
            ScrollTrigger.create({
                animation: gsap.to('.page-hero .hero-cont2 .skill-demo',{y: 0, alpha: 1,duration: 0.65, delay: 0.6 }),
                trigger: ".page-hero .hero-cont2 .skill-demo",
                start: "top bottom-=80",
                once: true,
            });
        })
        // hero-contract-cont
        Animate.showRight([$('.hero-contract-cont')[0]]);
    }
}

// 游戏资料页枪械动画
function gameDataGunsAni() {
    // kv
    Animate.showRight([$('.page-ordnance .ordnance-cont1 .firearms-swiper')[0], $('.page-ordnance .ordnance-cont1 .swiper-pagination')[0],
    $('.page-ordnance .ordnance-cont1 .firearms-img-box')[0], $('.page-ordnance .ordnance-cont1 .firearms-title')[0], $('.page-ordnance .ordnance-cont1 .firearms-attribute')[0]]);

    // cont2
    Animate.waitLoading(function() {
        gsap.set('.guns-skin-box',{alpha: 0});
        ScrollTrigger.create({
            animation: gsap.to('.ordnance-cont2-title',{y: 0, alpha: 1, duration: 0.65, onComplete: function() {
                gsap.fromTo('.guns-skin-box',{x: 100, alpha: 0}, {x: 0, alpha: 1, duration: 0.65});
            }}),
            trigger: '.ordnance-cont2-title',
            start: "top bottom",
            once: true,
        })
    })
}

// 游戏资料页地图动画
function gameDataMapsAni() {
    Animate.waitLoading(function() {
        gsap.fromTo('.page-map .map-swiper .map-desc',{x: 100, alpha: 0},{x: 0, alpha: 1, duration: 0.65});
        gsap.fromTo('.page-map .map-swiper2-box',{x: 100, alpha: 0},{x: 0, alpha: 1, duration: 0.65, delay: 0.2});
    })
}


// 通用动画方法
const Animate = {
    // 在加载完成前等待执行的方法
    waitFunc: [],
    // 是否加载完毕
    loaded: false,
    load() {
        // 加载依赖
        addScript('./js/gsap.js', () => {
            addScript('./js/scrollTrigger.js',this.init.call(this));
        })
    },
    init() {
        var waitLoad = setInterval(() => {
            if(window.ScrollTrigger) {
                console.log('加载完毕');
                this.loaded = true;
                clearInterval(waitLoad);
                gsap.registerPlugin(ScrollTrigger);
                this.titleAni();
                let waitLength = this.waitFunc.length;
                for(let i=0; i<waitLength; i++) {
                    let thisFunc = this.waitFunc.shift();
                    thisFunc.func(thisFunc.data);
                }
            }
        },100)
    },
    titleAni() {
        for(let i=0; i<$('.title.title-ani').length; i++) {
            let this_ele = $('.title.title-ani').eq(i)[0];
            ScrollTrigger.create({
                animation: gsap.to(this_ele,{y: 0, alpha: 1, duration: 0.65}),
                trigger: this_ele,
                start: "top bottom",
                // markers: true,
                once: true,
            })
        }
    },
    // 右到左展示
    showRight(eleArr) {
        if(!Animate.loaded) {
            Animate.waitFunc.push({func: Animate.showRight, data: eleArr });
            return;
        }
        if(!eleArr) {
            return;
        }
        var this_eleArr = null;
        var callback = null;
        var trigger = null;
        if(eleArr.constructor === Object) {
            trigger = eleArr.triggerEle;
            callback = eleArr.callback;
            this_eleArr = eleArr.eleArr;
        }else {
            this_eleArr = eleArr;
        }
        let thisAni = gsap.timeline();
        $.map(this_eleArr, function(ele,ind) {
            if(ele&&ele.length > 1) {
                for(let i=0; i<ele.length; i++) {
                    gsap.set(ele[i],{alpha: 0,x: 100});
                    thisAni.to(ele[i],{x: 0, alpha: 1, duration: 0.65,delay: 0.3*ind, onComplete: function() {
                        if(callback && ind == this_eleArr.length) {
                            setTimeout(function() {
                                callback();
                            },650)
                        }
                    }},0);
                }
            }else {
                gsap.set(ele,{alpha: 0,x: 100});
                thisAni.to(ele,{x: 0, alpha: 1, duration: 0.65,delay: 0.3*ind, onComplete: function() {
                    if(callback) {
                        setTimeout(function() {
                            callback();
                        },650)
                    }
                }},0);
            }
        })
        ScrollTrigger.create({
            animation: thisAni,
            trigger: trigger ? trigger : this_eleArr[0],
            start: "top bottom-=80",
            once: true,
        })
    },
    // 等待加载后调用
    waitLoading(func) {
        if(!Animate.loaded) {
            Animate.waitFunc.push({func: func, data: '' });
            return;
        }
        func();
    }
}
Animate.load();


// 根据不同页面调用不同方法
function startThisFunc() {
    // window.location.href.split('/')

    function fileExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!==404;
    }
    console.log(fileExists('js/game-data.js'));
    var this_url = window.location.href;
    if(this_url.indexOf('main.html') !== -1) {
        // 数据
        mainNews();
        mainHeros();
        mainMaps();
        mainAni();
        // 动画
        if(!/(iPhone|iPad|iPod|iOS|Android|Windows Phone|BlackBerry|SymbianOS)/i.test(navigator.userAgent)) {
        }
    }else if(this_url.indexOf('news.html') !== -1) {
        newsPage();
        newsAni();
    }else if(this_url.indexOf('newsdetails.html') !== -1) {
        newsDetails();
    }else if(this_url.indexOf('game-data.html') !== -1 || this_url.indexOf('game-data-module.html') !== -1 || this_url.indexOf('game-data-module-m.html') !== -1) {
        gameDataHeros();
        gameDataGuns();
        gameDataMaps();
        gameDataHerosAni();
        gameDataMapsAni()
    }
}
startThisFunc();
