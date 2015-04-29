/**
 * @version V1.0
 */
package com.pcts.core.sysmanage.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.util.encrypt.DESDecrypt;
import com.pcts.core.usermanage.dao.UserInfoDao;
import com.pcts.core.usermanage.entity.UserInfo;

/**
 * @author zhangtao, 2015年3月26日 下午4:56:15
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
@Transactional
public class LoginService {
	@Autowired
	private UserInfoDao userInfoDao;
	
	public String login(String loginname, String password){
		String error = null;
		UserInfo userInfo = userInfoDao.findUniqueBy("loginName", loginname);
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

}
