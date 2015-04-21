package com.pcts.common.tag.grid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.jsp.tagext.Tag;

import com.pcts.common.tag.container.Container;
import com.pcts.common.tag.form.ListView;

public class Column extends Container
{
  final String EDITOR = "_editor_config";
  final String EDITOR_EVENTS = "_editor_events";

  public Column()
  {
    this.propagation = true;

    this.transfers = new HashMap();
    this.transfers.put("text", "header");
    this.transfers.put("dataBind", "dataIndex");

    this.objectRegex = "editor|renderer";
    this.filters = new ArrayList();
    this.filters.add("xtype");
    this.filters.add("editorType");
    this.filters.add("type");
    this.filters.add("visible");
    this.filters.add("_editor_config");
    this.filters.add("_editor_events");
  }

  public boolean doBeforeRender()
  {
    String type = getParameter("type");
    String xtype = getParameter("xtype");
    if ((xtype == null) && (type != null)) {
      if (type.indexOf("rownumber") > -1)
        setParameter("xtype", "rownumberer");
      else {
        setParameter("xtype", type + "column");
      }
    }

    Tag parent = getParent();
    if (!(parent instanceof ListView))
    {
      initParameter("sortable", "true");
    }

    return true;
  }

  public void doRender()
  {
    Tag parent = getParent();
    if ((parent instanceof Grid))
    {
      Grid grid = (Grid)parent;

      initEditor();

      if (equalsParamter("xtype", "rownumberer"))
      {
        grid.setParameter("useRowNumberColumn", "true");
      }
      else {
        grid.addColumn(getScript());
      }
    }

    if ((parent instanceof ListView)) {
      ((ListView)parent).addColumn(getScript());
    }

    ColumnGroupHeader group = (ColumnGroupHeader)getParentPresent(ColumnGroupHeader.class);
    if (group != null)
      group.addColspan();
  }

  public void doAfterRender()
  {
  }

  public String getHTML()
  {
    return null;
  }

  public void initEditor()
  {
    boolean editorEmpty = isEmptyParameter("editor");
    boolean edtiorTypeEmpty = isEmptyParameter("editorType");
    if ((!editorEmpty) || (!edtiorTypeEmpty)) {
      Grid grid = (Grid)getAncestorPresent(Grid.class);
      grid.setParameter("editable", "true");
      String events = getParameter("_editor_events", "{}");

      if ((editorEmpty) && (!edtiorTypeEmpty))
      {
        String editorType = getParameter("editorType");
        String allowBlank = getParameter("allowBlank", "true");
        String field = "";
        if ("numberfield".equalsIgnoreCase(editorType)) {
          String format = getParameter("format", "");
          field = "new sofa.form.NumberField({allowBlank:" + allowBlank + ",format:\"" + format + "\"})";
        } else if ("datefield".equalsIgnoreCase(editorType)) {
          field = "new Ext.form.DateField({allowBlank:" + allowBlank + "})";
        } else if ("combobox".equalsIgnoreCase(editorType)) {
          field = "new Ext.form.ComboBox({allowBlank:" + allowBlank + "})";
        } else if ("listview".equalsIgnoreCase(editorType)) {
          field = "new sofa.form.ListView(" + getParameter("_editor_config") + ")";
        } else {
          field = "new Ext.form.TextField({allowBlank:" + allowBlank + "})";
        }
        setParameter("editor", "new Ext.Editor(" + field + "," + events + ")");
      }
      else if ((!editorEmpty) && (edtiorTypeEmpty))
      {
        String editor = getParameter("editor", "");
        String lowerEditor = editor.toLowerCase();
        String field = "";
        if (lowerEditor.indexOf("form.textfield") > -1)
          field = "new Ext.form.TextField(" + editor + ")";
        else if (lowerEditor.indexOf("form.numberfield") > -1)
          field = "new sofa.form.NumberField(" + editor + ")";
        else if (lowerEditor.indexOf("form.datefield") > -1)
          field = "new Ext.form.DateField(" + editor + ")";
        else if (lowerEditor.indexOf("form.combobox") > -1)
          field = "new Ext.form.ComboBox(" + editor + ")";
        else if (lowerEditor.indexOf("form.listview") > -1) {
          field = "new sofa.form.ListView(" + editor + ")";
        }
        if (field.length() > 0)
          setParameter("editor", "new Ext.Editor(" + field + "," + events + ")");
        else {
          setParameter("editor", editor);
        }
      }

    }

    String dataType = getParameter("dataType");
    String format = getParameter("format");
    if ("date".equalsIgnoreCase(dataType)) {
      setParameter("xtype", "datecolumn");
      if (format == null)
        setParameter("format", getParameter("dateFormat"));
    }
  }

  public String getField()
  {
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

    boolean visible = Boolean.parseBoolean(getParameter("visible", "true"));
    if (!visible) {
      column.append("\"hidden\":true,");
    }
    return getJSON(column.toString());
  }

  public void doRelease()
  {
  }

  public void setEditor(String config)
  {
    getDynamicAttributes().put("_editor_config", config);
  }

  public void setEditorEvents(String events) {
    getDynamicAttributes().put("_editor_events", events);
  }
}