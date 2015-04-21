package com.pcts.core.menumanage.dao;

import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Component;

import com.pcts.common.base.dao.BaseDao;
import com.pcts.core.menumanage.entity.FuncMenu;
import com.pcts.core.menumanage.entity.PortalMenu;

/**
 * 
 * @author zhangtao, 2014年10月27日 下午2:16:11
 *	<p>
 *  <b>Description<b><p>
 *  
 *	系统功能菜单 Dao
 */
@Component
public class MenuDao extends BaseDao<PortalMenu> {

	/**
	 * 获取功能菜单List
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<PortalMenu> getPortalMenuList(){
		StringBuffer sql = new StringBuffer();
		sql.append(" from PortalMenu f order by f.order_no asc ");
		Query query = this.getSession().createQuery(sql.toString());
		List<PortalMenu> list = query.list();
		return list;
	}
	
	/**
	 * 根据父级菜单Id获取功能列表
	 * @param portalid
	 * @param parentid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<FuncMenu> getFuncMenuList(String portalid){
		StringBuffer sql = new StringBuffer();
		sql.append(" from FuncMenu f where f.portal_id = :portalid order by f.order_no asc ");
		Query query = this.getSession().createQuery(sql.toString());
		query.setParameter("portalid", portalid);
		List<FuncMenu> list = query.list();
		return list;
	}

	@Override
	protected Class<PortalMenu> getEntityClass() {
		// TODO Auto-generated method stub
		return null;
	}
}
