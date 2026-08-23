const tabs=document.querySelectorAll(".case-tab");
const panels=document.querySelectorAll(".panel");
tabs.forEach(tab=>{
  tab.addEventListener("click",()=>{
    tabs.forEach(t=>t.classList.remove("active"));
    panels.forEach(p=>p.classList.remove("active-panel"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel).classList.add("active-panel");
    window.scrollTo({top:0,behavior:"smooth"});
    document.querySelector(".top-date").textContent=tab.dataset.panel==="target"?"ANÁLISIS · 01 / 02":"ANÁLISIS · 02 / 02";
  });
});

new Chart(document.getElementById("targetChart"),{
  type:"line",
  data:{labels:["Inicio","Sem. 4","Sem. 8","Sem. 12","Sem. 16","Sem. 20","Sem. 24","Sem. 28","Sem. 32","Sem. 36","Parto"],
  datasets:[
    {label:"Suplementos",data:[15,35,65,82,60,45,35,28,20,15,10],borderColor:"#8dce38",backgroundColor:"#8dce38",tension:.4,borderWidth:3},
    {label:"Cuidado de la piel",data:[5,8,12,20,42,62,70,67,55,40,30],borderColor:"#777d86",backgroundColor:"#777d86",tension:.4,borderWidth:3},
    {label:"Productos próximos al parto",data:[2,3,4,6,8,12,18,30,50,75,90],borderColor:"#111318",backgroundColor:"#111318",tension:.4,borderWidth:3}
  ]},
  options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},plugins:{legend:{position:"bottom",labels:{font:{size:9},usePointStyle:true,padding:15}}},scales:{x:{grid:{display:false},ticks:{font:{size:9}}},y:{beginAtZero:true,max:100,grid:{color:"#0000000c"},ticks:{font:{size:9}}}}}
});

new Chart(document.getElementById("uberDemand"),{
 type:"line",
 data:{labels:["17:00","18:00","19:00","20:00","21:00","22:00","23:00","00:00"],
 datasets:[
 {label:"Demanda",data:[45,58,70,92,100,88,65,48],borderColor:"#111318",backgroundColor:"#111318",tension:.4,borderWidth:3},
 {label:"Oferta disponible",data:[70,68,64,55,42,48,60,72],borderColor:"#8dce38",backgroundColor:"#8dce38",tension:.4,borderWidth:3}
 ]},
 options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},plugins:{legend:{position:"bottom",labels:{font:{size:9},usePointStyle:true,padding:15}}},scales:{x:{grid:{display:false},ticks:{font:{size:9}}},y:{beginAtZero:true,max:110,grid:{color:"#0000000c"},ticks:{font:{size:9}}}}}
});

const demandSlider=document.getElementById("demandSlider");
const demandValue=document.getElementById("demandValue");
const demandSmall=document.getElementById("demandSmall");
const supplyValue=document.getElementById("supplyValue");
const uberPrice=document.getElementById("uberPrice");
const flowPrice=document.getElementById("flowPrice");
const rideMessage=document.getElementById("rideMessage");
const requestRide=document.getElementById("requestRide");

function updateRide(){
  const demand=Number(demandSlider.value);
  const supply=Math.max(25,92-demand*.58);
  const price=2000+(demand*25)+Math.max(0,demand-65)*45;

  demandValue.textContent=demand+"%";
  demandSmall.textContent=demand+"%";
  supplyValue.textContent=Math.round(supply)+"%";

  const formatted="$"+Math.round(price).toLocaleString("es-AR");

  uberPrice.textContent=formatted;

  rideMessage.textContent=
    demand>=80
      ?"Alta demanda: el modelo simulado eleva la tarifa."
      :"El precio se actualiza según el escenario simulado.";
}

demandSlider.addEventListener("input",updateRide);
requestRide.addEventListener("click",()=>{
  const price=uberPrice.textContent;
  rideMessage.innerHTML=`✓ Viaje solicitado. <b>Precio confirmado: ${price}</b>`;
  requestRide.textContent="Viaje solicitado ✓";
  setTimeout(()=>requestRide.textContent="Solicitar viaje",2200);
});
updateRide();

/* ==========================================================================
   🧪 MOTOR DEL LABORATORIO DE TARGET (Modo Humano vs Algoritmo)
   ========================================================================== */

(function initTargetLab() {
  const DATASET = Object.freeze([
    { id: 'A', x1: 0.90, x2: 0.85, x3: 0.70, x4: 0.95, x5: 0.80, groundTruth: 1 },
    { id: 'B', x1: 0.10, x2: 0.15, x3: 0.20, x4: 0.05, x5: 0.30, groundTruth: 0 },
    { id: 'C', x1: 0.80, x2: 0.60, x3: 0.90, x4: 0.85, x5: 0.70, groundTruth: 1 },
    { id: 'D', x1: 0.20, x2: 0.75, x3: 0.60, x4: 0.30, x5: 0.40, groundTruth: 0 },
    { id: 'E', x1: 0.60, x2: 0.70, x3: 0.80, x4: 0.65, x5: 0.50, groundTruth: 1 },
    { id: 'F', x1: 0.70, x2: 0.30, x3: 0.40, x4: 0.55, x5: 0.60, groundTruth: 0 },
    { id: 'G', x1: 0.85, x2: 0.90, x3: 0.85, x4: 0.90, x5: 0.90, groundTruth: 1 },
    { id: 'H', x1: 0.40, x2: 0.50, x3: 0.30, x4: 0.25, x5: 0.80, groundTruth: 0 }
  ]);

  const WEIGHTS = {
    x4: { weight: 0.30, label: 'Cambio de Hábitos' },
    x2: { weight: 0.25, label: 'Cuidado sin Aroma' },
    x1: { weight: 0.20, label: 'Suplementos / Vit.' },
    x3: { weight: 0.15, label: 'Higiene Personal' },
    x5: { weight: 0.10, label: 'Frecuencia de Compra' }
  };

  const state = {
    threshold: 65,
    selectedClientId: 'A',
    userGuesses: {},
    modelExecuted: false
  };

  function computeScore(client) {
    const raw = (
      client.x4 * WEIGHTS.x4.weight +
      client.x2 * WEIGHTS.x2.weight +
      client.x1 * WEIGHTS.x1.weight +
      client.x3 * WEIGHTS.x3.weight +
      client.x5 * WEIGHTS.x5.weight
    );
    return Math.round(raw * 1000) / 10;
  }

  const scoredDataset = DATASET.map(c => ({
    ...c,
    score: computeScore(c)
  }));

  const tableBody = document.getElementById('labTableBody');
  const slider = document.getElementById('labThresholdSlider');
  const thresholdVal = document.getElementById('labThresholdVal');
  const thresholdHint = document.getElementById('labThresholdHint');
  const btnRun = document.getElementById('btnRunModel');
  const humanCompText = document.getElementById('humanComparisonText');

  const cellTP = document.getElementById('valTP');
  const cellFP = document.getElementById('valFP');
  const cellFN = document.getElementById('valFN');
  const cellTN = document.getElementById('valTN');

  const metricAcc = document.getElementById('metricAccuracy');
  const metricPrec = document.getElementById('metricPrecision');
  const metricRec = document.getElementById('metricRecall');
  const metricF1 = document.getElementById('metricF1');

  const xaiClientName = document.getElementById('xaiClientName');
  const xaiTotalScore = document.getElementById('xaiTotalScore');
  const xaiBarsContainer = document.getElementById('xaiBars');

  const btnFP = document.getElementById('btnPrioritizeFP');
  const btnFN = document.getElementById('btnPrioritizeFN');
  const tradeoffFeedback = document.getElementById('tradeoffFeedback');

  if (!tableBody || !slider) return;

  function updateHumanScoreDisplay() {
    if (!state.modelExecuted) {
      humanCompText.textContent = '';
      return;
    }
    let humanHits = 0;
    scoredDataset.forEach(c => {
      const guessed = state.userGuesses[c.id] ? 1 : 0;
      if (guessed === c.groundTruth) humanHits++;
    });
    humanCompText.textContent = `Tu intuición acertó: ${humanHits}/8 perfiles reales.`;
  }

  function renderTable() {
    tableBody.innerHTML = '';

    scoredDataset.forEach(client => {
      const isPredictedPos = client.score >= state.threshold;
      const isSelected = client.id === state.selectedClientId;
      const isGuessedPos = state.userGuesses[client.id] === true;

      const tr = document.createElement('tr');
      if (isSelected) tr.classList.add('selected-row');

      tr.innerHTML = `
        <td><strong>Cliente ${client.id}</strong></td>
        <td>${Math.round(client.x4 * 100)}%</td>
        <td>${Math.round(client.x2 * 100)}%</td>
        <td>${Math.round(client.x1 * 100)}%</td>
        <td>
          <button class="btn-guess ${isGuessedPos ? 'is-pos' : 'is-neg'}" data-id="${client.id}" type="button">
            ${isGuessedPos ? 'Positivo' : 'Negativo'}
          </button>
        </td>
        <td class="model-col ${state.modelExecuted ? '' : 'hidden-col'}">
          <strong>${client.score.toFixed(1)}%</strong>
        </td>
        <td class="model-col ${state.modelExecuted ? '' : 'hidden-col'}">
          <span class="badge-res ${isPredictedPos ? 'pos' : 'neg'}">
            ${isPredictedPos ? 'Positivo' : 'Negativo'}
          </span>
        </td>
      `;

      tr.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-guess')) {
          state.selectedClientId = client.id;
          renderAll();
        }
      });

      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll('.btn-guess').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-id');
        state.userGuesses[cid] = !state.userGuesses[cid];
        renderTable();
        updateHumanScoreDisplay();
      });
    });
  }

  function renderXAI() {
    const client = scoredDataset.find(c => c.id === state.selectedClientId) || scoredDataset[0];
    xaiClientName.textContent = client.id;
    xaiTotalScore.textContent = `${client.score.toFixed(1)}%`;

    const contributions = [
      { name: 'Cambio de Hábitos (30%)', val: client.x4 * WEIGHTS.x4.weight * 100 },
      { name: 'Cuidado sin Aroma (25%)', val: client.x2 * WEIGHTS.x2.weight * 100 },
      { name: 'Suplementos (20%)', val: client.x1 * WEIGHTS.x1.weight * 100 },
      { name: 'Higiene (15%)', val: client.x3 * WEIGHTS.x3.weight * 100 },
      { name: 'Frecuencia (10%)', val: client.x5 * WEIGHTS.x5.weight * 100 }
    ];

    xaiBarsContainer.innerHTML = contributions.map(item => `
      <div class="xai-row">
        <span>${item.name}</span>
        <div class="xai-bar-track">
          <div class="xai-bar-fill" style="width: ${(item.val / 30) * 100}%"></div>
        </div>
        <strong>+${item.val.toFixed(1)}%</strong>
      </div>
    `).join('');
  }

  function renderMatrixAndMetrics() {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    scoredDataset.forEach(client => {
      const predictedPos = client.score >= state.threshold ? 1 : 0;
      const actualPos = client.groundTruth;

      if (predictedPos === 1 && actualPos === 1) tp++;
      else if (predictedPos === 1 && actualPos === 0) fp++;
      else if (predictedPos === 0 && actualPos === 0) tn++;
      else if (predictedPos === 0 && actualPos === 1) fn++;
    });

    cellTP.textContent = tp;
    cellFP.textContent = fp;
    cellFN.textContent = fn;
    cellTN.textContent = tn;

    const total = tp + fp + tn + fn;
    const accuracy = total > 0 ? ((tp + tn) / total) : 0;
    const precision = (tp + fp) > 0 ? (tp / (tp + fp)) : 0;
    const recall = (tp + fn) > 0 ? (tp / (tp + fn)) : 0;
    const f1 = (precision + recall) > 0 ? (2 * (precision * recall) / (precision + recall)) : 0;

    metricAcc.textContent = `${Math.round(accuracy * 100)}%`;
    metricPrec.textContent = `${Math.round(precision * 100)}%`;
    metricRec.textContent = `${Math.round(recall * 100)}%`;
    metricF1.textContent = f1.toFixed(2);

    thresholdVal.textContent = state.threshold;
    thresholdHint.innerHTML = `Todo score &ge; <strong>${state.threshold}%</strong> se clasifica como <strong>Positivo</strong>. Scores menores son <strong>Negativos</strong>.`;
  }

  function renderAll() {
    renderTable();
    renderXAI();
    renderMatrixAndMetrics();
    updateHumanScoreDisplay();
  }

  slider.addEventListener('input', (e) => {
    state.threshold = parseInt(e.target.value, 10);
    renderAll();
  });

  if (btnRun) {
    btnRun.addEventListener('click', () => {
      if (!state.modelExecuted) {
        state.modelExecuted = true;
        btnRun.textContent = '🔄 REINICIAR INTENTO';
        btnRun.style.background = '#e2e8f0';
        btnRun.style.color = '#334155';
        btnRun.style.borderColor = '#cbd5e1';
      } else {
        // Modo reinicio
        state.modelExecuted = false;
        state.userGuesses = {};
        btnRun.textContent = '▶ EJECUTAR MODELO';
        btnRun.style.background = '';
        btnRun.style.color = '';
        btnRun.style.borderColor = '';
      }
      renderAll();
    });
  }

  btnFP.addEventListener('click', () => {
    btnFP.classList.add('active');
    btnFN.classList.remove('active');
    tradeoffFeedback.innerHTML = `
      <strong>Estrategia: Reducción de Falsos Positivos (&uarr; Precision)</strong><br>
      Recomendable elevar el umbral (&theta; &ge; 75%). Se evita enviar promociones invasivas a clientas que no están embarazadas (protección de privacidad y reputación), asumiendo el costo de perder algunas oportunidades de venta.
    `;
  });

  btnFN.addEventListener('click', () => {
    btnFN.classList.add('active');
    btnFP.classList.remove('active');
    tradeoffFeedback.innerHTML = `
      <strong>Estrategia: Reducción de Falsos Negativos (&uarr; Recall)</strong><br>
      Recomendable reducir el umbral (&theta; &le; 50%). Se maximiza la captación de todas las posibles clientas en etapa de gestación para fidelizarlas primero, asumiendo una mayor tasa de cupones enviados por error.
    `;
  });

  renderAll();
})();