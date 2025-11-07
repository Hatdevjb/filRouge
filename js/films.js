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

    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            currentData = data.results;   // sauvegarde pour le bouton "Afficher plus"
            filmsAffiches = 10;           
            afficherListe(currentData.slice(0, filmsAffiches));
            ajouterBoutonPlus();
        })
        .catch(err => console.error(err));
}

// ------------------ AFFICHER UNE LISTE DE FILMS ------------------
function afficherListe(films) {
    container.innerHTML = '';
    films.forEach(film => {
        const div = document.createElement('div');
        div.className = 'film-card';
        div.innerHTML = `
            <img src="${film.poster_path ? 'https://image.tmdb.org/t/p/w500' + film.poster_path : 'default-poster.jpg'}" alt="${film.title}">
            <h3>${film.title}</h3>
            <p>Date : ${formatDate(film.release_date)}</p>
            <p>⭐ Note : ${film.vote_average || 'N/A'} / 10</p>
        `;
        div.onclick = () => window.location.href = `detaileFilm.html?id=${film.id}`;
        container.appendChild(div);
    });
}

// ------------------ BOUTON AFFICHER PLUS ------------------
function ajouterBoutonPlus() {
    let btn = document.getElementById('btn-plus');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'btn-plus';
        btn.textContent = 'Afficher plus...';
        btn.className = 'btn-plus';
        container.after(btn);
    }

    btn.style.display = currentData.length > filmsAffiches ? 'block' : 'none';

    btn.onclick = () => {
        filmsAffiches += 10;
        afficherListe(currentData.slice(0, filmsAffiches));
        if (filmsAffiches >= currentData.length) btn.style.display = 'none';
    };
}

// ------------------ CLIC SUR CATEGORIES ------------------
document.querySelectorAll('.conteneurCategories div').forEach(item => {
    item.addEventListener('click', () => afficherFilm(item.id));
});

// ------------------ AFFICHAGE INITIAL ------------------
afficherFilm('popular');

// ------------------ PARTIE POUR LA BARRE DE RECHERCHE ------------------
const searchBar = document.querySelector('.search-bar');
const searchInput = document.getElementById('search-input');
const suggestions = document.getElementById('suggestions');

searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    if (!query) {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        return;
    }

    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fr-FR`, options)
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
                    <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w92' + movie.poster_path : 'default-poster.jpg'}" 
                         alt="${movie.title}" style="width:40px;height:60px;object-fit:cover;border-radius:4px;">
                    <span>${movie.title}</span>
                `;
                div.onclick = () => {
                    searchInput.value = movie.title;
                    suggestions.innerHTML = '';
                    suggestions.style.display = 'none';
                    window.location.href = `detaileFilm.html?id=${movie.id}`;
                };
                suggestions.appendChild(div);
            });
            suggestions.style.display = 'block';
            suggestions.style.width = searchBar.offsetWidth + 'px';
        })
        .catch(err => console.error(err));
});

document.addEventListener('click', e => {
    if (!searchBar.contains(e.target)) {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
    }
});
