const api_key = "b3f26d4c4f3377616c3f18dda1d92323";
const image_url = "https://image.tmdb.org/t/p/w500";
const url = "https://api.themoviedb.org/3/search/movie?api_key=b3f26d4c4f3377616c3f18dda1d92323"

const searchBtn = document.querySelector("#search");
const searchInput = document.querySelector("#inputValue");
const movieSearchable = document.querySelector("#movies-searchable");
const imgElement = document.querySelector("img");

function generateUrl(path) {
    const url = `https://api.themoviedb.org/3${path}?api_key=b3f26d4c4f3377616c3f18dda1d92323`
    return url;

}


function movieSelection(movies) {
    return movies.map((movie) => {
        if (movie.poster_path) {
            return ` 
                <img 
                src=${image_url + movie.poster_path} data-movie-id=${movie.id}>`
        }
    })
}

function createMovieContainer(movies) {
    const movieElement = document.createElement("div");
    movieElement.setAttribute("class", "movie");

    const movieTemplate = `
    <section class="section">
    ${movieSelection(movies)}
    </section>
    <div class="content">
    <p id="content-close">X</p>
    </div>
 `;

    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

function renderMovieSelected(data) {
    //data.results []
    movieSearchable.innerHTML = "";
    const movies = data.results;
    const movieBlock = createMovieContainer(movies);
    movieSearchable.appendChild(movieBlock);
    console.log(data);
}

searchBtn.onclick = function (e) {
    e.preventDefault();
    const value = searchInput.value;
    const path = "/search/movie";
    const newUrl = generateUrl(path) + "&query=" + value;


    fetch(newUrl)
        .then((response) => response.json())
        .then(renderMovieSelected)
        .catch((error) => {
            console.log("ERROR: ", error);
        })

    searchInput.value = "";
    console.log("Value: ", value);

}


function createFrame(video) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;

    return iframe;
}


function createTemplate(data, content) {
    content.innerHTML = "";
    console.log("videos: ", data);
    const videos = data.results;
    const length = videos.length > 4 ? 4 : videos.length;
    const iframeContainer = document.createElement("div");

    for (let i = 0; i < length; i++) {
        const video = videos[i];
        const iframe = createFrame(video);
        iframeContainer.appendChild(iframe);
        content.appendChild(iframeContainer);
    }
}




document.onclick = function (event) {
    const target = event.target;
    if (target.tagName.toLowerCase() === "img") {
        const movieId = target.dataset.movieId;
        console.log("MovieID: ", movieId)
        const section = event.target.parentElement;
        const content = section.nextElementSibling;
        content.classList.add("content-display");

        const path = `/movie/${movieId}/videos`
        const url = generateUrl(path);


        fetch(url)
            .then((res) => res.json())
            .then((data) => createTemplate(data, content))
            .catch((error) => {
                console.log("ERROR: ", error);
            });


    }

    if (target.id === "content-close") {
        const content = target.parentElement;
        content.classList.remove("contents-display");
    }
}