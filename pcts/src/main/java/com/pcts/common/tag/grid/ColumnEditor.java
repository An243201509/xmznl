// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   ColumnEditor.java

package com.pcts.common.tag.grid;

import java.util.ArrayList;

import com.pcts.common.tag.container.Container;

public class ColumnEditor extends Container
{

    public ColumnEditor()
    {
        filters = new ArrayList();
        filters.add("type");
    }

    public boolean doBeforeRender()
    {
        return true;
    }

    public void doRender()
    {
        ((Column)getParent()).setParameter("editorType", getParameter("type", "textfield"));
        ((Column)getParent()).setEditor(getScript());
        ((Column)getParent()).setEditorEvents(getEvents());
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
