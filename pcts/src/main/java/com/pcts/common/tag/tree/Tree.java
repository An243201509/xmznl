// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Tree.java

package com.pcts.common.tag.tree;

import com.pcts.common.tag.container.Container;
import com.pcts.common.tag.layout.ExtContainer;

import java.util.*;

public class Tree extends Container
{

    public Tree()
    {
        filters = new ArrayList();
        filters.add("template");
        filters.add("baseAttrs");
        filters.add("params");
        filters.add("idBind");
        filters.add("requestMethod");
        filters.add("expandedAll");
        filters.add("dataSource");
        transfers = new HashMap();
        transfers.put("onBeforeItemAppend", "onBeforeAppend");
        transfers.put("onBeforeItemMove", "onBeforeMoveNode");
        transfers.put("onItemExpand", "onExpandNode");
        transfers.put("onItemCollapse", "onCollapseNode");
        transfers.put("onItemClick", "onClick");
        transfers.put("onItemDblClick", "onDblClick");
    }

    public boolean doBeforeRender()
    {
        initParameter("border", "false");
        initParameter("monitorResize", "true");
        initParameter("rootVisible", "false");
        javax.servlet.jsp.tagext.Tag tag = getParent();
        if(tag instanceof ExtContainer)
            ((ExtContainer)tag).addItem(id);
        else
            setParameter("renderTo", (new StringBuilder()).append("ct_").append(id).toString());
        return false;
    }

    public void doRender()
    {
    }

    public void doAfterRender()
    {
        javax.servlet.jsp.tagext.Tag parent = getParent();
        if(!(parent instanceof ExtContainer))
            outHTML();
        outScript();
    }

    public void doRelease()
    {
    }

    public String getHTML()
    {
        return (new StringBuilder()).append("<div id=\"ct_").append(id).append("\"></div>").toString();
    }

    public String getScript()
    {
        return (new StringBuilder()).append(id).append(" = new Ext.tree.TreePanel(").append(getJSON()).append(");").toString();
    }
}
