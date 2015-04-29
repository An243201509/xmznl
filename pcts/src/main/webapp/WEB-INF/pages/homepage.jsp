<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String basePath = request.getScheme() + "://" + request.getServerName() + ":"
			+ request.getServerPort() + request.getContextPath() + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"/>
	<meta http-equiv="pragma" content="no-cache"/>
	<meta http-equiv="cache-control" content="no-cache"/>
	<meta http-equiv="expires" content="0"/>  
	<title>Pcts Management</title>
	<link type="text/css" rel="stylesheet" href="<%=basePath %>res/libs/ext/3.4/resources/css/ext-all.css" />
	<link type="text/css" rel="stylesheet" href="<%=basePath %>res/css/homepage.css" />
	<script type="text/javascript" src="<%=basePath %>res/libs/ext/3.4/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="<%=basePath %>res/libs/ext/3.4/ext-all.js"></script>
	<script type="text/javascript">
		var consts={
			menuData: [{
				id:'1',
				funcname:'首页',
				description:'个人核心技术系统-ZhangTao.工作室出品',
				odr:0
			}],
			//门户路径
			contextPath:'<%=basePath%>',
			//门户页面路径
			pagePath:'<%=basePath%>pages/',
			//门户图片路径
			imgPath:'<%=basePath %>res/images/',
			//当前登录用户id
			userId:'<s:property value="userid" escape="false" />',
			//当前登录用户名
			loginName:'<s:property value="loginname" escape="false" />',
			//当前登录用户姓名
			userName:'<s:property value="username" escape="false" />',
			//是否启用Ukey
			ukey:false,
			silent:false
		}
		</script>
		<script type="text/javascript" src="<%=basePath %>res/libs/ext/extention/ext-basex.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/ext/extention/TabCloseMenu.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/ext/extention/TabScrollerMenu.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/script/homepage-layout.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/script/homepage-class.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/script/message-center-class.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/ext/extention/window-extend.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/script/locker-class.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/ext/extention/node-util.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/script/ukey.js"></script>
		<script type="text/javascript" src="<%=basePath %>res/libs/script/lic-class.js"></script>
</head>
<body>
	<!-- ==================================================== 
	<s:iterator value="funcMenus" id='f' status="menus">
		    	,{id:'<s:property value='id'/>',funcname:'<s:property value='name'/>',description:'<s:property value='remark'/>',odr:'<s:property value='order_no'/>'}
			</s:iterator>
	-->
	<div id="mini-box" class="message-box">
    	<div id="mini-box-button" onclick="messagecenter.down()"></div>
    	<div id="mini-box-context">
        	<span>最新消息：</span>
        	<span id="msg-mini"></span>
        </div>
    </div>
	<!-- ==================================================== -->
    <div id="dropdown-box" class="message-box">
    	<div id="dropdown-box-top"></div>
		
        <div id="context-list" class="dropdown-box-context">
        	<!-- <div class="context-item context-user-item"><a href="#" onclick="showdetail(this)"></a><span>title</span></div> -->
        </div>
        <div id="context-detail" class="dropdown-box-context" style="display:none">
        	<div class="context-item context-user-item"><a href="#" onclick="messagecenter.hideDetail()" style="background:url(<%=basePath %>res/images/homepage/msg-hide-detail.png) center center no-repeat; "></a><span id="context-detail-title"><!-- 标题 --></span></div>
            <div id="context-detail-top"></div>
            <div id="context-detail-center">
            	<div id="context-detail-content"><!-- 内容 --></div>
            </div>
            <div id="context-detail-bottom"></div>
        </div>
        <div id="dropdown-box-bottom">
            <div style="padding-left: 16px; padding-top: 5px; float:left">
                <a href="#" onclick="messagecenter.toCenter()">消息中心</a>
				<span id="sys-msg-count">&nbsp;&nbsp;系统消息(0)</span>
	            <span id="user-msg-count">&nbsp;&nbsp;互动消息(0)</span>
            </div>
            <div style="padding-top: 5px;float:right;margin-right: 16px;"><a href="#" onclick="messagecenter.up()">关闭</a></div>
        </div>
    </div>
</body>
</html>