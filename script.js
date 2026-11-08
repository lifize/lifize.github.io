(function () {
  var root = document.documentElement;
  var KEY = "lifize-theme";
  var themes = ["dark", "light"];
  var toggle = document.getElementById("themeToggle");

  function apply(name) {
    if (themes.indexOf(name) === -1) name = "dark";
    root.setAttribute("data-theme", name);
    if (toggle) {
      toggle.setAttribute("aria-label", name === "dark" ? "Включить светлую тему" : "Включить тёмную тему");
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved || root.getAttribute("data-theme"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      var name = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, name); } catch (e) {}

      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduce) {
        apply(name);
        return;
      }

      var rect = toggle.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      root.classList.add("theme-switching");
      var transition = document.startViewTransition(function () { apply(name); });

      transition.ready.then(function () {
        root.animate(
          {
            clipPath: [
              "circle(0px at " + x + "px " + y + "px)",
              "circle(" + radius + "px at " + x + "px " + y + "px)"
            ]
          },
          {
            duration: 750,
            easing: "cubic-bezier(.4, 0, .2, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });

      transition.finished.finally(function () {
        root.classList.remove("theme-switching");
      });
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        el.classList.add("is-visible");
        var delay = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
        setTimeout(function () { el.classList.remove("reveal", "is-visible"); }, 900 + delay);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    document.querySelectorAll(
      ".hero__inner > *, .section__title, .band__lead, .album, .card, .member, .tour-empty, .info__item"
    ).forEach(function (el) {
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", Math.min(index * 90, 360) + "ms");
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
