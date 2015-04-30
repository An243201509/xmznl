/**
 * @version V1.0
 */
package com.pcts.core.login.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.pcts.core.userinfo.entity.UserInfo;

/**
 * @author zhangtao, 2015年3月26日 上午10:51:05
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
public abstract interface LoginUserService {
	
	/**
	 * 获取登录用户Map集合
	 * @return
	 */
	public abstract Map<String, UserInfo> getLoginUsers();
	
	/**
	 * 添加登录用户
	 * @param paramUserInfo
	 */
	public abstract void addLoginUser(UserInfo paramUserInfo);

	/**
	 * 根据登录用户对象移除用户信息
	 * @param paramUserInfo
	 */
	public abstract void removeLoginUser(UserInfo paramUserInfo);

	/**
	 * 根据登录用户名移除用户信息
	 * @param paramUserInfo
	 */
	public abstract void removeLoginUser(String paramString);

	/**
	 * 获取登录用户信息
	 * @param paramUserInfo
	 */
	public abstract UserInfo getLoginUser(String paramString);
}
