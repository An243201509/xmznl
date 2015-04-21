package com.pcts.common.tag.form;

import java.util.List;
import java.util.Map;

public class MultiListBox extends FormField
{
  public MultiListBox()
  {
    this.arrayRegex = "plugins|columns";

    this.objectRegex += "|store|storeConfig|minChars|selectIndex|data|baseParams|maxResultSize";

    this.transfers.put("autoLoad", "autoQuery");
    this.transfers.put("textField", "displayField");
    this.transfers.put("mustMatch", "forceSelection");
    this.transfers.put("hiddenId", "hiddenName");
    this.transfers.put("dataSource", "data");
    this.transfers.put("params", "baseParams");

    this.filters.add("readOnly");
    this.filters.add("autoLoad");
    this.filters.add("remote");
    this.filters.add("dataSource");
    this.filters.add("mustMatch");
    this.filters.add("showAll");
  }

  public boolean doBeforeRender()
  {
    initParameter("hideHeaders", Boolean.valueOf(true));
    return super.doBeforeRender();
  }

  public String getItemScript()
  {
    return "new sofa.form.MultiListBox(" + getJSON() + ")";
  }
}