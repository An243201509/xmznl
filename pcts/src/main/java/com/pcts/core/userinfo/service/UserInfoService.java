package com.pcts.core.userinfo.service;

import org.springframework.stereotype.Service;
import com.pcts.core.userinfo.entity.UserInfo;

/**
 * 
 * @author zhangtao, 2014年10月30日 下午10:29:51
 *	<p>
 * 	<b>Description<b><p>
 * 	
 *	用户信息Service
 */
@Service
public interface UserInfoService {
	
	public void save(UserInfo entity);
}
