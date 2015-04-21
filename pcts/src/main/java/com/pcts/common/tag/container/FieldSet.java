// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   FieldSet.java

package com.pcts.common.tag.container;


public class FieldSet extends Container
{

    public FieldSet()
    {
        objectRegex = "tools";
    }

    public boolean doBeforeRender()
    {
        outHTML((new StringBuilder()).append("<div id=\"ct_").append(id).append("\">").toString());
        return true;
    }

    public void doRender()
    {
        outScript();
    }

    public void doAfterRender()
    {
        outHTML("</div>");
    }

    public String getHTML()
    {
        return null;
    }

    public String getScript()
    {
        boolean checkboxToggle = getBoolParameter("checkboxToggle", false);
        if(checkboxToggle)
            return (new StringBuilder()).append("new sofa.FieldSet(").append(getJSON((new StringBuilder()).append("\"applyTo\":\"ct_").append(id).append("\",").toString())).append(");").toString();
        else
            return (new StringBuilder()).append("new sofa.FieldSet(").append(getJSON((new StringBuilder()).append("\"collapsible\":true,\"applyTo\":\"ct_").append(id).append("\",").toString())).append(");").toString();
    }

    public void doRelease()
    {
    }
}
