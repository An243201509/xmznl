/**
 * @version V1.0
 */
package com.pcts.core.sysmanage.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.pcts.core.usermanage.entity.UserInfo;

/**
 * @author zhangtao, 2015年3月26日 上午10:51:05
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
public abstract interface LoginUserService {
	
	
	public abstract Map<String, UserInfo> getLoginUsers();
	
	public abstract void addLoginUser(UserInfo paramUserInfo);

	public abstract void removeLoginUser(UserInfo paramUserInfo);

	public abstract void removeLoginUser(String paramString);

	public abstract UserInfo getLoginUser(String paramString);
	
}
