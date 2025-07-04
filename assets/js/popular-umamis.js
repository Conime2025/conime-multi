
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("popular-news-container");
  if (!container) return;

  try {
    const res = await fetch('https://cloud.umami.is/api/websites/22aa83cf-a325-47ce-824c-ba05044bbcd1/pages?limit=3', {
      headers: {
        'Authorization': 'Bearer api_GUqKESZbrRmdfPPFcGpaNARWhPckYMvQ'
      }
    });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p class='text-gray-500'>No popular posts yet.</p>";
      return;
    }

    // Build the list
    let html = `
      <h2 class="text-xl uppercase tracking-[.3em] lg:tracking-[.4em] border-b border-gray-300 dark:border-gray-800/50 pb-2 mb-4">
        Popular News
      </h2>
      <ul class="flex flex-col gap-4">
    `;

    data.forEach((item, i) => {
      html += `
        <li class="relative popular-html flex flex-col w-full h-full bg-white hover:bg-gray-300 dark:bg-gray-950/60 hover:dark:bg-gray-800/50 overflow-hidden rounded-xl shadow-lg transition duration-300 ease-in-out">
          <a href="${item.url}" class="bg-cover w-full h-full overflow-hidden transition duration-500 ease-in-out">
            <img loading="lazy" src="/images/default.jpg" alt="Popular News ${i + 1}" class="w-full h-[360px] object-cover rounded-t-xl brightness-75 hover:brightness-100 transition duration-300 ease-in-out" />
          </a>
          <div class="w-full lg:w-[70%] h-[60%] lg:h-[70%] group absolute bottom-0 left-0 rounded-tr-3xl transition duration-500 ease-in-out font-light dark:font-extralight flex flex-col items-start justify-start gap-2 p-4 bg-white dark:bg-gray-950 hover:bg-gray-300 hover:dark:bg-gray-900">
            <h2 class="w-fit inline-block lg:hidden">—0${i + 1}</h2>
            <h2 class="w-[80%] lg:w-full h-fit text-2xl line-clamp-3">
              <a href="${item.url}" class="hover:underline break-words">${item.url}</a>
            </h2>
            <p class="bottom-4 items-end justify-end w-full text-xl flex-1 flex gap-0">
              <span>Views:</span> ${item.views}
            </p>
            <h2 class="absolute inset-0 text-gray-500 dark:text-gray-900 text-5xl w-1 h-1 lg:w-full lg:h-full flex items-center justify-center font-bold opacity-0 lg:opacity-100 dark:lg:opacity-100 group-hover:lg:opacity-0 transition duration-500 ease-in-out">
              #${i + 1}
            </h2>
          </div>
        </li>
      `;
    });

    html += `</ul>`;
    container.innerHTML = html;

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='text-red-500'>Error loading popular posts.</p>";
  }
});