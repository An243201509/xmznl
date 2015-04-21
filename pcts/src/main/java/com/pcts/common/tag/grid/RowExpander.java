package com.pcts.common.tag.grid;

import javax.servlet.jsp.JspException;

import com.pcts.common.tag.container.Container;

public class RowExpander extends Container
{
  public boolean doBeforeRender()
  {
    return true;
  }

  public void doRender() {
    outScript();
    Grid grid = null;
    if ((grid = (Grid)getAncestorPresent(Grid.class)) != null)
      grid.addPlugin("_grid_rowexpander_" + this.id);
  }

  public void doAfterRender()
  {
  }

  public void doRelease() {
  }

  public String getHTML() {
    return null;
  }

  public int doAfterBody() throws JspException
  {
    return 6;
  }

  public String getScript()
  {
    String template = "";
    if (this.bodyContent != null) {
      template = this.bodyContent.getString();
      template = template.trim();
      template = template.replaceAll("'", "'");
    }

    return "var _grid_rowexpander_" + this.id + " = new Ext.grid.RowExpander({" + "tpl: new Ext.XTemplate('" + template + "')" + "});";
  }
}