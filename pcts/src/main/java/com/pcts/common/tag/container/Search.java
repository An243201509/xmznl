// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Search.java

package com.pcts.common.tag.container;

import com.pcts.common.tag.form.Form;
import com.pcts.common.tag.layout.BaseContainer;


public class Search extends Form
{

    public Search()
    {
    }

    public boolean doBeforeRender()
    {
        super.doBeforeRender();
        setParameter("border", "false");
        boolean enableLabel = getBoolParameter("enableLabel", false);
        String blankImage = (new StringBuilder()).append(context.getExtBasePath()).append("/resources/images/default/s.gif").toString();
        String label;
        if("zh_CN".equalsIgnoreCase(context.getLocale()))
            label = "\u5FEB\u901F\u67E5\u8BE2";
        else
        if("zh_TW".equalsIgnoreCase(context.getLocale()))
            label = "\u5FEB\u901F\u67E5\u8A62";
        else
            label = "Search";
        javax.servlet.jsp.tagext.Tag tag = getParent();
        if(tag instanceof BaseContainer)
        {
            outHTML((new StringBuilder()).append("<table id=\"ct_search_").append(id).append("\" class=\"sofa-search-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">").toString());
            outHTML("<tr>");
            outHTML((new StringBuilder()).append("<td width=\"").append(enableLabel ? 90 : 20).append("\">").append("<img title=\"").append(label).append("\" class=\"sofa-search-icon\" border=\"0\" src=\"").append(blankImage).append("\"/>").append(enableLabel ? (new StringBuilder()).append(label).append("\uFF1A").toString() : "").append("</td>").toString());
            outHTML("<td style=\"padding-top:1px;\">");
        } else
        {
            outHTML("<table class=\"sofa-search-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
            outHTML("<tr>");
            outHTML((new StringBuilder()).append("<td width=\"").append(enableLabel ? 90 : 20).append("\">").append("<img title=\"").append(label).append("\" class=\"sofa-search-icon\" border=\"0\" src=\"").append(blankImage).append("\"/>").append(enableLabel ? (new StringBuilder()).append(label).append("\uFF1A").toString() : "").append("</td>").toString());
            outHTML("<td style=\"padding-top:1px;\">");
        }
        return true;
    }

    public void doAfterRender()
    {
        javax.servlet.jsp.tagext.Tag tag = getParent();
        if(tag instanceof BaseContainer)
            outHTML("</td></tr></table>");
        else
            outHTML("</td></tr></table>");
        super.doAfterRender();
    }
}
