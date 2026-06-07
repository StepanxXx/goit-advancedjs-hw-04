'use strict';

import axios from 'axios';
import { showLoader, hideLoader } from './render-functions';

const API_KEY = '56117998-dbfb9ab566fb37bd87035667f';

const minExecutionTime = 500; // Minimum time in milliseconds

export default async function getImagesByQuery(query, page = 1, perPage = 15) {
  showLoader();
  const queryParam = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  });
  const requestUrl = 'https://pixabay.com/api/?' + queryParam.toString();

  const startTime = performance.now();

  try {
    const response = await axios.get(requestUrl);
    await waitForMinimumExecutionTime(startTime);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error fetching images: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  } finally {
    hideLoader();
  }
}

async function waitForMinimumExecutionTime(startTime) {
  const elapsedTime = performance.now() - startTime;
  const remainingTime = Math.max(0, minExecutionTime - elapsedTime);

  await new Promise(resolve => {
    setTimeout(resolve, remainingTime);
  });
}
