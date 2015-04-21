// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Radio.java

package com.pcts.common.tag.form;

import java.util.Map;

// Referenced classes of package com.yss.sofa.tag.form:
//            FormField

public class Radio extends FormField
{

    public Radio()
    {
        transfers.put("text", "boxLabel");
    }

    public String getHTML()
    {
        return (new StringBuilder()).append("<div id=\"ct_form_field_").append(id).append("\" class=\"sofa-form-element\"></div>").toString();
    }

    public boolean doBeforeRender()
    {
        return false;
    }

    public String getItemScript()
    {
        return (new StringBuilder()).append("new Ext.form.Radio(").append(getJSON()).append(")").toString();
    }
}
