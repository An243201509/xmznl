// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Grid.java

package com.pcts.common.tag.grid;

import java.util.*;

import com.pcts.common.tag.container.Container;
import com.pcts.common.tag.layout.ExtContainer;
import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;
import com.pcts.common.tag.widget.Widget;


public class Grid extends Container
    implements Plugin
{

    public Grid()
    {
        filters = new ArrayList();
        filters.add("_grid_column_group");
        filters.add("rownumberer");
        filters.add("_grid_rownumber");
        filters.add("_grid_operation");
    }

    public void doPlugin(PluginMgr mgr)
    {
        if(grid != null)
            grid.doPlugin(mgr);
    }

    public boolean doBeforeRender()
    {
        if((parent instanceof Widget) && ((Widget)parent).stopPropagation())
            ((Widget)parent).addItem(id);
        else
        if(parent instanceof ExtContainer)
            ((ExtContainer)parent).addItem(id);
        else
            setParameter("renderTo", (new StringBuilder()).append("ct_grid_").append(id).toString());
        initParameter("border", "false");
        initParameter("monitorResize", "true");
        initParameter("autoQuery", "true");
        String viewMode = getParameter("viewMode");
        if("treegrid".equalsIgnoreCase(viewMode))
            grid = new TreeGrid(id);
        else
            grid = new GenericGrid(id);
        grid.context = context;
        return true;
    }

    public void doRender()
    {
        grid.setDynamicAttributes(dynamicAttributes);
    }

    public void outColumnHeaderGroup()
    {
        if(dynamicAttributes != null)
        {
            List groups = (List)dynamicAttributes.get("_grid_column_group");
            if(groups != null)
            {
                List array = new ArrayList();
                doColumnGroupHeader(array, groups);
                outScript(new String[] {
                    (new StringBuilder()).append("var _grid_columnheadergroup_").append(id).append(" = ").append("new Ext.grid.LockingColumnHeaderGroup({\"rows\":").append(array.toString()).append("});").toString()
                });
                addPlugin((new StringBuilder()).append("_grid_columnheadergroup_").append(id).toString());
            }
        }
    }

    private void doColumnGroupHeader(List array, List groups)
    {
        Iterator i$ = groups.iterator();
        do
        {
            if(!i$.hasNext())
                break;
            Map group = (Map)i$.next();
            List arr = new ArrayList();
            List children = (List)group.get("children");
            if(children != null)
            {
                Map child;
                for(Iterator it = children.iterator(); it.hasNext(); arr.add((new StringBuilder()).append("{\"header\":\"").append(get(child, "header", "")).append("\",").append("\"colspan\":").append(get(child, "colspan", "1")).append(",").append("\"rowspan\":").append(get(child, "rowspan", "1")).append(",").append("\"align\":\"").append(get(child, "align", "center")).append("\"").append("}").toString()))
                    child = (Map)it.next();

                array.add(arr);
            }
        } while(true);
    }

    private void doColumnGroup(List array, List groups)
    {
        List collection = new ArrayList();
        List arr = new ArrayList();
        boolean multiSelect = getBoolParameter("multiSelect", false);
        if(multiSelect)
            arr.add("{\"empty\":true}");
        Iterator it = groups.iterator();
        do
        {
            if(!it.hasNext())
                break;
            Map group = (Map)it.next();
            arr.add((new StringBuilder()).append("{\"header\":\"").append(get(group, "header", "")).append("\",").append("\"colspan\":").append(get(group, "colspan", "0")).append(",").append("\"align\":\"").append(get(group, "align", "center")).append("\"").append("}").toString());
            List children = (List)group.get("children");
            if(children != null)
                collection.addAll(children);
        } while(true);
        array.add(arr);
        if(collection.size() > 0)
            doColumnGroup(array, collection);
    }

    private String get(Map group, String param, String defaultValue)
    {
        String value = (String)group.get(param);
        return value != null ? value : defaultValue;
    }

    public String getRowNumberer()
    {
        boolean rowNumberer = getBoolParameter("rownumberer", false);
        if(rowNumberer)
            return "new Ext.grid.RowNumberer()";
        else
            return null;
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
        grid = null;
    }

    public String getHTML()
    {
        return (new StringBuilder()).append("<div id=\"ct_grid_").append(id).append("\"></div>").toString();
    }

    public String getScript()
    {
        return grid.getScript();
    }

    public void addField(String field)
    {
        getDynamicAttributes();
        String _fields = (String)dynamicAttributes.get("fields");
        if(field.indexOf("{") == -1)
            field = (new StringBuilder()).append("{\"name\":\"").append(field).append("\",\"mapping\":\"").append(field).append("\"}").toString();
        if(_fields == null)
            _fields = field;
        else
            _fields = (new StringBuilder()).append(_fields).append(",").append(field).toString();
        dynamicAttributes.put("fields", _fields);
    }

    public void addColumGroup(Map group)
    {
        getDynamicAttributes();
        List groups = (List)dynamicAttributes.get("_grid_column_group");
        if(groups == null)
        {
            groups = new ArrayList();
            dynamicAttributes.put("_grid_column_group", groups);
        }
        groups.add(group);
    }

    public void addColumn(String column)
    {
        getDynamicAttributes();
        String _columns = (String)dynamicAttributes.get("columns");
        if(_columns == null)
            _columns = column;
        else
            _columns = (new StringBuilder()).append(_columns).append(",").append(column).toString();
        dynamicAttributes.put("columns", _columns);
    }

    public void addPlugin(String plugin)
    {
        getDynamicAttributes();
        String _plugins = (String)dynamicAttributes.get("plugins");
        if(_plugins == null)
            _plugins = plugin;
        else
            _plugins = (new StringBuilder()).append(_plugins).append(",").append(plugin).toString();
        dynamicAttributes.put("plugins", _plugins);
    }

    static final String COLUMN_GROUP = "_grid_column_group";
    private Grid grid;
}
