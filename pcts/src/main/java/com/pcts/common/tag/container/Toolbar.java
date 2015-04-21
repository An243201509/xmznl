package com.pcts.common.tag.container;

import java.util.HashMap;

import javax.servlet.jsp.tagext.Tag;

import com.pcts.common.tag.jsp.Context;
import com.pcts.common.tag.jsp.WorkFlow;
import com.pcts.common.tag.layout.ExtContainer;

public class Toolbar extends Container
{
  public Toolbar()
  {
    this.arrayRegex = "buttons";
  }

  public boolean doBeforeRender()
  {
    return true;
  }

  public void doRender()
  {
    Tag tag = getParent();

    if ((tag instanceof ExtContainer))
    {
      ((ExtContainer)tag).addItem(this.id);//TODO
    }
    else
    {
      outHTML();

      setParameter("applyTo", "ct_" + this.id);
    }

    outScript();
  }

  public void doAfterRender()
  {
  }

  public void doRelease()
  {
  }

  public String getHTML()
  {
    return "<div id=\"ct_" + this.id + "\"></div>";
  }

  public String getScript()
  {
    StringBuilder toolbar = new StringBuilder();
    toolbar.append(this.id + " = new sofa.Toolbar(" + getJSON() + ");");

    if (this.context.getWorkFlow().isUseFlow()) {
      toolbar.append("if (Workflow) {").append("\n");
      toolbar.append("Workflow.addToolbarEvent(" + this.id + ");").append("\n");
      toolbar.append("}").append("\n");
    }
    return toolbar.toString();
  }

  public void addParam(String param) {
    getDynamicAttributes();
    String items = (String)this.dynamicAttributes.get("buttons");

    if (items == null)
      items = param;
    else {
      items = items + "," + param;
    }
    this.dynamicAttributes.put("buttons", items);
  }
}