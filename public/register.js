var database = firebase.database()
var regRef = database.ref('/reg');
function hash(str) {
  var hash = 0, len = str.length;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0; i < len; i++) {
    charC = str.charCodeAt(i);
    hash = hash + charC * Math.pow(0.7, i) * Math.pow(2, len - i);
    //hash = hash & hash; // Convert to 32bit integer
  }
  hashA = parseInt(hash).toString()
  return parseInt(hash.toString().slice(hashA.length + 1)).toString()
}

function genId() {
  id = hash(regRef.push().key)
  regRef.child(id).set(1).then(function () {
    return id
  }).catch(function () {
    return null
  });
}

var submit = function () {
  var id = null
  while (!id) {
    id = genId()
  }
  return id
  // regRef.set(this.submitData).then(function () { })
}
var data=''
for (var index = 0; index < 10000; index++) {
  data=data+submit+'<br>'
}
document.body.innerHTML=data