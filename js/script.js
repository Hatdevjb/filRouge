"use strict";


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

    })
    .catch(error => {
        console.error("Erreur lors du chargement du fichier JSON :", error);
    });