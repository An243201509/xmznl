package com.pcts.core.query.dao.Impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.stereotype.Service;




import com.ibatis.sqlmap.client.SqlMapClient;
import com.pcts.core.query.dao.UserDao;
import com.pcts.core.userinfo.entity.UserInfo;

@Service
public class UserDaoImpl /*extends SqlMapClientDaoSupport*/ implements UserDao{
	
	@Autowired
	private SqlMapClient sqlMapClient;
	

	public List getUserForList(UserInfo user) throws SQLException {
		List list = sqlMapClient.queryForList("getUserForList", user);
		return list;
	}

	public String insertUser(UserInfo user) throws SQLException {
		sqlMapClient.insert("insertUser", user);
		return "";
	}

	

}
