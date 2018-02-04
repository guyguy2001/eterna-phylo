
export function message_broadcast(data) {
  if (data.command === 'update-lane') {

    window.opener.postMessage(data, 'http://www.eternagame.org');
  }
  else {
    window.opener.postMessage(data, 'http://www.eternagame.org');

  }
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
