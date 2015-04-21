
Ext.ProgressBarPager = Ext.extend(Object, {
	
	progBarWidth   : 225,
	
	defaultText    : 'Loading...',
	
	defaultAnimCfg : {
		duration   : 1,
		easing     : 'bounceOut'	
	},
	
	constructor : function(config) {
		if (config) {
			Ext.apply(this, config);
		}
	},

	init : function (parent) {
		
		if(parent.displayInfo){
			this.parent = parent;
			var ind  = parent.items.indexOf(parent.displayItem);
			parent.remove(parent.displayItem, true);
			this.progressBar = new Ext.ProgressBar({
				text    : this.defaultText,
				width   : this.progBarWidth,
				animate :  this.defaultAnimCfg
			});					
		   
			parent.displayItem = this.progressBar;
			
			parent.add(parent.displayItem);	
			parent.doLayout();
			Ext.apply(parent, this.parentOverrides);		
			
			this.progressBar.on('render', function(pb) {
                pb.mon(pb.getEl().applyStyles('cursor:pointer'), 'click', this.handleProgressBarClick, this);
            }, this, {single: true});
						
		}
		  
	},
	
	handleProgressBarClick : function(e){
		var parent = this.parent,
		    displayItem = parent.displayItem,
		    box = this.progressBar.getBox(),
		    xy = e.getXY(),
		    position = xy[0]-box.x,
		    pages = Math.ceil(parent.store.getTotalCount()/parent.pageSize),
		    newpage = Math.ceil(position/(displayItem.width/pages));
            
		parent.changePage(newpage);
	},
	
	parentOverrides  : {
		updateInfo : function(){
			if(this.displayItem){
				var count = this.store.getCount(),
				    pgData = this.getPageData(),
				    pageNum = this.readPage(pgData),
				    msg = count == 0 ?
					this.emptyMsg :
					String.format(
						this.displayMsg,
						this.cursor+1, this.cursor+count, this.store.getTotalCount()
					);
					
				pageNum = pgData.activePage; ;	
				
				var pct	= pageNum / pgData.pages;	
				
				this.displayItem.updateProgress(pct, msg, this.animate || this.defaultAnimConfig);
			}
		}
	}
	
});

Ext.preg('progressbarpager', Ext.ProgressBarPager);

