/**
 * @version V1.0
 */
package com.pcts.core.portal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.core.portal.dao.PortalMenuDao;
import com.pcts.core.portal.entity.PortalMenu;

/**
 * @author zhangtao, 2015年4月30日 下午3:45:56
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Service
@Transactional
public class ProtalMenuService {
	@Autowired
	private PortalMenuDao portalMenuDao;
	
	/**
	 * 获取门户菜单列表
	 * @return
	 */
	public List<PortalMenu> getPortalMenuList(){
		return portalMenuDao.getPortalMenuList();
	}

}
