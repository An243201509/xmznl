/**
 * @version V1.0
 */
package com.pcts.core.sysmanage.service;

import com.pcts.core.usermanage.entity.UserInfo;

/**
 * @author zhangtao, 2015年3月26日 下午4:56:15
 *	<p>
 *  <b>Description<b><p>
 *	
 */
public abstract interface LoginService {
	
	public abstract UserInfo login(String loginname, String password);

}
