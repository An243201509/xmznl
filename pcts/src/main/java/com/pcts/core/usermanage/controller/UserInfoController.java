/**
 * @version V1.0
 */
package com.pcts.core.usermanage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.pcts.core.usermanage.entity.UserInfo;
import com.pcts.core.usermanage.service.UserInfoService;

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
		demo.setLoginName("lisi");
		userInfoService.save(demo);
	}
}
