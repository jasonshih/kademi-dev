$(function () {
    function initRewardSelector() {
        $('.rewardSelectorWrap').on('click', 'a', function (e) {
            e.preventDefault();

            //flog("BEFORE org cookie", $.cookie('selectedOrg'), "reward", $.cookie('selectedReward'));
            var reward = $(this).attr('data-reward');
            if (reward) {
                $.cookie('selectedReward', reward, { expires: 360, path: '/' });                
            } else {
                $.cookie('selectedReward', "");
            }
            //flog("AFTER org cookie", $.cookie('selectedOrg'), "reward", $.cookie('selectedReward'));
            window.location.reload();
        })
    }

    initRewardSelector();
});