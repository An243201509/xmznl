// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   PluginElement.java

package com.pcts.common.tag.widget;


public class PluginElement
{

    public PluginElement()
    {
    }

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getScriptPath()
    {
        return scriptPath;
    }

    public void setScriptPath(String scriptPath)
    {
        this.scriptPath = scriptPath;
    }

    public String getCssPath()
    {
        return cssPath;
    }

    public void setCssPath(String cssPath)
    {
        this.cssPath = cssPath;
    }

    public String getLocalePath()
    {
        return localePath;
    }

    public void setLocalePath(String localePath)
    {
        this.localePath = localePath;
    }

    public String id;
    public String scriptPath;
    public String cssPath;
    public String localePath;
}
