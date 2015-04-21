package com.pcts.common.tag.grid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;

public class ColumnGroupHeader extends Column
  implements Plugin
{
  public ColumnGroupHeader()
  {
    this.objectRegex += "|colspan";
  }

  public void doPlugin(PluginMgr mgr) {
    mgr.injectPlugin("Ext.grid.ColumnHeaderGroup");
  }

  public void doRender()
  {
    ColumnGroupHeader parent = (ColumnGroupHeader)getParentPresent(ColumnGroupHeader.class);
    if (parent != null)
    {
      parent.addColspan(getColspan());
      parent.addChildren(this.dynamicAttributes);
    } else {
      Grid grid = (Grid)getAncestorPresent(Grid.class);
      if (grid != null)
        grid.addColumGroup(this.dynamicAttributes);
    }
  }

  public int getColspan()
  {
    return getIntParameter("colspan", 1);
  }

  public void addColspan() {
    int colspan = getIntParameter("colspan", 0);
    colspan++; setParameter("colspan", "" + colspan);
  }

  public void addColspan(int colspan)
  {
    int _colspan = getIntParameter("colspan", 0);
    setParameter("colspan", "" + (colspan + _colspan));
  }

  public String getScript()
  {
    List children;
    if ((children = (List)getObjectParameter("children")) != null) {
      return getJSON("\"children\":" + children.toString() + ",");
    }
    return getJSON();
  }

  public void addChildren(Map<String, Object> group)
  {
    getDynamicAttributes();

    List children = (List)this.dynamicAttributes.get("children");

    if (children == null) {
      children = new ArrayList();
      this.dynamicAttributes.put("children", children);
    }
    children.add(group == null ? new HashMap() : group);
  }

  public void doRelease()
  {
  }
}