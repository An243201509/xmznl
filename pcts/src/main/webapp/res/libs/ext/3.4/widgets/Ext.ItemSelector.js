
Ext.ItemSelector = Ext.extend(Ext.Container, {

	showOrderNo: true,

	layout: 'border',

	initComponent: function(){

		this.cls = (this.cls || '') + ' x-unselectable';

		if (this.showOrderNo) {

			this.fromTpl = new Ext.XTemplate('{[this.getNo()]}. {text}', {

            		target: this,

            		getNo: function(){
            			return ++this.target.fromList.index;
            		}

            	});

			this.toTpl = new Ext.XTemplate('{[this.getNo()]}. {text}', {

            		target: this,

            		getNo: function(){
            			return ++this.target.toList.index;
            		}

            	});

		} else {

			this.fromTpl = new Ext.XTemplate('{text}');

			this.toTpl = new Ext.XTemplate('{text}');
		}

		this.fromList = new Ext.ListView({

            multiSelect: true,

            index: 0,

            store: new Ext.data.ArrayStore({

	        	fields: ['value','text']

	        }),

            columns: [{

            	dataIndex: 'text',

            	tpl: this.fromTpl

            }],

            hideHeaders: true

        });

        this.fromList.on('dblclick', this.handleItemClick, this);
        
        this.toList = new Ext.ListView({

            multiSelect: true,

            index: 0,

            store: new Ext.data.ArrayStore({

	        	fields: ['value','text']

	        }),

            columns: [{

            	dataIndex: 'text',

            	tpl: this.toTpl
            }],

            hideHeaders: true

        });

        this.toList.on('dblclick', this.handleItemClick, this);
        
        
        this.items = [{
    		border: false,
    		region: 'center',
			layout: 'hbox',
			layoutConfig: {
				padding: '10 10 0 10',
				align: 'stretch',
				pack: 'center' 
			},
    		items: [{
        		xtype: 'fieldset',
        		bodyStyle: 'overflow:auto',
        		width: 200,
        		title: this.fromTitle,
        		items: this.fromList
        	}, {
        		border: false,
				width: 45,
				layout: 'vbox',
				defaults: {
					margins:'0 0 5 0'
				},
				layoutConfig: {
					align: 'center',
					pack: 'center' 
				},
				items: [{
					xtype: 'button',
					scale: 'small',
					iconCls: 'x-grid-col-top',
					scope: this,
					handler: this.toTop
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'x-grid-col-up',
					scope: this,
					handler: this.toUp
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'x-grid-col-from',
					scope: this,
					handler: function(){
						this.toList.selectRange(0, this.toList.store.getCount());
						this.toFrom();
					}
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'x-grid-col-to',
					scope: this,
					handler: function(){
						this.fromList.selectRange(0, this.fromList.store.getCount());
						this.fromTo();
					}
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'x-grid-col-down',
					scope: this,
					handler: this.toDown
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'x-grid-col-bottom',
					scope: this,
					handler: this.toBottom
				}]
        	}, {
        		xtype: 'fieldset',
        		bodyStyle: 'overflow:auto',
        		width: 200,
        		title: this.toTitle,
        		items: this.toList
        	}]
		}];

		Ext.ItemSelector.superclass.initComponent.call(this);
	},

	fromTo: function(){

		var rs = this.fromList.getSelectedRecords();
		var r, i;
		for (i = 0; i < rs.length; i++) {
            r = rs[i];
            this.fromList.store.remove(r);
            this.toList.store.add(r);
        }
		this.fromList.index = 0;
		this.fromList.refresh();
		this.toList.index = 0;
        this.toList.refresh();

	},

	toFrom: function(alt){

		var rs = this.toList.getSelectedRecords();
		var r, i;
		for (i = 0; i < rs.length; i++) {
            r = rs[i];
            if (this.fireEvent('validItem', alt) != false) {
            	this.toList.store.remove(r);
            	this.fromList.store.add(r);
            }
        }
		this.fromList.index = 0;
		this.fromList.refresh();
		this.toList.index = 0;
        this.toList.refresh();

	},

	toTop: function(){

		var rs = this.toList.getSelectedRecords();
		if (rs && rs.length > 0) {
			var r, i;
			for (i = rs.length - 1; i > -1; i--) {
				r = rs[i];
				this.toList.store.remove(r);
				this.toList.store.insert(0, r);
			}
			this.toList.index = 0;
			this.toList.refresh();
			var node = this.toList.getNode(0);
			if (node) {
				this.toList.select(node);
				//node.scrollIntoView();
			}
		}

	},

	toUp: function(){

		var rs = this.toList.getSelectedRecords();
		if (rs && rs.length > 0) {
			var r, i, index, idx = [];
			for (i = 0; i < rs.length; i++) {
				r = rs[i];
				index = this.toList.store.indexOf(r);
				if (index > 0) {
					this.toList.store.remove(r);
					this.toList.store.insert(index - 1, r);
					idx.push(index - 1);
				}
			}
			this.toList.index = 0;
			this.toList.refresh();
			this.toList.select(idx);
			var node = this.toList.getNode(idx[idx.length - 1]);
			//if (node) node.scrollIntoView();
		}

	},

	toDown: function(){

		var rs = this.toList.getSelectedRecords();
		if (rs && rs.length > 0) {
			var r, i, index, idx = [];
			for (i = 0; i < rs.length; i++) {
				r = rs[i];
				index = this.toList.store.indexOf(r);
				if (index < this.toList.store.getCount() - 1) {
					this.toList.store.remove(r);
					this.toList.store.insert(index + 1, r);
					idx.push(index + 1);
				}
			}
			this.toList.index = 0;
			this.toList.refresh();
			this.toList.select(idx);
			var node = this.toList.getNode(idx[idx.length - 1]);
			//if (node) node.scrollIntoView();
		}

	},

	toBottom: function(){

		var rs = this.toList.getSelectedRecords();
		if (rs && rs.length > 0) {
			var r, i;
			for (i = rs.length - 1; i > -1; i--) {
				r = rs[i];
				this.toList.store.remove(r);
				this.toList.store.insert(this.toList.store.getCount(), r);
			}
			this.toList.index = 0;
			this.toList.refresh();
			var node = this.toList.getNode(this.toList.store.getCount() - 1);
			if (node) {
				this.toList.select(node);
				//node.scrollIntoView();
			}
		}

	},

	handleItemClick: function(view,idx,node,e){

		if (view == this.fromList) {

			this.fromTo(true);

		} else {

			this.toFrom(true);

		}

	},

	loadFrom: function(d){
		this.fromList.index = 0;
        this.fromList.store.loadData(d);
	},

	loadTo: function(d){
		this.toList.index = 0;
        this.toList.store.loadData(d);
	},

	onResize: function(w, h) {

		var cf = this.fromList.findParentByType('fieldset');
		var ct = this.toList.findParentByType('fieldset');
		var aw = (w / 2) - 60;
		aw = Math.max(aw, 200);
		if (ct) {
			ct.width = aw;
		}
		if (cf) {
			cf.width = aw;
		}

		Ext.ItemSelector.superclass.onResize.call(this, w, h);

	}

});

Ext.reg('itemselector', Ext.ItemSelector);