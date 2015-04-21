/**
 * @version V1.0
 */
package com.pcts.common.tag.jsp;

import java.util.StringTokenizer;
import javax.servlet.http.HttpServletRequest;

/**
 * @author zhangtao, 2014年10月30日 下午11:33:47
 *	<p>
 * 	<b>Description<b><p>
 * 
 */
public class ClientBrowser
{
  private Browser browser;
  private String version;
  private String plugin;

  public ClientBrowser(HttpServletRequest request)
  {
    String agent = request.getHeader("User-agent");
    agent = agent.toLowerCase();
    StringTokenizer stk = new StringTokenizer(agent, ";");
    if (agent.indexOf("chromeframe") > -1) {
      this.plugin = "chromeframe";
    }
    while (stk.hasMoreTokens()) {
      String info = stk.nextToken();
      if (info.indexOf("msie") > -1) {
        this.browser = Browser.IE;
        this.version = info.substring(info.indexOf("msie") + 4, info.length()).trim();
        break;
      }if (info.indexOf("chrome") > -1) {
        this.browser = Browser.CHROME;
        this.version = info.substring(info.indexOf("chrome") + 7, info.indexOf("safari")).trim();
        break;
      }if (info.indexOf("firefox") > -1) {
        this.browser = Browser.GECKO;
        this.version = info.substring(info.indexOf("firefox") + 8, info.length()).trim();
        break;
      }if (info.indexOf("opera") > -1) {
        this.browser = Browser.OPERA;
        break;
      }if (info.indexOf("safari") > -1) {
        this.browser = Browser.SAFARI;
        this.version = info.substring(info.indexOf("safari") + 7, info.length()).trim();
        break;
      }if (info.indexOf("navigator") > -1) {
        this.browser = Browser.NETSCAPE;
        break;
      }
    }
  }

  public ClientBrowser(Browser browser, String version) {
    this.browser = browser;
    this.version = version;
  }

  public Browser getBrowser() {
    return this.browser;
  }

  public String getVersion() {
    return this.version;
  }

  public String getPlugin() {
    return this.plugin;
  }

  public void setPlugin(String plugin) {
    this.plugin = plugin;
  }
}
