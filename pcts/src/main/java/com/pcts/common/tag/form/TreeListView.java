package com.pcts.common.tag.form;

import java.util.List;
import java.util.Map;

import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;

public class TreeListView extends FormField
  implements Plugin
{
  public TreeListView()
  {
    this.objectRegex += "|loader|loaderConfig|minChars|selectIndex|baseParams";

    this.transfers.put("autoLoad", "autoQuery");
    this.transfers.put("textField", "displayField");
    this.transfers.put("textParam", "displayField");
    this.transfers.put("mustMatch", "forceSelection");
    this.transfers.put("hiddenId", "hiddenName");
    this.transfers.put("nodeParameter", "nodeParam");
    this.transfers.put("params", "baseParams");

    this.filters.add("readOnly");
    this.filters.add("autoLoad");
    this.filters.add("remote");
    this.filters.add("dataSource");

    this.filters.add("mustMatch");
    this.filters.add("showAll");
  }

  public void doPlugin(PluginMgr mgr) {
    mgr.injectPlugin("Ext.form.TreeListView");
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
    return "new sofa.form.TreeView(" + getJSON() + ")";
  }

  @Deprecated
  public String getLoader()
  {
    String loaderConfig;
    if (isEmptyParameter("loaderConfig")) {
      StringBuilder config = new StringBuilder();

      String textParam = getParameter("textParam");
      if (textParam != null) {
        config.append("\"textParam\":\"" + textParam + "\",");
      }

      String nodeParam = getParameter("nodeParam");
      if (nodeParam != null) {
        config.append("\"nodeParam\":\"" + nodeParam + "\",");
      }

      String template = getParameter("template");
      if (template != null) {
        config.append("\"template\":\"" + template + "\",");
      }

      String childrenParam = getParameter("childrenParam");
      if (childrenParam != null) {
        config.append("\"childrenParam\":\"" + childrenParam + "\",");
      }

      String checkedParam = getParameter("checkedParam");
      if (checkedParam != null) {
        config.append("\"checkedParam\":" + checkedParam + ",");
      }

      String baseAttrs = getParameter("baseAttrs");
      if (baseAttrs != null) {
        config.append("\"baseAttrs\":" + baseAttrs + ",");
      }

      String params = getParameter("params");
      if (params != null) {
        config.append("\"baseParams\":" + params + ",");
      }

      String idBind = getParameter("idBind");
      if (idBind != null) {
        config.append("\"idProperty\":\"" + idBind + "\",");
      }

      String requestMethod = getParameter("requestMethod");
      if (requestMethod != null) {
        config.append("\"requestMethod\":\"" + requestMethod + "\",");
      }

      boolean expandedAll = Boolean.parseBoolean(getParameter("expandedAll", "false"));
      if (expandedAll) {
        config.append("\"expandedAll\":true,");
      }

      boolean multiSelect = Boolean.parseBoolean(getParameter("multiSelect", "false"));
      if (multiSelect) {
        config.append("\"multiSelect\":true,");
      }

      String url = getParameter("url");
      if (url != null) {
        config.append("\"url\":\"" + url + "\",");
      }

      String dataSource = getParameter("dataSource");
      if (dataSource != null) {
        config.append("\"data\":" + dataSource + ",");
      }

      if (config.length() > 0) {
        config.setLength(config.length() - 1);
      }

      loaderConfig = "{" + config.toString() + "}";
    } else {
      loaderConfig = getParameter("loaderConfig", "{}");
    }

    return "new Ext.tree.TreeLoader(" + loaderConfig + ")";
  }
}