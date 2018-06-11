import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

//def a = WebUI.concatenate(((['http://', GlobalVariable.orgname, '.admin.kademi-ci.co']) as String[]))
//def acutted= a.substring(4)
//def a = (GlobalVariable.admin).split('@')[0]
not_run: Random rnd = new Random()

not_run: def randomdigit = rnd.nextInt(9999)

not_run: def usertestname = WebUI.concatenate(((['autouserqa01', randomdigit]) as String[]))

WebUI.openBrowser(http://vladtest49c.admin.kademi-ci.co/)

not_run: CustomKeywords.'dnd.DragAndDropHelper.dragAndDrop'(findTestObject('kademi-vladtest/drag-img_keditor-ui keditor-snippet'), 
    findTestObject('kademi-vladtest/drop-div_keditor-content-area-15228'))

not_run: WebUI.openBrowser(WebUI.concatenate(((['http://', GlobalVariable.orgname, '.admin.kademi-ci.co']) as String[])))

not_run: WebUI.concatenate(((['http://', GlobalVariable.orgname, '.admin.kademi-ci.co']) as String[]))

WebUI.maximizeWindow()

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(20)

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Website Manager'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Websites'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (3)'))

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_                        Ad'))

not_run: WebUI.click(findTestObject('kademi-vladtest/input_newName'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_newName'), 'vlad33web')

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Create website'))

not_run: WebUI.delay(10)

not_run: WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

not_run: WebUI.click(findTestObject('kademi-vladtest/div_KLearning'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

not_run: WebUI.delay(10)

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_E-Learning'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Courses'))

not_run: WebUI.click(findTestObject('kademi-vladtest/b_Program'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (4)'))

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_                        Pr'))

not_run: WebUI.click(findTestObject('kademi-vladtest/input_programName'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_programName'), 'Program1')

not_run: WebUI.click(findTestObject('kademi-vladtest/input_programTitle'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_programTitle'), 'Program1Title')

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save'))

not_run: WebUI.delay(3)

not_run: WebUI.click(findTestObject('kademi-vladtest/a_New course'))

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/input_courseName'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseName'), 'Course1')

not_run: WebUI.click(findTestObject('kademi-vladtest/input_courseTitle'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseTitle'), 'Course1Title')

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save (1)'))

not_run: WebUI.delay(3)

not_run: WebUI.click(findTestObject('kademi-vladtest/a_New module'))

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module1')

not_run: WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module1Title')

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

not_run: WebUI.delay(3)

not_run: WebUI.refresh()

not_run: WebUI.click(findTestObject('kademi-vladtest/a_New module'))

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module2')

not_run: WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module2Title')

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

not_run: WebUI.delay(3)

not_run: WebUI.refresh()

not_run: WebUI.click(findTestObject('kademi-vladtest/a_New module'))

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module3')

not_run: WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module3Title')

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

not_run: WebUI.delay(3)

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-cog'))

not_run: WebUI.click(findTestObject('kademi-vladtest/a_Manage this module'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle'), 'page1')

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close'))

not_run: WebUI.click(findTestObject('kademi-vladtest/a_btn btn-sm btn-success btn-a'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle'), 'page2')

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet_1'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle'), 'page3')

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet_2'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Program1  Course1  Module'))

not_run: WebUI.click(findTestObject('kademi-vladtest/a_Module2Title'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (1)'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle (1)'), 'page11')

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (1)'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle (1)'), 'page22')

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (1)'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle (1)'), 'page33')

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet_1 (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Program1  Course1  Module (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/a_Module3Title'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (2)'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle (2)'), 'page111')

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet (2)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (2)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/a_btn btn-sm btn-success btn-a (1)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet_1 (2)'))

not_run: WebUI.rightClick(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet_1 (2)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet_1 (2)'))

not_run: WebUI.doubleClick(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet_1 (2)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (2)'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle (2)'), 'Page222')

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (2)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (2)'))

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_pageTitle (2)'), 'page333')

not_run: WebUI.doubleClick(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet (2)'))

not_run: WebUI.doubleClick(findTestObject('kademi-vladtest/img_keditor-ui keditor-snippet (2)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Save  Close (2)'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Dashboard (1)'))

not_run: WebUI.closeBrowser()

