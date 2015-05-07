package com.pcts.core.query.service;

import java.sql.SQLException;
import java.util.List;

import com.pcts.core.userinfo.entity.UserInfo;


public interface UserService {
	
	public List getUserForList(UserInfo user)throws SQLException;
	
	public String insertUser(UserInfo user)throws SQLException;
	
	
	public List queryColumns(String tablename);

}
