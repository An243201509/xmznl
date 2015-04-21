package com.pcts.common.tag.form;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.BodyContent;
import javax.servlet.jsp.tagext.BodyTag;

import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;

public class ListView extends FormField
  implements Plugin, BodyTag
{
  protected BodyContent bodyContent;

  public ListView()
  {
    this.arrayRegex = "plugins|columns";

    this.objectRegex += "|store|storeConfig|minChars|selectIndex|data|baseParams|maxResultSize";

    this.transfers.put("autoLoad", "autoQuery");
    this.transfers.put("textField", "displayField");
    this.transfers.put("mustMatch", "forceSelection");
    this.transfers.put("hiddenId", "hiddenName");
    this.transfers.put("dataSource", "data");
    this.transfers.put("params", "baseParams");

    this.filters.add("readOnly");
    this.filters.add("autoLoad");
    this.filters.add("remote");

    this.filters.add("dataSource");

    this.filters.add("mustMatch");
    this.filters.add("showAll");
  }

  public void doPlugin(PluginMgr mgr) {
    mgr.injectPlugin("sofa.form.ListView");
  }

  public boolean doBeforeRender()
  {
    String readOnly = getParameter("readOnly");
    if (readOnly != null) {
      setParameter("editable", "true".equalsIgnoreCase(readOnly) ? "false" : "true");
    }
    boolean showAll = getBoolParameter("showAll", true);
    if (!showAll) {
      setParameter("triggerAction", "no");
    }
    boolean remote = getBoolParameter("remote", false);
    if (remote) {
      setParameter("mode", "remote");
    }

    return super.doBeforeRender();
  }

  public String getItemScript()
  {
    return "new sofa.form.ListView(" + getJSON() + ")";
  }

  public void addColumn(String column) {
    getDynamicAttributes();

    String _columns = (String)this.dynamicAttributes.get("columns");

    if (_columns == null)
      _columns = column;
    else {
      _columns = _columns + "," + column;
    }
    this.dynamicAttributes.put("columns", _columns);
  }

  public int doStartTag() {
    super.doStartTag();
    return 2;
  }

  public void setBodyContent(BodyContent bodyContent)
  {
    this.bodyContent = bodyContent;
  }

  public void doInitBody() throws JspException {
  }

  public int doAfterBody() throws JspException {
    try {
      this.bodyContent.writeOut(this.bodyContent.getEnclosingWriter());
    } catch (IOException e) {
      throw new JspException(e);
    }
    return 6;
  }
}