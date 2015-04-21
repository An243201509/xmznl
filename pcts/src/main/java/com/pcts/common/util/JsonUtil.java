package com.pcts.common.util;

//import com.alibaba.fastjson.serializer.JSONSerializer;
//import com.alibaba.fastjson.serializer.SerializeWriter;

/**
 * 
 * @author zhangtao, 2014年10月27日 下午2:25:40
 *	<p>
 *  <b>Description<b><p>
 *
 *	Json数据转换
 */
public class JsonUtil {
	
	/**
	 * 	输出json格式 过滤不需要的字段 此方法仅适用于com.alibaba.fastjson类
	 * 
	 * @param obj
	 * @param field
	 * @return
	 */
	public static String JsonFilter(Object obj, final String... field) {
//		SerializeWriter out = new SerializeWriter();
//		JSONSerializer serializer = new JSONSerializer(out);
//		com.alibaba.fastjson.serializer.PropertyFilter filter = new com.alibaba.fastjson.serializer.PropertyFilter() {
//			public boolean apply(Object source, String name, Object value) {
//				if ("HibernateLazyInitializer".equalsIgnoreCase(name) || "Handler".equalsIgnoreCase(name)) {
//					return false;
//				}
//				for (String str : field) {
//					if (str.equalsIgnoreCase(name)) {
//						return false;
//					}
//				}
//				return true;
//			}
//		};
//		serializer.getPropertyFilters().add(filter);
//		try {
//			serializer.write(obj);
//		} catch (Exception e) {
//			System.out.println("警告" + e.getMessage());
//		}
		return null;//out.toString();
	}
//
//	public static JSONSerializer JsonFilter(JSONSerializer serializer, Object obj, final String... field) {
//		com.alibaba.fastjson.serializer.PropertyFilter filter = new com.alibaba.fastjson.serializer.PropertyFilter() {
//			public boolean apply(Object source, String name, Object value) {
//				if ("HibernateLazyInitializer".equalsIgnoreCase(name) || "Handler".equalsIgnoreCase(name)) {
//					return false;
//				}
//				for (String str : field) {
//					if (str.equalsIgnoreCase(name)) {
//						return false;
//					}
//				}
//				return true;
//			}
//		};
//		serializer.getPropertyFilters().add(filter);
//		return serializer;
//
//	}
//
//	public static String jsonMultiFilter(Object obj, final String[] propFilters, final String[] nameFilters, final String[] valueFilters) {
//		SerializeWriter out = new SerializeWriter();
//		JSONSerializer serializer = new JSONSerializer(out);
//		com.alibaba.fastjson.serializer.PropertyFilter filter = new com.alibaba.fastjson.serializer.PropertyFilter() {
//			public boolean apply(Object source, String name, Object value) {
//				if ("HibernateLazyInitializer".equalsIgnoreCase(name) || "Handler".equalsIgnoreCase(name)) {
//					return false;
//				}
//				for (String str : propFilters) {
//					if (str.equalsIgnoreCase(name)) {
//						return false;
//					}
//				}
//				return true;
//			}
//		};
//		serializer.getPropertyFilters().add(filter);
//		NameFilter filter1 = new NameFilter() {
//			public String process(Object source, String name, Object value) {
//				for (String str : nameFilters) {
//					if (name.equals(str.split(":")[0])) {
//						return str.split(":")[1];
//					}
//				}
//				return name;
//			}
//		};
//		serializer.getNameFilters().add(filter1);
//		ValueFilter filter2 = new ValueFilter() {
//			public Object process(Object source, String name, Object value) {
//				for (String str : valueFilters) {
//					if ((value + "").equals(str.split(":")[0])) {
//						return str.split(":")[1];
//					}
//				}
//				return value;
//			}
//		};
//		serializer.getValueFilters().add(filter2);
//		serializer.write(obj);
//		return out.toString();
//	}
//
//	/**
//	 * 
//	 * 输出json格式,仅输入Class类，所有引用entity过滤掉
//	 * 
//	 * @param obj
//	 * @param clazz
//	 * @return
//	 */
//	public static String JsonWithoutRef(Object obj, final Class clazz) {
//		com.alibaba.fastjson.serializer.PropertyFilter filter = new com.alibaba.fastjson.serializer.PropertyFilter() {
//			public boolean apply(Object source, String name, Object value) {
//				if ("HibernateLazyInitializer".equalsIgnoreCase(name) || "Handler".equalsIgnoreCase(name)) {
//					return false;
//				}
//				if (source.getClass().getSimpleName().contains("_$$_javassist")) {
//					return false;
//				}
//				if (value instanceof Collection && !source.getClass().getSimpleName().equals("Page")) {
//					return false;
//				}
//				return true;
//			}
//		};
//		SerializeWriter out = new SerializeWriter();
//		JSONSerializer serializer = new JSONSerializer(out);
//		serializer.getPropertyFilters().add(filter);
//		serializer.write(obj);
//		return out.toString();
//
//	}
//
//	/**
//	 * 
//	 * 输出json格式,输出Class类和引用entity的id字段，其他都过滤掉
//	 * 
//	 * @param obj
//	 * @param clazz
//	 * @return
//	 */
//	public static String JsonWithIdRef(Object obj, final Class clazz) {
//		com.alibaba.fastjson.serializer.PropertyFilter filter = new com.alibaba.fastjson.serializer.PropertyFilter() {
//			public boolean apply(Object source, String name, Object value) {
//				if ("HibernateLazyInitializer".equalsIgnoreCase(name) || "Handler".equalsIgnoreCase(name)) {
//					return false;
//				}
//				if (source instanceof IdEntity && source.getClass() != clazz && !name.equals("id")) {
//					return false;
//				}
//				return true;
//			}
//		};
//		SerializeWriter out = new SerializeWriter();
//		JSONSerializer serializer = new JSONSerializer(out);
//		serializer.getPropertyFilters().add(filter);
//		serializer.write(obj);
//		return out.toString();
//
//	}
//
//	public static String JsonWithField(Object obj, final Map<Class, String[]> fields) {
//		com.alibaba.fastjson.serializer.PropertyFilter filter = new com.alibaba.fastjson.serializer.PropertyFilter() {
//			public boolean apply(Object source, String name, Object value) {
//				if ("HibernateLazyInitializer".equalsIgnoreCase(name) || "Handler".equalsIgnoreCase(name)) {
//					return false;
//				}
//				Set<Class> set = fields.keySet();
//				for (Class clazz : set) {
//					// System.out.println(clazz+">"+source.getClass()+":"+name+"->"+Arrays.asList(fields.get(clazz)).contains(name));
//					if (source instanceof IdEntity && source.getClass() == clazz && !Arrays.asList(fields.get(clazz)).contains(name)) {
//						return false;
//					}
//				}
//				return true;
//			}
//		};
//		SerializeWriter out = new SerializeWriter();
//		JSONSerializer serializer = new JSONSerializer(out);
//		serializer.getPropertyFilters().add(filter);
//		serializer.write(obj);
//		return out.toString();
//
//	}
//
//	/**
//	 * 
//	 * 输出json格式,输出Class类和引用entity的field字段，其他都过滤掉
//	 * 
//	 * @param obj
//	 * @param clazz
//	 * @return
//	 */
//	public static String JsonWithFieldRef(Object obj, final Class clazz, final String clazzs, final String field) {
//		com.alibaba.fastjson.serializer.PropertyFilter filter = new com.alibaba.fastjson.serializer.PropertyFilter() {
//			public boolean apply(Object source, String name, Object value) {
//				if ("HibernateLazyInitializer".equalsIgnoreCase(name) || "Handler".equalsIgnoreCase(name)) {
//					return false;
//				}
//				if (source instanceof IdEntity && source.getClass() != clazz) {
//					if (!("," + field + ",").contains("," + name + ",") && !("," + clazzs.toLowerCase() + ",").contains("," + ((source.getClass().getSimpleName().split("\\$")[0]).replace("_", "")).toLowerCase() + ",")) {
//						return false;
//					}
//				}
//				return true;
//			}
//		};
//		SerializeWriter out = new SerializeWriter();
//		JSONSerializer serializer = new JSONSerializer(out);
//		serializer.getPropertyFilters().add(filter);
//		serializer.write(obj);
//		return out.toString();
//
//	}
//
//	public static JSONSerializer valueFilter(JSONSerializer serializer, Object obj, final String field, final String fieldVaule) {
//		ValueFilter filter = new ValueFilter() {
//			public Object process(Object source, String name, Object value) {
//				// System.out.println(field + ":" + name + "<>" + fieldVaule +
//				// ":" + value);
//				if (name.equals(field) && fieldVaule.equals(value.toString())) {
//					return null;
//				}
//				return value;
//			}
//		};
//		serializer.getValueFilters().add(filter);
//		return serializer;
//	}
//
//	public static JSONSerializer nameFilter(JSONSerializer serializer, Object obj, final String oldName, final String newName) {
//		NameFilter filter = new NameFilter() {
//			public String process(Object source, String name, Object value) {
//				if (name.equals(oldName)) {
//					return newName;
//				}
//				return name;
//			}
//		};
//		serializer.getNameFilters().add(filter);
//		return serializer;
//	}
//
//	public static Object jsonStr2Obj(String json, Class cls) {
//		List list = String2List(json, cls);
//		if (list.size() > 0) {
//			if (list.get(0) instanceof List) {
//				return ((List) list.get(0)).get(0);
//			} else {
//				return list.get(0);
//			}
//		} else {
//			return null;
//		}
//	}
//
//	@SuppressWarnings( { "unchecked", "deprecation" })
//	public static List String2List(String json, Class cls) {
//		return JSONArray.toList(JSONArray.fromObject(json), cls);
//	}
//
//	@SuppressWarnings("unchecked")
//	public static List ids2List(List list, Class cls) throws Exception {
//		List newList = new ArrayList();
//		if (JSONArray.toArray(JSONArray.fromObject(list)).getClass() == Object[].class) {
//			// System.out.println("list.get(0).getClass:-->"+
//			// list.get(0).getClass());
//			Object obj = cls.newInstance();
//			cls.getMethod("setId", new Class[] { Long.class }).invoke(obj, new Object[] { Long.parseLong(((String) list.get(0)).replace("\"", "")) });
//			newList.add(obj);
//		} else {// 锟斤拷锟斤拷锟斤拷 页锟芥返锟截革拷式为 [{},{} ...]
//			// System.out.println(list.get(0));
//			Object[] objs = (Object[]) ((Object[]) JSONArray.toArray(JSONArray.fromObject(list)))[0];
//			for (int i = 0; i < objs.length; i++) {
//				Object obj = cls.newInstance();
//				cls.getMethod("setId", new Class[] { Long.class }).invoke(obj, new Object[] { objs[i] });
//				newList.add(obj);
//			}
//
//		}
//		return newList;
//	}

}
