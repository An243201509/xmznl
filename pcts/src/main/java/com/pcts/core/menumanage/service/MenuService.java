/**
 * @version V1.0
 */
package com.pcts.core.menumanage.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.base.service.BaseService;
import com.pcts.core.menumanage.bo.FuncTreeVO;
import com.pcts.core.menumanage.dao.MenuDao;
import com.pcts.core.menumanage.entity.FuncMenu;
import com.pcts.core.menumanage.entity.PortalMenu;

/**
 * @author zhangtao, 2014年10月27日 下午2:17:06
 *         <p>
 *         <b>Description<b>
 *         <p>
 * 
 *         系统功能菜单 Service
 */
@Service
@Transactional
public class MenuService extends BaseService<PortalMenu> {

	@Autowired
	private MenuDao menuDao;

	/**
	 * 获取系统功能菜单
	 * 
	 * @return
	 */
	@Transactional(readOnly = true)
	public List<PortalMenu> getList() {
		return menuDao.getPortalMenuList();
	}

	/**
	 * 根据父级菜单Id获取系统功能菜单
	 * 
	 * @param parentId
	 * @return
	 */
	@Transactional(readOnly = true)
	public List<FuncTreeVO> getList(String portalid) {
		List<FuncTreeVO> funcTreeList = null;
		List<FuncMenu> funcList = menuDao.getFuncMenuList(portalid);
		
		if (funcList != null && !funcList.isEmpty()) {
			Map<String, FuncMenu> funcMap = new HashMap<String, FuncMenu>(funcList.size());
			Map<String, List<String>> childIdMap = new HashMap<String, List<String>>();
			List<String> topIdList = new ArrayList<String>();
			for (FuncMenu func : funcList) {
				funcMap.put(func.getId(), func);
				if (func.getParent_id() == null || func.getParent_id().equals("-1")) {
					topIdList.add(func.getId());
				} else {
					List<String> childIdList = childIdMap.get(func.getParent_id());
					if (childIdList == null) {
						childIdList = new ArrayList<String>();
					}
					childIdList.add(func.getId());
					childIdMap.put(func.getParent_id(), childIdList);
				}
			}
			funcTreeList = new ArrayList<FuncTreeVO>(topIdList.size());
			boolean isOrder = true;
			Map<String, FuncMenu> treeMap = new TreeMap<String, FuncMenu>();
			for (String funcId : topIdList) {
				FuncMenu childFunc = funcMap.get(funcId);
				if (treeMap.containsKey(childFunc.getOrder_no())) {
					isOrder = false;
					break;
				}
				treeMap.put(childFunc.getOrder_no(), childFunc);
			}
			if (!treeMap.isEmpty() && isOrder) {
				topIdList.clear();
				Iterator<FuncMenu> it = treeMap.values().iterator();
				while (it.hasNext()) {
					topIdList.add(((FuncMenu) it.next()).getId());
				}
			}
			for (String topid : topIdList) {
				funcTreeList.add(convert2AppFunc(topid, funcMap, childIdMap));
			}
			return funcTreeList;
		}      
//		  PortalAppFunc custonRoot = new PortalAppFunc();
//        custonRoot.setAppId(appConf.getAppId());
//        custonRoot.setAppConfId(appConf == null ? null : appConf.getId());
//        custonRoot.setId("custom-functions-root");
//        custonRoot.setIsCustom(Boolean.valueOf(true));
//        custonRoot.setText("自定义功能组");
//        custonRoot.setType("1");
//        custonRoot.setChildren(null);
//        custonRoot.setLeaf(Boolean.valueOf(false));
//        if (portalAppFuncList == null) {
//          portalAppFuncList = new ArrayList();
//        }
//        portalAppFuncList.add(custonRoot);
//      }
		return funcTreeList;
	}

	/**
	 * 封装功能树数据
	 * 
	 * @param funcId
	 * @param funcMap
	 * @param childIdMap
	 * @return
	 */
	@Transactional(readOnly = true)
	public FuncTreeVO convert2AppFunc(String funcId, Map<String, FuncMenu> funcMap, Map<String, List<String>> childIdMap) {
		FuncMenu currFunc = (FuncMenu) funcMap.get(funcId);

		FuncTreeVO funcTree = new FuncTreeVO();
		funcTree.setId(currFunc.getId());
		funcTree.setAppId(currFunc.getPortal_id());
//		funcTree.setAppConfId(null);
		funcTree.setAppFuncId(currFunc.getId());
		funcTree.setIsCustom(Boolean.valueOf(false));
		funcTree.setText(currFunc.getName());
		funcTree.setResTypeCode(null);
		funcTree.setDraggable(false);

		if (currFunc.getType() == 0)
			funcTree.setType("1");
		else if (currFunc.getType() == 1)
			funcTree.setType("2");
		else {
			funcTree.setType("3");
		}
		funcTree.setUrl(currFunc.getUrl());

		List<String> childIdList = (List<String>) childIdMap.get(currFunc.getId());
		funcTree.setLeaf(Boolean.valueOf((childIdList == null) || (childIdList.size() == 0)));
		if (childIdList != null) {
			List<FuncTreeVO> childFuncTreeList = new ArrayList<FuncTreeVO>(childIdList.size());
			boolean isOrder = true;
			Map<String, FuncMenu> treeMap = new TreeMap<String, FuncMenu>();
			for (String funcid : childIdList) {
				FuncMenu childFunc = (FuncMenu) funcMap.get(funcid);
				if (treeMap.containsKey(childFunc.getOrder_no())) {
					isOrder = false;
					break;
				}
				treeMap.put(childFunc.getOrder_no(), childFunc);
			}

			if (!treeMap.isEmpty() && isOrder) {
				childIdList.clear();
				Iterator<FuncMenu> it = treeMap.values().iterator();
				while (it.hasNext()) {
					childIdList.add(((FuncMenu) it.next()).getId());
				}
			}
			for (String childFuncId : childIdList) {
				FuncTreeVO childFuncTree = convert2AppFunc(childFuncId, funcMap, childIdMap);
				if (childFuncTree != null) {
					childFuncTreeList.add(childFuncTree);
				}
			}
			funcTree.setChildren(childFuncTreeList);
		}
		return funcTree;
	}
}
