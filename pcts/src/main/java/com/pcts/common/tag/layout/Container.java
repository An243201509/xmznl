package com.pcts.common.tag.layout;

public class Container extends ExtContainer
{
  public boolean doBeforeRender()
  {
    getDynamicAttributes();
    initParameter("layout", "form");
    initParameter("labelAlign", "right");
    return super.doBeforeRender();
  }
}