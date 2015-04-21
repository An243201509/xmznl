Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';
	locker.init();
	messagecenter.receiveMsg();
	(function(){
		if(!consts.silent){
			window.setInterval("messagecenter.receiveMsg()", 5 * 60 * 1000);
			window.setInterval("messagecenter.showMsgMini()", 3 * 1000);
		}
	})();
	//function tree header menu---------------------------------------------------------------------
	//用于功能导航树的操作
	functionTreeHeaderMenu = new Ext.menu.Menu({
		currentTree: function() {
			var id = 'app-functions-tree-' + homepage.currentApp.id;
			return Ext.getCmp(id);
		},
		id: 'function-tree-header-menu',
		items: [{
			text: '全部展开',
			handler: function(sender) {
				functionTreeHeaderMenu.currentTree().expandAll();
			}
		}, {
			text: '全部折叠',
			handler: function(sender) {
				functionTreeHeaderMenu.currentTree().collapseAll();
			}
		}, {
			text: '还原',
			handler: function(sender) {
				var tree=functionTreeHeaderMenu.currentTree();
				nodeUtil.resume(tree);
			}
		}]
	});
	//function tree header menu end-----------------------------------------------------------------
	//function tree context menu--------------------------------------------------------------------
	//功能导航树右键菜单
	var functionTreeContextMenu = new Ext.menu.Menu({
		currentTree: function() {
			var id = 'app-functions-tree-' + homepage.currentApp.id;
			return Ext.getCmp(id);
		},
		id: 'function-tree-context-menu',
		items: [{
			id:'function-tree-context-menu-rename',
			text: '重命名',
			handler: function(sender) {
				var f=new Ext.FormPanel({
					labelWidth: 80,
					height:50,
					border:false,
					frame: false,
					bodyStyle: {
						background: '#dfe8f6 url('+consts.imgPath+'homepage/folder.png) no-repeat top left',
						border: '0px',
						padding:'5px 5px 0'
					},
					defaults: {
						width: 180,
						enableKeyEvents: true
					},
					items:[{
						id:'node-name-text-field',
						xtype:'textfield',
						fieldLabel: '文件夹名称',
						allowBlank: false,
						blankText: '名称不能为空',
						maxLength:127,
						name:'name',
						maxLengthText:'名称不能超过127个字符',
						value:sender.parentMenu.contextNode.text
					}]
				});
				var win=new Ext.Window({
					title:'重命名',
					layout: 'fit',
					width: 315,
					autoHeight:true,
					closable: true,
					resizable:false,
					modal: true,
					
					items:[f],
					buttons:[{
						text:'确定',
						handler:function(){
							var node=sender.parentMenu.contextNode;
							if(f.form.isValid()){
								node.setText(f.getForm().findField('name').getValue());
								nodeUtil.renameNode(node);
								win.close();
							}
						}
					},{
						text:'取消',
						handler:function(){
							win.close();
						}
					}]
				});
				win.show();
				Ext.getCmp('node-name-text-field').focus(true,true);
			}
		}, {
			id:'function-tree-context-menu-delete',
			text: '删除自定义功能(组)',
			handler: function(sender) {
				Ext.MessageBox.confirm('提示', '确实要删除'+sender.parentMenu.contextNode.attributes.text+'吗？', function(btn){
					if(btn==='yes'){
						var node=sender.parentMenu.contextNode;
						nodeUtil.deleteAppFunc(node);
					}
				});
				
			}
		}, {
			id:'function-tree-context-menu-add',
			text: '添加子文件夹',
			handler: function(sender) {
				var f=new Ext.FormPanel({
					labelWidth: 80,
					height:50,
					border:false,
					frame: false,
					bodyStyle: {
						background: '#dfe8f6 url('+consts.imgPath+'homepage/folder.png) no-repeat top left',
						border: '0px',
						padding:'5px 5px 0'
					},
					defaults: {
						width: 180,
						enableKeyEvents: true
					},
					items:[{
						id:'node-name-text-field',
						xtype:'textfield',
						fieldLabel: '文件夹名称',
						allowBlank: false,
						blankText: '名称不能为空',
						maxLength:127,
						name:'name',
						maxLengthText:'名称不能超过127个字符'
					}]
				});
				var win=new Ext.Window({
					title:'添加子文件夹',
					layout: 'fit',
					width: 315,
					autoHeight:true,
					closable: true,
					resizable:false,
					modal: true,
					
					items:[f],
					buttons:[{
						text:'确定',
						handler:function(){
							var node=sender.parentMenu.contextNode;
							if(f.form.isValid()){
								var newNode=new Ext.tree.TreeNode({
									id:nodeUtil.uuid(),
									appId:node.attributes.appId,
                                	isCustom : true,   //自定义节点
                                	type:'1',
                                	draggable:true,
									text : f.getForm().findField('name').getValue(),// 节点名称
									expanded : false,// 展开
									leaf : false
                                });
								node.expand(false);
								node.appendChild(newNode);
								nodeUtil.saveNode(newNode);
								win.close();
								Ext.MessageBox.alert('提示','保存成功');
							}
						}
					},{
						text:'取消',
						handler:function(){
							win.close();
						}
					}]
				});
				win.show();
				Ext.getCmp('node-name-text-field').focus(true,true);
			}
		}],
		listeners:{
			beforeshow:function(sender){
				var node=sender.contextNode;
				Ext.getCmp('function-tree-context-menu-rename').setDisabled(false);
				Ext.getCmp('function-tree-context-menu-delete').setDisabled(false);
				Ext.getCmp('function-tree-context-menu-add').setDisabled(false);
				if(node && node.attributes.isCustom){
					if(node.id=='custom-functions-root'){
						Ext.getCmp('function-tree-context-menu-delete').setDisabled(true);
						Ext.getCmp('function-tree-context-menu-rename').setDisabled(true);
					}
					if(node.attributes.type!='1'){
						Ext.getCmp('function-tree-context-menu-add').setDisabled(true);
						Ext.getCmp('function-tree-context-menu-rename').setDisabled(true);
					}
				} else {
					return false;
				}
			}
		}
	});
	//function tree context menu end----------------------------------------------------------------
	//page hander-----------------------------------------------------------------------------------
	//页面头部,采用card布局,最大化/最小化时切换card,并强制layout
	var pageHeader = {
		id: 'page-hander',
		xtype: 'panel',
		region: 'north',
		height: 83,
		layout: 'card',
		border: false,
		//style: 'padding-bottom:4px',
		//forceLayout: true,
		bodyStyle: {
			background: '#154d8d',
			border: '0px'
		},
		activeItem: 'page-header-max',
		items: [
		//page header max---------------------------------------------------------------------------
		//正常情况下的页面头部,包含logo,app工具栏,常用操作工具栏,消息中心
		{
			id: 'page-header-max',
			xtype: 'panel',
			border: false,
			//forceLayout: true,
			style: 'padding-bottom:4px',
			bodyStyle: {
				background: '#154d8d',
				border: '0px'
			},
			layout: {
				type: 'hbox',
				pack: 'start',
				align: 'stretch'
			},
			bbar: {
				id: 'app-toolbar',
				xtype: 'toolbar',
				style: 'background-color:#D0DEF0; background-image:url('+consts.imgPath+'homepage/app-toolbar.png); border-width: 0 0 0 0;',
				border: false,
				enableOverflow: true,
				defaults: {
					allowDepress: false
				},
				items: homepage.createAppButtons()
			},
			items: [{
				width: 342,
				border: false,
				bodyStyle: {
					background: '#154d8d',
					border: '0px'
				},
				html: ''//logo
			}, {
				flex: 1,
				border: false,
				bodyStyle: {
					background: '#154d8d',
					border: '0px'
				},
				bbar: {
					id:'main-toolbar',
					xtype: 'toolbar',
					enableOverflow: true,
					style: 'background: no-repeat bottom right;background-color:#154d8d;background-image:url('+consts.imgPath+'homepage/main-toolbar.png);border-width: 0 0 0 0;',
					items: ['->',
					{
						text: '管理菜单',
						icon: consts.imgPath+'homepage/settings.png',
						menu: {
							items: [{
								id:'show-all-functions-tree-button',
								text: '功能树',
								icon: consts.imgPath+'homepage/tree.png',
								handler: function(sender) {
									sender.setDisabled(true);
									homepage.openFunctionsTree();
								}
							}, {
								text: '隐藏Logo',
								icon: consts.imgPath+'homepage/fullscreen.png',
								handler: function() {
									homepage.showLogo(false);
								}
							}]
						}
					}, {
						text: '锁定',
						icon: consts.imgPath+'homepage/lock.png',
						handler: function() {
							locker.lock();
						}
					}, {
						text: '修改密码',
						icon: consts.imgPath+'homepage/key.png',
						menu:{
							items:[{
								text:'修改系统密码',
								handler:function(sender){
									homepage.showPasswordEditor();
								}
							},{
								text:'修改UKEY密码',
								handler:function(sender){
									if(consts.ukey && ukey_control){
										ukey_control.changeUserPin();
									} else {
										Ext.MessageBox.alert('提示','系统未启用安保系统。');
									}
								}
							}]
						}
					}, {
						text: '修改个人信息',
						icon: consts.imgPath+'homepage/user.png',
						handler:function(sender){
							homepage.showUserInfoEditor();
						}
					}, {
						text: '注销',
						icon: consts.imgPath+'homepage/logout.png',
						handler: function() {
							homepage.logout();
						}
					}, {
						text: '退出',
						icon: consts.imgPath+'homepage/exit.png',
						handler: function() {
							homepage.closeWindow();
						}
					},'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;']
				}
			}]
		},
		//page header max end-----------------------------------------------------------------------
		//page header min---------------------------------------------------------------------------
		//最小化情况下的页面头部,包含还原按钮
		{
			id: 'page-header-min',
			xtype: 'panel',
			border: false,
			//forceLayout: true,
			style: 'padding-bottom:4px;padding-left:4px;',
			bodyStyle: {
				background: '#154d8d',
				border: '0px'
			},
			html:'<div id="show-logo" onclick="homepage.showLogo(true)"></div><div style="float:left;color:#154d8d;line-height:16px;">珍爱生命, 远离IE6!</div>'
		}
		//page header min end-----------------------------------------------------------------------
		]
	}
	//page header end-------------------------------------------------------------------------------
	//page footer-----------------------------------------------------------------------------------
	//页面尾部,显示copyright,当前登录用户名,当前时间
	var pageFooter = {
		id: 'page-footer',
		xtype: 'panel',
		region: 'south',
		height: 20,
		border: false,
		//collapseMode: 'mini',
		//collapsible: true,
		//animCollapse:false,
		//split: true,
		bodyStyle: {
			background: '#154d8d',
			border: '0px'
		},
		html:'<div class="footer"><span>ZhangTao 工作室&nbsp;欢迎&nbsp;</span><span id="nameUser">'+consts.userName+'&nbsp;</span><span id="licinfo" style="color:#ff0000"></span></div>'
	}
	//page footer end-------------------------------------------------------------------------------
	//page center-----------------------------------------------------------------------------------
	//页面主区域,采用card布局,在切换app时切换card,根据授权app信息动态生成card
	var pageCenter = {
		id: 'page-center',
		xtype: 'panel',
		region: 'center',
		border: false,
		layout: 'card',
		activeItem: 'app-card-item-' + consts.menuData[0].id,
		items: homepage.createAppCards()
	}
	//page center end-------------------------------------------------------------------------------
	new Ext.Viewport({
		id: 'main-view',
		layout: 'border',
		//forceLayout: true,
		items: [pageHeader, pageCenter, pageFooter]
	});
	//ukey------------------------------------------------------------------------------------------
	//if(consts.ukey && ukey_control && ukey_control.init){
	//	ukey_control.init();
	//}
	//licclass.checkLic();
});
