document.addEventListener("DOMContentLoaded", () => {
  const notifModalAuto = document.getElementById("notifModalAuto");
  if (!notifModalAuto) return;

  const notifContainer2 = notifModalAuto.querySelector(".notif-container2");
  if (!notifContainer2) return;

  // === Cek apakah sudah pernah muncul
  const alreadyShown = localStorage.getItem("notif-auto-shown") === "true";
  if (alreadyShown) {
    notifModalAuto.remove();
    return;
  }

  // === Ambil elemen post-notif
  const posts = document.querySelectorAll(".post-notif");
  const now = new Date();

  // === Fungsi animasi buka/tutup
  const openAutoModal = () => {
    notifModalAuto.classList.remove("hidden");
    requestAnimationFrame(() => {
      notifModalAuto.classList.add("scale-100", "opacity-100", "translate-y-0", "z-[999]");
      notifModalAuto.classList.remove("scale-95", "opacity-0", "translate-y-10", "-z-[999]");
    });
  };

  const closeAutoModal = () => {
    notifModalAuto.classList.add("scale-95", "opacity-0", "translate-y-10", "-z-[999]");
    notifModalAuto.classList.remove("scale-100", "opacity-100", "translate-y-0", "z-[999]");
    setTimeout(() => notifModalAuto.classList.add("hidden"), 300);
  };

  // === Tombol close
  notifModalAuto.querySelectorAll(".closeModal").forEach(btn => {
    btn.addEventListener("click", () => {
      closeAutoModal();
      localStorage.setItem("notif-auto-shown", "true");
    });
  });

  // === ISI DEFAULT UCAPAN SELAMAT DATANG
  notifContainer2.innerHTML = document.documentElement.lang.startsWith("id")
    ? `
      <h2 class="text-lg font-bold">Selamat Datang di CoNime!</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Senang sekali bisa menyambutmu di sini. Temukan anime, komik, film, dan game favoritmu bersama kami!
      </p>
    `
    : `
      <h2 class="text-lg font-bold">Welcome to CoNime!</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        We're so glad to have you here. Explore your favorite anime, comics, movies, and games with us!
      </p>
    `;

  // === Tampilkan otomatis setelah 5 detik
  setTimeout(() => {
    openAutoModal();
  }, 5000);

  // === Setelah user sempat membaca (contoh 8 detik), ganti ke daftar notif
  setTimeout(() => {
    const newNotifs = [];
    posts.forEach(post => {
      const postDate = new Date(post.dataset.date);
      const diff = (now - postDate) / 1000;
      const slug = post.dataset.url;
      const title = post.dataset.title || (document.documentElement.lang.startsWith("id") ? "Notifikasi baru" : "New notification");
      const timeAgo = getTimeAgo(post.dataset.date);

      if (diff < 86400) {
        newNotifs.push(`
          <a href="${slug}" class="notif-item bg-gray-200 dark:bg-gray-800/20 rounded p-3 block transition hover:bg-gray-300 dark:hover:bg-gray-700">
            <h2 class="line-clamp-2 text-sm font-normal text-gray-900 dark:text-white">${title}</h2>
            <p class="w-full text-right text-xs font-light dark:font-extralight"><time datetime="${post.dataset.date}">${timeAgo}</time></p>
          </a>
        `);
      }
    });

    notifContainer2.innerHTML = newNotifs.length > 0
      ? newNotifs.join("")
      : `<div class="text-center text-sm py-4 text-gray-500 dark:text-gray-400">
          ${document.documentElement.lang.startsWith("id") ? "Tidak ada notifikasi baru." : "No new notifications."}
         </div>`;
  }, 13000);  // 5s delay buka + 8s baca = total 13s

  // === Auto close setelah 20 detik (opsional)
  setTimeout(() => {
    closeAutoModal();
    localStorage.setItem("notif-auto-shown", "true");
  }, 20000);

  // === Helper fungsi
  function getTimeAgo(dateStr) {
    const seconds = Math.floor((now - new Date(dateStr)) / 1000);
    if (seconds < 60) return document.documentElement.lang.startsWith("id") ? `${seconds} dtk lalu` : `${seconds}s ago`;
    if (seconds < 3600) return document.documentElement.lang.startsWith("id") ? `${Math.floor(seconds / 60)} mnt lalu` : `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return document.documentElement.lang.startsWith("id") ? `${Math.floor(seconds / 3600)} jam lalu` : `${Math.floor(seconds / 3600)}h ago`;
    return document.documentElement.lang.startsWith("id") ? `${Math.floor(seconds / 86400)} hr lalu` : `${Math.floor(seconds / 86400)}d ago`;
  }
});
