package com.pcts.common.tag.layout;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.pcts.common.tag.container.Container;

public abstract class BaseContainer extends Container
{
  public static final String WIDGETS_ITEM_ID = "_widget_items_id";
  public String xtype;

  public BaseContainer()
  {
    this.filters = new ArrayList();
    this.filters.add("_widget_items_id");
    this.arrayRegex = "items";
  }

  public boolean doBeforeRender()
  {
    return true;
  }

  public void doAfterRender()
  {
  }

  public void doRelease()
  {
  }

  public String getHTML()
  {
    return null;
  }

  public void doRender()
  {
  }

  public void addWidgetId(String itemId) {
    getDynamicAttributes();
    String itemIds = (String)this.dynamicAttributes.get("_widget_items_id");

    if (itemIds == null)
      itemIds = itemId;
    else {
      itemIds = itemIds + "," + itemId;
    }
    this.dynamicAttributes.put("_widget_items_id", itemIds);
  }
}