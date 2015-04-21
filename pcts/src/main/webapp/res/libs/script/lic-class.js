function LicClass(){
	var checkUrl=consts.contextPath + '/checklic.ctrl';
	LicClass.prototype.checkLic=function(){
		function dolic(lic){
			if(lic=="true"){
				return;
			}
			if(lic.indexOf('\f-1')!=-1){
				alert(lic);
				HomePage.prototype.logout();
				return;
			}
			if(lic.indexOf('\f')!=-1){
				alert(lic);
				return;
			}
			var span=Ext.fly('licinfo').dom;
			span.innerHTML=lic;
		}
		Ext.Ajax.request({
			url: checkUrl,
			method: 'GET',
			async: false,
			success: function(response, options) {
				dolic(response.responseText);
			},
			failure: function() {
				HomePage.prototype.logout();
			}
		});		
	};
}

var licclass=new LicClass();