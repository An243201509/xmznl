/**
 * @version V1.0
 */
package com.pcts.common.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;

/**
 * @author zhangtao, 2014年11月29日 上午10:09:36
 *	<p>
 * 	<b>Description<b><p>
 * 
 * 	Web 相关工具类
 * 
 */
public class WebUtil {
	
	/**
	 * Url转码
	 * @param url
	 * @param code
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static String encode(String url, String code) throws UnsupportedEncodingException {
		return URLEncoder.encode(url, code);
	}

	/**
	 * Url转码
	 * @param url
	 * @param code
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static String decode(String url, String code) throws UnsupportedEncodingException {
		return URLDecoder.decode(url, code);
	}
	
	/**
	 * 获取真实路径
	 * @param request
	 * @param path
	 * @return
	 */
	public static String getRealPath(HttpServletRequest request, String path) {
		String realPath = "";//request.getSession().getServletContext().getContextPath();
		if ((!"".equals(path)) && ("/".equals(path.substring(0, 1)))) {
			realPath = realPath + path.substring(1);
	    } else {
	    	realPath = realPath + path;
	    }
	    return realPath;
	}
	
	/**
	 * 获取系统路径
	 * @param request
	 * @return
	 */
	public static String getApplicationRootUrl(HttpServletRequest request) {
	    return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
	}
	
	public static String getAppRootWebContextPath(HttpServletRequest request) {
		String realRootCtx = request.getContextPath();
		int i = realRootCtx.lastIndexOf("/");
	    if (i > 0) {
	    	realRootCtx = realRootCtx.substring(0, i);
	    }
	    if (!realRootCtx.startsWith("/")) {
	    	realRootCtx = "/" + realRootCtx;
	    }
	    return realRootCtx;
	}
	  
	/**
	 * 判断是否是 Ajax请求
	 * @param request
	 * @return
	 */
	public static boolean isAJAXRequest(HttpServletRequest request) {
	    return (request.getHeader("x-requested-with") != null) && (request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest"));
	}
	
	/**
	 * 获取参数
	 * @param request
	 * @param parameter
	 * @return
	 */
	public static String getParameter(HttpServletRequest request, String parameter) {
		String val = null;
	    try {
	    	String str = URLDecoder.decode(request.getQueryString(), "UTF-8");
	    	String[] arr = str.split("&");
	    	for (String s : arr)
	    		if (s.startsWith(parameter)) {
	    			val = s.substring(s.indexOf("=") + 1);
	    			break;
	    		}
	    }catch (Throwable e) {
	      val = request.getParameter(parameter);
//	      logger.warn("获取参数[" + parameter + "]解码时出错！", e);
	    }
	    return val;
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
