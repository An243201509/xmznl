/**
 * @version V1.0
 */
package com.pcts.core.menumanage.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.pcts.common.base.id.IdEntity;
import com.pcts.common.constants.PctsConstant;

/**
 * @author zhangtao, 2014年11月18日 下午2:17:08
 *	<p>
 *  <b>Description<b><p>
 *	
 *	系统功能菜单表
 */
@SuppressWarnings("serial")
@Entity
@Table(name = PctsConstant.SYS_PREFIX + "Func_Menu")
public class FuncMenu extends IdEntity {
	/**
	 * 菜单名称
	 */
	private String name;
	/**
	 * 父级菜单Id
	 */
	private String parent_id;
	/**
	 * 门户菜单Id
	 */
	private String portal_id;
	/**
	 * 菜单Url
	 */
	private String url;
	/**
	 * 菜单备注
	 */
	private String remark;
	/**
	 * 菜单图标
	 */
	private String icon;
	/**
	 * 排序
	 */
	private String order_no;
	/**
	 * 类型
	 */
	private int type;
	
	@Column(length = 100)
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(length = 20)
	public String getParent_id() {
		return parent_id;
	}
	public void setParent_id(String parent_id) {
		this.parent_id = parent_id;
	}
	
	@Column(length = 20)
	public String getPortal_id() {
		return portal_id;
	}
	public void setPortal_id(String portal_id) {
		this.portal_id = portal_id;
	}
	
	@Column(length = 200)
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	@Column(length = 100)
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	
	@Column(length = 4)
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}
	
	@Column(length = 1)
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	
	@Column(length = 200)
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
}
