<?php

/**
 * Plugin Name: Develop Guten Blocks
 * Plugin URI: https://sudheer.io
 * Description: Custom block plugin starter
 * Version: 1.0.0
 * Author: Sudheer Ranga
 *
 * @package dgb
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load translations (if any) for the plugin from the /languages/ folder.
 * 
 * @link https://developer.wordpress.org/reference/functions/load_plugin_textdomain/
 */
add_action( 'init', 'dgb_load_textdomain' );

function dgb_load_textdomain() {
	load_plugin_textdomain( 'dgb', false, basename( __DIR__ ) . '/languages' );
}

/** 
 * Add custom "dgb" block category
 * 
 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/filters/block-filters/#managing-block-categories
 */
add_filter( 'block_categories', 'dgb_block_categories', 10, 2 );

function dgb_block_categories( $categories, $post ) {
	if ( $post->post_type !== 'post' ) {
		return $categories;
	}
	return array_merge(
		$categories,
		array(
			array(
				'slug' => 'dgb',
				'title' => __( 'DGB', 'dgb' ),
				'icon'  => 'microphone',
			),
		)
	);
}

/**
 * Registers all block assets so that they can be enqueued through the Block Editor in
 * the corresponding context.
 *
 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-registration/
 */
add_action( 'init', 'dgb_register_blocks' );

function dgb_register_blocks() {

	// If Block Editor is not active, bail.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Retister the block editor script.
	wp_register_script(
		'dgb-editor-script',											// label
		// plugins_url( 'build/index.js', __FILE__ ),						// script file
		'http://localhost:8000/index.js',
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),		// dependencies
		null
		// filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )		// set version as file last modified time
	);

	// Register the block editor stylesheet.
	wp_register_style(
		'dgb-editor-styles',											// label
		// plugins_url( 'build/1.css', __FILE__ ),					// CSS file
		'http://localhost:8000/edit.css',
		array( 'wp-edit-blocks' ),										// dependencies
		null
		// filemtime( plugin_dir_path( __FILE__ ) . 'build/edit.css' )	// set version as file last modified time
	);

	// Register the front-end stylesheet.
	wp_register_style(
		'dgb-front-end-styles',										// label
		// plugins_url( 'build/2.css', __FILE__ ),						// CSS file
		'http://localhost:8000/save.css',
		array( ),														// dependencies
		null
		// filemtime( plugin_dir_path( __FILE__ ) . 'build/save.css' )	// set version as file last modified time
	);

	// Array of block created in this plugin.
	$blocks = [
		'dgb/static'
	];
	
	// Loop through $blocks and register each block with the same script and styles.
	foreach( $blocks as $block ) {
		register_block_type( $block, array(
			'editor_script' => 'dgb-editor-script',					// Calls registered script above
			'editor_style' => 'dgb-editor-styles',					// Calls registered stylesheet above
			'style' => 'dgb-front-end-styles',						// Calls registered stylesheet above
		) );	  
	}

	if ( function_exists( 'wp_set_script_translations' ) ) {
	/**
	 * Adds internationalization support. 
	 * 
	 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/internationalization/
	 * @link https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
	 */
	wp_set_script_translations( 'dgb-editor-script', 'dgb', plugin_dir_path( __FILE__ ) . '/languages' );
	}

}
