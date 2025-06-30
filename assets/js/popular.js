
  const postData = document.getElementById('post-metadata');
  const posts = JSON.parse(postData.textContent);

  const getMetadata = (path) => posts.find(p => p.permalink === path);

  const popularContainer = document.getElementById("popular-news");
  const fallbackContent = document.getElementById("recommended-fallback");

  if (popularContainer) {
    fetch("https://cloud.umami.is/api/websites/ac1250c2-e2aa-48a1-9b97-205d83de250e/pages?limit=10", {
      headers: {
        Authorization: "Bearer api_zFYJY6zltdcM8H1yUVH9gdWfhLIWkEyt"
      }
    })
    .then(res => res.json())
    .then(data => {
      const filtered = data.results
        .filter(p => p.url.startsWith("/posts/"))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 3);

      let html = `<h2 class="text-xl uppercase font-medium border-b pb-2 mb-4">Popular News</h2><ul class="flex flex-col gap-4">`;

      filtered.forEach((item, i) => {
        const meta = getMetadata(item.url);
        const title = meta?.title || item.url;
        const image = meta?.image || "/images/default.png";

        html += `
          <li class="rounded overflow-hidden shadow">
            <a href="${item.url}">
              <img src="${image}" alt="${title}" class="w-full h-[300px] object-cover" />
              <div class="p-4">
                <h3 class="font-bold text-xl">${title}</h3>
                <p>— Popular</p>
              </div>
            </a>
          </li>`;
      });

      html += `</ul>`;
      popularContainer.innerHTML = html;
    })
    .catch(err => {
      console.warn("Gagal ambil data Umami:", err);
      if (fallbackContent) {
        popularContainer.innerHTML = fallbackContent.innerHTML;
      }
    });
  } 