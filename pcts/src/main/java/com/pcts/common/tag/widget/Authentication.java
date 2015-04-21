// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Authentication.java

package com.pcts.common.tag.widget;


// Referenced classes of package com.yss.sofa.tag.widget:
//            Widget

public class Authentication extends Widget
{

    public Authentication()
    {
    }

    public void doRender()
    {
        id = getParameter("id");
        if(id != null)
        {
            outDefined(new String[] {
                id
            });
            outScript((new StringBuilder()).append(id).append(" = new sofa.ACL(").append(getJSON()).append(");").toString(), true);
        } else
        {
            removeParameter("id");
            outScript((new StringBuilder()).append("new sofa.ACL(").append(getJSON()).append(");").toString(), true);
        }
    }

    public boolean doBeforeRender()
    {
        return true;
    }

    public void doAfterRender()
    {
    }

    public String getHTML()
    {
        return null;
    }

    public String getScript()
    {
        return null;
    }

    public void doRelease()
    {
    }
}
