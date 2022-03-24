
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('search-result');

var debouncedGetInfo = debounce(findMovies);

function debounce(callback) {
    var timeout;

    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(callback, 800);
    };
}

movieSearchBox.addEventListener('input', debouncedGetInfo);

async function loadMovies(searchTerm) {
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page-1&apikey=6046ceb`;
    const res = await fetch(`${URL}`);
    const data = await res.json();

    console.log(data);  

    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0) {
        searchList.classList.remove('search-list_hide');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('search-list_hide');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list__item');
        if(movies[idx].Poster != "N/A") {
            moviePoster = movies[idx].Poster;
        } else {
            moviePoster = "image_not_found.png";
        }

        movieListItem.innerHTML = `
            <div class="search-list__thumbnail">
                <img src="${moviePoster}" alt="movie poster">
            </div>
            <div class="search-list__info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
        `;

        searchList.appendChild(movieListItem);
    }

    loadMoviesDetails();
}

function loadMoviesDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list__item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-lsit');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=6046ceb `);
            const movieDetails = await result.json();

            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="search-result__poster">
            <img src="${(details.Poster != 'N/A') ? details.Poster : 'image_not_found.png'}" alt="movie poster">
        </div>

        <div class="search-result__info">
            <h3 class="search-result__title">${details.Title}</h3>

            <ul class="search-result__misc">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>

            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != 'form-control') {
        searchList.classList.add('search-list_hide')
    }
});