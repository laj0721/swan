$(function() {
  FastClick.attach(document.body);

  var search = parse(),
    $sendBtn = $('.send-btn');

  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
  
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

  // 注册
  $('button').on('click', function(e) {
    e.preventDefault();
    var phone = $('#phone').val(),
      verCode = $('#verification_code').val();
    
    if (!phone.trim()) {
      alert("请输入手机号码！"); 
      return false; 
    } else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone))) { 
      alert("手机号码不对！"); 
      return false; 
    } else if (!verCode.trim()) { 
      alert("请输入验证码！"); 
      return false; 
    }

    var param = {
      name: phone,
      password: phone,
      phone: phone,
      verification_code: verCode
    };

    $.ajax({
      type: 'POST',
      url: '/api/users',
      data: param,
      dataType: 'json',
      timeout: 3000,
      success: function(data){
        if (search.isBtn === 'true') { // 点击“加入鸿链”按钮，跳转到下载APP页
          location.href = '../signUpSucc/index.html';
        } else { // 点击商品列表，跳转到商品详情页
          location.href = '../../home/index.html?type=share&id=' + search.id;
        }
      },
      error: function(e) {
        console.log(e);
        throw new Error(e);
      }
    });
  });
});