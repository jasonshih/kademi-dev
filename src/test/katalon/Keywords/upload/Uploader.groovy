package upload

import java.awt.Robot 
import java.awt.Toolkit 
import java.awt.datatransfer.StringSelection 
import java.awt.event.KeyEvent

import com.kms.katalon.core.annotation.Keyword 
import com.kms.katalon.core.testobject.TestObject 
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

public class Uploader {
	@Keyword
	def uploadFile(TestObject to, String filePath) {
		WebUI.click(to)
		StringSelection ss = new StringSelection(filePath);
		Toolkit.getDefaultToolkit().getSystemClipboard().setContents(ss, null);
		Robot robot = new Robot();
		sleep(3000)
		robot.keyPress(KeyEvent.VK_ENTER);
		robot.keyRelease(KeyEvent.VK_ENTER);
		robot.keyPress(KeyEvent.VK_CONTROL);
		robot.keyPress(KeyEvent.VK_V);
		robot.keyRelease(KeyEvent.VK_V);
		robot.keyRelease(KeyEvent.VK_CONTROL);
		robot.keyPress(KeyEvent.VK_ENTER);
		robot.keyRelease(KeyEvent.VK_ENTER);
	}
}
