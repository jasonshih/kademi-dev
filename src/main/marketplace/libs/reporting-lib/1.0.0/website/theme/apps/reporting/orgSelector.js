$(function(){
    function initOrgSelector(){
        $('.orgSelectorWrap').on('click', 'a', function(e){
            e.preventDefault();

            var orgId = $(this).attr('data-orgId');
            if(orgId){
                $.cookie('selectedOrg', orgId, { expires: 360, path: '/' });                
            } else {
                $.cookie('selectedOrg', "");
            }
            //flog("org cookie", $.cookie('selectedOrg'), "reward", $.cookie('selectedReward'));
            window.location.reload();
        })
    }

    initOrgSelector();
});