var database = firebase.database()
var regPath = 'reg/'
var editPath = 'edit/'
// var regRef = database.ref(regPath);
// var editRef = database.ref(editPath);

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

if (app) {
  app.submit = function () {
    if (!this.checkData()) {
      this.notComplete = true
      return
    }
    this.wait = true
    var key, id, flag
    if (!this.id || !this.key) {
      // Key is not exist because user tried to enter a wrong ID, so ignore that ID
      key = database.ref(regPath).push().key
      id = hash(key)
      flag = true // new submittion
    } else {
      key = this.key
      id = this.id
      flag = false // update submittion
    }
    var updateData = {}
    updateData[regPath + key] = Object.assign({}, this.submitData)
    updateData[regPath + key]['id'] = id
    updateData[regPath + key]['timestamp'] = firebase.database.ServerValue.TIMESTAMP
    updateData[editPath + id] = Object.assign({}, this.submitData)
    updateData[editPath + id]['key'] = key
    updateData[editPath + id]['timestamp'] = firebase.database.ServerValue.TIMESTAMP

    var me = this
    database.ref().update(updateData, function (error) {
      if (error) {
        console.log(updateData)
        me.alert(error.message.replace(/.*:/, error.name + ':'))
      } else {
        me.id = id
        me.key = key
        me.wait = false
        if (flag) me.submitted = true
        else me.info('Update successfully. You can continue editing and update it.')
      }
    })
  }

  app.loadFromServer = function () {
    if (!this.id) {
      // empty ID
      return
    }
    // start retrieving
    this.askId = false
    this.wait = true
    var me = this
    database.ref(editPath + this.id).once('value').then(function (snap) {
      if (!snap.exists()) {
        // ID not found
        me.alert('Error: ID not exist! Please check again.')
        return
      }
      // ID OK
      var data = snap.val()
      if (data) {
        console.log(data)
        me.fillData(data)
      }
      me.wait = false
      me.info('Load successfully')
    }).catch(function (error) {
      me.alert(error.message.replace(/.*:/, error.name + ':'))
    })
  }
}