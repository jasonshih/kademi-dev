$(function(){
    function initOrgSelector(){
        $('.orgSelectorWrap').on('click', 'a', function(e){
            e.preventDefault();

            var orgId = $(this).attr('data-orgId');
            if(orgId){
                $.cookie('selectedOrg', orgId);
                window.location.reload();
            }
        })
    }

    initOrgSelector();
});