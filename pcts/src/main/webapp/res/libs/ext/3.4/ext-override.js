/**
 * ext-override.js 重载ext自身控件功能，来实现改变一些功能
 */
//Ext.DEBUG = CONTEXT.DEBUG;
//Ext.LOCALE = CONTEXT.LOCALE;

Ext.ns('FORM.STATUS');
Ext.apply(FORM.STATUS, {
	BROWSE : 1 << 0,
	VIEW : 1 << 0,
	READ: 1 << 0,
	UPDATE : 1 << 1,
	EDIT : 1 << 1,
	ADD : 1 << 2,
	COPY : 1 << 3,
	WRITE: (1 << 1) | (1 << 2) | (1 << 3)
});


// 弹出对话框最小宽度180
Ext.MessageBox.minWidth = 180;

/**
 * Ajax
 * 
 * 同步|异步 两种请求方式
 * 
 * async: false 同步方式
 * 
 */
Ext.lib.Ajax = function() {
	var activeX = [ 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP' ], CONTENTTYPE = 'Content-Type';

	var portal_window;
	
	function getPortalWindow() {
		if (portal_window)
			return portal_window;

		var win = window, parent, _portal, counter = 0;

		while ((parent = win.parent) != null) {
			if (parent == win)
				break;
			if (counter == 20)
				break;

			var id = parent.id || parent.name;
			if (parent.portal && id.toLowerCase() == 'sofaportal') {
				_portal = parent;
				break;
			}

			win = parent;
			counter++;
		}

		portal_window = _portal;
		return portal_window;
	}
	// private
	function setHeader(o) {
		var conn = o.conn, prop, headers = {};

		function setTheHeaders(conn, headers) {
			for (prop in headers) {
				if (headers.hasOwnProperty(prop)) {
					conn.setRequestHeader(prop, headers[prop]);
				}
			}
		}

		Ext.apply(headers, pub.headers, pub.defaultHeaders);
		setTheHeaders(conn, headers);
		delete pub.headers;
	}
	// private
	function createExceptionObject(tId, callbackArg, isAbort, isTimeout) {
		return {
			tId : tId,
			status : isAbort ? -1 : 0,
			statusText : isAbort ? 'transaction aborted'
					: 'communication failure',
			isAbort : isAbort,
			isTimeout : isTimeout,
			argument : callbackArg
		};
	}
	// private
	function initHeader(label, value) {
		(pub.headers = pub.headers || {})[label] = value;
	}
	// private
	function createResponseObject(o, callbackArg) {
		var headerObj = {}, headerStr, conn = o.conn, t, s,
		// see:
		// https://prototype.lighthouseapp.com/projects/8886/tickets/129-ie-mangles-http-response-status-code-204-to-1223
		isBrokenStatus = conn.status == 1223;
		try {
			headerStr = o.conn.getAllResponseHeaders();
			Ext.each(headerStr.replace(/\r\n/g, '\n').split('\n'), function(v) {
				t = v.indexOf(':');
				if (t >= 0) {
					s = v.substr(0, t).toLowerCase();
					if (v.charAt(t + 1) == ' ') {
						++t;
					}
					headerObj[s] = v.substr(t + 1);
				}
			});
		} catch (e) {
		}
		return {
			tId : o.tId,
			// Normalize the status and statusText when IE returns 1223, see the
			// above link.
			status : isBrokenStatus ? 204 : conn.status,
			statusText : isBrokenStatus ? 'No Content' : conn.statusText,
			getResponseHeader : function(header) {
				return headerObj[header.toLowerCase()];
			},
			getAllResponseHeaders : function() {
				return headerStr;
			},
			responseText : conn.responseText,
			responseXML : conn.responseXML,
			argument : callbackArg
		};
	}
	// private
	function releaseObject(o) {
		if (o.tId) {
			pub.conn[o.tId] = null;
		}
		o.conn = null;
		o = null;
	}
	// private
	function handleTransactionResponse(o, callback, isAbort, isTimeout) {
		if (!callback) {
			releaseObject(o);
			return;
		}
		var httpStatus, responseObject;
		try {
			if (o.conn.status !== undefined && o.conn.status != 0) {
				httpStatus = o.conn.status;
			} else {
				httpStatus = 13030;
			}
		} catch (e) {
			httpStatus = 13030;
		}
		if ((httpStatus >= 200 && httpStatus < 300)
				|| (Ext.isIE && httpStatus == 1223)) {
			responseObject = createResponseObject(o, callback.argument);
			if (callback.success) {
				if (!callback.scope) {
					callback.success(responseObject);
				} else {
					callback.success.apply(callback.scope, [ responseObject ]);
				}
			}
		} else {
			// XXX 在AJAX异常时加入，对登录失效跳转到登录的拦截
			if (httpStatus == 506) {
				Ext.MessageBox.show({
					title : String.format(Ext.Ajax.title, httpStatus),
					msg : Ext.Ajax.msg,
					icon : Ext.MessageBox.ERROR,
					buttons : Ext.MessageBox.OK,
					fn : function() {
						try {
							var win = getPortalWindow();
							if (win) {
								win.login();
							} else {
								window.location.reload();
							}
						} catch (e) {
						}
					}
				});
				return;
			}
			switch (httpStatus) {
			case 12002:
			case 12029:
			case 12030:
			case 12031:
			case 12152:
			case 13030:
				responseObject = createExceptionObject(o.tId,
						callback.argument, (isAbort ? isAbort : false),
						isTimeout);
				if (callback.failure) {
					if (!callback.scope) {
						callback.failure(responseObject);
					} else {
						callback.failure.apply(callback.scope,
								[ responseObject ]);
					}
				}
				break;
			default:
				responseObject = createResponseObject(o, callback.argument);
				if (callback.failure) {
					if (!callback.scope) {
						callback.failure(responseObject);
					} else {
						callback.failure.apply(callback.scope,
								[ responseObject ]);
					}
				}
			}
		}
		releaseObject(o);
		responseObject = null;
	}
	function checkResponse(o, callback, conn, tId, poll, cbTimeout) {
		if (conn && conn.readyState == 4) {
			clearInterval(poll[tId]);
			poll[tId] = null;
			if (cbTimeout) {
				clearTimeout(pub.timeout[tId]);
				pub.timeout[tId] = null;
			}
			handleTransactionResponse(o, callback);
		}
	}
	function checkTimeout(o, callback) {
		pub.abort(o, callback, true);
	}
	// private
	function handleReadyState(o, callback, async) {
		callback = callback || {};
		var conn = o.conn, tId = o.tId, poll = pub.poll, cbTimeout = callback.timeout
				|| null;
		if (cbTimeout) {
			pub.conn[tId] = conn;
			pub.timeout[tId] = setTimeout(checkTimeout.createCallback(o,
					callback), cbTimeout);
		}
		poll[tId] = setInterval(checkResponse.createCallback(o, callback,
				conn, tId, poll, cbTimeout), pub.pollInterval);
	}
	// private
	function sendRequest(method, uri, callback, postData, async) {
		var o = getConnectionObject() || null;
		if (o) {
			o.conn.open(method, uri, async);
			if (pub.useDefaultXhrHeader) {
				initHeader('X-Requested-With', pub.defaultXhrHeader);
			}
			if (postData && pub.useDefaultHeader
					&& (!pub.headers || !pub.headers[CONTENTTYPE])) {
				initHeader(CONTENTTYPE, pub.defaultPostHeader);
			}
			if (pub.defaultHeaders || pub.headers) {
				setHeader(o);
			}
			if (async) {
				handleReadyState(o, callback, async);
				try {
					o.conn.send(postData || null);
				} catch(e) {
					// 加入这个捕获异常，是为了不让跨域的错误影响到页面的正常显示
				}
			} else {
				o.conn.onreadystatechange = function(){
					if (o.conn.readyState == 4) {
						handleTransactionResponse(o, callback, false, false);
					}
				}
				try {
					o.conn.send(postData || null);
				} catch(e) {
					// 加入这个捕获异常，是为了不让跨域的错误影响到页面的正常显示
				}
			}
		}
		return o;
	}
	// private
	function syncRequest(method, uri, callback, postData) {
		return sendRequest(method, uri, callback, postData, false);
	}
	// private
	function asyncRequest(method, uri, callback, postData) {
		return sendRequest(method, uri, callback, postData, true);
	}
	// private
	function getConnectionObject() {
		var o;
		try {
			if (o = createXhrObject(pub.transactionId)) {
				pub.transactionId++;
			}
		} catch (e) {
		} finally {
			return o;
		}
	}
	// private
	function createXhrObject(transactionId) {
		var http;
		try {
			http = new XMLHttpRequest();
		} catch (e) {
			for ( var i = 0; i < activeX.length; ++i) {
				try {
					http = new ActiveXObject(activeX[i]);
					break;
				} catch (e) {
				}
			}
		} finally {
			return {
				conn : http,
				tId : transactionId
			};
		}
	}
	var pub = {
		request : function(method, uri, cb, data, options) {
			if (options) {
				var me = this, xmlData = options.xmlData, jsonData = options.jsonData, hs;

				Ext.applyIf(me, options);

				if (xmlData || jsonData) {
					hs = me.headers;
					if (!hs || !hs[CONTENTTYPE]) {
						initHeader(CONTENTTYPE, xmlData ? 'text/xml'
								: 'application/json');
					}
					data = xmlData
							|| (!Ext.isPrimitive(jsonData) ? Ext
									.encode(jsonData) : jsonData);
				}
			}
			if (options.async || options.async == undefined) {
				return asyncRequest(method || options.method || "POST", uri,
						cb, data);
			} else {
				return syncRequest(method || options.method || "POST", uri, cb,
						data);
			}
		},
		serializeForm : function(form) {
			var fElements = form.elements
					|| (document.forms[form] || Ext.getDom(form)).elements, hasSubmit = false, encoder = encodeURIComponent, name, data = '', type, hasValue;
			Ext.each(fElements, function(element) {
				name = element.name;
				type = element.type;
				if (!element.disabled && name) {
					if (/select-(one|multiple)/i.test(type)) {
						Ext.each(element.options, function(opt) {
							if (opt.selected) {
								hasValue = opt.hasAttribute ? opt
										.hasAttribute('value') : opt
										.getAttributeNode('value').specified;
								data += String
										.format("{0}={1}&", encoder(name),
												encoder(hasValue ? opt.value
														: opt.text));
							}
						});
					} else if (!(/file|undefined|reset|button/i.test(type))) {
						if (!(/radio|checkbox/i.test(type) && !element.checked)
								&& !(type == 'submit' && hasSubmit)) {
							data += encoder(name) + '='
									+ encoder(element.value) + '&';
							hasSubmit = /submit/i.test(type);
						}
					}
				}
			});
			return data.substr(0, data.length - 1);
		},
		useDefaultHeader : true,
		defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
		useDefaultXhrHeader : true,
		defaultXhrHeader : 'XMLHttpRequest',
		poll : {},
		timeout : {},
		conn : {},
		pollInterval : 50,
		transactionId : 0,
		abort : function(o, callback, isTimeout) {
			var me = this, tId = o.tId, isAbort = false;
			if (me.isCallInProgress(o)) {
				o.conn.abort();
				clearInterval(me.poll[tId]);
				me.poll[tId] = null;
				clearTimeout(pub.timeout[tId]);
				me.timeout[tId] = null;
				handleTransactionResponse(o, callback, (isAbort = true),
						isTimeout);
			}
			return isAbort;
		},
		isCallInProgress : function(o) {
			return o.conn && !{
				0 : true,
				4 : true
			}[o.conn.readyState];
		}
	};
	return pub;
}();

Ext.form.Field.prototype.msgTarget = 'alt';

Ext.form.MessageTargets['alt'] = {
	
	mark: function(field, msg){
		field.el.addClass(field.invalidClass);
        if (!field.tip) {
	        field.tip = new Ext.ToolTip({
	        	cls: 'x-field-invalid',
	        	target: field.el,
	        	anchor: 'top',
	            autoHide: false,
	            monitorResize: true,
	            onTargetOver: Ext.emptyFn,
	            onShow : function(){
	                Ext.ToolTip.superclass.onShow.call(this);
	                Ext.getDoc().on('mousedown', this.onDocMouseDown, this);
	                Ext.getDoc().on('mousewheel', this.onDocMouseDown, this);
	            },
	            onHide : function(){
	                Ext.ToolTip.superclass.onHide.call(this);
	                Ext.getDoc().un('mousedown', this.onDocMouseDown, this);
	                Ext.getDoc().un('mousewheel', this.onDocMouseDown, this);
	            },
	        	html: msg
	        });
        } else if (field.tip.body) {
        	field.tip.body.update(msg);
        }
        if (field.isVisible && field.isVisible()) {
        	field.tip.show();
        }
	},
	
	clear: function(field){
		field.el.removeClass(field.invalidClass);
		if (field.tip) {
			field.tip.hide(100);
		}
	}
	
};

Ext.QuickTips.init();

/** Date getDayOfWeek * */
Ext.apply(Date.prototype, {
	getDayOfWeek : function() {
		var d = this.getDay();
		if (d == 0) {
			return 7;
		} else {
			return d;
		}
	}
});

/**
 * Date format extend
 */
Ext.apply(Ext.util.JSON, {
	pad : function(n) {
		return n < 10 ? "0" + n : n;
	}
});

Ext.util.JSON.encodeDate = function(o) {
	return '"' + o.getFullYear() + "-" + Ext.util.JSON.pad(o.getMonth() + 1)
			+ "-" + Ext.util.JSON.pad(o.getDate()) + " "
			+ Ext.util.JSON.pad(o.getHours()) + ":"
			+ Ext.util.JSON.pad(o.getMinutes()) + ":"
			+ Ext.util.JSON.pad(o.getSeconds()) + '"';
};

/** 状态保存控件 * */
Ext.state.HttpProvider = Ext.extend(Ext.state.Provider, {
	enable: true,
	constructor : function(config) {
		Ext.state.HttpProvider.superclass.constructor.call(this);
		Ext.apply(this, config);
		// TODO
		if(document.location.pathname.indexOf('acs-sample') > -1) {
			this.enable = false;
		}
		this.readUrl = document.location.protocol +'//' + document.location.host +'/pcts/system/ui_personalized!get.action';
		this.writeUrl = document.location.protocol +'//' + document.location.host +'/pcts/system/ui_personalized!save.action';
		this.state = {};
		var path = document.location.pathname;
		var idx = -1;
		if ((idx = path.indexOf(';')) > -1) {
			path = path.substring(0, idx);
		}
		this.path = path;
	},

	readState : function() {
		this.state = {};
		if (!this.enable) {
			return;
		}
		Ext.Ajax.request({
			method : 'GET',
			async : false,
			url : this.readUrl,
			params : {
				path : this.path
			},
			scope : this,
			success : function(xhr) {
				try {
					this.state = Ext.decode(xhr.responseText) || {};
				} catch (e) {
					this.state = {};
				}
			},
			failure : function(xhr) {
				new Ext.handleError(xhr);
			}
		});
	},

	writeState : function() {
		if (!this.enable) {
			return;
		}
		this.transId = Ext.Ajax.request({
			method : 'POST',
			url : this.writeUrl,
			params : {
				path : this.path,
				content : Ext.encode(this.state)
			},
			scope : this,
			callback : function(opts, success, xhr) {
				try {
					if (success != true) {
						new Ext.handleError(xhr);
					}
				} catch (e) {

				} finally {
					this.transId = false;
				}
			}
		});
	},

	set : function(id, value) {
		if (Ext.isEmpty(this.state)) {
			this.readState();
		}
		this.state[id] = value;
		if (!this.transId) {
			this.writeState();
		}
	},

	get : function(id, defaultValue) {
		if (this.state == undefined) {
			this.readState();
		}
		var value = this.state[id];
		return !Ext.isEmpty(value) ? value : defaultValue;
	},

	clear : function(id) {
		delete this.state[id];
		if (!this.transId) {
			this.writeState();
		}
	}

});

/** 开启Cookie管理器 * */
Ext.state.Manager.setProvider(
	new Ext.state.HttpProvider()
);

// 阻止页面throw的方式抛出异常
Ext.onError = function() {
	Ext.throwError = true;
};
Ext.offError = function() {
	Ext.throwError = false;
};

if (Ext.DEBUG) {
	Ext.onError();
} else {
	Ext.offError();
	window.onerror = function() {
		if (sofa) {
			sofa.api.unlock();
		}
		return true;
	};
}

Ext.Error = function(message, id, title) {
	this.message = message;
	this.id = id;
	this.title = title || '';
};

Ext.handleError = function(error) {
	// if (Ext.throwError == true) {
	var msg, summary, detail, format = function(text){
		return String(text).replace(/<\/?[^>]+>/gi, "\r")
				.replace(/\r+/g, "<br>").replace(/^(\<br\>)*/ig, "")
				.replace(/(<br>(\r|\s)*){1,}/ig, "<br>");
	};
	
	if (error instanceof Ext.Error) {
		if (Ext.isObject(error.message)) {
			if (error.message.responseText) {
				var xhr = error.message;
				var statusCode = xhr.status;
				if (xhr.isTimeout) {
					Ext.MessageBox.show({
						buttons: Ext.Msg.OK,
						title: error.title,
						icon: Ext.MessageBox.ERROR,
						msg : Ext.Error.ConnectTimeout
					});
					return;
				} else {
					msg = xhr.responseText;
				}
			} else {
				msg = Ext.encode(error.message);
			}
		} else {
			msg = error.message;
		}
		if (msg) {
			try {
				msg = Ext.decode(msg);
				
				detail = format(msg.detail) +'<hr>'+ format(msg.position);
				
				summary = format(msg.summary);
				
			} catch (e) {
				summary = format(Ext.encode(msg));
			}
		}
		
		Ext.Msg.show({
			buttons: Ext.DEBUG && !Ext.isEmpty(detail) ? Ext.Msg.OKDETAIL : Ext.Msg.OK,
			icon: Ext.MessageBox.ERROR,
			title: (Ext.DEBUG && statusCode ? "["+ statusCode +"] " : "")+ error.title,
			msg : (Ext.DEBUG && error.id ? 
					"控件(id : <b>" + error.id + "</b>)<hr>" : "") + 
						(statusCode == 404 && error.url ? error.url +"<br>" : "") + 
						summary,
			detail : detail ? detail : ''
		});
	} else if (error instanceof Error && Ext.DEBUG) {
		if (Ext.isGecko) {
			Ext.Msg.show({
				buttons: Ext.Msg.OK,
				icon: Ext.MessageBox.ERROR,
				msg : Ext.encode(error)
			});
		} else {
			Ext.Msg.show({
				buttons: Ext.Msg.OK,
				icon: Ext.MessageBox.ERROR,
				msg : error.message
			});
		}
	} else {
		var d = [];
		for (a in error) {
			if (typeof error[a] == 'string')
				d.push(error[a]);
		}
		msg = Ext.util.Format.nl2br(d.join('\n'));
	}
	if (sofa) {
		sofa.api.unlock();
	}
};

Ext.MessageBox = function() {
	var dlg, opt, mask, waitTimer, bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl, buttons, activeTextEl, bwidth, bufferIcon = '', iconCls = '', 
		buttonNames = ['ok', 'yes', 'no', 'cancel', 'detail'];

	var handleButton = function(button) {
		buttons[button].blur();
		if (dlg.isVisible()) {
			if (opt.fn) {
				if (opt.fn.call(opt.scope || window, button,
						activeTextEl.dom.value, opt) == false) {
					return;
				}
			}
			dlg.hide();
			handleHide();
		}
	};
	var handleHide = function() {
		if (opt && opt.cls) {
			dlg.el.removeClass(opt.cls);
		}
		progressBar.reset();
		if (sofa) {
			sofa.api.unlock();
		}
	};
	var handleEsc = function(d, k, e) {
		if (opt && opt.closable !== false) {
			dlg.hide();
			handleHide();
		}
		if (e) {
			e.stopEvent();
		}
	};
	var updateButtons = function(b) {
		var width = 0, cfg;
		if (!b) {
			Ext.each(buttonNames, function(name) {
				buttons[name].hide();
			});
			return width;
		}
		dlg.footer.dom.style.display = '';
		Ext.iterate(buttons, function(name, btn) {
			cfg = b[name];
			if (cfg) {
				btn.show();
				btn.setText(Ext.isString(cfg) ? cfg
						: Ext.MessageBox.buttonText[name]);
				width += btn.getEl().getWidth() + 15;
			} else {
				btn.hide();
			}
		});
		return width;
	};
	
	var detailButton = function() {
		Ext.MessageBox.show(Ext.apply(opt, {
			buttons: Ext.MessageBox.OK,
			msg: opt.detail
		}));
	}

	return {
		getDialog : function(titleText) {
			if (!dlg) {
				var btns = [];

				buttons = {};
				Ext.each(buttonNames, function(name) {
					if (name == 'detail') {
						btns.push(buttons[name] = new Ext.Button({
							text : this.buttonText[name],
							hideMode : 'offsets',
							handler : detailButton.createDelegate(this)
						}));
					} else {
						btns.push(buttons[name] = new Ext.Button({
							text : this.buttonText[name],
							handler : handleButton.createCallback(name),
							hideMode : 'offsets'
						}));
					}
				}, this);
				dlg = new Ext.Window({
					autoCreate : true,
					title : titleText,
					resizable : false,
					constrain : true,
					constrainHeader : true,
					minimizable : false,
					maximizable : false,
					stateful : false,
					modal : true,
					shim : true,
					buttonAlign : "center",
					width : 400,
					height : 100,
					minHeight : 80,
					plain : true,
					footer : true,
					closable : true,
					close : function() {
						if (opt && opt.buttons && opt.buttons.no
								&& !opt.buttons.cancel) {
							handleButton("no");
						} else {
							handleButton("cancel");
						}
					},
					fbar : new Ext.Toolbar({
						items : btns,
						enableOverflow : false
					})
				});
				dlg.render(document.body);
				dlg.getEl().addClass('x-window-dlg');
				mask = dlg.mask;
				bodyEl = dlg.body
						.createChild({
							html : '<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
						});
				iconEl = Ext.get(bodyEl.dom.firstChild);
				var contentEl = bodyEl.dom.childNodes[1];
				msgEl = Ext.get(contentEl.firstChild);
				textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
				textboxEl.enableDisplayMode();
				textboxEl.addKeyListener([ 10, 13 ], function() {
					if (dlg.isVisible() && opt && opt.buttons) {
						if (opt.buttons.ok) {
							handleButton("ok");
						} else if (opt.buttons.yes) {
							handleButton("yes");
						} else if (opt.buttons.detail) {
							detailButton(opt);
						}
					}
				});
				textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
				textareaEl.enableDisplayMode();
				progressBar = new Ext.ProgressBar({
					renderTo : bodyEl
				});
				bodyEl.createChild({
					cls : 'x-clear'
				});
			}
			return dlg;
		},
		updateText : function(text) {
			if (!dlg.isVisible() && !opt.width) {
				dlg.setSize(this.maxWidth, 100);
			}

			msgEl.update(text ? text + ' ' : '&#160;');

			var iw = iconCls != '' ? (iconEl.getWidth() + iconEl
					.getMargins('lr')) : 0, mw = msgEl.getWidth()
					+ msgEl.getMargins('lr'), fw = dlg.getFrameWidth('lr'), bw = dlg.body
					.getFrameWidth('lr'), w;
			// @fixed chrome width
			if (Ext.isChrome || Ext.isSafari) {
				rect = msgEl.dom.getBoundingClientRect();
				mw = Math.ceil(rect.right - rect.left);
			}

			w = Math.max(Math.min(opt.width || iw + mw + fw + bw, opt.maxWidth
					|| this.maxWidth), Math.max(opt.minWidth || this.minWidth,
					bwidth || 0));

			if (opt.prompt === true) {
				activeTextEl.setWidth(w - iw - fw - bw);
			}
			if (opt.progress === true || opt.wait === true) {
				progressBar.setSize(w - iw - fw - bw);
			}
			if (Ext.isIE && w == bwidth) {
				w += 4;
			}
			msgEl.update(text || '&#160;');
			dlg.setSize(w, 'auto').center();
			return this;
		},
		updateProgress : function(value, progressText, msg) {
			progressBar.updateProgress(value, progressText);
			if (msg) {
				this.updateText(msg);
			}
			return this;
		},
		isVisible : function() {
			return dlg && dlg.isVisible();
		},
		hide : function() {
			var proxy = dlg ? dlg.activeGhost : null;
			if (this.isVisible() || proxy) {
				dlg.hide();
				handleHide();
				if (proxy) {
					dlg.unghost(false, false);
				}
			}
			return this;
		},
		show : function(options) {
			if (this.isVisible()) {
				this.hide();
			}
			opt = options;
			var d = this.getDialog(opt.title || "&#160;");

			d.setTitle(opt.title || "&#160;");
			var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
			d.tools.close.setDisplayed(allowClose);
			activeTextEl = textboxEl;
			opt.prompt = opt.prompt || (opt.multiline ? true : false);
			if (opt.prompt) {
				if (opt.multiline) {
					textboxEl.hide();
					textareaEl.show();
					textareaEl
							.setHeight(Ext.isNumber(opt.multiline) ? opt.multiline
									: this.defaultTextHeight);
					activeTextEl = textareaEl;
				} else {
					textboxEl.show();
					textareaEl.hide();
				}
			} else {
				textboxEl.hide();
				textareaEl.hide();
			}
			activeTextEl.dom.value = opt.value || "";
			if (opt.prompt) {
				d.focusEl = activeTextEl;
			} else {
				var bs = opt.buttons;
				var db = null;
				if (bs && bs.ok) {
					db = buttons["ok"];
				} else if (bs && bs.yes) {
					db = buttons["yes"];
				}
				if (db) {
					d.focusEl = db;
				}
			}
			if (Ext.isDefined(opt.iconCls)) {
				d.setIconClass(opt.iconCls);
			}
			this.setIcon(Ext.isDefined(opt.icon) ? opt.icon : bufferIcon);
			bwidth = updateButtons(opt.buttons);
			progressBar.setVisible(opt.progress === true || opt.wait === true);
			this.updateProgress(0, opt.progressText);
			this.updateText(opt.msg);
			if (opt.cls) {
				d.el.addClass(opt.cls);
			}
			d.proxyDrag = opt.proxyDrag === true;
			d.modal = opt.modal !== false;
			d.mask = opt.modal !== false ? mask : false;
			if (!d.isVisible()) {

				document.body.appendChild(dlg.el.dom);
				d.setAnimateTarget(opt.animEl);

				d.on('show', function() {
					if (allowClose === true) {
						d.keyMap.enable();
					} else {
						d.keyMap.disable();
					}
					var vs = d.body.getSize();
					var mvs = Ext.getBody().getSize();
					if (vs.width > mvs.width) {
						vs.width = mvs.width;
					}
					if (vs.height > mvs.height) {
						vs.height = mvs.height;
					}
					d.body.setSize(vs);
				}, this, {
					single : true
				});
				d.show(opt.animEl);
			}
			if (opt.wait === true) {
				progressBar.wait(opt.waitConfig);
				if (sofa) {
					sofa.api.lock();
				}
			}
			return this;
		},
		setIcon : function(icon) {
			if (!dlg) {
				bufferIcon = icon;
				return;
			}
			bufferIcon = undefined;
			if (icon && icon != '') {
				iconEl.removeClass('x-hidden');
				iconEl.replaceClass(iconCls, icon);
				bodyEl.addClass('x-dlg-icon');
				iconCls = icon;
			} else {
				iconEl.replaceClass(iconCls, 'x-hidden');
				bodyEl.removeClass('x-dlg-icon');
				iconCls = '';
			}
			return this;
		},
		progress : function(title, msg, progressText) {
			this.show({
				title : title,
				msg : msg,
				buttons : false,
				progress : true,
				closable : false,
				minWidth : this.minProgressWidth,
				progressText : progressText
			});
			return this;
		},
		wait : function(msg, title, config) {
			this.show({
				title : title,
				msg : msg,
				buttons : false,
				closable : false,
				wait : true,
				modal : true,
				minWidth : this.minProgressWidth,
				waitConfig : config
			});
			return this;
		},
		alert : function(title, msg, fn, scope) {
			this.show({
				title : title,
				msg : msg,
				buttons : this.OK,
				fn : fn,
				scope : scope,
				minWidth : this.minWidth
			});
			return this;
		},
		confirm : function(title, msg, fn, scope) {
			this.show({
				title : title,
				msg : msg,
				buttons : this.YESNO,
				fn : fn,
				scope : scope,
				icon : this.QUESTION,
				minWidth : this.minWidth
			});
			return this;
		},
		prompt : function(title, msg, fn, scope, multiline, value) {
			this.show({
				title : title,
				msg : msg,
				buttons : this.OKCANCEL,
				fn : fn,
				minWidth : this.minPromptWidth,
				scope : scope,
				prompt : true,
				multiline : multiline,
				value : value
			});
			return this;
		},
		OK : {
			ok : true
		},
		OKDETAIL : {
			ok : true,
			detail : true
		},
		CANCEL : {
			cancel : true
		},
		OKCANCEL : {
			ok : true,
			cancel : true
		},
		YESNO : {
			yes : true,
			no : true
		},
		YESNOCANCEL : {
			yes : true,
			no : true,
			cancel : true
		},
		INFO : 'ext-mb-info',
		WARNING : 'ext-mb-warning',
		QUESTION : 'ext-mb-question',
		ERROR : 'ext-mb-error',
		defaultTextHeight : 75,
		maxWidth : 600,
		minWidth : 120,
		minProgressWidth : 250,
		minPromptWidth : 250,
		buttonText : {
			ok : "OK",
			cancel : "Cancel",
			yes : "Yes",
			no : "No",
			detail : "Detail"
		}
	};
}();

Ext.Msg = Ext.MessageBox;

Ext.override(Ext.Component, {
	visible : true,
	render : function(container, position) {
		if (!this.rendered && this.fireEvent('beforerender', this) !== false) {
			if (!container && this.el) {
				this.el = Ext.get(this.el);
				container = this.el.dom.parentNode;
				this.allowDomMove = false;
			}
			this.container = Ext.get(container);
			if (this.ctCls) {
				this.container.addClass(this.ctCls);
			}
			this.rendered = true;
			if (position !== undefined) {
				if (Ext.isNumber(position)) {
					position = this.container.dom.childNodes[position];
				} else {
					position = Ext.getDom(position);
				}
			}
			this.onRender(this.container, position || null);
			if (this.autoShow) {
				this.el.removeClass([ 'x-hidden', 'x-hide-' + this.hideMode ]);
			}
			if (this.cls) {
				this.el.addClass(this.cls);
				delete this.cls;
			}
			if (this.style) {
				this.el.applyStyles(this.style);
				delete this.style;
			}
			if (this.overCls) {
				this.el.addClassOnOver(this.overCls);
			}
			this.fireEvent('render', this);
			var contentTarget = this.getContentTarget();
			if (this.html) {
				contentTarget.update(Ext.DomHelper.markup(this.html));
				delete this.html;
			}
			if (this.contentEl) {
				var ce = Ext.getDom(this.contentEl);
				Ext.fly(ce).removeClass([ 'x-hidden', 'x-hide-display' ]);
				contentTarget.appendChild(ce);
			}
			if (this.tpl) {
				if (!this.tpl.compile) {
					this.tpl = new Ext.XTemplate(this.tpl);
				}
				if (this.data) {
					this.tpl[this.tplWriteMode](contentTarget, this.data);
					delete this.data;
				}
			}
			this.afterRender(this.container);
			if (this.hidden || this.visible == false) {
				this.doHide();
			}
			if (this.disabled) {
				this.disable(true);
			}
			if (this.stateful !== false) {
				this.initStateEvents();
			}
			this.fireEvent('afterrender', this);
		}
		return this;
	},
	clearState : function() {
		if (Ext.state.Manager && this.stateful !== false) {
			var id = this.getStateId();
			if (id) {
				if (this.fireEvent('beforeclearstate', this, id) !== false) {
					Ext.state.Manager.clear(id);
					this.fireEvent('clearstate', this, id);
				}
			}
		}
	}
});

Ext.override(Ext.Container, {
	applyDefaults : function(c){
        var d = this.defaults;
        if(d){
            if(Ext.isFunction(d)){
                d = d.call(this, c);
            }
            if(Ext.isString(c)){
                c = Ext.ComponentMgr.get(c);
                Ext.apply(c, d);
            }else if(!c.events){
                Ext.applyIf(c.isAction ? c.initialConfig : c, d);
            }else{
            	// 此处将apply改为applyIf，参照ext4版本，目的让子类可以自定义
                Ext.applyIf(c, d);
            }
        }
        return c;
    }
});

Ext.override(Ext.layout.FormLayout, {
	
	fieldTpl: (function() {
        var t = new Ext.Template(
            '<div class="x-form-item {itemCls}" tabIndex="-1">',
                '<label for="{id}" title="{labelTip}" style="{labelStyle}" class="x-form-item-label">',
            	'<span class="x-field-asterisk">{asterisk}</span><span class="x-field-label">{label}{labelSeparator}</span></label>',
                '<div class="x-form-element" id="x-form-el-{id}" style="{elementStyle}">',
                '</div><div class="{clearCls}"></div>',
            '</div>'
        );
        t.disableFormats = true;
        return t.compile();
    })(),
    
    getTemplateArgs: function(field) {
        var noLabelSep = !field.fieldLabel || field.hideLabel,
            itemCls = (field.itemCls || this.container.itemCls || '') + (field.hideLabel ? ' x-hide-label' : '');

        
        if (Ext.isIE9 && Ext.isIEQuirks && field instanceof Ext.form.TextField) {
            itemCls += ' x-input-wrapper';
        }
        return {
            id            : field.id,
            asterisk	  : (field.allowBlank ? '' : '*'),
            label         : field.fieldLabel,
            // 增加label的提示信息
            labelTip	  : field.labelTip,
            itemCls       : itemCls,
            clearCls      : field.clearCls || 'x-form-clear-left',
            labelStyle    : this.getLabelStyle(field.labelStyle),
            elementStyle  : this.elementStyle || '',
            labelSeparator: noLabelSep ? '' : (Ext.isDefined(field.labelSeparator) ? field.labelSeparator : this.labelSeparator)
        };
    }
    
});

Ext.override(Ext.form.Field, {
	
	alt : undefined,
	
	baseCls : 'x-form-item',
	
	labelSeparator : ':',
	
	enableKeyEvents : true,
	
	// 压制change事件
    suspendCheckChange: 0,
    // 压制高亮效果
    suspendHighLight: 0,
    
    validateOnChange: true,
    
    initComponent : function(){
    	
        Ext.form.Field.superclass.initComponent.call(this);
        
        this.addEvents(
            
            'focus',
            
            'blur',
            
            'specialkey',
            
            'change',
            
            'invalid',
            
            'clear',
            
            'valid'
        );
        
    },
	
	onRender : function(ct, position) {
		if (!this.el) {
			var cfg = this.getAutoCreate();
			if (!cfg.name) {
				cfg.name = this.name || this.id;
			}
			if (this.inputType) {
				cfg.type = this.inputType;
			}
			this.autoEl = cfg;
		}
		Ext.form.Field.superclass.onRender.call(this, ct, position);
		
		// dynamic add label start
		if (this.nolabel !== true && Ext.isString(this.label)) {
			
			this.container.addClass('x-form-item');
			 
			this.labelWidth = this.labelWidth || 105;
			
			var style = 'width:'+ this.labelWidth +'px;white-space:nowrap;text-align: '+ (this.labelAlign || 'right');
			
			this.labelEl = Ext.DomHelper.insertFirst(this.container, {
				tag : 'label',
				cls : 'x-form-item-label ' + Ext.value(this.labelCss, ''),
				style : style
			}, true);
			
			this.asterisk = this.labelEl.createChild({
				tag: 'span',
				cls: 'x-field-asterisk'
			});
			 
			this.labelTextEl = this.labelEl.createChild({
				tag: 'span',
				cls: 'x-field-label'
			});
			
			this.setLabelText(this.label);
			
			this.wrap = this.el.wrap({ 
				cls: 'x-form-element',
				style: 'padding-left:'+ this.labelWidth +'px'
			});

			if (this.renderTo && !Ext.isIE) {
				var clearEl = Ext.DomHelper.insertAfter(this.wrap, {
					tag : 'div',
					cls: 'x-form-clear-left'
				});
			}
		}
		
		// dynamic add lable end
		if (this.submitValue === false) {
			this.el.dom.removeAttribute('name');
		}
		var type = this.el.dom.type;
		if (type) {
			if (type == 'password') {
				type = 'text';
			}
			this.el.addClass('x-form-' + type);
		}
        if(this.readOnly){
            this.setReadOnly(true);
        }
		if (this.tabIndex !== undefined) {
			this.el.dom.setAttribute('tabIndex', this.tabIndex);
		}
		this.el.addClass([this.fieldClass, this.cls]);

		this.initTailEl();
		
		if (this.alt) {
			new Ext.ToolTip({
				target : this.id,
				trackMouse : false,
				draggable : true,
				html : this.alt
			});
		}
	},
	
	setLabelText: function(text) {
		this.label = Ext.value(text, '').trim().replace(/[:|\uFF1A]$/g, '').replace(/\s+?/g,'&#160;');
		if (!this.labelTextEl && this.itemCt) {
			this.labelTextEl = this.itemCt.child('.x-field-label', false);
		}
		if (this.labelTextEl) {
			this.labelTextEl.update(this.label + this.labelSeparator);
		}
	},

    onHide : function(){
        Ext.form.Field.superclass.onHide.call(this);
        if (this.labelEl) {
        	this.labelEl.addClass('x-hide-' + this.hideMode);
        }
        if (this.tailEl) {
        	this.tailEl.addClass('x-hide-' + this.hideMode);
        }
    },
    
    onShow : function(){
    	Ext.form.Field.superclass.onShow.call(this);
        if (this.labelEl) {
        	this.labelEl.removeClass('x-hide-' + this.hideMode);
        }
        if (this.tailEl) {
        	this.tailEl.removeClass('x-hide-' + this.hideMode);
        }
    },
	
	initTailEl: Ext.emptyFn,
    
	onBlur : function(){
		if (false && this.taskId && !(Ext.isIE)) {
    		clearInterval(this.taskId);
			this.taskId = false;
		}
        this.beforeBlur();
        if(this.focusClass){
            this.el.removeClass(this.focusClass);
        }
        this.hasFocus = false;
        if(this.validationEvent !== false && (this.validateOnBlur || this.validationEvent == 'blur')){
            this.validate();
        }
        /* 
        // 2012-9-7 修改change事件到setValue里，失焦时不再触发change事件
        var v = this.getValue();
        if(String(v) !== String(this.startValue)){
            this.fireEvent('change', this, v, this.startValue);
        }
        */
        this.fireEvent('blur', this);
        this.postBlur();
    },
    
	onFocus : function(){
        this.preFocus();
        if (this.readOnly) {
        	return;
        }
    	var el = this.el, cls = this.focusClass;
        if(this.focusClass){
            this.el.addClass(this.focusClass);
    		if (false && !this.taskId && !(Ext.isIE)) {
    			this.taskId = setInterval(function(){
	    	    	el.toggleClass(cls);
	    	    }, 300);
    		}
        }
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent('focus', this);
        }
    },
    
	// 复写方法，增加readOnly样式
	setReadOnly : function(readOnly){
        if(this.rendered){
            this.el.dom.readOnly = readOnly;
        }
        if (readOnly) {
        	this.el.addClass('x-form-field-readOnly');
        } else {
        	this.el.removeClass('x-form-field-readOnly');
        }
        this.readOnly = readOnly;
    },
    
	getVisibilityEl : function() {
		return this.containerWrap ? this.containerWrap
				: (this.hideParent ? this.container : this.getActionEl());
	},
	
	setLabel : function(label) {
		if (!this.labelEl && this.itemCt) {
			this.labelEl = this.itemCt.child('.x-form-item-label', false);
		}
		if (this.labelEl) {
			label = label.trim().replace(/[:|\uFF1A]$/, '');
			this.labelEl.dom.innerHTML = label + this.labelSeparator;
		}
	},
	
	getLabel : function(noSeparator) {
		if (this.labelEl) {
			var label = this.labelTextEl.dom.innerHTML;
			if (noSeparator == false) {
				return label.trim().replace(/[:|\uFF1A]$/, '');
			}
			return label;
		}
		return null;
	},
	
	getErrorCt : function() {
		return this.el.findParent('.x-form-element', 5, true)
				|| this.el.findParent('.x-form-field-wrap', 5, true)
				|| this.el.findParent('.sofa-form-element', 2, true);
	},
	
	initValue : function(){
		
		var me = this;

        me.originalValue = me.lastValue = me.value;

        me.suspendCheckChange++;
        me.suspendHighLight++;

        me.setValue(me.value);
        
        me.suspendCheckChange--;
        me.suspendHighLight--;
    },
    
    reset : function(){
    	
        var me = this;

        me.suspendHighLight++;
        
        var _validateOnChange = me.validateOnChange;
        
        var _suspendCheckChange = me.suspendCheckChange;
        
        me.validateOnChange = false;
        
        me.suspendCheckChange = true;
        
        me.setValue(me.originalValue);
        
        me.lastValue = undefined;

        me.validateOnChange = _validateOnChange;
        
        me.suspendCheckChange = _suspendCheckChange;

        me.suspendHighLight--;
        
        me.clearInvalid();
        
        delete me.wasValid;
    },
    
    resetOriginalValue: function() {
        this.originalValue = this.getValue();
        this.checkDirty();
    },
    // TODO
    clearValue: function(){
    	
    	var me = this;

        me.suspendHighLight++;

        var _validateOnChange = me.validateOnChange;
        
        me.validateOnChange = false;
        
    	me.setValue('');

        me.lastValue = undefined;
    	
        me.validateOnChange = _validateOnChange;

        this.fireEvent('clear', this);

        me.suspendHighLight--;
    	
    },
	
    valueToRaw: function(value) {
        return '' + Ext.value(value, '');
    },
    
	setValue: function(value){
		
		var me = this;
		
        me.setRawValue(me.valueToRaw(value));
		
        me.value = value;
        
    	if (me.el && !me.suspendHighLight) {
    		me.el.stopFx();
    		me.el.highlight();
    	}
        
        me.checkChange();
        
        return me;
	},
	
	checkChange: function(){
		if (!this.suspendCheckChange) {
            var me = this,
                newVal = me.getValue(),
                oldVal = me.lastValue;
            if (!me.isEqual(newVal, oldVal) && !me.isDestroyed) {
                me.lastValue = newVal;
                // me.isValid 如果验证通过才能出发事件(2012-9-21与测试部门沟通bug得到的标准）
                if (me.isValid(true)) {
                	me.fireEvent('change', me, newVal, oldVal);
                    me.onChange(newVal, oldVal);
            	}
            }
        }
	},
	
	onChange: function(newVal, oldVal) {
        if (this.validateOnChange) {
            this.validate();
        }
        this.checkDirty();
    },
    
    isEqual: function(value1, value2) {
        return String(value1) === String(value2);
    },
    
    isDirty : function() {
        var me = this;
        return !me.disabled && !me.isEqual(me.getValue(), me.originalValue);
    },
    
    checkDirty: function() {
        var me = this,
            isDirty = me.isDirty();
        if (isDirty !== me.wasDirty) {
            me.fireEvent('dirtychange', me, isDirty);
            me.onDirtyChange(isDirty);
            me.wasDirty = isDirty;
        }
    },

    onDirtyChange: Ext.emptyFn,
    
    validateValue : function(value, preventMark) {
        
        var error = this.getErrors(value)[0];

        if (error == undefined) {
            return true;
        } else {
        	if (!preventMark) {
        		this.markInvalid(error);
        	}
            return false;
        }
    }
    
});

Ext.override(Ext.form.CheckboxGroup, {
	initTailEl: Ext.emptyFn
});

Ext.override(Ext.form.Checkbox, {
	initTailEl: Ext.emptyFn
});

Ext.override(Ext.form.Hidden, {
	nolabel : true,
	initTailEl: Ext.emptyFn
});

Ext.override(Ext.form.TextField, {
	
	enableKeyEvents : true,	
	
	initTailEl : function(){

		this.tailEl = Ext.DomHelper.insertAfter(this.el, {
			
			tag: 'em',
			
			cls: 'x-field-tail ' + (this.tailClass || ''),
			
			html: this.tailText || ''
			
		}, true);
		
		if (this.wrap) {
			this.wrap.setStyle('white-space', 'nowrap');
		}
		
	},
		
	getErrors : function(value) {
		var errors = Ext.form.TextField.superclass.getErrors.apply(this, arguments);
		value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
		if (Ext.isFunction(this.validator)) {
			var msg = this.validator(value);
			if (msg !== true) {
				errors.push(msg);
			}
		}
		if (value.trim().length < 1 || value === this.emptyText) {
			if (this.vtype == 'daterange') {
				var vt = Ext.form.VTypes;
				if (!vt[this.vtype](value, this)) {
					errors.push(this.vtypeText || vt[this.vtype + 'Text']);
				}
			}
			if (this.allowBlank) {
				return errors;
			} else {
				errors.push(this.blankText);
			}
		}
		if (!this.allowBlank && (value.length < 1 || value === this.emptyText)) {
			errors.push(this.blankText);
		}
		if (value.length < this.minLength) {
			errors.push(String.format(this.minLengthText, this.minLength));
		}
		if (value.length > this.maxLength) {
			errors.push(String.format(this.maxLengthText, this.maxLength));
		}
		if (this.vtype) {
			var vt = Ext.form.VTypes;
			if (!vt[this.vtype](value, this)) {
				errors.push(this.vtypeText || vt[this.vtype + 'Text']);
			}
		}
		if (this.regex && !this.regex.test(value)) {
			errors.push(this.regexText);
		}
		return errors;
	},
	
	onRender: function(ct, position){
		
		Ext.form.TextField.superclass.onRender.call(this, ct, position);
		
		this.setAllowBlank();
		
	},
	
	setAllowBlank: function(allowBlank) {
		
		if (!Ext.isEmpty(allowBlank)) {

			if (this.allowBlank == allowBlank) {
				
				return;
				
			}
			
			this.allowBlank = allowBlank;
			
		}
		
		this.clearInvalid();
		
		if (!this.asterisk && this.itemCt) {
			this.asterisk = this.itemCt.child('.x-field-asterisk', false);
		}
		
		if (this.allowBlank == false) {
			
			this.el.addClass('x-field-non-blank');
			
			if (this.asterisk) {
				this.asterisk.dom.innerHTML = '*';
			}
			
		} else {
			
			if (this.asterisk) {
				this.asterisk.dom.innerHTML = '';
			}
			
		}
		
	},
	
	insertTailText: function(text){
		if (this.tailEl) { 
			this.tailEl.innerHTML = text;
		}
	}
		
});

Ext.override(Ext.form.TriggerField, {
	
	initTailEl: Ext.emptyFn,
	
	onResize : function(w, h){
        Ext.form.TriggerField.superclass.onResize.call(this, w, h);
        var tw = this.getTriggerWidth();
		//w -= tw
        if(Ext.isNumber(w)){
            this.el.setWidth(w - tw);
        }
        this.wrap.setWidth(w);
    },
    
	// 增加readOnly状态样式
	setReadOnly: function(readOnly){
        if (readOnly) {
        	if (this.emptyText && this.rendered && this.el.getValue() == this.emptyText) {
            	this.setRawValue('');
        	}
        	this.el.addClass('x-form-field-readOnly');
        } else {
        	this.el.removeClass('x-form-field-readOnly');
        }
        if(readOnly != this.readOnly){
            this.readOnly = readOnly;
        }
        this.updateEditState();
    },
    
    onRender : function(ct, position){
        this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
        Ext.form.TriggerField.superclass.onRender.call(this, ct, position);

        this.wrap = this.el.wrap({cls: 'x-form-field-wrap x-form-field-trigger-wrap'});
        this.trigger = this.wrap.createChild(this.triggerConfig ||
                {tag: "img", src: Ext.BLANK_IMAGE_URL, alt: "", cls: "x-form-trigger " + this.triggerClass});
        this.initTrigger();
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
        this.resizeEl = this.positionEl = this.wrap;
    },
    
    updateEditState: function(){
        if(this.rendered && this.trigger){
            if (this.readOnly) {
                this.el.dom.readOnly = true;
                this.el.addClass('x-trigger-noedit');
                this.mun(this.el, 'click', this.onTriggerClick, this);
                this.trigger.setDisplayed(false);
            } else {
                if (!this.editable) {
                    this.el.dom.readOnly = true;
                    this.el.addClass('x-trigger-noedit');
                    this.mon(this.el, 'click', this.onTriggerClick, this);
                } else {
                    this.el.dom.readOnly = false;
                    this.el.removeClass('x-trigger-noedit');
                    this.mun(this.el, 'click', this.onTriggerClick, this);
                }
                this.trigger.setDisplayed(!this.hideTrigger);
            }
            this.onResize(this.width || this.wrap.getWidth());
        }
    }

});

/**
 * 增加当数据内容并非是[[], [] ... ]而是普通数组的解析
 */
Ext.override(Ext.data.ArrayReader, {
	readRecords : function(o) {
		this.arrayData = o;
		var s = this.meta, sid = s ? Ext.num(s.idIndex, s.id)
				: null, recordType = this.recordType, fields = recordType.prototype.fields, records = [], success = true, v;

		var root = this.getRoot(o);
		for ( var i = 0, len = root.length; i < len; i++) {
			var n = root[i], values = {}, id = ((sid || sid === 0) && n[sid] !== undefined && n[sid] !== "" ? n[sid] : null);
			for ( var j = 0, jlen = fields.length; j < jlen; j++) {
				var f = fields.items[j], k = f.mapping !== undefined && f.mapping !== null ? f.mapping : j;
				v = typeof n == 'string' ? n : (n[k] !== undefined ? n[k] : f.defaultValue);
				v = f.convert(v, n);
				values[f.name] = v;
			}
			var record = new recordType(values, id);
			record.json = n;
			records[records.length] = record;
		}

		var totalRecords = records.length;

		if (s.totalProperty) {
			v = parseInt(this.getTotal(o), 10);
			if (!isNaN(v)) {
				totalRecords = v;
			}
		}
		if (s.successProperty) {
			v = this.getSuccess(o);
			if (v === false || v === 'false') {
				success = false;
			}
		}

		return {
			success : success,
			records : records,
			totalRecords : totalRecords
		};
	}
});

Ext.override(Ext.form.Action.Submit, {
	success : function(response) {
		var result = this.processResponse(response);
		if (this.form.dataType == 'json') {
			if (result === true || result.success) {
				this.form.afterAction(this, true);
				return;
			}
			if (result.errors) {
				this.form.markInvalid(result.errors);
			}
			this.failureType = Ext.form.Action.SERVER_INVALID;
			this.form.afterAction(this, false);
		} else {
			this.form.afterAction(this, true);
		}
	},
	handleResponse : function(response) {
		if (this.form.errorReader) {
			var rs = this.form.errorReader.read(response);
			var errors = [];
			if (rs.records) {
				for ( var i = 0, len = rs.records.length; i < len; i++) {
					var r = rs.records[i];
					errors[i] = r.data;
				}
			}
			if (errors.length < 1) {
				errors = null;
			}
			return {
				success : rs.success,
				errors : errors
			};
		}
		if (this.form.dataType == 'json') {
			return Ext.decode(response.responseText);
		} else if (this.form.dataType == 'xml') {
			return response.responseXML;
		} else {
			return response.responseText;
		}
	}
});

Ext.override(Ext.form.BasicForm, {
	
	fileUpload : false,
	
	dataType : 'html/text',
	
	dataFormat: 'json',
    
    loaded: true,
    
    hiddenValid: true,
    
    formPanel: undefined,

	initEl : function(el) {
		this.el = Ext.get(el);
		this.id = this.el.id || Ext.id();

		if (!this.standardSubmit) {
			this.el.on('submit', this.onSubmit, this);
		}
		this.el.addClass('x-form');
	},
	
	lock: function(msg){
		
		this.token = false;
		
		if (Ext.isString(this.submitBtn)) {
			this.submitBtn = Ext.getCmp(this.submitBtn);
		} 
		
		if (msg && !this.fieldTip) {
			/*this.fieldTip = new Ext.ToolTip({
				target: this.submitBtn,
				html:msg
			});*/
		}
		if (msg) {
			//this.fieldTip.show();
		}
		if (this.submitBtn) {
			this.submitBtn.setDisabled(true);
		}
	},
	
	unlock: function(){
		
		this.token = true;
		
		if (this.fieldTip) {
			//this.fieldTip.hide();
		}
		
		if (Ext.isString(this.submitBtn)) {
			this.submitBtn = Ext.getCmp(this.submitBtn);
		}
		
		// 只读状态下，表单按钮不能被设置可提交状态
		if ((this.status & FORM.STATUS.READ) != 0) {
			return;
		}
		if (this.submitBtn) {
			this.submitBtn.setDisabled(false);
		}
	},
	
	addButton : function() {
		var fn = function(item) {
			if (Ext.isArray(item)) {
				Ext.each(item, fn, this);
			} else if (item instanceof Ext.Button) {
				var type = (item.type || 'button').toLowerCase();
				if (type == 'submit') {
					if (!item.hasListener('click')) {
						item.on('click', function(e){
							this.onSubmit(e);
						}, this);
					}
					this.submitBtn = item;
				} else if (type == 'reset') {
					if (!item.hasListener('click')) {
						item.on('click', this.onReset, this);
					}
				}
			} else if (Ext.isObject(item)) {
				var type = (item.type || 'button').toLowerCase();
				if (type == 'submit') {
					item.handler = this.onSubmit.createDelegate(this, []);
					this.submitBtn = item.id;
				} else if (type == 'reset') {
					item.handler = this.onReset.createDelegate(this, []);
				}
			}
		};
		Ext.each(arguments, fn, this);
		
		return this;
	},
	
	addButtonGroup : function(group) {
		if (Ext.isEmpty(group))
			return;
		if (Ext.isString(group)) {
			group = Ext.getCmp(group);
		}
		if (Ext.isArray(group)) {
			Ext.each(group, function(item) {
				this.addButtonGroup(item);
			}, this);
			return this;
		}
		if (Ext.isObject(group) && group.items) {
			this.addButton(group.items.items);
			this.buttons = this.buttons.concat(group.items.items);
			this.buttonGroup.push(group);
		}
		return this;
	},
	
	updateStatus : function(status, args) {

		if (Ext.isNumber(status)) {

			this.status = status;

			if ((this.status & FORM.STATUS.READ) != 0) {
				
				this.items.each(function(item) {
					if (item instanceof Ext.form.CheckboxGroup || item instanceof Ext.form.RadioGroup) {
						item.items && item.items.each(function(itm) {
							if (Ext.isEmpty(itm._READONLY)) {
								itm._READONLY = itm.readOnly;
							}
							itm.setReadOnly(true);
							
							if (Ext.isEmpty(itm._EMPTYTEXT)) {
								itm._EMPTYTEXT = itm.emptyText;
							}
							itm.emptyText = '';
						});
					} else {
						if (Ext.isEmpty(item._READONLY)) {
							item._READONLY = item.readOnly;
						}
						item.setReadOnly(true);
						
						if (Ext.isEmpty(item._EMPTYTEXT)) {
							item._EMPTYTEXT = item.emptyText;
						}
						item.emptyText = '';
					}
				});

				Ext.each(this.buttons, function(item) {
					if (item.type == 'cancel' || item.type == 'viewbutton') {
						return;
					}
					if (Ext.isEmpty(item._DISABLED)) {
						item._DISABLED = item.disabled;
					}
					item.setDisabled(true);
				});
				
			} else if ((this.status & FORM.STATUS.WRITE) != 0) {

				this.items.each(function(item) {
					if (item instanceof Ext.form.CheckboxGroup || item instanceof Ext.form.RadioGroup) {
						item.items && item.items.each(function(itm) {
							if (itm._READONLY) {
								itm.setReadOnly(false);
								itm.setReadOnly(itm._READONLY);
								itm._READONLY = undefined;
							} else {
								itm.setReadOnly(itm.readOnly);
							}
							
							if (itm._EMPTYTEXT) {
								itm.emptyText = itm._EMPTYTEXT;
								itm._EMPTYTEXT = undefined;
							}
						});
					} else {
						if (!Ext.isEmpty(item._READONLY)) {
							item.setReadOnly(false);
							item.setReadOnly(item._READONLY);
							item._READONLY = undefined;
						} else {
							item.setReadOnly(item.readOnly);
						}
						
						if (item._EMPTYTEXT) {
							item.emptyText = item._EMPTYTEXT;
							item._EMPTYTEXT = undefined;
						}
					}
				});
				
				Ext.each(this.buttons, function(item) {
					if (item.itemId == 'cancel' || item.itemId == 'viewbutton') {
						return;
					}
					if (!Ext.isEmpty(item._DISABLED)) {
						item.setDisabled(item._DISABLED);
						item._DISABLED = undefined;
						return;
					}
					item.setDisabled(false);
				});
			}

			//if (this.isStatus(FORM.STATUS.ADD)) {
			this.reset();
			//}

			this.fireEvent('statuschange', this, this.status, args);
		}
	},
	
	getStatus : function() {
		return this.status;
	},
	
	isStatus: function(status) {
		return (this.status & status) !== 0;
	},
	
	getMsg : function() {
		return this.Msg;
	},
	
	setMsg : function(msg) {
		Ext.apply(this.Msg, msg);
		return this;
	},
	
	setUrl : function(url) {
		this.url = url;
	},
	
	isValid : function() {
		var valid = true;
		this._firstInValidField = null;
		this.items.each(function(f) {
			// 如果被隐藏的控件，默认就不用验证其合法性，前提this.hiddenValid属性false
			if (f.isVisible && !f.isVisible() && !this.hiddenValid) {
				return;
			}
			/*// 加入对下拉列表输入合法性校验
			if (f instanceof Ext.form.ComboBox && 
					f.forceSelection && 
						f.isLoaded == true) {
				f.assertValue();
			}*/
			if (!f.validate()) {
				if (this._firstInValidField == null) {
					this._firstInValidField = f;
				}
				valid = false;
			}
		}, this);
		return valid && this.fireEvent('valid', this);
	},
	
	onReset : function() {
		this.reset();
	},
	
	reset: function(){
		
		var me = this;
		
		me.items.each(function(f){
			if (me.isStatus(FORM.STATUS.ADD)) {
				f.originalValue = null;
				f.originalRawValue = null;
			}
			f.reset();
        });
		
		if (me.isStatus(FORM.STATUS.EDIT) || me.isStatus(FORM.STATUS.COPY)) {
			me.setValues(me.originalValues);
		}
		
		this.fireEvent('reset', this);
		
        return this;
	},
	focusFirst: function(){
		if (this._firstInValidField && this._firstInValidField.focus) {
			this._firstInValidField.focus();
		}
	},
	onSubmit : function(e) {

		if (e.stopEvent) e.stopEvent();
		 
		if (this.standardSubmit) {
			if (this.isValid()) {
				if (this.fireEvent('beforesubmit', this.getFieldValues(), this, {}) !== false) {
					this.el.dom.submit();
				}
				return;
			}
		} else {
			var opts = {}, params = {};
			if (this.dataFormat && this.dataFormat == 'json') {
				params = this.getFieldValues();
			}
			// 编辑、查看时搜集公共字段信息，创建人、审核人等
			if (this.originalValues && (this.isStatus(FORM.STATUS.EDIT) || 
										this.isStatus(FORM.STATUS.VIEW)) ) {
				
				var values = this.originalValues;
				
				var json = {};
				
				if (!Ext.isEmpty(values.creatorId)) {
					json.creatorId = values.creatorId;
				}
				if (!Ext.isEmpty(values.createTime)) {
					json.createTime = values.createTime;
				}
				if (!Ext.isEmpty(values.lastEditorId)) {
					json.lastEditorId = values.lastEditorId;
				}
				if (!Ext.isEmpty(values.lastEditTime)) {
					json.lastEditTime = values.lastEditTime;
				}
				if (!Ext.isEmpty(values.deleted)) {
					json.deleted = values.deleted;
				}
				if (!Ext.isEmpty(values.deleteUserId)) {
					json.deleteUserId = values.deleteUserId;
				}
				if (!Ext.isEmpty(values.markDeleteTime)) {
					json.markDeleteTime = values.markDeleteTime;
				}
				
				if (!Ext.isEmpty(values.checked)) {
					json.checked = values.checked;
				}
				if (!Ext.isEmpty(values.checkerId)) {
					json.checkerId = values.checkerId;
				}
				if (!Ext.isEmpty(values.checkTime)) {
					json.checkTime = values.checkTime;
				}
				
				if (!Ext.isEmpty(values.otherCheckStates)) {
					json.otherCheckStates = values.otherCheckStates;
				}
				if (!Ext.isEmpty(values.otherCheckerIds)) {
					json.otherCheckerIds = values.otherCheckerIds;
				}
				if (!Ext.isEmpty(values.otherCheckerTimes)) {
					json.otherCheckerTimes = values.otherCheckerTimes;
				}
				
				Ext.apply(params, json);
			}
			Ext.apply(opts, {
				clientValidation : false,
				scope : this,
				url : this.url,
				method : this.method,
				dataType : this.dataType,
				fileUpload : this.fileUpload,
				waitTitle : (this.waitTitle ? this.waitTitle : this.getMsg().waitTitle),
				waitMsg : (this.waitMsg ? this.waitMsg : this.getMsg().wait),
				success : function(form, action) {
					var xhr = action.response;
					var msg = xhr.responseText;
					msg = Ext.util.Format.nl2br(msg);
					// 文件上传
					if (form.fileUpload) {
						msg = Ext.util.Format.stripTags(msg);
						var rt = {};
						try {
							rt = Ext.decode(msg);
						} catch (e) {
							rt = {
								success : true,
								message : msg
							};
						}
						if (rt.success == false) {
							if (this.fireEvent('error',msg, xhr, form) !== false) {
								sofa.error(!Ext.isEmpty(rt.title) ? rt.title : '提交异常',rt.message);
							}
						} else if (this.fireEvent('success', msg, xhr, form) !== false) {
							sofa.alert(!Ext.isEmpty(rt.message) ? rt.message : this.getMsg().success);
						}
						return;
					}
					// 普通提交
					if (this.fireEvent('success', msg, xhr, form) !== false) {
						var pureMessage = Ext.util.Format.stripTags(msg).trim();
						sofa.alert(!Ext.isEmpty(pureMessage) ? msg : this.getMsg().success);
					}
				},
				failure : function(form, action) {
					var xhr = action.response;
					if (xhr.isTimeout) {
						Ext.MessageBox.error({
							msg : Ext.Error.ConnectTimeout
						});
					} else if (this.fireEvent('error', xhr.responseText, xhr, form) !== false) {
						var error = new Ext.Error(xhr);
						error.title = "表单提交异常";
						error.url = this.url;
						Ext.handleError(error);
					}
				}
			});
			if (this.isValid()) {
				var np = {};
				if (this.fireEvent('beforesubmit', params, this, opts, np) !== false) {
					if (this.dataFormat && this.dataFormat == 'json') {
						// 2013-3-29 临时加入对安全检查的支持，过滤特殊危险字符串
						var jsonData = opts.params || params;
						for (var key in jsonData) {
							var value = jsonData[key];
							if (Ext.isString(value)) {
								value = Ext.util.Format.stripTags(value);
								value = Ext.util.Format.stripScripts(value);
								jsonData[key] = value;
							}
						}
						np['_jsonData'] = Ext.encode(jsonData);
						// end
						Ext.apply(opts, {
							params : np
						});
					}
					this.submit(opts);
				}
				return;
			}
		}
		sofa.alert({
			msg : this.inValidText,
			title: this.inValidTitle,
			fn : function() {
				if (this._firstInValidField) {
					this._firstInValidField.focus.defer(100, this._firstInValidField);
				}
			},
			scope : this
		});
	},
	setFieldValue : function(field, id, value) {
		
		if (field instanceof Ext.form.Field) {
			
			field.suspendHighLight++;
			
			try {
				if (field instanceof Ext.form.ComboBox) {
					if (field.hiddenName == id) {
						field.setValue(value);
					} else if (field.id == id && field.hiddenField) {
						field.setRawValue(value);
					} else if (field.id == id && !field.hiddenField) {
						field.setValue(value);
						field.setRawValue(value);
					}
		            if(this.trackResetOnLoad){
		                field.originalValue = field.getValue();
		                field.originalRawValue = field.getRawValue();
		            }
				} else {
					field.setValue(value);
					if (this.trackResetOnLoad) {
						field.originalValue = field.getValue();
					}
				}
				// TODO 可能不需要 field.validate();
			} finally {
				field.suspendHighLight--;
			}
			
		}
	},
	
	getOriginalValues : function(){
		return this.originalValues || {};
	},
	
	isLoaded : function(){
		return this.loaded == true;
	},
	
	setFormPanel : function(formPanel){
		this.formPanel = formPanel;
	},
	
	getFormPanel : function(){
		return this.formPanel;
	},
	
	setValues : function(values) {
		
		this.originalValues = values;
		
		this.loaded = false;
		
		/*if (this.isStatus(FORM.STATUS.ADD)) {
			this.trackResetOnLoad = false;
		} else {
			this.trackResetOnLoad = true;
		}*/
		
        if(Ext.isArray(values)){ 
            for(var i = 0, len = values.length; i < len; i++){
                var v = values[i];
                var field = this.findField(v.id);
                if(field){
                	this.setFieldValue(field, v.id, v.value);
                	if (field.emptyText) {
                		field.applyEmptyText();
                	}
                }
            }
        }else{ 
            var field, id;
            for(id in values){
            	var v = values[id];
                if(!Ext.isFunction(v) && (field = this.findField(id))){
                	this.setFieldValue(field, id, v);
                	if (field.emptyText) {
                		field.applyEmptyText();
                	}
                }
            }
        }
        
        this.loaded = true;
		
        this.fireEvent('load', this, values);
        
        return this;
	},
	getFieldValues : function(dirtyOnly){
        var o = {},
            n,
            key,
            val;
        this.items.each(function(f) {
            if (!f.disabled && (dirtyOnly !== true || f.isDirty())) {
                n = f.getName();
                key = o[n];
                val = f.getValue();

                if(Ext.isDefined(key)){
                    if(Ext.isArray(key)){
                        o[n].push(val);
                    }else{
                        o[n] = [key, val];
                    }
                }else{
                    o[n] = val;
                }
            	if (f instanceof Ext.form.ComboBox) {
            		if (f.hiddenField) {
	            		n = f.getId();
	            		val = f.getRawValue();
	            		o[n] = val;
            		}
            	}
            }
        });
        return o;
    },
	findField : function(id) {
        var field = this.items.get(id);

        if (!Ext.isObject(field)) {
            
            var findMatchingField = function(f) {
                if (f.isFormField) {
                    if (f.dataIndex == id || f.id == id || f.getName() == id) {
                        field = f;
                        return false;
                    } else if (f.isComposite) {
                        return f.items.each(findMatchingField);
                    } else if (f instanceof Ext.form.CheckboxGroup && f.rendered) {
                        return f.eachItem(findMatchingField);
                    } else if (f instanceof Ext.form.ComboBox && f.id == id) {
                    	field = f;
                    	return false;
                    }
                }
            };

            this.items.each(findMatchingField);
        }
        return field || null;
    },
    /**
     * 防止下拉列表随意输入检索后，立刻点保存会出现通过验证的情况。
     */
    add : function(){
    	var fields = Array.prototype.slice.call(arguments, 0);
    	/*Ext.each(fields, function(field){
    		if (field instanceof Ext.form.ComboBox) {
        		field.on('expand', this.lock, this);
        		field.on('collapse', this.unlock, this);
        	} 
    	}, this);*/
        this.items.addAll(fields);
        return this;
    },
    
    remove : function(field){
    	/*if (field instanceof Ext.form.ComboBox) {
    		field.un('expand', this.lock);
    		field.un('collapse', this.unlock);
    	} */
        this.items.remove(field);
        return this;
    }
    
});

Ext.override(Ext.FormPanel, {
	
	initComponent : function(){
		this.form = this.createForm();
	    Ext.FormPanel.superclass.initComponent.call(this);
	
	    this.bodyCfg = {
	    		tag: 'form',
			    cls: this.baseCls + '-body',
			    method : this.method || 'POST',
			    id : this.formId || Ext.id()
			};
		if(this.fileUpload) {
		    this.bodyCfg.enctype = 'multipart/form-data';
		}
		this.initItems();
		
		this.addEvents(
		     
		    'clientvalidation'
		);
		
		this.relayEvents(this.form, ['beforesubmit', 'success', 'error', 'statuschange', 'reset',
		                              'beforeaction', 'actionfailed', 'actioncomplete', 'valid']);
	},
	
	afterRender : function(){
        Ext.FormPanel.superclass.afterRender.call(this, arguments);
		if (this.fit) {
			this.fitContainer();
		}
    },
	
	fitContainer : function() {
		var vs = Ext.getBody().getViewSize(false);
		var h = vs.height - this.el.getTop();
		var w = ((Ext.isIE6 || Ext.isIE7) ? (vs.width - this.el.getLeft()) : vs.width);
		Ext.apply(vs, {
			width : w,
			height : h
		});
		// TODO
		var htmlTag = document.getElementsByTagName('html')[0];
		if (htmlTag) {
			Ext.fly(htmlTag).addClass('x-viewport');
		}
		this.container.setSize(vs);
		this.setSize(vs);
		this.doLayout();
	},
	
	createForm : function(){
        var config = Ext.applyIf({listeners: {}}, this.initialConfig);
        if (config.basicFormId) {
    		config.id = config.basicFormId;
    	}
        var basicform = new Ext.form.BasicForm(null, config);
    	Ext.ComponentMgr.register(basicform);
    	return basicform;
    },
	
	setAllReadOnly: function(readOnly){
		this.getForm().items.each(function(f){
			f.setReadOnly(readOnly);
		});
	},
	
	setAllBtnDisabled: function(disabled){
		Ext.each(this.buttons, function(button){
			button.setDisabled(disabled);
		});
	}
});

Ext.override(Ext.form.Checkbox, {
	setValue : function(v) {
		var checked = this.checked, inputVal = this.inputValue;
		if (this.value == '0')
			this.value = 0;
		if (inputVal == '0')
			inputVal = 0;
		this.checked = (v === true || v === 'true' || v == '1'
				|| (v == this.value && this.value != 0) || (inputVal ? (v == inputVal && inputVal != 0)
				: String(v).toLowerCase() == 'on'));
		if (this.rendered) {
			this.el.dom.checked = this.checked;
			this.el.dom.defaultChecked = this.checked;
		}
		if (checked != this.checked) {
			this.fireEvent('check', this, this.checked);
			if (this.handler) {
				this.handler.call(this.scope || this, this, this.checked);
			}
		}
		return this;
	},
	getValue : function() {
		if (this.value != undefined && this.checked == true) {
			return this.value;
		} else if (this.value != undefined
				&& this.checked == false) {
			return '';
		}
		if (this.rendered) {
			return this.el.dom.checked;
		}
		return this.checked;
	}
});

Ext.override(Ext.form.ComboBox, {
	
	defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
		
	clearValue : function(){
        if(this.hiddenField){
            this.hiddenField.value = '';
        }
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
        this.value = '';
        Ext.form.ComboBox.superclass.clearValue.call(this);
    }
});

Ext.override(Ext.Button, {
	
	updateStatus : function(status) {
		if (status == FORM.STATUS.VIEW) {
			this.setDisabled(true);
		} else if (status == FORM.STATUS.UPDATE) {
			this.setDisabled(false);
		}
	},
	
	setDisabled : function(disabled) {
		this.onDisableChange(disabled);
	},
	
	onDisableChange : function(disabled) {
		if (this.el) {
			if (!Ext.isIE6 || !this.text) {
				this.el[disabled ? 'addClass' : 'removeClass']
						(this.disabledClass);
			}
			this.el.dom.disabled = disabled;
			this.btnEl.dom.disabled = disabled;
		}
		this.disabled = disabled;
	}
	
});

/**
 * 增加HttpProxy可以执行同步的参数
 */
Ext.override(Ext.data.HttpProxy, {
	doRequest : function(action, rs, params, reader, cb, scope, arg) {
		var o = {
			async : arg.async,
			timeout : this.timeout || 30000,
			method : this.method ? this.method : 
						((this.api[action]) ? 
								this.api[action]['method']
									: undefined),
			request : {
				callback : cb,
				scope : scope,
				arg : arg
			},
			reader : reader,
			callback : this.createCallback(action, rs),
			scope : this
		};

		if (params.jsonData) {
			o.jsonData = params.jsonData;
		} else if (params.xmlData) {
			o.xmlData = params.xmlData;
		} else {
			o.params = params || {};
		}

		this.conn.url = this.buildUrl(action, rs);

		if (this.useAjax) {

			Ext.applyIf(o, this.conn);

			if (this.activeRequest[action]) {

			}
			this.activeRequest[action] = Ext.Ajax.request(o);
		} else {
			this.conn.request(o);
		}

		this.conn.url = null;
	}
});

/**
 * 增加功能，扩展多字段排序
 */
Ext.override(Ext.util.MixedCollection, {
	sortBy: function(sorterFn) {
        var me     = this,
            items  = me.items,
            keys   = me.keys,
            length = items.length,
            temp   = [],
            i;

        
        for (i = 0; i < length; i++) {
            temp[i] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }

        temp.sort(function(a, b) {
            var v = sorterFn(a.value, b.value);
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }

            return v;
        });

        
        for (i = 0; i < length; i++) {
            items[i] = temp[i].value;
            keys[i]  = temp[i].key;
        }

        me.fireEvent('sort', me, items, keys);
    }
});

Ext.override(Ext.data.Store, {
	defaultParamNames : {
		start : '_startRow',
		limit : '_rowCount',
		sort : '_sort',
		dir : 'dir' // dir 已经没用了
	},
	
	_transId: null,
	
	/**
	 * 改变传递参数里关于排序的参数名以及类型
	 * ext为 sort:xxx dir:xxx
	 * 改后 _sort:[{field:xxx,direction:xxx},...]
	 * @param options
	 * @returns
	 */
	load : function(options) {
		if (this._transId) {
			return;
		}
        options = Ext.apply({}, options);
        // 12-18 加入请求的并发控制
        var transfn = function(){
    		this._transId = false;
    	}
        if (options.callback) {
        	options.callback = options.callback.createSequence(transfn, this);
        } else {
        	options.callback = transfn;
        	options.scope = this;
        }
        // end
        this.storeOptions(options);
        if(this.sortInfo && this.remoteSort){
            var pn = this.paramNames;
            options.params = Ext.apply({}, options.params);
            if (this.sortInfo) {
            	if (Ext.isObject(this.sortInfo)) {
            		this.sortInfo = [].concat(this.sortInfo);
            	}
            }
            options.params[pn.sort] = Ext.encode(this.sortInfo);
            //options.params[pn.dir] = this.sortInfo.direction;
        }
		if (options.url) {
			this.setUrl(options.url);
		}
        try {
        	this._transId = true;
            return this.execute('read', null, options); 
        } catch(e) {
            this._transId = false;
            this.handleException(e);
            return false;
        }
    },
	
    sort : function(fieldName, dir) {
        if (Ext.isArray(arguments[0])) {
            return this.multiSort.call(this, arguments[0]);
        } else {
            return this.singleSort(fieldName, dir);
        }
    },
	multiSort: function(sorters) {
        this.hasMultiSort = true;
        
        if (sorters) {
        	this.sortInfo = sorters;
        }
        
        sorts = [];
        
        Ext.each(this.sortInfo, function(sort){
        	if (!sort.direction) {
	        	sort.direction = "ASC";
	        }
        	if (sort.field) {
        		sorts.push(sort);
        	}
        });
        
        this.sortInfo = sorts;
        
        if (this.remoteSort) {
            this.load(this.lastOptions);
        } else {
            this.applySort();
            this.fireEvent('datachanged', this);
        }
    },
    getSortState : function(){
        return this.sortInfo;
    },
    sortData : function() {
    	
    	var sortInfo  = this.sortInfo,
        	sorters   = sortInfo;

    
	    if (!Ext.isArray(sortInfo) && sortInfo) {
	    	
	    	var direction = sortInfo.direction || "ASC";
	    	
	        sorters = [{
	        	direction: direction, 
	        	field: sortInfo.field
	        }];
	        
	    }
	    
	    if (Ext.isArray(sorters)) {
	    	
	        for (var i=0, j = sorters.length; i < j; i++) {
	        	
	        	sorters[i].sort = this.createSortFunction(sorters[i].field, sorters[i].direction);
	            
	        }
	        
	    }
	    
	    var sorterFn = function(r1, r2) {
	    	
	    	if (!Ext.isArray(sorters) || sorters.length <= 0) {
	    		return 0;
	    	}
	    	
	    	var result = sorters[0].sort(r1, r2) ,
	             length = sorters.length,
	             i;
	    	 
	        for (i = 1; i < length; i++) {
	             result = result || sorters[i].sort.call(this, r1, r2);
	        }
	
	    	return result;
	    	
	    }
	    
	    this.data.sortBy(sorterFn);
	    
	    if (this.snapshot && this.snapshot != this.data) {
	        this.snapshot.sortBy(sorterFn);
	    }
    },
	handleException : function(e) {
		Ext.handleError(new Ext.data.Store.Error(e.message, this.id));
	},
	setUrl : function(url) {
		this.url = url;
		if (this.proxy && this.proxy.getConnection) {
			this.proxy.setUrl(this.url, true);
		} else {
			this.proxy = new Ext.data.HttpProxy({
				url : this.url,
				api : this.api
			});
			this.relayEvents(this.proxy, [ 'loadexception', 'exception' ]);
		}
	},
	
	setRequestParams : function(params, append) {
		if (typeof params == 'string') {
			params = Ext.decode(params);
		}
		if (params) {
			if (params.url) {
				this.setUrl(params.url);
				delete params.url;
			}
			if (!append) {
				this.clearRequestParams();
			}
			Ext.apply(this.baseParams, params);
		}
	},
	
	clearRequestParams : function() {
		if (arguments.length > 0) {
    		Ext.each(arguments, function(arg) {
    			if (Ext.isString(arg)) {
    				if (this.lastOptions && this.lastOptions.params) {
    	    			delete this.lastOptions.params[arg];
    	    		}
    				delete this.baseParams[arg];
    			} else if (Ext.isArray(arg)) {
    				Ext.each(arg, function(_arg){
    					if (this.lastOptions && this.lastOptions.params) {
    						delete this.lastOptions.params[_arg];
    					}
    					delete this.baseParams[_arg];
    				}, this)
    			}
    		}, this);
    	} else {
    		this.baseParams = {};
    	}
	},
	
	getRequestParams: function(){
		return this.baseParams;
	},
	
	reload : function(options) {
		this.load(Ext.applyIf(options || {}, this.lastOptions));
	},
	
	toArray : function() {
		var arr = [];
		Ext.each(this.data.items, function(d) {
			arr.push(d.data);
		});
		return arr;
	},
	toJSON : function() {
		return this.toArray();
	},
	// 扩展property为数组的情况，支持多属性任意匹配检索
	createFilterFn : function(property, value, anyMatch, caseSensitive, exactMatch){
        if(Ext.isEmpty(value, false)){
            return false;
        }
        value = this.data.createValueMatcher(value, anyMatch, caseSensitive, exactMatch);
        return function(r) {
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
    filterBy : function(fn, scope){
        this.snapshot = this.snapshot || this.data;
        this.data = this.queryBy(fn, scope || this);
        this.fireEvent('datachanged', this);
    },
    query : function(property, value, anyMatch, caseSensitive, exactMatch){
    	var fn;
        if (Ext.isObject(property)) {
            property = [property];
        }
        if (Ext.isArray(property)) {
            var filters = [];
            for (var i=0, j = property.length; i < j; i++) {
                var filter = property[i],
                    func   = filter.fn,
                    scope  = filter.scope || this;                
                if (!Ext.isFunction(func)) {
                    func = this.createFilterFn(filter.property, filter.value, filter.anyMatch, filter.caseSensitive, filter.exactMatch);
                }
                filters.push({fn: func, scope: scope});
            }
            fn = this.createMultipleFilterFn(filters);
        } else {
            fn = this.createFilterFn(property, value, anyMatch, caseSensitive, exactMatch);
        }
        return fn ? this.queryBy(fn) : this.data.clone();
    }
});

Ext.override(Ext.form.RadioGroup, {
	getValue : function() {
		var out = null;
		this.eachItem(function(item) {
			if (item.checked) {
				out = item.getValue();
				return false;
			}
		});
		return out;
	},
	setValueForItem : function(val) {
		val = String(val).split(',')[0];
		this.eachItem(function(item) {
			item.setValue(val == item.inputValue || val == item.value);
		});
	}
});

Ext.override(Ext.form.CheckboxGroup, {
	getValue : function() {
		var out = [];
		this.eachItem(function(item) {
			if (item.checked) {
				out.push(item.getValue());
			}
		});
		return out;
	},
	setValueForItem : function(val) {
		val = String(val).split(',');
		this.eachItem(function(item) {
			if (val.indexOf(item.inputValue) > -1
					|| val.indexOf(item.value) > -1) {
				item.setValue(true);
			}
		});
	}
});

Ext.override(Ext.data.JsonReader, {
	createAccessor : function() {
		var re = /[\[\.]/;
		return function(expr) {
			if (Ext.isEmpty(expr)) {
				return Ext.emptyFn;
			}
			if (Ext.isFunction(expr)) {
				return expr;
			}
			var i = String(expr).search(re);
			if (i >= 0) {
				return new Function('obj', 'try {return obj'
						+ (i > 0 ? '.' : '') + expr + '} catch(e){}');
			}
			return function(obj) {
				return obj[expr];
			};

		};
	}()
});

Ext.override(Ext.data.Record, {
	toJSON : function() {
		return Ext.applyIf(this.data, {
			id : this.id
		});
	}
});

Ext.override(Ext.grid.CheckboxSelectionModel, {
	printable : false
});

Ext.override(Ext.grid.RowNumberer, {
	printable : false,
	locked : true
});

Ext.FitPanel = Ext.extend(Ext.Panel, {
	border : false,
	frame : false,
	layout : 'fit',
	bodyStyle : 'overflow:auto',
	monitorResize : true,
	onRender : function(ct, pos) {
		Ext.FitPanel.superclass.onRender.call(this, ct, pos);
		if (this.contentEl) {
			this.contentEl = new Ext.Element(this.contentEl);
		}
	},
	onBodyResize : function(w, h) {
	}
});
Ext.reg('fitpanel', Ext.FitPanel);

Ext.override(Ext.grid.RowSelectionModel, {
	getSelectedIndex : function() {
		return this.grid.store.indexOf(this.getSelected()) + 1;
	}
});

Ext.override(Ext.tree.TreeNodeUI,{
	onCheckChange : function() {
		var checked = this.checkbox.checked;
		this.checkbox.defaultChecked = checked;
		var loader = this.node.getOwnerTree().getLoader();
		this.node.attributes[loader.checked || loader.checkedParam] = checked;
		this.fireEvent('checkchange', this.node, checked);
	},
	renderElements : function(n, a, targetNode, bulkRender) {
		this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
		
		var tree = n.getOwnerTree(),
			tpl = tree.tpl || tree.template,
			text = tpl ? (Ext.isString(tpl) ? new Ext.XTemplate(tpl).apply(a) : tpl.apply(a)) : n.text,
			checkedParam = n.getLoader().checked || n.getLoader().checkedParam,
			multiSelect;
			
		if (!Ext.isEmpty(a.multiSelect)) {
			multiSelect = a.multiSelect;
		} else {
			multiSelect = tree.multiSelect;
		}
		var cb = multiSelect || Ext.isBoolean(a[checkedParam]), 
			nel, href = this.getHref(a.href), buf = [
				'<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
				a.cls,'" unselectable="on">',
				'<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
				'<img alt="" src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
				'<img alt="" src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon', (a.icon ? " x-tree-node-inline-icon" : ""),
				(a.iconCls ? " " + a.iconCls : ""),'" unselectable="on" />',
				cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a[checkedParam] ? 'checked="checked" />' : '/>')) : '',
				'<a hidefocus="on" class="x-tree-node-anchor" href="', href, '" tabIndex="1" ',
				a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
				'><span unselectable="on">',
				text,
				"</span></a></div>",
				'<ul class="x-tree-node-ct" style="display:none;"></ul>',
				"</li>" ].join('');
		if (bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())) {
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
		} else {
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
		}
		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var cs = this.elNode.childNodes;
		this.indentNode = cs[0];
		this.ecNode = cs[1];
		this.iconNode = cs[2];
		var index = 3;
		if (cb) {
			this.checkbox = cs[3];
			this.checkbox.defaultChecked = this.checkbox.checked;
			index++;
		}
		this.anchor = cs[index];
		this.textNode = cs[index].firstChild;
		this.onDisableChange(n, n.disabled);
	}
});

Ext.override(Ext.tree.TreeNode, {
	render : function(bulkRender) {
		this.ui.render(bulkRender);
		if (!this.rendered) {
			this.getOwnerTree().registerNode(this);
			this.rendered = true;
			if (this.expanded) {
				this.expanded = false;
				this.expand(false, false);
			}
		}
		// 增加noderender事件
		this.fireEvent('noderender', this);
	},
	clone : function() {
		return this.getLoader().createNode(this.attributes);
	},
	getLoader : function() {
		return this.loader ? this.loader : this.getOwnerTree().getLoader();
	},
	disable : function() {
		this.disabled = true;
		this.attributes.disabled = true;
		this.unselect();
		if (this.rendered && this.ui.onDisableChange) {
			this.ui.onDisableChange(this, true);
		}
		this.fireEvent('disabledchange', this, true);
	},
	enable : function() {
		this.disabled = false;
		this.attributes.disabled = false;
		if (this.rendered && this.ui.onDisableChange) {
			this.ui.onDisableChange(this, false);
		}
		this.fireEvent('disabledchange', this, false);
	},
	toggleCheck : function(value) {
		if (this.disabled == true)
			return;
		if (this.rendered) {
			this.ui.toggleCheck(value);
		} else {
			this.attributes[this.getLoader().checked || this.getLoader().checkedParam] = value;
		}
	},
	isChecked : function() {
		return this.attributes[this.getLoader().checked || this.getLoader().checkedParam];
	},
	hasClass : function(cls) {
		if (this.ui && this.ui.elNode) {
			return Ext.fly(this.ui.elNode).hasClass(cls);
		}
	},
	toggleClass : function(cls) {
		if (this.ui && this.ui.elNode) {
			Ext.fly(this.ui.elNode).toggleClass(cls);
		}
	},
	addClass : function(cls) {
		if (this.ui && this.ui.elNode) {
			Ext.fly(this.ui.elNode).addClass(cls);
		}
	},
	removeClass : function(cls) {
		if (this.ui && this.ui.elNode) {
			Ext.fly(this.ui.elNode).removeClass(cls);
		}
	}
});

Ext.override(Ext.tree.TreeLoader, {
	// 默认子节点的属性
	childrenParam : 'children',
	// 默认选中属性
	checkedParam : '_checked',
	// 默认传递node参数
	nodeParam : 'node',
	// 默认节点显示文本属性
	textParam : 'text',
	
	preloadChildren : true,
	
	// 异步模式
	asyncLoad : true,

	setUrl : function(url) {
		this.dataUrl = url;
		this.url = url;
	},
	
	setRequestParams : function(params, append) {
		if (typeof params == 'string') {
			params = Ext.decode(params);
		}
		if (params) {
			if (params.url) {
				this.setUrl(params.url);
				delete params.url;
			}
			if (!append) {
				this.clearRequestParams();
			}
			Ext.apply(this.baseParams, params);
		}
	},
	
	clearRequestParams : function() {
		if (arguments.length > 0) {
    		Ext.each(arguments, function(arg) {
    			if (Ext.isString(arg)) {
    				if (this.lastOptions && this.lastOptions.params) {
    	    			delete this.lastOptions.params[arg];
    	    		}
    				delete this.baseParams[arg];
    			} else if (Ext.isArray(arg)) {
    				Ext.each(arg, function(_arg){
    					if (this.lastOptions && this.lastOptions.params) {
    						delete this.lastOptions.params[_arg];
    					}
    					delete this.baseParams[_arg];
    				}, this);
    			}
    		}, this);
    	} else {
    		this.baseParams = {};
    	}
	},
	
	getRequestParams: function(){
		return this.baseParams;
	},
	
	reload : function(node, callback, scope) {
		this.load(node, callback, scope);
	},
	
	load : function(node, callback, scope){
		if (this.isLoading()) {
			return;
		}
        if(this.clearOnLoad){
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
        }
        if(this.doPreload(node)){ 
            this.runCallback(callback, scope || node, [node]);
        }else if(this.directFn || this.dataUrl || this.url){
            this.requestData(node, callback, scope || node);
        }
    },
	
	handleResponse : function(response) {
		var a = response.argument;
		this.processResponse(response, a.node, a.callback, a.scope);
		this.transId = false;
		this.fireEvent("load", this, a.node, response);
	},
	
	requestData : function(node, callback, scope, async) {
		if (this.fireEvent("beforeload", this, node, callback) !== false) {
			if (this.directFn) {
				var args = this.getParams(node);
				args.push(this.processDirectResponse.createDelegate(this, [{
							callback : callback,
							node : node,
							scope : scope
						}], true));
				this.directFn.apply(window, args);
			} else {
				this.transId = Ext.Ajax.request({
							method : this.requestMethod,
							async : (async == undefined ? true : async),
							url : this.dataUrl || this.url,
							success : this.handleResponse,
							failure : this.handleFailure,
							timeout : this.timeout || 30000,
							scope : this,
							argument : {
								callback : callback,
								node : node,
								scope : scope
							},
							params : this.getParams(node)
						});
				if (async == false) {
					this.transId = false;
				}
			}
		} else {
			this.runCallback(callback, scope || node, []);
		}
	},
	
	getParams : function(node) {
		var bp = Ext.apply({}, this.baseParams), np = this.nodeParam, po = this.paramOrder;
		// 当根节点，不传递nodeParam参数
		if (!node.isRoot) { 
			np && (bp[ np ] = node.id);
		}
		if (this.directFn) {
			var buf = [ node.id ];
			if (po) {
				if (np && po.indexOf(np) > -1) {
					buf = [];
				}
				for ( var i = 0, len = po.length; i < len; i++) {
					buf.push(bp[po[i]]);
				}
			} else if (this.paramsAsHash) {
				buf = [bp];
			}
			return buf;
		} else {
			return bp;
		}
	},
	
	doPreload : function(node) {
		
		var childrenParam = this.children || this.childrenParam;
		
		if (node.attributes[childrenParam]) {
			if (node.childNodes.length < 1) {
				var cs = node.attributes[childrenParam];
				node.beginUpdate();
				for ( var i = 0, len = cs.length; i < len; i++) {
					var cn = node.appendChild(this.createNode(cs[i]));
					if (this.preloadChildren) {
						this.doPreload(cn);
					}
				}
				node.endUpdate();
			}
			return true;
		}
		return false;
	},
	
	processResponse : function(response, node, callback, scope) {
		var me = this,
			json = response.responseText, 
			n, attr, children, r;
		try {
			var o = response.responseData || Ext.decode(json);
			var children = [];
			node.loader = this;
			node.beginUpdate();
			for ( var i = 0; i < o.length; i++) {
				attr = o[i];
				n = this.createNode(attr);
				if (n) {
					children = attr[me.children || me.childrenParam];
					// if has children then create child node
					// [iterate]
					if (Ext.isArray(children)) {
						n.loaded = true;
						for ( var j = 0; j < children.length; j++) {
							Ext.apply(children[j], {
								_pn : n
							});
						}
						o = o.concat(children);
					}
					(attr._pn ? attr._pn : node).appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [ node ]);
		} catch (e) {
			this.handleFailure(response);
		}
	},
	
	createNode : function(attr) {

		if (this.fireEvent('beforecreatenode', this, attr) == false) {
			return;
		}
		
		if (this.baseAttrs) {
			Ext.applyIf(attr, this.baseAttrs);
		}
		
		if (this.expandedAll) {
			attr.expanded = this.expandedAll;
		}
		
		if (this.applyLoader !== false && !attr.loader) {
			attr.loader = this;
		}
			
		attr.text = attr[this.text || this.textParam];

		if (Ext.isString(attr.uiProvider)) {
			attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
		}
		if (attr.nodeType) {
			return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
		} else {
			return (attr.leaf ? new Ext.tree.TreeNode(attr) : new Ext.tree.AsyncTreeNode(attr));
		}
	}
});

Ext.override(Ext.tree.DefaultSelectionModel, {
	// 配合树TreeView的懒渲染修改
	select : function(node, selectNextNode) {
		if (node.rendered == false)
			return;
		if (!Ext.fly(node.ui.wrap).isVisible() && selectNextNode) {
			return selectNextNode.call(this, node);
		}
		var last = this.selNode;
		if (node == last) {
			node.ui.onSelectedChange(true);
		} else if (this.fireEvent('beforeselect', this, node, last) !== false) {
			if (last && last.ui) {
				last.ui.onSelectedChange(false);
			}
			this.selNode = node;
			node.ui.onSelectedChange(true);
			this.fireEvent('selectionchange', this, node, last);
		}
		return node;
	}
});

Ext.override(Ext.tree.TreePanel, {
	
	autoQuery: true,
	
	rootVisible: false,
	
	containerScroll: true,
	
	cascadeCheckChange: true,	

	setTimeout: function(timeout) {
		if (this.loader) {
			this.loader.timeout = timeout;
		}
	},
	
	initComponent : function() {
		
		Ext.tree.TreePanel.superclass.initComponent.call(this);

        if(!this.eventModel){
            this.eventModel = new Ext.tree.TreeEventModel(this);
        }
        
        var l = this.loader;
        var loaderConfig = {};
        if (this.nodeParam) {
        	loaderConfig.nodeParam = this.nodeParam;
        }
        if (this.textParam) {
        	loaderConfig.textParam = this.textParam;
        }
        if (this.childrenParam) {
        	loaderConfig.childrenParam = this.childrenParam;
        }
        if(!l){
            l = new Ext.tree.TreeLoader(Ext.apply(loaderConfig,{
                dataUrl: this.url || this.dataUrl,
                requestMethod: this.requestMethod
            }));
        }else if(Ext.isObject(l) && !l.load){
            l = new Ext.tree.TreeLoader(l);
        }
        this.loader = l;
        // 把展开全部的参数传递到loader里
        this.loader.expandedAll = this.expandedAll;

        this.nodeHash = {};

		if (!this.root && !this.rootVisible) {
			this.root = new Ext.tree.TreeNode({
				id : this.rootId || -1,
				text : this.rootText || '',
				loader: this.loader
			});
		}
		
		if (this.root) {
			var r = this.root;
			delete this.root;
			this.setRootNode(r);
		}

        this.addEvents(
            
           'append',
           
           'remove',
           
           'movenode',
           
           'insert',
           
           'beforeappend',
           
           'beforeremove',
           
           'beforemovenode',
           
            'beforeinsert',
            
            'beforeload',
            
            'load',
            
            'textchange',
            
            'beforeexpandnode',
            
            'beforecollapsenode',
            
            'expandnode',
            
            'disabledchange',
            
            'collapsenode',
            
            'beforeclick',
            
            'click',
            
            'containerclick',
            
            'checkchange',
            
            'beforedblclick',
            
            'dblclick',
            
            'containerdblclick',
            
            'contextmenu',
            
            'containercontextmenu',
            
            'beforechildrenrendered',
           
            'startdrag',
            
            'enddrag',
            
            'dragdrop',
            
            'beforenodedrop',
            
            'nodedrop',
             
            'nodedragover'
            
        );
        if(this.singleExpand){
            this.on('beforeexpandnode', this.restrictExpand, this);
        }
        
        this.relayEvents(this.loader, ['load', 'beforecreatenoed']);
	},
	
	afterRender: function(){
		
		Ext.tree.TreePanel.superclass.afterRender.call(this);
		
		this.renderRoot();
		
		if (this.root && this.autoQuery) {
			this.loader.load(this.root);
		}
		
	},
	
	getSelectionModel : function(){
		
        if(!this.selModel){
        	
        	if (this.multiSelect) {
        		this.selModel = new Ext.tree.MultiSelectionModel();
        	} else {
        		this.selModel = new Ext.tree.DefaultSelectionModel();
        	}
            
        }
        return this.selModel;
    },
    
	initEvents : function(){
		
        Ext.tree.TreePanel.superclass.initEvents.call(this);

        if(this.containerScroll){
            Ext.dd.ScrollManager.register(this.body);
        }
        if((this.enableDD || this.enableDrop) && !this.dropZone){
           
           this.dropZone = new Ext.tree.TreeDropZone(this, this.dropConfig || {
               ddGroup: this.ddGroup || 'TreeDD', appendOnly: this.ddAppendOnly === true
           });
           
        }
        if((this.enableDD || this.enableDrag) && !this.dragZone){
           
            this.dragZone = new Ext.tree.TreeDragZone(this, this.dragConfig || {
               ddGroup: this.ddGroup || 'TreeDD',
               scroll: this.ddScroll
           });
        }
        this.getSelectionModel().init(this);
        
        var checkedParam = this.loader.checked || this.loader.checkedParam;
        
        this.on('beforeappend', function(tree, parent, node) {
			
			if (parent.attributes[checkedParam]) {
				node.attributes[checkedParam] = true;
			}
			
		});
        
        if(this.cascadeCheckChange != false){
        	this.on('checkchange', function(node, checked){
        		node.attributes[checkedParam] = checked;
        		if(!Ext.EventObject.shiftKey){
        			node.eachChild(function(child){
	        			if(!child.disabled){
	        				child.ui.toggleCheck(checked);
							if(!child.ui.checkbox){
							    child.fireEvent('checkchange', child, checked);
							}
						}
		            });
        		}
		    }, this);
        }
    },
    
    toggleMultiSelect: function(multiSelect){
    	if (Ext.isEmpty(multiSelect)) {
    		this.multiSelect = !this.multiSelect;
    	} else { 
    		this.multiSelect = multiSelect;
    	}
    	Ext.destroy(this.selModel);
    	this.selModel = null;
    	this.getSelectionModel().init(this);
    },
    
	handleFailure : function(loader, opt, xhr, e) {
		Ext.handleError(new Ext.Error(xhr, this.id));
	},

	findNodeById : function(nodeId) {
		for (var nid in this.nodeHash) {
			if (nid == nodeId) {
				return this.nodeHash(nid);
			}
		}
		return;
	},
	
	lastWord : undefined,
	
	lastFocusCls : undefined,
	
	lastIndex : 0,
	
	searchNodes : [],
	
	/**
	 * 清空上一次检索条件
	 */
	clearSearch : function() {
		this.lastIndex = 0;
		if (this.searchNodes.length > 0) {
			Ext.each(this.searchNodes, function(node) {
				node.getUI().removeClass(this.lastFocusCls);
			}, this);
			this.searchNodes = [];
		}
		this.lastFocusCls = undefined;
	},
	/**
	 * 检索方法
	 * 
	 * keyword: string 关键字 
	 * 
	 * attr: string 匹配节点的属性词，如果是异步检索，则此属性作为传递关键字的参数名，默认为text 
	 * 
	 * caseSensitive: boolean 是否忽略大小写，字符串类型匹配有效 [true] 
	 * 
	 * match: string [start匹配开始 end匹配结束 all完全匹配 ignore完全模糊匹配[default]]
	 * 
	 * async: boolean 是否异步检索 [TRUE 异步] 
	 * 
	 * params: object
	 * 如果是异步情况下，作为传递的参数 如果是同步情况下，作为多属性检索 [{keyword:string,
	 * attr:string, match:string, caseSensitive:boolean},...]
	 * either: boolean
	 * 在多属性检索的情况下，如果此属性设为True表示匹配其中之一个条件即可算满足匹配，默认false
	 * 
	 * focus: boolean 是否要聚焦节点，异步检索此属性无效 focusCls: string
	 * 附加的样式CSS，异步检索此属性无效 startNode: Ext.tree.TreeNode
	 * 检索的起始节点，默认从根节点开始，异步检索此属性无效
	 * 
	 * callback: Function 回调函数 scope: object 域
	 */
	search : function(params) {
		var keyword = params.keyword, attr = params.attr, 
			async = params.async, focus = params.focus, 
			callback = params.callback, caseSensitive = params.caseSensitive, 
			startNode = params.startNode, match = params.match, focusCls = params.focusCls, 
			scope = params.scope, either = params.either || false;
		
		if (Ext.isEmpty(attr))
			attr = 'text';
		if (Ext.isEmpty(match))
			match = 'ignore';
		if (Ext.isEmpty(async))
			async = true;

		// 异步检索
		if (async) {
			var request = {};
			if (keyword && attr)
				request[attr] = keyword;
			if (params.params) {
				Ext.apply(request, params.params);
			}
			this.searchNodes = [];
			// START *****************************************************************
			// 2013-3-23 zhangjun 这里需要把控件已有的条件给带一起，否则会出现条件丢失
			this.clearRequestParams(attr);
			Ext.apply(request, this.getRequestParams() || {});
			this.setRequestParams(request);
			// 参数位置互换
			this.reload(null, callback, scope);
			// END   *****************************************************************
		}
		// 同步检索
		else {
			var multi;
			if (keyword == undefined) {
				if (Ext.isArray(params.params)) {
					multi = params.params;
				} else if (Ext.isObject(params.params)) {
					multi = [].concat(params.params);
				} else {
					return;
				}
			} else {
				multi = [{
					keyword : keyword,
					attr : attr,
					match : match
				}];
				if (keyword == this.lastWord) {
					if (this.searchNodes.length > 0) {
						var index = Math.min(++this.lastIndex,
								this.searchNodes.length);
						var n = this.searchNodes[Math.max(
								index - 1, 0)];
						n.ensureVisible(function(node) {
							if (node != n) {
								expandByPath.call(this, node.getPath());
							}
						}, this);
						if (focus) {
							n.getUI().focus();
						}
					}
					return;
				}
				if (Ext.isEmpty(keyword)) {
					return;
				}
				this.lastWord = keyword;
			}
			if (this.searchNodes.length > 0 && focusCls) {
				Ext.each(this.searchNodes, function(node) {
					node.getUI().removeClass(focusCls);
				});
				this.searchNodes = [];
			}
			if (Ext.isEmpty(startNode)) {
				startNode = this.getRootNode();
			}
			var hasFocus = false;

			var expandByPath = function(path) {
				if (Ext.isEmpty(path)) {
					return;
				}
				var keys = path.split(this.pathSeparator);
				var curNode = this.getRootNode();
				if (curNode.attributes["id"] != keys[1]) {
					return;
				}
				var index = 1;
				var f = function() {
					if (++index == keys.length)
						return;
					var c = curNode
							.findChild("id", keys[index]);
					if (!c)
						return;
					curNode = c;
					c.expand(false, false, f);
				};
				curNode.expand(false, false, f);
			};

			var fn = function(node) {
				var attrs = node.attributes, c, value, match, word, i, len;
				if (attrs) {
					var bl = true;
					for (i = 0, len = multi.length; i < len; i++) {
						var cbl = true;
						c = multi[i];
						value = Ext.value(attrs[c.attr
								|| 'text'], '');
						word = Ext.value(c.keyword, '');
						if (c.caseSensitive != false) {
							value = value.toLowerCase().trim();
							word = word.toLowerCase().trim();
						}
						if (value.length == 0 || word.length == 0) {
							cbl = false;
						}
						match = c.match || 'ignore';
						// 完全模糊方式
						if (match == 'ignore' && value.indexOf(word) == -1) {
							cbl = false;
						}
						// 只匹配前面
						else if (match == 'start' && value.indexOf(word) != 0) {
							cbl = false;
						}
						// 匹配结束
						else if (match == 'end' && 
								value.lastIndexOf(word) != (value.length
										- word.length - 1)) {
							cbl = false;
						}
						// 完全匹配
						else if (match == 'all' && value != word) {
							cbl = false;
						}
						if (either && cbl) {
							bl = true;
							break;
						} else if (either && !cbl) {
							bl = false;
						} else if (!either && !cbl) {
							bl = false;
							break;
						}
					}
					if (bl) {
						this.searchNodes.push(node);
						var p = node.parentNode;
						var b = [node.attributes["id"]];
						while (p) {
							b.unshift(p.attributes["id"]);
							p = p.parentNode;
						}
						var path = this.pathSeparator + b.join(this.pathSeparator);
						expandByPath.call(this, path);
					}
				}
			};
			startNode.cascade(fn, this);

			if (focus || focusCls) {
				Ext.defer(function() {
					Ext.each(this.searchNodes, function(node) {
						if (focus && !hasFocus) {
							node.getUI().focus();
							hasFocus = true;
						}
						if (focusCls) {
							node.getUI().addClass(focusCls);
						}
					}, this);
					if (callback) {
						Ext.callback(callback, scope || this, [this.searchNodes]);
					}
				}, 50, this);
			} else if (callback) {
				Ext.callback(callback, scope || this, [this.searchNodes]);
			}
			this.lastIndex = 0;
			this.lastFocusCls = focusCls;
			return this.searchNodes;
		}
	},
	removeNode : function(node) {
		if (typeof node == 'string')
			node = this.getNodeById(node);
		if (Ext.isObject(node) && node.parentNode) {
			node.parentNode.removeChild(node);
		}
		return node;
	},
	toggleNodeDisabled : function(node, disabled, cascade) {
		if (typeof node == 'string')
			node = this.getNodeById(node);
		if (Ext.isObject(node)) {
			var setDisabeld = function(node, disabled) {
				if (disabled == true)
					node.disable();
				else if (disabled == false)
					node.enable();
				else
					node.disabled ? node.enable() : node
							.disable();
			};
			if (cascade == true) {
				node.cascade(function(n) {
					setDisabeld(n, disabled);
				});
			} else {
				setDisabeld(node, disabled);
			}
		}
		return node;
	},
	getChecked : function(a, startNode) {
		startNode = startNode || this.root;
		var r = [], checkedAttr = this.loader.checked || this.loader.checkedParam;
		var f = function() {
			if (this.attributes[checkedAttr]) {
				r.push(!a ? this : (a == 'id' ? this.id : this.attributes[a]));
			}
		};
		startNode.cascade(f);
		return r;
	},
	setUrl : function(url) {
		if (this.loader) {
			this.loader.setUrl.apply(this.loader, [url]);
		}
	},
	clearRequestParams : function() {
		if (this.loader) {
			this.loader.clearRequestParams.apply(this.loader, arguments);
		}
	},
	setRequestParams : function(params) {
		if (this.loader) {
			this.loader.setRequestParams.apply(this.loader, [params]);
		}
	},
	getRequestParams : function() {
		if (this.loader) {
			return this.loader.getRequestParams();
		}
		return {};
	},
	reload : function() {
		if (arguments.length == 3) {
			var node = arguments[0], callback = arguments[2], scope = arguments[1];
		} else if (arguments.length == 1) {
			var arg = arguments[0];
			if (arg instanceof Ext.tree.TreeNode) {
				var node = arg;
			} else if (Ext.isObject(arg)) {
				var node = arg.node, callback = arg.callback, scope = arg.scope;
			} else {
				return;
			}
		}
		if (this.loader) {
			this.loader.reload((node ? node : this.getRootNode()), callback, scope);
		}
	}
});


if (Ext.LOCALE == 'zh_CN' || Ext.LOCALE == 'zh_TW') {
	Ext.override(Ext.form.DateField,{
		format : 'Y/m/d',
		altFormats : 'Y/m/d|Y/n/j|Y/n/d|Y/m/j|Y-m-d|Y-n-d|Y-n-j|y-m-j|y/m/d|y/n/j|y/n/d|y/m/j|y-m-d|y-n-d|y-n-j|y-m-j'
		//altFormats : 'Y/m/d|Y/n/j|y/n/j|y/m/j|y/n/d|Y/m/j|Y/n/d|y-m-d|Y-m-d|m/d|m-d|md|n-j|nj|Ynj|ynj|Ymd|ymd|d|Y-m-d|n-j|n/j'
	});
} else {
	Ext.override(Ext.form.DateField,{
		format : 'm/d/Y',
		altFormats : 'm/d/Y|n/j/Y|n/d/Y|m/j/Y|m-d-Y|n-d-Y|n-j-Y|m-j-y|m/d/y|n/j/y|n/d/y|m/j/y|m-d-y|n-d-y|n-j-y|m-j-y'
		//altFormats : 'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|n-j|nj|njY|njy|md|mdy|mdY|d|Y-m-d|n-j|n/j'
	});
}
Ext.override(Ext.form.DateField, {
	
	// private
	i18n : function(format) {
		for (re in this.errorFormat) {
			format = format.replace(re, this.errorFormat[re]);
		}
		return format;
	},
	onTriggerClick: function(){
		if(this.disabled || this.readOnly){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.DateMenu({
                hideOnClick: false,
                focusOnSelect: false
            });
        }
        this.onFocus();
        Ext.apply(this.menu.picker,  {
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.disabledDatesRE,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            showToday : this.showToday,
            startDay: this.startDay,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.picker.setValue(this.getValue() || new Date());
        this.menu.show(this.el, "tl-bl?");
        this.menuEvents('on');
	},
	getErrors : function(value) {
		var errors = Ext.form.DateField.superclass.getErrors.apply(this, arguments);

		value = this.formatDate(value || this.processValue(this.getRawValue()));
		if (value.length < 1) {
			return errors;
		}
		var svalue = value;
		value = this.parseDate(value);
		if (!value) {
			errors.push(String.format(this.invalidText, svalue, this.i18n(this.format)));
			return errors;
		}
		var time = value.getTime();
		if (this.minValue && time < this.minValue.clearTime().getTime()) {
			errors.push(String.format(this.minText, this.formatDate(this.minValue)));
		}
		if (this.maxValue && time > this.maxValue.clearTime().getTime()) {
			errors.push(String.format(this.maxText, this.formatDate(this.maxValue)));
		}
		if (this.disabledDays) {
			var day = value.getDay();
			for ( var i = 0; i < this.disabledDays.length; i++) {
				if (day === this.disabledDays[i]) {
					errors.push(this.disabledDaysText);
					break;
				}
			}
		}
		var fvalue = this.formatDate(value);
		if (this.disabledDatesRE && this.disabledDatesRE.test(fvalue)) {
			errors.push(String.format(this.disabledDatesText, fvalue));
		}
		return errors;
	}
});


Ext.override(Ext.Panel, {
	stateful : false
});

Ext.override(Ext.grid.GridPanel, {
	
	loadMask : true,
	
	stateful : true,
	
	monitorResize: true,
	
	lock: function(){
		this.lockToken = true;
		if (this.loadMask instanceof Ext.LoadMask) this.loadMask.show();
	},
	
	unlock: function(){
		this.lockToken = false;
		if (this.loadMask instanceof Ext.LoadMask) this.loadMask.hide();
	},
	
	isLock: function(){
		return this.lockToken == true;
	},
	
	setTimeout : function(timeout) {
		if (this.store && this.store.proxy) {
			this.store.proxy.timeout = timeout;
		}
	},
	doLayout : function() {
		Ext.grid.GridPanel.superclass.doLayout.call(this,arguments);
		if (this.fit)
			this.fitContainer.defer(100, this);
		if (this.forceFit)
			this.view.fitColumns(false, false);
	},
	fitContainer : function() {
		var vs = Ext.getBody().getViewSize(false);
		var h = vs.height - this.el.getTop();
		var w = ((Ext.isIE6 || Ext.isIE7) ? (vs.width - this.el.getLeft()) : vs.width);
		Ext.apply(vs, {
			width : w,
			height : h
		});
		// TODO
		var htmlTag = document.getElementsByTagName('html')[0];
		if (htmlTag) {
			Ext.fly(htmlTag).addClass('x-viewport');
		}
		this.container.setSize(vs);
		this.setSize(vs);
	},
	highlight : function(rows) {
		if (Ext.isArray(rows)) {
			Ext.each(rows, function(row) {
				Ext.fly(this.getView().getRow(row)).toggleClass('x-grid-highlight');
			}, this);
		} else {
			Ext.fly(this.getView().getRow(rows)).toggleClass('x-grid-highlight');
		}
	},
	toJSON : function(records) {
		if (records) {
			var arr = [];
			Ext.each(records, function(data) {
				arr.push(data.data);
			});
			return arr;
		}
		return this.getStore().toJSON();
	},
	getSelected : function() {
		return this.getSelectionModel().getSelections();
	},
	setUrl : function(url) {
		if (url && this.getStore()) {
			if (this.getStore().proxy && this.getStore().proxy.getConnection) {
				this.getStore().proxy.setUrl(url, true);
			}
		}
	},
	clearRequestParams : function() {
		if (this.getStore()) {
			this.getStore().clearRequestParams.apply(this.getStore(), arguments);
		}
	},
	setRequestParams : function(params) {
		if (this.getStore()) {
			this.getStore().setRequestParams(params);
		}
	},
    getRequestParams: function(){
    	if (this.getStore()) {
    		return this.getStore().getRequestParams();
    	}
    	return {};
    },
	load : function() {
		if (this.getStore()) {
			this.getStore().load(arguments);
		}
	},
	getArrayBySelected : function() {
		var rs = this.getSelected();
		var arr = [];
		var a = arguments;
		if (a.length > 1) {
			Ext.each(rs, function(r) {
				var json = {};
				for ( var i = 0; i < a.length; i++) {
					json[a[i]] = r.get(a[i]);
				}
				arr.push(json);
			});
		} else if (a.length == 1) {
			Ext.each(rs, function(r) {
				var json = {};
				arr.push(r.get(a[0]));
			});
		}
		return arr;
	}
	
});

Ext.override(Ext.grid.EditorGridPanel, {
	
	startEditing : function(row, col){
        this.stopEditing();
        if(this.colModel.isCellEditable(col, row)){
            this.view.ensureVisible(row, col, true);
            var r = this.store.getAt(row),
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
                var ed = this.colModel.getCellEditor(col, row);
                if(!ed){
                    return;
                }
                // 将record对象绑定在editor对象里，方便获取
                ed.record = r;
                if(!ed.rendered){
                    ed.parentEl = this.view.getEditorParent(ed);
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
        this.view.focusCell(ed.row, ed.col);
    }
});

Ext.override(Ext.grid.ColumnModel, {
	defaultSortable : true,
	setConfig : function(config, initial) {
		var i, c, len;
		if (!initial) {
			delete this.totalWidth;
			for (i = 0, len = this.config.length; i < len; i++) {
				c = this.config[i];
				if (c.setEditor) {
					c.setEditor(null);
				}
			}
		}
		this.defaults = Ext.apply({
			width : this.defaultWidth,
			sortable : this.defaultSortable
		}, this.defaults);
		this.config = [];
		this.lookup = {};

		var addColumn = function(column) {
			if (Ext.isArray(column.columns)) {
				Ext.each(column.columns, function(c) {
					addColumn.call(this, c);
				}, this);
			} else {
				c = Ext.applyIf(column, this.defaults);

				if (Ext.isEmpty(c.id)) {
					c.id = i;
				}

				if (!c.isColumn) {
					var Cls = Ext.grid.Column.types[c.xtype || 'gridcolumn'];
					c = new Cls(c);
					config[i] = c;
				}
				this.config.push(c);
				this.lookup[c.id] = c;
			}
		};
		for (i = 0, len = config.length; i < len; i++) {
			addColumn.call(this, config[i]);
		}
		if (!initial) {
			this.fireEvent('configchange', this);
		}
		this.applySortConfig();
	},
	applySortConfig : function() {
		var col, i, _cols = [], cols = [];
		for (i = 0; i < this.config.length; i++) {
			col = this.config[i];
			// REM 把隐藏列都放在数组后面
			if (col.hidden) {
				cols.push(col);
			} else {
				_cols.push(col);
			}
		}
		this.config = _cols.concat(cols);
	},
    setState : function(col, state) {
        state = Ext.applyIf(Ext.applyIf(state, {
      	  sortable: this.config[col].sortable
        }), this.defaults);
        Ext.apply(this.config[col], state);
    }
});


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
					iconCls: 'sofa-grid-col-top',
					scope: this,
					handler: this.toTop
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'sofa-grid-col-up',
					scope: this,
					handler: this.toUp
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'sofa-grid-col-from',
					scope: this,
					handler: function(){
						this.toList.selectRange(0, this.toList.store.getCount());
						this.toFrom();
					}
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'sofa-grid-col-to',
					scope: this,
					handler: function(){
						this.fromList.selectRange(0, this.fromList.store.getCount());
						this.fromTo();
					}
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'sofa-grid-col-down',
					scope: this,
					handler: this.toDown
				}, {
					xtype: 'button',
					scale: 'small',
					iconCls: 'sofa-grid-col-bottom',
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

Ext.override(Ext.grid.GridView, {
	initData : function(newStore, newColModel) {
        var me = this;

        if (me.ds) {
            var oldStore = me.ds;
            
            oldStore.un('add', me.onAdd, me);
            oldStore.un('load', me.onLoad, me);
            oldStore.un('clear', me.onClear, me);
            oldStore.un('remove', me.onRemove, me);
            oldStore.un('update', me.onUpdate, me);
            oldStore.un('datachanged', me.onDataChange, me);
            
            if (oldStore !== newStore && oldStore.autoDestroy) {
                oldStore.destroy();
            }
        }

        if (newStore) {
            newStore.on({
                scope      : me,
                load       : me.onLoad,
                add        : me.onAdd,
                remove     : me.onRemove,
                update     : me.onUpdate,
                clear      : me.onClear,
                datachanged: me.onDataChange
            });
        }
        
        if (me.cm) {
            var oldColModel = me.cm;
            
            oldColModel.un('configchange', me.onColConfigChange, me);
            oldColModel.un('widthchange',  me.onColWidthChange, me);
            oldColModel.un('headerchange', me.onHeaderChange, me);
            oldColModel.un('hiddenchange', me.onHiddenChange, me);
            oldColModel.un('columnmoved',  me.onColumnMove, me);
        }
        
        if (newColModel) {
            delete me.lastViewWidth;
            
            newColModel.on({
                scope       : me,
                configchange: me.onColConfigChange,
                widthchange : me.onColWidthChange,
                headerchange: me.onHeaderChange,
                hiddenchange: me.onHiddenChange,
                columnmoved : me.onColumnMove
            });
        }
        
        me.ds = newStore;
        me.cm = newColModel;
    },
	// 新增功能按列id，自动调整列宽
	adjustColumnWidth: function(colId) {

		var me 			= this,
			colModel	= me.grid.getColumnModel(),
			colIndex	= colModel.getIndexById(colId),
			isLocked	= (colModel.isLocked ? colModel.isLocked(colIndex) : false),
			rows        = ((isLocked && me.getLockedRows) ? 
							me.getLockedRows() : me.getRows()),
			maxWidth 	= colModel.getColumnWidth(colIndex) || 100,
			rowsCount   = rows.length,
			textMetrics, colWidth;

		for (var i = 0; i < rowsCount; i++) {
			var row = rows[i];
			var firstChild = row.firstChild;
	        if (firstChild && firstChild.rows[0] && firstChild.rows[0].childNodes[colIndex]) {
	        	firstChild = firstChild.rows[0].childNodes[colIndex].firstChild;
				textMetrics = Ext.util.TextMetrics.createInstance(firstChild);
				colWidth = textMetrics.getWidth(firstChild.innerHTML) + 10;
	        	if (colWidth > maxWidth) {
	        		maxWidth = colWidth; 
	        	}
			}
		}
		
		colModel.setColumnWidth(colIndex, maxWidth, true);
		
	    this.updateColumnWidth(colIndex, maxWidth);
	},
		
	afterRenderUI: function() {
        var grid = this.grid;
        
        this.initElements();

        
        Ext.fly(this.innerHd).on('click', this.handleHdDown, this);

        this.mainHd.on({
            scope    : this,
            mouseover: this.handleHdOver,
            mouseout : this.handleHdOut,
            mousemove: this.handleHdMove
        });

        this.scroller.on('scroll', this.syncScroll,  this);
        
        if (grid.enableColumnResize !== false) {
            this.splitZone = new Ext.grid.GridView.SplitDragZone(grid, this.mainHd.dom);
        }

        if (grid.enableColumnMove) {
            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(grid, this.innerHd);
            this.columnDrop = new Ext.grid.HeaderDropZone(grid, this.mainHd.dom);
        }

        if (grid.enableHdMenu !== false) {
            this.hmenu = new Ext.menu.Menu({id: grid.id + '-hctx'});
            this.hmenu.add(
                {itemId:'asc',  text: this.sortAscText,  cls: 'xg-hmenu-sort-asc'},
                {itemId:'desc', text: this.sortDescText, cls: 'xg-hmenu-sort-desc'}
            );

            if (grid.enableColumnHide !== false) {
            	/* *
                	注释内容为菜单形式来控制列显示
                 this.colMenu = new Ext.menu.Menu({id:grid.id + '-hcols-menu'});
                 
                 this.colMenu.on({
                    scope     : this,
                    beforeshow: this.beforeColMenuShow,
                    itemclick : this.handleHdMenuClick
                });
                */
                this.hmenu.add('-', {
                    itemId:'columns',
                    hideOnClick: false,
                    text: this.columnsText,
                    menu: this.colMenu,
                    iconCls: 'x-cols-icon'
                });
            }

            this.hmenu.on('itemclick', this.handleHdMenuClick, this);
        }

        if (grid.trackMouseOver) {
            this.mainBody.on({
                scope    : this,
                mouseover: this.onRowOver,
                mouseout : this.onRowOut
            });
        }

        if (grid.enableDragDrop || grid.enableDrag) {
            this.dragZone = new Ext.grid.GridDragZone(grid, {
                ddGroup : grid.ddGroup || 'GridDD'
            });
        }

        this.updateHeaderSortState();
    },
    
    /**
     * 增加多字段排序功能
     */
    updateHeaderSortState : function() {
        var state = this.ds.getSortState();

        if (!state) {
            return;
        }

        if (!this.sortState || (this.sortState.field != state.field || this.sortState.direction != state.direction)) {
            this.grid.fireEvent('sortchange', this.grid, state);
        }

        this.sortState = state;

        var update = function(state){
        	
        	var sortColumn = this.cm.findColumnIndex(state.field);
            if (sortColumn != -1) {
                var sortDir = state.direction;
                this.updateSortIcon(sortColumn, sortDir);
            }
        };
        
        if (Ext.isArray(this.sortState)) {
        	Ext.each(this.sortState, update, this);
        } else {
        	update.call(this, this.sortState);
        }

    },
    
    updateSortIcon : function(col, dir) {
        var sortClasses = this.sortClasses,
            sortClass   = sortClasses[dir == "DESC" ? 1 : 0],
            headers     = this.mainHd.select('td');//.removeClass(sortClasses);

        headers.item(col).addClass(sortClass);
    },
    
	loadColumnData: function(){

		var colModel = this.cm,
			colCount = colModel.getColumnCount(),
			column, data1 = [], data2 = [];

        for (var i = 0; i < colCount; i++) {
        	column = colModel.config[i];
            if (column.hideable !== false) {
            	if (column.hidden) {
            		data1.push([column.id, column.header]);
            	} else {
            		data2.push([column.id, column.header]);
            	}
            }
        }

        this.colSelector.loadFrom(data1);

        this.colSelector.loadTo(data2);

	},
	
	// 12-10-9 修正 宽度总和没有加入边框宽度
	getTotalWidth : function() {
		
		var totalWidth = this.cm.getTotalWidth(),
			colCount  = this.cm.getColumnCount(true),
			borderWidth = this.borderWidth;
        
        if (Ext.isNumber(totalWidth)) {
            if (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2)) {
                return (totalWidth + (colCount * borderWidth) - 1) + "px";
            } else {
                return Math.max(totalWidth, 0) + "px";
            }
        } else {
            return totalWidth;
        }
    },
	
	refreshRow: function(record) {
		
        var store     = this.ds,
            colCount  = this.cm.getColumnCount(true),
            columns   = this.getColumnData(),
            last      = colCount - 1,
            cls       = ['x-grid3-row'],
            rowParams = {
                tstyle: String.format("width: {0};", this.getTotalWidth())
            },
            colBuffer = [],
            cellTpl   = this.templates.cell,
            rowIndex, row, column, meta, css, i;
        if (Ext.isNumber(record)) {
            rowIndex = record;
            record   = store.getAt(rowIndex);
        } else {
            rowIndex = store.indexOf(record);
        }	        
        if (!record || rowIndex < 0) {
            return;
        }
        for (i = 0; i < colCount; i++) {
            column = columns[i];
            if (i == 0) {
                css = 'x-grid3-cell-first';
            } else {
                css = (i == last) ? 'x-grid3-cell-last ' : '';
            }
            meta = {
                id      : column.id,
                style   : column.style,
                css     : css,
                attr    : "",
                cellAttr: ""
            };
            meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, rowIndex, i, store);
            if (Ext.isEmpty(meta.value)) {
                meta.value = '&#160;';
            }
            if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
                meta.css += ' x-grid3-dirty-cell';
            }
            colBuffer[i] = cellTpl.apply(meta);
        }
        row = this.getRow(rowIndex);
        row.className = '';
        if (this.grid.stripeRows && ((rowIndex + 1) % 2 === 0)) {
            cls.push('x-grid3-row-alt');
        }
        if (this.getRowClass) {
            rowParams.cols = colCount;
            cls.push(this.getRowClass(record, rowIndex, rowParams, store));
        }
        this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
        rowParams.cells = colBuffer.join("");
        row.innerHTML = this.templates.rowInner.apply(rowParams);
        this.fireEvent('rowupdated', this, rowIndex, record);
        
    },
    
	updateAllColumnWidths : function() {
		
        var totalWidth = this.getTotalWidth(),
            colCount   = this.cm.getColumnCount(true),
            rows       = this.getRows(),
            rowCount   = rows.length,
            widths     = [],
            row, rowFirstChild, trow, i, j;
        
        for (i = 0; i < colCount; i++) {
            widths[i] = this.getColumnWidth(i);
            this.getHeaderCell(i).style.width = widths[i];
        }
        
        this.updateHeaderWidth();
        
        for (i = 0; i < rowCount; i++) {
            row = rows[i];
            row.style.width = totalWidth;
            rowFirstChild = row.firstChild;
            
            if (rowFirstChild) {
                rowFirstChild.style.width = totalWidth;
                trow = rowFirstChild.rows[0];
                
                for (j = 0; j < colCount; j++) {
                    trow.childNodes[j].style.width = widths[j];
                }
            }
        }
        
        this.onAllColumnWidthsUpdated(widths, totalWidth);
        
    },
    
    initColumnSetting: function(){
		var me = this;

        this.colBox = new Ext.form.Checkbox({
			height: 25,
    		border: false,
    		region: 'south',
			layout: 'hbox',
			margins: '1 20 1 20',
        	boxLabel: this.colCheckboxLabel,
        	checked: true,
        	value: true
        });

		this.colSelector = new Ext.ItemSelector({

			border: false,

			region: 'center',

			fromTitle: this.colFromTitle,

			toTitle: this.colToTitle,

			listeners: {

				validItem: function(alt){

					if (this.toList.store.getCount() == 1) {
						if (alt == true){
							Ext.MessageBox.show({
								title: me.colAltTitle, 
								msg: me.colAltMsg,
								icon: Ext.MessageBox.ERROR,
								buttons: Ext.MessageBox.OK
							});
						}
			        	return false;
			        }
					return true;
				}

			}

		});

		this.grid.on('resize', this.colWinResize, this);
        
        this.colWin = new Ext.Window({
        	modal: true,
        	width: 500,
        	minWidth: 500,
        	height: 300,
        	minHeight: 300,
        	layout: 'fit',
        	cls: 'sofa-grid-column-setting',
        	closeAction: 'hide',
        	buttonAlign: 'center',
        	title: this.colWinTitle,
        	constrain: true,
        	items: [{
        		xtype: 'container',
        		layout: 'border',
        		items: [this.colSelector, this.colBox]
        	}],
        	buttons: [{
        		type: 'submit',
        		text: Ext.MessageBox.buttonText.ok,
        		scope: this,
        		handler: function(){
        			this.colWin.hide();
        			this.saveColumnSetting();
        		}
        	}, {
        		type: 'button',
        		text: Ext.MessageBox.buttonText.cancel,
        		scope: this,
        		handler: function(){
        			this.colWin.hide();
        		}
        	}],
        	listeners: {

        		scope: this,

        		resize: this.colWinResize
        	}
        });
	},
	
	colWinResize: function(w, h){

		this.colSelector.onResize(w, h);

	},
	
	saveColumnSetting: function(){

		// 处理隐藏的列
		var config = this.cm.config;
		this.cm.totalWidth = null;

		var rs = this.colSelector.fromList.store.getRange();

		var i, j, k, len, id, col, hd = {};
		for (i = 0; i < rs.length; i++) {
			id = rs[i].data['value'];
			hd[id] = id;
		}
		for (j = 0, len = config.length; j < len; j++) {
	        col = config[j];
	        if (col && col.hideable !== false) {
	        	col.hidden = false;
				if (hd[col.id]) {
		        	col.hidden = true;
		        }
	        }
	    }

		// 处理显示列的顺序
		rs = this.colSelector.toList.store.getRange();

		for (i = 0; i < rs.length; i++) {
			id = rs[i].data['value'];
			k = 0;
			for (j = 0, len = config.length; j < len; j++) {
		        col = config[j];
		        if (col) {
		        	if (col.hidden || col.hideable == false) {
		        		k++;
		        	} else if (col.id == id && (i + k) !== j) {
			            config.splice(j, 1);
			            config.splice(i + k, 0, col);
			        }
		        }
		    }
		}
		this.refresh(true);
		if (this.colBox.el.dom.checked) {
			this.grid.saveState();
		} else {
			this.grid.clearState();
		}
	},
	
	/**
	 * 增加了多字段排序功能
	 * @param item
	 * @returns {Boolean}
	 */
	getMultiSortState: function(field, dir){
		var sortInfo  =  dir ? {field:field, direction:dir} : {field:field},
    		state	  =  this.ds.getSortState(),
    		constains =  false;

	    if (Ext.isArray(state)) {
	    	Ext.each(state, function(sc){
	    		if (sc.field == field) {
	    			if (dir) {
	    				sc.direction = dir;
	    			} else if (sc.direction) {
		    			sc.direction = sc.direction.toggle("ASC", "DESC");
					}
	    			constains = true;
	    		}
	    	});
	    	if (!constains) {
	        	state = [sortInfo].concat(state);
	    	}
	    } else {
	    	state = [sortInfo];
	    }
	    return state;
	},
	onHeaderClick : function(g, index) {
        if (this.headersDisabled || !this.cm.isSortable(index)) {
            return;
        }
        g.stopEditing(true);
        var dataIndex = this.cm.getDataIndex(index);
        g.store.sort(this.getMultiSortState(dataIndex));
    },
	handleHdMenuClick : function(item) {
        var store     =  this.ds,
            dataIndex =  this.cm.getDataIndex(this.hdCtxIndex);
        
        switch (item.getItemId()) {
            case 'asc':
                store.sort(this.getMultiSortState(dataIndex, "ASC"));
                break;
            case 'desc':
                store.sort(this.getMultiSortState(dataIndex, "DESC"));
                break;
            case 'columns':
            	this.columnMenuClick(item);
            	break;
            default:
                this.handleHdMenuClickDefault(item);
        }
        return true;
    },
    
    columnMenuClick: function(item) {
    	
    	if (!this.colWin && this.grid.enableColumnHide !== false) {

            // REM 增加列窗体
            this.initColumnSetting();

    	}
    	
    	this.colWin.show();
    	
    	this.loadColumnData();
    	
    	this.hmenu.hide();
    	
    },
    
	renderHeaders: function() {
        var colModel   = this.cm,
            templates  = this.templates,
            headerTpl  = templates.hcell,
            properties = {},
            colCount   = colModel.getColumnCount(),
            last       = colCount - 1,
            cells      = [],
            i, cssCls, header;
        for (i = 0; i < colCount; i++) {
            if (i == 0) {
                cssCls = 'x-grid3-cell-first ';
            } else {
                cssCls = i == last ? 'x-grid3-cell-last ' : '';
            }
            header = colModel.getColumnHeader(i);
            properties = {
                id     : colModel.getColumnId(i),
                value  : header || '',
                style  : this.getColumnStyle(i, true),
                css    : cssCls,
                attr   : 'title="'+ Ext.util.Format.stripTags(header) +'"',
                tooltip: this.getColumnTooltip(i)
            };
            if (colModel.config[i].align == 'right') {
                properties.istyle = 'padding-right: 16px;';
            } else {
                delete properties.istyle;
            }
            cells.push(headerTpl.apply(properties));
        }
        return templates.header.apply({
            cells : cells.join(""),
            tstyle: String.format("width: {0};", this.getTotalWidth())
        });
    },
    
	getColumnStyle: function(colIndex, isHeader) {
        var colModel  = this.cm,
            colConfig = colModel.config,
            style     = isHeader ? '' : colConfig[colIndex].css || '',
            align     = colConfig[colIndex].align;
        style += String.format("width: {0};", this.getColumnWidth(colIndex));
        if (colModel.isHidden(colIndex)) {
            style += 'display: none; ';
        }
    	// 修改header字体默认居中显示
        if (isHeader) {
        	align = 'center';
        }
        if (align) {
            style += String.format("text-align: {0};", align);
        }
        return style;
    },
    
    getColumnData : function() {
        var columns  = [],
            colModel = this.cm,
            colCount = colModel.getColumnCount(),
            fields   = this.ds.fields,
            i, name;
        
        for (i = 0; i < colCount; i++) {
        	
            name = colModel.getDataIndex(i);
            
            columns.push({
                name    : Ext.isDefined(name) ? name : (fields.get(i) ? fields.get(i).name : undefined),
                renderer: colModel.getRenderer(i),
                scope   : colModel.getRendererScope(i),
                id      : colModel.getColumnId(i),
                style   : this.getColumnStyle(i)
            });
        }
        
        return columns;
    },
    
    isRefreshBlock: function(){
    	return this.blockRefresh == true;
    },
    
    renderBody : function(){
    	if (this.isRefreshBlock()) {
    		var markup = '&#160;';
    	} else {
    		var markup = this.renderRows() || '&#160;';
    	}
        return this.templates.body.apply({rows: markup});
    },
    
    onDataChange : function(){
        this.refresh(true);
        this.updateHeaderSortState();
        if (!this.isRefreshBlock()) {
            this.syncFocusEl(0);
        }
    },
    
    processRows : function(startRow, skipStripe) {
        if (!this.ds || this.ds.getCount() < 1 || this.isRefreshBlock()) {
            return;
        }

        var rows   = this.getRows(),
            length = rows.length,
            row, i;

        skipStripe = skipStripe || !this.grid.stripeRows;
        startRow   = startRow   || 0;

        for (i = 0; i < length; i++) {
            row = rows[i];
            if (row) {
                row.rowIndex = i;
                if (!skipStripe) {
                    row.className = row.className.replace(this.rowClsRe, ' ');
                    if ((i + 1) % 2 === 0){
                        row.className += ' x-grid3-row-alt';
                    }
                }
            }
        }

        
        if (startRow === 0) {
            Ext.fly(rows[0]).addClass(this.firstRowCls);
        }

        Ext.fly(rows[length - 1]).addClass(this.lastRowCls);
    }
    
});

/******************************************************************
 @chapter 增加reload方法
 	以提供在sofa.ListView控件里reload方法的统一调用
 *****************************************************************/
Ext.override(Ext.DataView, {
	
	reload: function(args){
		this.store.load(args);
	}

});
