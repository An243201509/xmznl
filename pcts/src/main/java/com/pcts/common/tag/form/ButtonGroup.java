package com.pcts.common.tag.form;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.pcts.common.tag.container.Container;
import com.pcts.common.tag.container.Window;

public class ButtonGroup extends Container
{
  final String BUTTON_SCRIPT_KEY = "_button_script_key";

  Window ancestorWindow = null;
  Form ancestorForm = null;

  public ButtonGroup()
  {
    this.objectRegex = "useDefault";

    this.excludes = new ArrayList();
    this.excludes.add("_button_script_key");
  }

  public boolean doBeforeRender()
  {
    this.ancestorForm = ((Form)getAncestorPresent(Form.class));

    this.ancestorWindow = ((Window)getAncestorPresent(Window.class));
    if (this.ancestorWindow == null) {
      outHTML("<div id=\"ct_" + this.id + "\">");
    }
    return true;
  }

  public void doRender()
  {
    if (this.ancestorForm != null) {
      this.ancestorForm.addButtonGroup(this.id);
      if (this.ancestorWindow != null) {
        this.ancestorWindow.setFormId(this.ancestorForm.getId());
      }
    }
    outScript();
  }

  public void doAfterRender()
  {
    if (this.ancestorWindow == null) {
      outHTML("</div>");
    }

    this.ancestorWindow = null;
    this.ancestorForm = null;
    release();
  }

  public void addButton(Button button)
  {
    if (this.dynamicAttributes == null) {
      this.dynamicAttributes = new HashMap();
    }
    List scripts = (List)this.dynamicAttributes.get("_button_script_key");
    if (scripts == null) {
      scripts = new ArrayList();
      this.dynamicAttributes.put("_button_script_key", scripts);
    }
    scripts.add(button.getButton());
  }

  public String getHTML()
  {
    return null;
  }

  public String getButton()
  {
    if (this.dynamicAttributes == null) return null;
    List scripts = (List)this.dynamicAttributes.get("_button_script_key");
    return scripts == null ? "" : scripts.toString();
  }

  public String getJSON()
  {
    List scripts = null;
    if (this.dynamicAttributes != null) {
      scripts = (List)this.dynamicAttributes.get("_button_script_key");
    }
    return super.getJSON("id:\"" + this.id + "\"," + (scripts != null ? "items:" + scripts.toString() + "," : "") + (this.ancestorWindow == null ? "applyTo: \"ct_" + this.id + "\"," : new StringBuilder().append("windowId: \"").append(this.ancestorWindow.getId()).append("\",").toString()) + (this.ancestorForm != null ? "formId: \"" + this.ancestorForm.getId() + "\"," : ""));
  }

  public String getScript()
  {
    return "new sofa.ButtonGroup(" + getJSON() + ");" + this.id + " = Ext.getCmp(\"" + this.id + "\");";
  }

  public void doRelease()
  {
  }
}