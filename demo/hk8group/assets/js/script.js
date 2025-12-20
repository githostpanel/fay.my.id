// SCRIPTS: menu toggle, back-to-top, reveal on scroll, basic form simulation

// Elements
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const backToTop = document.getElementById("backToTop");

// Helpers
const lockScroll = (lock) => {
  document.body.style.overflow = lock ? "hidden" : "";
  document.body.style.touchAction = lock ? "none" : "";
};
const setMenuAria = (open) => {
  if (mobileMenu) mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
};

// Back to Top behavior
const initBackToTop = () => {
  if (!backToTop) return;
  // initial visual state
  backToTop.style.opacity = "0";
  backToTop.style.transform = "translateY(8px)";
  backToTop.style.transition = "opacity 0.25s ease, transform 0.25s ease";
  backToTop.style.pointerEvents = "none";
};

const updateBackToTop = () => {
  if (!backToTop) return;
  const menuOpen = mobileMenu && mobileMenu.classList.contains("is-active");
  if (menuOpen) {
    backToTop.style.opacity = "0";
    backToTop.style.pointerEvents = "none";
    backToTop.style.transform = "translateY(8px)";
    return;
  }
  const show = window.scrollY > 200;
  backToTop.style.opacity = show ? "1" : "0";
  backToTop.style.pointerEvents = show ? "auto" : "none";
  backToTop.style.transform = show ? "translateY(0)" : "translateY(8px)";
};

// Menu toggle (burger -> X and mobile menu slide)
if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    mobileMenu.classList.toggle("is-active");

    const isOpen = mobileMenu.classList.contains("is-active");
    lockScroll(isOpen);
    setMenuAria(isOpen);
    updateBackToTop();
  });
}

// Close mobile menu when link clicked
DocumentLinksInit: {
  const links = document.querySelectorAll(".mobile-menu .menu-inner a, .menu a");
  links.forEach((a) => {
    a.addEventListener("click", () => {
      if (mobileMenu && mobileMenu.classList.contains("is-active")) {
        mobileMenu.classList.remove("is-active");
        if (burger) burger.classList.remove("is-active");
        lockScroll(false);
        setMenuAria(false);
        updateBackToTop();
      }
    });
  });
}

// Close with Escape key for better UX
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("is-active")) {
    mobileMenu.classList.remove("is-active");
    if (burger) burger.classList.remove("is-active");
    lockScroll(false);
    setMenuAria(false);
    updateBackToTop();
  }
});

// IntersectionObserver to reveal elements
const reveals = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
  (entries, o) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        o.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
reveals.forEach((el) => obs.observe(el));

// Contact form basic simulation (no backend)
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
if (form) {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    formMsg.textContent = "Pesan terkirim — terima kasih!";
    setTimeout(() => (formMsg.textContent = ""), 4500);
    form.reset();
  });
}

// Ensure smooth closing when resizing to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768 && mobileMenu) {
    mobileMenu.classList.remove("is-active");
    if (burger) burger.classList.remove("is-active");
    lockScroll(false);
    setMenuAria(false);
    updateBackToTop();
  }
});

// Back to Top interactions
if (backToTop) {
  // Init styles
  initBackToTop();

  // Toggle visibility on scroll and on load
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  window.addEventListener("load", updateBackToTop);

  // Smooth scroll to top on click (fallback for browsers without CSS smooth scroll)
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
