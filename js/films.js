"use strict";

//------------------------ FETCH OPTIONS ---------------
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDhhMTFiN2ExOWRkNjlmYzY2MmMxNjRhNDc3NDRiYSIsIm5iZiI6MTc2MjM0OTkxNy42NjMsInN1YiI6IjY5MGI1MzVkNzU1ZjVlYzAwYzA3MGZhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jrqifYSqq5Tl_4F9xEIEW8gx2nSFDocGxlJdvNahipE'
    }
};

// RECUPERATION ELEMENT HTML 
const container = document.getElementById('films-container');

// ------------AFFICHER LES FILMS---------
function afficherFilm(categorie) {
  fetch(`https://api.themoviedb.org/3/movie/${categorie}?language=fr-FR&page=1`, options)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = '';
      data.results.forEach(film => {
        const div = document.createElement('div');
        div.className = 'film-card';
        div.innerHTML = `
          <img src="${film.poster_path ? 'https://image.tmdb.org/t/p/w500' + film.poster_path : 'default-poster.jpg'}" alt="${film.title}">
          <h3>${film.title}</h3>
          <p>Date : ${formatDate(film.release_date)}</p>
          <p>Note : ${film.vote_average || 'N/A'}</p>
        `;
        div.onclick = () => window.location.href = `detaileFilm.html?id=${film.id}`;
        container.appendChild(div);
      });
    });
}

// Affichage initial
afficherFilm('popular');

// Clic sur catégories
document.querySelectorAll('.conteneurCategories div').forEach(item =>
  item.addEventListener('click', () => afficherFilm(item.id))
);

 // Formater une date au format français    
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    };