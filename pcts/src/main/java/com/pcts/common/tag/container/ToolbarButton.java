// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   ToolbarButton.java

package com.pcts.common.tag.container;

import com.pcts.common.tag.jsp.Param;


public class ToolbarButton extends Param
{

    public ToolbarButton()
    {
        eventRegex = "";
        objectRegex = "^on\\p{Upper}\\w*";
    }
}
