jQuery(document).ready(function($){
    $('#subscribe-form').submit(function(){
        console.log('subscribe form submitted');
        var user_email = $(this).find('#subscriber-id').val();
        var $info = $(this).find('.subscribe-msg');
        $info.removeClass('alert-success alert-danger');
        $info.hide();

        if(validateEmail(user_email)){
            //Form is valid so now register
            var data = {
                action: 'bbc_process_subscriber',
                email: user_email,
                security: the_ajax_script.ajax_nonce,
                check: $('#subscribe-check').val()
            };
            $.post(the_ajax_script.ajaxurl, data, function(response){
                response_a = JSON.parse(response);
                if(response_a.status==='OK'){
                    $info.addClass('alert-success');
                    $info.text('Email subscribed').show();
                }else{
                    $info.addClass('alert-danger');
                    $info.text(response_a.error).show();
                }
            });
        }else{
            $info.addClass('alert-danger');
            $info.text('Invalid email').show();
        }
        return false;
    });
});

function validateEmail(elementValue){
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}