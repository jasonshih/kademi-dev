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

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products  Stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Reward stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Reward Stores/a_Manage_reward_store'))

WebUI.delay(3)

WebUI.click(findTestObject('products-add-upload/Page_vladtest51daucstore-points/input_chk-all-reward-store-products'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest51daucstore-points/button_Remove selected_reward-store-products'))

WebUI.delay(10, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products  Stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products'))

WebUI.delay(8)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/input_check-all-products-page'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/a_Delete-products-page'))

WebUI.delay(1)

WebUI.acceptAlert()

WebUI.delay(10, FailureHandling.STOP_ON_FAILURE)

WebUI.refresh()

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/button_btn btn-sm btn-success-dropdown'), FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/a_Import Products'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'upload.Uploader.uploadFile'(findTestObject('products-add-upload/Page_Products Uploader/span_Upload CSV XLS XLSX'), 
    'C:\\Users\\spiblin\\Downloads\\products (5).csv')

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

not_run: WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

not_run: WebUI.delay(1)

not_run: WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'))

not_run: WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'), 
    'Product Name/Code', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'), 
    'Product Name/Code', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-2'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-2'), 
    'Web Name', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-3'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-3'), 
    'Title', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-4'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-4'), 
    'Base Cost', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-7'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-7'), 
    'Product Details', true)

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

WebUI.delay(2)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Import now_uploader'))

WebUI.delay(30)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products  Stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Categories'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/input_check-all_Categories_page'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/button_Delete_categories'))

WebUI.delay(1, FailureHandling.STOP_ON_FAILURE)

WebUI.acceptAlert()

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.refresh(FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/button_btn btn-sm btn-success_category_dropdown'))

WebUI.click(findTestObject('products-add-upload/a_Upload Categories'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'upload.Uploader.uploadFile'(findTestObject('products-add-upload/Page_Products Uploader/span_Upload CSV XLS XLSX'), 
    'C:\\Users\\spiblin\\Downloads\\categories (4).csv')

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-0'), 
    'Category Name', true)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'))

WebUI.selectOptionByLabel(findTestObject('products-add-upload/Page_Products Uploader/select_Do not importBase CostB-1'), 
    'Title', true)

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Next_uploaders'))

WebUI.delay(2)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/button_Import now_uploader'))

WebUI.delay(10)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products  Stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Categories'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/button_btn btn-sm btn-success_category_dropdown'))

WebUI.click(findTestObject('products-add-upload/a_Upload product in categories'))

WebUI.delay(2, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('products-add-upload/div_Upload-product-in-categories-CSV-modal'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(2, FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'upload.Uploader.uploadFile'(findTestObject('products-add-upload/button_Upload spreadsheet_products-category'), 
    'C:\\Users\\spiblin\\Downloads\\product-categories (2).csv')

WebUI.delay(3, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/button_Close_upload_productin-cats-modal'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(1)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products  Stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Reward stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Reward Stores/a_Manage_reward_store'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest51daucstore-points/a_Add_reward-store-products'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_vladtest51daucstore-points/button_btn btn-sm btn-info dro-dropdown-reward-store-add-product'))

WebUI.click(findTestObject('products-add-upload/Page_vladtest51daucstore-points/a_Add all matched-reward-store-prods'))

WebUI.delay(1)

WebUI.focus(findTestObject('products-add-upload/div_Are you sure_Sweet_alert'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/button_Yes'))

WebUI.delay(10, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('kademi-vladtest/span_Dashboard'))

