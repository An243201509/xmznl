/**
 * @version V1.0
 */
package com.pcts.core.userinfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.pcts.core.userinfo.entity.UserInfo;
import com.pcts.core.userinfo.service.UserInfoService;

/**
 * @author zhangtao, 2014年11月20日 上午11:53:40
 *	<p>
 *  <b>Description<b><p>
 *	
 *	用户信息管理
 */
@Controller
public class UserInfoController {
	@Autowired
	private UserInfoService userInfoService;
	
	
	@RequestMapping(value="/saveuser", method = RequestMethod.GET)
	public void saveuser(){
		UserInfo demo = new UserInfo();
		demo.setUsername("admin");
		demo.setName("管理员");
		demo.setPassword("f76033646430cdfcb625570d690d");
		demo.setIp("127.0.0.1");
		userInfoService.save(demo);
	}
}
