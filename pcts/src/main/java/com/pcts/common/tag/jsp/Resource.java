package com.pcts.common.tag.jsp;

import java.util.UUID;

import com.pcts.common.tag.widget.Plugin;
import com.pcts.common.tag.widget.PluginMgr;
import com.pcts.common.tag.widget.Widget;

public class Resource extends Widget
  implements Plugin
{
  private String symbol;

  public boolean doBeforeRender()
  {
    return false;
  }

  public void doRender()
  {
    JSP jsp = null;
    if ((jsp = (JSP)getAncestorPresent(JSP.class)) != null) {
      if (jsp.getBoolParameter("include", false)) {
        return;
      }
      String symbol = getResourceSymbol();
      jsp.setResourceSymbol(symbol);
      outHTML(symbol);
    } else {
      throw new RuntimeException("Current Page must be contains :jsp tag");
    }
  }

  public void doAfterRender()
  {
  }

  public void doRelease()
  {
    this.symbol = null;
  }

  public String getHTML()
  {
    return null;
  }

  public String getScript()
  {
    return null;
  }

  public String getResourceSymbol()
  {
    if (this.symbol == null) {
      String uuid = UUID.randomUUID().toString();
      this.symbol = ("{_jsp_resource_" + uuid + "}");
    }
    return this.symbol;
  }

  public void doPlugin(PluginMgr mgr)
  {
    String imports;
    if ((imports = getParameter("import")) != null) {
      String[] imps = imports.split(",");
      for (String imp : imps)
        mgr.injectPlugin(imp.trim());
    }
  }
}