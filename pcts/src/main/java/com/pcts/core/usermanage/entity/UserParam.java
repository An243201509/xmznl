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
 * @author zhangtao, 2014年10月26日 下午3:34:02
 *	<p>
 * 	<b>Description<b><p>
 * 	用户自定义参数表
 */
@SuppressWarnings("serial")
@Entity
@Table(name = PctsConstant.SYS_PREFIX + "USER_PARAM")
public class UserParam extends IdEntity {
	
	/**
	 * 用户信息id
	 */
	private String user_id;
	/**
	 * 用户参数标识符
	 */
	private String param_id;
	/**
	 * 参数值
	 */
	private String param_value;
	
	@Column(length = 20, nullable = true)
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	
	@Column(length = 4)
	public String getParam_id() {
		return param_id;
	}
	public void setParam_id(String param_id) {
		this.param_id = param_id;
	}
	
	@Column(length = 2000)
	public String getParam_value() {
		return param_value;
	}
	public void setParam_value(String param_value) {
		this.param_value = param_value;
	}
}
