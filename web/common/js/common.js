"use strict";

function parse (str) {
  var paramStr = '';

  if(typeof str === 'string'){
    paramStr = str;
  }else{
    paramStr = document.location.search;
    if(paramStr.indexOf('?') == -1){
      return '';
    }
  }

  if(paramStr.trim() <= 0){
    return '';
  }

  return paramStr.replace(/[^\?]*\?/, '').split("&").map(function (n) {
    return n = n.split("="), this[n[0]] = n[1], this;
  }.bind({}))[0];
};

function stringify (data, o) {
  if (typeof data === 'string') { return data; }

  o = $.extend({
    encode: encodeURIComponent
  }, o);

  var result = [ ];
  if ( $.isArray(data) ) {
    data.forEach(function(d) {
      result.push( encode(d.name, d.value, o.encode) );
    });
  } else {
    for (var name in data) {
      if (Object.prototype.hasOwnProperty.call(data, name)) {
        result.push( encode(name, data[name], o.encode) );
      }
    }
  }

  return result.join('&');
};

var ua = window.navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ_/i) == '_sq_'){ // 判断是否微信页面
  // 调用后端接口，获取【appId，timestamp，nonceStr，signature】

  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp:'', // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名
    jsApiList: [
      onMenuShareTimeline,
      onMenuShareAppMessage,
      showMenuItems,
      showOptionMenu,
      chooseImage,
      previewImage,
      uploadImage,
      downloadImage,
      updateAppMessageShareData,
      updateTimelineShareData
    ] // 必填，需要使用的JS接口列表
  });

  wx.ready(function(){
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    wx.updateAppMessageShareData({ 
      title: '', // 分享标题
      desc: '', // 分享描述
      link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: '', // 分享图标
    }, function(res) { 
    //这里是回调函数 
    });
  });
}