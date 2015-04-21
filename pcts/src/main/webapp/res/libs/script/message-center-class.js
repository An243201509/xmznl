/**
 * by mengyong.
 */

function MessageCenter(){
	var createMsgItemHTML=function (m){
		if(m.messages[0].type=='0'){//互动消息
			return '<div class="context-item context-user-item"><a href="#" onclick="messagecenter.showDetail(\''+m.id+'\')"></a><span>'+m.messages[0].title+'</span></div>';
		} else if(m.messages[0].type=='1'){
			return '<div class="context-item context-sys-item"><a href="#" onclick="messagecenter.executeMsg(\''+m.id+'\')"></a><span>'+m.messages[0].title+'</span></div>';
		} else {//系统消息
			return '<div class="context-item context-sys-item"><a href="#" onclick="messagecenter.executeMsg(\''+m.id+'\')"></a><span>'+m.messages[0].title+'</span></div>';
		}
	}
	//消息中心地址
	MessageCenter.prototype.url='';
	//初始化
	if(consts.msgUrl==''){
//		Ext.Ajax.request({
//			url: consts.contextPath + '/urlconvert.ctrl',
//			method: 'POST',
//			async: false,
//			params: {
//				proxyReqUrl: 'sofa-message'
//			},
//			success: function(response, options) {
//				if (response.responseText == "" || response.responseText == null) {
//					return;
//				}
//				
//				MessageCenter.prototype.url = response.responseText.trim();
//			},
//			failure: function() {}
//		});		
	} else {
//		MessageCenter.prototype.url='http://'+consts.msgUrl+'/sofa-message';
	}
	//console.log(MessageCenter.prototype.url);
	//消息
	MessageCenter.prototype.msg={index:0,context:[]};
	//接收消息
	MessageCenter.prototype.receiveMsg=function(){
//		Ext.Ajax.request({
//			url: MessageCenter.prototype.url+'/news.ctrl?method=timing',
//			method: 'GET',
//			success: function(response, options) {
//				var messages = response.responseText;
//				if (messages == null || messages == "") {
//					return;
//				}
//				var data = Ext.decode(messages);
//				MessageCenter.prototype.msg.index=0;
//				MessageCenter.prototype.msg.context=data;
//				MessageCenter.prototype.showMsgBox();
//			},
//			failure: function() {
//			}
//		});
	}
	//加载消息mini
	MessageCenter.prototype.showMsgMini=function(){
		var index=MessageCenter.prototype.msg.index, l=MessageCenter.prototype.msg.context.length;
		if(l==0){
			Ext.fly('msg-mini').dom.innerHTML='';
			return;
		}
		if(index>=l){
			index=0;
		}
		Ext.fly('msg-mini').dom.innerHTML=MessageCenter.prototype.msg.context[index].messages[0].title;
		index+=1;
		MessageCenter.prototype.msg.index=index;
	}
	//加载消息box
	MessageCenter.prototype.showMsgBox=function(){
		var list=Ext.fly('context-list').dom;
		list.innerHTML='';
		var ms=MessageCenter.prototype.msg.context,html='',usermsgcount=0,sysmsgcount=0;
		if(ms.length>0){
			for(var i=0,l=ms.length;i<l;i++){
				html+=createMsgItemHTML(ms[i]);
				if(ms[i].messages[0].type==0){
					usermsgcount+=1;
				} else {
					sysmsgcount+=1;
				}
			}
			list.innerHTML=html;
		}
		Ext.fly('sys-msg-count').dom.innerHTML='&nbsp;&nbsp;系统消息('+sysmsgcount+')';
		Ext.fly('user-msg-count').dom.innerHTML='&nbsp;&nbsp;互动消息('+usermsgcount+')';
	}
	//显示下拉框，显示前先调整下拉框中的内容，默认显示列表，而不显示明细
	MessageCenter.prototype.down=function(){
		Ext.DomHelper.applyStyles('context-detail',{display:'none'});
		Ext.DomHelper.applyStyles('context-list',{display:'block'});

		Ext.DomHelper.applyStyles('mini-box',{display:'none'});
		Ext.DomHelper.applyStyles('dropdown-box',{display:'block'});
	}
	//收起下拉框
	MessageCenter.prototype.up=function(){
		Ext.DomHelper.applyStyles('dropdown-box',{display:'none'});
		Ext.DomHelper.applyStyles('mini-box',{display:'block'});
	}
	//跳转到消息中心
	MessageCenter.prototype.toCenter=function(){
		function switchApp(appid){
			var appButton=Ext.getCmp('app-toolbar-item-'+appid);
			if(appButton){
				appButton.toggle(true,false);
				return true;
			} else {
				Ext.MessageBox.alert('提示','您没有消息中心的权限。');
				return false;
			}
		}
		function openFunction(data){
			var node = new Ext.tree.TreeNode({
				leaf:true,
				isCustom:false,
				appId:data.appId,
				appFuncId:data.functionId,
				url:data.url,
				text:data.functionName,
				type:'2'
			});
			homepage.openFunction(node);
		}
		Ext.Ajax.request({
			url: MessageCenter.prototype.url + '/news.ctrl?method=forward',
			method: 'GET',
			success: function(response, options) {
				var messages = response.responseText;
				if (messages == null || messages == "") {
					return;
				}
				//console.log(messages);
				var obj = Ext.decode(messages);
				if(switchApp(obj.appId)){
					openFunction(obj);
					MessageCenter.prototype.up();
				}	
			},
			failure: function(response, options) {
				Ext.MessageBox.alert('提示',response.responseText);
			}
		});
	}
	//显示消息明细内容，消息状态改为已读，注意使用的是收到消息的id，而非消息本身的id
	MessageCenter.prototype.showDetail=function(msgId){
		function findMsgById(id){
			var ms=MessageCenter.prototype.msg.context;
			if(ms.length==0){return false;}
			for(var i=0,l=ms.length;i<l;i++){
				if(ms[i].id==msgId){
					return ms[i];
				}
			}
		}
		function readMsg(id){
			Ext.Ajax.request({
				url: MessageCenter.prototype.url + '/messageCenter.ctrl?method=changeState',
				method: 'POST',
				params: {
					ids: id,
					state: 2
				},
				success: function(response, options) {
				},
				failure: function() {
				}
			});
		}
		var m=findMsgById(msgId);
		if(m){
			var title=Ext.fly('context-detail-title').dom;
			title.innerHTML=m.messages[0].title;
			var content=Ext.fly('context-detail-content').dom;
			content.innerHTML=m.messages[0].content;
			Ext.DomHelper.applyStyles('context-list',{display:'none'});
			Ext.DomHelper.applyStyles('context-detail',{display:'block'});
			readMsg(msgId);
		}
	}
	//执行消息，消息状态改为已读，注意使用的是收到消息的id，而非消息本身的id
	MessageCenter.prototype.executeMsg=function(msgId){
		function findMsgById(id){
			var ms=MessageCenter.prototype.msg.context;
			if(ms.length==0){return false;}
			for(var i=0,l=ms.length;i<l;i++){
				if(ms[i].id==msgId){
					return ms[i];
				}
			}
		}
		function switchApp(appid){
			var appButton=Ext.getCmp('app-toolbar-item-'+appid);
			if(appButton){
				appButton.toggle(true,false);
				return true;
			} else {
				Ext.MessageBox.alert('提示','您没有消息中心的权限。');
				return false;
			}
		}
		function openFunction(data){
			var node = new Ext.tree.TreeNode({
				leaf:true,
				isCustom:false,
				appId:data.appId,
				appFuncId:data.functionId,
				url:data.url,
				text:data.functionName,
				type:'2'
			});
			homepage.openFunction(node);
		}
		function readMsg(mid,mfid,murl){
			Ext.Ajax.request({
				url: MessageCenter.prototype.url + '/messageCenter.ctrl?method=exec',
				method: 'POST',
				params: {
					id: mid,
					fid: mfid,
					url: murl
				},
				success: function(response, options) {
					//变成已读
					Ext.Ajax.request({
						url: MessageCenter.prototype.url + '/messageCenter.ctrl?method=changeState',
						method: 'POST',
						params: {
							ids: id,
							state: 2
						},
						success: function(response, options) {
						},
						failure: function() {
						}
					});
					var messages = response.responseText;
					if (messages == null || messages == "") {
						return;
					}
					//console.log(messages);
					var obj = Ext.decode(messages);
					if(switchApp(obj.appId)){
						openFunction(obj);
						MessageCenter.prototype.up();
					}	
				},
				failure: function(response, options) {
					Ext.MessageBox.alert('提示',response.responseText);
				}
			});
		}
		var m=findMsgById(msgId);
		if(m){
			for(var p in m){
				console.log(p+':'+m[p]);
			}
			//Ext.MessageBox.alert(m.messages[0].title,'type='+m.messages[0].type+'<br>'+'functionId='+m.messages[0].functionId+'<br>'+'url='+m.messages[0].uri);
			readMsg(msgId,m.messages[0].functionId,m.messages[0].uri);
		}
	}
	//从消息明细返回到消息列表
	MessageCenter.prototype.hideDetail=function(){
		Ext.DomHelper.applyStyles('context-detail',{display:'none'});
		Ext.DomHelper.applyStyles('context-list',{display:'block'});
	}
}

var messagecenter=new MessageCenter();
messagecenter.exec=function(id,fid,furl){
	function switchApp(appid){
		var appButton=Ext.getCmp('app-toolbar-item-'+appid);
		if(appButton){
			appButton.toggle(true,false);
			return true;
		} else {
			Ext.MessageBox.alert('提示','您没有消息中心的权限。');
			return false;
		}
	}
	function openFunction(data){
		var node = new Ext.tree.TreeNode({
			leaf:true,
			isCustom:false,
			appId:data.appId,
			appFuncId:data.functionId,
			url:data.url,
			text:data.functionName,
			type:'2'
		});
		homepage.openFunction(node);
	}
	function readMsg(mid,mfid,murl){
		Ext.Ajax.request({
			url: MessageCenter.prototype.url + '/messageCenter.ctrl?method=exec',
			method: 'POST',
			params: {
				id: mid,
				fid: mfid,
				url: murl
			},
			success: function(response, options) {
				var messages = response.responseText;
				if (messages == null || messages == "") {
					return;
				}
				//console.log(messages);
				var obj = Ext.decode(messages);
				if(switchApp(obj.appId)){
					openFunction(obj);
					MessageCenter.prototype.up();
				}	
			},
			failure: function(response, options) {
				Ext.MessageBox.alert('提示',response.responseText);
			}
		});
	}
	readMsg(id,fid,furl);
}
