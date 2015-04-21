package com.pcts.common.base.page;

import java.util.Collection;

/**
 * 
 * @author zhangtao, 2014年11月28日 下午4:41:21
 *	<p>
 *  <b>Description<b><p>
 *  
 *  分页数据封装
 *
 */
public class Page {
	protected long total = 0;
	protected Collection<?> data = null;
	
	public long getTotal() {
		return total;
	}
	public void setTotal(long total) {
		this.total = total;
	}
	public Collection<?> getData() {
		return data;
	}
	public void setData(Collection<?> data) {
		this.data = data;
	}
}
