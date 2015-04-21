/**
 * @version V1.0
 */
package com.pcts.common.tag.container;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.BodyContent;
import javax.servlet.jsp.tagext.BodyTag;

import com.pcts.common.tag.widget.Widget;

/**
 * @author zhangtao, 2014年10月30日 下午11:06:10
 *         <p>
 *         <b>Description<b>
 *         <p>
 * 
 */
public abstract class Container extends Widget implements BodyTag {
	protected BodyContent bodyContent;

	public int doStartTag() {
		int result = super.doStartTag();
		if (result == 1) {
			return 2;
		}
		return 0;
	}

	public void setBodyContent(BodyContent bodyContent) {
		this.bodyContent = bodyContent;
	}

	public void doInitBody() throws JspException {
	}

	public int doAfterBody() throws JspException {
		try {
			this.bodyContent.writeOut(this.bodyContent.getEnclosingWriter());
		} catch (IOException e) {
			throw new JspException(e);
		}
		return 6;
	}
}