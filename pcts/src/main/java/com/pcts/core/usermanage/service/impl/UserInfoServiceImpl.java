/**
 * @version V1.0
 */
package com.pcts.core.usermanage.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.core.usermanage.dao.UserInfoDao;
import com.pcts.core.usermanage.entity.UserInfo;
import com.pcts.core.usermanage.service.UserInfoService;

/**
 * @author zhangtao, 2015年4月29日 下午4:19:04
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
@Transactional
public class UserInfoServiceImpl implements UserInfoService {
	
	@Autowired
	private UserInfoDao userInfoDao;

	@Override
	public void save(UserInfo entity) {
		userInfoDao.save(entity);
		
	}

}
