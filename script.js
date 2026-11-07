// saatbilgisi - Multi-page Navigation, Search & Full Watch Mechanism Engine

const turkishLower = (value) => (value ? value.toLocaleLowerCase("tr-TR") : "");

// SEARCH & FILTER SYSTEM
function setupSearch({
  inputId,
  gridId,
  emptyId,
  countId,
  filters = [],
  itemSelector,
  countLabel,
}) {
  const input = document.getElementById(inputId);
  const grid = document.getElementById(gridId);
  const emptyState = document.getElementById(emptyId);
  const count = document.getElementById(countId);

  // Guard if elements do not exist on current page
  if (!input || !grid || !emptyState || !count) return;

  const items = [...grid.querySelectorAll(itemSelector)];
  const filterControls = filters.map(({ id, attribute }) => ({
    control: document.getElementById(id),
    attribute,
  })).filter(f => f.control !== null);

  const update = () => {
    const query = turkishLower(input.value.trim());
    let visibleCount = 0;

    for (const item of items) {
      const searchableText = turkishLower(
        `${item.textContent} ${item.dataset.search ?? ""}`,
      );
      const matchesQuery = !query || searchableText.includes(query);
      const matchesFilters = filterControls.every(({ control, attribute }) => {
        const selectedValue = control.value;
        if (!selectedValue) return true;
        if (attribute === "reserve") {
          if (selectedValue === "medium") {
            const hours = Number(item.dataset.reserveHours);
            return hours > 0 && hours < 40;
          }
          if (selectedValue === "long") {
            return Number(item.dataset.reserveHours) >= 40;
          }
        }
        return item.dataset[attribute] === selectedValue;
      });

      item.hidden = !(matchesQuery && matchesFilters);
      if (!item.hidden) visibleCount += 1;
    }

    emptyState.hidden = visibleCount !== 0;
    count.textContent = `${visibleCount} / ${items.length} ${countLabel}`;
  };

  input.addEventListener("input", update);
  for (const { control } of filterControls) {
    control.addEventListener("change", update);
  }
  update();
}

// FULL MECHANICAL WATCH CALIBRE ENGINE (TAM MEKANİK SAAT KALİBRESİ)
function initWatchMovementCanvas() {
  const canvas = document.getElementById("zemberek-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Status elements
  const stateLabel = document.getElementById("zemberek-state-text");
  const reserveLabel = document.getElementById("zemberek-reserve-text");
  const btnWind = document.getElementById("btn-wind");
  const btnSlow = document.getElementById("btn-release");
  const btnAuto = document.getElementById("btn-auto");

  // Physics & Animation state
  let width = 0;
  let height = 0;
  let time = 0;
  let speedMultiplier = 0.25; // Varsayılan olarak ağır çekim görünümü
  let isWinding = false;
  let crownAngle = 0; // Kurma kolunun dönüş açısı
  let mainspringTension = 0.88; // 0.0 to 1.0
  let isDragging = false;
  let lastDragY = 0;

  // Gear angles (synchronized gear train)
  let barrelAngle = 0;
  let centerWheelAngle = 0;
  let thirdWheelAngle = 0;
  let fourthWheelAngle = 0;
  let escapeWheelAngle = 0;
  let balanceAngle = 0;
  let palletAngle = 0;

  let lastDragX = 0;
  let windInterval = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const parent = canvas.parentElement;
    const parentRect = parent ? parent.getBoundingClientRect() : null;
    const container = canvas.closest(".hero-art-container");
    const containerRect = container ? container.getBoundingClientRect() : null;

    let computedW = Math.round(rect.width || (parentRect && parentRect.width) || (containerRect && containerRect.width) || 0);
    if (!computedW || computedW < 50) {
      computedW = Math.round(Math.max(300, window.innerWidth * 0.35));
    }

    width = computedW;
    height = computedW; // 1:1 tam kare oran

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
  }

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    } else {
      ro.observe(canvas);
    }
  }

  window.addEventListener("resize", resize);
  resize();

  // Button Listeners
  if (btnWind) {
    btnWind.addEventListener("click", () => {
      isWinding = true;
      mainspringTension = Math.min(1.0, mainspringTension + 0.22);
      if (windInterval) clearInterval(windInterval);
      btnWind.classList.add("active");

      let stepCount = 0;
      windInterval = setInterval(() => {
        crownAngle += 0.42; // Kurma kolu tırtıkları döner
        barrelAngle += 0.045; // Zemberek tamburu sarılır
        stepCount++;
        if (stepCount > 36) {
          clearInterval(windInterval);
          windInterval = null;
          isWinding = false;
          btnWind.classList.remove("active");
        }
      }, 25);
      updateButtonStates("wind");
    });
  }

  if (btnSlow) {
    btnSlow.addEventListener("click", () => {
      speedMultiplier = speedMultiplier === 0.25 ? 1.0 : 0.25;
      updateButtonStates(speedMultiplier === 0.25 ? "slow" : "auto");
    });
  }

  if (btnAuto) {
    btnAuto.addEventListener("click", () => {
      speedMultiplier = 1.0;
      updateButtonStates("auto");
    });
  }

  function updateButtonStates(activeMode) {
    if (btnSlow) btnSlow.classList.toggle("active", speedMultiplier === 0.25);
    if (btnAuto) btnAuto.classList.toggle("active", speedMultiplier === 1.0);
  }
  updateButtonStates();

  // Interactive Drag to Wind or Inspect (Kurma kolu ve zembereği elle çevirme)
  canvas.addEventListener("pointerdown", (e) => {
    isDragging = true;
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dy = lastDragY - e.clientY;
    const dx = e.clientX - lastDragX;
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    const delta = Math.abs(dy) > Math.abs(dx) ? dy : -dx;
    mainspringTension = Math.max(0.15, Math.min(1.0, mainspringTension + delta * 0.005));
    crownAngle += delta * 0.16;
    barrelAngle += delta * 0.018;
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  // HELPER: DRAW INVOLUTE SPOKED GEAR
  function drawWheel({
    x, y, radius, teeth, angle, spokes = 5, spokeWidth = 2,
    innerRadius = 16, rimWidth = 5, color = "rgba(225, 218, 240, 0.8)",
    fillColor = "rgba(42, 38, 54, 0.4)", brassTone = false
  }) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const toothHeight = radius * 0.11;
    const rRoot = radius - toothHeight;
    const rOuter = radius + toothHeight * 0.4;

    // Pitch circle guideline (technical pencil style)
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(180, 175, 205, 0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Teeth geometry
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * Math.PI * 2;
      const a1 = ((i + 0.35) / teeth) * Math.PI * 2;
      const a2 = ((i + 0.65) / teeth) * Math.PI * 2;
      const a3 = ((i + 1) / teeth) * Math.PI * 2;

      const x0 = Math.cos(a0) * rRoot;
      const y0 = Math.sin(a0) * rRoot;
      const x1 = Math.cos(a1) * rOuter;
      const y1 = Math.sin(a1) * rOuter;
      const x2 = Math.cos(a2) * rOuter;
      const y2 = Math.sin(a2) * rOuter;
      const x3 = Math.cos(a3) * rRoot;
      const y3 = Math.sin(a3) * rRoot;

      if (i === 0) ctx.moveTo(x0, y0);
      else ctx.lineTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
    }
    ctx.closePath();

    ctx.fillStyle = brassTone ? "rgba(185, 160, 115, 0.22)" : fillColor;
    ctx.fill();
    ctx.strokeStyle = brassTone ? "rgba(235, 205, 155, 0.85)" : color;
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Wheel rim inner line
    const rRimInner = rRoot - rimWidth;
    ctx.beginPath();
    ctx.arc(0, 0, rRimInner, 0, Math.PI * 2);
    ctx.stroke();

    // Spokes (Kolları)
    if (spokes > 0) {
      for (let s = 0; s < spokes; s++) {
        const sa = (s / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * innerRadius, Math.sin(sa) * innerRadius);
        ctx.lineTo(Math.cos(sa) * rRimInner, Math.sin(sa) * rRimInner);
        ctx.lineWidth = spokeWidth;
        ctx.strokeStyle = brassTone ? "rgba(230, 200, 150, 0.75)" : "rgba(220, 215, 235, 0.75)";
        ctx.stroke();
      }
    }

    // Hub center
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(40, 36, 48, 0.9)";
    ctx.fill();
    ctx.strokeStyle = brassTone ? "rgba(235, 205, 155, 0.8)" : "rgba(240, 235, 250, 0.8)";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    ctx.restore();
  }

  // HELPER: DRAW RUBY JEWEL BEARING
  function drawJewel(x, y, radius = 6) {
    ctx.save();
    ctx.translate(x, y);

    // Gold chaton / brass bushing
    ctx.beginPath();
    ctx.arc(0, 0, radius + 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(200, 170, 110, 0.7)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Synthetic ruby
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(205, 45, 80, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center pivot hole
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = "#121016";
    ctx.fill();

    ctx.restore();
  }

  // HELPER: BLUED STEEL SCREW
  function drawScrew(x, y, radius = 4, angle = 0.7) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(65, 85, 140, 0.9)"; // Blued steel
    ctx.fill();
    ctx.strokeStyle = "rgba(200, 220, 255, 0.6)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Slot
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * (radius - 1), Math.sin(angle) * (radius - 1));
    ctx.lineTo(Math.cos(angle + Math.PI) * (radius - 1), Math.sin(angle + Math.PI) * (radius - 1));
    ctx.strokeStyle = "#141520";
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();
  }

  // MAIN RENDER FUNCTION: FULL CALIBRE
  function render(timeMs) {
    ctx.clearRect(0, 0, width, height);

    // Saatin sol ve sağ kenarlarını sol bölgenin tam sınırlarına oturtan ölçekleme:
    // Sol kenar: x = 4px (sol kasa çerçevesi)
    // Sağ kenar: x = width - 4px (sağdaki kurma kolu ucu)
    const scale = (width - 8) / 455;
    const caseOuterR = 215 * scale;
    const cx = 4 + caseOuterR;
    const cy = height / 2;

    ctx.save();
    ctx.translate(cx, cy);

    // 0. WATCH CASE FRAME (KASA ÇERÇEVESİ - Sol bölümün sınırlarına tam oturan kasa)
    const caseBezelInnerR = caseOuterR - 22 * scale;
    const rehautInnerR = caseOuterR - 35 * scale;
    const plateR = rehautInnerR - 1;

    // A. Outer Stainless Steel Bezel (Satine Çelik Kasa Çerçevesi)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, caseOuterR, 0, Math.PI * 2);
    ctx.arc(0, 0, caseBezelInnerR, Math.PI * 2, 0, true);
    ctx.closePath();

    const caseGrad = ctx.createLinearGradient(-caseOuterR, -caseOuterR, caseOuterR, caseOuterR);
    caseGrad.addColorStop(0.0, "rgba(230, 225, 245, 0.98)");
    caseGrad.addColorStop(0.25, "rgba(150, 140, 170, 0.94)");
    caseGrad.addColorStop(0.5, "rgba(250, 245, 255, 0.99)");
    caseGrad.addColorStop(0.75, "rgba(140, 130, 160, 0.94)");
    caseGrad.addColorStop(1.0, "rgba(225, 220, 240, 0.98)");
    ctx.fillStyle = caseGrad;
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, caseBezelInnerR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(45, 35, 65, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 6 Exhibition Case Screws (Kasa Çerçevesi Vidaları)
    for (let sc = 0; sc < 6; sc++) {
      const scAngle = (sc / 6) * Math.PI * 2 + 0.25;
      const scR = (caseOuterR + caseBezelInnerR) / 2;
      drawScrew(Math.cos(scAngle) * scR, Math.sin(scAngle) * scR, 3.8 * scale, scAngle + 0.5);
    }

    // B. Inner Rehaut / Depth Ring (Kasa İç Flanşı & 60 Dakika Çizgileri)
    ctx.beginPath();
    ctx.arc(0, 0, caseBezelInnerR, 0, Math.PI * 2);
    ctx.arc(0, 0, rehautInnerR, Math.PI * 2, 0, true);
    ctx.closePath();
    ctx.fillStyle = "rgba(24, 19, 34, 0.97)";
    ctx.fill();
    ctx.strokeStyle = "rgba(195, 180, 230, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 60 Tick marks around inner rehaut
    for (let t = 0; t < 60; t++) {
      const ta = (t / 60) * Math.PI * 2;
      const isMajor = t % 5 === 0;
      const tickLen = isMajor ? 6.5 * scale : 3.5 * scale;
      const r1 = caseBezelInnerR - 1.5 * scale;
      const r2 = r1 - tickLen;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ta) * r1, Math.sin(ta) * r1);
      ctx.lineTo(Math.cos(ta) * r2, Math.sin(ta) * r2);
      ctx.strokeStyle = isMajor ? "rgba(255, 255, 255, 0.88)" : "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = isMajor ? 1.4 : 0.8;
      ctx.stroke();
    }

    // C. WINDING CROWN & STEM (KURMA KOLU - 3 YÖNÜNDE, KURA BASINCA VE SÜRÜKLEYİNCE DÖNER)
    const crownCenterY = 0;
    const crownStartX = caseOuterR - 2 * scale;
    const crownTubeW = 5 * scale;
    const crownTubeH = 13 * scale;
    const crownHeadW = 15 * scale;
    const crownHeadH = 26 * scale;

    // Crown Stem Tube (Kurma Mili Borusu)
    ctx.beginPath();
    ctx.rect(crownStartX, crownCenterY - crownTubeH / 2, crownTubeW, crownTubeH);
    ctx.fillStyle = "rgba(180, 175, 195, 0.95)";
    ctx.fill();
    ctx.strokeStyle = "rgba(45, 38, 55, 0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Crown Guards (Kasa Kurma Kolu Korumaları / Omuzları)
    ctx.beginPath();
    ctx.moveTo(Math.cos(-0.2) * caseOuterR, Math.sin(-0.2) * caseOuterR);
    ctx.quadraticCurveTo(caseOuterR + 6 * scale, -crownTubeH * 0.85, caseOuterR + 3 * scale, -crownTubeH * 0.48);
    ctx.lineTo(caseOuterR, -crownTubeH * 0.48);
    ctx.arc(0, 0, caseOuterR, -0.06, -0.2, true);
    ctx.fillStyle = caseGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(Math.cos(0.2) * caseOuterR, Math.sin(0.2) * caseOuterR);
    ctx.quadraticCurveTo(caseOuterR + 6 * scale, crownTubeH * 0.85, caseOuterR + 3 * scale, crownTubeH * 0.48);
    ctx.lineTo(caseOuterR, crownTubeH * 0.48);
    ctx.arc(0, 0, caseOuterR, 0.06, 0.2, false);
    ctx.fillStyle = caseGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Crown Head Body (Çelik Silindirik Kurma Kolu Gövdesi)
    const crownX = crownStartX + crownTubeW;
    const crownY = crownCenterY - crownHeadH / 2;

    const crownGrad = ctx.createLinearGradient(0, crownY, 0, crownY + crownHeadH);
    crownGrad.addColorStop(0.0, "rgba(240, 235, 250, 0.98)");
    crownGrad.addColorStop(0.25, "rgba(150, 140, 170, 0.95)");
    crownGrad.addColorStop(0.5, "rgba(245, 240, 255, 0.99)");
    crownGrad.addColorStop(0.75, "rgba(140, 130, 160, 0.95)");
    crownGrad.addColorStop(1.0, "rgba(225, 220, 240, 0.98)");

    ctx.beginPath();
    ctx.rect(crownX, crownY, crownHeadW, crownHeadH);
    ctx.fillStyle = crownGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Rotating Flutes / Knurling Teeth (Dönen Tırtık Çizgileri - crownAngle ile döner!)
    const fluteCount = 12;
    ctx.save();
    ctx.beginPath();
    ctx.rect(crownX, crownY, crownHeadW, crownHeadH);
    ctx.clip();

    for (let f = 0; f < fluteCount; f++) {
      const phase = (f / fluteCount) * Math.PI * 2 + crownAngle;
      const normalizedY = (Math.sin(phase) + 1) / 2;
      const fy = crownY + normalizedY * crownHeadH;
      const depth = Math.cos(phase);

      if (depth > 0) {
        ctx.beginPath();
        ctx.moveTo(crownX, fy);
        ctx.lineTo(crownX + crownHeadW, fy);
        ctx.strokeStyle = depth > 0.5 ? "rgba(255, 255, 255, 0.92)" : "rgba(30, 25, 42, 0.7)";
        ctx.lineWidth = 1.4 * scale;
        ctx.stroke();
      }
    }
    ctx.restore();

    // Crown Dome Cap (Kubbe Uç)
    const domeR = crownHeadH * 0.42;
    ctx.beginPath();
    ctx.arc(crownX + crownHeadW - domeR * 0.35, crownCenterY, domeR, -0.42 * Math.PI, 0.42 * Math.PI);
    ctx.fillStyle = "rgba(230, 225, 245, 0.98)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore(); // end case frame

    // 1. BASEPLATE & CALIBRE CIRCULAR PERIMETER (Site Temasıyla Uyumlu Ana Plaka)
    ctx.save();

    // Outer Calibre Plate outline
    ctx.beginPath();
    ctx.arc(0, 0, plateR, 0, Math.PI * 2);
    ctx.fillStyle = "#221a30"; // Sitenin koyu mor/patine kimliği
    ctx.fill();
    ctx.strokeStyle = "rgba(195, 175, 230, 0.45)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Perlage texture (Dairesel finiş taramaları)
    ctx.strokeStyle = "rgba(220, 205, 250, 0.045)";
    ctx.lineWidth = 1;
    for (let r = 35 * scale; r < plateR - 10 * scale; r += 26 * scale) {
      const count = Math.floor((r * Math.PI * 2) / (32 * scale));
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 16 * scale, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Technical drafting crosshairs & circular guides
    ctx.strokeStyle = "rgba(180, 175, 205, 0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(-plateR, 0); ctx.lineTo(plateR, 0);
    ctx.moveTo(0, -plateR); ctx.lineTo(0, plateR);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 2. WATCH BRIDGES & ARCHITECTURAL PLATES (Köprüler - Karakalem Konturları)
    // Barrel Bridge (Pont de barillet - Top left)
    ctx.save();
    ctx.beginPath();
    ctx.arc(-82 * scale, -70 * scale, 98 * scale, 0.8 * Math.PI, 1.95 * Math.PI);
    ctx.lineTo(25 * scale, -95 * scale);
    ctx.lineTo(35 * scale, -40 * scale);
    ctx.lineTo(-45 * scale, 15 * scale);
    ctx.closePath();
    ctx.fillStyle = "rgba(42, 34, 58, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(225, 215, 245, 0.45)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Train Wheel Bridge (Pont de rouage - Right side)
    ctx.beginPath();
    ctx.moveTo(10 * scale, -30 * scale);
    ctx.lineTo(115 * scale, -45 * scale);
    ctx.lineTo(135 * scale, 45 * scale);
    ctx.lineTo(35 * scale, 125 * scale);
    ctx.lineTo(-15 * scale, 85 * scale);
    ctx.closePath();
    ctx.fillStyle = "rgba(45, 36, 62, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(225, 215, 245, 0.45)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Balance Cock (Coq de balancier - Bottom left)
    ctx.beginPath();
    ctx.moveTo(-165 * scale, 25 * scale);
    ctx.lineTo(-80 * scale, 15 * scale);
    ctx.quadraticCurveTo(-95 * scale, 65 * scale, -100 * scale, 75 * scale);
    ctx.arc(-100 * scale, 75 * scale, 22 * scale, 1.8 * Math.PI, 0.9 * Math.PI);
    ctx.lineTo(-175 * scale, 110 * scale);
    ctx.closePath();
    ctx.fillStyle = "rgba(48, 38, 66, 0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(240, 230, 255, 0.55)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Bridge Fixing Screws
    drawScrew(-155 * scale, 35 * scale, 4.5 * scale, 0.6);
    drawScrew(-165 * scale, 100 * scale, 4.5 * scale, 1.2);
    drawScrew(105 * scale, -35 * scale, 4.5 * scale, 2.1);
    drawScrew(120 * scale, 40 * scale, 4.5 * scale, 0.3);
    drawScrew(-45 * scale, -145 * scale, 4.5 * scale, 1.7);
    ctx.restore();

    // 3. MAINSPRING BARREL & SPIRAL (Zemberek & Tulumba - Top Left)
    const barrelX = -82 * scale;
    const barrelY = -70 * scale;
    const barrelR = 76 * scale;

    ctx.save();
    ctx.translate(barrelX, barrelY);

    // Barrel drum teeth (72 Diş)
    drawWheel({
      x: 0, y: 0, radius: barrelR, teeth: 72, angle: barrelAngle,
      spokes: 0, innerRadius: barrelR * 0.72, rimWidth: 6 * scale,
      color: "rgba(240, 235, 250, 0.85)", fillColor: "rgba(30, 27, 38, 0.85)"
    });

    // Skeletal window to reveal the coiled mainspring inside
    ctx.beginPath();
    ctx.arc(0, 0, barrelR * 0.70, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(20, 18, 25, 0.95)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Mainspring internal coils (Çelik şerit spiral sargısı)
    const springTurns = 8;
    const maxCoilR = barrelR * 0.65;
    const minCoilR = 14 * scale;
    ctx.save();
    ctx.rotate(barrelAngle * 0.2);
    ctx.beginPath();
    for (let i = 0; i < 240; i++) {
      const frac = i / 240;
      const th = frac * springTurns * Math.PI * 2;
      // tension shapes inner/outer spacing
      const powerFrac = Math.pow(frac, 0.5 + mainspringTension * 0.8);
      const r = minCoilR + powerFrac * (maxCoilR - minCoilR);
      const px = Math.cos(th) * r;
      const py = Math.sin(th) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "rgba(215, 205, 235, 0.85)";
    ctx.lineWidth = 2.2 * scale;
    ctx.stroke();

    // Center Arbor Hub & Hook
    ctx.beginPath();
    ctx.arc(0, 0, minCoilR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(50, 44, 62, 0.95)";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // Ratchet click on barrel perimeter
    ctx.beginPath();
    ctx.moveTo(barrelR * 0.95, -barrelR * 0.3);
    ctx.lineTo(barrelR * 1.15, -barrelR * 0.45);
    ctx.lineTo(barrelR * 1.05, -barrelR * 0.6);
    ctx.closePath();
    ctx.fillStyle = "rgba(180, 175, 200, 0.9)";
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // 4. GEAR TRAIN (Çark Grubu / Rouage)
    // Center Wheel (Merkez Çarkı - 64 Diş)
    const centerWheelX = 18 * scale;
    const centerWheelY = -48 * scale;
    drawWheel({
      x: centerWheelX, y: centerWheelY, radius: 52 * scale, teeth: 64,
      angle: centerWheelAngle, spokes: 5, spokeWidth: 2.2 * scale,
      innerRadius: 13 * scale, rimWidth: 5 * scale, brassTone: true
    });
    drawJewel(centerWheelX, centerWheelY, 6 * scale);

    // Third Wheel (Ara Çark - 60 Diş)
    const thirdWheelX = 82 * scale;
    const thirdWheelY = 6 * scale;
    drawWheel({
      x: thirdWheelX, y: thirdWheelY, radius: 40 * scale, teeth: 60,
      angle: thirdWheelAngle, spokes: 5, spokeWidth: 2 * scale,
      innerRadius: 10 * scale, rimWidth: 4 * scale, brassTone: true
    });
    drawJewel(thirdWheelX, thirdWheelY, 5 * scale);

    // Fourth Wheel (Saniye Çarkı - 60 Diş, 1 RPM)
    const fourthWheelX = 32 * scale;
    const fourthWheelY = 78 * scale;
    drawWheel({
      x: fourthWheelX, y: fourthWheelY, radius: 44 * scale, teeth: 60,
      angle: fourthWheelAngle, spokes: 4, spokeWidth: 1.8 * scale,
      innerRadius: 11 * scale, rimWidth: 4 * scale, brassTone: false
    });
    drawJewel(fourthWheelX, fourthWheelY, 5.5 * scale);

    // Escape Wheel (Eşapman Çarkı - 15 Kulüp Dişli)
    const escapeWheelX = -32 * scale;
    const escapeWheelY = 118 * scale;
    const escapeR = 26 * scale;
    ctx.save();
    ctx.translate(escapeWheelX, escapeWheelY);
    ctx.rotate(escapeWheelAngle);

    // Club teeth (Tırnaklı eşapman dişleri)
    ctx.strokeStyle = "rgba(245, 240, 255, 0.9)";
    ctx.lineWidth = 1.2;
    ctx.fillStyle = "rgba(40, 36, 50, 0.7)";
    ctx.beginPath();
    const escapeTeeth = 15;
    for (let i = 0; i < escapeTeeth; i++) {
      const a = (i / escapeTeeth) * Math.PI * 2;
      const x1 = Math.cos(a) * (escapeR * 0.65);
      const y1 = Math.sin(a) * (escapeR * 0.65);
      const x2 = Math.cos(a + 0.08) * escapeR;
      const y2 = Math.sin(a + 0.08) * escapeR;
      const x3 = Math.cos(a + 0.16) * (escapeR * 0.9);
      const y3 = Math.sin(a + 0.16) * (escapeR * 0.9);
      const x4 = Math.cos(a + 0.22) * (escapeR * 0.65);
      const y4 = Math.sin(a + 0.22) * (escapeR * 0.65);

      if (i === 0) ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Escape wheel spokes
    for (let s = 0; s < 4; s++) {
      const sa = (s / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(sa) * escapeR * 0.65, Math.sin(sa) * escapeR * 0.65);
      ctx.stroke();
    }
    ctx.restore();
    drawJewel(escapeWheelX, escapeWheelY, 4.5 * scale);

    // 5. PALLET LEVER & FORK (Eşapman Maşası / Ancre Suisse)
    const palletX = -68 * scale;
    const palletY = 136 * scale;
    ctx.save();
    ctx.translate(palletX, palletY);
    ctx.rotate(palletAngle);

    // Lever body
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24 * scale, -14 * scale); // Entry pallet arm
    ctx.lineTo(30 * scale, -10 * scale);
    ctx.lineTo(0, 0);
    ctx.lineTo(18 * scale, -28 * scale); // Exit pallet arm
    ctx.lineTo(22 * scale, -25 * scale);
    ctx.lineTo(0, 0);
    ctx.lineTo(-24 * scale, -32 * scale); // Fork towards balance roller
    ctx.strokeStyle = "rgba(240, 235, 255, 0.9)";
    ctx.lineWidth = 1.8 * scale;
    ctx.stroke();

    // Synthetic Ruby Pallet Stones (Giriş ve çıkış taşları)
    // Entry pallet
    ctx.beginPath();
    ctx.rect(22 * scale, -16 * scale, 6 * scale, 3 * scale);
    ctx.fillStyle = "rgba(225, 40, 75, 0.95)";
    ctx.fill();
    ctx.stroke();

    // Exit pallet
    ctx.beginPath();
    ctx.rect(16 * scale, -30 * scale, 6 * scale, 3 * scale);
    ctx.fillStyle = "rgba(225, 40, 75, 0.95)";
    ctx.fill();
    ctx.stroke();

    ctx.restore();
    drawJewel(palletX, palletY, 4 * scale);

    // 6. BALANCE WHEEL & HAIRSPRING (Balans Çarkı & Kılcal Pandül Yayı - Balancier-Spiral)
    const balanceX = -100 * scale;
    const balanceY = 75 * scale;
    const balanceR = 74 * scale;

    ctx.save();
    ctx.translate(balanceX, balanceY);

    // Balance wheel rotation
    ctx.save();
    ctx.rotate(balanceAngle);

    // Glucydur balance rim
    ctx.beginPath();
    ctx.arc(0, 0, balanceR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(235, 205, 145, 0.9)"; // Golden tone
    ctx.lineWidth = 3.2 * scale;
    ctx.stroke();

    // Inner rim line
    ctx.beginPath();
    ctx.arc(0, 0, balanceR - 4.5 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // 3 Aerodynamic balance spokes
    for (let s = 0; s < 3; s++) {
      const sa = (s / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sa) * 14 * scale, Math.sin(sa) * 14 * scale);
      ctx.lineTo(Math.cos(sa) * (balanceR - 4.5 * scale), Math.sin(sa) * (balanceR - 4.5 * scale));
      ctx.lineWidth = 2.4 * scale;
      ctx.strokeStyle = "rgba(235, 205, 145, 0.85)";
      ctx.stroke();
    }

    // Balance rim regulating screws (Balans ayar vidaları)
    for (let v = 0; v < 16; v++) {
      const va = (v / 16) * Math.PI * 2;
      const vx = Math.cos(va) * (balanceR + 2 * scale);
      const vy = Math.sin(va) * (balanceR + 2 * scale);
      ctx.beginPath();
      ctx.arc(vx, vy, 1.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 225, 165, 0.95)";
      ctx.fill();
    }
    ctx.restore(); // end balanceAngle rotation

    // Hairspring / Pandül Yayı (Spiral breathing oscillator)
    // Tightly connected to balance staff, breathes with balanceAngle
    const hairspringTurns = 10;
    const hsMaxR = balanceR * 0.52 + (balanceAngle * 3.5 * scale);
    const hsMinR = 6 * scale;

    ctx.beginPath();
    for (let i = 0; i < 220; i++) {
      const frac = i / 220;
      const th = frac * hairspringTurns * Math.PI * 2 + balanceAngle * 0.85;
      const r = hsMinR + Math.pow(frac, 0.95) * (hsMaxR - hsMinR);
      const px = Math.cos(th) * r;
      const py = Math.sin(th) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "rgba(185, 215, 255, 0.88)"; // Tempered blued spring steel
    ctx.lineWidth = 1.3 * scale;
    ctx.stroke();

    // Collet & Cap Jewel with Incabloc Shock Protection Lyre Spring (Lir Yay)
    ctx.beginPath();
    ctx.arc(0, 0, 10 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(195, 160, 95, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ruby cap jewel
    ctx.beginPath();
    ctx.arc(0, 0, 6.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(220, 35, 75, 0.95)";
    ctx.fill();
    ctx.stroke();

    // Incabloc Lyre Spring (Altın renkli şok yayı)
    ctx.beginPath();
    ctx.arc(0, 0, 4.5 * scale, 0.4 * Math.PI, 1.6 * Math.PI);
    ctx.arc(0, 0, 4.5 * scale, 1.4 * Math.PI, 2.6 * Math.PI);
    ctx.strokeStyle = "rgba(255, 240, 180, 0.9)";
    ctx.lineWidth = 1.4 * scale;
    ctx.stroke();

    // Regulator Index Arm (Ayar Kolu / Raquette)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(46 * scale, -28 * scale);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.6 * scale;
    ctx.stroke();

    ctx.restore();

    // 7. Sadece saf mekanizma (Numaralandırmalar kaldırıldı)

    ctx.restore(); // end center translation
  }

  // CONTINUOUS OSCILLATION ANIMATION LOOP (Synchronized Watch Physics)
  let lastTime = performance.now();

  function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1) * speedMultiplier;
    lastTime = now;
    time += dt;

    // Harmonic balance oscillator: 4 Hz = 8 beats per second (28,800 BPH)
    const frequency = 4.0; // Hz
    const omega = 2 * Math.PI * frequency;
    const amplitude = 1.35 * Math.PI; // ±245 degrees swing

    // Balance angle harmonic oscillation
    balanceAngle = amplitude * Math.sin(time * omega);

    // Pallet lever snaps between two banking positions as balance passes zero
    const snapThreshold = 0.25;
    if (Math.sin(time * omega) > snapThreshold) {
      palletAngle = 0.22;
    } else if (Math.sin(time * omega) < -snapThreshold) {
      palletAngle = -0.22;
    }

    // Step-by-step escapement advancement
    escapeWheelAngle += dt * 3.8;
    fourthWheelAngle += dt * 0.42;
    thirdWheelAngle -= dt * 0.11;
    centerWheelAngle += dt * 0.028;
    barrelAngle -= dt * 0.007;

    // Gradual power delivery
    if (!isWinding) {
      mainspringTension = Math.max(0.12, mainspringTension - dt * 0.0004);
    }

    render(time);

    // Live indicators in DOM
    if (stateLabel) {
      if (speedMultiplier === 0.25) {
        stateLabel.textContent = "Ağır Çekim (0.25x Detay)";
      } else {
        stateLabel.textContent = "28.800 BPH (4 Hz) · Çalışıyor";
      }
    }
    if (reserveLabel) {
      const hours = Math.round(mainspringTension * 42);
      reserveLabel.textContent = `${hours} Saat`;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// DOCUMENT READY INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  // Initialize movement catalogue search & filters (mekanizmalar.html)
  setupSearch({
    inputId: "movement-search",
    gridId: "movement-grid",
    emptyId: "movement-empty",
    countId: "movement-count",
    itemSelector: ".movement-card",
    countLabel: "mekanizma gösteriliyor",
    filters: [
      { id: "origin-filter", attribute: "origin" },
      { id: "reserve-filter", attribute: "reserve" },
      { id: "brand-filter", attribute: "brand" },
      { id: "maker-filter", attribute: "maker" },
    ],
  });

  // Initialize complication search (komplikasyonlar.html)
  setupSearch({
    inputId: "complication-search",
    gridId: "complication-grid",
    emptyId: "complication-empty",
    countId: "complication-count",
    itemSelector: ".complication-card",
    countLabel: "komplikasyon gösteriliyor",
  });

  // Initialize full mechanical watch movement canvas (index.html)
  initWatchMovementCanvas();
});
