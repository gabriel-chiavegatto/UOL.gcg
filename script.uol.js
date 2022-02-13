
let usuario;
let horarioDoEnvio;
let mensagemEnviada;

function retornarHora(){
    const horario = new Date;
    let hora = horario.getHours();
    let minutos = horario.getMinutes();
    let segundos = horario.getSeconds();
    if(hora<10){
        hora = `0${hora}`;
    }
    if(minutos<10){
        minutos = `0${minutos}`;
    }
    if(segundos<10){
        segundos = `0${segundos}` ;
    }
    horarioDoEnvio = "(" + hora + ":" + minutos + ":" + segundos + ")";

}

function entrarNaSala() {
    usuario = prompt("Qual seu nome?");
    retornarHora();
    const main = document.querySelector(".feed");
    main.innerHTML += `
    <div class="log">
            <p>
                <span class="hora">${horarioDoEnvio}</span>
                <span class="usuario remetente">${usuario}</span>
                <span class="açao">entrou na sala...</span>
            </p>
        </div>
    `
} 



function converterTextoEmMensagem(clique){
    retornarHora();
    const input = document.querySelector(".mensagemDigitada");
    const text = input.value;
    mensagemEnviada = text;
    input.value = "";
    adicionarCaixaDeMensagem();
}

function adicionarCaixaDeMensagem(){
    const main = document.querySelector(".feed");
    main.innerHTML += `
    <div class="caixaMensagem"> 
            <p>
                <span class="hora">${horarioDoEnvio}</span>
                <span class="usuario remetente">${usuario}</span>   
                <span class="paraQuem">para</span>
                <span class="usuario destinatário">Todos</span>: 
                <span class="texto">${mensagemEnviada}</span> 
            </p>
        </div>
    `
}










entrarNaSala();
