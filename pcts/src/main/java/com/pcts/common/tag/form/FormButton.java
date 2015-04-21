// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   FormButton.java

package com.pcts.common.tag.form;

import com.pcts.common.tag.layout.FormPanel;


public class FormButton extends Button
{

    public FormButton()
    {
    }

    public void doRender()
    {
        javax.servlet.jsp.tagext.Tag tag = getParent();
        if(tag instanceof FormPanel)
        {
            ((FormPanel)tag).addButton(id);
            outScript();
            return;
        } else
        {
            super.doRender();
            return;
        }
    }
}
