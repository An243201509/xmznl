/**
 * @version V1.0
 */
package com.pcts.core.portal.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.pcts.common.base.id.IdEntity;
import com.pcts.common.constants.PctsConstant;

/**
 * @author zhangtao, 2015年4月30日 下午3:30:30
 *	<p>
 *  <b>Description<b><p>
 *	
 */
@Entity
@Table(name = PctsConstant.SYS_PREFIX+"PORTAL_MENU")
public class PortalMenu extends IdEntity {

	private static final long serialVersionUID = 5305850674489887372L;

	/**
	 * 功能菜单名称
	 */
	private String funcname;
	
	/**
	 * 功能描述
	 */
	private String description;
	
	/**
	 * 是否主菜单 1-是，0-否
	 */
	private String ismenu;
	/**
	 * 父菜单id
	 */
	private String fatherid;
	/**
	 * 排序
	 */
	private String odr;
	/**
	 * 菜单图标
	 */
	private String icon;
	
	@Column(length=100)
	public String getFuncname() {
		return funcname;
	}
	public void setFuncname(String funcname) {
		this.funcname = funcname;
	}
	
	@Column(length=200)
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	@Column(length=1)
	public String getIsmenu() {
		return ismenu;
	}
	public void setIsmenu(String ismenu) {
		this.ismenu = ismenu;
	}
	
	@Column(length=20)
	public String getFatherid() {
		return fatherid;
	}
	public void setFatherid(String fatherid) {
		this.fatherid = fatherid;
	}
	
	public String getOdr() {
		return odr;
	}
	public void setOdr(String odr) {
		this.odr = odr;
	}
	
	@Column(length=100)
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
}
