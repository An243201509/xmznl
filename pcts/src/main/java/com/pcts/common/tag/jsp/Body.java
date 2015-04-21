/**
 * @version V1.0
 */
package com.pcts.common.tag.jsp;

import com.pcts.common.tag.container.Container;

/**
 * @author zhangtao, 2014年10月30日 下午11:04:04
 *         <p>
 *         <b>Description<b>
 *         <p>
 *         Body
 */
public class Body extends Container {
	public boolean doBeforeRender() {
		return true;
	}

	public void doRender() {
		Page page;
		if ((page = (Page) getAncestorPresent(Page.class)) != null)
			page.setBody(getHTML());
		else
			outHTML();
	}

	public void doAfterRender() {
	}

	public void doRelease() {
	}

	public String getHTML() {
		return this.bodyContent.getString();
	}

	public String getScript() {
		return null;
	}
}