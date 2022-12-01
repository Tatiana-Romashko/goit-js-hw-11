import refs from './js/getRefs';
import ImagesApiService from './js/apiService';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refsObjects = refs();

refsObjects.loadMoreBtn.classList.add('is-hidden');

refsObjects.searchForm.addEventListener('submit', searchImages);
refsObjects.loadMoreBtn.addEventListener('click', onLoadMore);

const imagesApiService = new ImagesApiService();

function searchImages(evt) {
  evt.preventDefault();
  clearGallery();
  refsObjects.loadMoreBtn.classList.remove('is-hidden');

  imagesApiService.query = evt.currentTarget.elements.searchQuery.value;
  //console.log(imagesApiService);
  imagesApiService.resetPage();
  imagesApiService
    .fetchImages()
    .then(({ totalHits, hits }) => {
      if (
        totalHits / (imagesApiService.page - 1) < imagesApiService.perPage &&
        hits.length !== 0
      ) {
        refsObjects.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (hits.length > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      if (hits.length === 0) {
        refsObjects.loadMoreBtn.classList.add('is-hidden');
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(hits);
        console.log('hits.....', hits);
      }
    })
    .catch(onFetchError);
}

function renderGallery(arrayForGallery) {
  const galleryMarkup = createGalleryMarkup(arrayForGallery);

  refsObjects.galleryList.insertAdjacentHTML('beforeend', galleryMarkup);

  let lightbox = new SimpleLightbox('.gallery .gallery__item', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  return lightbox;
}

function createGalleryMarkup(imagesArray) {
  return imagesArray
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
                <div class="photo-card">
                    <a class="gallery__item" href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320px" height="210px"/>
                    </a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b><br/>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b><br/>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b><br/>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b><br/>${downloads}
                        </p>
                    </div>
                </div>
            `;
    })
    .join('');
}

function onLoadMore() {
  imagesApiService
    .fetchImages()
    .then(({ totalHits, hits }) => {
      renderGallery(hits);
      if (
        totalHits / (imagesApiService.page - 1) < imagesApiService.perPage &&
        hits.length !== 0
      ) {
        refsObjects.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(onFetchError);
}

function clearGallery() {
  refsObjects.galleryList.innerHTML = '';
}

function onFetchError(error) {
  Notify.failure(error.message);
}
