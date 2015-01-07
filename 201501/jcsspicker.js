
//author zhoubo49@gmail.com
// css生成插件
var JcssPicker = window.JcssPicker || {};

//=========================================
JcssPicker.ui = {	
	//设置位置
	setPoint: function(_x, _y) {
		this.x = _x;
		this.y = _y;
	},
	//设置尺寸	
	setDimension: function(_width, _height) {
		this.width = _width;
		this.height = _height;
	},
    //判断是否IE
	isIE: function() { return window.ActiveXObject; },	
	//获取事件
	getEvent: function () {
	    if (this.isIE()) {
	        return window.event;
	    }
	    var func = this.getEvent.caller;
	    var count = 0;
	    while (func != null) {
	        var arg0 = func.arguments[func.arguments.length - 1];
	        if (arg0) {
	            if ((arg0.constructor == Event || arg0.constructor == MouseEvent)
	|| (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
	                return arg0;
	            }
	        }
	        func = func.caller;
	        count++;
	        if (count > 50) {
	            break;
	        }
	    }
	    return null;
	},
	//取消默认事件
	cancelEvent: function (returnValue) {
	    var ev = this.getEvent();
	    if (ev != null) {
	        ev.cancelBubble = true;
	        if (ev.originalEvent) {
	            ev.stopPropagation();
	        }
	        if (!returnValue) {
	            ev.returnValue = false;
	            if (ev.originalEvent) {
	                ev.preventDefault();
	            }
	        }
	    }
	},
	
	getMousePoint: function(div){
		 var ev = this.getEvent();
		if(div){
			var da = this.getMousePoint();
			var db = this.getDivPoint(div);
			return new this.setPoint(da.x-db.x,da.y-db.y);
		}
		if(this.isIE()){
			var p = this.getDivPoint(ev.srcElement);
			return new this.setPoint(p.x+ ev.offsetX,p.y + ev.offsetY);
		}else{
			return new this.setPoint(ev.clientX + document.body.scrollLeft,ev.clientY + document.body.scrollTop);
		}
	},
	
    //设置div坐标
	setDivPoint: function(div, x, y) {
		div.style.top = y + "px";
		div.style.left = x + "px";
	},
    //获得div坐标
	getDivPoint: function(div) {
		if (div.style
				&& (div.style.position == "absolute" || div.style.position == "relative")) {
			return new setPoint(div.offsetLeft + 1, div.offsetTop + 1);
		} else if (div.offsetParent) {
			var d = this.getDivPoint(div.offsetParent);
			return new this.setPoint(d.x + div.offsetLeft-div.scrollLeft, d.y + div.offsetTop-div.scrollTop);
		} else {
			return new this.setPoint(0, 0);
		}
	}
};

var el = JcssPicker.el = function (element) {
    if (typeof element == 'string') {
        return document.getElementById(element);
    }else { return element; }
};

//===============颜色插件=======================================================================================================
/*用法: JcssPicker.pickColor(control, function(colorVal){...});
 */
JcssPicker.ColorPicker = function (container, currentHEX) {
  this.__typeName = "JcssPicker.ColorPicker";
  this.container = container == null ? document.body : container;
  this.onchange = function () { };
  this.colorSelected = null;
  this.currentHEX = currentHEX == null ? '#000000' : (currentHEX.match(/^#([0-9a-fA-F]{6}|[0-9a-fA-f]{3})$/) == null ? '#000000': currentHEX.toUpperCase());
  this.currentGRAY = '120';
  this.lastHEX = '';
  this.hexch = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');
};
JcssPicker.ColorPicker.prototype.create = function (doc) {
  doc = doc == null ? document : doc;

  var control = doc.getElementById('jcss-control-colorpicker');
  if (control != null)
      return control;

  var cnum = new Array(1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0);
  var owner = this;

  control = doc.createElement("div");
  control.id = 'jcss-control-colorpicker';
  control.style.width = "250px";
  control.style.backgroundColor = "#eee";
  control.style.display = "block";
  control.style.position = "absolute";
  control.style.zIndex = 60000;  
  control.className = "title";

  var containertable = doc.createElement("table");
  containertable.cellSpacing = 5;
  var containerbody = doc.createElement("tbody");
  containertable.appendChild(containerbody);
  var containertr = doc.createElement("tr");
  containertr.style.height = "auto";
  containerbody.appendChild(containertr);

  var colortd = doc.createElement("td");
  var graytd = doc.createElement("td");
  containertr.appendChild(colortd);
  containertr.appendChild(graytd);

  var colortable = doc.createElement("table");
  colortable.id = "colorpicker-colortable";
  colortable.cellSpacing = 0;
  colortable.cellPadding = 0;
  colortable.style.cursor = "pointer";
  colortd.appendChild(colortable);

  colortable.onclick = function () {
      owner.currentHEX = JcssPicker.ui.getEvent().srcElement.bgColor;
      owner.endColor();
      JcssPicker.ui.cancelEvent();
  };
  colortable.onmouseover = function () {
      el('colorpicker-hex').innerText = JcssPicker.ui.getEvent().srcElement.bgColor.toUpperCase();
      owner.endColor();
      JcssPicker.ui.cancelEvent();
  };
  colortable.onmouseout = function () {
      el('colorpicker-hex').innerText = owner.currentHEX;
      owner.endColor();
      JcssPicker.ui.cancelEvent();
  };

  var colortablebody = doc.createElement("tbody");
  colortable.appendChild(colortablebody);

  for (var i = 0; i < 16; i++) {
      var tr = doc.createElement("tr");
      tr.style.height = "auto";
      colortablebody.appendChild(tr);

      for (var j = 0; j < 30; j++) {
          n1 = j % 5;
          n2 = Math.floor(j / 5) * 3;
          n3 = n2 + 3;

          var td = doc.createElement("td");
          td.style.width = "8px";
          td.style.height = "8px";
          td.bgColor = this.toColor((cnum[n3] * n1 + cnum[n2] * (5 - n1)),
              (cnum[n3 + 1] * n1 + cnum[n2 + 1] * (5 - n1)),
              (cnum[n3 + 2] * n1 + cnum[n2 + 2] * (5 - n1)), i);

          tr.appendChild(td);
      }

  }

  var graytable = doc.createElement("table");
  graytable.cellSpacing = 0;
  graytable.cellPadding = 0;
  graytable.id = "colorpicker-graytable";
  graytable.style.cursor = "pointer";
  graytd.appendChild(graytable);

  var graytablebody = doc.createElement("tbody");
  graytable.appendChild(graytablebody);

  for (i = 255; i >= 0; i -= 8.5) {
      var tr = doc.createElement("tr");
      tr.style.height = "auto";
      graytablebody.appendChild(tr);
      var td = doc.createElement("td");
      td.style.width = "20px";
      td.style.height = "4px";
      td.title = Math.floor(i * 16 / 17);
      tr.bgColor = '#' + this.toHex(i) + this.toHex(i) + this.toHex(i);
      tr.appendChild(td);
  }
  graytable.onclick = function () {
      owner.currentGRAY = JcssPicker.ui.getEvent().srcElement.title;
      owner.endColor();
      JcssPicker.ui.cancelEvent();
      return false;
  };
  graytable.onmouseover = function () {
      el('colorpicker-gray').innerText = JcssPicker.ui.getEvent().srcElement.title;
      owner.endColor();
      JcssPicker.ui.cancelEvent();
      return false;
  };
  graytable.onmouseout = function () {
      el('colorpicker-gray').innerText = owner.currentGRAY;
      owner.endColor();
      JcssPicker.ui.cancelEvent();
      return false;
  };

  control.appendChild(containertable);

  var notecontrol = doc.createElement("div");
  var notetable = doc.createElement("table");
  notetable.cellSpacing = 0;
  notetable.cellPadding = 0;
  notetable.style.width = "100%";
  notecontrol.appendChild(notetable);

  var notetablebody = doc.createElement("tbody");
  notetable.appendChild(notetablebody);

  var notetr = doc.createElement("tr");
  notetablebody.appendChild(notetr);
  var td = doc.createElement("td");
  td.innerHTML = "<table ID=\"colorpicker-showcolor\" style=\"background-color: "+this.currentHEX+";\" bgcolor=\""+this.currentHEX+"\" border=\"1\" width=\"25\" height=\"25\" cellspacing=\"0\" cellpadding=\"0\"><tr><td></td></tr></table><br/><span id=\"colorpicker-selcolor\">"+this.currentHEX+"</span>";
  td.align = "center";
  td.style.width = "80px";
  notetr.appendChild(td);

  td = doc.createElement("td");
  td.innerHTML = "基色 :<span id=\"colorpicker-hex\">"+this.currentHEX+"</SPAN><BR>亮度 :<span id=\"colorpicker-gray\">120</span>";
  notetr.appendChild(td);

  td = doc.createElement("td");
  td.align = "center";
  td.style.width = "60px";
  var okbutton = doc.createElement("input");
  okbutton.type = "button";
  okbutton.className = "button";
  okbutton.value = "确定";
  okbutton.onclick = function () {
      if (owner.colorSelected)
          owner.colorSelected(el('colorpicker-selcolor').innerHTML);
  };
  td.appendChild(okbutton);
  notetr.appendChild(td);

  notecontrol.onclick = function () { JcssPicker.ui.cancelEvent(); };

  control.appendChild(notecontrol);

  return control;
};
JcssPicker.ColorPicker.prototype.toColor = function (r, g, b, n) {
  r = ((r * 16 + r) * 3 * (15 - n) + 0x80 * n) / 15;
  g = ((g * 16 + g) * 3 * (15 - n) + 0x80 * n) / 15;
  b = ((b * 16 + b) * 3 * (15 - n) + 0x80 * n) / 15;

  return '#' + this.toHex(r) + this.toHex(g) + this.toHex(b);
};
JcssPicker.ColorPicker.prototype.toHex = function (n) {
  var h, l;
  n = Math.round(n);
  l = n % 16;
  h = Math.floor((n / 16)) % 16;
  return (this.hexch[h] + this.hexch[l]);
};

JcssPicker.ColorPicker.prototype.doColor = function (c, l) {
  var r, g, b;

  r = '0x' + c.substring(1, 3);
  g = '0x' + c.substring(3, 5);
  b = '0x' + c.substring(5, 7);

  if (l > 120) {
      l = l - 120;

      r = (r * (120 - l) + 255 * l) / 120;
      g = (g * (120 - l) + 255 * l) / 120;
      b = (b * (120 - l) + 255 * l) / 120;
  }
  else {
      r = (r * l) / 120;
      g = (g * l) / 120;
      b = (b * l) / 120;
  }
  return '#' + this.toHex(r) + this.toHex(g) + this.toHex(b);
};

//
JcssPicker.ColorPicker.prototype.endColor = function () {
  if (this.lastHEX != this.currentHEX) {
      var i;
      this.lastHEX = this.currentHEX;
      for (i = 0; i <= 30; i++) {
          el('colorpicker-graytable').rows[i].bgColor = this.doColor(this.currentHEX, 240 - i * 8);
      }
  }

  el('colorpicker-selcolor').innerHTML = this.doColor(el('colorpicker-hex').innerText, el('colorpicker-gray').innerText);
  el('colorpicker-showcolor').bgColor = el('colorpicker-selcolor').innerHTML;
  el('colorpicker-showcolor').style.backgroundColor = el('colorpicker-selcolor').innerHTML;
};
//渲染颜色
JcssPicker.ColorPicker.prototype.renderByColor = function (defaultHEX) {	 
	  this.currentHEX = defaultHEX == null ? '#000000' : (defaultHEX.match(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/) == null ? '#000000': defaultHEX.toUpperCase());
	  this.currentHEX = this.currentHEX.substring(1);
	  if(this.currentHEX.length === 3){ this.currentHEX += this.currentHEX; }  
	  this.currentHEX = "#"+this.currentHEX;
	  el('colorpicker-hex').innerText = this.currentHEX;
	  this.endColor();	
};
	
JcssPicker.pickColor = function (control, callBack, defaultHEX) {
  JcssPicker.ui.cancelEvent();
  var controlColorPicker = document.getElementById('jcss-control-colorpicker');  
  if (controlColorPicker == null) {	 
      var cp = new JcssPicker.ColorPicker();
      controlColorPicker = cp.create();      
      document.body.appendChild(controlColorPicker);
      controlColorPicker.colorPicker = cp;
      controlColorPicker.style.display = "none";      
      document.body.onclick = function(event) {    	  
    	  if(controlColorPicker.style.display == "")
    	  controlColorPicker.style.display = "none";
	  };
  }
  if(defaultHEX != null) { controlColorPicker.colorPicker.renderByColor(defaultHEX);}   
  var p = JcssPicker.ui.getDivPoint(control);
  JcssPicker.ui.setDivPoint(controlColorPicker, p.x, p.y+20);
  controlColorPicker.style.display = "";
  controlColorPicker.colorPicker.colorSelected = function (val) {
      if (val != null) {
          if (callBack != null) {
              callBack(val);
          }
          else {
              if (control != null) {
                  control.value = val;                  
              }
          }
      }      
      controlColorPicker.style.display = "none";
      $(control).trigger("change");
  };
  return false;
};


//收录了140多个具有英文颜色名的的16进制和RGB的颜色对照表
//[颜色中文名, 16进制颜色, RGB整数颜色, RGB百分比颜色]
JcssPicker.ColorRefTable = [
['aliceblue','#f0f8ff','rgb(240,248,255)','rgb(94.1%,96.9%,100%)'],
['antiquewhite','#faebd7','rgb(250,235,215)','rgb(98%,92.2%,84.3%)'],
['aqua','#00ffff','rgb(0,255,255)','rgb(0%,100%,100%)'],
['aquamarine','#7fffd4','rgb(127,255,212)','rgb(49.8%,100%,83.1%)'],
['azure','#f0ffff','rgb(240,255,255)','rgb(94.1%,100%,100%)'],
['beige','#f5f5dc','rgb(245,245,220)','rgb(96.1%,96.1%,86.3%)'],
['bisque','#ffe4c4','rgb(255,228,196)','rgb(100%,89.4%,76.9%)'],
['black','#000000','rgb(0,0,0)','rgb(0%,0%,0%)'],
['blanchedalmond','#ffebcd','rgb(255,235,205)','rgb(100%,92.2%,80.4%)'],
['blue','#0000ff','rgb(0,0,255)','rgb(0%,0%,100%)'],
['blueviolet','#8a2be2','rgb(138,43,226)','rgb(54.1%,16.9%,88.6%)'],
['brown','#a52a2a','rgb(165,42,42)','rgb(64.7%,16.5%,16.5%)'],
['burlywood','#deb887','rgb(222,184,135)','rgb(87.1%,72.2%,52.9%)'],
['cadetblue','#5f9ea0','rgb(95,158,160)','rgb(37.3%,62%,62.7%)'],
['chartreuse','#7fff00','rgb(127,255,0)','rgb(49.8%,100%,0%)'],
['chocolate','#d2691e','rgb(210,105,30)','rgb(82.4%,41.1%,11.8%)'],
['coral','#ff7f50','rgb(255,127,80)','rgb(100%,49.8%,31.4%)'],
['cornflowerblue','#6495ed','rgb(100,149,237)','rgb(39.2%,58.4%,92.9%)'],
['cornsilk','#fff8dc','rgb(255,248,220)','rgb(100%,97.3%,86.3%)'],
['crimson','#dc143c','rgb(220,20,60)','rgb(86.3%,7.8%,23.5%)'],
['cyan','#00ffff','rgb(0,255,255)','rgb(0%,100%,100%)'],
['darkblue','#00008b','rgb(0,0,139)','rgb(0%,0%,54.5%)'],
['darkcyan','#008b8b','rgb(0,139,139)','rgb(0%,54.5%,54.5%)'],
['darkgoldenrod','#b8860b','rgb(184,134,11)','rgb(72.2%,52.5%,4.3%)'],
['darkgray','#a9a9a9','rgb(169,169,169)','rgb(66.3%,66.3%,66.3%)'],
['darkgreen','#006400','rgb(0,100,0)','rgb(0%,39.2%,0%)'],
['darkgrey','#a9a9a9','rgb(169,169,169)','rgb(66.3%,66.3%,66.3%)'],
['darkkhaki','#bdb76b','rgb(189,183,107)','rgb(74.1%,71.8%,42%)'],
['darkmagenta','#8b008b','rgb(139,0,139)','rgb(54.5%,0%,54.5%)'],
['darkolivegreen','#556b2f','rgb(85,107,47)','rgb(33.3%,42%,18.4%)'],
['darkorange','#ff8c00','rgb(255,140,0)','rgb(100%,54.9%,0%)'],
['darkorchid','#9932cc','rgb(153,50,204)','rgb(60%,19.6%,80%)'],
['darkred','#8b0000','rgb(139,0,0)','rgb(54.5%,0%,0%)'],
['darksalmon','#e9967a','rgb(233,150,122)','rgb(91.4%,58.8%,47.8%)'],
['darkseagreen','#8fbc8f','rgb(143,188,143)','rgb(56.1%,73.7%,56.1%)'],
['darkslateblue','#483d8b','rgb(72,61,139)','rgb(28.2%,23.9%,54.5%)'],
['darkslategray','#2f4f4f','rgb(47,79,79)','rgb(18.4%,31%,31%)'],
['darkslategrey','#2f4f4f','rgb(47,79,79)','rgb(18.4%,31%,31%)'],
['darkturquoise','#00ced1','rgb(0,206,209)','rgb(0%,80.8%,82%)'],
['darkviolet','#9400d3','rgb(148,0,211)','rgb(58%,0%,82.7%)'],
['deeppink','#ff1493','rgb(255,20,147)','rgb(100%,7.8%,57.6%)'],
['deepskyblue','#00bfff','rgb(0,191,255)','rgb(0%,74.9%,100%)'],
['dimgray','#696969','rgb(105,105,105)','rgb(41.1%,41.1%,41.1%)'],
['dimgrey','#696969','rgb(105,105,105)','rgb(41.1%,41.1%,41.1%)'],
['dodgerblue','#1e90ff','rgb(30,144,255)','rgb(11.8%,56.5%,100%)'],
['firebrick','#b22222','rgb(178,34,34)','rgb(69.8%,13.3%,13.3%)'],
['floralwhite','#fffaf0','rgb(255,250,240)','rgb(100%,98%,94.1%)'],
['forestgreen','#228b22','rgb(34,139,34)','rgb(13.3%,54.5%,13.3%)'],
['fuchsia','#ff00ff','rgb(255,0,255)','rgb(100%,0%,100%)'],
['gainsboro','#dcdcdc','rgb(220,220,220)','rgb(86.3%,86.3%,86.3%)'],
['ghostwhite','#f8f8ff','rgb(248,248,255)','rgb(97.3%,97.3%,100%)'],
['gold','#ffd700','rgb(255,215,0)','rgb(100%,84.3%,0%)'],
['goldenrod','#daa520','rgb(218,165,32)','rgb(85.5%,64.7%,12.5%)'],
['gray','#808080','rgb(128,128,128)','rgb(50.2%,50.2%,50.2%)'],
['green','#008000','rgb(0,128,0)','rgb(0%,50.2%,0%)'],
['greenyellow','#adff2f','rgb(173,255,47)','rgb(67.8%,100%,18.4%)'],
['grey','#808080','rgb(128,128,128)','rgb(50.2%,50.2%,50.2%)'],
['honeydew','#f0fff0','rgb(240,255,240)','rgb(94.1%,100%,94.1%)'],
['hotpink','#ff69b4','rgb(255,105,180)','rgb(100%,41.1%,70.6%)'],
['indianred','#cd5c5c','rgb(205,92,92)','rgb(80.4%,36%,36%)'],
['indigo','#4b0082','rgb(75,0,130)','rgb(29.4%,0%,51%)'],
['ivory','#fffff0','rgb(255,255,240)','rgb(100%,100%,94.1%)'],
['khaki','#f0e68c','rgb(240,230,140)','rgb(94.1%,90.2%,54.9%)'],
['lavender','#e6e6fa','rgb(230,230,250)','rgb(90.2%,90.2%,98%)'],
['lavenderblush','#fff0f5','rgb(255,240,245)','rgb(100%,94.1%,96.1%)'],
['lawngreen','#7cfc00','rgb(124,252,0)','rgb(48.6%,98.8%,0%)'],
['lemonchiffon','#fffacd','rgb(255,250,205)','rgb(100%,98%,80.4%)'],
['lightblue','#add8e6','rgb(173,216,230)','rgb(67.8%,84.7%,90.2%)'],
['lightcoral','#f08080','rgb(240,128,128)','rgb(94.1%,50.2%,50.2%)'],
['lightcyan','#e0ffff','rgb(224,255,255)','rgb(87.8%,100%,100%)'],
['lightgoldenrodyellow','#fafad2','rgb(250,250,210)','rgb(98%,98%,82.4%)'],
['lightgray','#d3d3d3','rgb(211,211,211)','rgb(82.7%,82.7%,82.7%)'],
['lightgreen','#90ee90','rgb(144,238,144)','rgb(56.5%,93.3%,56.5%)'],
['lightgrey','#d3d3d3','rgb(211,211,211)','rgb(82.7%,82.7%,82.7%)'],
['lightpink','#ffb6c1','rgb(255,182,193)','rgb(100%,71.4%,75.7%)'],
['lightsalmon','#ffa07a','rgb(255,160,122)','rgb(100%,62.7%,47.8%)'],
['lightseagreen','#20b2aa','rgb(32,178,170)','rgb(12.5%,69.8%,66.7%)'],
['lightskyblue','#87cefa','rgb(135,206,250)','rgb(52.9%,80.8%,98%)'],
['lightslategray','#778899','rgb(119,136,153)','rgb(46.7%,53.3%,60%)'],
['lightslategrey','#778899','rgb(119,136,153)','rgb(46.7%,53.3%,60%)'],
['lightsteelblue','#b0c4de','rgb(176,196,222)','rgb(69%,76.9%,87.1%)'],
['lightyellow','#ffffe0','rgb(255,255,224)','rgb(100%,100%,87.8%)'],
['lime','#00ff00','rgb(0,255,0)','rgb(0%,100%,0%)'],
['limegreen','#32cd32','rgb(50,205,50)','rgb(19.6%,80.4%,19.6%)'],
['linen','#faf0e6','rgb(250,240,230)','rgb(98%,94.1%,90.2%)'],
['magenta','#ff00ff','rgb(255,0,255)','rgb(100%,0%,100%)'],
['maroon','#800000','rgb(128,0,0)','rgb(50.2%,0%,0%)'],
['mediumaquamarine','#66cdaa','rgb(102,205,170)','rgb(40%,80.4%,66.7%)'],
['mediumblue','#0000cd','rgb(0,0,205)','rgb(0%,0%,80.4%)'],
['mediumorchid','#ba55d3','rgb(186,85,211)','rgb(72.9%,33.3%,82.7%)'],
['mediumpurple','#9370db','rgb(147,112,219)','rgb(57.6%,43.9%,85.9%)'],
['mediumseagreen','#3cb371','rgb(60,179,113)','rgb(23.5%,70.2%,44.3%)'],
['mediumslateblue','#7b68ee','rgb(123,104,238)','rgb(48.2%,40.8%,93.3%)'],
['mediumspringgreen','#00fa9a','rgb(0,250,154)','rgb(0%,98%,60.4%)'],
['mediumturquoise','#48d1cc','rgb(72,209,204)','rgb(28.2%,82%,80%)'],
['mediumvioletred','#c71585','rgb(199,21,133)','rgb(78%,8.2%,52.2%)'],
['midnightblue','#191970','rgb(25,25,112)','rgb(9.8%,9.8%,43.9%)'],
['mintcream','#f5fffa','rgb(245,255,250)','rgb(96.1%,100%,98%)'],
['mistyrose','#ffe4e1','rgb(255,228,225)','rgb(100%,89.4%,88.2%)'],
['moccasin','#ffe4b5','rgb(255,228,181)','rgb(100%,89.4%,71%)'],
['navajowhite','#ffdead','rgb(255,222,173)','rgb(100%,87.1%,67.8%)'],
['navy','#000080','rgb(0,0,128)','rgb(0%,0%,50.2%)'],
['oldlace','#fdf5e6','rgb(253,245,230)','rgb(99.2%,96.1%,90.2%)'],
['olive','#808000','rgb(128,128,0)','rgb(50.2%,50.2%,0%)'],
['olivedrab','#6b8e23','rgb(107,142,35)','rgb(42%,55.7%,13.7%)'],
['orange','#ffa500','rgb(255,165,0)','rgb(100%,64.7%,0%)'],
['orangered','#ff4500','rgb(255,69,0)','rgb(100%,27.1%,0%)'],
['orchid','#da70d6','rgb(218,112,214)','rgb(85.5%,43.9%,83.9%)'],
['palegoldenrod','#eee8aa','rgb(238,232,170)','rgb(93.3%,91%,66.7%)'],
['palegreen','#98fb98','rgb(152,251,152)','rgb(59.6%,98.4%,59.6%)'],
['paleturquoise','#afeeee','rgb(175,238,238)','rgb(68.6%,93.3%,93.3%)'],
['palevioletred','#db7093','rgb(219,112,147)','rgb(85.9%,43.9%,57.6%)'],
['papayawhip','#ffefd5','rgb(255,239,213)','rgb(100%,93.7%,83.5%)'],
['peachpuff','#ffdab9','rgb(255,218,185)','rgb(100%,85.5%,72.5%)'],
['peru','#cd853f','rgb(205,133,63)','rgb(80.4%,52.2%,24.7%)'],
['pink','#ffc0cb','rgb(255,192,203)','rgb(100%,75.3%,79.6%)'],
['plum','#dda0dd','rgb(221,160,221)','rgb(86.7%,62.7%,86.7%)'],
['powderblue','#b0e0e6','rgb(176,224,230)','rgb(69%,87.8%,90.2%)'],
['purple','#800080','rgb(128,0,128)','rgb(50.2%,0%,50.2%)'],
['red','#ff0000','rgb(255,0,0)','rgb(100%,0%,0%)'],
['rosybrown','#bc8f8f','rgb(188,143,143)','rgb(73.7%,56.1%,56.1%)'],
['royalblue','#4169e1','rgb(65,105,225)','rgb(25.5%,41.1%,100%)'],
['saddlebrown','#8b4513','rgb(139,69,19)','rgb(54.5%,27.1%,7.5%)'],
['salmon','#fa8072','rgb(250,128,114)','rgb(98%,50.2%,44.7%)'],
['sandybrown','#f4a460','rgb(244,164,96)','rgb(95.7%,64.3%,37.6%)'],
['seagreen','#2e8b57','rgb(46,139,87)','rgb(18%,54.5%,34.1%)'],
['seashell','#fff5ee','rgb(255,245,238)','rgb(100%,96.1%,93.3%)'],
['sienna','#a0522d','rgb(160,82,45)','rgb(62.7%,32.2%,17.6%)'],
['silver','#c0c0c0','rgb(192,192,192)','rgb(75.3%,75.3%,75.3%)'],
['skyblue','#87ceeb','rgb(135,206,235)','rgb(52.9%,80.8%,92.2%)'],
['slateblue','#6a5acd','rgb(106,90,205)','rgb(41.6%,35.3%,80.4%)'],
['slategray','#708090','rgb(112,128,144)','rgb(43.9%,50.2%,56.5%)'],
['slategrey','#708090','rgb(112,128,144)','rgb(43.9%,50.2%,56.5%)'],
['snow','#fffafa','rgb(255,250,250)','rgb(100%,98%,98%)'],
['springgreen','#00ff7f','rgb(0,255,127)','rgb(0%,100%,49.8%)'],
['steelblue','#4682b4','rgb(70,130,180)','rgb(27.5%,51%,70.6%)'],
['tan','#d2b48c','rgb(210,180,140)','rgb(82.4%,70.6%,54.9%)'],
['teal','#008080','rgb(0,128,128)','rgb(0%,50.2%,50.2%)'],
['thistle','#d8bfd8','rgb(216,191,216)','rgb(84.7%,74.9%,84.7%)'],
['tomato','#ff6347','rgb(255,99,71)','rgb(100%,38.8%%,27.8%)'],
['turquoise','#40e0d0','rgb(64,224,208)','rgb(25.1%,87.7%,81.6%)'],
['violet','#ee82ee','rgb(238,130,238)','rgb(93.3%,51%,93.3%)'],
['wheat','#f5deb3','rgb(245,222,179)','rgb(96.1%,87.1%,70.2%)'],
['white','#ffffff','rgb(255,255,255)','rgb(100%,100%,100%)'],
['whitesmoke','#f5f5f5','rgb(245,245,245)','rgb(96.1%,96.1%,96.1%)'],
['yellow','#ffff00','rgb(255,255,0)','rgb(100%,100%,0%)'],
['yellowgreen','#9acd32','rgb(154,205,50)','rgb(60.4%,80.4%,19.6%)']
];


//RGB颜色转化为16进制颜色
JcssPicker.rgb2hex = function (rgb) {
	//十进制转化为16进制方法
	function dec2hex(x) { return ("0" + parseInt(x).toString(16)).slice(-2); };
	//RGB颜色转为十六进制颜色
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	return "#" + dec2hex(rgb[1]) + dec2hex(rgb[2]) + dec2hex(rgb[3]);
};

//16进制颜色转化为RGB颜色
JcssPicker.hex2rgb = function (hex) {	
	//16进制转化为10进制
	function hex2dec(x) {return parseInt(hex,16).toString(); };
	hex = hex.substring(1);
    if(hex.length === 3){ hex += hex; }  
    return "rgb("+hex2dec(hex.substring(0,2))+","+hex2dec(hex.substring(2,4))+","+hex2dec(hex.substring(4))+")";	
};

//颜色名转化为RGB颜色
JcssPicker.name2rgb = function (name) {
	for(var i=0; i< JcssPicker.ColorRefTable.length; i++)
	{
		if(JcssPicker.ColorRefTable[i][0] == name.toLowerCase()){
			return JcssPicker.ColorRefTable[i][2];
		}
	}
	return null;
};
//颜色名转化为16进制颜色
JcssPicker.name2hex = function (name) {
	for(var i=0; i< JcssPicker.ColorRefTable.length; i++)
	{
		if(JcssPicker.ColorRefTable[i][0] == name.toLowerCase()){
			return JcssPicker.ColorRefTable[i][1];
		}
	}
	return null;
};

//把所以颜色标记统一转为16进制
JcssPicker.color2hex = function (color) {
	color = color.toLowerCase();
	//如果是16进制（3位或6位）转6位; 
	if(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color)) { 
		color = color.substring(1);
	    if(color.length === 3){ color += color; }  
		color = "#"+color;
		return color;
	}
	//如果是rgb则转6位16进制; 
	if(/^(rgb)/.test(color)) { 
		color = JcssPicker.rgb2hex(color);
		return color;
	}
	
	if("transparent" == color) { return "#ffffff"; };
	//如果是rgb则转6位16进制;
	if(/^(?!rgb)[a-z]+/.test(color)) {		
		color = JcssPicker.name2hex(color);
		return color;
	}
	return color;
}


//=========================css配置==============================================================
JcssPicker.cssMap = {};
//字体
JcssPicker.cssMap["font"] = {name: "字体", style: "font"};
//字体族
JcssPicker.cssMap["font-family"] = {name: "字体族", style: "fontFamily", opts: [ 
     { name: '宋体', val: '宋体,SimSun'},
     { name: '雅黑', val: '微软雅黑,Microsoft YaHei'},
     { name: '楷体', val: '楷体,楷体_GB2312, SimKai'},
     { name: '黑体', val: '黑体, SimHei'},
     { name: '隶书', val: '隶书, SimLi'},
     { name: 'andaleMono', val: 'andale mono'},
     { name: 'arial', val: 'arial, helvetica,sans-serif'},
     { name: 'arialBlack', val: 'arial black,avant garde'},
     { name: 'comicSansMs', val: 'comic sans ms'},
     { name: 'impact', val: 'impact,chicago'},
     { name: 'timesNewRoman', val: 'times new roman'}]};
//字体大小
JcssPicker.cssMap["font-size"] = {name: "字体大小", style: "fontSize", opts: [ 
     { name: '10px', val: '10px'},
     { name: '11px', val: '11px'},
     { name: '12px', val: '12px'},
     { name: '14px', val: '14px'},
     { name: '16px', val: '16px'},
     { name: '18px', val: '18px'},
     { name: '20px', val: '20px'},
     { name: '24px', val: '24px'},
     { name: '36px', val: '36px'}
     ]};
//字体粗细
JcssPicker.cssMap["font-weight"] = {name: "字体粗细", style: "fontWeight", opts: [ 
     { name: '标准', val: 'normal'},
     { name: '粗体', val: 'bold'}
     ]};
//字体倾斜
JcssPicker.cssMap["font-style"] = {name: "字体倾斜", style: "fontStyle", opts: [ 
     { name: '标准', val: 'normal'},
     { name: '斜体', val: 'italic'}
     ]};
//文字颜色
JcssPicker.cssMap["color"] = {name: "文字颜色", style: "color"};
//文字对齐
JcssPicker.cssMap["text-align"] = {name: "文字对齐", style: "fontStyle", opts: [ 
     { name: '左对齐', val: 'left'},
     { name: '右对齐', val: 'right'},
     { name: '居中', val: 'center'}
     ]};

//文字穿线
JcssPicker.cssMap["text-decoration"] = {name: "文字穿线", style: "textDecoration", opts: [ 
     { name: '上划线', val: 'overline'},
     { name: '下划线', val: 'underline'},
     { name: '删除线', val: 'line-through'}
     ]};
//文字行高
JcssPicker.cssMap["line-height"] = {name: "文字行高", style: "lineHeight"};
//垂直对齐
JcssPicker.cssMap["vertical-align"] = {name: "垂直对齐", style: "verticalAlign", opts: [ 
	  { name: '默认', val: 'baseline'},
	  { name: '顶端对齐', val: 'top'},
	  { name: '中部对齐', val: 'middle'},
	  { name: '底部对齐', val: 'bottom'},
	  { name: '字体顶端对齐', val: 'text-top'},
	  { name: '总统底端对齐', val: 'text-bottom'}
	  ]};
//文字间距
JcssPicker.cssMap["letter-spacing"] = {name: "文字间距", style: "letterSpacing"};

//背景色
JcssPicker.cssMap["background-color"] = {name: "背景色", style: "backgroundColor"};
//宽度
JcssPicker.cssMap["width"] = {name: "宽度", style: "width"};
//高度
JcssPicker.cssMap["height"] = {name: "高度", style: "height"};
//外边距
JcssPicker.cssMap["margin"] = {name: "外边距", style: "margin"};
//内边距
JcssPicker.cssMap["padding"] = {name: "内边距", style: "padding"};


//边框
JcssPicker.cssMap["border"] = {name: "边框", style: "border"};
//边框宽度
JcssPicker.cssMap["border-width"] = {name: "边框宽度", style: "borderWidth"};
//边框风格
JcssPicker.cssMap["border-style"] = {name: "边框风格", style: "borderStyle", opts: [ 
	  { name: '无边框', val: 'none'},
	  { name: '虚线', val: 'solid'},
	  { name: '虚线', val: 'dashed'}
	  ]};
//边框颜色
JcssPicker.cssMap["border-color"] = {name: "边框颜色", style: "borderColor"};



//======================测试示例,可以注释掉==================================================================

$(document).ready(function() {    
	initHtml(el("divCssPicker"));
	$("#divCssPicker").find("[jsstyle]").on("change", function(){		
		$("#divTest").css($(this).attr("cssstyle"), $(this).val());
		document.getElementById('txtTest').value = el("divTest").style.cssText;
	});
	document.getElementById('txtTest').value = el("divTest").style.cssText;
});

function initHtml(elm) {	
	var divList = $(elm).addClass("JcssPicker-list"); 
	divList.empty();
	for(var cssStyle in JcssPicker.cssMap)
	{
		if (JcssPicker.cssMap.hasOwnProperty(cssStyle)) 
		{
			var styleMap = JcssPicker.cssMap[cssStyle];
			var divItem = $("<div>").addClass("JcssPicker-item").appendTo(divList);
			var divDesc = $("<div>").attr("title", cssStyle).addClass("Jcss-desc").appendTo(divItem);
			var divDisp = $("<div>").attr("title", cssStyle).addClass("Jcss-disp").appendTo(divItem);
			divDesc.html(styleMap["name"]+":");
			if( styleMap["opts"] && styleMap["opts"].length > 0) {
				var sel = $("<select>").addClass("Jcss-select").appendTo(divDisp);
				sel.attr("cssstyle",cssStyle);
				sel.attr("jsstyle",styleMap["style"]);
				sel.append("<option>");
				for(var i = 0; i< styleMap["opts"].length; i++) {
					sel.append("<option value='"+styleMap["opts"][i]["val"]+"'>"+styleMap["opts"][i]["name"]+"</option>");
				}
			}
			else {
				var input = $("<input>").addClass("Jcss-input").appendTo(divDisp);
				input.attr("cssstyle",cssStyle);
				input.attr("jsstyle",styleMap["style"]);
			}
		}		
	}
	divList.find("[jsstyle='color'],[jsstyle='borderColor'],[jsstyle='backgroundColor']").click(function(){
		JcssPicker.pickColor(this, null, this.value);		
	});
}

