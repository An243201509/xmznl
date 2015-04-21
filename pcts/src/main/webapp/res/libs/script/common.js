//页面标题
var title = title ? title : '';

// 默认查询条件
var condition = condition ? condition
		: ' deleted = false order by createTime desc';

// grid控件id,默认为grid

var formWindow = formWindow ? formWindow : Ext.getCmp("formWindow");

// 自定义重置数据、判断
var formdata = {}, operate = "";

function gridLoad() {

//	grid.setRequestParams({
//		_queryCondition : condition
//	});
//	grid.reload();
}
// 新增
function add() {
	formWindow.show();
	operate = "add";
	formWindow.setTitle("新增-" + title);
	myForm.updateStatus(FORM.STATUS.ADD);
}

// 表单状态变更事件
function formStatusChange(form, status, data) {
	if (data) {
		form.setValues(data);
	}

	if (form.isStatus(FORM.STATUS.ADD)) {
		// 新增，去掉隐藏的id值
		id.clearValue();
	}
}

// 查看
function view(data) {
	formWindow.show();
	operate = "view";
	myForm.updateStatus(FORM.STATUS.VIEW, data);
	formWindow.setTitle("查看-" + title);
	fillForm(data);
}

// 复制
function copy(data) {
	formWindow.show();
	operate = "copy";
	formdata = data;
	delete data.id;
	myForm.updateStatus(FORM.STATUS.ADD, data);
	formWindow.setTitle("复制-" + title);
	fillForm(data);
}

// 编辑
function edit(data) {
	formWindow.show();
	operate = "edit";
	formdata = data;
	myForm.updateStatus(FORM.STATUS.EDIT, data);
	formWindow.setTitle("编辑-" + title);
	fillForm(data);
}
// 表单填充
function fillForm(data) {
}

// 表单提交成功返回信息
function saveSuccess(msg) {
	formWindow.close();
	grid.reload();
}

// 表单提交错误返回
function formError(msgObj, state) {
	sofa.error('提交失败', msgObj);
}

// 表单提交
function formSubmit(json, form) {
	return true;
}

// 返回
function reback() {
	formWindow.close();
}

// 重置
function reset() {
}

// 导出、打印
function _export(param) {
	return {
		title : title,
		tabulationTime : new Date().format('Y-m-d')
	};
}

function isTrueOrFalse(v) {
	if (v) {
		return '是';
	} else {
		return '否';
	}
}
