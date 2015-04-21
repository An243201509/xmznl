package com.pcts.core.menumanage.entity;

import java.sql.Blob;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import com.pcts.common.base.id.IdEntity;
import com.pcts.common.constants.PctsConstant;

/**
 * 
 * @author zhangtao, 2014年10月23日 下午10:32:01
 *         <p>
 *         <b>Description<b>
 *         <p>
 *
 *         系统门户菜单表
 */
@SuppressWarnings("serial")
@Entity
@Table(name = PctsConstant.SYS_PREFIX + "Portal_Menu")
public class PortalMenu extends IdEntity {
	/**
	 * 菜单名称
	 */
	private String name;
	/**
	 * 菜单图标
	 */
	private String icon;
	/**
	 * 菜单图片
	 */
	private Blob img;
	/**
	 * 菜单备注
	 */
	private String remark;
	/**
	 * 排序
	 */
	private String order_no;
	/**
	 * 菜单类型
	 */
	private int type;

	@Column(length = 100)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(length = 100)
	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@Lob
	public Blob getImg() {
		return img;
	}

	public void setImg(Blob img) {
		this.img = img;
	}

	@Column(length = 200)
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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
}
