var timerDiv;

var print = function(str) {
	return;
	if (!timerDiv) {
		timerDiv = new Ext.Window({
			height: 400,
			width: 300,
			buttons: [{
				text: 'clear',
				handler: function(){
					timerDiv.body.dom.innerHTML = '';
				}
			}]
		}).show();
	}
	var n = new Date();
	var str = str+":"+n.getSeconds()+":"+n.getMilliseconds();
	str = str.replace(/\s|\t/ig,'&nbsp;&nbsp;&nbsp;&nbsp;')
	if (Ext.isIE) {
		timerDiv.body.dom.innerHTML += str+'<br/>'
	} else {
		timerDiv.body.dom.innerHTML += str+'<br/>'
	}
}
Ext.tree.LockingView = Ext.extend(Ext.tree.View, {

    rowHeight: 21,

    borderHeight: 2,

    lockText : 'Lock',

    unlockText : 'Unlock',

    rowBorderWidth : 1,

    lockedBorderWidth : 1,

    syncHeights: false,
 
    initTemplates : function(){
        var ts = this.templates || {};

        if (!ts.masterTpl) {
            ts.masterTpl = new Ext.Template(
                '<div class="x-grid3" hidefocus="on">',
                    '<div class="x-grid3-locked">',
                        '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{lstyle}">{lockedHeader}</div></div><div class="x-clear"></div></div>',
                        '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{lstyle}">{lockedBody}</div><div class="x-grid3-scroll-spacer"></div></div>',
                    '</div>',
                    '<div class="x-grid3-viewport x-grid3-unlocked">',
                        '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>',
                        '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
                    '</div>',
                    '<div class="x-grid3-resize-marker">&#160;</div>',
                    '<div class="x-grid3-resize-proxy">&#160;</div>',
                '</div>'
            );
        }

        this.templates = ts;

        Ext.tree.LockingView.superclass.initTemplates.call(this);
    },

    getEditorParent : function(ed){
        return this.el.dom;
    },

    initElements : function(){
        var el             = Ext.get(this.grid.getGridEl().dom.firstChild),
            lockedWrap     = el.child('div.x-grid3-locked'),
            lockedHd       = lockedWrap.child('div.x-grid3-header'),
            lockedScroller = lockedWrap.child('div.x-grid3-scroller'),
            mainWrap       = el.child('div.x-grid3-viewport'),
            mainHd         = mainWrap.child('div.x-grid3-header'),
            scroller       = mainWrap.child('div.x-grid3-scroller'),
        	mainBody 	   = scroller.child('div.x-grid3-body'),
            innerCt		   = mainBody;
            
        if (this.grid.hideHeaders) {
            lockedHd.setDisplayed(false);
            mainHd.setDisplayed(false);
        }
        
        if(this.forceFit){
            scroller.setStyle('overflow-x', 'hidden');
        }
        
        Ext.apply(this, {
            el      : el,
            mainWrap: mainWrap,
            mainHd  : mainHd,
            innerHd : mainHd.dom.firstChild,
            scroller: scroller,
            innerCt: innerCt,
            mainBody: scroller.child('div.x-grid3-body'),
            focusEl : scroller.child('a'),
            resizeMarker: el.child('div.x-grid3-resize-marker'),
            resizeProxy : el.child('div.x-grid3-resize-proxy'),
            lockedWrap: lockedWrap,
            lockedHd: lockedHd,
            lockedScroller: lockedScroller,
            lockedBody: lockedScroller.child('div.x-grid3-body'),
            lockedInnerHd: lockedHd.child('div.x-grid3-header-inner', true)
        });
        
        this.focusEl.swallowEvent('click', true);
    },
    
    getNodeLockedRow: function(node){
    	if (!node) return;
    	if (node.isRoot && !this.grid.rootVisible) {
    		return this.lockedBody.dom;
    	}
    	var arr = this.lockedBody.query('div.x-tree-node-'+ node.id);
    	if (arr && arr.length > 0) {
    		return arr[0];
    	}
    	return;
    },

    getLockedRows : function(){
        return this.hasRows() ? this.lockedBody.query(this.rowSelector) : [];
    },

    getLockedRow : function(row){
        return this.getLockedRows()[row];
    },

    onSelect: function(node) {
    	Ext.tree.LockingView.superclass.onSelect.call(this, node);
    	if (node && node.isVisible()) {
    		var row = this.getNodeRow(node);
    		var lrow = this.getNodeLockedRow(node);
    		if (row) {
    			Ext.fly(row).addClass(this.selectedClass);
    		}
    		if (lrow) {
        		Ext.fly(lrow).addClass(this.selectedClass);
        	}
    	}
        return node;
    },

    onDeselect: function(node) {
    	Ext.tree.LockingView.superclass.onDeselect.call(this, node);
    	if (node && node.isVisible()) {
    		var row = this.getNodeRow(node);
    		var lrow = this.getNodeLockedRow(node);
    		if (row) {
    			Ext.fly(row).removeClass(this.selectedClass);
    		}
    		if (lrow) {
        		Ext.fly(lrow).removeClass(this.selectedClass);
        	}
    	}
    	return node;
    },
    // ****************************** //

    getCell : function(row, col){
        var lockedLen = this.cm.getLockedCount();
        if(col < lockedLen){
        	if (Ext.isNumber(row)) {
        		return this.getLockedRow(row).getElementsByTagName('td')[col];
            }
            return row.getElementsByTagName('td')[col];
        }
        return Ext.tree.LockingView.superclass.getCell.call(this, row, col - lockedLen);
    },

    getHeaderCell: function(index){
        var lockedLen = this.cm.getLockedCount();
        if(index < lockedLen){
            return this.lockedHd.dom.getElementsByTagName('td')[index];
        }
        return Ext.tree.LockingView.superclass.getHeaderCell.call(this, index - lockedLen);
    },

    addRowClass: function(row, cls){
        var lockedRow = this.getLockedRow(row);
        if(lockedRow){
            this.fly(lockedRow).addClass(cls);
        }
        Ext.tree.LockingView.superclass.addRowClass.call(this, row, cls);
    },

    removeRowClass: function(row, cls){
        var lockedRow = this.getLockedRow(row);
        if(lockedRow){
            this.fly(lockedRow).removeClass(cls);
        }
        Ext.tree.LockingView.superclass.removeRowClass.call(this, row, cls);
    },

    removeRow: function(row) {
        Ext.removeNode(this.getLockedRow(row));
        Ext.tree.LockingView.superclass.removeRow.call(this, row);
    },

    removeRows: function(firstRow, lastRow){
        var lockedBody = this.lockedBody.dom,
            rowIndex = firstRow;
        for(; rowIndex <= lastRow; rowIndex++){
            Ext.removeNode(lockedBody.childNodes[firstRow]);
        }
        Ext.tree.LockingView.superclass.removeRows.call(this, firstRow, lastRow);
    },

    syncScroll : function(e){
        this.lockedScroller.dom.scrollTop = this.scroller.dom.scrollTop;
        Ext.tree.LockingView.superclass.syncScroll.call(this, e);
    },

    updateSortIcon : function(col, dir){
        var sortClasses = this.sortClasses,
            lockedHeaders = this.lockedHd.select('td');//.removeClass(sortClasses),
            headers = this.mainHd.select('td');//.removeClass(sortClasses),
            lockedLen = this.cm.getLockedCount(),
            cls = sortClasses[dir == 'DESC' ? 1 : 0];
            
        if(col < lockedLen){
            lockedHeaders.item(col).addClass(cls);
        }else{
            headers.item(col - lockedLen).addClass(cls);
        }
    },

    updateAllColumnWidths : function(){
        var tw = this.getTotalWidth(),
            clen = this.cm.getColumnCount(),
            lw = this.getLockedWidth(),
            llen = this.cm.getLockedCount(),
            ws = [], len, i;
        this.updateLockedWidth();
        for(i = 0; i < clen; i++){
            ws[i] = this.getColumnWidth(i);
            var hd = this.getHeaderCell(i);
            hd.style.width = ws[i];
        }
        var lns = this.getLockedRows(), ns = this.getRows(), row, trow, j;
        for(i = 0, len = ns.length; i < len; i++){
            row = lns[i];
            row.style.width = lw;
            if(row.firstChild){
                row.firstChild.style.width = lw;
                trow = row.firstChild.rows[0];
                for (j = 0; j < llen; j++) {
                   trow.childNodes[j].style.width = ws[j];
                }
            }
            row = ns[i];
            row.style.width = tw;
            if(row.firstChild){
                row.firstChild.style.width = tw;
                trow = row.firstChild.rows[0];
                for (j = llen; j < clen; j++) {
                   trow.childNodes[j - llen].style.width = ws[j];
                }
            }
        }
        this.onAllColumnWidthsUpdated(ws, tw);
        this.syncHeaderHeight();
    },

    updateColumnWidth : function(col, width){
        var w = this.getColumnWidth(col),
            llen = this.cm.getLockedCount(),
            ns, rw, c, row;
        this.updateLockedWidth();
        if(col < llen){
            ns = this.getLockedRows();
            rw = this.getLockedWidth();
            c = col;
        }else{
            ns = this.getRows();
            rw = this.getTotalWidth();
            c = col - llen;
        }
        var hd = this.getHeaderCell(col);
        hd.style.width = w;
        for(var i = 0, len = ns.length; i < len; i++){
            row = ns[i];
            row.style.width = rw;
            if(row.firstChild){
                row.firstChild.style.width = rw;
                row.firstChild.rows[0].childNodes[c].style.width = w;
            }
        }
        this.onColumnWidthUpdated(col, w, this.getTotalWidth());
        this.syncHeaderHeight();
    },

	updateColumnHidden : function(col, hidden){
        var llen = this.cm.getLockedCount(),
            ns, rw, c, row,
            display = hidden ? 'none' : '';
        this.updateLockedWidth();
        if(col < llen){
            ns = this.getLockedRows();
            rw = this.getLockedWidth();
            c = col;
        }else{
            ns = this.getRows();
            rw = this.getTotalWidth();
            c = col - llen;
        }
        var hd = this.getHeaderCell(col);
        hd.style.display = display;
        for(var i = 0, len = ns.length; i < len; i++){
            row = ns[i];
            row.style.width = rw;
            if(row.firstChild){
                row.firstChild.style.width = rw;
                row.firstChild.rows[0].childNodes[c].style.display = display;
            }
        }
        this.onColumnHiddenUpdated(col, hidden, this.getTotalWidth());
        delete this.lastViewWidth;
        this.layout();
    },
    
	expandNode: function(node, deep, anim, callback, scope){
		
    	var me = this,
        	sm = me.grid.selModel,
        	bd = me.renderChildren(node, deep),
        	targetNode = me.getNodeRow(node),
        	ltargetNode = me.getNodeLockedRow(node);

    	node.expanded = true;
        
        var select = function(){
    		
        	if (node.selected 
        			&& node.hasChildNodes() 
        			&& me.grid.isCascadeSelect()) {

                Ext.each(node.childNodes, function(child){
                    sm.select(child, true);
                }, sm);

            }
        	
        	if (callback) callback.call(scope || this);
    		
    	};

        //if (deep == true) {
        if ((anim !== undefined ? anim : me.grid.animate)) {
        	me.locked = true;
        	me.animExpand(bd, targetNode, ltargetNode, select);
        } else {
        	me.expand(bd, targetNode, ltargetNode, select);
        }
        //}

        if (node.isVisible()){
        	me.updateNodeUI(node, targetNode, ltargetNode);
        }
        
        if (node.selected) {
        	this.onSelect(node);
        }
        
        node.fireEvent('expand', node);
    },

    collapseNode: function(node){

        node.expanded = false;
        
        this.removeChildren(node);
        
        this.updateNodeUI(node);
        
        node.fireEvent('collapse', node);
    },
    
    showNode: function(node){
    	
    	var ctNode = this.getNodeRow(node);
    	
    	var lctNode = this.getNodeLockedRow(node);

    	if (ctNode) {
    		Ext.fly(ctNode).setVisible(true);
    	}
    	if (lctNode) {
    		Ext.fly(lctNode).setVisible(true);
    	}
    },
    
    hideNode: function(node){
    	
    	var ctNode = this.getNodeRow(node);
    	
    	var lctNode = this.getNodeLockedRow(node);
    	
    	if (ctNode) {
    		Ext.fly(ctNode).setVisibilityMode(Ext.Element.DISPLAY).setVisible(false);
    	}
    	if (lctNode) {
    		Ext.fly(lctNode).setVisibilityMode(Ext.Element.DISPLAY).setVisible(false);
    	}
    },
    
    renderChildren: function(node, deep){

        if (node && node.hasChildNodes()) {

           var me = this,
               cs = me.getColumnData(),
               ds = me.grid.getStore(),
               sm = me.grid.selModel,
               colModel = me.grid.colModel,
               colCount = colModel.getColumnCount(),
               totalWidth = me.getTotalWidth(),
               lockedWidth = me.getLockedWidth();

           return me.doRender(cs, [].concat(node.childNodes), ds, colCount, totalWidth, lockedWidth, deep);
        }
        
        return ['',''];
        
    },

	//private
	expand: function(bd, targetNode, ltargetNode, callback){

		if (targetNode == this.mainBody.dom || targetNode == this.lockedBody.dom) {
	    	
			this.mainBody.update('');
	    	
			this.lockedBody.update('');

	        Ext.DomHelper.insertHtml("beforeEnd", targetNode, bd[0]);

	    	Ext.DomHelper.insertHtml("beforeEnd", ltargetNode, bd[1]);
	    	
		} else {

	        Ext.DomHelper.insertHtml("afterEnd", targetNode, bd[0]);

	    	Ext.DomHelper.insertHtml("afterEnd", ltargetNode, bd[1]);
	    	
		}

		if (callback) callback();
	},
	
	//private
	animExpand: function(bd, targetNode, ltargetNode, callback){

		var me = this,
		
			ltmpEl = Ext.get(ltargetNode),

        	lwrapEl = ltmpEl.insertSibling('<table cellspacing="0"><tr><td>'+ bd[1]+'</td></tr></table>', 'after'),
        	
        	lrows = lwrapEl.query(me.rowSelector),

        	tmpEl = Ext.get(targetNode),

        	wrapEl = tmpEl.insertSibling('<table cellspacing="0"><tr><td>'+ bd[0] +'</td></tr></table>', 'after');
			
			rows = wrapEl.query(me.rowSelector);
	
			if (callback) callback();

			lwrapEl.setHeight(0);
						
			lwrapEl.slideIn('t', {

                callback: function() {
                	me.locked = false;
                	
                	var t = Ext.fly(ltargetNode);
                	
                	if (t) {
                        t.insertSibling(lrows, 'after');
                	}

                    lwrapEl.remove();
                }

            });

            wrapEl.setHeight(0);

            wrapEl.slideIn('t', {

                callback: function() {
                	
                	me.locked = false;
                	
                	var t = Ext.fly(targetNode);
                	
                	if (t) {
                    	t.insertSibling(rows, 'after');
                	}

                    wrapEl.remove();
                }

            });
	},
	
	renderNode: function(node, parentNode){

    	var me = this,
	    	sm = me.grid.selModel,
	    	
            cs = me.getColumnData(),
            ds = me.grid.getStore(),
            colModel = me.grid.colModel,
            colCount = colModel.getColumnCount(),
            totalWidth = me.getTotalWidth();
    	
    	var targetNode = me.getNodeRow(node);
    	
    	var ltargetNode = me.getNodeLockedRow(node);

    	var bd = me.doRender(cs, [].concat(node), ds, colCount, totalWidth, true);
    	
    	Ext.DomHelper.insertHtml("afterEnd", ltargetNode, bd[1]);

        Ext.DomHelper.insertHtml("afterEnd", targetNode, bd[0]);
			
    	if (parentNode.selected 
    			&& parentNode.hasChildNodes() 
    			&& me.grid.isCascadeSelect()) {

            Ext.each(parentNode.childNodes, function(child){
                sm.select(child, true);
            }, sm);

        }

    },
    
    removeChildren: function(node){

        this.removeNode(node, 1);

    },

    removeNode: function(node, startIndex){

        var path = node.getPath(),
        	ds  = this.grid.getStore(),
        	sm = this.grid.selModel;

        var arr = this.lockedBody.query('div[@tree-node-path^='+ path +']');

        if (arr && arr.length > 0) {

            for (var i = (startIndex ? startIndex : 0), len = arr.length; i < len; i++) {
            	
                var id = Ext.fly(arr[i]).getAttributeNS('ext', 'tree-node-id');
                
                Ext.removeNode(arr[i]);
                
            }

        }

        arr = this.mainBody.query('div[@tree-node-path^='+ path +']');

        if (arr && arr.length > 0) {

            for (var i = (startIndex ? startIndex : 0), len = arr.length; i < len; i++) {
            	
                var id = Ext.fly(arr[i]).getAttributeNS('ext', 'tree-node-id');
                
                Ext.removeNode(arr[i]);

                var n = this.grid.getNodeById(id);
                
                if (n) {

                    sm.selections.removeKey(n.id);

                    node.render(false);
                }
            }

        }

    },
    
    doRenderColumn: function(cs, node, ds, colCount, rowParams, deep) {

        var templates = this.templates,
            cellTemplate = templates.cell,
            nodeCellTpl = templates.nodeCellTpl,
            last = colCount - 1,
            html, lcb = [], cb = [],
            meta = {},  name, column,
            record = node.record,
            data = node.attributes;

       // print("    col-start")
        for (var i = 0; i < colCount; i++) {
            column = cs[i];
            meta.id    = column.id;
            meta.css   = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
            meta.attr  = meta.cellAttr = '';
            meta.style = column.style;
            if (column.renderer) {
                meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, i, ds);
            } else {
                meta.value = record.data[column.name];
            }

            if (Ext.isEmpty(meta.value)) {
                meta.value = '&#160;';
            }
            if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
                meta.css += ' x-grid3-dirty-cell';
            }
            if (column.isTreeNode) {
                rowParams.id = node.id;
                rowParams.path = node.getPath();
                
                var cls = this.getNodeClass(node, deep);
                
                rowParams.nodeCls = cls[0];
                meta.elbowCls = cls[1];
                
                meta.indentMarkup = this.getNodeIndent(node.parentNode ? node.parentNode : null);
                meta.icon = data['icon'] ? data['icon'] : Ext.BLANK_IMAGE_URL;
                meta.iconCls = data['iconCls'] ? ' '+ data['iconCls'] : '';
                meta.href = data['href'] ? data['href'] : '#';
                meta.hrefTarget = data['hrefTarget'] ? ' target="'+ data['hrefTarget'] +'"' : '';
                html = nodeCellTpl.apply(meta);
            } else {
            	html = cellTemplate.apply(meta);
            }
            // 加入对锁定列判断
            if (column.isTreeNode) {
            	if (column.locked) {
            		this.treeNodeLocked = true;
            	} else {
                    this.treeNodeLocked = false;
            	}
            }
            if (column.locked) {
                lcb[lcb.length] = html;
            } else {
                cb[cb.length] = html;
            }
        }
      //  print("    col-end")
        return [cb.join(''), lcb.join('')];
    },

    doRender: function(cs, nodes, ds, colCount, totalWidth, lockedWidth, deep){

        var buf = [], lbuf = [],

            templates = this.templates,
            rowTemplate = templates.row,
            rowParams = {},

            rh = this.getStyleRowHeight(),
            tstyle    = 'width:'+ totalWidth +';height:'+ rh +'px;',
            lstyle    = 'width:'+ lockedWidth +';height:'+ rh +'px;',
            j, node, alt,
            lcb = [], cb = [],
            bd;

        for (j = 0; j < nodes.length; j++) {

            node = nodes[j];
            
            if (node.hidden) continue;
            
            node.render(true);

            lcb = []; 
            cb = [];

            bd = this.doRenderColumn(cs, node, ds, colCount, rowParams, deep);

            cb[cb.length] = bd[0];
            lcb[lcb.length] = bd[1];

            alt = [];

            if (node.record.dirty) {
                alt[0] = ' x-grid3-dirty-row';
            }

            if (this.getRowClass) {
                alt[1] = this.getRowClass(node.record, rowParams, store);
            }

            rowParams.alt = alt.join(' ');
            rowParams.cols = colCount;
            
            rowParams.tstyle = tstyle;
            rowParams.cells = cb.join('');
            buf[buf.length] = rowTemplate.apply(rowParams);

            rowParams.tstyle = lstyle; 
            rowParams.cells = lcb.join('');
            lbuf[lbuf.length] = rowTemplate.apply(rowParams);

            // 如果子节点也是展开的
            if ((node.expanded || deep) && node.hasChildNodes()) {

            	node.expanded = true;
            	
                bd = this.doRender(cs, node.childNodes, ds, colCount, totalWidth, lockedWidth, deep);

                buf[buf.length]  = bd[0];
                lbuf[lbuf.length]  = bd[1];

            }
        }

        return [buf.join(''), lbuf.join('')];
    },

    renderRows: function() {

        var grid     = this.grid,
            ds       = this.ds,
            cs       = this.getColumnData(),
            root     = grid.getRootNode(),
            deep     = grid.expandedAll,
            totalWidth = this.getTotalWidth(),
            lockedWidth = this.getLockedWidth(),
            colCount = grid.colModel.getColumnCount();
            
        if (ds.getCount() < 1) {
            return '';
        }
        
        if (this.grid.rootVisible) {
        	var nodes = root;
        } else {
        	root.expanded = true;
        	var nodes = root.childNodes;
        }

        return this.doRender(cs, nodes, ds, colCount, totalWidth, lockedWidth, deep);

    },
    
    refreshRow: function(record) {

    	if (!record || (record && !record.node)) {
            return;
        }
    	
        var store     = this.ds,
            colCount  = this.cm.getColumnCount(),
            rh = this.getStyleRowHeight(),
            cs   = this.getColumnData(),
            node = record.node,
            tstyle    = 'width:'+ this.getTotalWidth() +';height:'+ rh +'px;',
            lstyle    = 'width:'+ this.getLockedWidth() +';height:'+ rh +'px;',
            rowParams = {
        		cols: colCount
            },
            row, alt = [];

        if (record.dirty) {
            alt[0] = ' x-grid3-dirty-row';
        }

        if (this.getRowClass) {
            alt[1] = this.getRowClass(record, rowParams, store);
        }

        var bd = this.doRenderColumn(cs, node, store, colCount, rowParams);
        
        if (node) {
        	
        	var row = this.getNodeRow(node);
        	
        	this.fly(row).addClass(alt.join(' ')).setStyle(tstyle);
        	
        	rowParams.tstyle = tstyle;
        	
        	rowParams.cells = bd[0];
        	
            row.innerHTML = this.templates.rowInner.apply(rowParams);
            
        	var lrow = this.getNodeLockedRow(node);
            
        	this.fly(lrow).addClass(alt.join(' ')).setStyle(lstyle);

        	rowParams.tstyle = lstyle;
        	
        	rowParams.cells = bd[1];
        	
        	lrow.innerHTML = this.templates.rowInner.apply(rowParams);
            
        }
        
        this.fireEvent('rowupdated', this, node, record);
    },

    updateNodeUI: function(n, row, lrow){
        
    	if (!row) {
    		row = this.getNodeRow(n);
    	}
    	
    	if (this.treeNodeLocked) {
        	if (!lrow) {
        		lrow = this.getNodeLockedRow(n);
        	}
    		row = lrow;
    	}

        Ext.tree.LockingView.superclass.updateNodeUI.call(this, n, row);
        
    },

    processRows : function(rows, lrows){
    },

    getStyleRowHeight : function(){
        return Ext.isBorderBox ? (this.rowHeight + this.borderHeight) : this.rowHeight;
    },
    
    syncRowHeights: function(row1, row2){
        if(this.syncHeights){
            var el1 = Ext.get(row1),
                el2 = Ext.get(row2),
                h1 = el1.getHeight(),
                h2 = el2.getHeight();

            if(h1 > h2){
                el2.setHeight(h1);
            }else if(h2 > h1){
                el1.setHeight(h2);
            }
        }
    },

    afterRender : function(){
        if(!this.ds || !this.cm){
            return;
        }
        var bd = this.renderRows() || ['&#160;', '&#160;'];
        this.mainBody.dom.innerHTML = bd[0];
        this.lockedBody.dom.innerHTML = bd[1];
        this.processRows();
        if(this.deferEmptyText !== true){
            this.applyEmptyText();
        }
        this.grid.fireEvent('viewready', this.grid);
    },

    renderUI : function(){        
        var templates = this.templates,
            header = this.renderHeaders(),
            body = templates.body.apply({rows:'&#160;'});

        return templates.masterTpl.apply({
            body  : body,
            header: header[0],
            ostyle: 'width:' + this.getOffsetWidth() + ';',
            bstyle: 'width:' + this.getTotalWidth()  + ';',
            lstyle: 'width:'+this.getLockedWidth()+';',
            lockedBody: body,
            lockedHeader: header[1]
        });
    },
    
    afterRenderUI: function(){
    	
    	var g = this.grid;
    	
    	this.initElements();
    	
    	Ext.fly(this.innerHd).on('click', this.handleHdDown, this);
    	
        Ext.fly(this.lockedInnerHd).on('click', this.handleHdDown, this);
        
        this.scroller.on('scroll', this.syncScroll,  this);
        
    	if(g.enableColumnResize !== false){
            this.splitZone = new Ext.grid.GridView.SplitDragZone(g, this.mainHd.dom);
            this.splitZone.setOuterHandleElId(Ext.id(this.lockedHd.dom));
            this.splitZone.setOuterHandleElId(Ext.id(this.mainHd.dom));
        }
    	
        if(g.enableColumnMove){
            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
            this.columnDrag.setOuterHandleElId(Ext.id(this.lockedInnerHd));
            this.columnDrag.setOuterHandleElId(Ext.id(this.innerHd));
            this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
        }
        
        if(g.enableHdMenu !== false){
            this.hmenu = new Ext.menu.Menu({id: g.id + '-hctx'});
            this.hmenu.add(
                {itemId: 'asc', text: this.sortAscText, cls: 'xg-hmenu-sort-asc'},
                {itemId: 'desc', text: this.sortDescText, cls: 'xg-hmenu-sort-desc'}
            );
            if(this.grid.enableColLock !== false){
                this.hmenu.add('-',
                    {itemId: 'lock', text: this.lockText, cls: 'xg-hmenu-lock'},
                    {itemId: 'unlock', text: this.unlockText, cls: 'xg-hmenu-unlock'}
                );
            }
            if(g.enableColumnHide !== false){
                /*this.colMenu = new Ext.menu.Menu({id:g.id + '-hcols-menu'});
                this.colMenu.on({
                    scope: this,
                    beforeshow: this.beforeColMenuShow,
                    itemclick: this.handleHdMenuClick
                });*/
                this.hmenu.add('-', {
                    itemId:'columns',
                    hideOnClick: false,
                    text: this.columnsText,
                    menu: this.colMenu,
                    iconCls: 'x-cols-icon'
                });
            }
            this.hmenu.on('itemclick', this.handleHdMenuClick, this);
        }
        
        this.mainHd.on({
            scope    : this,
            mouseover: this.handleHdOver,
            mouseout : this.handleHdOut,
            mousemove: this.handleHdMove
        });
        
        this.lockedHd.on({
            scope: this,
            mouseover: this.handleHdOver,
            mouseout: this.handleHdOut,
            mousemove: this.handleHdMove
        });
        
    	if(g.trackMouseOver){
    		
    		this.mainBody.on({
                scope: this,
                mouseover: this.onRowOver,
                mouseout: this.onRowOut
            });
    		
    		this.lockedBody.on({
                scope: this,
                mouseover: this.onRowOver,
                mouseout: this.onRowOut
            });
            
    	}
    	
    	if(g.enableDragDrop || g.enableDrag){
            this.dragZone = new Ext.grid.GridDragZone(g, {
                ddGroup : g.ddGroup || 'GridDD'
            });
        }
    	
        this.updateHeaderSortState();
    },

    layout : function(){
        if(!this.mainBody){
            return;
        }
        var g = this.grid;
        var c = g.getGridEl();
        var csize = c.getSize(true);
        var vw = csize.width;
        if(!g.hideHeaders && (vw < 20 || csize.height < 20)){
            return;
        }
        this.syncHeaderHeight();
        if(g.autoHeight){
            this.scroller.dom.style.overflow = 'visible';
            this.lockedScroller.dom.style.overflow = 'visible';
            if(Ext.isWebKit){
                this.scroller.dom.style.position = 'static';
                this.lockedScroller.dom.style.position = 'static';
            }
        }else{
            this.el.setSize(csize.width, csize.height);
            var hdHeight = this.mainHd.getHeight();
            var vh = csize.height - (hdHeight);
        }
        this.updateLockedWidth();
        if(this.forceFit){
            if(this.lastViewWidth != vw){
                this.fitColumns(false, false);
                this.lastViewWidth = vw;
            }
        }else {
            this.autoExpand();
            this.syncHeaderScroll();
        }
        this.onLayout(vw, vh);
    },

    getOffsetWidth : function() {
        return (this.cm.getTotalWidth() - this.cm.getTotalLockedWidth() + this.getScrollOffset()) + 'px';
    },

    renderHeaders : function(){
        var cm = this.cm,
            ts = this.templates,
            ct = ts.hcell,
            cb = [], lcb = [],
            p = {},
            len = cm.getColumnCount(),
            last = len - 1;
        for(var i = 0; i < len; i++){
            p.id = cm.getColumnId(i);
            p.value = cm.getColumnHeader(i) || '';
            p.style = this.getColumnStyle(i, true);
            p.tooltip = this.getColumnTooltip(i);
            p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) +
                (cm.config[i].headerCls ? ' ' + cm.config[i].headerCls : '');
            if(cm.config[i].align == 'right'){
                p.istyle = 'padding-right:16px';
            } else {
                delete p.istyle;
            }
            if(cm.isLocked(i)){
                lcb[lcb.length] = ct.apply(p);
            }else{
                cb[cb.length] = ct.apply(p);
            }
        }
        return [ts.header.apply({cells: cb.join(''), tstyle:'width:'+this.getTotalWidth()+';'}),
                ts.header.apply({cells: lcb.join(''), tstyle:'width:'+this.getLockedWidth()+';'})];
    },

    updateHeaders : function(){
        var hd = this.renderHeaders();
        this.innerHd.firstChild.innerHTML = hd[0];
        this.innerHd.firstChild.style.width = this.getOffsetWidth();
        this.innerHd.firstChild.firstChild.style.width = this.getTotalWidth();
        this.lockedInnerHd.firstChild.innerHTML = hd[1];
        var lw = this.getLockedWidth();
        this.lockedInnerHd.firstChild.style.width = lw;
        this.lockedInnerHd.firstChild.firstChild.style.width = lw;
    },

    getResolvedXY : function(resolved){
        if(!resolved){
            return null;
        }
        var c = resolved.cell, r = resolved.row;
        return c ? Ext.fly(c).getXY() : [this.scroller.getX(), Ext.fly(r).getY()];
    },

    syncFocusEl : function(row, col, hscroll){
        Ext.tree.LockingView.superclass.syncFocusEl.call(this, row, col, col < this.cm.getLockedCount() ? false : hscroll);
    },

    ensureVisible : function(row, col, hscroll){
        return Ext.tree.LockingView.superclass.ensureVisible.call(this, row, col, col < this.cm.getLockedCount() ? false : hscroll);
    },

    insertRows : function(dm, firstRow, lastRow, isUpdate){
        var last = dm.getCount() - 1;
        if(!isUpdate && firstRow === 0 && lastRow >= last){
            this.refresh();
        }else{
            if(!isUpdate){
                this.fireEvent('beforerowsinserted', this, firstRow, lastRow);
            }
            var html = this.renderRows(firstRow, lastRow),
                before = this.getRow(firstRow);
            if(before){
                if(firstRow === 0){
                    this.removeRowClass(0, this.firstRowCls);
                }
                Ext.DomHelper.insertHtml('beforeBegin', before, html[0]);
                before = this.getLockedRow(firstRow);
                Ext.DomHelper.insertHtml('beforeBegin', before, html[1]);
            }else{
                this.removeRowClass(last - 1, this.lastRowCls);
                Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html[0]);
                Ext.DomHelper.insertHtml('beforeEnd', this.lockedBody.dom, html[1]);
            }
            if(!isUpdate){
                this.fireEvent('rowsinserted', this, firstRow, lastRow);
                this.processRows();
            }else if(firstRow === 0 || firstRow >= last){
                this.addRowClass(firstRow, firstRow === 0 ? this.firstRowCls : this.lastRowCls);
            }
        }
        this.syncFocusEl(firstRow);
    },

    getColumnStyle : function(col, isHeader){
        var style = !isHeader ? this.cm.config[col].cellStyle || this.cm.config[col].css || '' : this.cm.config[col].headerStyle || '';
        style += 'width:'+this.getColumnWidth(col)+';';
        if(this.cm.isHidden(col)){
            style += 'display:none;';
        }
        var align = this.cm.config[col].align;
        // 修改header字体默认居中显示
        if (isHeader) {
            align = 'center';
        }
        if(align){
            style += 'text-align:'+align+';';
        }
        return style;
    },

    getLockedWidth : function() {
        return this.cm.getTotalLockedWidth() + 'px';
    },

    getTotalWidth : function() {
        return (this.cm.getTotalWidth() - this.cm.getTotalLockedWidth()) + 'px';
    },

    getColumnData : function(){
        var cs = [], cm = this.cm, colCount = cm.getColumnCount();
        for(var i = 0; i < colCount; i++){
            var name = cm.getDataIndex(i);
            cs[i] = {
                id : cm.getColumnId(i),
                name : (!Ext.isDefined(name) ? this.ds.fields.get(i).name : name),
                renderer : cm.getRenderer(i),
                scope : cm.getRendererScope(i),
                style : this.getColumnStyle(i),
                isTreeNode: cm.config[i].isTreeNode,
                locked : cm.isLocked(i)
            };
        }
        return cs;
    },

    renderBody : function(){
        var markup = this.renderRows() || ['&#160;', '&#160;'];
        return [this.templates.body.apply({rows: markup[0]}), this.templates.body.apply({rows: markup[1]})];
    },

    refresh : function(headersToo){
        this.fireEvent('beforerefresh', this);
        this.grid.stopEditing(true);
        var result = this.renderBody();
        this.mainBody.update(result[0]).setWidth(this.getTotalWidth());
        this.lockedBody.update(result[1]).setWidth(this.getLockedWidth());
        if(headersToo === true){
            this.updateHeaders();
            this.updateHeaderSortState();
        }
        this.processRows();
        this.layout();
        this.applyEmptyText();
        this.fireEvent('refresh', this);
    },

    onDenyColumnLock : Ext.emptyFn,

    initData : function(ds, cm){
        if(this.cm){
            this.cm.un('columnlockchange', this.onColumnLock, this);
        }
        Ext.tree.LockingView.superclass.initData.call(this, ds, cm);
        if(this.cm){
            this.cm.on('columnlockchange', this.onColumnLock, this);
        }
    },

    onColumnLock : function(){
        this.refresh(true);
    },

    handleHdMenuClick : function(item){
        var index = this.hdCtxIndex,
            cm = this.cm,
            id = item.getItemId(),
            llen = cm.getLockedCount();
        switch(id){
            case 'lock':
                if(cm.getColumnCount(true) <= llen + 1){
                    this.onDenyColumnLock();
                    return undefined;
                }
                cm.setLocked(index, true, llen != index);
                if(llen != index){
                    cm.moveColumn(index, llen);
                    this.grid.fireEvent('columnmove', index, llen);
                }
            break;
            case 'unlock':
                if(llen - 1 != index){
                    cm.setLocked(index, false, true);
                    cm.moveColumn(index, llen - 1);
                    this.grid.fireEvent('columnmove', index, llen - 1);
                }else{
                    cm.setLocked(index, false);
                }
            break;
            default:
                return Ext.tree.LockingView.superclass.handleHdMenuClick.call(this, item);
        }
        return true;
    },

    handleHdDown : function(e, t){
        Ext.tree.LockingView.superclass.handleHdDown.call(this, e, t);
        if(this.grid.enableColLock !== false){
            if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
                var hd = this.findHeaderCell(t),
                    index = this.getCellIndex(hd),
                    ms = this.hmenu.items, cm = this.cm;
                ms.get('lock').setDisabled(cm.isLocked(index));
                ms.get('unlock').setDisabled(!cm.isLocked(index));
            }
        }
    },

    syncHeaderHeight: function(){
        var hrow = Ext.fly(this.innerHd).child('tr', true),
            lhrow = Ext.fly(this.lockedInnerHd).child('tr', true);
            
        hrow.style.height = 'auto';
        lhrow.style.height = 'auto';
        var hd = hrow.offsetHeight,
            lhd = lhrow.offsetHeight,
            height = Math.max(lhd, hd) + 'px';
            
        hrow.style.height = height;
        lhrow.style.height = height;

    },

    updateLockedWidth: function(){
        var lw = this.cm.getTotalLockedWidth(),
            tw = this.cm.getTotalWidth() - lw,
            csize = this.grid.getGridEl().getSize(true),
            lp = Ext.isBorderBox ? 0 : this.lockedBorderWidth,
            rp = Ext.isBorderBox ? 0 : this.rowBorderWidth,
            vw = Math.max(csize.width - lw - lp - rp, 0) + 'px',
            so = this.getScrollOffset();
        if(!this.grid.autoHeight){
            var vh = Math.max(csize.height - this.mainHd.getHeight(), 0) + 'px';
            this.lockedScroller.dom.style.height = vh;
            this.scroller.dom.style.height = vh;
        }
        this.lockedWrap.dom.style.width = (lw + rp) + 'px';
        this.scroller.dom.style.width = vw;
        this.mainWrap.dom.style.left = (lw + lp + rp) + 'px';
        if(this.innerHd){
            this.lockedInnerHd.firstChild.style.width = lw + 'px';
            this.lockedInnerHd.firstChild.firstChild.style.width = lw + 'px';
            this.innerHd.style.width = vw;
            this.innerHd.firstChild.style.width = (tw + rp + so) + 'px';
            this.innerHd.firstChild.firstChild.style.width = tw + 'px';
        }
        if(this.mainBody){
            this.lockedBody.dom.style.width = (lw + rp) + 'px';
            this.mainBody.dom.style.width = (tw + rp) + 'px';
        }
    }
});


/*******************************************************************************************************************************
********************************************************************************************************************************
********************************************************************************************************************************
********************
*TODO************************************************************************************************************
********************************************************************************************************************************
*********************************************************************************************************************************/

Ext.tree.LockingBufferView = Ext.extend(Ext.tree.LockingView, {

    scrollDelay: 200,

    cacheSize: 50,

    cleanDelay: 500,

    initTemplates : function(){
       Ext.tree.LockingBufferView.superclass.initTemplates.call(this);
        var ts = this.templates;
            ts.rowHolder = new Ext.Template(
                '<div ext:tree-node-id="{id}" tree-node-path="{path}" class="x-grid3-row {alt} x-tree-node-{id}" style="{tstyle}"></div>'
        );
        ts.rowHolder.disableFormats = true;
        ts.rowHolder.compile();
    },

    getCalculatedRowHeight : function(){
        return this.rowHeight + this.borderHeight;
    },

    getVisibleRowCount : function(){
        var rh = this.getCalculatedRowHeight(),
            visibleHeight = this.scroller.dom.clientHeight;
        return (visibleHeight < 1) ? 0 : Math.ceil(visibleHeight / rh);
    },

    getVisibleRows: function(){
        var count = this.getVisibleRowCount(),
            sc = this.scroller.dom.scrollTop,
            start = (sc === 0 ? 0 : Math.floor(sc/this.getCalculatedRowHeight())-1);
        return {
            first: Math.max(start, 0),
            last: Math.min(start + count + 2, this.ds.getCount()-1)
        };
    },
    
    getRowIndex: function(n){
    	if (n && n.id) {
    		var rows = this.getRows();
    		for (var i = 0; i < rows.length; i++) {
    			var id = Ext.fly(rows[i]).getAttributeNS('ext','tree-node-id');
    			if (id == n.id) {
    				return i;
    			}
    		}
    	}
    	return 0;
    },
    
    getNodeByIndex: function(i){
    	var row = this.getRow(i);
    	if (row) {
        	var id = Ext.fly(row).getAttributeNS('ext', 'tree-node-id');
        	if (id) {
        		return this.grid.getNodeById(id);
        	}
    	}
    },

    syncScroll: function(){
        Ext.tree.LockingBufferView.superclass.syncScroll.apply(this, arguments);
        this.update();
    },

    update: function(){
        if (this.scrollDelay) {
            if (!this.renderTask) {
                this.renderTask = new Ext.util.DelayedTask(this.doUpdate, this);
            }
            this.renderTask.delay(this.scrollDelay);
        }else{
            this.doUpdate();
        }
    },

    onRemove : function(ds, record, index, isUpdate){
        Ext.tree.LockingBufferView.superclass.onRemove.apply(this, arguments);
        if(isUpdate !== true){
            this.update();
        }
    },

    renderChildren: function(node, deep){

	   if (node && node.hasChildNodes()) {

            var me = this,
                cs = me.getColumnData(),
                ds = me.grid.getStore(),
                sm = me.grid.selModel,
                colModel = me.grid.colModel,
                startIndex = me.getRowIndex(node),
                colCount = colModel.getColumnCount(),
                totalWidth = me.getTotalWidth(),
                rh = this.getStyleRowHeight(),
                vr = this.getVisibleRows(),
                lockedWidth = me.getLockedWidth();

            return this.doRender(cs, [].concat(node.childNodes), ds, 
            		colCount, totalWidth, lockedWidth, deep, startIndex, 
            		false, rh, vr);

       }

	   return ['',''];
    },

    removeChildren: function(node){
        Ext.tree.LockingBufferView.superclass.removeChildren.call(this, node);
        this.update();
    },

    doRender: function(cs, nodes, ds, colCount, totalWidth, 
    		lockedWidth, deep, startRow, onlyBody, rh, vr){

        var buf = [], lbuf = [],

            templates = this.templates,
            rowTemplate = templates.row,
            rowInner = templates.rowInner,
            rowParams = {},
            rowIndex,

            tstyle = 'width:'+ totalWidth +';height:'+ rh +'px;',
            ucstyle = 'width:'+ totalWidth  +';height:'+ this.rowHeight +'px;',
            lstyle = 'width:'+ lockedWidth +';height:'+ rh +'px;',
            lcstyle = 'width:'+ lockedWidth +';height:'+ this.rowHeight +'px;',

            j, node, alt, lcb, cb,
            meta = {};

        for (j = 0; j < nodes.length; j++) {

            node = nodes[j];

            if (node.hidden) continue;
            
            cb = [];
            lcb = [];

            rowIndex = (j + (startRow ? startRow : 0)),
                visible = rowIndex >= vr.first && rowIndex <= vr.last;
            //debug(node.id+":"+rowIndex+":"+vr.first+":"+vr.last+":"+visible)
            if (visible) {
                
                node.render(true);
            	bd = this.doRenderColumn(cs, node, ds, colCount, rowParams, deep);
            	cb[cb.length] = bd[0];
                lcb[lcb.length] = bd[1];
                
            } else {
            	
                rowParams.id = node.id;
                rowParams.path = node.getPath();
                var _cs = [];
                if (node.expanded) {
                    _cs.push('x-tree-node-expanded');
                }
                if (node.deleted) {
                    _cs.push('x-tree-node-deleted');
                }
                rowParams.cls = _cs.join(' ');
                
            }
            
            alt = [];
            if (node.record.dirty) {
                alt[0] = ' x-grid3-dirty-row';
            }
            if (this.getRowClass) {
                alt[1] = this.getRowClass(node.record, rowParams, store);
            }
            rowParams.alt = alt.join(' ');
            rowParams.cols = colCount;

            rowParams.tstyle = tstyle; 
            rowParams.cells = cb.join('');
            buf[buf.length] = !visible ? templates.rowHolder.apply(rowParams) : (onlyBody ? rowInner.apply(rowParams) : rowTemplate.apply(rowParams));

            rowParams.tstyle = lstyle; 
            rowParams.cells = lcb.join('');
            lbuf[buf.length] = !visible ? templates.rowHolder.apply(rowParams) : (onlyBody ? rowInner.apply(rowParams) : rowTemplate.apply(rowParams));

            if (!onlyBody) {

                if ((node.expanded || deep) && node.hasChildNodes()) {

                    node.expanded = true;

                    var bd = this.doRender(cs, node.childNodes, ds, colCount, 
                    		totalWidth, lockedWidth, deep, rowIndex, onlyBody, rh, vr);

                    buf[buf.length]  = bd[0];
                    lbuf[lbuf.length]  = bd[1];

                }

            }
        }
        return [buf.join(''), lbuf.join('')];
    },
    
    doUpdate: function(){
    	
        if (this.getVisibleRowCount() > 0) {
        	
            var me = this,
                g = this.grid, 
                deep = g.expandedAll,
                ds = g.store,
                cm = g.colModel, 
                cs = this.getColumnData(),
                colCount = cm.getColumnCount(),
                totalWidth = this.getTotalWidth(),
                lockedWidth = this.getLockedWidth(),
                node, row, lrow, bd,
                rh = this.getStyleRowHeight(),
                vr = this.getVisibleRows(),
                rows = this.getRows(),
                lrows = this.getLockedRows();
            
            for (var i = vr.first; i <= vr.last; i++) {

            	//node = this.getNodeByIndex(i);
            	row = rows[i];
            	if (row) {
                	var id = Ext.fly(row).getAttributeNS('ext', 'tree-node-id');
                	if (id) {
                		node = this.grid.getNodeById(id);
                	}
                    lrow = lrows[i];
            	}
                if(row && lrow && !(row.childNodes.length > 0) && node){
                	bd = this.doRender(cs, [node], ds, colCount, totalWidth, 
                			lockedWidth, deep, i, true, rh, vr);
                	// print("	insert-start")
                    row.innerHTML = bd[0];
                    lrow.innerHTML = bd[1];
                    this.updateNodeUI(node, row, lrow);
                    if (node.selected) {
                    	this.onSelect(node);
                    } else {
                    	this.onDeselect(node);
                    } 
                   // print("	insert-end")
                }
            }
            
            //this.clean();
            this.fireEvent('update', this);
        }
    },

    renderRows: function() {

        var grid     = this.grid,
            deep     = grid.expandedAll,
            ds       = this.ds,
            rowCount = ds.getCount(),
            cs       = this.getColumnData(),
            root     = grid.getRootNode(),
            totalWidth = this.getTotalWidth(),
            lockedWidth = this.getLockedWidth(),
            rh = this.getStyleRowHeight(),
            vr = this.getVisibleRows(),
            colCount = grid.colModel.getColumnCount();
        
        if (rowCount < 1) {
            return '';
        }
        
        if (this.grid.rootVisible) {
        	var nodes = root;
        } else {
        	root.expanded = true;
        	var nodes = root.childNodes;
        }

        return this.doRender(cs, nodes, ds, colCount, totalWidth, 
        		lockedWidth, deep, 0, false, rh, vr);

    },

    clean : function(){
        if(!this.cleanTask){
            this.cleanTask = new Ext.util.DelayedTask(this.doClean, this);
        }
        this.cleanTask.delay(this.cleanDelay);
    },

    doClean: function(){
        if (this.getVisibleRowCount() > 0) {
            var vr = this.getVisibleRows();
            if(this.ds.getCount() - vr.last < 5) {
                return;
            }
            var first = vr.first - this.cacheSize,
                last = vr.last + this.cacheSize;
                vr.first -= this.cacheSize;
                vr.last += this.cacheSize;

            var i = 0, rows = this.getRows(), lrows = this.getLockedRows();
            if(first <= 0){
                i = last + 1;
            }
            for(var len = this.ds.getCount(); i < len; i++){
                if ((i < first || i > last) && rows[i]) {
                    if(rows[i] && rows[i].innerHTML) {
                        rows[i].innerHTML = '';
                    }
                    if(lrows[i] && lrows[i].innerHTML) {
                        lrows[i].innerHTML = '';
                    }
                }
            }
        }
    },
    
    showNode: function(node){
    	
    	this.update();
    	
    	Ext.tree.LockingBufferView.superclass.showNode.call(this, node);
    },
    
    hideNode: function(node){
    	
    	this.update();
    	
    	Ext.tree.LockingBufferView.superclass.hideNode.call(this, node);
    },
    
    removeTask: function(name){
        var task = this[name];
        if(task && task.cancel){
            task.cancel();
            this[name] = null;
        }
    },
    
    destroy : function(){
        this.removeTask('cleanTask');
        this.removeTask('renderTask');  
        Ext.tree.LockingBufferView.superclass.destroy.call(this);
    },

    layout: function(){
        Ext.tree.LockingBufferView.superclass.layout.call(this);
        //this.update();
    }
});