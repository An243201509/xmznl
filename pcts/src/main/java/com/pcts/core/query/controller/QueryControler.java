package com.pcts.core.query.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;



@Controller
public class QueryControler {

	
	@RequestMapping(value="/query",method = RequestMethod.GET)
	public String doQuery(Map<String, Object> model){
		
		model.put("www", "画蛇添足");
		
		return "query/query";
	}
	
	@RequestMapping(value="/config.vm",method = RequestMethod.GET,produces="text/html;charset=UTF-8")
	public String doConfig(Map<String, Object> model){
		
		
		
		return "query/config";
	}
	
}
