const HTMLParser = require('node-html-parser');
const axios = require('axios');
const fs = require('fs');
const pelicula = require('moviedataextractor');
const { Console } = require('console');
const { listeners } = require('process');

var peticiones_pendientes = 0;
var peliculas = [];

function finalizado() {
    if (peticiones_pendientes > 0) {
        setTimeout(finalizado, 5000);
    } else {
        fs.writeFileSync(archivo_salida, JSON.stringify(peliculas));
    }
}

if (process.argv.length < 6) {
    console.log("Usage: node index.js [--list|--movie] <url> <output.json> <output image folder>")
    return;
}

const url_pelis = process.argv[3];
const archivo_salida = process.argv[4];
const ruta_imagenes = process.argv[5] + '/';

if (!process.argv[2].localeCompare('--list')) {


    if (fs.existsSync(archivo_salida)) {
        fs.unlinkSync(archivo_salida);
    }

    axios.get(url_pelis).then(function(resp) {
            const Document = HTMLParser.parse(resp.data);
            links = Array.from(Document.querySelectorAll("div.mc-title > a"), link => link.rawAttributes.href);

            setTimeout(finalizado, links.length * 500 + 5000);
            links.forEach(link => {
                let ranking = links.indexOf(link) + 1;
                peticiones_pendientes++;

                setTimeout(pelicula.procesar, ranking * 500, link, ranking, function(pelicula) {
                    const url_imagen = pelicula.picture.length ? pelicula.picture[0] : null;
                    const url_flag = pelicula.country_flag;
                    const nombreArchivo = /[^/]+$/.exec(url_imagen);
                    const rutaBandera = /[^/]+$/.exec(url_flag);
                    const nombreBandera = rutaBandera.length ? rutaBandera[0] : '';

                    pelicula.picture = nombreArchivo;
                    pelicula.country_flag = nombreBandera;
                    peliculas.push(pelicula);

                    if (url_imagen) {
                        peticiones_pendientes++;
                        axios.get(url_imagen, {
                            responseType: 'arraybuffer'
                        }).then(function(resp) {
                            console.log("Downloading " + url_imagen + " to " + ruta_imagenes + nombreArchivo);
                            fs.writeFileSync(ruta_imagenes + nombreArchivo, resp.data);
                            peticiones_pendientes--;
                        }).catch(function(err) {
                            console.log(err);
                        }).then(function() {});
                    }
                    peticiones_pendientes--;
                });
            });
        })
        .catch(function(err) {
            console.log(err);
        }).then(function() {});
} else if (!process.argv[2].localeCompare('--movie')) {
    const ranking = 1;
    const link = process.argv[3].toString();
    peticiones_pendientes++;
    pelicula.procesar(link, ranking, function(pelicula) {
        const url_imagen = pelicula.picture.length ? pelicula.picture[0] : null;
        const url_flag = pelicula.country_flag;
        const nombreArchivo = /[^/]+$/.exec(url_imagen);
        const rutaBandera = /[^/]+$/.exec(url_flag);
        const nombreBandera = rutaBandera.length ? rutaBandera[0] : '';

        pelicula.picture = nombreArchivo;
        pelicula.country_flag = nombreBandera;
        peliculas.push(pelicula);

        if (url_imagen) {
            peticiones_pendientes++;
            axios.get(url_imagen, {
                responseType: 'arraybuffer'
            }).then(function(resp) {
                console.log("Downloading " + url_imagen + " to " + ruta_imagenes + nombreArchivo);
                fs.writeFileSync(ruta_imagenes + nombreArchivo, resp.data);
                peticiones_pendientes--;
            }).catch(function(err) {
                console.log(err);
            }).then(function() {});
        }
        peticiones_pendientes--;
    });
}