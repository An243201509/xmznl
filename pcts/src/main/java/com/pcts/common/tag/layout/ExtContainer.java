package com.pcts.common.tag.layout;

import java.util.HashMap;
import java.util.List;
import javax.servlet.jsp.tagext.Tag;

public class ExtContainer extends BaseContainer
{
  public ExtContainer()
  {
    this.xtype = "container";

    this.objectRegex = "columns|layoutConfig|defaults|labelWidth|columnWidth";

    this.filters.add("fields");
  }

  public boolean doBeforeRender()
  {
    Tag tag = getParent();

    if (!(tag instanceof ExtContainer))
    {
      String renderTo = getParameter("renderTo");

      String applyTo = getParameter("applyTo");

      if ((applyTo == null) && (renderTo == null))
      {
        outHTML();

        setParameter("renderTo", "ct_" + this.id);
      }

    }

    return true;
  }

  public void doRender()
  {
    Tag tag = getParent();

    getDynamicAttributes();

    String itemIds = (String)this.dynamicAttributes.get("_widget_items_id");

    if ((tag instanceof ExtContainer))
    {
      removeParameter("id");

      if (itemIds != null) {
        ((ExtContainer)tag).addWidgetId(itemIds);
      }

      ((ExtContainer)tag).addItem(getJSON("\"xtype\":\"" + this.xtype + "\","));
    }
    else
    {
      outScript();

      if (itemIds != null) {
        String[] items = itemIds.split(",");
        for (String id : items)
          this.context.addScriptContent("\n" + id + " = Ext.getCmp(\"" + id + "\");", false);
      }
    }
  }

  public String getHTML()
  {
    return "<div id=\"ct_" + this.id + "\"></div>";
  }

  public String getScript()
  {
    return this.id + " = new Ext.Container(" + getJSON() + ");";
  }
}