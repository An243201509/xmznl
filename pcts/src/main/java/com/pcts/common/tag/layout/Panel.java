package com.pcts.common.tag.layout;

public class Panel extends ExtContainer
{
  public Panel()
  {
    this.xtype = "panel";
  }

  public boolean doBeforeRender()
  {
    return super.doBeforeRender();
  }

  public String getScript()
  {
    initParameter("border", "false");
    String printStr = "";
    if (getParentPresent(ExtContainer.class) != null) {
      printStr = this.id + ".doLayout()";
    }
    return this.id + " = new Ext.Panel(" + getJSON() + ");" + printStr;
  }
}