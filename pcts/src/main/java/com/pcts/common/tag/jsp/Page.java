/**
 * @version V1.0
 */
package com.pcts.common.tag.jsp;

import java.io.IOException;
import javax.servlet.jsp.tagext.BodyContent;

/**
 * @author zhangtao, 2014年10月30日 下午11:09:17
 *	<p>
 * 	<b>Description<b><p>
 * 
 */
public class Page extends JSP
{
  private String head;
  private String body;

  public String getHTML()
  {
    if ((this.head == null) && (this.body == null)) {
      return this.bodyContent.getString();
    }
    StringBuilder html = new StringBuilder();
    try {
      this.bodyContent.clear();
      html.append(getDoctype("transitional")).append("\n").append("<html>").append("\n");

      if (this.head != null) {
        String charset = getParameter("charset", "utf-8");
        boolean cached = getBoolParameter("cache", false);
        String meta = "<META http-equiv=\"Content-Type\" content=\"text/html; charset=" + charset + "\">";
        if (!cached) {
          meta = meta + "<META HTTP-EQUIV=\"Pragma\" CONTENT=\"no-cache\">\n<META HTTP-EQUIV=\"Cache-Control\" CONTENT=\"no-cache\">\n<META HTTP-EQUIV=\"Expires\" CONTENT=\"0\">";
        }

        this.head = replace(this.head, "{title}", getParameter("title", ""));
        this.head = replace(this.head, "{meta}", meta);
        this.head = replace(this.head, "{resource}", getResource());
        html.append(this.head).append("\n");
      }
      if (this.body != null) {
        html.append(this.body).append("\n");
      }
      html.append("</html>");
    } catch (IOException e) {
      e.printStackTrace();
    }
    return html.toString();
  }

  private String replace(String str, String reg, String rep)
  {
    int index = -1;
    if ((index = str.indexOf(reg)) > -1) {
      return str.substring(0, index) + rep + str.substring(index + reg.length(), str.length());
    }
    return str;
  }

  public void setHead(String head)
  {
    this.head = head;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public void doRelease()
  {
    this.body = null;
    this.head = null;
  }

  public boolean doBeforeRender() {
    return true;
  }
}
