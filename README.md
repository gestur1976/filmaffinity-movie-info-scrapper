# filmaffinity-movie-info-scrapper

A Node.js program to retrieve movie details from filmaffinity movie pages or movie lists and export them in json format.

  Usage: node index.js [--list|--movie] <url> <output.json> <cover-images-folder>

# Examples
   
  node index.js --list https://www.filmaffinity.com/es/listtopmovies.php?list_id=508 movies.json img/
  
  This will create movies.json file containing an array of all movies of the list and its details, and it 
  will also download all cover images inside img/ folder with the same file names as the ones referenced in the json file.
  
  node index.js --movie https://www.filmaffinity.com/es/film309023.html movie.json img/
  
  The same but only for a specific movie. It will also return a json file with an array of an unique element (the movie)
  and it will download its cover image inside the images folder.

# Installation
  
  git clone https://github.com/gestur1976/filmaffinity-movie-info-scrapper.git
  
  cd filmaffinity-movie-info-scrapper
  
  yarn install
  
# Limitations

  It's been developed based on spanish version of FilmAffinity, but it seems to work for all languages I've tested.
