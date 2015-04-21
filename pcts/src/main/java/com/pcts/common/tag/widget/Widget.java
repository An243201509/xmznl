package com.pcts.common.tag.widget;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.DynamicAttributes;
import javax.servlet.jsp.tagext.Tag;

import com.pcts.common.tag.jsp.Context;

public abstract class Widget
  implements Tag, DynamicAttributes
{
  private static Map<String, Method> plugin_method_caches = new HashMap();
  protected String id;
  protected PageContext pageContext;
  protected Tag parent;
  protected Context context;
  protected boolean propagation;
  protected HashMap<String, Object> dynamicAttributes;
  protected String eventRegex = "^on\\p{Upper}\\w*|_on|^handler$";

  protected String objectRegex = null;

  protected String arrayRegex = null;

  protected Map<String, String> transfers = null;

  protected Map<String, String> configs = null;

  protected List<String> excludes = null;

  protected List<String> filters = null;

  public abstract boolean doBeforeRender();

  public abstract void doRender();

  public abstract void doAfterRender();

  public abstract void doRelease();

  public abstract String getHTML();

  public abstract String getScript();

  public void addPlugin(String plugin)
  {
  }

  public void addParam(String param)
  {
  }

  public void addItem(String item)
  {
    getDynamicAttributes();
    String items = (String)this.dynamicAttributes.get("items");

    if (items == null)
      items = item;
    else {
      items = items + "," + item;
    }
    this.dynamicAttributes.put("items", items);
  }

  public boolean stopPropagation()
  {
    return this.propagation;
  }

  public void setPageContext(PageContext paramPageContext) {
    this.pageContext = paramPageContext;
  }

  public void setParent(Tag paramTag) {
    this.parent = paramTag;
  }

  public Tag getParent() {
    return this.parent;
  }

  public int doStartTag() {
    this.context = ((Context)this.pageContext.getAttribute("jsp_tag_context", 2));

    this.id = getParameter("id");
    if (this.id == null) {
      this.id = genericId();
    }
    outDefined(new String[] { this.id });

    if (doBeforeRender()) {
      return 1;
    }
    return 0;
  }

  public int doEndTag() {
    doRender();
    initPluginMgr();
    doAfterRender();
    release();
    return 6;
  }

  public void release() {
    doRelease();
    this.context = null;
    this.dynamicAttributes = null;
  }

  private PluginMgr getPluginMgr()
  {
    PluginMgr pmgr = (PluginMgr)this.pageContext.getAttribute("Plugin_Mgr", 2);

    if (pmgr == null) {
      pmgr = new PluginMgr(this.context.getExtBasePath(), this.context.getSofaBasePath(), this.context.getOtherPath(), this.context.getLocale());

      this.pageContext.setAttribute("Plugin_Mgr", pmgr, 2);
    }
    return pmgr;
  }

  public void initPlugin()
  {
    try
    {
      Method method = getClass().getMethod("initPlugin", new Class[] { PluginMgr.class });
      try
      {
        method.invoke(this, new Object[] { getPluginMgr() });
      } catch (IllegalArgumentException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
    catch (SecurityException e)
    {
    }
    catch (NoSuchMethodException e)
    {
    }
  }

  protected void initPluginMgr() {
    String clz = getClass().getName();
    Method method = null;
    if (plugin_method_caches.containsKey(clz)) {
      method = (Method)plugin_method_caches.get(clz);
      if (method == null)
        return;
    }
    else {
      try {
        method = getClass().getDeclaredMethod("doPlugin", new Class[] { PluginMgr.class });
      } catch (SecurityException e) {
      } catch (NoSuchMethodException e) {
      }
      finally {
        plugin_method_caches.put(clz, method);
      }
    }
    if (method != null)
      try {
        method.invoke(this, new Object[] { getPluginMgr() });
      } catch (IllegalArgumentException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
  }

  public String getId()
  {
    return this.id;
  }

  public String genericId() {
    Long idSeed = (Long)this.pageContext.getAttribute("id_seed", 2);
    Long localLong1;
    if (idSeed == null) {
      idSeed = new Long(1L);
    } else {
      localLong1 = idSeed; Long localLong2 = idSeed = Long.valueOf(idSeed.longValue() + 1L);
    }
    this.pageContext.setAttribute("id_seed", idSeed, 2);
    return "sf_" + idSeed;
  }

  public String getParameter(String key, String defaultValue)
  {
    String value = getParameter(key);
    return isEmpty(value) ? defaultValue : value;
  }

  public String getParameter(String key)
  {
    if (this.dynamicAttributes != null)
      return (String)this.dynamicAttributes.get(key);
    return null;
  }

  public Object getObjectParameter(String key)
  {
    if (this.dynamicAttributes != null)
      return this.dynamicAttributes.get(key);
    return null;
  }

  public boolean getBoolParameter(String key, boolean defaultBool)
  {
    if (isEmptyParameter(key)) {
      return defaultBool;
    }
    return Boolean.parseBoolean(getParameter(key, "false"));
  }

  public int getIntParameter(String key, int defaultInt)
  {
    if (isEmptyParameter(key)) {
      return defaultInt;
    }
    return Integer.parseInt(getParameter(key, "0"));
  }

  public String getEvent(String eventName)
  {
    if (this.dynamicAttributes != null) {
      Iterator itr = this.dynamicAttributes.entrySet().iterator();

      while (itr.hasNext()) {
        Map.Entry entry = (Map.Entry)itr.next();
        String key = (String)entry.getKey();
        if ((key.matches(this.eventRegex)) && 
          (key.equalsIgnoreCase(eventName))) {
          return (String)entry.getValue();
        }
      }
    }

    return null;
  }

  public void removeParameter(String key)
  {
    if (this.dynamicAttributes != null)
      this.dynamicAttributes.remove(key);
  }

  public void removeParameter(String[] keys)
  {
    if (this.dynamicAttributes != null)
      for (String key : keys)
        this.dynamicAttributes.remove(key);
  }

  public void setParameter(String key, Object value)
  {
    if (this.dynamicAttributes != null)
      this.dynamicAttributes.put(key, value);
  }

  public void initParameter(String key, Object value)
  {
    if ((this.dynamicAttributes != null) && (!this.dynamicAttributes.containsKey(key)))
      setParameter(key, value);
  }

  public boolean isEmptyParameter(String key)
  {
    if ((this.dynamicAttributes != null) && (this.dynamicAttributes.containsKey(key))) {
      Object value = this.dynamicAttributes.get(key);
      if (value != null) {
        if ((value instanceof String)) {
          return value.toString().trim().length() == 0;
        }
        return false;
      }
    }

    return true;
  }

  public boolean equalsParamter(String key, Object value)
  {
    if (this.dynamicAttributes != null) {
      Object _value = this.dynamicAttributes.get(key);
      if (value == null)
        return _value == null;
      return value.equals(_value);
    }
    return false;
  }

  public void setDynamicAttribute(String uri, String key, Object value) throws JspException
  {
    if (this.dynamicAttributes == null) {
      this.dynamicAttributes = new HashMap();
    }
    if (this.transfers != null) {
      if (key.matches(this.eventRegex)) {
        if (key.startsWith("_on")) {
          key = key.replaceFirst("_on", "on");
        }
        String _key = key.toLowerCase();
        if (this.transfers.containsKey(_key))
          key = (String)this.transfers.get(_key);
      }
      else if (this.transfers.containsKey(key)) {
        key = (String)this.transfers.get(key);
      }
      if (key == null) {
        return;
      }
    }
    if ((this.excludes != null) && (this.excludes.contains(key)))
      return;
    this.dynamicAttributes.put(key, value);
  }

  public void setDynamicAttributes(HashMap<String, Object> dynamicAttributes) {
    if (dynamicAttributes != null) {
      Iterator itr = dynamicAttributes.entrySet().iterator();

      while (itr.hasNext()) {
        Map.Entry entry = (Map.Entry)itr.next();
        try {
          setDynamicAttribute(null, (String)entry.getKey(), entry.getValue());
        } catch (JspException e) {
          e.printStackTrace();
        }
      }
    }
  }

  public Map<String, Object> getDynamicAttributes() {
    if (this.dynamicAttributes == null) {
      this.dynamicAttributes = new HashMap();
    }
    return this.dynamicAttributes;
  }

  protected boolean isAncestorPresent(Class<? extends Tag> tagClass)
  {
    Tag tag = this;
    int counter = 0;
    Tag parent;
    while (((parent = tag.getParent()) != null) && 
      (counter != 10))
    {
      if (parent.getClass() == Widget.class)
        return true;
      if (parent.getClass() == tagClass) {
        return true;
      }
      tag = parent;
      counter++;
    }
    return false;
  }

  protected Tag getAncestorPresent(Class<? extends Tag> tagClass)
  {
    Tag tag = this;
    int counter = 0;
    Tag parent;
    while (((parent = tag.getParent()) != null) && 
      (counter != 10))
    {
      if ((parent.getClass() == Widget.class) && (tagClass != Widget.class))
        return null;
      if (parent.getClass() == tagClass) {
        return parent;
      }
      tag = parent;
      counter++;
    }
    return null;
  }

  protected Tag getParentPresent(Class<? extends Tag> tagClass)
  {
    Tag parent = getParent();
    if ((parent.getClass() == Widget.class) && (tagClass != Widget.class))
      return null;
    if (parent.getClass() == tagClass) {
      return parent;
    }
    return null;
  }

  public void outHTML(String content)
  {
    JspWriter out = this.pageContext.getOut();
    try {
      out.write(content);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void outHTML()
  {
    outHTML(getHTML());
  }

  public void outScript(String[] contents)
  {
    for (String content : contents)
      this.context.addScriptContent(content, false);
  }

  public void outScript(String contents, boolean appendFirst)
  {
    this.context.addScriptContent(contents, appendFirst);
  }

  public void outScript()
  {
    outScript(getScript(), false);
  }

  protected boolean isEmpty(Object obj)
  {
    if (obj == null) {
      return true;
    }
    return ((obj instanceof String)) && (((String)obj).trim().length() == 0);
  }

  public void outDefined(String[] ids)
  {
    this.context.addGlobalDefined(ids);
  }

  public String getJSON()
  {
    return getJSON(null);
  }

  protected String getEvents()
  {
    StringBuilder json = new StringBuilder();
    StringBuilder events = new StringBuilder();
    if (this.dynamicAttributes != null) {
      if (this.configs != null)
        this.dynamicAttributes.putAll(this.configs);
      Iterator itr = this.dynamicAttributes.entrySet().iterator();

      while (itr.hasNext()) {
        Map.Entry entry = (Map.Entry)itr.next();
        String key = (String)entry.getKey();
        String value = toString(entry.getValue());
        if (key.matches(this.eventRegex)) {
          if ((this.filters != null) && 
            (this.filters.contains(key.toLowerCase()))) {
            continue;
          }
          if (key.startsWith("_on"))
            key = key.replaceFirst("_on", "on");
          else {
            key = key.toLowerCase().replaceFirst("on", "");
          }
          events.append("\"" + key + "\":" + value + ",");
        }
      }
    }

    if (events.length() > 0) {
      events.setLength(events.length() - 1);
      json.append("listeners:{" + events.toString() + "}");
    }
    return "{" + json.toString() + "}";
  }

  protected String getJSON(String str)
  {
    StringBuilder json = new StringBuilder();
    if (str != null)
      json.append(str);
    StringBuilder events = new StringBuilder();
    if (this.dynamicAttributes != null) {
      if (this.configs != null)
        this.dynamicAttributes.putAll(this.configs);
      Iterator itr = this.dynamicAttributes.entrySet().iterator();

      while (itr.hasNext()) {
        Map.Entry entry = (Map.Entry)itr.next();
        String key = (String)entry.getKey();
        if (((this.excludes != null) && 
          (this.excludes.contains(key))) || (
          (this.filters != null) && 
          (this.filters.contains(key)))) {
          continue;
        }
        String value = toString(entry.getValue());
        if (key.matches(this.eventRegex)) {
          if ((this.filters != null) && 
            (this.filters.contains(key.toLowerCase()))) {
            continue;
          }
          if (key.startsWith("_on"))
            key = key.replaceFirst("_on", "on");
          else {
            key = key.toLowerCase().replaceFirst("on", "");
          }
          events.append("\"" + key + "\":" + value + ",");
        }
        else if ((this.objectRegex != null) && (key.matches(this.objectRegex))) {
          json.append("\"" + key + "\":" + value + ",");
        } else if ((this.arrayRegex != null) && (key.matches(this.arrayRegex))) {
          json.append("\"" + key + "\":[" + value + "],");
        } else {
          if ((("height".equals(key)) || ("width".equals(key))) && 
            (isNumber(value))) {
            json.append("\"" + key + "\":" + value + ",");
            continue;
          }

          if (("true".equals(value)) || ("false".equals(value))) {
            json.append("\"" + key + "\":" + value + ",");
            continue;
          }
          json.append("\"" + key + "\":\"" + value + "\",");
        }
      }
    }

    if (events.length() > 0) {
      events.setLength(events.length() - 1);
      json.append("listeners:{" + events.toString() + "}");
    } else if (json.length() > 0) {
      json.setLength(json.length() - 1);
    }
    return "{" + json.toString() + "}";
  }

  protected String toString(Object value) {
    if (((value instanceof StringBuilder)) || ((value instanceof StringBuffer)))
      return value.toString();
    if ((value instanceof Long))
      return Long.toString(((Long)value).longValue());
    if ((value instanceof Integer))
      return Integer.toString(((Integer)value).intValue());
    if ((value instanceof Float))
      return Float.toString(((Float)value).floatValue());
    if ((value instanceof Double))
      return Double.toString(((Double)value).doubleValue());
    if ((value instanceof BigDecimal)) {
      return ((BigDecimal)value).toString();
    }
    return (String)value;
  }

  protected boolean isNumber(String str)
  {
    if (str == null)
      return false;
    char[] chars = str.toCharArray();
    int sz = chars.length;
    boolean hasExp = false;
    boolean hasDecPoint = false;
    boolean allowSigns = false;
    boolean foundDigit = false;

    int start = chars[0] == '-' ? 1 : 0;
    if ((sz > start + 1) && (chars[start] == '0') && (chars[(start + 1)] == 'x'))
    {
      int i = start + 2;
      if (i == sz)
        return false;
      do
      {
        if (((chars[i] < '0') || (chars[i] > '9')) && ((chars[i] < 'a') || (chars[i] > 'f')) && ((chars[i] < 'A') || (chars[i] > 'F')))
        {
          return false;
        }
        i++;
      }while (i < chars.length);
      return true;
    }

    sz--;

    int i = start;

    while ((i < sz) || ((i < sz + 1) && (allowSigns) && (!foundDigit))) {
      if ((chars[i] >= '0') && (chars[i] <= '9')) {
        foundDigit = true;
        allowSigns = false;
      } else if (chars[i] == '.') {
        if ((hasDecPoint) || (hasExp)) {
          return false;
        }
        hasDecPoint = true;
      } else if ((chars[i] == 'e') || (chars[i] == 'E')) {
        if (hasExp) {
          return false;
        }
        if (!foundDigit) {
          return false;
        }
        hasExp = true;
        allowSigns = true;
      } else if ((chars[i] == '+') || (chars[i] == '-')) {
        if (!allowSigns) {
          return false;
        }
        allowSigns = false;
        foundDigit = false;
      } else {
        return false;
      }
      i++;
    }
    if (i < chars.length) {
      if ((chars[i] >= '0') && (chars[i] <= '9')) {
        return true;
      }
      if ((chars[i] == 'e') || (chars[i] == 'E')) {
        return false;
      }
      if ((!allowSigns) && ((chars[i] == 'd') || (chars[i] == 'D') || (chars[i] == 'f') || (chars[i] == 'F')))
      {
        return foundDigit;
      }
      if ((chars[i] == 'l') || (chars[i] == 'L')) {
        return (foundDigit) && (!hasExp);
      }

      return false;
    }

    return (!allowSigns) && (foundDigit);
  }
}