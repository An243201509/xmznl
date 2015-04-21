package com.pcts.common.util.encrypt;

import java.io.ByteArrayInputStream;

import org.logi.crypto.Crypto;
import org.logi.crypto.io.DecryptStream;
import org.logi.crypto.keys.DESKey;
import org.logi.crypto.modes.DecryptCFB;
import org.logi.crypto.modes.DecryptSession;

/**
 * 
 * @author zhangtao, 2014年10月24日 下午1:23:26
 *	<p>
 *  <b>Description<b><p>
 *
 *	字符串解密。3DES-CFB
 */
public class DESDecrypt extends AbsEncrypto {
	
	static{
		Crypto.initRandom();
	}
	
	private static void setPrivateKey() throws Exception {
		if (privateKey == null)
			setPrivateKey(keyFile);
	}

	public static void setPrivateKey(String cds) throws Exception {
		privateKey = (DESKey) Crypto.fromString(cds);
	}
	
	@SuppressWarnings("resource")
	public static byte[] decrypt(byte[] source) throws Exception{
		setPrivateKey();
		DecryptSession decryptSession = new DecryptCFB(privateKey);
		ByteArrayInputStream sin = new ByteArrayInputStream(source);
		byte dec[];
		try {
			DecryptStream din = new DecryptStream(sin, null, decryptSession);
			din.drain();
			dec = new byte[din.available()];
			din.read(dec, 0, dec.length);
		} catch (Exception ex) {
			throw new Exception("解码失败" + ex.getMessage());
		}
		return dec;
	}
	/**
	 * 解密
	 * @param source
	 * @return
	 * @throws Exception
	 */
	public static String decrypt(String hexSource) throws Exception{
		try{
			byte newbyte[] = new byte[hexSource.length() / 2];
			int j = 0;
			for (int i = 0; i < hexSource.length(); i += 2)
				newbyte[j++] = Integer.decode("0X" + hexSource.substring(i, i + 2)).byteValue();

			return new String(decrypt(newbyte));
		}catch (Exception e) {
			throw new Exception("解密失败"+e.getMessage());
		}
	}
}
