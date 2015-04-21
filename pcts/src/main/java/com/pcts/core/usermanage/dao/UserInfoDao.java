package com.pcts.core.usermanage.dao;


import org.springframework.stereotype.Component;

import com.pcts.common.base.dao.BaseDao;
import com.pcts.core.usermanage.entity.UserInfo;

/**
 * 
 * @author zhangtao, 2014年11月17日 下午5:14:34
 *	<p>
 *  <b>Description<b><p>
 *
 *	用户信息
 */
@Component
public class UserInfoDao extends BaseDao<UserInfo> {

	@Override
	protected Class<UserInfo> getEntityClass() {
		return UserInfo.class;
	}

}
