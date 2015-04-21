/**
 * @version V1.0
 */
package com.pcts.common.util.encrypt;

import java.io.ByteArrayOutputStream;

import org.logi.crypto.Crypto;
import org.logi.crypto.io.EncryptStream;
import org.logi.crypto.keys.DESKey;
import org.logi.crypto.modes.EncryptCFB;
import org.logi.crypto.modes.EncryptSession;

/**
 * @author zhangtao, 2014年10月24日 下午12:49:26
 *	<p>
 *  <b>Description<b><p>
 *	
 *	对字符串进行加密。3DES加密CFB
 */
public class DESEncrypt extends AbsEncrypto {
	static {
        Crypto.initRandom();
    }
	
	private static void setPublicKey()throws Exception{
	    if(publicKey == null)
	        setPublicKey(keyFile);
	}
	
	public static void setPublicKey(final String cds) throws Exception{
		publicKey = (DESKey)Crypto.fromString(cds);
	}
	
	@SuppressWarnings("resource")
	public static byte[] encrypt(byte[] source) throws Exception{
		setPublicKey();
		EncryptSession encryptSession = new EncryptCFB(publicKey);
		ByteArrayOutputStream sout = new ByteArrayOutputStream();
		try{
			EncryptStream dout = new EncryptStream(sout, null, encryptSession);
	        dout.write(source, 0, source.length);
	        dout.flush();
		}catch(Exception e){
			throw new Exception("加密错误"+e.getMessage());
		}
		return sout.toByteArray();
	}
	
	
	/**
	 * 执行加密
	 * @param source 加密前的字符串
	 * @return String 加密后的 16进制字符串
	 */
	public static String encrypt(String source) throws Exception{
		String hexString = "";
		try {
			byte src[] = source.getBytes();
			byte dst[] = encrypt(src);
			
			for(int i = 0; i < dst.length; i++){
				String ubyte = Integer.toHexString(dst[i]);
	            if(ubyte.length() == 1)
	                hexString = hexString + "0" + ubyte;
	            else
	                hexString = hexString + ubyte.substring(ubyte.length() - 2);
			}
		} catch (Exception e) {
			 throw new Exception("加密错误" + e.getMessage());
		}
		return hexString;
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		String pass = "zhAng@t_^o665";
		System.out.println("--------"+DESEncrypt.encrypt(pass));
		System.out.println("--------"+DESDecrypt.decrypt(DESEncrypt.encrypt(pass)));
	}
}