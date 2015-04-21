package com.pcts.core.usermanage.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.base.page.Page;
import com.pcts.common.base.service.BaseService;
import com.pcts.common.base.service.IBaseService;
import com.pcts.core.usermanage.dao.UserInfoDao;
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
@Transactional
public class UserInfoService extends BaseService<UserInfo> implements IBaseService<UserInfo> {
	
	@Autowired
	private UserInfoDao userInfoDao;
	
	public Page findPage() {
//		Page page = new Page();
//		String hql = "from UserInfo ";
		return null;//userInfoDao.findPage(page, hql);
	}
}
