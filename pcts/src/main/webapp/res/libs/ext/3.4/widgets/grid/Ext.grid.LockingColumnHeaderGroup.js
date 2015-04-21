Ext.grid.LockingColumnHeaderGroup  =   Ext.extend(Ext.util.Observable, {
	constructor: function(config){
	        this.config = config;
	},

	 init: function(grid){
	        Ext.applyIf(grid.colModel, this.config);//add header rows to cm
	        Ext.apply(grid.getView(), this.viewConfig);
	},

	viewConfig: {
		 initTemplates: function(){
			this.constructor.prototype.initTemplates.apply(this, arguments);
			var ts = this.templates || {};

			ts.header = new Ext.Template(
				'<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
					'<thead>',                           
						'{gcells}',
					'</thead>',
				'</table>');

			if(!ts.gcell){
				ts.gcell = new Ext.Template(
					' <td class="x-grid3-hd x-grid3-cell x-grid3-group-{id} x-grid3-td-{id} ux-grid-hd-group-cell" colspan="{mcols}" rowspan="{mrow}" style="{style}">' ,
						'<div class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{rowStyle}">', 
						this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '',
						'{value}',
						'<img alt="" class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />',
						'</div>',
					' </td>')
			}

			if(!ts.gcell_unselect){
				ts.gcell_unselect = new Ext.Template(
					' <td class="x-grid3-td-{id} ux-grid-hd-group-cell" colspan="{mcols}" rowspan="{mrow}" style="{style}">' ,
						'<div class="x-grid3-hd-inner x-grid3-hd-{id}">',                            
						'{value}',                          
						'</div>',
					' </td>')
			}


			if(!ts.gEmptyCell){
				ts.gEmptyCell = new Ext.Template(
					' <td class="x-grid3-group-{id} x-grid3-td-{id}" colspan="{mcols}" rowspan="{mrow}" style="{style}">' ,
						'{value}',      
					' </td>')

			}

			if(!ts.grow){
				ts.grow = new Ext.XTemplate(
				'<tr class="x-grid3-hd-row">{cell}</tr> ')
			}

			this.templates = ts;
			this.hrowRe = new RegExp("grid-hd-group-row-(\\d+)", "");
		 },

		 renderHeaders: function(){

			var ts = this.templates, 
			cm = this.cm, 
			rows = cm.rows,
			tstyle = 'width:' + this.getTotalWidth() + ';';

			if(rows.length <1){
				sofa.error('group header is null');
				return "";
			}

			var baseConfig = cm.config.slice(0); 
			var columnLength = cm.getColumnCount();
			var rowLength = rows.length;

			var cells = [], lockcells = [], unlockcells = [],lockHeader,unlockHeader;

			//check locked column field
			for (var i = 0,j=0; i < columnLength; i++) {
				 if(cm.isLocked(i)){
				 	lockcells[i] = baseConfig[i];				 	
				 }else{
				 	unlockcells[j]= baseConfig[i];
				 	j++;
				 }
			};

			var out_temp="",lock_out=[],unlock_out=[],lockColumnWidth,unlockColumnWidth;
			
			//for locked column		
							
			for (var i = 0; i < lockcells.length; i++) {
				var cell = lockcells[i];
				var rowHeight = (rowLength+1) * 23; 
				
				lockColumnWidth = cm.getColumnWidth(i);
				cell.style =  'width:' + lockColumnWidth + 'px;line-height:'  +rowHeight + 'px;over-flow: hidden';

				
				out_temp += ts.gEmptyCell.apply({
					mcols:1,
					mrow:rowLength+1,
					id:cell.id,
					style: cell.style,
					value: cell.header || '&nbsp;'
					});
				
										 	
			 }; 

			lock_out[lock_out.length] = ts.grow.apply({
							    cell:out_temp
							});

			out_temp = '';
			//
			for(var i=0;i < rowLength;i++){
				lock_out[lock_out.length] = ts.grow.apply({
				    cell:out_temp
				});
			}

			lockHeader = ts.header.apply({
		                    tstyle: '',
		                    gcells: lock_out.join("")
		            });
			
			//for unlocked column
			var unlock_array= [],unlock_column_length = unlockcells.length;
			//初始化数组
			for(var i=0;i<=rows.length;i++){
			    unlock_array[i]=[];
			    for(var j=0;j<unlock_column_length;j++){
			        unlock_array[i][j] = {rowspan:1,colspan:1,show:false,lock:false};
			    }
			}

			for(var i=0,hlen = rows.length;i < hlen; i ++){
                
				var r=rows[i];

				for(var j = 0, col = 0,len = r.length; j < len; j++){

				    var group = r[j];

				    if(unlock_array[i][col] && unlock_array[i][col].lock == true){
				        col += group.colspan;
				        continue;
				    }else if(unlock_array[i][col]){                       
				        Ext.apply(unlock_array[i][col],group);
				        unlock_array[i][col].show = true;
				        unlock_array[i][col].lock = true;
				    }

				    if(group.colspan > 1 || group.rowspan > 1){
				                             
				        for(var v=i; v<group.rowspan;v++){

				            for(var h=col ,coslen = col + group.colspan; h < coslen; h++){    

				                if(v==i && h == col) {
				                	continue;
				                } else if (unlock_array[v][h]) { 
				                    unlock_array[v][h].rowspan = 1;
				                    unlock_array[v][h].colspan = 1;
				                    unlock_array[v][h].lock = true;
				                }
				            }
				        }       
				    }

				    col += group.colspan;
				}
			}
			//基本列头的处理
			for(var i=0,end=rows.length; i<unlock_column_length;i++){
			if(unlock_array[end][i] && unlock_array[end][i].lock == true){
			    continue;
			}
				unlock_array[end][i] = {header:unlockcells[i].header,rowspan:1,colspan:1,show:true,lock:true};

			}


			for(var i=0,len=unlock_array.length;i<len;i++){ 

				for(var j=0,hlen=unlock_array[i].length;j<hlen;j++){
				    var cell = unlock_array[i][j];
				   				   
				if(cell.show){
				    	            												
						if(cell.align){
							cell.style = 'text-align:' + cell.align + ';' ;
						}else if(i==len-1 &&  unlockcells[j].align){
							cell.style = 'text-align:' + unlockcells[j].align + ';';
						}
						
				    	//id
				    	var currentIndex = j + lockcells.length ;
			        	var id = this.getColumnId(cell.dataIndex ? cm.findColumnIndex(cell.dataIndex) : currentIndex);
			       	 	//var id = currentIndex;
			                                                                                
			        	var curColWidth = cm.getColumnWidth(currentIndex);
			        
						if(cell.colspan > 1) {
				        	for(var c=1,clen=cell.colspan;c<clen;c++){
				        		curColWidth +=  cm.getColumnWidth(currentIndex+c);
				        	}
						 }

			        
			        	cell.style += 'width:' + curColWidth + 'px;';
			        	//cell.rowStyle = 'line-height:'  + 20*cell.rowspan + 'px;over-flow: hidden';


			        	if(cell.rowspan == len){
			            	cell.header = unlockcells[j].header;
			           
			        	}

			        	if(cell.rowspan == 1 && cell.colspan > 1){
				            out_temp += ts.gcell_unselect.apply({
				                mcols:cell.colspan,
				                mrow:cell.rowspan,
				                id:id,
				                style: cell.style,
				                value: cell.header || '&nbsp;' ,
				                rowStyle: cell.rowStyle || ''                       
				            });
				      	 }else{
					        	
					        	out_temp += ts.gcell.apply({
					                    mcols:cell.colspan,
					                    mrow:cell.rowspan,
					                    id:id,
					                    style: cell.style,
					                    value: cell.header || '&nbsp;' ,
					                    rowStyle: cell.rowStyle || ''                       
					             });
				        }
				    }
				}


				unlock_out[i] = ts.grow.apply({
				    cell:out_temp
				});

				out_temp = "";
			}

			unlockHeader = ts.header.apply({
		                    tstyle: '',
		                    gcells: unlock_out.join("")
		            });
			//alert( unlockHeader);
			return  [unlockHeader,lockHeader];

		 }
	}
});