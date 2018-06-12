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
import com.kms.katalon.core.testdata.CSVData as CSVData
import com.kms.katalon.core.logging.KeywordLogger as KeywordLogger

CSVData data = findTestData('Usernames_passwords')

KeywordLogger log = new KeywordLogger()

not_run: def rownum = data.getRowNumbers()

not_run: def test = data.getValue(1, 6)

not_run: log.logInfo('yourMsg ' + test)

for (def index : (1..data.getRowNumbers())) {
    varUsername = data.getValue(1, index)

    varPassword = data.getValue(6, index)

    WebUI.openBrowser('http://vladtest51hleads-vladtest51h.kademi-ci.co/dashboard')

    not_run: WebUI.maximizeWindow()
	
	WebUI.setViewPortSize(1920, 1080)

    WebUI.setText(findTestObject('frontend/frontend-input_email_lead'), varUsername)

    WebUI.setText(findTestObject('frontend/frontend-input_password-lead'), varPassword)

    WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

    WebUI.delay(20)

    WebUI.click(findTestObject('frontend/frontend_profile_dropdown'))

    WebUI.delay(1)

    not_run: WebUI.click(findTestObject('frontend/frontend_Profile-button'))

    not_run: WebUI.delay(5)

    WebUI.click(findTestObject('frontend/frontend_Logout-button'))

    WebUI.delay(5)

    WebUI.refresh()

    WebUI.closeBrowser()
}

