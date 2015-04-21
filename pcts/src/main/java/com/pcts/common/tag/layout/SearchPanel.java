// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   SearchPanel.java

package com.pcts.common.tag.layout;

// Referenced classes of package com.yss.sofa.tag.layout:
//            FormPanel

public class SearchPanel extends FormPanel
{

    public SearchPanel()
    {
    }

    public boolean doBeforeRender()
    {
        String title = "\u5FEB\u901F\u67E5\u8BE2";
        if("en".equalsIgnoreCase(context.getLocale()))
            title = "Search";
        else
        if("zh_TW".equalsIgnoreCase(context.getLocale()))
            title = "\u5FEB\u901F\u67E5\u8BE2";
        initParameter("title", title);
        initParameter("collapsed", "true");
        initParameter("collapsible", "true");
        initParameter("iconCls", "sofa-searchpanel-icon");
        return super.doBeforeRender();
    }
}
