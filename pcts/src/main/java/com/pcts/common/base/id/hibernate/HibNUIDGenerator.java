package com.pcts.common.base.id.hibernate;

import java.io.Serializable;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.id.IdentifierGenerator;

import com.pcts.common.base.id.IDGenerator;
import com.pcts.common.base.id.NUIDGenerator;

/**
 * 
 * @author zhangtao 2014年10月22日
 *	<p>
 *  <b>Description<b><p>
 *	
 *	定义Hibernate id 增长方式
 */
public class HibNUIDGenerator implements IdentifierGenerator {
	
	private IDGenerator generator = null;
	
	public HibNUIDGenerator(){
	    this.generator = new NUIDGenerator(1000);
	}

	/**
	 * @see org.hibernate.id.IdentifierGenerator#generate(org.hibernate.engine.spi.SessionImplementor, java.lang.Object)
	 */
	@Override
	public Serializable generate(SessionImplementor session, Object object)
			throws HibernateException {
		try{
			return this.generator.nextId();
		}catch (HibernateException ex) {
			throw ex;
		}
	}
}
