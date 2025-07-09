const genremap ={
  Action:28,
  Comedy:35,
  Drama:18,
  Thriller:53,
  Documentary:99,
};
const languageMap={
  English:'en',
  Hindi:'hi',
  Korean:'ko',
  Tamil:'ta',
  Telugu:'te',
  Spanish:'es',
  French:'fr',
};
const TMDB_API_KEY='d7d0579f82ce09ea6dfe7b54d1438395';
let watchlist=[];

document.getElementById('btnRecommend').addEventListener('click',getRecommendations);
document.getElementById('resetFilters').addEventListener('click',resetFilters);
document.getElementById('ratingRange').addEventListener('input',()=>{
  document.getElementById('ratingValue').textContent= document.getElementById('ratingRange').value;
});
document.getElementByld('searchBtn').addEventListener('click',searchMovies);
document.querySelector('.signup-btn').addEventListener('click',()=>{
  alert('signup functionality is not yet implemented. Please try again later or contact support.');
});

async function searchMovies(){
  const query=document.getElementByld('searchInput').value.trim();
  if(!query){
    alert('Please enter a movie name to search.');
    return;
  }
  
  const url=`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  try{
    const response=await fetch(url);
    const data=await response.json();
    const container=document.getElementById('recommendationList');

    if(data.results.length===0){
      container.innerHTML='<p style="grid-column:1/-1;text-align:center;font-size: 1.2rem; opacity:0.8;">No movies found for "${query}".</p>';
        return;
    }

    const movies=data.results.map(movie=>({
      title:movie.title,
        country:'Various',
      rating:movie.vote_average,
      language:movie.original_language,
      mood:getMoodFromRating(movie.vote_average),
      genre:'Varied',
      poster:movie.poster_path? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/230x320?text=No+Image',
      overview: movie.overview
  }));

  displayRecommendations(container,movies);
} catch(error) {
  console.error('Error searching movies:',error);
 }
}

async function fetchMoviesFromTMDB(filters={},page=1){
  const url=new URL('https://api.themoviedb.org/3/discover/movie');
  url.searchParams.append('api_key',TMDB_API_KEY);
  url.searchParams.append('sort_by','popularity.desc');
  url.searchParams.append('page',page);
  if(filters.language) url.searchParams.append('with_original_language',filters.language);
  if(filters.minRating) url.searchParams.append('vote_average.gte',filters.minRating);
  if(filters.genreId)url.searchParams.append('with_genres', filters.genreId);
  if(filters.country)url.searchParams.append('with_origin_country',filters.country);
  if(filters.minVoteCount) url.searchParams.append('vote_count.gte',filters.minVoteCount);

  try{
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map(movie=>({
      title:movie.title,
      country:filters.country||'Various',
      rating:movie.vote_average,
      language:movie.original_language,
      mood:getMoodFromRating(movie.vote_average),
      genre:filters.genre||'Varied',
      poster:movie.poster_path?https://image.tmdb.org/t/p/w500${movie.poster_path}:
      'https://via.placeholder.com/230x320?text+No+Image',
      overview:movie.overview
  }));
}catch(error){
console.error('Error fetching from TMDB:',error);
  return[];
}
}

function getMoodFromRating(rating){
if(rating>=8)return'Motivated';
  if(rating>=7)return'Happy';
  if(rating>=6)return'Chill';
  return'Sad';
}

async function getRecommendations(){
  const filters={
    language: languageMap[document.getElementById('language').value]||undefined,
    minRating:parseFloat[document.getElementById('ratingRange').value]||undefined,
    genreId: genreMap[document.getElementById('genre').value]||undefined,
      genre:document.getElementById('genre').value||undefined,
        minVoteCount:50,
        country: document.getElementByld('country').value|| undefined
};
const mood = document.getElementByld('mood').value;

const loadingBar = document.getElementByld('loadingBar');
const recommendationContainer = document.getElementByld('recommendationList');

loadingBar.style.display = 'flex';
recommendationContainer.innerHTML ="";

let allMovies = [];
const maxPagesToFetch = 5;

try{
  for(let page = 1;page<= maxPageToFetch; page++){
    const movies = await fetchMoviesFromTMDB(filters, page);
    allMovies = allMovies.concat(movies);
  }

  const filtered = mood? allMovies.filter(movie=> movie.mood===mood):allMovies;
  if(filtered.length===0){
    recommendationContainer.innerHTML =<p style="grid-column:1/-1; text-align:
      center; font-size: 1.2rem; opacity:0.8:">No movies found matching your filters.</p>;
      return;
  }

  displayRecommendations(recommendationContainer, filtered.slice(0,5));
}catch(error){
  console.error('Error fetching recommendations:',error);
}finally{
  loadingBar.style.display = 'none';
}
}

function displayRecommendations(container, movies, sectionTitle = 'Recommanded Movies/Series'){
  container.innerHTML ="";
  movies.forEach(movie =>{
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('tabindex','0');
  card.setAttribute('aria-label', `${movie.title} ${sectionTitle.toLowerCase()} card`);
card.innerHTML=`
      <div class="poster" style="background-image:url('${movie.poster}');" role="img" aria-label="Poster of ${movie.title}"></div>
      <div class="info">
        <h4>${movie.title}</h4>
        <p><strong>Country:</strong> ${movie.country}</p>
        <p><strong>Language:</strong> ${movie.language}</p>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p><strong>IMDb Rating:</strong> ${movie.rating}</p>
        <button class="watchlist-btn" aria-label="Add ${movie.title} to watchlist">Add to Watchlist</button>
        <button class="toggle-overview-btn" aria-expanded="false" aria-controls="overview-${movie.title.replace(/\s+/g, '')}">Show Overview</button>
        <p id="overview-${movie.title.replace(/\s+/g, '')}" class="overview-text">${movie.overview || 'No overview available.'}</p>
      </div>
    `;

    card.querySelector('.overview-text').style.display+'none';
    card.querySelector('.watchlist-btn').addEventListener('click', () =>
    addToWatchlist(movie));
    card.querySelector('.toggle-overview-btn').addEventListener('click',()=>{
    const overviewText = card.querySelector('.overview-text');
    const isVisible = overviewText.style.display==='block';
    overviewText.style.display = isVisible ? 'none':'block';
    card.querySelector('.toggle-overview-btn').textContent = isVisible?'Show Overview':
    'Hide Overview';
    card.querySelector('.toggle-overview-btn').setAttribute('aria-expanded',!isVisible);
    });

    container.appendChild(card);
    });
    }

    function addToWatchlist(movie){
    if(watchlist.some(m=>m.title===movie.title)){
    alert('This movie is already in your watchlist.');
    return;
    }
    watchlist.push(movie);
    updateWatchlistUI();
    }

    function updateWatchlistUI(){
    const watchlistContainer = document.getElementByld('watchlistItems');
    watchlistContainer.innerHTML ="";
    watchlist.forEach(movie =>{
    const li = document.createElement('li');
    li.textContent = movie.title;
    watchlistContainer.appendChild(li);
    });
    }

    function resetFilters(){
    document.getElementById('mood').value ="";
    document.getElementById('genre').value ="";
    document.getElementById('country').value ="";
    document.getElementById('language').value="";
    document.getElementById('ratingRange').value = 5;
    document.getElementById('ratingValue').textContent = 5;
    document.getElementById('recommendationList').innerHTML ="";
    }


      



  

















                                   














  
  
    
                                                         
