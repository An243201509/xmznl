Ext.apply(Ext.grid.RowEditor.prototype, {
	
	saveText: '保存',
	
    cancelText: '取消',
    
    commitChangesText: '你需要提交或取消保存',
    
    errorText: ''
    	
});

if(Ext.tree.LockingView) {
	
	 Ext.apply(Ext.tree.LockingView.prototype, {
		 
		 lockText : '锁定',

		 unlockText : '解锁'
		    
	 });
	 
}

if(Ext.grid.LockingGridView) {
 	
	 Ext.apply(Ext.grid.LockingGridView.prototype, {
		 
		 lockText : '锁定',

		 unlockText : '解锁'
		    
	 });
	 
}

if(Ext.grid.OperationColumn) {
	 Ext.apply(Ext.grid.OperationColumn.prototype, {
		confirmTitle: "请确认",
		confirmText: "是否要",
		headerText: "操作",
		alertText: '信息提示',
		waitText: "操作提示",
		waitMsg: "正在执行操作，请稍等...",
		altText: {
			view : "查看",
			edit : "编辑",
			del : "删除",
			check : "审核",
			uncheck : "反审核",
			review : "复核",
			unreview : "反复核",
			copy : "复制",
			history : "历史"
		},
		trigFireText: "您不能{0}自己维护的数据。",
		successText: {
			del : "删除成功",
			check : "审核成功",
			uncheck : "反审核成功",
			review : "复核成功",
			unreview : "反复核成功"
		},
		failureText: {
			del : "删除失败",
			check : "审核失败",
			uncheck : "反审核失败",
			review : "复核失败",
			unreview : "反复核失败"
		}
	});
};