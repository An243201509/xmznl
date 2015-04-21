<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>用户管理</title>
<meta name="description" content="pcts-usermanager">
<meta name="keywords" content="pcts,user">
<meta name="author" content="ZhangTao">
<meta name="Copyright" content="ZhangTao">
<!-- ExtJs Support start -->
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/libs/ext/3.4/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/libs/ext/3.4/themes/default/css/themes.css" />
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/adapter/ext/ext-base-debug.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/ext-all-debug.js"></script>
<!-- end ExtJs Support -->
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/BigDecimal.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/ext-fixed.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/ext-override.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/ext-widgets.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/locale/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/locale/ext-widgets-lang-zh_CN.js"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/libs/ext/3.4/widgets/css/LockingBufferView.css"/>
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/libs/ext/3.4/widgets/css/RowEditor.css"/>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/Ext.ItemSelector.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/mapper/Ext.mapper.Mapper.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/mapper/Ext.mapper.MappingProxy.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.grid.LockingBufferView.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.grid.LockingColumnHeaderGroup.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.grid.ColumnHeaderGroup.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.grid.RowEditor.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.ProgressBarPager.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.tree.GridPanel.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.tree.LockingBufferView.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.tree.TreeGrid.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/grid/Ext.grid.OperationColumn.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/widgets/locale/widgets-lang-zh_CN.js"></script>

<!--SofaJs Support start -->
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/libs/ext/3.4/sofa/themes/default/css/themes.css" />
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/sofa/api.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/sofa/sofa-all.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/sofa/sofa-flow.js"></script>
<script type="text/javascript" src="<%=basePath %>/resources/libs/ext/3.4/sofa/locale/sofa-lang-zh_CN.js"></script>
<!-- end SofaJs Support -->
</head>
<script type="text/javascript">
	Ext.onReady(function(){
		var grid = new sofa.grid.GridPanel({
			"region":"center",
			"monitorResize":true,
			"useCheckColumn":false,
			"columns":[
				{"sortable":true,"width":100,"align":"center","dataIndex":"sn","header":"工号"},
				{"sortable":true,"width":100,"align":"center","dataIndex":"name","header":"姓名"},
				{"sortable":true,"width":100,"align":"center","dataIndex":"email","header":"邮箱"},
				{"sortable":true,"width":100,"align":"center","dataIndex":"phone","header":"手机号码"},
				{"xtype":"numbercolumn","sortable":true,"width":160,"header":"状态"}],
			"pageSize":30,
			"useCRUDColumn":false,
			"url":"<%= basePath %>/system/user_info!list.action",
			"id":"grid",
			"multiSelect":true,
			"useRowNumberColumn":true,
			"autoQuery":true,
			"idProperty":"id",
			"border":false,
			"viewConfig":{},
			renderTo: "gridLoad"
			//listeners:{"render":gridLoad}
		});
		new Ext.Viewport({"items":[grid],"layout":"border","border":false});
	});
</script>
<body>
	<div id="gridLoad"></div>
</body>
</html>