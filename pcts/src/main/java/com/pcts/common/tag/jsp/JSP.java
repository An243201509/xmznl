/**
 * @version V1.0
 */
package com.pcts.common.tag.jsp;

import com.pcts.common.tag.config.ConfigManager;
import com.pcts.common.tag.container.Container;
import com.pcts.common.tag.widget.PluginMgr;
import com.pcts.common.tag.widget.PluginRegister;
import com.pcts.common.util.WebUtil;
import com.pcts.core.usermanage.entity.UserInfo;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.BodyContent;

/**
 * @author zhangtao, 2014年10月30日 下午11:09:58
 *         <p>
 *         <b>Description<b>
 *         <p>
 * 
 */
public class JSP extends Container implements PluginRegister {
	private String resourceSymbol;
	private UserInfo userInfo;

	public boolean isDebug() {
		String debug = System.getProperty("SOFA_ISPRODUCT");
		return !"true".equalsIgnoreCase(debug);
	}

	public int doStartTag() {
		if (getAncestorPresent(JSP.class) != null) {
			getDynamicAttributes();
			setParameter("include", "true");
			return 2;
		}

		String locale = null; String userid = null; String username = null;
		boolean debug = false;
		Map<String, String> globalURL = new HashMap<String, String>();
		HttpServletRequest request = (HttpServletRequest)this.pageContext.getRequest();
		userInfo = (UserInfo)request.getAttribute("userInfo");
		if (userInfo == null) {
			userid = userInfo.getId();
			username = userInfo.getUserName();
		}
		if (locale == null) {
			locale = "zh_CN";
		}
		String base = WebUtil.getApplicationRootUrl(request) + WebUtil.getAppRootWebContextPath(request);
		globalURL.put("base", base);
		WorkFlow workflow = new WorkFlow();
		debug = isDebug();
		ConfigManager cm = ConfigManager.getInstance();

		this.context = new Context();
		this.context.setDebug(debug);
		this.context.setLocale(locale);
		this.context.setUserId(userid);
		this.context.setUserName(username);
		this.context.setGlobalPath(globalURL);
		this.context.setWorkFlow(workflow);
		initConfig(this.context, cm);
		this.context.setUseAudit(Boolean.parseBoolean(cm.getValue("useAudit", "false")));
		this.context.setExtBasePath(base + "/resources/libs/ext/3.4");
		this.context.setSofaBasePath(base + "/resources/libs/ext/3.4/sofa");
		this.context.setClientBrowser(new ClientBrowser((HttpServletRequest) this.pageContext.getRequest()));
		this.pageContext.setAttribute("jsp_tag_context", this.context, 2);
		initPlugin();
		return 2;
	}

	private void initConfig(Context context, ConfigManager cm) {
		Set tables = cm.getValues().entrySet();
		HashMap configs = new HashMap();
		// for (Map.Entry entry : tables) {
		// configs.put(entry.getKey().toString(), entry.getValue().toString());
		// }
		context.setConfig(configs);
	}

	public boolean doBeforeRender() {
		return true;
	}

	public void setResourceSymbol(String symbol) {
		this.resourceSymbol = symbol;
	}

	public void doRender() {
		outHTML();
	}

	public void doAfterRender() {
	}

	public void doRelease() {
		this.resourceSymbol = null;
	}

	public String getHTML() {
		String html = this.bodyContent.getString();
		if (getBoolParameter("include", false)) {
			html = html.replaceAll("<\\/?[html^>]+>", "");
			html = html.replaceAll("<\\/?[body^>]+>", "");
			html = html.replaceAll("<\\/?[head^>]+>", "");
			html = html.replaceAll("<\\/?[title^>]+>", "");
			return html;
		}
		if (html != null) {
			html = html.replaceAll("\\<\\!DOCTYPE(.*)\\>", "");

			String compatible = "";
			ClientBrowser browser = this.context.getClientBrowser();
			if ((browser != null) && (browser.getBrowser() == Browser.IE)) {
				String version = browser.getVersion();
				if ((version.indexOf("8.") > -1) || (version.indexOf("7.") > -1) || (version.indexOf("6.") > -1) || (version.indexOf("5.") <= -1))
					;
			}

			if (this.resourceSymbol != null) {
				int index = -1;
				if (this.context.isDebug()) {
					compatible = compatible + "<meta http-equiv=\"Expires\" CONTENT=\"0\"><meta http-equiv=\"Cache-Control\" content=\"no-cache\"/><meta http-equiv=\"pragma\" content=\"no-cache\"/>";
				}

				if ((index = html.indexOf(this.resourceSymbol)) != -1) {
					html = html.substring(0, index) + compatible + "\n" + getResource() + html.substring(index + this.resourceSymbol.length(), html.length());
				}

			} else {
				int head = html.indexOf("</head>");
				if (head > -1) {
					html = html.substring(0, head) + getResource() + html.substring(head, html.length());
				}

			}

			String version = browser.getVersion();

			if ((browser.getBrowser() == Browser.IE) && ((version.indexOf("8.") > -1) || (version.indexOf("7.") > -1))) {
				return html;
			}
			return html;
		}

		return "";
	}

	public String getScript() {
		return null;
	}

	public String getDoctype(String dtd) {
		if ("strict".equals(dtd))
			return "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">";
		if ("transitional".equals(dtd))
			return "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">";
		if ("frameset".equals(dtd)) {
			return "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Frameset//EN\" \"http://www.w3.org/TR/html4/frameset.dtd\">";
		}
		return "";
	}

	public String getResource() {
		StringBuffer buffer = new StringBuffer();
		outBaseLibary(buffer);
		PluginMgr pmgr = (PluginMgr) this.pageContext.getAttribute("Plugin_Mgr", 2);
		if (pmgr != null) {
			buffer.append(pmgr.outCSS()).append("\n");
			buffer.append(pmgr.outScript()).append("\n");
		}
		outDefined(buffer);
		outScript(buffer);
		return buffer.toString();
	}

	private String getKeyValue(String key, String value) {
		return getKeyValue(key, value, true);
	}

	private String getKeyValue(String key, String value, boolean isStr) {
		return "\"" + key + "\":" + (isStr ? "\"" + value + "\"" : value == null ? null : value);
	}

	private void outBaseLibary(StringBuffer buffer) {
		String extBasePath = this.context.getExtBasePath();
		boolean debug = this.context.isDebug();
		buffer.append("<script type=\"text/javascript\">").append("\n").append("var CONTEXT = {").append("\n").append("\"DEBUG\":" + this.context.isDebug()).append("\n").append(",")
		// .append("\"CONFIG\":" +
		// JSONUtil.toJson(this.context.getConfig())).append("\n").append(",").append(getKeyValue("PATH",
		// JSONUtil.toJson(this.context.getGlobalPath()),
		// false)).append("\n").append(",")
				.append(getKeyValue("LOCALE", this.context.getLocale())).append("\n").append(",").append(getKeyValue("USER", this.context.getUserId())).append("\n").append(",").append(getKeyValue("USERNAME", this.context.getUserName())).append("\n").append(",").append("\"AUDIT\":" + this.context.getUseAudit()).append("\n").append(",").append(getKeyValue("WORKFLOW", this.context.getWorkFlow().toString(), false)).append("\n").append(",").append(getKeyValue("CURRENTDATE", new SimpleDateFormat("yyyy-MM-dd").format(new Date()))).append("\n").append("};").append("\n").append("</script>").append("\n");

		String path = extBasePath;
		buffer.append(getStyleSheet(path + "/resources/css/ext-all.css")).append("\n");
		buffer.append(getStyleSheet(path + "/themes/default/css/themes.css")).append("\n");
		buffer.append(getJavaScript(path + "/adapter/ext/ext-base" + (debug ? "-debug.js" : ".js"))).append("\n");
		buffer.append(getJavaScript(path + "/ext-all" + (false ? "-debug.js" : ".js"))).append("\n");
		buffer.append(getJavaScript(path + "/BigDecimal.js")).append("\n");
		buffer.append(getJavaScript(path + "/ext-fixed.js")).append("\n");
		//buffer.append(getJavaScript(path + "/ext-override.js")).append("\n");
		buffer.append(getJavaScript(path + "/ext-widgets.js")).append("\n");
		buffer.append(getJavaScript(path + "/locale/ext-lang-" + this.context.getLocale() + ".js")).append("\n");
		buffer.append(getJavaScript(path + "/locale/ext-widgets-lang-" + this.context.getLocale() + ".js")).append("\n");
		buffer.append("<script type=\"text/javascript\">").append("\n").append("Ext.BLANK_IMAGE_URL = \"" + path + "/resources/images/default/s.gif\"").append("\n").append("</script>").append("\n");
		path = path + "/widgets";
		buffer.append(getStyleSheet(path + "/css/LockingBufferView.css")).append("\n");
		buffer.append(getStyleSheet(path + "/css/RowEditor.css")).append("\n");
		buffer.append(getJavaScript(path + "/Ext.ItemSelector.js")).append("\n");
		buffer.append(getJavaScript(path + "/mapper/Ext.mapper.Mapper.js")).append("\n");
		buffer.append(getJavaScript(path + "/mapper/Ext.mapper.MappingProxy.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.grid.LockingBufferView.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.grid.LockingColumnHeaderGroup.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.grid.ColumnHeaderGroup.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.grid.RowEditor.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.ProgressBarPager.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.tree.GridPanel.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.tree.LockingBufferView.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.tree.TreeGrid.js")).append("\n");
		buffer.append(getJavaScript(path + "/grid/Ext.grid.OperationColumn.js")).append("\n");
		buffer.append(getJavaScript(path + "/locale/widgets-lang-" + this.context.getLocale() + ".js")).append("\n");
		String sofaBasePath = this.context.getSofaBasePath();
		path = sofaBasePath;
		buffer.append(getStyleSheet(path + "/themes/default/css/themes.css")).append("\n");
		buffer.append(getJavaScript(path + "/api.js")).append("\n");
		buffer.append(getJavaScript(path + "/sofa-all.js")).append("\n");
		buffer.append(getJavaScript(path + "/sofa-flow.js")).append("\n");
		buffer.append(getJavaScript(path + "/locale/sofa-lang-" + this.context.getLocale() + ".js")).append("\n");
		// boolean isActive =
		// WebBundleActivityCache.getInstance().isActivity("engine-web");
		if (false)
			buffer.append(getJavaScript((String) this.context.getGlobalPath().get("engineweb") + "scripts/workflow.js")).append("\n");
	}

	private String getJavaScript(String path) {
		return "<script type=\"text/javascript\" src=\"" + path + "\"></script>";
	}

	private String getStyleSheet(String path) {
		return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + path + "\"/>";
	}

	private void outDefined(StringBuffer buffer) {
		String ids = this.context.getGlobalDefined();
		if ((ids != null) && (ids.length() > 0)) {
			buffer.append("<script type=\"text/javascript\">").append("\n");
			buffer.append("var ").append(ids).append(";").append("\n");
			buffer.append("</script>").append("\n");
		}
	}

	private void outScript(StringBuffer buffer) {
		this.context.getScriptContent();

		buffer.append("<script type=\"text/javascript\">").append("\n");
		buffer.append("Ext.onReady(function(){").append("\n");
		if ((this.context.getWorkFlow().isActivity()) && (this.context.getWorkFlow().isUseFlow())) {
			buffer.append("if (Workflow) {").append("\n");
			buffer.append("Workflow.isUseFlow = true;").append("\n");
			buffer.append("Workflow._isFlow = true;").append("\n");
			buffer.append("Workflow._collaborationURL = '" + (String) this.context.getGlobalPath().get("engineweb") + "';").append("\n");
			buffer.append("}").append("\n");
		}
		if (this.context.getWorkFlow().isActivity()) {
			buffer.append("if (Workflow) {").append("\n");
			buffer.append("Workflow._collaborationURL = '" + (String) this.context.getGlobalPath().get("engineweb") + "';").append("\n");
			buffer.append("}").append("\n");
		}
		buffer.append(this.context.getScriptContent()).append("\n");
		buffer.append(this.context.getExtReady()).append("\n");
		buffer.append("});").append("\n");
		buffer.append("</script>").append("\n");
	}

	public int doAfterBody() {
		return 6;
	}

	public void initPlugin(PluginMgr mgr) {
	}
}