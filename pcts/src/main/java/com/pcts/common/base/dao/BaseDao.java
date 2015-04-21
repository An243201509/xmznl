package com.pcts.common.base.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import com.pcts.common.base.dao.hibernate.HibernateDao;
import com.pcts.common.base.page.Condition;
import com.pcts.common.base.page.Page;


/**
 * @author zhangtao , 2014-10-15
 *         <p>
 *         Description: 封装Hibernate原生API的DAO泛型基类. 可在Service层直接使用,
 *         也可以扩展泛型DAO子类使用, 见两个构造函数的注释. 参考Spring2.5自带的Petlinc例子,
 *         取消了HibernateTemplate, 直接使用Hibernate原生API.
 *         <p>
 *         <i>PS:You can perform data operations</i>
 * @param <T>
 *            DAO操作的对象类型
 * 
 */
@Component
public abstract class BaseDao<T> extends HibernateDao<T> {
	/**
	 * 用于Dao层子类的构造函数. 通过子类的泛型定义取得对象类型Class. eg. public class UserDao extends
	 * HibernateDao<User, Long>{ }
	 */
	public BaseDao() {
		super();
	}

	/**
	 * 用于省略Dao层, Service层直接使用通用HibernateDao的构造函数. 在构造函数中定义对象类型Class. eg.
	 * HibernateDao<User, Long> userDao = new HibernateDao<User,
	 * Long>(sessionFactory, User.class);
	 */
	public BaseDao(final SessionFactory sessionFactory, final Class<T> entityClass) {
		super();
	}

/******************************************hql Paging query start***********************************************/
	/**
	 * 按HQL分页查询.
	 * 
	 * @param page
	 *            分页参数. 注意不支持其中的orderBy参数.
	 * @param hql
	 *            hql语句.
	 * @return 分页查询结果, 附带结果列表及所有查询输入参数.
	 */
	public Page findHqlPage(final Condition condition, String hql, final Object... values ){
		Assert.notNull(condition, "condition不能为空");
		Page page = new Page();
		if(hql == null && !"".equals(hql)){
			hql = "from "+ this.getEntityClass().getSimpleName();
		}
		
		if(condition.getConditionExpression() != null && !"".equals(condition)){
			hql += " where 1 = 1 "+ condition.getConditionExpression().toString();
		}
		
		page.setTotal(this.countResult(hql, values));
		Query query = this.createQuery(hql, values);
		setPageParameterToQuery(query, condition);
		page.setData(query.list());
		return page;
	}
	
/******************************************end hql Paging query*************************************************/
	/**
	 * 设置分页参数到Query对象,辅助函数.
	 */
	protected Query setPageParameterToQuery(final Query q, final Condition condition) {
		Assert.isTrue(condition.getRowCount() > 0, "row count must larger than zero");
		// hibernate的firstResult的序号从0开始
		q.setFirstResult(condition.getStartRow());
		q.setMaxResults(condition.getRowCount());
		return q;
	}
/******************************************sql Paging query start***********************************************/
	/**
	 * 按SQL分页查询.
	 * 
	 * @param page
	 *            分页参数. 注意不支持其中的orderBy参数.
	 * @param sql
	 *            sql语句.
	 * 
	 * @return 分页查询结果, 附带结果列表及所有查询输入参数.
	 */
	@SuppressWarnings("unchecked")
	public Page fingSqlPage(final Condition condition, String sql, final Object... values){
		Assert.notNull(condition, "page不能为空");
		Page page = new Page();
		if(condition.getConditionExpression() != null && !"".equals(condition)){
			sql += " where 1 = 1 "+ condition.getConditionExpression().toString();
		}
		page.setTotal(this.countSqlResult(sql, values));
		Query query = this.createSqlQuery(sql, values);
		setPageParameterToQuery(query, condition);
		List<T> result = query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list();
		page.setData(result);
		return page;
	}
	/******************************************end sql Paging query*************************************************/	
}