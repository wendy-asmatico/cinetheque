
const gridContainer = document.getElementById('series-grid'); 
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumSpan = document.getElementById('current-page-num');

let currentPage = 1;

// Ces deux variables permettent à la pagination de savoir quoi charger
// (Est-ce qu'on change de page sur les films populaires ou sur une recherche ?)
let currentEndpoint = '/tv/popular'; 
let currentQuery = ''; 

async function chargerCatalogue() {
    try {
        const serie = await fetchFromTMDB(currentEndpoint, currentPage, currentQuery);

        afficherSerie(serie); 
        
        pageNumSpan.innerText = currentPage;
        
        if (currentPage === 1) {
            prevBtn.disabled = true; 
        } else {
            prevBtn.disabled = false;
        }
        
        // Remonte en haut de la page
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("Erreur lors du chargement : ", error);
    }
}

function afficherSerie(serie) {
    if (!serie) return; 

    gridContainer.innerHTML = '';

    serie.forEach(series => {
        const imagePath = series.poster_path 
            ? IMG_URL + series.poster_path 
            : 'https://via.placeholder.com/300x450?text=Pas+d+image';

        const cardHTML = `
            <div class="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-200">
                <figure>
                    <img src="${imagePath}" alt="${series.name}" class="w-full h-auto object-cover" />
                </figure>
                <div class="card-body p-4">
                    <h2 class="card-title text-base">
                        ${series.name}
                        <div class="badge badge-secondary text-xs">${series.vote_average.toFixed(1)}</div>
                    </h2>
                    <p class="text-xs text-gray-500 line-clamp-3">${series.overview}</p>
                    <div class="card-actions justify-end mt-2">
                        <button onclick="openDetail('tv', ${series.id})" class="btn btn-primary btn-sm">Détails</button>
                    </div>
                </div>
            </div>
        `;

        gridContainer.innerHTML += cardHTML;
    });
}

nextBtn.addEventListener('click', () => {
    currentPage++;
    chargerCatalogue();
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        chargerCatalogue();
    }
});

chargerCatalogue();