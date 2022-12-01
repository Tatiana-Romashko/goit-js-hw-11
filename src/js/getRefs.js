export default function refs() {
  return {
    searchInput: document.querySelector('input'),
    searchBtn: document.querySelector('button'),
    searchForm: document.querySelector('.search-form'),
    galleryList: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
  };
}
