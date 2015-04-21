// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Form.java

package com.pcts.common.tag.form;

import com.pcts.common.tag.container.Container;
import com.pcts.common.tag.layout.ExtContainer;

import java.util.*;

public class Form extends Container
{

    public Form()
    {
        transfers = new HashMap();
        transfers.put("success", "onSuccess");
        transfers.put("error", "onError");
        transfers.put("action", "url");
        filters = new ArrayList();
        filters.add("items");
        filters.add("_items_key");
        filters.add("id");
        excludes = new ArrayList();
        excludes.add("validation");
        excludes.add("_button_key");
        excludes.add("_button_group_key");
    }

    public boolean doBeforeRender()
    {
        javax.servlet.jsp.tagext.Tag tag = getParent();
        if(tag instanceof ExtContainer)
            ((ExtContainer)tag).addItem((new StringBuilder()).append("ct_").append(id).toString());
        String cls = getParameter("cssClass", "");
        String method = getParameter("method", "post");
        outHTML((new StringBuilder()).append("<form id=\"form_").append(id).append("\" ").append("class=\"").append(cls).append("\" ").append("method=\"").append(method).append("\">").toString());
        return true;
    }

    public void doRender()
    {
        outScript();
    }

    public void doAfterRender()
    {
        outHTML("</form>");
    }

    public String getHTML()
    {
        return null;
    }

    public String getScript()
    {
        StringBuilder formStr = new StringBuilder();
        String url = getParameter("url");
        if(url == null)
            url = getParameter("action", "");
        String method = getParameter("method", "post");
        javax.servlet.jsp.tagext.Tag tag = getParent();
        if(tag instanceof ExtContainer)
            formStr.append((new StringBuilder()).append("ct_").append(id).append(" = new Ext.Panel(").append(getJSON((new StringBuilder()).append("\"url\":\"").append(url).append("\",").append("\"method\":\"").append(method).append("\",").append("\"contentEl\":\"form_").append(id).append("\",").toString())).append(");").toString());
        String submitType = getParameter("submitType", "ajax").toLowerCase();
        String dataType = getParameter("dataType", "html/text");
        String dataFormat = getParameter("dataFormat", "json");
        String successMsg = getParameter("successMsg");
        formStr.append((new StringBuilder()).append(id).append(" = new Ext.form.BasicForm(\"form_").append(id).append("\",").append(getJSON((new StringBuilder()).append("\"url\":\"").append(url).append("\",").append("\"method\":\"").append(method).append("\",").append("\"standardSubmit\": ").append(!"ajax".equals(submitType)).append(",").append("\"dataType\":\"").append(dataType).append("\",").append("\"dataFormat\":\"").append(dataFormat).append("\",").append(successMsg == null ? "" : (new StringBuilder()).append("\"Msg\":{\"success\":\"").append(successMsg).append("\"},").toString()).toString())).append(");").toString());
        String fields = getParameter("_items_key");
        if(fields != null)
            formStr.append((new StringBuilder()).append(id).append(".add(").append(fields).append(");").toString());
        String buttons = getButton();
        if(buttons != null)
            formStr.append((new StringBuilder()).append(id).append(".addButton(").append(buttons).append(");").toString());
        String groups = getButtonGroup();
        if(groups != null)
            formStr.append((new StringBuilder()).append(id).append(".addButtonGroup(").append(groups).append(");").toString());
        if(context.getWorkFlow().isUseFlow())
        {
            formStr.append("if (Workflow && Workflow.init) {").append("\n");
            formStr.append("}").append("\n");
        }
        return formStr.toString();
    }

    public void addButtonGroup(String groupId)
    {
        getDynamicAttributes();
        List groups = (List)dynamicAttributes.get("_button_group_key");
        if(groups == null)
        {
            groups = new ArrayList();
            setParameter("_button_group_key", groups);
        }
        groups.add(groupId);
    }

    public String getButtonGroup()
    {
        getDynamicAttributes();
        List groups = (List)dynamicAttributes.get("_button_group_key");
        return groups != null ? groups.toString() : null;
    }

    public String getButton()
    {
        getDynamicAttributes();
        List buttons = (List)dynamicAttributes.get("_button_key");
        return buttons != null ? buttons.toString() : null;
    }

    public void addButton(String buttonId)
    {
        getDynamicAttributes();
        List buttons = (List)dynamicAttributes.get("_button_key");
        if(buttons == null)
        {
            buttons = new ArrayList();
            setParameter("_button_key", buttons);
        }
        buttons.add(buttonId);
    }

    public void doRelease()
    {
    }

    public void addParam(String param)
    {
        getDynamicAttributes();
        String items = (String)dynamicAttributes.get("_items_key");
        if(items == null)
            items = (new StringBuilder()).append("Ext.getCmp(\"").append(param).append("\")").toString();
        else
            items = (new StringBuilder()).append(items).append(",Ext.getCmp(\"").append(param).append("\")").toString();
        dynamicAttributes.put("_items_key", items);
    }

    final String BUTTON_GROUP_KEY = "_button_group_key";
    final String BUTTON_KEY = "_button_key";
    final String FIELD_KEY = "_items_key";
}
