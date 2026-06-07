'use strict';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const galleryContainer = document.querySelector('ul.gallery');

const loader = document.querySelector('.loader-container');

const loadMoreBtn = document.querySelector('button.load-more-btn');

function createGallery(images) {
  const fragment = images.reduce(
    createGalleryItem,
    document.createDocumentFragment()
  );
  galleryContainer.appendChild(fragment);
  lightbox.refresh();
  galleryContainer.classList.add('active');
}

function createGalleryItem(fragment, hit) {
  const listItem = document.createElement('li');
  listItem.classList.add('gallery-item');

  const link = document.createElement('a');
  link.classList.add('gallery-link');
  link.href = getImageSource(hit);

  const image = createGalleryImg(hit);
  link.appendChild(image);

  const imgInfo = createGalleryImgInfo(hit);
  link.appendChild(imgInfo);

  listItem.appendChild(link);
  fragment.appendChild(listItem);

  return fragment;
}

function getImageSource(hit) {
  return (
    hit.imageURL ||
    hit.fullHDURL ||
    hit.largeImageURL ||
    hit.webformatURL ||
    hit.previewURL
  );
}

function createGalleryImg(hit) {
  const image = document.createElement('img');
  image.classList.add('gallery-image');
  image.src = hit.largeImageURL || hit.webformatURL || hit.previewURL;
  image.alt = hit.tags;
  image.width = 358;
  image.height = 198;
  image.loading = 'lazy';
  image.decoding = 'async';
  return image;
}

function createGalleryImgInfo(hit) {
  const keys = ['likes', 'views', 'comments', 'downloads'];

  const imgInfo = keys.reduce((parent, key) => {
    const dt = document.createElement('dt');
    dt.textContent = key;

    const dd = document.createElement('dd');
    dd.textContent = hit[key];

    parent.appendChild(dt);
    parent.appendChild(dd);
    return parent;
  }, document.createElement('dl'));
  imgInfo.classList.add('gallery-img-info');

  return imgInfo;
}

function clearGallery() {
  galleryContainer.innerHTML = '';
}

function showLoader() {
  if (loader) {
    loader.classList.add('active');
  }
}

function hideLoader() {
  if (loader) {
    loader.classList.remove('active');
  }
}

function showLoadMoreButton() {
  if (loadMoreBtn) {
    loadMoreBtn.classList.add('active');
  }
}

function hideLoadMoreButton() {
  if (loadMoreBtn) {
    loadMoreBtn.classList.remove('active');
  }
}

export { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton };
