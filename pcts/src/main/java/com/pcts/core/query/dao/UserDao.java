package com.pcts.core.query.dao;

import java.sql.SQLException;
import java.util.List;

import com.pcts.core.userinfo.entity.UserInfo;


public interface UserDao {
	
	public List getUserForList(UserInfo user)throws SQLException;
	
	public String insertUser(UserInfo user)throws SQLException;

}
