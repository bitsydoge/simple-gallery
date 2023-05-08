<?php

const IMG_DIR = 'images/';
const IMG_PER_PAGE = 9;
$images = glob(IMG_DIR . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
$current_page = isset($_GET['page']) ? $_GET['page'] : 1;
$total_pages = ceil(count($images) / IMG_PER_PAGE);
$offset = ($current_page - 1) * IMG_PER_PAGE;

function get_image_date($image_path) {
    $exif_data = exif_read_data($image_path);
    if (!empty($exif_data['DateTime'])) {
        return strtotime($exif_data['DateTime']);
    } else {
        return filemtime($image_path);
    }
}

function generate_gallery_item_html($image, $title, $description)
{
    $webp_image = $image . '.webp';
    if (!file_exists($webp_image) || filemtime($webp_image) < filemtime($image)) {
        $image_resource = imagecreatefromstring(file_get_contents($image));
        $width = imagesx($image_resource);
        $height = imagesy($image_resource);
        $new_width = $width > $height ? 800 : round($width * 800 / $height);
        $new_height = $height > $width ? 800 : round($height * 800 / $width);
        $resized_image = imagescale($image_resource, $new_width, $new_height, IMG_BICUBIC_FIXED);
        imagewebp($resized_image, $webp_image);
        imagedestroy($resized_image);
        imagedestroy($image_resource);
    }
    $html = '<div class="gallery-item">
                <img src="' . $webp_image . '" alt="' . $title . '">
                <div class="gallery-item-text-container">
                    <h3>' . $title . '</h3>
                    <p>' . $description . '</p>
                </div>
            </div>';
    return $html;
}

function cmp($a, $b) {
    $a_date = file_exists($a . '.json') ? strtotime(json_decode(file_get_contents($a . '.json'), true)['date']) : get_image_date($a);
    $b_date = file_exists($b . '.json') ? strtotime(json_decode(file_get_contents($b . '.json'), true)['date']) : get_image_date($b);
    return $b_date - $a_date;
}

usort($images, "cmp");

$images_to_display = array_slice($images, $offset, IMG_PER_PAGE);

if ($total_pages > 1) {
    echo '<div class="pagination">';
    if ($current_page > 1) {
        echo '<a href="?page=' . ($current_page - 1) . '">Previous</a>';
    }
    for ($i = 1; $i <= $total_pages; $i++) {
        echo '<a href="?page=' . $i . '"' . ($i == $current_page ? ' class="active"' : '') . '>' . $i . '</a>';
    }
    if ($current_page < $total_pages) {
        echo '<a href="?page=' . ($current_page + 1) . '">Next</a>';
    }
    echo '</div>';
}

echo '<div class="gallery">';

foreach ($images_to_display as $image) {
    $name = basename($image);
    $json_file = IMG_DIR . $name . '.json';
    if (file_exists($json_file)) {
        $info = json_decode(file_get_contents($json_file), true);
        $title = $info['title'];
        $description = $info['description'];
    } else {
        $title = pathinfo($name, PATHINFO_FILENAME);
        $description = '';
    }
    echo generate_gallery_item_html($image, $title, $description);
}
echo '</div>';
?>