const THREE = window.THREE;
const gsap = window.gsap;
const hoverEffect = window.hoverEffect;

window.addEventListener("load", () => {
  const isFirstVisit = !sessionStorage.getItem("hoverEffectInitialized");
  const navType = performance.getEntriesByType("navigation")[0]?.type || "navigate";
  const isHome = location.pathname === "/";
  const delayTime = (isFirstVisit && isHome && navType === "navigate") ? 9000 : 100;

  setTimeout(() => {
    // Cek apakah hoverEffect library memang ada
    if (!window.hoverEffect) {
      console.warn("⚠️ hoverEffect tidak tersedia. Gambar tampil apa adanya tanpa efek.");
      return;
    }

    // Apply hover effect ke semua elemen yang didukung
    document.querySelectorAll('.divDistortion').forEach((el) => {
      applyHoverEffect(el, 0.3, "/images/distortion/ramen.jpg");
    });
    document.querySelectorAll('.divDistortion2').forEach((el) => {
      applyHoverEffect(el, 0.3, "/images/distortion/heightMap.png");
    });

    sessionStorage.setItem("hoverEffectInitialized", "true");
  }, delayTime);

  function applyHoverEffect(el, intensity, displacementPath) {
    const img1Src = el.dataset.image1 || el.querySelector('.image1')?.src;
    let img2Src = el.dataset.image2 || el.querySelector('.image2')?.src;

    if (!img1Src) {
      console.warn("⚠️ Tidak ada image1 di elemen:", el);
      return;
    }

    if (!img2Src || img2Src === "") {
      img2Src = img1Src;
      console.log("🌀 Hanya satu gambar tersedia → image2 diisi dari image1:", img2Src);
    }

    const img1 = new Image();
    const img2 = new Image();
    img1.src = img1Src;
    img2.src = img2Src;

    let img1Loaded = false;
    let img2Loaded = false;

    const checkBothLoaded = () => {
      if (img1Loaded && img2Loaded) {
        // Gambar fallback check — biarkan tampil apa adanya kalau gagal
        if (!img1.complete || !img2.complete) {
          console.warn("⚠️ Salah satu gambar gagal dimuat. Dibiarkan tampil normal tanpa efek:", el);
          return;
        }

        const imgRatio = img1.naturalHeight / img1.naturalWidth;

        setTimeout(() => {
          try {
            new hoverEffect({
              parent: el,
              angle: Math.PI / 4,
              intensity1: intensity,
              intensity2: intensity,
              image1: img1.src,
              image2: img2.src,
              displacementImage: displacementPath,
              imagesRatio: imgRatio,
              speedIn: 1.0,
              speedOut: 1.0
            });

            setTimeout(() => {
              el.querySelectorAll('.image1, .image2').forEach(img => {
                img.classList.add('lg:w-[0.1px]', 'lg:h-[0.1px]', 'pointer-events-none');
              });
            }, 500);

            sessionStorage.removeItem("hoverReloaded");
            console.log("✅ Hover effect diterapkan:", el);
          } catch (error) {
            console.warn("❌ hoverEffect gagal:", error);
          }
        }, 0);
      }
    };

    img1.onload = () => { img1Loaded = true; checkBothLoaded(); };
    img1.onerror = () => fallbackHandler(img1, el, '.image1');
    img2.onload = () => { img2Loaded = true; checkBothLoaded(); };
    img2.onerror = () => fallbackHandler(img2, el, '.image2');

    function fallbackHandler(img, el, selector) {
      console.warn(`⚠️ Gagal load (${img.src}) → gambar asli tetap dipakai. Tidak diubah ke default.`);
      // Tidak ubah src
      // Tidak hide img
      if (selector.includes("1")) img1Loaded = true;
      if (selector.includes("2")) img2Loaded = true;
      checkBothLoaded();
    }
  }
});
