package com.pcts.common.tag.grid;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.jsp.tagext.Tag;

import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;

public class Operation extends Column
  implements Plugin
{
  public Operation()
  {
    this.arrayRegex = "params";

    this.transfers = new HashMap();
    this.transfers.put("checkedBind", "dataIndex");
    this.transfers.put("dataBind", "dataIndex");
  }

  public void doPlugin(PluginMgr mgr) {
    mgr.injectPlugin("sofa.grid.Operation");
  }

  public boolean doBeforeRender()
  {
    initParameter("dataType", "boolean");

    return true;
  }

  public void doRender()
  {
    ColumnGroupHeader group = (ColumnGroupHeader)getParentPresent(ColumnGroupHeader.class);
    if (group != null) {
      group.addColspan();
    }

    outScript();

    Tag tag = getParent();
    if ((tag instanceof Grid))
    {
      ((Grid)tag).setParameter("useOperationColumn", getJSON());
    }
  }

  public void doAfterRender()
  {
  }

  public String getField()
  {
    String dataIndex = getParameter("dataIndex");
    String dataType = getParameter("dataType");
    String field = "\"name\":\"" + dataIndex + "\"," + "\"mapping\":\"" + dataIndex + "\"," + (dataType == null ? "" : new StringBuilder().append("\"type\":\"").append(dataType).append("\"").toString());

    String comma = field.substring(field.length() - 1, field.length());
    if (",".equals(comma)) {
      field = field.substring(0, field.length() - 1);
    }
    return "{" + field + "}";
  }

  public void doRelease()
  {
  }

  public String getHTML()
  {
    return null;
  }

  public String getScript()
  {
    return null;
  }

  public void addParam(String param)
  {
    getDynamicAttributes();
    String params = (String)this.dynamicAttributes.get("params");

    if (params == null)
      params = param;
    else {
      params = params + "," + param;
    }
    this.dynamicAttributes.put("params", params);
  }
}