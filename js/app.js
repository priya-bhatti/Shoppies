$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        var searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
});

const endpoint = "https://api.themoviedb.org/3/search/movie?api_key=6881943249ab8e78d8d5a1a5ed3ce785";
const posterEndpoint = "https://image.tmdb.org/t/p/w500";
var nominations = [];

function getMovies(searchText) {
    $('#movies').html('');
    const url = endpoint + "&query=" + searchText;
    fetch(url)
        .then((result) => result.json())
        .then((data) => {
            let movies = data.results;
            //let output = '';
            $.each(movies, (index, movie) => {
                if (movie.poster_path) {
                    var card = document.createElement("div");
                    card.setAttribute("class", "card");
                    var img = document.createElement("img");
                    img.src = posterEndpoint + movie.poster_path;
                    var title = document.createElement("h5");
                    title.innerHTML = movie.title;
                    var year = document.createElement("h5");
                    year.innerHTML = movie.release_date.substring(0, 4);
                    card.appendChild(img);
                    card.appendChild(title);
                    card.appendChild(year);
                    if (!nominations.includes(movie.id)) {
                        var btn = document.createElement("button");
                        btn.innerHTML = "add to nominations";
                        btn.setAttribute("id", movie.id);
                        btn.addEventListener("click", function() { addToNoms(movie.title, movie.release_date.substring(0, 4), movie.id) });
                        card.appendChild(btn);

                    }
                    // output += `
                    // <div class="card">
                    //     <img src="${posterEndpoint + movie.poster_path}" >
                    //     <h5>${movie.title}</h5>
                    //     <h5>${movie.release_date.substring(0,4)}</h5>
                    //     <button id="${movie.id}"onclick="addToNoms('${movie.title}', '${movie.release_date.substring(0,4)}', '${movie.id}')">add to nominations</button>
                    // </div>
                    // `;
                    $('#movies').append(card);
                }
            });
            // $('#movies').append(output);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}


//adding to list
function addToNoms(title, year, id) {
    if (nominations.length < 5) {
        let output = '';
        nominations.push(id);
        $('#' + id).css('display', 'none');
        output += `
                    <div class="nom_card" id="${id}_remove">
                        <h5>${title} ${year}</h5>
                        <button onclick="removeFromNoms('${id}')">remove</button>
                    </div>
                    `;
        $('.nominations').append(output);
    }
    if (nominations.length == 5) {
        $('#banner').css('display', 'block');
    }

}

//remove from nominations
// remove child from .nominations with id_remove
// remove from nominations array
// bring back button
//take away banner