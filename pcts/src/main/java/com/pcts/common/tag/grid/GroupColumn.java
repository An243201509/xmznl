package com.pcts.common.tag.grid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pcts.common.tag.container.Container;

public class GroupColumn extends Container
{
  public GroupColumn()
  {
    this.transfers = new HashMap();
    this.transfers.put("text", "header");
    this.transfers.put("dataBind", "dataIndex");

    this.objectRegex = "editor|renderer";
    this.filters = new ArrayList();
    this.filters.add("xtype");
    this.filters.add("type");
    this.filters.add("visible");
  }

  public void doRender()
  {
    ColumnGroupHeader group = (ColumnGroupHeader)getParentPresent(ColumnGroupHeader.class);
    if (group != null)
    {
      group.addChildren(this.dynamicAttributes);
    }
  }

  public void doAfterRender()
  {
  }

  public String getHTML()
  {
    return null;
  }

  public String getField() {
    if (!equalsParamter("xtype", "rownumberer")) {
      String dataIndex = getParameter("dataIndex");
      String dataType = getParameter("dataType");
      String dateFormat = getParameter("dateFormat");
      String field = "\"name\":\"" + dataIndex + "\"," + "\"mapping\":\"" + dataIndex + "\"," + (dataType == null ? "" : new StringBuilder().append("\"type\":\"").append(dataType).append("\"").toString()) + (dateFormat == null ? "" : new StringBuilder().append(",\"dateFormat\":\"").append(dateFormat).append("\"").toString());

      String comma = field.substring(field.length() - 1, field.length());
      if (",".equals(comma)) {
        field = field.substring(0, field.length() - 1);
      }
      return "{" + field + "}";
    }
    return null;
  }

  public String getScript()
  {
    StringBuilder column = new StringBuilder();

    String xtype = getParameter("xtype");
    if ((xtype != null) && (!"rownumberer".equals(xtype))) {
      column.append("\"xtype\":\"" + xtype + "\",");
    }

    String editor = getParameter("editor");
    if (editor != null) {
      column.append("\"editor\":" + editor + ",");
    }

    boolean visible = Boolean.parseBoolean(getParameter("visible", "true"));
    if (!visible) {
      column.append("\"hidden\":true,");
    }
    return getJSON(column.toString());
  }

  public void doRelease()
  {
  }

  public boolean doBeforeRender()
  {
    return false;
  }
}