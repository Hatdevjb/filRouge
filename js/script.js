"use script"
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NWE0YjQwNzJkOWFlOWNjOWNhNzQ2ZDk5YTg1OWY0ZiIsIm5iZiI6MTc2MjMzNzg2Mi40OTIsInN1YiI6IjY5MGIyNDQ2M2Q5MTY5ZTRjMmY2Y2VkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IdTPk-ScEmyEjOU715JAGDAzs9mLP-ZgoVijOH61IGk'
  }
};

let idMovie= 507244;

// const URLcredits = ('https://api.themoviedb.org/3/movie/movie_id/credits?language=en-US', options);
// const URLdetails = ('https://api.themoviedb.org/3/movie/movie_id?language=en-US', options);


//------------------------CONTENEUR PRINCIPAL---------------

fetch(`https://api.themoviedb.org/3/movie/${idMovie}?language=fr-FR`, options)
    .then(result => {
        if (!result.ok) throw new Error("oups, erreur initialisataion details.json");
        return result.json();
    })
    .then(movie => {
        //RECUPERATION ELEMENT HTML
        
        //let idMovie= document.getElementById('');  A FAIRE PLUS TARD POUR RECUPERER ID DANS HTML
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


fetch(`https://api.themoviedb.org/3/movie/${idMovie}/credits?language=fr-FR`, options)
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