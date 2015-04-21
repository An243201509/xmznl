
if (sofa.Button) {
	sofa.Button.Submit = "保存";
	sofa.Button.Reset = "重置";
	sofa.Button.Cancel = "取消";
}

if (sofa.msg) {
	sofa.msg.buttonsText = {
		'ok' : '確定',
		'cancel' : '返回',
		'more' : '更多'
	};
	sofa.msg.alertText = '提示信息';
	sofa.msg.confirmText = '请确认提示';
}

if (sofa.Toolbar) {
	Ext.apply(sofa.Toolbar.prototype, {
		labelText: '当前位置：',
		waitText: '操作信息提示',
		waitMsg: '正在执行操作，请稍等...',
		buttonText: {
			add: '新增',
			del: '删除',
			check: '审核',
			uncheck: '反审核',
			print: '打印',
			excel: 'Excel',
			word: 'Word',
			download: '下载',
			conform: '确认',
			calculate: '计算',
			recheck: '复核',
			unrecheck: '反复核',
			update: '更新',
			handle: '经办'
		},
		successText: {
			del: '删除成功',
			check: '审核成功',
			uncheck: '反审核成功'
		},
		failureText: {
			del: '删除失败',
			check: '审核失败',
			uncheck: '反审核失败'
		}
	});
}

if (sofa.api) {
	Ext.apply(sofa.api, {
		title: '操作提示',
		msg: '正在執行導出...',
		errorMsg: '沒有設置指向主機地址或導出文件格式'
	});
	Ext.apply(sofa.api, {
		errorURL: '没有配置提交的url地址',
		waitText: '操作信息提示',
		waitMsg: '正在执行操作，请稍等...',
		rules: {
			del: {
				rule1: '您所选择的数据有<b>{0}</b>条是<b>已审核状态不能执行删除</b>，是否继续删除其他符合条件的数据？',
				rule2: '您所选择的数据均为<b>已审核状态不能执行删除</b>，请先进行反审核后再删除！',
				rule3: '是否确认将所选择的数据全部删除？',
				rule4: '请先选择需要批量<b>删除</b>的数据！'
			},
			check: {
				rule1: '您所选择的数据有<b>{0}</b>条是<b>已审核状态不能再重复审核</b>，是否继续审核其他符合条件的数据？',
				rule2: '您所选择的数据均为<b>已审核状态不能重复审核</b>的，请选择未审核的数据进行审核！',
				rule3: '是否确认将所选择的数据全部审核？',
				rule4: '请先选择需要批量<b>审核</b>的数据！',
				rule5: '您不能审核其中<b>{0}</b>条自己维护的数据，是否继续审核其他符合条件的数据？',
				rule6: '您不能审核自己维护的数据'
			},
			uncheck: {
				rule1: '您所选择的数据有<b>{0}</b>条是<b>未审核状态不能再重复反审核</b>，是否继续反审核其他符合条件的数据？',
				rule2: '您所选择的数据均为<b>未审核状态不能重复反审核</b>的，请选择已审核的数据进行反审核！',
				rule3: '是否确认将所选择的数据全部反审核？',
				rule4: '请先选择需要批量<b>反审核</b>的数据！',
				rule5: '您不能反审核其中<b>{0}</b>条自己维护的数据，是否继续反审核其他符合条件的数据？',
				rule6: '您不能反审核自己维护的数据'
			}
		}
	});
}

if (sofa.grid.ACL) {
	Ext.apply(sofa.grid.ACL, {
		query: '對不起，您沒有查詢權限。'
	});
}

if (sofa.form) {
	
	if (sofa.form.SearchBox) {
		
		Ext.apply(sofa.form.SearchBox.prototype, {
			chooseText: '選擇',
			confirmText: '確定',
			cancelText: '關閉'
		});
		
	}
}