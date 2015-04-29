package com.pcts.core.sysmanage.controller;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.pcts.core.sysmanage.service.LoginService;
import com.pcts.core.sysmanage.service.LoginUserService;

/**
 * 
 * @author zhangtao, 2014-10-13 22:47
 *         <p>
 *         Description: 用户登录
 *         <p>
 * 
 */
@Controller
public class LoginController {
	
	@Autowired
	private LoginService loginService;
	
	@Autowired
	private LoginUserService loginUserService;
	
	/**
	 * 获取用户IP
	 * @param request
	 * @return
	 */
	@SuppressWarnings("unused")
	private static String getIp(ServletRequest request) {
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		String ip = httpRequest.getHeader("x-forwarded-for");
		if ((ip == null) || (ip.length() == 0) || ("unknown".equalsIgnoreCase(ip))) {
			ip = httpRequest.getHeader("Proxy-Client-IP");
		}
		if ((ip == null) || (ip.length() == 0) || ("unknown".equalsIgnoreCase(ip))) {
			ip = httpRequest.getHeader("WL-Proxy-Client-IP");
		}
		if ((ip == null) || (ip.length() == 0) || ("unknown".equalsIgnoreCase(ip))) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}
	
	/**
	 * 获取Homepage页面信息
	 * 
	 * @return
	 */
	@RequestMapping({"/login"})
	public ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String loginname = request.getParameter("loginname");
		String password = request.getParameter("password");
		String error= "";
	    if(loginname != null){
	    	String errorCode = loginService.login(loginname, password);
	    	if(errorCode != null){
	    		error = ErrorCode.getErrorMessage(errorCode);
		    	request.setAttribute("loginError", error);
		        return new ModelAndView("login");
	    	}else{
	    		return new ModelAndView("homepage");
	    	}
	    	
	    }else{
	    	error = ErrorCode.getErrorMessage("username.neq");
	    	request.setAttribute("loginError", error);
	        return new ModelAndView("login");
	    }
	}

	/**
	 * 界面锁定状态下登录系统
	 * 
	 * @return
	 */
	public String lockLogin() {
//		HttpSession session = this.getSession();
//		UserInfo userinfo = session == null ? null : (UserInfo) session.getAttribute("userInfo");
//		if (userinfo == null) {
//			jsonString = "{success:false,data:'sessionInvalidate',msg:'会话失效，请重新登陆！'}";
//		} else {
//			jsonString = loginSvc.lockLogin(userinfo, password, session);
//		}
		return null;
	}

	/**
	 * 用户锁 - 锁定
	 * 
	 * @return
	 */
	public String lock() {
//		HttpSession session = this.getSession();
//		if (session != null) {
//			session.setAttribute("lock", "lock");
//		}
//		jsonString = "{success:true}";
		return null;
	}

	/**
	 * 初始化界面/刷新 验证当前是否为锁定状态
	 * 
	 * @return
	 */
	public String isLock() {
//		String lock = (String) this.getSession().getAttribute("lock");
//		if (lock != null) {
//			jsonString = "{success:true}";
//		} else {
//			jsonString = "{success:false}";
//		}
		return null;
	}

	/**
	 * 获取锁屏时间
	 * 
	 * @return
	 */
	public String lockTime() {
//		long lockTime = PwdConstant.LOCK_TIME;
//		jsonString = "{success:true,data:{lockTime:" + lockTime + "}}";
		return null;
	}

	/**
	 * 首页注销功能
	 * 
	 * @return
	 */
	public String logout() {
//		this.getSession().removeAttribute("userInfo");
//		jsonString = "{success:true}";
		return null;
	}
}
