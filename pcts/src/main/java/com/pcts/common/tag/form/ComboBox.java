// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   ComboBox.java

package com.pcts.common.tag.form;



public class ComboBox extends ListView
{

    public ComboBox()
    {
    }

    public String getItemScript()
    {
        return (new StringBuilder()).append("new Ext.form.ComboBox(").append(getJSON()).append(")").toString();
    }
}
