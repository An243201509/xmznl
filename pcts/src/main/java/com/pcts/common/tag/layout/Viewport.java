// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Viewport.java

package com.pcts.common.tag.layout;

import java.util.List;


public class Viewport extends ExtContainer
{

    public Viewport()
    {
        filters.add("renderTo");
        filters.add("applyTo");
    }

    public boolean doBeforeRender()
    {
        getDynamicAttributes();
        initParameter("border", "false");
        return true;
    }

    public String getHTML()
    {
        return null;
    }

    public String getScript()
    {
        return (new StringBuilder()).append("window.viewport = new Ext.Viewport(").append(getJSON()).append(");window.viewport.doLayout();").toString();
    }
}
