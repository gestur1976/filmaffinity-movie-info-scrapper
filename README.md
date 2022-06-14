# filmaffinity-movie-info-scrapper

A Node.js program to retrieve movie details from filmaffinity movie pages or movie lists and export them in json format.

  Usage: node index.js [--list|--movie] <url> <output.json> <cover-images-folder>

#Examples
   
  node index.js --list https://www.filmaffinity.com/es/listtopmovies.php?list_id=508 movies.json img/
  
  This will create movies.json file containing an array of all movies of the list and its details, and it 
  will also download the cover image inside img/ folder with the same file name as the one referenced in the json file.
  
  node index.js --movie https://www.filmaffinity.com/es/film309023.html movie.json img/
  
  The same but only for a specific movie. It will also return a json file with an array of an unique element (the movie)
  and it will download its cover image inside the images folder
