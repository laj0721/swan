$(function() {
  FastClick.attach(document.body);
  var $document = $(document),
    $main = $('main'),
    $loading = $('.loading'),
    $ul = $main.find('ul'),
    OFFSET = 50,
    docHeight = $document.height(),
    headerH = $('header').height();

  //加载列表
  function loadData() {
    var html = [];
    for(var i = 0; i < 3; i++) {
      var li = ['<li>',
        '<div class="head">',
          '<img src="./images/head-portrait.jpg" />',
          '<span>危言危行13***8</span>',
        '</div>',
        '<div class="evaluate">裤子穿着挺舒服的，喜欢这种收腰设计的背带裤，就是个人觉得颜色有点太浅，要是稍微深点更完美！</div>',
        '<dl>',
          '<dd><img src="./images/pic.jpg"></dd>',
          '<dd><img src="./images/pic.jpg"></dd>',
          '<dd><img src="./images/pic.jpg"></dd>',
        '</dl>',
        '<p class="detail">',
          '<span>2018-10-02</span>',
          '<span>颜色分类 : <em>蓝色</em></span>',
          '<span>尺寸 : <em>L</em></span>',
        '</p>',
      '</li>'];
      html.push(li.join(''));
    }

    $ul.append(html.join(''));
    $loading.addClass('none');
  }

  //滚动加载 
  $main.off('scroll').on('scroll', function(e) {
    if(!$loading.hasClass('none')) {
      return;
    }

    var ulOffset = $ul.offset(),
      ulHeight = ulOffset.height,
      ulTop = -ulOffset.top;

    if (ulHeight - OFFSET <= ulTop + docHeight) {
      $loading.removeClass('none');
      console.log('滑到最底部了');
      setTimeout(function() {
        loadData();
      }, 500);
    }
  });
  
  $document.on('unload', function() {
    $main.off('scroll');
  });

  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
});