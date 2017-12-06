$(function () {
    var worknum=$('#WorkNum');
    var password=$('#password');
    $(worknum)[0].focus();
    $(worknum).blur(function () {
        if($(this).val()==''){
            $(this).addClass('input-error');
        }
        else{
            $(this).removeClass('input-error');
        }
    });
    $(password).blur(function () {
        if($(this).val()==''){
            $(this).addClass('input-error');
        }
        else{
            $(this).removeClass('input-error');
        }
    });
})