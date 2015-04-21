// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   Css.java

package com.pcts.common.tag.jsp;

import java.io.IOException;
import javax.servlet.jsp.*;
import javax.servlet.jsp.tagext.BodyTagSupport;

public class Css extends BodyTagSupport
{

    public Css()
    {
    }

    public int doStartTag()
        throws JspException
    {
        try
        {
            if(src != null)
            {
                pageContext.getOut().write((new StringBuilder()).append("<link rel=\"stylesheet\" type=\"text/css\" href=\"").append(src).append("\">").toString());
                return 0;
            }
        }
        catch(IOException e)
        {
            throw new JspException(e);
        }
        try {
			pageContext.getOut().write("<style type=\"text/css\">");
		} catch (IOException e) {
			e.printStackTrace();
		}
        return 1;
    }

    public int doEndTag()
        throws JspException
    {
        if(src == null)
            try
            {
                pageContext.getOut().write("</style>");
            }
            catch(IOException e)
            {
                throw new JspException(e);
            }
        return 6;
    }

    public void setSrc(String src)
    {
        this.src = src;
    }

    private static final long serialVersionUID = 1L;
    private String src;
}
