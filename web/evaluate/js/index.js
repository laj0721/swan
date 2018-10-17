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
      var lis = [],
        data = result.data;

        for (var i = 0,len = data.length; i < len; i++) {
          var item = data[i],
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
    
        $ul.append(lis.join(''));
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