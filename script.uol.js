const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
promessa.then(processarRespostas);

let usuario;
let horarioDoEnvio;
let mensagemEnviada;

function processarRespostas(respostas) {
    console.log(respostas);
    const main = document.querySelector(".feed");

    for (i = 0; i < 100; i++) {

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

        if (respostas.data[4].type === "message") {
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

        if (respostas.data[4].type === "private_message") {
            main.innerHTML += `
         <div class="caixaMensagem"> 
            <p>
                <span class="hora">(${respostas.data[i].time})</span>
                <span class="usuario remetente">${respostas.data[i].from}</span>   
                <span class="paraQuem privada">reservadamente para</span>
                <span class="usuario destinatário">${respostas.data[i].to}</span>: 
                <span class="texto">${respostas.data[i].text}</span> 
            </p>
        </div>
        `
        }
    }
    entrarNaSala();
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

function entrarNaSala() {
    // usuario = prompt("Qual seu nome?");
    retornarHora();
    const main = document.querySelector(".feed");
    main.innerHTML += `
    <div class="log">
            <p>
                <span class="hora">(${horarioDoEnvio})</span>
                <span class="usuario remetente">${usuario}</span>
                <span class="açao">entra na sala...</span>
            </p>
        </div>
    `
}



function converterTextoEmMensagem(clique) {
    retornarHora();
    const input = document.querySelector(".mensagemDigitada");
    const text = input.value;
    mensagemEnviada = text;
    input.value = "";
    adicionarCaixaDeMensagem();
}

function adicionarCaixaDeMensagem() {
    const main = document.querySelector(".feed");
    main.innerHTML += `
    <div class="caixaMensagem"> 
            <p>
                <span class="hora">(${horarioDoEnvio})</span>
                <span class="usuario remetente">${usuario}</span>   
                <span class="paraQuem">para</span>
                <span class="usuario destinatário">Todos</span>: 
                <span class="texto">${mensagemEnviada}</span> 
            </p>
        </div>
    `
}











