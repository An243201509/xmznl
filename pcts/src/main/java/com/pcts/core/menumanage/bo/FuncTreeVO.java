package com.pcts.core.menumanage.bo;

import java.util.List;

/**
 * 
 * @author zhangtao, 2014年11月19日 上午10:08:21
 *	<p>
 *  <b>Description<b><p>
 *  
 *  	门户功能树VO对象
 *
 */
public class FuncTreeVO {
	/** 树Id */
	private String id;
	/** 门户菜单Id */
	private String appId;
	private String appConfId = null;
	/** 类型  */
	private String type = null;
	/** 功能菜单Id  */
	private String appFuncId = null;
	/** 树显示名称  */
	private String text = null;
	/** 树功能连接  */
	private String url = null;
	private String resTypeCode = null;
	private Boolean isCustom = Boolean.valueOf(false);
	private Integer orderbyNum = null;
	private Boolean leaf = Boolean.valueOf(true);
	/** 树子节点  */
	private List<FuncTreeVO> children = null;
	private boolean draggable = false;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAppConfId() {
		return this.appConfId;
	}

	public void setAppConfId(String appConfId) {
		this.appConfId = appConfId;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}
	

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getAppFuncId() {
		return appFuncId;
	}

	public void setAppFuncId(String appFuncId) {
		this.appFuncId = appFuncId;
	}

	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getResTypeCode() {
		return this.resTypeCode;
	}

	public void setResTypeCode(String resTypeCode) {
		this.resTypeCode = resTypeCode;
	}

	public Boolean getIsCustom() {
		return this.isCustom;
	}

	public void setIsCustom(Boolean isCustom) {
		this.isCustom = isCustom;
	}

	public Boolean getLeaf() {
		return this.leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	public Integer getOrderbyNum() {
		return this.orderbyNum;
	}

	public void setOrderbyNum(Integer orderbyNum) {
		this.orderbyNum = orderbyNum;
	}

	public String getIconCls() {
		if ((this.leaf.booleanValue()) && (this.type.equals("2"))) {
			return "function-node";
		}
		return "";
	}

	public void setDraggable(boolean draggable) {
		this.draggable = draggable;
	}

	public boolean isDraggable() {
		return (this.draggable) || ((this.isCustom.booleanValue()) && (!getId().equals("custom-functions-root")));
	}

	public List<FuncTreeVO> getChildren() {
		return children;
	}

	public void setChildren(List<FuncTreeVO> children) {
		this.children = children;
	}
}
