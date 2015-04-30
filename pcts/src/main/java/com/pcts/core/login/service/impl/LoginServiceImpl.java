/**
 * @version V1.0
 */
package com.pcts.core.login.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.util.encrypt.DESDecrypt;
import com.pcts.core.login.service.LoginService;
import com.pcts.core.userinfo.dao.UserInfoDao;
import com.pcts.core.userinfo.entity.UserInfo;

/**
 * @author zhangtao, 2015年4月30日 上午11:01:35
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
@Transactional
public class LoginServiceImpl implements LoginService {
	@Autowired
	private UserInfoDao userInfoDao;

	@Override
	public String login(String username, String password){
		String error = null;
		UserInfo userInfo = userInfoDao.findUniqueBy("username", username);
		if(userInfo != null){
			try {
				if(!password.equals(DESDecrypt.decrypt(userInfo.getPassword()))){
					error = "password.neq";
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}else{
			error = "username.neq";
		}
		return error;
	}

	@Override
	public UserInfo getUserInfo(String username) {
		UserInfo userInfo = userInfoDao.findUniqueBy("username", username);
		return userInfo;
	}
}
