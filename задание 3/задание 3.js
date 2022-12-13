/* 
Реализовать чат на основе эхо-сервера wss://echo.websocket.org/. Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить». При клике на кнопку «Отправить» сообщение должно появляться в окне переписки. Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат. При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией.Сообщение, которое отправит обратно эхо-сервер, не выводить. 
*/

const wsUri = " wss://echo-ws-service.herokuapp.com";

const input = document.querySelector('.input');
const btnMess = document.querySelector('.btn-mess');
const btnGeo = document.querySelector('.btn-geo');
const userMessages = document.querySelector('.user-messages');
const serverMessages = document.querySelector('.server-messages');
const headerChat = document.querySelector('.header-chat');

function writeWords(message, status = 'flex-end') {
    let element = `
        <p class='messages' style='align-self: ${status}'>
            ${message}
        </p>
    `;
    userMessages.innerHTML += element;
    headerChat.scrollTop = headerChat.scrollHeight;
}

let websocket = new WebSocket(wsUri);
websocket.onopen = function (evt) {
    console.log("CONNECTED");
};
websocket.onmessage = function (evt) {
    writeWords(`ответ сервера: ${evt.data}`, 'flex-start');
};
websocket.onerror = function (evt) {
    writeWords(`server: ${evt.data}`, 'flex-start');
};

btnMess.addEventListener('click', () => {
    let message = input.value;
    websocket.send(message);
    writeWords(`Вы: ${message}`);
    input.value = ''

});

//гео-локация.

const error = () => {
    let textErr0r = 'Невозможно получить ваше местоположение';
    writeWords(textErr0r);
};

const success = (status) => {
    let latitude = status.coords.latitude;
    let longitude = status.coords.longitude;
    let geoLink = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    writeWords(`<a  href='${geoLink}' target='_blank'>Ваша гео-локация</a>`);
};

btnGeo.addEventListener('click', () => {
    if (!navigator.geolocation) {
        console.log('Geolocation не поддерживается вашим браузером');
    } else {
        navigator.geolocation.getCurrentStatus(success, error);
    }
});

serverMessages.addEventListener('click', () => {
    userMessages.innerHTML = " ";
});