/**
 * @version V1.0
 */
package com.pcts.common.base.security;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.collect.Sets;

/**
 * @author zhangtao, 2014年11月20日 下午9:58:57
 *	<p>
 * 	<b>Description<b><p>
 * 
 * 	实现SpringSecurity的UserDetailsService接口,实现获取用户Detail信息的回调函数.
 * 
 */
//@Component
//@Transactional(readOnly = true)
public class MyUserDetailsService implements UserDetailsService {

	@Override
	public UserDetails loadUserByUsername(String arg0) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}
//	@Autowired
//	private UserInfoService userSvc;
//	private String message;
//
//	/**
//	 * 获取用户Details信息的回调函数.
//	 */
//	@Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException, DataAccessException {
//		UserInfo user = userSvc.findUniqueByLoginName(username);
//		if (user == null) {
//			message = "用户:" + username + " 不存在!";
//			throw new UsernameNotFoundException("用户:" + username + " 不存在!");
//		}
//		
//		Set<GrantedAuthority> grantedAuths = obtainGrantedAuthorities(user);
//		// -- mini-web示例中无以下属性, 暂时全部设为true. --//
//		boolean enabled = true;
//		boolean accountNonExpired = true;
//		boolean credentialsNonExpired = true;
//		boolean accountNonLocked = true;
//		UserDetails userdetails = new UserSession(user, user.getLogin_name(), user.getPassword(), enabled, accountNonExpired, 
//				credentialsNonExpired, accountNonLocked, grantedAuths);
//		return userdetails;
//	}
//	
//	/**
//	 * 	获得用户所有角色的权限集合.
//	 * 
//	 * @param user
//	 * @return
//	 */
//	@SuppressWarnings("deprecation")
//	private Set<GrantedAuthority> obtainGrantedAuthorities(UserInfo user) {
//		Set<GrantedAuthority> authSet = Sets.newHashSet();
//		//默认用户拥有ROLE_PUBLIC权限
//		authSet.add(new GrantedAuthorityImpl("ROLE_PUBLIC"));
//		if (user.getId() != null && user.getId().equals("1")) {
//			//超级管理员用户拥有ROLE_SUPER_ADMIN权限(不进行权限控制)
//			authSet.add(new GrantedAuthorityImpl("ROLE_ADMIN"));
//		}
//		return authSet;
//	}
//
//	public String getMessage() {
//		return message;
//	}
//
//	public void setMessage(String message) {
//		this.message = message;
//	}
}
