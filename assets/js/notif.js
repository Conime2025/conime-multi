document.addEventListener("DOMContentLoaded", () => {
  // Ambil semua tombol notifBtn (desktop, mobile bar, modal grid)
  const notifButtons = [
    document.getElementById("notifBtn-lg"),
    document.getElementById("notifBtn-mobile"),
    document.getElementById("notifBtn-modal"),
  ].filter(Boolean);

  const notifModal = document.getElementById("notifModal");
  const notifContainer = notifModal?.querySelector(".notif-container");
  const closeBtn = notifModal?.querySelector(".closeModal");
  const markAll = document.querySelector(".mark-all-read");
  const markText = document.getElementById("textMark");
  const toggleBall = document.getElementById("toggleBall");
  const notifBadges = document.querySelectorAll(".notifBadge");
  const posts = document.querySelectorAll(".post-notif");

  const now = new Date();
  const newNotifs = [];
  let unreadCount = 0;

  const getTimeAgo = (dateStr) => {
    const seconds = Math.floor((now - new Date(dateStr)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // =========================
  // BUILD NOTIFICATION ITEMS
  // =========================
  posts.forEach(post => {
    const postDate = new Date(post.dataset.date);
    const diff = (now - postDate) / 1000;
    const slug = post.dataset.url;
    const title = post.dataset.title || "Notifikasi baru";
    const isRead = localStorage.getItem(`notif-read:${slug}`) === "true";

    // Show/hide 'NEW' badges in cards
    const fireEl = document.querySelector(`.fire-new[data-url="${slug}"]`);
    const labelEl = document.querySelector(`.label-new[data-url="${slug}"]`);
    if (diff < 86400 && !isRead) {
      fireEl?.classList.remove("opacity-0", "hidden");
    } else {
      fireEl?.classList.add("opacity-0", "hidden");
    }
    if (diff < 86400) {
      labelEl?.classList.remove("opacity-0", "hidden");
    } else {
      labelEl?.classList.add("opacity-0", "hidden");
    }

    // Build notif list in modal
    if (diff < 86400) {
      const isUnread = !isRead;
      if (isUnread) unreadCount++;
      const badgeClass = isUnread ? "bg-conime-500 dark:bg-conime-500" : "bg-gray-600 dark:bg-gray-800";
      const timeAgo = getTimeAgo(post.dataset.date);

      newNotifs.push(`
        <a href="${slug}" class="notif-item bg-gray-200 dark:bg-gray-800/20  rounded  p-3 relative block transition hover:bg-gray-200 dark:hover:bg-gray-800 ${isRead ? 'opacity-75 dark:opacity-50' : ''}" data-url="${slug}" data-date="${post.dataset.date}">
          <div class="flex justify-end badge">
            <div class="flex relative justify-center items-center  rounded -full">
              <div class="w-3 h-3 opacity-50  rounded -full ${badgeClass}"></div>
              <div class="w-2 h-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  rounded -full ${badgeClass}"></div>
            </div>
          </div>
          <h2 class="line-clamp-2 w-[80%] text-sm font-light dark:font-extralight text-gray-900 dark:text-white">${title}</h2>
          <p class="w-full text-right text-xs font-light dark:font-extralight"><time datetime="${post.dataset.date}">${timeAgo}</time></p>
        </a>
      `);
    }
  });

  // ================
  // FILL MODAL
  // ================
  if (notifContainer) {
    notifContainer.innerHTML = newNotifs.length > 0
      ? newNotifs.join("")
      : `<div class="text-center text-sm py-4 text-gray-500 dark:text-gray-400">Tidak ada notifikasi baru.</div>`;
  }

  // ====================
  // TOGGLE STATE
  // ====================
  const updateToggleState = () => {
    const isAllRead = unreadCount === 0;
    localStorage.setItem("notif-all-read", isAllRead.toString());

    if (isAllRead) {
      toggleBall.classList.remove("translate-x-[85%]");
      toggleBall.classList.add("-translate-x-[85%]", "bg-gray-500", "dark:bg-gray-500");
      toggleBall.classList.remove("bg-conime-500", "dark:bg-conime-500");
      markText.innerText = "Mark all as unread";
    } else {
      toggleBall.classList.remove("-translate-x-[85%]");
      toggleBall.classList.add("translate-x-[85%]", "bg-conime-500", "dark:bg-conime-500");
      toggleBall.classList.remove("bg-gray-500", "dark:bg-gray-500");
      markText.innerText = "Mark all as read";
    }
  };

  const checkNotifBadge = () => {
    const markAllRead = localStorage.getItem("notif-all-read") === "true";
    let hasRecentUnread = false;

    posts.forEach(post => {
      const isRead = localStorage.getItem(`notif-read:${post.dataset.url}`) === "true";
      const diff = (now - new Date(post.dataset.date)) / 1000;
      if (diff < 86400 && !isRead) hasRecentUnread = true;
    });

    notifBadges.forEach(badge => {
      if (hasRecentUnread && !markAllRead) {
        badge?.classList.remove("hidden");
      } else {
        badge?.classList.add("hidden");
      }
    });
  };

  // ====================
  // EVENT HANDLERS
  // ====================
  notifContainer?.querySelectorAll(".notif-item").forEach(item => {
    item.addEventListener("click", () => {
      const slug = item.dataset.url;
      localStorage.setItem(`notif-read:${slug}`, "true");
      item.classList.add("opacity-75", "dark:opacity-50");
      item.querySelectorAll(".badge div").forEach(dot => {
        dot.classList.remove("bg-conime-500", "dark:bg-conime-500");
        dot.classList.add("bg-gray-600", "dark:bg-gray-800");
      });

      document.querySelector(`.fire-new[data-url="${slug}"]`)?.classList.add("opacity-0", "hidden");
      notifBadges.forEach(badge => badge?.classList.add("hidden"));

      unreadCount--;
      updateToggleState();
      checkNotifBadge();
    });
  });

  markAll?.addEventListener("click", () => {
    const toggle = localStorage.getItem("notif-all-read") === "true";
    const newToggle = (!toggle).toString();
    localStorage.setItem("notif-all-read", newToggle);

    notifContainer?.querySelectorAll(".notif-item").forEach(item => {
      const slug = item.dataset.url;
      const fireEl = document.querySelector(`.fire-new[data-url="${slug}"]`);
      const isOld = (now - new Date(item.dataset.date)) / 1000 > 86400;

      if (newToggle === "true") {
        localStorage.setItem(`notif-read:${slug}`, "true");
        item.classList.add("opacity-75", "dark:opacity-50");
        item.querySelectorAll(".badge div").forEach(dot => {
          dot.classList.remove("bg-conime-500", "dark:bg-conime-500");
          dot.classList.add("bg-gray-600", "dark:bg-gray-800");
        });
        fireEl?.classList.add("opacity-0", "hidden");
      } else if (!isOld) {
        localStorage.removeItem(`notif-read:${slug}`);
        item.classList.remove("opacity-75", "dark:opacity-50");
        item.querySelectorAll(".badge div").forEach(dot => {
          dot.classList.remove("bg-gray-600", "dark:bg-gray-800");
          dot.classList.add("bg-conime-500", "dark:bg-conime-500");
        });
        fireEl?.classList.remove("opacity-0", "hidden");
      }
    });

    unreadCount = newToggle === "true" ? 0 : posts.length;
    updateToggleState();
    checkNotifBadge();
  });

  // ====================
  // MODAL OPEN/CLOSE
  // ====================
  const openModal = () => {
    notifModal?.classList.remove("hidden");
    requestAnimationFrame(() => {
      notifModal?.classList.add("scale-100", "opacity-100", "translate-y-0", "z-[999]");
      notifModal?.classList.remove("scale-95", "opacity-0", "translate-y-10", "-z-[999]");
    });
  };

  const closeModal = () => {
    notifModal?.classList.add("scale-95", "opacity-0", "translate-y-10", "-z-[999]");
    notifModal?.classList.remove("scale-100", "opacity-100", "translate-y-0", "z-[999]");
    setTimeout(() => notifModal?.classList.add("hidden"), 300);
  };

  const toggleModal = () => {
    const isOpen = notifModal &&
      notifModal.classList.contains("scale-100") &&
      notifModal.classList.contains("opacity-100") &&
      notifModal.classList.contains("translate-y-0");

    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  notifButtons.forEach(btn => btn.addEventListener("click", toggleModal));
  closeBtn?.addEventListener("click", closeModal);

  document.addEventListener("click", (e) => {
    if (
      notifModal && !notifModal.classList.contains("hidden") &&
      !notifModal.contains(e.target) &&
      !notifButtons.some(btn => btn.contains(e.target))
    ) {
      closeModal();
    }
  });

  // INIT
  updateToggleState();
  checkNotifBadge();
});