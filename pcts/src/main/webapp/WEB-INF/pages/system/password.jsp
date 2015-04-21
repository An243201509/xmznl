<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<title>密码修改</title>
<meta http-equiv="Expires" CONTENT="0">
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="pragma" content="no-cache" />
<script type="text/javascript">
	var CONTEXT = {
		"DEBUG" : true,
		"CONFIG" : {
			"OPERATION.PARAMS" : "view,add,edit,copy,history,del,check,uncheck,review,unreview",
			"useAudit" : "true"
		},
		"PATH" : {},
		"LOCALE" : "zh_CN",
		"USER" : "12345678901234567890",
		"USERNAME" : "管理员",
		"AUDIT" : true,
		"WORKFLOW" : {
			"isFlow" : false,
			"processDefinitions" : {}
		},
		"CURRENTDATE" : "2014-10-30"
	};
</script>
<link rel="stylesheet" type="text/css" href="../../3.4/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="../../3.4/themes/default/css/themes.css" />
<script type="text/javascript" src="../../3.4/adapter/ext/ext-base-debug.js"></script>
<script type="text/javascript" src="../../3.4/ext-all-debug.js"></script>
<script type="text/javascript" src="../../3.4/BigDecimal.js"></script>
<script type="text/javascript" src="../../3.4/ext-fixed.js"></script>
<script type="text/javascript" src="../../3.4/ext-override.js"></script>
<script type="text/javascript" src="../../3.4/ext-widgets.js"></script>
<script type="text/javascript" src="../../3.4/locale/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="../../3.4/locale/ext-widgets-lang-zh_CN.js"></script>
<link rel="stylesheet" type="text/css" href="../../3.4/widgets/css/LockingBufferView.css" />
<link rel="stylesheet" type="text/css" href="../../3.4/widgets/css/RowEditor.css" />
<script type="text/javascript" src="../../3.4/widgets/Ext.ItemSelector.js"></script>
<script type="text/javascript" src="../../3.4/widgets/mapper/Ext.mapper.Mapper.js"></script>
<script type="text/javascript" src="../../3.4/widgets/mapper/Ext.mapper.MappingProxy.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.grid.LockingBufferView.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.grid.LockingColumnHeaderGroup.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.grid.ColumnHeaderGroup.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.grid.RowEditor.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.ProgressBarPager.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.tree.GridPanel.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.tree.LockingBufferView.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.tree.TreeGrid.js"></script>
<script type="text/javascript" src="../../3.4/widgets/grid/Ext.grid.OperationColumn.js"></script>
<script type="text/javascript" src="../../3.4/widgets/locale/widgets-lang-zh_CN.js"></script>
<link rel="stylesheet" type="text/css" href="../../3.4/sofa/themes/default/css/themes.css" />
<script type="text/javascript" src="../../3.4/sofa/api.js"></script>
<script type="text/javascript" src="../../3.4/sofa/sofa-all.js"></script>
<script type="text/javascript" src="../../3.4/sofa/sofa-flow.js"></script>
<script type="text/javascript" src="../../3.4/sofa/locale/sofa-lang-zh_CN.js"></script>
<script type="text/javascript">
	var newPwd, oldPwd, secondPwd, save, back, reset, passwordForm, sf_1, loginCode;
</script>
<script type="text/javascript">
	Ext.onReady(function() {
		new Ext.form.Hidden({
			"inputType" : "hidden",
			"id" : "loginCode",
			"renderTo" : "ct_form_field_loginCode",
			"name" : "loginCode"
		});
		loginCode = Ext.getCmp("loginCode");
		new Ext.form.TextField({
			"inputType" : "password",
			"id" : "oldPwd",
			"labelWidth" : 90,
			"renderTo" : "ct_form_field_oldPwd",
			"width" : 170,
			"label" : "原始密码：",
			"labelAlign" : "right"
		});
		oldPwd = Ext.getCmp("oldPwd");
		new Ext.form.TextField({
			"inputType" : "password",
			"id" : "newPwd",
			"labelWidth" : 90,
			"renderTo" : "ct_form_field_newPwd",
			"width" : 170,
			"label" : "新密码：",
			"labelAlign" : "right"
		});
		newPwd = Ext.getCmp("newPwd");
		new Ext.form.TextField({
			"inputType" : "password",
			"id" : "secondPwd",
			"labelWidth" : 90,
			"renderTo" : "ct_form_field_secondPwd",
			"width" : 170,
			"label" : "确认新密码：",
			"labelAlign" : "right"
		});
		secondPwd = Ext.getCmp("secondPwd");
		new sofa.Button({
			"id" : "save",
			"text" : "保存",
			"type" : "submit"
		});
		save = Ext.getCmp("save");
		new sofa.Button({
			"id" : "reset",
			"text" : "重置",
			"type" : "button"
		});
		reset = Ext.getCmp("reset");
		new sofa.Button({
			"id" : "back",
			"text" : "返回",
			"type" : "button"
		});
		back = Ext.getCmp("back");
		fp_passwordForm = new Ext.FormPanel({
			"id" : "passwordForm",
			"basicFormId" : "passwordForm",
			"layout" : "border",
			"border" : false,
			"buttons" : [ save, reset, back ],
			"buttonAlign" : "center",
			"url" : "",
			"cls" : "ext-form",
			"items" : {
				"xtype" : "container",
				"region" : "center",
				"autoScroll" : true,
				"layout" : "form",
				"contentEl" : "form_body_passwordForm"
			},
			"fit" : true,
			"renderTo" : "ct_form_passwordForm",
			listeners : {
				"beforesubmit" : _beforeSaveSubmit,
				"success" : _saveSuccess
			}
		});
		passwordForm = fp_passwordForm.getForm();
		passwordForm.setFormPanel(fp_passwordForm);
		passwordForm.add(Ext.getCmp("loginCode"), Ext.getCmp("oldPwd"), Ext.getCmp("newPwd"), Ext.getCmp("secondPwd"));
		passwordForm.addButton([ save, reset, back ]);
	});
</script>
<script type="text/javascript">
	function _beforeSaveSubmit(_json, s, opts) {
		user.biz.beforeUpdateSave(_json, s, opts);
	};

	function _saveSuccess(_json, response) {
		return user.biz.updatePwdSuccess(_json, response);
	};
</script>
</head>
<body>
	<div id="ct_form_passwordForm">
		<div id="form_body_passwordForm">
			<input type="hidden" id="hiddenPwd" name="password"><input type="hidden" id="userId">
			<div id="ct_form_field_loginCode"></div>
			<table class="sofa-form-table" cellspacing="0" cellpadding="0" border="0">
				<tr>
					<td align="center">原始密码:<input type="password" id="oldPwd" name="oldPwd" /></td>
				</tr>
				<tr>
					<td align="center">新密码:<input type="password" id="newPwd" name="newPwd" /></td>
				</tr>
				<tr>
					<td align="center">确认新密码:<input type="password" id="secondPwd" name="secondPwd" /></div></td>
				</tr>
				<tr>
					<td align="center"></td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
