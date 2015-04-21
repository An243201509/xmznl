package com.pcts.common.tag.grid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pcts.common.tag.widget.PluginMgr;

public class TreeGrid extends Grid
{
  public TreeGrid(String id)
  {
    this.id = id;

    this.arrayRegex = "plugins|columns";

    this.objectRegex = "store|storeConfig|viewConfig|expandedAll|multiSelect|useOperationColumn|useCRUDColumn|useCheckColumn|useExpireColumn|useOtherCheckColumn";

    this.filters.add("idBind");

    this.filters.add("viewMode");
    this.filters.add("proxyType");
    this.filters.add("buffered");
    this.filters.add("pageSize");
    this.filters.add("dataSource");
    this.filters.add("autoLoad");
    this.filters.add("forceFit");
    this.filters.add("childrenParam");
    this.filters.add("nodeParam");

    this.filters.add("onloadexception");

    this.transfers = new HashMap();
    this.transfers.put("autoLoad", "autoQuery");
    this.transfers.put("onitemclick", "onRowClick");
    this.transfers.put("onitemdblclick", "onRowDblClick");
    this.transfers.put("idBind", "idProperty");
  }

  public void doPlugin(PluginMgr mgr)
  {
    mgr.injectPlugin("Ext.grid.TreeGrid");
  }

  public boolean doBeforeRender()
  {
    return false;
  }

  public void doRender()
  {
  }

  public void doAfterRender()
  {
  }

  /** @deprecated */
  public String getStore()
  {
    String storeConfig;
    if (isEmptyParameter("storeConfig")) {
      StringBuilder config = new StringBuilder("\"autoLoad\":false,");

      boolean buffered = Boolean.parseBoolean(getParameter("buffered", "false"));
      if (buffered) {
        config.append("\"buffered\":true,");
      }

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
        config.append("\"children\":\"" + childrenParam + "\",");
      }

      String checkedParam = getParameter("checkedParam");
      if (checkedParam != null) {
        config.append("\"checked\":" + checkedParam + ",");
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

      String url = getParameter("url");
      if (url != null) {
        config.append("\"url\":\"" + url + "\",");
      }

      String dataSource = getParameter("dataSource");
      if (dataSource != null) {
        config.append("\"proxy\":new Ext.data.MemoryProxy(" + dataSource + "),");
      }

      String fields = getParameter("fields", "");
      config.append("\"fields\":[" + fields + "],");

      config.append("\"listeners\":{");
      String onBeforeCreateNode = getEvent("onBeforeCreateNode");
      if (onBeforeCreateNode != null) {
        config.append("\"beforecreatenode\":" + onBeforeCreateNode);
      }
      String onLoad = getEvent("onLoad");
      if (onLoad != null) {
        config.append("\"load\":" + onLoad);
      }
      String onLoadException = getEvent("onLoadException");
      if (onLoadException != null) {
        config.append("\"loadexception\":" + onLoadException);
      }
      String onNodeRender = getEvent("onNodeRender");
      if (onNodeRender != null) {
        config.append("\"noderender\":" + onNodeRender);
      }
      config.append("},");

      config.append("\"id\":\"_grid_store_" + this.id + "\"");

      storeConfig = "{" + config.toString() + "}";
    } else {
      storeConfig = getParameter("storeConfig", "{}");
    }

    return "new Ext.data.TreeStore(" + storeConfig + ");";
  }

  public String getHTML()
  {
    return null;
  }

  public String getScript()
  {
    StringBuilder grid = new StringBuilder();

    outColumnHeaderGroup();

    String childrenParam = getParameter("childrenParam");
    StringBuilder storeConfig = new StringBuilder();
    if (childrenParam != null) {
      storeConfig.append("\"childrenParam\":\"" + childrenParam + "\",");
    }
    String nodeParam = getParameter("nodeParam");
    if (nodeParam != null) {
      storeConfig.append("\"nodeParam\":\"" + nodeParam + "\",");
    }
    if (storeConfig.length() > 0) {
      storeConfig.setLength(storeConfig.length() - 1);
    }
    setParameter("storeConfig", "{" + storeConfig.toString() + "}");

    grid.append(this.id + " = new sofa.tree.GridPanel(" + getJSON() + ");").append("\n");

    if (this.context.getWorkFlow().isUseFlow()) {
      grid.append("if (Workflow) {").append("\n");
      grid.append("Workflow.addGridEvent(" + this.id + ");").append("\n");
      grid.append("}").append("\n");
    }
    return grid.toString();
  }

  public void initView() {
    StringBuilder viewConfig = new StringBuilder();

    boolean forceFit = Boolean.parseBoolean(getParameter("forceFit", "false"));
    if (forceFit) {
      viewConfig.append("\"forceFit\":true,");
    }
    if (viewConfig.length() > 0) {
      viewConfig.setLength(viewConfig.length() - 1);
    }
    String config = getParameter("viewConfig");
    if ((config != null) && (config.length() > 0)) {
      if ((config.startsWith("{")) && (config.endsWith("}"))) {
        config = config.substring(1, config.length() - 1);
      }
      if (viewConfig.length() > 0) {
        viewConfig.append(",");
      }
      viewConfig.append(config);
    }
    setParameter("viewConfig", "{" + viewConfig + "}");
  }
}