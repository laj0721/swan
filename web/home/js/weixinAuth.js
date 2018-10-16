var ua = window.navigator.userAgent.toLowerCase();
// if (ua.match(/MicroMessenger/i) !== 'micromessenger' && ua.match(/_SQ_/i) !== '_sq_'){ // 判断是否微信页面
//   alert('请使用微信浏览器打开');
//   return;
// }

search = parse();

// if (search && !search.code) { // 点击分享链接进来需要微信授权登陆
//   location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2d0b305de29738e7&redirect_uri=' + encodeURI(location.href) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect' // 调起微信授权登陆接口
// }

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