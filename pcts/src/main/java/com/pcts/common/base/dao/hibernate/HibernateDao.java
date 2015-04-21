package com.pcts.common.base.dao.hibernate;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;

/**
 * @author zhangtao, 2014年10月24日 上午12:34:05
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
public abstract class HibernateDao<T> {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	protected SessionFactory sessionFactory;
	protected Class<T> entityClass;

	/**
	 * 用于Dao层子类使用的构造函数. 通过子类的泛型定义取得对象类型Class. eg. public class UserDao extends
	 * SimpleHibernateDao<User, Long>
	 */
	public HibernateDao() {
		this.entityClass = getEntityClass();
	}

	/**
	 * @return the entityClass
	 */
	abstract protected Class<T> getEntityClass();

	/**
	 * 采用@Autowired按类型注入SessionFactory, 当有多个SesionFactory的时候在子类重载本函数.
	 */
	@Autowired
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	/**
	 * 取得当前Session.
	 */
	public Session getSession() {
		return sessionFactory.getCurrentSession();
	}
	
	/**
	 * find by id
	 *
	 * @param Serializable id,entity id
	 * @return single entity
	 */
	@SuppressWarnings("unchecked")
	public T findById(Serializable id) {
		Assert.notNull(id, "id不能为空");
		return (T) getSession().get(entityClass, id);
	}

	/**
	 * find by id
	 * @param Serializable id,entity id
	 * @return single entity
	 */
	@SuppressWarnings("unchecked")
	public T loadById(Serializable id) {
		Assert.notNull(id, "id不能为空");
		Object ret = getSession().load(entityClass, id);
		return (T) ret;
	}
	
	/**
	 * 按属性查找唯一对象, 匹配方式为相等.
	 */
	@SuppressWarnings("unchecked")
	public T findUniqueBy(final String propertyName, final Object value) {
		Assert.hasText(propertyName, "propertyName不能为空");
		Criterion criterion = Restrictions.eq(propertyName, value);
		return (T) createCriteria(criterion).uniqueResult();
	}
	
	/**
	 * default get all record in DB.
	 * @return List<T> list of result objects
	 */
	@SuppressWarnings("unchecked")
	public List<T> findAll(){
		return this.createQuery(
				"from " + getEntityClass().getSimpleName()).list();
	}

	/**
	 * find by condition of a column equal a simple value  
	 * @param string propertyName
	 * @param object value
	 * @return List<T> list of result objects
	 */
	@SuppressWarnings("unchecked")
	public List<T> findByProperty(String propertyName, Object value) {
		String queryString = "from " + getEntityClass().getSimpleName()
				+ " as model where model." + propertyName + "= ?";
		Query queryObject = this.createQuery(queryString);
		queryObject.setParameter(0, value);
		return queryObject.list();
	}
	
	/**
	 * execute a Hibernate query by add a  Hibernate Criterion
	 * This can be used only for and conditions. If or etc is required use filters, criteria etc
	 * @param propertyName
	 * @param value
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<T> findByProperty(String[] propertyName, Object[] value) {
		String queryString = "from " + getEntityClass().getSimpleName() + "as model where ";
		for (int i = 0; i < propertyName.length; i++) {
			if (i != 0)
				queryString = queryString + " and ";
			queryString = queryString + " model." + propertyName[i] + "=? ";
		}
		Query queryObject = this.createQuery(queryString);
		for (int j = 0; j < value.length; j++)
			queryObject.setParameter(j, value[j]);
		return queryObject.list();
	}
	
	/**
	 * judgment whether a entity object exists in DB. 
	 * @param object entity object
	 * @return boolean is exists?
	 */
	public boolean contains(T o) {
		return getSession().contains(o);
	}

	/**
	 * add/Create a new entity to DB
	 * @param object entity object
	 */
	public void save(T entity) {
		Assert.notNull(entity, "entity不能为空");
		getSession().save(entity);
	}
	
	/**
	 * update a entity.
	 * @param object entity object 
	 * @return object the entity which has been updated
	 */
	public void update(T entity) {
		Assert.notNull(entity, "entity不能为空");
		Assert.notNull(entity, "entity不能为空");
		getSession().update(entity);
	}

	/**
	 * merge a entity.
	 * if object exists update then add
	 * @param object entity object 
	 * @return object the entity which has been update or add
	 */
	@SuppressWarnings("unchecked")
	public T merge(T entity) {
		Assert.notNull(entity, "entity不能为空");
		getSession().merge(entity);
		Serializable id = getSession().getIdentifier(entity);
		T a = (T) getSession().load(getEntityClass(), id);
		return a;
	}
	
	/**
	 * delete a entity object from DB.
	 * @param object entity object
	 */
	public void delete(T entity) {
		Assert.notNull(entity, "entity不能为空");
		getSession().delete(entity);
		logger.info("delete entity: {}", entity);
	}

	/**
	 * delete a record from DB by primary key.
	 * @param Serializable id
	 */
	public void delete(Serializable id) {
		Assert.notNull(id, "id不能为空");
		getSession().delete(findById(id));
		logger.info("delete entity {},id is {}", entityClass.getSimpleName(), id);
		
	}

	/**
	 * execute a delte Sql String 
	 * @param string HQL subQuery
	 * Modify:
	 * 	09/3/25: Syntax delete is a @deprecated method of Hibernate 2.0.
	 * 			Instead of createQuery("delete ...")
	 *  09/4/8:debug-add executeUpdate()
	 */
	public void delete(String queryString, final Object... values) {
		Assert.notNull(queryString, "query不能为空");
//		this.createQuery( "delete " + getEntityClass().getSimpleName() 
//				+ " where " + query).executeUpdate();
		this.createQuery(queryString, values).executeUpdate();
	}
	
	/**
	 * batch delete a record from DB by primary key.
	 * @param Serializable id
	 */
	public void batchDel(String ids) {
		Assert.notNull(ids, "ids不能为空");
		String hql = "delete  " + entityClass.getSimpleName() + " where id in (" + ids + ")";
		this.createQuery(hql).executeUpdate();
		logger.info("delete entity {},ids is {}", entityClass.getSimpleName(), ids);
	}
	
	/**
	 * get a DB sequence NextValue
	 * @param sequenceName string name of a DB sequence
	 * @return Long sequence.NextValue
	 */
	public Long getNextValue(String sequenceName) {
		BigDecimal iSeq = (BigDecimal) (this.createSqlQuery("select " + sequenceName + ".nextval from dual").uniqueResult());
		return new Long(iSeq.longValue());
	}
	
	/**
	 * 根据Criterion条件创建Criteria. 与find()函数可进行更加灵活的操作.
	 * @param criterions
	 *            数量可变的Criterion.
	 */
	public Criteria createCriteria(final Criterion... criterions) {
		Criteria criteria = getSession().createCriteria(entityClass);
		for (Criterion c : criterions) {
			criteria.add(c);
		}
		return criteria;
	}
	
	/**
	 * 执行count查询获得本次Sql查询所能获得的对象总数.
	 * 本函数只能自动处理简单的sql语句,复杂的sql查询请另行编写count语句查询.
	 */
	public long countSqlResult(final String sql, final Object... values) {
		String countSql = "select count(1) from (" + sql + ")";
		try {
			Long count = ((BigDecimal) (this.createSqlQuery(countSql, values))).longValue();
			return count;
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("sql can't be auto count, sql is:" + countSql, e);
		}
	}
	/**
	 * 执行count查询获得本次Hql查询所能获得的对象总数.
	 * 本函数只能自动处理简单的hql语句,复杂的sql查询请另行编写count语句查询.
	 */
	public long countResult(final String queryString, final Object... values){
		String counthql = "select count(*) " + queryString;
		return (Long) this.createQuery(counthql, values).uniqueResult();
	}
	
	/**
	 * 根据查询HQL与参数列表创建Query对象. 与find()函数可进行更加灵活的操作.
	 * 
	 * @param values
	 *            数量可变的参数,按顺序绑定.
	 */
	public Query createQuery(final String queryString, final Object... values) {
		Assert.hasText(queryString, "queryString不能为空");
		Query query = getSession().createQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return query;
	}
	
	/**
	 * 根据查询SQL与参数列表创建Query对象. 与find()函数可进行更加灵活的操作.
	 * 
	 * @param values
	 *            数量可变的参数,按顺序绑定.
	 */
	public Query createSqlQuery(final String queryString, final Object... values) {
		Assert.hasText(queryString, "queryString不能为空");
		Query query = this.getSession().createSQLQuery(queryString);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i, values[i]);
			}
		}
		return query;
	}

	/**
	 * 根据查询HQL与参数列表创建Query对象. 与find()函数可进行更加灵活的操作.
	 * 
	 * @param values
	 *            命名参数,按名称绑定.
	 */
	public Query createQuery(final String queryString, final Map<String, ?> values) {
		Assert.hasText(queryString, "queryString不能为空");
		Query query = this.createQuery(queryString);
		//query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);//标记，不知是否有问题
		if (values != null) {
			query.setProperties(values);
		}
		return query;
	}
}