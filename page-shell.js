/**
 * page-shell.js
 * Auth guard + logout. Uses same root detection as sidebar.js.
 */
(function () {
  function getRoot() {
    if (window.SITE_ROOT && (window.SITE_ROOT.startsWith('/') || window.SITE_ROOT.startsWith('http'))) {
      return window.SITE_ROOT.replace(/\/?$/, '/');
    }
    const href = window.location.href;
    const pagesIdx = href.indexOf('/pages/');
    if (pagesIdx !== -1) return href.substring(0, pagesIdx + 1);
    return href.substring(0, href.lastIndexOf('/') + 1);
  }

  const R = getRoot();

  if (!sessionStorage.getItem('userRole') && window.location.protocol !== 'file:') {
    window.location.href = R + 'index.html';
    return;
  }

  window.logout = function () {
    sessionStorage.clear();
    window.location.href = R + 'index.html';
  };

  document.addEventListener('DOMContentLoaded', () => {
    const roleEl = document.getElementById('userRole');
    if (roleEl) roleEl.innerText = sessionStorage.getItem('userRole') || '';
  });
})();
