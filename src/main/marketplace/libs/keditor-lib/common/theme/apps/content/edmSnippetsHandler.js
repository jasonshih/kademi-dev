#foreach($component in $page.components)
$page.snippet( $component.componentId )
#end