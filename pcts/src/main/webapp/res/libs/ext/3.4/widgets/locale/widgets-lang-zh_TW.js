Ext.apply(Ext.grid.RowEditor.prototype, {
	
	saveText: '保存',
	
    cancelText: '取消',
    
    commitChangesText: '你需要提交或取消保存',
    
    errorText: ''
    	
});

if(Ext.tree.LockingView) {
	
	 Ext.apply(Ext.tree.LockingView.prototype, {
		 
		 lockText : '鎖定',

		 unlockText : '解鎖'
		    
	 });
	 
}

if(Ext.grid.LockingGridView) {
 	
	 Ext.apply(Ext.grid.LockingGridView.prototype, {
		 
		 lockText : '鎖定',

		 unlockText : '解鎖'
		    
	 });
	 
}

if(Ext.grid.OperationColumn) {
	 Ext.apply(Ext.grid.OperationColumn.prototype, {
		confirmTitle: "請確認",
		confirmText: "是否要",
		headerText: "操作",
		waitText: "操縱提示",
		waitMsg: "正在執行操縱，請稍等...",
		altText: {
			view : "查看",
			edit : "編輯",
			del : "刪除",
			check : "審核",
			uncheck : "反審核",
			review : "複核",
			unreview : "反複核",
			copy : "複製",
			history : "歷史"
		},
		successText: {
			del : "刪除成功",
			check : "審核成功",
			uncheck : "反審核成功",
			review : "複核成功",
			unreview : "反複核成功"
		},
		failureText: {
			del : "删除失败",
			check : "審核失败",
			uncheck : "反審核失败",
			review : "複核失败",
			unreview : "反複核失败"
		}
	});
};