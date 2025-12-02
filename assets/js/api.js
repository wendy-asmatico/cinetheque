const API_KEY = "8c0a3cc71756d00434f9328dbd83bc85"; // remplace par ta vraie clé
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w300"; // pour les affiches


async function fetchFromTMDB(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur TMDB : " + response.status);
    }
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchDetailFromTMDB(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) {
      throw new Error("Erreur TMDB : " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}




