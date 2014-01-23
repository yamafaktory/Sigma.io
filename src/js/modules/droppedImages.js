//  Sigma.droppedImages module

//  Manage dropped images
module.exports = {
  //  Store images removed by the user in an array
  removedImageIds : [],
  //  Analyse mutations
  lookAtMutations : function (mutation) {
    var addedNodes = mutation.addedNodes,
        removedNodes = mutation.removedNodes,
        type = mutation.type,
        checkIfModified = function (add, nodes) {
          var updateImageIds = function () {
            if (add) {
              this.removedImageIds.splice(_this.removedImageIds.indexOf(nodes[i].dataset.mongoId), 1);
            } else {
              this.removedImageIds.push(nodes[i].dataset.mongoId);
            }
          }.bind(this),
              countImages = function (i) {
                //  Check if the node is not pure text
                if (nodes[i].nodeName !== '#text') {
                  //  Update if the image is the node itself
                  if (nodes[i].hasAttribute('data-image')) {
                    updateImageIds();
                  }
                } else {
                  if (nodes[i].hasChildNodes()) {
                    //  If there are images as children
                    var images = nodes[i].querySelectorAll('[data-image]');
                    for (var j = 0; j < images.length; ++j) {
                      updateImageIds();
                    }
                  }
                }
              };
          //  Core process
          if (nodes.length > 0 && type === 'childList') {
            for (var i = 0; i < nodes.length; ++i) {
              countImages(i);
            }
          }
        }.bind(this);
    //  Check for both added and removed nodes
    checkIfModified(false, removedNodes);
    checkIfModified(true, addedNodes);
  },
  //  Delete images in mongoDB
  delete : function () {
    //  If there is one or more images to remove
    if (this.removedImageIds.length > 0) {
      Sigma.socket.emit('deleteImage', { ids: this.removedImageIds });
      //  For further updates
      this.updateImageArray();
    }
  },
  updateImageArray : function () {
    Sigma.socket.on('updateImageArray', function (data) {
      this.removedImageIds = data.array;
    });
  }
};