if (Ext.form.FileUploadField) {
	Ext.apply(Ext.form.FileUploadField.prototype, {
		buttonText : '瀏覽...'
	});
}

if (Ext.Ajax) {
	Ext.Ajax.title = "{0} - HTTP Status";
	Ext.Ajax.msg = "您的登錄已超時，請重新登錄";
}

Ext.apply(Ext.Error, {
	ConnectTimeout : '請求數據超時.'
});

Ext.apply(Ext.form.Field.prototype, {
	labelSeparator : '\uFF1A'
});

Ext.apply(Ext.form.ComboBox.prototype, {
	emptyText : '請選擇'
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
		'h' : '時',
		'H' : '時',
		'i' : '分',
		's' : '秒'
	}
});
if (Ext.grid.RowNumberer) {
	Ext.apply(Ext.grid.RowNumberer.prototype, {
		header : '序號'
	});
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
		beforePageText : "第",// update
		afterPageText : "頁,共 {0} 頁",// update
		firstText : "第一頁",
		prevText : "上一頁",// update
		nextText : "下一頁",
		lastText : "最后一頁",
		refreshText : "刷新",
		enterText : "確定",
		beforePreText : "每頁",
		prePageSizeText: '條/頁',
		displayMsg : "顯示 {0} - {1}條，共 {2} 條",// update
		emptyMsg : '沒有數據'
	});
}
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "確定",
		cancel : "取消",
		yes : "是",
		no : "否",
		detail : "详细"
	};
	Ext.MessageBox.Error = {
		title : "錯誤信息提示"
	};
	Ext.MessageBox.Alert = {
		title : "信息提示"
	};
	Ext.MessageBox.Confirm = {
		title : "操作確認信息"
	};
}

if (Ext.form.BasicForm) {
	Ext.apply(Ext.form.BasicForm.prototype, {
		Msg : {
			success : "表單提交完成",
			error : "表單提交異常",
			wait : "請稍後，正在提交表單...",
			waitTitle : "操作提示信息"
		},
		inValidTitle : "表單驗證異常",
		inValidText : "表單驗證不通過，請檢查輸入項。"
	});
};
if (Ext.form.TriggerField) {
	Ext.apply(Ext.form.TriggerField.prototype, {
		selectAllText : "全選",
		refreshText : "刷新",
		clearText : "清除"
	});
}
if (Ext.form.RadioGroup) {
	Ext.apply(Ext.form.RadioGroup.prototype, {
		blankText : "你必須在本組中選擇一個項目"
	});
}
if (Ext.form.CheckboxGroup) {
	Ext.apply(Ext.form.CheckboxGroup.prototype, {
		blankText : "你必須在本組中選擇一個項目"
	});
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
		listEmptyText : "沒有查詢到任何數據"
	});
}
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
		headerSelAll : "全選",
		colFromTitle : "被隱藏的列",
		colToTitle : "顯示出的列",
		colButtonReset : "還原",
		colCheckboxLabel : "保存這個設置",
		colWinTitle : "選擇要顯示的列",
		colAltTitle : "操作提示",
		colAltMsg : "至少需要保留一列不被隱藏"
	});
}

if (Ext.grid.GroupingView) {
	Ext.apply(Ext.grid.GroupingView.prototype, {
		groupByText : "顯示出分組信息",
		showGroupsText : "按此列分組"
	});
}


if (Ext.util.Format) {
	Ext.apply(Ext.util.Format, {
		trueText: '是',
		falseText: '否'
	});
}