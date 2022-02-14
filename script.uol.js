let usuarioLogado;
let horarioDoEnvio;
let mensagemEnviada;


entrarNaSala();
atualizarPagina();
setInterval(atualizarPagina, 3000);


function atualizarPagina() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(processarRespostas);
    promessa.catch(processarErroGet);
}


function processarRespostas(respostas) {
    console.log(respostas);
    const main = document.querySelector(".feed");
    main.innerHTML = "";
    const ultimoElemento = (respostas.data.length) - 1;
    for (i = 0; i < ultimoElemento; i++) {

        if (respostas.data[i].type === "status") {
            main.innerHTML += `
        <div class="log">
            <p>
                <span class="hora">(${respostas.data[i].time})</span>
                <span class="usuario remetente">${respostas.data[i].from}</span>
                <span class="açao">${respostas.data[i].text}</span>
            </p>
        </div>
        `
        }

        if (respostas.data[i].type === "message") {
            main.innerHTML += `
        <div class="caixaMensagem"> 
            <p>
                <span class="hora">(${respostas.data[i].time})</span>
                <span class="usuario remetente">${respostas.data[i].from}</span>   
                <span class="paraQuem">para</span>
                <span class="usuario destinatário">${respostas.data[i].to}</span>: 
                <span class="texto">${respostas.data[i].text}</span> 
            </p>
        </div>
        `
        }

        if (respostas.data[i].type === "private_message") {
            main.innerHTML += `
         <div class="caixaMensagem privada"> 
            <p>
                <span class="hora">(${respostas.data[i].time})</span>
                <span class="usuario remetente">${respostas.data[i].from}</span>   
                <span class="paraQuem">reservadamente para</span>
                <span class="usuario destinatário">${respostas.data[i].to}</span>: 
                <span class="texto">${respostas.data[i].text}</span> 
            </p>
        </div>
        `
        }
    }

    // ultimo elemento para scrollar
    
    if (respostas.data[ultimoElemento].type === "status") {
        main.innerHTML += `
        <div class="log scroll">
            <p>
                <span class="hora">(${respostas.data[ultimoElemento].time})</span>
                <span class="usuario remetente">${respostas.data[ultimoElemento].from}</span>
                <span class="açao">${respostas.data[ultimoElemento].text}</span>
            </p>
        </div>
        `
    }

    if (respostas.data[ultimoElemento].type === "message") {
        main.innerHTML += `
        <div class="caixaMensagem scroll"> 
            <p>
                <span class="hora">(${respostas.data[ultimoElemento].time})</span>
                <span class="usuario remetente">${respostas.data[ultimoElemento].from}</span>   
                <span class="paraQuem">para</span>
                <span class="usuario destinatário">${respostas.data[ultimoElemento].to}</span>: 
                <span class="texto">${respostas.data[ultimoElemento].text}</span> 
            </p>
        </div>
        `
    }

    if (respostas.data[ultimoElemento].type === "private_message") {
        main.innerHTML += `
         <div class="caixaMensagem privada scroll"> 
            <p>
                <span class="hora">(${respostas.data[ultimoElemento].time})</span>
                <span class="usuario remetente">${respostas.data[ultimoElemento].from}</span>   
                <span class="paraQuem">reservadamente para</span>
                <span class="usuario destinatário">${respostas.data[ultimoElemento].to}</span>: 
                <span class="texto">${respostas.data[ultimoElemento].text}</span> 
            </p>
        </div>
        `
    }
    // scrollar e tirar a classe scroll
    scrollToEnd();
}
function processarErroGet(erro) {
    console("deu ruim no GET")
}

function retornarHora() {
    const horario = new Date;
    let hora = horario.getHours();
    let minutos = horario.getMinutes();
    let segundos = horario.getSeconds();
    if (hora < 10) {
        hora = `0${hora}`;
    }
    if (minutos < 10) {
        minutos = `0${minutos}`;
    }
    if (segundos < 10) {
        segundos = `0${segundos}`;
    }
    horarioDoEnvio = hora + ":" + minutos + ":" + segundos;

}

function entrarNaSala(){
    const login = prompt("Bem Vindo ao bate-bapo UOL. \nQual seu nome?");
    usuarioLogado = login;
    const participante = {
        name: login
    }
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", participante);
    requisicao.then(validarUsuario);
    requisicao.catch(validacaoDeUsuarioFalhou);

    console.log("entrou na sala");

    setInterval(() => { 
        manterOnline(login);
   }, 5000);

}
function validarUsuario(resposta){
    if(resposta.status == 400){
        alert("Ja existe um usuário com este nickname, por favor escolha outro nick.");
        entrarNaSala();
    }
}
function validacaoDeUsuarioFalhou(erro){
    console.log("deu erro no post do nome de usuario" + erro);
}
function manterOnline(usuario){
    const manterparticipante = {
        name: usuario
    }
    console.log(manterparticipante);
    const manterOnline = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", manterparticipante);
    console.log("deu bom, ta atualizando o login");
}


// function converterTextoEmMensagem(clique) {
//     retornarHora();
//     const input = document.querySelector(".mensagemDigitada");
//     const text = input.value;
//     if (text !== "") {
//         mensagemEnviada = text;
//         input.value = "";
//         adicionarCaixaDeMensagem();
//     }
// }

// function adicionarCaixaDeMensagem() {
//     const main = document.querySelector(".feed");
//     main.innerHTML += `
//     <div class="caixaMensagem scroll"> 
//             <p>
//                 <span class="hora">(${horarioDoEnvio})</span>
//                 <span class="usuario remetente">${usuario}</span>   
//                 <span class="paraQuem">para</span>
//                 <span class="usuario destinatário">Todos</span>: 
//                 <span class="texto">${mensagemEnviada}</span> 
//             </p>
//         </div>
//     `
//     scrollToEnd();
// }
function postarMensagem(clique){
    const input = document.querySelector(".mensagemDigitada");
    const textoDigitado = input.value;

    if (textoDigitado !== "") {
        const objeto = {
            from: usuarioLogado,
            to: "Todos",
            text: textoDigitado,
            type: "mensage"
        }
        const enviarNovaMensagem = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", objeto); 
        enviarNovaMensagem.then(processarRespostas);
        enviarNovaMensagem.catch(erroPostMensagem);
    }
}
function erroPostMensagem(resposta){
    console.log("deu ruim ao postar resposta" + resposta);
}

function scrollToEnd() {
    const mensagemParaScrollar = document.querySelector(".scroll");
    mensagemParaScrollar.scrollIntoView();
    mensagemParaScrollar.classList.remove("scroll");
}










