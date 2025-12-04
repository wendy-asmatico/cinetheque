const FAV_KEY = "cinetech_favoris";

function getFavoris() {
    const favs = localStorage.getItem(FAV_KEY);
    return favs ? JSON.parse(favs) : [];

}

function ajoutfavoris(id, type, title, posterPath) {
let favoris = getFavoris();
const index = favoris.findIndex(f => f.id == id); // Est-ce qu'on l'a déjà ?

const btn = document.getElementById(`fav-btn-${id}`); // Le bouton sur lequel on a cliqué

if (index === -1) {
        // AJOUT : Il n'est pas dedans, on l'ajoute
        const newItem = { id, type, title, poster_path: posterPath };
        favoris.push(newItem);
        console.log(`Ajouté : ${title}`);
        
        // Change la couleur du bouton tout de suite
        if(btn) {
            btn.classList.add('text-red-600');
            btn.innerHTML = '❤️'; // Cœur plein
        }
    } else {
        // SUPPRESSION : Il est dedans, on l'enlève
        favoris.splice(index, 1);
        console.log(`Retiré : ${title}`);
        
        // Remet le bouton en gris
        if(btn) {
            btn.classList.remove('text-red-600');
            btn.innerHTML = '🤍'; // Cœur vide
        }
    }

    // Sauvegarde le nouveau tableau dans le sac à dos
    localStorage.setItem(FAV_KEY, JSON.stringify(favoris));

}

function isFavori(id) {
    const favoris = getFavoris();
    return favoris.some(f => f.id == id); // Retourne Vrai ou Faux
}

document.addEventListener('DOMContentLoaded', () => {
    // On récupère les éléments HTML
    const gridContainer = document.getElementById('favorites-grid');
    const countBadge = document.getElementById('fav-count');

    const favoris = getFavoris();

    // On met à jour le compteur (le petit badge)
    if(countBadge) {
        countBadge.innerText = favoris.length;
    }

    // Scénario : Pas de favoris
    if (favoris.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-span-full text-center py-20 flex flex-col items-center">
                <div class="text-6xl mb-4">💔</div>
                <h2 class="text-2xl font-bold mb-2">Aucun favori pour l'instant</h2>
                <p class="mb-6 opacity-70">Ajoutez des films et séries en cliquant sur "Voir détail"</p>
                <a href="index.html" class="btn btn-primary">Explorer le catalogue</a>
            </div>
        `;
        return;
    }

    // Scénario : On a des favoris -> On affiche
    gridContainer.innerHTML = ""; // On vide au cas où

    favoris.forEach(item => {
        // Construction de l'image (attention, item.poster_path est peut-être null)
        const poster = item.poster_path 
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}` 
            : "https://placehold.co/300x450?text=No+Image";

        // Sécurisation du titre pour le onclick
        const safeTitle = item.title.replace(/'/g, "\\'");

        // Création de la carte
        gridContainer.innerHTML += `
            <div class="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-200">
                <figure>
                    <img src="${poster}" alt="${item.title}" class="w-full h-auto object-cover aspect-[2/3]" />
                </figure>
                <div class="card-body p-4">
                    <h3 class="card-title text-sm h-10 overflow-hidden line-clamp-2 leading-tight">
                        ${item.title}
                    </h3>
                    
                    <div class="card-actions justify-end mt-3">
                        <button onclick="openDetail('${item.type}', ${item.id})" class="btn btn-primary btn-xs w-full">
                            Voir
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
});