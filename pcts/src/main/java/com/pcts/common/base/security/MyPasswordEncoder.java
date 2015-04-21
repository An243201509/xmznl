package com.pcts.common.base.security;


import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.util.encrypt.DESDecrypt;

/**
 * 
 * spring 安全认证 自定义密码解密
 *
 */
//@Component
//@Transactional(readOnly = true)
public class MyPasswordEncoder implements PasswordEncoder {

	public String encodePassword(String encPass, Object salt) throws DataAccessException {

		String pass = null;
		try {
			pass = DESDecrypt.decrypt(encPass);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pass;
	}

	public boolean isPasswordValid(String encPass, String rawPass, Object salt) throws DataAccessException {
		String pass1 = encodePassword(encPass, salt);
		String pass2 = "" + rawPass;
		return pass1.equals(pass2);
	}

}