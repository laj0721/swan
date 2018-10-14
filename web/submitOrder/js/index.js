$(function() {
  FastClick.attach(document.body);

  var $sendBtn = $('.code-btn'),
    $province = $('.province'),
    $city = $('.city'),
    $region = $('.region'),
    datas = [];

  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
  
  // 发送验证码倒计时
  function getCountDown(timer) {
    $sendBtn.text(timer + 's后重试').addClass('disabled');
    var setTime = setTimeout(function() {
      if (timer === 1) {
        $sendBtn.text('发送验证码').removeClass('disabled');
        return;
      }
      timer--;
      clearTimeout(setTime);
      getCountDown(timer);
    }, 1000);
  }
  
  // 获取验证码
  $sendBtn.on('click', function() {
    if ($(this).hasClass('disabled')) {
      return;
    }

    var phone = $('#phone').val();
    
    if (!phone.trim()) {
      alert("请输入手机号码！"); 
      return false; 
    } else if(!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(phone))){ 
      alert("手机号码不对！"); 
      return false; 
    }
   
    $.ajax({
      type: 'POST',
      url: '/api/verification-codes',
      data: { phone : phone },
      dataType: 'json',
      timeout: 3000,
      success: function(data){
        // 按钮倒计时
        getCountDown(60);
      },
      error: function(data){
        console.log(data);
      }
    });
  });

  // 收获地址
  var $selectDiv = $('.selectDiv');

  $('.selectVal').on('click', function(e) {
    e.stopPropagation();
    var $selDiv = $(this).siblings('.selectDiv'),
      $outlineBorder = $(this).parent('.outlineBorder');
    
    $selectDiv.addClass('none');
    $selDiv.toggleClass('none');
    if (!$selDiv.hasClass('none')) {
      $outlineBorder.addClass('open');
    } else {
      $outlineBorder.removeClass('open');
    }
  });

  $(document).on('click', function() {
    $selectDiv.each(function(){
      if (!$(this).hasClass('none')) {
        $(this).addClass('none');
      }
    });
  });

  $.getJSON('../common/json/areaData.json', function(data){
    datas = data;
    getDatasById($province, '86');
  });

  function event() {
    $('.goods-address ul li').on('click', function() {
      var $ele = $(this),
        $ul = $(this).parent(),
        text = $ele.text(),
        val = $ele.attr('value');

      $selectDiv.addClass('none');
      $ul.siblings('.selectVal').text(text).attr('data-id', val);

      if ($ul.hasClass('province')) {
        getDatasById($city, val);
      } else if ($ul.hasClass('city')) {
        getDatasById($region, val);
      }
    });
  }

  function getDatasById($ele, id) {
    var address = datas[id],
      options = [];

    for (var key in address) {
      options.push('<li value=' + key + '>' + address[key] + '</li>');
    }

    $ele.html(options.join(''));
    event();
  }

  // 微信支付
  $('.pay-btn').on('click', function() {
     // 调用后端接口，获取【appId，timestamp，nonceStr，signature】

    function onBridgeReady(){
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
          "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
          "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
          "package":"prepay_id=u802345jgfjsdfgsdg888",     
          "signType":"MD5",         //微信签名方式：     
          "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
        },
        function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok" ){
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            location.href = '../paySuccess/index.html';
          } 
        }
      ); 
    }
    if (typeof WeixinJSBridge == "undefined"){
      if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    }else{
      onBridgeReady();
    }
  });
});