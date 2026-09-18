const KEY="evolua-finance-v2";let state=JSON.parse(localStorage.getItem(KEY)||'{"transactions":[],"goal":{"name":"","value":0}}');let type="income";
const $=id=>document.getElementById(id); const money=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
$("date").value=new Date().toISOString().slice(0,10); $("monthLabel").textContent=new Date().toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
document.querySelectorAll(".typebtn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".typebtn").forEach(x=>x.classList.remove("active"));b.classList.add("active");type=b.dataset.type});
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()}
function render(){
 const inc=state.transactions.filter(x=>x.type==="income").reduce((a,x)=>a+x.amount,0), exp=state.transactions.filter(x=>x.type==="expense").reduce((a,x)=>a+x.amount,0);
 $("income").textContent=money(inc);$("expense").textContent=money(exp);$("balance").textContent=money(inc-exp);
 const max=Math.max(inc,exp,1);$("incomeBar").style.width=(inc/max*100)+"%";$("expenseBar").style.width=(exp/max*100)+"%";
 const goal=Number(state.goal.value)||0; const pct=goal?Math.min(100,Math.round(Math.max(0,inc-exp)/goal*100)):0;
 $("goalPct").textContent=pct+"%";$("goalProgress").style.width=pct+"%";$("goalText").textContent=goal?`${state.goal.name||"Minha meta"}: ${money(Math.max(0,inc-exp))} de ${money(goal)}`:"Defina uma meta para começar.";
 $("goalName").value=state.goal.name||"";$("goalValue").value=state.goal.value||"";
 const box=$("transactions"); if(!state.transactions.length){box.innerHTML='<p class="empty">Nenhuma movimentação ainda.</p>';return}
 box.innerHTML=state.transactions.slice().reverse().map((x,i)=>`<div class="tx"><div><div class="txname">${x.description}</div><div class="txmeta">${x.category} • ${new Date(x.date+"T12:00:00").toLocaleDateString("pt-BR")}</div></div><div class="${x.type==="income"?"plus":"minus"}">${x.type==="income"?"+":"−"} ${money(x.amount)}</div></div>`).join("");
}
$("movementForm").onsubmit=e=>{e.preventDefault();const amount=Number($("amount").value);if(!amount)return;state.transactions.push({description:$("description").value.trim(),amount,type,category:$("category").value,date:$("date").value});e.target.reset();$("date").value=new Date().toISOString().slice(0,10);save()};
$("saveGoal").onclick=()=>{state.goal={name:$("goalName").value.trim(),value:Number($("goalValue").value)||0};save()};
$("clearBtn").onclick=()=>{if(confirm("Limpar todas as movimentações?")){state.transactions=[];save()}};
$("resetBtn").onclick=()=>{if(confirm("Apagar todos os dados do app?")){state={transactions:[],goal:{name:"",value:0}};save()}};
render();
