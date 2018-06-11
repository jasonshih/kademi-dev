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

WebUI.openBrowser('http://rootorg.admin.kademi-ci.co/')

WebUI.maximizeWindow()

WebUI.setText(findTestObject('Kademi-vladtest22/input_email'), GlobalVariable.bigadmin)

WebUI.setText(findTestObject('Kademi-vladtest22/input_password'), GlobalVariable.bigadminpass)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(20, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Organisations'))

WebUI.click(findTestObject('Kademi-vladtest22/button_Tools'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Create account'))

WebUI.focus(findTestObject('Kademi-vladtest22/div_modal-create-account'))

WebUI.click(findTestObject('Kademi-vladtest22/input_title'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_title'), GlobalVariable.orgname)

WebUI.click(findTestObject('Kademi-vladtest22/input_orgId'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_orgId'), GlobalVariable.orgname)

WebUI.click(findTestObject('Kademi-vladtest22/button_Create'))

WebUI.delay(15, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Add new user'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('kademi-vladtest/div_modal-new-user'))

WebUI.click(findTestObject('Kademi-vladtest22/input_nickName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_nickName'), (GlobalVariable.admin).split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_firstName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_firstName'), (GlobalVariable.admin).split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_surName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_surName'), (GlobalVariable.admin).split('@')[0])

WebUI.click(findTestObject('Kademi-vladtest22/input_email (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_email (1)'), GlobalVariable.admin)

WebUI.click(findTestObject('Kademi-vladtest22/select_group'))

WebUI.selectOptionByValue(findTestObject('Kademi-vladtest22/select_group'), 'administrator', true)

WebUI.click(findTestObject('Kademi-vladtest22/button_Create and view'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/a_Profile'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/input_password (1)'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password (1)'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Kademi-vladtest22/input_confirmPassword'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_confirmPassword'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Kademi-vladtest22/button_Save'))

WebUI.click(findTestObject('Kademi-vladtest22/span_adminqa'))

WebUI.click(findTestObject('Kademi-vladtest22/a_Log Out'))

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_email'), GlobalVariable.admin)

WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password'), GlobalVariable.admin_password)

WebUI.click(findTestObject('Kademi-vladtest22/button_Log in'))

