(function() {
  'use strict';
  /**
   * Initialize a Timesheet
   */
  var Timesheet = function(container, beg, end, scheduledData, requestData, bubbleClickCallBack) {
    this.scheduledData = [];
    this.requestData = [];
    this.beg = beg;
    this.end = end;
    this.widthDay  = 0;
    this.bubbleClickCallBack = bubbleClickCallBack;
    this.parse(scheduledData || [], requestData || []);

    if (typeof document !== 'undefined') {
      this.container = (typeof container === 'string') ? document.querySelector('#'+container) : container;
      this.leftOffset = this.container.innerWidth;
      this.drawSections();
      this.insertData();
      this.initFunctions();
    }
  };

  /**
   * Get functions
   */
  Timesheet.prototype.getScheduledData = function() {
    var newScheduleData = [];
    var lis = document.getElementsByClassName("schedule-li");
    for (var n = 0, m = lis.length; n < m; n++) {
      if (lis[n].className.includes("non-data")) {
        break;
      }
      newScheduleData.push(lis[n].value);
    }
    return newScheduleData;
  };

  Timesheet.prototype.scheduledDataHasIntersection = function() {
    var scheduleDataTime = [];
    var lis = document.getElementsByClassName("schedule-li");
    for (var n = 0, m = lis.length; n < m; n++) {
      if (lis[n].className.includes("non-data")) {
        break;
      }
      var allData = this.scheduledData.concat(this.requestData);
      for(var i in allData){
        if(allData[i]["data"] == lis[n].value){
          scheduleDataTime.push({"beg": allData[i]["beg"], "end": allData[i]["end"]});
        }
      }
    }
    scheduleDataTime.sort(function(a, b) {
        a = a["beg"];
        b = b["beg"];
        return a < b ? -1 : (a > b ? 1 : 0);
      });
    for (var i = 0, j = scheduleDataTime.length-1; i < j; i++) {
      if (scheduleDataTime[i]["end"] > scheduleDataTime[j]["beg"]) return true;
    }
    return false;
  }

  /**
   * Init functions
   */
  Timesheet.prototype.initFunctions = function() {
    var popup = '<div class="popup" id="popup">' +
        '<div class="popupContent">' +
        '<h4></h4>' +
        '<div id="imgs"></div>' +
        '<button class="backButton" id="backButton">Back</button>' +
    '</div></div>';
    this.container.innerHTML += popup;
    popup = document.getElementById('popup');
    popup.style.display = 'none';

    var timeSheet = this;
    var slider = document.querySelector('#timeRange');
    timeSheet.onSliderChange(slider);
    document.querySelector('#timeRange').addEventListener('change', function() {
      timeSheet.onSliderChange(this);
    });
    document.querySelector('#timeLabel').addEventListener('click', function() {
      var timeStamp = timeSheet.getSliderTime(slider);
      var indexList = timeSheet.getIndexListFromTimestamp(timeStamp);
      timeSheet.onTimeLabelClicked(indexList, timeStamp);
    });
    document.querySelector('#backButton').addEventListener('click', function() {
      timeSheet.togglePopup();
    });
    var lis = document.getElementsByClassName("schedule-li");
    for (var n = 0, m = lis.length; n < m; n++) {
      if (lis[n].className.includes("non-data")) {
        continue;
      }
      lis[n].addEventListener('click', function() {
        if (timeSheet.bubbleClickCallBack) timeSheet.bubbleClickCallBack(this.value);
      });
    }
  };

  /**
   * Popup window with scheduled images
   */
  Timesheet.prototype.onTimeLabelClicked = function(indexList, timeStamp) {
    document.querySelector('#imgs').innerHTML = '';
    for (var n = 0, m = indexList.length; n < m; n++) {
      var imgSrc = this.scheduledData[indexList[n]].img;
      var img = document.createElement( 'input' );
      img.setAttribute('class', 'popupImage');
      img.setAttribute('type', 'image');
      img.setAttribute('src', imgSrc);
      document.querySelector('#imgs').appendChild(img);
    }
    var date = new Date(timeStamp*1000);
    document.querySelector('h4').innerHTML = date.toTimeString();

    this.togglePopup();
  };

  /**
   * Insert data into Timesheet
   */
  Timesheet.prototype.insertData = function() {
    var html = [];
    this.widthDay = this.container.querySelector('.scale section').offsetWidth;
    var scheduledColors = ['default', 'green', 'blue', 'yellow', 'cyan'];
    var requestColors = ['grey'];

    function _insert_data(parent, data, colors)
    { 
      for (var n = 0, m = data.length; n < m; n++) {
        var cur = data[n];
        var bubble = parent.createBubble(parent.widthDay, parent.beg, parent.end, cur.beg, cur.end);
        var icon = '<div class="img-container"><img class="icon" src="' + cur.img + '"><span style="margin-left: 0px; position: absolute; color: rgba(240, 200, 70, 1); background-color: rgba(30, 80, 180, 1);">' + cur.label + '</span></div>';

        var scheduledLine = [
          '<span style="margin-left: ' + (bubble.getStartOffset()+100) + 'px; width: ' + bubble.getWidth() + 'px;" class="bubble bubble-' + colors[n%colors.length] + '"></span>'
        ].join('');
        html.push('<li class="schedule-li" value="' + cur.data + '">' + icon + scheduledLine + '</li>');
      }
    }

    _insert_data(this, this.scheduledData, scheduledColors);
    var separator = '<div class="separator"><span>Pending Requests</span></div>';
    html.push('<li class="non-data schedule-li">' + separator + '</li>');
    _insert_data(this, this.requestData, requestColors);
    this.container.innerHTML += '<ul class="data">' + html.join('') + '</ul>';
  };

  /**
   * Draw section labels
   */
  Timesheet.prototype.drawSections = function() {
    var html = [];
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var currentDate = new Date(this.beg*1000);
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    var endDate = new Date(this.end*1000);
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);

    while (currentDate.getTime() < endDate.getTime()) {
      var secName = monthNames[currentDate.getMonth()] + '/' + currentDate.getDate();
      html.push('<section>' + secName + '</section>');
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.container.className = 'timesheet color-scheme-default';
    var timeLabel = '<div class="timeLabel"><span class="timeLabelText" id="timeLabel"></span></div>';
    var vertLine = '<div class="vl"></div>';
    var slider = '<div class="slidecontainer"><input type="range" min="1" max="720" value="1" class="slider" id="timeRange"></div>';
    this.container.innerHTML = '<div class="scale">' + timeLabel + slider + html.join('') + vertLine + '</div>';
  };

  /**
   * Parse passed data
   * [[start, end, appId, image],...]
   */
  Timesheet.prototype.parse = function(scheduledData, requestData) {
    var beg, end, appId, img, label, data, n, m;
    for (n = 0, m = scheduledData.length; n<m; n++) {
      beg = scheduledData[n][0];
      end = scheduledData[n][1];
      appId = scheduledData[n][2];
      img = scheduledData[n][3];
      label = scheduledData[n][4];
      data = scheduledData[n][5];
      if (beg < this.end && end > this.beg) {
        this.scheduledData.push({beg: beg, end: end, appId: appId, img: img, label: label, data: data});
      }
    }
    for (n = 0, m = requestData.length; n<m; n++) {
      beg = requestData[n][0];
      end = requestData[n][1];
      appId = requestData[n][2];
      img = requestData[n][3];
      label = requestData[n][4];
      data = requestData[n][5];
      if (beg < this.end && end > this.beg) {
        this.requestData.push({beg: beg, end: end, appId: appId, img: img, label: label, data: data});
      }
    }
  };

  /**
   * Update 
   */
  Timesheet.prototype.createBubble = function(widthDay, min, max, start, end) {
    return new Bubble(widthDay, min, max, start, end);
  };

  /**
   * Show/Hide popup
   */
  Timesheet.prototype.togglePopup = function() {
    var popup = document.getElementById('popup');
    if (popup.style.display === 'none') {
      popup.style.display = 'block';
    }
    else {
      popup.style.display = 'none';
    }
  };

  /**
   * get data at a timestamp
   */
  Timesheet.prototype.getIndexListFromTimestamp = function(timestamp) {
    var indexList = [];
    for (var n = 0, m = this.scheduledData.length; n<m; n++) {
      if (this.scheduledData[n].beg <= timestamp && this.scheduledData[n].end >= timestamp) {
        indexList.push(n);
      }
    }
    return indexList;
  };

  /**
   * Wrapper for adding bubbles
   */
  Timesheet.prototype.createBubble = function(widthDay, min, max, start, end) {
    return new Bubble(widthDay, min, max, start, end);
  };

  /**
   * Get time stamp from current slider position
   */
  Timesheet.prototype.getSliderTime = function(slider) {
    return this.beg + (slider.value/slider.max) * (this.end-this.beg);
  };

  /**
   * Show timeLabel
   */
  Timesheet.prototype.onSliderChange = function(slider) {
    var vertLine = document.querySelector('.vl');
    var timeLabel = document.querySelector('#timeLabel');
    var offset = (this.getStartOffset(this.getSliderTime(slider))- 1) + 'px';
    vertLine.style.height = (this.container.offsetHeight - 68) + 'px';
    vertLine.style.left = offset;
    timeLabel.style.left = offset;
    var time = new Date(this.getSliderTime(slider)*1000);
    timeLabel.textContent = time.toTimeString();
  };

  /**
   * Get offset
   */
  Timesheet.prototype.getStartOffset = function(timestamp) {
    if (timestamp < this.beg) {
      return 0;
    }
    return (this.widthDay/24) * (timestamp/60/60 - this.beg/60/60);
  };

  /**
   * Timesheet Bubble
   */
  var Bubble = function(widthDay, min, max, beg, end) {
    this.min = min;
    this.max = max;
    this.beg = beg;
    this.end = end;
    this.widthDay = widthDay;
  };

  /**
   * Format month number
   */
  Bubble.prototype.formatHour = function(num) {
    num = parseInt(num, 10);
    return num >= 10 ? num : '0' + num;
  };

  /**
   * Calculate starting offset for bubble
   */
  Bubble.prototype.getStartOffset = function() {
    if (this.beg < this.min) {
      return 0;
    }
    return (this.widthDay/24) * (this.beg/60/60 - this.min/60/60);
  };

  /**
   * Get count of all months in Timesheet Bubble
   */
  Bubble.prototype.getHours = function() {
    var beg = this.beg;
    var end = this.end;
    if (this.beg < this.min) {
      beg = this.min;
    }
    if (this.end > this.max) {
      end = this.max;
    }
    return end/60/60 - beg/60/60;
  };

  /**
   * Get bubble's width in pixel
   */
  Bubble.prototype.getWidth = function() {
    return (this.widthDay/24) * this.getHours();
  };

  window.Timesheet = Timesheet;
})();