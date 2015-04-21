// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   LayoutConfig.java

package com.pcts.common.tag.layout;

import com.pcts.common.tag.widget.Widget;


public class LayoutConfig extends Widget
{

    public LayoutConfig()
    {
        objectRegex = "labelWidth|width|columnWidth";
    }

    public boolean doBeforeRender()
    {
        return false;
    }

    public void doRender()
    {
        if((parent instanceof Widget) && ((Widget)parent).stopPropagation())
            ((Widget)parent).setParameter("layoutConfig", getJSON());
        else
        if(parent instanceof ExtContainer)
            ((ExtContainer)parent).setParameter("layoutConfig", getJSON());
    }

    public void doAfterRender()
    {
    }

    public void doRelease()
    {
    }

    public String getHTML()
    {
        return null;
    }

    public String getScript()
    {
        return getJSON();
    }
}
