/**
 * @version V1.0
 */
package com.pcts.common.base.page;

/**
 * @author zhangtao, 2014年11月28日 下午4:56:34
 *	<p>
 *  <b>Description<b><p>
 *	
 */
public class Condition {
	private String conditionExpression;
	private int startRow;
	private int rowCount;
	private Class<?> voClass;
	private String join;
	private String sort;
//	  private Expression expression;
	public String getConditionExpression() {
		return conditionExpression;
	}
	public void setConditionExpression(String conditionExpression) {
		this.conditionExpression = conditionExpression;
	}
	public int getStartRow() {
		return startRow;
	}
	public void setStartRow(int startRow) {
		this.startRow = startRow;
	}
	public int getRowCount() {
		return rowCount;
	}
	public void setRowCount(int rowCount) {
		this.rowCount = rowCount;
	}
	public Class<?> getVoClass() {
		return voClass;
	}
	public void setVoClass(Class<?> voClass) {
		this.voClass = voClass;
	}
	public String getJoin() {
		return join;
	}
	public void setJoin(String join) {
		this.join = join;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
}
