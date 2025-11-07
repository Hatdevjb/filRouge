"use strict";

// Appeler les JSON pour remplir les sections dynamiquement    

// Déclaration des Constantes

    // Configuration des URLs d'images
    const CONFIG = {
        BASE_IMG_URL: 'https://image.tmdb.org/t/p/',
        POSTER_SIZE: 'w500',
    };

    // Code pour API_TMDB
    const VOTRE_CLE = '4f7d446c4d28ed77919842eb8153bbd0';

    // URL TMDB - films de la semaine
    const URL_FILM_SEMAINE =  `https://api.themoviedb.org/3/movie/now_playing?api_key=${VOTRE_CLE}&language=fr-FR&region=FR`;
    
    // URL TMDB - autres films
 
    const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${VOTRE_CLE}&language=fr-FR&region=FR`;

    // GESTION CAROUSEL SORTIES DE LA SEMAINE
    fetch(URL_FILM_SEMAINE)
        .then(result => {
            if (!result.ok) throw new Error("oups, erreur carouselle initialisataion details.json");
            return result.json();
        })
        .then(movie => {
            console.log(movie);

            // recupération des éléments html
            
            let fondCarou = document.getElementById('backgroundCarou');
            let affiche = document.getElementById('posterSortie');
            let lienId = document.getElementById('lienPosterC1');
            let titre = document.getElementById('titreS');
            let dateS = document.getElementById('release-date');
            let note = document.getElementById('idSortieRating');


            // remplisage carousel 01
            fondCarou.src = CONFIG.BASE_IMG_URL + 'original' + movie.results[0].backdrop_path;
            affiche.src = CONFIG.BASE_IMG_URL + CONFIG.POSTER_SIZE + movie.results[0].poster_path;
            titre.innerText = movie.results[0].title;
            dateS.innerText = formatDate(movie.results[0].release_date);
            note.innerText = (movie.results[0].vote_average).toFixed(1);   
            lienId.href = `detaileFilm.html?id=${movie.results[0].id}`;

            // Remplir les deux autres carousels.

            for (let i = 1; i < 3; i++) {       // 2  films Suivant.
            const FILM = movie.results[i];
            let carouSuite = document.querySelector('.carousel-inner');

            carouSuite.innerHTML += `
            <div class="carousel-item c-item" data-bs-interval="5000">
                <img src="${CONFIG.BASE_IMG_URL}original${FILM.backdrop_path}" class="d-block w-100 c-img" alt="${FILM.title}">
                <div class="carousel-caption d-none d-md-block">    
                    <div class="container container_sortie" id="sortie-section">
                        <a href="detaileFilm.html?id=${FILM.id}" id="lienPosterC${i+1}"> 
                        <img src="${CONFIG.BASE_IMG_URL}${CONFIG.POSTER_SIZE}${FILM.poster_path}"id="posterSortie" alt="Affiche de ${FILM.title}">
                        </a>
                        <div class="sortie-info">
                            <h2 id="titreS">${FILM.title}</h2>  
                            <p><strong>Date de sortie :</strong> <span id="release-date">
                                ${formatDate(FILM.release_date)}</span></p>
                            <p class="sortieRating">⭐ <span id="idSortieRating">
                                ${FILM.vote_average.toFixed(1)}</span> / 10</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            }


        })

        .catch(error => {
            console.error("Erreur lors de la récupération des données du carouselles :", error);
        });

    // GESTION CARTE ANIMES
    fetch(URL)
        .then(result => {
            if (!result.ok) throw new Error("oups, erreur cartes initialisataion details.json");
            return result.json();
        })
        .then(movie => {
            console.log(movie);

            for (let i = 0; i < 12; i++) {       // 12 films Suivant.
            const FILM = movie.results[i];
            let carteGenre = document.querySelector('.film-cards-container');

            carteGenre.innerHTML += ` <div class="film-card">
                    <a href="detaileFilm.html?id=${FILM.id}" id="lienCartePlusdeFilms${i+1}">
                    <img src="${CONFIG.BASE_IMG_URL}${CONFIG.POSTER_SIZE}${FILM.poster_path}" class="film-poster" alt="Poster de ${FILM.title}">
                    <div class="film-info">
                        <h3 class="film-title">${FILM.title}</h3>
                        <p class="film-date">Date de sortie : <span>${formatDate(FILM.release_date)}</span></p>
                        <p class="film-rating">⭐ <span>${FILM.vote_average.toFixed(1)}</span>/10</p>
                    </div>
                </div>`;
        
            }

        })

        .catch(error => {
            console.error("Erreur lors de la récupération des données du cartes :", error);
        });





// ------------------------------------ Fonctions Utilitaires ------------------------------------

    // Formater une date au format français    
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    };

