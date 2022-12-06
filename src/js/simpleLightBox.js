import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const simpleGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  loop: true,
  captionDelay: 300,
  animationSpeed: 300,
  animationSlide: true,
});
