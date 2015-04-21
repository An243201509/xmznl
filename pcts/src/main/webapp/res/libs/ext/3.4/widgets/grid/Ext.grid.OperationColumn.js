
Ext.grid.OperationColumn = Ext.extend(Ext.util.Observable,{
	
	baseCls : 'sofa-grid-operation',
	printable : false,
	sortable : false,
	fixed : false,
	hideable : false,
	menuDisabled : false,

	dataIndex : 'checked',
	createdIndex : 'lastEditorId',
	otherCreatedIndex : 'creatorId',

	idIndex : 'id',
	id : 'operation',
	align : 'center',
	alias : 'ids',
	useDefault : true,
	baseUrl : '',
	
	anchors : [{
		id : 'view',
		visible : true
	}, {
		id : 'edit',
		visible : true
	}, 
	{
		id : 'check',
		visible : true
	}, {
		id : 'uncheck',
		visible : true
	}, {
		id : 'del',
		visible : true
	}, 
	{
		id : 'review',
		visible : false
	}, {
		id : 'unreview',
		visible : false
	},
	{
		id : 'history',
		visible : false
	},{
		id : 'copy',
		visible : true
	}],
	
	mixed : undefined,
	
	ACL : undefined,

	init : function(grid) {
		
		var me = this;
		
		me.grid = grid;
		
		var view = me.grid.getView();
		
		if (!this.width) {
		
			view.on('refresh', function(){
	
				view.adjustColumnWidth(me.id);
				
			});
		
		}
		
		me.grid.checkedBind = me.dataIndex;
		
		me.grid.createdBind = me.createdIndex;
		
	},

	processEvent : function(name, e, grid, rowIndex, colIndex) {
		if (name == 'mousedown' && e.button == 0) {
			e.stopEvent();
			this.onMouseDown.call(this, e, grid);
		}
		return false;
	},

	constructor : function(config) {
		
		Ext.apply(this, config);
		
		var ctxParams = sofa.context.getConfig('OPERATION.PARAMS');
		
		var useAudit = sofa.context.useAudit();
		
		if (!sofa.api.empty(ctxParams)) {
			ctxParams = ctxParams.split(',');
		} else {
			ctxParams = [];
		}
		
		Ext.applyIf(this, {
			header : this.headerText
		});
		
		if (this.bindACL) {
			this.ACL = (typeof this.bindACL == 'string' ? Ext.getCmp(this.bindACL) : this.bindACL);
		}

		this.mixed = new Ext.util.MixedCollection({});

		var fn_method = function(r, param) {
			if (Ext.isEmpty(this.dataIndex))
				return true;
			if (/del|delete|^check$|^review$|edit/.test(param.id)) {
				if (r.get(this.dataIndex) == false || !useAudit)
					return true;
				else
					return false;
			} else if (/unreview|uncheck/.test(param.id)) {
				if (r.get(this.dataIndex) == false || !useAudit)
					return false;
				else
					return true;
			} else {
				return true;
			}
		};
		var getRenderer = function(anchor, fn) {
			var id = anchor.id;
			if (id && anchor.visible) {
				// 需要权限判断显示
				if (this.ACL) {
					return function(r, param, meta) {
						var code = anchor[sofa.ACL.CODE];
						var result = this.ACL.validate(
								(code ? code : sofa.ACL[id.toUpperCase()]),
								this.dataBindACL ? r.get(this.dataBindACL) : null,
								this.dataTypeACL);
						if (result) {
							if (fn) {
								if (fn_method.call(this, r, param) !== false) {
									return fn.call(this, r, param, meta);
								}
								return false;
							} else {
								return fn_method.call(this, r, param);
							}
						}
						return result;
					};
				} else {
					// 不需要权限判断
					return function(r, param, meta) {
						if (fn) {
							if (fn_method.call(this, r, param) !== false) {
								return fn.call(this, r, param, meta);
							}
							return false;
						} else {
							return fn_method.call(this, r, param);
						}
					};
				}
			}
		};

		var getVisible = function(anchor) {
			if (anchor.visible == undefined || anchor.visible == null)
				return true;
			if (typeof anchor.visible == 'string')
				return eval(anchor.visible);
			return anchor.visible;
		};
		
		var baseParams = {}, index = 0;
		if (this.useDefault) {
			Ext.each(this.anchors, function(anchor) {
				baseParams[anchor.id] = {
					id : anchor.id,
					action : undefined,
					index : index++,
					visible : getVisible.call(this, anchor),
					renderer : getRenderer.call(this, anchor)
				};
			}, this);
		}
		
		if (this.params) {
			Ext.each(this.params, function(param) {
				var id = param.id.toLowerCase();
				param.id = id;
				param.visible = getVisible.call(this, param);

				// 2012-6 审核、反审核、删除、复核、反复核等不出现在operation里
				// 2012-12 民生客户不同意operation取消这些功能
				// 2013-2-19 有更新（215行代码）
				/*if (/del|delete|^check$|^uncheck$|^review$|^unreview$/.test(id)) {
					return;
				}*/
				if (param.renderer) {
					param.renderer = getRenderer.call(this, param, eval(param.renderer));
				} else {
					param.renderer = getRenderer.call(this, param);
				}

				baseParams[id] = Ext.apply(baseParams[id] || {}, param);
			}, this);
		}
		
		for (var name in baseParams) {
			
			var param = baseParams[name];

			// 2013-2-19 改为使用配置显示操作
			if (/copy|view|edit|del|delete|^check$|^uncheck$|^review$|^unreview$/.test(id)) {
				if (ctxParams.indexOf(param.id) == -1) {
					continue;
				}
			}
			/* 2013-3-13 兴业现场反馈不需要历史，且编辑功能要显示出来
			// 如果启用流程状态
			if (sofa.api.getContext().useFlow()) {
				// 开启历史操作
				if (param.id == 'history') {
					param.visible = true;
				} 
				// 关闭编辑功能
				else if (param.id == 'edit') {
					param.visible = false;
				}
			}*/
			if (param.visible == false) {
				continue;
			}
			this.mixed.add(param.id, param);
		}
		
		this.mixed.sort('ASC', function(a, b) {
			if (!a.index) {
				return -1;
			}
			if (a.index > b.index) {
				return 1;
			} else if (a.index < b.index) {
				return -1;
			}
			return 0;
		});
		
		this.renderer = this.renderer.createDelegate(this);
		
		this.processEvent = this.processEvent.createDelegate(this);

		this.addEvents('beforeclick');
		
		Ext.grid.OperationColumn.superclass.constructor.call(this);
		
	},

	renderer : function(v, meta, record, rowIndex, colIndex, store) {
		
		var id = record.get(this.idIndex);
		
		id = id ? id : record.id;
		
		var div = document.createElement("div");
		
		var el = Ext.DomHelper.append(div, {
			tag : 'div',
			width : '100%',
			cls : this.baseCls
		}, true);

		var size = 0, rt = [];
		
		this.mixed.each(
				function(param) {
					if (param && param.renderer) {
						if (param.renderer.call(this, record, param, meta) !== false) {
							rt.push(this.createAnchor(param.id, record, param));
						}
					} else {
						rt.push(this.createAnchor(param.id, record, param));
					}
				}, this);

		Ext.each(rt, function(anchor) {
			
			var t = el.createChild(anchor), 
				param = this.mixed.get(anchor.name);
			
			if (size !== rt.length - 1) {
				el.createChild({
					tag : 'span',
					html : ' | '
				});
			}
			Ext.fly(t).set({
				'ext:id' : id,
				'ext:name' : param.id
			});
			size++;
			
		}, this);
		
		return div.innerHTML;
	},

	createAnchor : function(name, record, param) {
		var text = param && param.text !== undefined ? param.text : this.altText[name];
		return {
			tag : 'span', //'a'
			cls: 'anchor',
			//href : '#',
			//hideFocus : "on",
			title : text,
			html : text,
			onmouseover : "this.style.color='red';this.style.textDecoration='underline'",
			onmouseout : "this.style.color='';this.style.textDecoration='none'",
			name : param.id,
			index : param.index
		}
	},

	callback : function(msg, grid, param, success, node) {
		var subfixFn = function(cb) {
			if (cb && typeof cb == 'string') {
				if (cb.indexOf('(') > -1) {
					return cb.replace(/\(.*\)/g, '');
				}
				return cb;
			}
			return undefined;
		};
		// 准备回调函数
		var id = param.id;
		var cb = param.onCallback || subfixFn(param.callback);
		var fn = function() {
			try {
				if ((cb ? eval(cb)(this, success, msg) : true) !== false) {
					if (grid instanceof Ext.grid.GridPanel) {
						grid.reload();
					} else if (grid instanceof Ext.tree.TreeGrid) {
						if (id == 'del') {
							grid.removeNode([].concat(node));
						} else {
							grid.refresh([].concat(node));
						}
					}
				}
			} catch (e) {
				Ext.handleError(new Ext.Error(e.message));
				return false;
			}
		};
		var getMessage = function(msg, defaultMsg) {
			// 转义HTML描述
			msg = Ext.util.Format.nl2br(msg);
			var pureMessage = Ext.util.Format.stripTags(msg)
					.trim();
			// 如果返回的信息为空，则使用默认封装提示信息
			if (Ext.isEmpty(pureMessage)) {
				msg = defaultMsg;
			}
			return msg;
		};
		// 如果请求成功
		if (success) {
			sofa.alert({
				title: this.alertText,
				msg : getMessage(msg, this.successText[id]),
				fn : fn,
				scope : this
			});
		}
		// 如果请求失败
		else {
			var json = {};
			try {
				json = Ext.decode(msg);
			} catch (e) {
				json = {
					summary : msg,
					detail : ''
				};
			}
			sofa.error({
				msg : getMessage(json.summary,
						this.failureText[id]),
				detail : Ext.util.Format.nl2br(json.detail),
				fn : fn,
				scope : this
			});
		}
	},

	onMouseDown : function(e, grid) {
		
		if (grid.isLock()) {
			return;
		} 
		var t;
		
		if (t = e.getTarget()) {
			
			var wrap = Ext.fly(t);
			
			var id = wrap.getAttributeNS('ext', 'id');
			
			var name = wrap.getAttributeNS('ext', 'name');
			
			if (id && name) {
				
				var param = this.mixed.get(name),
					record,
					node;
				
				if (grid instanceof Ext.grid.GridPanel) {
					
					record = grid.getStore().getById(id);
					
				}
				
				if (record && record.record) {
					record = record.record;
					node = record;
				}
				
				if (param) {
					
					var events = param.listeners || {};
					
					if (record) {
						json = record.toJSON();
					}
					
					if (this.fireEvent('beforeclick', param.id, json, record) == false) {
						return;
					}
					
					if (events.click) {
						
						eval(events.click)(json, record);
						
					} else if (/del|check|uncheck|recheck|unrecheck/ig.test(name)) {
					
						if (param.action) {
							
							// fire param events #beforesubmit
							if (events.beforesubmit && eval(events.beforesubmit)(json, node ? node : record) == false) {
								return;
							}
							
							if (/check|uncheck/ig.test(name)) {
								// TODO 不能审核自己
								var creator = record.get(this.createdIndex);
								if (Ext.isEmpty(creator)) {
									creator = record.get(this.otherCreatedIndex);
								}
								if (!Ext.DEBUG && creator == sofa.getContext().getUserId()) {
									sofa.alert(String.format(this.trigFireText, this.altText[name]));
									return;
								}
							}

							sofa.confirm(this.confirmText + this.altText[name],
									function(btn) {
										if (btn == 'yes') {
											this.doAction.defer(10, this, [id, param, grid, node]);
										}
									}, this);
							
						}
					}
				}
			}
		}
	},

	doAction : function(id, param, grid, node) {
		Ext.MessageBox.wait(this.waitMsg, this.waitText);
		var url = this.baseUrl + param.action;
		if (/\{\w+?\}/ig.test(url)) {
			url = url.replace(/\{\w+?\}/ig, id);
		}
		Ext.Ajax.request({
			url : url,
			method : 'post',
			params : (param['alias'] ? param['alias'] : this.alias)+ "=" + id,
			scope : this,
			success : function(xhr, opts) {
				this.callback.call(this, xhr.responseText, grid, param, true, node);
			},
			failure : function(xhr, opts) {
				this.callback.call(this, xhr.responseText, grid, param, false, node);
			}
		});
	}
});

Ext.grid.OperationModel = Ext.grid.OperationColumn;