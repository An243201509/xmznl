/**
 * ext-widgets.js 收集ext官方的扩展控件、以及自身扩展出的一些仅功能性的控件
 */

// @chapter
Ext.util.Format.boolRenderer = function(v){ 
	if (v) {
		return Ext.util.Format.trueText;
	} else {
		return Ext.util.Format.falseText;
	}
}

// @chapter
Ext.apply(Ext.form.VTypes, {
	
	code: function(v) {
		return /^[_a-zA-Z0-9]+$/.test(v);
	},
	
	codeText: '只能输入字母、数字、下划线的组合字符',
	
	daterange : function(val, field) {
		
		var date = field.parseDate(val);
		
		if(date){
			
			if (field.startDateField) {
			    var start = Ext.getCmp(field.startDateField);
			    if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
			    	// 修正日期框里提示不正常bug
		            var maxText = String.format(start.maxText, start.formatDate(date));
		            if (start.menu) {
		            	start.menu.picker.maxText = maxText;
		            }
			        start.setMaxValue(date);
			        start.validate();
			    }
			} else if (field.endDateField) {
			    var end = Ext.getCmp(field.endDateField);
			    if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
			    	// 修正日期框里提示不正常bug
			    	var minText = String.format(end.minText, end.formatDate(date));
			    	if (end.menu) {
			    		end.menu.picker.minText = minText;
		            }
			        end.setMinValue(date);
			        end.validate();
			    }
			}
			
		} else {
			if (field.startDateField) {
			    var start = Ext.getCmp(field.startDateField);
			    if (start.maxValue) {
			        start.setMaxValue(null)
			    }
			} else if (field.endDateField) {
			    var end = Ext.getCmp(field.endDateField);
			    if (end.minValue) {
			        end.setMinValue(null);
			    }
			}
		}
	    return true;
	},
		
	password : function(val, field) {
	    if (field.initialPassField) {
	        var pwd = Ext.getCmp(field.initialPassField);
	        return (val == pwd.getValue());
	    }
	    return true;
	},
		
	passwordText : '密码两次输入不一致'
});

if (!Array.prototype.map) {
    Array.prototype.map = function(fun){
        var len = this.length;
        if (typeof fun != 'function') {
            throw new TypeError();
        }
        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }
        return res;
    };
}

Ext.data.PagingMemoryProxy = Ext.extend(Ext.data.MemoryProxy, {
    constructor : function(data){
        Ext.data.PagingMemoryProxy.superclass.constructor.call(this);
        this.data = data;
    },
    doRequest : function(action, rs, params, reader, callback, scope, options){
        params = params ||
        {};
        var result;
        try {
            result = reader.readRecords(this.data);
        } 
        catch (e) {
            this.fireEvent('loadexception', this, options, null, e);
            callback.call(scope, null, options, false);
            return;
        }
        
        // filtering
        if (params.filter !== undefined) {
            result.records = result.records.filter(function(el){
                if (typeof(el) == 'object') {
                    var att = params.filterCol || 0;
                    return String(el.data[att]).match(params.filter) ? true : false;
                }
                else {
                    return String(el).match(params.filter) ? true : false;
                }
            });
            result.totalRecords = result.records.length;
        }
        
        // sorting
        if (params.sort !== undefined) {
            // use integer as params.sort to specify column, since arrays are not named
            // params.sort=0; would also match a array without columns
            var dir = String(params.dir).toUpperCase() == 'DESC' ? -1 : 1;
            var fn = function(v1, v2){
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            result.records.sort(function(a, b){
                var v = 0;
                if (typeof(a) == 'object') {
                    v = fn(a.data[params.sort], b.data[params.sort]) * dir;
                }
                else {
                    v = fn(a, b) * dir;
                }
                if (v == 0) {
                    v = (a.index < b.index ? -1 : 1);
                }
                return v;
            });
        }
        // paging (use undefined cause start can also be 0 (thus false))
        if (params.start !== undefined && params.limit !== undefined) {
            result.records = result.records.slice(params.start, params.start + params.limit);
        }
        callback.call(scope, result, options, true);
    }
});


/***********************************************
 @chapter 
 ***********************************************/
Ext.grid.NodeColumn = Ext.extend(Ext.grid.Column, {
	
	depthIndex: 'level',
	
	upRe: /ext-node-upward/,
	
	downRe: /ext-node-downward/,
	
	refreshRe: /ext-node-refresh/,
	
	getNodeIndent : function(depth){
		var buf = [];
		for (var i = 0; i < depth - 1; i++) {
			buf.push('<img alt="" src="'+ Ext.BLANK_IMAGE_URL +'" class="ext-tree-node ext-tree-elbow-line" />')
		}
		if (depth > 0) {
			buf.unshift('<img alt="" src="'+ Ext.BLANK_IMAGE_URL +'" class="ext-tree-node ext-tree-elbow" />');
		}
		return buf.join('');
	},
	
	processEvent : function(name, e, grid, rowIndex, colIndex){
		
    	var nodeParam = grid.nodeParam || 'node';
    	var parentParam = grid.parentParam || 'parent';
    	var depthParam = grid.depthParam || this.depthIndex;
		
	    if (this.downRe.test(e.getTarget().className)) {

	    	grid.clearRequestParams([depthParam, parentParam]);
	    	
			var params = grid.getRequestParams();
			var r = grid.getStore().getAt(rowIndex);
			params[nodeParam] = r.data.id;
			grid.setRequestParams(params);
			grid.reload();
			
	        return false;
	        
	    } else if (this.upRe.test(e.getTarget().className)){

	    	grid.clearRequestParams([depthParam, nodeParam]);
	    	
	    	var params = grid.getRequestParams();
			var r = grid.getStore().getAt(rowIndex);
			params[parentParam] = r.data.parentId;
			grid.setRequestParams(params);
			grid.reload();
			
	        return false;
	        
	    }  else if (this.refreshRe.test(e.getTarget().className)){
	    	
			grid.clearRequestParams([nodeParam,parentParam]);
			grid.reload();
			
	        return false;
	    }
        return this.fireEvent(name, this, grid, rowIndex, e);
    },
    
	constructor : function(cfg) {
		Ext.grid.NodeColumn.superclass.constructor.call(this,cfg);
		var me = this;
		this.renderer = function(v, meta, r){
			var icon = [], img = '<img src="'+ Ext.BLANK_IMAGE_URL +'" class="{0}">';
			
			if (r.data.level <= 1) {
				if (!r.data.leaf) {
					icon.push(String.format(img,'ext-tree-node ext-node-downward'));
				}
				//icon.push(String.format(img,'ext-tree-node ext-node-refresh'));
			} else if (r.data.level > 1) {
				if (!r.data.leaf) {
					icon.push(String.format(img,'ext-tree-node ext-node-downward'));
				}
				icon.push(String.format(img,'ext-tree-node ext-node-upward'));
			}
			
			if (r.data.leaf) {
				icon.push(String.format(img,'ext-tree-node ext-tree-node-leaf'));
			} else {
				icon.push(String.format(img,'ext-tree-node ext-tree-folder'));
			}
			
			var depth = parseInt(r.data[me.depthIndex] ? r.data[me.depthIndex] : r.data['depth']);
			
			return me.getNodeIndent(depth)+ icon.join('') + 
				'<span class="ext-tree-node-anchor">'+ v +'</span>';
		}
	}
});

/***********************************************
 @chapter 
 ***********************************************/

Ext.grid.NumberColumn = Ext.extend(Ext.grid.Column, {
	format : '0,000.00',
	percentage : false,
	align : 'right',
	multiplyPercentage: function(value){
		if (Ext.isEmpty(value)) return '';
		if (Ext.isNumber(value)) value = String(value);
		var decimalSeparatorIndex = value.indexOf('.');
		// 有小数点
		if (decimalSeparatorIndex > -1) {
			// 小数部分
			var decimalPrecision = value.substring(decimalSeparatorIndex + 1, value.length);
			// 整数部分
			var integerPrecision = value.substring(0, decimalSeparatorIndex);
			// 小数部分大于等于2位
			if (decimalPrecision.length >= 2) {
				value = (integerPrecision + 
						// 小数前2位，如：134.3224 前2位小数是32
					decimalPrecision.substring(0, 2) + 
						// 如果小数位数大于2位，则补小数点再加上后面的小数，即为 .24
						(decimalPrecision.length > 2 ? '.'+ 
								decimalPrecision.substring(2, 
										decimalPrecision.length) :
									'')).replace(/^0+/ig, '');
				if (value.indexOf('.') == 0) {
					return '0'+ value;
				}
				return value;
			} else {
				if (integerPrecision.length == 1 && integerPrecision == '0') {
					integerPrecision = '';
				}
				return integerPrecision + decimalPrecision +'0';
			}
		} else {
			return value +'00';
		}
	},
	constructor : function(cfg) {
		Ext.grid.NumberColumn.superclass.constructor.call(this,cfg);
		var me = this;
		if (me.percentage) {
			me.header += '(%)';
		}
		this.renderer = function(v, meta, record, rowIndex, colIndex, store) {
			if (me.percentage) {
				v = me.multiplyPercentage(v);
			}
			if (cfg.renderer) {
				v = cfg.renderer(v, meta, record, rowIndex, colIndex, store);
			}
			var value = Ext.util.Format.number(v, this.format);
			if (me.percentage) {
				return value;// +'%'
			}
			return value;
		}.createDelegate(this);
	}
});

Ext.grid.AmountColumn = Ext.extend(Ext.grid.Column, {
	format : '000.00',
	decimalPrecision : 2,
	integerPrecision : 3,
	constructor : function(cfg) {
		cfg.align = 'right';
		cfg.css = 'padding:0px;';
		this.integerPrecision = this.format.length;
		var index = this.format.indexOf('.');
		if (index > -1) {
			this.decimalPrecision = this.format.substring(
					index + 1, this.format.length).length;
			this.integerPrecision = this.format.substring(0,
					index).length;
		}
		Ext.grid.AmountColumn.superclass.constructor.call(this,
				cfg);
	},
	renderer : function(v, meta) {
		var displayColor = (Ext.num(v) < 0 ? 'red' : 'black');
		var negative = v.indexOf('-') > -1;
		if (negative)
			v = v.substring(1, v.length);
		var index = v.indexOf('.');
		var integerPrecision = v.length;
		var decimalPrecision = 0;
		if (index > -1) {
			integerPrecision = v.substring(0, index).length;
			decimalPrecision = v.substring(index + 1, v.length).length;
		}

		var b = [];
		var value, pointStyle, borderStyle = 'border-right:1px solid green;';
		// decimal
		for ( var i = 0; i < this.decimalPrecision; i++) {
			value = v.substring(v.length - i - 1, v.length - i);
			b.push('<td style="' + (i == 0 ? '' : borderStyle)
					+ '"><pre>' + value + '</pre></td>');
		}
		// integer
		v = v.substring(index + 1, v.length);
		for ( var i = 0; i < 10; i++) {
			if (i != 0 && (i + 1) % this.integerPrecision == 0)
				borderStyle = 'border-right:2px solid green;';
			else
				borderStyle = 'border-right:1px solid green;';
			if (i >= integerPrecision) {
				b.push('<td style="' + borderStyle
						+ '"><pre>&nbsp;</pre></td>');
				continue;
			}
			value = v.substring(v.length - i - 1, v.length - i);
			b.push('<td style="'
					+ (i == 0 ? 'border-right:1px solid red'
							: borderStyle) + '"><pre>' + value
					+ '</pre></td>');
		}
		b.reverse();
		meta.attr = 'style="padding:0px;line-height:normal;"';
		return '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="color:'
				+ displayColor
				+ ';border-collpase:collapse;border:1px solid green;border-bottom:0px;height:25px"><tr>'
				+ b.join('') + '</tr></table>';
	}
});

Ext.grid.ImageColumn = Ext.extend(Ext.grid.Column, {
	printable : false,
	cls : 'x-grid-column-image',
	constructor : function(cfg) {
		Ext.apply(this, cfg);
		Ext.grid.ImageColumn.superclass.constructor.call(this, cfg);
		this.renderer = this.renderer.createDelegate(this);
		this.processEvent = this.processEvent.createDelegate(this);
	},
	renderer : function(v, meta, r) {
		this.src = v;
		return '<a href="#"><img src="' + v + '" cls="' + this.cls
				+ '" border="0" width="25" height="25"/></a>';
	},
	processEvent : function(name, e, grid, rowIndex, colIndex) {
		if (name == 'mousedown' && e.button == 0) {
			if (this.layer == undefined) {
				this.layer = new Ext.Window({
					closeAction : 'hide',
					layout : 'fit',
					width : Ext.isIE ? 200 : 'auto',
					resizable : true,
					draggable : true,
					constrain : false,
					modal : true,
					shadow : true,
					shim : true,
					maximizable : false,
					minimizable : false,
					items : {
						xtype : 'box',
						layout : 'fit',
						autoEl : {
							tag : 'img',
							src : this.src
						}
					}
				});
			}
			this.layer.show(e.getTarget());
		}
		return false;
	}
});

Ext.grid.ProgressColumn = Ext.extend(Ext.grid.Column, {
	printable : false,
	cls: 'x-progress-column',
    progressCls: 'x-progress',
    progressText: ' {0}%',
	constructor : function(cfg) {
        var me = this,
        	cls = me.progressCls;
		Ext.grid.ProgressColumn.superclass.constructor.call(this, cfg);
		this.renderer = function(value, meta, r) {
			value = Ext.num(value, 0);
			var width = value * (me.width / 100);
            var text = String.format(me.progressText, value);
            if (width > me.width || value >= 100) {
            	width = me.width;
            }
            var position = Ext.isIE ? "position:absolute;" : ""; 
            return '<div class="x-progress-wrap" style="height:14px;" >' +  
                 '<div class="x-progress-inner">' +  
	                 '<div class="x-progress-bar" style="height:14px;width:'+ width +'px;">' +  
		                 '<div style="font-weight:bold;z-index: 99;text-align:center;'+ position +
		                 	'color:black;width:'+ me.width +'px;">'+  
		                 	text +  
		                 '</div>' +
		             '</div>' +
	             '</div></div>';  
		}
    }
});
Ext.apply(Ext.grid.Column.types, {
	nodecolumn : Ext.grid.NodeColumn,
	numbercolumn : Ext.grid.NumberColumn,
	imagecolumn : Ext.grid.ImageColumn,
	amountcolumn : Ext.grid.AmountColumn,
	progress : Ext.grid.ProgressColumn
});

Ext.grid.LockingColumnModel = Ext.extend(Ext.grid.ColumnModel, {
    isLocked : function(colIndex){
        return this.config[colIndex] && 
        		this.config[colIndex].locked === true;
    },
    setLocked : function(colIndex, value, suppressEvent){
        if (this.isLocked(colIndex) == value) {
            return;
        }
        this.config[colIndex].locked = value;
        if (!suppressEvent) {
            this.fireEvent('columnlockchange', this, colIndex, value);
        }
    },
    getTotalWidth : function(includeHidden) {
        if (!this.totalWidth) {
            this.totalWidth = 0;
            for (var i = 0, len = this.config.length; i < len; i++) {
                if (includeHidden || !this.isHidden(i)) {
                    this.totalWidth += this.getColumnWidth(i) + 2;
                }
            }
        }
        return this.totalWidth - 1;
    },
    getTotalLockedWidth : function(){
        var totalWidth = 0;
        for (var i = 0, len = this.config.length; i < len; i++) {
            if (this.isLocked(i) && !this.isHidden(i)) {
                totalWidth += this.getColumnWidth(i) + 2;
            }
        }

        return totalWidth;
    },
    getLockedCount : function() {
        var len = this.config.length;

        for (var i = 0; i < len; i++) {
            if (!this.isLocked(i)) {
                return i;
            }
        }

        return len;
    },
    applySortConfig : function() {
		var col, i, cols = [], hiddenCols = [], lockedCols = [];
		for (i = 0; i < this.config.length; i++) {
			col = this.config[i];
			// 隐藏列放后面
			if (col.hidden) {
				hiddenCols.push(col);
			} 
			// 锁定列放前面
			else if (col.locked == true) {
				lockedCols.push(col);
			}
			else {
				cols.push(col);
			}
		}
		this.config = lockedCols.concat(cols).concat(hiddenCols);
	},
    moveColumn : function(oldIndex, newIndex){
        var oldLocked = this.isLocked(oldIndex),
            newLocked = this.isLocked(newIndex);

        if (oldIndex < newIndex && oldLocked && !newLocked) {
            this.setLocked(oldIndex, false, true);
        } else if (oldIndex > newIndex && !oldLocked && newLocked) {
            this.setLocked(oldIndex, true, true);
        }

        Ext.grid.LockingColumnModel.superclass.moveColumn.apply(this, arguments);
    }
});

Ext.form.FileUploadField = Ext.extend(Ext.form.TextField,  {

    buttonText: '浏览...',

    buttonOnly: false,

    buttonOffset: 3,

    readOnly: true,

    autoSize: Ext.emptyFn,
    
    tailClass: 'x-form-tail-trigger',

    initComponent: function(){
        Ext.form.FileUploadField.superclass.initComponent.call(this);

        this.addEvents(
            'select'
        );
    },

    // private
    onRender : function(ct, position){
        Ext.form.FileUploadField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls:'x-form-field-wrap x-form-file-wrap x-form-field-trigger-wrap'});
        this.el.addClass('x-form-file-text');
        this.el.dom.removeAttribute('name');
        this.createFileInput();

        var btnCfg = Ext.applyIf(this.buttonCfg || {}, {
            text: this.buttonText
        });
        this.button = new Ext.Button(Ext.apply(btnCfg, {
            renderTo: this.wrap,
            cls: 'x-form-file-btn' + (btnCfg.iconCls ? ' x-btn-icon' : '')
        }));
        this.button.getEl().enableDisplayMode('block');

        if(this.buttonOnly){
            this.el.hide();
            this.wrap.setWidth(this.button.getEl().getWidth());
        }

        this.bindListeners();
        this.resizeEl = this.positionEl = this.wrap;
    },
    
    afterRender: function(){
        Ext.form.FileUploadField.superclass.afterRender.call(this, arguments);
        if (this.tailEl && this.wrap) {
        	var offset = Ext.isGecko ? 5 : (Ext.isIE6 || Ext.isIE7 ? -3 : 0);
            this.tailEl.alignTo(this.wrap, 'tl-tr', [offset]);
        }
    },
    
    bindListeners: function(){
        this.fileInput.on({
            scope: this,
            mouseenter: function() {
                this.button.addClass(['x-btn-over','x-btn-focus']);
            },
            mouseleave: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click']);
            },
            mousedown: function(){
                this.button.addClass('x-btn-click');
            },
            mouseup: function(){
                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click']);
            },
            change: function(){
                var v = this.fileInput.dom.value;
                this.setValue(v);
                this.fireEvent('select', this, v);    
            }
        }); 
    },
    
    createFileInput : function() {
        this.fileInput = this.wrap.createChild({
            id: this.getFileInputId(),
            name: this.name||this.getId(),
            cls: 'x-form-file',
            tag: 'input',
            type: 'file',
            size: 1
        });
    },
    
    reset : function(){
        this.fileInput.remove();
        this.createFileInput();
        this.bindListeners();
        Ext.form.FileUploadField.superclass.reset.call(this);
    },

    getFileInputId: function(){
        return this.id + '-file';
    },

    onResize : function(w, h){
        Ext.form.FileUploadField.superclass.onResize.call(this, w, h);

        this.wrap.setWidth(w);

        if(!this.buttonOnly){
        	this.button.getEl().setWidth(this.button.btnEl.getWidth() + 6);
            var w = this.wrap.getWidth() - this.button.getEl().getWidth() - this.buttonOffset;
            this.el.setWidth(w);
        }
    },

    onDestroy: function(){
        Ext.form.FileUploadField.superclass.onDestroy.call(this);
        Ext.destroy(this.fileInput, this.button, this.wrap);
    },
    
    onDisable: function(){
        Ext.form.FileUploadField.superclass.onDisable.call(this);
        this.doDisable(true);
    },
    
    onEnable: function(){
        Ext.form.FileUploadField.superclass.onEnable.call(this);
        this.doDisable(false);

    },
    
    doDisable: function(disabled){
        this.fileInput.dom.disabled = disabled;
        this.button.setDisabled(disabled);
    },

    preFocus : Ext.emptyFn,

    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    },
    
    updateStatus: function(status){
    	Ext.form.FileUploadField.superclass.updateStatus.call(this, status);
    	this.button.updateStatus(status);
    	if (this.status == 'view') {
    		this.button.setVisible(false);
    		this.fileInput.setVisible(false);
    	} else {
    		this.button.setVisible(true);
    		this.fileInput.setVisible(true);
    	}
    }

});

Ext.reg('fileuploadfield', Ext.form.FileUploadField);

Ext.form.FileUpload = Ext.form.FileUploadField;


Ext.Spinner = Ext.extend(Ext.util.Observable, {
    incrementValue: 1,
    alternateIncrementValue: 5,
    triggerClass: 'x-form-spinner-trigger',
    splitterClass: 'x-form-spinner-splitter',
    alternateKey: Ext.EventObject.shiftKey,
    defaultValue: 0,
    accelerate: false,

    constructor: function(config){
        Ext.Spinner.superclass.constructor.call(this, config);
        Ext.apply(this, config);
        this.mimicing = false;
    },

    init: function(field){
        this.field = field;

        field.afterMethod('onRender', this.doRender, this);
        field.afterMethod('onEnable', this.doEnable, this);
        field.afterMethod('onDisable', this.doDisable, this);
        field.afterMethod('afterRender', this.doAfterRender, this);
        field.afterMethod('onResize', this.doResize, this);
        field.afterMethod('onFocus', this.doFocus, this);
        field.beforeMethod('onDestroy', this.doDestroy, this);
    },

    doRender: function(ct, position){
        var el = this.el = this.field.getEl();
        var f = this.field;

        if (!f.wrap) {
            f.wrap = this.wrap = el.wrap({
                cls: "x-form-field-wrap"
            });
        }
        else {
            this.wrap = f.wrap.addClass('x-form-field-wrap');
        }

        this.trigger = this.wrap.createChild({
            tag: "img",
            src: Ext.BLANK_IMAGE_URL,
            cls: "x-form-trigger " + this.triggerClass
        });

        if (!f.width) {
            this.wrap.setWidth(el.getWidth() + this.trigger.getWidth());
        }

        this.splitter = this.wrap.createChild({
            tag: 'div',
            cls: this.splitterClass,
            style: 'width:13px; height:2px;'
        });
        this.splitter.setRight((Ext.isIE) ? 1 : 2).setTop(10).show();

        this.proxy = this.trigger.createProxy('', this.splitter, true);
        this.proxy.addClass("x-form-spinner-proxy");
        this.proxy.setStyle('left', '0px');
        this.proxy.setSize(14, 1);
        this.proxy.hide();
        this.dd = new Ext.dd.DDProxy(this.splitter.dom.id, "SpinnerDrag", {
            dragElId: this.proxy.id
        });

        this.initTrigger();
        this.initSpinner();
    },

    doAfterRender: function(){
        var y;
        if (Ext.isIE && this.el.getY() != (y = this.trigger.getY())) {
            this.el.position();
            this.el.setY(y);
        }
    },

    doEnable: function(){
        if (this.wrap) {
            this.wrap.removeClass(this.field.disabledClass);
        }
    },

    doDisable: function(){
        if (this.wrap) {
            this.wrap.addClass(this.field.disabledClass);
            this.el.removeClass(this.field.disabledClass);
        }
    },

    doResize: function(w, h){
        if (typeof w == 'number') {
            this.el.setWidth(w - this.trigger.getWidth());
        }
        this.wrap.setWidth(this.el.getWidth() + this.trigger.getWidth());
    },

    doFocus: function(){
        if (!this.mimicing) {
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {
                delay: 10
            });
            this.el.on('keydown', this.checkTab, this);
        }
    },

    // private
    checkTab: function(e){
        if (e.getKey() == e.TAB) {
            this.triggerBlur();
        }
    },

    // private
    mimicBlur: function(e){
        if (!this.wrap.contains(e.target) && this.field.validateBlur(e)) {
            this.triggerBlur();
        }
    },

    // private
    triggerBlur: function(){
        this.mimicing = false;
        Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
        this.el.un("keydown", this.checkTab, this);
        this.field.beforeBlur();
        this.wrap.removeClass('x-trigger-wrap-focus');
        this.field.onBlur.call(this.field);
    },

    initTrigger: function(){
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
    },

    initSpinner: function(){
        this.field.addEvents({
            'spin': true,
            'spinup': true,
            'spindown': true
        });

        this.keyNav = new Ext.KeyNav(this.el, {
            "up": function(e){
                e.preventDefault();
                this.onSpinUp();
            },

            "down": function(e){
                e.preventDefault();
                this.onSpinDown();
            },

            "pageUp": function(e){
                e.preventDefault();
                this.onSpinUpAlternate();
            },

            "pageDown": function(e){
                e.preventDefault();
                this.onSpinDownAlternate();
            },

            scope: this
        });

        this.repeater = new Ext.util.ClickRepeater(this.trigger, {
            accelerate: this.accelerate
        });
        this.field.mon(this.repeater, "click", this.onTriggerClick, this, {
            preventDefault: true
        });

        this.field.mon(this.trigger, {
            mouseover: this.onMouseOver,
            mouseout: this.onMouseOut,
            mousemove: this.onMouseMove,
            mousedown: this.onMouseDown,
            mouseup: this.onMouseUp,
            scope: this,
            preventDefault: true
        });

        this.field.mon(this.wrap, "mousewheel", this.handleMouseWheel, this);

        this.dd.setXConstraint(0, 0, 10);
        this.dd.setYConstraint(1500, 1500, 10);
        this.dd.endDrag = this.endDrag.createDelegate(this);
        this.dd.startDrag = this.startDrag.createDelegate(this);
        this.dd.onDrag = this.onDrag.createDelegate(this);
    },

    onMouseOver: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        this.tmpHoverClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-overup' : 'x-form-spinner-overdown';
        this.trigger.addClass(this.tmpHoverClass);
    },

    //private
    onMouseOut: function(){
        this.trigger.removeClass(this.tmpHoverClass);
    },

    //private
    onMouseMove: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        if (((Ext.EventObject.getPageY() > middle) && this.tmpHoverClass == "x-form-spinner-overup") ||
        ((Ext.EventObject.getPageY() < middle) && this.tmpHoverClass == "x-form-spinner-overdown")) {
        }
    },

    //private
    onMouseDown: function(){
        if (this.disabled) {
            return;
        }
        var middle = this.getMiddle();
        this.tmpClickClass = (Ext.EventObject.getPageY() < middle) ? 'x-form-spinner-clickup' : 'x-form-spinner-clickdown';
        this.trigger.addClass(this.tmpClickClass);
    },

    //private
    onMouseUp: function(){
        this.trigger.removeClass(this.tmpClickClass);
    },

    //private
    onTriggerClick: function(){
        if (this.disabled || this.el.dom.readOnly) {
            return;
        }
        var middle = this.getMiddle();
        var ud = (Ext.EventObject.getPageY() < middle) ? 'Up' : 'Down';
        this['onSpin' + ud]();
    },

    //private
    getMiddle: function(){
        var t = this.trigger.getTop();
        var h = this.trigger.getHeight();
        var middle = t + (h / 2);
        return middle;
    },

    //private
    //checks if control is allowed to spin
    isSpinnable: function(){
        if (this.disabled || this.el.dom.readOnly) {
            Ext.EventObject.preventDefault(); //prevent scrolling when disabled/readonly
            return false;
        }
        return true;
    },

    handleMouseWheel: function(e){
        //disable scrolling when not focused
        if (this.wrap.hasClass('x-trigger-wrap-focus') == false) {
            return;
        }

        var delta = e.getWheelDelta();
        if (delta > 0) {
            this.onSpinUp();
            e.stopEvent();
        }
        else
            if (delta < 0) {
                this.onSpinDown();
                e.stopEvent();
            }
    },

    //private
    startDrag: function(){
        this.proxy.show();
        this._previousY = Ext.fly(this.dd.getDragEl()).getTop();
    },

    //private
    endDrag: function(){
        this.proxy.hide();
    },

    //private
    onDrag: function(){
        if (this.disabled) {
            return;
        }
        var y = Ext.fly(this.dd.getDragEl()).getTop();
        var ud = '';

        if (this._previousY > y) {
            ud = 'Up';
        } //up
        if (this._previousY < y) {
            ud = 'Down';
        } //down
        if (ud != '') {
            this['onSpin' + ud]();
        }

        this._previousY = y;
    },

    //private
    onSpinUp: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        if (Ext.EventObject.shiftKey == true) {
            this.onSpinUpAlternate();
            return;
        }
        else {
            this.spin(false, false);
        }
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spinup", this);
    },

    //private
    onSpinDown: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        if (Ext.EventObject.shiftKey == true) {
            this.onSpinDownAlternate();
            return;
        }
        else {
            this.spin(true, false);
        }
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spindown", this);
    },

    //private
    onSpinUpAlternate: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        this.spin(false, true);
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spinup", this);
    },

    //private
    onSpinDownAlternate: function(){
        if (this.isSpinnable() == false) {
            return;
        }
        this.spin(true, true);
        this.field.fireEvent("spin", this);
        this.field.fireEvent("spindown", this);
    },

    spin: function(down, alternate){
        var v = parseFloat(this.field.getValue());
        var incr = (alternate == true) ? this.alternateIncrementValue : this.incrementValue;
        (down == true) ? v -= incr : v += incr;

        v = (isNaN(v)) ? this.defaultValue : v;
        v = this.fixBoundries(v);
        this.field.setRawValue(v);
    },

    fixBoundries: function(value){
        var v = value;

        if (this.field.minValue != undefined && v < this.field.minValue) {
            v = this.field.minValue;
        }
        if (this.field.maxValue != undefined && v > this.field.maxValue) {
            v = this.field.maxValue;
        }

        return this.fixPrecision(v);
    },

    // private
    fixPrecision: function(value){
        var nan = isNaN(value);
        if (!this.field.allowDecimals || this.field.decimalPrecision == -1 || nan || !value) {
            return nan ? '' : value;
        }
        return parseFloat(parseFloat(value).toFixed(this.field.decimalPrecision));
    },

    doDestroy: function(){
        if (this.trigger) {
            this.trigger.remove();
        }
        if (this.wrap) {
            this.wrap.remove();
            delete this.field.wrap;
        }

        if (this.splitter) {
            this.splitter.remove();
        }

        if (this.dd) {
            this.dd.unreg();
            this.dd = null;
        }

        if (this.proxy) {
            this.proxy.remove();
        }

        if (this.repeater) {
            this.repeater.purgeListeners();
        }
        if (this.mimicing){
            Ext.get(Ext.isIE ? document.body : document).un("mousedown", this.mimicBlur, this);
        }
    }
});

Ext.form.SpinnerField = Ext.extend(Ext.form.NumberField, {
	
    actionMode: 'wrap',
    
    deferHeight: true,
    
    autoSize: Ext.emptyFn,
    
    onBlur: Ext.emptyFn,
    
    isZoom: false,
    
    adjustSize: Ext.BoxComponent.prototype.adjustSize,

	constructor: function(config) {
		var spinnerConfig = Ext.copyTo({}, config, 'incrementValue,alternateIncrementValue,accelerate,defaultValue,triggerClass,splitterClass');

		var spl = this.spinner = new Ext.Spinner(spinnerConfig);

		var plugins = config.plugins
			? (Ext.isArray(config.plugins)
				? config.plugins.push(spl)
				: [config.plugins, spl])
			: spl;

		Ext.form.SpinnerField.superclass.constructor.call(this, Ext.apply(config, {plugins: plugins}));
	},

    // private
    getResizeEl: function(){
        return this.wrap;
    },

    // private
    getPositionEl: function(){
        return this.wrap;
    },

    // private
    alignErrorIcon: function(){
        if (this.wrap) {
            this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
        }
    },

    validateBlur: function(){
        return true;
    }
});

Ext.reg('spinnerfield', Ext.form.SpinnerField);

/******************************************************************
 @Chapter Ext.form.MultiCalendar
 * ***************************************************************/
Ext.form.MultiCalendar = Ext.extend(Ext.Component, {
	
	minDate : null,
	
	maxDate : null,
	
	minText : "This date is before the minimum date",
	
	maxText : "This date is after the maximum date",
	
	format : "m/d/y",
	
	disabledDays : null,
	
	highlightDays : null,
	
	highlightCss : "x-highlight",
	
	disabledDaysText : "",
	
	disabledDatesRE : null,
	
	disabledDatesText : "",
	
	constrainToViewport : true,
	
	monthNames : Date.monthNames,
	
	dayNames : Date.dayNames,
	
	nextText : 'Next Month (Control+Right)',
	
	prevText : 'Previous Month (Control+Left)',
	
	startDay : 0,
	
	noOfMonth : 2,
	
	eventDates : null,
	 
	noOfMonthPerRow : 3,
	
	disabledHeader: true,
	
	multiSelect: false,
	
	readOnly: false,
	
	values: null,
	
	seperator: ',',

	status: undefined,

	initComponent : function(){
		Ext.form.MultiCalendar.superclass.initComponent.call(this);
        this.value = this.value ? this.value.clearTime() : new Date().clearTime();
        this.values = new Array();
        this.monthNames = Date.monthNames;
        this.dayNames = Date.dayNames;
        this.initDisabledDays();
        this.initHighlightDays();
        this.noOfMonthPerRow = this.noOfMonthPerRow > this.noOfMonth ?this.noOfMonth : this.noOfMonthPerRow;
        this.addEvents('select');
	},
    updateStatus: function(status){
		this.setStatus(status);
    },
    getStatus: function(){
    	return this.status;
    },
    setStatus: function(status){
    	this.status = status;
    },
	// private
	initDisabledDays : function() {
		if (!this.disabledDatesRE && this.disabledDates) {
			var dd = this.disabledDates;
			var re = "(?:";
			for (var i = 0; i < dd.length; i++) {
				re += dd[i];
				if (i != dd.length - 1)
					re += "|";
			}
			this.disabledDatesRE = new RegExp(re + ")");
		}
	},
	// private
	initHighlightDays : function(){
		if (this.highlightDays) {
			var dd = this.highlightDays;
			var re = "(?:";
			for (var i = 0; i < dd.length; i++) {
				re += dd[i];
				if (i != dd.length - 1)
					re += "|";
			}
			this.highlightDatesRE = new RegExp(re + ")");
		}
	},
	clearValue : function(){
		this.values = [];
	},
	setValue : function() {
		var buf = [];
		for (var i = 0; i < arguments.length; i++) {
			if (Ext.isArray(arguments[i])) {
				buf = buf.concat(arguments[i]);
			} else if (Ext.isDate(arguments[i])) {
				buf.push(arguments[i]);
			}
		}
		for (var i = 0; i < buf.length; i++) {
			this.updateDate(buf[i]);
		}
	},
	setReadOnly: function(readOnly){
		this.readOnly = readOnly;
	},
	updateDate: function(value){
		if (this.disabled){
			return;
		}
		if (this.multiSelect == false) {
			this.clear();
		}
		value = value.clearTime();
		var x = value.getMonth();
		var cellNodes = this.cellsArray[x].elements;
		for (var i = 0; i < cellNodes.length; i ++) {
			if (cellNodes[i].firstChild.dateValue == value.getTime()) {
				var t = Ext.fly(cellNodes[i]);
				t.toggleClass('x-date-selected');
				if (t.hasClass('x-date-selected')) {
					this.values.push(value);
				} else {
					for (var k = 0; k < this.values.length; k++) {
						if (this.values[k].getTime() == value.getTime()) {
							this.values.splice(k, 1);
						}
					}
				}
			}
		}
		if (this.rendered && this.el) {
			var vals = [];
			Ext.each(this.values, function(val){
				if (val){
					vals.push(val.format(this.format));
				};
			}, this);
			this.el.dom.value = vals.join(this.seperator);
		}
	},
	getValue : function() {
		return this.values;
	},
	getName : function(){
		return this.rendered && this.el.dom.name ? this.el.dom.name : this.name || this.id || '';
	},
	validate : function(){
		
	},
	toggleCellClass: function(d, css){
		if (Ext.isArray(d)) {
			Ext.each(d, function(date){this.toggleCellClass(date, css);}, this);
		} else if (Ext.isDate(d)) {
			d = d.clearTime();
			var x = d.getMonth();
			var cellNodes = this.cellsArray[x].elements;
			for (var i = 0; i < cellNodes.length; i ++) {
				if (cellNodes[i].firstChild.dateValue == d.getTime()) {
					var t = Ext.fly(cellNodes[i]);
					t.toggleClass(css);
				}
			}
		}
	},
	// private
	focus : function() {
		if (this.el) {
			this.update(this.activeDate);
		}
	},
	clear: function(){
		var t;
		for (var x = 0; x < this.noOfMonth; x ++) {
			var cellNodes = this.cellsArray[x].elements;
			for (var i = 0; i < cellNodes.length; i ++) {
				t = Ext.fly(cellNodes[i]);
				t.removeClass('x-date-selected');
				this.values = [];
			}
		}
	},
	// private
	onRender : function(container, position) {
		var m = ["<table cellspacing='0'>"];
		var display = '';
		if (this.disabledHeader) {
			display = 'display:none';
		}
       if(this.noOfMonthPerRow > 1) {
            m.push("<tr style='", display ,"'><td class='x-date-left'><a href='#' title='", this.prevText ,"'> </a></td>");
               m.push("<td class='x-date-left' colspan='"+ eval(this.noOfMonthPerRow *2 -3) +"'></td>");
               m.push("<td class='x-date-right'><a href='#'  style='float:right' title='", this.nextText ,"'> </a></td></tr><tr>");
       } else {
               //Special case of only one month
               m.push("<tr><td><table cellspacing='0' width='100%'><tr><td class='x-date-left'><a href='#' title='", this.prevText ,"'> </a></td>");
               m.push("<td class='x-date-right'><a href='#' title='", this.nextText ,"'> </a></td></tr></table></td></tr><tr>");
       }
        for(var x=0; x<this.noOfMonth; x++) {            
            m.push("<td><table border='1' cellspacing='0'><tr>");
            m.push("<td class='x-date-middle' align='center'><span id='monthLabel" + x + "'></span></td>");
            m.push("</tr><tr><td><table class='x-date-inner' id='inner-date"+x+"' cellspacing='0'><thead><tr>");        
            var dn = this.dayNames;
            for(var i = 0; i < 7; i++){
               var d = this.startDay+i;
               if(d > 6){
                   d = d-7;
               }
               m.push("<th><span>", dn[d].substr(0,1), "</span></th>");
            }
            m[m.length] = "</tr></thead><tbody><tr>";
            for(var i = 0; i < 42; i++) {
                if(i % 7 == 0 && i != 0){
                    m[m.length] = "</tr><tr>";
                }
                m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
            }
            m[m.length] = '</tr></tbody></table></td></tr></table></td>';
            if(x != this.noOfMonth-1) {
                m[m.length] = "<td width='3'></td>";
            }
            if( (x+1) % this.noOfMonthPerRow == 0 && x!= 0) {
                m[m.length] = "</tr><tr>"; 
            }            
        }
        m[m.length] = "</tr></table>";            
        var el = document.createElement("div");
        el.className = "x-date-picker";
        el.innerHTML = m.join("");
		container.dom.insertBefore(el, position);
		this.el = Ext.get(el);
		this.eventEl = Ext.get(el.firstChild);
		new Ext.util.ClickRepeater(this.el.child("td.x-date-left a"), {
					handler : this.showPrevMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});
		new Ext.util.ClickRepeater(this.el.child("td.x-date-right a"), {
					handler : this.showNextMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});
		
		this.eventEl.on('click', function(e){
			e.preventDefault();
			if (this.readOnly) {
				return;
			}
			var t = e.getTarget('.x-date-date', 10, true);
			if (t) {
				this.selectDay(t, t.parent('td'));
			}
		}, this);

		var kn = new Ext.KeyNav(this.eventEl, {
					"left" : function(e) {
						e.ctrlKey ? this.showPrevMonth() : this
								.update(this.activeDate.add("d", -1));
					},
					"right" : function(e) {
						e.ctrlKey ? this.showNextMonth() : this
								.update(this.activeDate.add("d", 1));
					},
					"pageUp" : function(e) {
						this.showNextMonth();
					},
					"pageDown" : function(e) {
						this.showPrevMonth();
					},
					"enter" : function(e) {
						e.stopPropagation();
						return true;
					},
					scope : this
				});
		this.cellsArray = new Array();
		this.textNodesArray = new Array();
		for (var x = 0; x < this.noOfMonth; x++) {
			var cells = Ext.get('inner-date' + x).select("tbody td");
			var textNodes = Ext.get('inner-date' + x).query("tbody em span");
			this.cellsArray[x] = cells;
			this.textNodesArray[x] = textNodes;
		}
		if (Ext.isIE) {
			this.el.repaint();
		}
		this.update(this.value);
	},
	// private
	showPrevMonth : function(e) {
		this.update(this.activeDate.add("mo", -1));
	},
	// private
	showNextMonth : function(e) {
		this.update(this.activeDate.add("mo", 1));
	},
	selectDay : function(e, cell){
		if (this.readOnly) return;
		if (e.dom.dateValue) {
			var d = new Date(e.dom.dateValue);
			this.fireEvent('select', this, d);
			this.updateDate(d);
		}
	},
	// private
	update : function(date) {
		this.clearValue();
		date = new Date(date.getFullYear(), '00', '01');
		this.activeDate = date;
		for (var x = 0; x < this.noOfMonth; x++) {
			var days = date.getDaysInMonth();
			var firstOfMonth = date.getFirstDateOfMonth();
			var startingPos = firstOfMonth.getDay() - this.startDay;
			if (startingPos <= this.startDay) {
				startingPos += 7;
			}
			var pm = date.add("mo", -1);
			var prevStart = pm.getDaysInMonth() - startingPos;
			var cells = this.cellsArray[x].elements;
			var textEls = this.textNodesArray[x];
			days += startingPos;
			// convert everything to numbers so it's fast
			var day = 86400000;
			var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart))
					.clearTime();
			var min = this.minDate
					? this.minDate.clearTime()
					: Number.NEGATIVE_INFINITY;
			var max = this.maxDate
					? this.maxDate.clearTime()
					: Number.POSITIVE_INFINITY;
			var ddMatch = this.disabledDatesRE;
			var hlMatch = this.highlightDatesRE;
			var ddText = this.disabledDatesText;
			var ddays = this.disabledDays ? this.disabledDays.join("") : false;
			var ddaysText = this.disabledDaysText;
			var format = this.format;
			var setCellClass = function(cal, cell) {
				cell.title = "";
				var t = d.getTime();
				cell.firstChild.dateValue = t;
				// disabling
				if (t < min) {
					cell.className = " x-date-disabled";
					cell.title = cal.minText;
					return;
				}
				if (t > max) {
					cell.className = " x-date-disabled";
					cell.title = cal.maxText;
					return;
				}
				if (ddays) {
					if (ddays.indexOf(d.getDay()) != -1) {
						cell.title = ddaysText;
						cell.className = " x-date-disabled";
					}
				}
				if (ddMatch && format) {
					var fvalue = d.dateFormat(format);
					if (ddMatch.test(fvalue)) {
						cell.title = ddText.replace("%0", fvalue);
						cell.className = " x-date-disabled";
					}
				}
				if (hlMatch && format) {
					var fvalue = d.dateFormat(format);
					if (hlMatch.test(fvalue)) {
						cell.className = " "+ this.highlightCss;
					}
				}
				// Only active days need to be selected
				if (cal.eventDates
						&& (cell.className.indexOf('x-date-active') != -1)) {
					for (var y = 0; y < cal.eventDates.length; y++) {
						var evtDate = cal.eventDates[y].clearTime().getTime();
						if (t == evtDate) {
							cell.className += " x-date-selected";
							break;
						}
					}
				}
			};
			var i = 0;
			for (; i < startingPos; i++) {
				textEls[i].innerHTML = (++prevStart);
				d.setDate(d.getDate() + 1);
				cells[i].className = "x-date-prevday";
				setCellClass(this, cells[i]);
			}
			for (; i < days; i++) {
				intDay = i - startingPos + 1;
				textEls[i].innerHTML = (intDay);
				d.setDate(d.getDate() + 1);
				cells[i].className = "x-date-active";
				setCellClass(this, cells[i]);
			}
			var extraDays = 0;
			for (; i < 42; i++) {
				textEls[i].innerHTML = (++extraDays);
				d.setDate(d.getDate() + 1);
				cells[i].className = "x-date-nextday";
				setCellClass(this, cells[i]);
			}
			var monthLabel = Ext.get('monthLabel' + x);
			monthLabel.update(this.monthNames[date.getMonth()] + " "
					+ date.getFullYear());
			if (!this.internalRender) {
				var main = this.el.dom.firstChild;
				var w = main.offsetWidth;
				this.el.setWidth(w + this.el.getBorderWidth("lr"));
				Ext.fly(main).setWidth(w);
				this.internalRender = true;
				if (Ext.isOpera && !this.secondPass) {
					main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth + main.rows[0].cells[2].offsetWidth))
							+ "px";
					this.secondPass = true;
					this.update.defer(10, this, [date]);
				}
			}
			date = date.add('mo', 1);
		}
	}
});

Ext.reg('multicalendar', Ext.form.MultiCalendar);

Ext.grid.RowExpander = Ext.extend(Ext.util.Observable, {

    expandOnEnter : true,

    expandOnDblClick : true,

    header : '',
    width : 20,
    sortable : false,
    fixed : true,
    hideable: false,
    menuDisabled : true,
    dataIndex : '',
    id : 'expander',
    lazyRender : true,
    enableCaching : true,

    constructor: function(config){
        Ext.apply(this, config);

        this.addEvents({
            
            beforeexpand: true,
           
            expand: true,
            
            beforecollapse: true,
            
            collapse: true
        });

        Ext.grid.RowExpander.superclass.constructor.call(this);

        if(this.tpl){
            if(typeof this.tpl == 'string'){
                this.tpl = new Ext.Template(this.tpl);
            }
            this.tpl.compile();
        }

        this.state = {};
        this.bodyContent = {};
    },

    getRowClass : function(record, rowIndex, p, ds){
        p.cols = p.cols-1;
        var content = this.bodyContent[record.id];
        if(!content && !this.lazyRender){
            content = this.getBodyContent(record, rowIndex);
        }
        if(content){
            p.body = content;
        }
        return this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
    },

    init : function(grid){
        this.grid = grid;

        var view = grid.getView();
        view.getRowClass = this.getRowClass.createDelegate(this);

        view.enableRowBody = true;

        grid.on('render', this.onRender, this);
        grid.on('destroy', this.onDestroy, this);
    },

    // @private
    onRender: function() {
        var grid = this.grid;
        var mainBody = grid.getView().mainBody;
        mainBody.on('mousedown', this.onMouseDown, this, {delegate: '.x-grid3-row-expander'});
        if (this.expandOnEnter) {
            this.keyNav = new Ext.KeyNav(this.grid.getGridEl(), {
                'enter' : this.onEnter,
                scope: this
            });
        }
        if (this.expandOnDblClick) {
            grid.on('rowdblclick', this.onRowDblClick, this);
        }
    },
    
    // @private    
    onDestroy: function() {
        if(this.keyNav){
            this.keyNav.disable();
            delete this.keyNav;
        }
        var mainBody = this.grid.getView().mainBody;
        if(mainBody){
            mainBody.un('mousedown', this.onMouseDown, this);
        }
    },
    // @private
    onRowDblClick: function(grid, rowIdx, e) {
        this.toggleRow(rowIdx);
    },

    onEnter: function(e) {
        var g = this.grid;
        var sm = g.getSelectionModel();
        var sels = sm.getSelections();
        for (var i = 0, len = sels.length; i < len; i++) {
            var rowIdx = g.getStore().indexOf(sels[i]);
            this.toggleRow(rowIdx);
        }
    },

    getBodyContent : function(record, index){
        if(!this.enableCaching){
            return this.tpl.apply(record.data);
        }
        var content = this.bodyContent[record.id];
        if(!content){
            content = this.tpl.apply(record.data);
            this.bodyContent[record.id] = content;
        }
        return content;
    },

    onMouseDown : function(e, t){
        e.stopEvent();
        var row = e.getTarget('.x-grid3-row');
        this.toggleRow(row);
    },

    renderer : function(v, p, record){
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>';
    },

    beforeExpand : function(record, body, rowIndex){
        if(this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false){
            if(this.tpl && this.lazyRender){
                body.innerHTML = this.getBodyContent(record, rowIndex);
            }
            return true;
        }else{
            return false;
        }
    },

    toggleRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
    },

    expandRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if(this.beforeExpand(record, body, row.rowIndex)){
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex);
        }
    },

    collapseRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
        if(this.fireEvent('beforecollapse', this, record, body, row.rowIndex) !== false){
            this.state[record.id] = false;
            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
            this.fireEvent('collapse', this, record, body, row.rowIndex);
        }
    }
});