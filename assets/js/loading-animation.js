const MIN_LOADING_TIME = 1500;
const MAX_LOADING_TIME = 3000;
const loading = document.getElementById('loading-screen');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const menuMain = document.getElementById('main-menu');
const main = document.querySelector('main');

const showMainContent = () => {
  if (loading) {
    loading.classList.remove('opacity-100');
    loading.classList.add('opacity-0');
    setTimeout(() => {
      loading.classList.add('hidden');
      console.log('✅ Loading screen hidden');
    }, 1000);
  }

  header?.classList.remove('hidden');
  header?.classList.add('flex');
  footer?.classList.remove('hidden');
  footer?.classList.add('flex');
  main?.classList.remove('hidden');
  menuMain?.classList.remove('hidden');
  menuMain?.classList.add('flex');
  console.log('✅ Konten dimunculkan');
};

if (localStorage.getItem('loadingShown') === 'true') {
  showMainContent();
} else {
  const startTime = performance.now();
  let alreadyShown = false;

  const maybeShow = () => {
    if (alreadyShown) return;
    alreadyShown = true;
    localStorage.setItem('loadingShown', 'true');
    showMainContent();
  };

  if (document.readyState === 'complete') {
    maybeShow();
  } else {
    window.addEventListener('load', () => {
      const elapsed = performance.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);
      setTimeout(maybeShow, remainingTime);
    });
  }

  setTimeout(maybeShow, MAX_LOADING_TIME);
}
