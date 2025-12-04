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