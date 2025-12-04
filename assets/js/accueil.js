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

function lancerPluieDePopcorn() {
  const container = document.getElementById("popcorn-container");

  for (let i = 0; i < 150; i++) {
    const popcorn = document.createElement("div");
    popcorn.classList.add("popcorn");

    const img = document.createElement("img");
    img.src = "assets/img/popcorn2.png"; // ton image ici
    img.style.width = Math.random() * 30 + 20 + "px";

    popcorn.appendChild(img);

    popcorn.style.left = Math.random() * 100 + "vw";
    popcorn.style.animationDuration = Math.random() * 2 + 2 + "s";

    container.appendChild(popcorn);

    setTimeout(() => {
      popcorn.remove();
    }, 4000);
  }
}

window.addEventListener("load", () => {
  lancerPluieDePopcorn();
  setInterval(lancerPluieDePopcorn, 3000); // toutes les 3 secondes
});

afficherSeriesPopulaires();
afficherfilmpopulaire();
dernierajoutMix();



