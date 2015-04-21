package com.pcts.common.base.id;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import org.hibernate.annotations.GenericGenerator;

/**
 * 
 * @author zhangtao, 2014年10月23日 下午10:52:33
 *	<p>
 * 	<b>Description<b><p>
 *
 *	定义主键Id根据uuid自动生成
 */
@MappedSuperclass
@SuppressWarnings("serial")
public abstract class IdEntity implements Serializable {
	
	/**
	 * 主键Id
	 */
	protected String id;
	
	public IdEntity(){
		super();
	}
	
	public IdEntity(String id){
		super();
		this.id = id;
	}

	@Id
	@GeneratedValue(generator="nuid")
	@GenericGenerator(name="nuid",strategy="com.pcts.common.base.id.hibernate.HibNUIDGenerator")
	@Column(name = "id", length = 20, nullable = true, unique = true)
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
}
