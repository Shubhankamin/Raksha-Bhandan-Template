/* ============================================================
   STATE + NAVIGATION
   ============================================================ */
const scenesEl = document.getElementById("scenes");
const scenes = Array.from(document.querySelectorAll(".scene"));
const total = scenes.length;
let current = 0;
let animating = false;

// build thread nav
const nav = document.getElementById("thread-nav");
scenes.forEach((s, i) => {
  const dot = document.createElement("div");
  dot.className = "thread-dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => goTo(i));
  nav.appendChild(dot);
  if (i < total - 1) {
    const line = document.createElement("div");
    line.className = "thread-line";
    nav.appendChild(line);
  }
});
const dots = () => nav.querySelectorAll(".thread-dot");

function goTo(i) {
  if (i < 0 || i >= total || i === current || animating) return;
  animating = true;
  current = i;
  scenesEl.style.transform = `translateY(-${current * 100}vh)`;
  dots().forEach((d, idx) => d.classList.toggle("active", idx === current));
  onEnterScene(current);
  setTimeout(() => (animating = false), 950);
}
function next() {
  goTo(current + 1);
}

document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => goTo(parseInt(btn.dataset.goto, 10)));
});

// wheel / touch / keyboard navigation between scenes
let wheelLock = false;
window.addEventListener(
  "wheel",
  (e) => {
    if (wheelLock || animating) return;
    if (document.getElementById("lightbox").classList.contains("show")) return;
    if (Math.abs(e.deltaY) < 24) return;
    wheelLock = true;
    if (e.deltaY > 0) next();
    else goTo(current - 1);
    setTimeout(() => (wheelLock = false), 900);
  },
  { passive: true },
);

let touchY = null;
window.addEventListener("touchstart", (e) => (touchY = e.touches[0].clientY), {
  passive: true,
});
window.addEventListener(
  "touchend",
  (e) => {
    if (touchY === null || animating) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 60) {
      dy > 0 ? next() : goTo(current - 1);
    }
    touchY = null;
  },
  { passive: true },
);

window.addEventListener("keydown", (e) => {
  if (["ArrowDown", "PageDown"].includes(e.key)) next();
  if (["ArrowUp", "PageUp"].includes(e.key)) goTo(current - 1);
});

/* ============================================================
   SCENE 1 — string lights + loader
   ============================================================ */
const lights = document.getElementById("lights");
for (let i = 0; i < 22; i++) {
  const s = document.createElement("span");
  lights.appendChild(s);
}

const loadingMessages = [
  "Lighting a diya...",
  "Threading the Rakhi...",
  "Wrapping little wishes...",
  "Almost ready...",
];
const loadingMessageEl = document.getElementById("loadingMessage");
const loadingNextBtn = document.getElementById("loading-next");
let msgIndex = 0;
const msgInterval = setInterval(() => {
  msgIndex = (msgIndex + 1) % loadingMessages.length;
  loadingMessageEl.textContent = loadingMessages[msgIndex];
}, 900);
setTimeout(() => {
  clearInterval(msgInterval);
  loadingMessageEl.textContent = "Ready.";
  loadingNextBtn.classList.add("show");
}, 3600);

/* ============================================================
   SCENE 2 — gift box
   ============================================================ */
const giftWrap = document.getElementById("giftWrap");
const giftStage = document.querySelector(".gift-stage");
const giftMessage = document.getElementById("giftMessage");
const giftNextBtn = document.getElementById("gift-next");

function openGift() {
  if (giftWrap.classList.contains("open")) return;
  giftWrap.classList.add("open");

  popText(giftMessage, "A box full of love, just for you ♥");
  spawnShockwave(giftStage);
  burst(giftWrap, { count: 46, hearts: true });

  setTimeout(() => giftNextBtn.classList.add("show"), 500);
}
giftWrap.addEventListener("click", openGift);
giftWrap.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openGift();
});

// swap text on an element with a little bounce-in pop
function popText(el, text) {
  el.textContent = text;
  el.classList.remove("pop");
  void el.offsetWidth; // force reflow so the animation restarts
  el.classList.add("pop");
}

// expanding ring, like a burst of light — container needs position:relative
function spawnShockwave(container) {
  const ring = document.createElement("div");
  ring.className = "shockwave";
  container.appendChild(ring);
  requestAnimationFrame(() => ring.classList.add("expand"));
  setTimeout(() => ring.remove(), 950);
}

// a fuller burst of particles + hearts radiating outward in every
// direction — container needs position:relative (or fixed/absolute ancestor)
function burst(container, opts = {}) {
  const count = opts.count || 30;
  const colors = opts.colors || ["#F6D488", "#E4C077", "#E8813A", "#fff6dc"];
  const useHearts = !!opts.hearts;
  for (let i = 0; i < count; i++) {
    const isHeart = useHearts && Math.random() < 0.28;
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.top = "42%";
    el.style.pointerEvents = "none";
    el.style.zIndex = "7";
    if (isHeart) {
      el.textContent = "❤";
      el.style.fontSize = 10 + Math.random() * 10 + "px";
      el.style.color = colors[i % colors.length];
    } else {
      el.className = "particle";
      const size = 4 + Math.random() * 6;
      el.style.width = el.style.height = size + "px";
      el.style.background = colors[i % colors.length];
    }
    el.style.transition = `transform ${0.9 + Math.random() * 0.6}s cubic-bezier(.2,.8,.3,1), opacity ${1 + Math.random() * 0.4}s`;
    container.appendChild(el);
    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 170;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = "0";
    });
    setTimeout(() => el.remove(), 1600);
  }
}

/* ============================================================
   SCENE 3 — rakhi ceremony
   ============================================================ */
const tieBtn = document.getElementById("tieBtn");
const wristScene = document.getElementById("wristScene");
const rakhiBand = document.getElementById("rakhiBand");
const threadBack = document.getElementById("threadBack");
const threadFront = document.getElementById("threadFront");
const tilakDot = document.getElementById("tilakDot");
const blessingGlow = document.getElementById("blessingGlow");
const ceremonyCaption = document.getElementById("ceremonyCaption");
const rakhiFloat = document.getElementById("rakhiFloat");
const rakhiNextBtn = document.getElementById("rakhi-next");
const ceremonySteps = document.getElementById("ceremonySteps");
const stepEls = {
  thread: ceremonySteps.querySelector('[data-step="thread"]'),
  tilak: ceremonySteps.querySelector('[data-step="tilak"]'),
  blessing: ceremonySteps.querySelector('[data-step="blessing"]'),
};
function setStep(name, state) {
  const el = stepEls[name];
  if (!el) return;
  el.classList.remove("active", "done");
  if (state) el.classList.add(state);
}

tieBtn.addEventListener("click", () => {
  tieBtn.classList.add("hidden");
  rakhiFloat.style.opacity = "0";
  wristScene.classList.add("show");
  ceremonySteps.classList.add("show");

  // rakhi arrives on an arc
  setTimeout(() => {
    setStep("thread", "active");
    rakhiBand.classList.add("show");
  }, 150);

  // thread winds around the wrist just as it lands
  setTimeout(() => {
    threadBack.classList.add("draw");
    threadFront.classList.add("draw");
  }, 550);
  setTimeout(() => {
    step("The thread is tied…");
    setStep("thread", "done");
  }, 1350);

  // tilak dabbed on
  setTimeout(() => {
    setStep("tilak", "active");
    tilakDot.classList.add("show");
    step("Tilak applied ♥");
  }, 2000);
  setTimeout(() => setStep("tilak", "done"), 2700);

  setTimeout(() => sprinkleGrains(), 2550);

  setTimeout(() => {
    setStep("blessing", "active");
    step("Blessings & sweet wishes ♥");
    blessingGlow.classList.add("show");
    spawnShockwave(wristScene);
    burst(wristScene, {
      count: 34,
      hearts: true,
      colors: ["#F6D488", "#E4C077", "#ffcad5", "#fff6dc"],
    });
  }, 3500);
  setTimeout(() => {
    setStep("blessing", "done");
    rakhiNextBtn.classList.add("show");
  }, 4000);
});
function step(text) {
  ceremonyCaption.classList.remove("pop");
  ceremonyCaption.style.opacity = 0;
  setTimeout(() => {
    ceremonyCaption.textContent = text;
    ceremonyCaption.style.opacity = 1;
    ceremonyCaption.classList.add("pop");
  }, 50);
}
function sprinkleGrains() {
  for (let i = 0; i < 14; i++) {
    const g = document.createElement("div");
    g.className = "grain";
    g.style.left = 105 + Math.random() * 50 + "px";
    g.style.top = 55 + Math.random() * 40 + "px";
    g.style.animationDelay = Math.random() * 200 + "ms";
    wristScene.appendChild(g);
    setTimeout(() => g.remove(), 1200);
  }
}

// ambient falling petals
const petalsWrap = document.getElementById("petals");
function spawnPetal() {
  const p = document.createElement("div");
  p.className = "petal";
  p.style.left = Math.random() * 100 + "%";
  p.style.animationDuration = 5 + Math.random() * 4 + "s";
  p.style.opacity = 0.5 + Math.random() * 0.5;
  petalsWrap.appendChild(p);
  setTimeout(() => p.remove(), 9000);
}
setInterval(spawnPetal, 1200);

/* ============================================================
   SCENE 4 — letter
   ============================================================ */
const envelope = document.getElementById("envelope");
const letterPaper = document.getElementById("letterPaper");
const envelopeHint = document.getElementById("envelopeHint");
const letterNextBtn = document.getElementById("letter-next");
function openEnvelope() {
  envelope.classList.add("opened");
  envelopeHint.style.opacity = "0";
  letterPaper.classList.add("show");
  letterNextBtn.classList.add("show");
}
envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openEnvelope();
});

/* ============================================================
   SCENE 5 — memory box
   ============================================================ */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lbCap = document.getElementById("lbCap");
const memoryDescription = document.getElementById("memoryDescription");

document.querySelectorAll(".polaroid").forEach((p) => {
  p.addEventListener("click", () => {
    const img = p.querySelector("img");
    lightboxImage.src = img ? img.getAttribute("src") : "";
    lightboxImage.alt = p.dataset.cap || "";
    lbCap.textContent = p.dataset.cap || "";
    memoryDescription.textContent =
      p.dataset.desc || "A memory we'll always cherish.";
    lightbox.classList.add("show");
  });
});
document
  .getElementById("lbClose")
  .addEventListener("click", () => lightbox.classList.remove("show"));

/* ============================================================
   SCENE 6 — voice message (visual placeholder + real audio hook)
   ============================================================ */
const wave = document.getElementById("wave");
for (let i = 0; i < 48; i++) {
  const bar = document.createElement("span");
  const h = 4 + Math.random() * 24;
  bar.style.height = h + "px";
  wave.appendChild(bar);
}
const playBtn = document.getElementById("playBtn");
const reelL = document.getElementById("reelL");
const reelR = document.getElementById("reelR");
const audio = document.getElementById("voiceAudio");
const tCur = document.getElementById("tCur");
const voiceStatus = document.getElementById("voiceStatus");
let playing = false,
  fakeTimer = null,
  fakeSeconds = 0;
playBtn.addEventListener("click", () => {
  playing = !playing;
  playBtn.textContent = playing ? "❚❚" : "▶";
  voiceStatus.textContent = playing
    ? "Playing..."
    : "Tap play to hear my message.";
  reelL.classList.toggle("spin", playing);
  reelR.classList.toggle("spin", playing);
  wave.querySelectorAll("span").forEach((b, i) => {
    b.style.animation = playing
      ? `pulseBar .8s ease-in-out ${(i % 8) * 0.06}s infinite alternate`
      : "none";
    b.style.opacity = playing ? "1" : ".5";
  });
  if (audio.getAttribute("src")) {
    playing ? audio.play() : audio.pause();
  }
  if (playing) {
    fakeTimer = setInterval(() => {
      fakeSeconds++;
      const m = Math.floor(fakeSeconds / 60),
        s = fakeSeconds % 60;
      tCur.textContent = m + ":" + String(s).padStart(2, "0");
      if (fakeSeconds >= 28) {
        fakeSeconds = 0;
        voiceStatus.textContent = "That's the message ♥";
        playBtn.click();
      }
    }, 1000);
  } else {
    clearInterval(fakeTimer);
  }
});
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes pulseBar{from{transform:scaleY(.4)} to{transform:scaleY(1)}}`;
document.head.appendChild(styleTag);

/* ============================================================
   SCENE 7 — final wish
   ============================================================ */
const starsWrap = document.getElementById("stars");
for (let i = 0; i < 70; i++) {
  const s = document.createElement("span");
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 70 + "%";
  s.style.animationDelay = Math.random() * 3 + "s";
  starsWrap.appendChild(s);
}
const lanternsWrap = document.getElementById("lanterns");
function spawnLantern() {
  const l = document.createElement("div");
  l.className = "lantern";
  l.style.left = 5 + Math.random() * 90 + "%";
  const dur = 9 + Math.random() * 8;
  l.style.animationDuration = dur + "s";
  lanternsWrap.appendChild(l);
  setTimeout(() => l.remove(), dur * 1000);
}
let lanternInterval = null;
function confettiBurst() {
  const colors = ["#C9963C", "#E4C077", "#E8813A", "#F3E9D8"];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.top = "-10px";
    c.style.left = Math.random() * 100 + "vw";
    c.style.width = c.style.height = "7px";
    c.style.background = colors[i % colors.length];
    c.style.zIndex = "90";
    c.style.borderRadius = "1px";
    c.style.transition = `transform ${2 + Math.random() * 2}s linear, opacity 2.5s`;
    document.body.appendChild(c);
    requestAnimationFrame(() => {
      c.style.transform = `translateY(${100 + Math.random() * 10}vh) rotate(${Math.random() * 360}deg)`;
      c.style.opacity = "0";
    });
    setTimeout(() => c.remove(), 4200);
  }
}

document.getElementById("restartBtn").addEventListener("click", () => goTo(0));

/* fires side-effects whenever a scene becomes active */
function onEnterScene(i) {
  if (i === 6) {
    if (!lanternInterval) {
      spawnLantern();
      lanternInterval = setInterval(spawnLantern, 1400);
    }
    confettiBurst();
  }
}
