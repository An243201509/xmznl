/**
 * @version V1.0
 */
package com.pcts.core.login.service.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.pcts.core.login.service.LoginUserService;
import com.pcts.core.userinfo.entity.UserInfo;

/**
 * @author zhangtao, 2015年3月26日 上午10:51:05
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
public class LoginUserServiceImpl implements LoginUserService {
	
	private Map<String, UserInfo> loginUsers = new ConcurrentHashMap<String, UserInfo>();

	@Override
	public Map<String, UserInfo> getLoginUsers() {
		return this.loginUsers;
	}

	@Override
	public void addLoginUser(UserInfo userinfo) {
		this.loginUsers.put(userinfo.getUsername(), userinfo);
	}

	@Override
	public void removeLoginUser(UserInfo userinfo) {
		removeLoginUser(userinfo.getUsername());
	}

	@Override
	public void removeLoginUser(String username) {
		if(username != null){
			this.loginUsers.remove(username);
		}
	}

	@Override
	public UserInfo getLoginUser(String username) {
		if(username != null){
			return (UserInfo)this.loginUsers.get(username);
		}
		return null;
	}
}
