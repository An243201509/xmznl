// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   GenericGrid.java

package com.pcts.common.tag.grid;

import com.pcts.common.tag.widget.PluginMgr;


public class GenericGrid extends Directory
{

    public GenericGrid(String id)
    {
        this.id = id;
    }

    public String getScript()
    {
        StringBuilder grid = new StringBuilder();
        boolean rowNumberer = getBoolParameter("rownumberer", false);
        if(rowNumberer)
            setParameter("useRowNumberColumn", "true");
        initView();
        outColumnHeaderGroup();
        grid.append((new StringBuilder()).append(id).append(" = new sofa.grid.GridPanel(").append(getJSON()).append(");").toString()).append("\n");
        if(context.getWorkFlow().isUseFlow())
        {
            grid.append("if (Workflow) {").append("\n");
            grid.append((new StringBuilder()).append("Workflow.addGridEvent(").append(id).append(");").toString()).append("\n");
            grid.append("}").append("\n");
        }
        return grid.toString();
    }

    public void initView()
    {
        StringBuilder viewConfig = new StringBuilder();
        String groupField = getParameter("groupField");
        if(groupField != null)
        {
            setParameter("useView", "group");
            String groupTextTpl = getParameter("groupTextTpl", "{text}");
            viewConfig.append("\"showGroupName\":false,");
            viewConfig.append((new StringBuilder()).append("\"groupTextTpl\":\"").append(groupTextTpl).append("\",").toString());
        }
        boolean forceFit = Boolean.parseBoolean(getParameter("forceFit", "false"));
        if(forceFit)
            viewConfig.append("\"forceFit\":true,");
        if(viewConfig.length() > 0)
            viewConfig.setLength(viewConfig.length() - 1);
        String config = getParameter("viewConfig");
        if(config != null && config.length() > 0)
        {
            if(config.startsWith("{") && config.endsWith("}"))
                config = config.substring(1, config.length() - 1);
            if(viewConfig.length() > 0)
                viewConfig.append(",");
            viewConfig.append(config);
        }
        setParameter("viewConfig", (new StringBuilder()).append("{").append(viewConfig).append("}").toString());
    }

    public void doPlugin(PluginMgr mgr)
    {
        boolean buffered = Boolean.parseBoolean(getParameter("buffered", "false"));
        if(buffered)
            mgr.injectPlugin("Ext.grid.BufferView");
    }
}
