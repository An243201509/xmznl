// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Param.java

package com.pcts.common.tag.jsp;

import com.pcts.common.tag.widget.Widget;


public class Param extends Widget
{

    public Param()
    {
    }

    public boolean doBeforeRender()
    {
        return false;
    }

    public void doRender()
    {
        javax.servlet.jsp.tagext.Tag parent = null;
        if((parent = getParent()) instanceof Widget)
            ((Widget)parent).addParam(getScript());
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
