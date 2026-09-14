(() => {
  "use strict";

  const SESSION_KEY = "vizzzor_unlocked";
  const LASTPAGE_KEY = "vizzzor_last_page";
  const VIEWMODE_KEY = "vizzzor_view_mode";

  const gateScreen = document.getElementById("gate-screen");
  const libraryScreen = document.getElementById("library-screen");
  const viewerScreen = document.getElementById("viewer-screen");

  const gateForm = document.getElementById("gate-form");
  const gatePassword = document.getElementById("gate-password");
  const gateError = document.getElementById("gate-error");
  const gatePanel = document.querySelector(".gate-panel");
  const gateTagline = document.getElementById("gate-tagline");

  const libraryGrid = document.getElementById("library-grid");
  const logoutBtn = document.getElementById("logout-btn");

  const viewerStage = document.getElementById("viewer-stage");
  const viewerImage = document.getElementById("viewer-image");
  const viewerLoading = document.getElementById("viewer-loading");
  const viewerTitle = document.getElementById("viewer-title");
  const viewerPageCount = document.getElementById("viewer-page-count");
  const pageSlider = document.getElementById("page-slider");
  const backBtn = document.getElementById("back-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const zonePrev = document.getElementById("zone-prev");
  const zoneNext = document.getElementById("zone-next");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const barTop = document.getElementById("viewer-bar-top");
  const barBottom = document.getElementById("viewer-bar-bottom");
  const modeButtons = {
    height: document.getElementById("mode-height-btn"),
    width: document.getElementById("mode-width-btn"),
    original: document.getElementById("mode-original-btn"),
  };

  let manifest = { volumes: [] };
  let currentVolume = null;
  let currentPage = 0;
  let viewMode = localStorage.getItem(VIEWMODE_KEY) || "height";
  let idleTimer = null;

  gateTagline.textContent = VIZZZOR_CONFIG.tagline || "";
  document.title = VIZZZOR_CONFIG.siteTitle || "ViZzZor";

  // ---------- utilidades ----------
  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(hashBuffer)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function show(el) { el.classList.remove("hidden"); }
  function hide(el) { el.classList.add("hidden"); }

  // ---------- acceso ----------
  async function tryUnlock(password) {
    const hash = await sha256Hex(password);
    return hash === VIZZZOR_CONFIG.passwordHash;
  }

  gateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = await tryUnlock(gatePassword.value);
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, "1");
      gateError.textContent = "";
      enterLibrary();
    } else {
      gateError.textContent = "Contraseña incorrecta. Probá de nuevo.";
      gatePanel.classList.remove("shake");
      void gatePanel.offsetWidth;
      gatePanel.classList.add("shake");
      gatePassword.value = "";
      gatePassword.focus();
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    hide(libraryScreen);
    hide(viewerScreen);
    show(gateScreen);
    gatePassword.value = "";
    gatePassword.focus();
  });

  // ---------- biblioteca ----------
  async function loadManifest() {
    try {
      const res = await fetch("comics/manifest.json", { cache: "no-store" });
      if (!res.ok) throw new Error("No se encontró comics/manifest.json");
      manifest = await res.json();
    } catch (err) {
      console.error(err);
      manifest = { volumes: [] };
    }
  }

  function renderLibrary() {
    libraryGrid.innerHTML = "";
    if (!manifest.volumes || manifest.volumes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "library-empty";
      empty.textContent =
        "Todavía no hay tomos publicados. Subí una carpeta con imágenes dentro de /comics y hacé push.";
      libraryGrid.appendChild(empty);
      return;
    }
    manifest.volumes.forEach((vol) => {
      const card = document.createElement("button");
      card.className = "volume-card";
      card.innerHTML = `
        <div class="volume-cover">
          <img src="${vol.pages[0]}" alt="Portada de ${vol.title}" loading="lazy" />
        </div>
        <p class="volume-title">${vol.title}</p>
        <p class="volume-meta">${vol.pageCount} página${vol.pageCount === 1 ? "" : "s"}</p>
      `;
      card.addEventListener("click", () => openVolume(vol));
      libraryGrid.appendChild(card);
    });
  }

  function enterLibrary() {
    hide(gateScreen);
    hide(viewerScreen);
    show(libraryScreen);
  }

  // ---------- visor ----------
  function openVolume(vol) {
    currentVolume = vol;
    const saved = parseInt(localStorage.getItem(LASTPAGE_KEY + ":" + vol.id) || "0", 10);
    currentPage = Number.isFinite(saved) && saved < vol.pageCount ? saved : 0;
    pageSlider.max = String(vol.pageCount - 1);
    setViewMode(viewMode, true);
    renderPage();
    hide(libraryScreen);
    show(viewerScreen);
    resetIdleTimer();
  }

  function closeViewer() {
    hide(viewerScreen);
    show(libraryScreen);
    renderLibrary(); // refresca metadata por si acaso
  }

  function renderPage() {
    if (!currentVolume) return;
    const total = currentVolume.pageCount;
    currentPage = Math.max(0, Math.min(currentPage, total - 1));
    show(viewerLoading);
    viewerImage.style.opacity = "0";
    viewerImage.src = currentVolume.pages[currentPage];
    viewerTitle.textContent = currentVolume.title;
    viewerPageCount.textContent = `${currentPage + 1} / ${total}`;
    pageSlider.value = String(currentPage);
    localStorage.setItem(LASTPAGE_KEY + ":" + currentVolume.id, String(currentPage));

    // precarga la siguiente página para que la navegación se sienta instantánea
    if (currentPage + 1 < total) {
      const preload = new Image();
      preload.src = currentVolume.pages[currentPage + 1];
    }
  }

  viewerImage.addEventListener("load", () => {
    hide(viewerLoading);
    viewerImage.style.opacity = "1";
  });

  function nextPage() {
    if (!currentVolume) return;
    if (currentPage < currentVolume.pageCount - 1) {
      currentPage += 1;
      renderPage();
    }
  }

  function prevPage() {
    if (!currentVolume) return;
    if (currentPage > 0) {
      currentPage -= 1;
      renderPage();
    }
  }

  function setViewMode(mode, silent) {
    viewMode = mode;
    viewerStage.classList.remove("mode-height", "mode-width", "mode-original");
    viewerStage.classList.add(`mode-${mode}`);
    Object.entries(modeButtons).forEach(([key, btn]) => {
      btn.classList.toggle("active", key === mode);
    });
    if (!silent) localStorage.setItem(VIEWMODE_KEY, mode);
  }

  modeButtons.height.addEventListener("click", () => setViewMode("height"));
  modeButtons.width.addEventListener("click", () => setViewMode("width"));
  modeButtons.original.addEventListener("click", () => setViewMode("original"));

  backBtn.addEventListener("click", closeViewer);
  nextBtn.addEventListener("click", nextPage);
  prevBtn.addEventListener("click", prevPage);
  zoneNext.addEventListener("click", nextPage);
  zonePrev.addEventListener("click", prevPage);

  pageSlider.addEventListener("input", () => {
    currentPage = parseInt(pageSlider.value, 10);
    renderPage();
  });

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      viewerScreen.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  // barras que se ocultan solas al leer, y vuelven con el mouse/touch
  function resetIdleTimer() {
    barTop.classList.remove("bar-hidden");
    barBottom.classList.remove("bar-hidden");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      barTop.classList.add("bar-hidden");
      barBottom.classList.add("bar-hidden");
    }, 2600);
  }
  viewerStage.addEventListener("mousemove", resetIdleTimer);
  viewerStage.addEventListener("touchstart", resetIdleTimer, { passive: true });

  // navegación por teclado
  document.addEventListener("keydown", (e) => {
    if (viewerScreen.classList.contains("hidden")) return;
    if (e.key === "ArrowRight") nextPage();
    else if (e.key === "ArrowLeft") prevPage();
    else if (e.key === "Escape") closeViewer();
    else if (e.key === "f" || e.key === "F") fullscreenBtn.click();
  });

  // swipe táctil simple
  let touchStartX = null;
  viewerStage.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewerStage.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) nextPage(); else prevPage();
    }
    touchStartX = null;
  }, { passive: true });

  // ---------- arranque ----------
  async function init() {
    await loadManifest();
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      renderLibrary();
      enterLibrary();
    } else {
      renderLibrary();
    }
  }

  init();
})();
