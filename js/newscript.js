// Configuration des URLs d'images
const CONFIG = {
    BASE_IMG_URL: 'https://image.tmdb.org/t/p/',
    POSTER_SIZE: 'w500',
    BACKDROP_SIZE: 'original'
};

// Sélecteurs DOM
const DOM = {
    carousel: {
        inner: document.getElementsByClassName('carousel-inner')[0],
        indicators: document.getElementsByClassName('carousel-indicators')[0]
    },
    sortieSection: {
        poster: document.getElementById('posterSortie'),
        titre: document.getElementById('titreS'),
        date: document.getElementById('release-date'),
        overview: document.getElementById('overview'),
        rating: document.getElementById('idSortieRating'),
        genres: document.getElementById('Sortie_genres')
    },
    filmCards: document.getElementsByClassName('film-cards-container')[0]
};

// Fonctions utilitaires
const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
};

const createImageUrl = (path, size) => {
    if (!path) return 'img/placeholder.jpg';
    return `${CONFIG.BASE_IMG_URL}${size}${path}`;
};

// Génération du carousel
const generateCarouselItem = (movie, index) => {
    const isActive = index === 0 ? 'active' : '';
    const item = `
        <div class="carousel-item ${isActive} c-item" data-bs-interval="1000">
            <img src="${createImageUrl(movie.backdrop_path, CONFIG.BACKDROP_SIZE)}" 
                 class="d-block w-100 c-img" alt="${movie.title}">
            <div class="carousel-caption d-none d-md-block">
                <div class="container container_sortie" id="sortie-section">
                    <img src="${createImageUrl(movie.poster_path, CONFIG.POSTER_SIZE)}" 
                         id="posterSortie" alt="Affiche de ${movie.title}">
                    <div class="sortie-info">
                        <h2 id="titreS">${movie.title}</h2>
                        <div id="Sortie_genres" class="myS-2">
                            ${movie.genres.map(genre => 
                                `<span class="genre-tag">${genre}</span>`
                            ).join('')}
                        </div>
                        <p><strong>Date de sortie :</strong> <span id="release-date">
                            ${formatDate(movie.release_date)}</span></p>
                        <p id="overview" class="mtS-3">${movie.overview}</p>
                        <p class="sortieRating">⭐ <span id="idSortieRating">
                            ${movie.vote_average.toFixed(1)}</span> / 10</p>
                    </div>
                </div>
            </div>
        </div>`;
    
    // Ajouter l'indicateur
    DOM.carousel.indicators.innerHTML += `
        <button type="button" data-bs-target="#carouSortiSemaine" 
                data-bs-slide-to="${index}" 
                ${index === 0 ? 'class="active" aria-current="true"' : ''} 
                aria-label="Slide ${index + 1}"></button>`;
    
    return item;
};

// Génération des cartes de films
const generateMovieCard = (movie) => {
    return `
        <div class="film-card">
            <img src="${createImageUrl(movie.poster_path, CONFIG.POSTER_SIZE)}" 
                 class="film-poster" alt="Poster de ${movie.title}">
            <div class="film-info">
                <h3 class="film-title">${movie.title}</h3>
                <p class="film-date">Date de sortie : 
                    <span>${formatDate(movie.release_date)}</span></p>
                <p class="film-rating">⭐ <span>${movie.vote_average.toFixed(1)}</span>/10</p>
            </div>
        </div>`;
};

// Chargement et initialisation
const URL = './json/data.json';

fetch(URL)
    .then(result => {
        if (!result.ok) throw new Error("Erreur lors de l'initialisation de data.json");
        return result.json();
    })
    .then(data => {
        // Générer le carousel avec les sorties de la semaine
        if (data.sorties && data.sorties.length > 0) {
            DOM.carousel.inner.innerHTML = data.sorties
                .map((movie, index) => generateCarouselItem(movie, index))
                .join('');
        }

        // Générer les cartes de films d'animation
        if (data.animation && data.animation.length > 0) {
            DOM.filmCards.innerHTML = data.animation
                .map(movie => generateMovieCard(movie))
                .join('');
        }
    })
    .catch(error => {
        console.error("Erreur lors du chargement du fichier JSON :", error);
        // Afficher un message d'erreur à l'utilisateur
        document.body.innerHTML += `
            <div class="alert alert-danger" role="alert">
                Une erreur est survenue lors du chargement des données. 
                Veuillez réessayer plus tard.
            </div>`;
    });