/**
 * AGIFNA Reserve Conference 2026
 * Navigation, Scroll Reveal, Countdown, FAQ Accordion
 */
(function () {
  "use strict";

  const MOBILE_BP = 900;
  const SCROLL_THRESHOLD = 50;
  const INDICATOR_THRESHOLD = 150;
  const CONFERENCE_DATE = new Date("July 23, 2026 19:00:00 EST").getTime();

  // ============================
  // DOM REFERENCES
  // ============================
  const nav = document.querySelector(".main-nav");
  const navLinks = document.getElementById("navLinks");
  const mobileToggle = document.getElementById("mobileToggle");
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const countdownCard = document.querySelector(".countdown-card");
  const body = document.body;

  if (!nav || !navLinks || !mobileToggle) return;

  // ============================
  // MOBILE NAV
  // ============================
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  body.appendChild(backdrop);

  function openNav() {
    navLinks.classList.add("open");
    mobileToggle.classList.add("active");
    mobileToggle.setAttribute("aria-expanded", "true");
    backdrop.classList.add("active");
    body.classList.add("nav-open");
  }

  function closeNav() {
    navLinks.classList.remove("open");
    mobileToggle.classList.remove("active");
    mobileToggle.setAttribute("aria-expanded", "false");
    backdrop.classList.remove("active");
    body.classList.remove("nav-open");
  }

  function toggleNav() {
    navLinks.classList.contains("open") ? closeNav() : openNav();
  }

  mobileToggle.addEventListener("click", toggleNav);

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= MOBILE_BP) closeNav();
    });
  });

  backdrop.addEventListener("click", closeNav);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeNav();
      mobileToggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > MOBILE_BP && navLinks.classList.contains("open")) {
      closeNav();
    }
  });

  // ============================
  // SCROLL HANDLERS
  // ============================
  function handleNavScroll() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    nav.classList.toggle("scrolled", scrollPos > SCROLL_THRESHOLD);
  }

  // ---- Active nav highlight ----
  const sections = document.querySelectorAll("section[id]");
  const navItems = navLinks.querySelectorAll('a[href^="#"]');

  function highlightActiveNav() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const navHeight = nav.offsetHeight;
    const atBottom =
      scrollPos + window.innerHeight >=
      document.documentElement.scrollHeight - 50;

    let currentSection = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 100;
      if (
        scrollPos >= sectionTop &&
        scrollPos < sectionTop + section.offsetHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    if (atBottom && sections.length > 0) {
      currentSection = sections[sections.length - 1].getAttribute("id");
    }

    navItems.forEach(function (link) {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentSection,
      );
    });
  }

  // ---- Scroll indicator fade ----
  function handleScrollIndicator() {
    if (!scrollIndicator) return;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const hidden = scrollPos > INDICATOR_THRESHOLD;
    scrollIndicator.style.opacity = hidden ? "0" : "1";
    scrollIndicator.style.pointerEvents = hidden ? "none" : "auto";
  }

  // ---- Hero parallax ----
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  function handleHeroParallax() {
    if (!heroContent || prefersReducedMotion.matches) return;
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = hero.offsetHeight;

    if (scrollPos < heroHeight) {
      heroContent.style.transform = "translateY(" + scrollPos * 0.15 + "px)";
      heroContent.style.opacity = Math.max(
        1 - (scrollPos / heroHeight) * 0.6,
        0,
      );
    }
  }

  // ---- Unified scroll handler ----
  let ticking = false;

  function onScrollOptimized() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleNavScroll();
        highlightActiveNav();
        handleScrollIndicator();
        handleHeroParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScrollOptimized, { passive: true });

  // Run once on load
  highlightActiveNav();

  // ============================
  // SCROLL REVEAL (IntersectionObserver)
  // ============================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.15,
      },
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // ============================
  // SMOOTH SCROLL (fallback)
  // ============================
  navItems.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href && href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            nav.offsetHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          history.pushState(null, null, href);
        }
      }
    });
  });

  // ============================
  // FAQ ACCORDION
  // ============================
  const faqDetails = document.querySelectorAll(".faq-container details");

  faqDetails.forEach(function (detail) {
    const summary = detail.querySelector("summary");
    const content = detail.querySelector(".faq-content");

    if (!summary || !content) return;

    summary.addEventListener("click", function (e) {
      e.preventDefault();

      if (detail.classList.contains("is-open")) {
        // Close
        content.style.height = content.scrollHeight + "px";
        content.offsetHeight; // force reflow
        content.style.height = "0px";
        content.style.opacity = "0";
        detail.classList.remove("is-open");

        content.addEventListener("transitionend", function handler(ev) {
          if (ev.propertyName !== "height") return;
          detail.removeAttribute("open");
          content.removeEventListener("transitionend", handler);
        });
      } else {
        // Close others (single open)
        faqDetails.forEach(function (other) {
          if (other !== detail && other.classList.contains("is-open")) {
            const otherContent = other.querySelector(".faq-content");
            otherContent.style.height = otherContent.scrollHeight + "px";
            otherContent.offsetHeight;
            otherContent.style.height = "0px";
            otherContent.style.opacity = "0";
            other.classList.remove("is-open");

            otherContent.addEventListener(
              "transitionend",
              function handler(ev) {
                if (ev.propertyName !== "height") return;
                other.removeAttribute("open");
                otherContent.removeEventListener("transitionend", handler);
              },
            );
          }
        });

        // Open
        detail.setAttribute("open", "");
        const targetHeight = content.scrollHeight;
        content.style.height = "0px";
        content.style.opacity = "0";
        content.offsetHeight; // force reflow
        content.style.height = targetHeight + "px";
        content.style.opacity = "1";
        detail.classList.add("is-open");

        content.addEventListener("transitionend", function handler(ev) {
          if (ev.propertyName !== "height") return;
          content.style.height = "auto";
          content.removeEventListener("transitionend", handler);
        });
      }
    });
  });

  // ============================
  // COUNTDOWN TIMER
  // ============================
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minsEl = document.getElementById("cdMins");
  const secsEl = document.getElementById("cdSecs");

  if (daysEl && hoursEl && minsEl && secsEl) {
    const prevValues = { days: "", hours: "", mins: "", secs: "" };

    function flashTick(el) {
      el.classList.add("tick");
      setTimeout(function () {
        el.classList.remove("tick");
      }, 400);
    }

    function updateCountdown() {
      const distance = CONFERENCE_DATE - Date.now();

      if (distance < 0) {
        daysEl.textContent = "0";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        return;
      }

      const days = String(Math.floor(distance / (1000 * 60 * 60 * 24)));
      const hours = String(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      ).padStart(2, "0");
      const mins = String(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      ).padStart(2, "0");
      const secs = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(
        2,
        "0",
      );

      if (days !== prevValues.days) {
        daysEl.textContent = days;
        flashTick(daysEl);
        prevValues.days = days;
      }
      if (hours !== prevValues.hours) {
        hoursEl.textContent = hours;
        flashTick(hoursEl);
        prevValues.hours = hours;
      }
      if (mins !== prevValues.mins) {
        minsEl.textContent = mins;
        flashTick(minsEl);
        prevValues.mins = mins;
      }
      if (secs !== prevValues.secs) {
        secsEl.textContent = secs;
        flashTick(secsEl);
        prevValues.secs = secs;
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ============================
  // COUNTDOWN CARD REVEAL (IntersectionObserver)
  // ============================
  if (hero && countdownCard) {
    const cardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            countdownCard.classList.remove("hidden");
            countdownCard.classList.add("visible");
          } else {
            countdownCard.classList.remove("visible");
            countdownCard.classList.add("hidden");
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-90% 0px 0px 0px",
      },
    );

    cardObserver.observe(hero);
  }
})();
