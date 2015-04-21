package com.pcts.core.usermanage.service;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.base.service.BaseService;
import com.pcts.core.usermanage.dao.UserParamDao;
import com.pcts.core.usermanage.entity.UserParam;

/**
 * 
 * @author zhangtao, 2014年10月26日 下午4:43:15
 *	<p>
 * 	<b>Description<b><p>
 *
 *	用户自定义参数 Service
 */
@Service
@Transactional
public class UserParamService extends BaseService<UserParam> {
	
	@Resource
	private UserParamDao userParamsDao;
	
	/**
	 * 根据用户Id和参数Id获取用户自定义参数信息
	 * @param userinfoid
	 * @param paramsid
	 * @return
	 */
	@Transactional(readOnly = true)
	public Map<String, UserParam> getList(String userinfoid, String[] paramsid){
		return userParamsDao.getList(userinfoid, paramsid);
	}

}
