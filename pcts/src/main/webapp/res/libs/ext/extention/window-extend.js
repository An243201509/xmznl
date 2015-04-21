/**
 * 由旧版移植
 * by mengyong.
 */

window.id = "SOFAPORTAL";

//function errorInfo(msg, URI, ln) {
//	Ext.Msg.alert("错误", "<p>报错信息:" + msg + "</p><p>报错位置:" + URI + "</p><p>报错行数:" + ln + "</p>")
//	return true;
//}

//window.onerror = errorInfo;

//无法实现浏览器兼容，抱歉...
//window.onbeforeunload = function() {
//	if (window.event) {
//		var n = window.event.screenX - window.screenLeft;
//		var b = n > document.documentElement.scrollWidth - 20;
//		if (b && window.event.clientY < 0 || window.event.altKey) {
//			logout();
//		} else {
//		}
//	}
//}

var portal = {
	tabs: [],
	isEmpty: function(){
		var flag = true;
		if (this.tabs) {
			for (var obj in this.tabs) {
				if (obj.indexOf("tab") != -1) {
					flag = false;
					break;
				}
			}
		}
		return flag;
	},
	lock: function(){
		var tab = Ext.getCmp('app-tabs-'+homepage.currentApp.id);
		if (tab) {
			var activeTab = tab.getActiveTab();
			var tabInfo = {
				activeTabId: "",
				appStr: homepage.currentApp.id
			};
			if (activeTab) {
				tabInfo.activeTabId = activeTab.id;
				this.tabs[tabInfo.activeTabId] = true;
			}
			return tabInfo;
		} else {
			return null;
		}
	},
	unlock: function(tabInfo){
		if (tabInfo && tabInfo.activeTabId && tabInfo.appStr) {
			delete this.tabs[tabInfo.activeTabId+''];
		}
	},
	//新需求，修改tab标题，针对当前tab
	changeTabTitle:function(title){
		title=title || '未命名';
		title=title+'';
		var tab = Ext.getCmp('app-tabs-'+homepage.currentApp.id);
		if (tab) {
			var activeTab = tab.getActiveTab();
			if (activeTab) {
				title=title.trim()==''?activeTab.title:title.trim();
				activeTab.setTitle(title);
			}
		}
	},
	//新需求，字页面打开tab页，针对当前app
	openCustomTab:function(id,title,url){
		if(id && title && url){
			var node = new Ext.tree.TreeNode({
				leaf:true,
				isCustom:true,
				appId:homepage.currentApp.id,
				appFuncId:'custom-'+id,
				url:url+'',
				text:title+'',
				type:'3'
			});
			homepage.openFunction(node);
		}
	}
};

function inTrans(){
	return (portal.isEmpty && !portal.isEmpty());
}

function login(msg){
	locker.relogin(msg);
}
