/**
 * @version V1.0
 */
package com.pcts.common.base.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * @author zhangtao, 2014年11月20日 下午10:38:35
 *	<p>
 * 	<b>Description<b><p>
 * 
 */
public class MyUsernamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	
	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
//		Authentication authentication = super.attemptAuthentication(request, response);
//		Object obj = authentication.getPrincipal();
//		UserSession uSession = null;
//		if (obj instanceof UserSession) {
//			uSession = (UserSession) obj;
//		}
//		if (null != uSession) {
////			UserInfo user = uSession.getUser();
//			//禁止从外网登陆
//			System.out.println(request.getServerName());
//			if (request.getServerName().equals("")) {
//				throw new AuthenticationServiceException("禁止外网登陆！");
//			}
//		}

		return null;//authentication;
	}
}
