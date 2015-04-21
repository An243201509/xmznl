/**
 * @version V1.0
 */
package com.pcts.common.base.id;

import java.util.concurrent.ArrayBlockingQueue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author zhangtao 2014年10月22日
 *	<p>
 *  <b>Description<b><p>
 *  
 *	AbsIDGenerator
 */
public abstract class AbsIDGenerator implements IDGenerator {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	protected static final int CURSOR_START = -1;
	private static final int MAX_MUTEX_COUNT = 5;
	protected ArrayBlockingQueue<String> cache = null;
	protected int casheSize = 1000;
	protected abstract String generate(int paramInt);
	
	public AbsIDGenerator(){
		this.cache = new ArrayBlockingQueue(this.casheSize);
		batchCache();
	}
	
	public AbsIDGenerator(int size){
		this.casheSize = size;
		if (size > 0) {
			this.cache = new ArrayBlockingQueue(size);
			batchCache();
		}
	}
	
	protected synchronized void batchCache(){
		this.cache.clear();
		for (int i = 0; i < this.casheSize; i++){
			String id = generate(i);
			if (!this.cache.offer(id))
				break;
		}
	}

	public String nextId(){
		if (this.casheSize == 0) {
			return generate(0);
		}
		while (true){
			String id = (String)this.cache.poll();
			if (id != null) {
				return id;
			}
			batchCache();
		}
	}
}
