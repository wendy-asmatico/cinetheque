document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q'); // Récupère le mot tapé dans l'URL
    
    // Éléments du DOM
    const titleSpan = document.getElementById('search-title');
    const gridContainer = document.getElementById('movies-grid');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumSpan = document.getElementById('current-page-num');

    let currentPage = 1;

    // Initialisation
    if (query) {
        titleSpan.textContent = `"${query}"`;
        lancerRecherche(query, currentPage);
    } else {
        titleSpan.textContent = "Aucune recherche";
        gridContainer.innerHTML = "<p class='col-span-full text-center'>Veuillez utiliser la barre de recherche.</p>";
    }

    // --- FONCTIONS ---

    async function lancerRecherche(searchQuery, page) {
        gridContainer.innerHTML = '<span class="loading loading-spinner loading-lg col-span-full mx-auto my-10"></span>';


        const results = await fetchFromTMDB("/search/multi", page, `&query=${encodeURIComponent(searchQuery)}`);

        afficherResultats(results);
        updatePaginationButtons();
    }

    function afficherResultats(items) {
        gridContainer.innerHTML = ""; // Vider le loader

        if (!items || items.length === 0) {
            gridContainer.innerHTML = "<p class='col-span-full text-center text-xl'>Aucun résultat trouvé 😢</p>";
            return;
        }

        items.forEach(item => {
            // On filtre pour ne garder que Films et Séries (pas les acteurs)
            if (item.media_type === 'person') return;

            const isMovie = item.media_type === 'movie' || item.title;
            const title = isMovie ? item.title : item.name;
            const type = isMovie ? 'movie' : 'tv'; // Important pour le modal
            
            // Image : si null, on met une image grise par défaut
            const poster = item.poster_path 
                ? `https://image.tmdb.org/t/p/w300${item.poster_path}` 
                : "https://placehold.co/300x450/1f2937/ffffff?text=No+Image";

            // Création de la carte
            gridContainer.innerHTML += `
                <div class="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-200">
                    <figure>
                        <img src="${poster}" alt="${title}" class="w-full h-auto object-cover aspect-[2/3]" />
                    </figure>
                    <div class="card-body p-4">
                        <h3 class="card-title text-sm h-10 overflow-hidden line-clamp-2 leading-tight">
                            ${title}
                        </h3>
                        <div class="card-actions justify-end mt-3">
                            <button onclick="openDetail('${type}', ${item.id})" class="btn btn-primary btn-xs w-full">
                                Voir détail
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // --- GESTION PAGINATION ---

    function updatePaginationButtons() {
        pageNumSpan.textContent = currentPage;
        
        // Désactiver le bouton "Précédent" si on est page 1
        if (currentPage === 1) {
            prevBtn.setAttribute('disabled', true);
        } else {
            prevBtn.removeAttribute('disabled');
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            lancerRecherche(query, currentPage);
            window.scrollTo(0, 0); // Remonter en haut de page
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        lancerRecherche(query, currentPage);
        window.scrollTo(0, 0);
    });
});