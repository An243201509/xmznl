/**
 * @version V1.0
 */
package com.pcts.core.portal.dao;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.pcts.common.base.dao.BaseDao;
import com.pcts.core.portal.entity.PortalMenu;

/**
 * @author zhangtao, 2015年4月30日 下午3:40:32
 *	<p>
 *  <b>Description<b><p>
 *  
 *  门户菜单Dao
 *	
 */
@Repository
public class PortalMenuDao extends BaseDao<PortalMenu> {
	
	/**
	 * 获取门户菜单列表
	 * @param userId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<PortalMenu> getPortalMenuList(){
		List<PortalMenu> list = null;
		StringBuffer sql = new StringBuffer("from PortalMenu p where p.ismenu = '1' order by p.odr asc");
		Query query = this.getSession().createQuery(sql.toString());
		list = query.list();
		return list;
	}

	@Override
	protected Class<PortalMenu> getEntityClass() {
		return PortalMenu.class;
	}

}
