/**
 * @version V1.0
 */
package com.pcts.core.login.controller;

import java.util.HashMap;
import java.util.Map;

/**
 * @author zhangtao, 2015年3月26日 上午11:05:30
 *	<p>
 *  <b>Description<b><p>
 *	存放用户登录ErrorCode
 */
public class ErrorCode {
	private static Map<String, String> ERROR_CODE = new HashMap<String, String>();

	public static String getErrorMessage(String errorCode) {
	    return (String)ERROR_CODE.get(errorCode);
	}

	static {
		ERROR_CODE.put("username.neq", "用户名错误！");
	    ERROR_CODE.put("errorCount", "此用户超过了最大容错次数，用户已被锁定，被管理员解锁后方可使用！");
	    ERROR_CODE.put("passwordOverdue", "密码已过期，系统将该用户锁定，请联系管理员协助重置密码并解锁后才能恢复正常！");
	    ERROR_CODE.put("password.neq", "密码错误！");
	    ERROR_CODE.put("check.neq", "此用户未审核！");
	    ERROR_CODE.put("lock.neq", "此用户已锁定！");
	    ERROR_CODE.put("startDate.before", "此用户未到生效日期！");
	    ERROR_CODE.put("ednDate.after", "此用户已过期！");
	    ERROR_CODE.put("login.ip.error", "此用户已在IP地址为{0}的PC上使用！");
	    ERROR_CODE.put("login.lic.notfind", "无法获取授权信息！");
	}
}
