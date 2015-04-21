/**
 * @version V1.0
 */
package com.pcts.common.util;

import java.util.Calendar;
import java.util.Date;

/**
 * @author zhangtao, 2014年10月26日 下午4:24:43
 *	<p>
 * 	<b>Description<b><p>
 * 
 * 	日期-时间工具类
 */
public class DateFormat {
	
	/**
	 * 获得日历给定的日期
	 * 
	 * @param datetime
	 * @return Calendar
	 */
	public static Calendar getCalendar(Date datetime) {
		Calendar rtnCal = Calendar.getInstance();
		rtnCal.setTime(datetime);
		return rtnCal;
	}
	
	/**
	 * 查询两次的间隔时间 单位分钟
	 * 
	 * @param time1
	 * @param time2
	 * @return
	 */
	public static long getMinBetweenByTimeInMillis(Long time1, Long time2) {
		long l = time2 - time1;
		return (l / (60 * 1000));
	}

}
