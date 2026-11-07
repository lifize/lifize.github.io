(function () {
  var root = document.documentElement;
  var KEY = "lifize-theme";
  var themes = ["dark", "light", "beige", "sage"];

  function apply(name) {
    if (themes.indexOf(name) === -1) name = "dark";
    root.setAttribute("data-theme", name);
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.themeBtn === name));
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved || root.getAttribute("data-theme"));

  document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(btn.dataset.themeBtn);
      try { localStorage.setItem(KEY, btn.dataset.themeBtn); } catch (e) {}
    });
  });
})();
