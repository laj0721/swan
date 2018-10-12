$(function() {
  FastClick.attach(document.body);
  
  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
});