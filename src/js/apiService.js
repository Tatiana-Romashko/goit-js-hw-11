const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '31642701-5207c7eb24ace8de1dd33b26f';

export default class ImagesApiService {
  constructor(perPage = 40, searchQuery = '') {
    this.searchQuery = searchQuery;
    this.page = 1;
    this.perPage = perPage;
  }

  async fetchImages() {
    const URL = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;
    const response = await axios.get(URL);

    const { totalHits, hits } = response.data;

    this.page += 1;

    return { totalHits, hits };
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    return (this.searchQuery = newSearchQuery);
  }
}
