/**
 * ZhangTao extend ExtJs 3.4
 */
Ext.ns('sofa', 'sofa.global', 'sofa.context', 'sofa.msg', 'sofa.grid.ACL', 'sofa.Window', 'sofa.grid', 'sofa.tree', 'sofa.form', 'sofa.search', 'sofa.dir', 'sofa.ACL');
/**
 * sofa全局变量
 */
sofa.global = function() {
	var path = "http://127.0.0.1:8080/pcts/";// CONTEXT.PATH;
	var init = function() {
		path = "http://127.0.0.1:8080/pcts/";// CONTEXT.PATH;
	}();

	return {
		getAppBase : function() {
			return path.base;
		},

		getBaseURL : function(contextPath) {
			if ('sofa-portal' == contextPath) {
				return path.portal;
			} else if ('sofa-webclient' == contextPath) {
				return path.webclient;
			} else if ('sofa-authorization' == contextPath) {
				return path.authorization;
			} else if ('engine-web' == contextPath) {
				return path.engineweb;
			} else if ('sofa-basalinfo' == contextPath) {
				return path.basalinfo;
			}
			return path.sharedResource;
		}
	}
}();

/**
 * SOFA 上下文信息
 */
sofa.context = function() {
	var userid, username, app = {}, serverDate, audit = false, workflow = {}, config = {};
	var init = function() {
		// 用户id
		userid = '1';
		// 用户名称
		username = 'admin';
		// 使用审核功能，默认不启用
		audit = false;
		config = {};
		serverDate = '2014-11-26';// Date.parseDate('2014-11-26', 'Y-m-d');
		workflow = {
			// 启用流程，默认不启用
			useFlow : false,
		// 页面操作所对应的流程定义 processDefinitions : {};
		}
	}();

	return {
		getUserId : function() {
			return userid;
		},
		getUserName : function() {
			return username;
		},
		getServerDate : function() {
			return serverDate;
		},
		useFlow : function() {
			return workflow.useFlow;
		},
		useAudit : function() {
			return audit;
		},
		getProcessDefinitionsByOperation : function(operationCode) {
			// var pds = workflow.processDefinitions[operationCode];
			// if (!pds)
			// pds = [];
			// return pds;
			return [];
		},

		getConfig : function(key) {
			var value = config[key];
			if (value == "true") {
				return true;
			} else if (value == "false") {
				return false;
			}
			return value;
		}

	};

}();

Ext.apply(sofa, {
	alert : function(msg, fn, scope) {
		if (Ext.isObject(arguments[0])) {
			Ext.Msg.show(Ext.apply(arguments[0], {
				icon : Ext.Msg.INFO,
				buttons : Ext.Msg.OK
			}));
		} else {
			Ext.Msg.show({
				icon : Ext.Msg.INFO,
				title : sofa.msg.alertText,
				msg : msg,
				fn : fn,
				scope : scope,
				buttons : Ext.Msg.OK
			});
		}
	},
	error : function(title, msg, fn, scope) {
		if (Ext.isObject(arguments[0])) {
			Ext.Msg.show(Ext.apply(arguments[0], {
				icon : Ext.Msg.ERROR,
				buttons : Ext.Msg.OK
			}));
		} else {
			var summary, detail, format = function(text) {
				return String(text).replace(/<\/?[^>]+>/gi, "\r").replace(/\r+/g, "<br>").replace(/^(\<br\>)*/ig, "").replace(/(<br>(\r|\s)*){1,}/ig, "<br>");
			};
			try {
				msg = Ext.decode(msg);

				detail = format(msg.detail) + '<hr>' + format(msg.position);

				summary = format(msg.summary);

			} catch (e) {
				if (Ext.isObject(msg)) {
					msg = Ext.encode(msg);
				}
				summary = format(msg);
			}
			Ext.Msg.show({
				icon : Ext.Msg.ERROR,
				title : title,
				msg : summary,
				detail : detail,
				fn : fn,
				scope : scope,
				buttons : Ext.DEBUG && !Ext.isEmpty(detail) ? Ext.Msg.OKDETAIL : Ext.Msg.OK
			});
		}
	},
	confirm : function(msg, fn, scope) {
		if (Ext.isObject(arguments[0])) {
			Ext.Msg.show(Ext.apply(arguments[0], {
				icon : Ext.MessageBox.QUESTION,
				buttons : Ext.MessageBox.YESNO
			}));
		} else {
			Ext.Msg.confirm(sofa.msg.confirmText, msg, fn, scope);
		}
	},
	prompt : function(title, msg, fn, scope) {
		if (Ext.isObject(arguments[0])) {
			Ext.Msg.prompt(arguments[0]);
		} else {
			Ext.Msg.prompt(title, msg, fn, scope);
		}
	}
});

/*
 * sofa.FieldSet = Ext.extend(Ext.form.FieldSet, {
 * 
 * onRender : function(ct, position) {
 * 
 * this.body = Ext.get(this.renderTo || this.applyTo);
 * 
 * this.body.addClass(this.baseCls + '-body');
 * 
 * this.el = this.body.wrap({ id : this.id, tag : 'fieldset' });
 * 
 * if (this.title || this.header || this.checkboxToggle) { this.header =
 * this.el.createChild({ tag : 'legend', cls : this.baseCls + '-header' },
 * this.body); }
 * 
 * Ext.form.FieldSet.superclass.onRender.call(this, ct, position);
 * 
 * if (this.checkboxToggle) { var o = typeof this.checkboxToggle == 'object' ?
 * this.checkboxToggle : { tag : 'input', type : 'checkbox', name :
 * this.checkboxName || this.id + '-checkbox' }; this.checkbox =
 * this.header.insertFirst(o); this.checkbox.dom.checked = !this.collapsed;
 * this.mon(this.checkbox, 'click', this.onCheckClick, this); }
 * 
 * if (this.src) { this.srcEl = this.body.createChild({ tag : 'iframe',
 * frameborder : 0 }); this.srcEl.dom.src = this.src; } }
 * 
 * });
 */

sofa.Toolbar = Ext.extend(Ext.Container, {
	useDefault : true,
	labelText : '',
	baseUrl : '',
	buttonSelector : 'div.sofa-toolbar-wrap',
	navSelector : '.sofa-toolbar-label',
	buttonText : {},

	idBind : 'id',
	alias : 'ids',
	checkedBind : 'checked',
	createdBind : 'lastEditorId',
	otherCreatedBind : 'creatorId',
	locationParam : '_location',

	displayLocation : true,
	buttonAlign : 'right',
	separator : '\u25B7', // \u25BA
	tools : [ {
		id : "add",
		visible : true
	}, {
		id : "check",
		visible : true
	}, {
		id : "uncheck",
		visible : true
	}, {
		id : "del",
		visible : true
	}, {
		id : "print",
		visible : true
	}, {
		id : "excel",
		visible : true
	}, {
		id : "word",
		visible : false
	}, {
		id : "download",
		visible : false
	}, {
		id : "confirm",
		visible : false
	}, {
		id : "calculate",
		visible : false
	}, {
		id : "recheck",
		visible : false
	}, {
		id : "unrecheck",
		visible : false
	}, {
		id : "update",
		visible : false
	} ],

	constructor : function(config) {

		Ext.apply(this, config);

		this.addEvents('beforeclick');

		sofa.Toolbar.superclass.constructor.call(this);

	},

	setLocation : function(_location) {
		if (_location && this.navEl) {
			_location = decodeURIComponent(_location);
			if (!sofa.api.empty(_location)) {
				var separated = false, value;
				var arr = _location.split(',');
				for (var i = 0; i < arr.length; i++) {
					value = arr[i];
					if (separated) {
						this.navEl.createChild({
							tag : 'span',
							cls : 'sofa-toolbar-location-separator',
							html : this.separator
						});
					}
					this.navEl.createChild({
						tag : 'span',
						cls : (separated ? 'sofa-toolbar-location-last' : ''),
						html : value
					});
					separated = true;
				}
				this.navEl.dom.title = Ext.util.Format.stripTags(this.navEl.dom.innerHTML);
				document.title = value;
			}
		} else if (this.navEl) {
			this.navEl.dom.innerHTML = '';
		}
	},
	getLocation : function() {
		var url = window.location.href;
		var params = url.substring(url.indexOf("?") + 1, url.length).split("&");
		for (var i = 0; str = params[i]; i++) {
			if (str.substring(0, str.indexOf("=")) == this.locationParam) {
				return str.substring(str.indexOf("=") + 1, str.length);
			}
		}
	},
	fireResize : function(w, h) {
		this.onResize(w);
	},
	initComponent : function() {

		sofa.Toolbar.superclass.initComponent.call(this);

		Ext.EventManager.onWindowResize(this.fireResize, this);

		this.tpl = new Ext.XTemplate('<table class="sofa-toolbar-location"><tr>', (this.displayLocation ? '<td><div class="sofa-toolbar-label">{label}</div></td>' : ''), '<td style="text-align:{align}"><div class="{css}"></div></td></tr></table>');
		this.toolbtns = new Ext.util.MixedCollection({});
		this.mixed = new Ext.util.MixedCollection({});
		var baseParams = {}, index = 0;
		this.btns = [];
		if (this.bindACL) {
			this.ACL = (typeof this.bindACL == 'string' ? Ext.getCmp(this.bindACL) : this.bindACL);
		}
		if (this.useDefault) {
			Ext.each(this.tools, function(tool) {
				var id = tool.id;
				baseParams[id] = {
					id : id,
					index : index++,
					text : this.buttonText[id],
					iconCls : 'sofa-toolbar-' + id,
					overCls : 'sofa-toolbar-' + id + '-over',
					visible : tool.visible
				};
			}, this);
		}
		if (this.buttons) {
			Ext.each(this.buttons, function(cfg) {
				// cfg{id text index visible overcls iconcls onClick|handler}
				var id = cfg.id;

				var handler = undefined;

				if (cfg.index && typeof cfg.index == 'string')
					cfg.index = parseInt(cfg.index);

				if (cfg.visible && typeof cfg.visible == 'string')
					cfg.visible = eval(cfg.visible);

				Ext.applyIf(cfg, {
					text : cfg.text || this.buttonText[id],
					handler : this.onClick,
					iconCls : 'sofa-toolbar-' + id,
					overCls : 'sofa-toolbar-' + id + '-over'
				});

				baseParams[id] = Ext.apply(baseParams[id] || {}, cfg);

			}, this);
		}
		for ( var name in baseParams) {
			var param = baseParams[name];
			// 12-10-26 启用流程状态，屏蔽掉审核、复核等操作
			if (sofa.api.getContext().useFlow() && /^check$|uncheck|^recheck|unrecheck/ig.test(param.id)) {
				continue;
			}
			if (/add|^check$|uncheck|del/ig.test(param.id) || param[sofa.ACL.CODE]) {
				var code = param[sofa.ACL.CODE];
				if (this.ACL && this.ACL.validate(code ? code : sofa.ACL[param.id.toUpperCase()]) !== true) {
					continue;
				}
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
	},

	getTemplateArgs : function() {
		return {
			css : 'sofa-toolbar-wrap',
			label : this.labelText,
			align : this.buttonAlign
		};
	},

	onRender : function(ct, position) {
		sofa.Toolbar.superclass.onRender.call(this, ct, position);
		this.el.addClass('sofa-toolbar');
		if (this.tpl) {
			this.tpl.append(this.el, this.getTemplateArgs(), true);
			this.navEl = this.el.child(this.navSelector);
			this.btnEl = this.el.child(this.buttonSelector);
			// this.btnEl.setStyle("float", this.buttonAlign);
			/*
			 * if(this.buttonAlign == 'center'){
			 * this.btnEl.setStyle('text-align', 'center'); }
			 */
			this.setLocation(this.getLocation());
			this.mixed.each(function(btnCfg) {
				this.addToolbtn(btnCfg);
			}, this);
		}
		this.onResize(this.el.getWidth());
	},

	onResize : function(w) {
		if (this.navEl && w) {
			this.navEl.setWidth(w - this.btnEl.getWidth() - 15);
		}
	},

	setVisible : function(id, visible) {
		var btn = this.toolbtns.get(id);
		if (btn && visible == true) {
			btn.show();
		} else if (btn && visible == false) {
			btn.hide();
		}
		this.onResize(this.el.getWidth());
	},
	addToolbtn : function(btnCfg) {
		var btn = this.btnEl.createChild({
			tag : 'span',
			html : btnCfg.text,
			cls : 'sofa-toolbar-button ' + (btnCfg.cls ? btnCfg.cls : '')
		});
		btn.setVisibilityMode(Ext.Element.DISPLAY);
		if (btnCfg.visible == false)
			btn.hide();
		if (btnCfg.iconCls)
			btn.addClass(btnCfg.iconCls);
		if (btnCfg.overCls)
			btn.addClassOnOver(btnCfg.overCls);
		if (btnCfg.handler)
			btn.addListener('click', btnCfg.handler.createDelegate(this, [ Ext.apply({}, btnCfg) ]));
		this.toolbtns.add(btnCfg.id, btn);
	},
	onClick : function(btnCfg) {
		if (this.fireEvent('beforeclick', btnCfg.id) == false) {
			return false;
		}
		if (this.bindGrid && btnCfg) {
			var btnId = btnCfg.id;
			var btn = this.toolbtns.get(btnId);
			var grid = Ext.getCmp(this.bindGrid);
			var idBind = grid.idBind ? grid.idBind : this.idBind;
			var checkedBind = grid.checkedBind ? grid.checkedBind : this.checkedBind;
			var createdBind = grid.createdBind ? grid.createdBind : this.createdBind;
			var otherCreatedBind = this.otherCreatedBind;
			if (btnCfg.onClick) {
				eval(btnCfg.onClick)(btnCfg);
			}
			// print
			else if (/print/.test(btnId)) {
				var baseUrl = btnCfg.url || sofa.global.getBaseURL('sofa-webclient') || (document.location.host + '/sofa-webclient/');
				sofa.api.print({
					url : baseUrl,
					grid : grid,
					onBeforeSubmit : btnCfg.onBeforeSubmit
				});
			}
			// export
			else if (/excel/.test(btnId)) {
				var baseUrl = btnCfg.url || sofa.global.getBaseURL('sofa-webclient') || (document.location.host + '/sofa-webclient/');
				sofa.api.exportFile({
					url : baseUrl,
					grid : grid,
					onBeforeSubmit : btnCfg.onBeforeSubmit
				});
			}
			// check del uncheck
			else if (/^check$|del|uncheck/ig.test(btnId)) {

				if (grid instanceof Ext.grid.GridPanel) {

					var records = [].concat(grid.getSelectionModel().getSelections());

				} else if (grid instanceof Ext.tree.TreePanel) {

					var records = [];
					Ext.each(grid.getChecked(), function(node) {
						records.push(node.record);
					});

				}

				var rs = [];

				Ext.each(records, function(r) {
					if (r.record) {
						rs.push(r.record);
					} else {
						rs.push(r);
					}
				});

				if (btnCfg.onBeforeSubmit) {
					if (eval(btnCfg.onBeforeSubmit)(rs, btnCfg) === false) {
						return;
					}
				}

				sofa.api.execute(Ext.apply({
					id : btnId,
					data : rs,
					url : this.baseUrl + (btnCfg.action ? btnCfg.action : ''),

					alias : this.alias,
					idField : idBind,
					auditedField : checkedBind,
					creatorField : otherCreatedBind,
					editorField : otherCreatedBind,

					callback : this.callback,
					scope : this
				}, btnCfg));

			}
		} else if (btnCfg.onClick) {
			eval(btnCfg.onClick)(btnCfg);
		}
	},
	callback : function(msg, param, success, rs) {
		var subfixFn = function(cb) {
			if (cb && typeof cb == 'string') {
				if (cb.indexOf('(') > -1) {
					return cb.replace(/\(.*\)/g, '');
				}
				return cb;
			}
			return undefined;
		};
		var cb = param.onCallback || subfixFn(param.callback);
		var grid = Ext.getCmp(this.bindGrid);

		var fn = function() {
			if ((cb ? eval(cb)(this, success, msg) : true) !== false) {
				if (grid instanceof Ext.grid.GridPanel) {
					grid.reload();
				} else if (grid instanceof Ext.tree.TreeGrid) {
					var nodes = [];
					Ext.each(rs, function(r) {
						nodes.push(r.node);
					}, this);
					if (param.id == 'del') {
						grid.removeNode(nodes);
					} else {
						grid.refresh(nodes);
					}
				}
			}
		};

		var getMessage = function(msg, defaultMsg) {
			// 转义HTML描述
			msg = Ext.util.Format.nl2br(msg);
			var pureMessage = Ext.util.Format.stripTags(msg).trim();
			// 如果返回的信息为空，则使用默认封装提示信息
			if (Ext.isEmpty(pureMessage)) {
				msg = defaultMsg;
			}
			return msg;
		};

		if (success) {
			sofa.alert({
				title : this.alertText,
				msg : getMessage(msg, this.successText[param.id]),
				fn : fn,
				scope : this
			});
		} else {

			var statusCode, detail, summary, format = function(text) {
				return String(text).replace(/<\/?[^>]+>/gi, "\r").replace(/\r+/g, "<br>").replace(/^(\<br\>)*/ig, "").replace(/(<br>(\r|\s)*){1,}/ig, "<br>");
			};

			try {

				msg = Ext.decode(msg);

				detail = format(msg.detail) + '<hr>' + format(msg.position);

				summary = format(msg.summary);

			} catch (e) {

				summary = format(Ext.encode(msg));
			}
			Ext.Msg.show({
				buttons : Ext.DEBUG && !Ext.isEmpty(detail) ? Ext.Msg.OKDETAIL : Ext.Msg.OK,
				icon : Ext.MessageBox.ERROR,
				title : (statusCode ? "[" + statusCode + "] " : "") + "批量操作失败",
				msg : summary,
				detail : detail ? detail : '',
				fn : fn,
				scope : this
			});
		}
	}
});

sofa.grid.CheckboxSelectionModel = Ext.extend(Ext.grid.CheckboxSelectionModel, {

	isLocked : Ext.emptyFn,

	handleMouseDown : function(g, rowIndex, e) {
		if (e.button !== 0 || this.isLocked()) {
			return;
		}
		var view = this.grid.getView();
		if (e.shiftKey && !this.singleSelect && this.last !== false) {
			var last = this.last;
			this.selectRange(last, rowIndex, e.ctrlKey);
			this.last = last;
			view.focusRow(rowIndex);
		} else {
			var isSelected = this.isSelected(rowIndex);
			if (isSelected) {
				this.deselectRow(rowIndex);
			} else if (!isSelected || this.getCount() > 1) {
				this.selectRow(rowIndex, true);
				view.focusRow(rowIndex);
			}
		}
	},

	regEvents : function() {
		var view = this.grid.getView();
		view.mainBody.on('mousedown', this.onMouseDown, this);
		if (view.lockedInnerHd) {
			Ext.fly(view.lockedInnerHd).on('mousedown', this.onHdMouseDown, this);
		} else {
			Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);
		}
	},

	initEvents : function() {

		Ext.grid.CheckboxSelectionModel.superclass.initEvents.call(this);

		this.grid.on('render', this.regEvents, this);

		// 如果只能通过checkbox选中，则增加点击高亮显示的效果
		if (this.checkOnly) {
			this.lastSelection = null;
			this.grid.on('rowclick', function(g, row, e) {
				var v = this.grid.getView();
				if (!Ext.isEmpty(this.lastSelection)) {
					v.removeRowClass(this.lastSelection, 'ext-grid3-row-highligh');
				}
				v.addRowClass(row, 'ext-grid3-row-highligh');
				this.lastSelection = row;
			}, this);
		}
	}

});

sofa.grid.RowSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {

	checkOnly : false,

	singleSelect : true,

	isLocked : Ext.emptyFn

});

sofa.grid.GridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	stateful : true,
	buffer : true,
	// 关闭远程查询排序
	remoteSort : false,
	border : false,
	initColumnModel : function() {
		var me = this;
		if (Ext.isEmpty(me.useLockingColumnModel)) {
			me.useLockingColumnModel = sofa.context.getConfig("GRID.LOCKING");
		}
		if (this.cm) {
			this.cm.destroy();
		}
		if (Ext.isArray(me.columns)) {
			Ext.each(me.columns, function(column) {
				if (column.sortable !== false) {
					column.sortable = true;
				}
			});
		} else {
			me.columns = [];
		}
		if (me.useRowNumberColumn != false) {
			me.rowNumber = new Ext.grid.RowNumberer({
				width : 35,
				locked : true
			});
		}
		var mapper, basalProxy, mappings = [];
		if (me.plugins && (me.useCRUDColumn || me.useCheckColumn)) {
			if (!Ext.isArray(me.plugins)) {
				me.plugins = [].concat(me.plugins);
			}
			for (var i = 0, len = me.plugins.length; i < len; i++) {
				var plugin = me.plugins[i];
				if (plugin instanceof Ext.mapper.Mapper) {
					mapper = plugin;
					if (!Ext.isArray(plugin.proxys)) {
						plugin.proxys = [].concat(plugin.proxys);
					}
					Ext.each(plugin.proxys, function(proxy) {
						if (proxy.url.indexOf('sofa-basalinfo/idmapping/mixed') > -1) {
							basalProxy = proxy;
							proxy.mapping = [].concat(proxy.mapping);
							var _mappings = [];
							Ext.each(proxy.mapping, function(mapping) {
								if (!/creatorId|checkerId|lastEditorId/i.test(mapping.from)) {
									_mappings.push(mapping);
								}
							});
							proxy.mapping = _mappings;
						}
					});
				} else if (plugin instanceof Ext.grid.RowExpander) {
					me.columns = [ plugin ].concat(me.columns);
				}
			}
		}

		if (me.useCRUDColumn) {
			var c = me.useCRUDColumn, format, wd, hidden = false;
			if (c.shortDate) {
				format = 'Y-m-d';
				wd = 80;
			} else {
				format = 'Y-m-d H:i:s';
				wd = 130;
			}
			if (c.visible == false) {
				hidden = true;
			}
			me.columns = me.columns.concat([
			{
				header : c.creator || '创建人',
				dataIndex : 'creatorName',
				hidden : hidden
			}, {
				header : c.createTime || '创建时间',
				width : wd,
				dataIndex : 'createTime',
				hidden : hidden
			/*
			 * , dateFormat: format, renderer:
			 * Ext.util.Format.dateRenderer(format)
			 */},
			{
				header : c.editor || '修改人',
				dataIndex : 'lastEditorName',
				hidden : hidden
			}, {
				header : c.editTime || '修改时间',
				width : wd,
				dataIndex : 'lastEditTime',
				hidden : hidden
			/*
			 * , dateFormat: format, renderer:
			 * Ext.util.Format.dateRenderer(format)
			 */}

			]);
			mappings = [ {
				from : 'creatorId',
				to : 'creatorName',
				type : 'user'
			}, {
				from : 'lastEditorId',
				to : 'lastEditorName',
				type : 'user'
			} ].concat(mappings);
		}

		if (me.useOtherCheckColumn) {
			var c = me.useOtherCheckColumn, hidden = false;
			if (c.visible == false) {
				hidden = true;
			}
			me.columns = me.columns.concat([
			{
				header : '复核状态',
				align : 'center',
				dataIndex : 'otherCheckStates',
				hidden : hidden,
				renderer : function(v) {
					if (v == '1') {
						return '已复核';
					} else {
						return '未复核';
					}
				}
			}, {
				header : '复核人',
				dataIndex : 'otherCheckerNames',
				hidden : hidden
			}, {
				header : '复核时间',
				dataIndex : 'otherCheckTimes',
				width : 130,
				hidden : hidden
			/*
			 * , dateFormat: format, renderer:
			 * Ext.util.Format.dateRenderer('Y-m-d H:i:s')
			 */}

			]);
			mappings = [ {
				from : 'otherCheckerIds',
				to : 'otherCheckerNames',
				type : 'user'
			} ].concat(mappings);
		}

		if (me.useCheckColumn) {
			var c = me.useCheckColumn, hidden = false;
			if (c.visible == false) {
				hidden = true;
			}
			me.columns = me.columns.concat([
			{
				header : '审核状态',
				align : 'center',
				dataIndex : 'checked',
				hidden : hidden,
				renderer : function(v) {
					if (v) {
						return '已审核';
					} else {
						return '未审核';
					}
				}
			}, {
				header : '审核人',
				dataIndex : 'checkerName',
				hidden : hidden
			}, {
				header : '审核时间',
				dataIndex : 'checkTime',
				width : 130,
				hidden : hidden
			/*
			 * , dateFormat: format, renderer:
			 * Ext.util.Format.dateRenderer('Y-m-d H:i:s')
			 */}
			]);
			mappings = [ {
				from : 'checkerId',
				to : 'checkerName',
				type : 'user'
			} ].concat(mappings);
		}
		if (me.useCRUDColumn || me.useCheckColumn) {
			if (!mapper && me.plugins) {
				var _mapper = [ new Ext.mapper.GridView({
					proxys : [ new Ext.mapper.MappingProxy({
						url : sofa.global.getBaseURL('sofa-basalinfo') + 'idmapping/mixed',
						mapping : mappings
					}) ]
				}) ];
				if (Ext.isArray(me.plugins)) {
					me.plugins = _mapper.concat(me.plugins);
				} else {
					me.plugins = _mapper;
				}
			} else if (mapper && !basalProxy) {
				if (!Ext.isArray(mapper.proxys)) {
					mapper.proxys = [].concat(mapper.proxys);
				}
				mapper.proxys.push(new Ext.mapper.MappingProxy({
					url : sofa.global.getBaseURL('sofa-basalinfo') + 'idmapping/mixed',
					mapping : mappings
				}));
			} else if (basalProxy) {
				if (Ext.isArray(basalProxy.mapping)) {
					basalProxy.mapping = basalProxy.mapping.concat(mappings);
				} else {
					basalProxy.mapping = mappings;
				}
				basalProxy.mappingFields();
			}
		}

		if (me.useExpireColumn) {
			var c = me.useExpireColumn, format, wd, hidden = false;
			if (c.shortDate) {
				format = 'Y-m-d';
				wd = 80;
			} else {
				format = 'Y-m-d H:i:s';
				wd = 130;
			}
			if (c.visible == false) {
				hidden = true;
			}
			me.columns = me.columns.concat([
			{
				header : (c.startTime || '开始时间'),
				dataIndex : 'startTime',
				width : wd,
				hidden : hidden
			/* , renderer: Ext.util.Format.dateRenderer(format) */}, {
				header : (c.endTime || '过期时间'),
				dataIndex : 'endTime',
				width : wd,
				hidden : hidden
			/* , renderer: Ext.util.Format.dateRenderer(format) */}
			]);
		}
		// if (me.editable) {
		// me.plugins = (me.plugins || []).concat(new Ext.grid.RowEditor());
		// }

		if (me.useOperationColumn) {
			me.operationColumn = new Ext.grid.OperationColumn(Ext.apply({
				locked : me.useLockingColumnModel ? true : false
			}, me.useOperationColumn));
			if (me.useLockingColumnModel) {
				me.columns = [ me.operationColumn ].concat(me.columns);
			} else {
				me.columns.push(me.operationColumn);
			}
			me.operationColumn.init(me);
		}
		if (me.rowNumber) {
			me.columns = [ me.rowNumber ].concat(me.columns);
		}
		this.getSelectionModel();

		if (me.selModel && me.selModel.isColumn) {
			me.columns = [ me.selModel ].concat(me.columns);
		}

		// column model
		if (me.useLockingColumnModel) {
			me.cm = new Ext.grid.LockingColumnModel(me.columns);
		} else {
			me.cm = new Ext.grid.ColumnModel(me.columns);
		}
	},

	getOperationColumn : function() {
		return this.operationColumn;
	},

	getSelectionModel : function() {
		if (!this.selModel) {
			// selection model
			if (this.multiSelect) {
				this.selModel = new sofa.grid.CheckboxSelectionModel({
					checkOnly : this.checkOnly || true
				});
			} else {
				this.selModel = new sofa.grid.RowSelectionModel();
			}
		}
		if (this.useLockingColumnModel) {
			this.selModel.locked = true;
		}
		return this.selModel;
	},
	initStore : function(cfg) {
		if (this.store) {
			this.store.destroy();
		}
		Ext.apply(this, cfg);
		var me = this, proxy;
		if (!me.fields) {
			me.fields = [];
		} else if (Ext.isArray(me.fields)) {
			me.fields = [].concat(me.fields);
		} else if (Ext.isString(me.fields)) {
			var fields = me.fields.split(',');
			me.fields = [];
			for (var i = 0; i < fields.length; i++) {
				me.fields.push({
					name : fields[i],
					mapping : fields[i]
				})
			}
		}

		// fields
		if (me.columns || me.cm) {
			Ext.each(me.columns || me.cm.config, function(c) {
				if (c.xtype == 'nodecolumn') {
					me.fields = [ {
						name : 'leaf',
						mapping : 'leaf',
						type : 'bool'
					}, {
						name : 'level',
						mapping : 'level',
						type : 'number'
					}, {
						name : 'depth',
						mapping : 'depth',
						type : 'number'
					} ].concat(me.fields);
				}

				if (!Ext.isEmpty(c.dataIndex)) {
					var field = {
						name : c.dataIndex,
						mapping : c.dataIndex
					};
					if (c.dateFormat) {
						field.type = 'date';
						field.dateFormat = c.dateFormat;
						if (!c.renderer) {
							c.renderer = Ext.util.Format.dateRenderer(c.dateFormat);
						}
					}
					me.fields.push(field);
				}
			});
		}

		if (me.useCRUDColumn) {
			me.fields = [ {
				name : 'deleted',
				mapping : 'deleted'
			}, {
				name : 'deleteUserId',
				mapping : 'deleteUserId'
			}, {
				name : 'markDeleteTime',
				mapping : 'markDeleteTime'
			} ].concat(me.fields);
		}

		if (me.useCheckColumn) {
			me.fields = [ {
				name : 'checkerId',
				mapping : 'checkerId'
			} ].concat(me.fields);
		}

		if (me.useOtherCheckColumn) {
			me.fields = [ {
				name : 'otherCheckerIds',
				mapping : 'otherCheckerIds'
			} ].concat(me.fields);
		}

		// proxy
		if (this.url) {
			// TODO
			if (sofa.api.crossDomain(this.url)) {
				proxy = new Ext.data.ScriptTagProxy({
					url : this.url
				});
			} else {
				proxy = new Ext.data.HttpProxy({
					url : this.url
				});
			}
		} else if (this.data || this.dataSource) {
			if (this.pageSize) {
				proxy = new Ext.data.PagingMemoryProxy(this.data || this.dataSource);
			} else {
				proxy = new Ext.data.MemoryProxy(this.data || this.dataSource);
			}
		}

		var storeConfig = Ext.applyIf(me.storeConfig || {}, {
			remoteSort : me.remoteSort == undefined ? true : me.remoteSort,
			fields : me.fields,
			proxy : proxy
		});

		var reader;

		if (me.idProperty || me.idBind) {
			var _idfield = me.idProperty || me.idBind;
			me.fields.push({
				name : _idfield,
				mapping : _idfield
			});
		}
		// store final
		if (this.dataType !== 'array') {
			reader = new Ext.data.JsonReader({
				root : me.dataRoot || 'data',
				totalProperty : me.dataTotal || 'total',
				idProperty : me.idProperty || me.idBind,
				fields : me.fields
			});
		} else {
			reader = new Ext.data.ArrayReader({
				fields : me.fields
			});
		}
		if (me.groupField) {
			this.store = new Ext.data.GroupingStore(Ext.applyIf(storeConfig, {
				groupField : me.groupField,
				reader : reader
			}));
		} else {
			this.store = new Ext.data.Store(Ext.applyIf(storeConfig, {
				reader : reader
			}));
		}
		return this.store;
	},

	onResize : function() {
		sofa.grid.GridPanel.superclass.onResize.apply(this, arguments);
		var me = this;
		if (me.pagingbarPager) {
			var pb = me.pagingbarPager.progressBar;
			var pw = me.pagingbarPager.progBarWidth;
			if (me.pagingbar.getWidth() < 350 + pw) {
				pb.hide();
			} else {
				pb.show();
			}
		}
	},

	initComponent : function() {

		var me = this;

		me.initColumnModel();

		me.initStore();

		me.mon(me.getStore(), {
			exception : function() {
				var error = new Ext.Error('', me.id, '数据列表查询异常');
				if (arguments[5] && arguments[5].message) {
					error.message = arguments[5].message;
				} else if (arguments[4]) {
					error.message = arguments[4];
				}
				if (error) {
					error.url = me.url;
					new Ext.handleError(error);
				}
			}
		});

		if (me.pageSize) {

			me.pagingCombo = new Ext.form.ComboBox({

				enableKeyEvents : true,

				selectOnFocus : true,

				hideTrigger : true,

				triggerAction : 'all',

				listEmptyText : '',

				width : 40,

				tpl : '<tpl for="."><div class="x-combo-list-item">{field1} ' + Ext.PagingToolbar.prototype.prePageSizeText + '</div></tpl>',

				store : [],

				maskRe : new RegExp('[0123456789]'),

				value : me.pageSize,

				forceSelection : false,

				listeners : {

					scope : this,

					select : function(field) {

						var value = field.getValue();

						if (/\D+?/ig.test(field.el.dom.value)) {

							field.setValue(value);

							return;
						}

						if (Ext.isString(value)) {
							value = value.trim();
						}
						var pageSize = parseInt(value, 10);

						me.pagingbar.changePageSize(pageSize);
					},

					keypress : function(field, e) {

						var k = e.getKey();

						if (k == e.ENTER) {

							setPageSize();

						}

					}

				}
			});

			var setPageSize = function() {

				var value = me.pagingCombo.getRawValue();

				if (/\D+?/ig.test(value)) {

					me.pagingCombo.setRawValue(me.pageSize);

					return;
				}

				if (Ext.isString(value)) {
					value = value.trim();
				}
				var pageSize = parseInt(value, 10);

				if (pageSize > 1000) {
					var error = '最大每页数量为1000';
				} else if (pageSize <= 0) {
					var error = '每页数量最小为1';
				}

				if (error) {

					me.pagingCombo.setRawValue(me.pageSize);

					sofa.error('设置错误', error);

					return false;
				}

				if (pageSize > 0) {

					me.pagingbar.changePageSize(pageSize);

				}
			}

			me.pagingenter = new Ext.Button({
				iconCls : 'sofa-paging-enter',
				pressed : true,
				text : '确定',
				handler : function() {
					setPageSize();
				}
			});

			if (Ext.ProgressBarPager) {
				me.pagingbarPager = new Ext.ProgressBarPager();
			}

			me.pagingbar = new Ext.PagingToolbar({

				pageSize : parseInt(me.pageSize),

				store : me.store,

				displayInfo : true,

				plugins : me.pagingbarPager ? me.pagingbarPager : [],

				changePageSize : function(pageSize) {

					var d = this.getPageData(), pageNum;

					pageNum = d.activePage;

					if (pageNum !== false) {

						this.cursor = 0;

						if (pageSize == this.pageSize)
							return;

						me.pageSize = pageSize;

						this.pageSize = pageSize;

						this.doLoad((pageNum - 1) * pageSize);

						this.fireEvent('savestate', this, this.pageSize);
					}

				},

				items : [ '-', me.pagingCombo, '-', me.pagingenter ]
			});

			// REM 当分页信息需要保存状态时触发
			this.pagingbar.on('savestate', this.saveState, this);

			this.bbar = this.pagingbar;

		}

		if (this.editable) {
			this.clicksToEdit = 1;
		}

		sofa.grid.GridPanel.superclass.initComponent.call(this);

	},

	afterRender : function() {

		sofa.grid.GridPanel.superclass.afterRender.call(this);

		if (this.autoQuery != false) {

			if (this.pagingbar) {

				this.pagingbar.doLoad.defer(50, this.pagingbar, [ 0 ]);

			} else {

				this.store.load.defer(50, this.store);

			}

		}
	},

	getView : function() {

		if (!this.view) {

			if (this.groupField) {

				this.view = new Ext.grid.GroupingView(this.viewConfig);

				return this.view;

			}

			if (this.useLockingColumnModel) {

				if (this.buffer) {

					this.view = new Ext.grid.LockingBufferView(this.viewConfig);

				} else {

					this.view = new Ext.grid.LockingGridView(this.viewConfig);

				}

			} else {

				this.view = new Ext.grid.GridView(this.viewConfig);

			}

		}

		return this.view;

	},

	reload : function(args) {

		var me = this, store = me.getStore();

		if (store) {

			if (me.pagingbar) {

				var params = {};

				var o = {}, pn = me.pagingbar.getParams();
				o[pn.start] = 0;
				o[pn.limit] = me.pageSize;

				params = o;

				if (args) {
					if (args.params) {
						Ext.apply(args.params, params);
					} else {
						Ext.apply(args, {
							params : params
						});
					}
				} else {
					args = {
						params : params
					};
				}

			}

			store.load(args);

		}
	},

	filter : function(property, value, anyMatch, caseSensitive, exactMatch) {
		if (Ext.isEmpty(anyMatch)) {
			anyMatch = true;
		}
		if (Ext.isEmpty(caseSensitive)) {
			caseSensitive = true;
		}
		Ext.applyIf(property, {
			anyMatch : anyMatch,
			caseSensitive : caseSensitive,
			exactMatch : exactMatch
		});
		this.store.filter(property, value, anyMatch, caseSensitive, exactMatch);
	},

	filterBy : function(fn, scope) {

		this.store.filterBy(fn, scope);

	},

	search : function(property, value, anyMatch, caseSensitive, exactMatch) {
		if (Ext.isEmpty(anyMatch)) {
			anyMatch = true;
		}
		if (Ext.isEmpty(caseSensitive)) {
			caseSensitive = true;
		}
		Ext.applyIf(property, {
			anyMatch : anyMatch,
			caseSensitive : caseSensitive,
			exactMatch : exactMatch
		});

		var me = this;

		var recs = me.store.query(property, value, anyMatch, caseSensitive, exactMatch).items;

		var view = me.getView();

		Ext.each(recs, function(rec) {

			var row;
			if ((row = view.getRow(me.store.indexOf(rec))) != null) {
				var rowEl = Ext.fly(row);
				rowEl.focus();
				rowEl.stopFx();
				rowEl.highlight();
			}

		});

	},

	searchBy : function(fn, scope) {

		var recs = me.store.queryBy(fn, scope).items;

		var view = me.getView();

		Ext.each(recs, function(rec) {

			var row;
			if ((row = view.getRow(me.store.indexOf(rec))) != null) {
				var rowEl = Ext.fly(row);
				rowEl.focus();
				rowEl.stopFx();
				rowEl.highlight();
			}

		});

	},

	clearFilter : function() {

		this.store.clearFilter();

	},

	applyState : function(state) {

		var me = this;
		// pagesize
		if (me.pagingbar && state.pageSize) {
			try {
				me.pageSize = parseInt(state.pageSize);
			} catch (e) {
				me.pageSize = 30;
			}
			me.pagingbar.pageSize = me.pageSize;
			me.pagingCombo.value = me.pageSize;
		}

		sofa.grid.GridPanel.superclass.applyState.call(this, state);
	},

	getState : function() {

		var state = sofa.grid.GridPanel.superclass.getState.call(this);

		if (this.pagingbar) {
			state.pageSize = this.pagingbar.pageSize;
		}

		return state;

	},

	saveState : function() {
		if (Ext.state.Manager && this.stateful !== false) {
			var id = this.getStateId();
			if (id) {
				var state = this.getState();
				if (this.fireEvent('beforestatesave', this, state) !== false) {
					Ext.state.Manager.set(id, state);
					this.fireEvent('statesave', this, state);
				}
			}
		}
	}

});

sofa.form.NumberField = Ext.extend(Ext.form.NumberField, {

	enableKeyEvents : true,

	// 是否开启放大镜
	isZoom : true,

	// 开启百分比计算方式
	percentage : false,

	// 是否开启数字大写
	isUpper : true,

	onRender : function(ct, pos) {
		if (this.percentage) {
			this.isZoom = false;
			this.tailText = '%';
		}
		Ext.form.NumberField.superclass.onRender.call(this, ct, pos);
	},

	isEqual : function(value1, value2) {
		return parseFloat(value1) === parseFloat(value2);
	},

	getValue : function() {
		var v = Ext.form.NumberField.superclass.getValue.call(this);
		if (this.format) {
			v = v.replace(/\,/g, '');
		}
		if (this.percentage) {
			v = this.dividePercentage(v);
			return this.parseValue(v);
		}
		/*
		 * if (Ext.isNumber(v)) { return v; } else { v =
		 * parseFloat(String(v).replace(this.decimalSeparator, ".")); return
		 * isNaN(v) ? '' : v; }
		 */
		return this.fixPrecision(this.parseValue(v));
	},

	beforeBlur : function() {
		if (!this.isValid()) {
			return;
		}
		var v = this.parseValue(this.getRawValue());

		if (!Ext.isEmpty(v)) {
			if (this.percentage) {
				v = this.dividePercentage(v);
			}
			this.setValue(v);
		}
	},

	dividePercentage : function(value) {
		if (Ext.isEmpty(value))
			return '';
		if (Ext.isNumber(value))
			value = String(value);
		var decimalSeparatorIndex = value.indexOf(this.decimalSeparator);
		// 有小数点
		if (decimalSeparatorIndex > -1) {
			// 小数部分
			var decimalPrecision = value.substring(decimalSeparatorIndex + 1, value.length);
			// 整数部分
			var integerPrecision = value.substring(0, decimalSeparatorIndex);
			// 整数大于2位
			if (integerPrecision.length > 2) {
				// 则整数截取前面的位数作为整数，如：1532.12 整数为15
				var _integerPrecision = integerPrecision.substring(0, integerPrecision.length - 2);
				// 后面的部分作为小数部分：3212
				var _decimalPrecision = integerPrecision.substring(integerPrecision.length - 2, integerPrecision.length) + decimalPrecision;
				return _integerPrecision + '.' + _decimalPrecision;
			} else if (integerPrecision.length == 2) {
				return '0.' + integerPrecision + decimalPrecision;
			} else {
				return '0.0' + integerPrecision + decimalPrecision;
			}
		} else {
			if (value.length > 2) {
				var integerPrecision = value.substring(0, value.length - 2);
				var decimalPrecision = value.substring(value.length - 2, value.length);
				return integerPrecision + '.' + decimalPrecision;
			} else if (value.length == 2) {
				return '0.' + value;
			} else {
				return '0.0' + value;
			}
		}
	},

	multiplyPercentage : function(value) {
		if (Ext.isEmpty(value))
			return '';
		if (Ext.isNumber(value))
			value = String(value);
		var decimalSeparatorIndex = value.indexOf('.');
		// 有小数点
		if (decimalSeparatorIndex > -1) {
			// 小数部分
			var decimalPrecision = value.substring(decimalSeparatorIndex + 1, value.length);
			// 整数部分
			var integerPrecision = value.substring(0, decimalSeparatorIndex);
			// 小数部分大于等于2位
			if (decimalPrecision.length >= 2) {
				value = (integerPrecision +
				// 小数前2位，如：134.3224 前2位小数是32
				decimalPrecision.substring(0, 2) +
				// 如果小数位数大于2位，则补小数点再加上后面的小数，即为 .24
				(decimalPrecision.length > 2 ? '.' + decimalPrecision.substring(2, decimalPrecision.length) : '')).replace(/^0+/ig, '');
				if (value.indexOf('.') == 0) {
					return '0' + value;
				}
				return value;
			} else {
				if (integerPrecision.length == 1 && integerPrecision == '0') {
					integerPrecision = '';
				}
				return integerPrecision + decimalPrecision + '0';
			}
		} else {
			return value + '00';
		}
	},

	setValue : function(v) {
		if (this.percentage) {
			v = this.multiplyPercentage(v);
		}
		v = this.fixPrecision(v);
		v = isNaN(v) || v == null ? '' : String(v).replace(".", this.decimalSeparator);
		if (Ext.isString(v) && v != '0' && v != '0.00') {
			// 修正转换字符串后，以0开头的
			v = v.replace(/^0+/ig, '');
			if (v.indexOf('.') == 0) {
				v = '0' + v;
			}
		}
		Ext.form.NumberField.superclass.setValue.call(this, v);
		if (this.format) {
			this.el.dom.value = Ext.util.Format.number(v, this.format);
		}
		return this;
	},

	onBlur : function(e) {
		Ext.form.NumberField.superclass.onBlur.call(this, e);
		if (this.isZoom) {
			this.layer.hide();
		}
	},

	onFocus : function(e) {
		Ext.form.NumberField.superclass.onFocus.call(this, e);
		var v = this.getRawValue();
		this.el.dom.value = v;
		if (this.isZoom) {
			this.setLayer();
			this.setTemplate();
			this.createMagnifier();
		}
	},

	onKeyUp : function(e) {
		Ext.form.NumberField.superclass.onKeyUp.call(this, e);
		if (this.isZoom) {
			this.createMagnifier();
		}
	},

	onKeyPress : function(e) {
		Ext.form.NumberField.superclass.onKeyPress.call(this, e);
		var value = this.el.dom.value;
		var keyCode = e.getKey();

		// -的ascii为45，.的为46
		if (keyCode == '45') {
			if (/[-]/.test(value)) {
				e.stopEvent();
			}
		} else if (keyCode == '46') {
			if (/[.]/.test(value)) {
				e.stopEvent();
			}
		}
	},

	setLayer : function() {
		if (Ext.isEmpty(this.layer)) {
			this.layer = new Ext.Layer();
		}
	},

	setTemplate : function() {
		if (Ext.isEmpty(this.template)) {
			this.template = new Ext.XTemplate('<div class="{0}">', '<table cellpadding="0" cellspacing="0">', '<tr>', '<td class="x-zoom-lt"></td>', '<td class="x-zoom-t"></td>', '<td class="x-zoom-rt"></td>', '</tr>', '<tr>', '<td class="x-zoom-l"></td>', '<td class="x-zoom-ct">', '{1}', '</td>', '<td class="x-zoom-r"></td>', '</tr>', '<tr>', '<td class="x-zoom-lb"></td>', '<td class="x-zoom-b"></td>', '<td class="x-zoom-rb"></td>', '</tr>', '</table>', '</div>');
		}
	},

	createMagnifier : function() {
		var html = '';
		// 判断是否为标准数字：-13344.88883true：是false：否
		var numberFlg = /^(-?\d+)(\.\d+)?$/.test(this.el.dom.value);
		// 整数位是否大于13位，true：大于，false：小于
		var zsFlg = this.getZsFlg(this.el.dom.value);
		// 为空时或者只显示数字大写但整数位大于13位时，不必显示放大镜
		if (Ext.isEmpty((this.el.dom.value).replace(/-/g, '')) || (!this.isZoom && this.isUpper && (zsFlg || !numberFlg))) {
			this.layer.hide();
			return '';
		} else {
			this.layer.show();
		}
		var position = this.getPosition();
		// 放大镜
		if (this.isZoom) {
			var value = this.formatNumber(this.el.dom.value);
			html = '<label class="x-zoom-lower">' + value + '</label>';
		}
		if (this.isZoom && this.isUpper && !zsFlg && numberFlg) {
			html += '<br />';
		}
		// 数字大写
		if (this.isUpper) {
			// 整数位不大于13位时，显示数字大写
			if (!zsFlg && numberFlg) {
				var upperValue = this.upperNumber(this.el.dom.value);
				html += '<label class="x-zoom-upper">' + upperValue + '</label>';
			}
		}
		var data = [];
		var layerY = 0;
		// 放大镜显示在输入框下边
		if (position[1] < this.getHeight() * 2) {
			layerY = position[1] + this.getHeight();
			data = [ 'x-zoom-below', html ];
		} else {
			data = [ '', html ];
		}
		this.template.overwrite(this.layer, data);
		if (position[1] >= this.getHeight() * 2) {
			layerY = position[1] - this.layer.getHeight();
		}
		this.layer.setX(position[0]);
		this.layer.setY(layerY);
	},

	// 判断整数位是否大于13位，true：是，false：否
	getZsFlg : function(n) {
		n = n.replace(/-/g, '');
		// 去掉数字前面的0
		n = n.replace(/0*/, '');
		var flg = false;
		// 整数的情况
		if (!(/[.]/.test(n))) {
			if (n.length > 13) {
				flg = true;
			}
		} else {
			// 整数部分
			var zs = n.substring(0, n.indexOf('.'));
			if (zs.length > 13) {
				flg = true;
			}
		}
		return flg;
	},

	// to upper number:100--->壹佰
	upperNumber : function(n) {
		var value = n.replace(/-/g, '');
		// 整数的情况
		if (!(/[.]/.test(n))) {
			return this.upperZs(value, true);
		}

		// 整数部分
		var zs = value.substring(0, value.indexOf('.'));
		// 小数部分
		var xs = value.substring(value.indexOf('.'), value.length);
		// 数字转大写
		return this.upperZs(zs, false) + this.upperXs(xs);
	},

	// 整数部分转大写
	upperZs : function(n, zsFlag) {
		// 大写
		var upperValue = '';
		// 为0或空时返回空
		if (Ext.isEmpty(n)) {
			return '';
		}
		// 为0
		if (n == 0) {
			upperValue = '零';
		}
		// 数字大写
		var number = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
		var unit = new Array('万', '仟', '佰', '拾', '亿', '仟', '佰', '拾', '万', '仟', '佰', '拾', '');
		// 是否为0的标志：false：否，ture：是
		var zeroFlg = false;
		// 去掉数字前面的0
		n = n.replace(/0*/, '');
		var len = n.length;
		for (i = 0; i < len; i++) {
			// 尾数
			var ws = n.substr(i, len);
			// 尾数为0时
			if (ws == 0) {
				// 当尾数长度大于8时：表示亿
				if (ws.length > 8) {
					upperValue = upperValue + '亿';
				} else if (ws.length > 4) {
					// 当尾数长度大于8时：表示万
					upperValue = upperValue + '万';
				}
				break;
			} else {
				// 尾数不为0时
				if (n.charAt(i) == 0) {
					// 万位为0的情况显示万
					if (i == len - 5) {
						if (!(len > 8 && n.substr(len - 8, 4) == 0)) {
							upperValue = upperValue + unit[8];
							zeroFlg = false;
						}
					} else if (i == len - 9) {
						// 亿位为0的情况显示亿
						upperValue = upperValue + unit[4];
						zeroFlg = false;
					} else {
						zeroFlg = true;
					}
				} else {
					if (zeroFlg) {
						// 零的显示
						zeroFlg = false;
						upperValue = upperValue + number[0];
					}
					upperValue = upperValue + number[n.charAt(i)] + unit[unit.length - len + i];
				}

			}
		}
		upperValue = upperValue + '元';
		// 是否为整数：false：否，true：是
		if (zsFlag) {
			upperValue = upperValue + '整';
		}
		return upperValue;
	},

	// 小数部分转大写
	upperXs : function(n) {
		n = n.replace(/[.]/g, '');
		// 为空时返回空
		if (Ext.isEmpty(n)) {
			return '';
		}
		if (parseInt(n) == 0) {
			return '整';
		}
		// 数字大写
		var number = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
		var dot = new Array('角', '分');

		var upperValue = number[n.charAt(0)] + '角';
		if (n.length > 1) {
			upperValue = upperValue + number[n.charAt(1)] + '分';
		}
		return upperValue;
	},

	// to format number:xxx,xxx,
	formatNumber : function(n) {
		return Ext.util.Format.number(n, this.format);
	}
});

sofa.form.ListView = Ext.extend(Ext.form.ComboBox, {

	triggerAction : 'all',

	mode : 'local',

	forceSelection : true,

	typeAhead : false,

	selectOnFocus : false,

	foucsTrigger : true,

	resizable : true,

	submitValue : true,

	selectedClass : 'ext-listview-selected',

	overClass : 'ext-listview-over',

	displayField : 'text',

	initComponent : function() {

		if (!this.store) {

			var proxy;

			if (this.url) {

				// TODO
				if (sofa.api.crossDomain(this.url)) {

					proxy = new Ext.data.ScriptTagProxy({
						url : this.url
					});

				} else {

					proxy = new Ext.data.HttpProxy({
						url : this.url,
						method : this.method
					});

				}

			} else if (this.data) {

				proxy = new Ext.data.MemoryProxy(this.data);

			}

			var fields = [];

			if (this.fields) {

				if (Ext.isString(this.fields)) {

					this.fields = this.fields.split(',');

					Ext.each(this.fields, function(f) {
						fields.push({
							name : f,
							mapping : f
						});
					});

				} else if (Ext.isArray(this.fields)) {

					fields = fields.concat(this.fields);

				}

			}

			// store final
			if (this.dataType) {

				this.dataType = this.dataType.toLowerCase();

			}

			var storeType, fieldMapping;

			if (this.dataType == 'array') {

				storeType = Ext.data.ArrayStore;

				fieldMapping = 0;

			} else {

				storeType = Ext.data.JsonStore;

				// if (!this.valueField) this.valueField = 'value';

			}

			if (this.valueField) {
				fields = [ {
					name : this.valueField,
					mapping : fieldMapping ? fieldMapping : this.valueField
				} ].concat(fields);
			}

			if (this.displayField) {
				fields = [ {
					name : this.displayField,
					mapping : fieldMapping ? fieldMapping : this.displayField
				} ].concat(fields);
			}

			if (this.indexField && Ext.isString(this.indexField)) {
				this.indexField = this.indexField.split(",");
			} else {
				this.indexField = [];
			}
			this.indexField.push(this.displayField);

			if (this.maxResultSize) {

				this.storeConfig = Ext.apply(this.storeConfig || {}, {
					root : 'data'
				});

			}

			this.store = new storeType(Ext.apply(this.storeConfig || {}, {

				autoLoad : this.autoQuery || false,

				baseParams : this.baseParams || {},

				fields : fields,

				proxy : proxy

			}));

		}

		if (this.hideTrigger) {
			this.emptyText = '';
		}

		this.relayEvents(this.store, [ 'load', 'loadexception' ]);

		sofa.form.ListView.superclass.initComponent.call(this);

	},

	onRender : function(ct, position) {

		sofa.form.ListView.superclass.onRender.call(this, ct, position);

		this.triggerWrap = this.trigger.wrap({
			tag : 'span',
			cls : 'x-form-twin-triggers'
		});

		this.selectTrigger = this.triggerWrap.createChild({
			tag : "img",
			src : Ext.BLANK_IMAGE_URL,
			style : "display:none;",
			title : this.selectAllText,
			cls : "ext-form-trigger ext-form-select-trigger"
		}, this.trigger);

		this.selectTrigger.enableDisplayMode(Ext.Element.HIDDEN);

		this.refreshTrigger = this.triggerWrap.createChild({
			tag : "img",
			src : Ext.BLANK_IMAGE_URL,
			style : "display:none;",
			title : this.refreshText,
			cls : "ext-form-trigger ext-form-refresh-trigger"
		}, this.selectTrigger);

		this.refreshTrigger.addClassOnOver('ext-form-refresh-hover')

		this.refreshTrigger.enableDisplayMode(Ext.Element.HIDDEN);

		this.clearTrigger = this.triggerWrap.createChild({
			tag : "img",
			src : Ext.BLANK_IMAGE_URL,
			style : "display:none;",
			title : this.clearText,
			cls : "ext-form-trigger ext-form-clear-trigger"
		}, this.refreshTrigger);

		this.clearTrigger.addClassOnOver('ext-form-clear-hover');

		this.clearTrigger.enableDisplayMode(Ext.Element.HIDDEN);

		this.selectedAll = false;

		this.mon(this.selectTrigger, 'click', function() {

			if (!this.selectTrigger.hasClass('ext-form-select-trigger-checked')) {

				this.selectTrigger.addClass('ext-form-select-trigger-checked');

				this.onSelectAll(this.selectedAll);

			} else {

				this.selectTrigger.removeClass('ext-form-select-trigger-checked');

				this.onClear();

			}
		}, this);

		this.mon(this.refreshTrigger, 'click', function() {

			if (this.multiSelect) {

				this.selectTrigger.removeClass('ext-form-select-trigger-checked');

			}

			this.onClear();

			this.onRefresh();

			this.fireEvent('refresh', this);

		}, this);

		this.mon(this.clearTrigger, 'click', function() {
			if (!this.multiSelect) {
				this.onClear();
			}
		}, this);
	},

	clearValue : function() {
		this.clearRemoteFilter();
		if (this.view) {
			this.view.clearSelections();
		}
		sofa.form.ListView.superclass.clearValue.call(this);
	},

	clearRemoteFilter : function() {
		if (this.store && this.store.baseParams && this.mode !== 'local') {
			if (this.store.lastOptions && this.store.lastOptions.params) {
				delete this.store.lastOptions.params[this.queryParam];
			}
			this.lastQuery = '';
			delete this.store.baseParams[this.queryParam];
		}
	},

	onRefresh : function() {
		this.reload();
	},

	onSelectAll : function(checked) {
		this.view.selectRange(0, this.store.getCount(), true);
		this.onViewClick();
	},

	clear : function() {
		this.onClear();
	},

	onClear : function() {
		this.isLoaded = false;
		this.clearValue();
		this.clearInvalid();
	},

	onResize : function(w, h) {
		sofa.form.ListView.superclass.onResize.call(this, w, h);
	},

	getTriggerWidth : function() {
		var tw = this.triggerWrap.getWidth();
		if (!this.hideTrigger && !this.readOnly && tw === 0) {
			tw = this.defaultTriggerWidth;
		}
		return tw;
	},

	initSelect : function() {
		if (this.readOnly || this.disabled) {
			return;
		}
		if (this.selectIndex !== -1 && (Ext.isEmpty(this.value) || Ext.isEmpty(this.getRawValue()))) {
			var index = parseInt(this.selectIndex);
			var r = this.store.getAt(index);
			if (r) {
				this.onSelect(r);
			}
		}
	},

	expand : function() {

		if (this.disabled || this.isExpanded() || !this.hasFocus) {
			return;
		}

		if (this.title || this.pageSize) {
			this.assetHeight = 0;
			if (this.title) {
				this.assetHeight += this.header.getHeight();
			}
			if (this.footer) {
				this.assetHeight += this.footer.getHeight();
			}
		}

		if (this.bufferSize) {
			this.doResize(this.bufferSize);
			delete this.bufferSize;
		}
		this.list.alignTo.apply(this.list, [ this.el ].concat(this.listAlign));
		this.list.setZIndex(this.getZIndex());
		this.list.show();
		if (Ext.isGecko2) {
			this.innerList.setOverflow('auto');
		}
		this.mon(Ext.getDoc(), {
			scope : this,
			mousewheel : this.collapseIf,
			mousedown : this.collapseIf
		});
		this.fireEvent('expand', this);
	},

	onClickTrigger : function() {
		if (this.readOnly || this.disabled || this.isExpanded()) {
			return;
		}
		this.expand();
		this.onFocus({});
		if (this.triggerAction == 'all') {
			this.doQuery(this.allQuery, true);
		} else {
			this.doQuery(this.getRawValue());
		}
	},

	afterRender : function() {

		sofa.form.ListView.superclass.afterRender.call(this);

		if (this.foucsTrigger) {

			this.on('focus', function() {
				this.onClickTrigger();
			});

			this.el.on('click', function(e) {
				this.onClickTrigger();
			}, this);
		}

		this.on('expand', function() {
			if (!this.hideTrigger && this.openTrigger != false) {
				this.refreshTrigger.show();
				if (this.multiSelect) {
					this.selectTrigger.show();
				} else {
					this.clearTrigger.show();
				}
				var w = this.triggerWrap.getWidth() - this.trigger.getWidth();
				this.el.setWidth(this.el.getWidth() - w);
			}
		}, this);

		this.on('collapse', function() {
			if (!this.hideTrigger && this.openTrigger != false) {
				var w = this.triggerWrap.getWidth() - this.trigger.getWidth();
				if (this.multiSelect) {
					this.selectTrigger.hide();
				} else {
					this.clearTrigger.hide();
				}
				this.refreshTrigger.hide();
				this.el.setWidth(this.el.getWidth() + w);
			}
		}, this);
	},

	initList : function() {

		if (!this.list) {
			var cls = 'x-combo-list', listParent = Ext.getDom(this.getListParent() || Ext.getBody());

			this.list = new Ext.Layer({
				parentEl : listParent,
				shadow : this.shadow,
				cls : [ cls, this.listClass ].join(' '),
				constrain : false,
				zindex : this.getZIndex(listParent)
			});

			var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setSize(lw, 0);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;
			if (this.syncFont !== false) {
				this.list.setStyle('font-size', this.el.getStyle('font-size'));
			}
			if (this.title) {
				this.header = this.list.createChild({
					cls : cls + '-hd',
					html : this.title
				});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList = this.list.createChild({
				cls : cls + '-inner'
			});
			// this.mon(this.innerList, 'mouseover', this.onViewOver, this);
			this.mon(this.innerList, 'mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

			if (this.pageSize && !this.columns) {
				this.footer = this.list.createChild({
					cls : cls + '-ft'
				});
				this.pageTb = new Ext.PagingToolbar({
					store : this.store,
					pageSize : this.pageSize,
					renderTo : this.footer
				});
				this.assetHeight += this.footer.getHeight();
			}

			if (!this.tpl) {
				this.tpl = this.getTpl();
			}

			if (!this.multiSelect) {
				this.multiSelect = false;
			}

			if (Ext.isArray(this.columns)) {

				var w = 0;
				Ext.each(this.columns, function(c) {
					if (c.width) {
						w += c.width;
					}
				});

				if (this.multiSelect) {
					w += 35;
				}
				if (this.useRowNumberColumn != false) {
					w += 35;
				}

				this.minListWidth = Math.max(this.minListWidth, (this.width || 0));

				this.listWidth = Math.min(w + 17, this.minListWidth);

				this.view = new sofa.grid.GridPanel({
					applyTo : this.innerList,
					layout : 'fit',
					frame : false,
					autoQuery : false,
					width : this.listWidth,
					height : this.minHeight + 50,
					url : this.url,
					pageSize : this.pageSize,
					dataType : this.pageSize > 0 ? 'json' : 'array',
					useRowNumberColumn : this.useRowNumberColumn || false,
					multiSelect : this.multiSelect,
					fields : this.fields,
					columns : this.columns,
					select : function(index, keepSelect) {
						this.getSelectionModel().selectRow(index, keepSelect);
					},
					deselect : function() {
						this.getSelectionModel().deselectRow(index);
					},
					selectRange : function(start, end, keepSelect) {
						this.getSelectionModel().selectRange(start, end, keepSelect);
					},
					isSelected : function(index) {
						this.getSelectionModel().isSelected(index);
					},
					clearSelections : function() {
						this.getSelectionModel().clearSelections();
					},
					clear : function() {
						this.store.removeAll();
					},
					getSelectedRecords : function() {
						return this.getSelectionModel().getSelections();
					},
					getNode : function(index) {
						return this.getView().getRow(index);
					}
				});

				this.view.render();

				this.store = this.view.getStore();

				this.useGridView = true;

			} else {

				this.view = new Ext.DataView({
					applyTo : this.innerList,
					tpl : this.tpl,
					multiSelect : this.multiSelect,
					singleSelect : !this.multiSelect,
					overClass : this.overClass,
					selectedClass : this.selectedClass,
					itemSelector : this.itemSelector || '.' + cls + '-item',
					emptyText : this.listEmptyText,
					deferEmptyText : false,
					doMultiSelection : function(item, index, e) {
						if (this.isSelected(index)) {
							this.deselect(index);
						} else {
							this.select(index, true);
						}
					},
					clear : function() {
						this.store.removeAll();
					}
				});

				this.useGridView = false;

				this.bindStore(this.store, true);

			}

			this.mon(this.store, {
				load : this.initSelect,
				beforeload : function(store, opts) {
					this.fireEvent('beforeload', this, opts.params);
				},
				exception : function() {
					var error = new Ext.Error('', this.id, '下拉列表查询异常');
					if (arguments[5] && arguments[5].message) {
						error.message = arguments[5].message;
					} else if (arguments[4]) {
						error.message = arguments[4];
					}
					if (error) {
						error.url = this.url;
						new Ext.handleError(error);
					}
				},
				scope : this
			});

			if (!Ext.isEmpty(this.timeout)) {
				this.setTimeout(this.timeout);
			}

			this.mon(this.view, {
				containerclick : this.onViewClick,
				click : this.onViewClick,
				scope : this
			});

			if (this.resizable) {
				this.resizer = new Ext.Resizable(this.list, {
					pinned : true,
					handles : 'se,s'
				});
				this.mon(this.resizer, 'resize', function(r, w, h) {

					this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;

					this.listWidth = w;

					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));

					this.restrictWidth(w);

					this.restrictHeight(h);

				}, this);

				this[this.footer ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
			}
		}
	},

	setTimeout : function(timeout) {
		if (this.store && this.store.proxy) {
			this.store.proxy.timeout = timeout;
		}
	},

	restrictWidth : function(rw) {
		var inner = this.innerList.dom, pad = this.list.getFrameWidth('lr'), w = Math.max((rw || 0), inner.clientWidth, inner.offsetWidth, inner.scrollWidth);
		wa = this.getPosition()[0] - Ext.getBody().getScroll().left, wb = Ext.lib.Dom.getViewWidth() - wa - pad - 20, space = Math.max(wa, wb, this.minListWidth || 0) - this.list.shadowOffset - pad - 5;

		// 计算展开后的宽度
		if (this.view) {
			if (this.useGridView) {
				var sw = this.view.getView().mainBody.dom.scrollWidth;
			}
			// display scrollbar +16
			if (inner.clientWidth < inner.offsetWidth) {
				sw = (isNaN(sw) ? 0 : sw) + 16;
			} else {
				sw = isNaN(sw) ? 0 : sw;
			}
			w = Math.max(w, sw);
		}

		w = Math.min(space, Math.max(w, (this.minListWidth || 0)));

		this.innerList.setWidth(w);
		this.view.setWidth(w);
		this.list.setWidth(w + pad);
		this.list.beginUpdate();
		this.list.alignTo.apply(this.list, [ this.el ].concat(this.listAlign));
		this.list.endUpdate();
		this.innerLastWidth = w;
		return w + pad;
	},

	restrictHeight : function(rh) {

		this.innerList.dom.style.height = '';

		var inner = this.innerList.dom, pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight, h = Math.max((rh || 0), inner.clientHeight, inner.offsetHeight, inner.scrollHeight), ha = this.getPosition()[1] - Ext.getBody().getScroll().top, hb = Ext.lib.Dom.getViewHeight() - ha - this.getSize().height, space = Math.max(ha, hb, this.minHeight || 0) - this.list.shadowOffset - pad - 5;

		/*
		 * if (this.view && this.useGridView) { h = Math.min(h, this.maxHeight); }
		 */

		// 但不能超出最大高度
		h = Math.min(h, space, this.maxHeight);

		if (this.useGridView) {
			this.view.setHeight(h);
		}
		this.innerList.setHeight(h);
		this.list.beginUpdate();
		this.list.setHeight(h + pad);
		this.list.alignTo.apply(this.list, [ this.el ].concat(this.listAlign));
		this.list.endUpdate();
	},

	getTpl : function() {
		var buf = [];
		buf.push('<tpl for="."><div class="x-combo-list-item">');

		buf.push('<div class="x-form-combo-label">');

		if (this.multiSelect) {
			buf.push('<img src="' + Ext.BLANK_IMAGE_URL + '" class="ext-form-checker">');
		}

		buf.push(this.template ? this.template : ((this.displayValue ? '{' + (this.valueField || 'value') + '} - ' : '') + '{' + (this.displayField || 'text') + '}'));

		buf.push('</div></div></tpl>');

		return buf.join('');
	},

	onViewClick : function(doFocus) {
		var rs = this.view.getSelectedRecords();
		if (rs) {
			if (!this.multiSelect && rs.length > 0) {
				this.onSelect(rs[0]);
			} else if (rs.length > 0) {
				this.onSelect(rs);
			} else if (this.multiSelect) {
				this.clearValue();
			}
		} else {
			if (!this.multiSelect) {
				this.collapse();
			}
		}
		if (doFocus !== false) {
			this.el.focus();
		}
	},

	setValue : function(value) {
		if (Ext.isArray(value)) {
			this.value = value.join(',');
		} else if (!Ext.isObject(value)) {
			this.value = value;
		}
		if (this.hiddenField) {
			this.hiddenField.value = Ext.value(this.value, '');
		}
		Ext.form.ComboBox.superclass.setValue.call(this, this.value);
		return this;
	},

	initValue : function() {
		Ext.form.ComboBox.superclass.initValue.call(this);
		if (this.hiddenField) {
			this.hiddenField.value = Ext.value(Ext.isDefined(this.hiddenValue) ? this.hiddenValue : this.value, '');
		}
		if (this.text) {
			this.originalRawValue = this.text;
			this.setRawValue(this.text);
		}
	},

	setRawValue : function(v) {
		if (this.emptyText && this.el && !Ext.isEmpty(v) && v != this.emptyText) {
			this.el.removeClass(this.emptyClass);
		}
		sofa.form.ListView.superclass.setRawValue.call(this, v);
	},

	selectByIndex : function(index) {
		if (this.view) {
			this.setValue(this.store.getAt(index));
		}
	},

	selectByValue : function(v, scrollIntoView) {

		if (!Ext.isEmpty(v)) {

			var valueField = this.valueField || this.displayField;
			if (!this.value && !this.hiddenField) {
				valueField = this.displayField
			}

			var recs = this.findRecord(valueField, v);

			if (recs && recs.length > 0) {

				for (var i = 0; i < recs.length; i++) {

					var idx = this.store.indexOf(recs[i]);

					if (i == recs.length - 1) {
						this.select(idx, scrollIntoView);
					} else {
						this.select(idx, false);
					}

				}

				return true;
			}
		}
		return false;
	},

	initEvents : function() {
		sofa.form.ListView.superclass.initEvents.call(this);
		this.keyNav.enter = function() {
			if (this.multiSelect) {
				if (this.view.isSelected(this.selectedIndex)) {
					this.view.deselect(this.selectedIndex);
				} else {
					this.view.select(this.selectedIndex, true);
				}
			} else {
				this.view.select(this.selectedIndex);
			}
			this.onViewClick();
		}
	},

	selectNext : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			if (this.selectedIndex == -1) {
				this.overSelect(0);
			} else if (this.selectedIndex < ct - 1) {
				this.overSelect(this.selectedIndex + 1);
			}
		}
	},

	selectPrev : function() {
		var ct = this.store.getCount();
		if (ct > 0) {
			if (this.selectedIndex == -1) {
				this.overSelect(0);
			} else if (this.selectedIndex !== 0) {
				this.overSelect(this.selectedIndex - 1);
			}
		}
	},

	overSelect : function(index, scrollIntoView) {
		this.selectedIndex = index;
		var el = this.view.getNode(index);
		if (el) {
			Ext.fly(el).addClass(this.overClass);
			if (this.lastEl && this.lastEl != el) {
				Ext.fly(this.lastEl).removeClass(this.overClass);
			}
			this.lastEl = el;
			if (scrollIntoView !== false) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	select : function(index, scrollIntoView) {
		this.selectedIndex = index;
		this.view.select(index, this.multiSelect);
		if (scrollIntoView !== false) {
			var el = this.view.getNode(index);
			if (el) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	findRecord : function(prop, value) {
		var recs = [];
		if (this.store.getCount() > 0) {
			var values = [];
			if (this.multiSelect) {
				values = value.split(',');
			} else {
				values = [].concat(value);
			}
			this.store.each(function(r) {
				var v = r.data[prop];
				if (Ext.isEmpty(v)) {
					return;
				}
				var math = false;
				Ext.each(values, function(val) {
					if (v == val) {
						math = true;
						return false;
					}
				});
				if (math) {
					recs.push(r);
				}
			});
		}
		return recs;
	},

	onLoad : function() {
		this.isLoaded = true;
		if (!this.hasFocus || this.readOnly || this.disabled) {
			return;
		}
		if (this.store.getCount() > 0 || this.listEmptyText) {
			this.expand();
			this.restrictWidth();
			this.restrictHeight();
			if (this.lastQuery == this.allQuery) {
				if (!this.selectByValue(this.value || this.getRawValue(), true)) {
					this.overSelect(0, true);
				}
				if (this.editable) {
					// this.el.dom.select();
				}
			} else {
				if (!this.selectByValue(this.value || this.getRawValue(), true)) {
					this.selectNext();
				}
			}
		} else {
			this.collapse();
		}

	},

	onSelect : function(recs, suppressEvent) {

		if (!suppressEvent) {

			if (this.fireEvent('beforeselect', this, recs) == false) {
				return;
			}

		}

		var texts = [], values = [], valueField = this.valueField || this.displayField, displayField = this.displayField;

		if (Ext.isArray(recs)) {

			Ext.each(recs, function(rec) {

				if (!Ext.isEmpty(rec.data[valueField])) {
					values.push(rec.data[valueField]);
				}

				if (!Ext.isEmpty(rec.data[displayField])) {
					texts.push(rec.data[displayField]);
				}

			}, this);

		} else {

			if (!Ext.isEmpty(recs.data[valueField])) {
				values.push(recs.data[valueField]);
			}

			if (!Ext.isEmpty(recs.data[displayField])) {
				texts.push(recs.data[displayField]);
			}

		}

		this.last = recs;

		this.setValue(values.join(','));

		this.setRawValue(texts.join(','));

		if (!this.multiSelect)
			this.collapse();

		if (!suppressEvent) {
			this.fireEvent('select', this, recs);
		}

	},

	beforeBlur : function() {
		if (!this.readOnly) {
			this.assertValue();
		}
	},

	onKeyUp : function(e) {
		var k = e.getKey();
		if (this.editable !== false && this.readOnly !== true && (k == e.BACKSPACE || !e.isSpecialKey())) {

			this.lastKey = k;
			this.dqTask.delay(this.queryDelay);
		} else if (k == e.DELETE) {
			this.lastKey = k;
			this.initQuery();
		}
		Ext.form.ComboBox.superclass.onKeyUp.call(this, e);
	},

	initQuery : function() {
		// 如果不是必选方式，且有隐藏值，则在输入时，默认清掉隐藏值
		if (this.hiddenField && !this.forceSelection) {
			this.value = '';
			this.hiddenField.value = this.value;
		}
		// 如果文本框值为空，那么value值也应该是空
		var text = this.getRawValue();
		if (Ext.isEmpty(text.trim())) {
			this.clearValue();
		} else {
			this.doQuery(text);
		}
	},

	assertValue : function() {

		var text = Ext.value(this.getRawValue(), '');

		var valueField = this.valueField || this.displayField;

		if (this.valueField) {

			value = Ext.value(this.value, '');

		} else {

			value = text.trim();

		}

		if (Ext.isEmpty(value) && this.forceSelection) {

			if (text.length > 0 && text != this.emptyText) {

				this.el.dom.value = Ext.value(this.lastSelectionText, '');

				this.applyEmptyText();

			} else {

				this.clearValue();

			}

		} else if (this.forceSelection) {

			if (this.multiSelect) {

				var recs = [];

				var values = value.split(',');

				this.store.findBy(function(rec) {
					var v = rec.get(valueField);
					if (values.indexOf(String(v)) > -1) {
						recs.push(rec);
					}
				});

				this.onSelect(recs, true);

			} else {

				var recs = [];

				this.store.findBy(function(rec) {
					if (rec.get(valueField) == value) {
						recs.push(rec);
						return true;
					}
				});

				this.onSelect(recs, true);

			}
		} else {

			this.setValue(this.value);

			this.setRawValue(text);

		}

	},

	toggleMultiSelect : function(multiSelect) {
		if (Ext.isEmpty(multiSelect)) {
			this.multiSelect = !this.multiSelect;
		} else {
			this.multiSelect = multiSelect;
		}
		this.clearValue();
		this.clearInvalid();
		this.tpl = new Ext.XTemplate(this.getTpl());
		if (this.view) {
			this.view.tpl = this.tpl;
		}
		this.reload();
	},

	onTriggerClick : function() {
		if (this.readOnly || this.disabled) {
			return;
		}
		if (this.isExpanded()) {
			if (this.editable) {
				this.collapse();
			}
		} else {
			this.onFocus({});
			if (!this.foucsTrigger) {
				if (this.triggerAction == 'all') {
					this.doQuery(this.allQuery, true);
				} else {
					this.doQuery(this.getRawValue());
				}
			} else if (this.hasFocus) {
				this.onClickTrigger();
			}
		}
		this.el.focus();
	},

	createValueMatcher : function(value, anyMatch, caseSensitive) {
		if (!value.exec) {
			var er = Ext.escapeRe;
			value = String(value);
			if (anyMatch === true) {
				value = er(value);
			} else {
				value = '^' + er(value);
			}
			value = new RegExp(value, caseSensitive ? 'i' : '');
		}
		return value;
	},

	getCount : function() {
		if (this.store) {
			return this.store.getCount();
		}
		return 0;
	},

	doQuery : function(q, forceAll) {
		q = Ext.isEmpty(q) ? '' : q;
		var qe = {
			query : q,
			forceAll : forceAll,
			combo : this,
			cancel : false
		};
		if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
			return false;
		}

		var fn = function() {

			q = qe.query;

			forceAll = qe.forceAll;

			if (forceAll === true || (q.length >= this.minChars)) {

				if (this.lastQuery !== q) {

					this.lastQuery = q;

					if (this.mode == 'local') {

						this.selectedIndex = -1;

						if (forceAll) {

							this.store.clearFilter();

						} else {

							var values = this.multiSelect ? q.split(',') : [].concat(q), re, match, v, indexField;

							if (Ext.isArray(this.indexField)) {
								indexField = this.indexField;
							} else {
								indexField = [].concat(this.displayField);
							}

							this.store.filterBy(function(r) {

								match = false;

								Ext.each(values, function(v) {

									re = this.createValueMatcher(v, true, true);

									Ext.each(indexField, function(field) {

										if (re.test(r.get(field))) {
											match = true;
											return false;
										}

									}, this);

									return !match;

								}, this);

								return match;

							}, this);

						}
						this.onLoad();
					} else if (q.length >= this.minChars) {
						this.store.baseParams[this.queryParam] = q;
						this.store.load({
							params : this.getParams(q)
						});
						this.expand();
					} else {
						this.onLoad();
					}
				} else {
					this.selectedIndex = -1;
					this.onLoad();
				}
			}
		}
		if (!this.isLoaded) {
			this.reload({
				scope : this,
				callback : function() {
					fn.call(this);
				}
			});
		} else {
			fn.call(this);
		}
	},

	setUrl : function(url) {
		if (this.store) {
			this.store.setUrl.apply(this.store, [ url ]);
		}
	},

	clearRequestParams : function() {
		if (this.store) {
			this.store.clearRequestParams.apply(this.store, arguments);
		}
	},

	setRequestParams : function(params) {
		if (this.store) {
			this.store.setRequestParams.apply(this.store, [ params ]);
		}
	},

	getRequestParams : function() {
		if (this.store) {
			return this.store.getRequestParams();
		}
		return {};
	},

	loadData : function(data) {
		if (this.data) {
			delete this.data;
		}
		this.store.proxy.data = data;
		this.store.loadData(data, false);
	},

	getParams : function(q) {
		var params = {}, paramNames = this.store.paramNames;
		if (this.pageSize || this.maxResultSize) {
			params[paramNames.start] = 0;
			params[paramNames.limit] = this.pageSize || this.maxResultSize;
		}
		return params;
	},

	reload : function(args) {
		var params = this.getParams();
		if (args) {
			if (args.params) {
				Ext.apply(args.params, params);
			} else {
				Ext.apply(args, {
					params : params
				});
			}
		} else {
			args = {
				params : params
			};
		}
		// 使用这个方法前提是：DataView里实现了reload方法
		if (this.view) {
			this.view.reload(args);
		} else if (this.store) {
			this.store.load(args);
		}
	},

	reset : function() {
		if (this.view) {
			this.view.clearSelections();
		}
		Ext.form.ComboBox.superclass.reset.call(this);
		if (this.originalRawValue) {
			this.setRawValue(this.originalRawValue);
		} else {
			this.setRawValue('');
		}
		if (this.emptyText) {
			this.applyEmptyText();
		}
	}

});

Ext.reg('listview', sofa.form.ListView);

Ext.form.ListView = sofa.form.ListView;

sofa.form.ListBox = sofa.form.ListView;

Ext.reg('listbox', sofa.form.ListBox);

sofa.form.TreeView = Ext.extend(Ext.form.ListView, {

	nodeParam : 'node',

	queryParam : 'query',

	onViewOver : Ext.emptyFn,

	onViewMove : Ext.emptyFn,

	emptyListHeight : 150,

	maxHeight : 200,

	onlySelectLeaf : false,

	initComponent : function() {

		this.autoSelect = false;

		this.root = new Ext.tree.TreeNode({
			id : "-1",
			isRoot : true
		});

		if (!this.valueField) {
			this.valueField = 'id';
		}

		if (this.indexField && Ext.isString(this.indexField)) {
			this.indexField = this.indexField.split(",");
		} else {
			this.indexField = [];
		}
		this.indexField.push(this.displayField);

		if (!this.store) {

			this.store = new Ext.tree.TreeLoader({
				requestMethod : this.method,
				nodeParam : this.nodeParam,
				textParam : this.displayField || this.textParam || 'text',
				childrenParam : this.childrenParam || 'children',
				expandedAll : this.expandedAll || false,
				multiSelect : this.multiSelect,
				inlineData : this.data,
				baseParams : this.baseParams,
				url : this.url,
				load : function(node, callback, scope) {
					if (this.isLoading()) {
						return;
					}
					if (this.clearOnLoad) {
						if (node.ownerTree) {
							while (node.firstChild) {
								node.removeChild(node.firstChild);
							}
						} else {
							node.childNodes = [];
						}
					}
					if (this.doPreload(node)) {
						this.runCallback(callback, scope || node, [ node ]);
					} else if (this.directFn || this.dataUrl || this.url) {
						this.requestData(node, callback, scope || node);
					}
				}
			});

		}

		var nodeui = Ext.extend(Ext.tree.TreeNodeUI, {
			onSelectedChange : function(state) {
				if (state) {
					this.addClass("x-tree-selected");
				} else {
					this.removeClass("x-tree-selected");
				}
			}
		});

		this.mon(this.store, {

			scope : this,

			beforecreatenode : function(store, attr) {
				attr.uiProvider = nodeui;
			},

			load : function() {
				this.isLoaded = true;
				if (this.view) {
					this.initSelect();
					this.restrictWidth();
					this.restrictHeight();
				}
			},

			beforeload : function(tree, node, callback) {
				this.fireEvent('beforeload', this, node);
			},

			loadexception : function() {
				var error = new Ext.Error('', this.id, '下拉列表查询异常');
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

		this.relayEvents(this.store, [ 'load', 'loadexception' ]);

		sofa.form.ListView.superclass.initComponent.call(this);

	},

	initList : function() {

		if (!this.list) {
			var cls = 'x-combo-list', listParent = Ext.getDom(this.getListParent() || Ext.getBody());

			this.list = new Ext.Layer({
				parentEl : listParent,
				shadow : this.shadow,
				cls : [ cls, this.listClass ].join(' '),
				constrain : false,
				zindex : this.getZIndex(listParent)
			});

			var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setSize(lw, 0);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;
			if (this.syncFont !== false) {
				this.list.setStyle('font-size', this.el.getStyle('font-size'));
			}

			/*
			 * this.innerList = this.list.createChild({cls:cls+'-inner'});
			 * this.mon(this.innerList, 'mouseover', this.onViewOver, this);
			 * this.mon(this.innerList, 'mousemove', this.onViewMove, this);
			 * this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
			 */

			if (!this.multiSelect) {
				this.multiSelect = false;
			}

			var me = this;

			this.view = new Ext.tree.TreePanel({
				border : false,
				autoQuery : false,
				template : this.template,
				applyTo : this.list,
				multiSelect : this.multiSelect,
				autoScroll : true,
				containerScroll : false,
				expandedAll : this.expandedAll,
				initComponent : function() {
					this.eventModel = new Ext.tree.TreeEventModel(this);
					this.eventModel.onNodeOver = function(e, node) {
						this.lastOverNode = node;
						if (node.ui.wrap) {
							Ext.fly(node.ui.elNode).addClass(me.overClass);// 'x-tree-node-over'
						}
					}
					this.eventModel.onNodeOut = function(e, node) {
						this.lastOverNode = node;
						if (node.ui.wrap) {
							Ext.fly(node.ui.elNode).removeClass(me.overClass);
						}
					}
					this.eventModel.delegateClick = function(e, t) {
						if (this.beforeEvent(e)) {
							if (e.getTarget('input[type=checkbox]', 1)) {
								this.onCheckboxClick(e, this.getNode(e));
								this.tree.fireEvent('checkboxclick', this.tree, e);
							} else if (e.getTarget('.x-tree-ec-icon', 1)) {
								this.onIconClick(e, this.getNode(e));
							} else if (this.getNodeTarget(e)) {
								this.onNodeClick(e, this.getNode(e));
							}
						} else {
							this.checkContainerEvent(e, 'click');
						}
					};
					Ext.tree.TreePanel.prototype.initComponent.apply(this);
				},
				rootVisible : false,
				root : this.root,
				singleExpand : this.singleExpand,
				loader : this.store,
				clearSelections : function() {
					if (this.multiSelect) {
						this.root.eachChild(function(node) {
							node.ui.toggleCheck(false);
						});
					} else {
						this.getSelectionModel().clearSelections();
					}
				},
				clear : function() {
					while (this.root.firstChild) {
						this.root.removeChild(this.root.firstChild);
					}
				},
				getSelectionModel : function() {

					if (!this.selModel) {

						this.selModel = new Ext.tree.MultiSelectionModel({

							onNodeClick : function(node, e) {
								if (me.multiSelect) {
									if (this.isSelected(node)) {
										node.ui.toggleCheck(false);
									} else {
										node.ui.toggleCheck(true);
									}
								} else {
									this.select(node);
								}
							},
							select : function(node, e, keepExisting) {
								if (keepExisting !== true) {
									this.clearSelections(true);
								}
								if (this.isSelected(node)) {
									this.lastSelNode = node;
									return node;
								}
								this.selNodes.push(node);
								this.selMap[node.id] = node;
								this.lastSelNode = node;
								node.ui.onSelectedChange(true);
								this.fireEvent('selectionchange', this, this.selNodes);
								return node;
							}

						});

					}
					return this.selModel;
				}
			});

			this.innerList = this.view.getTreeEl();

			this.mon(this.view, {

				checkchange : function(node, checked) {

					var sm = this.view.getSelectionModel();

					if (checked) {

						sm.select(node, null, this.multiSelect);

					} else {

						sm.unselect(node);

					}

				},

				checkboxclick : function() {

					this.onViewClick();

				},

				click : function() {

					this.onViewClick();

				},

				expandnode : function(node) {

					var sm = this.view.getSelectionModel();

					if (node.hasChildNodes()) {

						node.eachChild(function(n) {

							if (sm.isSelected(n)) {

								n.ui.onSelectedChange(true);

							}

						}, this);
					}

					this.restrictWidth();

					this.restrictHeight();

				},

				collapsenode : function() {

					this.restrictWidth();

					this.restrictHeight();

				},

				scope : this
			});

			if (!Ext.isEmpty(this.timeout)) {
				this.setTimeout(this.timeout);
			}

			if (this.resizable) {
				this.resizer = new Ext.Resizable(this.list, {
					pinned : true,
					handles : 'se,s'
				});
				this.mon(this.resizer, 'resize', function(r, w, h) {
					this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
					this.listWidth = w;
					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
					this.restrictHeight(h, true);
				}, this);

				this['innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
			}

		}

	},

	setTimeout : function(timeout) {
		if (this.view) {
			this.view.setTimeout(timeout);
		}
	},

	initSelect : function() {
		if (this.selectIndex !== -1) {
			var index = parseInt(this.selectIndex);
			var n, size = 0;
			this.view.getRootNode().cascade(function(node) {
				if (node.isRoot) {
					return;
				}
				if (size == index) {
					n = node;
					return false;
				}
				size++;
			});
			if (n) {
				this.onSelect(n);
			}
		}
	},

	restrictWidth : function() {

		var inner = this.innerList.dom, pad = this.list.getFrameWidth('lr'), w = Math.max(inner.clientWidth, inner.offsetWidth, inner.scrollWidth);

		if (this.view) {
			var sw = this.view.body.dom.scrollWidth;
			// display scrollbar +16
			if (inner.clientWidth < inner.offsetWidth) {
				sw = (isNaN(sw) ? 0 : sw) + 16;
			} else {
				sw = isNaN(sw) ? 0 : sw;
			}
			w = Math.max(w, sw);
		}

		if (this.minListWidth)
			w = Math.max(w, this.minListWidth);

		w = !this.hasChildNodes() ? this.width : w;

		if (w == this.innerLastWidth) {
			return;
		}

		w = w + pad;

		this.innerList.setWidth(w);
		this.list.setWidth(w);
		this.list.beginUpdate();
		this.list.alignTo.apply(this.list, [ this.el ].concat(this.listAlign));
		this.list.endUpdate();
		this.innerLastWidth = w;
	},

	restrictHeight : function(rh, suppress) {
		var inner = this.innerList.dom, pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight, h = Math.max((rh || 0), inner.clientHeight, inner.offsetHeight, inner.scrollHeight), ha = this.getPosition()[1] - Ext.getBody().getScroll().top, hb = Ext.lib.Dom.getViewHeight() - ha - this.getSize().height, space = Math.max(ha, hb, this.minHeight || 0) - this.list.shadowOffset - pad - 5;

		if (this.view) {
			var sh = this.view.body.dom.scrollHeight;
			h = Math.max(h, sh);
		}
		h = Math.min(h, space);

		if (this.minListHeight) {
			h = Math.max(h, this.minListHeight);
		}

		if (h == this.innerLastHeight && suppress != true)
			return;

		var h = !this.hasChildNodes() ? this.emptyListHeight : h;

		this.view.setHeight(h);

		this.innerList.setHeight(h);

		this.list.beginUpdate();

		this.list.setHeight(h + pad);

		this.list.alignTo.apply(this.list, [ this.el ].concat(this.listAlign));
		this.list.endUpdate();
		this.innerLastHeight = h;
	},

	onSelect : function(nodes, suppressEvent) {

		if (!suppressEvent) {

			if (this.fireEvent('beforeselect', this, nodes) == false) {
				return;
			}

		}

		if (!Ext.isArray(nodes)) {
			nodes = [].concat(nodes);
		}

		var valueField = this.valueField || this.displayField, displayField = this.displayField, texts = [], values = [];

		Ext.each(nodes, function(node) {

			if (this.onlySelectLeaf && !node.isLeaf()) {
				return;
			}

			if (!Ext.isEmpty(node.attributes[valueField])) {
				values.push(node.attributes[valueField]);
			}

			if (!Ext.isEmpty(node.attributes[displayField])) {
				texts.push(node.attributes[displayField]);
			}

		}, this);

		this.setValue(values.join(','));

		this.setRawValue(texts.join(','));

		if (!this.multiSelect)
			this.collapse();

		if (!suppressEvent) {
			if (!this.multiSelect) {
				nodes = nodes[0];
			}
			this.fireEvent('select', this, nodes);
		}
	},

	hasChildNodes : function() {
		if (this.view) {
			return this.view.getRootNode().childNodes.length !== 0;
		}
		return false;
	},

	onViewClick : function(doFocus) {
		var node;
		if (this.multiSelect) {
			node = this.view.getChecked();
		} else {
			var nodes = this.view.getSelectionModel().getSelectedNodes();
			if (nodes.length > 0) {
				node = nodes[0];
			}
		}
		if (node) {
			this.onSelect(node);
		} else {
			this.collapse();
		}
		if (doFocus !== false) {
			this.el.focus();
		}
	},

	selectByValue : function(v, scrollIntoView) {

		if (!Ext.isEmpty(v)) { // , true 为什么空字符串可以呢

			var valueField = this.valueField || this.displayField;
			if (!this.value && !this.hiddenField) {
				valueField = this.displayField
			}

			var nodes = this.findNodes(valueField, v);

			if (nodes) {

				for (var i = 0; i < nodes.length; i++) {

					this.select(nodes[i], false);

					if (i == nodes.length - 1) {
						this.select(nodes[i], scrollIntoView);
					}

				}

				return true;
			}
		}
		return false;
	},

	findNode : function(prop, value) {
		if (this.view) {
			var values = [];
			if (this.multiSelect) {
				values = value.split(',');
			} else {
				values = [].concat(value);
			}
			var len = values.length, i = 0;

			for ( var nodeId in this.view.nodeHash) {
				var node = this.view.nodeHash[nodeId];
				var v = node.attributes[prop];
				var bl = false;
				Ext.each(values, function(val) {
					if (val == v) {
						bl = true;
						return false;
					}
				});
				if (bl) {
					return node;
				}
				/*
				 * if(values.indexOf(v) > -1){ return node; }
				 */
			}
		}
		return null;
	},

	findNodes : function(prop, value) {
		var nodes = [];
		if (this.view) {
			var values = [];
			if (this.multiSelect) {
				values = value.split(',');
			} else {
				values = [].concat(value);
			}

			var len = values.length, i = 0;

			for ( var nodeId in this.view.nodeHash) {
				var node = this.view.nodeHash[nodeId];
				var v = node.attributes[prop];
				var bl = false;
				Ext.each(values, function(val) {
					if (val == v) {
						bl = true;
						nodes.push(node);
						return false;
					}
				});
				if (bl) {
					nodes.push(node);
					i++;
				}
				/*
				 * if(values.indexOf(v) > -1){ nodes.push(node); i++; }
				 */
				if (len == i) {
					break;
				}
			}
		}
		return nodes;
	},

	initEvents : function() {
		sofa.form.ListView.superclass.initEvents.call(this);
		this.keyNav.enter = function(e) {
			var selModel = this.view.getSelectionModel();
			if (this.multiSelect) {
				if (this.selected) {
					if (selModel.isSelected(this.selected)) {
						this.selected.ui.toggleCheck(false);
						selModel.unselect(this.selected);
					} else {
						this.selected.ui.toggleCheck(true);
						selModel.select(this.selected, e, true);
					}
				}
			} else if (this.selected) {
				selModel.select(this.selected);
			}
			this.onViewClick();
		}
		this.keyNav.right = function(e) {
			if (this.selected) {
				var s = this.selected;
				if (s.hasChildNodes()) {
					if (!s.isExpanded()) {
						s.expand();
					}
				}
			}
		}
		this.keyNav.left = function(e) {
			if (this.selected) {
				var s = this.selected;
				if (s.hasChildNodes() && s.isExpanded()) {
					s.collapse();
				}
			}
		}
	},

	selectNext : function() {
		if (this.view && this.view.getRootNode().hasChildNodes()) {

			if (!this.selected) {
				this.overSelect(this.view.getRootNode().firstChild);
			} else {
				var s = this.selected;
				if (s.firstChild && s.isExpanded() && Ext.fly(s.ui.wrap).isVisible()) {
					this.overSelect(s.firstChild);
				} else if (s.nextSibling) {
					this.overSelect(s.nextSibling);
				} else if (s.parentNode) {
					var newS = null;
					var me = this;
					s.parentNode.bubble(function() {
						if (this.nextSibling) {
							newS = me.overSelect(this.nextSibling);
							return false;
						}
					});
					return newS;
				}
			}
		}
	},

	selectPrev : function() {
		if (this.view && this.view.getRootNode().hasChildNodes()) {
			if (!this.selected) {
				this.overSelect(this.view.getRootNode().firstChild);
			} else {
				var s = this.selected;
				var ps = s.previousSibling;
				if (ps) {
					if (!ps.isExpanded() || ps.childNodes.length < 1) {
						this.overSelect(ps);
					} else {
						var lc = ps.lastChild;
						while (lc && lc.isExpanded() && Ext.fly(lc.ui.wrap).isVisible() && lc.childNodes.length > 0) {
							lc = lc.lastChild;
						}
						this.overSelect(lc);
					}
				} else if (s.parentNode && (this.view.rootVisible || !s.parentNode.isRoot)) {
					this.overSelect(s.parentNode);
				}
			}
		}
	},

	overSelect : function(node, scrollIntoView) {
		this.selected = node;
		var el = node.ui.elNode;
		if (el) {
			Ext.fly(el).addClass(this.overClass);
			if (this.lastEl && this.lastEl != el) {
				Ext.fly(this.lastEl).removeClass(this.overClass);
			}
			this.lastEl = el;
			if (scrollIntoView !== false) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},

	select : function(node, scrollIntoView) {
		var sm = this.view.getSelectionModel();
		if (this.multiSelect) {
			node.attributes[this.store.checkedParam] = true;
			if (node.ui.checkbox) {
				node.ui.checkbox.checked = true;
				node.ui.checkbox.defaultChecked = true;
			}
			sm.select(node, null, true);
		} else {
			sm.select(node);
		}
		if (scrollIntoView !== false) {
			if (node.isRoot && !this.rootVisible) {
				return;
			}
			node.ensureVisible();
			var el = node.ui.elNode;
			if (el) {
				this.innerList.scrollChildIntoView(el, false);
			}
		}

	},

	getCount : function() {
		if (this.view) {
			return this.view.getRootNode().childNodes;
		}
		return 0;
	},

	doQuery : function(q, forceAll) {
		q = Ext.isEmpty(q) ? '' : q;
		var qe = {
			query : q,
			forceAll : forceAll,
			combo : this,
			cancel : false
		};
		if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
			return false;
		}

		var fn = function() {

			forceAll = qe.forceAll;

			q = qe.query;

			if (forceAll === true || (q.length >= this.minChars)) {

				if (this.lastQuery !== q) {

					this.lastQuery = q;

					if (this.mode == 'local') {
						this.searchByValue(q, false);
					} else if (q.length >= this.minChars) {
						this.searchByValue(q, this.queryParam, true);
					}

				}
			}

			this.onLoad();
		}

		if (!this.isLoaded) {
			this.reload({
				scope : this,
				callback : function() {
					fn.call(this);
				}
			});
		} else {
			fn.call(this);
		}
	},

	clearRemoteFilter : function() {
		if (this.store && this.store.baseParams && this.mode !== 'local') {
			this.lastQuery = '';
			delete this.store.baseParams[this.queryParam];
		}
	},

	searchByValue : function() {
		if (arguments.length >= 3) {
			var value = arguments[0], attr = arguments[1], async = arguments[2];
		} else if (arguments.length == 2) {
			var value = arguments[0], async = arguments[1];
		} else if (arguments.length == 1) {
			var value = arguments[0];
		}

		if (!attr && this.indexField) {
			var ps = [];
			Ext.each(this.indexField, function(field) {
				ps.push({
					keyword : value,
					attr : field,
					async : async ? async : false
				});
			});
			return this.search({
				params : ps,
				either : true,
				async : async ? async : false
			});
		}
		return this.search({
			keyword : value,
			attr : attr ? attr : undefined,
			async : async ? async : false
		});
	},

	search : function(params) {
		var list = this.innerList, me = this;
		var fn = function(nodes) {
			if (params.async) {
				if (nodes.firstChild) {
					me.overSelect(nodes.firstChild, true);
					nodes.firstChild.ui.focus();
				}
			} else {
				if (Ext.isArray(nodes) && nodes.length > 0) {
					me.overSelect(nodes[0], true);
					// nodes[0].ui.focus();
					me.view.getTreeEl().scrollChildIntoView(nodes[0].ui.elNode, true);
				}
			}
			me.el.focus();
		};
		if (params.callback) {
			fn.createSequence(params.callback, params.scope || this);
		}
		return this.view.search(Ext.applyIf(params, {
			caseSensitive : this.caseSensitive,
			focus : false,
			focusCls : 'ext-listview-over',
			callback : fn
		}));
	},

	assertValue : function() {
		var text = this.getRawValue(), value, valueField;

		if (this.valueField && Ext.isDefined(this.value)) {
			value = this.value;
			valueField = this.valueField;
		} else {
			value = text;
			valueField = this.displayField;
		}

		if (Ext.isEmpty(value) && this.forceSelection) {

			if (text.length > 0 && text != this.emptyText) {
				this.el.dom.value = Ext.value(this.lastSelectionText, '');
				this.applyEmptyText();
			} else {
				this.clearValue();
			}

		} else if (this.forceSelection) {

			if (this.multiSelect) {

				var nodes = [];
				var values = value.split(',');

				var selNodes = this.view.getChecked();

				Ext.each(selNodes, function(node) {
					var v = node.attributes[valueField];
					if (values.indexOf(String(v)) > -1) {
						nodes.push(node);
					}
				});

				this.onSelect(nodes, true);

			} else {
				var nodes = this.view.getSelectionModel().getSelectedNodes();

				var node;
				if (nodes.length > 0) {
					node = nodes[0];
				}

				if (node && value == node.attributes[valueField]) {

					this.onSelect(node, true);

				} else {

					this.onClear();

				}

			}
		} else if (value && !this.forceSelection) {
			this.setValue(this.value);
			this.setRawValue(text);
		}
	},

	toggleMultiSelect : function(multiSelect) {
		if (Ext.isEmpty(multiSelect)) {
			this.multiSelect = !this.multiSelect;
		} else {
			this.multiSelect = multiSelect;
		}
		this.clear();
		if (this.view) {
			this.view.multiSelect = this.multiSelect;
		}
	},

	onSelectAll : function() {

		var root = this.view.getRootNode();

		root.eachChild(function(node) {

			node.ui.toggleCheck(true);

		});

		var nodes = this.view.getChecked();
		if (nodes) {
			this.onSelect(nodes, true);
		}
		this.fireEvent('select', root);

		// this.onViewClick();

	},

	onRefresh : function() {
		this.selected = null;
		this.reload();
	},

	/*
	 * onClear : function(){ this.clearValue(); this.clearInvalid(); },
	 */

	reload : function(args) {
		this.selected = null;
		if (args) {
			this.store.load(this.root, args.callback, args.scope || this);
		} else {
			this.store.load(this.root);
		}
	},

	onLoad : function() {
		if (!this.hasFocus) {
			return;
		}
		if (this.view) {
			this.expand();
			this.restrictHeight();
			if (this.lastQuery == this.allQuery) {
				if (!this.selectByValue(this.value || this.getRawValue(), true)) {
					if (this.root.firstChild) {
						this.overSelect(this.root.firstChild, true);
					}
				}
				if (this.editable) {
					// this.el.dom.select();
				}
			} else {
				if (!this.selectByValue(this.value || this.getRawValue(), true)) {
					this.selectNext();
				}
			}
		} else {
			this.collapse();
		}
	},

	toggleNodeDisabled : function(node, disabled, cascade) {
		if (this.view) {
			this.view.toggleNodeDisabled(node, disabled, cascade);
		}
	},

	getView : function() {
		return this.view;
	}

});
Ext.reg('treeview', sofa.form.TreeView);

Ext.form.TreeView = sofa.form.TreeView;
Ext.form.TreeListView = sofa.form.TreeView;
Ext.reg('treelistview', Ext.form.TreeListView);

sofa.form.treeBox = sofa.form.TreeView;
Ext.reg('treebox', sofa.form.treeBox);

//sofa.tree.GridPanel = Ext.extend(Ext.tree.GridPanel, {
//	buffer : true,
//
//	border : false,
//
//	checkOnly : true,
//
//	expandedAll : false,
//
//	useLockingColumnModel : true,
//
//	initColumnModel : function() {
//
//		var me = this;
//
//		if (Ext.isArray(me.columns)) {
//
//			Ext.each(me.columns, function(column) {
//				if (column.hidden !== true) {
//					column.isTreeNode = true;
//					return false;
//				}
//			});
//
//		}
//
//		me.useRowNumberColumn = false;
//
//		// 2013-2-4 开启编辑功能 me.editable = false;
//
//		if (this.editable) {
//			this.clicksToEdit = 1;
//		}
//
//		sofa.grid.GridPanel.prototype.initColumnModel.apply(this, arguments);
//
//		if (this.useLockingColumnModel) {
//
//			me.cm = new Ext.grid.LockingColumnModel(me.columns);
//
//		} else {
//
//			me.cm = new Ext.grid.ColumnModel(me.columns);
//
//		}
//
//	},
//
//	initStore : function() {
//
//		sofa.grid.GridPanel.prototype.initStore.apply(this, arguments);
//
//		sofa.tree.GridPanel.superclass.initStore.call(this, arguments);
//
//	},
//
//	getSelectionModel : function() {
//
//		if (!this.selModel) {
//
//			if (this.multiSelect) {
//
//				this.selModel = new Ext.tree.CheckboxSelectionModel({
//
//					checkOnly : this.checkOnly,
//
//					isLocked : Ext.emptyFn,
//
//					initEvents : function() {
//						Ext.grid.CheckboxSelectionModel.superclass.initEvents.call(this);
//						this.grid.on('render', function() {
//							var view = this.grid.getView();
//							if (!this.checkOnly) {
//								view.mainBody.on('mousedown', this.onMouseDown, this);
//							}
//							if (view.lockedInnerHd) {
//								Ext.fly(view.lockedInnerHd).on('mousedown', this.onHdMouseDown, this);
//							} else {
//								Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);
//							}
//						}, this);
//					}
//
//				});
//
//			} else {
//
//				this.selModel = new Ext.tree.RowSelectionModel();
//
//			}
//
//			if (this.useLockingColumnModel) {
//				this.selModel.locked = true;
//			}
//		}
//
//		return this.selModel;
//	},
//
//	getView : function() {
//
//		if (!this.view) {
//
//			if (this.useLockingColumnModel) {
//
//				if (this.buffer) {
//
//					this.view = new Ext.tree.LockingBufferView(this.viewConfig);
//
//				} else {
//
//					this.view = new Ext.tree.LockingView(this.viewConfig);
//
//				}
//
//			} else {
//
//				this.view = new Ext.tree.View(this.viewConfig);
//
//			}
//		}
//		return this.view;
//	},
//
//	initComponent : function() {
//
//		if (!this.cm) {
//			this.initColumnModel();
//		}
//
//		if (!this.store) {
//			this.initStore();
//		}
//
//		this.store.grid = this;
//
//		if (!this.root) {
//
//			this.root = new Ext.tree.NodeInterface();
//
//		}
//
//		Ext.tree.GridPanel.superclass.initComponent.call(this);
//
//		this.setRootNode(this.root);
//
//	},
//
//	filter : sofa.grid.GridPanel.prototype.filter,
//
//	clearFilter : sofa.grid.GridPanel.prototype.clearFilter,
//
//	filterBy : sofa.grid.GridPanel.prototype.filterBy
//
//});

sofa.grid.EditorGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {

	initColumnModel : sofa.grid.GridPanel.prototype.initColumnModel,

	getSelectionModel : sofa.grid.GridPanel.prototype.getSelectionModel,

	initStore : sofa.grid.GridPanel.prototype.initStore,

	initComponent : sofa.grid.GridPanel.prototype.initComponent,

	afterRender : sofa.grid.GridPanel.prototype.afterRender,

	saveState : sofa.grid.GridPanel.prototype.saveState,

	getState : sofa.grid.GridPanel.prototype.getState,

	applyState : sofa.grid.GridPanel.prototype.applyState,

	reload : sofa.grid.GridPanel.prototype.reload,

	getView : sofa.grid.GridPanel.prototype.getView

});

/*******************************************************************************
 * @chapter 权限控件
 ******************************************************************************/
sofa.ACL = Ext.extend(Ext.Component, {

	data : {},

	funcACL : 'appfunc',

	dataACL : 'data',

	dataId : 'dataId',

	dataType : 'dataType',

	operations : 'operations',

	constructor : function(config) {

		Ext.apply(this, config);

		if (Ext.isEmpty(this.id)) {
			window.ACL = this;
		}

		if (Ext.isEmpty(this.url) && !Ext.isEmpty(this.code)) {
			this.url = sofa.global.getBaseURL('sofa-authorization') + this.code;
		}

		if (Ext.isEmpty(this.url)) {
			sofa.error('ACL error', 'authenticate url is empty');
		}

		sofa.ACL.superclass.constructor.call(this);

		if (this.dataSource) {
			try {
				if (typeof this.dataSource == 'string')
					this.dataSource = Ext.decode(this.dataSource);
			} catch (e) {
				new Ext.handleError(new sofa.ACL.Error('request ACL result is not JSON', 'request'));
			}
			this.loadData(this.dataSource);
		} else if (this.autoLoad !== false) {
			this.load();
		}

	},

	validate : function(code, data, dataType) {
		var result = false, operations;
		if (code) {
			// 按数据权限判断
			if (!Ext.isEmpty(data) && !Ext.isEmpty(dataType)) {
				var dataACL = this.data[this.dataACL];
				if (dataACL == 'all')
					return true;
				else if (Ext.isEmpty(dataACL))
					return false;
				else if (Ext.isArray(dataACL)) {
					Ext.each(dataACL, function(d) {
						if (d[this.dataId] == data && d[this.dataType] == dataType) {
							operations = d[this.operations];
							if (Ext.isArray(operations)) {
								Ext.each(operations, function(op) {
									result = (op == code);
									if (result)
										return false;
								});
							} else {
								result = (operations == code);
							}
							if (result)
								return false;
						}
					}, this);
				}
				return result;
			} else {
				// 按操作权限判断
				var funcACL = this.data[this.funcACL];
				if (funcACL)
					return !Ext.isEmpty(funcACL[code], true);
				return false;
			}
		}
		return result;
	},

	load : function(url) {
		url = url ? url : this.url;
		var functionId = sofa.api.getParameterURL('_appFunctionId');
		var params = {};
		if (functionId) {
			Ext.apply(params, {
				_appFunctionId : functionId
			});
		}
		Ext.Ajax.request({
			async : false,
			method : 'GET',
			url : url,
			params : params,
			scope : this,
			success : function(xhr) {
				try {
					this.loadData(Ext.decode(xhr.responseText));
				} catch (e) {
					sofa.error('请求权限异常', '请求的权限数据不是一个有效的JSON');
				}
			},
			failure : function(xhr) {
				sofa.error('请求权限异常', xhr.responseText);
			}
		});
	},

	loadData : function(data) {
		this.data = data;
	}

});

Ext.apply(sofa.ACL, {
	CODE : 'ACL',
	COPY : 'add',
	ADD : 'add',
	DEL : 'delete',
	DELETE : 'delete',
	UPDATE : 'update',
	EDIT : 'update',
	QUERY : 'query',
	VIEW : 'query',
	CHECK : 'check',
	UNCHECK : 'uncheck'
});

sofa.grid.ACL = Ext.extend(Ext.util.Observable, {

	queryACL : 'query',

	init : function(grid) {

		this.grid = grid;

		this.grid.mon(this.grid.getStore(), 'beforeload', function() {

			if (!this.ACL.validate(this.queryACL)) {

				sofa.alert(sofa.grid.ACL.query);

				return false;

			}

		}, this);

	},

	constructor : function(config) {

		Ext.apply(this, config);

		if (this.bindACL) {

			this.ACL = typeof this.bindACL == 'string' ?

			Ext.getCmp(this.bindACL) :

			this.bindACL;
		}

	}

});

sofa.Window = Ext.extend(Ext.Panel, {
	layout : 'fit',
	baseCls : 'sofa-window',
	resizable : true,
	draggable : true,
	closeAction : 'hide',
	minimizable : true,
	maximizable : true,
	closable : true,
	constrain : true,
	monitorResize : true,
	constrainHeader : true,
	plain : true,
	modal : true,
	minHeight : 25,
	height : 300,
	minWidth : 200,
	expandOnShow : true,
	showAnimDuration : 0.25,
	hideAnimDuration : 0.25,
	shadowOffset : 8,
	collapsible : false,
	initHidden : undefined,
	hidden : true,
	elements : 'header,body',
	buttonAlign : 'center',
	buttons : [],
	footer : true,
	frame : true,
	floating : true,
	autoScroll : false,
	isHandleRestore : false,

	initTools : function() {
		// 暂时去掉该功能
		this.addTool({
			id : 'minimize',
			disabled : true,
			hidden : true,
			handler : Ext.emptyFn
		});
		this.addTool({
			id : 'maximize',
			disabled : !this.maximizable,
			handler : this.maximize.createDelegate(this, [ this.maximizable ])
		});
		this.addTool({
			id : 'restore',
			disabled : !this.maximizable,
			handler : this.restore.createDelegate(this, [ this.maximizable ]),
			hidden : true
		});
		this.addTool({
			id : 'close',
			disabled : !this.closable,
			handler : this[this.closeAction].createDelegate(this, [ this.closable ])
		});
	},

	addTool : function() {
		if (!this.rendered) {
			if (!this.tools) {
				this.tools = [];
			}
			Ext.each(arguments, function(arg) {
				this.tools.push(arg);
			}, this);
			return;
		}

		if (!this[this.toolTarget]) {
			return;
		}
		if (!this.toolTemplate) {
			var tt = new Ext.Template('<div class="x-tool x-tool-{id}">&#160;</div>');
			tt.disableFormats = true;
			tt.compile();
			Ext.Panel.prototype.toolTemplate = tt;
		}
		for (var i = 0, a = arguments, len = a.length; i < len; i++) {
			var tc = a[i];
			if (!this.tools[tc.id]) {
				var overCls = 'x-tool-' + tc.id + '-over';
				var t = this.toolTemplate.insertFirst(this[this.toolTarget], tc, true);
				this.tools[tc.id] = t;
				t.enableDisplayMode('block');
				this.mon(t, 'click', this.createToolHandler(t, tc, overCls, this));
				if (tc.on) {
					this.mon(t, tc.on);
				}
				if (tc.hidden) {
					t.hide();
				}
				if (tc.disabled) {
					t.addClass('x-item-disabled');
				} else {
					t.addClassOnOver(overCls);
				}
				if (tc.qtip) {
					if (Ext.isObject(tc.qtip)) {
						Ext.QuickTips.register(Ext.apply({
							target : t.id
						}, tc.qtip));
					} else {
						t.dom.qtip = tc.qtip;
					}
				}
			}
		}
	},

	handleResize : function(box) {
		if (this.minimized)
			return;
		var rz = this.resizeBox;
		if (rz.x != box.x || rz.y != box.y) {
			this.updateBox(box);
		} else {
			this.setSize(box);
			if (Ext.isIE6 && Ext.isStrict) {
				this.doLayout();
			}
		}
		this.focus();
		this.updateHandles();
		this.saveState();
	},

	show : function(animateTarget, cb, scope) {

		if (!this.rendered) {
			this.render(Ext.getBody());
		}
		if (this.minimized) {
			this.restore();
		}
		if (this.hidden === false) {
			this.toFront();
			return this;
		}
		if (this.fireEvent('beforeshow', this) === false) {
			return this;
		}
		if (cb) {
			this.on('show', cb, scope, {
				single : true
			});
		}
		this.hidden = false;
		if (Ext.isDefined(animateTarget)) {
			this.setAnimateTarget(animateTarget);
		}
		this.beforeShow();
		if (this.animateTarget) {
			this.animShow();
		} else {
			this.afterShow();
		}

		return this;
	},

	onWindowResize : function() {
		if (this.maximized) {
			this.fitContainer();
		}
		if (this.modal) {
			this.mask.setSize('100%', '100%');
			var force = this.mask.dom.offsetHeight;
			this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
		}
		this.doConstrain();
		if (this.minimized) {
			this.minimizeResize();
		} else {
			this.center();
		}
		var sz = this.getSize(false);
		// IE里，会每次少2个像素的高度，原因不明
		if (Ext.isIE) {
			sz.height = sz.height + 2;
		}
		this.setSize(sz);
		this.onResize(sz.width, sz.height);
	},

	minimizeResize : function() {
		var size = this.getXYSize();
		this.setPosition(size.x, size.y);
	},

	getXYSize : function() {
		var pos = this.container.getViewSize(false), x, y;
		x = pos.width - 200 - (Ext.isIE6 ? 5 : 0);
		y = pos.height - this.getFrameHeight() - (Ext.isIE6 ? 4 : 0);
		return {
			x : x,
			y : y
		};
	},

	minimize : function(minimizable) {
		if (!minimizable) {
			return;
		}
		if (!this.minimized || minimizable) {
			if (!this.maximized) {
				this.restoreSize = this.getSize();
				this.restorePos = this.getPosition(true);
			}
			this.tools.maximize.hide();
			this.tools.restore.show();

			if (this.modal) {
				this.mask.hide();
				Ext.getBody().removeClass('x-body-masked');
			}
			if (this.proxy) {
				this.proxy.hide();
			}
			this.el.disableShadow();
			this.collapse(false);
			if (this.header) {
				if (Ext.isIE6)
					this.header.child('span').setWidth(60);
				else
					this.header.child('span').setWidth(70);
			}
			this.setWidth(200);
			var size = this.getXYSize();
			this.el.shift({
				callback : function() {
					this.minimizeResize();
				},
				x : size.x,
				y : size.y,
				scope : this,
				duration : this.hideAnimDuration
			});
			this.minimized = true;
			this.doLayout();
			this.fireEvent('minimize', this);
		}
		return this;
	},

	notMinimize : function() {
		this.expand(false);
		this.minimized = false;
		if (this.modal) {
			this.mask.show();
			Ext.getBody().addClass('x-body-masked');
		}
		if (this.proxy && this.proxy.hidden) {
			this.proxy.show();
		}
		this.el.enableShadow();
		if (this.header) {
			this.header.child('span').setWidth('auto');
		}
	},

	maximize : function(maximizable, isShow) {
		if (!maximizable) {
			return;
		}
		if (!this.maximized || maximizable) {
			this.notMinimize();
			if (!isShow) {
				this.restoreSize = this.getSize();
				this.restorePos = this.getPosition(true);
			}
			this.tools.maximize.hide();
			this.tools.restore.show();
			this.maximized = true;
			this.el.disableShadow();

			if (this.dd) {
				this.dd.lock();
			}
			if (this.collapsible) {
				this.tools.toggle.hide();
			}
			this.el.addClass('sofa-window-maximized');
			this.container.addClass('sofa-window-maximized-ct');

			this.setPosition(0, 0);
			this.fitContainer();
			this.doLayout();
			this.fireEvent('maximize', this);
		}
		return this;
	},

	restore : function(maximizable) {
		if (!maximizable) {
			return;
		}
		if (this.minimized || this.maximized) {
			var t = this.tools;
			this.el.removeClass('sofa-window-maximized');
			if (t.restore) {
				t.restore.hide();
			}
			if (t.maximize) {
				t.maximize.show();
			}
			if (this.restorePos) {
				this.setPosition(this.restorePos[0], this.restorePos[1]);
			}

			if (this.restoreSize) {
				if (!Ext.isIE || this.isHandleRestore) {
					this.setSize(this.restoreSize.width, this.restoreSize.height);
				} else {
					this.setSize(this.restoreSize.width + 20, this.restoreSize.height + 20);
				}
			}

			this.isHandleRestore = this.isHandleRestore || true;
			delete this.restorePos;
			delete this.restoreSize;
			if (this.dd) {
				this.dd.unlock();
			}
			this.notMinimize();
			this.maximized = false;
			this.el.enableShadow(true);

			if (this.collapsible && t.toggle) {
				t.toggle.show();
			}
			this.container.removeClass('sofa-window-maximized-ct');
			this.doConstrain();
			this.doLayout();
			this.fireEvent('restore', this);
		}
		return this;
	},

	// private
	initComponent : function() {
		this.initTools();
		sofa.Window.superclass.initComponent.call(this);
		this.addEvents('resize', 'maximize', 'minimize', 'restore', 'complete');

		if (Ext.isDefined(this.initHidden)) {
			this.hidden = this.initHidden;
		}
		if (this.hidden === false) {
			this.hidden = true;
			this.show();
		}
	},

	// TODO
	regForm : function(form) {
		if (this.formId && !form) {
			form = Ext.getCmp(this.formId);
		}
		if (form) {
			var buttons = form.buttons;
			Ext.each(buttons, function(button) {
				var type = (button.type || 'button').toLowerCase();
				if (type == 'cancel') {
					if (button instanceof Ext.Button) {
						if (!button.hasListener('click')) {
							button.on('click', function() {
								this.hide();
							}, this);
						}
					} else if (Ext.isObject(button)) {
						button.handler = this.hide.createDelegate(this, []);
					}
				}
				this.addButton(button);
			}, this);
		}
	},

	addButton : function(button) {
		if (!button) {
			return;
		}
		var type = (button.type || 'button').toLowerCase();
		if (type == 'cancel') {
			if (button instanceof Ext.Button) {
				if (!button.hasListener('click')) {
					button.on('click', function() {
						this.hide();
					}, this);
				}
			} else if (Ext.isObject(button)) {
				button.handler = this.hide.createDelegate(this, []);
			}
		}
		sofa.Window.superclass.addButton.call(this, button);
	},

	clearButton : function() {
		if (this.fbar) {
			this.fbar.removeAll();
			this.doLayout();
		}
	},

	// private
	getState : function() {
		return Ext.apply(sofa.Window.superclass.getState.call(this) || {}, this.getBox(true));
	},

	// TODO
	getForm : function() {
		return this.formPanel ? this.formPanel.getForm() : undefined;
	},

	// private
	onRender : function(ct, position) {

		sofa.Window.superclass.onRender.call(this, ct, position);

		if (this.plain) {
			this.el.addClass('sofa-window-plain');
		}

		this.minProxy = ct.createChild({
			cls : 'sofa-window-minproxy-left',
			visible : false,
			cn : {
				cn : {
					cls : 'sofa-window-minproxy-right',
					cn : {
						cls : 'sofa-window-minproxy-center'
					}
				}
			}
		});
		this.minProxyEl = this.minProxy.child('.sofa-window-minproxy-center');

		this.focusEl = this.el.createChild({
			tag : 'a',
			href : '#',
			cls : 'x-dlg-focus',
			tabIndex : '-1',
			html : '&#160;'
		});
		this.focusEl.swallowEvent('click', true);

		this.proxy = this.el.createProxy('sofa-window-proxy');
		this.proxy.enableDisplayMode('block');

		if (this.modal) {
			this.mask = this.container.createChild({
				cls : 'ext-el-mask'
			}, this.el.dom);
			this.mask.enableDisplayMode('block');
			this.mask.hide();
			this.mon(this.mask, 'click', this.focus, this);
		}
		if (this.maximizable) {
			this.mon(this.header, 'dblclick', this.toggleMaximize, this);
		}
	},

	afterRender : function() {

		sofa.Window.superclass.afterRender.call(this);

		if (this.formURL) {

			sofa.api.request({

				url : this.formURL,

				method : 'GET',

				scope : this,

				success : function(xhr) {

					this.formPanel = new (eval(xhr.responseText))();

					this.add(this.formPanel);

					this.doLayout();

				},
				failure : function(xhr) {

					sofa.error('加载表单异常', xhr.responseText);

				}
			});

		}
		// iframe src
		else if (this.src) {

			var ifr;

			this.fitpanel = new Ext.FitPanel({
				border : false,
				items : ifr = new Ext.BoxComponent({
					autoEl : {
						tag : 'iframe',
						name : Ext.id(),
						frameBorder : 0,
						style : 'overflow:auto',
						width : '100%',
						height : '100%',
						src : this.src
					},
					listeners : {
						scope : this,
						render : function() {

							this.iframe = ifr.el.dom;

							this.initFrame();
						}
					}
				})
			});

			this.add(this.fitpanel);

			this.frameEl = ifr;

			this.frameMask = new Ext.LoadMask(this.body, {
				msg : 'loading...'
			});

			// this.frameMask.show.defer(10, this.frameMask);

			this.regForm();

		}
	},

	refresh : function(src) {
		if (this.frameEl) {
			this.getWin().location.reload();
		}
	},

	initFrame : function() {
		var initButtonTask = {
			run : function() {
				var relayForm;
				if (this.relayForm) {
					if (Ext.isString(this.relayForm)) {
						try {
							relayForm = this.getWin().Ext.getCmp(this.relayForm);
						} catch (e) {
							return;
						}
					}
				}
				if (relayForm) {
					Ext.TaskMgr.stop(initButtonTask);
					this.clearButton();
					this.setHeight(this.getHeight() - 30);

					var groups = relayForm.buttonGroup;
					Ext.each(groups, function(group) {
						if (group)
							group.setVisible(false);
					});

					this.regForm(relayForm);
				}
			},
			interval : 10,
			duration : 10000,
			scope : this
		};

		var task = {
			run : function() {

				var doc = this.getDoc();
				var win = this.getWin();

				if ((typeof doc.readyState != undefined && doc.readyState == "complete") || (typeof doc.readyState == undefined && (doc.getElementsByTagName("body")[0] || doc.body))) {
					// if (doc.body || doc.readyState == 'complete') {
					// this.frameMask.hide();

					Ext.TaskMgr.stop(task);

					Ext.fly(win).on('beforeunload', function() {
						this.setHeight(this.getHeight() + 30);
						Ext.TaskMgr.start(task);
					}, this);

					this.fireEvent('complete', win);
				}
			},
			interval : 10,
			duration : 10000,
			scope : this
		};
		Ext.TaskMgr.start(task);

	},

	getDoc : function() {
		return Ext.isIE ? this.getWin().document : (this.iframe.contentDocument || this.getWin().document);
	},

	getWin : function() {
		return Ext.isIE ? this.iframe.contentWindow : window.frames[this.iframe.name];
	},

	// private
	initEvents : function() {
		sofa.Window.superclass.initEvents.call(this);
		if (this.animateTarget) {
			this.setAnimateTarget(this.animateTarget);
		}

		if (this.resizable) {
			this.resizer = new Ext.Resizable(this.el, {
				minWidth : this.minWidth,
				minHeight : this.minHeight,
				handles : this.resizeHandles || 'all',
				pinned : true,
				resizeElement : this.resizerAction,
				handleCls : 'sofa-window-handle'
			});
			this.resizer.window = this;
			this.mon(this.resizer, 'beforeresize', this.beforeResize, this);
		}

		if (this.draggable) {
			this.header.addClass('sofa-window-draggable');
		}
		this.mon(this.el, 'mousedown', this.toFront, this);
		this.manager = this.manager || Ext.WindowMgr;
		this.manager.register(this);
		if (this.closable) {
			var km = this.getKeyMap();
			km.on(27, this.onEsc, this);
			km.disable();
		}
	},

	initDraggable : function() {
		this.dd = new sofa.Window.DD(this);
	},

	// private
	onEsc : function(k, e) {
		e.stopEvent();
		this[this.closeAction]();
	},

	// private
	beforeDestroy : function() {
		if (this.rendered) {
			this.hide();
			this.clearAnchor();
			Ext.destroy(this.focusEl, this.resizer, this.dd, this.proxy, this.mask);
		}
		sofa.Window.superclass.beforeDestroy.call(this);
	},

	// private
	onDestroy : function() {
		if (this.manager) {
			this.manager.unregister(this);
		}
		sofa.Window.superclass.onDestroy.call(this);
	},

	// private
	resizerAction : function() {
		var box = this.proxy.getBox();
		this.proxy.hide();
		this.window.handleResize(box);
		return box;
	},

	// private
	beforeResize : function() {
		this.resizer.minHeight = Math.max(this.minHeight, this.getFrameHeight() + 40); // 40
		// is a
		// magic
		// minimum
		// content
		// size?
		this.resizer.minWidth = Math.max(this.minWidth, this.getFrameWidth() + 40);
		this.resizeBox = this.el.getBox();
	},

	// private
	updateHandles : function() {
		if (Ext.isIE && this.resizer) {
			this.resizer.syncHandleHeight();
			this.el.repaint();
		}
	},

	focus : function() {
		var f = this.focusEl, db = this.defaultButton, t = typeof db, el, ct;
		if (Ext.isDefined(db)) {
			if (Ext.isNumber(db) && this.fbar) {
				f = this.fbar.items.get(db);
			} else if (Ext.isString(db)) {
				f = Ext.getCmp(db);
			} else {
				f = db;
			}
			el = f.getEl();
			ct = Ext.getDom(this.container);
			if (el && ct) {
				if (ct != document.body && !Ext.lib.Region.getRegion(ct).contains(Ext.lib.Region.getRegion(el.dom))) {
					return;
				}
			}
		}
		f = f || this.focusEl;
		f.focus.defer(10, f);
	},

	setAnimateTarget : function(el) {
		el = Ext.get(el);
		this.animateTarget = el;
	},

	// private
	beforeShow : function() {
		delete this.el.lastXY;
		delete this.el.lastLT;
		if (this.x === undefined || this.y === undefined) {
			var xy = this.el.getAlignToXY(this.container, 'c-c');
			var pos = this.el.translatePoints(xy[0], xy[1]);
			this.x = this.x === undefined ? pos.left : this.x;
			this.y = this.y === undefined ? pos.top : this.y;
		}
		this.el.setLeftTop(this.x, this.y);

		if (this.expandOnShow) {
			this.expand(false);
		}

		if (this.modal) {
			Ext.getBody().addClass('x-body-masked');
			this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
			this.mask.show();
		}
	},

	onShow : function() {
		if (this.maximized) {
			this.maximize(true, true);
		}
	},

	// private
	afterShow : function(isAnim) {
		if (this.isDestroyed) {
			return false;
		}
		this.proxy.hide();
		this.el.setStyle('display', 'block');
		this.el.show();
		// work around stupid FF 2.0/Mac
		if (Ext.isMac && Ext.isGecko2) {
			// scroll bar bug
			this.cascade(this.setAutoScroll);
		}
		if (this.monitorResize || this.modal || this.constrain || this.constrainHeader) {
			Ext.EventManager.onWindowResize(this.onWindowResize, this);
		}
		this.doConstrain();
		this.doLayout();
		if (this.keyMap) {
			this.keyMap.enable();
		}
		this.toFront();
		this.updateHandles();
		if ((isAnim && Ext.isWebKit) || Ext.isIE || Ext.isChrome || Ext.isSafari) {
			var sz = this.getSize();
			this.setSize(sz);
			this.onResize(sz.width, sz.height);
		}
		this.onShow();
		this.fireEvent('show', this);
	},

	// private
	animShow : function() {
		this.proxy.show();
		this.proxy.setBox(this.animateTarget.getBox());
		this.proxy.setOpacity(0);
		var b = this.getBox();
		this.el.setStyle('display', 'none');
		this.proxy.shift(Ext.apply(b, {
			callback : this.afterShow.createDelegate(this, [ true ], false),
			scope : this,
			easing : 'easeNone',
			duration : this.showAnimDuration,
			opacity : 0.5
		}));
	},

	hide : function(animateTarget, cb, scope) {
		if (this.hidden || this.fireEvent('beforehide', this) === false) {
			return this;
		}
		if (cb) {
			this.on('hide', cb, scope, {
				single : true
			});
		}
		this.hidden = true;
		if (animateTarget !== undefined) {
			this.setAnimateTarget(animateTarget);
		}
		if (this.modal) {
			this.mask.hide();
			Ext.getBody().removeClass('x-body-masked');
		}
		if (this.animateTarget) {
			this.animHide();
		} else {
			this.el.hide();
			this.afterHide();
		}
		return this;
	},

	// private
	afterHide : function() {
		this.proxy.hide();
		if (this.monitorResize || this.modal || this.constrain || this.constrainHeader) {
			Ext.EventManager.removeResizeListener(this.onWindowResize, this);
		}
		if (this.keyMap) {
			this.keyMap.disable();
		}
		this.onHide();
		this.fireEvent('hide', this);
	},

	// private
	animHide : function() {
		this.proxy.setOpacity(0.5);
		this.proxy.show();
		var tb = this.getBox(false);
		this.proxy.setBox(tb);
		this.el.hide();
		this.proxy.shift(Ext.apply(this.animateTarget.getBox(), {
			callback : this.afterHide,
			scope : this,
			duration : this.hideAnimDuration,
			easing : 'easeNone',
			opacity : 0
		}));
	},

	onHide : Ext.emptyFn,

	// private
	doConstrain : function() {
		if (this.constrain || this.constrainHeader) {
			var offsets;
			if (this.constrain) {
				offsets = {
					right : this.el.shadowOffset,
					left : this.el.shadowOffset,
					bottom : this.el.shadowOffset
				};
			} else {
				var s = this.getSize();
				offsets = {
					right : -(s.width - 100),
					bottom : -(s.height - 25)
				};
			}

			var xy = this.el.getConstrainToXY(this.container, true, offsets);
			if (xy) {
				this.setPosition(xy[0], xy[1]);
			}
		}
	},

	// private - used for dragging
	ghost : function(cls) {
		var ghost = this.createGhost(cls);
		var box = this.getBox(true);
		ghost.setLeftTop(box.x, box.y);
		ghost.setWidth(box.width);
		this.el.hide();
		this.activeGhost = ghost;
		return ghost;
	},

	// private
	unghost : function(show, matchPosition) {
		if (!this.activeGhost) {
			return;
		}
		if (show !== false) {
			this.el.show();
			this.focus.defer(10, this);
			if (Ext.isMac && Ext.isGecko2) { // work around stupid FF 2.0/Mac
				// scroll bar bug
				this.cascade(this.setAutoScroll);
			}
		}
		if (matchPosition !== false) {
			this.setPosition(this.activeGhost.getLeft(true), this.activeGhost.getTop(true));
		}
		this.activeGhost.hide();
		this.activeGhost.remove();
		delete this.activeGhost;
	},

	close : function() {
		if (this.fireEvent('beforeclose', this) !== false) {
			this.hide();
		}
	},

	// private
	doClose : function() {
		this.fireEvent('close', this);
		this.destroy();
	},

	toggleMaximize : function() {
		return this[this.maximized ? 'restore' : 'maximize']();
	},

	// private
	fitContainer : function() {
		var vs = this.container.getViewSize(false);
		this.setSize(vs.width, vs.height);
	},

	// private
	setZIndex : function(index) {
		if (this.modal) {
			this.mask.setStyle('z-index', index);
		}
		this.el.setZIndex(++index);
		index += 5;

		if (this.resizer) {
			this.resizer.proxy.setStyle('z-index', ++index);
		}

		this.lastZIndex = index;
	},

	alignTo : function(element, position, offsets) {
		var xy = this.el.getAlignToXY(element, position, offsets);
		this.setPagePosition(xy[0], xy[1]);
		return this;
	},

	anchorTo : function(el, alignment, offsets, monitorScroll) {
		this.clearAnchor();
		this.anchorTarget = {
			el : el,
			alignment : alignment,
			offsets : offsets
		};

		Ext.EventManager.onWindowResize(this.doAnchor, this);
		var tm = typeof monitorScroll;
		if (tm != 'undefined') {
			Ext.EventManager.on(window, 'scroll', this.doAnchor, this, {
				buffer : tm == 'number' ? monitorScroll : 50
			});
		}
		return this.doAnchor();
	},

	doAnchor : function() {
		var o = this.anchorTarget;
		this.alignTo(o.el, o.alignment, o.offsets);
		return this;
	},

	clearAnchor : function() {
		if (this.anchorTarget) {
			Ext.EventManager.removeResizeListener(this.doAnchor, this);
			Ext.EventManager.un(window, 'scroll', this.doAnchor, this);
			delete this.anchorTarget;
		}
		return this;
	},

	toFront : function(e) {
		if (this.manager.bringToFront(this)) {
			if (!e || !e.getTarget().focus) {
				this.focus();
			}
		}
		return this;
	},

	setActive : function(active) {
		if (active) {
			if (!this.maximized) {
				this.el.enableShadow(true);
			}
			this.fireEvent('activate', this);
		} else {
			this.el.disableShadow();
			this.fireEvent('deactivate', this);
		}
	},

	toBack : function() {
		this.manager.sendToBack(this);
		return this;
	},

	center : function() {
		var xy = this.el.getAlignToXY(this.container, 'c-c');
		this.setPagePosition(xy[0], xy[1]);
		return this;
	}
});

sofa.Window.DD = Ext.extend(Ext.dd.DD, {

	constructor : function(win) {
		this.win = win;
		sofa.Window.DD.superclass.constructor.call(this, win.el.id, 'WindowDD-' + win.id);
		this.setHandleElId(win.header.id);
		this.scroll = false;
	},

	moveOnly : true,
	headerOffsets : [ 100, 25 ],
	startDrag : function() {
		var w = this.win;
		this.proxy = w.ghost(w.initialConfig.cls);
		if (w.constrain !== false) {
			var so = w.el.shadowOffset;
			this.constrainTo(w.container, {
				right : so,
				left : so,
				bottom : so
			});
		} else if (w.constrainHeader !== false) {
			var s = this.proxy.getSize();
			this.constrainTo(w.container, {
				right : -(s.width - this.headerOffsets[0]),
				bottom : -(s.height - this.headerOffsets[1])
			});
		}
	},
	b4Drag : Ext.emptyFn,

	onDrag : function(e) {
		this.alignElWithMouse(this.proxy, e.getPageX(), e.getPageY());
	},

	endDrag : function(e) {
		this.win.unghost();
		this.win.saveState();
	}
});

sofa.ButtonGroup = Ext.extend(Ext.Container, {
	style : 'margin:0 auto',
	defaultType : 'button',
	layout : 'hbox',
	defaults : {
		margins : '5',
		width : 75
	},
	layoutConfig : {
		pack : 'center',
		align : 'middle'
	},
	useDefault : true,

	initComponent : function() {
		// 统一 Form 按钮封装
		if (this.useDefault) {
			var buttons = new Ext.util.MixedCollection();
			var _submit = false, _reset = false, _cancel = false;

			Ext.each(this.items, function(button) {
				var type = (button.type || 'button').toLowerCase();

				if (type == 'submit') {
					_submit = true;
					buttons.insert(0, Ext.id(), button);
				} else if (type == 'reset') {
					_reset = true;
					buttons.insert(1, Ext.id(), button);
				} else if (type == 'cancel') {
					_cancel = true;
					buttons.insert(2, Ext.id(), button);
				} else {
					buttons.add(Ext.id(), button);
				}
			}, this);

			if (!_submit && this.formId) {
				buttons.insert(0, Ext.id(), {
					itemId : 'submit',
					type : 'submit',
					text : sofa.Button.Submit
				});
			}
			if (!_reset && this.formId) {
				buttons.insert(1, Ext.id(), {
					itemId : 'reset',
					type : 'reset',
					text : sofa.Button.Reset
				});
			}
			if (!_cancel && this.windowId) {
				buttons.insert(2, Ext.id(), {
					itemId : 'cancel',
					type : 'cancel',
					text : sofa.Button.Cancel
				});
			}
			this.items = buttons.items;
		}
		this.buttons = this.items;

		this.addEvents('addbutton');
		sofa.ButtonGroup.superclass.initComponent.call(this);
	},

	getButtons : function() {
		return this.buttons;
	}
});

sofa.Button = Ext.extend(Ext.Button, {

	minWidth : 65,

	initComponent : function() {

		if (this.renderTo) {
			this.ctCls = 'sofa-form-item ' + Ext.value(this.ctCls, '');
		}

		sofa.Button.superclass.initComponent.call(this);

	},

	getValue : function() {
		return this.getText();
	},
	setValue : function(value) {
		this.setText(value);
	}
});

Ext.reg('button', sofa.Button);

sofa.form.FormPanel = Ext.extend(Ext.form.FormPanel, {

	border : true,

	labelAlign : 'right',

	labelWidth : 70,

	autoScroll : true,

	buttonAlign : 'center',

	initComponent : function() {

		this.buttons = [ {

			type : 'submit',

			itemId : 'submit',

			text : this.saveText,

			iconCls : this.saveIconCls || 'sofa-form-btn-save',

			handler : function() {

				this.submit();

			},

			scope : this

		}, {

			type : 'button',

			itemId : 'reset',

			text : this.resetText,

			iconCls : 'sofa-form-btn-reset',

			handler : function() {

				this.getForm().reset();

				this.focusFirst();

			},

			scope : this

		} ];

		sofa.form.FormPanel.superclass.initComponent.call(this);

		this.getForm().url = this.url;

		this.getForm().formPanel = this;

	},

	initEvents : function() {

		this.mon(this.el, 'keydown', function(e) {

			if (e.getKey() == e.ENTER) {

				this.submit();

			}

		}, this);

		sofa.form.FormPanel.superclass.initEvents.call(this);

	},

	focusFirst : function() {

		var items = this.getForm().items;

		if (items.getCount() > 0) {

			items.each(function(item) {

				if (item && item.isVisible()) {

					item.focus();

					return false;

				}

			});

		}
	},

	submit : function() {

		if (this.getForm().isValid()) {

			this.getForm().submit({

				clientValidation : false,

				submitEmptyText : false,

				url : this.getForm().url,

				waitTitle : this.waitTitle,

				waitMsg : this.waitMsg,

				scope : this,

				success : function(form, action) {

					var msg = action.response.responseText;

					if (this.fireEvent('success', form, msg, action) !== false) {
						if (form.fileUpload) {
							if (msg.length > 0) {
								var rt = Ext.decode(msg);
								if (!rt.success) {
									sofa.error('保存失败', Ext.urlEncode(rt.message));
								} else {
									sofa.alert(Ext.urlEncode(rt.message));
								}
							}
						} else {
							sofa.alert(Ext.isEmpty(msg) ? '保存成功' : msg);
						}
					}

				},

				failure : function(form, action) {

					switch (action.failureType) {
					case Ext.form.Action.CLIENT_INVALID:
						if (form.invalidField) {
							form.invalidField.focus();
						}
						return;
					case Ext.form.Action.CONNECT_FAILURE:
						msg = action.response.responseText;
						break;
					case Ext.form.Action.SERVER_INVALID:
						msg = action.result.errors;
						break;
					}

					if (this.fireEvent('failure', form, msg, action) !== false) {

						sofa.error('保存失败', msg);

					}

				}

			});

		} else {
			var field;
			if (field = this.getForm().invalidField) {
				field.focus();
			}
		}

	}

});

sofa.FormPanel = sofa.form.FormPanel;

sofa.search.FormPanel = Ext.extend(sofa.form.FormPanel, {

	initComponent : function() {

		this.bodyStyle = 'padding:15px',

		this.buttons = [ {

			type : 'submit',

			itemId : 'submit',

			text : this.searchText,

			iconCls : this.searchIconCls || 'sofa-form-btn-search',

			handler : function() {

				this.submit();

			},

			scope : this

		}, {

			type : 'button',

			itemId : 'reset',

			text : this.resetText,

			iconCls : 'sofa-form-btn-reset',

			handler : function() {

				this.getForm().reset();

				this.focusFirst();

			},

			scope : this

		} ];

		sofa.form.FormPanel.superclass.initComponent.call(this);

		this.getForm().url = this.url;

		this.getForm().formPanel = this;

	}

});

Ext.apply(sofa.form.FormPanel.prototype, {

	saveText : '保存',

	searchText : '查询',

	resetText : '重置',

	waitTitle : '表单提交',

	waitMsg : '正在提交...'

});

sofa.wizard = Ext.extend(sofa.Window, {

	modal : true,

	id : 'sofa-wizard',

	initComponent : function() {

		var me = this;

		me.offset = 0;

		me.layout = 'card';

		var items = me.items;

		delete me.items;

		me.items = [];

		me.titles = [];

		Ext.each(items, function(item) {

			if (item.title) {
				me.titles.push(item.title);
			} else {
				me.titles.push(me.title);
			}

			me.items.push({
				xtype : 'container',
				layout : 'fit',
				items : item
			});
		});

		me.buttonAlign = 'left';

		me.buttons = [ {
			id : 'sofa-wizard-chbox',
			xtype : 'checkbox',
			boxLabel : '不在提示'
		}, '->', {
			id : 'sofa-wizard-previous',
			text : '上一条',
			handler : function() {
				me.previous();
			}
		}, {
			id : 'sofa-wizard-next',
			text : '下一条',
			handler : function() {
				me.next();
			}
		} ];

		var provider = Ext.state.Manager.getProvider();

		if ('hidden' == provider.get(me.id)) {
			me.hidden = true;
		} else {
			me.hidden = false;
		}

		sofa.wizard.superclass.initComponent.call(this);

		if (!me.hidden) {
			me.go(0);
		}

		this.on('hide', me.showAgain, me);
		this.on('close', me.showAgain, me)

	},

	showAgain : function(bl) {
		if (Ext.getCmp('sofa-wizard-chbox').getValue()) {
			Ext.state.Manager.getProvider().set(this.id, 'hidden');
		}
		if (bl == true) {
			Ext.state.Manager.getProvider().set(this.id, '');
		}
	},

	previous : function() {

		this.go(this.offset - 1);

	},

	next : function() {

		this.go(this.offset + 1);

	},

	go : function(offset) {

		var me = this;

		if (me.items.length > offset && offset >= 0) {

			me.getLayout().setActiveItem(offset);

			me.doLayout();

			me.setTitle(me.titles[offset]);

			me.offset = offset;

			Ext.getCmp('sofa-wizard-next').setText('下一条');

			if (me.offset == me.items.length - 1) {
				Ext.getCmp('sofa-wizard-next').setText('关闭');
			} else if (me.offset == 0) {
				Ext.getCmp('sofa-wizard-previous').setVisible(false);
			} else {
				Ext.getCmp('sofa-wizard-previous').setVisible(true);
			}
		} else if (me.items.length == offset) {

			me.close();

		}
	}

});

sofa.dir.ThumbView = Ext.extend(Ext.grid.GridView, {

	// 视图内每一个元素的尺寸
	elemSize : [ 80, 80 ],
	// 元素间距[上、右、下、左]
	elemPadding : [ 15, 15, 15, 15 ],

	thumbProperty : 'name',

	selectedRowClass : 'sofa-thumb-selected',

	init : function(grid) {

		this.grid = grid;

		this.initTemplates();

		this.initData(grid.store, grid.colModel);

	},

	onDataChange : function() {
		this.refresh();
	},

	onClear : function() {
		this.refresh();
	},

	onUpdate : function(store, record) {
		this.refreshRow(record);
	},

	onAdd : function(store, records, index) {
		this.insertRows(store, index, index + (records.length - 1));
	},

	onRemove : function(store, record, index, isUpdate) {
		if (isUpdate !== true) {
			this.fireEvent('beforerowremoved', this, index, record);
		}

		this.removeRow(index);

		if (isUpdate !== true) {
			this.processRows(index);
			this.applyEmptyText();
			this.fireEvent('rowremoved', this, index, record);
		}
	},

	onLoad : function() {
		if (Ext.isGecko) {
			if (!this.scrollToTopTask) {
				this.scrollToTopTask = new Ext.util.DelayedTask(this.scrollToTop, this);
			}
			this.scrollToTopTask.delay(1);
		} else {
			this.scrollToTop();
		}
	},

	refreshRow : function(record) {
		var row = this.mainBody.child('table@id=' + record.id);
		if (row) {
			var previous = row.dom.previous;
			var html = this.doRender(this.getThumbColumn(), r, ds);
			Ext.removeNode(row);
			if (!previous) {
				Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
			} else {
				Ext.DomHelper.insertHtml('beforeEnd', previous, html);
			}
		}
		this.fireEvent('rowupdated', this, rowIndex, record);
	},

	// TODO
	insertRows : function(ds, records, rowIndex) {
		var html = this.doRender(this.getThumbColumn(), records, ds, rowIndex);
		Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
	},

	initComponent : function() {

		sofa.dir.ThumbView.superclass.initComponent.call(this);

		Ext.EventManager.onWindowResize(this.doLayout, this, {
			delay : 300
		});

	},

	getElements : function() {
		return this.mainBody.query('table.sofa-thumb');
	},

	onLayout : function(w, h) {

		var me = this, elems = me.getElements();

		if (!elems)
			return;

		var count = 1, overflow, _overflow, top = me.elemPadding[0], right = me.elemPadding[1], bottom = me.elemPadding[2], left = me.elemPadding[3], x = left, y = top, boxWidth = me.elemSize[0], boxHeight = me.elemSize[1];

		Ext.each(elems, function(item) {

			// 先预排列位置
			if (item) {

				overflow = false;

				// 超出宽度
				if ((x + boxWidth + right) > w) {
					overflow = true;
				}

				if (overflow) {
					x = left;
					y += boxHeight + top + bottom;
				}

				_item = Ext.fly(item);

				_item.addClassOnOver('sofa-thumb-over');

				_item.setLeftTop(x, y);

				x += boxWidth + left + right;
			}
		});
	},

	refresh : function() {
		this.fireEvent('beforerefresh', this);
		this.grid.stopEditing(true);

		var result = this.renderBody();
		this.mainBody.update(result);
		this.processRows(0);
		this.layout();
		this.applyEmptyText();
		this.fireEvent('refresh', this);
	},

	layout : function(initial) {
		if (!this.mainBody) {
			return;
		}

		var grid = this.grid, gridEl = grid.getGridEl(), gridSize = gridEl.getSize(true), gridWidth = gridSize.width, gridHeight = gridSize.height, scroller = this.scroller, scrollStyle, headerHeight, scrollHeight;

		if (gridWidth < 20 || gridHeight < 20) {
			return;
		}

		if (grid.autoHeight) {
			scrollStyle = scroller.dom.style;
			scrollStyle.overflow = 'visible';

			if (Ext.isWebKit) {
				scrollStyle.position = 'static';
			}
		} else {
			this.el.setSize(gridWidth, gridHeight);

			scrollHeight = gridHeight;

			scroller.setSize(gridWidth, scrollHeight);

		}

		this.onLayout(gridWidth, scrollHeight);
	},

	renderBody : function() {
		var me = this, startIndex = 0, endIndex = me.ds.getCount(), records = me.ds.getRange(startIndex, endIndex);

		return me.doRender(me.getThumbColumn(), records, me.store, startIndex);
	},

	getThumbColumn : function() {
		var me = this, cm = this.cm, fs = this.ds.fields, name, idx;

		var idx, name;

		if (cm.getColumnCount() > 0) {
			idx = 0;
			Ext.each(cm.config, function(cfg) {
				if (cfg.xtype == 'dircolumn') {
					name = cfg.dataIndex;
					return false;
				}
				idx++;
			});
		}

		return {
			name : name,
			renderer : cm.getRenderer(idx),
			scope : cm.getRendererScope(idx),
			id : cm.getColumnId(idx)
		};
	},

	doRender : function(column, rs, store, startIndex) {
		var me = this, buf = [], leafField = me.grid.leafProperty || 'leaf', idField = me.grid.idProperty || me.grid.idBind, value, leaf, r, meta, len = rs.length;

		for (var i = startIndex; i < len; i++) {

			r = rs[i];

			meta = {};

			value = r.data[column.name];

			value = column.renderer.call(column.scope, value, meta, r, store, i);

			buf[buf.length] = me.template.apply({
				id : r.data[idField] || r.id,
				title : value,
				value : value,
				iconCls : meta.iconCls,
				icon : meta.icon || Ext.BLANK_IMAGE_URL,
				itemCls : meta.css
			});
		}
		return buf.join('');
	},

	rowSelector : 'table.sofa-thumb',

	initTemplates : function() {

		var multiSelect = this.grid.multiSelect;

		this.template = new Ext.Template('<table title="{title}" ext:id="{id}" cellspacing="0" class="sofa-thumb {itemCls}"><tbody>', '<tr>', '<td class="sofa-thumb-tl">', (multiSelect ? '<img class="sofa-thumb-checkbox" src="{icon}"/>' : '<i>&#160;</i>'), '</td>', '<td class="sofa-thumb-tc">', '<img class="sofa-thumb-icon {iconCls}" src="{icon}"/>', '</td>', '<td class="sofa-thumb-tr"><i>&#160;</i></td>', '</tr>',

		'<tr>', '<td colspan="3" class="sofa-thumb-mc">', '<div class="sofa-thumb-text">', '<div class="sofa-thumb-text-left">', '<div class="sofa-thumb-text-right">', '<div class="sofa-thumb-text-center">', '<em class="" unselectable="on">', '<button type="button">{value}</button>', '</em>', '</div>', '</div>', '</div>', '</div>', '</td>', '</tr>', '</tbody></table>');

		this.masterTpl = new Ext.Template('<div class="sofa-dir sofa-dir-thumb" hidefocus="true">', '<div class="sofa-dir-viewport">', '<div class="sofa-dir-header"><div class="soda-dir-header-inner"></div></div>', '<div class="sofa-dir-scroller">', '<div class="sofa-dir-body" style="{bstyle}">{body}</div>', '<a href="#" class="sofa-dir-focus" tabIndex="-1"></a>', '</div>', '</div>', '<div class="x-grid3-resize-marker">&#160;</div>', '<div class="x-grid3-resize-proxy">&#160;</div>', '</div>');

	},

	initElements : function() {
		var Element = Ext.Element, el = Ext.get(this.grid.getGridEl().dom.firstChild), mainWrap = new Element(el.child('div.sofa-dir-viewport')), mainHd = new Element(mainWrap.child('div.sofa-dir-header')), scroller = new Element(mainWrap.child('div.sofa-dir-scroller'));

		Ext.apply(this, {
			el : el,
			mainWrap : mainWrap,
			mainHd : mainHd,
			scroller : scroller,
			innerHd : mainHd.child('div.soda-dir-header-inner').dom,
			mainBody : new Element(Element.fly(scroller).child('div.sofa-dir-body')),
			focusEl : new Element(Element.fly(scroller).child('a')),

			resizeMarker : new Element(el.child('div.x-grid3-resize-marker')),
			resizeProxy : new Element(el.child('div.x-grid3-resize-proxy'))
		});

		// this.focusEl.swallowEvent('click', true);
	},

	focusRow : function(row) {
		// this.focusCell(row, 0, false);
	},

	focusCell : function(row, col, hscroll) {

		var focusEl = this.focusEl;

		if (Ext.isGecko) {
			focusEl.focus();
		} else {
			focusEl.focus.defer(1, focusEl);
		}
	},

	processRows : function(startRow) {
		if (!this.ds || this.ds.getCount() < 1) {
			return;
		}

		var rows = this.getRows(), length = rows.length, row, i;

		startRow = startRow || 0;

		for (i = 0; i < length; i++) {
			row = rows[i];
			if (row) {
				row.rowIndex = i;
			}
		}
	},

	processEvent : function(name, e) {
		var target = e.getTarget(), grid = this.grid, row, cell, col, body;

		grid.fireEvent(name, e);

		row = this.findRowIndex(target);

		if (row !== false) {
			cell = this.findCellIndex(target);
			if (cell !== false) {
				col = grid.colModel.getColumnAt(cell);
				if (grid.fireEvent('cell' + name, grid, row, cell, e) !== false) {
					if (!col || (col.processEvent && (col.processEvent(name, e, grid, row, cell) !== false))) {
						grid.fireEvent('row' + name, grid, row, e);
					}
				}
			} else {
				if (grid.fireEvent('row' + name, grid, row, e) !== false) {
					(body = this.findRowBody(target)) && grid.fireEvent('rowbody' + name, grid, row, e);
				}
			}
		} else {
			grid.fireEvent('container' + name, grid, e);
		}
	},

	afterRender : function() {
		if (!this.ds || !this.cm) {
			return;
		}

		this.mainBody.dom.innerHTML = this.renderBody() || '&#160;';

		if (this.deferEmptyText !== true) {
			this.applyEmptyText();
		}

		this.grid.fireEvent('viewready', this.grid);
	},

	afterRenderUI : function() {
		var grid = this.grid;
		this.initElements();
	},

	renderUI : function() {
		return this.masterTpl.apply({
			body : '&#160;'
		});
	}
});

sofa.dir.RouteToolbar = Ext.extend(Ext.Toolbar, {

	cls : 'sofa-dir-toolbar',

	enableOverflow : true,

	initComponent : function() {
		sofa.dir.RouteToolbar.superclass.initComponent.call(this);
		this.routes = new Ext.util.MixedCollection();
	},

	destroy : function() {
		this.routes.clear();
		this.routes = null;
		sofa.dir.RouteToolbar.superclass.destroy.call(this);
	},

	init : function(grid) {
		var me = this;

		me.grid = grid, me.store = grid.getStore(), me.cm = grid.colModel;

		me.checkbox = me.add({
			iconCls : 'dir-checkbox',
			selectAll : false,
			visible : (grid.multiSelect && grid.viewMode !== 'table'),
			handler : function() {
				if (this.selectAll) {
					me.grid.getSelectionModel().clearSelections();
					this.selectAll = false;
					this.setIconClass('dir-checkbox');
				} else {
					me.grid.getSelectionModel().selectAll();
					this.selectAll = true;
					this.setIconClass('dir-checkbox-pressed');
				}
			}
		});

		me.root = me.add({
			iconCls : 'dir-root',
			handler : function() {
				me.grid.openRootDir.call(me.grid);
				me.clear();
			}
		});

		me.firstItem = me.add('-');

		me.lastItem = me.add('->');

		me.add({
			width : 30,
			iconCls : 'dir-tool',
			menu : new Ext.menu.Menu({
				items : [ {
					iconCls : 'dir-thumb',
					text : '视图模式',
					scope : me,
					handler : function() {
						me.viewMode = 'thumb';
						if (me.viewMode != me.grid.viewMode) {
							me.grid.toggleView();
						}
					}
				}, {
					iconCls : 'dir-table',
					text : '表格模式',
					scope : me,
					handler : function() {
						me.viewMode = 'table';
						if (me.viewMode != me.grid.viewMode) {
							me.grid.toggleView();
						}
					}
				} ]
			})
		});

		me.activeItem = me.root;
	},

	clear : function() {
		var me = this;

		var lastPos = me.items.indexOf(me.lastItem);
		var beginPos = me.items.indexOf(me.firstItem);
		for (var i = beginPos + 1; i < lastPos; i++) {
			me.remove(me.items.itemAt(beginPos + 1));
		}
		me.checkbox.selectAll = false;
		me.checkbox.setIconClass('dir-checkbox');
		me.routes.clear();
	},

	hidebox : function(hidden) {
		var me = this;
		if (hidden) {
			me.checkbox.selectAll = false;
			me.checkbox.setIconClass('dir-checkbox');
			me.checkbox.hide();
		} else {
			me.checkbox.show();
		}
	},

	addRoute : function(text, r) {
		var me = this, currentLength = me.routes.getCount();

		var idx;
		if (currentLength > 0) {
			idx = me.items.indexOf(me.lastItem);
			me.insert(idx, '-');
		} else {
			idx = me.items.indexOf(me.firstItem);
		}
		idx++;

		var item = me.insert(idx, {
			iconCls : 'dir-arrow',
			iconAlign : 'right',
			text : text,
			handler : function() {
				var grid = me.grid;
				grid.openDir.call(grid, r);

				var lastPos = me.items.indexOf(me.lastItem);
				var pos = me.items.indexOf(this);
				for (var i = pos + 1; i < lastPos; i++) {
					me.remove(me.items.itemAt(pos + 1));
				}
			}
		});

		me.routes.add(currentLength, item);

		me.doLayout();
	}
});

sofa.dir.RowSelectionModel = Ext.extend(sofa.grid.RowSelectionModel, {});

sofa.dir.CheckboxSelectionModel = Ext.extend(sofa.grid.CheckboxSelectionModel, {

	isThumbView : false,

	initEvents : function() {
		if (this.isThumbView) {
			this.isColumn = false;
			Ext.grid.CheckboxSelectionModel.superclass.initEvents.call(this);
		} else {
			this.isColumn = true;
			sofa.dir.CheckboxSelectionModel.superclass.initEvents.call(this);
		}
	}

});

sofa.grid.DirColumn = Ext.extend(Ext.grid.Column, {

	constructor : function(cfg) {

		sofa.grid.DirColumn.superclass.constructor.call(this, cfg);

		var me = this;

		this.renderer = function(v, meta, r) {
			var leafCss, folderCss;
			if (!meta.css) {
				meta.css = '';
			}
			if (me.grid.viewMode == 'thumb') {
				leafCss = 'sofa-thumb-leaf';
				folderCss = '';
			} else {
				leafCss = 'sofa-dir-leaf';
				folderCss = 'sofa-dir-folder';
			}
			if (r.data[me.grid.leafProperty]) {
				meta.css += ' ' + leafCss;
			} else {
				meta.css += ' ' + folderCss;
			}

			return v;
		}
	}
});

Ext.apply(Ext.grid.Column.types, {
	dircolumn : sofa.grid.DirColumn
});

sofa.dir.Directory = Ext.extend(sofa.grid.GridPanel, {

	useLockingColumnModel : true,

	multiSelect : false,

	onlySelectLeaf : false,

	checkOnly : true,

	viewMode : 'table',

	idBind : 'id',
	// 表示叶子目录的属性
	leafProperty : 'leaf',
	// 表示子节点的属性
	childrenProperty : 'children',

	// 表示深度的属性
	depthProperty : 'depth',
	// 表示路径的属性
	pathProperty : 'path',
	// 表示父目录的属性
	parentProperty : 'parentId',

	// 用于传递当前节点特征信息的参数名
	dirParam : 'node',

	initComponent : function() {

		var me = this;

		if (Ext.isArray(me.columns)) {

			Ext.each(me.columns, function(column) {
				if (column.hidden !== true) {
					column.xtype = 'dircolumn';
					column.grid = me;
					return false;
				}
			});

		}

		if (!me.fields) {
			me.fields = [];
		}

		if (Ext.isString(me.fields)) {

			var fields = me.fields.split(',');

			me.fields = [];

			for (var i = 0; i < fields.length; i++) {

				me.fields.push({
					name : fields[i],
					mapping : fields[i]
				})

			}

		}

		if (Ext.isArray(me.fields)) {
			me.fields = [ {
				name : me.leafProperty,
				mapping : me.leafProperty,
				type : 'bool'
			}, {
				name : me.depthProperty,
				mapping : me.depthProperty,
				type : 'int',
				defaultValue : -1
			}, {
				name : me.pathProperty,
				mapping : me.pathProperty
			} ].concat(me.fields);
		}

		me.routeBar = new sofa.dir.RouteToolbar();

		me.tbar = me.routeBar;

		sofa.dir.Directory.superclass.initComponent.call(this);

		me.routeBar.init(me);
	},

	getView : function() {
		if (!this.view) {
			if (this.viewMode != 'table') {
				this.view = new sofa.dir.ThumbView(this.viewConfig);
			} else {
				if (this.useLockingColumnModel) {
					if (this.buffer) {
						this.view = new Ext.grid.LockingBufferView(this.viewConfig);
					} else {
						this.view = new Ext.grid.LockingGridView(this.viewConfig);
					}
				} else {
					this.view = new Ext.grid.GridView(this.viewConfig);
				}
			}
		} else {
			if (this.view instanceof sofa.dir.ThumbView) {
				this.viewMode = 'thumb';
			} else {
				this.viewMode = 'table';
			}
		}
		return this.view;
	},

	toggleView : function() {
		this.un('bodyresize', this.view.layout, this.view);
		this.un('headerclick', this.view.onHeaderClick, this.view);
		this.view.initData(null, null);
		this.view.purgeListeners();
		this.view = null;
		var isThumbView = false;
		if (this.viewMode != 'thumb') {
			this.viewMode = 'thumb';
			isThumbView = true;
		} else {
			this.viewMode = 'table';
		}
		this.view = this.getView();
		this.view.init(this);
		this.view.render();

		this.selModel = null;
		this.getSelectionModel().init(this);
		if (this.viewMode != 'thumb') {
			if (this.selModel instanceof sofa.grid.CheckboxSelectionModel) {
				this.selModel.regEvents();
			}
			if (this.routeBar) {
				this.routeBar.hidebox(true);
			}
		} else {
			if (this.routeBar && this.multiSelect) {
				this.routeBar.hidebox(false);
			}
		}
		this.view.refresh();
	},

	initEvents : function() {
		sofa.dir.Directory.superclass.initEvents.call(this);
		this.on('rowdblclick', this.processRowDblClick, this);
	},

	getSelectionModel : function() {

		var isThumbView = false;

		if (this.viewMode != 'table') {
			isThumbView = true;
		}

		if (!this.selModel) {

			if (this.multiSelect) {

				this.selModel = new sofa.dir.CheckboxSelectionModel({

					checkOnly : (isThumbView ? false : (this.checkOnly || true)),

					isThumbView : isThumbView

				});

			} else {

				this.selModel = new sofa.dir.RowSelectionModel({

					checkOnly : false

				});

			}

		}

		if (this.useLockingColumnModel) {
			this.selModel.locked = true;
		}

		return this.selModel;

	},

	processRowDblClick : function(grid, rowIndex, e) {
		var me = this;
		if (me.store) {
			var r = me.store.getAt(rowIndex);
			if (!r || (r && r.data[me.leafProperty] == true)) {
				return;
			}
			var cm = me.getColumnModel();
			if (cm) {
				var firstDataIndex;
				Ext.each(cm.config, function(cfg) {
					if (cfg.xtype == 'dircolumn') {
						firstDataIndex = cfg.dataIndex;
						return false;
					}
				});
				// 通知routeBar改变信息
				if (me.routeBar && firstDataIndex) {
					var routeText = r.data[firstDataIndex];
					me.routeBar.addRoute(routeText || '', r);
				}
				// 打开下一级目录
				me.openDir(r);
			}
		}
	},

	openRootDir : function() {
		var me = this;
		me.clearRequestParams([ me.dirParam ]);
		me.reload();
	},

	reload : function() {
		var me = this;
		if (me.routeBar) {
			me.routeBar.clear();
		}
		sofa.dir.Directory.superclass.reload.apply(this, arguments);
	},

	openDir : function(r) {
		if (!r)
			return;

		var me = this;

		// 叶子节点没有打开目录事件
		if (r.data[me.leafProperty] == true) {
			return;
		}

		/*
		 * var children = r.data[me.childrenProperty]; // 同步 if
		 * (Ext.isArray(children)) { me.store.removeAll();
		 * me.store.loadData(children);
		 */
		// 异步
		// } else {
		params = me.getRequestParams();
		params[me.dirParam] = r.data[me.idProperty || me.idBind];
		me.setRequestParams(params);
		sofa.dir.Directory.superclass.reload.apply(this);
		// }
	}

});

sofa.form.SearchBox = Ext.extend(Ext.form.TriggerField, {

	displayField : 'text',

	validationEvent : false,
	validateOnBlur : false,
	lazyInit : true,
	triggerClass : 'x-form-search-trigger',

	initComponent : function() {
		this.defaults = this.defaults || {};
		if (this.items) {
			this.defaults.items = this.items;
			delete this.items;
		}
		this.data = new Ext.util.MixedCollection();
		this.addEvents('beforeselect', 'select');
		sofa.form.SearchBox.superclass.initComponent.call(this);
	},

	choose : function() {
		if (this.view) {
			var rs = this.view.getSelectedRecords();
			if (this.fireEvent('beforeselect', this, rs) !== false) {
				this.onSelect(rs);
				this.fireEvent('select', this, rs);
			}
		}
	},

	cancel : function() {
		if (this.triggerCt) {
			this.triggerCt.hide();
		}
	},

	onSelect : function(rs) {
		var me = this, valueField = me.valueField || me.displayField, leaf, rec;

		if (!Ext.isArray(rs)) {
			rs = [].concat(rs);
		}
		Ext.each(rs, function(r) {
			if (!r) {
				return;
			}
			if (r.record) {
				rec = r.record;
			} else {
				rec = r;
			}
			if (rec instanceof Ext.data.Record) {
				if (me.onlySelectLeaf) {
					leaf = false;
					if (r && r.record) {
						leaf = r.isLeaf ? r.isLeaf() : false;
					} else {
						leaf = rec.data[me.view.leafProperty];
					}
					if (!leaf) {
						return;
					}
				}
				me.data.add(rec.data[valueField], rec.data[me.displayField]);
			}
		});
		this.value = me.data.keys.join(',');
		if (this.hiddenField) {
			this.hiddenField.value = this.value;
		}
		sofa.form.SearchBox.superclass.setValue.call(this, me.data.items.join(','));
	},

	onTriggerClick : function() {
		this.initView();
		if (this.triggerCt) {
			this.triggerCt.show();
			if (this.isLoaded == false) {
				this.view.reload();
			}
		}
	},

	clearValue : function() {
		if (this.view && this.view.rendered) {
			this.view.clearSelections();
		}
		sofa.form.SearchBox.superclass.clearValue.call(this);
	},

	clear : function() {
		this.onClear();
	},

	onClear : function() {
		this.isLoaded = false;
		this.clearValue();
		this.data.clear();
		this.clearInvalid();
	},

	toggleMultiSelect : function(multiSelect) {
		if (this.view) {
			this.view.toggleMultiSelect(multiSelect);
		}
	},

	setRequestParams : function() {
		if (this.view) {
			this.view.setRequestParams.apply(this.view, arguments);
		}
	},

	clearRequestParams : function() {
		if (this.view) {
			this.view.clearRequestParams.apply(this.view, arguments);
		}
	},

	getRequestParams : function() {
		if (this.view) {
			return this.view.getRequestParams();
		}
	},

	loadData : function() {
		if (this.view) {
			this.view.loadData.apply(this.view, arguments);
		}
	},

	reload : function() {
		if (this.view) {
			this.view.reload.apply(this.view, arguments);
		}
	},

	setTimeout : function() {
		if (this.view) {
			this.view.setTimeout.apply(this.view, arguments);
		}
	},

	initSelected : function() {
		if (!this.store) {
			return;
		}
		var me = this, valueField = me.valueField || me.displayField, rec;
		if (me.data.getCount() > 0) {
			var rs = me.store.getRange();
			var selRecs = [];
			Ext.each(rs, function(r) {
				if (!r) {
					return;
				}
				if (r.record) {
					rec = r.record;
				} else {
					rec = r;
				}
				if (rec instanceof Ext.data.Record && me.data.containsKey(rec.data[valueField])) {
					selRecs.push(r);
					return;
				}
			});
			this.view.selectRecords(selRecs);
		}
	},

	onRender : function(ct, position) {

		sofa.form.SearchBox.superclass.onRender.call(this, ct, position);

		if (!this.lazyInit) {
			this.initView();
		}

		if (this.hiddenId) {
			this.hiddenField = this.el.insertSibling({
				tag : 'input',
				type : 'hidden',
				name : this.hiddenId,
				id : (this.hiddenId || Ext.id())
			}, 'before', true);
		}

		this.triggerWrap = this.trigger.wrap({
			tag : 'span',
			cls : 'x-form-twin-triggers'
		});

		this.clearTrigger = this.triggerWrap.createChild({
			tag : "img",
			src : Ext.BLANK_IMAGE_URL,
			style : "display:none;",
			title : this.clearText,
			cls : "ext-form-trigger ext-form-clear-trigger"
		}, this.trigger);

		this.clearTrigger.addClassOnOver('ext-form-clear-hover');

		this.clearTrigger.enableDisplayMode(Ext.Element.HIDDEN);

		this.mon(this.clearTrigger, 'click', function() {
			this.onClear();
		}, this);
	},

	initView : function() {
		if (!this.triggerCt) {
			this.triggerCt = new Ext.Window(Ext.apply({
				layout : 'fit',
				height : 300,
				width : 400,
				modal : true,
				border : false,
				maximizable : true,
				closeAction : 'hide',
				buttonAlign : 'center',
				buttons : [ {
					text : this.chooseText,
					scope : this,
					handler : this.choose
				}, {
					text : this.confirmText,
					scope : this,
					handler : function() {
						this.choose();
						this.cancel();
					}
				}, {
					text : this.cancelText,
					scope : this,
					handler : this.cancel
				} ]
			}, this.defaults));

			this.view = this.triggerCt.items.itemAt(0);

			Ext.apply(this.view, {
				clearSelections : function() {
					this.getSelectionModel().clearSelections();
				},
				clear : function() {
					this.store.removeAll();
				},
				selectRecords : function(rs) {
					this.getSelectionModel().selectRecords(rs);
				},
				getSelectedRecords : function() {
					return this.getSelectionModel().getSelections();
				}
			});
			this.store = this.view.getStore();

			if (this.timeout) {
				this.setTimeout(this.timeout);
			}
		}
	},

	initEvents : function() {

		sofa.form.SearchBox.superclass.initEvents.call(this);

		if (this.store) {
			this.store.on('load', function() {
				this.initSelected();
				this.isLoaded = true;
			}, this);
		}

		this.on('specialkey', function(f, e) {
			if (e.getKey() == e.ENTER) {
				this.onTriggerClick();
			}
		}, this);

		this.on("focus", function() {
			this.clearTrigger.show();
			var w = this.triggerWrap.getWidth() - this.trigger.getWidth();
			this.el.setWidth(this.el.getWidth() - w);
		}, this);

		this.on("blur", function() {
			var w = this.triggerWrap.getWidth() - this.trigger.getWidth();
			this.clearTrigger.hide();
			this.el.setWidth(this.el.getWidth() + w);
		});
	}

});

Ext.reg('searchbox', sofa.form.SearchBox);