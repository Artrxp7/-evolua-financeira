const KEY='evolua-finance-v1';
let data=JSON.parse(localStorage.getItem(KEY)||'null')||{transactions:[],goal:null};
const brl=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v||0);
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function render(){
 let inc=data.transactions.filter(x=>x.type==='income').reduce((s,x)=>s+x.amount,0);
 let exp=data.transactions.filter(x=>x.type==='expense').reduce((s,x)=>s+x.amount,0);
 document.getElementById('income').textContent=brl(inc);
 document.getElementById('expense').textContent=brl(exp);
 document.getElementById('balance').textContent=brl(inc-exp);
 const list=document.getElementById('transactions');
 list.innerHTML=data.transactions.length?data.transactions.slice().reverse().map(x=>`<div class="item"><div><b>${escapeHtml(x.description)}</b><br><small>${x.type==='income'?'Receita':'Gasto'}</small></div><strong class="${x.type==='income'?'positive':'negative'}">${x.type==='income'?'+':'-'} ${brl(x.amount)}</strong></div>`).join(''):'<div class="empty">Nenhuma movimentação cadastrada.</div>';
 const g=document.getElementById('goal');
 if(!data.goal){g.innerHTML='<div class="empty">Crie sua primeira meta.</div>';return}
 const pct=Math.min(100,(data.goal.saved/data.goal.target)*100||0);
 g.innerHTML=`<h3>${escapeHtml(data.goal.name)}</h3><div class="goalbar"><div class="goalfill" style="width:${pct}%"></div></div><div class="goaltext"><span>${brl(data.goal.saved)}</span><b>${pct.toFixed(0)}%</b><span>${brl(data.goal.target)}</span></div>`;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
document.getElementById('add').onclick=()=>{let d=document.getElementById('description').value.trim(),a=Number(document.getElementById('amount').value),t=document.getElementById('type').value;if(!d||!a||a<=0)return alert('Informe descrição e valor.');data.transactions.push({description:d,amount:a,type:t,date:Date.now()});document.getElementById('description').value='';document.getElementById('amount').value='';save()};
document.getElementById('saveGoal').onclick=()=>{let n=document.getElementById('goalName').value.trim(),t=Number(document.getElementById('goalTarget').value),s=Number(document.getElementById('goalSaved').value)||0;if(!n||!t||t<=0)return alert('Informe o nome e o valor da meta.');data.goal={name:n,target:t,saved:Math.max(0,s)};save()};
document.getElementById('clear').onclick=()=>{if(confirm('Limpar todas as movimentações?')){data.transactions=[];save()}};
document.getElementById('reset').onclick=()=>{if(confirm('Apagar todos os dados deste aparelho?')){data={transactions:[],goal:null};save()}};
render();