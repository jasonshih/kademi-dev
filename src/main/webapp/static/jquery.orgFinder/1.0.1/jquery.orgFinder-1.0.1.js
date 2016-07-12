/**
 *
 * jquery.orgFinder.js
 * @version: 1.0.1
 * @require: bootstrap-select, jquery.scrollTo
 *
 * Configuration:
 * @option {Array<Number>} initLatLng Initialized latitude and longitude of map
 * @option {Number} initZoomLevel Initialized zoom level of map
 * @option {String} initQuery Initialized search query
 * @option {String} googleAPIKey Google API key
 * @option {String} searchUrl Search URL. Must be link to signup page of a group or /organisations/ (if you use this plugin in Kademi admin console)
 * @option {Array} orgTypes List of organisation types. It's optional
 * @option {String} template Template string for orgFinder. Form search must has 'org-finder-search' class, textbox must be named 'q' and selectbox for organisation types must be named 'orgType'. Items list wrapper must has 'org-finder-list' class. Suggestion list wrapper must has 'org-finder-suggestions' class. Map div must has class 'org-finder-map'
 * @option {Function} onReady Callback will be called when orgFinder is ready. Arguments: 'formSearch', 'itemsWrapper', 'mapDiv'
 * @option {Function} onSelect Callback will be called when click on marker on map or item in org list panel. Arguments: 'orgData', 'item', 'marker', 'infoWindow'
 * @option {Function} onSearch Callback will be called when search a keyword. Arguments: 'query'
 * @option {Function} beforeSearch Callback will be called before searching a keyword. This callback must be return data object which will be sent to server. Arguments: 'query', 'data'
 * @option {Function} onSearched Callback will be called after searching a keyword. Arguments: 'query', 'resp'
 * @option {Function} renderItemContent Method for rendering content of an item in organization list. If you don't want to show this organization, just return null or empty. Arguments: 'orgData'
 * @option {Function} renderMarkerContent Method for rendering content for InfoWindow of a marker on Google Map. If you don't want to show this organization, just return null or empty. Arguments: 'orgData'
 * @option {Function} renderSuggestionContent Method for rendering content for suggestions list. If you don't want to show this organization, just return null or empty. Arguments: 'data'
 * @option {String} emptyItemText Text will be showed when there is no result in organization list
 * @option {String} emptySuggestionText Text will be showed when there is no suggestion in suggestions list
 */

(function ($) {
    $.fn.orgFinder = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[jquery.orgFinder] Method ' + method + ' does not exist on jquery.orgFinder');
        }
    };

    // Version for jquery.orgFinder
    $.fn.orgFinder.version = '1.0.1';

    // Default configuration
    $.fn.orgFinder.DEFAULT = {
        initLatLng: [],
        initZoomLevel: 15,
        initQuery: null,
        googleAPIKey: null,
        searchUrl: null,
        orgTypes: null,
        maxResults: 1000,
        template:
        '<form role="form" class="form-horizontal form-search org-finder-search" action="" style="margin-bottom: 15px;">' +
        '    <div class="input-group">' +
        '        <div class="clearfix dropdown">' +
        '            <input type="text" name="q" class="form-control" placeholder="Enter your address" id="q" value="" autocomplete="off" />' +
        '            <div class="dropdown-menu org-finder-suggestions" style="width: 100%;"></div>' +
        '        </div>' +
        '        <span class="input-group-btn">' +
        '            <select name="orgType" class="selectpicker"></select>' +
        '            <button class="btn btn-default" type="submit">Search</button>' +
        '        </span>' +
        '    </div>' +
        '</form>' +
        '<div class="row" style="margin-bottom: 40px;">' +
        '    <div class="col-md-4">' +
        '        <div class="panel panel-default">' +
        '            <div class="panel-heading"><i class="fa fa-list"></i> List Organisations</div>' +
        '            <div class="list-group org-finder-list" style="overflow-y: auto;"></div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="col-md-8">' +
        '        <div class="embed-responsive embed-responsive-16by9">' +
        '            <div class="embed-responsive-item org-finder-map"></div>' +
        '        </div>' +
        '    </div>' +
        '</div>'
        ,
        onReady: function (formSearch, itemsWrapper, mapDiv) {
        },
        onSelect: function (orgData, item, marker, infoWindow) {
        },
        onSearch: function (query) {
        },
        beforeSearch: function (query, data) {
            return data;
        },
        onSearched: function (query, resp) {
        },
        renderItemContent: function (orgData) {
            var itemContent = '';
            itemContent += '<h4 class="list-group-item-heading">' + orgData.title + '</h4>';

            if (orgData.orgTypes && orgData.orgTypes.length > 0) {
                var orgTypesHtml = '';
                for (var i = 0; i < orgData.orgTypes.length; i++) {
                    orgTypesHtml += '<span class="label label-info">' + orgData.orgTypes[i].dispayName + '</span> ';
                }

                itemContent += '<p>' + orgTypesHtml + '</p>';
            }

            if (orgData.phone) {
                itemContent += '<p class="list-group-item-text"><i class="fa fa-phone fa-fw"></i> ' + orgData.phone + '</p>';
            }
            if (orgData.email) {
                itemContent += '<p class="list-group-item-text" style="word-break: break-all;"><i class="fa fa-envelope-o fa-fw"></i> <a href="mailto:' + orgData.email + '">' + orgData.email + '</a></p>';
            }

            var address = '';
            if (orgData.address) {
                address += orgData.address + '<br />';
            }
            if (orgData.addressLine2) {
                address += orgData.addressLine2 + '<br />';
            }
            if (orgData.addressState) {
                address += orgData.addressState
            }
            if (orgData.postcode) {
                address += ' ' + orgData.postcode;
            }
            if (orgData.country) {
                address += ', ' + orgData.country;
            }
            if (address.trim() !== '') {
                itemContent += '<p class="list-group-item-text"><i class="fa fa-map-marker fa-fw"></i> ' + address + '</p>';
            }

            return '<div class="list-group-item">' + itemContent + '</div>';
        },
        renderMarkerContent: function (orgData) {
            return '<div><h3>' + orgData.title + '</h3></div>';
        },
        renderSuggestionContent: function (data) {
            var suggestionContent = data.formatted_address;

            return '<li><a>' + suggestionContent + '</a></li>';
        },
        emptyItemText: '<div class="list-group-item text-muted">No result</li>',
        emptySuggestionText: '<li class="disabled"><a>No suggestion</a></li>'
    };

    var SEARCH_SELECTOR = '.org-finder-search';
    var LIST_SELECTOR = '.org-finder-list';
    var MAP_SELECTOR = '.org-finder-map';
    var SUGGESTIONS_SELECTOR = '.org-finder-suggestions';
    var SUGGESTION_SELECTOR = '.org-finder-suggestion';

    function Finder(container, options) {
        this.options = options;
        this.container = container;
        this.init();
    }

    Finder.prototype = {
        map: null,
        markers: [],
        infoWindows: [],
        listItems: [],
        activeInfoWidow: null,
        activeListItem: null,

        init: function () {
            var self = this;
            var options = self.options;
            var container = self.container;

            container.html(options.template);
            self.formSearch = container.find(SEARCH_SELECTOR);
            self.itemsWrapper = container.find(LIST_SELECTOR);
            self.mapDiv = container.find(MAP_SELECTOR);
            self.suggestionWrapper = container.find(SUGGESTIONS_SELECTOR);

            self.initMap();
        },

        initMap: function () {
            flog('[jquery.orgFinder] initMap');

            var self = this;
            var options = this.options;
            var functionName = 'init' + (new Date()).getTime();
            var googleMapCallback = '$.fn.orgFinder.' + functionName;

            $.fn.orgFinder[functionName] = function () {
                var mapOptions = {};
                if (options.initLatLng.length === 2) {
                    mapOptions.center = {
                        lat: options.initLatLng[0],
                        lng: options.initLatLng[1]
                    };
                }

                if (options.initZoomLevel) {
                    mapOptions.zoom = options.initZoomLevel;
                }

                self.map = new google.maps.Map(self.mapDiv.get(0), mapOptions);
                self.initFormSearch();

                if (typeof options.onReady === 'function') {
                    options.onReady.call(self, self.formSearch, self.itemsWrapper, self.mapDiv);
                }
            };

            if (window.google && window.google.maps) {
                flog('[jquery.orgFinder] Google Map Api is already in documentation');
                $.fn.orgFinder[functionName].call(this);
            } else {
                var gmapApiUrl = 'https://maps.googleapis.com/maps/api/js?key=' + self.options.googleAPIKey + '&libraries=places&callback=' + googleMapCallback;
                flog('[jquery.orgFinder] Load Google Map Api from "' + gmapApiUrl + '"');
                $.getScript(gmapApiUrl);
            }
        },

        initFormSearch: function () {
            flog('[jquery.orgFinder] initFormSearch');

            var self = this;
            var options = self.options;
            var formSearch = self.formSearch;
            var suggestionWrapper = self.suggestionWrapper;
            var map = self.map;
            var cbbOrgType = formSearch.find('[name=orgType]');
            var txtQ = formSearch.find('[name=q]');
            var btn = formSearch.find(':button');
            var initQuery = self.options.initQuery;
            var lastQuery = null;
            var lastOrgTypes = null;
            var orgTypes = options.orgTypes;

            if (initQuery !== null && initQuery !== undefined && initQuery.trim() !== '') {
                txtQ.val(initQuery);
            }

            var eventHandler = function () {
                var lat = txtQ.attr('data-lat');
                var lng = txtQ.attr('data-lng');
                var query = (txtQ.val() || '').trim();
                query = query === '' ? ' ' : query;
                flog('[jquery.orgFinder] Query: "' + query + '", last query: "' + lastQuery + '"');

                var orgTypes = cbbOrgType.val();
                flog('[jquery.orgFinder] OrgTypes: "' + orgTypes + '", last orgTypes: "' + lastOrgTypes + '"');

                if ((lat && lng) || (query !== lastQuery || orgTypes !== lastOrgTypes)) {
                    self.clear();
                    self.doSearch(query, lat, lng);
                } else {
                    flog('[jquery.orgFinder] Query is already searched. Do nothing');
                }
                lastQuery = query;
                lastOrgTypes = orgTypes;
            };

            if (orgTypes && $.isArray(orgTypes) && orgTypes.length > 0) {
                var optionStr = '';

                for (var i = 0; i < orgTypes.length; i++) {
                    optionStr += '<option value="' + orgTypes[i].value + '">' + orgTypes[i].title + '</option>';
                }

                cbbOrgType.prop('multiple', true).html(optionStr).addClass('selectpicker');
                if (!cbbOrgType.attr('title')) {
                    cbbOrgType.attr('title', ' - Select Types - ')
                }
                cbbOrgType.on('change', function () {
                    eventHandler();
                });
            }

            suggestionWrapper.css('display', 'none').on('click', SUGGESTION_SELECTOR, function (e) {
                e.preventDefault();

                var clicked = $(this);
                var query = clicked.text().trim();
                var lat = clicked.attr('data-lat');
                var lng = clicked.attr('data-lng');

                txtQ.val(query).attr({
                    'data-lat': lat,
                    'data-lng': lng
                });
                eventHandler();
                suggestionWrapper.css('display', 'none');
            });

            if (formSearch.is('form')) {
                formSearch.on('submit', function (e) {
                    e.preventDefault();

                    eventHandler();
                });
            } else {
                btn.on('click', function (e) {
                    e.preventDefault();

                    eventHandler();
                });
            }

            $(window).on('keydown', function (e) {
                if (e.keyCode === 27) {
                    e.preventDefault();
                    suggestionWrapper.css('display', 'none');
                }
            });

            var timer = null;
            txtQ.on('keydown', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    eventHandler();
                } else if (e.keyCode === 27) {
                    e.preventDefault();
                    suggestionWrapper.css('display', 'none');
                } else {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        txtQ.removeAttr('data-lat');
                        txtQ.removeAttr('data-lng');

                        var q = txtQ.val() || '';
                        q = q.trim();

                        if (q !== '') {
                            flog('[jquery.orgFinder] Searching using GoogleMap PlacesService...');
                            var service = new google.maps.places.PlacesService(map);
                            service.textSearch({
                                query: q
                            }, function (results, status) {
                                flog('[jquery.orgFinder] Get results from GoogleMap PlacesService', results, status);

                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    if (typeof options.renderSuggestionContent !== 'function') {
                                        $.error('[jquery.orgFinder] renderSuggestionContent is not function. Please correct it!');
                                    }

                                    suggestionWrapper.html('');
                                    for (var i = 0; i < results.length; i++) {
                                        var suggestionContent = options.renderSuggestionContent(results[i]) || '';
                                        suggestionContent = suggestionContent.trim();

                                        if (suggestionContent !== '') {
                                            $(suggestionContent).addClass(SUGGESTION_SELECTOR.replace('.', '')).attr({
                                                'data-lat': results[i].geometry.location.lat,
                                                'data-lng': results[i].geometry.location.lng
                                            }).appendTo(suggestionWrapper);
                                        }
                                    }
                                } else {
                                    suggestionWrapper.html(options.emptySuggestionText);
                                }

                                suggestionWrapper.css('display', 'block');
                            });
                        } else {
                            suggestionWrapper.css('display', 'none');
                        }
                    }, 150);
                }
            });
        },

        clear: function () {
            flog('[jquery.orgFinder] clear');

            if (this.activeInfoWidow) {
                this.activeInfoWidow.close();
            }

            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
                delete this.markers[i];
                delete this.infoWindows[i];
                delete this.listItems[i];
            }

            this.markers = [];
            this.infoWindows = [];
            this.listItems = [];
            this.activeInfoWidow = null;
            this.activeListItem = null;
            this.itemsWrapper.html('');
        },

        doSearch: function (query, lat, lng) {
            flog('[jquery.orgFinder] doSearch', query, lat, lng);

            var self = this;
            var options = self.options;
            var map = self.map;

            self.suggestionWrapper.css('display', 'none');

            if (typeof options.onSearch === 'function') {
                options.onSearch.call(self, query);
            }

            var searchUrl = (options.searchUrl || '').trim();
            if (searchUrl.length === 0) {
                $.error('[jquery.orgFinder] Search Url is empty!');
            }

            var data = {
                maxResults: options.maxResults
            };

            if (lat !== undefined && lng !== undefined) {
                data.lat = lat;
                data.lng = lng;
            } else {
                data.jsonQuery = query;
            }

            if (options.orgTypes && $.isArray(options.orgTypes) && options.orgTypes.length > 0) {
                data.orgTypes = self.formSearch.find('[name=orgType]').val();
            }

            if (typeof options.beforeSearch === 'function') {
                data = options.beforeSearch.call(self, query, data);
            }

            $.ajax({
                url: options.searchUrl,
                dataType: 'json',
                type: 'get',
                data: data,
                success: function (resp) {
                    flog('[jquery.orgFinder] Success in getting data', resp);

                    self.clear();

                    if (resp && resp.status && resp.data && resp.data[0]) {
                        self.generateData(resp.data);
                    } else {
                        flog('[jquery.orgFinder] No organisation match');
                        self.itemsWrapper.html(options.emptyItemText);

                        if (lat && lng) {
                            map.setCenter(new google.maps.LatLng(lat, lng));
                            map.setZoom(options.initZoomLevel);
                        }
                    }

                    if (typeof options.onSearched === 'function') {
                        options.onSearched.call(self, query, resp);
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flog('[jquery.orgFinder] Error when getting data', jqXHR, textStatus, errorThrown);
                }
            });
        },

        generateData: function (data) {
            flog('[jquery.orgFinder] generateData', data);

            var self = this;
            var options = self.options;
            var map = self.map;
            var lats = [];
            var lngs = [];

            for (var i = 0; i < data.length; i++) {
                self.createDataItem(data[i]);
                lats.push(data[i].lat);
                lngs.push(data[i].lng);
            }

            if (data.length === 1) {
                map.setCenter(new google.maps.LatLng(data[0].lat, data[0].lng));
                map.setZoom(options.initZoomLevel);
            } else {
                // Calculate center and zoom level for map when show all markers
                var minLat = Math.min.apply(Math, lats);
                var maxLat = Math.max.apply(Math, lats);
                var minLng = Math.min.apply(Math, lngs);
                var maxLng = Math.max.apply(Math, lngs);

                map.fitBounds(new google.maps.LatLngBounds(
                    new google.maps.LatLng(minLat, minLng),
                    new google.maps.LatLng(maxLat, maxLng)
                ));
            }
        },

        createDataItem: function (markerData) {
            flog('[jquery.orgFinder] createDataItem', markerData);

            var self = this;
            var options = self.options;
            var map = self.map;
            var itemsWrapper = self.itemsWrapper;

            var latlng = new google.maps.LatLng(markerData.lat, markerData.lng);
            var marker = new google.maps.Marker({
                position: latlng,
                animation: google.maps.Animation.DROP,
                title: markerData.orgTypeDisplayName || markerData.title
            });
            marker.setMap(map);
            flog('[jquery.orgFinder] Marker', marker);

            if (typeof options.renderItemContent !== 'function') {
                $.error('[jquery.orgFinder] renderItemContent is not function. Please correct it!');
            }

            if (typeof options.renderMarkerContent !== 'function') {
                $.error('[jquery.orgFinder] renderMarkerContent is not function. Please correct it!');
            }

            var itemContent = options.renderItemContent(markerData) || '';
            var markerContent = options.renderMarkerContent(markerData) || '';

            if (itemContent.length === 0 || markerContent.length === 0) {
                flog('[jquery.orgFinder] Item content or Marker content is empty. Skipped on creating!');
            } else {
                flog('[jquery.orgFinder] Creating infoWindow and item');

                var infoWindow = new google.maps.InfoWindow({
                    content: markerContent
                });
                flog('[jquery.orgFinder] Info window', infoWindow);

                var item = $(itemContent);
                itemsWrapper.append(item);
                flog('[jquery.orgFinder] Item', item);

                var clickEventHandler = function (doScroll) {
                    if (self.activeInfoWidow) {
                        self.activeInfoWidow.close();
                    }
                    itemsWrapper.find('.active').removeClass('active');
                    infoWindow.open(map, marker);
                    self.activeInfoWidow = infoWindow;
                    item.addClass('active');

                    if (doScroll) {
                        itemsWrapper.scrollTo(item);
                    }

                    if (typeof options.onSelect === 'function') {
                        options.onSelect.call(self, markerData, item, marker, infoWindow);
                    }
                };

                marker.addListener('click', function () {
                    flog('[jquery.orgFinder] Clicked on marker', marker);

                    clickEventHandler(true);
                });

                item.on('click', function (e) {
                    e.preventDefault();
                    flog('[jquery.orgFinder] Clicked on item', item);

                    clickEventHandler(false);
                });

                self.markers.push(marker);
                self.infoWindows.push(infoWindow);
                self.listItems.push(item);
            }
        }
    };

    var methods = {
        init: function (options) {
            options = $.extend({}, $.fn.orgFinder.DEFAULT, options);

            if (options.googleAPIKey === null || options.googleAPIKey === undefined || options.googleAPIKey.trim() === '') {
                $.error('[jquery.orgFinder] Google API Key is empty!');
            }

            $(this).each(function () {
                var container = $(this);
                if (!container.data('orgFinder')) {
                    var finder = new Finder(container, options);
                    container.data('orgFinder', finder);
                }
            });
        }
    };

})(jQuery);
