"use strict";

// Configuration des URLs d'images
const CONFIG = {
    BASE_IMG_URL: 'https://image.tmdb.org/t/p/',
    POSTER_SIZE: 'w500',
};


// Appeler les JSON pour remplir les sections dynamiquement    

// TODO :  id / title / vote_average / relese_date / poster_path / backdrop_path

// Carouselle des sorties de la semaine

const URL =  `./json/data.json`;


fetch(URL)
    .then(result => {
        if (!result.ok) throw new Error("oups, erreur initialisataion details.json");
        return result.json();
    })
    .then(movie => {
        console.log(movie);

        // recupération des éléments html

        let fondCarou = document.getElementById('backgroundCarou');
        let affiche = document.getElementById('posterSortie');
        let titre = document.getElementById('titreS');
        let dateS = document.getElementById('release-date');
        let note = document.getElementById('idSortieRating');


        // remplisage carousel 01
        fondCarou.src = CONFIG.BASE_IMG_URL + 'original' + movie.results[0].backdrop_path;
        affiche.src = CONFIG.BASE_IMG_URL + CONFIG.POSTER_SIZE + movie.results[0].poster_path;
        titre.innerText = movie.results[0].title;
        dateS.innerText = formatDate(movie.results[0].release_date);
        note.innerText = movie.results[0].vote_average;

        // Remplir les deux autres carousels.
        let carouSuite = document.querySelector('.carousel-inner');

        carouSuite.innerHTML += `
        <div class="carousel-item c-item" data-bs-interval="2000">
            <img src="${CONFIG.BASE_IMG_URL}original${movie.results[1].backdrop_path}" class="d-block w-100 c-img" alt="${movie.results[1].title}">
            <div class="carousel-caption d-none d-md-block">    
                <div class="container container_sortie" id="sortie-section">
                    <img src="${CONFIG.BASE_IMG_URL}${CONFIG.POSTER_SIZE}${movie.results[1].poster_path}"
                            id="posterSortie" alt="Affiche de ${movie.results[1].title}">
                    <div class="sortie-info">
                        <h2 id="titreS">${movie.results[1].title}</h2>  
                        <p><strong>Date de sortie :</strong> <span id="release-date">
                            ${formatDate(movie.results[1].release_date)}</span></p>
                        <p class="sortieRating">⭐ <span id="idSortieRating">
                            ${movie.results[1].vote_average.toFixed(1)}</span> / 10</p>
                    </div>
                </div>
            </div>
        </div>
        `;


        // for (let i = 1; i < 3; i++) { // 2  films Suivant.
        //     const film = movie.results[i];


    })

    .catch(error => {
        console.error("Erreur lors de la récupération des données :", error);
    });


    // Fonctions utilitaires
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    };

