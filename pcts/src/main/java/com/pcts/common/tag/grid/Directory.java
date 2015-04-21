// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Directory.java

package com.pcts.common.tag.grid;

import java.util.*;


public class Directory extends Grid
{

    public Directory()
    {
        arrayRegex = "plugins|columns";
        objectRegex = "store|storeConfig|viewConfig|view|cm|bbar|pagingbar|selModel|pageSize|dataSource|useRowNumberColumn|useOperationColumn|useCRUDColumn|useCheckColumn|useExpireColumn|useOtherCheckColumn";
        filters.add("proxyType");
        filters.add("buffered");
        filters.add("bufferSize");
        filters.add("autoLoad");
        filters.add("forceFit");
        transfers = new HashMap();
        transfers.put("autoLoad", "autoQuery");
        transfers.put("onitemclick", "onRowClick");
        transfers.put("onitemdblclick", "onRowDblClick");
        transfers.put("idBind", "idProperty");
    }

    public String getScript()
    {
        StringBuilder dir = new StringBuilder();
        initView();
        outColumnHeaderGroup();
        dir.append((new StringBuilder()).append(id).append(" = new sofa.dir.Directory(").append(getJSON()).append(");").toString()).append("\n");
        if(context.getWorkFlow().isUseFlow())
        {
            dir.append("if (Workflow) {").append("\n");
            dir.append((new StringBuilder()).append("Workflow.addGridEvent(").append(id).append(");").toString()).append("\n");
            dir.append("}").append("\n");
        }
        return dir.toString();
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
}
