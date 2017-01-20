$(function(){
    function initRewardSelector(){
        $('.rewardSelectorWrap').on('click', 'a', function(e){
            e.preventDefault();

            var reward = $(this).attr('data-reward');
            if(reward){
                $.cookie('selectedReward', reward);
                window.location.reload();
            }
        })
    }

    initRewardSelector();
});