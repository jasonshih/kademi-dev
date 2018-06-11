import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
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
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

WebUI.openBrowser(WebUI.concatenate(((['http://', GlobalVariable.orgname, '.admin.kademi-ci.co']) as String[])))

WebUI.maximizeWindow()

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(15)

WebUI.click(findTestObject('kademi-vladtest/span_Website Manager'))

WebUI.click(findTestObject('kademi-vladtest/span_Websites'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (3)'))

WebUI.focus(findTestObject('kademi-vladtest/div_                        Ad'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_newName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_newName'), WebUI.concatenate((([GlobalVariable.orgname, 'web']) as String[])))

WebUI.click(findTestObject('kademi-vladtest/button_Create website'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KLearning'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_E-Learning'))

WebUI.click(findTestObject('kademi-vladtest/span_Courses'))

WebUI.click(findTestObject('kademi-vladtest/b_Program'))

WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (4)'))

WebUI.delay(1)

WebUI.focus(findTestObject('kademi-vladtest/div_                        Pr'))

WebUI.click(findTestObject('kademi-vladtest/input_programName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_programName'), 'Program1')

WebUI.click(findTestObject('kademi-vladtest/input_programTitle'))

WebUI.setText(findTestObject('kademi-vladtest/input_programTitle'), 'Program1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New course'))

WebUI.delay(3)

WebUI.focus(findTestObject('kademi-vladtest/div_'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_courseName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseName'), 'Course1')

WebUI.click(findTestObject('kademi-vladtest/input_courseTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_courseTitle'), 'Course1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (1)'))

WebUI.delay(3)

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.delay(1)

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module1')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module1Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module2')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module2Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

WebUI.delay(3)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_New module'))

WebUI.focus(findTestObject('kademi-vladtest/div_ (1)'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/input_moduleName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleName'), 'Module3')

WebUI.click(findTestObject('kademi-vladtest/input_moduleTitle'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_moduleTitle'), 'Module3Title')

WebUI.click(findTestObject('kademi-vladtest/button_Save (2)'))

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

