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
            createSearchResults(data);
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
}

function createSearchResults(data) {
    let movies = data.results;
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
            var btn = document.createElement("button");
            btn.innerHTML = "+";
            btn.setAttribute("id", movie.id);
            btn.addEventListener("click", function() { addToNoms(movie.title, movie.release_date.substring(0, 4), movie.id) });
            if (nominations.includes(movie.id)) {
                btn.style.opacity = 0;
            }
            card.appendChild(btn);
            $('#movies').append(card);
        }
    });
}


//adding to nominations list
function addToNoms(title, year, id) {
    if (nominations.length < 5) {
        let output = '';
        nominations.push(id);
        $('#' + id).css('opacity', 0);
        output += `
                    <div class="nom_card" id="${id}_remove">
                        <h5>${title} (${year})</h5>
                        <button onclick="removeFromNoms('${id}')">-</button>
                    </div>
                    `;
        $('.nominations').append(output);
    }
    if (nominations.length == 5) {
        $('#slide').addClass('show');
    }

}

//remove from nominations list
function removeFromNoms(id) {
    //remove that index item from nominations array
    const index = nominations.indexOf(parseInt(id));
    if (index > -1) {
        nominations.splice(index, 1);
    }

    //delete html element with {id}_remove
    $('#' + id + '_remove').remove();

    //disable = false for that movie id button
    $('#' + id).css('opacity', 1);

    //if nominations lenght < 5 then don't display banner
    if (nominations.length < 5) {
        $('#slide').removeClass('show');
    }
}