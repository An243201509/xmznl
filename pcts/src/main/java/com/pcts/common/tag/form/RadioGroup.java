package com.pcts.common.tag.form;

import java.util.HashMap;

public class RadioGroup extends FormField
{
  public RadioGroup()
  {
    this.propagation = true;
    this.objectRegex += "|columns";
    this.arrayRegex = "items";
  }

  public boolean doBeforeRender()
  {
    setParameter("renderTo", "ct_form_field_" + this.id);
    super.doBeforeRender();
    return true;
  }

  public String getItemScript()
  {
    return "new Ext.form.RadioGroup(" + getJSON() + ")";
  }

  public void addParam(String param) {
    getDynamicAttributes();
    String items = (String)this.dynamicAttributes.get("items");

    if (items == null)
      items = param;
    else {
      items = items + "," + param;
    }
    this.dynamicAttributes.put("items", items);
  }
}