document.addEventListener("DOMContentLoaded", () => {
  const moreBtn = document.getElementById("moreBtn-mobile");
  const modal = document.getElementById("mobileMenuModal");
  const modalContainer = document.getElementById("mobile-modal-container");
  const closeBtn = document.getElementById("btnCloseMobileMenu");

  if (!moreBtn) {
    console.warn("Element #moreBtn-mobile tidak ditemukan.");
    return;
  }

  if (!modal) {
    console.warn("Element #mobileMenuModal tidak ditemukan.");
    return;
  }

  const showModal = () => {

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    // Setelah animasi selesai, baru sembunyikan modal & hapus flex
    setTimeout(() => {
      modalContainer.classList.remove("opacity-0");
      modalContainer.classList.add("opacity-100");
      modal.classList.add("opacity-100", "scale-100", "z-[999]", "translate-y-0");
      modal.classList.remove("opacity-0", "scale-95", "-z-[999]", "translate-y-10");
    }, 300);
  };

  const hideModal = () => {
    modalContainer.classList.add("opacity-0");
    modalContainer.classList.remove("opacity-100");
    modal.classList.remove("opacity-100", "scale-100", "z-[999]", "translate-y-0");
    modal.classList.add("opacity-0", "scale-95", "-z-[999]", "translate-y-10");

    // Setelah animasi selesai, baru sembunyikan modal & hapus flex
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }, 300);
  };


  moreBtn.addEventListener("click", showModal);
  closeBtn?.addEventListener("click", hideModal);

  // Tutup jika klik di luar konten modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
  });
});
