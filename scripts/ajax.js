jQuery(document).ready(function($){
    $('#subscribe-form').submit(function(){
        console.log('subscribe form submitted');
        var user_email = $(this).find('#subscriber-id').val();


        if(validateEmail(user_email)){
            $.ajax({
                type : "post",
                dataType : "json",
                url : the_ajax_script.ajaxurl,
                data : 'action=bbc_process_subscriber&amp;email='+user_email+'&amp;security='+the_ajax_script.ajax_nonce,
                success: function(response) {
                    // You can put any code here to run if the response is successful.

                    // This will allow you to see the response
                    console.log(response);
                }
            });
        }



        return false;
    });
});

function validateEmail(elementValue){
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}