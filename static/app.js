(function () {
  document.documentElement.classList.add("js");

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var desktopNav = window.matchMedia("(min-width: 1025px)");

  function setNavOpen(open) {
    if (!toggle || !nav) {
      return;
    }
    if (desktopNav.matches) {
      open = false;
    }
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setNavOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".mast")) {
        setNavOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setNavOpen(false);
      }
    });
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          setNavOpen(false);
        }
      });
    }
    if (desktopNav.addEventListener) {
      desktopNav.addEventListener("change", function () {
        setNavOpen(false);
      });
    }
  }

  var sections = document.querySelectorAll(".board-section[id]");
  if (nav && sections.length && "IntersectionObserver" in window) {
    var sectionLinks = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      sectionLinks[a.getAttribute("href").slice(1)] = a;
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          var id = entry.target.id;
          Object.keys(sectionLinks).forEach(function (key) {
            if (sectionLinks[key]) {
              if (key === id) {
                sectionLinks[key].setAttribute("aria-current", "location");
              } else {
                sectionLinks[key].removeAttribute("aria-current");
              }
            }
          });
        });
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function clock() {
    const d = new Date();
    return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }

  function tick() {
    document.querySelectorAll("[data-live-clock]").forEach(function (el) {
      el.textContent = clock();
    });
  }

  tick();
  setInterval(tick, 250);

  document.querySelectorAll("input[data-clock]").forEach(function (input) {
    input.setAttribute("autocomplete", "off");
    input.setAttribute("inputmode", "numeric");
    input.setAttribute("placeholder", "HH:MM:SS");
  });
})();
