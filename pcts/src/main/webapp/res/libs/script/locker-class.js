/**
 * by mengyong.
 */

function Locker(){
	Locker.prototype.locked=false;
	Locker.prototype.lock=function(){
		if(!Locker.prototype.locked){
			Ext.Ajax.request({
				url: consts.contextPath + 'system/login!lock.action',
				success: function(resp, opts) {}
			});
			var loginForm = new Ext.FormPanel({
				labelWidth: 60,
				height:80,
				border:false,
				frame: false,
				bodyStyle: {
					background: '#dfe8f6 url(' + consts.imgPath + 'homepage/lock-2.png) no-repeat top left',
					border: '0px',
					padding:'5px 5px 0'
				},
				defaults: {
					width: 200,
					enableKeyEvents: true
				},
				defaultType: 'textfield',
				items: [{
					fieldLabel: '用户名',
					name: 'loginname',
					allowBlank: false,
					readOnly:true,
					value: consts.loginName,
					blankText: '请输入用户名！',
					listeners: {
						"keypress": function(textfield, event) {
							if (event.keyCode == 13) {
								loginWin.buttons[0].fireEvent('click', loginWin.buttons[0], event);
							}
						}
					}
				}, {
					fieldLabel: '密码',
					name: 'password',
					inputType: 'password',
					allowBlank: false,
					blankText: '请输入密码！',
					listeners: {
						"keypress": function(textfield, event) {
							if (event.keyCode == 13) {
								loginWin.buttons[0].fireEvent('click', loginWin.buttons[0], event);
							}
						}
					}
				}]
			});
			var loginWin = new Ext.Window({
				title:'锁定',
				layout: 'fit',
				width: 315,
				autoHeight:true,
				closable: false,
				resizable:false,
				modal: true,
				onEsc:Ext.emptyFn,
				buttons: [{
					text: '解锁',
					listeners: {
						'click': function() {
							if (loginForm.form.isValid()) {
								loginForm.form.doAction('submit', {
									url: consts.contextPath + 'system/login!lockLogin.action',
									method: 'POST',
									waitMsg: "校验中...",
									success: function(form, action) {
										loginForm.form.findField('loginname').setValue(consts.loginName);
										loginForm.form.findField('password').setValue('');
										loginWin.close();
									},
									failure: function(form, action) {
//										if (action.response && action.response.status && action.response.status == 506) {
//											locker.relogin();
//											return;
//										}
										var respText = Ext.util.JSON.decode(action.response.responseText);
										if(respText.data == "sessionInvalidate"){
											locker.relogin(respText.message);
										} else {
											if(!respText.msg) {
												Ext.Msg.alert('提示', "解锁失败!");
											} else {
												Ext.Msg.alert('提示', respText.msg);
											}
										}
//										Ext.Msg.alert('提示', action.response.responseText , function (){
//											windows.location= consts.contextPath +"/sofa-portal";
//										});
									}

								});

							}
						}
					}
				}],
				items: [loginForm],
				listeners:{
					close:function(){
						Locker.prototype.locked=false;
					}
				}
			});
			loginWin.show();
			Locker.prototype.locked=true;
		}
	}
	Locker.prototype.relogin=function(msg){
		msg=msg||'凭证过期，请重新登录！';
		Ext.Msg.alert("警告", msg, function() {
			//location.replace(consts.contextPath+'/homepage.ctrl'+consts.server);
			location.replace('login.jsp');
		});
	}
	//在Ext.onReady中调用
	Locker.prototype.init=function(){
		//刷新页面后,如果刷新前是锁定状态，则直接锁定
		Ext.Ajax.request({
			url: consts.contextPath + 'system/login!isLock.action',
			method: 'GET',
			success: function(response, options) {
				var respText = Ext.util.JSON.decode(response.responseText);
				if (respText.success) {
					locker.lock();
				}
			},
			failure: function(response, options) {
//				if (response && response.status && response.status == 506) {
//					locker.relogin();
//					return;
//				}
			}
		});		
	}
}

var locker=new Locker();

//初始化锁屏 (function(){})();-----------------------------------------------------------------------
(function (){
	//定时状态对象
	var lockTimeObject;
	//获取锁屏时间
	var lockTime=(function(){
		var lockTime = 0;
		Ext.Ajax.request({
			url: consts.contextPath + 'system/login!lockTime.action',
			method: 'GET',
			async: false,
			success: function(response, options) {
				var respText = Ext.util.JSON.decode(response.responseText);
				if (respText.data && respText.data.lockTime) {
					lockTime = respText.data.lockTime;
				}
			},
			failure: function(response, options) {
//				if (response && response.status && response.status == 506) {
//					locker.relogin();
//					return;
//				}
			}
		});
		return parseInt(lockTime);
	})();
	if(lockTime && (!consts.silent)){
		document.onmouseover = function() {
			if (lockTimeObject) {
				window.clearInterval(lockTimeObject)
			}
			lockTimeObject = window.setInterval("locker.lock()", lockTime * 60 * 1000);
		}
	}
})();
//密码到期提醒---------------------------------------------------------------------------------------
//window.onload=function(){
//	Ext.Ajax.request({
//		url: '/passwordUpdateNotify.ctrl',
//		method: 'GET',
//		async: true,
//		success: function(response, options) {
//			if (response.responseText) {
//				var respText = Ext.util.JSON.decode(response.responseText);
//				if (respText.success) {
//					alert("密码还差" + respText.dayCount + "天过期，请尽快重新设置密码！")
//				}
//			}
//		},
//		failure: function(response, options) {
//		}
//	});
//}

window.onbeforeunload=function(){
	if(inTrans()){
		return '尚有事务正在进行中，如果离开此页可能导致事务中断！';
	}
}
