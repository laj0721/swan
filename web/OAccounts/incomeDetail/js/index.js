$(function() {
  FastClick.attach(document.body);

  var $main = $('main'),
    $backTop = $('.backTop'),
    $tbody = $('table tbody'),
    docHeight = $(document).height(),
    isloading = false,
    OFFSET = 50;
  
  //加载列表
  function loadData() {
    var html = [];
    for(var i = 0; i < 5; i++) {
      var li = ['<tr>',
        '<td>李峰用户注册成为会员</td>',
        '<td>2018.04.26</td>',
        '<td>+30.00</td>',
      '</tr>'];
      html.push(li.join(''));
    }

    $tbody.append(html.join(''));
    isloading = false;
  }

  //滚动加载 
  $main.off('scroll').on('scroll', function(e) {
    if(isloading) {
      return;
    }

    var ulOffset = $tbody.offset(),
      ulHeight = ulOffset.height,
      ulTop = -ulOffset.top,
      sHeight = $main.scrollTop();

    if (sHeight >= OFFSET) {
      $backTop.addClass('faseIn');
    } else {
      $backTop.removeClass('faseIn');
    }

    if (ulHeight - OFFSET <= ulTop + docHeight) {
      isloading = true;
      console.log('滑到最底部了');
      setTimeout(function() {
        loadData();
      }, 500);
    }
  });
  
  $(document).on('unload', function() {
    $main.off('scroll');
  });

  // 回到顶部
  $backTop.on('click', function() {
    var timer = setInterval(function(){
      //获取滚动条距离顶部的高度
      var sHeight = $main.scrollTop();
      var ispeed = Math.floor(-sHeight / 5);
      isTop = true;
      $main.scrollTop(sHeight+ispeed);

      if(sHeight === 0){
        clearInterval(timer);
      }
  },30);
  });

  // 返回
  $('header i').on('click', function() {
    history.go(-1);
  });
});