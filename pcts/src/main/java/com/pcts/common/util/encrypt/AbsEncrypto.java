package com.pcts.common.util.encrypt;

import org.logi.crypto.keys.DESKey;

/**
 * 
 * @author zhangtao, 2014年10月24日 下午1:51:31
 *	<p>
 *  <b>Description<b><p>
 *  
 *	constants & common methods for DESEncrypto & DESDecrypto.
 */
public abstract class AbsEncrypto {
	protected static DESKey privateKey;
	protected static DESKey publicKey;
	protected static String keyFile = "DESKey(491cf0630d287dbfcd2d74b29f2fc6b2)";

}
