export function message_broadcast(vue, message) {
    console.log(window);
    vue.$worker.run((opener) => opener.postMessage(message, 'http://www.eternagame.org'), [JSON.parse(JSON.stringify(window.opener))])
        .then((test) => console.log('SUCCCCCCCCCCCCCCCCCCCCCCEEEEEEEEEEEEEEEEESSSSSSSSSSSSS'))
        .catch(console.error);
}

// receive message
// 
export function message_receive(ev) {
    if (ev.origin !== "http://www.eternagame.org") return; // ignore other keys
    var message = JSON.parse(ev.data);
    if (!message) return; // ignore empty msg or msg reset

    // here you act on messages.
    // you can send objects like { 'command': 'doit', 'data': 'abcd' }
    if (message.command == 'doit') alert(message.data);

    // etc.
}
