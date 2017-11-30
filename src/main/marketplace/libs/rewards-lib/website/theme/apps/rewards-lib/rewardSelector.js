$(function () {
    function initRewardSelector() {
        $('.rewardSelectorWrap').on('click', 'a', function (e) {
            e.preventDefault();
            
            var reward = $(this).attr('data-reward');
            if (reward) {
                $.cookie('selectedReward', reward, {expires: 360, path: '/'});
            } else {
                $.cookie('selectedReward', "");
            }
            
            window.location.reload();
        })
    }
    
    initRewardSelector();
});