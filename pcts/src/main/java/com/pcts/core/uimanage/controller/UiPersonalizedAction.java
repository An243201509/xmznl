/**
 * @version V1.0
 */
package com.pcts.core.uimanage.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.pcts.common.base.controller.AbsController;
import com.pcts.core.uimanage.service.UiPersonalizedService;

/**
 * @author zhangtao, 2014年11月30日 下午11:03:51
 *	<p>
 * 	<b>Description<b><p>
 * 	
 * 	用户界面的个性化配置
 */
@Controller
public class UiPersonalizedAction extends AbsController {
	@Autowired
	private UiPersonalizedService uiPersonalizedSvc;
	/** 访问路径 */
	private String path;
	/** 个性化内容  */
	private String content;
	
	/**
	 * 保存用户个性化信息
	 * @return
	 */
	public String save(){
//		userInfo = getUserInfo();
//		UiPersonalized entity = new UiPersonalized();
//		if(userInfo != null){
//			entity.setUserId(userInfo.getId());
//			entity.setPath(path);
//			entity.setContent(content);
//		}
//		uiPersonalizedSvc.save(entity);
//		jsonString = "{success:true}";
		return null;
	}
	
	/**
	 * 获取用户个性化信息
	 * @return
	 */
	public String get(){
//		jsonString = uiPersonalizedSvc.get(getUserInfo().getId(), path);
		return null;
	}
	
	

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}
