 // assets/js/detail.js

async function openDetail(type, id) {
  // 1. Récupérer les éléments du DOM de la modale
  const modalCheckbox = document.getElementById('modal-detail');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('detail-content');

  // Afficher un chargement
  modalTitle.innerText = "Chargement...";
  modalContent.innerHTML = '<div class="flex justify-center p-10"><span class="loading loading-spinner loading-lg"></span></div>';
  
  // Ouvrir la modale
  modalCheckbox.checked = true;

  // 2. Appeler l'API pour avoir les détails complets
  // (On utilise fetchDetailFromTMDB qui est dans api.js)
  const data = await fetchDetailFromTMDB(`/${type}/${id}`);

  if (!data) {
    modalContent.innerHTML = "<p>Erreur lors du chargement des détails.</p>";
    return;
  }

  // --- PRÉPARATION DES DONNÉES FAVORIS ---
  const isMovie = type === 'movie';
  const title = isMovie ? data.title : data.name;
  const originalTitle = isMovie ? data.original_title : data.original_name;
  const date = isMovie ? data.release_date : data.first_air_date;
  const overview = data.overview || "Aucun résumé disponible.";
  const poster = data.poster_path ? IMG_URL + data.poster_path : "https://placehold.co/300x450?text=No+Image";
  const backdrop = data.backdrop_path ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}` : "";

  // 3. VÉRIFICATION LOCALSTORAGE
  // Est-ce que ce film est déjà dans le sac à dos ?
  const dejaFavori = isFavori(id); 
  const btnText = dejaFavori ? 'Retirer des favoris' : 'Ajouter aux favoris';
  const btnClass = dejaFavori ? 'btn-error text-white' : 'btn-outline'; // Rouge si favori, contour gris sinon
  const icon = dejaFavori ? '❤️' : '🤍';

  // Sécuriser le titre pour le onclick (gestion des apostrophes)
  const safeTitle = title.replace(/'/g, "\\'"); 

  // --- GÉNÉRATION DU HTML ---
  modalTitle.innerText = title;

  modalContent.innerHTML = `
    ${backdrop ? `<div class="w-full h-48 bg-cover bg-center rounded-lg mb-4 shadow-inner" style="background-image: url('${backdrop}')"></div>` : ''}

    <div class="flex flex-col md:flex-row gap-6">
      <img src="${poster}" alt="${title}" class="w-full md:w-1/3 rounded-lg shadow-2xl object-cover">

      <div class="flex-1">
        <h4 class="text-lg font-bold opacity-70 mb-2">${originalTitle} (${date ? date.split('-')[0] : 'N/A'})</h4>
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${data.genres.map(g => `<span class="badge badge-primary badge-outline">${g.name}</span>`).join('')}
        </div>

        <p class="text-justify mb-6 leading-relaxed">
          ${overview}
        </p>
        
        <button 
          id="modal-fav-btn"
          onclick="gestionClicModal('${id}', '${type}', '${safeTitle}', '${data.poster_path}')"
          class="btn ${btnClass} w-full md:w-auto gap-2"
        >
          <span id="modal-fav-icon" class="text-xl">${icon}</span>
          <span id="modal-fav-text">${btnText}</span>
        </button>

      </div>
    </div>
  `;
}

// --- FONCTION SPECIALE POUR METTRE A JOUR LE BOUTON DANS LA MODALE ---
function gestionClicModal(id, type, title, posterPath) {
    // 1. Appeler la fonction principale du LocalStorage (celle de favoris.js)
    ajoutfavoris(id, type, title, posterPath);

    // 2. Mettre à jour visuellement le bouton DE LA MODALE tout de suite
    const btn = document.getElementById('modal-fav-btn');
    const iconSpan = document.getElementById('modal-fav-icon');
    const textSpan = document.getElementById('modal-fav-text');
    
    // On revérifie l'état après le clic
    const estMaintenantFavori = isFavori(id);

    if (estMaintenantFavori) {
        // Il est devenu favori -> On met en rouge
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-error', 'text-white');
        iconSpan.innerText = '❤️';
        textSpan.innerText = 'Retirer des favoris';
    } else {
        // Il n'est plus favori -> On remet en gris
        btn.classList.add('btn-outline');
        btn.classList.remove('btn-error', 'text-white');
        iconSpan.innerText = '🤍';
        textSpan.innerText = 'Ajouter aux favoris';
    }
}