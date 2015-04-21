/**
 * @version V1.0
 */
package com.pcts.core.usermanage.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.pcts.common.base.controller.AbsController;
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
public class UserInfoAction extends AbsController {
	@Autowired
	private UserInfoService userSvc;
	/**
	 * 获取用户信息列表
	 * @return
	 */
	public String list(){
//		Page page = userSvc.findPage();
//		jsonString = JsonUtil.JsonFilter(page, "password");
		return null;
	}
	
	
	public static void main(String arg[]){
		List<UserInfo> list = new ArrayList<UserInfo>();
		UserInfo user = new UserInfo();
		user.setId("1");
		user.setUserName("111");
		list.add(user);
//		String jsonString = JsonUtil.JsonFilter(list);
	}
	
	/**
	 * 修改用户密码
	 * @return
	 */
	public String updatePwd(){
//		UserInfo userinfo = getUserInfo();
		
		return null;
	}
}
