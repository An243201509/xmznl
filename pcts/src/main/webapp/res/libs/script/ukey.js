var ukey_control = new Ukey();
function Ukey() {
	
};

/*******************************************************************************
* 函数名称：  init	
* 功能描述：	控件初始化
* 输入参数：  无
* 输出参数：	无
* 返 回 值：	           
* 其它说明：  
* 修改日期		修改人	      修改内容       电子邮箱
* ------------------------------------------------------------------------------
* 2011-09-15	许华锋	      创建           xuhuafeng@bris.cn
*******************************************************************************/
Ukey.prototype.init = function() {
	var eDiv = document.createElement("div");
	eDiv.innerHTML = '<object classid="clsid:87CEEA23-423A-4083-B908-2121D958824B" name= "eahthenticator" id="eahthenticator" width=0 height=0></object>';
	document.body.appendChild(eDiv);
}


/*******************************************************************************
* 函数名称：  sigCombineData	
* 功能描述：	对组合数据进行签名
* 输入参数：  无；
* 输出参数：	无；
* 返 回 值：	对象obj,属性一result,方法执行状态.
                                    0代表称成功，其他代表失败，
                                    100：没有USBKEY设备或者打开设备失败
                                    102：用户取消了口令输入
                                    103：用户登录失败或者用户口令输入不正确
	                                  104：获取签名长度失败
	                                  105：签名过程中出错
                                    114：获得用户ID值失败
                      属性二optval、组合签名结果值
                  
* 其它说明：  
* 修改日期		修改人	      修改内容       电子邮箱
* ------------------------------------------------------------------------------
* 2011-09-15	许华锋	      创建           xuhuafeng@bris.cn
*******************************************************************************/
Ukey.prototype.sigCombineData = function() {
	var ukey_eahthenticator = document.all.eahthenticator;
	if (!ukey_eahthenticator) {
		Ukey.prototype.init();
	}
	var result=document.all.eahthenticator.SigCombineData();
	var obj=new Object();
	if(result==0){
		obj.result=result;
		obj.optval=this.getSigCombineData();
	}
	else{
	  obj.result=result;
		obj.optval="";
	}
	return obj;
};

/*******************************************************************************
* 函数名称：  sigCombineDataEx	
* 功能描述：	扩展对组合数据进行签名
* 输入参数：  RandomData 八位随机数；
* 输出参数：	无；
* 返 回 值：	对象obj,属性一result,方法执行状态.
                                    0代表称成功，其他代表失败，
                                    100：没有USBKEY设备或者打开设备失败
                                    102：用户取消了口令输入
                                    103：用户登录失败或者用户口令输入不正确
	                                  104：获取签名长度失败
	                                  105：签名过程中出错
                                    114：获得用户ID值失败
                      属性二optval、组合签名结果值          
* 其它说明：  
* 修改日期		修改人	      修改内容       电子邮箱
* ------------------------------------------------------------------------------
* 2011-09-15	许华锋	      创建           xuhuafeng@bris.cn
*******************************************************************************/
Ukey.prototype.sigCombineDataEx= function(RandomData) {
	var ukey_eahthenticator = document.all.eahthenticator;
	if (!ukey_eahthenticator) {
		Ukey.prototype.init();
	}
	var result=document.all.eahthenticator.SigCombineDataEx(RandomData);
		var obj=new Object();
	if(result==0){
		obj.result=result;
		obj.optval=this.getSigCombineData();
	}
	else{
	  obj.result=result;
		obj.optval="";
	}
	return obj;
};

/*******************************************************************************
* 函数名称：  getSigCombineData	
* 功能描述：	得到签名后的组合数据
* 输入参数：  无；
* 输出参数：	无；
* 返 回 值：	签名后的组合数据，若为空（""），表示获取失败。
* 其它说明：  
* 修改日期		修改人	      修改内容       电子邮箱
* ------------------------------------------------------------------------------
* 2011-09-15	许华锋	      创建           xuhuafeng@bris.cn
*******************************************************************************/
Ukey.prototype.getSigCombineData = function() {
	var ukey_eahthenticator = document.all.eahthenticator;
	if (!ukey_eahthenticator) {
		Ukey.prototype.init();
	}
	return document.all.eahthenticator.GetSigCombineData();
};

/*******************************************************************************
* 函数名称：  changeUserPin
* 功能描述：	修改UKey用户密码；
* 输入参数：  无；
* 输出参数：	无；
* 返 回 值：	100：没有USBKEY设备或者打开设备失败
	            102：用户取消了口令输入
	            111：输入的两次新口令不相同
	            112：口令的长度不是6位
	            113：口令修改过程中出错
              0：  正确
* 其它说明：  
* 修改日期		修改人	      修改内容       电子邮箱
* ------------------------------------------------------------------------------
* 2011-09-15	许华锋	      创建           xuhuafeng@bris.cn
*******************************************************************************/
Ukey.prototype.changeUserPin = function() {
	var ukey_eahthenticator = document.all.eahthenticator;
	if (!ukey_eahthenticator) {
		Ukey.prototype.init();
	}
	return document.all.eahthenticator.ChangeUserPin();
};

/*******************************************************************************
* 函数名称：  getIdentityId；
* 功能描述：	获得用户ID值；
* 输入参数：  keyno：是设备编号，此处设为0；
* 输出参数：	无；
* 返 回 值：	用户ID的值，若为空（""），表示获取失败。
              
* 其它说明：  
* 修改日期		修改人	      修改内容       电子邮箱
* ------------------------------------------------------------------------------
* 2011-09-15	许华锋	      创建           xuhuafeng@bris.cn
*******************************************************************************/
Ukey.prototype.getIdentityId = function(keyno) {
	var ukey_eahthenticator = document.all.eahthenticator;
	if (!ukey_eahthenticator) {
		Ukey.prototype.init();
	}
	return document.all.eahthenticator.GetIdentityID(keyno);
};



/*******************************************************************************
* 函数名称：  getID
* 功能描述：	获得用户ID值，管理员获取用；
* 输入参数：  无；
* 输出参数：	无；
* 返 回 值：	用户ID的值，若为空（""），表示获取失败
* 其它说明：  
* 修改日期		修改人	      修改内容       电子邮箱
* ------------------------------------------------------------------------------
* 2011-09-15	许华锋	      创建           xuhuafeng@bris.cn
*******************************************************************************/
Ukey.prototype.getID = function() {
	var ukey_eahthenticator = document.all.eahthenticator;
	if (!ukey_eahthenticator) {
		Ukey.prototype.init();
	}
	return document.all.eahthenticator.GetID();
};