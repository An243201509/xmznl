Ext.ns('Ext.mapper');

Ext.mapper.Mapper = Ext.extend(Ext.util.Observable, {
	
	constructor: function(config){
		this.proxys = [];
		this.dataIndexs = [];
		this.addEvents('mappingcompleted');
		Ext.apply(this, config);
		Ext.mapper.Mapper.superclass.constructor.call(this);
	},
	
	init: function(){
		var to;
		Ext.each(this.proxys, function(proxy){
			proxy.bindMapper(this);
			proxy.on('completed', this.doCompleted, this);
			proxy.map.eachKey(function(from, mapping){
				to = mapping.to;
				if (to) {
					if (Ext.isArray(to)) {
						Ext.each(to, function(t){
							if (Ext.isObject(t)) this.dataIndexs.push(t.name);
							else this.dataIndexs.push(t);
						}, this);
					} else if (Ext.isObject(to)) {
						this.dataIndexs.push(to.name);
					} else {
						this.dataIndexs.push(to);
					}
				}
			}, this);
		}, this);
	},
	
	doCompleted: function(proxy, rs, options){
		proxy.completed = true;
		var allCompleted = true;
		Ext.each(this.proxys, function(p){
			if (p.completed !== true) {
				allCompleted = false;
				return false;
			}
		}, this);
		if (allCompleted) {
			this.completed = true;
			this.onCompleted.call(this, rs, options);
			this.fireEvent('mappingcompleted', this, rs, options);
		}
	},
	
	initCompleted: function(){
		Ext.each(this.proxys, function(p){
			p.completed = false;
		});
		this.completed = false;
	},
	
	onCompleted: Ext.emptyFn,
	
	onDestroy: function(){
		Ext.each(this.proxys, function(proxy){
			proxy.un('completed', this.doCompleted);
		});
		this.proxys = null;
		Ext.mapper.Mapper.superclass.onDestroy.call(this);
	}
	
});

Ext.mapper.GridView = Ext.extend(Ext.mapper.Mapper, {
	
	init: function(grid){
		
		var store = grid.store;
		this.grid = grid;
		this.view = grid.getView();
		
		var me = this.view;
		
		me.blockRefresh = true;
		
		if (this.type == 'treegrid') {
			store.on('beforeload', this.initCompleted, this);
			me.onAdd = me.onAdd.createInterceptor(this.isCompleted, this);
			me.onClear = me.onClear.createInterceptor(this.isCompleted, this);
			me.onDataChanged = me.onAdd.createInterceptor(this.isCompleted, this);
		} else {
			store.on('beforeload', this.initCompleted, this);
			me.onLoad = me.onLoad.createInterceptor(this.isCompleted, this);
			me.onAdd = me.onAdd.createInterceptor(this.isCompleted, this);
			me.onClear = me.onClear.createInterceptor(this.isCompleted, this);
			me.onDataChanged = me.onAdd.createInterceptor(this.isCompleted, this);
		}
		
		Ext.mapper.GridView.superclass.init.call(this);
		
	},
	
	initCompleted: function(){
		this.view.blockRefresh = true;
		Ext.each(this.proxys, function(p){
			p.completed = false;
		});
		this.completed = false;
	},
	
	onCompleted: function(rs, options){
		
		if (this.grid.unlock) {
			this.grid.unlock.defer(100, this.grid);
		}
		
		this.view.blockRefresh = false;
		if (this.type == 'treegrid') {
			if (options.add !== true) {
				this.view.refresh();
			} else if (options.add == true) {
				var me = this.view, ds = this.getStore();
				me.onAdd.call(me, ds, rs, options);
			}
		} else {
			this.getStore().applySort();
			this.view.refresh();
		}
		
	},
	
	getStore: function(){
		return this.grid.getStore();
	},
	
	isCompleted: function(){

		if (this.completed !== true) {
			return false;
		}
		return true;
	}
});

Ext.override(Ext.grid.GroupingView, {
	doRender : function(cs, rs, ds, startRow, colCount, stripe){
        if(rs.length < 1){
            return '';
        }
        if(!this.canGroup() || this.isUpdating){
            return Ext.grid.GroupingView.superclass.doRender.apply(this, arguments);
        }
        var groupField = this.getGroupField(),
            colIndex = this.cm.findColumnIndex(groupField),
            g,
            gstyle = 'width:' + this.getTotalWidth() + ';',
            cfg = this.cm.config[colIndex],
            groupRenderer = cfg.groupRenderer || cfg.renderer,
            prefix = this.showGroupName ? (cfg.groupName || cfg.header)+': ' : '',
            groups = {},
            curGroup, i, len, gid;
        for(i = 0, len = rs.length; i < len; i++){
            var rowIndex = startRow + i,
                r = rs[i],
                gvalue = r.data[groupField];
                g = this.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds);                
            if(!curGroup || curGroup.group != g){
                gid = this.constructId(gvalue, groupField, colIndex);
                curGroup = groups[gid];
                if (curGroup) {
                	curGroup.rs.push(r);
                } else {
	                this.state[gid] = !(Ext.isDefined(this.state[gid]) ? !this.state[gid] : this.startCollapsed);
	                curGroup = {
	                    group: g,
	                    gvalue: gvalue,
	                    text: prefix + g,
	                    groupId: gid,
	                    startRow: rowIndex,
	                    rs: [r],
	                    cls: this.state[gid] ? '' : 'x-grid-group-collapsed',
	                    style: gstyle
	                };
	                groups[gid] = curGroup;
                }
            }else{
                curGroup.rs.push(r);
            }
            r._groupId = gid;
        }

        var buf = [];
        for(gid in groups){
        	g = groups[gid];
            this.doGroupStart(buf, g, cs, ds, colCount);
            buf[buf.length] = Ext.grid.GroupingView.superclass.doRender.call(
                    this, cs, g.rs, ds, g.startRow, colCount, stripe);

            this.doGroupEnd(buf, g, cs, ds, colCount);
        }
        return buf.join('');
    }
});