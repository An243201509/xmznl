package com.pcts.core.usermanage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.core.usermanage.entity.UserInfo;

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
