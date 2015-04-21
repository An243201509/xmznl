// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   InputText.java

package com.pcts.common.tag.form;

import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;


public class InputText extends FormField
    implements Plugin
{

    public InputText()
    {
        filters.add("mode");
    }

    public void initPlugin(PluginMgr mgr)
    {
        mgr.register("Ext.form.SpinnerField", "/plugin/form/Ext.form.SpinnerField.js", "/plugin/resources/css/Spinner.css", null);
    }

    public void doPlugin(PluginMgr mgr)
    {
        String mode = getParameter("mode", "text");
        boolean hideTrigger = getBoolParameter("hideTrigger", true);
        if("numeric".equalsIgnoreCase(mode) && !hideTrigger)
            mgr.injectPlugin("Ext.form.SpinnerField");
    }

    public String getItemScript()
    {
        String mode = getParameter("mode", "text");
        if("multi".equalsIgnoreCase(mode))
            return (new StringBuilder()).append("new Ext.form.TextArea(").append(getJSON()).append(")").toString();
        if("numeric".equalsIgnoreCase(mode))
        {
            boolean hideTrigger = getBoolParameter("hideTrigger", true);
            if(hideTrigger)
                return (new StringBuilder()).append("new sofa.form.NumberField(").append(getJSON()).append(")").toString();
            else
                return (new StringBuilder()).append("new Ext.form.SpinnerField(").append(getJSON()).append(")").toString();
        }
        if("hidden".equalsIgnoreCase(mode))
            return (new StringBuilder()).append("new Ext.form.Hidden(").append(getJSON("\"inputType\":\"hidden\",")).append(")").toString();
        if("password".equalsIgnoreCase(mode))
            mode = "\"inputType\":\"password\",";
        else
            mode = null;
        return (new StringBuilder()).append("new Ext.form.TextField(").append(getJSON(mode)).append(")").toString();
    }
}
