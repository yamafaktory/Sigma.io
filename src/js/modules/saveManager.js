//  Sigma.saveManager module

//  Manage save state of articles
module.exports = {
  pool : [],
  init : function () {
    //  Receive save state
    Sigma.socket.on('saveState', function (data) {
      if (data.tempId !== undefined) {
        Sigma.saveManager.toggleState(data.tempId, data.state);
      } else {
        if (data.id !== undefined) {
          Sigma.saveManager.toggleState(data.id, data.state);
        }
      }
    });
  },
  add : function (id, state) {
    var index = this.find(id);
    if (index === null) {
      this.pool.push([id, state]);
    } else {
      this.pool[index][1] = state;
    }
  },
  find : function (id) {
    var selectIds = function (row) {
      return row[0];
    },
        index = this.pool.map(selectIds).indexOf(id);
    return index !== -1 ? index : null;
  },
  showSaveState : function () {
    console.log('S A V E D !!!');
  },
  toggleId : function (tempId, id) {
    //  Replace temporary id with new mongoDB id in pool
    var index = this.find(tempId);
    if (index !== null) {
      this.pool[index][0] = id;
    }
  },
  toggleState : function (id, state) {
    //  Change state
    var index = this.find(id);
    if (index !== null) {
      this.pool[index][1] = state;
      this.showSaveState();
    }
  }
};