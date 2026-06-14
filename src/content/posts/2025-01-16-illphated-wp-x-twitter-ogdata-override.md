---
layout: "post"
title: "ILLPHATED WP X-TWITTER OGDATA OVERRIDE"
date: "2025-01-16 15:18:55"
modified: "2025-01-16 15:19:12"
slug: "illphated-wp-x-twitter-ogdata-override"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "../media/2025/01/Screenshot-2025-01-16-at-9.18.45\u202fAM.jpg"
featured_image_relative: "2025/01/Screenshot-2025-01-16-at-9.18.45\u202fAM.jpg"
---

<?php
/**
* Plugin Name: Custom OG Override
* Plugin URI: https://example.com
* Description: Allows manual adjustment of Open Graph titles and descriptions via the WordPress post editor.
* Version: 1.0
* Author: Your Name
* Author URI: https://example.com
* License: GPL2
*/

// Add custom meta boxes to the post editor
function custom_og_override_meta_box() {
add_meta_box(
'custom_og_override',
'Custom OG Settings',
'custom_og_override_meta_box_callback',
['post', 'page'], // Enable for posts and pages
'normal',
'high'
);
}
add_action('add_meta_boxes', 'custom_og_override_meta_box');

// Render the meta box
function custom_og_override_meta_box_callback($post) {
// Retrieve current values
$custom_og_title = get_post_meta($post->ID, '_custom_og_title', true);
$custom_og_description = get_post_meta($post->ID, '_custom_og_description', true);
?>
<p>
<label for="custom_og_title">Custom OG Title</label>
<input type="text" id="custom_og_title" name="custom_og_title" value="<?php echo esc_attr($custom_og_title); ?>" style="width:100%;" />
</p>
<p>
<label for="custom_og_description">Custom OG Description</label>
<textarea id="custom_og_description" name="custom_og_description" rows="3" style="width:100%;"><?php echo esc_textarea($custom_og_description); ?></textarea>
</p>
<?php
wp_nonce_field('custom_og_override_save', 'custom_og_override_nonce');
}

// Save custom meta data
function custom_og_override_save_meta_data($post_id) {
// Verify nonce
if (!isset($_POST['custom_og_override_nonce']) || !wp_verify_nonce($_POST['custom_og_override_nonce'], 'custom_og_override_save')) {
return;
}

// Save OG title
if (isset($_POST['custom_og_title'])) {
update_post_meta($post_id, '_custom_og_title', sanitize_text_field($_POST['custom_og_title']));
}

// Save OG description
if (isset($_POST['custom_og_description'])) {
update_post_meta($post_id, '_custom_og_description', sanitize_textarea_field($_POST['custom_og_description']));
}
}
add_action('save_post', 'custom_og_override_save_meta_data');

// Filter the Yoast SEO output for OG tags
function custom_og_override_filter($og_tag_value, $presentation, $args) {
// Check if the post has custom OG values
$post_id = get_the_ID();
$custom_og_title = get_post_meta($post_id, '_custom_og_title', true);
$custom_og_description = get_post_meta($post_id, '_custom_og_description', true);

// Override OG title
if ($args->name === 'og:title' && !empty($custom_og_title)) {
return $custom_og_title;
}

// Override OG description
if ($args->name === 'og:description' && !empty($custom_og_description)) {
return $custom_og_description;
}

return $og_tag_value;
}
add_filter('wpseo_frontend_presentation', function($presentation) {
$presentation->open_graph_title = apply_filters('custom_og_override_filter', $presentation->open_graph_title, $presentation, (object)['name' => 'og:title']);
$presentation->open_graph_description = apply_filters('custom_og_override_filter', $presentation->open_graph_description, $presentation, (object)['name' => 'og:description']);
return $presentation;
});
