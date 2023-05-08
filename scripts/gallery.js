// Variables
const images = document.querySelectorAll('.gallery-item img');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lazyImages = document.querySelectorAll('.gallery-item img[data-src]');
let currentImageIndex = -1;
let touchStartX = null;
let touchCurrentX = null;

// Functions
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  if (!touchStartX) {
    return;
  }

  touchCurrentX = event.touches[0].clientX;
  const swipeDistance = touchStartX - touchCurrentX;

  // Apply visual movement during the swipe
  lightboxImage.style.transform = `translateX(${-swipeDistance}px)`;
}

function handleTouchEnd() {
  if (touchStartX && touchCurrentX) {
    const swipeDistance = touchStartX - touchCurrentX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        // Swiped left
        changeImage(1);
      } else {
        // Swiped right
        changeImage(-1);
      }
    }

    touchStartX = null;
    touchCurrentX = null;
  }

  resetImageTransform();
}

function resetImageTransform() {
  lightboxImage.style.transform = '';
}
function updateImageCounter() {
  const imageCounter = document.querySelector('.lightbox-counter');
  imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
}

function changeImage(offset) {
  const newIndex = currentImageIndex + offset;

  if (newIndex >= 0 && newIndex < images.length) {
    currentImageIndex = newIndex;
    lightboxImage.src = images[currentImageIndex].src.replace(/\.webp$/, "");
    updateImageCounter();
    preloadImages();
  }
}

function preloadImages() {
  const nextIndex = currentImageIndex + 1;
  const prevIndex = currentImageIndex - 1;

  if (nextIndex < images.length) {
    const nextImage = new Image();
    nextImage.src = images[nextIndex].src.replace(/\.webp$/, "");
  }

  if (prevIndex >= 0) {
    const prevImage = new Image();
    prevImage.src = images[prevIndex].src.replace(/\.webp$/, "");
  }
}

var closeLightbox = () => lightbox.style.display = 'none';

function lazyLoad() {
  lazyImages.forEach((image) => {
    if (image.getBoundingClientRect().top < window.innerHeight + 100) {
      image.src = image.dataset.src.replace(/\.webp$/, "");
      image.removeAttribute('data-src');
    }
  });
}

// Lightbox functionality
images.forEach((image, index) => {
  image.parentElement.addEventListener('click', () => {
    currentImageIndex = index;
    lightbox.style.display = 'flex';
    lightboxImage.src = image.src.replace(/\.webp$/, "");
    updateImageCounter();
    preloadImages();
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    changeImage(1); // Show next image
  } else if (event.key === 'ArrowLeft') {
    changeImage(-1); // Show previous image
  } else if (event.key === 'Escape') {
    closeLightbox();
  }
});

// Add touch event listeners for swipe functionality
lightboxImage.addEventListener('touchstart', handleTouchStart);
lightboxImage.addEventListener('touchmove', handleTouchMove);
lightboxImage.addEventListener('touchend', handleTouchEnd);


// Lazy loading functionality
for (const event of ['scroll', 'resize', 'orientationchange']) {
  window.addEventListener(event, lazyLoad);
}

lazyLoad();