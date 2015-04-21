/**
 * @version V1.0
 */
package com.pcts.common.tag.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Hashtable;
import java.util.Properties;

/**
 * @author zhangtao, 2014年10月30日 下午11:19:21
 *         <p>
 *         <b>Description<b>
 *         <p>
 * 
 */
public class ConfigManager {
	private Properties props;
	private static ConfigManager instance;

	private ConfigManager() {
		init();
	}

	private void init() {
		this.props = new Properties();
		InputStream ins = getClass().getResourceAsStream("/config/config.properties");
		try {
			this.props.load(ins);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ins != null)
				try {
					ins.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
		}
	}

	public static ConfigManager getInstance() {
		if (instance == null) {
			instance = new ConfigManager();
		}
		return instance;
	}

	public String getValue(String key, String defaultValue) {
		return this.props.getProperty(key, defaultValue);
	}

	public String getValue(String key) {
		return this.props.getProperty(key);
	}

	public Hashtable<Object, Object> getValues() {
		return this.props;
	}
}
