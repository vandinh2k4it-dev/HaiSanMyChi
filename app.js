(function () {
  "use strict";

  // ---- Dữ liệu mặc định (dùng khi chưa nối Supabase hoặc khi tải lỗi) ----
  var DEFAULT_SETTINGS = {
    zalo: "0336544246",
    open_time: "08:00",
    close_time: "18:00",
    delivery_area: "Nhắn Zalo để biết khu vực giao hàng",
    banner_text: "",
    banner_on: "false",
    phone: "",
    address: ""
  };
  var DEFAULT_PRODUCTS = [
    { id: "s1", name: "Cá tầm nguyên con sơ chế", description: "Đã làm sạch, sẵn sàng nấu lẩu, nướng, hấp.", price: "Liên hệ", unit: "/kg", image_url: "", in_stock: true },
    { id: "s2", name: "Cá tầm cắt khúc", description: "Chia phần vừa ăn cho bữa cơm gia đình.", price: "Liên hệ", unit: "/kg", image_url: "", in_stock: true },
    { id: "s3", name: "Cá tầm phi lê", description: "Lọc xương, dễ chế biến, hợp món chiên và hấp.", price: "Liên hệ", unit: "/kg", image_url: "", in_stock: true }
  ];
  var RECIPES = [
    { cat: "soup", icon: "🍲", bg: "#fef2db", name: "Lẩu cá tầm măng chua", time: "35–45 phút", serves: "4 người",
      ing: ["600–800 g cá tầm cắt khúc", "300 g măng chua, 2 quả cà chua", "Dứa, hành tím, thì là, rau ăn lẩu", "Nước dùng, nước mắm, gia vị"],
      steps: ["Rã đông cá trong ngăn mát, rửa nhanh và thấm ráo.", "Phi hành tím, xào cà chua và măng chua cho dậy mùi.", "Cho nước dùng và dứa vào, đun sôi, nêm chua ngọt vừa ăn.", "Thả cá vào nấu chín hoàn toàn, thêm thì là, ăn cùng bún và rau."] },
    { cat: "grill", icon: "🔥", bg: "#fff0e9", name: "Cá tầm nướng muối ớt", time: "30–40 phút", serves: "3–4 người",
      ing: ["600 g cá tầm cắt khoanh", "Sả, tỏi, ớt băm, dầu ăn", "Muối, đường, nước mắm", "Rau sống, chanh ăn kèm"],
      steps: ["Rã đông trong ngăn mát, thấm khô từng khoanh cá.", "Trộn sả, tỏi, ớt và gia vị, ướp cá 15–20 phút trong ngăn mát.", "Nướng trên vỉ hoặc nồi chiên, trở mặt, phết chút dầu cho khỏi khô.", "Nướng đến khi thịt cá chín đục, dễ tách, dùng nóng với rau."] },
    { cat: "steam", icon: "🥢", bg: "#e8f6e9", name: "Cá tầm hấp xì dầu", time: "25–30 phút", serves: "2–3 người",
      ing: ["500–600 g cá tầm", "Gừng thái sợi, hành lá, nấm", "Xì dầu, chút đường, tiêu", "Dầu mè (tuỳ thích)"],
      steps: ["Đặt cá đã rã đông lên đĩa chịu nhiệt, rải gừng và nấm lên mặt.", "Pha xì dầu, đường và chút nước rồi rưới lên cá.", "Hấp khi nước đã sôi đến khi cá chín hoàn toàn.", "Thêm hành lá, tiêu và chút dầu mè trước khi dùng."] },
    { cat: "fry", icon: "🍤", bg: "#fff1d6", name: "Cá tầm chiên giòn", time: "25–35 phút", serves: "3 người",
      ing: ["500 g cá tầm cắt miếng", "Bột chiên giòn, 1 quả trứng (tuỳ chọn)", "Muối, tiêu, tỏi băm", "Dầu ăn và nước chấm"],
      steps: ["Rã đông, thấm thật khô cá rồi ướp nhẹ muối tiêu.", "Áo đều lớp bột mỏng, có thể dùng trứng cho bột bám tốt hơn.", "Chiên dầu nóng lửa vừa, trở đều các mặt.", "Vớt ra để ráo khi cá chín bên trong, ăn ngay."] },
    { cat: "braise", icon: "🍛", bg: "#fff1c8", name: "Cá tầm kho nghệ", time: "35–45 phút", serves: "3–4 người",
      ing: ["600 g cá tầm", "Nghệ tươi giã nhỏ hoặc bột nghệ", "Hành tím, tỏi, tiêu", "Nước mắm, đường, nước lọc"],
      steps: ["Ướp cá với nghệ, hành tỏi, nước mắm và chút đường.", "Cho cá vào nồi, thêm ít nước rồi đun sôi nhẹ.", "Hạ lửa, kho liu riu, trở cá cẩn thận kẻo nát.", "Nấu đến khi cá chín kỹ, nước kho sánh và vừa miệng."] },
    { cat: "soup", icon: "🥣", bg: "#e4f7f4", name: "Canh chua cá tầm", time: "25–35 phút", serves: "4 người",
      ing: ["500–600 g cá tầm", "Cà chua, dứa, đậu bắp, bạc hà", "Me hoặc nước cốt chanh", "Rau ngổ, ngò gai, gia vị"],
      steps: ["Đun nước với cà chua và dứa, thêm me tạo vị chua.", "Cho cá vào nước đang sôi nhẹ, hớt bọt nếu cần.", "Thêm đậu bắp, bạc hà, nêm lại chua – mặn – ngọt.", "Nấu đến khi cá chín hoàn toàn rồi thêm rau thơm."] }
  ];
  var FILTERS = [["all", "Tất cả món"], ["soup", "🍲 Lẩu & canh"], ["grill", "🔥 Nướng"], ["steam", "♨️ Hấp"], ["fry", "🍳 Chiên"], ["braise", "🥘 Kho"]];

  var settings = Object.assign({}, DEFAULT_SETTINGS);
  var products = DEFAULT_PRODUCTS;

  // ---- Tiện ích ----
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  function zaloUrl() { return "https://zalo.me/" + digits(settings.zalo); }
  function showToast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(showToast.h);
    showToast.h = setTimeout(function () { t.classList.remove("show"); }, 4500);
  }
  function safeImg(url) {
    return /^https:\/\/[^\s"'<>]+$/i.test(url || "") ? url : "";
  }

  // ---- Nạp dữ liệu từ Supabase (chỉ đọc, qua REST) ----
  function loadRemote() {
    var c = window.SITE_CONFIG || {};
    if (!c.supabaseUrl || !c.supabaseAnonKey) return Promise.resolve();
    var h = { apikey: c.supabaseAnonKey };
    // Khoá kiểu cũ (JWT) cần thêm Authorization; khoá "sb_publishable_…" thì không.
    if (c.supabaseAnonKey.indexOf("sb_") !== 0) h.Authorization = "Bearer " + c.supabaseAnonKey;
    var base = c.supabaseUrl.replace(/\/$/, "") + "/rest/v1/";
    return Promise.all([
      fetch(base + "settings?select=key,value", { headers: h }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }),
      fetch(base + "products?select=*&order=sort.asc,created_at.asc", { headers: h }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    ]).then(function (res) {
      res[0].forEach(function (row) { settings[row.key] = row.value; });
      if (res[1].length) products = res[1];
    }).catch(function () {
      showToast("Chưa tải được dữ liệu mới, đang hiện thông tin mẫu.");
    });
  }

  // ---- Hiển thị ----
  function renderSettings() {
    var link = zaloUrl();
    document.querySelectorAll(".zalo-link").forEach(function (a) { a.href = link; });
    $("#cZalo").textContent = settings.zalo;
    $("#cHours").textContent = settings.open_time + " – " + settings.close_time + " hằng ngày";
    $("#cArea").textContent = settings.delivery_area;
    var tel = "tel:" + (digits(settings.phone) || digits(settings.zalo));
    document.querySelectorAll(".tel-link").forEach(function (a) { a.href = tel; });
    var addr = (settings.address || "").trim();
    $("#addrBox").hidden = !addr;
    $("#mapWrap").hidden = !addr;
    $("#dirBtn").hidden = !addr;
    if (addr) {
      $("#cAddr").textContent = addr;
      $("#dirBtn").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addr);
      var mapSrc = "https://www.google.com/maps?q=" + encodeURIComponent(addr) + "&output=embed";
      var fr = $("#mapFrame");
      if (fr.getAttribute("src") !== mapSrc) fr.setAttribute("src", mapSrc);
    }
    var promo = $("#promo");
    if (settings.banner_on === "true" && settings.banner_text) {
      promo.textContent = settings.banner_text;
      promo.hidden = false;
    } else {
      promo.hidden = true;
    }
    renderStatus();
  }

  function renderStatus() {
    var now = new Date();
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
    var h = +parts.find(function (p) { return p.type === "hour"; }).value % 24;
    var m = +parts.find(function (p) { return p.type === "minute"; }).value;
    var cur = h * 60 + m;
    function mins(t) { var a = String(t).split(":"); return (+a[0] || 0) * 60 + (+a[1] || 0); }
    var open = cur >= mins(settings.open_time) && cur < mins(settings.close_time);
    var s = $("#status");
    s.className = "status " + (open ? "open" : "closed");
    s.lastChild.textContent = open
      ? "Đang mở cửa · đến " + settings.close_time
      : "Đã đóng cửa · mở lại lúc " + settings.open_time + " (vẫn nhắn Zalo được)";
  }

  function renderProducts() {
    var g = $("#productGrid");
    g.textContent = "";
    if (!products.length) { g.appendChild(el("div", "empty", "Sản phẩm đang được cập nhật. Vui lòng nhắn Zalo để hỏi hàng.")); return; }
    products.forEach(function (p) {
      var card = el("article", "card" + (p.in_stock === false ? " soldout" : ""));
      var pic = el("div", "pic");
      var img = safeImg(p.image_url);
      if (img) {
        var i = el("img"); i.src = img; i.alt = p.name; i.loading = "lazy"; pic.appendChild(i);
      } else {
        pic.appendChild(el("span", null, "🐟"));
      }
      if (p.in_stock === false) pic.appendChild(el("span", "out", "Tạm hết hàng"));
      var body = el("div", "body");
      body.appendChild(el("h3", null, p.name));
      body.appendChild(el("p", null, p.description || ""));
      var price = el("div", "price", p.price || "Liên hệ");
      if (p.price && p.unit && /\d/.test(p.price)) price.appendChild(el("small", null, " " + p.unit));
      body.appendChild(price);
      var btn = el("a", "btn zalo small", p.in_stock === false ? "Hỏi khi nào có hàng" : "Hỏi giá qua Zalo");
      btn.href = zaloUrl(); btn.target = "_blank"; btn.rel = "noopener";
      btn.addEventListener("click", function () {
        var msg = "Tôi muốn hỏi giá: " + p.name;
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).catch(function () {});
        showToast("Đã sao chép “" + msg + "”. Dán vào Zalo để gửi nhanh.");
      });
      body.appendChild(btn);
      card.appendChild(pic); card.appendChild(body);
      g.appendChild(card);
    });
  }

  function renderRecipes(filter) {
    var g = $("#recipeGrid");
    g.textContent = "";
    RECIPES.filter(function (r) { return filter === "all" || r.cat === filter; }).forEach(function (r) {
      var c = el("article", "rcard");
      var art = el("div", "rart", r.icon); art.style.setProperty("--bg", r.bg);
      var m = el("div", "rmain");
      m.appendChild(el("h3", null, r.name));
      m.appendChild(el("div", "rmeta", "⏱ " + r.time + " · 👥 " + r.serves));
      var d = el("details", "rd");
      d.appendChild(el("summary", null, "Xem nguyên liệu & cách làm"));
      var b = el("div");
      b.appendChild(el("h4", null, "Nguyên liệu tham khảo"));
      var ul = el("ul"); r.ing.forEach(function (x) { ul.appendChild(el("li", null, x)); }); b.appendChild(ul);
      b.appendChild(el("h4", null, "Các bước"));
      var ol = el("ol"); r.steps.forEach(function (x) { ol.appendChild(el("li", null, x)); }); b.appendChild(ol);
      d.appendChild(b); m.appendChild(d);
      c.appendChild(art); c.appendChild(m); g.appendChild(c);
    });
  }

  function renderFilters() {
    var box = $("#filters");
    FILTERS.forEach(function (f, i) {
      var b = el("button", "chip", f[1]);
      b.type = "button";
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        box.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        renderRecipes(f[0]);
      });
      box.appendChild(b);
    });
  }

  // ---- Video hướng dẫn trên YouTube (bấm mới tải, để trang nhẹ) ----
  var YT = [
    { id: "FxCnhYT9J10", title: "Lẩu cá tầm măng chua", by: "Bếp Của Vợ" },
    { id: "ARMPvGyV8Iw", title: "Cá tầm nướng muối ớt", by: "LÝ HƯƠNG TV" },
    { id: "bJVoDQMDADY", title: "Canh chua cá tầm măng", by: "Cook béo" }
  ];
  function renderYT() {
    var g = $("#ytGrid");
    if (!g) return;
    YT.forEach(function (v) {
      var f = el("figure", "ycard");
      var btn = el("button", "yplay");
      btn.type = "button";
      btn.setAttribute("aria-label", "Phát video: " + v.title);
      var img = el("img"); img.src = "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg"; img.alt = ""; img.loading = "lazy";
      btn.appendChild(img); btn.appendChild(el("span", "ytri", "▶"));
      btn.addEventListener("click", function () {
        var ifr = el("iframe");
        ifr.src = "https://www.youtube-nocookie.com/embed/" + v.id + "?autoplay=1&rel=0";
        ifr.title = v.title; ifr.allow = "autoplay; encrypted-media; picture-in-picture"; ifr.allowFullscreen = true;
        ifr.referrerPolicy = "strict-origin-when-cross-origin";
        btn.replaceWith(ifr);
      });
      f.appendChild(btn);
      f.appendChild(el("figcaption", null, v.title + " · kênh " + v.by));
      g.appendChild(f);
    });
  }

  // ---- Khởi động ----
  $("#year").textContent = new Date().getFullYear();
  renderYT();
  renderFilters();
  renderRecipes("all");
  renderSettings();
  renderProducts();
  loadRemote().then(function () { renderSettings(); renderProducts(); });
  setInterval(renderStatus, 60000);
})();
