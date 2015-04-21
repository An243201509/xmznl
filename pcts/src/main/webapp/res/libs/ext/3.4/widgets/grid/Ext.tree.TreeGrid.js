
Ext.tree.TreeGrid = Ext.extend(Ext.tree.GridPanel, {

	buffer: true,
	
	useLockingColumnModel: true,
	
	border: false,

	checkOnly: true,

	expandedAll: false,

	initColumnModel: function(){
		
		var me = this;
	    
        if(Ext.isArray(this.columns)){

            if (this.columns[0]) {
            	this.columns[0].isTreeNode = true;
            }
            
        }

        if (me.useOperationColumn) {

			me.operationColumn = new Ext.grid.OperationColumn(Ext.apply({

				locked: true

			}, me.useOperationColumn));

			me.columns = [me.operationColumn].concat(me.columns);
		}
		
		this.getSelectionModel();
    	
    	if (this.selModel.isColumn) {
            this.columns = [].concat(this.selModel, this.columns);
        }

    	if (this.buffer || this.useLockingColumnModel) {
			
	        this.cm = new Ext.grid.LockingColumnModel(this.columns);

		} else {
			
			this.cm = new Ext.grid.ColumnModel(this.columns);
			 
		}
        
    },
    
    getSelectionModel: function(){
    	
    	if (!this.selModel) {
    	
	    	if (this.multiSelect) {
	
	            this.selModel = new Ext.tree.CheckboxSelectionModel({
	
	            	checkOnly: this.checkOnly,
	
	                isLocked: Ext.emptyFn,
	
	                initEvents: function() {
	                    Ext.grid.CheckboxSelectionModel.superclass.initEvents.call(this);  
	                    this.grid.on('render', function() {  
	                        var view = this.grid.getView();
	                        if (!this.checkOnly) {
	                        	view.mainBody.on('mousedown', this.onMouseDown, this); 
	                        }
	                        if (view.lockedInnerHd) {
	                        	Ext.fly(view.lockedInnerHd).on('mousedown', this.onHdMouseDown, this);  
	                    	}
	                    }, this);  
	                }
	
	            });
	
	        } else {
	
	            this.selModel = new Ext.tree.RowSelectionModel();
	
	        }
	        
	    	if (this.useLockingColumnModel) {
	    		this.selModel.locked = true;
	    	}
    	}
    	
    	return this.selModel;
    },

    getView: function(){

    	if (!this.view) {

    		if (this.buffer) {

            	this.view = new Ext.tree.LockingBufferView(this.viewConfig);

    		} else if (this.useLockingColumnModel) {

    			this.view = new Ext.tree.LockingView(this.viewConfig);

    		} else {
    			
    			this.view = new Ext.tree.View(this.viewConfig);
    			
    		}
        }
        return this.view;
    }

});


Ext.reg('treegrid', Ext.tree.TreeGrid);

Ext.ns('Ext.ux.tree');

Ext.ux.tree.TreeGrid = Ext.tree.TreeGrid;