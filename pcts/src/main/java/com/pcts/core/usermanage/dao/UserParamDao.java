package com.pcts.core.usermanage.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.springframework.stereotype.Component;

import com.pcts.common.base.dao.BaseDao;
import com.pcts.core.usermanage.entity.UserParam;

/**
 * 
 * @author zhangtao, 2014年10月26日 下午4:41:51
 *	<p>
 * 	<b>Description<b><p>
 * 	
 *	用户自定义参数Dao
 */
@Component
public class UserParamDao extends BaseDao<UserParam> {
	
	/**
	 * 根据用户Id和参数Id获取用户自定义参数信息
	 * @param userinfoid
	 * @param paramsid
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	public Map<String, UserParam> getList(String userinfoid, String[] paramsid){
		Map<String, UserParam> map = new HashMap<String, UserParam>();
		StringBuffer sql = new StringBuffer();
		sql.append("from UserParam u where u.user_id = :userinfoid and u.param_id in (:paramid)");
		Query query = getSession().createQuery(sql.toString());
		query.setParameter("userinfoid", userinfoid);
		query.setParameterList("paramid", paramsid);
		List<UserParam> list = query.list();
		if(list != null && list.size() > 0){
			for(UserParam param : list){
				map.put(param.getParam_id(), param);
			}
		}
		return map;
	}

	@Override
	protected Class<UserParam> getEntityClass() {
		return UserParam.class;
	}

}
