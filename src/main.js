'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import getImagesByQuery from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const searchForm = document.querySelector('form.form');
const galleryContainer = document.querySelector('ul.gallery');
const loadMoreBtn = document.querySelector('button.load-more-btn');
let query = '';
let currentPage = 1;
let totalHits = 0;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.target.elements['search-text'].value.trim();
  currentPage = 1;

  if (query === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
    });
    return;
  }

  try {
    showLoader();
    const data = await getImagesByQuery(query);
    clearGallery();
    if (data.hits.length === 0) {
      iziToast.error({
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    createGallery(data.hits);
    showLoadMoreButton();
    totalHits = data.totalHits;
    showEndOfResultsMessage();
  } catch (error) {
    showImageError(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  try {
    showLoader();
    const data = await getImagesByQuery(query, currentPage);
    createGallery(data.hits);
    scrollToNewImages();
    showEndOfResultsMessage();
  } catch (error) {
    showImageError(error);
  }
});

function showImageError(error) {
  iziToast.error({
    position: 'topRight',
    message: 'An error occurred while fetching images. Please try again later.',
  });
  console.error('Error fetching images:', error);
}

function showEndOfResultsMessage() {
  if (galleryContainer.children.length >= totalHits) {
    hideLoadMoreButton();
    iziToast.info({
      position: 'topRight',
      message: "We're sorry, but you've reached the end of search results.",
    });
  }
}

function scrollToNewImages() {
  `Зроби плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень. Для цього отримай у коді висоту однієї карточки галереї, використовуючи функцію getBoundingClientRect. Після цього використовуй метод window.scrollBy для прокрутки сторінки на дві висоти карточки галереї.`;
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const { height: itemHeight } = galleryItem.getBoundingClientRect();
    window.scrollBy({
      top: itemHeight * 2,
      behavior: 'smooth',
    });
  }
}