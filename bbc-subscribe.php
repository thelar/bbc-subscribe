<?php
/*
Plugin Name: BBC Subscribe
Description: Custom plugin to allow subscriptions on BBC site
Author: Kevin Price-Ward
Version: 1.0
*/
register_activation_hook( __FILE__, 'my_plugin_create_db' );

function my_plugin_create_db() {

    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    $table_name = $wpdb->prefix . 'subscribers';

    $sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		email varchar(200) NOT NULL,
		UNIQUE KEY id (id)
	) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}

function bbc_subscribe_script()
{
    wp_enqueue_script( 'bbc_subscribe_script', plugin_dir_url( __FILE__ ) . 'scripts/ajax.js', ['jquery'], null, true );
    wp_localize_script( 'bbc_subscribe_script', 'the_ajax_script', array(
        'ajaxurl' => admin_url( 'admin-ajax.php' ),
        'ajax_nonce' =>  wp_create_nonce('my_nonce')
    ) );
}
add_action('wp_enqueue_scripts', 'bbc_subscribe_script');

function bbc_process_subscriber(){
    global $wpdb;

    $check = check_ajax_referer( 'my_nonce', 'security', false );

    if($check){
        $email = urldecode(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
        $agree = filter_var($_POST['check'], FILTER_SANITIZE_STRING);
        if($agree==='yes'){
            //Add subscriber to database here
            $insert = $wpdb->insert(
                $wpdb->prefix . 'subscribers',
                array(
                    'time' => current_time('mysql', 1),
                    'email' => $email
                )
            );

            if($insert!==false){
                $response_a = [
                    'insert' => $insert,
                    'email' => $email,
                    'status' => 'OK'
                ];
            }else{
                $response_a = [
                    'status' => 'fail',
                    'error' => 'Subscriber could not added to database'
                ];
            }


        }else{
            $response_a = [
                'status' => 'fail',
                'error' => 'You must agree to the Terms and Privacy'
            ];
        }

    }else{
        $response_a = [
            'status' => 'fail',
            'error' => 'Security error'
        ];
    }

    $response = json_encode($response_a);
    echo $response;
    die();
}
add_action('wp_ajax_bbc_process_subscriber', 'bbc_process_subscriber');
add_action('wp_ajax_nopriv_bbc_process_subscriber', 'bbc_process_subscriber');