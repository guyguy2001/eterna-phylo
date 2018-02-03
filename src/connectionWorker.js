//not used for now

self.addEventListener('message', function (e) {
  let data = e.data;
  let opener = e.opener;

  opener.postMessage(data, 'http://www.eternagame.org');


}, false);
