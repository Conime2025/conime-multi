// ========== HELPER FUNCTION ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


// ========== DARK MODE TOGGLE ==========
const html = document.documentElement;
const toggleBtn = $("#theme-toggle");

toggleBtn?.addEventListener("click", () => {
  const isDark = html.classList.toggle("dark");
  localStorage.setItem("darkmode", isDark.toString());
});


// ========== BERSIHKAN %20 PADA LINK ==========
$$('a[href*="%20"]').forEach(link => {
  link.href = link.href.replace(/%20/g, '');
});


// ========== SLIDESHOW (AUTO-CHANGE IMAGES) ==========
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slideshow").forEach(container => {
    const images = container.querySelectorAll(".slide-img");
    if (images.length === 0) return;

    let current = 0;
    images[current].setAttribute("data-active", "true");

    setInterval(() => {
      images[current].removeAttribute("data-active");
      current = (current + 1) % images.length;
      images[current].setAttribute("data-active", "true");
    }, 5000);
  });
});



// ========== FALLBACK GAMBAR ==========
document.addEventListener("DOMContentLoaded", () => {
  const fallback = "/images/default.png";

  document.querySelectorAll("img").forEach(img => {
    const rawSrc = img.getAttribute("src") || "";
    const cleanedSrc = rawSrc.trim();

    const isReallyBadSrc =
      cleanedSrc === "" || cleanedSrc === "%20" || /^(\s*|\/?%20)$/.test(rawSrc);

    if (isReallyBadSrc) {
      console.warn(`🔍 src kosong/tidak valid (${rawSrc}), set default`);
      img.src = fallback;
    }

    if (img.complete && img.naturalWidth === 0) {
      console.warn(`⚠️ Gambar gagal dimuat sejak awal: ${img.src}, ganti default`);
      img.src = fallback;
    }

    img.onerror = () => {
      if (img.src !== fallback) {
        console.warn(`❌ Gagal muat gambar: ${img.src}, ganti default`);
        img.src = fallback;
      }
    };
  });
});

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById('navMenuLeft');
    setTimeout(() => {
      nav.classList.add('md:overflow-y-auto', 'overflow-style-custom-y');
    }, 2000);
  });



// ========== Menu Expand ==========
const moreBtn = document.getElementById('moreBtn');
const navList = document.getElementById('navList');

let expanded = false;

moreBtn.addEventListener('click', () => {
  expanded = !expanded;

  if (expanded) {
    // Expand: tampilkan semua
    navList.classList.remove(
      'flex-row',
      'lg:flex-col',
      'justify-between',
      '[&>*:nth-child(2)]:hidden',
      '[&>*:nth-child(4)]:hidden',
      '[&>*:nth-child(5)]:hidden',
      '[&>*:nth-child(6)]:hidden'
    );
    navList.classList.add('flex-wrap', 'justify-start');


  } else {
    // Collapse: sembunyikan lagi
    navList.classList.remove('flex-wrap', 'justify-start');
    navList.classList.add('flex-row', 'justify-between');

    navList.classList.add(
      '[&>*:nth-child(2)]:hidden',
      '[&>*:nth-child(4)]:hidden',
      '[&>*:nth-child(5)]:hidden',
      '[&>*:nth-child(6)]:hidden'
    );


  }
});




// ========== NONAKTIFKAN FITUR LAIN (DIBIARKAN UNTUK REFERENSI) ==========

// ====== AUTO SCROLL ======
// const scrollContainer = $("#autoScroll");
// if (scrollContainer) {
//   let scrollDirection = 1;
//   function autoScroll() {
//     const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
//     scrollContainer.scrollLeft += scrollDirection * 0.5;
//     if (scrollContainer.scrollLeft >= maxScroll || scrollContainer.scrollLeft <= 0) {
//       scrollDirection *= -1;
//     }
//     requestAnimationFrame(autoScroll);
//   }
//   requestAnimationFrame(autoScroll);
// }

// ====== MODAL SHARE ======
// function toggleShareModal() {
//   const modal = $("#shareModal");
//   modal?.classList.toggle("hidden");
// }

// $("#closeModal")?.addEventListener("click", () => {
//   $("#shareModal")?.classList.add("hidden");
// });

// document.addEventListener("click", (event) => {
//   const modal = $("#shareModal");
//   if (
//     modal &&
//     !modal.classList.contains("hidden") &&
//     !modal.contains(event.target) &&
//     !event.target.closest('button[onclick="toggleShareModal()"]')
//   ) {
//     modal.classList.add("hidden");
//   }
// });

// ====== MODAL SEARCH ======
// const btnSearchElements = $$('#searchBtn');
// const searchModal = $('#searchModal');

// btnSearchElements.forEach(el => {
//   el.classList.add('tombol');
//   el.addEventListener('click', () => {
//     searchModal?.classList.remove('hidden');
//   });
// });

// document.addEventListener('click', (e) => {
//   if (
//     searchModal &&
//     !searchModal.contains(e.target) &&
//     ![...btnSearchElements].some(btn => btn.contains(e.target))
//   ) {
//     searchModal.classList.add('hidden');
//   }
// });

// ====== COPY SHARE LINK ======
// function copyShareLink() {
//   const linkInput = $("#shareLink");
//   const popup = $("#popup-copy");

//   if (!linkInput || !popup) return;

//   linkInput.select();
//   linkInput.setSelectionRange(0, 99999);
//   navigator.clipboard.writeText(linkInput.value).then(() => {
//     setTimeout(() => {
//       popup.classList.remove("hidden");
//       popup.classList.add("flex");
//     }, 1000);

//     setTimeout(() => {
//       popup.classList.remove("flex");
//       popup.classList.add("hidden");
//     }, 3000);
//   });
// }

// ====== SUBSCRIBE FORM ======
// document.addEventListener("DOMContentLoaded", () => {
//   const input = document.getElementById("inputSubs");
//   const btn = document.getElementById("letSubs");
//   const errorMsg = document.getElementById("
