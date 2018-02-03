export function score(lanes) {
  let data = {
    match: 0,
    mismatch: 0,
    open: 0,
    extend: 0
  };
  if (lanes.length <= 1)
    return data;
  let prev = toArray(lanes[0].nucs);
  for (let i = 1; i < lanes.length; i++) {
    let curr = toArray(lanes[i].nucs);
    let pairData = scorePair(prev, curr);
    data.match += pairData.match;
    data.mismatch += pairData.mismatch;
    data.open += pairData.open;
    data.extend += pairData.extend;
    prev = curr;
  }
  return data;
}
function scorePair(a, b) {
  var score = 0;
  function toRY(a) {
    return a === 'G' || a === 'A' || a === 'R' ? 'R' : 'Y';
  }
  function tabulate(a) {
    var weight = {
      match: 1,
      mismatch: -1,
      open: -4,
      extend: -1
    };
    return (a.match * weight.match +
      a.mismatch * weight.mismatch +
      a.open * weight.open +
      a.extend * weight.extend);
  }
  let data = {
    match: 0,
    mismatch: 0,
    open: 0,
    extend: 0
  };
  let firstA = -1, firstB = -1;
  for (let i = 0; i < a.length; i++)
    if (a[i] !== 'X') {
      firstA = i;
      break;
    }
  for (let i = 0; i < b.length; i++)
    if (b[i] !== 'X') {
      firstB = i;
      break;
    }
  for (let i = a.length - 1; i >= 0 && a[i] == 'X'; i++)
    a.pop();
  for (let i = b.length - 1; i >= 0 && b[i] == 'X'; i++)
    b.pop();
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === 'X')
      if (b[i] === 'X')
        continue;
      else if (firstA > i)
        continue;
      else if (i === 0 || a[i - 1] !== 'X')
        data.open++;
      else
        data.extend++;
    else
      if (b[i] === 'X')
        if (firstB > i)
          continue;
        else if (i === 0 || b[i - 1] !== 'X')
          data.open++;
        else
          data.extend++;
      else if (toRY(a[i]) === toRY(b[i]))
        data.mismatch++;
      else
        data.match++;
  }
  return data;
}
function toArray(arr) {
  let res = [];
  for (let i = 0, j = 0; i < arr.length; i++ , j++) {
    for (; j < arr[i].posIndex; j++)
      res.push('X');
    res.push(arr[i].type);
  }
  return res;
}
