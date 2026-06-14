---
layout: "post"
title: "WP CUSTOM OG OVERRIDE"
date: "2025-01-16 15:27:49"
modified: "2025-01-16 15:28:11"
slug: "wp-custom-og-override"
status: "publish"
author: "illphated"
categories:
  - "Uncategorized"
tags: []
featured_image: "/media/2025/01/Screenshot-2025-01-16-at-9.18.40\u202fAM.jpg"
featured_image_relative: "2025/01/Screenshot-2025-01-16-at-9.18.40\u202fAM.jpg"
---

<?php
/**
* Plugin Name: Custom OG and Twitter Overrides
* Plugin URI: https://example.com
* Description: Allows overriding Yoast SEO defaults for OG titles, descriptions, and Twitter images.
* Version: 1.2
* Author: Your Name
* Author URI: https://example.com
* License: GPL2
*/

// Add custom meta boxes to the post editor
function custom_og_override_meta_box() {
add_meta_box(
'custom_og_override',
'Custom OG & Twitter Settings',
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
$custom_twitter_image = get_post_meta($post->ID, '_custom_twitter_image', true);
?>
<p>
<label for="custom_og_title">Custom OG Title</label>
<input type="text" id="custom_og_title" name="custom_og_title" value="<?php echo esc_attr($custom_og_title); ?>" style="width:100%;" />
</p>
<p>
<label for="custom_og_description">Custom OG Description</label>
<textarea id="custom_og_description" name="custom_og_description" rows="3" style="width:100%;"><?php echo esc_textarea($custom_og_description); ?></textarea>
</p>
<p>
<label for="custom_twitter_image">Custom Twitter Image URL</label>
<input type="text" id="custom_twitter_image" name="custom_twitter_image" value="<?php echo esc_attr($custom_twitter_image); ?>" style="width:100%;" placeholder="Enter image URL" />
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

// Save Twitter image
if (isset($_POST['custom_twitter_image'])) {
update_post_meta($post_id, '_custom_twitter_image', esc_url_raw($_POST['custom_twitter_image']));
}
}
add_action('save_post', 'custom_og_override_save_meta_data');

// Filter Yoast SEO output for OG and Twitter metadata
function custom_og_override_wpseo_metadata($presentation) {
$post_id = get_the_ID();
if (!$post_id) return $presentation;

// Check for custom OG values
$custom_og_title = get_post_meta($post_id, '_custom_og_title', true);
$custom_og_description = get_post_meta($post_id, '_custom_og_description', true);
$custom_twitter_image = get_post_meta($post_id, '_custom_twitter_image', true);

// Override OG title
if (!empty($custom_og_title)) {
$presentation->open_graph->title = $custom_og_title;
}

// Override OG description
if (!empty($custom_og_description)) {
$presentation->open_graph->description = $custom_og_description;
}

// Override Twitter image
if (!empty($custom_twitter_image)) {
$presentation->twitter->image = $custom_twitter_image;
$presentation->open_graph->image = $custom_twitter_image; // Optional: Sync with OG image
}

return $presentation;
}
add_filter('wpseo_frontend_presentation', 'custom_og_override_wpseo_metadata');
