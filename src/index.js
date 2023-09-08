import axios, { isCancel, AxiosError } from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkUp } from './js/createMarkup.js';

const BASIC_URL = 'https://pixabay.com/api/';
const URL_KEY = '39323740-3487a835420c601222e532d94';
const form = document.querySelector('form');
const { searchQuery } = form.elements;
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const message = document.querySelector('.message');

let numberPage;
let nextGallery = null;

const fetchPhotos = async params => {
  const response = await axios.get(`${BASIC_URL}?${params}`);
  return response.data;
};

form.addEventListener('submit', handlerSubmit);
loadMoreBtn.addEventListener('click', handlerClickMore);

function handlerSubmit(evt) {
  evt.preventDefault();
  numberPage = 1;
  const params = new URLSearchParams({
    key: URL_KEY,
    q: searchQuery.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 39,
  });

  fetchPhotos(params)
    .then(photos => {
      if (photos.hits.length === 0) {
        if (nextGallery !== null) nextGallery.refresh();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      gallery.innerHTML = createMarkUp(photos.hits);
      loadMoreBtn.removeAttribute('hidden');
      message.setAttribute('hidden', 'true');
      nextGallery = new SimpleLightbox('.gallery a', {
        /* options */
      });
      Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      if (40 > photos.totalHits) {
        loadMoreBtn.setAttribute('hidden', 'true');
        return message.removeAttribute('hidden');
      }
    })

    .catch(error => console.log(error));
}

function handlerClickMore() {
  numberPage += 1;
  const params = new URLSearchParams({
    key: URL_KEY,
    q: searchQuery.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: numberPage,
    per_page: 39,
  });

  fetchPhotos(params)
  .then(photos => {
    if(numberPage-1 > photosHits / 39) {
        loadMoreBtn.setAttribute("hidden", "true")
        return message.removeAttribute("hidden")
    }
    gallery.insertAdjacentHTML("beforeend", createMarkUp(photos.hits))
    setTimeout(() => {
        nextGallery.refresh()
    }, 50)
  })
}


