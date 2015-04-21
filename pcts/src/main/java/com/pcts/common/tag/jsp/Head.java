package com.pcts.common.tag.jsp;

import com.pcts.common.tag.container.Container;

public class Head extends Container
{
  public boolean doBeforeRender()
  {
    return true;
  }

  public void doRender()
  {
    Page page;
    if ((page = (Page)getAncestorPresent(Page.class)) != null)
      page.setHead(getHTML());
    else
      outHTML();
  }

  public void doAfterRender()
  {
  }

  public void doRelease()
  {
  }

  public String getHTML()
  {
    StringBuilder buffer = new StringBuilder();
    buffer.append("<head>").append("\n").append("<title>" + getParameter("title", "{title}") + "</title>").append("\n").append(getParameter("meta", "{meta}")).append("\n").append(getParameter("resource", "{resource}")).append("\n").append(this.bodyContent.getString()).append("\n").append("</head>");

    return buffer.toString();
  }

  public String getScript()
  {
    return null;
  }
}