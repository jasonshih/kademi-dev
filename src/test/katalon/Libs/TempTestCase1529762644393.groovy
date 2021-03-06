import com.kms.katalon.core.main.TestCaseMain
import com.kms.katalon.core.logging.KeywordLogger
import groovy.lang.MissingPropertyException
import com.kms.katalon.core.testcase.TestCaseBinding
import com.kms.katalon.core.driver.internal.DriverCleanerCollector
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.configuration.RunConfiguration
import com.kms.katalon.core.webui.contribution.WebUiDriverCleaner
import com.kms.katalon.core.mobile.contribution.MobileDriverCleaner


DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.webui.contribution.WebUiDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.mobile.contribution.MobileDriverCleaner())


RunConfiguration.setExecutionSettingFile('C:\\Users\\spiblin\\AppData\\Local\\Temp\\Katalon\\Test Cases\\Auto3-new-acc-creation-apps-install\\20180623_170359\\execution.properties')

TestCaseMain.beforeStart()
try {
    
        TestCaseMain.runTestCaseRawScript(
'''import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
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

not_run: Random rnd = new Random()

not_run: def randomdigit = rnd.nextInt(99999)

not_run: def acctestname = WebUI.concatenate(((['tstacc', randomdigit]) as String[]))

not_run: def regousername = WebUI.concatenate(((['regoqa', randomdigit]) as String[]))

not_run: def contactusername = WebUI.concatenate(((['contact', randomdigit]) as String[]))

not_run: WebUI.openBrowser('http://katalontestacc2.admin.kademi-ci.co')

not_run: WebUI.maximizeWindow()

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

not_run: WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

not_run: WebUI.delay(20)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/span_Organisations'))

not_run: WebUI.click(findTestObject('Kademi-vladtest22/button_Tools'))

not_run: WebUI.click(findTestObject('Kademi-vladtest22/a_Create account'))

not_run: WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.focus(findTestObject('Kademi-vladtest22/div_modal-create-account'))

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_title'))

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_title'), acctestname)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_orgId'))

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_orgId'), acctestname)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/button_Create'))

not_run: WebUI.delay(15, FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

not_run: WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

not_run: WebUI.click(findTestObject('Kademi-vladtest22/a_Add new user'))

not_run: WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_modal-new-user'))

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_nickName'), FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_nickName'), GlobalVariable.admin.split('@')[0])

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_firstName'), FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_firstName'), GlobalVariable.admin.split('@')[0])

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_surName'), FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_surName'), GlobalVariable.admin.split('@')[0])

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_email (1)'), FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_email (1)'), GlobalVariable.admin)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/select_group'))

not_run: WebUI.selectOptionByValue(findTestObject('Kademi-vladtest22/select_group'), 'administrator', true)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/button_Create and view'))

not_run: WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/a_Profile'))

not_run: WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_password (1)'), FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_password (1)'), GlobalVariable.admin_password)

not_run: WebUI.click(findTestObject('Kademi-vladtest22/input_confirmPassword'), FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.sendKeys(findTestObject('Kademi-vladtest22/input_confirmPassword'), GlobalVariable.admin_password)

not_run: WebUI.click(findTestObject('Email-job-case/Page_Manage users/button_Save-user_edit_page'))

not_run: WebUI.delay(5)

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Website Manager'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Websites'))

not_run: WebUI.click(findTestObject('kademi-vladtest/i_fa fa-plus (3)'))

not_run: WebUI.focus(findTestObject('kademi-vladtest/div_                        Ad'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/input_newName'))

not_run: WebUI.sendKeys(findTestObject('kademi-vladtest/input_newName'), WebUI.concatenate((([acctestname, 'web']) as String[])))

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Create website'))

not_run: WebUI.delay(10)

not_run: WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

not_run: WebUI.click(findTestObject('kademi-vladtest/div_KSignup'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

not_run: WebUI.delay(15)

not_run: WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

not_run: WebUI.delay(4)

not_run: WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

not_run: WebUI.click(findTestObject('kademi-vladtest/div_KContactus'))

not_run: WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

not_run: WebUI.delay(15)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cog'))

WebUI.delay(4)

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cogs'))

WebUI.click(findTestObject('kademi-vladtest/div_KRewardStore'))

WebUI.click(findTestObject('kademi-vladtest/span_fa fa-cloud-download'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/button_Install (1)'))

WebUI.delay(20)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/span_Website Manager'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/span_Apps'))

WebUI.delay(3)

WebUI.click(findTestObject('kademi-vladtest/button_Update all_Apps_dependencies'))

WebUI.delay(20)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(4)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/a_button_edit_participants'))

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/label_Approval_switch_for_group'))

WebUI.click(findTestObject('kademi-vladtest/button_Save_group_settings'))

WebUI.delay(1)

WebUI.refresh()

WebUI.click(findTestObject('kademi-vladtest/a_visit_signup_page'))

WebUI.delay(5)

WebUI.switchToWindowTitle('Registration')

WebUI.delay(1)

WebUI.click(findTestObject('frontend/Page_Registration/input_email_rego_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Registration/input_email_rego_page'), WebUI.concatenate((([regousername, '@mailinator.com']) as String[])))

WebUI.click(findTestObject('frontend/Page_Registration/input_password_rego_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Registration/input_password_rego_page'), GlobalVariable.admin_password)

WebUI.click(findTestObject('frontend/Page_Registration/input_confirmPassword_rego_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Registration/input_confirmPassword_rego_page'), GlobalVariable.admin_password)

WebUI.click(findTestObject('frontend/Page_Registration/button_Register_rego_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(5)

WebUI.closeWindowTitle('Registration')

WebUI.delay(2)

WebUI.switchToWindowIndex(0)

WebUI.click(findTestObject('Email-job-case/Page_Manage users/span_Talk  Connect'), FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('kademi-vladtest/span_Contact requests'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(2)

WebUI.click(findTestObject('kademi-vladtest/a_Contact us page-link-from-admin'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(2)

WebUI.switchToWindowTitle('Contact Us')

WebUI.delay(1)

WebUI.click(findTestObject('frontend/Page_Contact Us/input_firstName_contactus_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Contact Us/input_firstName_contactus_page'), WebUI.concatenate((([contactusername
                , 'n']) as String[])))

WebUI.click(findTestObject('frontend/Page_Contact Us/input_surName_contactus_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Contact Us/input_surName_contactus_page'), WebUI.concatenate((([contactusername
                , 's']) as String[])))

WebUI.click(findTestObject('frontend/Page_Contact Us/input_email_contactus_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Contact Us/input_email_contactus_page'), WebUI.concatenate((([contactusername
                , '@mailinator.com']) as String[])))

WebUI.click(findTestObject('frontend/Page_Contact Us/input_company_contactus_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Contact Us/input_company_contactus_page'), WebUI.concatenate((([contactusername
                , ' company']) as String[])))

WebUI.click(findTestObject('frontend/Page_Contact Us/input_phone_contactus_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Contact Us/input_phone_contactus_page'), WebUI.concatenate((([contactusername
                , '0000']) as String[])))

WebUI.click(findTestObject('frontend/Page_Contact Us/textarea_message_contactus_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('frontend/Page_Contact Us/textarea_message_contactus_page'), 'Simple text goes here')

WebUI.click(findTestObject('frontend/Page_Contact Us/button_Send message_contactus_page'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.setText(findTestObject('kademi-vladtest/input_user-query'), regousername)

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/a_edit_single_user(after-search)'))

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users (1)'))

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.setText(findTestObject('kademi-vladtest/input_user-query'), contactusername)

WebUI.delay(5)

WebUI.click(findTestObject('kademi-vladtest/a_edit_single_user(after-search)'))

WebUI.delay(5)

not_run: WebUI.closeBrowser()

''', 'Test Cases/Auto3-new-acc-creation-apps-install', new TestCaseBinding('Test Cases/Auto3-new-acc-creation-apps-install', [:]), FailureHandling.STOP_ON_FAILURE )
    
} catch (Exception e) {
    TestCaseMain.logError(e, 'Test Cases/Auto3-new-acc-creation-apps-install')
}
