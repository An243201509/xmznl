<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="/html-tags" prefix="html"%>
<%@ taglib uri="/widget-tags" prefix="c"%>
<html:jsp>
<head>
<title>用户管理</title>
<html:resource />
<script type="text/javascript" src="http://127.0.0.1:8080/pcts/resources/libs/ext/3.4/ext-override.js"></script>
<script type="text/javascript" src="http://127.0.0.1:8080/pcts/resources/libs/script/common.js"></script>
<script type="text/javascript">
	var grid,portal;
	var title = "用户管理";//设置全局变量,保存标题信息（对话框标题用）
	//var formWindow = Ext.getCmp("myWindow");
	function search() {
		alert("1111");
	}

    </script>
</head>
<body>
	<c:Viewport layout="border">
		<c:Panel region="north" border="false" height="30">
			<c:toolbar bindGrid="grid" baseUrl="http://127.0.0.1:8080/pcts/system/user_info?" >
				<c:toolbar.button id="add" onClick="add" ACL="add"/>
				<c:toolbar.button id="check" action="method=check" ACL="check"/>
				<c:toolbar.button id="uncheck" action="method=unCheck" ACL="uncheck"/>
				<c:toolbar.button id="del" action="method=markDeleteByIds" ACL="delete"/>
				<c:toolbar.button id="print" onBeforeSubmit="_export" />
				<c:toolbar.button id="excel" onBeforeSubmit="_export" />
			</c:toolbar>
		</c:Panel>
		<!-- 
        	useRowNumberColumn 使用序号列（默认false）
        	useCRUDColumn 使用CRUD列封装，默认true（创建人、创建时间、修改人、修改时间）
        	useCheckColumn 使用审核列封装，默认true（审核标记、审核人、审核时间）
        	pageSize 每页的默认数据条数
        	url 查询数据的请求地址，该请求应该返回带分页信息的JSON格式数据
        	fields 无需在表格里显示的数据
        	idBind id字段，对应VO对象的id属性名
        	region 本表格所属的区域
         -->
		<c:grid id="grid" 
			useRowNumberColumn="false" 
			useCRUDColumn="false"
			useCheckColumn="false" 
			multiSelect="true" 
			pageSize="30"
			url="http://127.0.0.1:8080/pcts/system/user_info!list.action" 
			idBind="id"
			autoLoad="true" 
			onRender="gridLoad"
			region="center">
			<c:column text="工号" dataBind="sn"/>
			<c:column text="姓名" dataBind="name"/>
			<c:column text="邮箱" dataBind="email"/>
			<c:column text="手机号码" dataBind="phone"/>
			
			<c:column type="number" text="状态" width="160" />
		</c:grid>
	</c:Viewport>
</body>
</html:jsp>