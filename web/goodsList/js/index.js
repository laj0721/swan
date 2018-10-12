$(function() {
  FastClick.attach(document.body);

  var $main = $('main'),
    $backTop = $('.backTop'),
    $ul = $('ul'),
    docHeight = $(document).height(),
    isloading = false,
    OFFSET = 50;
  
  //加载列表
  function loadData() {
    var html = [];
    for(var i = 0; i < 4; i++) {
      var li = ['<li>',
        '<img src="./images/pic.jpg" />',
        '<div class="content">',
          '<h4>裤子穿着挺舒服的，喜欢这种收腰设计的背带裤，就是个人觉得颜色有点太浅，要是稍微深点更完美！</h4>',
          '<p>淘宝价 <span>￥2399.00</span></p>',
          '<p>会员价 <span>￥2399.00</span></p>',
          '<div class="clear">',
            '<em class="float-l">￥1299.00</em>',
            '<span class="float-r">销量5w+</span>',
          '</div>',
        '</div>',
      '</li>'];
      html.push(li.join(''));
    }

    $ul.append(html.join(''));
    isloading = false;
  }

  //滚动加载 
  $main.off('scroll').on('scroll', function(e) {
    if(isloading) {
      return;
    }

    var ulOffset = $ul.offset(),
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

  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
});