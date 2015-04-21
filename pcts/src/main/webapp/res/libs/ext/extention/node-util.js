/**
 * by mengyong
 */

var nodeUtil ={
	recursion : function(node, ids) {
		nodeUtil.setDbId(node, ids);
		alert(node);
		if (node.hasChildNodes()) {
			for (var i = 0; i < node.childNodes.length; i++) {

				nodeUtil.recursion(node.childNodes[i], ids);
			}
		}
	},
	addNodes : function(node) {
		var appFuncId = node.attributes.appFuncId;
		json += '"funcId":"' + appFuncId;
		alert(json);
		json += '",'
		if (node.hasChildNodes()) {
			json += '"children":['
			for (var i = 0; i < node.childNodes.length; i++) {
				json += '{'
				nodeUtil.addNodes(node.childNodes[i])
				if (i == node.childNodes.length - 1) json += '}'
				else json += '},'
			}
			json += ']'
		} else {
			json += '"children":[]'
		}


	},
	setDbId : function(node, ids) {
		for (var i = 0; i < ids.length; i++) {
			if (node.attributes.appFuncId && node.attributes.appFuncId == ids[i].funcId) {
				node.attributes.id = ids[i].dbId;
				break;
			}
		}
	},
	addAppFunc : function(parent,node) {
		var action_url = consts.contextPath + '/appFunc.ctrl?action=addAppFunc';
		var appId = parent.attributes.appId;
		var appFuncId=node.attributes.appFuncId;
		var isCustomApp = homepage.currentApp.isCustom;
		var parentId = ''
		if (parent.attributes.id != 'custom-functions-root') {
			parentId = parent.attributes.id;
		}
		var index = parent.indexOf(node);
		//一致为空，else不会执行
		var priorId = '';
		if (priorId == '') {
			action_url += "&index=" + index + "&appFuncId=" + appFuncId + "&appId=" + appId + "&isCustomApp=" + isCustomApp + "&parentId=" + parentId;
		} else {
			action_url += "&index=" + index + "&appFuncId=" + appFuncId + "&appId=" + appId + "&isCustomApp=" + isCustomApp + "&parentId=" + parentId + "&priorId=" + priorId;
		}
		if (node.hasChildNodes()) {
			json = "[";
			json += "{";
			nodeUtil.addNodes(node);
			json += "}";
			json += "]";
			action_url += "&json=" + json;
		}
		Ext.Ajax.request({
			url: action_url,
			method: 'GET',
			async: false,
			success: function(response, options) {
				var respText = Ext.util.JSON.decode(response.responseText);
				var ids = respText;
				if (ids && ids.length > 0) {
					nodeUtil.recursion(node, ids);
				}
			},
			failure: function(response, options) {}
		});
	},
	resume:function(tree){
		if (tree) {
			Ext.Msg.buttonText.yes = '是';
			Ext.Msg.buttonText.no = '否';
			Ext.Msg.buttonText.ok = '确定';
			Ext.MessageBox.confirm("操作确认信息", "请确认是否要将导航树还原成最初状态！", function(optional) {
				if (optional && optional == 'yes') {
					var appId = tree.appid;
					var isCustomApp = homepage.currentApp.isCustom;

					Ext.Ajax.request({
						url: consts.contextPath + '/appFunc.ctrl?action=resume',
						method: 'GET',
						params: {
							appId: appId,
							isCustomApp: isCustomApp
						},
						success: function(response, options) {
							var respText = Ext.util.JSON.decode(response.responseText);
							if (respText.success) {
								Ext.Msg.alert('提示', respText.data);
								tree.loader.load(tree.getRootNode());
							}
						},
						failure: function(response, options) {
							var respText = Ext.util.JSON.decode(response.responseText);
							if (!respText.success) {
								Ext.Msg.alert('提示', respText.data);
							}
						}
					});
				}
			});
		}
	},
	moveAppFunc: function (tree, node, oldParent, newParent, index) {
		var action_url = consts.contextPath + '/appFunc.ctrl?action=move';
		var appId = tree.appid
		action_url += "&appId=" + appId;
		var id = node.attributes.id;
		action_url += "&id=" + id;
		var isCustomApp = homepage.currentApp.isCustom;
		action_url += "&isCustomApp=" + isCustomApp;
		var oldParentId = oldParent.attributes.id;
		if (oldParent.attributes.id) {
			action_url += "&oldParentId=" + oldParentId;
		}
		var newParentId = newParent.attributes.id;
		if (newParent.attributes.id) {
			action_url += "&newParentId=" + newParentId;
		}
		if (newParent.attributes.id == "custom-functions-root" && newParent.hasChildNodes()) {
			for (var i = 0; i < newParent.childNodes.length; i++) {
				if (!newParent.childNodes[i].attributes.isCustom && newParent.childNodes[i] != node) {
					index--;
				}
			}
		}
		var nodeIndex = index;
		action_url += "&nodeIndex=" + nodeIndex;
		Ext.Ajax.request({
			url: action_url,
			method: 'GET',
			async: false,
			success: function(response, options) {
				var respText = Ext.util.JSON.decode(response.responseText);
			},
			failure: function(response, options) {
				var respText = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', respText.data);
			}
		});
	},
	isSameTree: function (targetNode,dropNode){
		var flag=false;
		if(targetNode.getOwnerTree()==dropNode.getOwnerTree()){
			flag=true;
		}
		return flag;
	},
	uuid: function (prefix) {
	    var uid = new Date().getTime().toString(16);
	    uid += Math.floor((1 + Math.random()) * Math.pow(16, (16 - uid.length)))
	        .toString(16).substr(1);    
	    return (prefix || '') + uid;
	},
	copyDropNode: function (appid,node) {
		var newNode = new Ext.tree.TreeNode(Ext.apply({}, node.attributes));
		newNode.id = nodeUtil.uuid();
		newNode.attributes.isCustom = true;
		newNode.attributes.appId=appid;

		for (var i = 0; i < node.childNodes.length; i++) {
			n = node.childNodes[i];
			if (n) {
				newNode.appendChild(nodeUtil.copyDropNode(appid,n));
			}
		}
		return newNode;
	},
	saveNode: function (node) {
		var action_url = consts.contextPath + '/appFunc.ctrl?action=addPackage';
		var appId = node.attributes.appId;
		action_url += "&appId=" + appId;
		var isCustomApp = homepage.currentApp.isCustom;
		action_url += "&isCustomApp=" + isCustomApp;
		var parentAppFuncId = "";
		if (node.parentNode.attributes && node.parentNode.attributes.appFuncId) {
			parentAppFuncId = node.parentNode.attributes.appFuncId;
			action_url += "&parentAppFuncId=" + parentAppFuncId;
		}
		var packageName = node.attributes.text;
		var parentId = node.parentNode.attributes.id;
		if (parentId == "custom-functions-root") {
			parentId = '';
		}
		action_url += "&parentId=" + parentId;
		var index = node.parentNode.indexOf(node);
		action_url += "&index=" + index;
		Ext.Ajax.request({
			url: action_url,
			method: 'POST',
			async: false,
			params: {
				packageName: packageName
			},
			success: function(response, options) {
				var respText = Ext.util.JSON.decode(response.responseText);
				node.attributes.id = respText.id;
			},
			failure: function(response, options) {
			}
		});
	},
	renameNode: function (node) {
		var action_url = consts.contextPath + '/appFunc.ctrl?action=renamePackage';
		var packageName = node.attributes.text;
		var nodeid = node.attributes.id;

		Ext.Ajax.request({
			url: action_url,
			method: 'POST',
			async: false,
			params: {
				id:nodeid,
				name: packageName
			},
			success: function(response, options) {
			},
			failure: function(response, options) {
			}
		});
	},
	deleteAppFunc: function (node) {
		var action_url = consts.contextPath + '/appFunc.ctrl?action=delete';
		action_url += '&userId=' + consts.userId;
		var appId = node.attributes.appId;
		action_url += '&appId=' + appId;
		var isCustomApp = homepage.currentApp.isCustom;
		action_url += '&isCustomApp=' + isCustomApp;
		var id = node.attributes.id;
		action_url += '&id=' + id;
		Ext.Ajax.request({
			url: action_url,
			method: 'GET',
			async: false,
			success: function(response, options) {
				var parentNode = node.parentNode;
				parentNode.removeChild(node);
				var respText = Ext.util.JSON.decode(response.responseText);
				Ext.MessageBox.alert("提示", respText.data);
			},
			failure: function(response, options) {
				Ext.MessageBox.alert("提示",response.responseText);
			}
		});

	}
};