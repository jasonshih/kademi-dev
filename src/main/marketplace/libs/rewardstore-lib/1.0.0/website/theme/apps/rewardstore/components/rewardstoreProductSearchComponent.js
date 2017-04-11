(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    KEditor.components['pointsRangeList'] = {
        settingEnabled: true,
        settingTitle: 'Points Range List Settings',
        dataRanges: "",
        dataFirstPoint: "",
        dataLastPoint: "",
        initSettingForm: function (form, keditor) {
            flog("init Point Range List");
            var pointRangeList = this;
            return $.ajax({
                url: '_components/pointsRangeList?settings',
                type: 'get',
                dataType: 'html',
                success: function (resp) {
                    form.html(resp);

                    form.find('.select-store').on('change', function () {
                        var component = keditor.getSettingComponent();
                        var dynamicElement = component.find('[data-dynamic-href]');

                        component.attr('data-store', this.value);
                        keditor.initDynamicContent(dynamicElement);

                    });

                    form.find(".btnAdd-point-range").click(function () {
                        pointRangeList.addPointsRangeList(form);
                    });

                    form.find(".btnSave-point-range").click(function () {
                        pointRangeList.savePointsRangeList(form, keditor);
                    });
                }
            });
        },

        addPointsRangeList: function (form, valPointRange) {
            if(!valPointRange) valPointRange = "";
            var strPointRangeItem = '<div class="row-item" style="margin-bottom: 10px;">';
            strPointRangeItem += '<div class="input-group">';
            strPointRangeItem += '<input type="text" class="form-control" placeholder="Enter value" value="'+ valPointRange +'">';
            strPointRangeItem += '<span class="input-group-addon"><i class="fa fa-minus-circle"></span>';
            strPointRangeItem += '</div>';
            strPointRangeItem += '</div>';
            form.find("#pointsRangeListSetting").append(strPointRangeItem);

            form.find(".row-item .input-group-addon").click(function(){
                $(this).parents(".row-item").remove();
            });
        },


        savePointsRangeList: function (form, keditor) {
            var rowItemList = form.find("#pointsRangeListSetting .row-item");
            var strItemPoint = "";
            var ranges = [];
            $.each(rowItemList, function (index) {
                var rowItem = rowItemList[index];
                var rangePoint = $(rowItem).find('input.form-control').val();
                strItemPoint += rangePoint;
                if (rowItemList.length - 1 != index) {
                    strItemPoint += ",";
                }
                ranges.push(rangePoint);
            });


            // save point range list to data attributes
            var component = keditor.getSettingComponent();
            component.attr('data-ranges', strItemPoint);

            var dynamicElement = component.find('[data-dynamic-href]');
            keditor.initDynamicContent(dynamicElement);

        },

        showSettingForm: function (form, component, keditor) {
            flog("init Point Range List");
            var pointRangeList = this;
            flog('showSettingForm "pointsRangeList" component', form, component, keditor);

            var dataAttributes = keditor.getDataAttributes(component, ['data-type'], false);
            var dataRangesList = dataAttributes['data-ranges'].split(",");

            for (var i = 0; i < dataRangesList.length; i++) {
                pointRangeList.addPointsRangeList(form, dataRangesList[i])
            }
        }
    };

})(jQuery);