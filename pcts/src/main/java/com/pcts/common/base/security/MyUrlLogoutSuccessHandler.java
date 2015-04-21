package com.pcts.common.base.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;


//@Component
public class MyUrlLogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {
//	protected final Logger log = LoggerFactory.getLogger(getClass());
//
//	@Override
//	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//		UserSession user = (UserSession) ((authentication == null) ? null : authentication.getPrincipal());
//		HttpSession session = request.getSession();
//		String session_id = (session == null) ? "" : session.getId();
//		if (user == null) {
//			log.info("logout unknown user, session:" + session_id);
//		} else {
//			log.info("用户 " + user.getUser().getName()+ " 登出系统");
//		}
//		response.sendRedirect(request.getContextPath() + "/system/login.action");
//	}
}