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

WebUI.click(findTestObject('kademi-vladtest/input_newName'))

WebUI.sendKeys(findTestObject('kademi-vladtest/input_newName'), WebUI.concatenate((([GlobalVariable.orgname, 'aucstore']) as String[])))

WebUI.click(findTestObject('kademi-vladtest/button_Create website'))

WebUI.delay(10)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KRewardStore'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(15)

WebUI.click(findTestObject('kademi-vladtest/a_Back to website manager - correct'))

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/a_Details (1)'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KAuctions'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

