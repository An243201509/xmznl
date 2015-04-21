package com.pcts.core.menumanage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.pcts.common.base.controller.AbsController;
import com.pcts.core.menumanage.service.MenuService;

/**
 * 
 * @author zhangtao, 2014年11月11日 下午4:35:51
 *	<p>
 *  <b>Description<b><p>
 *
 *	功能菜单Action
 */
@Controller
public class MenuAction extends AbsController {
	@Autowired
	private MenuService menuSvc;
	/** 门户功能菜单Id */
	private String portalid;
	
	/**
	 * 根据父节点ID获取功能菜单列表
	 * @return
	 */
	public String list(){
//		if(portalid == null || "-1".equals(portalid)){
//			return JSON;
//		}
//		List<FuncTreeVO> list = menuSvc.getList(portalid);
//		jsonString = JsonUtil.JsonFilter(list);
		return null;
	}

	
	public String getPortalid() {
		return portalid;
	}

	public void setPortalid(String portalid) {
		this.portalid = portalid;
	}
}
