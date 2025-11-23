function adicionarAluno() {
const nome = document.getElementById("nomeAluno").value;
if (!nome) return alert("Digite um nome!");


let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
alunos.push(nome);
localStorage.setItem("alunos", JSON.stringify(alunos));


mostrarAlunos();
document.getElementById("nomeAluno").value = "";
}


function mostrarAlunos() {
const lista = document.getElementById("listaAlunos");
if (!lista) return;


let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
lista.innerHTML = alunos.map(a => `<li>${a}</li>`).join("");


document.getElementById("selAluno").innerHTML = alunos.map(a => `<option>${a}</option>`).join("");
}


function adicionarLivro() {
const nome = document.getElementById("nomeLivro").value;
if (!nome) return alert("Digite o título!");


let livros = JSON.parse(localStorage.getItem("livros")) || [];
livros.push(nome);
localStorage.setItem("livros", JSON.stringify(livros));


mostrarLivros();
document.getElementById("nomeLivro").value = "";
}


function mostrarLivros() {
const lista = document.getElementById("listaLivros");
if (!lista) return;


let livros = JSON.parse(localStorage.getItem("livros")) || [];
lista.innerHTML = livros.map(l => `<li>${l}</li>`).join("");


document.getElementById("selLivro").innerHTML = livros.map(l => `<option>${l}</option>`).join("");
}


function adicionarRegistro() {
const aluno = document.getElementById("selAluno").value;
const livro = document.getElementById("selLivro").value;
const status = document.getElementById("selStatus").value;


let registros = JSON.parse(localStorage.getItem("registros")) || [];
registros.push({ aluno, livro, status });
localStorage.setItem("registros", JSON.stringify(registros));


mostrarRegistros();
}


function mostrarRegistros() {
const lista = document.getElementById("listaRegistros");
if (!lista) return;


let registros = JSON.parse(localStorage.getItem("registros")) || [];
lista.innerHTML = registros.map(r => `<li>${r.aluno} — ${r.livro} — <b>${r.status}</b></li>`).join("");
}


mostrarAlunos();
mostrarLivros();
mostrarRegistros();
