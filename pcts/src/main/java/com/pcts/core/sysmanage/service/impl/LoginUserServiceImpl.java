/**
 * @version V1.0
 */
package com.pcts.core.sysmanage.service.impl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.pcts.core.sysmanage.service.LoginUserService;
import com.pcts.core.usermanage.entity.UserInfo;

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
	public void addLoginUser(UserInfo user) {
		this.loginUsers.put(user.getLoginName(), user);
	}

	@Override
	public void removeLoginUser(UserInfo user) {
		removeLoginUser(user.getLoginName());
	}

	@Override
	public void removeLoginUser(String loginName) {
		if(loginName != null){
			this.loginUsers.remove(loginName);
		}
	}

	@Override
	public UserInfo getLoginUser(String paramString) {
		// TODO Auto-generated method stub
		return null;
	}
}
