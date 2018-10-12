$(function() {
  FastClick.attach(document.body);
  
  // 点击近一个月统计
  $('.month-stas').on('click', function() {
    $('body').removeClass().addClass('month');
    $('header span').html('近一个月统计');
  });

  // 点击城市统计
  $('.city-stas').on('click', function() {
    $('body').removeClass().addClass('city');
    $('header span').html('城市统计');
  });

  // 返回
  $('header i').on('click', function() {
    $('body').removeClass();
    $('header span').html('合伙人区域：<em>广东省</em>');
  });
});