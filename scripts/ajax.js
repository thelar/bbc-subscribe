jQuery(document).ready(function($){
    $('#subscribe-form').submit(function(){
        console.log('subscribe form submitted');
        var user_email = $(this).find('#subscriber-id').val();


        if(validateEmail(user_email)){
            //Form is valid so now register
            var data = {
                action: 'bbc_process_subscriber',
                email: user_email,
                security: the_ajax_script.ajax_nonce
            };
            $.post(the_ajax_script.ajaxurl, data, function(response){
                console.log(response);
            });
        }
        return false;
    });
});

function validateEmail(elementValue){
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}