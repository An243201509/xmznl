package com.pcts.core.userinfo.dao;


import org.springframework.stereotype.Repository;

import com.pcts.common.base.dao.BaseDao;
import com.pcts.core.userinfo.entity.UserInfo;

/**
 * 
 * @author zhangtao, 2014年11月17日 下午5:14:34
 *	<p>
 *  <b>Description<b><p>
 *
 *	用户信息
 */
@Repository
public class UserInfoDao extends BaseDao<UserInfo> {

	@Override
	protected Class<UserInfo> getEntityClass() {
		return UserInfo.class;
	}

}
