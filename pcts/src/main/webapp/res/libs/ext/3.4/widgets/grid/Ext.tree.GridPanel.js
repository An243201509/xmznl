Ext.data.TreeReader = Ext.extend(Ext.data.JsonReader, {
	
	constructor: function(config){
		Ext.apply(this, config);
		if (this.idProperty) {
			this.fields.push({name:this.idProperty, mapping:this.idProperty});
		}
		this.fields.push({name:'leaf', mapping:'leaf', type: 'bool'});
		Ext.data.TreeReader.superclass.constructor.call(this, Ext.apply(config, {
			fields: this.fields
		}));
	},
	
	extractData : function(root, returnRecords) {
        var rawName = 'json';
        var rs = [];
        if (this.isData(root) && !(this instanceof Ext.data.XmlReader)) {
            root = [root];
        }
        var f       = this.recordType.prototype.fields,
            fi      = f.items,
            fl      = f.length,
            rs      = [];
        if (returnRecords === true) {
            var Record = this.recordType;
            for (var i = 0; i < root.length; i++) {
                var n = root[i];
                var record = new Record(this.extractValues(n, fi, fl), this.getId(n));
                record[rawName] = n;    
                rs.push(record);
            }
        }
        else {
            for (var i = 0; i < root.length; i++) {
                var data = this.extractValues(root[i], fi, fl);
                data[this.meta.idProperty] = this.getId(root[i]);
                rs.push(data);
            }
        }
        return rs;
    },
    
	readRecord: function(n){
		 var f       = this.recordType.prototype.fields,
	         fi      = f.items,
	         fl      = f.length,
	         rs      = [];
		 var Record = this.recordType;
		 var record = new Record(this.extractValues(n, fi, fl), this.getId(n));
         record['_json'] = n;
         return record;
	}
    
});

Ext.data.TreeStore = Ext.extend(Ext.data.Store, {

	// 默认子节点的属性
	childrenParam: 'children',

	// 默认传递node参数
	nodeParam: 'node',

	constructor: function(config){

		Ext.apply(this, config);

		if (!Ext.isArray(this.fields)) {

			this.fields = [].concat(this.fields);

		}
		
		this.url = this.url || this.dataUrl;

		this.fields.push({

			name: this.childrenParam,

			mapping: this.childrenParam

		});

		Ext.data.TreeStore.superclass.constructor.call(Ext.apply(this, {

                reader: new Ext.data.TreeReader({

                		fields: this.fields

                	})

            })
        );

	    this.addEvents('beforecreatenode');

	},
	
	setRootNode: function(root){
		this.root = root;
		this.root.record = this.reader.readRecord(root);
	},

    load: function(node, callback, scope){
    	
    	if (node) {
    		
    		while(node.firstChild){
    			node.removeChild(node.firstChild);
    		}
    		
        	if (this.doPreloadChildren(node)) {
        		callback.call(scope || node, node);
                return;
        	}
        	
    	}
    	
        this.requestData(node, callback, scope);
    },
    
    reload: function(){
    	this.load(this.root);
    },
    
    loadData: function(data){
    	this.removeAll();
    	if (!Ext.isArray(data)) {
    		data = [].concat(data);
    	}
    	var recs = this.reader.readRecords(data);
    	this.loadRecords(recs, {add: false}, true);
    },

    requestData: function(node, callback, scope){
        var options = {
        	params: {}
        };

        if (callback) {
        	options.scope = scope || node;
        	options.callback = callback;
		}

        if (node) {
            options.node = node;
            if (!node.isRoot) {
                options.params[this.nodeParam] = node.id;
                options.add = true;
            }
        }
        
        this.storeOptions(options);
        if(this.sortInfo && this.remoteSort){
            var pn = this.paramNames;
            options.params = Ext.apply({}, options.params);
            options.params[pn.sort] = Ext.encode(this.sortInfo);
            //options.params[pn.dir] = this.sortInfo.direction;
        }
        try {
            return this.execute('read', null, options); 
        } catch(e) {
            this.handleException(e);
            return false;
        }
    },

    loadRecords: function(o, options, success){
        if (this.isDestroyed === true) {
            return;
        }

        if (!o || success === false) {
            if(success !== false){
                this.fireEvent('load', this, [], options);
            }
            if(options.callback){
                options.callback.call(options.scope || this, [], options, false, o);
            }
            return;
        }

        var rs = o.records, t = o.totalRecords || rs.length;

        // 同步模式
        if (!options || options.add !== true) {

            if(this.pruneModifiedRecords){
                this.modified = [];
            }

            var rec, node, root = (options && options.node) || this.grid.getRootNode();

            for(var i = 0, len = rs.length; i < len; i++){

            	rec = rs[i];

                if (node = this.createNode(rec)) {

                    this.appendTo(node, root);

                }
            }

            this.totalLength = t;

            this.applySort(root);

            this.fireEvent('datachanged', this);

        } else {
        // 异步模式
            var rec, cnt = 0, node, targetNode = options.node || this.grid.getRootNode();

            for (var i = 0, len = rs.length; i < len; ++i) {

                rec = rs[i];

                if (node = this.createNode(rec)) {
                    this.appendTo(node, targetNode);
                    cnt++;

                }

            }

            this.totalLength = Math.max(t, this.totalLength + cnt);

            this.applySort(targetNode);
            
            this.fireEvent('add', this, rs, options);
            
        }
        
        this.fireEvent('load', this, rs, options);

        if(options.callback){

            options.callback.call(options.scope || this, rs, options, true);

        }

    },

    createNode: function(rec){

        if (!rec) return;
        
    	rec.join(this);

        var node = null, attrs;

        if (this.fireEvent('beforecreatenode', this, rec) !== false) {

            if (attrs = rec.toJSON()) {

                if (this.baseAttrs) {

                    Ext.applyIf(attrs, this.baseAttrs);

                }
                
                node = new Ext.tree.NodeInterface(attrs);

                node.setOwnerTree(this.grid);

                node.record = rec;
                
                node.data = rec.data;

                rec.node = node;

            }

        }

        return node;

    },

    doPreloadChildren: function(node){

        var children, rec, recs, me = this;

        if(children = node.attributes[this.childrenParam]){

            Ext.each(children, function(child){

                rec = this.reader.readRecord(child);
                
                recs = node.record.data[me.childrenParam];
                
                if (Ext.isArray(recs)) {
                	
                	recs = recs.concat(rec);

                } else {
                	
                	recs = [].concat(rec);
                	
                }
                
                node.record.data[me.childrenParam] = recs;

                if (n = this.createNode(rec)) {

                    this.appendTo(n, node);

                }
                
            }, this);

            return true;

        }

        return false;
    },

    appendTo: function(node, parentNode){

    	var node;

        if (parentNode) {
        	
        	parentNode.childrenRendered = false;

        	parentNode.appendChild(node);
        	
        	parentNode.childrenRendered = true;
        	
        	var startIndex = this.data.indexOfKey(parentNode.id);
        	
        	if (startIndex == -1) {
        		this.data.add(node.id, node);
        	} else {
        		this.data.insert(startIndex, node.id, node);
        	}
            
            this.doPreloadChildren(node);

        }
    },
    
    removeNode: function(node){
    	node.cascade(function(n){
    		this.data.removeKey(n.id);
		}, this);
    },
    
    removeAll: function(){
		var root = this.grid.getRootNode();
    	if (!this.grid.rootVisible) {
    		while(root.firstChild){
    			root.removeChild(root.firstChild);
    		}
    	} else {
    		root.remove();
    	}
    	this.data.clear();
    },
    
    applySort : function(node){
    	if (this.grid.getView().lock == true) {
    		return;
    	}
        if ((this.sortInfo || this.multiSortInfo) && !this.remoteSort) {
            this.sortData(node);
        }
    },
    
    sortData : function(node) {
        var sortInfo  = this.sortInfo,
            direction = sortInfo.direction || "ASC",
            sorters   = sortInfo.sorters;
        if (!this.hasMultiSort) {
            sorters = [{direction: direction, field: sortInfo.field}];
        } else {
        	sorters = [].concat(sortInfo);
        }
        var startNode = node || this.grid.getRootNode();

        startNode.cascade(function(n){
        	
           if (n.rendered || n.isRoot) {

               for (var i=0, j = sorters.length; i < j; i++) {
                   var sortFns = this.createDefaultSort(sorters[i].field, sorters[i].direction);

                   n.sort(sortFns);
               }
               
           }
           
        }, this);
    },

    createDefaultSort: function(field, direction){
    	direction = direction || "ASC";
        var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;
        var sortType = this.fields.get(field).sortType;

        return function(n1, n2) {
        	var r1 = n1.record, r2 = n2.record;
    		var v1 = sortType(r1.data[field]),
            	v2 = sortType(r2.data[field]);

    		if (typeof(v1) == "string") {
                return directionModifier * v1.localeCompare(v2);
            }
    		return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
        };
    },
    
    multiSort: function(sorters) {
        this.hasMultiSort = true;
        
        if (sorters) {
        	this.sortInfo = sorters;
        }
        
        Ext.each(this.sortInfo, function(sort){
        	if (!sort.direction) {
	        	sort.direction = "ASC";
	        }
        });
        
        if (this.remoteSort) {
            this.load(this.grid.getRootNode());
        } else {
            this.applySort();
            this.fireEvent('datachanged', this);
        }
    },
    
    singleSort: function(fieldName, dir) {
        var field = this.fields.get(fieldName);
        if (!field) {
            return false;
        }

        var name       = field.name,
            sortInfo   = this.sortInfo || null,
            sortToggle = this.sortToggle ? this.sortToggle[name] : null;

        if (!dir) {
            if (sortInfo && sortInfo.field == name) { 
                dir = (this.sortToggle[name] || 'ASC').toggle('ASC', 'DESC');
            } else {
                dir = field.sortDir;
            }
        }

        this.sortToggle[name] = dir;
        this.sortInfo = {field: name, direction: dir};
        this.hasMultiSort = false;

        if (this.remoteSort) {
        	this.load(this.grid.getRootNode());
        } else {
            this.applySort();
            this.fireEvent('datachanged', this);
        }
        return true;
    },
        
    createFilterFn : function(property, value, anyMatch, caseSensitive, exactMatch){
        if(Ext.isEmpty(value, false)){
            return false;
        }
        value = this.data.createValueMatcher(value, anyMatch, caseSensitive, exactMatch);
        
        return function(n) {
        	var r = n.record;
        	if (Ext.isArray(property)) {
        		for (var i = 0, j = property.length; i < j; i++) {
        			if (value.test(r.data[property[i]])) {
        				return true;
        			}
        		}
        		return false;
        	} else {
                return value.test(r.data[property]);
        	}
        };
    },
    
    createMultipleFilterFn: function(filters) {
        return function(n) {
        	
            var isMatch = true;

            for (var i=0, j = filters.length; i < j; i++) {
                var filter = filters[i],
                    fn     = filter.fn,
                    scope  = filter.scope;
                
                isMatch = isMatch && fn.call(scope, n);
            }

            return isMatch;
        };
    },
    
    clearFilter : function(suppressEvent){
    	for (var id in this.grid.nodeHash) {
        	var n = this.grid.nodeHash[id];
        	n.show();
        }
        if(suppressEvent !== true){
            this.fireEvent('datachanged', this);
        }
    },
    
    filterBy : function(fn, scope){
    	
        var nodes = this.queryBy(fn, scope || this);
        
        nodes.eachKey(function(key, node){
        	if (!node.isExpanded() && !node.isRoot) {
        		node.ensureVisible(null, null, false);
    		}
        }, this);
        
        for (var id in this.grid.nodeHash) {
        	var n = this.grid.nodeHash[id];
        	var isMatch = false;
            nodes.eachKey(function(key, node){
            	if (node.getPath().indexOf(n.getPath()) > -1) {
            		isMatch = true;
            	}
            }, this);
        	if (!isMatch) {
        		n.hide();
        	}
        }
        
        this.fireEvent('datachanged', this);
    },
    
    queryBy : function(fn, scope){
        var data = this.snapshot || this.data;
        return data.filterBy(fn, scope||this);
    },
    
    getById: function(id){
    	return this.data.key(id);
    }
    
});

// sort与源码一致 方便调式而已
Ext.override(Ext.data.Node, {
	sort : function(fn, scope){
        var cs = this.childNodes;
        var len = cs.length;
        if(len > 0){
            var sortFn = scope ? function(){fn.apply(scope, arguments);} : fn;
            cs.sort(sortFn);
            for(var i = 0; i < len; i++){
                var n = cs[i];
                n.previousSibling = cs[i-1];
                n.nextSibling = cs[i+1];
                if(i === 0){
                    this.setFirstChild(n);
                }
                if(i == len-1){
                    this.setLastChild(n);
                }
            }
        }
    }
});

Ext.tree.NodeInterface = Ext.extend(Ext.data.Node, {
	
	childrenRendered: true,
	
	constructor: function(attributes){
		
		this.attributes = attributes;
		
		Ext.tree.NodeInterface.superclass.constructor.call(this, attributes);
		
	},
	
	appendChild: function(n) {
		var grid = this.getOwnerTree(),
			store = grid.getStore(),
			view = grid.getView();
		
		if (!(n instanceof Ext.tree.NodeInterface)) {
			var rec = store.reader.readRecord(n);
			n = store.createNode(rec);
		}
		
		Ext.tree.NodeInterface.superclass.appendChild.call(this, n);

		if (n && this.childrenRendered) {
			view.renderNode(n, this);
		}
	},
	
	hasChildNodes : function(){
		
		var grid = this.getOwnerTree();
		
        if(!this.isLeaf() && !grid.sync){
            return true;
        }else{
        	return !this.isLeaf() && this.childNodes.length > 0;
        }
    },
	
	isLeaf : function(){
		
		var grid = this.getOwnerTree();
		// !this.attributes[grid.getStore().childrenParam]
		if (grid.sync && this.childNodes.length == 0) {
			return true;
		}
		
        return (this.leaf === true) ;
    },
    
    expand: function(deep, anim, callback, scope){

    	if (!this.expanded) {

            this.expanded = true;
    	
	    	var grid = this.getOwnerTree(),
	    		store = grid.getStore(),
	    		view = grid.getView();
	        
	    	if (this.childNodes.length > 0 || this.sync) {
	    		
	    		view.expandNode(this, deep, anim, callback, scope);
	    		
	    	} else {
	    		
	    		store.load(this, callback, scope);
	    		
	    	}
    	
    	} else {
    		if (callback) {
    			callback.call(scope || this);
    		}
    	}
    	
    },
    
    collapse: function(){
    	
    	if (this.expanded) {
    		
            this.expanded = false;
        	
	    	var grid = this.getOwnerTree(),
	    		store = grid.getStore(),
	    		view = grid.getView();
	    	
	    	view.collapseNode(this);
    	
    	}
    },
    
    ensureVisible : function(callback, scope, intoview){
        var grid = this.getOwnerTree();
        grid.expandPath(this.parentNode ? this.parentNode.getPath() : this.getPath(), false, function(){
            var node = grid.getNodeById(this.id);
            if (node && intoview != false) {
            	var ctNode = grid.getView().getNodeRow(node);
            	if (ctNode) grid.scroller.scrollChildIntoView(ctNode);
            }
            this.runCallback(callback, scope || this, [this]);
        }.createDelegate(this));
    },
    
    runCallback : function(cb, scope, args){
        if(Ext.isFunction(cb)){
            cb.apply(scope, args);
        }
    },
    
    isVisible : function(){    	
    	return this.rendered && (this.visible == true && !this.hidden);
    },
    
    getView : function(){
    	return this.getOwnerTree().getView();
    },
    
    getStore : function(){
    	return this.getOwnerTree().getStore();
    },
    
    show : function(){
    	this.getView().showNode(this);
    	this.hidden = false;
    	this.visible = true;
    	this.rendered = true;
    },
    
    hide : function(){
    	this.getView().hideNode(this);
    	this.hidden = true;
    	this.visible = false;
    	this.rendered = false;
    },
    
    remove: function(){
    	
    	this.getView().removeNode(this);
    	
    	this.getStore().removeNode(this);
    	
    	Ext.tree.NodeInterface.superclass.remove.call(this);
		
    },
    
    removeChild: function(child){
    	
    	this.getView().removeNode(child);

    	this.getStore().removeNode(child);
    	
    	Ext.tree.NodeInterface.superclass.removeChild.call(this, child);
		
    },
    
    isExpanded: function(){
    	return this.isRoot ? true : this.expanded;
    },
    
    render: function(rendered){
    	this.rendered = rendered;
    	this.visible = rendered;
    },
    
    toJSON: function(){
    	return this.record.toJSON();
    }
	
});

Ext.tree.View = Ext.extend(Ext.grid.GridView, {

    selectedClass: 'x-grid3-row-selected',
    
    onRowOver : function(e, target) {
        var row = this.findRow(target);

        if (row) {
            Ext.fly(row).addClass(this.rowOverCls);
        }
    },
    
    onRowOut : function(e, target) {
        var row = this.findRow(target);

        if (row) {
        	Ext.fly(row).removeClass(this.rowOverCls);
        }
    },
    
    onLoad: Ext.emptyFn,

    init: function(grid) {

        Ext.tree.View.superclass.init.call(this, grid);
        
        // register events
        grid.on({

            scope: this,

            rowclick: function(grid, row, e){
            	
                if (t = e.getTarget('.x-tree-ec-icon', 3)) {

                    var node = this.getNode(e);

                    e.stopEvent();
                    
                    e.preventDefault();
                    
                    if (!node || this.locked || (node && !node.isExpandable())) {
                    	return;
                    }
                    
                    if (!node.expanded) {

                    	node.expand();

                    } else {

                        node.collapse();

                    }

                }

            }
        });

    },

    getNode: function(e){
        var t;
        if(t = e.getTarget('.x-tree-node', 10)){
            var id = Ext.fly(t).getAttributeNS('ext', 'tree-node-id');
            if (id) {
                return this.grid.getNodeById(id);
            }
        }
        return null;
    },
    
    showNode: function(node){
    	
    	var ctNode = this.getNodeRow(node);

    	if (ctNode) {
    		
    		Ext.fly(ctNode).setVisible(true);
    		
    	}
    },
    
    hideNode: function(node){
    	
    	var ctNode = this.getNodeRow(node);
    	
    	if (ctNode) {
    		
    		Ext.fly(ctNode).setVisibilityMode(Ext.Element.DISPLAY).setVisible(false);
    		
    	}
    },

    updateNodeUI: function(node, nodeRow){
    	    	
    	node.render(true);
    	
    	node.wasLeaf = true;
        
        if (!nodeRow) nodeRow = this.getNodeRow(node);
        
        if (nodeRow && nodeRow.firstChild) {
        	
            var rowEl = Ext.fly(nodeRow.firstChild.firstChild.firstChild);
            
            var cs = rowEl.child('div.x-tree-node-indent:first', true).childNodes;
            
            var ecNode = cs[1];

            var c1,
            	c2,
            	cls = node.isLast() ? "x-tree-elbow-end" : "x-tree-elbow",
            	hasChild = node.hasChildNodes();
        	
    	    if (hasChild || node.expandable) {
    	        if(node.expanded){
    	            cls += "-minus";
    	            c1 = "x-tree-node-collapsed";
    	            c2 = "x-tree-node-expanded";
    	        }else{
    	            cls += "-plus";
    	            c1 = "x-tree-node-expanded";
    	            c2 = "x-tree-node-collapsed";
    	        }
    	        if (node.wasLeaf) {
    	        	rowEl.removeClass("x-tree-node-leaf");
    	        	node.wasLeaf = false;
    	        }
    	        rowEl.replaceClass(c1, c2);
    	    }else{
    	    	if(!node.wasLeaf){
    	    		rowEl.replaceClass("x-tree-node-expanded", "x-tree-node-collapsed");
    	            node.wasLeaf = true;
    	    	}
    	    }
    	    var ecc = "x-tree-ec-icon "+cls;
    	    ecNode.className = ecc;
        }
        
    },

    onAdd: function(store, rs, opts){
    	var node = opts.node || this.grid.getRootNode();
    	this.expandNode(node);
    },
    
    getNodeRow: function(node){
    	if (!node) return;
    	if (node.isRoot && !this.grid.rootVisible) {
    		return this.mainBody.dom;
    	}
    	var arr = this.mainBody.query('div.x-tree-node-'+ node.id);
    	if (arr && arr.length > 0) {
    		return arr[0];
    	}
    	return;
    },
    
    expandNode: function(node, deep, anim, callback, scope){

    	var me = this,
        	sm = me.grid.selModel,
        	nodeHtml = me.renderChildren(node, deep),
        	nodeRow = me.getNodeRow(node);
    	
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
    	
    	//if (deep !== true) {
        if ((anim !== undefined ? anim : me.grid.animate)) {
        	me.locked = true;
        	me.animExpand(nodeHtml, nodeRow, select);
        } else {
        	me.expand(nodeHtml, nodeRow, select);
        }
    	//}
        
        me.updateNodeUI(node, nodeRow);

        if (node.selected) {
        	this.onSelect(node);
        }
        
        node.fireEvent('expand', node);
    },

    collapseNode: function(node){
    	
    	node.expanded = false;
    	
        this.removeChildren(node);
        
        this.updateNodeUI(node);

        if (node.selected) {
        	this.onSelect(node);
        }

        node.fireEvent('collapse', node);
    },

    renderChildren: function(node, deep){

        if (node && node.hasChildNodes()) {

            var me = this,
                cs = me.getColumnData(),
                ds = me.grid.getStore(),
                sm = me.grid.selModel,
                colModel = me.grid.colModel,
                colCount = colModel.getColumnCount(),
                totalWidth = me.getTotalWidth();

            return me.doRender(cs, [].concat(node.childNodes), ds, colCount, totalWidth, deep);
        }
         
        return '';
    },
    
    processRows: function(rows){
    },
    
    // private
    expand: function(nodeHtml, targetNode, callback){
    	
    	if (targetNode == this.mainBody.dom) {
    		
    		this.mainBody.update('');
    		
    		Ext.DomHelper.insertHtml("beforeEnd", targetNode, nodeHtml);
    		
    	} else {
    		
    		Ext.DomHelper.insertHtml("afterEnd", targetNode, nodeHtml);
    		
    	}
    	
        if (callback) callback();
    },
    // private
    animExpand: function(nodeHtml, targetNode, callback){

        var me = this,
        	wrapEl = Ext.fly(targetNode).insertSibling(
        				'<table cellspacing="0"><tr><td>'+ nodeHtml +'</td></tr></table>', 
        				'after'),
        	rows = wrapEl.query(me.rowSelector);

        if (callback) callback();

        wrapEl.setHeight(0);

        wrapEl.slideIn('t', {

            callback: function() {
            	
            	var t = Ext.fly(targetNode);
            	
            	if(t){
                	t.insertSibling(rows, 'after');
            	}
            	
                wrapEl.remove();

            	me.locked = false;
            }

        });

    },
    
    removeNode: function(node, startIndex){
    	
    	var path = node.getPath();
        var ds  = this.grid.getStore();
        var sm = this.grid.selModel;
        var arr = this.innerCt.query('div[@tree-node-path^='+ path +']');

        if (arr && arr.length > 0) {

            for (var i = (startIndex ? startIndex : 0), len = arr.length; i < len; i++) {
            	
                var id = Ext.fly(arr[i]).getAttributeNS('ext', 'tree-node-id');
                
                Ext.removeNode(arr[i]);
                
                var n = this.grid.getNodeById(id);
                
                if (n) {

                    sm.selections.removeKey(n.id);

                    n.render(false);
                    
                }
            }

        }
        
    },

    removeChildren: function(node){

        this.removeNode(node, 1);

    },

    renderNode: function(node, parentNode){

    	var me = this,
	    	sm = me.grid.selModel,
            cs = me.getColumnData(),
            ds = me.grid.getStore(),
            colModel = me.grid.colModel,
            colCount = colModel.getColumnCount(),
            totalWidth = me.getTotalWidth();
		
	    var nodeRow = me.getNodeRow(parentNode);

    	var nodeHtml = me.doRender(cs, [].concat(node), ds, colCount, totalWidth, true);
    	    	    
		Ext.DomHelper.insertHtml("afterEnd", nodeRow, nodeHtml);

    	if (parentNode.selected 
    			&& parentNode.hasChildNodes() 
    			&& me.grid.isCascadeSelect()) {

            Ext.each(parentNode.childNodes, function(child){
                sm.select(child, true);
            }, sm);

        }

    },

    doRenderColumn: function(cs, node, ds, colCount, rowParams, deep) {

        var templates = this.templates,
            cellTemplate = templates.cell,
            nodeCellTpl = templates.nodeCellTpl,
            last = colCount - 1,
            colBuffer = [],
            meta = {},  name, column,
            record = node.record,
            data = node.attributes;
       
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
            if (this.markDirty 
            		&& record.dirty 
            		&& typeof record.modified[column.name] != 'undefined') {
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
                
                colBuffer[colBuffer.length] = nodeCellTpl.apply(meta);
            } else {
                colBuffer[colBuffer.length] = cellTemplate.apply(meta);
            }
        }
        return colBuffer.join('');
    },

    doRender: function(cs, nodes, ds, colCount, totalWidth, deep){

        var templates = this.templates,
            rowTemplate = templates.row,
            rowBuffer = [],
            rowParams = {tstyle: 'width:' + totalWidth + ';'},
            j, node, alt;

        for (j = 0; j < nodes.length; j++) {

            node = nodes[j];
            
            if (node.hidden) continue;
            
            node.render(true);

            alt = [];

            if (node.record.dirty) {
                alt[0] = ' x-grid3-dirty-row';
            }

            rowParams.cols = colCount;

            if (this.getRowClass) {
                alt[1] = this.getRowClass(node.record, rowParams, store);
            }

            rowParams.alt   = alt.join(' ');

            rowParams.cells = this.doRenderColumn(cs, node, ds, colCount, rowParams, deep);

            rowBuffer[rowBuffer.length] = rowTemplate.apply(rowParams);

            if ((node.expanded || deep) && node.hasChildNodes()) {

                node.expanded = true;

                rowBuffer[rowBuffer.length] = this.doRender(cs, node.childNodes, ds, colCount, totalWidth, deep);

            }
            
        }
        return rowBuffer.join('');
    },
    
    getNodeClass : function(node, deep) {

        node.wasLeaf = true;
        
        var cls = node.isLast() ? "x-tree-elbow-end" : "x-tree-elbow",
        	cl, 
        	hasChild = node.hasChildNodes();
                        
        if (hasChild || node.expandable) {
	        if(node.expanded || deep){
	            cls += "-minus";
        		cl = " x-tree-node-expanded";
	        } else {
	            cls += "-plus";
        		cl = " x-tree-node-collapsed";
	        }
	        if (node.wasLeaf) {
	        	node.wasLeaf = false;
	        }
        } else {
        	cl = "x-tree-node-leaf";
        	if(!node.wasLeaf){
        		cl = " x-tree-node-collapsed";
        		node.wasLeaf = true;
        	}
        }
        
        if (node.deleted) {
        	cl += " x-tree-node-deleted";
        }
        return [cl, cls];
    },
    
    getNodeIndent : function(node){
    	if (!node) return '';
        if(!node.childIndent){
            var buf = [],
                p = node;
            while(p){
                if(!p.isRoot || (p.isRoot && p.ownerTree.rootVisible)){
                    if(!p.isLast()) {
                        buf.unshift('<img alt="" src="'+ Ext.BLANK_IMAGE_URL +'" class="x-tree-elbow-line" />');
                    } else {
                        buf.unshift('<img alt="" src="'+ Ext.BLANK_IMAGE_URL +'" class="x-tree-icon" />');
                    }
                }
                p = p.parentNode;
            }
            node.childIndent = buf.join("");
        }
        return node.childIndent;
    },

	masterTpl: new Ext.Template(
        '<div class="x-grid3" hidefocus="true">',
            '<div class="x-grid3-viewport">',
                '<div class="x-grid3-header">',
                    '<div class="x-grid3-header-inner">',
                        '<div class="x-grid3-header-offset" style="{ostyle}">{header}</div>',
                    '</div>',
                    '<div class="x-clear"></div>',
                '</div>',
                '<div class="x-grid3-scroller x-unselectable" unselectable="on">',
                    '<div class="x-grid3-body x-unselectable" unselectable="on" style="{bstyle}">',
                	'</div>',
                    '<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
                '</div>',
            '</div>',
            '<div class="x-grid3-resize-marker">&#160;</div>',
            '<div class="x-grid3-resize-proxy">&#160;</div>',
        '</div>'
    ),

    cellTpl: new Ext.Template(
        '<td hideFocus="on" class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
             '<div hideFocus="on" class="x-grid3-cell-inner x-tree-node-cell x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
         '</td>'
     ),

    initTemplates: function() {

    	Ext.tree.View.superclass.initTemplates.call(this);

    	var trcls = (this.grid.useArrows ? 'x-tree-arrows' : (this.grid.lines ? 'x-tree-lines' : 'x-tree-no-lines'));
    	var innerText = ['<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
						     '<tbody>',
						        '<tr ext:tree-node-id="{id}" class="x-tree-node {nodeCls} {cls} {alt}">{cells}</tr>',
						        this.enableRowBody ? rowBodyText : '',
						     '</tbody>',
						'</table>'].join("");
    	Ext.apply(this.templates, {
    		 nodeCellTpl: new Ext.Template(
		    	'<td hideFocus="on" class="x-grid3-col x-grid3-cell x-tree-node-td x-grid3-td-{id} {cls} ', trcls,'" style="{style} text-align:left" tabIndex="0" {cellAttr}>',
		    		'<div hideFocus="on" class="x-grid3-cell-inner x-tree-node-cell x-tree-node-el x-tree-node-indent x-grid3-col-{id}" unselectable="on">',
			            '<span class="x-tree-node-indent">{indentMarkup}</span>',
			            '<img src="', Ext.BLANK_IMAGE_URL, '" class="x-tree-ec-icon {elbowCls}" />',
			            '<img src="{icon}" class="x-tree-icon x-tree-node-icon {iconCls}" unselectable="on" />',
			            '<a hideFocus="on" class="x-tree-node-anchor" href="{href}" tabIndex="1" {hrefTarget}>',
			            '<span unselectable="on" {attr}>{value}</span></a>',
		            '</div>',
		        '</td>' ), 
		     row     : new Ext.Template('<div ext:tree-node-id="{id}" tree-node-path="{path}" class="x-grid3-row {alt} x-tree-node-{id}" style="{tstyle}">' + innerText + '</div>'),
		     rowInner: new Ext.Template(innerText)
    	});
    },

	initElements: function() {
        var Element  = Ext.Element,
            el       = Ext.get(this.grid.body.dom.firstChild),
            mainWrap = new Element(el.child('div.x-grid3-viewport')),
            mainHd   = new Element(mainWrap.child('div.x-grid3-header')),
            scroller = new Element(mainWrap.child('div.x-grid3-scroller')),
        	mainBody = new Element(scroller.child('div.x-grid3-body')),
        	innerCt = mainBody;
        if (this.grid.hideHeaders) {
            mainHd.setDisplayed(false);
        }
        if (this.forceFit) {
            scroller.setStyle('overflow-x', 'hidden');
        }
        Ext.apply(this, {
            el      : el,
            mainWrap: mainWrap,
            scroller: scroller,
            mainHd  : mainHd,
            innerHd : mainHd.child('div.x-grid3-header-inner').dom,
            mainBody: mainBody,
            innerCt: innerCt,
            focusEl: new Element(Element.fly(scroller).child('a')),
            resizeMarker: new Element(el.child('div.x-grid3-resize-marker')),
            resizeProxy : new Element(el.child('div.x-grid3-resize-proxy'))
        });
        this.focusEl.swallowEvent('click', true);
    },

    getColumnData: function() {
        var columns  = [],
            colModel = this.cm,
            colCount = colModel.getColumnCount(),
            fields   = this.ds.fields,
            i, name;
        for (i = 0; i < colCount; i++) {
            name = colModel.getDataIndex(i);
            columns[i] = {
                name    : Ext.isDefined(name) ? name : (fields.get(i) ? fields.get(i).name : undefined),
                renderer: colModel.getRenderer(i),
                scope   : colModel.getRendererScope(i),
                id      : colModel.getColumnId(i),
                isTreeNode:colModel.config[i].isTreeNode,
                style   : this.getColumnStyle(i)
            };
        }
        return columns;
    },

    getRows : function() {
        return this.hasRows() ? this.mainBody.query(this.rowSelector) : [];
    },

    renderRows: function() {

        var grid     = this.grid,
        	store	 = this.ds,
            rowCount = store.getCount(),
            cs       = this.getColumnData(),
            root     = grid.getRootNode(),
            totalWidth = this.getTotalWidth(),
            deep = this.grid.expandedAll,
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
        
        return this.doRender(cs, nodes, store, colCount, totalWidth, deep);

    },

    refresh: function(headersToo) {
        this.fireEvent('beforerefresh', this);
        this.grid.stopEditing(true);
        var result = this.renderBody();
        this.mainBody.update(result).setWidth(this.getTotalWidth());
        if (headersToo === true) {
            this.updateHeaders();
            this.updateHeaderSortState();
        }
        this.processRows();
        this.layout();
        this.applyEmptyText();
        this.fireEvent('refresh', this);
    },
    
    refreshNode: function(node){
    	
    	if (!node || (node && !node.record)) {
    		return;
    	}
    	
    	this.refreshRow(node.record);
    	
    },
    
    refreshRow: function(record) {
    	
    	if (!record || (record && !record.node)) {
            return;
        }
    	
        var store     = this.ds,
            colCount  = this.cm.getColumnCount(),
            cs   = this.getColumnData(),
            node = record.node,
            rowParams = {
        		cols: colCount,
                tstyle: String.format("width: {0};", this.getTotalWidth())
            },
            row, alt = [];

        if (record.dirty) {
            alt[0] = ' x-grid3-dirty-row';
        }

        if (this.getRowClass) {
            alt[1] = this.getRowClass(record, rowParams, store);
        }

        rowParams.cells = this.doRenderColumn(cs, node, store, colCount, rowParams);
        
        if (node) {
        	
        	row = this.getNodeRow(node);
        	
        	Ext.fly(row).addClass(alt.join(' ')).setStyle(rowParams.tstyle);
            
        	row.innerHTML = this.templates.rowInner.apply(rowParams);
            
        }
        
        this.fireEvent('rowupdated', this, node, record);
    },

    removeAll: function(){
    	this.mainBody.update('');
    	this.grid.store.removeAll();
    },
    
    getNodeTop : function(node) {
        if (node) {
        	row = this.getNodeRow(node);
            return Ext.fly(row).getY();
        }
    },

    focus: function(node){
    	if (node.rendered) {
    		var rowEl = Ext.fly(this.getNodeRow(node));
			rowEl.stopFx();
			rowEl.highlight();
        	this.restoreScroll({top:this.getNodeTop(node)});
        	if (Ext.isGecko) {
        		rowEl.focus();
    		} else {
    			rowEl.focus.defer(1, rowEl);
    		}
    	}		
    },
    
    onDataChange : function(){
        this.refresh(true);
        this.updateHeaderSortState();
    },
    
    onClear : function() {
        this.refresh();
    },

    onSelect: function(node) {
		if (node.isRoot && !this.grid.rootVisible) return;
        node.selected = true;
    	if (node && node.rendered) {
    		var row = this.getNodeRow(node);
    		if (row) {
    			Ext.fly(row).addClass(this.selectedClass);
    		}
    	}
		this.selected = node;
    	return node;
    },

    onDeselect: function(node) {
		if (node.isRoot && this.grid.rootVisible) return;
        node.selected = false;
    	if (node) {
    		var row = this.getNodeRow(node);
    		if (row) {
    			Ext.fly(row).removeClass(this.selectedClass);
    		}
    	}
    	return node;
    },

    getSelectFirst: function(){
    	var t = this.innerCt.first('div.x-grid3-row');
		if (t) {
			var id = t.getAttributeNS('ext', 'tree-node-id');
			return this.grid.getNodeById(id);
		}
		return;
    },

    getSelectLast: function(){
    	var t = this.innerCt.last('div.x-grid3-row');
		if (t) {
			var id = t.getAttributeNS('ext', 'tree-node-id');
			return this.grid.getNodeById(id);
		}
		return;
    },

    getSelectNext: function(){
    	var id;
    	if (this.selected && this.selected.rendered) {
    		var t = Ext.fly(this.selected.ctNode).next('div.x-grid3-row');
    		if (t) {
    			id = t.getAttributeNS('ext', 'tree-node-id');
    		}
    	} else {
    		var t = this.innerCt.first('div.x-grid3-row');
    		if (t) {
    			id = t.getAttributeNS('ext', 'tree-node-id');
    		}
    	}
    	if (id) {
    		return this.grid.getNodeById(id);
    	}
    	return;
    },

    getSelectPrevious: function(){
    	var id;
    	if (this.selected && this.selected.rendered) {
    		var t = Ext.fly(this.selected.ctNode).prev('div.x-grid3-row');
    		if (t) {
    			id = t.getAttributeNS('ext', 'tree-node-id');
    		}
    	} else {
    		var t = this.innerCt.first('div.x-grid3-row');
    		if (t) {
    			id = t.getAttributeNS('ext', 'tree-node-id');
    		}
    	}
    	if (id) {
    		return this.grid.getNodeById(id);
    	}
    	return;
    },

    clearSelections: function(){
    	var arr = this.innerCt.query('.x-grid3-row');
    	var nodes = [];
    	if (arr && arr.length > 0) {
    		var t, id, node;
    		for (var i = 0; i < arr.length; i++) {
    			t = Ext.fly(arr[i]);
    			id = t.getAttributeNS('ext', 'tree-node-id');
    			node = this.grid.getNodeById(id);
    			if (node) {
    				nodes.push(node);
    			}
    		}
    	}
    	return nodes;
    },

    selectRange: function(node){
    	if (!node) return;
		var nodes = [], n;
    	if (this.selected && this.selected.rendered){
    		// 先试图向上查找
    		var t = Ext.fly(this.selected.ctNode).prev('div.x-tree-node-'+node.id), id;
    		if (t) {
    			do {
    				id = t.getAttributeNS('ext', 'tree-node-id');
    				if (id) {
    					n = this.grid.getNodeById(id);
    					if (n) {
        					nodes.push(n);
    					}
    				}
    				if (id == this.selected.id) break;
    			} while (t = t.next('div.x-grid3-row'));
    		}
    		// 找不到，就向下查找
    		else {
    			var t = Ext.fly(this.selected.ctNode);
    			do {
    				id = t.getAttributeNS('ext', 'tree-node-id');
    				if (id) {
    					n = this.grid.getNodeById(id);
    					if (n) {
        					nodes.push(n);
    					}
    				}
    				if (id == node.id) break;
    			} while (t = t.next('div.x-grid3-row'));
    		}
    	}
		return nodes;
    },
    
    findRowIndex : function(el) {
        var row = this.findRow(el);
        return row ? row : false;
    },
    
    getCell : function(row, col){
    	if (row) 
    		return row.getElementsByTagName('td')[col];
    },
    
    resolveCell : function(row, col, hscroll) {
        if (!Ext.isNumber(row)) {
        	rowEl    = this.getRow(row);
        } else {
        	rowEl    = row;
        }
        
        if (!this.ds) {
            return null;
        }
        col = (col !== undefined ? col : 0);

        var colModel = this.cm,
            colCount = colModel.getColumnCount(),
            cellEl;
            
        if (!(hscroll === false && col === 0)) {
            while (col < colCount && colModel.isHidden(col)) {
                col++;
            }
            
            cellEl = this.getCell(rowEl, col);
        }

        return {row: rowEl, cell: cellEl};
    },
    
    ensureVisible : function(row, col, hscroll) {
        var resolved = this.resolveCell(row, col, hscroll);
        
        if (!resolved || !resolved.row) {
            return null;
        }

        var rowEl  = resolved.row,
            cellEl = resolved.cell,
            c = this.scroller.dom,
            p = rowEl,
            ctop = 0,
            stop = this.el.dom;

        while (p && p != stop) {
            ctop += p.offsetTop;
            p = p.offsetParent;
        }

        ctop -= this.mainHd.dom.offsetHeight;
        stop = parseInt(c.scrollTop, 10);

        var cbot = ctop + rowEl.offsetHeight,
            ch = c.clientHeight,
            sbot = stop + ch;


        if (ctop < stop) {
          c.scrollTop = ctop;
        } else if(cbot > sbot) {
            c.scrollTop = cbot-ch;
        }

        if (hscroll !== false) {
            var cleft  = parseInt(cellEl.offsetLeft, 10),
                cright = cleft + cellEl.offsetWidth,
                sleft  = parseInt(c.scrollLeft, 10),
                sright = sleft + c.clientWidth;
                
            if (cleft < sleft) {
                c.scrollLeft = cleft;
            } else if(cright > sright) {
                c.scrollLeft = cright-c.clientWidth;
            }
        }
        
        return this.getResolvedXY(resolved);
    },
    
    focusCell : function(row, col, hscroll){
    	this.syncFocusEl(this.ensureVisible(row, col, hscroll));
        
        var focusEl = this.focusEl;
        
        if (Ext.isGecko) {
            focusEl.focus();
        } else {
            focusEl.focus.defer(1, focusEl);
        }
    }
    
});

Ext.tree.RowSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {

	singleSelect: true,

	printable: false,
	
	isColumn: true,
	
	width: 16,
	
	fixed: true,
	
    hideable: false,
	
	menuDisabled: true,
	
	resizable: false,
	
	sortable: false,
	
	onMouseDown: Ext.emptyFn,
	
	onHdMouseDown: Ext.emptyFn,
    
	renderer : function(v, p, record, rowIndex){
		p.css = 'x-grid3-td-numberer';
        return '';
    },

    initEvents: function(){
    	Ext.tree.RowSelectionModel.superclass.initEvents.call(this);
    	this.view = this.grid.getView();
        Ext.fly(this.view.innerHd).on('mousedown', this.onHdMouseDown, this);
    },

    onKeyPress: function(e, name){
    	return;
    	// TODO 暂时先不使用键盘事件
        var up = name == 'up',
            method = up ? 'selectPrevious' : 'selectNext',
            add = up ? -1 : 1,
            last;
        if(!e.shiftKey || this.singleSelect){
        	var node = this[method](false);
            if (node) this.view.focus(node);
        }else if(e.shiftKey){
            this.selectRange(this.getNode(e));
        }else{
           this.selectFirst();
        }
    },

    onRefresh: function(){
        var ds = this.grid.store,
            s = this.getSelections(),
            i = 0, node,
            len = s.length;
        this.silent = true;
        this.clearSelections(true);
        for(; i < len; i++){
            this.select(s[i], true, true);
        }
        if(s.length != this.selections.getCount()){
            this.fireEvent('selectionchange', this);
        }
        this.silent = false;
    },
    isSelected: function(node){
        return (node && this.selections.key(node.id) ? true : false);
    },
    isIdSelected: function(id){
        return (this.selections.key(id) ? true : false);
    },
    hasNext: function(){
        return this.last !== false && this.grid.store.getAt(this.last + 1);
    },
    hasPrevious : function(){
        return !!this.last;
    },
    selectFirst: function(){
        var n = this.grid.getView().getSelectFirst();
        if (n) {
        	return this.select(n, keepExisting);
        }
        return false;
    },
    selectNext : function(keepExisting){
    	var n = this.grid.getView().getSelectNext();
    	do {
    		if (n && !n.deleted) {
    			return this.select(n, keepExisting);
    		} else if (n && n.deleted) {
    			this.grid.getView().selected = n;
    		} else {
    			return;
    		}
    	}
    	while (n = this.grid.getView().getSelectNext());
        return n;
    },
    selectPrevious : function(keepExisting){
    	var n = this.grid.getView().getSelectPrevious();
    	do {
    		if (n && !n.deleted) {
    			return this.select(n, keepExisting);
    		} else if (n && n.deleted) {
    			this.grid.getView().selected = n;
    		} else {
    			return;
    		}
    	}
    	while (n = this.grid.getView().getSelectPrevious());
        return n;
    },
    selectLast : function(keepExisting){
        var n = this.grid.getView().getSelectLast();
        if (n) {
        	return this.select(n, keepExisting);
        }
        return false;
    },
    selectAll: function(){
    	
        this.selections.clear();
        
        var ds = this.grid.store;
        
        ds.data.eachKey(function(key, node){
        	this.select(node, true);
        }, this);
    },
    select: function(node, keepExisting, refresh){
    	if(!node || (keepExisting && this.isSelected(node)) 
    			 || (node && node.deleted)
    			 || (node && !node.isVisible()) ){
            return;
        }
        if(this.fireEvent('beforerowselect', this, node, keepExisting) !== false){
            if(!keepExisting || this.singleSelect){
                this.clearSelections();
            }
            this.selections.add(node.id, node);

            this.grid.getView().onSelect(node);
            
            if(!this.silent){
                this.fireEvent('rowselect', this, node);
                this.fireEvent('selectionchange', this);
            }

        	if (node.hasChildNodes() 
        			&& this.grid.isCascadeSelect() 
        			&& refresh != true) {
        		Ext.each(node.childNodes, function(child){
        			this.select(child, keepExisting);
        		}, this);
        	}
        }
        return node;
    },
    unselect: function(node){
    	if(!node || (node && node.deleted) || (node && !node.isVisible())){
            return;
        }
    	if(this.fireEvent('beforerowdeselect', this, node) !== false){
    		
	        this.selections.removeKey(node.id);
	        
	        this.grid.getView().onDeselect(node);
	        
	        this.last = node;
	        
	        if(!this.silent){
	        	this.fireEvent('rowdeselect', this, node);
	        	this.fireEvent('selectionchange', this);
	        }
	        
	        if (node.hasChildNodes()
	    			&& this.grid.isCascadeSelect()) {
        		Ext.each(node.childNodes, function(child){
        			this.unselect(child);
        		}, this);
        	}
    	}
        return node;
    },
    clearSelections: function(fast){
        if(fast !== true){
            var s = this.selections;
            s.each(function(node){
                this.unselect(node);
            }, this);
            s.clear();
        }else{
            this.selections.clear();
        }
        this.last = false;
    },
    selectRange: function(targetNode, keepExisting){
        if(!keepExisting){
            this.clearSelections();
        }
        var view = this.grid.getView();
        var nodes = view.selectRange(targetNode);
        Ext.each(nodes, function(n){
        	this.select(n, true);
        }, this);
    },
    getCount: function(){
    	return this.selections.getCount();
    },
    handleMouseDown : function(g, rowIndex, e){
        if(e.button !== 0){
            return;
        }
    	var node = this.getNode(e);
        if(e.shiftKey && !this.singleSelect){
            this.selectRange(node, e.ctrlKey);
        } else if (node) {
            var isSelected = this.isSelected(node);
            if(e.ctrlKey && isSelected){
                this.unselect(node);
            }else if(!isSelected || this.getCount() > 1){
                this.select(node, e.ctrlKey || e.shiftKey);
            }
        }
    },
    processEvent : function(name, e, grid, rowIndex, colIndex){
        if (name == 'mousedown') {
            this.onMouseDown(e, e.getTarget());
            return false;
        } else {
            return Ext.grid.Column.prototype.processEvent.apply(this, arguments);
        }
    },
    getNode: function(e){
		var t;
        if(t = e.getTarget('.x-grid3-row', 10)){
            var id = Ext.fly(t).getAttributeNS('ext', 'tree-node-id');
            if (id) {
                return this.grid.getNodeById(id);
            }
        }
        return null;
    }
});

Ext.tree.CheckboxSelectionModel = Ext.extend(Ext.tree.RowSelectionModel, {

    id : 'checker',
    singleSelect: false,
    printable: false,
    width : 20,
    
    sortable : false,
    menuDisabled : true,
    fixed : true,
    hideable: false,
    isColumn: true,
    
    dataIndex : '',
    
	header : '<div class="x-grid3-hd-checker">&#160;</div>',

    handleMouseDown: Ext.emptyFn,

    isLocked: Ext.emptyFn,  

    renderer : function(v, p, record){
        return '<div class="x-grid3-row-checker">&#160;</div>';
    },

    onHdMouseDown: function(e, t) {
        if(t.className == 'x-grid3-hd-checker'){
            e.stopEvent();
            var hd = Ext.fly(t.parentNode);
            var isChecked = hd.hasClass('x-grid3-hd-checker-on');
            if(isChecked){
                hd.removeClass('x-grid3-hd-checker-on');
                this.clearSelections();
            }else{
                hd.addClass('x-grid3-hd-checker-on');
                this.selectAll();
            }
        }
    },
    clearSelections: function(fast){
    	var view = this.grid.getView();
    	var hd = Ext.fly(view.innerHd).child('div.x-grid3-hd-checker');
        if (hd) {
        	hd.removeClass('x-grid3-hd-checker-on');
        }
        if(fast !== true){
            var s = this.selections;
            s.each(function(node){
                this.unselect(node);
            }, this);
            s.clear();
        }else{
            this.selections.clear();
        }
        this.last = false;
    },
	onMouseDown: function(e, t){
		if(e.button !== 0 ){
            return;
        }
        if(e.button === 0){
            e.stopEvent();
        	if (t.className == 'x-grid3-row-checker' || Ext.fly(t).child('.x-grid3-row-checker', 1)){ 
	            var node = this.getNode(e);
	            if (node) {
	                if(this.isSelected(node)){
	                    this.unselect(node);
	                }else{
	                    this.select(node, true);
	                }
	            }
        	} else {
        		var node = this.getNode(e);
        		if (node) {
        			this.select(node, e.ctrlKey || e.shiftKey);
        		}
        	}
        }
    }
});

Ext.tree.RowNumberer = Ext.extend(Ext.grid.RowNumberer, {

    constructor : function(config){
        Ext.apply(this, config);
        if(this.rowspan){
            this.renderer = this.renderer.createDelegate(this);
        }
        var view = this.grid.getView();
        view.on('refresh', this.update, this);
        view.on('update', this.update, this);
    },

    update: function(){
        var bd;
        var view = this.grid.getView();
        if (this.locked) {
            bd = view.lockedBody;
        } else {
            bd = view.mainBody;
        }

        var arr = bd.query('div.x-grid3-col-numberer');

        for (var i = 0; i < arr.length; i++) {
            Ext.fly(arr[i]).update(i+1);
        }
    },

    renderer : function(v, p, record, colIndex){
        if(this.rowspan){
            p.cellAttr = 'rowspan="'+ this.rowspan +'"';
        }
        return '';
    }
});

Ext.tree.GridPanel = Ext.extend(Ext.grid.EditorGridPanel, {

    nodeHash: {},

    rootVisible : false,

    useArrows : false,
    
    lines: true,

    autoScroll: false,

    monitorResize: true,
    // 级联选中下级节点
    cascadeSelect: true,
    
    animate: true,
    
    remoteSort: false,

    pathSeparator: '/',
    
    trackMouseOver: true,
    
    isCascadeSelect : function(){
    	if (this.multiSelect && this.cascadeSelect) {
    		return true;
    	}
    	return false;
    },

    initStore: function(cfg){
    	
    	if (this.store) {
			this.store.destroy();
		}
    	
    	Ext.apply(this, cfg);

    	var storeConfig = Ext.applyIf(this.storeConfig || {}, {

            //autoLoad: false,
            
            remoteSort: this.remoteSort == undefined ? true : this.remoteSort,

            url: this.url || this.dataUrl,
            
            //fields: this.fields,
            
            childrenParam: this.childrenParam || 'children',
            
            nodeParam: this.nodeParam || 'node'

        });

    	this.store = new Ext.data.TreeStore(storeConfig);

    },

    initColumnModel: function(){

    	if(Ext.isArray(this.columns)){

            if (this.columns[0]) {
            	this.columns[0].isTreeNode = true;
            }
            
        }
    	
    	this.getSelectionModel();
    	
    	if (this.selModel.isColumn) {
            this.columns = [].concat(this.selModel, this.columns);
        }

        this.cm = new Ext.grid.ColumnModel(this.columns);

    },
    
    getSelectionModel: function(){
    	if (!this.selModel) {

        	if (this.multiSelect) {

                this.selModel = new Ext.tree.CheckboxSelectionModel();

            } else {

                this.selModel = new Ext.tree.RowSelectionModel();

            }
        	
    	}
    	
    	return this.selModel;
    },

    initComponent: function() {

    	if (!this.cm) {
    		this.initColumnModel();
    	}
    	
    	if (!this.store) {
    		this.initStore();
    	}
    	this.store.grid = this;

        if (!this.root) {

            this.root = new Ext.tree.NodeInterface();

        }

        Ext.tree.GridPanel.superclass.initComponent.call(this);
        
        this.setRootNode(this.root);

    },

    onRender: function(){

        Ext.tree.GridPanel.superclass.onRender.apply(this, arguments);

        this.relayEvents(this.store, ['load', 'onnoderender', 'beforecreatenode']);

        this.mon(this.store, {
        	'loadexception': function(){
        		var error = new Ext.Error('', this.id, '树形列表查询异常');
				if (arguments[3] && arguments[3].message) {
					error.message = arguments[3].message;
				} else if (arguments[2]) {
					error.message = arguments[2];
				}
				if (error) {
					error.url = this.url;
					new Ext.handleError(error);
				}
        	}
        });
        
        this.el.addClass('x-treegrid');

        var view = this.getView();

        this.innerCt = view.innerCt;

        this.innerBody = view.mainBody;

        this.scroller = view.scroller;

        this.innerHd = Ext.fly(view.innerHd);

        this.renderRoot();
        
        if (this.autoQuery != false){
        	this.root.expand(this.expandedAll);
    		/*this.store.load(this.root, function(){
    			this.root.expanded = true;
    		}, this);*/
    	}

    },

    setTimeout: function(timeout){
		if (this.store && this.store.proxy) {
			this.store.proxy.timeout = timeout;
		}
	},

    getStore: function(){
    	return this.store;
    },

    getRootNode: function(){
        return this.root;
    },

    getView: function(){
    	if (!this.view) {
            this.view = new Ext.tree.View(this.viewConfig);
        }
        return this.view;
    },

    setRootNode: function(node){

        this.root = node;

        node.ownerTree = this;
        
        this.store.setRootNode(node);

        node.isRoot = true;

        this.registerNode(node);

        this.renderRoot();

        return node;
    },

    renderRoot : function(){
    	
        if(this.innerCt){

            this.innerCt.update('');
            
            var view = this.getView();

            if (this.rootVisible) {

            	view.renderNode(this.root);
                
            }

        }
    },

    // private
    expandByPath: function(path){
    	if (Ext.isEmpty(path)) return;
        var keys = path.split(this.pathSeparator);
        var curNode = this.getRootNode();
        if (curNode.attributes["id"] != keys[1]) return;
        var index = 1;
        var f = function(){
            if (++index == keys.length) return;
            var c = curNode.findChild("id", keys[index]);
            if (!c) return;
            curNode = c;
            c.expand(false, false, f);
        };
        curNode.expand(false, false, f);
    },
    
    expandPath : function(path, attr, callback){
        if(Ext.isEmpty(path)){
            if(callback){
                callback(false, undefined);
            }
            return;
        }
        attr = attr || 'id';
        var keys = path.split(this.pathSeparator);
        var curNode = this.root;
        if(curNode.attributes[attr] != keys[1]){ 
            if(callback){
                callback(false, null);
            }
            return;
        }
        var index = 1;
        var f = function(){
            if(++index == keys.length){
                if(callback){
                    callback(true, curNode);
                }
                return;
            }
            var c = curNode.findChild(attr, keys[index]);
            if(!c){
                if(callback){
                    callback(false, curNode);
                }
                return;
            }
            curNode = c;
            c.expand(false, false, f);
        };
        curNode.expand(false, false, f);
    },

    registerNode: function(n) {

        this.nodeHash[n.id] = n;

        n.setOwnerTree(this);

    },

    unregisterNode: function(node){
        delete this.nodeHash[node.id];
    },


    proxyNodeEvent : function(){
        return this.fireEvent.apply(this, arguments);
    },

    getNodeById : function(id){
        return this.nodeHash[id];
    },

    getGridEl: function(){
        return this.body;
    },

    expandAll: function(node){

    	if (!node) {
    		this.expandNode(this.root, true, false);
    	} else {
    		this.expandNode(node, true, false);
    	}

    },

    expandNode: function(node, deep, anim) {

        view = this.getView();

        view.expandNode(node, deep, anim);
 
    },

    collapseNode: function(node){

        view = this.getView();

        view.collapseNode(node);

    },
    
    reload: function(node, callback, scope){
    	this.store.load(node ? node : this.root, callback, scope);
    },
    
    loadData: function(data) {
    	this.store.loadData(data);
    },
    
    findNodeById : function(nodeId) {
		for (var nid in this.nodeHash) {
			if (nid == nodeId) {
				return this.nodeHash(nid);
			}
		}
		return;
	},
	
	search: function(property, value, anyMatch, caseSensitive, exactMatch){
		if (Ext.isEmpty(anyMatch)) {
			anyMatch = true;
		}
		if (Ext.isEmpty(caseSensitive)) {
			caseSensitive = true;
		}
		Ext.applyIf(property, {
			anyMatch: anyMatch,
			caseSensitive: caseSensitive,
			exactMatch: exactMatch
		});
		
		var me = this;
			
		var nodes = me.store.query(property, value, anyMatch, caseSensitive, exactMatch).items;

		var view = me.getView();
		
		Ext.each(nodes, function(node){
			
			node.ensureVisible();
			
			view.focus(node);
			
		});
		
	},	
	
	getSelected: function(){
		var nodes = this.getSelectionModel().getSelections();
		var rs = [];
		Ext.each(nodes, function(n){
			rs.push(n.record);
		});
		return rs;
	},
    
    onCellDblClick : function(g, row, col, e){
    	if (t = e.getTarget('.x-tree-ec-icon', 3)) {
    		return;
    	}
    	var node;
    	if (row) {
        	var id = Ext.fly(row).getAttributeNS('ext', 'tree-node-id');
        	if (id) {
        		node = this.getNodeById(id);
        	}
    	}
        this.startEditing(node, row, col);
    },
    
    startEditing : function(node, row, col){
        this.stopEditing();
        if(this.colModel.isCellEditable(col, node)){
        	node.ensureVisible(null,null,false);
            var r = node.record,
                field = this.colModel.getDataIndex(col),
                e = {
                    grid: this,
                    record: r,
                    field: field,
                    value: r.data[field],
                    row: row,
                    column: col,
                    cancel:false
                };
            if(this.fireEvent("beforeedit", e) !== false && !e.cancel){
                this.editing = true;
                var ed = this.colModel.getCellEditor(col, node);
                if(!ed){
                    return;
                }
                // 将record对象绑定在editor对象里，方便获取
                ed.record = r;
                if (ed.field instanceof Ext.form.DateField && !ed.field.format) {
                	ed.field.format = 'Y-m-d';
            	}
                if(!ed.rendered){
                    ed.parentEl = this.view.scroller.dom;
                    ed.on({
                        scope: this,
                        render: {
                            fn: function(c){
                                c.field.focus(false, true);
                            },
                            single: true,
                            scope: this
                        },
                        specialkey: function(field, e){
                            this.getSelectionModel().onEditorKey(field, e);
                        },
                        complete: this.onEditComplete,
                        canceledit: this.stopEditing.createDelegate(this, [true])
                    });
                }
                Ext.apply(ed, {
                	row     : row,
                    col     : col,
                    record  : r
                });
                this.lastEdit = {
                	row: row,
                    col: col
                };
                this.activeEditor = ed;
                
                ed.selectSameEditor = (this.activeEditor == this.lastActiveEditor);
                var v = this.preEditValue(r, field);
                ed.startEdit(this.view.getCell(row, col).firstChild, Ext.isDefined(v) ? v : '');
                
                (function(){
                    delete ed.selectSameEditor;
                }).defer(50);
            }
        }
    },
    
    onEditorKey : function(field, e){
        var k = e.getKey(), 
            newCell, 
            g = this.grid, 
            last = g.lastEdit,
            ed = g.activeEditor,
            shift = e.shiftKey,
            ae, last, r, c;
            
        if(k == e.TAB){
            e.stopEvent();
            ed.completeEdit();
        }else if(k == e.ENTER){
            
        }
        if(newCell){
            r = newCell[0];
            c = newCell[1];

            this.onEditorSelect(r, last.row);

            if(g.isEditor && g.editing){ 
                ae = g.activeEditor;
                if(ae && ae.field.triggerBlur){
                    ae.field.triggerBlur();
                }
            }
            g.startEditing(r, c);
        }
    },
    
    walkCells : function(row, col, step, fn, scope){
        
    },
    
    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        this.lastActiveEditor = this.activeEditor;
        this.activeEditor = null;

        var r = ed.record,
            field = this.colModel.getDataIndex(ed.col);
        value = this.postEditValue(value, startValue, r, field);
        if (ed.field instanceof Ext.form.DateField) {
    		value = value.format(ed.field.format);
    	}
        if(this.forceValidation === true || String(value) !== String(startValue)){
            var e = {
                grid: this,
                record: r,
                field: field,
                originalValue: startValue,
                value: value,
                row: ed.row,
                column: ed.col,
                cancel:false
            };
            if(this.fireEvent("validateedit", e) !== false && !e.cancel && String(value) !== String(startValue)){
            	r.set(field, e.value);
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
        }
        //this.view.focusCell(ed.row, ed.col);
    }

});

Ext.reg('treegrid', Ext.tree.GridPanel);