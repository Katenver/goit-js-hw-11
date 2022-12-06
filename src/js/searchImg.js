import { simpleGallery } from './simpleLightBox';
import { Notify } from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '31754273-9e9d247053aea74207f174a45';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const guard = document.querySelector('.js-guard');
let pageCounter = 0;

const options = {
  root: null,
  rootMargin: '200px',
  treshhold: 1.0,
};
const observer = new IntersectionObserver(infinityLoad, options);

function infinityLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pageCounter += 1;
      let query = searchFormEl.elements.searchQuery.value.trim();

      fetchImages(query, pageCounter).then(({ data: { hits } }) => {
        createMarkup(hits);
        simpleGallery.refresh();

        const { height: cardHeight } =
          galleryEl.firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 3,
          behavior: 'smooth',
        });
      }).catch(error => {
          Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
          loadBtn.classList.add('is-hidden');
        });;
    }
  });
}

searchFormEl.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onLoad);

async function fetchImages(searchQuery, pageNumber) {
  try {
    const resp = await axios.get(BASE_URL, {
      params: {
        key: `${KEY_API}`,
        q: `${searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${pageCounter}`,
        per_page: '40',
      },
    });
    return resp;
  } catch (error) {
    console.dir(error.message);
  }
}

function onSearch(evt) {
  evt.preventDefault();
  galleryEl.innerHTML = '';
  pageCounter = 1;
  let query = searchFormEl.elements.searchQuery.value.trim();

  if (!query) {
    return Notify.info('Please enter your request.');
  }

  fetchImages(query, pageCounter)
    .then(
      ({
        data: { totalHits, hits, total },
        config: {
          params: { page },
        },
      }) => {
        if (!total) {
          throw new Error();
        } else {
          Notify.success(`Hooray! We found ${totalHits} images.`);
          return hits;
        }
      }
    )
    .then(hits => {
      console.dir(hits);
      if (hits.length < 40) {
        createMarkup(hits);
        return Notify.warning(
          'We`re sorry, but you`ve reached the end of search results'
        );
      } else {
        createMarkup(hits);
        loadBtn.classList.remove('is-hidden');
        observer.observe(guard);
      }
    })
    .catch(error => {
      console.dir(error.message);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
  return;
}

function createMarkup(hits) {
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a class="gallery__item" href="${largeImageURL}">
         <div class="photo-card">
         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
         <div class="info">
           <p class="info-item">
             <b>Likes </b>${likes}
           </p>
           <p class="info-item">
             <b>Views </b>${views}
           </p>
           <p class="info-item">
             <b>Comments </b>${comments}
           </p>
           <p class="info-item">
             <b>Downloads </b>${downloads}
           </p>
         </div>
       </div></a>`
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  simpleGallery.refresh();
  return;
}

function onLoad() {
  pageCounter += 1;
  fetchImages(searchFormEl.elements.searchQuery.value.trim())
    .then(
      ({
        data: { totalHits, hits, total },
        config: {
          params: { page },
        },
      }) => {
        if (!total) {
          throw new Error();
        } else {
          pageCounter += 1;
          return hits;
        }
      }
    )
    .then(hits => {
      console.dir(hits);
      if (hits.length < 40) {
        createMarkup(hits);
        loadBtn.classList.add('is-hidden');
        return Notify.info(
          'We`re sorry, but you`ve reached the end of search results'
        );
      } else {
        createMarkup(hits);
        loadBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
}
