package com.pcts.common.tag.form;

import java.util.List;
import java.util.Map;

import com.pcts.common.tag.container.Search;
import com.pcts.common.tag.layout.FormPanel;
import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;

public class Calendar extends FormField
  implements Plugin
{
  public Calendar()
  {
    this.objectRegex = "enableKeyEvents|validator|regex|labelWidth|value|noOfMonth|noOfMonthPerRow";

    this.filters.add("flat");
    this.filters.add("disabledHeader");
    this.filters.add("readOnly");

    this.transfers.put("lines", "noOfMonthPerRow");
    this.transfers.put("calendars", "noOfMonth");
  }

  public void doPlugin(PluginMgr mgr) {
    boolean flat = getBoolParameter("flat", false);
    if (flat)
      mgr.injectPlugin("Ext.form.MultiCalendar");
  }

  public boolean doBeforeRender()
  {
    String readOnly = getParameter("readOnly");
    if (readOnly != null) {
      setParameter("editable", "true".equalsIgnoreCase(readOnly) ? "false" : "true");
    }
    super.doBeforeRender();
    initParameter("format", "Y-m-d");
    initParameter("noOfMonth", "1");
    initParameter("noOfMonthPerRow", "4");
    return false;
  }

  public void doAfterRender()
  {
    boolean flat = getBoolParameter("flat", false);

    if (!flat) {
      Form form = null;
      if ((form = (Form)getAncestorPresent(Form.class)) != null) {
        form.addParam(this.id);
      }
      Search search = null;
      if ((search = (Search)getAncestorPresent(Search.class)) != null) {
        search.addParam(this.id);
      }
      FormPanel formpanel = null;
      if ((formpanel = (FormPanel)getAncestorPresent(FormPanel.class)) != null)
        formpanel.addParam(this.id);
    }
  }

  public String getItemScript()
  {
    boolean flat = getBoolParameter("flat", false);
    if (flat)
    {
      initParameter("value", "Date.parseDate(new Date().getFullYear()+'-01-01','Y-m-d')");
      return "new Ext.form.MultiCalendar(" + getJSON() + ")";
    }

    return "new Ext.form.DateField(" + getJSON() + ")";
  }
}