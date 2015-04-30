package com.pcts.core.userinfo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.pcts.common.base.id.IdEntity;
import com.pcts.common.constants.PctsConstant;

/**
 * 
 * @author zhangtao, 2014年10月23日 下午11:02:36
 *	<p>
 * 	<b>Description<b><p>
 *	
 *	用户信息表
 */
@SuppressWarnings("serial")
@Entity
@Table(name = PctsConstant.SYS_PREFIX+"USER_INFO")
public class UserInfo extends IdEntity {
	/**
	 * 用户名
	 */
	private String username;
	/**
	 * 姓名
	 */
	private String name;
	/**
	 * 密码
	 */
	private String password;
	/**
	 * 工号
	 */
	private String sn;
	/**
	 * 电话
	 */
	private String phone;
	/**
	 * email
	 */
	private String email;
	/**
	 * ip
	 */
	private String ip;
	/**
	 * 状态
	 */
	private String state;
	
	@Column(length = 20)
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	@Column(length = 20)
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Column(length = 64)
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	@Column(length = 20)
	public String getSn() {
		return sn;
	}
	public void setSn(String sn) {
		this.sn = sn;
	}
	
	@Column(length = 20)
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
	@Column(length = 50)
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	@Column(length = 50)
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	
	@Column(length = 4)
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
}
