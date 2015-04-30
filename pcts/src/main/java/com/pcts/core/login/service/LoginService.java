/**
 * @version V1.0
 */
package com.pcts.core.login.service;

import org.springframework.stereotype.Service;

import com.pcts.core.userinfo.entity.UserInfo;

/**
 * @author zhangtao, 2015年3月26日 下午4:56:15
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
public abstract interface LoginService {
	/**
	 * 获取登录用户信息
	 * @param paramString1
	 * @param paramString2
	 * @return
	 */
	public abstract String login(String paramString1, String paramString2);
	
	/**
	 * 获取用户信息
	 * @param paramString1
	 * @param paramString2
	 * @return
	 */
	public abstract UserInfo getUserInfo(String paramString1);

}
