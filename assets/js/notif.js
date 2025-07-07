document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded fired!");

  const notifBtn = document.querySelector(".notifBtn");
  const notifModal = document.getElementById("notifModal");
  const notifContainer = notifModal?.querySelector(".notif-container");
  const closeBtn = notifModal?.querySelector(".closeModal");
  const markAll = document.querySelector(".mark-all-read");
  const markText = document.getElementById("textMark");
  const toggleBall = document.getElementById("toggleBall");
  const notifBadges = document.querySelectorAll(".notifBadge");
  const posts = document.querySelectorAll(".post-notif");

  if (!notifBtn) console.warn("⚠️ notifBtn NOT FOUND!");
  if (!notifModal) console.warn("⚠️ notifModal NOT FOUND!");

  console.log("🔍 notifBtn =", notifBtn);
  console.log("🔍 notifModal =", notifModal);
  console.log("📦 posts ditemukan =", posts.length);

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

  posts.forEach(post => {
    const diff = (now - new Date(post.dataset.date)) / 1000;
    const slug = post.dataset.url;
    const title = post.dataset.title || "Notifikasi baru";
    const isRead = localStorage.getItem(`notif-read:${slug}`) === "true";

    console.log(`🔔 Post ${slug}: isRead=${isRead}, age=${Math.floor(diff)}s`);

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

    if (diff < 86400) {
      const isUnread = !isRead;
      if (isUnread) unreadCount++;
      const badgeClass = isUnread ? "bg-conime-500 dark:bg-conime-500" : "bg-gray-600 dark:bg-gray-700";
      const timeAgo = getTimeAgo(post.dataset.date);

      newNotifs.push(`
        <a href="${slug}" class="notif-item bg-gray-100 dark:bg-gray-800/20 rounded p-3 relative block transition hover:bg-gray-200 dark:hover:bg-gray-800 ${isRead ? 'opacity-75 dark:opacity-50' : ''}" data-url="${slug}" data-date="${post.dataset.date}">
          <div class="flex justify-end badge">
            <div class="flex relative justify-center items-center rounded-full">
              <div class="w-3 h-3 opacity-50 rounded-full ${badgeClass}"></div>
              <div class="w-2 h-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${badgeClass}"></div>
            </div>
          </div>
          <h2 class="line-clamp-2 w-[80%] text-sm font-light dark:font-extralight text-gray-900 dark:text-white">${title}</h2>
          <p class="w-full text-right text-xs font-light dark:font-extralight"><time datetime="${post.dataset.date}">${timeAgo}</time></p>
        </a>
      `);
    }
  });

  const updateToggleState = () => {
    const isAllRead = unreadCount === 0;
    console.log("🔄 updateToggleState: isAllRead =", isAllRead);
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
    console.log("📛 checkNotifBadge CALLED");
    const markAllRead = localStorage.getItem("notif-all-read") === "true";
    let hasRecentUnread = false;

    posts.forEach(post => {
      const isRead = localStorage.getItem(`notif-read:${post.dataset.url}`) === "true";
      const diff = (now - new Date(post.dataset.date)) / 1000;
      if (diff < 86400 && !isRead) {
        hasRecentUnread = true;
      }
    });

    console.log("🔍 hasRecentUnread =", hasRecentUnread);

    notifBadges.forEach(badge => {
      if (hasRecentUnread && !markAllRead) {
        badge?.classList.remove("hidden");
      } else {
        badge?.classList.add("hidden");
      }
    });
  };

  if (notifContainer) {
    notifContainer.innerHTML = newNotifs.length > 0
      ? newNotifs.join("")
      : `<div class="text-center text-sm py-4 text-gray-500 dark:text-gray-400">Tidak ada notifikasi baru.</div>`;
    console.log("📥 notifContainer updated. New items =", newNotifs.length);
  }

  notifContainer?.querySelectorAll(".notif-item").forEach(item => {
    item.addEventListener("click", () => {
      const slug = item.dataset.url;
      console.log(`✅ notif-item CLICKED: ${slug}`);
      localStorage.setItem(`notif-read:${slug}`, "true");
      item.classList.add("opacity-75", "dark:opacity-50");
      item.querySelectorAll(".badge div").forEach(dot => {
        dot.classList.remove("bg-conime-500", "dark:bg-conime-500");
        dot.classList.add("bg-gray-600", "dark:bg-gray-700");
      });
      const fireEl = document.querySelector(`.fire-new[data-url="${slug}"]`);
      fireEl?.classList.add("opacity-0", "hidden");

      notifBadges.forEach(badge => badge?.classList.add("hidden"));

      unreadCount--;
      updateToggleState();
      checkNotifBadge();
    });
  });

  markAll?.addEventListener("click", () => {
    const toggle = localStorage.getItem("notif-all-read") === "true";
    const newToggle = (!toggle).toString();
    console.log("🟡 markAll CLICKED. New toggle state =", newToggle);
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
          dot.classList.add("bg-gray-600", "dark:bg-gray-700");
        });
        fireEl?.classList.add("opacity-0", "hidden");
      } else if (!isOld) {
        localStorage.removeItem(`notif-read:${slug}`);
        item.classList.remove("opacity-75", "dark:opacity-50");
        item.querySelectorAll(".badge div").forEach(dot => {
          dot.classList.remove("bg-gray-600", "dark:bg-gray-700");
          dot.classList.add("bg-conime-500", "dark:bg-conime-500");
        });
        fireEl?.classList.remove("opacity-0", "hidden");
      }
    });

    unreadCount = newToggle === "true" ? 0 : posts.length;
    updateToggleState();
    checkNotifBadge();
  });

  const openModal = () => {
    console.log("🟢 openModal CALLED");
    notifModal?.classList.remove("hidden");
    requestAnimationFrame(() => {
      notifModal?.classList.add("scale-100", "opacity-100", "translate-y-0");
      notifModal?.classList.remove("scale-95", "opacity-0", "translate-y-6");
      console.log("✅ Applied show classes to notifModal");
    });
  };

  const closeModal = () => {
    console.log("🟠 closeModal CALLED");
    notifModal?.classList.add("scale-95", "opacity-0", "translate-y-6");
    notifModal?.classList.remove("scale-100", "opacity-100", "translate-y-0");
    setTimeout(() => {
      notifModal?.classList.add("hidden");
      console.log("✅ Added .hidden to notifModal");
    }, 300);
  };

  const toggleModal = () => {
    const isOpen = notifModal &&
      notifModal.classList.contains("scale-100") &&
      notifModal.classList.contains("opacity-100") &&
      notifModal.classList.contains("translate-y-0");

    console.log("ℹ️ toggleModal CALLED. isOpen =", isOpen);

    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  notifBtn?.addEventListener("click", (e) => {
    console.log("🟢 notifBtn CLICKED");
    e.stopPropagation();
    toggleModal();
  });

  closeBtn?.addEventListener("click", (e) => {
    console.log("🟠 closeBtn CLICKED");
    e.stopPropagation();
    closeModal();
  });

  document.addEventListener("click", (e) => {
    if (
      notifModal &&
      !notifModal.classList.contains("hidden") &&
      !notifModal.contains(e.target) &&
      !notifBtn?.contains(e.target)
    ) {
      console.log("🔴 Document click OUTSIDE notifModal, closing modal");
      closeModal();
    }
  });

  updateToggleState();
  checkNotifBadge();
});
