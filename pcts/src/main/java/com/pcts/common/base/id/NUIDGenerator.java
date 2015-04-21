/**
 * @version V1.0
 */
package com.pcts.common.base.id;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author zhangtao 2014年10月22日
 *	<p>
 *  <b>Description<b><p>
 *	NUIDGenerator
 */
public class NUIDGenerator extends AbsIDGenerator implements IDGenerator {
	
	private static AtomicInteger atomicCnt = new AtomicInteger();

	public NUIDGenerator(){
		
	}
	
	public NUIDGenerator(int casheSize){
		super(casheSize);
	}
	@Override
	protected String generate(int order) {
		long useTime = System.currentTimeMillis();
		int i = atomicCnt.incrementAndGet();
		if (i > 2147483647){
			 atomicCnt.set(order);
		}
		return String.format("%013d", new Object[] { Long.valueOf(useTime) }) + String.format("%07d", new Object[] { Integer.valueOf(i) });
	}
}
