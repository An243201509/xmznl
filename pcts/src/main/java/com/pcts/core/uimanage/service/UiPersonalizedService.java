/**
 * @version V1.0
 */
package com.pcts.core.uimanage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.base.service.BaseService;
import com.pcts.core.uimanage.dao.UiPersonalizedDao;
import com.pcts.core.usermanage.entity.UiPersonalized;

/**
 * @author zhangtao, 2014年11月30日 下午11:09:01
 *	<p>
 * 	<b>Description<b><p>
 * 
 * 	用户界面个性化
 */
@Service
@Transactional
public class UiPersonalizedService extends BaseService<UiPersonalized>{
	
	@Autowired
	private UiPersonalizedDao uiPersonalizedDao;
	
	public List<UiPersonalized> list;
	/**
	 * 保存用户个性化信息
	 * @param uiPersonalized
	 */
	public void save(UiPersonalized entity){
		beforeSave(entity);
		uiPersonalizedDao.save(entity);
		init();
	}
	
	/**
	 * 获取用户个性化信息
	 * @param userid
	 * @param path
	 * @return
	 */
	@Transactional(readOnly = true)
	public String get(String userid, String path){
		if(this.list == null){
			init();
		}
		
		for(UiPersonalized uip : this.list){
			if(userid.equals(uip.getUserId()) && path.equals(uip.getPath())){
				return uip.getContent();
			}
		}
		return "";
	}
	
	
	private void beforeSave(UiPersonalized entity){
		String hql = "delete from UiPersonalized where userId = ?";
		uiPersonalizedDao.createQuery(hql, entity.getUserId());
	}
	
	private void init(){
		this.list = uiPersonalizedDao.findAll();
	}
}
