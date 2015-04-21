package com.pcts.common.tag.form;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.jsp.tagext.Tag;

import com.pcts.common.tag.container.Search;
import com.pcts.common.tag.layout.ExtContainer;
import com.pcts.common.tag.layout.FormPanel;
import com.pcts.common.tag.widget.Widget;

public class Button extends Widget
{
  public Button()
  {
    this.transfers = new HashMap();
    this.transfers.put("value", "text");
    this.transfers.put("itemStyle", "style");
    this.transfers.put("itemCss", "ctCls");
  }

  public boolean doBeforeRender()
  {
    return false;
  }

  public void doRender()
  {
    Tag parent = getParent();
    Form form = (Form)getAncestorPresent(Form.class);
    FormPanel formpanel = (FormPanel)getAncestorPresent(FormPanel.class);
    Search search = (Search)getAncestorPresent(Search.class);
    ButtonGroup group = (ButtonGroup)getAncestorPresent(ButtonGroup.class);

    if (((form != null) || (search != null) || (formpanel != null)) && (group == null)) {
      if (form != null)
        form.addButton(this.id);
      else if (search != null) {
        search.addButton(this.id);
      }
      if (((parent instanceof ExtContainer)) && (!(parent instanceof FormPanel))) {
        ((ExtContainer)parent).addItem(getItemScript());
      }
      else {
        setParameter("renderTo", "ct_btn_" + this.id);
        outHTML();
        outScript();
      }
      return;
    }

    if (group != null) {
      group.addButton(this);
      return;
    }

    setParameter("renderTo", "ct_btn_" + this.id);

    outHTML();
    outScript();
  }

  public void doAfterRender()
  {
  }

  public String getHTML() {
    return "<div id=\"ct_btn_" + this.id + "\"></div>";
  }

  public String getScript() {
    return "new sofa.Button(" + getJSON(new StringBuilder().append("id:\"").append(this.id).append("\",").toString()) + ");" + this.id + " = Ext.getCmp(\"" + this.id + "\");";
  }

  public String getItemScript()
  {
    return "new sofa.Button(" + getJSON(new StringBuilder().append("id:\"").append(this.id).append("\",").toString()) + ")";
  }

  public String getButton()
  {
    return getJSON();
  }

  public void doRelease()
  {
  }
}