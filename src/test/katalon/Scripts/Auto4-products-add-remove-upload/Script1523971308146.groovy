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

Random rnd = new Random()

def randomdigit = rnd.nextInt(99999)

def prdtestname = WebUI.concatenate(((['prod', randomdigit]) as String[]))

WebUI.openBrowser('http://vladtest49e.admin.kademi-ci.co/')

WebUI.maximizeWindow()

WebUI.setText(findTestObject('kademi-vladtest/input_email'), GlobalVariable.admin)

WebUI.setText(findTestObject('kademi-vladtest/input_password'), GlobalVariable.admin_password)

WebUI.sendKeys(findTestObject('kademi-vladtest/input_password'), Keys.chord(Keys.ENTER))

WebUI.delay(20)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products  Stores'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/button_Add New Product'))

WebUI.delay(5)

WebUI.focus(findTestObject('products-add-upload/Page_Manage Products/Add new product modal'))

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/input_name_product'))

WebUI.sendKeys(findTestObject('products-add-upload/Page_Manage Products/input_name_product'), prdtestname)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/input_title_product', [('variable') : '']))

WebUI.sendKeys(findTestObject('products-add-upload/Page_Manage Products/input_title_product'), prdtestname)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/input_baseCost_product', [('variable') : '']))

WebUI.sendKeys(findTestObject('products-add-upload/Page_Manage Products/input_baseCost_product'), '100')

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/button_Create product'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/input_data-query_products_serach'))

WebUI.sendKeys(findTestObject('products-add-upload/Page_Manage Products/input_data-query_products_serach'), prdtestname)

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/a_btn btn-info_product_edit'))

WebUI.delay(4, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_pr/button_Add image_to_product'))

WebUI.delay(4, FailureHandling.STOP_ON_FAILURE)

WebUI.focus(findTestObject('products-add-upload/Page_pr/Upload-image-product-modal'))

CustomKeywords.'upload.Uploader.uploadFile'(findTestObject('products-add-upload/Page_pr/form_Drop files here to upload_product_image'), 
    'C:\\Users\\spiblin\\Downloads\\3005471.jpg')

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_pr/button_Save_product_image_after upload'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products'))

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

WebUI.click(findTestObject('products-add-upload/Page_vladtest49c Dashboard/span_Products'))

WebUI.delay(8)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/input_data-query_products_serach'))

WebUI.sendKeys(findTestObject('products-add-upload/Page_Manage Products/input_data-query_products_serach'), 'Visa1000')

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/a_btn btn-info_product_edit'))

WebUI.delay(5, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('products-add-upload/Page_Products Uploader/span_Products'), FailureHandling.STOP_ON_FAILURE)

WebUI.delay(5)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/input_check-all-products-page'))

WebUI.delay(1)

WebUI.click(findTestObject('products-add-upload/Page_Manage Products/a_Delete-products-page'))

WebUI.delay(1)

WebUI.acceptAlert()

WebUI.delay(10, FailureHandling.STOP_ON_FAILURE)

WebUI.closeBrowser()

