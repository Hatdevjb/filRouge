"use strict";

//------------------------ FETCH OPTIONS --------------- (pour clef api)
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDhhMTFiN2ExOWRkNjlmYzY2MmMxNjRhNDc3NDRiYSIsIm5iZiI6MTc2MjM0OTkxNy42NjMsInN1YiI6IjY5MGI1MzVkNzU1ZjVlYzAwYzA3MGZhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jrqifYSqq5Tl_4F9xEIEW8gx2nSFDocGxlJdvNahipE'
    }
    };


//----------PARTIE POUR LA BARRE DE RECHERCHE------------

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

// ------------------------------------ INDEX(JBI Stream)-----------------------------  

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
                <div class="carousel-caption d-md-block">    
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

    // GESTION CARTE DES AUTRES FILMS
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
                    </a>
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

//------------------------ DETAILS FILM---------------------------------------


    function getMovieDetails(idMovie) {

        //Appel de l'API pour l'obtention des details complet d'un film 
    fetch(`https://api.themoviedb.org/3/movie/${idMovie}?language=fr-FR`, options)
        .then(result => {
        if (!result.ok) throw new Error("Erreur initialisation details.json");
        return result.json();
        })
        .then(movie => {
        // RÉCUPÉRATION DES ÉLÉMENTS HTML
        let title1 = document.getElementById('title'); // le titre 
        let poster1 = document.getElementById('poster'); // l'image du poster
        let overview1 = document.getElementById('overview'); // Resumé du film
        let releaseDate1 = document.getElementById('release-date');// La date de sortie
        let runtime1 = document.getElementById('runtime'); //la durée du film
        let rating1 = document.getElementById('rating'); // La note du film
        let tagline1 = document.getElementById('tagline'); //la tagline du film (ou phrase d'accroche)
        let movieSection1 = document.getElementById('movie-section'); // la section concernant la description du film
        let genresDiv1 = document.getElementById('genres'); // le(s) genre(s) du film

        // REMPLISSAGE INFOS FILM 

        //titre du film 
        title1.textContent = movie.title;

        //generation de l'affiche du film (poster)
        poster1.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "default-poster.jpg";

        //generation du background pour le film 
        movieSection1.style.backgroundImage = movie.backdrop_path
            ? `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`
            : "none";
        //generation du resumé du film
        overview1.textContent = movie.overview;

        //generation de la date de sortie 
        releaseDate1.textContent = formatDate(movie.release_date)|| "Date inconnue";
        runtime1.textContent = movie.runtime ? `${movie.runtime} min` : "Durée inconnue"; //duree de film en min 
        rating1.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"; //note moyenne arrondi à 1 chiffre
        tagline1.textContent = movie.tagline || ""; // la phrase d'accroche du film

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

    // ------------------ RÉCUPÉRATION DU CASTING ET DE L’ÉQUIPE ------------------
    function getMovieCredits(idMovie) {
    // Appel de l'API  pour les credits du film 
    fetch(`https://api.themoviedb.org/3/movie/${idMovie}/credits?language=fr-FR`, options)
        .then(results => {
            //on verifie si la requete est bien passée
        if (!results.ok) throw new Error("Erreur credits.json");
        return results.json();
        })
        .then(data => { // CREATION DIVRÉALISATEUR ET SCÉNARISTE
        const realisateurs = data.crew.find(person => person.job === "Director"); //   on recherche le realisateur 
        const directeur = data.crew.find(person => person.job ==="Writer"); //  on recherche le scenariste 

        //On recuperer les elements html, pour y inserer par la suite les info de l'equipe
        const ratingP = document.querySelector('.rating'); 
        let divCrew = document.getElementById('crew-info');
        
        //creation du bloc si il n'existe pas 
        if (!divCrew){
            divCrew = document.createElement('div');
            divCrew.id = 'crew-info';
            divCrew.style.marginBottom = '15px';
            //on y insere le bloc avant la note
            ratingP.parentNode.insertBefore(divCrew, ratingP);

        }
        divCrew.innerHTML = ''; //evite les doublons 
        
        //on ajoute le realisateur
        if (realisateurs) {
            const textRealisateur  = document.createElement('p');
            textRealisateur.textContent = `Réalisateur : ${realisateurs.name}`;
            divCrew.appendChild(textRealisateur);
        }

        //on ajoute le scenariste
        if (directeur) {
            const textDirecteur = document.createElement('p');
            textDirecteur.textContent = `Scénariste : ${directeur.name}`;
            divCrew.appendChild(textDirecteur);
        }

        const acteurs = data.cast.slice(0, 10);//on slectionne 10 acteurs 
        //on recuperer l'element HTML où on affichera les acteurs 
        const castSection = document.getElementById('cast-section');

        castSection.innerHTML = ""; //avant la reinsertion, on vide 

        //creation de la boucle pour chaque acteurs generés (on les affichera sous forme de cartes)
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

// ------------------------------------ Fonctions Utilitaires ------------------------------------

    // Formater une date au format français    
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    };


//----------GESTION MODE HORS LIGNE ET MAINTENANCE---------
    window.addEventListener("offline", () => {
    window.location.href = "horsligne.html";
    });

    window.addEventListener("load", () => {
    const reparation = false; // Mettre à true pour activer la page de maintenance si nécessaire
    if (reparation) {
        window.location.href = "reparation.html";
    } else {
        console.log("Site opérationnel");
    }
    });



