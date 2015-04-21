// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   ExtReady.java

package com.pcts.common.tag.jsp;

import javax.servlet.jsp.tagext.BodyContent;

import com.pcts.common.tag.container.Container;


public class ExtReady extends Container
{

    public ExtReady()
    {
    }

    public boolean doBeforeRender()
    {
        return true;
    }

    public void doRender()
    {
        boolean insertFirst = getBoolParameter("insertBefore", false);
        if(insertFirst)
            context.addScriptContent(getHTML(), true);
        else
            context.addExtReady(getHTML());
    }

    public void doAfterRender()
    {
    }

    public void doRelease()
    {
    }

    public String getHTML()
    {
        return bodyContent.getString();
    }

    public String getScript()
    {
        return null;
    }

    public int doAfterBody()
    {
        return 6;
    }
}
