/**
 * @version V1.0
 */
package com.pcts.common.base.security;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * @author zhangtao, 2014年11月20日 下午10:53:00
 *	<p>
 * 	<b>Description<b><p>
 * 
 */
//@Transactional(readOnly = true)
public class MyAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
//	private RequestCache requestCache = new HttpSessionRequestCache();
////	@Autowired
//	private UserInfoDao userDao;
//	
//	private String checkLogin;
//	public String getCheckLogin() {
//		return checkLogin;
//	}
//	public void setCheckLogin(String checkLogin) {
//		this.checkLogin = checkLogin;
//	}
//
//	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
//		SavedRequest savedRequest = requestCache.getRequest(request, response);
//
//		// 参考Lingo 的Spring security 3.0文档 附录 C. Spring Security-3.0.0.M1
//		HttpSession session = request.getSession();
//		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//		UserInfo currentUser = userDao.findUniqueBy("login_name", userDetails.getUsername().toString());
//		session.setAttribute("userInfo", currentUser);
//
//		// /** 整合jfroum 单点登录 */
//		Cookie cookie = null;
//		if (currentUser.getId() != null && (currentUser.getId().equals("1") || currentUser.getLogin_name().equals("admin"))) {
//			cookie = new Cookie("jforumSSOCookieNameUser", URLEncoder.encode("Admin", "utf-8"));
//		} else {
//			cookie = new Cookie("jforumSSOCookieNameUser", URLEncoder.encode(currentUser.getName() + "(" + currentUser.getLogin_name() + ")", "utf-8"));
//		}
//		cookie.setMaxAge(-1);
//		cookie.setPath("/");
//		response.addCookie(cookie);
//		
//		checkLogin=request.getParameter("checkLogin");//接收Login2.action
//		
//		if ("checkLogin".equals(checkLogin)) {
//			requestCache.removeRequest(request, response);
//			getRedirectStrategy().sendRedirect(request, response, "/login.action");
//			return;
//		}
//
//		if (savedRequest == null) {
//			super.onAuthenticationSuccess(request, response, authentication);
//			return;
//		}
//
//		if (isAlwaysUseDefaultTargetUrl() || StringUtils.hasText(request.getParameter(getTargetUrlParameter()))) {
//			requestCache.removeRequest(request, response);
//			super.onAuthenticationSuccess(request, response, authentication);
//			return;
//		}
//		//clearAuthenticationAttributes(request);
//		// Use the DefaultSavedRequest URL
//		String targetUrl = savedRequest.getRedirectUrl();
//		logger.debug("Redirecting to DefaultSavedRequest Url: " + targetUrl);
//		getRedirectStrategy().sendRedirect(request, response, targetUrl);
//		return;
//	}
}
