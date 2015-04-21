 Ext.apply(Ext.grid.RowEditor.prototype, {
	 
	saveText: 'Save',
	 
    cancelText: 'Cancel',
    
    commitChangesText: 'You need to commit or cancel your changes',
    
    errorText: ''
    	
 });

 if(Ext.tree.LockingView) {
 	
 	 Ext.apply(Ext.tree.LockingView.prototype, {
 		 
 		 lockText : 'Lock',

 		 unlockText : 'Unlock'
 		    
 	 });
 	 
 }
 
 if(Ext.grid.LockingGridView) {
	 	
 	 Ext.apply(Ext.grid.LockingGridView.prototype, {
 		 
 		 lockText : 'Lock',

 		 unlockText : 'Unlock'
 		    
 	 });
 	 
 }
 
 if(Ext.grid.OperationColumn) {
	 Ext.apply(Ext.grid.OperationColumn.prototype, {
		confirmTitle: "confirm",
		confirmText: "Message",
		headerText: "Operate",
		waitText: "Wait Message",
		waitMsg: "Please Waiting For Process...",
		altText: {
			view : "View",
			edit : "Edit",
			del : "Delete",
			check : "Check",
			uncheck : "Anti Check",
			review : "Review",
			unreview : "Anti Review",
			copy : "Copy",
			history : "History"
		},
		successText: {
			del : "Success Delete",
			check : "Success Check",
			uncheck : "Success Anti Check",
			review : "Success Review",
			unreview : "Review Anti Review"
		},
		failureText: {
			del : "Failure Delete",
			check : "Failure Check",
			uncheck : "Failure Anti Check",
			review : "Failure Review",
			unreview : "Failure Anti Review"
		}
	});
};