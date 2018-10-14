$(function() {
  FastClick.attach(document.body);
   
  var $selectDiv = $('.selectDiv');

  $('.selectVal,.right').on('click', function(e) {
    e.stopPropagation();
    var $selectDiv = $(this).siblings('.selectDiv'),
      $outlineBorder = $(this).parent('.outlineBorder');

    $selectDiv.toggleClass('none');
    if (!$selectDiv.hasClass('none')) {
      $outlineBorder.addClass('open');
    } else {
      $outlineBorder.removeClass('open');
    }
  });

  $selectDiv.find('li').on('click', function(e) {
    var val = $(this).text();
    $selectDiv.addClass('none');
    $(this).parent().siblings('.selectVal').text(val);
  });

  $(document).on('click', function() {
    $selectDiv.each(function(){
      if (!$(this).hasClass('none')) {
        $(this).addClass('none');
      }
    });
  });

  // 推荐人
  $('.referrer input').on('change', function() {
    var selVal = $(this).val(),
      $referInfo = $('.referInfo');
    
    selVal === 'yes'? $referInfo.show() : $referInfo.hide();
  });

  //返回
  $('header i').on('click', function() {
    history.go(-1);
  });
});