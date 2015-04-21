/**
 * @version V1.0
 */
package com.pcts.core.usermanage.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.pcts.common.base.id.IdEntity;
import com.pcts.common.constants.PctsConstant;

/**
 * @author zhangtao, 2014年11月30日 下午10:55:39
 *	<p>
 * 	<b>Description<b><p>
 * 
 * 	用户界面的个性化配置
 */
@Entity
@Table(name = PctsConstant.SYS_PREFIX + "UI_Personalized" )
@SuppressWarnings("serial")
public class UiPersonalized extends IdEntity {
	
	/** 用户Id */
	private String userId;
	/** 访问路径 */
	private String path;
	/** 个性化内容  */
	private String content;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	
	@Column(length = 4000)
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
}
