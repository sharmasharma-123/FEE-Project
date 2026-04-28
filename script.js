/* ============================================================
   IndiaPolity — Enhanced script.js
   Features: Active nav, search/filter, news filter, dark mode,
   quiz, did-you-know, compare charts, AI chatbot, contact form,
   scroll animations, back-to-top, timeline, party progress bars
   ============================================================ */

/* ── 1. ACTIVE NAV LINK ── */
(function () {
  var links = document.querySelectorAll(".nav-links a");
  var x = window.location.href;
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (href !== "index.html" && x.indexOf(href) !== -1) {
      links[i].classList.add("active");
    } else if ((x.endsWith("/") || x.endsWith("index.html")) && href === "index.html") {
      links[i].classList.add("active");
    }
  }
})();

/* ── 2. FOOTER YEAR ── */
(function () {
  var yr = document.getElementById("footerYear");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ── 3. DARK MODE TOGGLE ── */
(function () {
  var btn = document.getElementById("darkToggle");
  if (!btn) return;
  var saved = localStorage.getItem("indiapolity-dark");
  if (saved === "1") {
    document.body.classList.add("dark");
    btn.textContent = "☀ Light";
  }
  btn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    var isDark = document.body.classList.contains("dark");
    localStorage.setItem("indiapolity-dark", isDark ? "1" : "0");
    btn.textContent = isDark ? "☀ Light" : "🌙 Dark";
  });
})();

/* ── 4. MOBILE MENU ── */
(function () {
  var menuBtn = document.getElementById("menuToggle");
  var navList = document.getElementById("navList");
  if (!menuBtn || !navList) return;
  menuBtn.addEventListener("click", function () {
    var open = navList.classList.toggle("nav-open");
    menuBtn.textContent = open ? "✕" : "☰ Menu";
  });
})();

/* ── 5. BACK TO TOP ── */
(function () {
  var topBtn = document.getElementById("topBtn");
  if (!topBtn) return;
  window.addEventListener("scroll", function () {
    topBtn.style.display = document.documentElement.scrollTop > 280 ? "block" : "none";
  });
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ── 6. SCROLL REVEAL ANIMATION ── */
(function () {
  var els = document.querySelectorAll(".info-section, .party-card, .news-card, .leader-card, .compare-wrapper, .timeline-item");
  if (!els.length || !window.IntersectionObserver) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) {
    el.classList.add("reveal-on-scroll");
    observer.observe(el);
  });
})();

/* ── 7. HOME SEARCH & FILTER ── */
(function () {
  var searchBtn = document.getElementById("searchBtn");
  var searchInput = document.getElementById("searchInput");
  var filterSelect = document.getElementById("filterSelect");
  var cards = document.querySelectorAll(".party-card");
  if (!cards.length) return;

  var partyData = [
    { name: "bharatiya janata party bjp right nationalism", ideology: "right", el: cards[0] },
    { name: "indian national congress inc centrist secularism", ideology: "centrist", el: cards[1] },
    { name: "aam aadmi party aap centrist anti-corruption", ideology: "centrist", el: cards[2] },
    { name: "all india trinamool congress tmc regional federalism", ideology: "regional", el: cards[3] }
  ];

  function filterCards() {
    var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var ideology = filterSelect ? filterSelect.value : "all";
    var anyVisible = false;
    for (var i = 0; i < partyData.length; i++) {
      var p = partyData[i];
      var matchSearch = query === "" || p.name.indexOf(query) !== -1;
      var matchFilter = ideology === "all" || p.ideology === ideology;
      var show = matchSearch && matchFilter;
      p.el.style.display = show ? "" : "none";
      if (show) anyVisible = true;
    }
    var noResult = document.getElementById("noResult");
    if (noResult) noResult.style.display = anyVisible ? "none" : "block";
  }

  if (searchBtn) searchBtn.addEventListener("click", filterCards);
  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") filterCards();
    });
    searchInput.addEventListener("input", function () {
      if (this.value === "") filterCards();
    });
  }
  if (filterSelect) filterSelect.addEventListener("change", filterCards);
})();

/* ── 8. NEWS FILTER (FUNCTIONAL) ── */
(function () {
  var newsFilter = document.getElementById("newsFilter");
  var newsCards = document.querySelectorAll(".news-card");
  if (!newsFilter || !newsCards.length) return;

  newsFilter.addEventListener("change", function () {
    var val = this.value.toLowerCase();
    var count = 0;
    for (var i = 0; i < newsCards.length; i++) {
      var tag = newsCards[i].querySelector(".party-tag");
      var match = val === "all" || (tag && tag.textContent.toLowerCase().trim() === val);
      newsCards[i].style.display = match ? "" : "none";
      if (match) count++;
    }
    var info = document.getElementById("newsCount");
    if (info) info.textContent = "Showing " + count + " article" + (count !== 1 ? "s" : "");
  });
})();

/* ── 9. COMPARE TABLE ROW HIGHLIGHT ── */
(function () {
  var rows = document.querySelectorAll(".compare-table tbody tr");
  for (var j = 0; j < rows.length; j++) {
    rows[j].addEventListener("click", (function (row) {
      return function () {
        for (var k = 0; k < rows.length; k++) rows[k].classList.remove("highlighted");
        row.classList.add("highlighted");
      };
    })(rows[j]));
  }
  var style = document.createElement("style");
  style.textContent = ".highlighted td { background:#ffe8d0 !important; font-weight:600; }";
  document.head.appendChild(style);
})();

/* ── 10. CHART.JS — BAR CHART (Seats) ── */
(function () {
  var canvas = document.getElementById("seatsChart");
  if (!canvas) return;
  function tryChart() {
    if (typeof Chart === "undefined") { setTimeout(tryChart, 200); return; }
    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["BJP", "Congress", "AAP", "TMC"],
        datasets: [{
          label: "Lok Sabha Seats 2024",
          data: [240, 99, 3, 29],
          backgroundColor: ["#f4a04a", "#c45a00", "#f4d0a0", "#b84d00"],
          borderRadius: 10,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.y + " seats"; } } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: "#777" }, grid: { color: "#f4d0a030" } },
          x: { ticks: { color: "#555", font: { weight: "700" } }, grid: { display: false } }
        }
      }
    });
  }
  tryChart();
})();

/* ── 11. CHART.JS — RADAR CHART (Policy) ── */
(function () {
  var canvas = document.getElementById("radarChart");
  if (!canvas) return;
  function tryRadar() {
    if (typeof Chart === "undefined") { setTimeout(tryRadar, 200); return; }
    new Chart(canvas, {
      type: "radar",
      data: {
        labels: ["Welfare", "Nationalism", "Federalism", "Anti-Corruption", "Secularism"],
        datasets: [
          { label: "BJP", data: [7, 10, 4, 5, 3], borderColor: "#f4a04a", backgroundColor: "rgba(244,160,74,0.12)", pointBackgroundColor: "#f4a04a" },
          { label: "Congress", data: [7, 5, 6, 6, 9], borderColor: "#c45a00", backgroundColor: "rgba(196,90,0,0.10)", pointBackgroundColor: "#c45a00" },
          { label: "AAP", data: [9, 4, 5, 10, 7], borderColor: "#b84d00", backgroundColor: "rgba(184,77,0,0.08)", pointBackgroundColor: "#b84d00" },
          { label: "TMC", data: [8, 4, 10, 5, 8], borderColor: "#e07020", backgroundColor: "rgba(224,112,32,0.08)", pointBackgroundColor: "#e07020" }
        ]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true, max: 10, ticks: { stepSize: 2, font: { size: 10 }, color: "#999" },
            grid: { color: "#f4d0a040" },
            pointLabels: { font: { size: 12 }, color: "#555" }
          }
        },
        plugins: { legend: { position: "bottom", labels: { color: "#555" } } }
      }
    });
  }
  tryRadar();
})();

/* ── 12. CONTACT FORM ── */
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = document.getElementById("userName").value.trim();
    var em = document.getElementById("userEmail").value.trim();
    var msg = document.getElementById("userMsg").value.trim();
    var submitBtn = form.querySelector("button[type=submit]");

    var errEl = document.getElementById("formError");
    if (!errEl) {
      errEl = document.createElement("div");
      errEl.id = "formError";
      errEl.style.cssText = "background:#fdecea;border:1px solid #f44336;padding:10px 16px;border-radius:8px;color:#b71c1c;font-size:0.88rem;margin-bottom:14px;display:none;";
      form.insertBefore(errEl, form.firstChild);
    }

    if (!n || !em || !msg) {
      errEl.textContent = "⚠ Please fill in all required fields.";
      errEl.style.display = "block";
      setTimeout(function () { errEl.style.display = "none"; }, 4000);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      errEl.textContent = "⚠ Please enter a valid email address.";
      errEl.style.display = "block";
      setTimeout(function () { errEl.style.display = "none"; }, 4000);
      return;
    }

    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    // Simulate send (replace action with real Formspree endpoint)
    setTimeout(function () {
      var ok = document.getElementById("successMsg");
      if (ok) ok.style.display = "block";
      form.reset();
      submitBtn.textContent = "Submit";
      submitBtn.disabled = false;
    }, 1000);
  });
})();

/* ── 13. DID YOU KNOW ── */
(function () {
  var facts = [
    "India has over 2,500 registered political parties — the largest number in any democracy.",
    "The Indian National Congress is older than India's independence — it was founded in 1885.",
    "BJP is considered one of the largest political parties in the world by primary membership.",
    "AAP won 67 out of 70 Delhi assembly seats in 2015 — a record-breaking landslide.",
    "TMC ended 34 years of uninterrupted Left Front rule in West Bengal in 2011.",
    "India's first general election (1951–52) had over 173 million eligible voters.",
    "The Election Commission of India was established on 25 January 1950.",
    "India uses the First Past The Post (FPTP) system for Lok Sabha elections.",
    "The Lok Sabha has 543 directly elected seats representing all states and UTs.",
    "India's voter ID cards are officially called EPIC — Electors Photo Identity Card."
  ];

  var box = document.getElementById("didYouKnow");
  if (!box) return;
  var idx = 0;

  function showFact() {
    box.style.opacity = "0";
    box.style.transform = "translateY(6px)";
    setTimeout(function () {
      box.textContent = "💡 " + facts[idx];
      box.style.opacity = "1";
      box.style.transform = "translateY(0)";
      idx = (idx + 1) % facts.length;
    }, 350);
  }
  box.style.transition = "opacity 0.35s ease, transform 0.35s ease";
  showFact();
  setInterval(showFact, 6000);
})();

/* ── 14. PROGRESS BARS (party pages) ── */
(function () {
  var bars = document.querySelectorAll(".progress-bar[data-value]");
  if (!bars.length || !window.IntersectionObserver) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        var val = bar.getAttribute("data-value");
        setTimeout(function () { bar.style.width = val + "%"; }, 120);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function (b) {
    b.style.width = "0%";
    b.style.transition = "width 1s ease";
    observer.observe(b);
  });
})();

/* ── 15. PARTY QUIZ ── */
(function () {
  var quizContainer = document.getElementById("quizContainer");
  if (!quizContainer) return;

  var questions = [
    {
      q: "What should the government prioritise most?",
      options: ["National security & defence", "Free education & healthcare", "Fighting corruption first", "State rights & local welfare"],
      scores: [
        { BJP: 3, Congress: 1, AAP: 0, TMC: 0 },
        { BJP: 0, Congress: 2, AAP: 3, TMC: 2 },
        { BJP: 0, Congress: 1, AAP: 3, TMC: 1 },
        { BJP: 1, Congress: 1, AAP: 1, TMC: 3 }
      ]
    },
    {
      q: "What is your view on religion in politics?",
      options: ["Cultural unity is important", "Strict separation of religion & state", "Governance matters more than religion", "Protect regional cultural identity"],
      scores: [
        { BJP: 3, Congress: 0, AAP: 1, TMC: 0 },
        { BJP: 0, Congress: 3, AAP: 2, TMC: 2 },
        { BJP: 1, Congress: 1, AAP: 3, TMC: 1 },
        { BJP: 0, Congress: 1, AAP: 1, TMC: 3 }
      ]
    },
    {
      q: "Which economic policy do you support?",
      options: ["Market-driven, business-friendly", "Mixed economy with safety nets", "Subsidised utilities for all citizens", "State-level welfare programs"],
      scores: [
        { BJP: 3, Congress: 1, AAP: 0, TMC: 0 },
        { BJP: 1, Congress: 3, AAP: 1, TMC: 1 },
        { BJP: 0, Congress: 1, AAP: 3, TMC: 2 },
        { BJP: 0, Congress: 1, AAP: 2, TMC: 3 }
      ]
    },
    {
      q: "Which issue matters most to you personally?",
      options: ["Terrorism & border security", "Social equality & reservations", "Free electricity, water, schools", "Local language & cultural rights"],
      scores: [
        { BJP: 3, Congress: 1, AAP: 0, TMC: 0 },
        { BJP: 0, Congress: 3, AAP: 1, TMC: 2 },
        { BJP: 0, Congress: 0, AAP: 3, TMC: 1 },
        { BJP: 0, Congress: 1, AAP: 0, TMC: 3 }
      ]
    }
  ];

  var totals = { BJP: 0, Congress: 0, AAP: 0, TMC: 0 };
  var current = 0;

  var partyMeta = {
    BJP:     { color: "#f4a04a", desc: "You value strong governance, national security, and economic development.", link: "bjp.html" },
    Congress:{ color: "#c45a00", desc: "You believe in secularism, social equity, and a mixed economy.", link: "congress.html" },
    AAP:     { color: "#b84d00", desc: "You prioritise grassroots governance, free utilities, and anti-corruption.", link: "aap.html" },
    TMC:     { color: "#e07020", desc: "You champion regional identity, federalism, and social welfare schemes.", link: "tmc.html" }
  };

  function renderQuestion() {
    var q = questions[current];
    var progress = Math.round((current / questions.length) * 100);
    var html =
      '<div class="quiz-progress-wrap"><div class="quiz-bar" style="width:' + progress + '%"></div></div>' +
      '<p class="quiz-step">Question ' + (current + 1) + ' of ' + questions.length + '</p>' +
      '<h3 class="quiz-q">' + q.q + '</h3>' +
      '<div class="quiz-options">';
    for (var i = 0; i < q.options.length; i++) {
      html += '<button class="quiz-opt" data-idx="' + i + '">' + q.options[i] + '</button>';
    }
    html += '</div>';
    quizContainer.innerHTML = html;

    var opts = quizContainer.querySelectorAll(".quiz-opt");
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener("click", (function (idx) {
        return function () {
          var sc = questions[current].scores[idx];
          var keys = Object.keys(sc);
          for (var k = 0; k < keys.length; k++) totals[keys[k]] += sc[keys[k]];
          current++;
          if (current < questions.length) renderQuestion();
          else showResult();
        };
      })(parseInt(opts[j].getAttribute("data-idx"))));
    }
  }

  function showResult() {
    var winner = Object.keys(totals).reduce(function (a, b) { return totals[a] > totals[b] ? a : b; });
    var info = partyMeta[winner];
    var scoreHTML = "";
    var partyKeys = Object.keys(totals);
    for (var i = 0; i < partyKeys.length; i++) {
      var k = partyKeys[i];
      var pct = Math.round((totals[k] / 12) * 100);
      scoreHTML +=
        '<div class="quiz-score-row">' +
        '<span class="quiz-score-label">' + k + '</span>' +
        '<div class="quiz-score-bar"><div class="quiz-score-fill" style="width:' + pct + '%;background:' + partyMeta[k].color + '"></div></div>' +
        '<span class="quiz-score-pct">' + pct + '%</span>' +
        '</div>';
    }
    quizContainer.innerHTML =
      '<div class="quiz-result">' +
      '<div class="quiz-result-badge" style="background:' + info.color + '">' + winner + '</div>' +
      '<h3>Your views align with <strong>' + winner + '</strong>!</h3>' +
      '<p>' + info.desc + '</p>' +
      '<div class="quiz-scores">' + scoreHTML + '</div>' +
      '<div class="quiz-result-btns">' +
      '<a href="' + info.link + '" class="btn-visit">Learn about ' + winner + ' →</a>' +
      '<button class="quiz-restart btn-outline" id="quizRetake">↺ Retake Quiz</button>' +
      '</div></div>';

    document.getElementById("quizRetake").addEventListener("click", function () {
      totals = { BJP: 0, Congress: 0, AAP: 0, TMC: 0 };
      current = 0;
      renderQuestion();
    });
  }

  renderQuestion();
})();

/* ── 16. AI CHATBOT ── */
(function () {
  var chatBtn = document.getElementById("chatToggle");
  var chatBox = document.getElementById("chatBox");
  var chatInput = document.getElementById("chatInput");
  var chatSend = document.getElementById("chatSend");
  var chatMessages = document.getElementById("chatMessages");
  if (!chatBtn || !chatBox) return;

  var isOpen = false;
  var history = [];

  chatBtn.addEventListener("click", function () {
    isOpen = !isOpen;
    chatBox.style.display = isOpen ? "flex" : "none";
    chatBtn.textContent = isOpen ? "✕" : "🤖";
    if (isOpen && chatMessages.children.length === 0) {
      appendMsg("bot", "Namaste! 🇮🇳 Ask me anything about Indian political parties — BJP, Congress, AAP, or TMC!");
    }
    if (isOpen && chatInput) setTimeout(function () { chatInput.focus(); }, 100);
  });

  async function sendMsg() {
    var text = chatInput ? chatInput.value.trim() : "";
    if (!text) return;
    appendMsg("user", text);
    chatInput.value = "";
    var typing = appendMsg("bot", "Thinking…");
    history.push({ role: "user", content: text });

    try {
      var res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are IndiaPolity Assistant — a neutral, factual, concise guide about Indian political parties (BJP, Congress, AAP, TMC). Answer in 2-4 sentences. Stay on Indian politics topics only. Be friendly and use simple language.",
          messages: history
        })
      });
      var data = await res.json();
      var reply = (data.content && data.content[0]) ? data.content[0].text : "Sorry, I could not get a response. Please try again.";
      typing.textContent = reply;
      history.push({ role: "assistant", content: reply });
    } catch (err) {
      typing.textContent = "Connection error. Please try again shortly.";
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendMsg(role, text) {
    var div = document.createElement("div");
    div.className = "chat-msg chat-" + role;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  if (chatSend) chatSend.addEventListener("click", sendMsg);
  if (chatInput) chatInput.addEventListener("keydown", function (e) { if (e.key === "Enter") sendMsg(); });
})();

/* ══════════════════════════════════════════════════════════════
   ADDITIONAL DOM & JAVASCRIPT FEATURES — Part 2
   ══════════════════════════════════════════════════════════════ */

/* ── 17. TOAST NOTIFICATION SYSTEM ── */
window.IndiaPolityToast = (function () {
  var container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.style.cssText =
        "position:fixed;top:72px;right:18px;z-index:9999;display:flex;" +
        "flex-direction:column;gap:8px;pointer-events:none;";
      document.body.appendChild(container);
    }
    return container;
  }

  function show(msg, type, duration) {
    type = type || "info";
    duration = duration || 3000;
    var colors = { info: "#f4a04a", success: "#43a047", error: "#e53935", warning: "#fb8c00" };
    var icons  = { info: "ℹ", success: "✅", error: "❌", warning: "⚠" };

    var toast = document.createElement("div");
    toast.style.cssText =
      "background:#fff;border-left:4px solid " + colors[type] + ";padding:11px 16px;" +
      "border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.13);font-size:0.85rem;" +
      "color:#333;max-width:280px;pointer-events:all;opacity:0;" +
      "transform:translateX(20px);transition:all 0.3s ease;";
    toast.textContent = icons[type] + "  " + msg;

    getContainer().appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });

    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(function () { toast.remove(); }, 320);
    }, duration);
  }

  return { show: show };
})();

/* ── 18. PAGE VISIT COUNTER (localStorage) ── */
(function () {
  var key = "indiapolity-visits";
  var page = window.location.pathname.split("/").pop() || "index.html";
  var stored = localStorage.getItem(key);
  var visits = stored ? JSON.parse(stored) : {};
  visits[page] = (visits[page] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(visits));

  var el = document.getElementById("visitCount");
  if (el) {
    el.textContent = "You've visited this page " + visits[page] + " time" + (visits[page] !== 1 ? "s" : "");
    el.style.cssText = "font-size:0.75rem;color:#aaa;text-align:center;padding:4px 0 10px;";
  }

  // Show toast on first visit to a party page
  var partyPages = ["bjp.html", "congress.html", "aap.html", "tmc.html"];
  if (partyPages.indexOf(page) !== -1 && visits[page] === 1) {
    setTimeout(function () {
      window.IndiaPolityToast.show("First time visiting this page! Explore the timeline below.", "info", 4000);
    }, 1200);
  }
})();

/* ── 19. READING TIME ESTIMATOR ── */
(function () {
  var sections = document.querySelectorAll(".info-section p, .info-section li");
  if (!sections.length) return;

  var totalWords = 0;
  sections.forEach(function (el) {
    totalWords += el.textContent.trim().split(/\s+/).length;
  });

  var minutes = Math.max(1, Math.ceil(totalWords / 200));
  var badge = document.getElementById("readingTime");
  if (badge) {
    badge.textContent = "📖 " + minutes + " min read";
    badge.style.cssText =
      "display:inline-block;background:var(--light);border:1px solid var(--border);" +
      "padding:4px 12px;border-radius:12px;font-size:0.76rem;color:var(--muted);" +
      "margin-left:10px;vertical-align:middle;";
  }
})();

/* ── 20. LIVE CHARACTER COUNTER FOR TEXTAREA ── */
(function () {
  var textarea = document.getElementById("userMsg");
  var counter  = document.getElementById("charCount");
  if (!textarea) return;

  var MAX = 500;

  if (!counter) {
    counter = document.createElement("div");
    counter.id = "charCount";
    counter.style.cssText =
      "font-size:0.76rem;text-align:right;margin-top:4px;color:var(--muted);transition:color 0.2s;";
    textarea.parentNode.insertBefore(counter, textarea.nextSibling);
  }

  function update() {
    var len = textarea.value.length;
    var remaining = MAX - len;
    counter.textContent = remaining + " characters remaining";
    if (remaining < 50)  counter.style.color = "#e53935";
    else if (remaining < 150) counter.style.color = "#fb8c00";
    else counter.style.color = "var(--muted)";

    if (len > MAX) {
      textarea.value = textarea.value.substring(0, MAX);
      window.IndiaPolityToast.show("Message limit of 500 characters reached.", "warning");
    }
  }

  textarea.addEventListener("input", update);
  update();
})();

/* ── 21. TOOLTIP SYSTEM ── */
(function () {
  var tip = document.createElement("div");
  tip.id = "domTooltip";
  tip.style.cssText =
    "position:fixed;z-index:8888;background:#333;color:#fff;padding:6px 12px;" +
    "border-radius:8px;font-size:0.78rem;pointer-events:none;opacity:0;" +
    "transition:opacity 0.2s;max-width:220px;line-height:1.4;box-shadow:0 4px 10px rgba(0,0,0,0.2);";
  document.body.appendChild(tip);

  var tooltipData = {
    ".tag[data-tip]": true
  };

  document.body.addEventListener("mouseover", function (e) {
    var el = e.target.closest("[data-tip]");
    if (!el) return;
    tip.textContent = el.getAttribute("data-tip");
    tip.style.opacity = "1";
  });

  document.body.addEventListener("mousemove", function (e) {
    tip.style.left = (e.clientX + 14) + "px";
    tip.style.top  = (e.clientY - 8) + "px";
  });

  document.body.addEventListener("mouseout", function (e) {
    if (!e.target.closest("[data-tip]")) tip.style.opacity = "0";
  });

  // Attach tooltips to tags on party pages
  var tags = document.querySelectorAll(".tag");
  var tagTips = {
    "Founded": "The year this political party was officially established.",
    "Ideology": "The core political belief system the party follows.",
    "Symbol": "The official election symbol recognised by the Election Commission of India.",
    "HQ": "Headquarters — the main office location of the party."
  };

  tags.forEach(function (tag) {
    var text = tag.textContent.split(":")[0].trim();
    if (tagTips[text]) tag.setAttribute("data-tip", tagTips[text]);
  });

  // Tooltips for nav links
  var navTips = {
    "bjp.html":      "Bharatiya Janata Party — Founded 1980",
    "congress.html": "Indian National Congress — Founded 1885",
    "aap.html":      "Aam Aadmi Party — Founded 2012",
    "tmc.html":      "All India Trinamool Congress — Founded 1998",
    "compare.html":  "Compare parties side by side with charts",
    "news.html":     "Latest political news and updates",
    "contact.html":  "Send feedback about the website"
  };

  var navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(function (a) {
    var href = a.getAttribute("href");
    if (navTips[href]) a.setAttribute("data-tip", navTips[href]);
  });
})();

/* ── 22. ANIMATED STATS COUNTER ── */
(function () {
  var counters = document.querySelectorAll(".stat-count[data-target]");
  if (!counters.length || !window.IntersectionObserver) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute("data-target"), 10);
      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
})();

/* ── 23. SORTABLE COMPARE TABLE ── */
(function () {
  var table = document.querySelector(".compare-table");
  if (!table) return;
  var headers = table.querySelectorAll("thead th");

  headers.forEach(function (th, colIdx) {
    if (colIdx === 0) return; // skip "Feature" column
    th.style.cursor = "pointer";
    th.setAttribute("title", "Click to sort by " + th.textContent.trim());
    th.setAttribute("data-tip", "Click to sort by " + th.textContent.trim());

    var asc = true;
    th.addEventListener("click", function () {
      var tbody = table.querySelector("tbody");
      var rows  = Array.prototype.slice.call(tbody.querySelectorAll("tr"));

      rows.sort(function (a, b) {
        var aVal = a.cells[colIdx] ? a.cells[colIdx].textContent.trim() : "";
        var bVal = b.cells[colIdx] ? b.cells[colIdx].textContent.trim() : "";
        var aNum = parseFloat(aVal);
        var bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) return asc ? aNum - bNum : bNum - aNum;
        return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      rows.forEach(function (r) { tbody.appendChild(r); });

      // Reset all header indicators
      headers.forEach(function (h) { h.textContent = h.textContent.replace(/ [▲▼]$/, ""); });
      th.textContent = th.textContent + (asc ? " ▲" : " ▼");
      asc = !asc;

      window.IndiaPolityToast.show("Table sorted by " + th.textContent.replace(/ [▲▼]$/, "").trim(), "info", 1800);
    });
  });
})();

/* ── 24. KEYBOARD SHORTCUTS ── */
(function () {
  var shortcuts = {
    "h": "index.html",
    "b": "bjp.html",
    "c": "congress.html",
    "a": "aap.html",
    "t": "tmc.html",
    "n": "news.html",
    "p": "compare.html",
    "q": "contact.html"
  };

  var helpVisible = false;

  document.addEventListener("keydown", function (e) {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

    var key = e.key.toLowerCase();

    if (key === "?" || (e.shiftKey && key === "/")) {
      toggleHelp();
      return;
    }

    if (key === "escape") {
      removeHelp();
      var chatBox = document.getElementById("chatBox");
      if (chatBox) chatBox.style.display = "none";
      var chatBtn = document.getElementById("chatToggle");
      if (chatBtn) chatBtn.textContent = "🤖";
      return;
    }

    if (key === "d") {
      var darkBtn = document.getElementById("darkToggle");
      if (darkBtn) darkBtn.click();
      window.IndiaPolityToast.show("Dark mode toggled (shortcut: D)", "info", 2000);
      return;
    }

    if (shortcuts[key]) {
      window.IndiaPolityToast.show("Navigating to " + shortcuts[key].replace(".html", "").toUpperCase() + "…", "info", 1500);
      setTimeout(function () { window.location.href = shortcuts[key]; }, 500);
    }
  });

  function toggleHelp() {
    if (helpVisible) { removeHelp(); return; }
    helpVisible = true;
    var overlay = document.createElement("div");
    overlay.id = "kbHelp";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:10000;" +
      "display:flex;align-items:center;justify-content:center;";

    var box = document.createElement("div");
    box.style.cssText =
      "background:var(--card-bg,#fff);border-radius:18px;padding:28px 32px;" +
      "max-width:420px;width:90%;box-shadow:0 12px 40px rgba(0,0,0,0.25);";

    var rows = [
      ["H", "Go to Home"],
      ["B", "Go to BJP"],
      ["C", "Go to Congress"],
      ["A", "Go to AAP"],
      ["T", "Go to TMC"],
      ["N", "Go to News"],
      ["P", "Compare Parties"],
      ["Q", "Contact Page"],
      ["D", "Toggle Dark Mode"],
      ["?", "Show/Hide this help"],
      ["ESC", "Close overlays"]
    ];

    var html = "<h3 style='color:var(--orange-dk,#c45a00);margin-bottom:16px;'>⌨ Keyboard Shortcuts</h3>" +
      "<table style='width:100%;border-collapse:collapse;font-size:0.88rem;'>";
    rows.forEach(function (r) {
      html += "<tr><td style='padding:5px 0;'><kbd style='background:var(--border,#f4d0a0);border-radius:5px;" +
        "padding:2px 8px;font-family:monospace;font-size:0.82rem;'>" + r[0] + "</kbd></td>" +
        "<td style='padding:5px 0 5px 14px;color:var(--muted,#666);'>" + r[1] + "</td></tr>";
    });
    html += "</table><p style='margin-top:16px;font-size:0.76rem;color:#aaa;'>Press ESC or ? to close</p>";

    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) removeHelp(); });
  }

  function removeHelp() {
    helpVisible = false;
    var el = document.getElementById("kbHelp");
    if (el) el.remove();
  }

  // Show hint toast on home page only
  if (window.location.href.indexOf("index.html") !== -1 || window.location.pathname === "/" || window.location.pathname.endsWith("/")) {
    setTimeout(function () {
      window.IndiaPolityToast.show("Tip: Press ? to see keyboard shortcuts", "info", 4000);
    }, 2500);
  }
})();

/* ── 25. STICKY SECTION HEADER TRACKER ── */
(function () {
  var sections = document.querySelectorAll(".info-section");
  if (!sections.length || !window.IntersectionObserver) return;

  var indicator = document.getElementById("sectionIndicator");
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = "sectionIndicator";
    indicator.style.cssText =
      "position:fixed;bottom:80px;left:18px;background:var(--orange);color:#fff;" +
      "padding:6px 14px;border-radius:20px;font-size:0.76rem;font-weight:600;" +
      "opacity:0;transition:opacity 0.3s;z-index:500;pointer-events:none;max-width:200px;" +
      "box-shadow:0 2px 10px rgba(244,160,74,0.4);";
    document.body.appendChild(indicator);
  }

  var hideTimer = null;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var heading = entry.target.querySelector("h2");
        if (heading) {
          indicator.textContent = "📍 " + heading.textContent.replace(/[↑▲▼]/g, "").trim();
          indicator.style.opacity = "1";
          clearTimeout(hideTimer);
          hideTimer = setTimeout(function () { indicator.style.opacity = "0"; }, 2000);
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (s) { observer.observe(s); });
})();

/* ── 26. COPY-TO-CLIPBOARD ON LEADER CARD CLICK ── */
(function () {
  var leaderCards = document.querySelectorAll(".leader-card");
  leaderCards.forEach(function (card) {
    card.setAttribute("data-tip", "Click to copy leader name");
    card.addEventListener("click", function () {
      var name = card.querySelector("h4");
      var role = card.querySelector("span");
      if (!name) return;
      var text = name.textContent.trim() + (role ? " — " + role.textContent.trim() : "");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          window.IndiaPolityToast.show("Copied: " + text, "success", 2500);
        });
      } else {
        // Fallback
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select(); document.execCommand("copy");
        ta.remove();
        window.IndiaPolityToast.show("Copied: " + text, "success", 2500);
      }
    });
  });
})();

/* ── 27. DYNAMIC PAGE TITLE UPDATER ── */
(function () {
  var originalTitle = document.title;
  var messages = [
    "🇮🇳 " + originalTitle,
    "🗳 Explore Indian Politics",
    "📊 BJP · Congress · AAP · TMC",
    "🇮🇳 " + originalTitle
  ];
  var idx = 0;

  // Rotate title when tab is hidden (just for fun)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      idx = 1;
      var interval = setInterval(function () {
        document.title = messages[idx % messages.length];
        idx++;
        if (!document.hidden || idx > messages.length * 2) {
          clearInterval(interval);
          document.title = originalTitle;
        }
      }, 1200);
    } else {
      document.title = originalTitle;
    }
  });
})();

/* ── 28. AUTO-HIGHLIGHT SEARCH TERM IN PARTY CARDS ── */
(function () {
  var searchInput = document.getElementById("searchInput");
  var searchBtn   = document.getElementById("searchBtn");
  if (!searchInput) return;

  function highlightCards(query) {
    // Remove old highlights first
    document.querySelectorAll(".search-highlight").forEach(function (el) {
      var parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
    if (!query) return;

    var cardTexts = document.querySelectorAll(".party-card h3, .party-card p");
    cardTexts.forEach(function (el) {
      var html = el.innerHTML;
      var regex = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      el.innerHTML = html.replace(regex,
        '<span class="search-highlight" style="background:#ffe082;border-radius:3px;padding:0 2px;">$1</span>');
    });
  }

  if (searchBtn) searchBtn.addEventListener("click", function () {
    highlightCards(searchInput.value.trim());
  });
  searchInput.addEventListener("input", function () {
    if (!this.value) highlightCards("");
  });
})();

/* ── 29. TABLE ROW HOVER PARTY COLOR ── */
(function () {
  var partyColors = { "BJP": "#fff3e0", "Congress": "#fce4ec", "AAP": "#e8f5e9", "TMC": "#e3f2fd" };
  var rows = document.querySelectorAll(".compare-table tbody tr");
  rows.forEach(function (row) {
    row.addEventListener("mouseenter", function () {
      var cells = row.querySelectorAll("td");
      // Try to detect which party column is hovered — colour lightly
      cells.forEach(function (cell, idx) {
        var party = ["", "BJP", "Congress", "AAP", "TMC"][idx];
        if (party && partyColors[party]) {
          cell.style.background = partyColors[party];
          cell.style.transition = "background 0.2s";
        }
      });
    });
    row.addEventListener("mouseleave", function () {
      row.querySelectorAll("td").forEach(function (cell) {
        cell.style.background = "";
      });
    });
  });
})();

/* ── 30. SMOOTH HASH SCROLL + ACTIVE SECTION NAV ── */
(function () {
  // Smooth scroll for any anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════════════
   AUTH NAV SYSTEM — runs on every page
   ══════════════════════════════════════════════════════════════ */
(function () {
  var container = document.getElementById("navAuthBtns");
  if (!container) return;

  function getUser() {
    try { return JSON.parse(localStorage.getItem("indiapolity-user") || "null"); }
    catch(e) { return null; }
  }

  function renderNav() {
    var user = getUser();
    container.innerHTML = "";

    if (user && user.email) {
      /* Logged-in pill */
      var pill = document.createElement("div");
      pill.className = "nav-user-pill";

      var avatar = document.createElement("div");
      avatar.className = "avatar";
      avatar.textContent = user.avatar || user.name.charAt(0).toUpperCase();

      var nameSpan = document.createElement("span");
      nameSpan.textContent = user.name.split(" ")[0];
      nameSpan.style.cssText = "max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";

      var logoutBtn = document.createElement("button");
      logoutBtn.className   = "btn-logout";
      logoutBtn.textContent = "Log out";
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("indiapolity-user");
        window.IndiaPolityToast && window.IndiaPolityToast.show("Logged out successfully. See you soon!", "info", 3000);
        setTimeout(function () { renderNav(); }, 200);
      });

      pill.appendChild(avatar);
      pill.appendChild(nameSpan);
      pill.appendChild(logoutBtn);
      container.appendChild(pill);

    } else {
      /* Login + Signup buttons */
      var loginLink = document.createElement("a");
      loginLink.href      = "login.html";
      loginLink.className = "btn-login";
      loginLink.textContent = "Log In";

      var signupLink = document.createElement("a");
      signupLink.href       = "signup.html";
      signupLink.className  = "btn-signup";
      signupLink.textContent = "Sign Up";

      container.appendChild(loginLink);
      container.appendChild(signupLink);
    }
  }

  renderNav();

  /* ── Profile welcome banner on party/content pages ── */
  var user = getUser();
  if (user) {
    var banner = document.getElementById("profileWelcome");
    if (banner) {
      banner.style.display = "flex";
      var bigAvatar = banner.querySelector(".big-avatar");
      if (bigAvatar) bigAvatar.textContent = user.avatar || "U";
      var welcomeText = banner.querySelector(".welcome-text");
      if (welcomeText) welcomeText.textContent = "Welcome back, " + user.name + "! You're exploring IndiaPolity.";
    }
  }

})();
