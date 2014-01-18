//  Sigma.dragAndDrop module

//  Drag & drop events
module.exports = function () {
  //  Image resizing
  var resize = function (image, small) {
    var renderedCanvas = document.createElement('canvas'),
        renderedContext = renderedCanvas.getContext('2d'),
        data;
    if (small) {
      var circleDiameter = 120,
          templateCanvas = document.createElement('canvas'),
          templateContext = templateCanvas.getContext('2d'),
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight;
      //  Manage it as a square
      if (image.width > image.height) {
        sourceX = (image.width - image.height) / 2;
        sourceY = 0;
        sourceWidth = image.height;
        sourceHeight = sourceWidth;
      } else {
        if (image.height > image.width) {
          sourceX = 0;
          sourceY = (image.height - image.width) / 2;
          sourceWidth = image.width;
          sourceHeight = sourceWidth;
        } else {
          sourceX = sourceY = 0;
          sourceWidth = sourceHeight = image.width;
        }
      }
      renderedCanvas.width = renderedCanvas.height = circleDiameter;
      templateCanvas.width = templateCanvas.height = circleDiameter;
      templateContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, circleDiameter, circleDiameter);
      renderedContext.clearRect(0, 0, circleDiameter, circleDiameter);
      renderedContext.beginPath();
      renderedContext.arc(circleDiameter/2, circleDiameter/2, (circleDiameter/2)-2, 0, Math.PI*2, true);
      renderedContext.fillStyle = renderedContext.createPattern(templateCanvas,'no-repeat');
      renderedContext.fill();
      //  Create gradient
      var gradient = renderedContext.createLinearGradient(0, 0, 0, 150);
      gradient.addColorStop(0, 'rgba(229, 86, 109, .7)');
      gradient.addColorStop(0.25, 'rgba(225, 98, 158, .7)');
      gradient.addColorStop(0.5, 'rgba(195, 104, 213, .7)');
      gradient.addColorStop(0.75, 'rgba(146, 94, 202, .7)');
      gradient.addColorStop(1, 'rgba(108, 83, 181, .7)');
      renderedContext.lineWidth = 2;
      renderedContext.strokeStyle = gradient;
      renderedContext.stroke();
      //  Data to return in png format
      data = renderedCanvas.toDataURL('image/png');
    } else {
      //  Large image
      var maxHeight = 600,
          maxWidth = 1000;
      if (image.width > maxWidth) {
        image.height *= (maxWidth / image.width);
        image.width = maxWidth;
      }
      if (image.height > maxHeight) {
        image.width *= (maxHeight / image.height);
        image.height = maxHeight;
      }
      renderedCanvas.width = image.width;
      renderedCanvas.height = image.height;
      renderedContext.clearRect(0, 0, renderedCanvas.width, renderedCanvas.height);
      renderedContext.drawImage(image, 0, 0, image.width, image.height);
      //  Data to return in jpg format
      data = renderedCanvas.toDataURL('image/jpeg', 0.7);
    }
    //  Then return generated data
    return data;
  };
  //  Handle image on drop event
  var appendImage = function (file, event) {
    if (file.type.match(/image.*/)) {
      var newImage = document.createElement('img'),
          reader = new FileReader();
      event.target.parentNode.querySelector('[data-sigma="content"]').appendChild(newImage);
      reader.readAsArrayBuffer(file);
      reader.onload = function (event) {
        window.URL = window.URL || window.webkitURL;
        var blob = new Blob([new Uint8Array(event.target.result)]),
            blobURL = window.URL.createObjectURL(blob),
            image = new Image();
        image.src = blobURL;
        image.onload = function () {
          //  Create new image into the DOM
          var mongoId = Sigma.getTempId(),
              appWidth = document.querySelector('[data-app-width]').dataset.appWidth,
              smallImage = resize(image, true),
              largeImage = resize(image, false);
          newImage.dataset.image = 'dropped';
          newImage.dataset.idType = 'tmp';
          newImage.dataset.mongoId = mongoId;
          if (appWidth === 'small') {
            newImage.dataset.imageWidth = 'small';
          } else {
            newImage.dataset.imageWidth = 'large';
          }
          //  Save new image source
          Sigma.storeImage(mongoId, smallImage, largeImage);
        };
      };
    }
  };
  //  Handle text on drop event
  var appendText = function () {
    var data = event.dataTransfer.getData('text/plain');
    event.target.textContent += ' '+data;
  };
  //  Dragenter event
  window.addEventListener('dragenter', function (event) {
    event.preventDefault();
    var isTargetable = event.target.hasAttribute('data-sigma') ? true : false;
    if (isTargetable) {
      event.target.focus();
    }
  }, false);
  //  Dragleave event
  window.addEventListener('dragleave', function (event) {
    event.preventDefault();
    var isTargetable = event.target.hasAttribute('data-sigma') ? true : false;
    if (isTargetable) {
      event.target.blur();
    }
  }, false);
  //  Dragover event
  window.addEventListener('dragover', function (event) {
    event.preventDefault();
  }, false);
  //  Drop event
  window.addEventListener('drop', function (event) {
    event.preventDefault();
    var fileData = event.dataTransfer.files,
        isTargetable = event.target.hasAttribute('data-sigma') ? true : false;
    if (isTargetable) {
      if (fileData.length !== 0) {
        //  Add files
        for (var i = 0; i < fileData.length; ++i) {
          appendImage(fileData[i], event);
        }
      } else {
        //  Add text only
        appendText();
      }
    }
    //  little hack: set the focus on the target for the sync process
    event.target.focus();
  }, false);
};