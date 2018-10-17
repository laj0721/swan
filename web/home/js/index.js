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
    $chooseDigInfo = $chooseDigContent.find('.goods-info'),
    search = parse(),
    goodsSkus = [],
    selectedGoods = {};

  if (search) {
    // if (search.code) { // 登陆授权进来，直接加载数据
      if (search.type === 'share') {
        $('.dian-zan,.dianzan').remove();
      }
       
      if (search.id) {
        getGoodsById(); // 获取商品详情信息
        getGoodsComments(search.id); // 获取商品评论
        //getThirdPartAuth();
        //bindWeixinShare(); //绑定微信分享
      }
    // } else { // 点击分享链接进来需要微信授权登陆
      //getWeixinAuthLogin(); // 调起微信授权登陆接口
    // }
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
      include: 'skus,properties,shop'
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
      complete: function(){}
    });
  }

  function getGoodsComments(id) {
    var param = {
      page: 1,
      per_page: 2
    };

    $.ajax({
      type: 'GET',
      url: '/api/products/' + id + '/reviews',
      data: param,
      dataType: 'json',
      timeout: 3000,
      success: function(res){
        var $userEvaluate = $('.user-evaluate');

        if (res && res.data && res.data.length) {
          var lis = [];
          for (var i = 0,len = res.data.length; i < len; i++) {
            var item = res.data[i],
              html = ['<li>',
                '<div class="head">',
                  '<img src=' + (item.product_sku ? item.product_sku.image_url: null) + ' />',
                  '<span>' + (item.username ?  item.username : "匿名评价") + '</span>',
                '</div>',
                '<div class="evaluate">' + item.review + '</div>',
                '<p class="detail">',
                  '<span>' + item.reviewed_at + '</span>',
                  '<span> ' + item.product_sku? item.product_sku.title : '' + '</span>',
                '</p>',
              '</li>'];
            lis.push(html.join(''));
          }
          $userEvaluate.find('ul').html(lis.join(''));
          $userEvaluate.find('.no-data').hide();
          $userEvaluate.find('.more-btn').show();
        } else {
          $userEvaluate.find('.no-data').show();
          $userEvaluate.find('.more-btn').hide();
        }
      }
    });
  }

  function handleData(result) {
    if (result && $.isPlainObject(result.data)) {
      var data = result.data;
      // banner轮播图/选择尺寸、颜色
      if (data.skus && data.skus.data && data.skus.data.length) {
        var bannerHtml = [],
          classify = [],
          skusData = data.skus.data;
        for (var i = 0,len = skusData.length; i < len; i++) {
          var item = skusData[i];
          bannerHtml.push('<div class="swiper-slide"><img src='+ item.image_url +'></div>');
          classify.push('<li>' + item.title + '</li>');
        }
        // banner轮播图
        $('.swiper-wrapper').html(bannerHtml.join(''));
        $chooseDialog.find('.property .classify').html(classify.join(''));
        goodsSkus = skusData;
        chooseClassify(0);
        bindClassifyEvent();
        new Swiper ('.swiper-container', {
          autoplay: true,
          pagination: { //分页器
            el: '.swiper-pagination',
            type: 'fraction'
          }
        });
      }
      // 商品属性
      if (data.properties && $.isPlainObject(data.properties) && data.properties.data) {
        var dds = ['<dt>产品参数</dt>'];
        for (var i = 0,len = data.properties.data.length; i < len; i++) {
          var item = data.properties.data[i];
          dds.push('<dd><label>' + item.name + '</label><span>' + item.value + '</span></dd>');
        }
        $('.choose-dialog dl').html(dds.join(''));
      }
      // 商品详情
      $('.goods-detail .title').text(data.long_title);
      $('.goods-detail .vip-price span').text('¥' + data.discount_price);
      $('.goods-detail .original-price span,.goods-detail .price-bar').text('¥' + data.price);
      // 商品介绍
      $('.goods-infor .des').html(data.description);
      // 按钮原价、会员价
      $('footer .origi-btn span').text('¥' + data.price);
      $('footer .vip-btn span').text('¥' + data.discount_price);
    }
  }

  function chooseClassify(i) {
    var $lis = $chooseDigInfo.find('.classify li');
    selectedGoods = goodsSkus[i];
    $lis.removeClass('selected');
    $lis.eq(i).addClass('selected');
    $chooseDigInfo.find('img').attr('src', selectedGoods.image_url);
    $chooseDigInfo.find('.stock span').text(selectedGoods.stock);
    $chooseDigInfo.find('.order-infor h4').html('¥' + selectedGoods.price);
  }

  function bindClassifyEvent() {
    $chooseDigInfo.find('.classify li').on('click', function() {
      var ind = $(this).index();
      chooseClassify(ind);
    });
  }

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

  $chooseDialog.find('.group-btn input[type="button"]').on('click', function() {
    var $goodsNum = $('.goodsNum'),
      val = parseInt($goodsNum.val()),
      num = val + 1;
    if ($(this).hasClass('minus')) { // 减
      val > 1? num = val - 1: num = val;
    } 

    $goodsNum.val(num);
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