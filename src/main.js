const api = axios.create({
   baseURL: BASE_URL,
   headers:{
    'Content-Type': 'application/json;charset=utf-8',
   },
   params:{
    'api_key': API_KEY,
   }
});

function createMovies(movies, container){
  container.innerHTML="";

  let domMovies = movies.map(movie => {
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');
      movieContainer.addEventListener('click', ()=>{
        location.hash ='movie='+movie.id;
      })
      const movieImg = document.createElement('img');
      movieImg.classList.add('movie-img');
      movieImg.setAttribute('alt', movie.title);
      movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300/'+ movie.poster_path);
      movieContainer.appendChild(movieImg)
      return movieContainer;
    });
    
    container.append(...domMovies);
  
}

function createCategories(categories, container){

  const domCategories = categories.map(category => {
      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add('category-container');

      const categoryTag = document.createElement('h3');
      categoryTag.classList.add('category-title');
      categoryTag.addEventListener('click', ()=>{
        location.hash = `#category=${category.id}-${category.name}`
      })
      categoryTag.setAttribute('id', `id${category.id}`);
      const text = document.createTextNode(category.name);
      categoryTag.appendChild(text);
      categoryContainer.appendChild(categoryTag)
      return categoryContainer;
    });
    
    container.innerHTML='';
    container.append(...domCategories);
}

async function getTrendingMoviesPreview(){
  
  try {
    let {data} = await api('/trending/movie/day');
    
    createMovies(data.results, trendingMoviesPreviewList)
    
  } catch (error) {
    console.log(error)
  }
}

async function getMoviesByCategory(id){

  try {
    let {data} = await api(`/discover/movie`,{
    params: {
      with_genres: id,
    },
  });

    createMovies(data.results, genericSection);
    
  } catch (error) {
    console.log(error);
  }
}

async function getCategoriesPreview(){
  
  try {
    let {data} = await api('/genre/movie/list');
    
    createCategories(data.genres,categoriesPreviewList)
  } catch (error) {
    console.log(error)
  }
}

async function getMoviesBySearch(query) {
  try {
    const { data } = await api('search/movie', {
      params: {
        query,
      },
    });
    const movies = data.results;
  
    createMovies(movies, genericSection);
    
  } catch (error) {
    console.log(error.response.data.errors)
  }
}

async function getMoviesById(movieId){
  
  try {
    let {data: movie} = await api('/movie/'+movieId);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path

    headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0,0,0,0.35) 19.27%,
      rgba(0,0,0,0) 29.17%
    ),
    url(${movieImgUrl})`
    
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview,
    movieDetailScore.textContent= movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesById(movieId);
    
  } catch (error) {
    console.log(error)
  }
}

async function getRelatedMoviesById(movieId){
  
  try {
    let {data} = await api(`/movie/${movieId}/recommendations`);

    createMovies(data.results, relatedMoviesContainer)

    
  } catch (error) {
    console.log(error)
  }
}



async function getTrendingMovies(){
  
  try {
    let {data} = await api('/trending/movie/day');
    
    createMovies(data.results, genericSection)
    
  } catch (error) {
    console.log(error)
  }
}