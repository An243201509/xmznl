package com.pcts.common.util;

import java.io.File;
import java.util.Date;
import java.util.Iterator;
import java.util.Vector;
import java.text.SimpleDateFormat;

public class FileView {
	File myDir;
	File[] contents;
	Vector vectorList;
	Iterator currentFileView;
	File currentFile;
	String path;

	public FileView() {
		path = new String("");
		vectorList = new Vector();
	}

	public FileView(String path) {
		this.path = path;
		vectorList = new Vector();
	}

	/**
	 * 设置浏览的路径
	 */
	public void setPath(String path) {
		this.path = path;
	}

	/***
	 * 返回当前目录路径
	 */
	public String getDirectory() {
		return myDir.getPath();
	}

	/**
	 * 刷新列表
	 */
	public void refreshList() {
		if (this.path.equals("")) {
			path = "c://";
		}
		myDir = new File(path);

		vectorList.clear();
		contents = myDir.listFiles();
		// 重新装入路径下文件
		for (int i = 0; i < contents.length; i++) {
			vectorList.add(contents[i]);
		}
		currentFileView = vectorList.iterator();
	}

	/**
	 * 移动当前文件集合的指针指到下一个条目
	 * 
	 * @return 成功返回true,否则false
	 */
	public boolean nextFile() {
		while (currentFileView.hasNext()) {
			currentFile = (File) currentFileView.next();
			return true;
		}
		return false;
	}

	/**
	 * 返回当前指向的文件对象的文件名称
	 */
	public String getFileName() {
		return currentFile.getName();
	}

	/**
	 * 返回当前指向的文件对象的文件尺寸
	 */
	public String getFileSize() {
		long fileLong = currentFile.length();
		if (fileLong < 1024) {
			return (Double.toString(fileLong) + "B");
		} else if (fileLong > 1024 && fileLong < 1024 * 1024) {
			return (Double.toString(fileLong / 1024.0) + "K");
		} else if (fileLong > 1024 * 1024) {
			return (Double.toString(fileLong / (1024 * (1024.0))) + "M");
		} else {
			return new Long(currentFile.length()).toString();
		}
	}

	/**
	 * 返回当前指向的文件对象的最后修改日期
	 */
	public String getFileTimeStamp() {
		String ret = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		ret = sdf.format(new Date(currentFile.lastModified()));
		return " " + ret;
	}

	/**
	 * 返回当前指向的文件对象是否是一个文件目录
	 */
	public boolean getFileType() {
		return currentFile.isDirectory();
	}

	/**
	 * 返回文件后缀名称
	 */
	public String getFileExtenName() {
		String ret = "";
		ret = currentFile.getName();
		if (ret.indexOf(".") <= 0) {
			return "";
		}
		ret = ret.substring(ret.indexOf(".") + 1, ret.length());
		return ret;
	}

	/**
	 * 修改程序。<br>
	 * 内部递归调用，进行子目录的更名
	 * 
	 * @param path
	 *            路径
	 * @param from
	 *            原始的后缀名，包括那个(.点)
	 * @param to
	 *            改名的后缀，也包括那个(.点)
	 */
	public void reName(String path, String from, String to) {
		File f = new File(path);
		File[] fs = f.listFiles();
		for (int i = 0; i < fs.length; ++i) {
			File f2 = fs[i];
			if (f2.isDirectory()) {
				reName(f2.getPath(), from, to);
			} else {
				String name = f2.getName();
				if (name.endsWith(from)) {
					f2.renameTo(new File(f2.getParent() + "/"
							+ name.substring(0, name.indexOf(from)) + to));
				}
			}
		}
	}

	public static void main(String[] args) {
//		System.out.println("File List");
		FileView f = new FileView();
//		f.setPath("D://jad158//jspgou-cms//com//jspgou//cms//lucene");
//		f.refreshList();
//		while (f.nextFile()) {
//			System.out.print(f.getFileName());
//			if (!f.getFileType()) {
//				System.out.print("  " + f.getFileSize());
//			} else {
//				System.out.print("  <DIR>");
//			}
//			System.out.print(f.getFileTimeStamp() + "    ");
//		}
		
		f.reName("D://jad158//tag", ".jad", ".java");
	}
}