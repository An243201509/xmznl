package com.pcts.common.tag.form;

public class TimeField extends FormField
{
  public TimeField()
  {
    this.objectRegex += "|increment";
  }

  public String getItemScript()
  {
    return "new Ext.form.TimeField(" + getJSON() + ")";
  }
}