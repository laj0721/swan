$(function() {
  FastClick.attach(document.body);

  var $chooseDialog = $('.choose-dialog'),
    $chooseDigContent = $chooseDialog.find('.content');

  // banner轮播图
  var mySwiper = new Swiper ('.swiper-container', {
    autoplay: true,
    pagination: { //分页器
      el: '.swiper-pagination',
      type: 'fraction'
    }
  }); 

  // 查看商品参数
  $('.goods-param,.choose-sizes').on('click', function() {
    $chooseDialog.removeClass('none');
  });
  $chooseDialog.find('button,.close').on('click', function() {
    $chooseDigContent.addClass('fadeout');
    setTimeout(function() {
      $chooseDigContent.removeClass('fadeout');
      $chooseDialog.addClass('none');
    }, 250);
  });
  
  // 查看全部评论
  $('.more-btn button').on('click', function() {
    location.href = "../evaluate/index.html";
  });

  // 购买
  $('footer button').on('click', function() {
    location.href = "../submitOrder/index.html";
  });
});