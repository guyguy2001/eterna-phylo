self.addEventListener("message", function (e) {
  window.opener.postMessage(message, e.data); //e.data = the origin to send to
}, false);
