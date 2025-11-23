/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);

/* ---------- Theme ---------- */
const themeColorInput = $('themeColor');
function setThemeColor(color){
  document.documentElement.style.setProperty('--accent', color);
}
themeColorInput.addEventListener('input', (e) => {
  setThemeColor(e.target.value);
  localStorage.setItem('themeColor', e.target.value);
});
const savedTheme = localStorage.getItem('themeColor');
if(savedTheme){ themeColorInput.value = savedTheme; setThemeColor(savedTheme); }

/* ---------- Data storage keys ---------- */
const KEY_ALUNOS = 'alunos_v1';
const KEY_LIVROS = 'livros_v1';
const KEY_REG = 'registros_v1';

/* ---------- Alunos (com cor) ---------- */
function carregarAlunos(){
  return JSON.parse(localStorage.getItem(KEY_ALUNOS) || '[]');
}
function salvarAlunos(arr){ localStorage.setItem(KEY_ALUNOS, JSON.stringify(arr)); renderAlunos(); preencherSelects(); }

function adicionarAluno(){
  const nomeInput = $('nomeAluno');
  const corInput = $('corAlunoDefault');
  const nome = nomeInput.value.trim();
  const cor = corInput.value || '#ffd166';
  if(!nome) return alert('Digite um nome!');
  const alunos = carregarAlunos();
  alunos.push({ id: uid(), nome, cor });
  salvarAlunos(alunos);
  nomeInput.value = '';
}

$('btnAddAluno').addEventListener('click', adicionarAluno);
$('nomeAluno').addEventListener('keydown', (e) => { if(e.key === 'Enter') adicionarAluno(); });

function editarAluno(id){
  const alunos = carregarAlunos();
  const idx = alunos.findIndex(a => a.id === id);
  if(idx === -1) return;
  const novo = prompt('Editar nome do aluno:', alunos[idx].nome);
  if(novo === null) return; // cancelou
  const trimmed = novo.trim();
  if(!trimmed) return alert('Nome não pode ficar vazio.');
  alunos[idx].nome = trimmed;
  salvarAlunos(alunos);
}

function mudarCorAluno(id, novaCor){
  const alunos = carregarAlunos();
  const idx = alunos.findIndex(a => a.id === id);
  if(idx === -1) return;
  alunos[idx].cor = novaCor;
  salvarAlunos(alunos);
}

function removerAluno(id){
  if(!confirm('Apagar este aluno?')) return;
  let alunos = carregarAlunos();
  alunos = alunos.filter(a => a.id !== id);
  localStorage.setItem(KEY_ALUNOS, JSON.stringify(alunos));
  renderAlunos();
  preencherSelects();
}

/* ---------- Render Alunos ---------- */
function renderAlunos(){
  const lista = $('listaAlunos');
  lista.innerHTML = '';
  const alunos = carregarAlunos();
  if(alunos.length === 0){
    lista.innerHTML = '<li class="item"><div class="item-body"><p class="item-sub">Nenhum aluno cadastrado</p></div></li>';
    return;
  }
  alunos.forEach(a => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <div class="bullet" style="background:${a.cor}">${a.nome.slice(0,2).toUpperCase()}</div>
      <div class="item-body">
        <p class="item-title">${a.nome}</p>
        <p class="item-sub">Clique em editar para alterar o nome</p>
      </div>
      <div class="item-actions">
        <input class="small-input" type="color" value="${a.cor}" data-id="${a.id}" title="Mudar cor do aluno">
        <button class="btn-ghost" data-edit="${a.id}">Editar</button>
        <button class="btn-ghost" data-del="${a.id}">Apagar</button>
      </div>
    `;
    lista.appendChild(li);
  });

  // eventos delegados
  lista.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editarAluno(b.getAttribute('data-edit')));
  lista.querySelectorAll('[data-del]').forEach(b => b.onclick = () => removerAluno(b.getAttribute('data-del')));
  lista.querySelectorAll('input[type=color]').forEach(c => {
    c.oninput = (ev) => {
      const id = ev.target.getAttribute('data-id');
      mudarCorAluno(id, ev.target.value);
    };
  });
}

/* ---------- Livros ---------- */
function carregarLivros(){ return JSON.parse(localStorage.getItem(KEY_LIVROS) || '[]'); }
function salvarLivros(arr){ localStorage.setItem(KEY_LIVROS, JSON.stringify(arr)); renderLivros(); preencherSelects(); }

function adicionarLivro(){
  const nome = $('nomeLivro').value.trim();
  if(!nome) return alert('Digite o título do livro!');
  const livros = carregarLivros();
  livros.push({ id: uid(), titulo: nome });
  salvarLivros(livros);
  $('nomeLivro').value = '';
}
$('btnAddLivro').addEventListener('click', adicionarLivro);
$('nomeLivro').addEventListener('keydown', (e)=>{ if(e.key==='Enter') adicionarLivro(); });

function removerLivro(id){
  if(!confirm('Apagar este livro?')) return;
  let livros = carregarLivros();
  livros = livros.filter(l => l.id !== id);
  localStorage.setItem(KEY_LIVROS, JSON.stringify(livros));
  renderLivros();
  preencherSelects();
}

function renderLivros(){
  const lista = $('listaLivros');
  lista.innerHTML = '';
  const livros = carregarLivros();
  if(livros.length === 0){
    lista.innerHTML = '<li class="item"><div class="item-body"><p class="item-sub">Nenhum livro cadastrado</p></div></li>';
    return;
  }
  livros.forEach(l => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <div class="bullet" style="background:var(--accent)">${l.titulo.slice(0,2).toUpperCase()}</div>
      <div class="item-body">
        <p class="item-title">${l.titulo}</p>
      </div>
      <div class="item-actions">
        <button class="btn-ghost" data-del="${l.id}">Apagar</button>
      </div>
    `;
    lista.appendChild(li);
  });
  lista.querySelectorAll('[data-del]').forEach(b => b.onclick = () => removerLivro(b.getAttribute('data-del')));
}

/* ---------- Registros ---------- */
function carregarRegistros(){ return JSON.parse(localStorage.getItem(KEY_REG) || '[]'); }
function salvarRegistros(arr){ localStorage.setItem(KEY_REG, JSON.stringify(arr)); renderRegistros(); }

function adicionarRegistro(){
  const selAluno = $('selAluno').value;
  const selLivro = $('selLivro').value;
  const status = $('selStatus').value;
  if(!selAluno || !selLivro) return alert('Selecione aluno e livro.');
  const registros = carregarRegistros();
  registros.push({ id: uid(), alunoId: selAluno, livroId: selLivro, status, data: new Date().toISOString() });
  salvarRegistros(registros);
}
$('btnAddRegistro').addEventListener('click', adicionarRegistro);

function removerRegistro(id){
  if(!confirm('Apagar este registro?')) return;
  let regs = carregarRegistros();
  regs = regs.filter(r => r.id !== id);
  salvarRegistros(regs);
}

function renderRegistros(){
  const lista = $('listaRegistros');
  lista.innerHTML = '';
  const regs = carregarRegistros();
  if(regs.length === 0){
    lista.innerHTML = '<li class="item"><div class="item-body"><p class="item-sub">Nenhum registro</p></div></li>';
    return;
  }
  const alunos = carregarAlunos();
  const livros = carregarLivros();
  regs.slice().reverse().forEach(r => {
    const aluno = alunos.find(a=>a.id===r.alunoId);
    const livro = livros.find(l=>l.id===r.livroId);
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `
      <div class="bullet" style="background:${aluno?.cor || 'var(--accent)'}">${(aluno?.nome||'--').slice(0,2).toUpperCase()}</div>
      <div class="item-body">
        <p class="item-title">${aluno?.nome || 'Aluno apagado'} — ${livro?.titulo || 'Livro apagado'}</p>
        <p class="item-sub">${new Date(r.data).toLocaleString()} • <b>${r.status}</b></p>
      </div>
      <div class="item-actions">
        <button class="btn-ghost" data-del="${r.id}">Apagar</button>
      </div>
    `;
    lista.appendChild(li);
  });
  lista.querySelectorAll('[data-del]').forEach(b => b.onclick = () => removerRegistro(b.getAttribute('data-del')));
}

/* ---------- Selects ---------- */
function preencherSelects(){
  const selAluno = $('selAluno');
  const selLivro = $('selLivro');
  selAluno.innerHTML = '';
  selLivro.innerHTML = '';
  const alunos = carregarAlunos();
  const livros = carregarLivros();
  alunos.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.text = a.nome;
    selAluno.appendChild(opt);
  });
  livros.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.text = l.titulo;
    selLivro.appendChild(opt);
  });
}

/* ---------- Reset / limpar ---------- */
$('resetData').addEventListener('click', () => {
  if(confirm('Limpar todos os dados (alunos, livros e registros)?')) {
    localStorage.removeItem(KEY_ALUNOS);
    localStorage.removeItem(KEY_LIVROS);
    localStorage.removeItem(KEY_REG);
    location.reload();
  }
});

/* ---------- Inicialização ---------- */
function init(){
  // se não houver cor padrão do aluno no input, define um padrão
  if(!$('corAlunoDefault').value) $('corAlunoDefault').value = '#ffd166';
  renderAlunos();
  renderLivros();
  renderRegistros();
  preencherSelects();
}
window.onload = init;
