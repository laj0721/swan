$(function() {
  "use strict";

  var ua = window.navigator.userAgent.toLowerCase();
  // if (ua.match(/MicroMessenger/i) !== 'micromessenger' && ua.match(/_SQ_/i) !== '_sq_'){ // 判断是否微信页面
  //   alert('请使用微信浏览器打开');
  //   return;
  // }

  FastClick.attach(document.body);

  var $chooseDialog = $('.choose-dialog'),
    $chooseDigContent = $chooseDialog.find('.content'),
    search = parse();

  getGoodsById();
  if (search) {
    if (search.code) { // 登陆授权进来，直接加载数据
      if (search.type === 'share') {
        $('.dian-zan,.dianzan').remove();
      }
       
      if (search.id) {
        getGoodsById();
        getThirdPartAuth();
        bindWeixinShare();
      }
    } else { // 点击分享链接进来需要微信授权登陆
      //getWeixinAuthLogin(); // 调起微信授权登陆接口
    }
  }
  
  // 微信授权登陆
  function getWeixinAuthLogin() {
    var param = {
      appid: 'wx2d0b305de29738e7',
      redirect_uri: URLEncoder.encode(location.href,"UTF-8"),
      response_type: 'code',
      scope: 'snsapi_userinfo',
      state: 'STATE#wechat_redirect'
    };

    $.ajax({
      type: 'GET',
      url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
      data: param,
      dataType: 'json',
      timeout: 3000,
      success: function(data){
        console.log(data); 
      },
      complete: function(){}
    });
  }

  function getThirdPartAuth(code) {
    $.ajax({
      type: 'GET',
      url: '/api/socials/weixin/authorizations',
      data: {code: code},
      headers: {Accept: 'application/prs.shop.v1+json'},
      dataType: 'json',
      timeout: 3000,
      success: function(data){
        console.log(data); 
      },
      complete: function(){}
    });
  }

  function bindWeixinShare() {
    // 调用后端接口，获取【appId，timestamp，nonceStr，signature】
  
    // 微信分享
    $('.goods-detail .share').on('click', function() {
      // 分享给朋友
      wx.updateAppMessageShareData({ 
        title: '', // 分享标题
        desc: '', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: '', // 分享图标
      }, function(res) { 
        // 这里是回调函数 
      }); 

      // 分享到朋友圈
      wx.updateTimelineShareData({ 
        title: '', // 分享标题
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: '', // 分享图标
      }, function(res) { 
        // 这里是回调函数 
      }); 
    });
  }
  
  // 获取商品详情
  function getGoodsById() {
    var param = {
      include: 'skus,properties'
    };

    $.ajax({
      type: 'GET',
      url: '/api/products/' + search.id || 0,
      data: param,
      dataType: 'json',
      timeout: 3000,
      success: function(data){
        handleData(data);
      },
      complete: function(){
        //event();
      }
    });
  }

  function handleData(result) {
    console.log(result);
    // if (result && $.isArray(result.data) && result.data.length > 0) {
    //   var html = [],
    //     data = result.data,
    //     len = data.length;

    //   for(var i = 0; i < len; i++) {
    //     var item = data[i];
    //     var li = ['<li data-id="' + item.id + '">',
    //       '<img src=' + item.image_url + ' />',
    //       '<div class="content">',
    //         '<h4>' + item.long_title + '</h4>',
    //         '<p>淘宝价 <span>￥2399.00</span></p>',
    //         '<p>会员价 <span>￥2399.00</span></p>',
    //         '<div class="clear">',
    //           '<em class="float-l">' + item.price + '</em>',
    //           '<span class="float-r">销量' + item.sold_count + '</span>',
    //         '</div>',
    //       '</div>',
    //     '</li>'];
    //     html.push(li.join(''));
    //   }

    //   $ul.append(html.join(''));
    // }

    // if (result && $.isPlainObject(result.meta) && $.isPlainObject(result.meta.pagination)) {
    //   total = result.meta.pagination.total;
    // }

    // isloading = false;
  }

  // banner轮播图
  var mySwiper = new Swiper ('.swiper-container', {
    autoplay: true,
    pagination: { //分页器
      el: '.swiper-pagination',
      type: 'fraction'
    }
  });

  // 查看商品参数/选择尺寸，颜色分类
  $('.goods-param,.choose-sizes').on('click', function() {
    $chooseDialog.removeClass('none goodsParam chooseSizes');
    $(this).hasClass('goods-param') ? $chooseDialog.addClass('goodsParam') : $chooseDialog.addClass('chooseSizes');
  });

  $chooseDialog.find('button,.close').on('click', function() {
    $chooseDigContent.addClass('fadeout');
    setTimeout(function() {
      $chooseDigContent.removeClass('fadeout');
      $chooseDialog.addClass('none');
    }, 250);
  });

  // 查看全部评论
  $('.more-btn button,.user-evaluate li').on('click', function() {
    location.href = "../evaluate/index.html?id=" + search.id;
  });

  // 购买
  $('footer button').on('click', function() {
    location.href = "../submitOrder/index.html";
  });

  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
});