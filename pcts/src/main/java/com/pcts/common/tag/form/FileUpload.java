// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   FileUpload.java

package com.pcts.common.tag.form;

import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;


public class FileUpload extends FormField
    implements Plugin
{

    public FileUpload()
    {
    }

    public void doPlugin(PluginMgr mgr)
    {
        mgr.injectPlugin("Ext.form.FileUploadField");
    }

    public String getItemScript()
    {
        return (new StringBuilder()).append("new Ext.form.FileUploadField(").append(getJSON()).append(")").toString();
    }
}
