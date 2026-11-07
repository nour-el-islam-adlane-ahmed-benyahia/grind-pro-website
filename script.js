const EMAIL = "adlnmhd2002@gmail.com";
const MOON = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`, SUN = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const setTg = () => { $("tg").innerHTML = document.documentElement.getAttribute("data-theme") === "dark" ? MOON : SUN; };
// ===== IMAGES: change a link here if a picture does not show =====
const G = "https://github.com/grind-pro-store/site/blob/main/";
const R = "https://raw.githubusercontent.com/grind-pro-store/site/main/";
let P = [
 {id:1,n:"Pack demi veste + baggy",p:3200,i:G+"pack%20demi%20vest%2Bbaggy.PNG?raw=true"},
 {id:2,n:"Pack demi veste + jogging",p:3200,i:G+"pack%20demi%20vest%2Bjogging.PNG?raw=true"},
 {id:3,n:"Pack tricot + baggy",p:2800,i:G+"pack%20tricot%20sport%2Bbaggy.PNG?raw=true"},
 {id:4,n:"Pack tricot + jogging",p:2800,i:G+"pack%20tricot%20sport%2Bjogging.PNG?raw=true"},
 {id:5,n:"Tricot simple demi manche",p:1200,i:R+"tricot%20n.png"},
 {id:6,n:"Tricot avec logo demi manche",p:1400,i:R+"tricot%20logo%20n.png"},
 {id:7,n:"Demi veste",p:1400,i:G+"demivest%20index.png?raw=true"},
 {id:8,n:"Baggy Nike",p:2000,i:G+"baggy%20index.png?raw=true"},
 {id:9,n:"Jogging Nike",p:2000,i:G+"jogging%20index.png?raw=true"}
];
const SIZES = ["S","M","L","XL","XXL"];
let cart = [];
try { cart = JSON.parse(localStorage.getItem("gp_cart") || "[]"); } catch(e) {}
const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString("fr-FR") + " DA";
const save = () => { try { localStorage.setItem("gp_cart", JSON.stringify(cart)); } catch(e) {} $("cnt").textContent = cart.reduce((a,c)=>a+c.q,0); };
const total = () => cart.reduce((a,c)=>a+c.p*c.q,0);

function renderGrid(){ $("grid").innerHTML = P.length ? P.map(p => `<div class="card" onclick="openProd(${p.id})"><img loading="lazy" src="${p.i}" alt="${p.n}" data-id="${p.id}" onerror="imgFail(this)"><div class="in"><h3>${p.n}</h3><div class="price">${fmt(p.p)}</div></div></div>`).join("") : '<p style="color:var(--mu)">Bientôt de nouveaux articles.</p>'; }
renderGrid();

// Fallback: try other versions of the same link, then a placeholder
function imgFail(el){
  const p = P.find(x => x.id == el.dataset.id), step = +(el.dataset.step || 0);
  const u = p.i, file = decodeURIComponent(u.split("/").pop().split("?")[0]);
  const alts = [
    u.replace("github.com/","raw.githubusercontent.com/").replace("/blob/","/").replace("?raw=true",""),
    "images/" + file,
    "https://cdn.jsdelivr.net/gh/grind-pro-store/site@main/" + file
  ];
  if (step < alts.length) { el.dataset.step = step + 1; el.src = alts[step]; return; }
  el.onerror = null;
  el.src = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#888" fill-opacity=".25"/><text x="300" y="310" font-family="sans-serif" font-size="34" fill="#888" text-anchor="middle">GRIND PRO</text></svg>');
}
function toggleTheme(){
  const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("gp_theme", t); } catch(e) {}
  setTg();
}
function closeAll(){ document.querySelectorAll(".ov").forEach(o => o.classList.remove("on")); }
document.querySelectorAll(".ov").forEach(o => o.addEventListener("click", e => { if (e.target === o) closeAll(); }));

let sel = {id:0, size:"M"};
function openProd(id){
  const p = P.find(x => x.id === id); const SZ = p.sz && p.sz.length ? p.sz : SIZES; sel = {id, size:SZ[0]};
  $("pbox").innerHTML = `<button class="x" onclick="closeAll()" aria-label="Fermer"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    <img class="big" src="${p.i}" alt="${p.n}" data-id="${p.id}" onerror="imgFail(this)"><h3>${p.n}</h3><div class="price" style="font-size:20px">${fmt(p.p)}</div>
    <label>Taille</label><div class="sizes">${SZ.map((s,k)=>`<button class="${k===0?"on":""}" onclick="pickSize(this,'${s}')">${s}</button>`).join("")}</div>
    <label>Quantité</label><input id="qty" type="number" min="1" value="1">
    <button class="btn full" style="margin-top:18px" onclick="addCart()">Ajouter au panier</button>`;
  closeAll(); $("pm").classList.add("on");
}
function pickSize(b, s){ sel.size = s; b.parentNode.querySelectorAll("button").forEach(x => x.classList.remove("on")); b.classList.add("on"); }
function addCart(){
  const p = P.find(x => x.id === sel.id), q = Math.max(1, +$("qty").value || 1);
  const ex = cart.find(c => c.id === p.id && c.s === sel.size);
  if (ex) ex.q += q; else cart.push({id:p.id, n:p.n, p:p.p, s:sel.size, q});
  save(); openCart();
}
function openCart(){
  closeAll();
  $("clines").innerHTML = cart.length ? cart.map((c,i) => `<div class="line"><div>${c.n}<small>Taille ${c.s} · ${c.q} × ${fmt(c.p)}</small></div><div>${fmt(c.p*c.q)}<br><button onclick="rm(${i})">Retirer</button></div></div>`).join("") : '<p style="color:var(--mu);padding:14px 0">Votre panier est vide.</p>';
  $("ctot").textContent = fmt(total());
  $("gocheck").style.display = cart.length ? "block" : "none";
  $("cm").classList.add("on");
}
function rm(i){ cart.splice(i,1); save(); openCart(); }
function openCheckout(){ closeAll(); $("ktot").textContent = fmt(total()); $("km").classList.add("on"); }

async function send(e){
  e.preventDefault();
  const btn = $("sb"), err = $("err"); err.style.display = "none";
  btn.disabled = true; btn.textContent = "Envoi en cours...";
  const d = Object.fromEntries(new FormData($("f")).entries());
  d.Commande = cart.map(c => `${c.n} | Taille ${c.s} | x${c.q} | ${c.p*c.q} DA`).join("\n");
  d.Total = fmt(total());
  d._subject = "Nouvelle commande GRIND PRO — " + d.Nom;
  d._template = "table"; d._captcha = "false";
  try {
    const r = await fetch("https://formsubmit.co/ajax/" + EMAIL, {
      method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"}, body:JSON.stringify(d)
    });
    const j = await r.json();
    if (!r.ok || j.success === "false") throw new Error(j.message || "Erreur");
    cart = []; save();
    $("kbox").innerHTML = `<div class="ok"><div style="font-size:64px;color:var(--ac)"><svg class="ico" style="width:1em;height:1em" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div><h3>Merci ${d.Nom} !</h3><p style="color:var(--mu)">Votre commande est bien reçue. Nous vous appellerons très bientôt pour la confirmer.</p><button class="btn" style="margin-top:20px" onclick="location.reload()">Retour à la boutique</button></div>`;
  } catch(x) {
    err.textContent = "Échec de l'envoi. Vérifiez votre connexion et réessayez.";
    err.style.display = "block"; btn.disabled = false; btn.textContent = "Confirmer la commande";
  }
}
setTg();
save();
