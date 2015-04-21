package com.pcts.common.tag.form;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pcts.common.tag.container.Search;
import com.pcts.common.tag.grid.Column;
import com.pcts.common.tag.layout.ExtContainer;
import com.pcts.common.tag.layout.FormPanel;
import com.pcts.common.tag.widget.Widget;

public abstract class FormField extends Widget
{
  public abstract String getItemScript();

  public FormField()
  {
    this.objectRegex = "enableKeyEvents|validator|regex|labelWidth|timeout|columnWidth|defaults";

    this.arrayRegex = "items";

    this.filters = new ArrayList();
    this.filters.add("validate");

    this.transfers = new HashMap();
    this.transfers.put("itemCss", "ctCls");
  }

  public String getHTML()
  {
    return "<div id=\"ct_form_field_" + this.id + "\"></div>";
  }

  public boolean doBeforeRender()
  {
    setParameter("id", this.id);
    String validate = getParameter("validate");
    if (validate != null) {
      String[] values = validate.split("\\|");
      for (String value : values) {
        parseValidate(value);
      }
    }
    return false;
  }

  protected void parseValidate(String validate) {
    if (validate == null) return;
    String key = validate; String value = null;
    int index = -1;
    if ((index = validate.indexOf("[")) > -1) {
      key = validate.substring(0, index);
      try {
        value = validate.substring(index + 1, validate.length() - 1);
      }
      catch (Exception e) {
      }
    }
    if (("required".equalsIgnoreCase(key)) || ("isnull".equalsIgnoreCase(key)))
    {
      setParameter("allowBlank", "false");
      return;
    }

    if (value == null) return;
    if (("maxsize".equalsIgnoreCase(key)) || ("maxlength".equalsIgnoreCase(key)))
    {
      setParameter("maxLength", value);
    }
    else if (("minsize".equalsIgnoreCase(key)) || ("minlength".equalsIgnoreCase(key)))
    {
      setParameter("minLength", value);
    }
    else if ("maxvalue".equalsIgnoreCase(key))
    {
      setParameter("maxValue", value);
    }
    else if ("minvalue".equalsIgnoreCase(key))
    {
      setParameter("minValue", value);
    }
    else if ("maskre".equalsIgnoreCase(key))
    {
      setParameter("maskRe", value);
    }
  }

  public void doRelease()
  {
  }

  public void doAfterRender()
  {
    if (((this.parent instanceof Widget)) && (((Widget)this.parent).stopPropagation()))
    {
      return;
    }
    Form form = null;
    if ((form = (Form)getAncestorPresent(Form.class)) != null) {
      form.addParam(this.id);
    }
    Search search = null;
    if ((search = (Search)getAncestorPresent(Search.class)) != null) {
      search.addParam(this.id);
    }
    FormPanel formpanel = null;
    if ((formpanel = (FormPanel)getAncestorPresent(FormPanel.class)) != null)
      formpanel.addParam(this.id);
  }

  public void doRender()
  {
    if ((this.parent instanceof Widget))
    {
      Widget widget = (Widget)this.parent;

      if (widget.stopPropagation())
      {
        removeParameter(new String[] { "renderTo", "applyTo", "label", "labelWidth" });

        if ((this.parent instanceof Column))
          ((Column)this.parent).setParameter("editor", getItemScript());
        else if ((this.parent instanceof SearchBox))
          ((SearchBox)this.parent).addItem(getItemScript());
        else {
          widget.addItem(getItemScript());
        }
      }
      else if (((this.parent instanceof ExtContainer)) && (!(this.parent instanceof FormPanel)))
      {
        if (!isEmptyParameter("label")) {
          setParameter("fieldLabel", getParameter("label"));
        }
        removeParameter(new String[] { "label", "renderTo", "applyTo" });
        ((ExtContainer)this.parent).addItem(getItemScript());
        ((ExtContainer)this.parent).addWidgetId(this.id);
      } else {
        freedomRender();
      }
    } else {
      freedomRender();
    }
  }

  public void freedomRender()
  {
    setParameter("renderTo", "ct_form_field_" + this.id);
    outHTML();
    outScript(new String[] { "\n" + getScript() + this.id + " = Ext.getCmp(\"" + this.id + "\");" });
  }

  public String getScript() {
    return getItemScript() + ";";
  }
}