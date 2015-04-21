/**
 * ext-fixed.js 修复ext内部bug
 */

/** Ext.Container items 不能删除 **/
Ext.override(Ext.Container, {

    initComponent: function(){

        Ext.Container.superclass.initComponent.call(this);

        this.addEvents(
            
            'afterlayout',
            
            'beforeadd',
            
            'beforeremove',
            
            'add',
            
            'remove'
        );
        
        var items = this.items;
        if(items){
            delete this.items;
            this.items = null;
            this.add(items);
        }

    }

});

/**  布局修正bug  **/

Ext.override(Ext.layout.BorderLayout.Region, {
	
	onCollapse : function(animate){
        this.panel.el.setStyle('z-index', 1);
        if(this.lastAnim === false || this.panel.animCollapse === false){
            this.getCollapsedEl().dom.style.visibility = 'visible';
        }else{
            this.getCollapsedEl().slideIn(this.panel.slideAnchor, {duration:.2});
        }
        if (!this.collapsedTitleEl) {
        	
        	this.collapsedTitleEl = this.getCollapsedEl().createChild({
	        	tag: 'span',
	        	cls: (this.iconCls || '') + ' x-panel-collapsed-text',
	        	style : (this.iconCls ? 'padding-left: 16px' : ''),
	        	html: this.collapsedTitle || this.title
        	});
        	
        	this.setTitle = Ext.Panel.prototype.setTitle.createSequence(function(t){
        		this.collapsedTitleEl.dom.innerHTML = t;
        	}, this);
        	
        }
        this.state.collapsed = true;
        this.panel.saveState();
    }

});

Ext.override(Ext.layout.VBoxLayout, {
    onLayout : function(ct, target){
        Ext.layout.VBoxLayout.superclass.onLayout.call(this, ct, target);
        var cs = this.getVisibleItems(ct), cm, ch, margin,
            size = this.getLayoutTargetSize(target),
            w = size.width - target.getPadding('lr'),
            h = size.height - target.getPadding('tb') - this.scrollOffset,
            l = this.padding.left, t = this.padding.top,
            isStart = this.pack == 'start',
            isRestore = ['stretch', 'stretchmax'].indexOf(this.align) == -1,
            stretchWidth = w - (this.padding.left + this.padding.right),
            extraHeight = 0,
            maxWidth = 0,
            totalFlex = 0,
            flexHeight = 0,
            usedHeight = 0;
        Ext.each(cs, function(c){
            cm = c.margins;
            totalFlex += c.flex || 0;
            ch = c.getHeight();
            margin = cm.top + cm.bottom;
            extraHeight += ch + margin;
            flexHeight += margin + (c.flex ? 0 : ch);
            maxWidth = Math.max(maxWidth, c.getWidth() + cm.left + cm.right);
        });
        extraHeight = h - extraHeight - this.padding.top - this.padding.bottom;
        var th = flexHeight + this.padding.top + this.padding.bottom;
        if(h < th){
            h = th;
            w -= this.scrollOffset;
            stretchWidth -= this.scrollOffset;
        }
        var innerCtWidth = maxWidth + this.padding.left + this.padding.right;
        switch(this.align){
            case 'stretch':
                this.innerCt.setSize(w, h);
                break;
            case 'stretchmax':
            case 'left':
                this.innerCt.setSize(innerCtWidth, h);
                break;
            case 'center':
                this.innerCt.setSize(w = Math.max(w, innerCtWidth), h);
                break;
        }
        var availHeight = Math.max(0, h - this.padding.top - this.padding.bottom - flexHeight),
            leftOver = availHeight,
            heights = [],
            restore = [],
            idx = 0,
            availableWidth = Math.max(0, w - this.padding.left - this.padding.right);
        Ext.each(cs, function(c){
            if(isStart && c.flex){
                ch = Math.floor(availHeight * (c.flex / totalFlex));
                leftOver -= ch;
                heights.push(ch);
            }
        });
        if(this.pack == 'center'){
            t += extraHeight ? extraHeight / 2 : 0;
        }else if(this.pack == 'end'){
            t += extraHeight;
        }
        Ext.each(cs, function(c){
            cm = c.margins;
            t += cm.top;
            c.setPosition(l + cm.left, t);
            if(isStart && c.flex){
                ch = Math.max(0, heights[idx++] + (leftOver-- > 0 ? 1 : 0));
                if(isRestore){
                    restore.push(c.getWidth());
                }
                c.setSize(availableWidth, ch);
            }else{
                ch = c.getHeight();
            }
            t += ch + cm.bottom;
        });
        idx = 0;
        Ext.each(cs, function(c){
            cm = c.margins;
            if(this.align == 'stretch'){
                c.setWidth((stretchWidth - (cm.left + cm.right)).constrain(
                    c.minWidth || 0, c.maxWidth || 1000000));
            }else if(this.align == 'stretchmax'){
                c.setWidth((maxWidth - (cm.left + cm.right)).constrain(
                    c.minWidth || 0, c.maxWidth || 1000000));
            }else{
                if(this.align == 'center'){
                    var diff = availableWidth - (c.getWidth() + cm.left + cm.right);
                    if(diff > 0){
                        c.setPosition(l + cm.left + (diff/2), c.y);
                    }
                }
                if(isStart && c.flex){
                    c.setWidth(restore[idx++]);
                }
            }
        }, this);
    }
});

Ext.override(Ext.layout.HBoxLayout, {
    onLayout : function(ct, target){
        Ext.layout.HBoxLayout.superclass.onLayout.call(this, ct, target);
        var cs = this.getVisibleItems(ct), cm, cw, margin,
            size = this.getLayoutTargetSize(target),
            w = size.width - target.getPadding('lr') - this.scrollOffset,
            h = size.height - target.getPadding('tb'),
            l = this.padding.left, t = this.padding.top,
            isStart = this.pack == 'start',
            isRestore = ['stretch', 'stretchmax'].indexOf(this.align) == -1,
            stretchHeight = h - (this.padding.top + this.padding.bottom),
            extraWidth = 0,
            maxHeight = 0,
            totalFlex = 0,
            flexWidth = 0,
            usedWidth = 0;
        Ext.each(cs, function(c){
            cm = c.margins;
            totalFlex += c.flex || 0;
            cw = c.getWidth();
            margin = cm.left + cm.right;
            extraWidth += cw + margin;
            flexWidth += margin + (c.flex ? 0 : cw);
            maxHeight = Math.max(maxHeight, c.getHeight() + cm.top + cm.bottom);
        });
        extraWidth = w - extraWidth - this.padding.left - this.padding.right;
        var tw = flexWidth + this.padding.left + this.padding.right;
        if(w < tw){
            w = tw;
            h -= this.scrollOffset;
            stretchHeight -= this.scrollOffset;
        }
        var innerCtHeight = maxHeight + this.padding.top + this.padding.bottom;
        switch(this.align){
            case 'stretch':
                this.innerCt.setSize(w, h);
                break;
            case 'stretchmax':
            case 'top':
                this.innerCt.setSize(w, innerCtHeight);
                break;
            case 'middle':
                this.innerCt.setSize(w, h = Math.max(h, innerCtHeight));
                break;
        }
        var availWidth = Math.max(0, w - this.padding.left - this.padding.right - flexWidth),
            leftOver = availWidth,
            widths = [],
            restore = [],
            idx = 0,
            availableHeight = Math.max(0, h - this.padding.top - this.padding.bottom);
        Ext.each(cs, function(c){
            if(isStart && c.flex){
                cw = Math.floor(availWidth * (c.flex / totalFlex));
                leftOver -= cw;
                widths.push(cw);
            }
        });
        if(this.pack == 'center'){
            l += extraWidth ? extraWidth / 2 : 0;
        }else if(this.pack == 'end'){
            l += extraWidth;
        }
        Ext.each(cs, function(c){
            cm = c.margins;
            l += cm.left;
            c.setPosition(l, t + cm.top);
            if(isStart && c.flex){
                cw = Math.max(0, widths[idx++] + (leftOver-- > 0 ? 1 : 0));
                if(isRestore){
                    restore.push(c.getHeight());
                }
                c.setSize(cw, availableHeight);
            }else{
                cw = c.getWidth();
            }
            l += cw + cm.right;
        });
        idx = 0;
        Ext.each(cs, function(c){
            var cm = c.margins;
            if(this.align == 'stretch'){
                c.setHeight((stretchHeight - (cm.top + cm.bottom)).constrain(
                    c.minHeight || 0, c.maxHeight || 1000000));
            }else if(this.align == 'stretchmax'){
                c.setHeight((maxHeight - (cm.top + cm.bottom)).constrain(
                    c.minHeight || 0, c.maxHeight || 1000000));
            }else{
                if(this.align == 'middle'){
                    var diff = availableHeight - (c.getHeight() + cm.top + cm.bottom);
                    if(diff > 0){
                        c.setPosition(c.x, t + cm.top + (diff/2));
                    }
                }
                if(isStart && c.flex){
                    c.setHeight(restore[idx++]);
                }
            }
        }, this);
    }
});

/**
 * 由于javascript对数值不能精度转换，所以format和numberfield里都改为了字符串处理
 */
Ext.util.Format.number = function(v, format) {
	if (Ext.isEmpty(v) || isNaN(v)) {
		return '';
	}
	if (!format) {
		return v;
	}
	var comma = ',', dec = '.', i18n = false, neg = v < 0;
	if (format.substr(format.length - 2) == '/i') {
		format = format.substr(0, format.length - 2);
		i18n = true;
		comma = '.';
		dec = ',';
	}
	if (Ext.isNumber(v))
		v = v.toString();
	var precision = v.indexOf('.');
	precision = precision == -1 ? v.length : (precision + 1);
	var decimal = format.indexOf(dec), decPad;
	if (decimal > -1) {
		decPad = format.substring(decimal + 1, format.length);
	}
	var hasComma = format.indexOf(comma) != -1, psplit = (i18n ? format
			.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, ''))
			.split(dec);
	if (1 < psplit.length) {
		v = v.substring(0, precision + psplit[1].length);
	} else if (2 < psplit.length) {
		throw ('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
	} else {
		v = v.substring(0, precision);
	}
	var fnum = v;
	if (neg)
		fnum = fnum.substring(1, fnum.length);
	psplit = fnum.split('.');
	if (hasComma) {
		var cnum = psplit[0], parr = [], j = cnum.length, m = Math.floor(j / 3), n = cnum.length % 3 || 3, i;
		for (i = 0; i < j; i += n) {
			if (i != 0) {
				n = 3;
			}
			parr[parr.length] = cnum.substr(i, n);
			m -= 1;
		}
		fnum = parr.join(comma);
		if (psplit[1]) {
			fnum += dec + psplit[1];
		}
	} else {
		if (psplit[1]) {
			fnum = psplit[0] + dec + psplit[1];
		}
	}
	if (decPad) {
		if (psplit[1] && psplit[1].length !== decPad.length) {
			fnum += decPad.substring(0, decPad.length - psplit[1].length);
		} else if (!psplit[1]) {
			fnum += dec + decPad;
		}
	}
	if (fnum.indexOf('.') == 0) {
		fnum = String.leftPad(fnum, fnum.length + 1, '0');
	}
	return (neg ? '-' : '') + format.replace(/[\d,?\.?]+/, fnum);
};

/**
 * 修正NumberField因为数值过长显示的精度问题
 */
Ext.override(Ext.form.NumberField, {
	
	fixPrecision : function(value) {
		var nan = isNaN(value);
		if (!this.allowDecimals || this.decimalPrecision == -1 || nan || !value) {
			return nan ? '' : value;
		}
		value = value.toString();
		var decimalSeparatorIndex = value.indexOf(this.decimalSeparator);
		if (decimalSeparatorIndex > -1) {
			var decimalPrecision = value.substring(decimalSeparatorIndex + 1, value.length);
			value = value.substring(0, decimalSeparatorIndex);
			if (this.decimalPrecision == 0) {
				return value;
			}
			if (decimalPrecision.length > this.decimalPrecision) {
				decimalPrecision = decimalPrecision.substring(0, this.decimalPrecision);
			}
			return value +'.'+ decimalPrecision;
		}
		return value;
	},
	onFocus : function() {
		var v = this.getRawValue();
		this.el.dom.value = v;
	},
	getValue : function() {
		var v = Ext.form.NumberField.superclass.getValue.call(this);
		if (this.format) {
			v = v.replace(/\,/g, '');
		}
		return this.fixPrecision(this.parseValue(v));
	},
	getRawValue : function() {
		var value = Ext.form.NumberField.superclass.getRawValue.call(this);
		if (this.format)
			value = value.replace(/\,/g, '');
		return value;
	},
	parseValue : function(value) {
		value = String(value).replace(this.decimalSeparator, ".");
		return isNaN(value) ? '' : value;
	},
	beforeBlur : function() {
		var v = this.parseValue(this.getRawValue());
		if (!Ext.isEmpty(v)) {
			this.setValue(v);
		}
	},
	getErrors: function(value) {
        var errors = Ext.form.NumberField.superclass.getErrors.apply(this, arguments);
        
        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
        
        if (value.length < 1) { 
             return errors;
        }
        
        value = String(value).replace(this.decimalSeparator, ".");
        
        if(isNaN(value)){
            errors.push(String.format(this.nanText, value));
        }
        
        var decimalSeparatorIndex = value.indexOf(this.decimalSeparator);
		if (decimalSeparatorIndex > -1) {
			var decimalPrecision = value.substring(decimalSeparatorIndex + 1, value.length);
			if (decimalPrecision.length > this.decimalPrecision) {
				errors.push(String.format(this.decimalPrecisionText, this.decimalPrecision));
			}
		}
        
        var num = this.parseValue(value);
        
        try {
	        if (Ext.isString(num)) {
	        	//num = parseFloat(num);
	        	num = new BigDecimal(num);
	        } else {
	        	num = new BigDecimal(String(num));
	        }

	        if (this.minValue && this.minValue != Number.NEGATIVE_INFINITY) {
	        	this.minValue = new BigDecimal(String(this.minValue));
	        	
	        	if (num.compareTo(this.minValue) == -1) {
	                errors.push(String.format(this.minText, this.minValue));
	            }
	        	
	        }

	        if (this.maxValue && this.maxValue != Number.MAX_VALUE){
	        	this.maxValue = new BigDecimal(String(this.maxValue));
	        	
	        	if (num.compareTo(this.maxValue) == 1) {
	                errors.push(String.format(this.maxText, this.maxValue));
	            }
			}
        } catch(e) {
        	errors.push(String.format(this.nanText, num));
        }
        
        return errors;
    }
});
/**
 * 修正Checkbox设置只读属性，仍可触发选择
 */
Ext.override(Ext.form.Checkbox, {
	onClick : function(e){
		if (this.readOnly || this.disabled) {
			e.stopEvent();
			return;
		}
        if(this.el.dom.checked != this.checked){
            this.setValue(this.el.dom.checked);
        }
    }
})