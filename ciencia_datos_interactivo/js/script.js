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

const targetSlider=document.getElementById("targetSlider");
const targetScore=document.getElementById("targetScore");
const targetScoreBar=document.getElementById("targetScoreBar");

targetSlider.addEventListener("input",()=>{
  const v=targetSlider.value;
  targetScore.textContent=v+"%";
  targetScoreBar.style.width=v+"%";
});