$(function() {
  FastClick.attach(document.body);

  var $main = $('main'),
    $backTop = $('.backTop'),
    $ul = $('ul'),
    docHeight = $(document).height(),
    isloading = false,
    OFFSET = 50,
    page = 1,
    total = 0;

  loadData(page);

  function handleData(result) {
    if (result && $.isArray(result.data) && result.data.length > 0) {
      var html = [],
        data = result.data,
        len = data.length;

      for(var i = 0; i < len; i++) {
        var item = data[i];
        var li = ['<li data-id="' + item.id + '">',
          '<img src=' + item.image_url + ' />',
          '<div class="content">',
            '<h4>' + item.long_title + '</h4>',
            '<p>淘宝价 <span>￥2399.00</span></p>',
            '<p>会员价 <span>￥2399.00</span></p>',
            '<div class="clear">',
              '<em class="float-l">' + item.price + '</em>',
              '<span class="float-r">销量' + item.sold_count + '</span>',
            '</div>',
          '</div>',
        '</li>'];
        html.push(li.join(''));
      }

      $ul.append(html.join(''));
    }

    if (result && $.isPlainObject(result.meta) && $.isPlainObject(result.meta.pagination)) {
      total = result.meta.pagination.total;
    }

    isloading = false;
  }
  
  // 加载列表
  function loadData(pageNum) {
    var param = {
      page: pageNum || 1,
      per_page: 6
    };

    $.ajax({
      type: 'GET',
      url: '/api/products',
      data: param,
      dataType: 'json',
      timeout: 3000,
      success: function(data){
        handleData(data);
      },
      complete: function(){
        event();
      }
    });
  }

  // 滚动加载 
  $main.off('scroll').on('scroll', function(e) {
    if(isloading || total <= $ul.find('li').length) {
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
      loadData(++page);
    }
  });
  
  $(document).on('unload', function() {
    $main.off('scroll');
  });

  // 回到顶部
  $backTop.on('click', function() {
    var timer = setInterval(function(){
      // 获取滚动条距离顶部的高度
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

  function event() {
    // 点击“加入鸿链”按钮/商品列表
    $('button, ul li').on('click', function() {
      // 先用户授权，授权成功后跳转到注册页面（未注册的用户）
      // 授权操作

      var id = $(this).attr('data-id'),
        isBtn = $(this).hasClass('btn');

      if (true) { // 跳转到注册页面(未注册)
        location.href = '../signUp/index.html?id=' + id + '&isBtn=' + isBtn;
      } else if (isBtn) { // 点击“加入鸿链”按钮，跳转到下载APP页
        location.href = '../signUpSucc/index.html';
      } else { // 点击商品列表，跳转到商品详情页
        location.href = '../../home/index.html?type=share&id=' + id;
      }
    });
  }
});