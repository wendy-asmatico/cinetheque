async function afficherSeriesPopulaires() {
  const serie_populaire = await fetchFromTMDB("/tv/popular");
  const container = document.getElementById('series-container');

  container.innerHTML = "";

  serie_populaire.forEach(serie => {
    container.innerHTML += `
      <div class="carousel-item">
        <div class="card w-48 bg-base-100 shadow-md">
          <figure>
            <img src="${IMG_URL + serie.poster_path}" alt="${serie.name}">
          </figure>
          <div class="card-body p-3">
            <h3 class="text-sm font-bold">${serie.name}</h3>
            <div class="card-actions justify-end">
              <button onclick="openDetail('tv', ${serie.id})" class="btn btn-primary btn-xs"> Voir détail </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}



async function afficherfilmpopulaire() {
  const film_populaire = await fetchFromTMDB("/movie/popular");
  const container_film = document.getElementById('films-container');

  container_film.innerHTML = "";

  film_populaire.forEach(film => {
    container_film.innerHTML += `
      <div class="carousel-item">
        <div class="card w-48 bg-base-100 shadow-md">
          <figure>
            <img src="${IMG_URL + film.poster_path}" alt="${film.title}">
          </figure>
          <div class="card-body p-3">
            <h3 class="text-sm font-bold">${film.title}</h3>
            <div class="card-actions justify-end">
              <button onclick="openDetail('movie', ${film.id})" class="btn btn-primary btn-xs"> Voir détail </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}
async function dernierajoutMix() {
  const films = await fetchFromTMDB("/movie/now_playing");
  const series = await fetchFromTMDB("/tv/on_the_air");

  const derniers = [...films.slice(0,5), ...series.slice(0,5)];
  
  const container = document.getElementById('ajout-container');
  container.innerHTML = "";

  derniers.forEach(item => {
    const isMovie = item.title !== undefined;
    const name = isMovie ? item.title : item.name;
    const type = isMovie ? "movie" : "tv";

    container.innerHTML += `
      <div class="carousel-item w-44">
        <div class="card bg-base-100 shadow-md">
          <figure>
            <img src="${IMG_URL + item.poster_path}" class="w-full object-cover" alt="${name}">
          </figure>
          <div class="card-body p-3">
            <h3 class="text-sm font-bold line-clamp-2">${name}</h3>
            <div class="card-actions justify-end mt-2">
<button onclick="openDetail('${type}', ${item.id})" class="btn btn-primary btn-xs">
  Voir détail
</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

async function openDetail(type, id) {
  const data = await fetchDetailFromTMDB(`/${type}/${id}`);
  if (!data) return;

  document.getElementById("modal-title").innerText = data.title || data.name;

  const container = document.getElementById("detail-content");

  container.innerHTML = `
    <div class="flex flex-col md:flex-row gap-4">
      <img src="${IMG_URL + data.poster_path}" class="w-48 rounded" />

      <div>
        <p><strong>Date :</strong> ${data.release_date || data.first_air_date}</p>
        <p><strong>Note :</strong> ${data.vote_average}/10</p>
        <p class="mt-2">${data.overview}</p>
      </div>
    </div>
  `;

  document.getElementById("modal-detail").checked = true;
}


afficherSeriesPopulaires();
afficherfilmpopulaire();
dernierajoutMix();

