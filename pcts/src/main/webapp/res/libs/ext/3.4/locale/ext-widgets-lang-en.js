if (Ext.form.FileUploadField) {
	Ext.apply(Ext.form.FileUploadField.prototype, {
		buttonText : 'Browser...'
	});
}

if (Ext.Ajax) {
	Ext.Ajax.title = "{0} - HTTP Status";
	Ext.Ajax.msg = "Login timeout, Please login again.";
}

Ext.apply(Ext.Error, {
	ConnectTimeout : 'Connect Timeout.'
});

Ext.apply(Ext.form.Field.prototype, {
	labelSeparator : ':'
});

Ext.apply(Ext.form.ComboBox.prototype, {
	emptyText : 'Select'
});

Ext.apply(Ext.form.DateField.prototype, {
	errorFormat : {
		'n' : 'Month',
		'm' : 'Month',
		'j' : 'Day',
		'd' : 'Day',
		'D' : 'Day',
		'y' : 'Year',
		'Y' : 'Year',
		'h' : 'Hour',
		'H' : 'Hour',
		'i' : 'Minute',
		's' : 'Second'
	}
});
if (Ext.grid.RowNumberer) {
	Ext.apply(Ext.grid.RowNumberer.prototype, {
		header : 'No.'
	});
}
if (Ext.PagingToolbar) {
	Ext.apply(Ext.PagingToolbar.prototype, {
		beforePageText : "",// update
		afterPageText : "Page,Total {0} Page",// update
		firstText : "First Page",
		prevText : "Previous",// update
		nextText : "Next",
		lastText : "Last",
		refreshText : "Refresh",
		enterText : "Go",
		beforePreText : "",
		prePageSizeText: 'size/page',
		displayMsg : "Display {0} - {1} Rows，Total {2} Rows",// update
		emptyMsg : 'Empty Data'
	});
}
if (Ext.MessageBox) {
	Ext.MessageBox.buttonText = {
		ok : "OK",
		cancel : "Cancel",
		yes : "Yes",
		no : "No",
		detail : "Detail"
	};
	Ext.MessageBox.Error = {
		title : "Error Message"
	};
	Ext.MessageBox.Alert = {
		title : "Error Message"
	};
	Ext.MessageBox.Confirm = {
		title : "Confirm Message"
	};
}

if (Ext.form.BasicForm) {
	Ext.apply(Ext.form.BasicForm.prototype, {
		Msg : {
			success : "Success Submit",
			error : "Error Submit",
			wait : "Waiting...",
			waitTitle : "Confirm Message"
		},
		inValidText : "InValid Form, Please Check Input."
	});
};
if (Ext.form.TriggerField) {
	Ext.apply(Ext.form.TriggerField.prototype, {
		selectAllText : "Select All",
		refreshText : "Refresh",
		clearText : "Clear"
	});
}
if (Ext.form.RadioGroup) {
	Ext.apply(Ext.form.RadioGroup.prototype, {
		blankText : "You must select one item in this group"
	});
}
if (Ext.form.CheckboxGroup) {
	Ext.apply(Ext.form.CheckboxGroup.prototype, {
		blankText : "You must select one item in this group"
	});
}
if (Ext.form.ComboBox) {
	Ext.apply(Ext.form.ComboBox.prototype, {
		listEmptyText : "Not Found List"
	});
}
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
		headerSelAll : "ALL",
		colFromTitle : "hidden column",
		colToTitle : "display column",
		colButtonReset : "Reset",
		colCheckboxLabel : "Save the settings",
		colWinTitle : "Choose Column To Display",
		colAltTitle : "Message",
		colAltMsg : "least one column can not be hidden"
	});
}


if (Ext.util.Format) {
	Ext.apply(Ext.util.Format, {
		trueText: 'TRUE',
		falseText: 'FALSE'
	});
}