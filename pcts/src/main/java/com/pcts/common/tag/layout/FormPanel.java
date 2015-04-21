package com.pcts.common.tag.layout;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.jsp.tagext.Tag;

import com.pcts.common.tag.container.Window;
import com.pcts.common.tag.jsp.JSP;

public class FormPanel extends ExtContainer
{
  final String BUTTON_KEY = "_button_key";

  final String ITEM_KEY = "_item_key";

  final String NESTLAYOUT = "_nestlayout";

  public FormPanel()
  {
    this.xtype = "formpanel";

    this.transfers = new HashMap();
    this.transfers.put("success", "onSuccess");
    this.transfers.put("error", "onError");
    this.transfers.put("action", "url");

    this.filters.add("_item_key");
    this.filters.add("items");

    this.excludes = new ArrayList();
    this.excludes.add("validation");
    this.excludes.add("_button_key");
    this.excludes.add("_nestlayout");
  }

  public boolean doBeforeRender()
  {
    Tag parent = getParent();

    if ((parent instanceof ExtContainer))
    {
      ((ExtContainer)parent).addItem("fp_" + this.id);
    }
    else if ((parent instanceof Window))
    {
      ((Window)parent).setParameter("items", "fp_" + this.id);
    }
    else if ((parent instanceof JSP))
    {
      if (((JSP)parent).getBoolParameter("include", false))
      {
        Tag _tag;
        if ((_tag = getAncestorPresent(ExtContainer.class)) != null)
          ((ExtContainer)_tag).addItem("fp_" + this.id);
        else if ((_tag = getAncestorPresent(Window.class)) != null)
          ((Window)_tag).setParameter("items", "fp_" + this.id);
      }
      else
      {
        initParameter("fit", "true");

        String renderTo = getParameter("renderTo");

        String applyTo = getParameter("applyTo");

        if ((applyTo == null) && (renderTo == null))
        {
          setParameter("renderTo", "ct_form_" + this.id);
        }
      }

    }
    else
    {
      String renderTo = getParameter("renderTo");

      String applyTo = getParameter("applyTo");

      if ((applyTo == null) && (renderTo == null))
      {
        setParameter("renderTo", "ct_form_" + this.id);
      }

    }

    outHTML("<div id=\"ct_form_" + this.id + "\">");

    outHTML("<div id=\"form_body_" + this.id + "\">");

    return true;
  }

  public void doRender()
  {
    getDynamicAttributes();

    String itemIds = (String)this.dynamicAttributes.get("_widget_items_id");

    removeParameter("id");

    outScript();

    if (itemIds != null) {
      String[] items = itemIds.split(",");
      for (String id : items)
        this.context.addScriptContent("\n" + id + " = Ext.getCmp(\"" + id + "\");", false);
    }
  }

  public void doAfterRender()
  {
    outHTML("</div>");

    outHTML("</div>");
  }

  public String getScript()
  {
    StringBuilder formStr = new StringBuilder();

    String url = getParameter("url");

    if (url == null)
    {
      url = getParameter("action", "");
    }

    String buttons = null;

    buttons = getButton();

    String items = null; String layout = getParameter("layout", "form");

    if (isEmptyParameter("items")) {
      items = "\"items\":{\"xtype\":\"container\",\"region\":\"center\",\"autoScroll\":true,\"layout\":\"" + layout + "\"," + "\"contentEl\":\"form_body_" + this.id + "\"" + "},";
    }
    else
    {
      items = "\"items\":{\"xtype\":\"container\",\"region\":\"center\",\"autoScroll\":true,\"layout\":\"" + layout + "\"," + "\"items\":[" + getParameter("items") + "]" + "},";
    }

    formStr.append("fp_" + this.id + " = new Ext.FormPanel(" + getJSON(new StringBuilder().append("\"id\":\"").append(this.id).append("\",").append("\"basicFormId\":\"").append(this.id).append("\",").append("\"layout\":\"border\",").append("\"border\":false,").append("\"buttons\":").append(buttons).append(",").append("\"buttonAlign\":\"center\",").append("\"url\":\"").append(url).append("\",").append("\"cls\":\"ext-form\",").append(items).toString()) + ");" + this.id + " = fp_" + this.id + ".getForm();" + this.id + ".setFormPanel(fp_" + this.id + ");");

    String fields = getParameter("_item_key", "");
    if ((fields != null) && (fields.length() > 0)) {
      formStr.append(this.id + ".add(" + fields + ");");
    }

    if ((buttons != null) && (buttons.length() > 0)) {
      formStr.append(this.id + ".addButton(" + buttons + ");");
    }

    return formStr.toString();
  }

  public void addButton(String buttonId)
  {
    getDynamicAttributes();
    List buttons = (List)this.dynamicAttributes.get("_button_key");
    if (buttons == null) {
      buttons = new ArrayList();
      setParameter("_button_key", buttons);
    }
    buttons.add(buttonId);
  }

  public String getButton()
  {
    getDynamicAttributes();
    List buttons = (List)this.dynamicAttributes.get("_button_key");
    return buttons == null ? null : buttons.toString();
  }

  public void addParam(String param) {
    getDynamicAttributes();
    String items = (String)this.dynamicAttributes.get("_item_key");

    if (items == null)
      items = "Ext.getCmp(\"" + param + "\")";
    else {
      items = items + ",Ext.getCmp(\"" + param + "\")";
    }
    this.dynamicAttributes.put("_item_key", items);
  }
}