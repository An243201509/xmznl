package com.pcts.common.base.service;

import com.pcts.common.base.page.Page;

/**
 * 
 * @author zhangtao, 2014年11月28日 下午9:15:16
 *	<p>
 * 	<b>Description<b><p>
 *
 */
public abstract interface IBaseService<T> {
	
	public Page findPage();
}