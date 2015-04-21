package com.pcts.common.tag.jsp;

import java.io.IOException;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.BodyTagSupport;

public class Script extends BodyTagSupport
{
  private static final long serialVersionUID = 1L;
  private String src;
  private String type;
  private String charset;

  public Script()
  {
    this.type = "text/javascript";
  }

  public int doStartTag() throws JspException
  {
    this.charset = (this.charset != null ? "charset=\"" + this.charset + "\"" : "");
    try {
      if (this.src != null) {
        this.pageContext.getOut().write("<script type=\"" + this.type + "\" " + this.charset + " src=\"" + this.src + "\"></script>");
        return 0;
      }
      this.pageContext.getOut().write("<script type=\"" + this.type + "\">");
      return 1;
    } catch (IOException e) {
    	throw new JspException(e);
    }
    
  }

  public int doEndTag()
    throws JspException
  {
    if (this.src == null) {
      try {
        this.pageContext.getOut().write("</script>");
      } catch (IOException e) {
        throw new JspException(e);
      }
    }
    return 6;
  }

  public void setSrc(String src) {
    this.src = src;
  }

  public void setType(String type) {
    this.type = type;
  }

  public void setCharset(String charset) {
    this.charset = charset;
  }
}