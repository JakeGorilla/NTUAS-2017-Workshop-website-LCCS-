var database = firebase.database()
var regPath = 'reg'
var editPath = 'edit'
var regRef = database.ref(regPath);
var editRef = database.ref(editPath);

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
  var head = (str.match(/.*([A-Za-z])/))[1] //.toUpperCase()
  var hashA = parseInt(hash).toString()
  return head + parseInt(hash.toString().slice(hashA.length + 1)).toString()
}

app.submit = function () {
  this.wait = true
  var key, id
  if (!this.id) {
    key = database.ref(regPath).push().key
    id = hash(key)
  } else if (!this.key) {
    // ERROR: make user reload form from server
  } else {
    key = this.key
    id = this.id
  }
  var updateData = {}
  updateData[regPath + '/' + key] = this.submitData
  updateData[regPath + '/' + key]['id'] = id
  updateData[editPath + '/' + id] = this.submitData
  updateData[editPath + '/' + id]['key'] = key

  var me = this
  database.ref().update(updateData, function (error) {
    if (error) {
      console.log(updateData)
      me.wait = false
      me.error = true
      setTimeout(function() {
        me.error = false
      }, 5000);
    } else {
      me.id = id
      me.key = key
      me.wait = false
      me.submitted = true
    }
  })
}