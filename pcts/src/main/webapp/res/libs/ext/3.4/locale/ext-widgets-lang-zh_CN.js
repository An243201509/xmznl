if (Ext.form.FileUploadField) {
	Ext.apply(Ext.form.FileUploadField.prototype, {
		buttonText : '浏览...'
	});
}

if (Ext.Ajax) {
	Ext.Ajax.title = "{0} - HTTP Status";
	Ext.Ajax.msg = "您的登录已超时，请重新登录";
}

Ext.apply(Ext.Error, {
	ConnectTimeout : '请求数据超时.'
});

Ext.apply(Ext.form.Field.prototype, {
	labelSeparator : '\uFF1A'
});

Ext.apply(Ext.form.ComboBox.prototype, {
	emptyText : '==请选择=='
});

Ext.apply(Ext.form.DateField.prototype, {
	errorFormat : {
		'n' : '月',
		'm' : '月',
		'j' : '日',
		'd' : '日',
		'D' : '日',
		'y' : '年',
		'Y' : '年',
		'h' : '时',
		'H' : '时',
		'i' : '分',
		's' : '秒'
	},
	format            : "Y-m-d"
});
if (Ext.grid.RowNumberer) {
	Ext.apply(Ext.grid.RowNumberer.prototype, {
		header : '序号'
	});
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
		beforePageText : "第",// update
		afterPageText : "页，共 {0} 页",// update
		firstText : "第一页",
		prevText : "上一页",// update
		nextText : "下一页",
		lastText : "最后一页",
		refreshText : "刷新",
		enterText : "确定",
		beforePreText : "每页",
		prePageSizeText: '条/页',
		displayMsg : "显示 {0} - {1}条，共 {2} 条",// update
		emptyMsg : '没有数据'
	});
}
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "确定",
		cancel : "取消",
		yes : "是",
		no : "否",
		detail : "详细"
	};
	Ext.MessageBox.Error = {
		title : "错误信息提示"
	};
	Ext.MessageBox.Alert = {
		title : "信息提示"
	};
	Ext.MessageBox.Confirm = {
		title : "操作确认信息"
	};
}

if (Ext.form.BasicForm) {
	Ext.apply(Ext.form.BasicForm.prototype, {
		Msg : {
			success : "表单提交完成",
			error : "表单提交异常",
			wait : "请稍候，正在提交表单...",
			waitTitle : "操作提示信息"
		},
		inValidTitle : "表单验证异常",
		inValidText : "表单验证不通过，请检查输入项。"
	});

};
if (Ext.form.TriggerField) {
	Ext.apply(Ext.form.TriggerField.prototype, {
		selectAllText : "全选",
		refreshText : "刷新",
		clearText : "清除"
	});
}
if (Ext.form.RadioGroup) {
	Ext.apply(Ext.form.RadioGroup.prototype, {
		blankText : "你必须在本组中选择一个项目"
	});
}
if (Ext.form.CheckboxGroup) {
	Ext.apply(Ext.form.CheckboxGroup.prototype, {
		blankText : "你必须在本组中选择一个项目"
	});
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
		listEmptyText : "没有查询到任何数据"
	});
}

if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
		headerSelAll : "全选",
		colFromTitle : "被隐藏的列",
		colToTitle : "显示出的列",
		colButtonReset : "还原",
		colCheckboxLabel : "保存这个设置",
		colWinTitle : "选择要显示的列",
		colAltTitle : "操作提示",
		colAltMsg : "至少需要保留一列不被隐藏"
	});
}

if (Ext.grid.GroupingView) {
	Ext.apply(Ext.grid.GroupingView.prototype, {
		groupByText : "显示分组信息",
		showGroupsText : "按此列分组"
	});
}

if (Ext.util.Format) {
	Ext.apply(Ext.util.Format, { 
		trueText: '是',
		falseText: '否'
	});
}