$(function() {
  FastClick.attach(document.body);

  // 返回
  $('header i').on('click', function() {
    $('body').removeClass();
    $('header span').html('合伙人区域：<em>广东省</em>');
  });
});