
let usuarioLogado;
let horarioDoEnvio;
let mensagemEnviada;

const input = document.getElementById("myInput");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("myButton").click();
    }
});

function entrarNaSala() {
    const login = document.querySelector(".user-name").value;
    console.log(login);
    if (login != null) {
        const participante = {
            name: login
        }
        const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", participante);
        requisicao.then(validarUsuario);
        requisicao.catch(validacaoDeUsuarioFalhou);

        setInterval(manterOnline, 5000);

        atualizarPagina();
        setInterval(atualizarPagina, 3000);
        usuarioLogado = login;
    } else {console.log("false")}
}
function validarUsuario(resposta) {
    if (resposta.status == 400) {
        alert("Ja existe um usuário com este nickname, por favor escolha outro nick.");
        entrarNaSala();
    }
    console.log("entrou na sala");
    atualizarPagina();
}
function validacaoDeUsuarioFalhou(erro) {
    console.log("deu erro no post do nome de usuario" + erro);
    entrarNaSala();
}

function atualizarPagina() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(processarRespostas);
    promessa.catch(processarErroGet);
}
function processarErroGet(erro) {
    console("deu ruim no GET")
}

function processarRespostas(respostas) {
    // console.log(respostas);
    const main = document.querySelector(".feed");
    const ultimoElemento = (respostas.data.length) - 1;

    const abrirChat = document.querySelector(".chat");
    const fechaLogin = document.querySelector(".login");
    abrirChat.classList.remove("escondido");
    fechaLogin.classList.add("escondido");

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
        <div class="caixaMensagem" data-identifier="message"> 
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
         <div class="caixaMensagem privada" data-identifier="message"> 
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
        <div class="caixaMensagem scroll " data-identifier="message"> 
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
         <div class="caixaMensagem privada scroll" data-identifier="message"> 
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


function postarMensagem(clique) {
    const input = document.querySelector(".mensagemDigitada");
    const textoDigitado = input.value;

    const objetoMensagem = {
        from: `${usuarioLogado}`,
        to: "Todos",
        text: `${textoDigitado}`,
        type: "message"
    }
    const enviarNovaMensagem = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objetoMensagem);
    enviarNovaMensagem.then(okPostMensagem);
    enviarNovaMensagem.catch(erroPostMensagem);
    input.value = "";
}
function okPostMensagem() {
    atualizarPagina();
}
function erroPostMensagem(resposta) {
    console.log("deu ruim ao postar resposta" + resposta);
}

function scrollToEnd() {
    const mensagemParaScrollar = document.querySelector(".scroll");
    if (mensagemParaScrollar !== null) {
        mensagemParaScrollar.scrollIntoView();
        mensagemParaScrollar.classList.remove("scroll");
    }
}


function abrirSideBar() {
    const sideBar = document.querySelector(".participantes");
    sideBar.classList.remove("escondido");
}

function manterOnline() {
    const manterparticipante = {
        name: usuarioLogado
    }
    const manterOnline = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", manterparticipante);
    manterOnline.then(taOn);
    manterOnline.catch(taOff);
}
function taOn(resposta) {
    console.log("coneccted" + resposta);
}
function taOff(resposta) {
    console.log("error, fell out of chat" + resposta);
}
