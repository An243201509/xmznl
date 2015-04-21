// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   DefaultConfig.java

package com.pcts.common.tag.layout;

import com.pcts.common.tag.widget.Widget;


// Referenced classes of package com.yss.sofa.tag.layout:
//            ExtContainer

public class DefaultConfig extends Widget
{

    public DefaultConfig()
    {
        objectRegex = "labelWidth|width";
    }

    public boolean doBeforeRender()
    {
        return false;
    }

    public void doRender()
    {
        if((parent instanceof Widget) && ((Widget)parent).stopPropagation())
            ((Widget)parent).setParameter("defaults", getJSON());
        else
        if(parent instanceof ExtContainer)
            ((ExtContainer)parent).setParameter("defaults", getJSON());
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
