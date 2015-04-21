/**
 * @version V1.0
 */
package com.pcts.core.uimanage.dao;

import org.springframework.stereotype.Component;

import com.pcts.common.base.dao.BaseDao;
import com.pcts.core.usermanage.entity.UiPersonalized;

/**
 * @author zhangtao, 2014年11月30日 下午11:10:28
 *	<p>
 * 	<b>Description<b><p>
 * 
 * 	用户界面个性化
 */
@Component
public class UiPersonalizedDao extends BaseDao<UiPersonalized> {

	@Override
	protected Class<UiPersonalized> getEntityClass() {
		// TODO Auto-generated method stub
		return null;
	}

}
