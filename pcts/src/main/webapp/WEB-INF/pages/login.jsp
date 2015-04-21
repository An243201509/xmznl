<%@ page import="org.springframework.security.web.WebAttributes"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String basePath = request.getScheme() + "://" + request.getServerName() + ":"
		+ request.getServerPort() + request.getContextPath() + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>用户登录</title>
<link rel="stylesheet" href="<%=basePath %>/r/css/bootstrap.min.css" />
<link rel="stylesheet" href="<%=basePath %>/r/css/bootstrapValidator.min.css" />
<script type="text/javascript" src="<%=basePath %>/r/js/jquery.min.js"></script>
<script type="text/javascript" src="<%=basePath %>/r/js/bootstrapValidator.js"></script>
<script type="text/javascript" src="<%=basePath %>/r/js/bootstrap.min.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
		$('#resetBtn').click(function() {
			$('#defaultForm').data('bootstrapValidator').resetForm(true);
		});
	});

	function jsValidate() {
		$('#defaultForm').bootstrapValidator({
			feedbackIcons : {
				valid : 'glyphicon glyphicon-ok',
				invalid : 'glyphicon glyphicon-remove',
				validating : 'glyphicon glyphicon-refresh'
			},
			fields : {
				loginname : {
					validators : {
						notEmpty : {
							message : '请输入用户名'
						},
						stringLength : {
							min : 3,
							message : '请检查用户名，用户名长度最少3位'
						}
					/*
					regexp: {
					    regexp: /^[a-zA-Z0-9_\.]+$/,
					    message: '密码只能由字母、数字、下划线组成'
					}*/
					}
				},
				password : {
					validators : {
						notEmpty : {
							message : '请输入密码'
						},
						stringLength : {
							min : 3,
							message : '请检查密码，密码长度最少3位'
						}
					/*
					regexp: {
					    regexp: /^[a-zA-Z0-9_]+$/,
					    message: '密码只能由字母、数字、下划线组成'
					}*/
					}
				}
			}
		});
		$('#defaultForm').bootstrapValidator('validate');
		if ($('#defaultForm').data('bootstrapValidator').isValid()) {
			document.getElementById("defaultForm").submit();
		}
	}

	// 回车键 监控
	function onkeypressEvent(e) {
		try {
			if (e.keyCode == 13) {
				jsValidate();
			}
		} catch (e) {
			alert(e.message);
		}
	}
</script>
</head>
<body onkeypress="onkeypressEvent(event)">
	<div class="container">
		<div class="row">
			<section>
			<div class="col-lg-8 col-lg-offset-2">
				<div class="page-header">
					<h2>个人核心技术系统-用户登录</h2>
				</div>
				<form id="defaultForm" action="<%=basePath%>/backstage/login" method="post"
					class="form-horizontal">
					<div class="form-group">
						<label class="col-lg-3 control-label">用户名</label>
						<div class="col-lg-5">
							<input type="text" class="form-control" name="loginname"
								id="loginname" value="admin" />
						</div>
					</div>

					<div class="form-group">
						<label class="col-lg-3 control-label">密码</label>
						<div class="col-lg-5">
							<input type="password" class="form-control" name="password" value="111111"/>
						</div>
					</div>

					<div class="form-group">
						<div class="col-lg-9 col-lg-offset-3">
							<button type="button" class="btn btn-primary"
								onclick="javascript:jsValidate();">登录</button>
							<button type="button" class="btn btn-info" id="resetBtn">重置</button>
						</div>
					</div>
				</form>
			</div>
			<section>
		</div>
	</div>
</body>
</html>