"use strict";

//------------------------ FETCH OPTIONS ---------------
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDhhMTFiN2ExOWRkNjlmYzY2MmMxNjRhNDc3NDRiYSIsIm5iZiI6MTc2MjM0OTkxNy42NjMsInN1YiI6IjY5MGI1MzVkNzU1ZjVlYzAwYzA3MGZhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jrqifYSqq5Tl_4F9xEIEW8gx2nSFDocGxlJdvNahipE'
    }
};

// ------------------ VARIABLES ------------------
const container = document.getElementById('films-container');
let currentData = [];      // tous les films de la catégorie
let filmsAffiches = 10;    // nombre de films à afficher initialement

// ------------------ FORMATER LA DATE ------------------
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
};

// ------------------ AFFICHER LES FILMS DANS LE HTML ------------------
function afficherFilm(categorie) {
    let url = `https://api.themoviedb.org/3/movie/${categorie}?language=fr-FR&page=1`;

    // Sorties prochaines (configuration url pour la region FR)
    if (categorie === "upcoming") {
        url = `https://api.themoviedb.org/3/movie/upcoming?language=fr-FR&region=FR&page=1`;
    }

    fetch(url, options) // "options" contient la clé de d'autorisation de l'API.
        .then(res => res.json())
        .then(data => {
            currentData = data.results;   // sauvegarde pour le bouton "Afficher plus"
            filmsAffiches = 10;           //ici, on reinitialise le nombre de films qui sont visibles
            afficherListe(currentData.slice(0, filmsAffiches)); //on appelle la fonction AfficherListe pour generer les 10 films suplementaires
            ajouterBoutonPlus(); //Appelle de la fonction concernant le boutton "ajouter plus"
        })
        .catch(err => console.error(err));
}

// ------------------ AFFICHER UNE LISTE DE FILMS ------------------
function afficherListe(films) {
    container.innerHTML = ''; //on vide dans un premier temps le conteneur
    films.forEach(film => {
        const div = document.createElement('div');//On creer une div pour chaque cartes qu'on va generer
        div.className = 'film-card';    //on nome la div pour faciliter le style css
        div.innerHTML = `
            <img src="${film.poster_path ? 'https://image.tmdb.org/t/p/w500' + film.poster_path : 'default-poster.jpg'}" alt="${film.title}">
            <h3>${film.title}</h3>
            <p>Date : ${formatDate(film.release_date)}</p>
            <p>⭐ Note : ${film.vote_average || 'N/A'} / 10</p>
        `;
        div.onclick = () => window.location.href = `detaileFilm.html?id=${film.id}`; // renvoie vers la page des details du film au clic
        //ajout du film dans le conteneur
        container.appendChild(div);
    });
}

// ------------------ BOUTON AFFICHER PLUS ------------------
function ajouterBoutonPlus() {

    //on recupere l'id du boutton sur l'html 
    let btn = document.getElementById('btn-plus');
    if (!btn) {
        btn = document.createElement('button'); 
        btn.id = 'btn-plus';
        btn.textContent = 'Afficher plus...'; 
        btn.className = 'btn-plus';
        container.after(btn); //on inserer le boutton juste apres la div des cartes 
    }
    // une fois les 10 films generés, on cache le bouton 
    btn.style.display = currentData.length > filmsAffiches ? 'block' : 'none';
    
    // Lorsque l'on clique sur le boutton, on appelle la Fonction afficherListe pour generer les films
    btn.onclick = () => {
        filmsAffiches += 10; 
        afficherListe(currentData.slice(0, filmsAffiches));
        if (filmsAffiches >= currentData.length) btn.style.display = 'none';
    };
}

// ------------------ CLIC SUR CATEGORIES ------------------
document.querySelectorAll('.conteneurCategories div').forEach(item => { //ici, chaque div correspond à  une catégorie que l'on a selectionné (populaires )
    item.addEventListener('click', () => afficherFilm(item.id));
});

// ------------------ AFFICHAGE INITIAL ------------------
//generation de la section "popular" au chargement de la page  
afficherFilm('popular');

// ------------------ PARTIE POUR LA BARRE DE RECHERCHE ------------------
const searchBar = document.querySelector('.search-bar');
const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');

// Ajout d'un evenement qui permet de generer les films a chaque frappe dans la barre
searchInput.addEventListener('input', function() {
    const query = this.value.trim(); //on supprime les espaces
    if (!query) {
        // Quand l'utilisateur efface la recherche , on cache les suggestions
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        return;
    }


    // Appel de L'API TMDB pour la recherche de films 
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fr-FR`, options)
        .then(res => res.json())
        .then(data => {
            suggestions.innerHTML = '';
            const movies = data.results.slice(0, 7); //ici, on limite les resultats à 7 pour le visuel
            if (movies.length === 0) {
                suggestions.style.display = 'none';
                return;
            }

            //Creation d'une div pour les suggestions
            movies.forEach(movie => {
                const div = document.createElement('div');
                div.classList.add('suggestElement');
                div.innerHTML = `
                    <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w92' + movie.poster_path : 'default-poster.jpg'}" 
                         alt="${movie.title}" style="width:40px;height:60px;object-fit:cover;border-radius:4px;">
                    <span>${movie.title}</span>
                `;

                //Quand on clique sur une suggestion, nous sommes redirigé vers la page des details du film qui le correspond
                div.onclick = () => {
                    searchInput.value = movie.title;
                    suggestions.innerHTML = '';
                    suggestions.style.display = 'none';
                    window.location.href = `detaileFilm.html?id=${movie.id}`;
                };
                suggestions.appendChild(div);
            });
            // on affiche la liste des suggestion dans un select 
            suggestions.style.display = 'block';
            suggestions.style.width = searchBar.offsetWidth + 'px';
        })
        .catch(err => console.error(err)); 
});

//--------FERMER LES SUGGESTIONS QUAND ON CLIQUE A L'EXTERIEUR---------
document.addEventListener('click', e => {
    if (!searchBar.contains(e.target)) {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
    }
});
