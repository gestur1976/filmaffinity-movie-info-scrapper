const HTMLParser = require('node-html-parser');
const axios = require('axios');
const fs = require('fs');
class Pelicula {
    constructor(link) {
        this.link = link;
    }
}

module.exports = {
    procesar: function(link, ranking, callback) {
        axios.get(link).then(function(resp) {
            const document = HTMLParser.parse(resp.data);
            let pelicula = new Pelicula(link);
            show_akas = document.querySelector('.show-akas');
            if (show_akas) show_akas.remove();
            akas = document.querySelectorAll('.akas');
            akas.forEach(function(aka) {
                aka.remove();
            })
            pelicula.ranking = ranking;
            pelicula.rating = ((document.querySelector('div#movie-rat-avg') || '').rawAttributes || '').content || 0.0;
            pelicula.title = ((document.querySelector('dl.movie-info > dd:nth-child(2)') || '').innerText || '').trim();
            pelicula.year = ((document.querySelector("dl.movie-info > dd:nth-child(4)") || '').innerText || '').trim();
            const isduration = ((document.querySelector("dl.movie-info > dd:nth-child(6)") || '').rawAttributes || '').itemprop == "duration";
            pelicula.duration = isduration ? pelicula.duration = ((document.querySelector("dl.movie-info > dd:nth-child(6)") || '').innerText || '').trim() : pelicula.duration = ((document.querySelector("dl.movie-info > dd:nth-child(8)") || '').innerText || '').trim();
            pelicula.country_flag = (((document.querySelector(".movie-info span#country-img > img") || '').rawAttributes || '').src || '').trim();
            pelicula.country = (((document.querySelector(".movie-info span#country-img > img") || '').rawAttributes || '').alt || '').trim();
            pelicula.directors = Array.from((document.querySelectorAll(".movie-info .directors .credits .nb a") || {}), director => (director.innerText || '').trim());
            pelicula.writers = Array.from((document.querySelectorAll("dl.movie-info > dd:nth-child(12) span.nb > span" || {})), writer => (writer.innerText || '').trim());
            pelicula.music = Array.from((document.querySelectorAll("dl.movie-info > dd:nth-child(14) span.nb > span" || {})), music => music.innerText.trim());
            pelicula.cast = Array.from((document.querySelectorAll(".movie-info .card-cast a") || {}), acted => acted.innerText.trim());
            pelicula.genres = Array.from((document.querySelectorAll(".movie-info .card-genres a") || {}), genre => genre.innerText.trim());
            let issummary = ((document.querySelector('dl.movie-info > dd:nth-child(27)') || '').rawAttributes || '').itemprop == 'description';
            pelicula.summary = issummary ? ((document.querySelector('dl.movie-info > dd:nth-child(27)') || '').innerText || '').trim() : ((document.querySelector('dl.movie-info > dd:nth-child(25)') || '').innerText || '').trim();
            pelicula.picture = [((document.querySelector('a.lightbox') || '').rawAttributes || '').href];
            callback(pelicula);
        });
    }
};