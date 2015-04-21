var OPEN_SSO_SOLUTION = true;
if (OPEN_SSO_SOLUTION) {
var SSO_SOLUTION_PROVIDER = new Ext.state.CookieProvider({
	    path: "/cgi-bin/",
	    expires: 0,
	    domain: "id-name"
	});
}

Ext.mapper.MappingProxy = Ext.extend(Ext.data.DataProxy,{
	
	map: undefined,
	
	fields: [],
	
	view: undefined,
	
	defaultId: 'id',
	
	defaultName: 'name',
	
	method: 'POST',
	
	constructor: function(config){
		this.map = new Ext.util.MixedCollection();
		this.fields = [];
		this.addEvents('completed');
		Ext.mapper.MappingProxy.superclass.constructor.call(this,config);
		Ext.apply(this, config);
		this.mappingFields();
	},
	mappingFields: function(){
		if (this.mapping) {
			if (typeof this.mapping == 'string') {
				this.mapping = Ext.decode(this.mapping);
			}
			var from, to;
			Ext.each(this.mapping,  function(json){
				from = json['from'];
				if (Ext.isArray(from)) {
					Ext.each(from, function(f){
						if (typeof f == 'string')
							this.fields.push({name: f, mapping: f});
						else 
							this.fields.push({name: f.name, mapping: f.name});
					}, this);
				} else if (typeof from == 'string') {
					this.fields.push({name: from, mapping: from});
				} else if (Ext.isObject(from)) {
					this.fields.push({name: from.name, mapping: from.name});
				}
				this.map.add(from, json);
			}, this);
		}
	},
	bindMapper: function(mapper){
		if (this.mapper != mapper) {
			this.mapper = mapper;
			this.bindStore(mapper.getStore());
		}
	},
	bindStore: function(store){
		if (this.store != store) {
			this.store = store;
			var meta = this.store.reader.meta;
			if (meta) {
				this.store.reader.onMetaChange(Ext.apply(meta, {
					fields: this.fields.concat(meta.fields)
				}));
			} else {
				this.store.reader.onMetaChange({
					fields: this.fields.concat(this.store.fields)
				});
			}
			this.store.on('load', this.doLoad, this);
		}
	},
	getValue: function(record, key, selector) {
		if (record == undefined || record == null) return null;
		var value = record[key];
		if (Ext.isArray(value) && selector) {
			var buf = [];
			Ext.each(value, function(r){
				buf.push(r[selector]);
			});
			return buf;
		}
		return value;
	},
	getParams: function(rs, childrenParam){
		var params = {}, attributes = {}, ids = {}, keySet, map, record, to, value, key, jkey;
		this.map.eachKey(function(from, mapping){
			// from record parameter
			keySet = [], map = {};
			var fn = function(r){
				if (r instanceof Ext.data.Record) {
					record = r.data;
				} else {
					record = r;
				}
				if (Ext.isArray(from)) from = from[0];
				// 复合型 from 申明，如： from:{name:'users',selector:'id',...}
				if (Ext.isObject(from)) {
					key = from.alias ? from.alias : from.name;
				} else {
				// 简单型 from 申明，如： from:'user'
					key = from;
				}
				value = this.getValue(record, key, from.selector);
				if (Ext.isArray(value)) {
					Ext.each(value, function(v){
						if (!Ext.isEmpty(v, true) && typeof map[v] == 'undefined') map[v] = v, keySet.push(v);
					});
				} else {
					if (!Ext.isEmpty(value, true) && typeof map[value] == 'undefined') map[value] = value, keySet.push(value);
				}
				if (Ext.isArray(record[childrenParam])) Ext.each(record[childrenParam], fn, this);
			};
			Ext.each(rs, fn, this);
			// attributes
			attrs = [], to = mapping.to;
			// effect that set alias attribute 
				// such as: to: {name:'department', alias:'deptCode'} =====> attributes=['deptCode']
			if (Ext.isArray(to)) {
				Ext.each(to, function(t){
					if (Ext.isObject(t) && t.alias) attrs.push(t.alias);
				}, this);
			} else if (Ext.isObject(to) && to.alias) {
				attrs.push(to.alias);
			}
			// mixed
			if (mapping.type) {
				if (ids[mapping.type]) {
					ids[mapping.type] = [].concat(ids[mapping.type], keySet);
				} else {
					ids[mapping.type] = keySet;
				}
				if (attrs.length > 0) {
					// add
					if (Ext.isArray(attributes[mapping.type])) {
						attributes[mapping.type] = attributes[mapping.type].concat(attrs);
					} else {
						attributes[mapping.type] = [attributes[mapping.type]].concat(attrs);
					}
					var hash = {};
					for (var i = 0; i < attributes[mapping.type].length; i++) {
						if (hash[attributes[mapping.type][i]]) {
							attributes[mapping.type].splice(i , 1);
						} else {
							hash[attributes[mapping.type][i]] = true;
						}
					}
					hash = null;
					delete hash;
					// fix attributes[mapping.type] = (attrs.length == 1 ? attrs[0] : attrs);
				}
			} else {
				ids = keySet;
				if (attrs.length > 0) attributes = (attrs.length == 1 ? attrs[0] : attrs);
			}
		}, this);
		params['ids'] = Ext.encode(ids);
		if (attributes) params['attributes'] = Ext.encode(attributes);
		return params;
	},
	doRequest : function(store, rs, options) {
		if (OPEN_SSO_SOLUTION) {
			var path = document.location.pathname;
			var hostpath;
			if (path.indexOf('/') == 0) {
				path = path.substring(1, path.length);
				path = path.substring(0, path.indexOf('/'));
				hostpath = document.location.protocol +'//'+ document.location.host +'/'+ path;
			} else {
				path = path.substring(0, path.indexOf('/'));
				hostpath = document.location.protocol +'//'+ document.location.host + path;
			}
			if (hostpath.substring(hostpath.length - 1, hostpath.length) !== '/') hostpath += '/';
			// 相同的context-path访问
			this.url = sofa.api.getAbsoluteURL(this.url);
			// 不同的context-path访问，需要第一次Get访问SSO
			if (this.url.indexOf(hostpath) == -1) {
				var url = this.url.replace(/^(http|https):\/\//i, '');
				var domain = url.substring(0, url.indexOf('/'));
				url =  this.url.substring(this.url.indexOf(domain) + domain.length + 1, this.url.length);
				var contextPath = url.substring(0, url.indexOf('/'));
				if (SSO_SOLUTION_PROVIDER.get(hostpath) !== 1) {
				    Ext.Ajax.request({
			    		url: ('http://'+ domain +'/'+ contextPath + '/'),
			    		method: 'GET',
			    		async: false,
			    		callback: function(){
			    			//SSO_SOLUTION_PROVIDER.set(contextPath, 1);
			    		}
				    });
				}
			}
		}
	    this._doRequest(store, rs, options);
    },
    _doRequest : function(store, rs, options) {
    	Ext.Ajax.request({
        	disableCaching: true,
    		url: this.url,
            method: (this.method ? this.method : undefined),
            params : this.getParams(rs, store.childrenParam),
            argument: options,
    		callback: function(options, success, response){
    			var result, from, to, match, r, value, field;
    			if (success == false) {
    	    		this.fireEvent('loadexception', this, options, response);
    	            this.fireEvent('exception', this, 'response', options, response);
        	        this.fireEvent('completed', this, rs, options.argument);
    	            return;
    	    	} else {
    	    		result = Ext.decode(response.responseText);
    	    	}
    			this._doMapping(rs, result, store.childrenParam);
    	        this.fireEvent('completed', this, rs, options.argument);
    		},
            scope: this
        });
    },
    
	_doMapping: function(rs, result, childrenParam){
		var value, r, from, to;
		// loop (row)
		for (var i = 0; i < rs.length; i++) {
			if (rs[i] instanceof Ext.data.Record) {
				r = rs[i].data;
			} else { 
				r = rs[i];
			}
			// mapping loop (column)
			this.map.eachKey(function(key, mapping){
				from = mapping.from; to = mapping.to;
				if (Ext.isArray(from)) from = from[0];
				// 复合型 from 申明， 如： from:{name: '', alias: ''}
				if (Ext.isObject(from)) {
					value = this.getValue(r, from.name, from.selector);
				} else {
				// 简单型 from 申明，如：from: ''
					value = this.getValue(r, from, from.selector);
				}
				if (Ext.isArray(value)) {
				// 如果列值数据是一个数组类型
					var buf = [];
					Ext.each((mapping.type ? result[mapping.type] : result), function(data){
						// if request results data matches record field value
						Ext.each(value, function(val){
							if (val == data[this.defaultId]) buf.push(data);
						}, this);
					}, this);
					this.fillColumn(r, to, buf);
				} else {
				// 不是数组数据，判断每行列值与返回值是否匹配，若匹配则映射值    loop (result)
					Ext.each((mapping.type ? result[mapping.type] : result), function(data){
						// if request results data matches record field value
						if (value == data[this.defaultId]) {
							this.fillColumn(r, to, data);
							return false;
						}
					}, this);
				}
			}, this);
			if (childrenParam && r[childrenParam]) {
				rs = rs.concat(r[childrenParam]);
			}
		}
	},
	fillColumn: function(r, to, value){
		// set the new value to the record field
		var key, tkey;
		var fn = function(r, t, value){
			if (Ext.isObject(t)) {
				key = t.name; tkey = t.alias ? t.alias : this.defaultName;
			} else {
				key = t; tkey = this.defaultName;
			}
			if (Ext.isArray(value)) {
				var buf = [];
				Ext.each(value, function(v){
					buf.push(v[tkey]);
				});
				this.fill(r, key, buf);
			} else {
				this.fill(r, key, value[tkey]);
			}
		};
		if (Ext.isArray(to)) {
			Ext.each(to, function(t){
				fn.call(this, r, t, value);
			}, this);
			return;
		} else {
			fn.call(this, r, to, value);
		}
	},
    fill: function(r, name, value) {
    	var encode = Ext.isPrimitive(value) ? String : Ext.encode;
        if(encode(r[name]) == encode(value)) {
            return;
        }
        r[name] = value;
        //r._noIntercept = true;
    },
    
	doLoad: function(store, rs, options){
		if (this.mapper.grid && this.mapper.grid.lock) {
			this.mapper.grid.lock();
		}
		this.doRequest(store, rs, options);
	},
	
	doMapping: function(data, fn, scope){
		
		if (!Ext.isArray(data)) {
			var rs = [].concat(data);
		} else {
			var rs = data;
		}
		
		Ext.Ajax.request({
			
        	disableCaching: true,
        	
    		url: this.url,
    		
            method: (this.method ? this.method : undefined),
            
            params : this.getParams(rs),
            
    		success: function(xhr){
    			
    			var result;
    			
    	    	result = Ext.decode(xhr.responseText);
    	    	
    			this._doMapping(rs, result);
    			
    			if (fn) {
    				if (!Ext.isArray(data)) {
    					rs = rs[0];
    				}
    				fn.call(scope || this, rs);
    			}
    			
    	        this.fireEvent('completed', this);
    	        
    		},
    		
    		failure: function(xhr){
    			new Ext.Error(xhr);
    		},
    		
            scope: this
            
        });
	}
});

Ext.mapper.MappingProxy.Error = Ext.extend(Ext.Error, {
    name: 'Ext.mapper.MappingProxy',
	constructor : function(message, id) {
        this.name += "(id:"+ id +")";
        Ext.Error.call(this, message);
    }
});

Ext.apply(Ext.mapper.MappingProxy.Error.prototype, {
    lang: {
    	'mapping' : 'lack mapping relation about "->"',
        'loadexception' : 'load data exception'
    }
});