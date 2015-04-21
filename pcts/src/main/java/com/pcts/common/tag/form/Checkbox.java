// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Checkbox.java

package com.pcts.common.tag.form;



public class Checkbox extends Radio
{

    public Checkbox()
    {
    }

    public String getItemScript()
    {
        return (new StringBuilder()).append("new Ext.form.Checkbox(").append(getJSON()).append(")").toString();
    }
}
