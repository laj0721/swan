$(function() {
  FastClick.attach(document.body);
  var $document = $(document),
    $main = $('main'),
    $ul = $main.find('ul'),
    docHeight = $document.height(),
    headerH = $('header').height(),
    id = parse().id;
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
          var li = ['<li>',
            '<div class="head">',
              '<img src="./images/head-portrait.jpg" />',
              '<span>危言危行13***8</span>',
            '</div>',
            '<div class="evaluate">裤子穿着挺舒服的，喜欢这种收腰设计的背带裤，就是个人觉得颜色有点太浅，要是稍微深点更完美！</div>',
            '<p class="detail">',
              '<span>2018-10-02</span>',
              '<span>颜色分类 : <em>蓝色</em></span>',
              '<span>尺寸 : <em>L</em></span>',
            '</p>',
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
    if (!(id && $.isNumeric(id))) {
      return;
    }

    var param = {
      page: pageNum || 1,
      per_page: 6
    };

    $.ajax({
      type: 'GET',
      url: '/api/products/' + id + '/reviews',
      data: param,
      dataType: 'json',
      timeout: 3000,
      success: function(data){
        console.log(data);
        handleData(data);
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

  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
});