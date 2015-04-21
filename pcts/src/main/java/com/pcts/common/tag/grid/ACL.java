package com.pcts.common.tag.grid;

import com.pcts.common.tag.widget.Widget;


public class ACL extends Widget
{
  public boolean doBeforeRender()
  {
    return false;
  }

  public void doRender()
  {
    outScript();
    Grid grid = null;
    if ((grid = (Grid)getAncestorPresent(Grid.class)) != null)
      grid.addPlugin("_grid_acl_" + this.id);
  }

  public void doAfterRender()
  {
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
    return "var _grid_acl_" + this.id + " = new sofa.grid.ACL(" + getJSON(new StringBuilder().append("\"id\":\"").append(this.id).append("\",").toString()) + ");";
  }
}