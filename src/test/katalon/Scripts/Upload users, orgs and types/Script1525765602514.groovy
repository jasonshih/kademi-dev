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

WebUI.openBrowser(WebUI.concatenate(((['http://', GlobalVariable.orgname, '.admin.kademi-ci.co']) as String[])))

WebUI.maximizeWindow()

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(20)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Kademi-vladtest22/span_Users'))

WebUI.delay(1)

WebUI.click(findTestObject('Import-users-orgs/Page_Manage users/button_Tools_users_page'))

WebUI.delay(1)

WebUI.click(findTestObject('Import-users-orgs/Page_Manage users/a_Import  remove users_users_page'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'upload.Uploader.uploadFile'(findTestObject('products-add-upload/Page_Products Uploader/span_Upload CSV XLS XLSX'), 
    'C:\\Users\\spiblin\\Downloads\\users (5).csv')

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

not_run: WebUI.delay(1)

WebUI.selectOptionByValue(findTestObject('Import-users-orgs/Page_Users Uploader/select_No default group_Group_selector'), 
    'participants', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

WebUI.delay(5)

not_run: WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'))

not_run: WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'), 
    'Product Name/Code', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'), 
    'User ID', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-2'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-2'), 
    'Nickname', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-3'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-3'), 
    'Email', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-4'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-4'), 
    'First Name', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-5'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-5'), 
    'Last Name', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-6'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-6'), 
    'Phone', true)

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

WebUI.delay(10)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Import now_uploader'))

WebUI.delay(60)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Import-users-orgs/span_Organisation Types'))

WebUI.delay(1)

WebUI.click(findTestObject('Import-users-orgs/a_Add new organization types'))

WebUI.delay(1)

WebUI.focus(findTestObject('Import-users-orgs/div_orgype-creation-modal'))

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_name'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_name'), 'LG')

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_displayName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_displayName'), 'Large')

WebUI.click(findTestObject('Import-users-orgs/button_Save_orgtype'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(3, FailureHandling.STOP_ON_FAILURE)

WebUI.refresh()

WebUI.click(findTestObject('Import-users-orgs/a_Add new organization types'))

WebUI.delay(1)

WebUI.focus(findTestObject('Import-users-orgs/div_orgype-creation-modal'))

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_name'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_name'), 'MD')

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_displayName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_displayName'), 'Medium')

WebUI.click(findTestObject('Import-users-orgs/button_Save_orgtype'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(3, FailureHandling.STOP_ON_FAILURE)

WebUI.refresh()

WebUI.click(findTestObject('Import-users-orgs/a_Add new organization types'))

WebUI.delay(1)

WebUI.focus(findTestObject('Import-users-orgs/div_orgype-creation-modal'))

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_name'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_name'), 'SM')

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_displayName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_displayName'), 'Small')

WebUI.click(findTestObject('Import-users-orgs/button_Save_orgtype'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(3, FailureHandling.STOP_ON_FAILURE)

WebUI.refresh()

WebUI.click(findTestObject('Import-users-orgs/a_Add new organization types'))

WebUI.delay(1)

WebUI.focus(findTestObject('Import-users-orgs/div_orgype-creation-modal'))

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_name'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_name'), 'YLW')

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_displayName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_displayName'), 'Yellow')

WebUI.click(findTestObject('Import-users-orgs/button_Save_orgtype'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(3, FailureHandling.STOP_ON_FAILURE)

WebUI.refresh()

WebUI.click(findTestObject('Import-users-orgs/a_Add new organization types'))

WebUI.delay(1)

WebUI.focus(findTestObject('Import-users-orgs/div_orgype-creation-modal'))

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_name'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_name'), 'BLK')

WebUI.click(findTestObject('Import-users-orgs/input_orgtype_displayName'), FailureHandling.STOP_ON_FAILURE)

WebUI.sendKeys(findTestObject('Import-users-orgs/input_orgtype_displayName'), 'Black')

WebUI.click(findTestObject('Import-users-orgs/button_Save_orgtype'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(3, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Kademi-vladtest22/span_Groups  users'))

WebUI.delay(1)

WebUI.click(findTestObject('Import-users-orgs/span_Organisations'))

WebUI.delay(1)

WebUI.click(findTestObject('Import-users-orgs/button_Tools_Organisations_page'))

WebUI.delay(1)

WebUI.click(findTestObject('Import-users-orgs/a_Import wizard_organisations'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'upload.Uploader.uploadFile'(findTestObject('products-add-upload/Page_Products Uploader/span_Upload CSV XLS XLSX'), 
    'C:\\Users\\spiblin\\Downloads\\orgs (7).csv')

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'), 
    'Org ID', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'), 
    'Type', true)

not_run: WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-2'))

not_run: WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-2'), 
    'Nickname', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-3'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-3'), 
    'Name', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-4'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-4'), 
    'Address', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-5'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-5'), 
    'Address Line2', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-6'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-6'), 
    'State', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-7'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-7'), 
    'Phone', true)

not_run: WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-8'))

not_run: WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-8'), 
    'Phone', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-9'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-9'), 
    'Country', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-10'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-10'), 
    'Email', true)

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

WebUI.delay(10)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Import now_uploader'))

WebUI.delay(30)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

