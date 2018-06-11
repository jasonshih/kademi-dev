
/**
 * This class is generated automatically by Katalon Studio and should not be modified or deleted.
 */

import com.kms.katalon.core.testobject.TestObject

import java.lang.String


def static "dnd.DragAndDropHelper.dragAndDrop"(
    	TestObject sourceObject	
     , 	TestObject destinationObject	) {
    (new dnd.DragAndDropHelper()).dragAndDrop(
        	sourceObject
         , 	destinationObject)
}

def static "upload.Uploader.uploadFile"(
    	TestObject to	
     , 	String filePath	) {
    (new upload.Uploader()).uploadFile(
        	to
         , 	filePath)
}
