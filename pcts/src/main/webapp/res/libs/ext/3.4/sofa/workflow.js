/* Ext.override(Ext.layout.BorderLayout.Region,{
    getCollapsedEl:function(){
        if(!this.collapsedEl){
            if(!this.toolTemplate){
                var tt = new Ext.Template(
                     '<div class="x-tool x-tool-{id}">&#160;</div>'
                );
                tt.disableFormats = true;
                tt.compile();
                Ext.layout.BorderLayout.Region.prototype.toolTemplate = tt;
            }
            this.collapsedEl = this.targetEl.createChild({
                cls: "x-layout-collapsed x-layout-collapsedText x-layout-collapsed-"+this.position,
                id: this.panel.id + '-xcollapsed'
            });
            this.collapsedEl.enableDisplayMode('block');

            if(this.collapseMode == 'mini'){
                this.collapsedEl.addClass('x-layout-cmini-'+this.position);
                this.miniCollapsedEl = this.collapsedEl.createChild({
                    cls: "x-layout-mini x-layout-mini-"+this.position, html: "&#160;"
                });
                this.miniCollapsedEl.addClassOnOver('x-layout-mini-over');
                this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                this.collapsedEl.on('click', this.onExpandClick, this, {stopEvent:true});
            }else {
                var t = this.toolTemplate.append(
                        this.collapsedEl.dom,
                        {id:'expand-'+this.position}, true);
                 
                 this.panel.collapsedText=this.panel.collapsedText||this.panel.title||"";
                 var ct=(this.position=="west"||this.position=="east")?new Ext.Template("<table valign='middle'><tr><td>{collapsedText}<td></tr></table>"):new Ext.Template("<span >{collapsedText}</span>");
                 ct.append(
                        this.collapsedEl.dom,
                        {collapsedText:this.panel.collapsedText},true); 
                          
                t.addClassOnOver('x-tool-expand-'+this.position+'-over');
                t.on('click', this.onExpandClick, this, {stopEvent:true});
                
                if(this.floatable !== false){
                   this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                   this.collapsedEl.on("click", this.collapseClick, this);
                }
            }
        }
        return this.collapsedEl;
    }
});*/

 
 Ext.ns( 'Workflow', 'Workflow.window', 'Workflow.button' );
 (function($){
 	
 	var CONSTANT = {
		//跳过功能路由前缀
		TRANSITION_SKIP_CURRENT_NODE_PREFIX : "SKIP_CURRENT_NODE_",
		//流程参数数据
		WORKFLOW_JSON_DATA : "_workflowJsonData",
		//公共参数数据
		COMMON_PARAMS_JSON_DATA : "_jsonData"
	};
 	
 	//************************************************************************//
 	// 流程对象
 	//************************************************************************//
 	Ext.apply($, {
 		
 		_form				: null,
 		_buttons 			: [],
 		_taskConfig			: {},
		
 		//此属性在Tag组件中自动设置
 	 	_collaborationURL		: '',
 	 	_isFlow					: false,
 	 	_processInstanceId 		: '',
 	 	_taskId 				: '',
 	 	_processDefinitionId 	: '',
 	 	_isHistory 				: false,
 	 	_executorFlag			: '0',
 	 	
 	 	_workflowAreaPanelByForm : {},
 	 	_assignee				 : null,
 	 	_routeObject         	 : {},
 	 	_selectedOutcome 		 : null,
 	 	
 	 	/*业务界面中启动流程用到的属性,不带表单的发起流程所用的办理Window*/
 	 	_withoutFormWindow		: null,
 	 	/* 业务界面中启动流程用到的属性 */
 	 	isUseFlow 				: false,
 	 	/* 业务界面中启动流程用到的属性 */
 	 	_grid 					: null,
 	 	/* 业务界面中启动流程用到的属性 */
 	 	_toolbar 				: null,
 	 	
 	 	/* 业务界面中启动流程用到的属性，由业务界面设置此属性值 */
 	 	forms 					: {},
 	 	/*业务界面中启动流程用到的属性,不带表单的发起流程操作,业务界面可根据需要重置此属性值*/
 	 	operationsWithoutForm 	: ['del'],
 	 	
 		//************************************************************************//
 		// 方法
 		//************************************************************************//
 	 	/**
 	 	 * 协同中打开界面的初始化方法
 	 	 */
 		init : function(form){
		 	Ext.util.CSS.swapStyleSheet("WorkflowCSS", this._collaborationURL + "resources/css/workflow.css");
		 	
		 	//this._collaborationURL	= getUrlParamValue('collaborationURL', '');
		 	this._isFlow				= getUrlParamValue('isFlow', 'false') == 'false' ? false : true;
		 	this._processInstanceId		= getUrlParamValue('processInstanceId', '');
		 	this._taskId				= getUrlParamValue('taskId', '');
		 	this._processDefinitionId	= getUrlParamValue('processDefinitionId', '');
		 	this._isHistory				= getUrlParamValue('isHistory', 'false') == 'false' ? false : true;
		 	this._executorFlag			= getUrlParamValue('executorFlag', '0');
	 	 	
		 	if(form)this._form = form;
		 
			this._taskConfig = fn.findTaskConfig(this._processDefinitionId, this._taskId);
			fn.initWorkflowPanel(this._taskConfig);
 		},
 		
 		addGridEvent : function(grid) {
 			_self = this;
 			this._grid = grid;
 			
 			this._grid.getOperationColumn().on('beforeclick', function(btName, data, record){

 				fn.clearWorkflowConfig();
 	 		 	
 				var me = this;
// 				if (btName  == 'history') {
// 					this._isHistory = true;
// 					sofa.alert("查询流程历史！");
// 					return false;
// 				} else {
 				
 					var workflowInfo = {}; 
 					
 					//反审核操作特殊处理。编辑、删除操作
 					if(btName == 'uncheck'){
 						var editWorkflwoinfo = fn.getWorkflowInfoByUserOperation(me.params, 'update');
 						var delWorkflwoinfo = fn.getWorkflowInfoByUserOperation(me.params, 'del');
 						
 						//编辑、删除操作都没有配置流程
 						if(editWorkflwoinfo.processDefinitions.length == 0 && delWorkflwoinfo.processDefinitions.length == 0){
 							return true;
 						}
 						
 						workflowInfo  = {
 			 					optObject : null,
 			 					form : null,
 			 					optAcl : null,
 			 					processDefinitions : [{optGroup:"编辑"}].concat(editWorkflwoinfo.processDefinitions).concat([ {optGroup:"删除"}]).concat(delWorkflwoinfo.processDefinitions),
 			 					currentProcessDefinition : {}
 			 			};
 	
 						//弹出对话框
 						fn.choiceProcessDefinition(workflowInfo, function(){
 							flag = true;
 							workflowInfo.processDefinitions = [];
 							
 							Ext.each(editWorkflwoinfo.processDefinitions, function(pd){
 	 							if(workflowInfo.currentProcessDefinition.id == pd.id){
 	 								workflowInfo.optObject = editWorkflwoinfo.optObject;
 	 								workflowInfo.form = editWorkflwoinfo.form;
 	 								workflowInfo.optAcl = editWorkflwoinfo.optAcl;
 	 								workflowInfo.processDefinitions[0] = pd;
 	 								return;
 	 							}
 	 						});
 							
 							if(workflowInfo.processDefinitions.length == 0){
 								Ext.each(delWorkflwoinfo.processDefinitions, function(pd){
 	 	 							if(workflowInfo.currentProcessDefinition.id == pd.id){
 	 	 								workflowInfo.optObject = delWorkflwoinfo.optObject;
 	 	 								workflowInfo.form = delWorkflwoinfo.form;
 	 	 								workflowInfo.optAcl = delWorkflwoinfo.optAcl;
 	 	 								workflowInfo.processDefinitions[0] = pd;
 	 	 								return;
 	 	 							}
 	 	 						});
 							}
 							
 							return fn.gridOperateEvent(workflowInfo.optObject.id, data, record, workflowInfo);
 						});
 						
 						return false;
 					} else {
 						workflowInfo = fn.getWorkflowInfoByUserOperation(me.params, btName);
 						return fn.gridOperateEvent(btName, data, record, workflowInfo);
 					}
 					
			});
 			
 		},
 		
 		addToolbarEvent : function(toolbar) {
 			_self = this;
 			this._toolbar = toolbar;
 			this._toolbar.on('beforeclick', function(id){
 				//清空重置流程配置
 	 			fn.clearWorkflowConfig();
 	 		 	
				var workflowInfo = fn.getWorkflowInfoByUserOperation(toolbar.buttons, id);
			
				//操作未配置流程定义
				if(workflowInfo.processDefinitions.length == 0){
					return true;
				}
				
				$._isFlow = true;
				
				var selectedData = [];
				//没有配置Form
				if(Ext.isEmpty(workflowInfo.form)){
					//无业务Form界面启动流程标志
					var canBeNoFormFlag = false;
					
					Ext.each($.operationsWithoutForm, function(operation){
						if(operation == id){
							canBeNoFormFlag = true;
							return;
						}
					})
					
					if(!canBeNoFormFlag){
						//未找到流程所用的From
						sofa.alert("操作[" + id + "]已经配置了流程定义，但未找到对应的表单，请与开发人员联系！");
						return false;
					} else {
						var grid = Ext.getCmp(this.bindGrid);
						if(grid instanceof Ext.grid.GridPanel){
							var records = [].concat(grid.getSelectionModel().getSelections());
						} else if(grid instanceof Ext.tree.TreePanel){
							var records = [];
							Ext.each(grid.getChecked(), function(node){
								records.push(node.record);
						    });
						}
					      
						var rs = [];
					    Ext.each(records, function(r){
					    	if (r.record) {
					    		rs.push(r.record);
						    } else {
						    	rs.push(r);
						    }
					    });
					      
						if (rs.length == 0) {
							var ruleText = sofa.api.rules[id];
							sofa.alert(ruleText["rule4"] || "请先选择的数据！");
							return false;
						} 
						
						Ext.each(rs, function(record){
							selectedData.push(record.data);
            			});
					}
				}

				//启动流程
				fn.startProcessFromBusiness(workflowInfo, function(){
					//没有配置Form
	 				if(Ext.isEmpty(workflowInfo.form)){
	 					fn.initWorkflowPanelWithoutForm($._taskConfig, selectedData);

	 				//配置了Form
	 				} else {
	 					fn.initWorkflowPanel($._taskConfig);
						//继续onclick事件
						workflowInfo.optObject.onClick();
	 				}
				});
				return false;
			});
 		},
 		
 		initBusinessData : function(businessDataId, callbackFunc){
 			if(this._isHistory == true){
				this._form.updateStatus(FORM.STATUS.VIEW); 
			}
 			
 			if(this._isFlow == true) {
 				if(!Ext.isEmpty(this._processInstanceId)){
 					var data = $.getBusinessData(businessDataId);
 	 				if (callbackFunc) {  
 						if(data != null){
 							callbackFunc(data);
 						}
 					}
 				} 
 				
 				if(this._isHistory == false){
 					$.setFormConfig();
 				}
 			}
 		},
 		
 		getBusinessData : function(businessDataId){
			var result = null;
			if(this._isHistory == true){
				Ext.Ajax.request( {
					method : 'GET',
					async: false,
					url : this._collaborationURL + 'colEngine/findHistoryBusinessData.ctrl?taskId=' + this._taskId + '&businessDataId=' + businessDataId,
					success : function(data) {
						result = Ext.decode(data.responseText);
					},
					failure : function(m, s, e) {
						sofa.alert(m.responseText);
					}
				});	
			} else {
				var requestUrl = this._collaborationURL + 'colEngine/findBusinessData.ctrl?processInstanceId=' + this._processInstanceId + '&businessDataId=' + businessDataId;
				Ext.Ajax.request( {
					method : 'GET',
					async: false,
					url : requestUrl,
					success : function(data) {
						result = Ext.decode(data.responseText);
					},
					failure : function(m, s, e) {
						sofa.alert(m.responseText);
					}
				});	
			}
			
			return result;
 		},
 		
 		setFormConfig:function(obj){
 			var form = obj || this._form;
 			if(form == null){
 				return false;
 			}
 			
 			var fieldConfig = this._taskConfig.formField || null;
 			if(fieldConfig == null){
 				return false;
 			}
 			
 			var readOnly = fieldConfig["read-only"] == "true" ? true : false;
 			var ids = "," + fieldConfig["names"] + ",";
 			var nullIds = "," + fieldConfig["isnull"] + ",";
 			var ignoreIds = "," + fieldConfig["ignore"] + ",";
 			
 			form.items.each( function( item ){
 				if(nullIds.indexOf("," + item.getId() + ",") != -1){
 					item.reset();
 				}
 				
 				if(ignoreIds.indexOf("," + item.getId() + ",") == -1){
 					if(ids.indexOf("," + item.getId() + ",") != -1){
 						setFieldReadOnly(item, readOnly);
// 						item.setReadOnly(readOnly);
 					}else{
 						//item.setReadOnly(!readOnly);
 						setFieldReadOnly(item, !readOnly);
 					}
 				}
 			} ); 
 			
 			function setFieldReadOnly(field, flag){
 				var status = flag ? FORM.STATUS.VIEW : FORM.STATUS.UPDATE;
 				if( field instanceof Ext.form.CheckboxGroup || field instanceof Ext.form.RadioGroup){
 					field.items && field.items.each( function( itm ){
 						itm.setReadOnly( flag);
 					} );
 				} else if (field instanceof Ext.form.ComboBox) {
 					field.setDisabled(flag);
 				} else {
 					field.setReadOnly( flag );
 				}
 			}
 			
 		},
  
 		//************************************************************************//
 		// 按钮提交方法
 		//************************************************************************//
 		submitWorkflowForm : function(){
 			if(this._form != undefined){
 				//var workflowParam = "isFlow=true&processDefinitionId=" + this._processDefinitionId + "&processInstanceId=" + this._processInstanceId + "&taskId=" + this._taskId +  "&outcome=" + encodeURIComponent(encodeURIComponent(this._selectedOutcome)) + "&userIds=" + $.userIds;
 				//this._form.setUrl(this._collaborationURL + "colEngine/executionFlow.ctrl?" + workflowParam);
 				this._form.setUrl(this._collaborationURL + "colEngine/executionFlow.ctrl");
 				this._form.onSubmit({stopEvent : function() {}});
 			}else{
 				sofa.alert("未指定提交的Form表单!");
 			}
 		},
 		
 		skipCurNodeForm : function(){
 			if(this._form != undefined){
 				if(!Ext.getDom("_wf_skip_form")){
 					Ext.DomHelper.append(document.body,{
 	 					tag:"div",
 						id:"_wf_skip_form"
 	 				});
 				}
 				
 				var skipForm = new Ext.form.BasicForm("_wf_skip_form", {
 					url:this._collaborationURL + "colEngine/executionFlow.ctrl",
 					method:"post",
 					standardSubmit: false,
 					dataType:"html/text",
 					dataFormat:"json",
 					waitMsg:this._form.waitMsg,
 					waitTitle:this._form.waitTitle,
 					submitType:"ajax"
 				});

 				Ext.each( this._form.events['error'].listeners[0], function( n ){
 		        	skipForm.addListener("error", n.fn);
 	        	} );
 				
 				Ext.each( this._form.events['success'].listeners[0], function( n ){
 		        	skipForm.addListener("success", n.fn);
 	        	} );
 				
 				skipForm.onSubmit({stopEvent : function() {}});
 				
 			}else{
 				sofa.alert("未指定提交的Form表单!");
 			}
 		},
 		
 		tempSaveWorkflowForm : function(){
 			if(this._form != undefined){
 				//var workflowParam = "isFlow=true&processDefinitionId=" + this._processDefinitionId + "&taskId=" + this._taskId ;
 				//this._form.setUrl(this._collaborationURL + "colEngine/tempSave.ctrl?" + workflowParam);
 				this._form.setUrl(this._collaborationURL + "colEngine/tempSave.ctrl");
 				this._form.onSubmit({stopEvent : function() {}});
 			}else{
 				sofa.alert("未指定提交的Form表单!");
 			}
 		},
 		
 		showProcessInstanceHistory : function(){
 			$.window.historyWindow.show();
 			var url = this._collaborationURL + "pages/collaboration/processInstanceHistory.jsp?processInstanceId=" + this._processInstanceId;
 			Ext.getDom("_wf_historyIFrame").src = url;
 		},
 		
 		takeTask : function(flag){
 			var controllerUrl = null;
 			if(flag){
 				controllerUrl = this._collaborationURL + 'colEngine/takeTask.ctrl?taskId=' + this._taskId;
 			}else{
 				controllerUrl = this._collaborationURL + 'colEngine/untakeTask.ctrl?taskId=' + this._taskId;
 			}
 			Ext.Ajax.request( {
 				method : 'GET',
 				url : controllerUrl ,
 				async: false,
 				success : function(data) {
 					//sofa.alert(data.responseText);
 					if(flag){
 						for(var i = 0; i < this._buttons.length; i++){
 		   	 				if($.button.takeTask == this._buttons[i]){
 			   	 				Ext.getCmp(this._buttons[i].id).hide();
 		   	 				} else{
 			   	 				Ext.getCmp(this._buttons[i].id).show();
 		   	 				}
 		   	 			}
 					}else{
 						for(var i = 0; i < this._buttons.length; i++){
 		   	 				if($.button.takeTask == this._buttons[i]){
 			   	 				Ext.getCmp(this._buttons[i].id).show();
 		   	 				} else{
 			   	 				Ext.getCmp(this._buttons[i].id).hide();
 		   	 				}
 		   	 			}
 					}
 					
 					return true;
 				},
 				failure : function(m, s, e) {
 					sofa.alert(m.responseText);
 					return false;
 				}
 			});	
 		},
 		
 		getWorkflowParams : function(){
 			var workflowParams = {};
 			var userIds = "", comment = "";
 			
 			if(this._assignee != null && this._assignee.getValue() != null && this._assignee.isVisible()){
 				if (this._assignee.getValue().length == 0) {
 					userIds = "";
 				} else {
 					userIds = this._assignee.getValue();
 				}
 			}
 			var commentTxt = Ext.getDom("_wf_opinion");
 			if(commentTxt != null){
 				comment = commentTxt.value;
 			}
 			
 			Ext.apply(workflowParams, {
 				processDefinitionId:	this._processDefinitionId,
 				processInstanceId:		this._processInstanceId,
 				taskId:					this._taskId,
 				outcome:				this._selectedOutcome,
 				userIds:				userIds,
 				comment:				comment
 			});
 			
 			return workflowParams;
 		},
 		
 		getNextTaskName : function(transitionTo, routeType) {
 			this._selectedOutcome = fn.getOutCome();
 			var flag = fn.isAssingeeTreeListViewEnabled(routeType, transitionTo);
 			this._assignee.setVisible(flag);
 			if(flag){
 				this._assignee.resetSelectedByOutTransition(transitionTo);
 			}
 		}
 	});
 	
 	//************************************************************************//
 	// 按钮
 	//************************************************************************//
 	Ext.apply($.button, {
 		commit : {
     	 	id:'_wf_commitButton', 
     	 	xtype:'button',
     	 	text:'&nbsp;&nbsp;提&nbsp;&nbsp;&nbsp;&nbsp;交&nbsp;&nbsp;', 
     	 	listeners:{
     	 		"click":function(e){
     	 			sofa.confirm({
     	 				title:"提交任务",
     	 				msg: "请确认是否要提交任务?",		
     	 				fn: function(btn){
     	 					if (btn == 'yes') {
     	 						setTimeout(function(){
 			    	 		   	 	if(Ext.isEmpty($._selectedOutcome)){
 	    	 							sofa.alert("请选择流程提交的下一步!");
 	    	 						} else {
 	    	 							//跳过
 	    	 							if($._selectedOutcome.indexOf(CONSTANT.TRANSITION_SKIP_CURRENT_NODE_PREFIX) == 0){
 	    	 								$.skipCurNodeForm();
 	    	 							} else {
 	    	 								if( typeof window._submitWorkflowForm == "function"){
 	    	 									window._submitWorkflowForm();
 	 	    	 							}else{
 	 	    	 								$.submitWorkflowForm();
 	 	    	 							}
 	    	 							}
 	    	 							
 	    	 						}
     	 		   	 			}, 100);
     	 					}
     	 				}
     	 			});
 				}
     	 	}
     	},
 	    	 
     	cancel : {
	    	 id:'_wf_cancelButton', 
	    	 xtype:'button',
	    	 text:'&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;', 
    	 	 listeners:{
    	 		"click":function(e){
		    	 	// TODO;
    	 			fn.closeWindowByComp(this);
		    	 }
    	 	 }
    	},	
        	
    	back : {
   	    	 id:'_wf_cancelButton', 
   	    	 xtype:'button',
   	    	 text:'&nbsp;&nbsp;返&nbsp;&nbsp;&nbsp;&nbsp;回&nbsp;&nbsp;', 
       	 	 listeners:{
       	 		"click":function(e){
   		    	 	// TODO;
       	 			fn.closeWindowByComp(this);
   		    	 }
       	 	 }
       	},	
        	
    	history : {
	    	 id:'_wf_historyButton', 
	    	 xtype:'button',
	    	 text:'流程历史', 
    	 	 listeners:{
    	 		"click":function(e){
    	 			$.showProcessInstanceHistory();
		    	 }
    	 	 }
    	},
        	 
    	firstData : {
	    	 id:'_wf_firstDataButton', 
	    	 xtype:'button',
	    	 text:'发起数据', 
    	 	 listeners:{
    	 		"click":function(e){
		    	 	// TODO;
		    	 }
    	 	 }
    	 },
        	 
        tempSave : {
 	    	 id:'_wf_tempSaveButton', 
 	    	 xtype:'button',
 	    	 text:'暂存流程', 
     	 	 listeners:{
     	 		"click":function(e){
     	 			sofa.confirm({
     	 				title:"暂存流程",
    	 				msg: "请确认是否要暂存流程?",
    	 				fn: function(btn){
    	 					if (btn == 'yes') {
    	 						setTimeout(function(){
    	 							if(typeof window._tempSaveWorkflowForm == "function"){
 	    	 							window._tempSaveWorkflowForm();
    	 							}else{
    	 								$.tempSaveWorkflowForm();
    	 							}
    	 		   	 			}, 100);
    	 					}
    	 				}
    	 			});
 				}
     	 	 }
     	},
     	 
     	takeTask : {
	    	 id:'_wf_takeTaskButton', 
	    	 xtype:'button',
	    	 text:'获取任务', 
	   	 	 listeners:{
	   	 		"click":function(e){
	   	 			$.takeTask(true);
				}
	   	 	 }
	   	},
	   	
	   	untakeTask : {
	    	 id:'_wf_untakeTaskButton', 
	    	 xtype:'button',
	    	 cls:'x-button-untakeTask',
	    	 text:'放弃任务', 
	    	 width:50,
	   	 	 listeners:{
	   	 		"click":function(e){
	   	 			$.takeTask(false);
	   	 			//wait for make sure
	   	 			fn.closeWindowByComp(this);
				}
	   	 	 }
	   	}
 	});
 	
 	//************************************************************************//
 	// 窗体
 	//************************************************************************//
 	Ext.apply($.window, {
 		confirmTaskUserWindow : new sofa.Window({
 			id:"_wf_confirmTaskUser",
 			height:400,
 			width:600,
 			visible:"false",
 			title:"指定待办人",
 			html:"<iframe id='_wf_confirmTaskUserIFrame' width=600 height=360 frameborder=0 scrolling=auto src=''></iframe>",
 			listeners:{
 				"hide":function(){
 					Ext.getDom("_wf_confirmTaskUserIFrame").src = "";
 				}
 			}
 		}),
 		
 		historyWindow : new sofa.Window({
 			id:"_wf_historyWindow",
 			height:400,
 			width:700,
 			visible:"false",
 			title:"流程历史",
 			html:"<iframe id='_wf_historyIFrame' width=688 height=352 frameborder=0 scrolling=auto src=''></iframe>",
 			listeners:{
 				"hide":function(){
 					Ext.getDom("_wf_historyIFrame").src = "";
 				}
 			}
 		})
 		
 	});

 	//************************************************************************//
 	// 内部函数
 	//************************************************************************//
 	var fn = {

 		clearWorkflowConfig : function() {
 			
 			Ext.each()
 			if(!Ext.isEmpty($._form)){
 				var panel = $._form.getFormPanel();
 	 			var formId = $._form.id;

 	 			if($._workflowAreaPanelByForm[formId]){
 	 				$._workflowAreaPanelByForm[formId].expand(false);
 	 				panel.remove($._workflowAreaPanelByForm[formId]);
 	 				$._workflowAreaPanelByForm[formId].destroy();
 	 			} 
 	 			
 	 			if(!Ext.isEmpty(panel.fbar)){
 	 				panel.fbar.show();
 	 			}
 			}
 			
 			if(!Ext.isEmpty($._withoutFormWindow)){
 				$._withoutFormWindow.destroy();
 			}
 			if(!Ext.isEmpty($._assignee)){
 				$._assignee.destroy();
 			}
 			
 			$._form = null;
 			$._isFlow = false;
 			$._processDefinitionId = '';
 			$._selectedOutcome 	= null;
 			$._routeObject 		= {};
 			$._taskConfig		= {};
 			$._assignee			= null;
 			$._processInstanceId= '';
 			$._taskId 			= '';
 			$._isHistory 		= false;
 		},
 	 		
 		findTaskConfig : function(processDefinitionId, taskId) {
 			var config = {};
 			Ext.Ajax.request( {
				method : 'GET',
				async : false,
				url : $._collaborationURL + "colEngine/findTaskConfig.ctrl?processDefinitionId=" + processDefinitionId + "&taskId=" + taskId,
				success : function(data) {
					config = Ext.decode(data.responseText);
				},
				failure : function(m, s, e) {
					sofa.alert(m.responseText);
				}
			});	
 			
 			return config;
 		},
 		
 		gridOperateEvent : function(btName, data, record, workflowInfo){
 			//操作未配置流程定义
				if(workflowInfo.processDefinitions.length == 0){
					return true;
				}

				$._isFlow = true;
				
				//没有配置Form
				if(Ext.isEmpty(workflowInfo.form)){
					//无业务Form界面启动流程标志
					var canBeNoFormFlag = false;
					
					Ext.each($.operationsWithoutForm, function(operation){
						if(operation == btName){
							canBeNoFormFlag = true;
							return;
						}
					});
					
					if(!canBeNoFormFlag){
						//未找到流程所用的From
						sofa.alert("操作[" + btName + "]已经配置了流程定义，但未找到对应的表单，请与开发人员联系！");
						return false;
					}
				}
				
				//启动流程
				fn.startProcessFromBusiness(workflowInfo, function(){
					//没有配置Form
	 				if(Ext.isEmpty(workflowInfo.form)){
	 					fn.initWorkflowPanelWithoutForm($._taskConfig, [data]);
	
	 				//配置了Form
	 				} else {
	 					fn.initWorkflowPanel($._taskConfig);
	 			 		//继续onclick事件
	 			 		workflowInfo.optObject.listeners.click(data, record);
	 				}
				});
				
				return false;
 		},
 		
 		startProcessFromBusiness : function(workflowInfo, callbackFun){
 			$._form = workflowInfo.form;
 			
 			if(workflowInfo.processDefinitions.length == 1){
				workflowInfo.currentProcessDefinition = workflowInfo.processDefinitions[0];
				$._processDefinitionId = workflowInfo.currentProcessDefinition.id;
	 			$._taskConfig = fn.findTaskConfig($._processDefinitionId, $._taskId);
	 			
	 			//回调初始流程操作Panel方法
				callbackFun();
			} else {
				//弹出对话框
				fn.choiceProcessDefinition(workflowInfo, callbackFun);
			}
 		},
 		
 		initWorkflowPanelWithoutForm : function(taskConfig, selectedData){
 			var buttons = [
	             new sofa.Button({
	            	 width:"60px",
	            	 type:"button",
	            	 text:"&nbsp;&nbsp;提&nbsp;&nbsp;&nbsp;&nbsp;交&nbsp;&nbsp;", 
	            	 listeners:{
	            		"click":function(){
	            			var commitButton = this;
	          	 			sofa.confirm({
	          	 				title:"提交任务",
	          	 				msg: "请确认是否要提交任务?",		
	          	 				fn: function(btn){
	          	 					if (btn == 'yes') {
	          	 						commitButton.setDisabled(true);
	          	 						setTimeout(function(){
	      			    	 		   	 	if(Ext.isEmpty($._selectedOutcome)){
	      	    	 							sofa.alert("请选择流程提交的下一步!");
	      	    	 						} else {
	    	          	 						var mb = Ext.MessageBox.progress("操作提示","请等待...");
	      	    	 							var workflowParam = Ext.encode($.getWorkflowParams());
	      	    	 							var param = {};
	      	    	 							param[CONSTANT.WORKFLOW_JSON_DATA] = workflowParam;
	      	    	 							param[CONSTANT.COMMON_PARAMS_JSON_DATA] = Ext.encode(selectedData);
	      	    		       	 				Ext.Ajax.request( {
	      	    		       	 					method : 'POST',
	      	    		       	 					params: param,
	      	    		       	 					url : $._collaborationURL + "colEngine/multiStartProcess.ctrl",
	      	    		       	 					async: false,
	      	    		       	 					success : function(response) {
	      	    		       	 						sofa.alert({
	      	    		       	 							msg:response.responseText,
	      	    		       	 							fn:function(){
	      	    		       	 								fn.closeWindowByComp(commitButton);
	      	    		       	 							}
	      	    		       	 						});
	      	    		       	 					},
	      	    		       	 					failure : function(m, s, e) {
	      	    		       	 						sofa.error({
	      	    		       	 							msg:m.responseText,
	      	    		       	 							fn:function(){
	      	    		       	 								//fn.closeWindowByComp(commitButton);
	      	    		       	 							}
	      	    		       	 						});
	      	    		       	 					}
	      	    		       	 				});	
	      	    	 						}
	          	 		   	 			}, 100);
	          	 					}
	          	 				}
	          	 			});
	            		 }
	        		 }
	             }),
	             
	             new sofa.Button({
	            	 text:"&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;",
	            	 width:"60px",
	            	 type:"button",
	            	 listeners:{
	            		"click":function(){
	            			fn.closeWindowByComp(this);
	            		 }
	        		 }
	             })
		    ];
 			var config = fn.getWorkflowAreaPanelConfig(taskConfig, buttons);
 			
 			$._withoutFormWindow = new sofa.Window({
 				title: "启动 - " + (Ext.isEmpty(taskConfig) ? "" : " 【流程：" + taskConfig.processDefinitionName + "-" + taskConfig.processDefinitionVersion + "】"),
 				height : 220,
 				width : 680,
		    	layout: 'fit',
		    	//modal: false,
		    	//plain: true,
		    	//shadow: false,
		    	draggable: true,
		    	resizable: true,
		    	closable: true,
		    	minimizable:false,
		    	maximizable:false,
		    	//closeAction: 'hide',
		    	items : [
		    	         config
		    	]
 			});
 			
 			$._withoutFormWindow.show();
 			
 			fn.setTransitionStatus();
 		},
 		
 		initWorkflowPanel : function(taskConfig){
 			
 			var panelConfig = fn.getWorkflowAreaPanelConfig(taskConfig);
 			//设置流程区域
 			fn.showWorkflowPanel(taskConfig, panelConfig);
 			
 		},
 		
 		getWorkflowAreaPanelConfig : function(taskConfig, buttons){
 			
 			var transitions = (taskConfig || {}).transitions;
 			var config = null, panel1 = null;
 			var colNum = 0, defTransitionTo, defTransitionRouteType;
 			var doc = document,
 	        bd = (doc.body || doc.documentElement);
 			
 			if(Ext.isEmpty(buttons)){
 				if($._isHistory == false){
 					if($._processInstanceId == ''){
 						$._buttons = [$.button.commit, new Ext.Spacer({width:10}), $.button.cancel, new Ext.Spacer({width:10}), $.button.tempSave];
 	 				} else {
 	 					$._buttons = [
 	 			             $.button.takeTask, 
 	 			             $.button.commit, 
 	 			             $.button.cancel, 
 	 			             $.button.history, 
 	 			             //$.button.firstData, 
 	 			             $.button.tempSave , 
 	 			             $.button.untakeTask
 	 		             ];
 	 					if($._executorFlag == 0){
 	 						var takeFlag = false;
 	 						Ext.Ajax.request( {
 	 							method : 'post',
 	 							url : $._collaborationURL + 'colEngine/takeTask.ctrl?taskId=' + $._taskId ,
 	 							async:false,
 	 							success : function(data) {
 	 								takeFlag = true;
 	 							},
 	 							failure : function(m, s, e) {
 	 								sofa.alert(m.responseText);
 	 								takeFlag = false;
 	 							}
 	 						});	
 	 						if(takeFlag){
 	 							$.button.takeTask.hidden = true;
 	 						}else{
 	 							for(var i = 0; i < $._buttons.length; i++){
 	 			   	 				//if($.button.takeTask != _buttons[i]){
 	 									$._buttons[i].hidden = true;
 	 			   	 				//} 
 	 			   	 			}
 	 						}
 	 						
 	 					}else{
 	 						$.button.takeTask.hidden = true;
 	 					}
 	 				}
 				} else {
 					$._buttons = [
	 			        $.button.history
	 			        //, new Ext.Spacer({width:10})
	 					//, $.button.firstData
	 			       ,$.button.cancel
	 				];
 				}
			} else {
				$._buttons = buttons;
			}
 			
 			if($._isHistory == false){
 				var arr = new Array();
 				
				var str = '';
				str += '<table border="0" cellspacing="4" cellpadding="4" width="99%" align="center">';
				str += '    <tr height="34px">';
				var trans = "";
				if(!Ext.isEmpty(transitions)){
					colNum = transitions.length;
					var checked = "";
					if(colNum == 1){
						checked = "checked";
						$._selectedOutcome = transitions[0].name;
						defTransitionTo = transitions[0].to;
						defTransitionRouteType = transitions[0].routeType;
					} 

					for(var i = 0; i < colNum; i++){
						var routeContext = transitions[i].displayName;
						if (transitions[i].routeType == 'reback') {
							routeContext = "<font color='red'>" + routeContext + "</font>";
						}
						
						trans += "<input type='radio' name='_wf_outcome' id='outcome_" + transitions[i].name + "' " + checked + " onclick='Workflow.getNextTaskName(\"" + transitions[i].to + "\",\"" + transitions[i].routeType + "\")' value='" + transitions[i].name + "' " + "/>&nbsp;&nbsp;" + routeContext + "&nbsp;&nbsp;&nbsp;&nbsp;";
					}
				}
				
				var str1 = '<div id="ct__wf_assigneeTreeListView" class="sofa-form-element"></div>';

				trans += '<div id="_wf_appontUsers" style="display:none"></div>';

				str += '		<td align="left" valign="middle" style="padding: 5px 0px">' + trans  + '</td>';
				str += '		<td align="left" valign="middle" style="padding: 5px 0px">' + str1  + '</td>';
				str += '    </tr>';
				str += '    <tr>';
				str += '        <td colspan=2 style="padding: 5px 0px">';
				str += '            <table border="0" cellspacing="4" cellpadding="4" width="100%" height="55" align="center" style="background-color:#fff">';
				str += '                <tr>';
				str += '                    <td width="100"  align="center" valign="middle" style="color: #504e4e; border-right: 1px dotted #969696">';
				str += '                        办理意见:';
				str += '                    </td>';
				str += '                    <td hight="100">';
				str += '                        <textarea id="_wf_opinion" name="_wf_opinion" type="text" style="width:90%; height:100%; border:1"></textarea>';
//				str += '                        <textarea id="_wf_opinion" name="_wf_opinion" rows=1 cols=50 class="x-form-textarea x-form-field" style="border:1"></textarea>';
				str += '                    </td>';
				str += '                </tr>';
				str += '           </table>';
				str += '        </td>';
				str += '    </tr>';
				str += '</table>';
				
				config = new Ext.Panel({
					//id:'_wf_transitionArea',
					border: false,
				    labelAlign : "right",
					layout:'fit',
				    cls:'bottomPartBg',
			      	style:'padding:0px 0px 0px 0px',
				    hideBorders :true,
				    items: [{html: str}],
				    buttonAlign:'center',
				    width: "100%",
				    height:150,
				    buttons:[$._buttons]
				});
 			}else{
 				config = new Ext.Panel({
					border: false,
				    height:38,
				    width: "100%",
				    labelAlign : "right",
					layout:'fit',
				    cls:'bottomPartBg',
			      	style:'padding:0px 0px 0px 0px',
			      	hideBorders :true,
 				    buttonAlign:"center",
 				    buttons: [$._buttons]
 				});
 			}
 			
 			return config;
 		},
 		
 		showWorkflowPanel : function(taskConfig, panelConfig){
 			
 			var panel = $._form.getFormPanel();
 			var formId = $._form.id;
 			
 			//隐藏fbar
 			if(!Ext.isEmpty(panel.fbar)){
 				panel.fbar.hide();
 			}
 			
 			//panel.header=false;
			//panel.layout = 'border';
			
			//var c = panel.items.get(0);
			//c.region='center';
			//c.split = true;
			
 			var panelConfigHeight = 150;
 			try{
 				panelConfigHeight = parseInt(panelConfig.height);
 			}catch(e){}
 			$._workflowAreaPanelByForm[formId] = new Ext.Panel({
				region: 'south',
				height: panelConfigHeight + 25,
				width: '100%',
				title: '流程操作区' + (Ext.isEmpty(taskConfig) ? "" : " - 【流程：" + taskConfig.processDefinitionName + "-" + taskConfig.processDefinitionVersion + "】"),
				collapsible : true,
				border: false,
				split: true,
				layout: 'fit',
                items: panelConfig
			});

			panel.getLayout().rendered = false;
			panel.add($._workflowAreaPanelByForm[formId]);
			//panel.fbar.removeAll(true);
			panel.doLayout();
			
			fn.setTransitionStatus();
			
 		},
 		
 		choiceProcessDefinition : function(workflowInfo, callbackFun){
 			var pds = [];
 			for(var i = 0; i < workflowInfo.processDefinitions.length; i++){
 				var pd = workflowInfo.processDefinitions[i];
 				if(!Ext.isEmpty(pd.optGroup)){
 					pds.push(new Ext.form.Label({text:pd.optGroup, style:"font-weight:bold"}));
 				} else {
 					
	 				var radio = new Ext.form.Radio({
	 					id : "_wf_choicePd_" + pd.id,
	 					name : "_wf_choicePd",
	 					value : i,
	 					boxLabel : pd.name + "-" + pd.version ,
	 					labelAlign:"right",
	 					checked : false
	 				});
	 				pds.push(radio);
 				
 				}
 			}
 			
 			var choicePdWindow = new sofa.Window({
 				title: '选择流程',
 				height : 180,
 				width : 280,
		    	layout: 'fit',
		    	//modal: false,
		    	//plain: true,
		    	//shadow: false,
		    	draggable: true,
		    	resizable: false,
		    	closable: true,
		    	minimizable:false,
		    	maximizable:false,
		    	//closeAction: 'hide',
		    	items : [
					new Ext.Panel({
					    labelAlign : "right",
					  	bodyStyle:'padding:5px',
					    hideBorders :false,
					    border: false,
					    autoScroll : true,
					    items: pds,
					    buttonAlign:'center',
					    width: "100%",
					    buttons:[
					             new sofa.Button({
					            	 text:"选择",
					            	 width:"60px",
					            	 type:"button",
					            	 listeners:{
					            		"click":function(){
					            			var index = -1;
					            			for(var i = 0; i < pds.length; i++){
					            				var radio = pds[i];
					             				if(radio.checked == true){
					             					index = parseInt(radio.getValue());
					             					break;
					             				}
					            			}
					            			if(index == -1){
					            				sofa.alert("请先选择流程定义!");
					            				return;
					            			}            
						 					workflowInfo.currentProcessDefinition = workflowInfo.processDefinitions[index];
						 					$._processDefinitionId = workflowInfo.currentProcessDefinition.id;
						 		 			$._taskConfig = fn.findTaskConfig($._processDefinitionId, $._taskId);
						 		 			
						 		 			//回调初始流程操作Panel方法
						 					callbackFun();
						 					
				            	 			choicePdWindow.close();
					            		 }
				            		 }
					             }),
					             
					             new sofa.Button({
					            	 text:"取消",
					            	 width:"60px",
					            	 type:"button",
					            	 listeners:{
					            		"click":function(){
					            			choicePdWindow.close();
					            		 }
				            		 }
					             })
					    ]
					})
		    	]
 			});
 			
 			choicePdWindow.show();
 			
 		},
 		
 		//业务界面中根据不同操作获得流程信息
 		getWorkflowInfoByUserOperation : function(operations, currentOperationCode){
 			var workflowInfo = {
 					optObject : null,
 					form : $.forms[currentOperationCode],
 					optAcl : null,
 					processDefinitions : [],
 					currentProcessDefinition : {}
 			};
 			
			Ext.each(operations, function(opt){
				if(opt.id == currentOperationCode){
					workflowInfo.optObject = opt;
					workflowInfo.optAcl = opt.ACL;
				}
			});
			
			if(!Ext.isEmpty(workflowInfo.optAcl)){
				var processDefinitionArray = sofa.context.getProcessDefinitionsByOperation(workflowInfo.optAcl);
				
				if(!Ext.isEmpty(processDefinitionArray)){
					workflowInfo.processDefinitions = processDefinitionArray;
				}
			}
			
			return workflowInfo;
 		},
 		
 		getOutCome : function(){
 			var outcomes = Ext.query("*[name=_wf_outcome]");
 			if(outcomes.length > 0){
 				for(var i = 0; i < outcomes.length; i++){
 					if(outcomes[i].checked){
 						return outcomes[i].value;
 					}
 				}
 			}
 			
 			return null;
 		},
 		
 		showConfirmTaskUser : function(taskName){
 			$.window.confirmTaskUserWindow.show();
 			var url = $._collaborationURL + "pages/collaboration/confirmTaskUser.jsp?processDefinitionId=" + $._processDefinitionId + "&outTransition=" + taskName;
 			Ext.getDom("_wf_confirmTaskUserIFrame").src = url;
 		},
 		
 		isAssingeeTreeListViewEnabled : function(routeType, transitionTo) {
 			var flag = false;
 			if (routeType == 'reback') {
 				$._assignee.setVisible(false);
 				flag = false;
 			} else {
 				if (typeof ($._routeObject[transitionTo]) == 'undefined') {
 	 				var requestUrl = $._collaborationURL + 'colEngine/isMayConfirmTaskUser.ctrl?processDefinitionId=' + $._processDefinitionId + '&outTransition=' + transitionTo;
 	 				Ext.Ajax.request( {
 	 					method : 'GET',
 	 					url : requestUrl,
 	 					async: false,
 	 					success : function(data) {
 	 						var data = Ext.decode(data.responseText);
 	 						$._routeObject[transitionTo] = data;
 	 		 				flag = data;
 	 					},
 	 					failure : function(m, s, e) {
 	 						$._routeObject[transitionTo] = false;
 	 		 				flag = false;
 	 					}
 	 				});	
 	 			} else	if (($._routeObject[transitionTo]) || ($._routeObject[transitionTo]) == 'true') {
 	 				flag = true;
 	 			} else {
 	 				flag = false;
 	 			}
 			}
 			
 			return flag;
 		},
 		
 		setTransitionStatus : function(){
 			if($._isHistory == false){
 				var transitions = (($._taskConfig || {}).transitions || []);
 				//指定代办人TreeListView
 				$._assignee = new AssigneeTreeListView("ct__wf_assigneeTreeListView", false);
 				
 				var colNum = transitions.length;
 				//只有一个输出路由，已经设置为选中状态
 				if(colNum == 1){
 					$._selectedOutcome = transitions[0].name;
					var defTransitionTo = transitions[0].to;
					var defTransitionRouteType = transitions[0].routeType;
					
 					$.getNextTaskName(defTransitionTo, defTransitionRouteType);
 				}
 			}
 		},
    	
    	closeWindowByComp : function(comp){
    		var ownerCt = comp.ownerCt;
			if(comp instanceof Ext.Window || comp instanceof sofa.Window){
				comp.close();
				return;
			}
    		if(!Ext.isEmpty(ownerCt)){
    			fn.closeWindowByComp(ownerCt);
    		} else {
    			//可能是iframe方式打开的流程页面
    			parent.formWindow.close();
    		}
    	}
 	};

 	
 	//此重写方法最好在resource中完成，且在onSubmit方法中完成流程流程数据参数的附加，而不是在submit方法
 	Ext.override(Ext.form.BasicForm, {
     	submit:function(options){
     		options = options || {};
     		options.params = options.params || {};
     		options.params[CONSTANT.WORKFLOW_JSON_DATA] = Ext.encode($.getWorkflowParams());
     		if(this.standardSubmit){
     			var v = options.clientValidation === false || this.isValid();
 	    		if(v){
 		    		var el = this.el.dom;
 		    		if(this.url && Ext.isEmpty(el.action)){
 		    			el.action = this.url;
 		    		}
 		    		el.submit();
 		    	}
 	    		return v;
     		}
     		var submitAction = String.format('{0}submit', this.api ? 'direct' : '');
     		this.doAction(submitAction, options);
     		return this; 
     	}
     });

 	var AssigneeTreeListView = Ext.extend(Ext.form.TreeListView, {
		loaderConfig: {
		},
		width:200,
		textField:"text",
		forceSelection:false,
		expandedAll:false,
		mode:"local",
		//id:"_wf_assigneeTreeListView",
		multiSelect:true,
		name:"_wf_assigneeTreeListView",
		valueField:"fid",
		autoQuery:false,
		textParam:"name",
		labelWidth:"70",
		maxHeight:"200",
		minListHeight:"200",
		label:"指定代办人",
		labelAlign:"right",
		editable:false,
		disabled:false,
		outTransition:null,
		assigneeGroup:{},
		
		constructor: function(renderTo, visiable){
			var me = this;
			var conf = {
				store: new Ext.tree.TreeLoader({
					expandedAll: false,
					multiSelect: true,
					dataUrl: "",
					listeners: {
						select: me.cusSelect
					}
					//,id: 'loader_wf_assigneeTreeListView'
				}),
				listeners: {
					select: me.cusSelect
				},
				hidden : visiable ? !visiable : true,
				renderTo: renderTo
			}
			
			this.outTransition = null;
			this.assigneeGroup = {};
			AssigneeTreeListView.superclass.constructor.call(this, conf);
        },

        cusSelect : function(tree, node) {
    		var values = [], texts = [];
        	Ext.each( node, function( n ){
	        	if( n && n.attributes && n.attributes.type == "user"){
		        	texts.push( n.attributes[ tree.displayField ] );
		        	values.push( n.attributes[ tree.valueField ] );
	        	}
        	}, tree );
    		
        	if(values.join(",") != tree.getValue()){
        		tree.setValue(values.join(","));
        		tree.setRawValue(texts.join(","));
        	}
        	
        	this.assigneeGroup[this.outTransition] = {values: values, texts: texts};
    	},
    	
    	resetSelectedByOutTransition: function(outTransition){
    		this.outTransition = outTransition;
    		this.store.dataUrl = $._collaborationURL + "colEngine/confirmTaskUser.ctrl?processDefinitionId=" + $._processDefinitionId + "&outTransition=" + outTransition;
    		this.onRefresh();
    		if(typeof this.assigneeGroup[outTransition] != "undefined"){
    			this.setValue(this.assigneeGroup[outTransition].values.join(","));
    			this.setRawValue(this.assigneeGroup[outTransition].texts.join(","));
    			
    			/*
    			var fids = this.assigneeGroup[outTransition].values;
    			for(var i = 0; i < fids.length; i++){
    				var node = this.findNode("fid", fids[i]);
    				if(typeof node != "undefined"){
    					node.select();
    				}
    			}
    			*/
    		}
    	}
    	
 	});
 	
 	//***********************************************************
 	
 })(Workflow);


 function getUrlParamValue(name, defvalue){    
 	if(location.href.indexOf("?")!=-1 || location.href.indexOf(name+'=')!=-1){
 		var queryString = location.href.substring(location.href.indexOf("?")+1);     
 		var parameters = queryString.split("&");     
 		var pos, paraName, paraValue;    
 		for(var i=0; i<parameters.length; i++){        
 			pos = parameters[i].indexOf('=');        
 			if(pos == -1) { 
 				continue; 
 			}         
 			paraName = parameters[i].substring(0, pos);        
 			paraValue = parameters[i].substring(pos + 1);         
 			if(paraName == name){            
 				return decodeURIComponent(paraValue.replace(/\+/g, " "));        
 			} 
 		}    
 	} 
 	
 	if(defvalue != undefined){
 		return defvalue;
 	}else{
 		return '';
 	}
 }



