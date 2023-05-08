<!DOCTYPE html>
<html>

<head>
	<title>My Gallery</title>
	<link rel="stylesheet" href="styles/global.css">
	<link rel="stylesheet" href="styles/header.css">
	<link rel="stylesheet" href="styles/gallery.css">
	<link rel="stylesheet" href="styles/lightbox.css">
	<link rel="stylesheet" href="styles/footer.css">
</head>

<body>
	<header>
		<h1>My Gallery</h1>
	</header>
	<section>
		<div class="gallery-container">			
			<?php require 'gallery.php'; ?>
			<div class="lightbox">
				<span class="lightbox-close">&times;</span>
				<img class="lightbox-image">
				<div class="lightbox-counter"></div>			
			</div>
		</div>
	</section>
	<footer>
		<p>&copy; 2023 My Gallery. All rights reserved.</p>
	</footer>
	<script src="scripts/gallery.js"></script>
</body>

</html>