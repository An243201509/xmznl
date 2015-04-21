// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   CheckboxGroup.java

package com.pcts.common.tag.form;


// Referenced classes of package com.yss.sofa.tag.form:
//            RadioGroup

public class CheckboxGroup extends RadioGroup
{

    public CheckboxGroup()
    {
    }

    public String getItemScript()
    {
        return (new StringBuilder()).append("new Ext.form.CheckboxGroup(").append(getJSON()).append(")").toString();
    }
}
