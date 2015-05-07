package com.pcts.core.query.service.Impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcts.core.query.dao.UserDao;
import com.pcts.core.query.service.UserService;
import com.pcts.core.userinfo.entity.UserInfo;


@Service
@Transactional
public class UserServiceImpl implements UserService{

	@Autowired
	private UserDao userDao;
	
	
	public List getUserForList(UserInfo user) throws SQLException {
		userDao.getUserForList(user);
		return null;
	}

	public String insertUser(UserInfo user) throws SQLException {
		userDao.insertUser(user);
		return null;
	}

	@Override
	public List queryColumns(String tablename) {
		return null;
	}

	/*public List queryColumns(String tablename) {
		
		List list = tableDao.queryTable(tablename);
		
		return list;
	}*/
	
	

}
