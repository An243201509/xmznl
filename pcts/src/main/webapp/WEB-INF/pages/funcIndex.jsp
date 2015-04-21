<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>
<%
	String funcname = request.getParameter("funcname") == null ? "" : request.getParameter("funcname");
	if(funcname != null && !"".equals(funcname) ){
		funcname = new String(funcname.getBytes("iso-8859-1"),"utf-8");
	}
	String description = request.getParameter("description") == null ? "" : request.getParameter("description");
	if(description != null && !"".equals(description) ){
		description = new String(description.getBytes("iso-8859-1"),"utf-8");
	}
	
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" 
			+ request.getServerPort() + request.getContextPath()+"/";
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"/>
<meta name="Generator" content="EditPlus">
<title></title>
<meta name="Author" content="">
<meta name="Keywords" content="">
<meta name="Description" content="">
<style type="text/css">
body {
	margin: 0;
	padding: 0;
	background: #a2b9d3;
}

.appIndexBg {
	width: 100%;
	text-align: center;
	height: 377px;
	background: url(<%= basePath %>resources/images/homepage/app_index_bg.gif) repeat-x;
}

.partTop {
	width: 100%;
	background: #fff;
}

.appIndex {
	width: 150px;
	height: 76px;
	padding: 150px 143px 0 143px;
	background: url(<%= basePath %>resources/images/homepage/app_index.gif);
	margin-left: auto;
	margin-right: auto;
}

.appName {
	width: 150px;
	height: 76px;
	color: #113f72;
	font: 12px/15px '宋体' normal;
}

.introduction {
	color: #113f72;
	font: 12px/15px '宋体' normal;
	width: 500px;
	margin: 20px auto 0 auto
}
</style>
</head>

<body>
	<div id="partTop" class="partTop">
		<div id="appIndexBg" class="appIndexBg">
			<div class="appIndex">
				<div class="appName">
					<%= funcname %>
				</div>
			</div>
			<div class="introduction">
				<%= description %>
			</div>
		</div>
	</div>
</body>
</html>
<script type="text/javascript" >
	window.onload=function(){
		var BodyHeight=document.documentElement.clientHeight;
		var pageHeight=(BodyHeight-226)/2;
		if(pageHeight > 0 && pageHeight != null){
			document.getElementById("partTop").style.height = pageHeight;
		}
	}
</script>