// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   SearchBox.java

package com.pcts.common.tag.form;


// Referenced classes of package com.yss.sofa.tag.form:
//            FormField

public class SearchBox extends FormField
{

    public SearchBox()
    {
        propagation = true;
    }

    public boolean doBeforeRender()
    {
        super.doBeforeRender();
        return true;
    }

    public String getItemScript()
    {
        return (new StringBuilder()).append("new sofa.form.SearchBox(").append(getJSON()).append(")").toString();
    }
}
