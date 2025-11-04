"use script"

const URLcredits = `./json_Tp2/credits.json`;
const URLdetails = './json_Tp2/details.json';


//------------------------CONTENEUR PRINCIPAL---------------

const movie = {
    "adult": false,
    "backdrop_path": "/icmmSD4vTTDKOq2vvdulafOGw93.jpg",
    "belongs_to_collection": {
        "id": 2344,
        "name": "Matrix - Saga",
        "poster_path": "/1OFITDLSQ7yRJwg4DJXbjtTHlNe.jpg",
        "backdrop_path": "/bRm2DEgUiYciDw3myHuYFInD7la.jpg"
    },
    "budget": 63000000,
    "genres": [
        {
            "id": 28,
            "name": "Action"
        },
        {
            "id": 878,
            "name": "Science-Fiction"
        }
    ],
    "homepage": "",
    "id": 603,
    "imdb_id": "tt0133093",
    "origin_country": [
        "US"
    ],
    "original_language": "en",
    "original_title": "The Matrix",
    "overview": "Programmeur anonyme dans un service administratif le jour, Thomas Anderson devient Neo la nuit venue. Sous ce pseudonyme, il est l’un des pirates les plus recherchés du cyber‐espace. À cheval entre deux mondes, Neo est assailli par d’étranges songes et des messages cryptés provenant d’un certain Morpheus. Celui‐ci l’exhorte à aller au‐delà des apparences et à trouver la réponse à la question qui hante constamment ses pensées : qu’est‐ce que la Matrice ? Nul ne le sait, et aucun homme n’est encore parvenu à en percer les défenses. Mais Morpheus est persuadé que Neo est l’Élu, le libérateur mythique de l’humanité annoncé selon la prophétie. Ensemble, ils se lancent dans une lutte sans retour contre la Matrice et ses terribles agents…",
    "popularity": 114.547,
    "poster_path": "/pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg",
    "production_companies": [
        {
            "id": 79,
            "logo_path": "/at4uYdwAAgNRKhZuuFX8ShKSybw.png",
            "name": "Village Roadshow Pictures",
            "origin_country": "US"
        },
        {
            "id": 372,
            "logo_path": null,
            "name": "Groucho II Film Partnership",
            "origin_country": ""
        },
        {
            "id": 1885,
            "logo_path": "/xlvoOZr4s1PygosrwZyolIFe5xs.png",
            "name": "Silver Pictures",
            "origin_country": "US"
        },
        {
            "id": 174,
            "logo_path": "/zhD3hhtKB5qyv7ZeL4uLpNxgMVU.png",
            "name": "Warner Bros. Pictures",
            "origin_country": "US"
        }
    ],
    "production_countries": [
        {
            "iso_3166_1": "US",
            "name": "United States of America"
        }
    ],
    "release_date": "1999-03-31",
    "revenue": 463517383,
    "runtime": 135,
    "spoken_languages": [
        {
            "english_name": "English",
            "iso_639_1": "en",
            "name": "English"
        }
    ],
    "status": "Released",
    "tagline": "Croire à l'incroyable.",
    "title": "Matrix",
    "video": false,
    "vote_average": 8.2,
    "vote_count": 25813
}

fetch(URLdetails)
    .then(result => {
        if (!result.ok) throw new Error("oups, erreur initialisataion details.json");
        return result.json();
    })
    .then(movie => {
        //RECUPERATION ELEMENT HTML
        let titleEl = document.getElementById('title');
        let posterEl = document.getElementById('poster');
        let overviewEl = document.getElementById('overview');
        let releaseDateEl = document.getElementById('release-date');
        let runtimeEl = document.getElementById('runtime');
        let ratingEl = document.getElementById('rating');
        let taglineEl = document.getElementById('tagline');
        let movieSection = document.getElementById('movie-section');
        let genresDiv = document.getElementById('genres');

        // REMPLISSAGE INFOS FILM 
        titleEl.textContent = movie.title;
        posterEl.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieSection.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
        overviewEl.textContent = movie.overview;
        releaseDateEl.textContent = movie.release_date;
        runtimeEl.textContent = movie.runtime;
        ratingEl.textContent = movie.vote_average;
        taglineEl.textContent = movie.tagline;

        // GENRE
        movie.genres.forEach(g => {
            let span = document.createElement('span');

            span.textContent = g.name;
            genresDiv.appendChild(span);
        });
    })
    .catch(error =>
        console.log("Erreur fetch", error));

//--------- ACTEURS----------

// const acteurs = [
//     { "name": "Keanu Reeves", "character": "Neo", "profile_path": "/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg" },
//     { "name": "Laurence Fishburne", "character": "Morpheus", "profile_path": "/aBRISux1AGCqkFNTKHYfLcJunWA.jpg" },
//     { "name": "Carrie-Anne Moss", "character": "Trinity", "profile_path": "/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg" },
//     { "name": "Hugo Weaving", "character": "Agent Smith", "profile_path": "/yDqEcheCdKGMsutMzsb0q5wYLDV.jpg" },
//     { "name": "Gloria Foster", "character": "Oracle", "profile_path": "/AriGXtC9fjBOia9Zr8CZjn4o3rx.jpg" },
//     { "name": "Joe Pantoliano", "character": "Cypher", "profile_path": "/3OHUI3nX4SYGGItDk3xqeIvWtIf.jpg" },
//     { "name": "Marcus Chong", "character": "Tank", "profile_path": "/q9HQttibTj2MoXVtLjq2kKqmPrE.jpg" }
// ];


fetch(URLcredits)
    .then(results => {
        if (!results.ok) throw new Error("oups, erreur initialisataion details.json");
        return results.json();
    })
    .then(data => {
        const acteurs = data.cast.slice(0, 10);
        const castSection = document.getElementById('cast-section');

        acteurs.forEach(actor => {
            const div = document.createElement('div');
            div.innerHTML = `
        <div class="cast-card">
            <img src="https://image.tmdb.org/t/p/w300${actor.profile_path}" alt="${actor.name}">
            <div>
                <h5>${actor.name}</h5>
                <p>${actor.character}</p>
            </div>
        </div>
    `;
            castSection.appendChild(div);
        });
    })
    .catch(err =>
        console.log("Erreur: ", err));