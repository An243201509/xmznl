// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   PluginMgr.java

package com.pcts.common.tag.widget;

import java.util.*;


public class PluginMgr
{

    public PluginMgr(String extBasePath, String sofaBasePath, String otherPath, String locale)
    {
        this.extBasePath = extBasePath;
        this.sofaBasePath = sofaBasePath;
        this.otherPath = otherPath;
        this.locale = locale;
        scriptPaths = new LinkedHashSet();
        localePaths = new LinkedHashSet();
        cssPaths = new LinkedHashSet();
    }

    public void register(String id, String scriptPath, String cssPath, String localePath)
    {
        if(!regs.containsKey(id))
        {
            PluginElement elem = new PluginElement();
            elem.setId(id);
            elem.setScriptPath(scriptPath);
            elem.setCssPath(cssPath);
            elem.setLocalePath(localePath);
            regs.put(id, elem);
        }
    }

    public void injectPlugin(String s)
    {
    }

    public void injectScript(String scriptPath)
    {
        scriptPaths.add(scriptPath);
    }

    public void injectLocale(String localePath)
    {
        localePaths.add(localePath);
    }

    public void injectCSS(String cssPath)
    {
        cssPaths.add(cssPath);
    }

    public String outScript()
    {
        StringBuilder buff = new StringBuilder();
        if(scriptPaths != null)
        {
            String paths[] = new String[scriptPaths.size()];
            scriptPaths.toArray(paths);
            for(int i = 0; i < paths.length; i++)
            {
                String path = paths[i];
                buff.append(path).append("\n");
            }

        }
        if(localePaths != null)
        {
            String paths[] = new String[localePaths.size()];
            localePaths.toArray(paths);
            for(int i = 0; i < paths.length; i++)
            {
                String path = paths[i];
                buff.append(path).append("\n");
            }

        }
        return buff.toString();
    }

    public String outCSS()
    {
        StringBuilder buff = new StringBuilder();
        if(cssPaths != null)
        {
            String path;
            for(Iterator i$ = cssPaths.iterator(); i$.hasNext(); buff.append(path).append("\n"))
                path = (String)i$.next();

        }
        return buff.toString();
    }

    private String getJavaScript(String id, String path)
    {
        return (new StringBuilder()).append("<script type=\"text/javascript\" ").append(id != null ? (new StringBuilder()).append("id=\"").append(id).append("\"").toString() : "").append(" src=\"").append(path).append("\"></script>").toString();
    }

    private String getStyleSheet(String id, String path)
    {
        return (new StringBuilder()).append("<link rel=\"stylesheet\" type=\"text/css\" ").append(id != null ? (new StringBuilder()).append("id=\"").append(id).append("\"").toString() : "").append(" href=\"").append(path).append("\"/>").toString();
    }

    private LinkedHashSet scriptPaths;
    private LinkedHashSet localePaths;
    private LinkedHashSet cssPaths;
    private String sofaBasePath;
    private String extBasePath;
    private String otherPath;
    private String locale;
    private static Map regs = new HashMap();

}
