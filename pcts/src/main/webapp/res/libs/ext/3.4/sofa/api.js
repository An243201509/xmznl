var log = function(str) {
	if (console && console.log) {
		console.log(str);
	} else {
		alert(str);
	}
};

var debug = function(o) {
	log(o);
};

Ext.ns('sofa.api');

sofa.api = function() {
	function UUID() {
		this.id = this.createUUID();
	}
	UUID.prototype.valueOf = function() {
		return this.id;
	};
	UUID.prototype.toString = function() {
		return this.id;
	};
	UUID.prototype.createUUID = function() {
		var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
		var dc = new Date();
		var t = dc.getTime() - dg.getTime();
		var tl = UUID.getIntegerBits(t, 0, 31);
		var tm = UUID.getIntegerBits(t, 32, 47);
		var thv = UUID.getIntegerBits(t, 48, 59) + '1';
		var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
		var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
		var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7)
				+ UUID.getIntegerBits(UUID.rand(8191), 8, 15)
				+ UUID.getIntegerBits(UUID.rand(8191), 0, 7)
				+ UUID.getIntegerBits(UUID.rand(8191), 8, 15)
				+ UUID.getIntegerBits(UUID.rand(8191), 0, 15);
		return tl + tm + thv + csar + csl + n;
	};
	UUID.getIntegerBits = function(val, start, end) {
		var base16 = UUID.returnBase(val, 16);
		var quadArray = new Array();
		var quadString = '';
		var i = 0;
		for (i = 0; i < base16.length; i++) {
			quadArray.push(base16.substring(i, i + 1));
		}
		for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
			if (!quadArray[i] || quadArray[i] == '')
				quadString += '0';
			else
				quadString += quadArray[i];
		}
		return quadString;
	};
	UUID.returnBase = function(number, base) {
		return (number).toString(base).toUpperCase();
	};
	UUID.rand = function(max) {
		return Math.floor(Math.random() * (max + 1));
	};

	var _getParams = function(grid) {

		var columns = [];

		var proxys = null;

		if (grid.getView() instanceof Ext.tree.View) {

			var config = grid.getColumnModel().config, 
					ds = grid.getStore(), 
					url = ds.dataUrl || ds.url, 
					params = ds.baseParams, 
					plugins = grid.plugins, 
					textParam, 
					childParam = ds.childrenParam || ds.children, 
					viewMode = 'treegrid';

			if (config && config.length > 0) {
				textParam = config[0].dataIndex;
				config[0].align = 'left';
			} else {
				textParam = ds.textParam || ds.text;
			}

		} else {
			var config = grid.getColumnModel().config, 
					url = grid.getStore().url || grid.url, 
					params = grid.getStore().baseParams, 
					plugins = grid.plugins, 
					viewMode = 'grid';
		}

		if (Ext.mapper && plugins) {
			for ( var i = 0; i < plugins.length; i++) {
				if (plugins[i] instanceof Ext.mapper.Mapper) {
					proxys = plugins[i].proxys;
				}
			}
			if (proxys) {
				var mapperProxys = [];
				for ( var i = 0; i < proxys.length; i++) {
					var json = {};
					json.url = sofa.api.getAbsoluteURL(proxys[i].url);
					json.mapping = Ext.isArray(proxys[i].mapping) ? proxys[i].mapping
							: [].concat(proxys[i].mapping);
					mapperProxys.push(json);
				}
			}
		}
		var c, cfg;
		for ( var i = 0; i < config.length; i++) {
			cfg = config[i];
			if (cfg.visible == false || cfg.hidden == true)
				continue;
			if (cfg.printable !== false) {
				c = {
					align : cfg.align,
					format : cfg.format,
					text : encodeURIComponent(cfg.header),
					dataIndex : cfg.dataIndex,
					mapping : cfg.mapping ? cfg.mapping : '',
					dataType : cfg.dataType ? cfg.dataType : 'string'
				};
				if (cfg.printEL) {
					c['printEL'] = cfg.printEL;
				}
				columns.push(c);
			}
		}

		var store = grid.getStore();

		var _getSortState = function() {
			var sorts = [];
			var sortState = grid.getStore().getSortState();

			if (sortState) {
				var sort = {
					field : sortState.field,
					direction : sortState.direction
				};
				sorts.push(Ext.encode(sort));
			}
			return sorts.join("");
		};

		var ps = {
			title : encodeURIComponent(document.title),
			url : sofa.api.getAbsoluteURL(url),
			params : Ext.encode(params),
			columns : columns,
			childParam : childParam,
			textParam : textParam,
			sort : _getSortState(grid),
			viewMode : viewMode
		};
		
		if (grid.pagingbar) {
			ps.start = grid.pagingbar.cursor;
			ps.limit = grid.pagingbar.pageSize;
		}
		
		if (mapperProxys) {
			ps.mapperProxys = Ext.encode(mapperProxys);
		}
		return ps;
	};

	var _getSessionId = function() {
		if (document.cookie.length > 0) {
			var SESSIONID = 'JSESSIONID';
			var index = document.cookie.indexOf(SESSIONID + "=");
			if (index != -1) {
				index = index + SESSIONID.length + 1;
				var endIndex = document.cookie.indexOf(";");
				if (endIndex == -1) {
					endIndex = document.cookie.length;
				}
				return unescape(document.cookie.substring(index, endIndex));
			}
		}
		return "";
	};

	var openSubmit = function(url, ps, type) {
		var paramer = "resizable=yes,toolbar=no,menubar=no,scrollbars=no,location=no,status=no";

		var winHeight = 400, winWidth = 600, viewMode, win;

		if (type) {// for excel
			viewMode = "export_viewer";
			if (ps.width) {
				winWidth = ps.width;
			} else if (ps.height) {
				winHeight = ps.height;
			} else {
				winWidth = 600;
				winHeight = 250;
			}// for export set default width and height value;
		} else {// for print
			viewMode = "print_viewer";
			if (ps.width)
				winWidth = ps.width;
			if (ps.height)
				winHeight = ps.height;
		}
		
		if (ps.url) {
			ps.url = sofa.api.getAbsoluteURL(ps.url);
		}

		if (winWidth)
			paramer = "width=" + winWidth + "," + paramer;
		if (winHeight)
			paramer = "height=" + winHeight + "," + paramer;

		var doc = document;

		if (win && win.open) {
			win.close();
		}
		win = window.open(url, viewMode, paramer);

		var form = doc.createElement('form'), hiddens = [], hd;

		doc.body.appendChild(form);
		Ext.fly(form).set({
			target : viewMode,
			method : 'POST',
			action : url
		});
		Ext.iterate(ps, function(k, v) {
			hd = doc.createElement('input');
			Ext.fly(hd).set({
				type : 'hidden',
				value : (typeof v == 'object' ? Ext.encode(v) : v),
				name : k
			});
			form.appendChild(hd);
			hiddens.push(hd);
		});
		form.submit();
		Ext.removeNode(form);
		Ext.each(hiddens, function(h) {
			Ext.removeNode(h);
		});
	};
	var formSubmit = function(opts){
		var doc = document;
		var id = Ext.id(), 
			form = doc.createElement('form'), 
			frame = doc.createElement('iframe'), 
			hiddens = [], hd;
		Ext.fly(frame).set({
            id: id,
            name: id,
            /* 
            width: 500,
            height: 500,
            style:'position:absolute;z-index:99;left:100;top:100',
            */
            cls: 'x-hidden',
            src: Ext.SSL_SECURE_URL
        }); 
        doc.body.appendChild(frame);
		Ext.fly(form).set({
            target: id,
			method : 'POST',
			action : opts.url
		});
		doc.body.appendChild(form);
		if(Ext.isIE){
            document.frames[id].name = id;
        }
		Ext.iterate(opts.params || {}, function(k, v) {
			hd = doc.createElement('input');
			Ext.fly(hd).set({
				type : 'hidden',
				value : (typeof v == 'object' ? Ext.encode(v) : v),
				name : k
			});
			form.appendChild(hd);
			hiddens.push(hd);
		});
		function cb(){
			var me = this,
	          	r = {responseText : '', responseXML : null, argument : opts.argument},
	          	doc, firstChild;
			try{
				doc = frame.contentWindow.document || frame.contentDocument || WINDOW.frames[id].document;
				if(doc){
					if(doc.body){
						if(/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)){ 
							r.responseText = firstChild.value;
						}else{
							r.responseText = doc.body.innerHTML;
						}
					}
					r.responseXML = doc.XMLDocument || doc;
				}
			}
			catch(e) {}
			Ext.EventManager.removeListener(frame, 'load', cb, me);
			if (opts.listeners && opts.listeners.requestcomplete) {
				opts.listeners.requestcomplete.call(opts.listeners.scope || me, me, r, opts);
			}
			function runCallback(fn, scope, args){
				if(Ext.isFunction(fn)){
					fn.apply(scope, args);
				}
			}
			runCallback(opts.success, opts.scope, [r, opts]);
			runCallback(opts.callback, opts.scope, [opts, true, r]);
			if(!opts.debugUploads){
				setTimeout(function(){Ext.removeNode(frame);}, 100);
			}
		}
		Ext.EventManager.on(frame, 'load', cb, this);
		form.submit();
		Ext.removeNode(form);
		Ext.each(hiddens, function(h) {
			Ext.removeNode(h);
		});
	}

	var getPortal = function() {
		if (portal)
			return portal;

		var win = window, parent, _portal, counter = 0;

		while ((parent = win.parent) != null) {
			if (parent == win)
				break;
			if (counter == 20)
				break;

			var id = parent.id || parent.name;
			if (parent.portal && id.toLowerCase() == 'sofaportal') {
				_portal = parent.portal;
				break;
			}

			win = parent;
			counter++;
		}

		portal = _portal;
		return portal;
	};

	var _obj, portal;

	return {
		
		getServerDate : function(){
			return sofa.api.getContext().getServerDate();
		},
		
		getCurrentDate : function(){
			return new Date().clearTime();
		},
		
		getAbsoluteURL : function(url) {
			if (url) {
				if (/^(http|https):\/\//ig.test(url)) {
					return url;
				} else if (url.indexOf('./') == 0) {
					var _url = document.location.href;
					url = _url.substring(0, _url.lastIndexOf('/') + 1) + url;
				} else if (url.indexOf('/') == 0) {
					url = document.location.host + url;
				} else {
					var _url = document.location.href;
					url = _url.substring(0, _url.lastIndexOf('/') + 1) + url;
				}
				return url;
			}
		},
		
		getDomain : function(url) {
			url = this.getAbsoluteURL(url);
			url = url.replace(/^(http|https):\/\//i, '');
			var start = url.indexOf(':'), end = url.indexOf('/');
			var port = url.substring(start + 1, end);
			if (port == '80') {
				url = url.substring(0, start);
				return url;
			}
			return url.substring(0, end);
		},
		
		crossDomain : function(url) {
			return this.getDomain(url) !== this
					.getDomain(document.location.host);
		},
		
		getParameterURL : function(key, defValue) {
			var search = document.location.search;
			search = search.substring(1, search.length);
			var params = search.split('&');
			var value;
			Ext.each(params, function(param) {
				var arr = param.split('=');
				if (arr[0] == key) {
					//value = arr[1];
					value = decodeURIComponent(arr[1].replace(/\+/g, " "));
					return false;
				}
			});
			return value || defValue;
		},
		
		nextUUID : function() {
			return UUID.prototype.createUUID();
		},
		
		getContext: function(){
			return sofa.context;
		},
		
		/**
		 * config: {
		 * 
		 * url: '' 打印、导出主机地址 onBeforeSubmit: Function 打印、导出前触发方法
		 * 
		 * params: {
		 * 
		 * title: '' 正文标题 url: '' 取数url params: {} 取数参数条件 columns: [{ text: ''
		 * 列头信息 align : '' 列头文字位置, format : '' 用于数字格式化表达式, dataIndex : ''
		 * 绑定列字段信息, printEL : '' 打印表达式信息 }] rows: [{ text: '' align: '' colspan:
		 * number rowspan: number }]
		 * 
		 * viewMode: '' 树形指定为treegrid childParam: '' 树形指定子节点属性名 textParam: ''
		 * 树形指定节点名
		 * 
		 * start: number 分页起始页 limit: number 分页页总数 sort: [{ field: '' 排序字段名
		 * direction: 'ASC|DESC' 排序类型 }],
		 * 
		 * mapperProxys: [{ url: '' 映射取数地址 mappings: [{ from: '' 映射列 to: '' }] }] } }
		 * 
		 */
		print : function(config) {

			var ps;

			if (!config.params && config.grid) {
				ps = _getParams(config.grid);
			} else {
				ps = config.params;
			}

			Ext.apply(ps, {
				jsessionid : _getSessionId()
			});

			if (config.onBeforeSubmit) {
				var rt = eval(config.onBeforeSubmit)(ps);
				if (rt == false) {
					return;
				}
				Ext.apply(ps, rt);
			}

			var fn = function() {
				var url = config.url;
				if (url) {
					if (url.substring(url.length - 1, url.length) == '/') {
						url += 'printviewer';
					} else {
						url += '/printviewer';
					}
					openSubmit(url, ps);
				}
			};

			if (ps.columns.length > 10) {

				sofa.confirm('你打印的列超出了10列，会影响打印效果，你可以隐藏部分不需要打印的列，或者仍然继续打印？',

				function(rt) {
					if (rt == 'yes') {
						fn();
					}

				}, this);

			} else {

				fn();

			}

		},
		
		exportFile : function(config) {

			var ps;

			if (!config.params && config.grid) {
				ps = _getParams(config.grid);
			} else {
				ps = config.params;
			}

			Ext.apply(ps, {
				jsessionid : _getSessionId()
			});

			if (config.onBeforeSubmit) {
				var rt = eval(config.onBeforeSubmit)(ps);
				if (rt == false) {
					return;
				}
				Ext.apply(ps, rt);
			}

			var url = config.url;

			if (url) {
				if (url.substring(url.length - 1, url.length) == '/') {
					url += 'exportViewer';
				} else {
					url += '/exportViewer';
				}
				openSubmit(url, ps, config.type || 'xls');
			}
		},
		
		open : function(title, url) {
			var _portal;
			if (_portal = getPortal()) {
				if (url.indexOf('/') != 0) {
					url = sofa.api.getAbsoluteURL(url);
				} else {
					url = sofa.global.getAppBase() + url;
				}
				_portal.openCustomTab(Ext.id(), title, url);
			}
		},
		
		lock : function() {
			try {
				var _portal;
				if (_portal = getPortal()) {
					_obj = _portal.lock();
				}
			} catch (e) {
				sofa.api.unlock();
			}
		},
		
		unlock : function(obj) {
			try {
				var _portal;
				if (_portal = getPortal()) {
					_portal.unlock(obj || _obj);
				}
			} catch (e) {
			}
		},
		
		// TODO 跨域部分处理，尚未完成
		request : function(opts) {
			var url = opts.url;
			if (opts.bodyMask) {
				Ext.getBody().mask('loading','x-mask-loading');
				if (opts.callback) {
					opts.callback.createInterceptor(function(){
						Ext.getBody().unmask();
					});
				} else {
					opts.callback = function(){
						Ext.getBody().unmask();
					}
				}
			}
			if (!opts.failure && !opts.callback) {
				opts.failure = function(xhr){
					new Ext.handleError(xhr);
				}
			}
			if (opts.formSubmit) {
				formSubmit(opts);
				return;
			}
			if (this.crossDomain(url)) {
				Ext.Ajax.request(Ext.apply(opts, {
					scriptTag : true
				}));
			} else {
				Ext.Ajax.request(opts);
			}
		},
		
		encodeQueryParams : function(params) {
			if (typeof params == 'string') {
				return {
					_queryCondition : params
				}
			} else if (Ext.isArray(params)) {
				return {
					_queryCondition : params.join(' and ')
				}
			} else if (Ext.isObject(params)) {
				return {
					_queryCondition : Ext.urlEncode(params)
				}
			}
		},

		/**
		 * 封装公共业务方法 （审核、反审核、删除）
		 * id 操作类型：check | uncheck | del
		 * data 数据 record 数组或单数
		 * url 请求的地址

		 * alias 请求参数表名，默认为ids
		 * idField id字段，默认为id，为数组类型，则传递联合组合值
		 * auditedField 审核标记字段， 默认为 checked
		 * creatorField 创建人字段，默认为 creatorId
		 * editorField 修改人字段，默认为lastEditorId

		 * validateRule Function 自定义规则验证，如果设置为false，则不验证任何规则，直接提交

		 * callback 执行完提交后的回调函数
		 * scope 回调指针
		 */
		execute : function(opts) {
			var id = opts.id, url = opts.url, data = opts.data || opts.records,

			idField = opts.idField || 'id', alias = opts.alias || 'ids',

			auditedField = opts.auditedField || 'checked', creatorField = opts.creatorField
					|| 'creatorId', editorField = opts.editorField
					|| 'lastEditorId',

			callback = opts.callback, validateRule = opts.validateRule, scope = opts.scope;

			if (Ext.isEmpty(url)) {
				sofa.error('缺少执行参数', sofa.api.errorURL);
			}

			var audits = [], unAudits = [], fires = [], count = 0, _status, _creator, trigFire = false, audited = false, unAudited = false;

			var collect = function(_status, r) {
				if (_status == true || new Boolean(_status).valueOf() == true) {
					audited = true;
					audits.push(r);
				} else {
					unAudited = true;
					unAudits.push(r);
				}
			};

			var statisticsFn = function(r) {
				_status = r.get(auditedField);
				_creator = r.get(editorField);

				if (Ext.isEmpty(_creator)) {
					_creator = r.get(creatorField);
				}
				// TODO 不能审核自己
				if (!Ext.DEBUG && _creator == sofa.context.userid) {
					trigFire = true;
					fires.push(r);

					if (id == 'del') {
						collect(_status, r);
					}
				} else {
					collect(_status, r);
				}
			};
			if (Ext.isArray(data)) {
				Ext.each(data, statisticsFn);
				count = data.length;
			} else {
				statisticsFn(data);
				count = 1;
			}

			var ruleText = sofa.api.rules[id];

			if (count == 0) {
				sofa.alert(ruleText['rule4']);
				return;
			}

			var getParams = function(rs) {
				
				var params = {};
				
				if (Ext.isString(idField)) {
					idField = [].concat(idField);
				}
				
				if (Ext.isArray(idField)) {
					
					for (var i = 0; i < idField.length; i++) {
						
						var _idField = idField[i];
						var _alias, ids = [];
						
						Ext.each(rs, function(r) {
							id = r.get(_idField);
							if (!id) {
								id = r.id;
							}
							ids.push(id);
						}, this);
						
						if (Ext.isArray(alias) && alias.length > i) {
							_alias = alias[i];
						} else if (i == 0) {
							_alias = alias;
						} else {
							_alias = _idField;
						}
						params[_alias] = ids.join(',');
					}
					
				}
				return params;
			};
			var processEvent = function(rs) {
				var msgbox = Ext.MessageBox.wait(sofa.api.waitMsg, sofa.api.waitText);
				Ext.Ajax.request({
					url : url,
					params : getParams(rs),
					scope : this,
					success : function(xhr) {
						msgbox.hide();
						callback.call(scope || this, xhr.responseText, opts, true, rs);
					},
					failure : function(xhr) {
						msgbox.hide();
						callback.call(scope || this, xhr.responseText, opts, false, rs);
					}
				});
			};

			var baseValidateRule = function(rule) {

				var msg = String.format(ruleText['rule' + rule],
						(('check' == id || 'del' == id) ? audits.length
								: unAudits.length));

				switch (rule) {

				case 1:

					sofa.confirm(msg, function(rt) {

						if (rt == 'yes') {

							var selected;

							if ('check' == id || 'del' == id) {
								selected = unAudits;
							} else {
								selected = audits;
							}

							processEvent.defer(10, this, [ selected, opts ]);

							return false;
						}

					}, this);

					return;

				case 2:

					sofa.alert(msg);

					return;

				case 3:

					sofa.confirm(msg, function(rt) {

						if (rt == 'yes') {

							var selected = [].concat(unAudits).concat(audits);

							processEvent.defer(10, this, [ selected, opts ]);

							return false;
						}

					}, this);

					return;

				case 4:

					sofa.alert(msg);

					return;
				}
			};
			
			var useAudit = sofa.context.useAudit();

			var fn = function() {

				if (Ext.isEmpty(validateRule)) {
					// 规则，启用审核状态下，如果批量数据里有已审核、未审核，则提示继续执行符合条件的其他数据操作
					if (audited && unAudited && useAudit) 
					{
						baseValidateRule.call(this, 1);
					}
					// 规则，如果批量数据里只有已审核
					else if (audited && unAudited == false) 
					{
						// 反审核操作，提示确认信息
						// 不启用审核状态下，删除操作，提示确认信息
						if ('uncheck' == id || !useAudit) 
						{
							baseValidateRule.call(this, 3);
						} 
						// 审核操作，提示不能重复审核
						// 启用审核状态下、删除操作不允许执行
						else 
						{
							baseValidateRule.call(this, 2);
						}
						
					}
					// 规则，如果批量数据里只有未审核
					else if (unAudited && audited == false) 
					{
						// 不能重复执行反审核
						if ('uncheck' == id) 
						{
							baseValidateRule.call(this, 2);
						} 
						// 提示确认操作信息
						else 
						{
							baseValidateRule.call(this, 3);
						}
					}
					// 规则，如果选择的数据为空，提示选择数据
					else if (unAudited == false && audited == false) 
					{
						baseValidateRule.call(this, 4);
					}

				} 
				else if (Ext.isFunction(validateRule)) 
				{

					validateRule.call(scope || this, data);

				} 
				else 
				{

					var msg = String.format(ruleText['rule3'],
							(('check' == id || 'del' == id) ? audits.length
									: unAudits.length));

					sofa.confirm(msg, function(rt) {

						if (rt == 'yes') {

							var selected = [].concat(unAudits).concat(audits);

							processEvent.defer(10, this, [ selected, opts ]);

							return false;
						}

					}, this);

				}
			};

			if (trigFire && (id == 'uncheck' || id == 'check')) {
				if (count == fires.length) {
					sofa.alert(ruleText['rule6']);
					return;
				} else {
					var msg = String.format(ruleText['rule5'], fires.length);
					sofa.confirm(msg, function(rt) {
						if (rt == 'yes') {
							fn.call(this);
							return false;
						}
					}, this);
				}
			} else {
				fn.call(this);
			}
		},
		
		empty: function(str) {
			if (str == null) {
				return true;
			}
			if (typeof str == 'string') {
				return Ext.isEmpty(str.trim());
			}
			return str ? false : true;
		}

	};
}();
