function HomePage() {
//private-------------------------------------------------------------------------------------------
	//设置打开节点的URL，带上当前位置的信息
	var getURL=function(node, url) {
		var _appFunctionId = "";
		if (node.attributes.appFuncId) {
			_appFunctionId = node.attributes.appFuncId;
		}
		var _location = "";
		var arr = [];
		if (node && url) {
			var n = node;
			while (n && (n.attributes.id != "-1")) {
				if (n && n.attributes.text) {
					arr.push(n.attributes.text);
				}
				n = n.parentNode;
			}
			arr.push(HomePage.prototype.currentApp.name);
			_location = Ext.urlEncode({
				_location: arr.reverse().join()
			});
		}

		if (url) {
			url = consts.contextPath + url;
			if (url.indexOf("?") == -1) {
				url += "?";
			} else {
				url += "&";
			}
			url += "_appFunctionId=" + _appFunctionId;
			url += "&";
			url += _location;
		}
		return url;
	}
	//设置当前app,app工具栏按钮事件调用
	//todo:消息中心也可能调用
	var setCurrentApp = function(appid) {
		var result, data = consts.menuData;
		for (var i = 0, l = data.length; i < l; i++) {
			var d = data[i];
			if (d.id == appid) {
				result = d;
				break;
			}
		}
		HomePage.prototype.currentApp = result;
	};
	//创建主页主区域左侧,目前只有功能导航树,后续可能还有其他,return left_items
	//todo:功能导航树是否需要异步加载
	var createAppLeft = function(appdata) {
		var appid=appdata.id;
		var iscustom=false;
		var result = {
			appid: appid,
			id: 'app-left-panel-' + appid,
			collapseMode: 'mini',
			collapsible: true,
			animCollapse:false,
			title: '功能导航树',
			layout: 'fit',
			region: 'west',
			split: true,
			border: false,
			width: 240,
			tools: [{
				id: 'gear',
				handler: function(sender) {
					var menu = Ext.getCmp('function-tree-header-menu');
					if (menu) {
						menu.show(this, 'bl');
					}
				}
			}],
			items: {
				appid: appid,
				iscustom:iscustom,
				id: 'app-functions-tree-' + appid,
				xtype: 'treepanel',
				useArrows: true,
				enableDD: true,
				rootVisible: true,
				autoScroll: true,
				border: false,
				loader: new Ext.tree.TreeLoader({
					dataUrl: consts.contextPath + 'system/menu!list.action?portalid=' + appid,
					listeners: {
						beforeload: function(tree, node) {
							//console.log('/appFunc.ctrl?includeCostomFunc=true&action=getAppFuncTree&appId=' + appid + '&isCustomApp=' + appdata.isCustsom + '&allowDrag=false');
							if (node && node.attributes.isCustom) {
								return false;
							}
						}
					}
				}),
				root: new Ext.tree.AsyncTreeNode({
					id: '-1',
					text: appdata.funcname,
					expanded: false,
					leaf: false
				}),
				listeners: {
					click: function(node, e) {
						HomePage.prototype.openFunction(node);
					},
					nodedragover:function(e){
						if(!e.target.attributes.isCustom){
							return false;
						}
						if((e.target.attributes.id=='custom-functions-root')&&(e.point!='append')){
							return false;
						}
					},
					beforenodedrop:function(e){
						var dropNode = e.dropNode;
						var targetNode=e.target;
						if(!nodeUtil.isSameTree(targetNode,dropNode)){
							e.dropNode = nodeUtil.copyDropNode(e.tree.appid,dropNode);
							if(e.point!="append"){
						  	    //targetNode.parentNode.appendChild(e.dropNode)
						  	    nodeUtil.addAppFunc(targetNode.parentNode, e.dropNode);
						  	}else{
						  		//targetNode.appendChild(e.dropNode)
						  		nodeUtil.addAppFunc(targetNode, e.dropNode);
						  	}
						}
					},
					movenode:function (tree,node,oldParent,newParent,index ) {
						nodeUtil.moveAppFunc(tree,node,oldParent,newParent,index);
					},
					contextmenu: function(node,e){
						if(node && node.attributes.isCustom){
							node.select();
							e.preventDefault();
							var c = Ext.getCmp('function-tree-context-menu');
							c.contextNode = node;
							c.showAt(e.getXY());
						}
					}
				}
			}
		}
		return result;
	}
	//创建主操作区标签页,默认只有欢迎tab,其他功能tab动态创建,return tabpanel
	//todo:标签页的title是否需要限制宽度,是否需要显示tooltip,是否需要背景色,还没有添加plugin和右键菜单
	var createAppTab = function(appdata) {
		var src = consts.pagePath + 'funcIndex.jsp?' + Ext.urlEncode({
			funcname: appdata.funcname,
			description: appdata.description
		});
		var welcome={
			appid:appdata.id,
			functionid: 'index',
			id: 'app-tab-' + appdata.id + '-' + 'index',
			title: '欢迎',
			closable: false,
			html: '<iframe src="' + src + '" width="100%" height="100%" scrolling="no" frameborder="no" border="0"></iframe>'
		}
		var result = {
			appid: appdata.id,
			id: 'app-tabs-' + appdata.id,
			xtype: 'tabpanel',
			border: false,
			enableTabScroll : true,
			activeTab: 0,
			region: 'center',
	        plugins: [new Ext.ux.TabCloseMenu(),new Ext.ux.TabScrollerMenu({
				maxText  : 15,
				pageSize : 5
				})
			 ],
			getTemplateArgs: function(item) {
				var result = Ext.TabPanel.prototype.getTemplateArgs.call(this, item);
				return Ext.apply(result, {
					closable: item.closable,
					fid: item.functionid,
					aid: item.appid,
					resizeStyle: HomePage.prototype.isMax?'background-position: 0 -45px;':'background-position: 0 -30px;'
				});
			},
			itemTpl: new Ext.XTemplate(
					'<li class="{cls}" id="{id}">', 
					'<tpl if="closable">', 
					'<a appid="{aid}" functionid="{fid}" id="a-{aid}-{fid}-close" class="x-tab-strip-close"></a>', 
					'<a appid="{aid}" functionid="{fid}" id="a-{aid}-{fid}-refresh" class="x-tab-strip-refresh" onclick="HomePage.prototype.onTabRefresh(this)"></a>', 
					'<a appid="{aid}" functionid="{fid}" id="a-{aid}-{fid}-resize" class="x-tab-strip-resize" style="{resizeStyle}" onclick="HomePage.prototype.onTabResize(this)"></a>', 
					'</tpl>', 
					'<a class="x-tab-right" href="#">', 
					'<em class="x-tab-left">', 
					'<span class="x-tab-strip-inner"><span style="margin-right:40px" class="x-tab-strip-text {iconCls}">{text}</span></span>', 
					'</em></a></li>'),
			items: [welcome],
			listeners: {
				add: function(sender, item, index) {
					if (item.functionid != 'index') {
						var appid = HomePage.prototype.currentApp.id;
						sender.remove(welcome.id);
					}
				},
				beforeremove:function(tabs,tab){
					if(portal.tabs[tab.id]){
						Ext.MessageBox.alert('提示','事务未结束，不允许关闭！');
						return false;
					}
				},
				remove: function(sender, item) {
					var temp=HomePage.prototype.openedTabs;
					for(var i=0,l=temp.length;i<l;i++){
						var tab=temp[i];
						if((tab.appid==item.appid)&&(tab.functionid==item.functionid)){
							temp.splice(i, 1);
							break;
						}
					}
					HomePage.prototype.openedTabs=temp;
					if (sender.items.length <= 0) {
						var appid = HomePage.prototype.currentApp.id;
						sender.add(welcome).show();
					}
				}
			}
		}
		return result;
	}
//public--------------------------------------------------------------------------------------------
	//当前app
	HomePage.prototype.currentApp = {};
	//操作区是否最大化
	HomePage.prototype.isMax=false;
	//已经打开的标签页
	HomePage.prototype.openedTabs=[];
	//显示/隐藏Logo
	HomePage.prototype.showLogo=function(isshow) {
		if(isshow){
			//Ext.DomHelper.applyStyles('message-mini-box',{display:''});
			Ext.getCmp('page-hander').getLayout().setActiveItem('page-header-max');
			Ext.getCmp('page-hander').setHeight(83,false);
			Ext.getCmp('page-footer').setHeight(20,false);
			Ext.getCmp('main-view').doLayout(false, true);
		} else {
			//Ext.DomHelper.applyStyles('message-mini-box','display:none;');
			Ext.getCmp('page-hander').getLayout().setActiveItem('page-header-min');
			Ext.getCmp('page-hander').setHeight(20,false);
			Ext.getCmp('page-footer').setHeight(4,false);
			Ext.getCmp('main-view').doLayout(false, true);
		}
	}
	//创建app工具栏按钮,return app_button_items
	HomePage.prototype.createAppButtons = function() {
		var data = consts.menuData;
			result = [];
		for (var i = 0, l = data.length; i < l; i++) {
			var d = data[i];
			result.push({
				appid: d.id,
				id: 'app-toolbar-item-' + d.id,
				text: '<span style="font-weight:bold;">&nbsp;&nbsp;' + d.funcname + '&nbsp;&nbsp;</span>',
				enableToggle: true,
				toggleGroup: 'app-toolbar-items',
				pressed: false,
				toggleHandler: function(sender, pressed) {
					if (pressed) {
						setCurrentApp(sender.appid);
						var card = Ext.getCmp('page-center').getLayout();
						if (card.activeItem.appid != sender.appid) {
							card.setActiveItem('app-card-item-' + sender.appid);
							//自动展开功能树的根节点
							var tree=Ext.getCmp('app-functions-tree-'+sender.appid);
							if(tree){
								tree.root.expand(false,false);
							}
						}
					}
				}
			});
			result.push('-');
		}
		result[0].pressed = true;
		return result;
	}
	//创建app cards,return app_card_items
	HomePage.prototype.createAppCards = function() {
		var data = consts.menuData,
			result = [{
				appid: data[0].id,
				id: 'app-card-item-' + data[0].id,
				xtype: 'panel',
				border: false,
				bodyStyle: {
					background: '#ffffff',
					border: '0px'
				},
				//html: '<table  border="0" align="center"><tr><td  valign="top"><img src="resources/images/homepage/mainPage-left.jpg" id="portalImage" maxheight="467"/></td><td  valign="top"><img src="resources/images/homepage/mainPage-right.jpg" id="portalImage" maxheight="467"/></td></tr></table>'
				html: '<iframe src="' + consts.pagePath + 'funcIndex.jsp?funcname='+data[0].funcname+'&description='+data[0].description+'" width="100%" height="100%" scrolling="no" frameborder="no" border="0"></iframe>'
			}];
		for (var i = 1, l = data.length; i < l; i++) {
			var d = data[i];
			result.push({
				appid: d.id,
				id: 'app-card-item-' + d.id,
				border: false,
				layout: 'border',
				items: [createAppLeft(d), createAppTab(d)]
			});
		}
		return result;
	}
	//打开功能
	HomePage.prototype.openFunction = function(node) {
		if((!node.isLeaf())||(node.attributes.type=='1')){
			return;
		}
		if((!node.attributes.url)||(node.attributes.url=='null')||(node.attributes.url=='')){
			Ext.MessageBox.alert('提示','此功能无法打开');
			return;
		}
		var tabIsOpened=false;
		var tabs = Ext.getCmp('app-tabs-' + node.attributes.appId);
		tabs.items.each(function(item){
			if((item.appid==node.attributes.appId)&&(item.functionid==node.attributes.appFuncId)){
				tabIsOpened=item.id;
				return false;
			}
		});
		if(tabIsOpened){
			tabs.setActiveTab(tabIsOpened);
			return;
		}
		var src = getURL(node,node.attributes.url);
		//如果是跨域iframe，chrome会有错误，暂不启用，目前根本没有分布式部署
		//var src = 'pages/test.jsp?'+Ext.urlEncode({url:getURL(node,node.attributes.url)});
		var newTab = {
			appid:node.attributes.appId,
			functionid: node.attributes.appFuncId,
			id: 'app-tab-' + node.attributes.appId + '-' + node.attributes.appFuncId,
			title: node.attributes.text,
			//layout:'fit',
			closable: true,
			html:'<iframe id="iframe-'+node.attributes.appId+'-'+node.attributes.appFuncId+'" src="' + src/*node.attributes.url*/ + '" width="100%" height="100%" scrolling="no" frameborder="no" border="0"></iframe>',
			listeners: {
				activate: function(sender) {
					Ext.DomHelper.applyStyles('a-' + sender.appid + '-' + sender.functionid + '-close',{display:''});
					Ext.DomHelper.applyStyles('a-' + sender.appid + '-' + sender.functionid + '-refresh',{display:''});
					Ext.DomHelper.applyStyles('a-' + sender.appid + '-' + sender.functionid + '-resize',{display:''});
				},
				deactivate: function(sender) {
					alert(222);
					Ext.DomHelper.applyStyles('a-' + sender.appid + '-' + sender.functionid + '-close','display:none;');
					Ext.DomHelper.applyStyles('a-' + sender.appid + '-' + sender.functionid + '-refresh','display:none;');
					Ext.DomHelper.applyStyles('a-' + sender.appid + '-' + sender.functionid + '-resize','display:none;');
				},
				bodyresize:function(sender,w,h){
//					alert(w+'-'+h);
//					Ext.DomHelper.applyStyles('iframe-'+sender.appid + '-' + sender.functionid,{width:w+'px',height:h+'px'});
//					Ext.fly('iframe-'+sender.appid + '-' + sender.functionid).dom.width=w+'px';
//					Ext.fly('iframe-'+sender.appid + '-' + sender.functionid).dom.height=h+'px';
//					document.getElementById('iframe-'+sender.appid + '-' + sender.functionid).width=w+'px';
//					document.getElementById('iframe-'+sender.appid + '-' + sender.functionid).height=h+'px';
//					var f=document.getElementById('iframe-'+sender.appid + '-' + sender.functionid);
//					alert(f);
//					alert(f.contentWindow);
//					alert(f.contentWindow.resizeTo);
//					f.contentWindow.resizeTo(w,h);
//					sender.doLayout();
					
				},
				beforedestroy:function(sender){
					var f=Ext.fly('iframe-'+sender.appid+'-'+sender.functionid);
					try{
						f.dom.scr='about:blank';
						if(Ext.isIE6){//释放内存
							f.dom.contentWindow.document.write('');
						}
						f.dom.contentWindow.close();
					} catch (e) {
					}
				}
			}
		};
		tabs.add(newTab).show();
		HomePage.prototype.openedTabs.push({appid:node.attributes.appId,functionid:node.attributes.appFuncId});
	}
	//tab页最大化/还原
	HomePage.prototype.onTabResize = function(sender) {
		function changeAllTabsResizeImage(tabs,ismax){
			if(ismax){
				for(var i=0,l=tabs.length;i<l;i++){
					var id='a-'+tabs[i].appid+'-'+tabs[i].functionid+'-resize';
					Ext.DomHelper.applyStyles(id,'background-position: 0 -30px;');
				}
			} else {
				for(var i=0,l=tabs.length;i<l;i++){
					var id='a-'+tabs[i].appid+'-'+tabs[i].functionid+'-resize';
					Ext.DomHelper.applyStyles(id,'background-position: 0 -45px;');
				}
			}
		}
		if(HomePage.prototype.isMax){ //还原
			HomePage.prototype.isMax=false;
			//Ext.DomHelper.applyStyles('message-mini-box',{display:''});
			var appid=sender.getAttribute('appid');
			Ext.getCmp('app-left-panel-' + appid).expand(false);
			Ext.getCmp('page-hander').getLayout().setActiveItem('page-header-max');
			Ext.getCmp('page-hander').setHeight(83,false);
			Ext.getCmp('page-footer').setHeight(20,false);
			Ext.getCmp('main-view').doLayout(false, true);
			changeAllTabsResizeImage(HomePage.prototype.openedTabs,true);
		} else { //最大化
			HomePage.prototype.isMax=true;
			//Ext.DomHelper.applyStyles('message-mini-box','display:none;');
			var appid=sender.getAttribute('appid');
			Ext.getCmp('app-left-panel-' + appid).collapse(false);
			Ext.getCmp('page-hander').getLayout().setActiveItem('page-header-min');
			Ext.getCmp('page-hander').setHeight(20,false);
			Ext.getCmp('page-footer').setHeight(4,false);
			Ext.getCmp('main-view').doLayout(false, true);
			changeAllTabsResizeImage(HomePage.prototype.openedTabs,false);
		}
	}
	//tab页刷新
	HomePage.prototype.onTabRefresh = function(sender) {
		//alert(sender.id+','+sender.getAttribute('appid')+','+sender.getAttribute('functionid'));
		var f=Ext.fly('iframe-'+sender.getAttribute('appid')+'-'+sender.getAttribute('functionid'));
		//f.dom.contentWindow.location.reload();
	}
	//打开功能树
	HomePage.prototype.openFunctionsTree=function(){
		var tree={
			id: 'all-functions-tree',
			xtype: 'treepanel',
			useArrows: true,
			enableDrag: true,
			rootVisible: false,
			autoScroll: true,
			border: false,
			loader: new Ext.tree.TreeLoader({
				dataUrl: consts.contextPath + 'system/menu!list.action',
				listeners: {
					"beforeload": function(tree, node, callback) {
						if (node && node.attributes.id == "-1") {
							return false;
						}

						this.baseParams.portalid = node.attributes.id;
					}
				}
			}),
			root: new Ext.tree.AsyncTreeNode({
				id: "-1",
				text: "根节点",
				expanded: true,
				leaf: false,
				listeners: {
					"load": function(node) {
						var apps = consts.menuData;
						for (var i = 1; i < apps.length; i++) {
							node.appendChild(new Ext.tree.AsyncTreeNode({
								id: apps[i].id,
								text: apps[i].funcname,
								allowDrag: false,
								leaf: false,
								isApp: true
							}))
						}
					}
				}
			}),
			listeners:{
				nodedragover:function(){
					//alert('nodedragover');
					return false;
				},
				startdrag:function(sender,node,e){
					if(node.isLoaded && (!node.isLoaded())){
						node.reload();
					}
				}
			}
		};
		var win=new Ext.Window({
			title : '应用功能树',
			layout : 'fit',
			width : 240,
			height:480,
			items:tree,
			onEsc:Ext.emptyFn,
			listeners:{
				close:function(sender){
					Ext.getCmp('show-all-functions-tree-button').setDisabled(false);
				}
			}
		});
		win.show();
	}
	//注销
	HomePage.prototype.logout=function(){
		if (inTrans()) {
			Ext.Msg.alert("警告", "事务未提交不允许注销！")
			return;
		}
		var currentURL = consts.contextPath + 'system/login.action';
		Ext.Ajax.request({
			url: consts.contextPath + 'system/login!logout.action',
			method: 'GET',
			async: false,
			success: function(response, options) {
				var respText = Ext.util.JSON.decode(response.responseText);
				location.replace(currentURL);
				//location.replace(action_url+'/login?service='+encodeURIComponent(currentURL));
				/*
				Ext.Ajax.request({
					url: action_url,
					method: 'GET',
					async: false,
					success: function(response, options) {
						location.replace(currentURL);
					}
				});
				*/
			},
			failure: function(response, options) {
				location.replace(currentURL);
			}
		});
	}
	//退出
	HomePage.prototype.closeWindow=function () {
		if (inTrans()) {
			Ext.Msg.alert("警告", "事务未提交不允许退出！")
			return;
		}
		var flag = confirm("确定要关闭浏览器吗?");
		if (flag) {
			var win = window;
			while (win.top) {
				if (win == win.top) {
					break;
				} else {
					win = win.top;
				}
			}
			//win.opener = null;
			HomePage.prototype.logout();
			win.close();
		}
	}
	//修改密码
	HomePage.prototype.showPasswordEditor = function() {
		var url = 'pages/sysmanage/password.jsp';
		var win = new Ext.Window({
			id:'myPassword',
			title: '密码修改',
			modal: true,
			width: 300,
			height: 170,
			resizable: true,
			html: '<iframe src="' + url + '" width="100%" height="100%" scrolling="no" frameborder="no" border="0"></iframe>'
		});
		win.show();
	};
	//修改个人信息
	HomePage.prototype.showUserInfoEditor = function() {
		Ext.Ajax.request({
			url: consts.contextPath + '/isSuperAdmin.ctrl',
			method: 'GET',
			async: true,
			success: function(response, options) {
				if (response.responseText) {
					var respText = Ext.util.JSON.decode(response.responseText);
					if (!respText.data) {
						var src = "../sofa-basalinfo/pages/user/account.jsp?mode=edit";
						var win = new Ext.Window({
							id:'myAccount',
							title: '修改个人信息',
							width: 580,
							height: 390,
							closable: true,
							modal: true,
							html: '<iframe src="' + src + '" width="100%" height="100%" scrolling="no" frameborder="no" border="0"></iframe>'
						});
						win.show();
						win.center();
					} else {
						Ext.MessageBox.alert("提示", "超级管理员不能编辑个人信息！");
					}
				}
			},
			failure: function(response, options) {
			}
		});
	}
}
var homepage=new HomePage();
