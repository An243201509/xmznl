package com.pcts.common.constants;

import java.util.HashMap;
import java.util.Map;

/**
 * 
 * @author zhangtao, 2014年10月26日 下午5:47:08
 *	<p>
 * 	<b>Description<b><p>
 *
 *	关于密码静态变量的定义
 */
public class PwdConstant {
	/**
	 * 锁屏时间
	 */
	public static Integer LOCK_TIME = -1;
	/**
	 * 密码锁定时间 单位分钟
	 */
	public static Integer PWD_CLOCK_TIME = -1;
	/**
	 * 密码有效期 单位天
	 */
	public static Integer PWD_EFFECTIVE_DAY = -1;
	/**
	 * 密码预警时间 
	 */
	public static Integer PWD_WARN_DAY = -1;
	/**
	 * 密码默认输入错误次数
	 */
	public static Integer PWD_ERROR_NUM = 3;
	
	/**
	 * 用于存放一些错误的提示信息!
	 */
	public static Map<String,String> map = new HashMap<String,String>();
	/*
	 * "1" 表示密码位数出错信息  
	 * "2" 表示大写字母验证出错信息 
	 * "3" 表示小写字母验证出错信息
	 * "4" 表示数值验证出错信息
	 * "5" 表示字母验证出错信息
	 * "6" 表示特殊字符验证出错信息
	 * "7" 表示密码重复使用过出错信息
	 * "8" 表示提示用户当前帐号被锁定，还有多久才能登入
	 * "9" 表示用户未输入密码 ，提示用户重新输入密码
	 * "10" 表示用户密码输入错误，提示用户重新输入
	 * "11" 表示用户密码已经过期，提示用户及时联系管理员
	 * "12" 表示用户帐户不存在
	 * "13" 表示密码中不允许出现中文字符
	 * "14" 表示密码输入的最大位数
	 * "15" 试用过期
	 * "16" Liscence不存在
	 * "17" 用户IP地址
	 */
	public static String[] Message_Key = {"1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17"}; 
	/*
	 * M01:用于存放用户密码被修改的时间。
	 * M02:用户存放密码输入错误次数值。
	 * M03:用于存放最近过去6次使用过的密码。
	 * M04:用于存放账户被锁定的时间。
	 * M05:用于存放系统最近一次错误登陆时间。
	 */
	public static String[] Paramid_Key = {"M01","M02","M03","M04","M05"};
	/*
	 * 密码错误输入次数
	 * 如果成功登入可以将该用户的错误登入次数清零
	 */
	public static String[] M02_Value ={"1","2","3","0"};
	public static String SUCCESS="SUCCESS";
	//用户密码即将到期的提示信息
	public static String Message_ = "Message_";
	//存放当前用户登录系统的状态信息
	public static String State_ = "State_";
	
	static {
		LOCK_TIME = 2;
		PWD_CLOCK_TIME = 15;
		PWD_EFFECTIVE_DAY = 15;
		PWD_WARN_DAY = 1;
	}
}
