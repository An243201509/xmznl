Ext.grid.ColumnHeaderGroup = Ext.extend(Ext.util.Observable, {
	

    constructor: function(config){
        this.config = config;
    },

    init: function(grid){
        Ext.applyIf(grid.colModel, this.config);
        Ext.apply(grid.getView(), this.viewConfig);
    },

    viewConfig: {
        initTemplates: function(){
            this.constructor.prototype.initTemplates.apply(this, arguments);
            var ts = this.templates || {};
            ts.header = new Ext.Template(
                    '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                       '<thead>',                           
                           '{gcells}{cells}',//gcell:expend grid header  cells: original grid header
                       '</thead>',
                   '</table>'
            );

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
            		' <td class="x-grid3-group-{id} x-grid3-td-{id} ux-grid-hd-group-cell" colspan="{mcols}" rowspan="{mrow}" style="{style}">' ,
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
        	
        var ts = this.templates, headers, cm = this.cm, rows = cm.rows, tstyle = 'width:' + this.getTotalWidth() + ';';

            var baseConfig = cm.config.slice(0); 
            var tr_1='',tr_2='';
            var columnLength = cm.getColumnCount();
            var cells = [];

            //初始化数组
            for(var i=0;i<=rows.length;i++){
                cells[i]=[];
                for(var j=0;j<columnLength;j++){
                    cells[i][j] = {rowspan:1,colspan:1,show:false,lock:false};
                }
            }

            for(var i=0,hlen = rows.length;i < hlen; i ++){
                
                var r=rows[i];

                for(var j = 0, col = 0,len = r.length; j < len; j++){

                    var group = r[j];

                    if(cells[i][col] && cells[i][col].lock == true){
                        col += group.colspan;
                        continue;
                    }else{                       
                        Ext.apply(cells[i][col],group);
                        cells[i][col].show = true;
                        cells[i][col].lock = true;
                    }

                    if(group.colspan > 1 || group.rowspan > 1){
                                             
                        for(var v=i; v<group.rowspan;v++){

                            for(var h=col ,coslen = col + group.colspan; h < coslen; h++){    

                                if(v==i && h == col) continue;
                                else 
                                    cells[v][h].rowspan = 1;
                                    cells[v][h].colspan = 1;
                                    cells[v][h].lock = true;

                            }
                        }       
                    }

                    col += group.colspan;
                }
            }
            //基本列头的处理
            for(var i=0,end=rows.length; i<columnLength;i++){
                if(cells[end][i] && cells[end][i].lock == true){
                    continue;
                }
                cells[end][i] = {header:baseConfig[i].header,rowspan:1,colspan:1,show:true,lock:true};

            }


            var out_temp="",out = [];
            var sss='';

            for(var i=0,len=cells.length;i<len;i++){ 
                         
                for(var j=0,hlen=cells[i].length;j<hlen;j++){
                    var cell = cells[i][j];
                   
                    if(i==len-1){
                        cell.style = baseConfig[j].align ? 'text-align:' + baseConfig[j].align + ';' : '';
                    }
                    
                    if(cell.show){
                    	            
                    	if(cell.style)cell.style += cell.align ? 'text-align:' + cell.align + ';' : '';
                    	else cell.style = cell.align ? 'text-align:' + cell.align + ';' : '';
                    	//id
                        var id = this.getColumnId(cell.dataIndex ? cm.findColumnIndex(cell.dataIndex) : j);
                        //custom operation
                        if(id=="operation"){
                        	id=j;
                        }
                                                                                                
                        var curColWidth = cm.getColumnWidth(j);
                        
                        if(cell.colspan > 1) {
                        	for(var c=1,clen=cell.colspan;c<clen;c++){
                        		curColWidth +=  cm.getColumnWidth(j+c);
                        	}
                        }
                        
                        if(cell.header == "rownumberer"){
                        	curColWidth = 17;
                        }else if(cell.header.indexOf('x-grid3-hd-checker') != -1 ){
                        	curColWidth = 19;
                        }
                        
                        cell.style += 'height:' + 20*cell.rowspan + 'px;' + 'width:' + curColWidth + 'px;';
                        cell.rowStyle = 'line-height:'  + 20*cell.rowspan + 'px;over-flow: hidden';


                        if(cell.rowspan == len){
                            cell.header = baseConfig[j].header;
                           
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
                        	//make checkbox view middle
                        	if(cell.header.indexOf('x-grid3-hd-checker') != -1 ){
                        		out_temp += ts.gEmptyCell.apply({
                                    mcols:cell.colspan,
                                    mrow:cell.rowspan,
                                    id:id,
                                    style: cell.style,
                                    value: cell.header || '&nbsp;'
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

                    if(cell.show){
                        sss+="1";
                    }else{
                        sss+="0";
                    }

                }
                

                out[i] = ts.grow.apply({
                    cell:out_temp
                });

                out_temp = "";
                sss +="\n";

            }

            headers = ts.header.apply({
                    tstyle: tstyle,
                    gcells: out.join("")
            });
            //alert(sss);
            //alert(headers);
            return headers;
        },
                
        onColumnWidthUpdated: function(){
            this.constructor.prototype.onColumnWidthUpdated.apply(this, arguments);
            Ext.grid.ColumnHeaderGroup.prototype.updateGroupStyles.call(this);
        },

        onAllColumnWidthsUpdated: function(){
            this.constructor.prototype.onAllColumnWidthsUpdated.apply(this, arguments);
            Ext.grid.ColumnHeaderGroup.prototype.updateGroupStyles.call(this);
        },

        onColumnHiddenUpdated: function(){
            this.constructor.prototype.onColumnHiddenUpdated.apply(this, arguments);
            Ext.grid.ColumnHeaderGroup.prototype.updateGroupStyles.call(this);
        },

        getHeaderCell: function(index){
            return this.mainHd.query(this.cellSelector)[index];
        },

        findHeaderCell: function(el){
            return el ? this.fly(el).findParent('td.x-grid3-hd', this.cellSelectorDepth) : false;
        },

        findHeaderIndex: function(el){
            var cell = this.findHeaderCell(el);
            return cell ? this.getCellIndex(cell) : false;
        },

        updateSortIcon: function(col, dir){
        	//this.cellSelector = "td.x-grid3-cell"
        	//custom groupSelector = "td.x-grid3-group"
        	var groupSelector = "td.x-grid3-group-" + col;
            var sc = this.sortClasses, hds = this.mainHd.select(this.cellSelector).removeClass(sc);
            var curCell = Ext.Element.select(groupSelector);
            curCell.addClass(sc[dir == "DESC" ? 1 : 0]);
            //hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
        },

        handleHdDown: function(e, t){
            var el = Ext.get(t);
            if(el.hasClass('x-grid3-hd-btn')){
                e.stopEvent();
                var hd = this.findHeaderCell(t);
                Ext.fly(hd).addClass('x-grid3-hd-menu-open');
                var index = this.getCellIndex(hd);
                this.hdCtxIndex = index;
                var ms = this.hmenu.items, cm = this.cm;
                ms.get('asc').setDisabled(!cm.isSortable(index));
                ms.get('desc').setDisabled(!cm.isSortable(index));
                this.hmenu.on('hide', function(){
                    Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
                }, this, {
                    single: true
                });
                this.hmenu.show(t, 'tl-bl?');
            }else if(el.hasClass('grid-hd-group-cell') || Ext.fly(t).up('.grid-hd-group-cell')){
                e.stopEvent();
            }
        },

        handleHdMove: function(e, t){
            var hd = this.findHeaderCell(this.activeHdRef);
            if(hd && !this.headersDisabled && !Ext.fly(hd).hasClass(this.baseCls)){
                var hw = this.splitHandleWidth || 5, r = this.activeHdRegion, x = e.getPageX(), ss = hd.style, cur = '';
                if(this.grid.enableColumnResize !== false){
                    if(x - r.left <= hw && this.cm.isResizable(this.activeHdIndex - 1)){
                        cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'e-resize' : 'col-resize'; // col-resize
                                                                                                // not
                                                                                                // always
                                                                                                // supported
                    }else if(r.right - x <= (!this.activeHdBtn ? hw : 2) && this.cm.isResizable(this.activeHdIndex)){
                        cur = Ext.isAir ? 'move' : Ext.isWebKit ? 'w-resize' : 'col-resize';
                    }
                }
                ss.cursor = cur;
            }
        },

        handleHdOver: function(e, t){
            var hd = this.findHeaderCell(t);
            if(hd && !this.headersDisabled){
                this.activeHdRef = t;
                this.activeHdIndex = this.getCellIndex(hd);
                var fly = this.fly(hd);
                this.activeHdRegion = fly.getRegion();
                if(!(this.cm.isMenuDisabled(this.activeHdIndex) || fly.hasClass('grid-hd-group-cell'))){
                    fly.addClass('x-grid3-hd-over');
                    this.activeHdBtn = fly.child('.x-grid3-hd-btn');
                    if(this.activeHdBtn){
                        this.activeHdBtn.dom.style.height = (hd.firstChild.offsetHeight - 1) + 'px';
                    }
                }
            }
        },

        handleHdOut: function(e, t){
            var hd = this.findHeaderCell(t);
            if(hd && (!Ext.isIE || !e.within(hd, true))){
                this.activeHdRef = null;
                this.fly(hd).removeClass('x-grid3-hd-over');
                hd.style.cursor = '';
            }
        },

        handleHdMenuClick: function(item){
            var index = this.hdCtxIndex, cm = this.cm, ds = this.ds, id = item.getItemId();
            switch(id){
                case 'asc':
                    ds.sort(cm.getDataIndex(index), 'ASC');
                    break;
                case 'desc':
                    ds.sort(cm.getDataIndex(index), 'DESC');
                    break;
                case 'columns':
	            	this.columnMenuClick(item);
	            	break;
                default:
                    if(id.substr(0, 6) == 'group-'){
                        var i = id.split('-'), row = parseInt(i[1], 10), col = parseInt(i[2], 10), r = this.cm.rows[row], group, gcol = 0;
                        for(var i = 0, len = r.length; i < len; i++){
                            group = r[i];
                            if(col >= gcol && col < gcol + group.colspan){
                                break;
                            }
                            gcol += group.colspan;
                        }
                        if(item.checked){
                            var max = cm.getColumnsBy(this.isHideableColumn, this).length;
                            for(var i = gcol, len = gcol + group.colspan; i < len; i++){
                                if(!cm.isHidden(i)){
                                    max--;
                                }
                            }
                            if(max < 1){
                                this.onDenyColumnHide();
                                return false;
                            }
                        }
                        for(var i = gcol, len = gcol + group.colspan; i < len; i++){
                            if(cm.config[i].fixed !== true && cm.config[i].hideable !== false){
                                cm.setHidden(i, item.checked);
                            }
                        }
                    }else if(id.substr(0, 4) == 'col-'){
                        index = cm.getIndexById(id.substr(4));
                        if(index != -1){
                            if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
                                this.onDenyColumnHide();
                                return false;
                            }
                            cm.setHidden(index, item.checked);
                        }
                    }
                    if(id.substr(0, 6) == 'group-' || id.substr(0, 4) == 'col-'){
                        item.checked = !item.checked;
                        if(item.menu){
                            var updateChildren = function(menu){
                                menu.items.each(function(childItem){
                                    if(!childItem.disabled){
                                        childItem.setChecked(item.checked, false);
                                        if(childItem.menu){
                                            updateChildren(childItem.menu);
                                        }
                                    }
                                });
                            }
                            updateChildren(item.menu);
                        }
                        var parentMenu = item, parentItem;
                        while(parentMenu = parentMenu.parentMenu){
                            if(!parentMenu.parentMenu || !(parentItem = parentMenu.parentMenu.items.get(parentMenu.getItemId())) || !parentItem.setChecked){
                                break;
                            }
                            var checked = parentMenu.items.findIndexBy(function(m){
                                return m.checked;
                            }) >= 0;
                            parentItem.setChecked(checked, true);
                        }
                        item.checked = !item.checked;
                    }
            }
            return true;
        },

        beforeColMenuShow: function(){
            var cm = this.cm, rows = this.cm.rows;
            this.colMenu.removeAll();
            for(var col = 0, clen = cm.getColumnCount(); col < clen; col++){
                var menu = this.colMenu, title = cm.getColumnHeader(col), text = [];
                if(cm.config[col].fixed !== true && cm.config[col].hideable !== false){
                    for(var row = 0, rlen = rows.length; row < rlen; row++){
                        var r = rows[row], group, gcol = 0;
                        for(var i = 0, len = r.length; i < len; i++){
                            group = r[i];
                            if(col >= gcol && col < gcol + group.colspan){
                                break;
                            }
                            gcol += group.colspan;
                        }
                        if(group && group.header){
                            if(cm.hierarchicalColMenu){
                                var gid = 'group-' + row + '-' + gcol,
                                    item = menu.items ? menu.getComponent(gid) : null,
                                    submenu = item ? item.menu : null;
                                if(!submenu){
                                    submenu = new Ext.menu.Menu({
                                        itemId: gid
                                    });
                                    submenu.on("itemclick", this.handleHdMenuClick, this);
                                    var checked = false, disabled = true;
                                    for(var c = gcol, lc = gcol + group.colspan; c < lc; c++){
                                        if(!cm.isHidden(c)){
                                            checked = true;
                                        }
                                        if(cm.config[c].hideable !== false){
                                            disabled = false;
                                        }
                                    }
                                    menu.add({
                                        itemId: gid,
                                        text: group.header,
                                        menu: submenu,
                                        hideOnClick: false,
                                        checked: checked,
                                        disabled: disabled
                                    });
                                }
                                menu = submenu;
                            }else{
                                text.push(group.header);
                            }
                        }
                    }
                    text.push(title);
                    menu.add(new Ext.menu.CheckItem({
                        itemId: "col-" + cm.getColumnId(col),
                        text: text.join(' '),
                        checked: !cm.isHidden(col),
                        hideOnClick: false,
                        disabled: cm.config[col].hideable === false
                    }));
                }
            }
        },

        afterRenderUI: function(){
            this.constructor.prototype.afterRenderUI.apply(this, arguments);
            Ext.apply(this.columnDrop, Ext.grid.ColumnHeaderGroup.prototype.columnDropConfig);
            Ext.apply(this.splitZone, Ext.grid.ColumnHeaderGroup.prototype.splitZoneConfig);
        }
    },

    splitZoneConfig: {
        allowHeaderDrag: function(e){
            return !e.getTarget(null, null, true).hasClass('grid-hd-group-cell');
        }
    },

    columnDropConfig: {
        getTargetFromEvent: function(e){
            var t = Ext.lib.Event.getTarget(e);
            return this.view.findHeaderCell(t);
        },

        positionIndicator: function(h, n, e){
            var data = Ext.grid.ColumnHeaderGroup.prototype.getDragDropData.call(this, h, n, e);
            if(data === false){
                return false;
            }
            var px = data.px + this.proxyOffsets[0];
            this.proxyTop.setLeftTop(px, data.r.top + this.proxyOffsets[1]);
            this.proxyTop.show();
            this.proxyBottom.setLeftTop(px, data.r.bottom);
            this.proxyBottom.show();
            return data.pt;
        },

        onNodeDrop: function(n, dd, e, data){
            var h = data.header;
            if(h != n){
                var d = Ext.grid.ColumnHeaderGroup.prototype.getDragDropData.call(this, h, n, e);
                if(d === false){
                    return false;
                }
                var cm = this.grid.colModel, right = d.oldIndex < d.newIndex, rows = cm.rows;
                for(var row = d.row, rlen = rows.length; row < rlen; row++){
                    var r = rows[row], len = r.length, fromIx = 0, span = 1, toIx = len;
                    for(var i = 0, gcol = 0; i < len; i++){
                        var group = r[i];
                        if(d.oldIndex >= gcol && d.oldIndex < gcol + group.colspan){
                            fromIx = i;
                        }
                        if(d.oldIndex + d.colspan - 1 >= gcol && d.oldIndex + d.colspan - 1 < gcol + group.colspan){
                            span = i - fromIx + 1;
                        }
                        if(d.newIndex >= gcol && d.newIndex < gcol + group.colspan){
                            toIx = i;
                        }
                        gcol += group.colspan;
                    }
                    var groups = r.splice(fromIx, span);
                    rows[row] = r.splice(0, toIx - (right ? span : 0)).concat(groups).concat(r);
                }
                for(var c = 0; c < d.colspan; c++){
                    var oldIx = d.oldIndex + (right ? 0 : c), newIx = d.newIndex + (right ? -1 : c);
                    cm.moveColumn(oldIx, newIx);
                    this.grid.fireEvent("columnmove", oldIx, newIx);
                }
                return true;
            }
            return false;
        }
    },

    getGroupStyle: function(group, gcol){
    	var width = 0, hidden = true;
        for(var i = gcol, len = gcol + group.colspan; i < len; i++){
            if(!this.cm.isHidden(i)){
                var cw = this.cm.getColumnWidth(i);
                if(typeof cw == 'number'){
                    width += cw;
                }
                hidden = false;
            }
        }
        return {
            width: (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2) ? width : Math.max(width - this.borderWidth, 0)) + 'px',
            hidden: hidden
        };
    },

    updateGroupStyles: function(col){
        var tables = this.mainHd.query('.x-grid3-header-offset > table'), tw = this.getTotalWidth(), rows = this.cm.rows;
        for(var row = 0; row < tables.length; row++){
            tables[row].style.width = tw;
            if(row < rows.length){
                var cells = tables[row].firstChild.firstChild.childNodes;
                for(var i = 0, gcol = 0; i < cells.length; i++){
                    var group = rows[row][i];
                    if((typeof col != 'number') || (col >= gcol && col < gcol + group.colspan)){
                        var gs = Ext.grid.ColumnHeaderGroup.prototype.getGroupStyle.call(this, group, gcol);
                        cells[i].style.width = gs.width;
                        cells[i].style.display = gs.hidden ? 'none' : '';
                    }
                    gcol += group.colspan;
                }
            }
        }
    },

    getGroupRowIndex: function(el){
        if(el){
            var m = el.className.match(this.hrowRe);
            if(m && m[1]){
                return parseInt(m[1], 10);
            }
        }
        return this.cm.rows.length;
    },

    getGroupSpan: function(row, col){
        if(row < 0){
            return {
                col: 0,
                colspan: this.cm.getColumnCount()
            };
        }
        var r = this.cm.rows[row];
        if(r){
            for(var i = 0, gcol = 0, len = r.length; i < len; i++){
                var group = r[i];
                if(col >= gcol && col < gcol + group.colspan){
                    return {
                        col: gcol,
                        colspan: group.colspan
                    };
                }
                gcol += group.colspan;
            }
            return {
                col: gcol,
                colspan: 0
            };
        }
        return {
            col: col,
            colspan: 1
        };
    },

    getDragDropData: function(h, n, e){
        if(h.parentNode != n.parentNode){
            return false;
        }
        var cm = this.grid.colModel, x = Ext.lib.Event.getPageX(e), r = Ext.lib.Dom.getRegion(n.firstChild), px, pt;
        if((r.right - x) <= (r.right - r.left) / 2){
            px = r.right + this.view.borderWidth;
            pt = "after";
        }else{
            px = r.left;
            pt = "before";
        }
        var oldIndex = this.view.getCellIndex(h), newIndex = this.view.getCellIndex(n);
        if(cm.isFixed(newIndex)){
            return false;
        }
        var row = Ext.grid.ColumnHeaderGroup.prototype.getGroupRowIndex.call(this.view, h),
            oldGroup = Ext.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row, oldIndex),
            newGroup = Ext.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row, newIndex),
            oldIndex = oldGroup.col;
            newIndex = newGroup.col + (pt == "after" ? newGroup.colspan : 0);
        if(newIndex >= oldGroup.col && newIndex <= oldGroup.col + oldGroup.colspan){
            return false;
        }
        var parentGroup = Ext.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row - 1, oldIndex);
        if(newIndex < parentGroup.col || newIndex > parentGroup.col + parentGroup.colspan){
            return false;
        }
        return {
            r: r,
            px: px,
            pt: pt,
            row: row,
            oldIndex: oldIndex,
            newIndex: newIndex,
            colspan: oldGroup.colspan
        };
    }
});