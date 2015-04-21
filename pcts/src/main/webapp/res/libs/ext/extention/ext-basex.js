Ext.lib.Ajax = function(){
	var activeX = [ 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP' ], CONTENTTYPE = 'Content-Type';
	function getPortalWindow(){
		var win = window,count=0;
		if(win.id=='SOFAPORTAL'){return win;}
		while(win.parent!=null){
			win=win.parent;
			count+=1;
			if(win.id=='SOFAPORTAL'){break;}
			if(count>=20){break;}
		}
		return win;
	}
	// private
	function setHeader( o ){
		var conn = o.conn, prop, headers = {};

		function setTheHeaders( conn, headers ){
			for( prop in headers ){
				if( headers.hasOwnProperty( prop ) ){
					conn.setRequestHeader( prop, headers[ prop ] );
				}
			}
		}

		Ext.apply( headers, pub.headers, pub.defaultHeaders );
		setTheHeaders( conn, headers );
		delete pub.headers;
	}
	// private
	function createExceptionObject( tId, callbackArg, isAbort, isTimeout ){
		return {
			tId : tId,
			status : isAbort ? -1 : 0,
			statusText : isAbort ? 'transaction aborted' : 'communication failure',
			isAbort : isAbort,
			isTimeout : isTimeout,
			argument : callbackArg
		};
	}
	// private
	function initHeader( label, value ){
		( pub.headers = pub.headers || {} )[ label ] = value;
	}
	// private
	function createResponseObject( o, callbackArg ){
		var headerObj = {}, headerStr, conn = o.conn, t, s,
		// see: https://prototype.lighthouseapp.com/projects/8886/tickets/129-ie-mangles-http-response-status-code-204-to-1223
		isBrokenStatus = conn.status == 1223;
		try{
			headerStr = o.conn.getAllResponseHeaders();
			Ext.each( headerStr.replace( /\r\n/g, '\n' ).split( '\n' ), function( v ){
				      t = v.indexOf( ':' );
				      if( t >= 0 ){
					      s = v.substr( 0, t ).toLowerCase();
					      if( v.charAt( t + 1 ) == ' ' ){
						      ++t;
					      }
					      headerObj[ s ] = v.substr( t + 1 );
				      }
			      } );
		}
		catch( e ){}
		return {
			tId : o.tId,
			// Normalize the status and statusText when IE returns 1223, see the above link.
			status : isBrokenStatus ? 204 : conn.status,
			statusText : isBrokenStatus ? 'No Content' : conn.statusText,
			getResponseHeader : function( header ){
				return headerObj[ header.toLowerCase() ];
			},
			getAllResponseHeaders : function(){
				return headerStr;
			},
			responseText : conn.responseText,
			responseXML : conn.responseXML,
			argument : callbackArg
		};
	}
	// private
	function releaseObject( o ){
		if( o.tId ){
			pub.conn[ o.tId ] = null;
		}
		o.conn = null;
		o = null;
	}
	// private
	function handleTransactionResponse( o, callback, isAbort, isTimeout ){
		if( !callback ){
			releaseObject( o );
			return;
		}
		var httpStatus, responseObject;
		try{
			if( o.conn.status !== undefined && o.conn.status != 0 ){
				httpStatus = o.conn.status;
			}
			else{
				httpStatus = 13030;
			}
		}
		catch( e ){
			httpStatus = 13030;
		}
		if( ( httpStatus >= 200 && httpStatus < 300 ) || ( Ext.isIE && httpStatus == 1223 ) ){
			responseObject = createResponseObject( o, callback.argument );
			if( callback.success ){
				if( !callback.scope ){
					callback.success( responseObject );
				}
				else{
					callback.success.apply( callback.scope, [ responseObject ] );
				}
			}
		}
		else{
			if( httpStatus == 506 ){
				var win = getPortalWindow();
				if(win.login){
					win.login();
				}
				return;
			}
			switch( httpStatus ){
				case 12002 :
				case 12029 :
				case 12030 :
				case 12031 :
				case 12152 :
				case 13030 :
					responseObject = createExceptionObject( o.tId, callback.argument, ( isAbort ? isAbort : false ), isTimeout );
					if( callback.failure ){
						if( !callback.scope ){
							callback.failure( responseObject );
						}
						else{
							callback.failure.apply( callback.scope, [ responseObject ] );
						}
					}
					break;
				default :
					responseObject = createResponseObject( o, callback.argument );
					if( callback.failure ){
						if( !callback.scope ){
							callback.failure( responseObject );
						}
						else{
							callback.failure.apply( callback.scope, [ responseObject ] );
						}
					}
			}
		}
		releaseObject( o );
		responseObject = null;
	}
	function checkResponse( o, callback, conn, tId, poll, cbTimeout ){
		if( conn && conn.readyState == 4 ){
			clearInterval( poll[ tId ] );
			poll[ tId ] = null;
			if( cbTimeout ){
				clearTimeout( pub.timeout[ tId ] );
				pub.timeout[ tId ] = null;
			}
			handleTransactionResponse( o, callback );
		}
	}
	function checkTimeout( o, callback ){
		pub.abort( o, callback, true );
	}
	// private
	function handleReadyState( o, callback, async ){
		callback = callback || {};
		var conn = o.conn, tId = o.tId, poll = pub.poll, cbTimeout = callback.timeout || null;
		if( cbTimeout ){
			pub.conn[ tId ] = conn;
			pub.timeout[ tId ] = setTimeout( checkTimeout.createCallback( o, callback ), cbTimeout );
		}
		if( async ){
			poll[ tId ] = setInterval( checkResponse.createCallback( o, callback, conn, tId, poll, cbTimeout ), pub.pollInterval );
		}
		else{
			checkResponse( o, callback, conn, tId, poll, cbTimeout );
		}
	}
	// private
	function sendRequest( method, uri, callback, postData, async ){
		var o = getConnectionObject() || null;
		if( o ){
			o.conn.open( method, uri, async );
			if( pub.useDefaultXhrHeader ){
				initHeader( 'X-Requested-With', pub.defaultXhrHeader );
			}
			if( postData && pub.useDefaultHeader && ( !pub.headers || !pub.headers[ CONTENTTYPE ] ) ){
				initHeader( CONTENTTYPE, pub.defaultPostHeader );
			}
			if( pub.defaultHeaders || pub.headers ){
				setHeader( o );
			}
			if( async ){
				handleReadyState( o, callback, async );
				o.conn.send( postData || null );
			}
			else{
				o.conn.send( postData || null );
				handleReadyState( o, callback, async );
			}
		}
		return o;
	}
	// private
	function syncRequest( method, uri, callback, postData ){
		return sendRequest( method, uri, callback, postData, false );
	}
	// private
	function asyncRequest( method, uri, callback, postData ){
		return sendRequest( method, uri, callback, postData, true );
	}
	// private
	function getConnectionObject(){
		var o;
		try{
			if( o = createXhrObject( pub.transactionId ) ){
				pub.transactionId++;
			}
		}
		catch( e ){}
		finally{
			return o;
		}
	}
	// private
	function createXhrObject( transactionId ){
		var http;
		try{
			http = new XMLHttpRequest();
		}
		catch( e ){
			for( var i = 0; i < activeX.length; ++i ){
				try{
					http = new ActiveXObject( activeX[ i ] );
					break;
				}
				catch( e ){}
			}
		}
		finally{
			return {
				conn : http,
				tId : transactionId
			};
		}
	}
	var pub = {
		request : function( method, uri, cb, data, options ){
			if( options ){
				var me = this, xmlData = options.xmlData, jsonData = options.jsonData, hs;

				Ext.applyIf( me, options );

				if( xmlData || jsonData ){
					hs = me.headers;
					if( !hs || !hs[ CONTENTTYPE ] ){
						initHeader( CONTENTTYPE, xmlData ? 'text/xml' : 'application/json' );
					}
					data = xmlData || ( !Ext.isPrimitive( jsonData ) ? Ext.encode( jsonData ) : jsonData );
				}
			}
			if( options.async || options.async == undefined ){
				return asyncRequest( method || options.method || "POST", uri, cb, data );
			}
			else{
				return syncRequest( method || options.method || "POST", uri, cb, data );
			}
		},
		serializeForm : function( form ){
			var fElements = form.elements || ( document.forms[ form ] || Ext.getDom( form ) ).elements, hasSubmit = false, encoder = encodeURIComponent, name, data = '', type, hasValue;
			Ext.each( fElements, function( element ){
				      name = element.name;
				      type = element.type;
				      if( !element.disabled && name ){
					      if( /select-(one|multiple)/i.test( type ) ){
						      Ext.each( element.options, function( opt ){
							            if( opt.selected ){
								            hasValue = opt.hasAttribute ? opt.hasAttribute( 'value' ) : opt.getAttributeNode( 'value' ).specified;
								            data += String.format( "{0}={1}&", encoder( name ), encoder( hasValue ? opt.value : opt.text ) );
							            }
						            } );
					      }
					      else if( !( /file|undefined|reset|button/i.test( type ) ) ){
						      if( !( /radio|checkbox/i.test( type ) && !element.checked ) && !( type == 'submit' && hasSubmit ) ){
							      data += encoder( name ) + '=' + encoder( element.value ) + '&';
							      hasSubmit = /submit/i.test( type );
						      }
					      }
				      }
			      } );
			return data.substr( 0, data.length - 1 );
		},
		useDefaultHeader : true,
		defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
		useDefaultXhrHeader : true,
		defaultXhrHeader : 'XMLHttpRequest',
		poll : {},
		timeout : {},
		conn : {},
		pollInterval : 50,
		transactionId : 0,
		abort : function( o, callback, isTimeout ){
			var me = this, tId = o.tId, isAbort = false;
			if( me.isCallInProgress( o ) ){
				o.conn.abort();
				clearInterval( me.poll[ tId ] );
				me.poll[ tId ] = null;
				clearTimeout( pub.timeout[ tId ] );
				me.timeout[ tId ] = null;
				handleTransactionResponse( o, callback, ( isAbort = true ), isTimeout );
			}
			return isAbort;
		},
		isCallInProgress : function( o ){
			return o.conn && !{
				0 : true,
				4 : true
			}[ o.conn.readyState ];
		}
	};
	return pub;
}();