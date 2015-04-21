// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Window.java

package com.pcts.common.tag.container;

import java.util.*;

// Referenced classes of package com.yss.sofa.tag.container:
//            Container

public class Window extends Container
{

    public Window()
    {
        excludes = new ArrayList();
        excludes.add("_button_group_key");
        excludes.add("items");
    }

    public boolean doBeforeRender()
    {
        String src = getParameter("src");
        String formURL = getParameter("formURL");
        outHTML((new StringBuilder()).append("<div id=\"ct_").append(id).append("\">").toString());
        if(src == null && formURL == null)
            outHTML((new StringBuilder()).append("<div id=\"ct_body_").append(id).append("\" class=\"x-hidden\">").toString());
        return true;
    }

    public void doRender()
    {
        outScript();
    }

    public void doAfterRender()
    {
        String src = getParameter("src");
        String formURL = getParameter("formURL");
        if(src == null && formURL == null)
            outHTML("</div>");
        outHTML("</div>");
    }

    public String getHTML()
    {
        return null;
    }

    public String getScript()
    {
        Boolean visible = Boolean.valueOf(Boolean.parseBoolean(getParameter("visible")));
        String src = getParameter("src");
        String formURL = getParameter("formURL");
        String items = getParameter("items");
        return (new StringBuilder()).append("new sofa.Window(").append(getJSON((new StringBuilder()).append(items != null ? (new StringBuilder()).append("\"items\":").append(items).append(",").toString() : src != null ? "" : formURL != null ? "" : (new StringBuilder()).append("\"items\":{xtype:'fitpanel',contentEl:'ct_body_").append(id).append("'},").toString()).append("\"applyTo\":\"ct_").append(id).append("\",").toString())).append(");").append(id).append(" = Ext.getCmp(\"").append(id).append("\");").append(visible.booleanValue() ? (new StringBuilder()).append(id).append(".show();").toString() : "").toString();
    }

    public void addButtonGroup(String group)
    {
        List groups = (List)dynamicAttributes.get("_button_group_key");
        if(groups == null)
        {
            groups = new ArrayList();
            setParameter("_button_group_key", groups);
        }
        groups.add(group);
    }

    public void setFormId(String formId)
    {
        setParameter("formId", formId);
    }

    public String getButtonGroup()
    {
        List groups = (List)dynamicAttributes.get("_button_group_key");
        return groups != null ? groups.toString() : null;
    }

    public void doRelease()
    {
    }

    final String BUTTON_GROUP_KEY = "_button_group_key";
}
