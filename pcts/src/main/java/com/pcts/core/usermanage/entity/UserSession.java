/**
 * @version V1.0
 */
package com.pcts.core.usermanage.entity;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

/**
 * @author zhangtao, 2014年11月20日 下午10:18:23
 *	<p>
 * 	<b>Description<b><p>
 * 	
 * 	继承自User 用于存放session
 */
@SuppressWarnings("serial")
public class UserSession extends User {
	
	private UserInfo user;

	public UserSession(UserInfo user, String loginname, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
		super(loginname, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
		this.user = user;
	}

	public UserInfo getUser() {
		return user;
	}

	public void setUser(UserInfo user) {
		this.user = user;
	}
}
