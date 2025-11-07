"use strict";

//------------------------ FETCH OPTIONS ---------------
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDhhMTFiN2ExOWRkNjlmYzY2MmMxNjRhNDc3NDRiYSIsIm5iZiI6MTc2MjM0OTkxNy42NjMsInN1YiI6IjY5MGI1MzVkNzU1ZjVlYzAwYzA3MGZhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jrqifYSqq5Tl_4F9xEIEW8gx2nSFDocGxlJdvNahipE'
  }
};


//------------------------ DETAILS FILM ---------------
function getMovieDetails(idMovie) {
  fetch(`https://api.themoviedb.org/3/movie/${idMovie}?language=fr-FR`, options)
    .then(result => {
      if (!result.ok) throw new Error("Erreur initialisation details.json");
      return result.json();
    })
    .then(movie => {
      // RÉCUPÉRATION DES ÉLÉMENTS HTML
      let title1 = document.getElementById('title');
      let poster1 = document.getElementById('poster');
      let overview1 = document.getElementById('overview');
      let releaseDate1 = document.getElementById('release-date');
      let runtime1 = document.getElementById('runtime');
      let rating1 = document.getElementById('rating');
      let tagline1 = document.getElementById('tagline');
      let movieSection1 = document.getElementById('movie-section');
      let genresDiv1 = document.getElementById('genres');

      // REMPLISSAGE INFOS FILM 
      title1.textContent = movie.title;
      poster1.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "default-poster.jpg";
      movieSection1.style.backgroundImage = movie.backdrop_path
        ? `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`
        : "none";
      overview1.textContent = movie.overview;
      releaseDate1.textContent = formatDate(movie.release_date)|| "Date inconnue";
      runtime1.textContent = movie.runtime ? `${movie.runtime} min` : "Durée inconnue";
      rating1.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
      tagline1.textContent = movie.tagline || "";

      // GENRES
      genresDiv1.innerHTML = "";
      movie.genres.forEach(genre => {
        let span = document.createElement('span');
        span.textContent = genre.name;
        genresDiv1.appendChild(span);
      });
    })
    .catch(error => console.log("Erreur fetch détails :", error));
}

function getMovieCredits(idMovie) {
  fetch(`https://api.themoviedb.org/3/movie/${idMovie}/credits?language=fr-FR`, options)
    .then(results => {
      if (!results.ok) throw new Error("Erreur credits.json");
      return results.json();
    })
    .then(data => { // CREATION DIVRÉALISATEUR ET SCÉNARISTE
      const realisateurs = data.crew.find(person => person.job === "Director");
      const directeur = data.crew.find(person => person.job ==="Writer");

      const ratingP = document.querySelector('.rating');
      let divCrew = document.getElementById('crew-info');

      if (!divCrew){
        divCrew = document.createElement('div');
        divCrew.id = 'crew-info';
        divCrew.style.marginBottom = '15px';
        ratingP.parentNode.insertBefore(divCrew, ratingP);

      }
      divCrew.innerHTML = '';
      
      if (realisateurs) {
        const textRealisateur  = document.createElement('p');
        textRealisateur.textContent = `Réalisateur : ${realisateurs.name}`;
        divCrew.appendChild(textRealisateur);
      }

      if (directeur) {
        const textDirecteur = document.createElement('p');
        textDirecteur.textContent = `Scénariste : ${directeur.name}`;
        divCrew.appendChild(textDirecteur);
      }

      const acteurs = data.cast.slice(0, 10);
      const castSection = document.getElementById('cast-section');
      castSection.innerHTML = "";

      acteurs.forEach(actor => {
        const div = document.createElement('div');
        div.innerHTML = `
          <div class="cast-card">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : 'default-profile.jpg'}" alt="${actor.name}">
            <div>
                <h5>${actor.name}</h5>
                <p>${actor.character}</p>
            </div>
          </div>
        `;
        castSection.appendChild(div);
      });
    })
  
    .catch(err => console.log("Erreur acteurs :", err));
}

//----------PARTIE POUR LA BARRE DE RECHERCHE---------
const searchBar = document.querySelector('.search-bar');
const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');

searchInput.addEventListener('input', function() {
  const propos = this.value.trim();
  if (!propos) {
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
    return;
  }

  fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(propos)}&language=fr-FR`, options)
    .then(res => res.json())
    .then(data => {
      suggestions.innerHTML = '';
      const movies = data.results.slice(0, 7);
      if (movies.length === 0) {
        suggestions.style.display = 'none';
        return;
      }

      movies.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('suggestElement');

        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w92${movie.poster_path}" 
               alt="${movie.title}" 
               style="width:40px;height:60px;object-fit:cover;border-radius:4px;">
                <span>${movie.title}</span>
        `;

        div.addEventListener('click', () => {
          searchInput.value = movie.title;
          suggestions.innerHTML = '';
          suggestions.style.display = 'none';
          window.location.href = `detaileFilm.html?id=${movie.id}`;
          getMovieDetails(movie.id);
          getMovieCredits(movie.id);
        });

        suggestions.appendChild(div);
      });

      suggestions.style.display = 'block';
      suggestions.style.width = searchBar.offsetWidth + 'px';
    })
    .catch(err => console.error(err));
});

// Clic en dehors ferme les suggestions
document.addEventListener('click', e => {
  if (!searchBar.contains(e.target)) {
    suggestions.innerHTML = '';
    suggestions.style.display = 'none';
  }
});

//----------RÉCUPÉRATION ID FILM DANS URL + BARRE DE RECHERCHE FONCTIONNEL SUR TOUT LE SITE---------
const paramUrl = new URLSearchParams(window.location.search);
const idFilm = paramUrl.get('id');
if (idFilm) {
  getMovieDetails(idFilm);
  getMovieCredits(idFilm);

}
//----------GESTION MODE HORS LIGNE ET MAINTENANCE---------
window.addEventListener("offline", () => {
  window.location.href = "horsligne.html";
});

window.addEventListener("load", () => {
  const reparation = false;
  if (reparation) {
    window.location.href = "reparation.html";
  } else {
    // AU CHARGEMENT : afficher un film aléatoire
    getRandomMovie();
  }
});

 // Formater une date au format français    
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    };


