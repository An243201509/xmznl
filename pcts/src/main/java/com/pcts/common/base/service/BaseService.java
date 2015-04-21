package com.pcts.common.base.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.common.base.dao.BaseDao;

/**
 * @author zhangtao , 2014-10-15
 *         <p>
 *         Description: This is a base struts service class implement from
 *         <b>IBaseService</b>.
 *         <p>
 *         <i>PS:You can perform data operations.</i>
 *         
 */
@Service
@Transactional
public abstract class BaseService<T> {
	@Autowired
	protected BaseDao<T> baseDao;

	/**
	 * 新增
	 * @param entity
	 * @throws Exception
	 */
	public void add(T entity){
		baseDao.save(entity);
	}

	/**
	 * 删除
	 * @param entity
	 * @throws Exception
	 */
	public void delete(T entity){
		baseDao.delete(entity);
	}

	/**
	 * 删除
	 * @param id
	 * @throws Exception
	 */
	public void delete(String id){
		baseDao.delete(id);
	}
	
	public void update(T entity){
		baseDao.update(entity);
	}

	/**
	 * 查看
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public T find(String id){
		return baseDao.findById(id);
	}
}
