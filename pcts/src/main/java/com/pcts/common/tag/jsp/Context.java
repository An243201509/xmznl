/**
 * @version V1.0
 */
package com.pcts.common.tag.jsp;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * @author zhangtao, 2014年10月30日 下午11:12:31
 *         <p>
 *         <b>Description<b>
 *         <p>
 * 
 */
public class Context {
	private boolean debug;
	private boolean useAudit;
	private String locale;
	private String userId;
	private String userName;
	private ClientBrowser clientBrowser;
	private WorkFlow workFlow;
	private Map<String, String> config;
	private Map<String, String> globalPath;
	private String extBasePath;
	private String sofaBasePath;
	private String otherPath;
	private Set<String> defineds;
	private StringBuilder scripts;
	private StringBuilder extReady;

	public boolean isDebug() {
		return this.debug;
	}

	public void setDebug(boolean debug) {
		this.debug = debug;
	}

	public boolean getUseAudit() {
		return this.useAudit;
	}

	public void setUseAudit(boolean useAudit) {
		this.useAudit = useAudit;
	}

	public WorkFlow getWorkFlow() {
		return this.workFlow;
	}

	public void setWorkFlow(WorkFlow workFlow) {
		this.workFlow = workFlow;
	}

	public String getLocale() {
		return this.locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public ClientBrowser getClientBrowser() {
		return this.clientBrowser;
	}

	public void setClientBrowser(ClientBrowser clientBrowser) {
		this.clientBrowser = clientBrowser;
	}

	public String getExtBasePath() {
		return this.extBasePath;
	}

	public void setExtBasePath(String extBasePath) {
		this.extBasePath = extBasePath;
	}

	public String getSofaBasePath() {
		return this.sofaBasePath;
	}

	public void setSofaBasePath(String sofaBasePath) {
		this.sofaBasePath = sofaBasePath;
	}

	public void addGlobalDefined(String[] ids) {
		if (this.defineds == null) {
			this.defineds = new HashSet();
		}
		for (String id : ids)
			if (id != null)
				this.defineds.add(id);
	}

	public String getGlobalDefined() {
		if (this.defineds != null) {
			String ids = this.defineds.toString();
			ids = ids.substring(1, ids.length() - 1);
			return ids;
		}
		return "";
	}

	public void addScriptContent(String content, boolean insertFirst) {
		if (this.scripts == null) {
			this.scripts = new StringBuilder();
		}
		if (content == null)
			return;
		if (insertFirst)
			this.scripts.insert(0, content);
		else
			this.scripts.append(content);
	}

	public void addExtReady(String content) {
		if (this.extReady == null) {
			this.extReady = new StringBuilder();
		}
		if (content == null)
			return;
		this.extReady.append(content);
	}

	public String getExtReady() {
		if (this.extReady != null) {
			return this.extReady.toString();
		}
		return "";
	}

	public String getScriptContent() {
		if (this.scripts != null) {
			return this.scripts.toString();
		}
		return "";
	}

	public String getOtherPath() {
		return this.otherPath;
	}

	public void setOtherPath(String otherPath) {
		this.otherPath = otherPath;
	}

	public Map<String, String> getGlobalPath() {
		return this.globalPath;
	}

	public void setGlobalPath(Map<String, String> globalPath) {
		this.globalPath = globalPath;
	}

	public Map<String, String> getConfig() {
		return this.config;
	}

	public void setConfig(Map<String, String> config) {
		this.config = config;
	}
}
