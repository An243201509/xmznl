/**
 * @version V1.0
 */
package com.pcts.common.tag.jsp;

import java.util.Iterator;
import java.util.Map;

/**
 * @author zhangtao, 2014年10月30日 下午11:30:39
 *         <p>
 *         <b>Description<b>
 *         <p>
 * 
 */
public class WorkFlow {
	private boolean useFlow;
	private boolean activity;
	private Map<String, String> processDefinitions;

	public boolean isUseFlow() {
		return this.useFlow;
	}

	public void setUseFlow(boolean useFlow) {
		this.useFlow = useFlow;
	}

	public boolean isActivity() {
		return this.activity;
	}

	public void setActivity(boolean activity) {
		this.activity = activity;
	}

	public Map<String, String> getProcessDefinitions() {
		return this.processDefinitions;
	}

	public void setProcessDefinitions(Map<String, String> processDefinitions) {
		this.processDefinitions = processDefinitions;
	}

	public String getProcessDefinitionsJSON() {
		if ((null == this.processDefinitions) || (this.processDefinitions.isEmpty())) {
			return "{}";
		}

		StringBuilder sb = new StringBuilder("{");
		Iterator it = this.processDefinitions.entrySet().iterator();
		int i = 0;
		while (it.hasNext()) {
			Map.Entry entry = (Map.Entry) it.next();

			if (i > 0) {
				sb.append(",");
			}
			sb.append("\"").append((String) entry.getKey()).append("\":").append((String) entry.getValue());

			i++;
		}

		sb.append("}");

		return sb.toString();
	}

	public String toString() {
		return "{\"isFlow\":" + this.useFlow + ",\"processDefinitions\":" + getProcessDefinitionsJSON() + "}";
	}
}
