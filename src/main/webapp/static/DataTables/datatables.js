/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs/dt-1.10.10,e-1.5.4,r-2.0.0,se-1.1.0
 *
 * Included libraries:
 *   DataTables 1.10.10, Editor 1.5.4, Responsive 2.0.0, Select 1.1.0
 */

/*! DataTables 1.10.10
 * ©2008-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.10
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2008-2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable;

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	var _re_date_start = /^[\w\+\-]/;
	var _re_date_end = /[\w\+\-]$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		var defaults = DataTable.defaults.oLanguage;
		var zeroRecords = lang.sZeroRecords;
	
		/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
		 * sZeroRecords - assuming that is given.
		 */
		if ( ! lang.sEmptyTable && zeroRecords &&
			defaults.sEmptyTable === "No data available in table" )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
		}
	
		/* Likewise with loading records */
		if ( ! lang.sLoadingRecords && zeroRecords &&
			defaults.sLoadingRecords === "Loading..." )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
		}
	
		// Old parameter name of the thousands separator mapped onto the new
		if ( lang.sInfoThousands ) {
			lang.sThousands = lang.sInfoThousands;
		}
	
		var decimal = lang.sDecimal;
		if ( decimal ) {
			_addNumericSort( decimal );
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( dataSort && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: 0,
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		return _fnGetColumns( oSettings, 'bVisible' ).length;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		/* When the data source is null, we can use default column data */
		if ( (cellData === rowData || cellData === null) && defaultContent !== null ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( !nTrIn || oCol.mRender || oCol.mData !== i )
				{
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = $.isFunction( ajaxData ) ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = $.isFunction( ajaxData ) && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( $.isFunction( ajax ) )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.bind(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.bind( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=display.length-1 ; i>=0 ; i-- ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( ! rpSearch.test( data ) ) {
				display.splice( i, 1 );
			}
		}
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=display.length-1 ; i>=0 ; i-- ) {
				if ( ! rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					display.splice( i, 1 );
				}
			}
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	function _fnEscapeRegex ( sVal )
	{
		return sVal.replace( _re_escape_regex, '\\$1' );
	}
	
	
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option( language[i], lengths[i] );
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.bind( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).bind( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			nToSize.style.width = headerWidths[i];
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+headerContent[i]+'</div>';
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = "";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).bind('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	function _fnThrottle( fn, freq ) {
		var
			frequency = freq !== undefined ? freq : 200,
			last,
			timer;
	
		return function () {
			var
				that = this,
				now  = +new Date(),
				args = arguments;
	
			if ( last && now < last + frequency ) {
				clearTimeout( timer );
	
				timer = setTimeout( function () {
					last = undefined;
					fn.apply( that, args );
				}, frequency );
			}
			else {
				last = now;
				fn.apply( that, args );
			}
		};
	}
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit )
	{
		var i, ien;
		var columns = settings.aoColumns;
	
		if ( ! settings.oFeatures.bStateSave ) {
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings );
		if ( ! state || ! state.time ) {
			return;
		}
	
		/* Allow custom and plug-in manipulation functions to alter the saved data set and
		 * cancelling of loading by returning false
		 */
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, state] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			return;
		}
	
		/* Reject old data */
		var duration = settings.iStateDuration;
		if ( duration > 0 && state.time < +new Date() - (duration*1000) ) {
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( columns.length !== state.columns.length ) {
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, state );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( state.start !== undefined ) {
			settings._iDisplayStart    = state.start;
			settings.iInitDisplayStart = state.start;
		}
		if ( state.length !== undefined ) {
			settings._iDisplayLength   = state.length;
		}
	
		// Order
		if ( state.order !== undefined ) {
			settings.aaSorting = [];
			$.each( state.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( state.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( state.search ) );
		}
	
		// Columns
		for ( i=0, ien=state.columns.length ; i<ien ; i++ ) {
			var col = state.columns[i];
	
			// Visibility
			if ( col.visible !== undefined ) {
				columns[i].bVisible = col.visible;
			}
	
			// Search
			if ( col.search !== undefined ) {
				$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
			}
		}
	
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, state] );
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.bind( 'click.DT', oData, function (e) {
					n.blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.bind( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.bind( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	DataTable = function( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).bind('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if ( s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this) )
				{
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			
			if ( oInit.oLanguage )
			{
				_fnLanguageCompat( oInit.oLanguage );
			}
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ],
				[ "bJQueryUI", "bJUI" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			// @todo Remove in 1.11
			if ( oInit.bJQueryUI )
			{
				/* Use the JUI classes object for display. You could clone the oStdClasses object if
				 * you want to have multiple tables with multiple independent classes
				 */
				$.extend( oClasses, DataTable.ext.oJUIClasses, oInit.oClasses );
			
				if ( oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip" )
				{
					/* Set the DOM to use a layout suitable for jQuery UI's theming */
					oSettings.sDom = '<"H"lfr>t<"F"ip>';
				}
			
				if ( ! oSettings.renderer ) {
					oSettings.renderer = 'jqueryui';
				}
				else if ( $.isPlainObject( oSettings.renderer ) && ! oSettings.renderer.header ) {
					oSettings.renderer.header = 'jqueryui';
				}
			}
			else
			{
				$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			}
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl !== "" )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit );
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
			}
			
			
			/*
			 * Sorting
			 * @todo For modularisation (1.11) this needs to do into a sort start up handler
			 */
			
			// If aaSorting is not defined, then we use the first indicator in asSorting
			// in case that has been altered, so the default sort reflects that option
			if ( oInit.aaSorting === undefined )
			{
				var sorting = oSettings.aaSorting;
				for ( i=0, iLen=sorting.length ; i<iLen ; i++ )
				{
					sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
				}
			}
			
			/* Do a first pass on the sorting classes (allows any size changes to be taken into
			 * account, and also will apply sorting disabled classes if disabled
			 */
			_fnSortingClasses( oSettings );
			
			if ( features.bSort )
			{
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted ) {
						var aSort = _fnSortFlatten( oSettings );
						var sortedColumns = {};
			
						$.each( aSort, function (i, val) {
							sortedColumns[ val.src ] = val.dir;
						} );
			
						_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
						_fnSortAria( oSettings );
					}
				} );
			}
			
			_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
				if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
					_fnSortingClasses( oSettings );
				}
			}, 'sc' );
			
			
			/*
			 * Final init
			 * Cache the header, body and footer as required, creating them if needed
			 */
			
			// Work around for Webkit bug 83867 - store the caption-side before removing from doc
			var captions = $this.children('caption').each( function () {
				this._captionSide = $this.css('caption-side');
			} );
			
			var thead = $this.children('thead');
			if ( thead.length === 0 )
			{
				thead = $('<thead/>').appendTo(this);
			}
			oSettings.nTHead = thead[0];
			
			var tbody = $this.children('tbody');
			if ( tbody.length === 0 )
			{
				tbody = $('<tbody/>').appendTo(this);
			}
			oSettings.nTBody = tbody[0];
			
			var tfoot = $this.children('tfoot');
			if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
			{
				// If we are a scrolling table, and no footer has been given, then we need to create
				// a tfoot element for the caption element to be appended to
				tfoot = $('<tfoot/>').appendTo(this);
			}
			
			if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
				$this.addClass( oClasses.sNoFooter );
			}
			else if ( tfoot.length > 0 ) {
				oSettings.nTFoot = tfoot[0];
				_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
			}
			
			/* Check if there is data passing into the constructor */
			if ( oInit.aaData )
			{
				for ( i=0 ; i<oInit.aaData.length ; i++ )
				{
					_fnAddData( oSettings, oInit.aaData[ i ] );
				}
			}
			else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' )
			{
				/* Grab the data from the page - only do this when deferred loading or no Ajax
				 * source since there is no point in reading the DOM data if we are then going
				 * to replace it with Ajax data
				 */
				_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
			}
			
			/* Copy the data index array */
			oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
			/* Initialisation complete - table can be drawn */
			oSettings.bInitialised = true;
			
			/* Check if we need to initialise the table (it might not have been handed off to the
			 * language processor)
			 */
			if ( bInitHandedOff === false )
			{
				_fnInitialise( oSettings );
			}
		} );
		_that = null;
		return this;
	};

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			a = selector[i] && selector[i].split ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			a = search == 'none' ?
				displayMaster.slice() :                      // no search
				search == 'applied' ?
					displayFiltered.slice() :                // applied search
					$.map( displayMaster, function (el, i) { // removed search
						return $.inArray( el, displayFiltered ) === -1 ? el : null;
					} );
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	
	
	var __row_selector = function ( settings, selector, opts )
	{
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			var rows = _selector_row_indexes( settings, opts );
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( ! sel ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = settings.aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - node
			if ( sel.nodeName ) {
				if ( $.inArray( sel, nodes ) !== -1 ) {
					return [ sel._DT_RowIndex ]; // sel is a TR node that is in the table
					                             // and DataTables adds a prop for fast lookup
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		ctx[0].aoData[ this[0] ]._aData = data;
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.remove();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^(.+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
			
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
			
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
				}
			}
			else {
				// jQuery selector on the TH elements for the columns
				return $( nodes )
					.filter( s )
					.map( function () {
						return $.inArray( this, nodes ); // `nodes` is column index complete and in order
					} )
					.toArray();
			}
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis, recalc ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		if ( recalc === undefined || recalc ) {
			// Automatically adjust column sizing
			_fnAdjustColumnSizing( settings );
	
			// Realign columns for scrolling
			if ( settings.oScroll.sX || settings.oScroll.sY ) {
				_fnScrollDraw( settings );
			}
		}
	
		_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, recalc] );
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		return this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis, calc );
		} );
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				return [s];
			}
	
			// Selector - jQuery filtered cells
			return allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector, opts );
		var rows = this.rows( rowSelector, opts );
		var a, i, ien, j, jen;
	
		var cells = this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var cells = settings.aoData[ row ].anCells;
			return cells ?
				cells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: _fnThrottle,
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} sVal string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: _fnEscapeRegex
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			if ( ! args[0].match(/\.dt\b/) ) {
				args[0] += '.dt';
			}
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT');
			$(window).unbind('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			if ( settings.bJUI ) {
				$('th span.'+classes.sSortIcon+ ', td span.'+classes.sSortIcon, thead).detach();
				$('th, td', thead).each( function () {
					var wrapper = $('div.'+classes.sSortJUIWrapper, this);
					$(this).append( wrapper.contents() );
					wrapper.detach();
				} );
			}
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.10";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Enable jQuery UI ThemeRoller support (required as ThemeRoller requires some
		 * slightly different and additional mark-up from what DataTables has
		 * traditionally used).
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.jQueryUI
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "jQueryUI": true
		 *      } );
		 *    } );
		 */
		"bJQueryUI": false,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings) {
		 *          var o;
		 *
		 *          // Send an Ajax request to the server to get the data. Note that
		 *          // this is a synchronous request.
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "async": false,
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              o = json;
		 *            }
		 *          } );
		 *
		 *          return o;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features four different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus
		 *   page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "platform.details.0" },
		 *          { "data": "platform.details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * Flag to indicate if jQuery UI marking and classes should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bJUI": null,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs/dt-1.10.10,e-1.5.4,r-2.0.0,se-1.1.0",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! $.isNumeric( data.substring(1) ) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	(function() {
	
	// Reused strings for better compression. Closure compiler appears to have a
	// weird edge case where it is trying to expand strings rather than use the
	// variable version. This results in about 200 bytes being added, for very
	// little preference benefit since it this run on script load only.
	var _empty = '';
	_empty = '';
	
	var _stateDefault = _empty + 'ui-state-default';
	var _sortIcon     = _empty + 'css_right ui-icon ui-icon-';
	var _headerFooter = _empty + 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix';
	
	$.extend( DataTable.ext.oJUIClasses, DataTable.ext.classes, {
		/* Full numbers paging buttons */
		"sPageButton":         "fg-button ui-button "+_stateDefault,
		"sPageButtonActive":   "ui-state-disabled",
		"sPageButtonDisabled": "ui-state-disabled",
	
		/* Features */
		"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
			"ui-buttonset-multi paging_", /* Note that the type is postfixed */
	
		/* Sorting */
		"sSortAsc":            _stateDefault+" sorting_asc",
		"sSortDesc":           _stateDefault+" sorting_desc",
		"sSortable":           _stateDefault+" sorting",
		"sSortableAsc":        _stateDefault+" sorting_asc_disabled",
		"sSortableDesc":       _stateDefault+" sorting_desc_disabled",
		"sSortableNone":       _stateDefault+" sorting_disabled",
		"sSortJUIAsc":         _sortIcon+"triangle-1-n",
		"sSortJUIDesc":        _sortIcon+"triangle-1-s",
		"sSortJUI":            _sortIcon+"carat-2-n-s",
		"sSortJUIAscAllowed":  _sortIcon+"carat-1-n",
		"sSortJUIDescAllowed": _sortIcon+"carat-1-s",
		"sSortJUIWrapper":     "DataTables_sort_wrapper",
		"sSortIcon":           "DataTables_sort_icon",
	
		/* Scrolling */
		"sScrollHead": "dataTables_scrollHead "+_stateDefault,
		"sScrollFoot": "dataTables_scrollFoot "+_stateDefault,
	
		/* Misc */
		"sHeaderTH":  _stateDefault,
		"sFooterTH":  _stateDefault,
		"sJUIHeader": _headerFooter+" ui-corner-tl ui-corner-tr",
		"sJUIFooter": _headerFooter+" ui-corner-bl ui-corner-br"
	} );
	
	}());
	
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 will remove any unknown characters at the start and end of the
			// expression, leading to false matches such as `$245.12` or `10%` being
			// a valid date. See forum thread 18941 for detail.
			if ( d && !(d instanceof Date) && ( ! _re_date_start.test(d) || ! _re_date_end.test(d) ) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			return Date.parse( d ) || 0;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately
					if ( isNaN( flo ) ) {
						return d;
					}
	
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: function ( d ) {
					return typeof d === 'string' ?
						d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
						d;
				}
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
	sFilterInput:  "form-control input-sm",
	sLengthSelect: "form-control input-sm",
	sProcessing:   "dataTables_processing panel panel-default"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn btn-default",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible drop down
	$.extend( true, DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}


return DataTable;
}));

/*!
 * File:        dataTables.editor.min.js
 * Version:     1.5.4
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2016 SpryMedia, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */
(function(){

// Please note that this message is for information only, it does not effect the
// running of the Editor script below, which will stop executing after the
// expiry date. For documentation, purchasing options and more information about
// Editor, please see https://editor.datatables.net .
var remaining = Math.ceil(
	(new Date( 1455667200 * 1000 ).getTime() - new Date().getTime()) / (1000*60*60*24)
);

if ( remaining <= 0 ) {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
	throw 'Editor - Trial expired';
}
else if ( remaining <= 7 ) {
	console.log(
		'DataTables Editor trial info - '+remaining+
		' day'+(remaining===1 ? '' : 's')+' remaining'
	);
}

})();
var C7Z={'G2h':"j",'c0h':"s",'l8h':"n",'Q6':"a",'U8':"at",'M7':"Tabl",'F4h':"u",'F0c':"les",'w6':"b",'t4r':(function(a4r){return (function(k4r,N4r){return (function(e4r){return {j4r:e4r,o0r:e4r,}
;}
)(function(X4r){var p4r,q4r=0;for(var x4r=k4r;q4r<X4r["length"];q4r++){var b4r=N4r(X4r,q4r);p4r=q4r===0?b4r:p4r^b4r;}
return p4r?x4r:!x4r;}
);}
)((function(L4r,s4r,E4r,O4r){var i4r=29;return L4r(a4r,i4r)-O4r(s4r,E4r)>i4r;}
)(parseInt,Date,(function(s4r){return (''+s4r)["substring"](1,(s4r+'')["length"]-1);}
)('_getTime2'),function(s4r,E4r){return new s4r()[E4r]();}
),function(X4r,q4r){var T4r=parseInt(X4r["charAt"](q4r),16)["toString"](2);return T4r["charAt"](T4r["length"]-1);}
);}
)('2qb6g64ej'),'V7':"e",'C8h':"q",'A7c':"table",'N6':"or",'e8c':"tion",'W7':"er",'I4c':".",'D9':"et",'u1c':"nc",'p5h':"f",'X3h':"y",'a2c':"ect",'i6':"d",'R4h':"t",'D4h':"fn"}
;C7Z.x0r=function(n){for(;C7Z;)return C7Z.t4r.j4r(n);}
;C7Z.b0r=function(i){if(C7Z&&i)return C7Z.t4r.o0r(i);}
;C7Z.p0r=function(g){while(g)return C7Z.t4r.o0r(g);}
;C7Z.L0r=function(f){while(f)return C7Z.t4r.o0r(f);}
;C7Z.a0r=function(l){if(C7Z&&l)return C7Z.t4r.j4r(l);}
;C7Z.s0r=function(d){if(C7Z&&d)return C7Z.t4r.j4r(d);}
;C7Z.E0r=function(c){while(c)return C7Z.t4r.j4r(c);}
;C7Z.q0r=function(n){while(n)return C7Z.t4r.o0r(n);}
;C7Z.X0r=function(a){if(C7Z&&a)return C7Z.t4r.j4r(a);}
;C7Z.j0r=function(g){for(;C7Z;)return C7Z.t4r.j4r(g);}
;C7Z.t0r=function(e){if(C7Z&&e)return C7Z.t4r.o0r(e);}
;C7Z.F0r=function(j){if(C7Z&&j)return C7Z.t4r.o0r(j);}
;C7Z.y0r=function(h){for(;C7Z;)return C7Z.t4r.o0r(h);}
;C7Z.W0r=function(a){if(C7Z&&a)return C7Z.t4r.o0r(a);}
;C7Z.u0r=function(e){for(;C7Z;)return C7Z.t4r.j4r(e);}
;C7Z.c0r=function(k){if(C7Z&&k)return C7Z.t4r.j4r(k);}
;C7Z.m0r=function(a){for(;C7Z;)return C7Z.t4r.j4r(a);}
;C7Z.J0r=function(a){while(a)return C7Z.t4r.j4r(a);}
;C7Z.Y0r=function(e){if(C7Z&&e)return C7Z.t4r.o0r(e);}
;C7Z.A0r=function(b){for(;C7Z;)return C7Z.t4r.o0r(b);}
;C7Z.l0r=function(l){for(;C7Z;)return C7Z.t4r.j4r(l);}
;C7Z.G0r=function(f){while(f)return C7Z.t4r.o0r(f);}
;C7Z.r0r=function(d){for(;C7Z;)return C7Z.t4r.j4r(d);}
;C7Z.Q0r=function(b){while(b)return C7Z.t4r.j4r(b);}
;C7Z.g0r=function(m){if(C7Z&&m)return C7Z.t4r.o0r(m);}
;C7Z.h0r=function(i){for(;C7Z;)return C7Z.t4r.o0r(i);}
;C7Z.z0r=function(i){while(i)return C7Z.t4r.o0r(i);}
;C7Z.H0r=function(e){while(e)return C7Z.t4r.j4r(e);}
;C7Z.K0r=function(m){while(m)return C7Z.t4r.o0r(m);}
;C7Z.M0r=function(e){if(C7Z&&e)return C7Z.t4r.o0r(e);}
;C7Z.f0r=function(l){for(;C7Z;)return C7Z.t4r.j4r(l);}
;C7Z.U0r=function(i){while(i)return C7Z.t4r.j4r(i);}
;(function(d){C7Z.C0r=function(f){for(;C7Z;)return C7Z.t4r.o0r(f);}
;C7Z.V0r=function(h){if(C7Z&&h)return C7Z.t4r.j4r(h);}
;C7Z.w0r=function(l){while(l)return C7Z.t4r.o0r(l);}
;var x9=C7Z.U0r("d3")?"appendChild":"xp",X2h=C7Z.f0r("84")?"RFC_2822":"obj",K8B=C7Z.w0r("aa")?"offset":"md";(C7Z.p5h+C7Z.F4h+C7Z.u1c+C7Z.e8c)===typeof define&&define[(C7Z.Q6+K8B)]?define([(C7Z.G2h+C7Z.C8h+C7Z.F4h+C7Z.W7+C7Z.X3h),(C7Z.i6+C7Z.Q6+C7Z.R4h+C7Z.Q6+C7Z.A7c+C7Z.c0h+C7Z.I4c+C7Z.l8h+C7Z.V7+C7Z.R4h)],function(p){return d(p,window,document);}
):(X2h+C7Z.a2c)===typeof exports?module[(C7Z.V7+x9+C7Z.N6+C7Z.R4h+C7Z.c0h)]=function(p,r){var l8B=C7Z.M0r("5f")?"getDate":"document",o5c=C7Z.V0r("75e5")?"$":"postUpdate";p||(p=window);if(!r||!r[(C7Z.D4h)][(C7Z.i6+C7Z.U8+C7Z.Q6+C7Z.M7+C7Z.V7)])r=C7Z.C0r("d1e3")?require((C7Z.i6+C7Z.U8+C7Z.U8+C7Z.Q6+C7Z.w6+C7Z.F0c+C7Z.I4c+C7Z.l8h+C7Z.D9))(p,r)[o5c]:4;return d(r,p,p[l8B]);}
:d(jQuery,window,document);}
)(function(d,p,r,h){C7Z.N0r=function(f){if(C7Z&&f)return C7Z.t4r.j4r(f);}
;C7Z.O0r=function(g){if(C7Z&&g)return C7Z.t4r.o0r(g);}
;C7Z.i0r=function(f){for(;C7Z;)return C7Z.t4r.j4r(f);}
;C7Z.T0r=function(j){while(j)return C7Z.t4r.o0r(j);}
;C7Z.R0r=function(d){if(C7Z&&d)return C7Z.t4r.j4r(d);}
;C7Z.I0r=function(d){while(d)return C7Z.t4r.o0r(d);}
;C7Z.d0r=function(a){for(;C7Z;)return C7Z.t4r.o0r(a);}
;C7Z.P0r=function(l){if(C7Z&&l)return C7Z.t4r.j4r(l);}
;C7Z.B0r=function(l){for(;C7Z;)return C7Z.t4r.o0r(l);}
;C7Z.S0r=function(m){if(C7Z&&m)return C7Z.t4r.j4r(m);}
;C7Z.v0r=function(a){for(;C7Z;)return C7Z.t4r.j4r(a);}
;C7Z.n0r=function(g){if(C7Z&&g)return C7Z.t4r.j4r(g);}
;C7Z.D0r=function(e){for(;C7Z;)return C7Z.t4r.j4r(e);}
;var P4B=C7Z.K0r("d18")?"buttons-remove":"1.5.4",j5c=C7Z.H0r("8b71")?"rsio":"total",O9B=C7Z.D0r("84")?"multiple":"Editor",d0c=C7Z.n0r("72")?"rFiel":"_constructor",N7="Type",r2h="editorFields",K2c="uplo",k6c=C7Z.v0r("28")?"_multiInfo":"div.rendered",l9h=C7Z.z0r("cf")?"_picker":"Event",h7B=C7Z.S0r("a581")?"prop":"icker",x7c=C7Z.h0r("7fff")?"_lastSet":"ker",A8c="tep",u2c=C7Z.B0r("febe")?"post":"#",W9c="_va",a0B="checked",B9h=C7Z.g0r("18bb")?" />":'<td class="',O1B="radio",m5h="prop",T9h=C7Z.Q0r("13b8")?"rat":"formContent",v5c="_in",a6c="checkbox",u8=C7Z.P0r("7a7a")?"TableTools":"optionsPair",b7B=C7Z.r0r("f1")?"editor_remove":"pairs",j4="kb",A6B=C7Z.G0r("42b7")?"editData":"multiple",H2B="_v",u5c="_addOptions",B3B=C7Z.l0r("3f8")?"status":"_a",z9B="placeholder",m6B="select",P7B="eId",T5B="tend",Q3B="sswo",J4="_inp",h2c="attr",P1c="/>",f0h="readonly",J3=C7Z.A0r("45")?"_val":"fn",D1h=false,N0c=C7Z.Y0r("63")?"abled":"arguments",S8B="_i",N4c="_inpu",J8c="eldType",v2B=C7Z.J0r("fb")?"Math":"els",E0c="pes",f4h=C7Z.m0r("75d")?"div.clearValue button":"preventDefault",j6c=C7Z.d0r("5aea")?"_input":"getUTCMinutes",w9="datetime",y3c="ults",R9="edito",V0=C7Z.I0r("87")?"fa":"info",b9B="ampm",H5B="npu",E6B="getFullYear",S9h='alue',t4c=C7Z.c0r("dcf")?"data":"text",C0B=C7Z.u0r("15d3")?"footer":"fix",w9h="getU",G1B="year",C5B='ype',a7c="selected",w0h="disabled",N3=C7Z.W0r("d3e")?"toLowerCase":"scr",U5B=C7Z.y0r("ad84")?"namespace":"arguments",M2B="lYe",f5B=C7Z.R0r("5e36")?"uploadMany":"getUTCMonth",P2c="pag",O3="TC",f3h="Ti",i2h="led",C2=C7Z.F0r("28fd")?"dataSource":"inpu",k6B="last",Q9c=C7Z.t0r("c43")?"hours12":"?",B6c="parts",N7c="par",M9B="_setTime",O3c=C7Z.j0r("531b")?"separator":"_set",g4h="play",C4c="input",k5=C7Z.T0r("352")?"pairs":"tS",D4c="mom",z7B="UTC",z1h="etC",o0=C7Z.X0r("d7c")?"column":"itle",B6h="pt",T0B=C7Z.q0r("bd46")?"_blur":"_o",X8h="_setCalander",C5=C7Z.E0r("22")?"init":"Date",d0="of",s7c="inp",n8="date",H3B="format",W5h="_instance",z8B="DateTime",n5B="fin",f4=C7Z.s0r("54")?"></":"</div></div></div>",s3c=C7Z.i0r("c7e")?"</":"hours",T1h=C7Z.a0r("e75")?"getMonth":"pm",w8c="tes",V7c=">",q7c="<",B8c="hours",l2=C7Z.L0r("fb")?"focus.editor-focus":'el',o1='utt',w2c=C7Z.O0r("a4ba")?'ass':"div.DTE_Bubble_Liner",N5="YY",G1="Y",x1B=C7Z.p0r("8677")?"multiRestore":"eti",S3c="YYYY-MM-DD",M3c=C7Z.b0r("33")?"info":"ome",Z3c="classPrefix",h9=C7Z.N0r("d3")?"getUTCMonth":"ateT",V6="Types",E4="sa",M7B=C7Z.x0r("1f17")?"orientation":"sel",B4r="8",o6="editor",S1c="confirm",n4B="exten",M3="_remove",I8h="formButtons",k7c="fnGetSelectedIndexes",G1h="gl",d1c="_sin",a1h="dito",N8c="BUTTONS",R2h="eT",K6c="ckgrou",y7c="ubb",C9h="DTE_",N1B="Tri",q3c="_C",b9c="Bub",M9h="DTE_Bubbl",W8c="Bu",X0h="_Acti",s6="store",Q8c="_I",R6B="sag",L1B="E_",D3c="_E",e7c="l_I",L1c="TE_L",y2="eld_In",L0="Fi",s7h="_Labe",E8B="_Name",S9="btn",S2h="rm_",J5c="DTE_F",a6="ooter_Co",v6h="Foo",W0B="DTE",o9c="cessi",K8c="DTE_P",d1h="g_I",l1B="ssin",v0="oce",p7="]",f3="[",G2="data",h1c="be",l6h='dit',t2h="tm",A4h="Src",n4h="Ob",V0B="oApi",H7="rowIds",b2c="dSr",p3B="ide",o3="Se",S0c="rows",d4="columns",n9c="DataTable",Q1="Ge",B7="_fn",b8c="sC",k1B="idSrc",N2h="aT",T4c="att",N3c="ica",t0="mat",H6B="mn",J7c="ell",p9B="xes",I8B="cells",K5c="indexes",z7h=20,r5=500,d2B="our",f9="ataS",h6='[data-editor-id="',M6="keyless",b1B="formOp",C1c="bas",m3="dels",u9B="hu",V0h="pli",E1B="mb",M6B="ovem",L9c="ber",U5c="tem",t9B="ugu",o6B="pri",I5B="ebruar",w2="J",h1="evio",k9c="hang",S5="Und",t6="ues",E8c="dual",G0="heir",C1="rwis",k3="ere",E7B="ame",c1c="his",n9="nput",d1B="ffer",q4B="ontai",W7c="ted",H8h="ec",D8="The",X9h="ltip",w4B='>).',u0='io',S0h='mat',a1='M',B4='2',f8='1',r0='/',y0='.',f0B='tatabl',Z4r='="//',z5='ef',E1h='k',I9h='blan',j8B='rge',F5c=' (<',i9='red',A5B='ccu',W8h='rr',O2='em',r2c='yst',q9='A',w1c="ele",i6c="?",u2=" %",O5c="ish",w6B="ure",b1h="Are",L4h="rea",w4r="Ne",t5c="_R",l3B="defa",I7h=10,P3c="submitComplete",G4r="lete",p6B="mp",T8="dat",s8="isEmptyObject",t3h="any",P6h="able",U4="removeClass",W6B="addClass",y7B="ces",C0c="options",R0="M",G9h=": ",G4B="eI",T0="ke",t2="utto",K7B="ttr",y8c="ode",e2="ey",g2c="editCount",g7h="tu",a9c="mpl",a4c="str",Y5="toLowerCase",W0c="match",A9="inArray",y2h="ush",L1h="eac",a3c="includeFields",r8c="ields",Z6B="ont",q8c="taS",X7B="main",P7c="boolean",I3c="sP",H5h="seCb",Z2="onBlur",O6="ep",w3="Of",b4="reate",R6="jo",c5B="editFields",t8="Clas",Y4c="emov",x5B="cr",y9c="eCl",S7c="processing",u9h="yCo",b0c="orm",t7h="TableTools",u7c='tto',F6='ea',K6h="for",b0B='or',F7B='y',d4h="cla",t1="dataTable",K0B="taSo",m2c="rc",h3B="ajax",J5h="ajaxUrl",m1h="status",M0="ror",z1c="rs",q7h="eS",O9="ff",S0="oa",Q6c="Up",J3h="TE_",q9h="aja",d5c="ja",J6B="Da",I1h="jax",e6="upload",E2c="loa",B1="af",j8h="ea",B4c="value",a2="ray",c9h="pair",z4h="files",f6B="fil",s0c="cells().edit()",U2B="isP",f9h="rows().delete()",h1h="remove",l0c="elet",Y7c="().",N4B="edit",a9h="row().edit()",f7c="()",l8="ito",s3B="Api",G7h="pu",v4B="ach",G6="button",A0="dit",R7="_event",m4r="_ev",a5="_actionClass",d6="em",g4c="ove",y5h="rem",z3c="na",p4h="join",n3="ai",I0B="_p",a8="appe",L2c="rd",Z3B="one",k9B="_eventName",J7B="multiSet",h3="Get",z9h="multiGet",h3h="lds",t0h="focus",t4="ocus",P0="ar",J1h="eF",Q0B="mi",T="lear",K3="eg",h4B="clo",k4h="e_",I1c="_In",k8="tons",h5c='"/></',Q4r="inline",x7h="E_F",K5h="ha",p3="atta",G3c="han",w7B="Ca",Y8c="vi",F0B="ndi",L1="_dataSource",H4="xte",P5B="isPlainObject",F3c=":",A1c="rr",q6="isArray",g1c="eld",y4="Op",t3="_assembleMain",B5B="ain",n1B="ce",x0c="rg",N1h="_tidy",I5h="lle",z4="map",n2c="open",a6B="displayed",B0B="disable",e0="N",f2B="ield",d2="ax",c3="aj",X8B="url",L7c="bj",Z1h="ws",i7="ow",F6h="put",r3="fiel",g5B="up",q0B="da",F3="U",c6B="pre",j5h="ang",E5c="exte",Z4c="son",d6h="eO",K2="yb",q0="pti",H6="_fo",l2h="eat",F4c="eve",T7h="rder",n7="eo",E9B="_di",S5B="block",X7c="modifier",F2h="ds",S2B="Fiel",v1c="number",r4h="create",R5c="_close",R3h="_fieldNames",f7h="To",K2h="call",Z3h="ent",j8="preventDefault",T7B="keyCode",W1B="eyCo",C7h=13,y1c="Na",c8="ass",O8B="ton",S4r="form",i2c="string",f1="buttons",O7B="Arra",W4r="submit",l6B="action",s0="8n",O3h="i1",H8c="dCl",v4h="W",P1B="set",d1="eft",m9h="offset",D4B="ub",K9c="B",i0="bble",e4c="pen",A0B="post",J2B="cu",u8B="elds",g1B="off",U4c="_closeReg",l9B="add",E3c="but",D2h="end",W4c="formInfo",m7h="ren",k0c="app",b7c='" /></',R9c="tab",W2B='"><div class="',h6h='<div class="',m4c="Opt",P0c="rm",Q1B="_f",Y4B="pr",X2c="bubble",u3h="_edit",q2B="ur",a4="S",h6B="_da",P8="O",C6B="nO",W4="bub",C7c="bm",g9="su",P="mit",Y9="sub",Q0="blur",D1="editOpts",u5B="_displayReorder",V4c="order",B2h="field",V9B="sse",H1c="it",J9c="A",i8c="ng",S6h="fields",Q9="ion",w7h=". ",F6B="ing",D6c="Er",X9="ad",o1h=50,A1B="ve",A1="disp",n6c=';</',x1='im',I1='">&',O6c='elo',T0h='ro',Y4h='elope_Back',Y0h='nv',E0h='nta',T6='C',w1h='lope_',h0c='ht',k2c='wR',r0h='S',c4c='nve',N6h='f',Y2h='wLe',Z5c='had',e0c='_S',x5h='ope',r4r='ve',X5c='_En',X='er',K7c='Wra',E7='vel',d7='_E',M4r="node",U6="modi",A8="row",x1h="cti",i3="header",x7="ab",c3h="attach",S="Ta",j5="H",A3c="_B",U8h="hi",Q2B="ind",E0B="target",E9c="iv",J7h="gr",N3B="con",C8c="offsetHeight",B9="ate",v0c=",",O0="tml",T1B="onf",O2c="fadeIn",W5="splay",M6h="pa",y3="ei",M1c="find",H2="ock",O9c="spl",U3B="opacity",K1B="_do",Z1c="ne",u0h="back",U4r="_cssBackgroundOpacity",T2="hidden",x8B="style",D1c="wra",i7c="pend",k5h="bod",B2c="body",u6h="iner",w3B="Co",j9c="elo",Y2c="nv",U9="_hide",h0="ose",c0B="il",Q4c="dC",Y8h="nte",k8h="ll",m6h="tr",X0B="layC",z6c="model",H0="vel",q6h=25,T3h="ligh",s6h='se',G8h='_Cl',T3='bo',u0B='ght',D8c='TED',q5c='/></',N9c='un',R5B='Backgr',K1c='tbox_',l5c='_L',J7='>',O8h='nte',V1B='Co',j9B='gh',c5c='pp',Z9='ra',n6h='W',I6B='on',p6='_C',n9h='b',m9c='Ligh',F9h='_',Z2c='ED',D3B='ntaine',O2h='_Co',J8B='ox',x7B='ightb',Y1='L',N6B='pe',j1h='ox_W',r5B='htb',h2B='Lig',r5c='D_',p2h='TE',x5c="ze",w4h="unbind",b5B="un",m9="ou",E3h="kgr",P9="ac",L9="det",f4r="im",o4="an",j1c="detach",D7B="animate",r0B="top",D3h="eC",e5B="appendTo",T1c="children",l1c="tio",o2c="ten",h1B="_Con",D2B="_Bod",e4h="outerHeight",M8c="per",E2h="E_H",z4B='"/>',l7B='x',c4B='h',Q7='E',U0h='T',U7='D',h5h="dy",h9B="scrollTop",U9c="_scrollTop",o3B="_h",g3h="z",Y1c="t_Wra",G0B="DT",d9B="hasClass",j2="get",m8B="ig",c7c="bind",z1B="_Li",H3="TE",W6c="grou",K3h="ack",k5c="bo",V8="gh",Y7="TED_",S8c="ick",u7="ox",D9c="ight",t7="TED",K5B="ic",q0c="clos",l6c="stop",v8h="ound",y8="kg",a1c="_heightCalc",c8h="background",m7c="ody",R6c="offsetAni",e3="conf",L4="ap",J9h="wr",v2="au",P4="ght",c4h="he",K0c="igh",E2="L",a1B="Cl",B3c="io",I3="ta",u8c="ri",S4c="_dom",r9B="ci",d3c="ro",a9B="ck",J3c="ba",G3B="tent",M0h="htb",r0c="_L",U0B="ED",H8="div",j4B="content",j6B="_s",U3c="dte",I9B="cl",B1c="nd",T8c="append",X7h="dr",W3c="hil",J4c="_d",z2B="_dte",b2="sh",V6h="roller",H5c="ayC",x4h="tb",L0h="li",F1c="all",q5h="lo",n2h="close",h3c="ubmi",K5="formOptions",l1h="tton",C2c="bu",w8="se",B8="od",n9B="dTy",d4B="iel",t5h="odels",i8B="displayController",O3B="tti",n4c="ext",Z7="defaults",Z4h="del",u6B="mo",g6h="shift",m6="os",V9c="tur",G4="R",E5h="ult",z6h="lue",M4h="ol",y5B="ml",S8="Ap",J6c="fie",r4c="Id",j7B="emo",B0c="isp",C3h="pl",R4B="_typeFn",G3h="pla",q3h="ace",O6h="ts",B3="op",c8B="ue",a0="mul",L2B="opts",v0B="_m",J1="multiValue",i6B="ct",f2c="je",k6h="nOb",E8="P",i9c="is",g6c="ra",n4="Ar",j8c="multiValues",o4h="al",z3="V",R3B="va",M0c="sM",j3B="multiIds",c9B="iV",i7B="lt",c1="ag",N4h="html",B9B="ht",l5="ay",i4c="displ",M5h="slideUp",B2B="lay",Z0="dis",N9B="ho",M1="ef",R9B="lu",y4r="Va",P2B="us",c4="oc",g5h="ner",K6="cus",f6="fo",F7h="ainer",l2c=", ",r9="classes",g5c="nt",G0c="ldE",Z8B="ie",q7B="las",X2B="ine",Q0h="nta",Q1h="dd",d8="as",Z6="en",i3h="la",b6="sp",Q6B="cs",N3h="parents",Y1B="container",i9h="do",P9c="sabl",V4B="di",Y1h="de",O1h="opt",R7B="ly",I4B="pp",x4="Fn",m2B="function",o6c="each",z2h="_multiValueCheck",w5c=true,p0h="Value",q5B="click",d3="on",W8="val",H0h="lick",g8h="multi",N0B="lti",M2h="multi-value",Y9c="essa",m8c="nf",l0B="bel",G8="models",Q5="F",X7="xt",j0B="dom",i1h="none",U8B="display",Q5B="css",I0h="pe",x2c=null,o0h="te",W3="eFn",V5B="ms",F0="ge",S8h='"></',k9="rror",U1B='r',C4='an',j1B='p',Y7B='lass',W6='nf',z3B='pa',e4B='ss',l4c='u',l9c='"/><',p7c="C",g4r="in",g1h='n',A1h='o',f4c='t',v8='at',m9B="ut",P6c="np",y6B='la',C7='nput',A0h='><',Y3='bel',m1='></',P3B='v',d3h='i',Y4r='</',b8="I",A0c="-",N1='las',j7='be',H4B='g',C1h='m',h5='iv',L2='<',f0='">',h4h="label",r1B='s',X0='as',B7h='c',w8B='" ',a5B='ta',Z9h='a',U7c=' ',b9h='ab',n3h='l',u4c='"><',N7h="nam",X0c="typ",K4B="x",z5c="re",t9h="ty",d5B="wrapper",y7h="_fnSetObjectDataFn",w7="ata",n1="ed",e7h="_fnGetObjectDataFn",E3="om",c5="Fr",F8h="pi",R3c="oA",Y4="am",n8B="id",I8c="name",k2h="fieldTypes",b2B="settings",X2="ex",c7B="type",R1h="wn",V6c="no",P4h="ld",H6h="g",C7B="rro",l3c="yp",q0h="p",h2h="Ty",s3="el",E1="fi",t6B="ul",J8h="def",T2h="extend",E8h="l",I9c="mu",U6h="Field",P3h="push",I1B="ch",G0h='"]',Y6c='="',I6h='e',v7B='te',b0='-',Z1B='ata',u7h='d',h7c="bl",q7="ataT",c0="Edit",A2c="'",v9B="' ",H5=" '",v8c="ni",X6="st",i7h="ditor",Z5="E",u9="es",A4B="w",m5="ble",D5="D",S4="uir",b7="eq",p7B=" ",Q7h="itor",a3B="Ed",o1c="7",l8c="0",s2h="k",D7="c",n5h="h",n1c="onC",m2="si",E4B="v",T1="versionCheck",K8h="abl",C0="T",m4h="",h6c="sage",k0="mes",F8c="1",u3c="replace",F9="_",r4=1,a5h="message",s7B="co",R8h="i18n",H9="ov",f2h="m",R2="age",B6="ss",Y8B="me",x2h="tl",A7="18n",E4h="le",r8h="ti",K7="title",N2c="ns",t8h="o",L5B="ons",M7h="tt",x0B="tor",w1B="_e",B0h="r",Q5h="to",C3B="edi",d5h="i",l4=0;function v(a){var p0c="oI",W1="context";a=a[W1][l4];return a[(p0c+C7Z.l8h+d5h+C7Z.R4h)][(C3B+Q5h+B0h)]||a[(w1B+C7Z.i6+d5h+x0B)];}
function A(a,b,c,e){var R0B="_basic",L6c="utt";b||(b={}
);b[(C7Z.w6+C7Z.F4h+M7h+L5B)]===h&&(b[(C7Z.w6+L6c+t8h+N2c)]=R0B);b[K7]===h&&(b[(r8h+C7Z.R4h+E4h)]=a[(d5h+A7)][c][(C7Z.R4h+d5h+x2h+C7Z.V7)]);b[(Y8B+B6+R2)]===h&&((B0h+C7Z.V7+f2h+H9+C7Z.V7)===c?(a=a[(R8h)][c][(s7B+C7Z.l8h+C7Z.p5h+d5h+B0h+f2h)],b[a5h]=r4!==e?a[F9][u3c](/%d/,e):a[F8c]):b[(k0+h6c)]=m4h);return b;}
var t=d[(C7Z.p5h+C7Z.l8h)][(C7Z.i6+C7Z.U8+C7Z.Q6+C0+K8h+C7Z.V7)];if(!t||!t[T1]||!t[(E4B+C7Z.V7+B0h+m2+n1c+n5h+C7Z.V7+D7+s2h)]((F8c+C7Z.I4c+F8c+l8c+C7Z.I4c+o1c)))throw (a3B+Q7h+p7B+B0h+b7+S4+C7Z.V7+C7Z.c0h+p7B+D5+C7Z.U8+C7Z.Q6+C0+C7Z.Q6+m5+C7Z.c0h+p7B+F8c+C7Z.I4c+F8c+l8c+C7Z.I4c+o1c+p7B+t8h+B0h+p7B+C7Z.l8h+C7Z.V7+A4B+C7Z.V7+B0h);var f=function(a){var B7c="_constructor",d2h="anc",Q2="ew",C2B="sed",h4r="ali",i8h="DataT";!this instanceof f&&alert((i8h+K8h+u9+p7B+Z5+i7h+p7B+f2h+C7Z.F4h+X6+p7B+C7Z.w6+C7Z.V7+p7B+d5h+v8c+r8h+h4r+C2B+p7B+C7Z.Q6+C7Z.c0h+p7B+C7Z.Q6+H5+C7Z.l8h+Q2+v9B+d5h+C7Z.l8h+X6+d2h+C7Z.V7+A2c));this[B7c](a);}
;t[(c0+C7Z.N6)]=f;d[C7Z.D4h][(D5+q7+C7Z.Q6+h7c+C7Z.V7)][(a3B+d5h+Q5h+B0h)]=f;var u=function(a,b){var l0='*[';b===h&&(b=r);return d((l0+u7h+Z1B+b0+u7h+v7B+b0+I6h+Y6c)+a+(G0h),b);}
,M=l4,y=function(a,b){var c=[];d[(C7Z.V7+C7Z.Q6+I1B)](a,function(a,d){c[P3h](d[b]);}
);return c;}
;f[(U6h)]=function(a,b,c){var h8B="iRe",L6B="msg-error",U1h="input-control",r2="dIn",x6B="ssa",z0='sag',b2h='ror',u3B="tiRest",A7h='sg',g6B="inf",c5h="Info",Q0c='lt',e2c="ltiVa",e6c='ue',o4B='al',b3="ontro",Y2B='ol',n3B='tr',t5B='npu',B0="sg",k4B="lassName",g4B="namePrefix",U2="peP",v1h="valTo",t9="dataProp",D0B="DTE_Field_",i2="ype",u0c="nk",O8=" - ",e=this,j=c[R8h][(I9c+E8h+r8h)],a=d[T2h](!l4,{}
,f[U6h][(J8h+C7Z.Q6+t6B+C7Z.R4h+C7Z.c0h)],a);if(!f[(E1+s3+C7Z.i6+h2h+q0h+C7Z.V7+C7Z.c0h)][a[(C7Z.R4h+l3c+C7Z.V7)]])throw (Z5+C7B+B0h+p7B+C7Z.Q6+C7Z.i6+C7Z.i6+d5h+C7Z.l8h+H6h+p7B+C7Z.p5h+d5h+C7Z.V7+P4h+O8+C7Z.F4h+u0c+V6c+R1h+p7B+C7Z.p5h+d5h+C7Z.V7+E8h+C7Z.i6+p7B+C7Z.R4h+i2+p7B)+a[c7B];this[C7Z.c0h]=d[(X2+C7Z.R4h+C7Z.V7+C7Z.l8h+C7Z.i6)]({}
,f[U6h][b2B],{type:f[k2h][a[(C7Z.R4h+i2)]],name:a[I8c],classes:b,host:c,opts:a,multiValue:!r4}
);a[(d5h+C7Z.i6)]||(a[(n8B)]=D0B+a[I8c]);a[t9]&&(a.data=a[t9]);""===a.data&&(a.data=a[(C7Z.l8h+Y4+C7Z.V7)]);var o=t[(X2+C7Z.R4h)][(R3c+F8h)];this[(E4B+C7Z.Q6+E8h+c5+E3+D5+C7Z.Q6+C7Z.R4h+C7Z.Q6)]=function(b){return o[e7h](a.data)(b,(n1+Q7h));}
;this[(v1h+D5+w7)]=o[y7h](a.data);b=d('<div class="'+b[d5B]+" "+b[(t9h+U2+z5c+E1+K4B)]+a[(X0c+C7Z.V7)]+" "+b[g4B]+a[(N7h+C7Z.V7)]+" "+a[(D7+k4B)]+(u4c+n3h+b9h+I6h+n3h+U7c+u7h+Z9h+a5B+b0+u7h+v7B+b0+I6h+Y6c+n3h+b9h+I6h+n3h+w8B+B7h+n3h+X0+r1B+Y6c)+b[h4h]+'" for="'+a[(n8B)]+(f0)+a[h4h]+(L2+u7h+h5+U7c+u7h+Z9h+a5B+b0+u7h+v7B+b0+I6h+Y6c+C1h+r1B+H4B+b0+n3h+Z9h+j7+n3h+w8B+B7h+N1+r1B+Y6c)+b[(f2h+B0+A0c+E8h+C7Z.Q6+C7Z.w6+s3)]+(f0)+a[(E8h+C7Z.Q6+C7Z.w6+C7Z.V7+E8h+b8+C7Z.l8h+C7Z.p5h+t8h)]+(Y4r+u7h+d3h+P3B+m1+n3h+Z9h+Y3+A0h+u7h+d3h+P3B+U7c+u7h+Z9h+a5B+b0+u7h+v7B+b0+I6h+Y6c+d3h+C7+w8B+B7h+y6B+r1B+r1B+Y6c)+b[(d5h+P6c+m9B)]+(u4c+u7h+d3h+P3B+U7c+u7h+v8+Z9h+b0+u7h+f4c+I6h+b0+I6h+Y6c+d3h+t5B+f4c+b0+B7h+A1h+g1h+n3B+Y2B+w8B+B7h+n3h+X0+r1B+Y6c)+b[(g4r+q0h+m9B+p7c+b3+E8h)]+(l9c+u7h+h5+U7c+u7h+Z9h+f4c+Z9h+b0+u7h+f4c+I6h+b0+I6h+Y6c+C1h+l4c+n3h+f4c+d3h+b0+P3B+o4B+e6c+w8B+B7h+n3h+Z9h+e4B+Y6c)+b[(f2h+C7Z.F4h+e2c+E8h+C7Z.F4h+C7Z.V7)]+(f0)+j[(r8h+C7Z.R4h+E4h)]+(L2+r1B+z3B+g1h+U7c+u7h+v8+Z9h+b0+u7h+f4c+I6h+b0+I6h+Y6c+C1h+l4c+Q0c+d3h+b0+d3h+W6+A1h+w8B+B7h+Y7B+Y6c)+b[(f2h+C7Z.F4h+E8h+r8h+c5h)]+(f0)+j[(g6B+t8h)]+(Y4r+r1B+j1B+C4+m1+u7h+d3h+P3B+A0h+u7h+h5+U7c+u7h+v8+Z9h+b0+u7h+v7B+b0+I6h+Y6c+C1h+A7h+b0+C1h+l4c+Q0c+d3h+w8B+B7h+n3h+X0+r1B+Y6c)+b[(f2h+t6B+u3B+t8h+z5c)]+(f0)+j.restore+(Y4r+u7h+h5+A0h+u7h+h5+U7c+u7h+Z1B+b0+u7h+v7B+b0+I6h+Y6c+C1h+r1B+H4B+b0+I6h+U1B+b2h+w8B+B7h+y6B+e4B+Y6c)+b[(f2h+C7Z.c0h+H6h+A0c+C7Z.V7+k9)]+(S8h+u7h+d3h+P3B+A0h+u7h+d3h+P3B+U7c+u7h+Z9h+a5B+b0+u7h+v7B+b0+I6h+Y6c+C1h+r1B+H4B+b0+C1h+I6h+r1B+z0+I6h+w8B+B7h+y6B+r1B+r1B+Y6c)+b[(f2h+B0+A0c+f2h+C7Z.V7+x6B+F0)]+(S8h+u7h+h5+A0h+u7h+h5+U7c+u7h+v8+Z9h+b0+u7h+v7B+b0+I6h+Y6c+C1h+r1B+H4B+b0+d3h+W6+A1h+w8B+B7h+Y7B+Y6c)+b[(V5B+H6h+A0c+d5h+C7Z.l8h+C7Z.p5h+t8h)]+'">'+a[(C7Z.p5h+d5h+C7Z.V7+E8h+r2+C7Z.p5h+t8h)]+"</div></div></div>");c=this[(F9+C7Z.R4h+C7Z.X3h+q0h+W3)]((D7+B0h+C7Z.V7+C7Z.Q6+o0h),a);x2c!==c?u(U1h,b)[(q0h+z5c+I0h+C7Z.l8h+C7Z.i6)](c):b[Q5B](U8B,i1h);this[j0B]=d[(C7Z.V7+X7+C7Z.V7+C7Z.l8h+C7Z.i6)](!l4,{}
,f[(Q5+d5h+C7Z.V7+E8h+C7Z.i6)][G8][j0B],{container:b,inputControl:u(U1h,b),label:u((E8h+C7Z.Q6+l0B),b),fieldInfo:u((V5B+H6h+A0c+d5h+m8c+t8h),b),labelInfo:u((f2h+B0+A0c+E8h+C7Z.Q6+l0B),b),fieldError:u(L6B,b),fieldMessage:u((f2h+C7Z.c0h+H6h+A0c+f2h+Y9c+F0),b),multi:u(M2h,b),multiReturn:u((V5B+H6h+A0c+f2h+C7Z.F4h+E8h+C7Z.R4h+d5h),b),multiInfo:u((I9c+N0B+A0c+d5h+m8c+t8h),b)}
);this[(C7Z.i6+E3)][g8h][(t8h+C7Z.l8h)]((D7+H0h),function(){e[W8](m4h);}
);this[j0B][(f2h+t6B+C7Z.R4h+h8B+C7Z.R4h+C7Z.F4h+B0h+C7Z.l8h)][(d3)](q5B,function(){e[C7Z.c0h][(f2h+t6B+C7Z.R4h+d5h+p0h)]=w5c;e[z2h]();}
);d[o6c](this[C7Z.c0h][(t9h+q0h+C7Z.V7)],function(a,b){typeof b===m2B&&e[a]===h&&(e[a]=function(){var t8c="nshift",b=Array.prototype.slice.call(arguments);b[(C7Z.F4h+t8c)](a);b=e[(F9+C7Z.R4h+l3c+C7Z.V7+x4)][(C7Z.Q6+I4B+R7B)](e,b);return b===h?e:b;}
);}
);}
;f.Field.prototype={def:function(a){var p1h="isFu",z3h="fau",b=this[C7Z.c0h][(O1h+C7Z.c0h)];if(a===h)return a=b["default"]!==h?b[(C7Z.i6+C7Z.V7+z3h+E8h+C7Z.R4h)]:b[J8h],d[(p1h+C7Z.l8h+D7+C7Z.e8c)](a)?a():a;b[(Y1h+C7Z.p5h)]=a;return this;}
,disable:function(){var v1B="_ty";this[(v1B+q0h+C7Z.V7+x4)]((V4B+P9c+C7Z.V7));return this;}
,displayed:function(){var a=this[(i9h+f2h)][Y1B];return a[(N3h)]("body").length&&"none"!=a[(Q6B+C7Z.c0h)]((C7Z.i6+d5h+b6+i3h+C7Z.X3h))?!0:!1;}
,enable:function(){this[(F9+C7Z.R4h+l3c+C7Z.V7+x4)]((Z6+K8h+C7Z.V7));return this;}
,error:function(a,b){var R4r="_ms",R2c="removeC",c=this[C7Z.c0h][(D7+E8h+d8+C7Z.c0h+u9)];a?this[(C7Z.i6+t8h+f2h)][Y1B][(C7Z.Q6+Q1h+p7c+i3h+B6)](c.error):this[(C7Z.i6+t8h+f2h)][(D7+t8h+Q0h+X2B+B0h)][(R2c+q7B+C7Z.c0h)](c.error);return this[(R4r+H6h)](this[(C7Z.i6+E3)][(C7Z.p5h+Z8B+G0c+C7B+B0h)],a,b);}
,isMultiValue:function(){return this[C7Z.c0h][(f2h+C7Z.F4h+E8h+C7Z.R4h+d5h+p0h)];}
,inError:function(){var r6="Class";return this[(C7Z.i6+t8h+f2h)][(s7B+g5c+C7Z.Q6+g4r+C7Z.W7)][(n5h+d8+r6)](this[C7Z.c0h][r9].error);}
,input:function(){var k8B="tar",q8="typeFn";return this[C7Z.c0h][(X0c+C7Z.V7)][(d5h+P6c+m9B)]?this[(F9+q8)]("input"):d((g4r+q0h+C7Z.F4h+C7Z.R4h+l2c+C7Z.c0h+s3+C7Z.V7+D7+C7Z.R4h+l2c+C7Z.R4h+C7Z.V7+K4B+k8B+C7Z.V7+C7Z.Q6),this[j0B][(D7+t8h+C7Z.l8h+C7Z.R4h+F7h)]);}
,focus:function(){var j4c="_typ";this[C7Z.c0h][c7B][(f6+K6)]?this[(j4c+C7Z.V7+Q5+C7Z.l8h)]("focus"):d("input, select, textarea",this[(i9h+f2h)][(s7B+Q0h+d5h+g5h)])[(C7Z.p5h+c4+P2B)]();return this;}
,get:function(){var I4r="Mul";if(this[(d5h+C7Z.c0h+I4r+C7Z.R4h+d5h+y4r+R9B+C7Z.V7)]())return h;var a=this[(F9+C7Z.R4h+l3c+W3)]((H6h+C7Z.V7+C7Z.R4h));return a!==h?a:this[(C7Z.i6+M1)]();}
,hide:function(a){var b=this[(j0B)][Y1B];a===h&&(a=!0);this[C7Z.c0h][(N9B+C7Z.c0h+C7Z.R4h)][(Z0+q0h+B2B)]()&&a?b[M5h]():b[Q5B]((i4c+l5),(i1h));return this;}
,label:function(a){var b=this[j0B][(E8h+C7Z.Q6+C7Z.w6+C7Z.V7+E8h)];if(a===h)return b[(B9B+f2h+E8h)]();b[N4h](a);return this;}
,message:function(a,b){var T5="ieldM",z1="_msg";return this[z1](this[(i9h+f2h)][(C7Z.p5h+T5+u9+C7Z.c0h+c1+C7Z.V7)],a,b);}
,multiGet:function(a){var n0B="isM",b=this[C7Z.c0h][(I9c+i7B+c9B+C7Z.Q6+R9B+C7Z.V7+C7Z.c0h)],c=this[C7Z.c0h][j3B];if(a===h)for(var a={}
,e=0;e<c.length;e++)a[c[e]]=this[(d5h+M0c+C7Z.F4h+N0B+y4r+E8h+C7Z.F4h+C7Z.V7)]()?b[c[e]]:this[(R3B+E8h)]();else a=this[(n0B+C7Z.F4h+i7B+d5h+z3+o4h+C7Z.F4h+C7Z.V7)]()?b[a]:this[(R3B+E8h)]();return a;}
,multiSet:function(a,b){var j7c="heck",l0h="ueC",f4B="tiVa",J1B="lai",c=this[C7Z.c0h][j8c],e=this[C7Z.c0h][j3B];b===h&&(b=a,a=h);var j=function(a,b){d[(g4r+n4+g6c+C7Z.X3h)](e)===-1&&e[P3h](a);c[a]=b;}
;d[(i9c+E8+J1B+k6h+f2c+i6B)](b)&&a===h?d[o6c](b,function(a,b){j(a,b);}
):a===h?d[(C7Z.V7+C7Z.Q6+D7+n5h)](e,function(a,c){j(c,b);}
):j(a,b);this[C7Z.c0h][J1]=!0;this[(v0B+C7Z.F4h+E8h+f4B+E8h+l0h+j7c)]();return this;}
,name:function(){return this[C7Z.c0h][L2B][I8c];}
,node:function(){return this[(i9h+f2h)][(D7+t8h+C7Z.l8h+C7Z.R4h+C7Z.Q6+g4r+C7Z.V7+B0h)][0];}
,set:function(a){var I2h="lace",y6h="rep",x8="repla",E9="yDecod",q8B="nti",C8B="iVal";this[C7Z.c0h][(a0+C7Z.R4h+C8B+c8B)]=!1;var b=this[C7Z.c0h][(B3+O6h)][(C7Z.V7+q8B+C7Z.R4h+E9+C7Z.V7)];if((b===h||!0===b)&&"string"===typeof a)a=a[(x8+D7+C7Z.V7)](/&gt;/g,">")[u3c](/&lt;/g,"<")[(y6h+E8h+q3h)](/&amp;/g,"&")[(y6h+I2h)](/&quot;/g,'"')[(B0h+C7Z.V7+G3h+D7+C7Z.V7)](/&#39;/g,"'");this[R4B]((C7Z.c0h+C7Z.D9),a);this[z2h]();return this;}
,show:function(a){var f5h="slideDown",x9c="ntain",b=this[j0B][(s7B+x9c+C7Z.V7+B0h)];a===h&&(a=!0);this[C7Z.c0h][(N9B+X6)][(C7Z.i6+i9c+C3h+l5)]()&&a?b[f5h]():b[(Q5B)]((C7Z.i6+B0c+i3h+C7Z.X3h),"block");return this;}
,val:function(a){return a===h?this[(F0+C7Z.R4h)]():this[(C7Z.c0h+C7Z.D9)](a);}
,dataSrc:function(){return this[C7Z.c0h][(t8h+q0h+C7Z.R4h+C7Z.c0h)].data;}
,destroy:function(){var e8h="oy",A2="estr";this[j0B][(D7+t8h+g5c+F7h)][(B0h+j7B+E4B+C7Z.V7)]();this[R4B]((C7Z.i6+A2+e8h));return this;}
,multiIds:function(){return this[C7Z.c0h][(I9c+E8h+r8h+r4c+C7Z.c0h)];}
,multiInfoShown:function(a){var P8c="multiInfo";this[(C7Z.i6+E3)][P8c][(Q6B+C7Z.c0h)]({display:a?(h7c+c4+s2h):(i1h)}
);}
,multiReset:function(){var t1c="Ids";this[C7Z.c0h][(a0+C7Z.R4h+d5h+t1c)]=[];this[C7Z.c0h][j8c]={}
;}
,valFromData:null,valToData:null,_errorNode:function(){return this[(j0B)][(J6c+G0c+B0h+B0h+t8h+B0h)];}
,_msg:function(a,b,c){var b0h="lock",Y5B="Do",p5="sl",I6c="unctio";if((C7Z.p5h+I6c+C7Z.l8h)===typeof b)var e=this[C7Z.c0h][(n5h+t8h+X6)],b=b(e,new t[(S8+d5h)](e[C7Z.c0h][C7Z.A7c]));a.parent()[(i9c)](":visible")?(a[(N4h)](b),b?a[(p5+n8B+C7Z.V7+Y5B+A4B+C7Z.l8h)](c):a[M5h](c)):(a[(B9B+y5B)](b||"")[(D7+B6)]((C7Z.i6+d5h+C7Z.c0h+q0h+B2B),b?(C7Z.w6+b0h):"none"),c&&c());return this;}
,_multiValueCheck:function(){var e5h="ultiI",i5="tiV",P2h="inputControl",Y6B="ntr",w6h="utC",a,b=this[C7Z.c0h][j3B],c=this[C7Z.c0h][(f2h+t6B+C7Z.R4h+c9B+C7Z.Q6+E8h+C7Z.F4h+u9)],e,d=!1;if(b)for(var o=0;o<b.length;o++){e=c[b[o]];if(0<o&&e!==a){d=!0;break;}
a=e;}
d&&this[C7Z.c0h][J1]?(this[(C7Z.i6+E3)][(d5h+C7Z.l8h+q0h+w6h+t8h+Y6B+M4h)][(D7+C7Z.c0h+C7Z.c0h)]({display:(V6c+C7Z.l8h+C7Z.V7)}
),this[(i9h+f2h)][(I9c+E8h+C7Z.R4h+d5h)][(Q6B+C7Z.c0h)]({display:(h7c+t8h+D7+s2h)}
)):(this[j0B][P2h][Q5B]({display:"block"}
),this[j0B][g8h][(Q6B+C7Z.c0h)]({display:"none"}
),this[C7Z.c0h][(f2h+C7Z.F4h+N0B+z3+C7Z.Q6+z6h)]&&this[W8](a));b&&1<b.length&&this[(i9h+f2h)][(f2h+E5h+d5h+G4+C7Z.V7+V9c+C7Z.l8h)][Q5B]({display:d&&!this[C7Z.c0h][(f2h+C7Z.F4h+E8h+i5+C7Z.Q6+z6h)]?"block":(i1h)}
);this[C7Z.c0h][(n5h+m6+C7Z.R4h)][(F9+f2h+e5h+m8c+t8h)]();return !0;}
,_typeFn:function(a){var y6="ply",a8B="if",B9c="uns",b=Array.prototype.slice.call(arguments);b[g6h]();b[(B9c+n5h+a8B+C7Z.R4h)](this[C7Z.c0h][L2B]);var c=this[C7Z.c0h][c7B][a];if(c)return c[(C7Z.Q6+q0h+y6)](this[C7Z.c0h][(N9B+X6)],b);}
}
;f[(Q5+d5h+C7Z.V7+P4h)][(u6B+Z4h+C7Z.c0h)]={}
;f[U6h][Z7]={className:"",data:"",def:"",fieldInfo:"",id:"",label:"",labelInfo:"",name:null,type:(C7Z.R4h+n4c)}
;f[(Q5+Z8B+E8h+C7Z.i6)][G8][(C7Z.c0h+C7Z.V7+O3B+C7Z.l8h+H6h+C7Z.c0h)]={type:x2c,name:x2c,classes:x2c,opts:x2c,host:x2c}
;f[U6h][G8][(C7Z.i6+t8h+f2h)]={container:x2c,label:x2c,labelInfo:x2c,fieldInfo:x2c,fieldError:x2c,fieldMessage:x2c}
;f[(f2h+t8h+C7Z.i6+s3+C7Z.c0h)]={}
;f[G8][i8B]={init:function(){}
,open:function(){}
,close:function(){}
}
;f[(f2h+t5h)][(C7Z.p5h+d4B+n9B+I0h)]={create:function(){}
,get:function(){}
,set:function(){}
,enable:function(){}
,disable:function(){}
}
;f[(f2h+B8+s3+C7Z.c0h)][(w8+C7Z.R4h+r8h+C7Z.l8h+H6h+C7Z.c0h)]={ajaxUrl:x2c,ajax:x2c,dataSource:x2c,domTable:x2c,opts:x2c,displayController:x2c,fields:{}
,order:[],id:-r4,displayed:!r4,processing:!r4,modifier:x2c,action:x2c,idSrc:x2c}
;f[(f2h+t8h+Z4h+C7Z.c0h)][(C2c+l1h)]={label:x2c,fn:x2c,className:x2c}
;f[G8][K5]={onReturn:(C7Z.c0h+h3c+C7Z.R4h),onBlur:n2h,onBackground:(h7c+C7Z.F4h+B0h),onComplete:n2h,onEsc:(D7+q5h+C7Z.c0h+C7Z.V7),submit:F1c,focus:l4,buttons:!l4,title:!l4,message:!l4,drawType:!r4}
;f[(C7Z.i6+i9c+q0h+i3h+C7Z.X3h)]={}
;var q=jQuery,m;f[U8B][(L0h+H6h+n5h+x4h+t8h+K4B)]=q[T2h](!0,{}
,f[(f2h+t8h+C7Z.i6+C7Z.V7+E8h+C7Z.c0h)][(i4c+H5c+d3+C7Z.R4h+V6h)],{init:function(){var N5B="ini";m[(F9+N5B+C7Z.R4h)]();return m;}
,open:function(a,b,c){var L6="_show",p9="_shown",L2h="detac",Q4h="own";if(m[(F9+b2+Q4h)])c&&c();else{m[(z2B)]=a;a=m[(J4c+t8h+f2h)][(D7+d3+C7Z.R4h+C7Z.V7+C7Z.l8h+C7Z.R4h)];a[(D7+W3c+X7h+Z6)]()[(L2h+n5h)]();a[T8c](b)[(C7Z.Q6+q0h+q0h+C7Z.V7+B1c)](m[(F9+C7Z.i6+t8h+f2h)][(I9B+t8h+w8)]);m[p9]=true;m[L6](c);}
}
,close:function(a,b){var g1="hide";if(m[(F9+b2+t8h+A4B+C7Z.l8h)]){m[(F9+U3c)]=a;m[(F9+g1)](b);m[(j6B+N9B+R1h)]=false;}
else b&&b();}
,node:function(){return m[(J4c+t8h+f2h)][d5B][0];}
,_init:function(){var h2="ox_Co",r7B="_ready";if(!m[r7B]){var a=m[(F9+C7Z.i6+E3)];a[j4B]=q((H8+C7Z.I4c+D5+C0+U0B+r0c+d5h+H6h+M0h+h2+C7Z.l8h+G3B),m[(F9+i9h+f2h)][d5B]);a[d5B][(D7+B6)]("opacity",0);a[(J3c+a9B+H6h+d3c+C7Z.F4h+B1c)][(Q5B)]((B3+C7Z.Q6+r9B+t9h),0);}
}
,_show:function(a){var L8B='wn',t3B='_Sh',K6B='tb',S4h='_Lig',T8h="not",h7h="dre",I5="chi",U3="orientation",V4="ghtbox",Q3h="box",a7h="Wrapp",u4h="nt_",V9h="Con",p8h="x_",M9c="bi",p2c="mate",a2h="Mob",E6h="DTED_",b=m[S4c];p[(t8h+u8c+Z6+I3+C7Z.R4h+B3c+C7Z.l8h)]!==h&&q("body")[(C7Z.Q6+C7Z.i6+C7Z.i6+a1B+d8+C7Z.c0h)]((E6h+E2+K0c+C7Z.R4h+C7Z.w6+t8h+K4B+F9+a2h+d5h+E4h));b[(s7B+C7Z.l8h+C7Z.R4h+C7Z.V7+C7Z.l8h+C7Z.R4h)][(D7+C7Z.c0h+C7Z.c0h)]((c4h+d5h+P4),(v2+Q5h));b[(J9h+L4+I0h+B0h)][Q5B]({top:-m[e3][R6c]}
);q((C7Z.w6+m7c))[T8c](m[(F9+C7Z.i6+E3)][c8h])[(C7Z.Q6+q0h+q0h+C7Z.V7+B1c)](m[(F9+C7Z.i6+E3)][d5B]);m[a1c]();b[d5B][(C7Z.c0h+Q5h+q0h)]()[(C7Z.Q6+v8c+f2h+C7Z.Q6+C7Z.R4h+C7Z.V7)]({opacity:1,top:0}
,a);b[(C7Z.w6+C7Z.Q6+D7+y8+B0h+v8h)][(l6c)]()[(C7Z.Q6+C7Z.l8h+d5h+p2c)]({opacity:1}
);b[(q0c+C7Z.V7)][(C7Z.w6+d5h+C7Z.l8h+C7Z.i6)]((D7+E8h+K5B+s2h+C7Z.I4c+D5+t7+r0c+D9c+C7Z.w6+u7),function(){m[z2B][n2h]();}
);b[c8h][(M9c+C7Z.l8h+C7Z.i6)]((D7+E8h+S8c+C7Z.I4c+D5+Y7+E2+d5h+V8+C7Z.R4h+k5c+K4B),function(){m[(z2B)][(C7Z.w6+K3h+W6c+B1c)]();}
);q((H8+C7Z.I4c+D5+H3+D5+z1B+H6h+M0h+t8h+p8h+V9h+o0h+u4h+a7h+C7Z.V7+B0h),b[(J9h+C7Z.Q6+q0h+I0h+B0h)])[c7c]((I9B+d5h+D7+s2h+C7Z.I4c+D5+H3+D5+F9+E2+m8B+n5h+C7Z.R4h+Q3h),function(a){var R="und",r6B="ox_C";q(a[(I3+B0h+j2)])[d9B]((G0B+U0B+F9+E2+m8B+M0h+r6B+d3+C7Z.R4h+Z6+Y1c+q0h+I0h+B0h))&&m[z2B][(C7Z.w6+C7Z.Q6+D7+s2h+H6h+d3c+R)]();}
);q(p)[(C7Z.w6+g4r+C7Z.i6)]((B0h+C7Z.V7+m2+g3h+C7Z.V7+C7Z.I4c+D5+C0+Z5+D5+z1B+V4),function(){var T2B="eig";m[(o3B+T2B+n5h+C7Z.R4h+p7c+o4h+D7)]();}
);m[U9c]=q((k5c+C7Z.i6+C7Z.X3h))[h9B]();if(p[U3]!==h){a=q((k5c+h5h))[(I5+E8h+h7h+C7Z.l8h)]()[T8h](b[c8h])[(C7Z.l8h+t8h+C7Z.R4h)](b[(J9h+C7Z.Q6+q0h+q0h+C7Z.W7)]);q((C7Z.w6+t8h+h5h))[T8c]((L2+u7h+h5+U7c+B7h+N1+r1B+Y6c+U7+U0h+Q7+U7+S4h+c4B+K6B+A1h+l7B+t3B+A1h+L8B+z4B));q("div.DTED_Lightbox_Shown")[T8c](a);}
}
,_heightCalc:function(){var J0="_Fo",Z8h="outerH",e4="wrappe",R0c="win",a=m[(F9+C7Z.i6+t8h+f2h)],b=q(p).height()-m[(D7+d3+C7Z.p5h)][(R0c+i9h+A4B+E8+C7Z.Q6+C7Z.i6+C7Z.i6+g4r+H6h)]*2-q((H8+C7Z.I4c+D5+C0+E2h+C7Z.V7+C7Z.Q6+Y1h+B0h),a[(e4+B0h)])[(Z8h+C7Z.V7+D9c)]()-q((H8+C7Z.I4c+D5+H3+J0+t8h+C7Z.R4h+C7Z.V7+B0h),a[(A4B+B0h+C7Z.Q6+q0h+M8c)])[e4h]();q((H8+C7Z.I4c+D5+H3+D2B+C7Z.X3h+h1B+o2c+C7Z.R4h),a[(A4B+g6c+q0h+I0h+B0h)])[Q5B]("maxHeight",b);}
,_hide:function(a){var l7h="ED_Li",H3c="rapp",F2="ightb",b9="nbi",B8h="unbi",K1h="bile",R9h="ox_Mo",V1h="Li",T9c="emove",z0h="Show",R4="D_Lig",m7B="ienta",b=m[(F9+i9h+f2h)];a||(a=function(){}
);if(p[(C7Z.N6+m7B+l1c+C7Z.l8h)]!==h){var c=q((C7Z.i6+d5h+E4B+C7Z.I4c+D5+C0+Z5+R4+B9B+C7Z.w6+t8h+K4B+F9+z0h+C7Z.l8h));c[T1c]()[e5B]((k5c+h5h));c[(B0h+T9c)]();}
q((k5c+C7Z.i6+C7Z.X3h))[(z5c+u6B+E4B+D3h+E8h+C7Z.Q6+B6)]((D5+Y7+V1h+P4+C7Z.w6+R9h+K1h))[h9B](m[U9c]);b[d5B][(C7Z.c0h+r0B)]()[(D7B)]({opacity:0,top:m[(s7B+m8c)][R6c]}
,function(){q(this)[j1c]();a();}
);b[c8h][(X6+B3)]()[(o4+f4r+C7Z.Q6+o0h)]({opacity:0}
,function(){q(this)[(L9+C7Z.Q6+I1B)]();}
);b[n2h][(B8h+B1c)]("click.DTED_Lightbox");b[(C7Z.w6+P9+E3h+m9+C7Z.l8h+C7Z.i6)][(C7Z.F4h+b9+B1c)]((I9B+d5h+a9B+C7Z.I4c+D5+Y7+E2+F2+t8h+K4B));q("div.DTED_Lightbox_Content_Wrapper",b[(A4B+H3c+C7Z.V7+B0h)])[(b5B+C7Z.w6+d5h+C7Z.l8h+C7Z.i6)]((I9B+d5h+a9B+C7Z.I4c+D5+C0+Z5+D5+F9+E2+F2+t8h+K4B));q(p)[w4h]((z5c+m2+x5c+C7Z.I4c+D5+C0+l7h+V8+x4h+u7));}
,_dte:null,_ready:!1,_shown:!1,_dom:{wrapper:q((L2+u7h+h5+U7c+B7h+y6B+r1B+r1B+Y6c+U7+p2h+U7+U7c+U7+U0h+Q7+r5c+h2B+r5B+j1h+U1B+Z9h+j1B+N6B+U1B+u4c+u7h+d3h+P3B+U7c+B7h+y6B+r1B+r1B+Y6c+U7+U0h+Q7+r5c+Y1+x7B+J8B+O2h+D3B+U1B+u4c+u7h+d3h+P3B+U7c+B7h+N1+r1B+Y6c+U7+U0h+Z2c+F9h+m9c+f4c+n9h+J8B+p6+I6B+f4c+I6h+g1h+f4c+F9h+n6h+Z9+c5c+I6h+U1B+u4c+u7h+h5+U7c+B7h+n3h+X0+r1B+Y6c+U7+p2h+r5c+Y1+d3h+j9B+f4c+n9h+J8B+F9h+V1B+O8h+g1h+f4c+S8h+u7h+d3h+P3B+m1+u7h+d3h+P3B+m1+u7h+h5+m1+u7h+h5+J7)),background:q((L2+u7h+d3h+P3B+U7c+B7h+n3h+Z9h+e4B+Y6c+U7+U0h+Z2c+l5c+d3h+j9B+K1c+R5B+A1h+N9c+u7h+u4c+u7h+h5+q5c+u7h+d3h+P3B+J7)),close:q((L2+u7h+d3h+P3B+U7c+B7h+n3h+X0+r1B+Y6c+U7+D8c+F9h+Y1+d3h+u0B+T3+l7B+G8h+A1h+s6h+S8h+u7h+h5+J7)),content:null}
}
);m=f[(Z0+q0h+E8h+l5)][(T3h+C7Z.R4h+k5c+K4B)];m[(D7+t8h+C7Z.l8h+C7Z.p5h)]={offsetAni:q6h,windowPadding:q6h}
;var l=jQuery,g;f[U8B][(C7Z.V7+C7Z.l8h+H0+t8h+I0h)]=l[T2h](!0,{}
,f[(z6c+C7Z.c0h)][(C7Z.i6+B0c+X0B+d3+m6h+t8h+k8h+C7Z.V7+B0h)],{init:function(a){g[(z2B)]=a;g[(F9+d5h+v8c+C7Z.R4h)]();return g;}
,open:function(a,b,c){var C9c="hild",x8c="ppendC",h9c="appen",i2B="hildren";g[(J4c+C7Z.R4h+C7Z.V7)]=a;l(g[(F9+C7Z.i6+t8h+f2h)][(s7B+C7Z.l8h+C7Z.R4h+C7Z.V7+g5c)])[(D7+i2B)]()[j1c]();g[(F9+C7Z.i6+t8h+f2h)][(D7+t8h+Y8h+g5c)][(h9c+Q4c+n5h+c0B+C7Z.i6)](b);g[(F9+C7Z.i6+t8h+f2h)][(s7B+C7Z.l8h+o0h+g5c)][(C7Z.Q6+x8c+C9c)](g[S4c][(D7+E8h+h0)]);g[(F9+C7Z.c0h+n5h+t8h+A4B)](c);}
,close:function(a,b){g[(z2B)]=a;g[U9](b);}
,node:function(){return g[(F9+C7Z.i6+t8h+f2h)][(A4B+B0h+C7Z.Q6+I4B+C7Z.W7)][0];}
,_init:function(){var E3B="ility",Q1c="tyl",z9c="isb",L7="ndChi",L3="pe_";if(!g[(F9+B0h+C7Z.V7+C7Z.Q6+h5h)]){g[S4c][(D7+d3+G3B)]=l((V4B+E4B+C7Z.I4c+D5+t7+F9+Z5+Y2c+j9c+L3+w3B+C7Z.l8h+C7Z.R4h+C7Z.Q6+u6h),g[(F9+j0B)][(A4B+B0h+L4+M8c)])[0];r[B2c][(C7Z.Q6+q0h+q0h+C7Z.V7+L7+P4h)](g[(J4c+E3)][c8h]);r[(k5h+C7Z.X3h)][(L4+i7c+p7c+W3c+C7Z.i6)](g[(S4c)][(D1c+q0h+q0h+C7Z.W7)]);g[S4c][c8h][x8B][(E4B+z9c+d5h+L0h+t9h)]=(T2);g[(J4c+E3)][c8h][(X6+C7Z.X3h+E8h+C7Z.V7)][U8B]=(C7Z.w6+E8h+t8h+D7+s2h);g[U4r]=l(g[S4c][(u0h+W6c+C7Z.l8h+C7Z.i6)])[(D7+C7Z.c0h+C7Z.c0h)]((B3+C7Z.Q6+r9B+C7Z.R4h+C7Z.X3h));g[(F9+C7Z.i6+E3)][(C7Z.w6+K3h+H6h+B0h+v8h)][(C7Z.c0h+Q1c+C7Z.V7)][U8B]=(C7Z.l8h+t8h+Z1c);g[S4c][(C7Z.w6+C7Z.Q6+D7+s2h+H6h+B0h+v8h)][x8B][(E4B+d5h+C7Z.c0h+C7Z.w6+E3B)]="visible";}
}
,_show:function(a){var R3="lope",s2c="En",X9c="ED_",q2="ED_L",U1c="bin",H7B="nim",l4B="wPadding",C5h="ani",C0h="roll",z2c="wS",G8B="ndo",k3h="wi",q6c="orma",X4h="roun",e6B="etHe",r6h="offs",N4="marginLeft",t6h="ffsetW",M2c="Ro",y8B="Att";a||(a=function(){}
);g[(K1B+f2h)][j4B][x8B].height=(v2+C7Z.R4h+t8h);var b=g[(K1B+f2h)][(D1c+I4B+C7Z.W7)][(C7Z.c0h+t9h+E4h)];b[U3B]=0;b[(C7Z.i6+d5h+O9c+l5)]=(h7c+H2);var c=g[(F9+M1c+y8B+P9+n5h+M2c+A4B)](),e=g[(F9+n5h+y3+H6h+n5h+C7Z.R4h+p7c+o4h+D7)](),d=c[(t8h+t6h+n8B+C7Z.R4h+n5h)];b[(C7Z.i6+d5h+C7Z.c0h+q0h+E8h+C7Z.Q6+C7Z.X3h)]=(C7Z.l8h+t8h+C7Z.l8h+C7Z.V7);b[(t8h+M6h+D7+d5h+t9h)]=1;g[S4c][d5B][x8B].width=d+(q0h+K4B);g[(F9+C7Z.i6+E3)][(J9h+C7Z.Q6+I4B+C7Z.W7)][x8B][N4]=-(d/2)+(q0h+K4B);g._dom.wrapper.style.top=l(c).offset().top+c[(r6h+e6B+K0c+C7Z.R4h)]+"px";g._dom.content.style.top=-1*e-20+(q0h+K4B);g[S4c][(C7Z.w6+C7Z.Q6+D7+y8+B0h+t8h+b5B+C7Z.i6)][(C7Z.c0h+t9h+E4h)][(B3+C7Z.Q6+r9B+C7Z.R4h+C7Z.X3h)]=0;g[(S4c)][(J3c+D7+y8+X4h+C7Z.i6)][(C7Z.c0h+t9h+E8h+C7Z.V7)][(V4B+W5)]=(h7c+c4+s2h);l(g[S4c][c8h])[(o4+f4r+C7Z.U8+C7Z.V7)]({opacity:g[U4r]}
,(C7Z.l8h+q6c+E8h));l(g[S4c][d5B])[O2c]();g[(D7+T1B)][(k3h+G8B+z2c+D7+C0h)]?l((n5h+O0+v0c+C7Z.w6+B8+C7Z.X3h))[(C5h+f2h+B9)]({scrollTop:l(c).offset().top+c[C8c]-g[(D7+T1B)][(A4B+d5h+C7Z.l8h+C7Z.i6+t8h+l4B)]}
,function(){l(g[S4c][(D7+t8h+C7Z.l8h+o2c+C7Z.R4h)])[D7B]({top:0}
,600,a);}
):l(g[(J4c+E3)][(N3B+G3B)])[(C7Z.Q6+H7B+C7Z.Q6+o0h)]({top:0}
,600,a);l(g[S4c][n2h])[(C7Z.w6+d5h+C7Z.l8h+C7Z.i6)]("click.DTED_Envelope",function(){g[(F9+U3c)][n2h]();}
);l(g[S4c][c8h])[(U1c+C7Z.i6)]("click.DTED_Envelope",function(){g[(z2B)][(u0h+J7h+t8h+C7Z.F4h+C7Z.l8h+C7Z.i6)]();}
);l((C7Z.i6+E9c+C7Z.I4c+D5+C0+q2+m8B+n5h+x4h+u7+F9+p7c+d3+C7Z.R4h+Z6+Y1c+I4B+C7Z.V7+B0h),g[(F9+i9h+f2h)][d5B])[c7c]((q5B+C7Z.I4c+D5+C0+X9c+s2c+E4B+C7Z.V7+q5h+I0h),function(a){var K9h="backgr",l7c="Wrapper",a7="e_Con",D9h="TED_E",r7h="Cla";l(a[E0B])[(n5h+C7Z.Q6+C7Z.c0h+r7h+C7Z.c0h+C7Z.c0h)]((D5+D9h+C7Z.l8h+E4B+j9c+q0h+a7+G3B+F9+l7c))&&g[z2B][(K9h+m9+B1c)]();}
);l(p)[(C7Z.w6+Q2B)]((z5c+m2+g3h+C7Z.V7+C7Z.I4c+D5+t7+F9+Z5+Y2c+C7Z.V7+R3),function(){g[a1c]();}
);}
,_heightCalc:function(){var H7c="dy_",r8B="rHei",U9B="Paddin",d8c="wrap",n0h="heightCalc";g[e3][n0h]?g[(D7+T1B)][n0h](g[S4c][(d8c+q0h+C7Z.V7+B0h)]):l(g[S4c][(N3B+C7Z.R4h+C7Z.V7+C7Z.l8h+C7Z.R4h)])[(D7+U8h+P4h+B0h+C7Z.V7+C7Z.l8h)]().height();var a=l(p).height()-g[(D7+T1B)][(A4B+d5h+B1c+t8h+A4B+U9B+H6h)]*2-l("div.DTE_Header",g[(S4c)][d5B])[e4h]()-l("div.DTE_Footer",g[(S4c)][d5B])[(t8h+C7Z.F4h+o0h+r8B+H6h+B9B)]();l((V4B+E4B+C7Z.I4c+D5+C0+Z5+A3c+t8h+H7c+w3B+C7Z.l8h+C7Z.R4h+Z6+C7Z.R4h),g[(F9+C7Z.i6+E3)][d5B])[(Q5B)]((f2h+C7Z.Q6+K4B+j5+C7Z.V7+m8B+n5h+C7Z.R4h),a);return l(g[(J4c+C7Z.R4h+C7Z.V7)][j0B][(d8c+M8c)])[e4h]();}
,_hide:function(a){var O8c="_Ligh",c6h="rap",U2h="pper",q2c="_Wr",g7="Conten",q6B="box_",i5B="D_",F1h="unbin",y9h="clic";a||(a=function(){}
);l(g[(J4c+E3)][(D7+t8h+C7Z.l8h+o2c+C7Z.R4h)])[D7B]({top:-(g[(K1B+f2h)][(s7B+Y8h+C7Z.l8h+C7Z.R4h)][C8c]+50)}
,600,function(){var x3h="fadeOut";l([g[S4c][(J9h+C7Z.Q6+q0h+q0h+C7Z.W7)],g[(F9+i9h+f2h)][c8h]])[x3h]("normal",a);}
);l(g[(J4c+t8h+f2h)][n2h])[w4h]((y9h+s2h+C7Z.I4c+D5+H3+D5+z1B+V8+x4h+u7));l(g[(F9+j0B)][c8h])[(F1h+C7Z.i6)]("click.DTED_Lightbox");l((H8+C7Z.I4c+D5+H3+i5B+E2+d5h+H6h+B9B+q6B+g7+C7Z.R4h+q2c+C7Z.Q6+U2h),g[(F9+C7Z.i6+t8h+f2h)][(A4B+c6h+M8c)])[w4h]((D7+E8h+S8c+C7Z.I4c+D5+C0+Z5+D5+O8c+C7Z.R4h+k5c+K4B));l(p)[w4h]("resize.DTED_Lightbox");}
,_findAttachRow:function(){var a=l(g[z2B][C7Z.c0h][(I3+h7c+C7Z.V7)])[(D5+C7Z.Q6+I3+S+C7Z.w6+E4h)]();return g[(D7+t8h+C7Z.l8h+C7Z.p5h)][c3h]==="head"?a[(C7Z.R4h+x7+E8h+C7Z.V7)]()[i3]():g[(J4c+C7Z.R4h+C7Z.V7)][C7Z.c0h][(C7Z.Q6+x1h+t8h+C7Z.l8h)]===(D7+z5c+C7Z.Q6+C7Z.R4h+C7Z.V7)?a[C7Z.A7c]()[i3]():a[A8](g[z2B][C7Z.c0h][(U6+E1+C7Z.V7+B0h)])[M4r]();}
,_dte:null,_ready:!1,_cssBackgroundOpacity:1,_dom:{wrapper:l((L2+u7h+h5+U7c+B7h+N1+r1B+Y6c+U7+p2h+U7+U7c+U7+p2h+U7+d7+g1h+E7+A1h+j1B+I6h+F9h+K7c+j1B+j1B+X+u4c+u7h+h5+U7c+B7h+N1+r1B+Y6c+U7+D8c+X5c+r4r+n3h+x5h+e0c+Z5c+A1h+Y2h+N6h+f4c+S8h+u7h+h5+A0h+u7h+h5+U7c+B7h+n3h+X0+r1B+Y6c+U7+U0h+Q7+r5c+Q7+c4c+n3h+x5h+F9h+r0h+Z5c+A1h+k2c+d3h+H4B+h0c+S8h+u7h+h5+A0h+u7h+h5+U7c+B7h+y6B+e4B+Y6c+U7+U0h+Q7+r5c+Q7+g1h+r4r+w1h+T6+A1h+E0h+d3h+g1h+I6h+U1B+S8h+u7h+h5+m1+u7h+d3h+P3B+J7))[0],background:l((L2+u7h+d3h+P3B+U7c+B7h+Y7B+Y6c+U7+p2h+r5c+Q7+Y0h+Y4h+H4B+T0h+l4c+g1h+u7h+u4c+u7h+d3h+P3B+q5c+u7h+d3h+P3B+J7))[0],close:l((L2+u7h+h5+U7c+B7h+Y7B+Y6c+U7+D8c+d7+g1h+P3B+O6c+j1B+I6h+F9h+T6+n3h+A1h+s6h+I1+f4c+x1+I6h+r1B+n6c+u7h+d3h+P3B+J7))[0],content:null}
}
);g=f[(A1+E8h+C7Z.Q6+C7Z.X3h)][(Z6+A1B+E8h+t8h+I0h)];g[(D7+T1B)]={windowPadding:o1h,heightCalc:x2c,attach:A8,windowScroll:!l4}
;f.prototype.add=function(a){var x0h="aSourc",j4h="lready",r1c="'. ",W1h="ddi",K4r="` ",O4B=" `",k6="uire",S5h="isAr";if(d[(S5h+B0h+l5)](a))for(var b=0,c=a.length;b<c;b++)this[(X9+C7Z.i6)](a[b]);else{b=a[I8c];if(b===h)throw (D6c+B0h+C7Z.N6+p7B+C7Z.Q6+C7Z.i6+C7Z.i6+F6B+p7B+C7Z.p5h+d5h+C7Z.V7+E8h+C7Z.i6+w7h+C0+n5h+C7Z.V7+p7B+C7Z.p5h+d4B+C7Z.i6+p7B+B0h+b7+k6+C7Z.c0h+p7B+C7Z.Q6+O4B+C7Z.l8h+C7Z.Q6+f2h+C7Z.V7+K4r+t8h+q0h+C7Z.R4h+Q9);if(this[C7Z.c0h][S6h][b])throw (D6c+d3c+B0h+p7B+C7Z.Q6+W1h+i8c+p7B+C7Z.p5h+d5h+C7Z.V7+E8h+C7Z.i6+H5)+b+(r1c+J9c+p7B+C7Z.p5h+d4B+C7Z.i6+p7B+C7Z.Q6+j4h+p7B+C7Z.V7+K4B+d5h+X6+C7Z.c0h+p7B+A4B+H1c+n5h+p7B+C7Z.R4h+n5h+d5h+C7Z.c0h+p7B+C7Z.l8h+Y4+C7Z.V7);this[(F9+C7Z.i6+C7Z.U8+x0h+C7Z.V7)]("initField",a);this[C7Z.c0h][S6h][b]=new f[(Q5+Z8B+P4h)](a,this[(I9B+C7Z.Q6+V9B+C7Z.c0h)][B2h],this);this[C7Z.c0h][V4c][P3h](b);}
this[u5B](this[(C7Z.N6+C7Z.i6+C7Z.W7)]());return this;}
;f.prototype.background=function(){var H9h="nBa",a=this[C7Z.c0h][D1][(t8h+H9h+D7+E3h+m9+B1c)];Q0===a?this[Q0]():n2h===a?this[n2h]():(Y9+P)===a&&this[(g9+C7c+d5h+C7Z.R4h)]();return this;}
;f.prototype.blur=function(){var G9B="_blur";this[G9B]();return this;}
;f.prototype.bubble=function(a,b,c,e){var v0h="_focus",L4B="imate",C4B="bubblePosition",M7c="prepend",v4c="Erro",O6B="dTo",m5B="poi",S3h='" /></div></div><div class="',g8="liner",K0h="rappe",i0h="asse",b4c="apply",q3B="bubbleNodes",d7h="esi",X8c="ions",c2c="individual",F3B="mOptio",F1="sPla",s0B="olean",X4="isPla",I4h="_tid",j=this;if(this[(I4h+C7Z.X3h)](function(){j[(W4+m5)](a,b,e);}
))return this;d[(X4+d5h+C6B+C7Z.w6+f2c+D7+C7Z.R4h)](b)?(e=b,b=h,c=!l4):(C7Z.w6+t8h+s0B)===typeof b&&(c=b,e=b=h);d[(d5h+F1+d5h+C7Z.l8h+P8+C7Z.w6+C7Z.G2h+C7Z.a2c)](c)&&(e=c,c=!l4);c===h&&(c=!l4);var e=d[T2h]({}
,this[C7Z.c0h][(C7Z.p5h+C7Z.N6+F3B+C7Z.l8h+C7Z.c0h)][(W4+h7c+C7Z.V7)],e),o=this[(h6B+C7Z.R4h+C7Z.Q6+a4+t8h+q2B+D7+C7Z.V7)](c2c,a,b);this[u3h](a,o,(X2c));if(!this[(F9+Y4B+C7Z.V7+t8h+q0h+C7Z.V7+C7Z.l8h)]((W4+m5)))return this;var f=this[(Q1B+t8h+P0c+m4c+X8c)](e);d(p)[d3]((B0h+d7h+g3h+C7Z.V7+C7Z.I4c)+f,function(){var l5h="bbleP";j[(C2c+l5h+m6+H1c+B3c+C7Z.l8h)]();}
);var k=[];this[C7Z.c0h][q3B]=k[(D7+d3+D7+C7Z.U8)][b4c](k,y(o,c3h));k=this[(D7+E8h+i0h+C7Z.c0h)][(C2c+C7Z.w6+m5)];o=d(h6h+k[(C7Z.w6+H6h)]+(u4c+u7h+h5+q5c+u7h+h5+J7));k=d(h6h+k[(A4B+K0h+B0h)]+W2B+k[g8]+W2B+k[(R9c+E4h)]+(u4c+u7h+d3h+P3B+U7c+B7h+n3h+Z9h+e4B+Y6c)+k[(I9B+t8h+w8)]+S3h+k[(m5B+g5c+C7Z.V7+B0h)]+(b7c+u7h+h5+J7));c&&(k[e5B]((k5c+C7Z.i6+C7Z.X3h)),o[(k0c+C7Z.V7+C7Z.l8h+O6B)]((C7Z.w6+t8h+C7Z.i6+C7Z.X3h)));var c=k[(D7+U8h+E8h+C7Z.i6+m7h)]()[(b7)](l4),w=c[T1c](),g=w[(I1B+d5h+E8h+C7Z.i6+B0h+Z6)]();c[T8c](this[(i9h+f2h)][(f6+B0h+f2h+v4c+B0h)]);w[M7c](this[j0B][(C7Z.p5h+t8h+P0c)]);e[(k0+C7Z.c0h+C7Z.Q6+H6h+C7Z.V7)]&&c[M7c](this[(i9h+f2h)][W4c]);e[K7]&&c[(q0h+z5c+q0h+Z6+C7Z.i6)](this[j0B][i3]);e[(C2c+l1h+C7Z.c0h)]&&w[(C7Z.Q6+I4B+D2h)](this[j0B][(E3c+C7Z.R4h+t8h+N2c)]);var z=d()[(X9+C7Z.i6)](k)[l9B](o);this[U4c](function(){z[D7B]({opacity:l4}
,function(){var Q9B="icInfo",F9c="ynam",s2B="rD";z[j1c]();d(p)[g1B]((z5c+m2+x5c+C7Z.I4c)+f);j[(F9+D7+E4h+C7Z.Q6+s2B+F9c+Q9B)]();}
);}
);o[(D7+E8h+K5B+s2h)](function(){j[Q0]();}
);g[(D7+H0h)](function(){var E7h="_cl";j[(E7h+t8h+C7Z.c0h+C7Z.V7)]();}
);this[C4B]();z[(C7Z.Q6+C7Z.l8h+L4B)]({opacity:r4}
);this[v0h](this[C7Z.c0h][(d5h+C7Z.l8h+D7+E8h+C7Z.F4h+C7Z.i6+C7Z.V7+Q5+d5h+u8B)],e[(f6+J2B+C7Z.c0h)]);this[(F9+A0B+t8h+e4c)]((C2c+i0));return this;}
;f.prototype.bubblePosition=function(){var V2h="lef",L0B="veClas",u8h="th",O7="ft",e3h="eNo",k0B="bubb",m3c="e_L",a=d("div.DTE_Bubble"),b=d((V4B+E4B+C7Z.I4c+D5+H3+F9+K9c+D4B+C7Z.w6+E8h+m3c+u6h)),c=this[C7Z.c0h][(k0B+E8h+e3h+Y1h+C7Z.c0h)],e=0,j=0,o=0,f=0;d[(C7Z.V7+C7Z.Q6+D7+n5h)](c,function(a,b){var o3c="setWidth",c=d(b)[m9h]();e+=c.top;j+=c[(E8h+C7Z.V7+O7)];o+=c[(E8h+d1)]+b[(g1B+o3c)];f+=c.top+b[(t8h+C7Z.p5h+C7Z.p5h+P1B+j5+y3+H6h+B9B)];}
);var e=e/c.length,j=j/c.length,o=o/c.length,f=f/c.length,c=e,k=(j+o)/2,w=b[(m9+C7Z.R4h+C7Z.V7+B0h+v4h+d5h+C7Z.i6+u8h)](),g=k-w/2,w=g+w,h=d(p).width();a[(D7+B6)]({top:c,left:k}
);b.length&&0>b[(g1B+C7Z.c0h+C7Z.V7+C7Z.R4h)]().top?a[Q5B]("top",f)[(C7Z.Q6+C7Z.i6+H8c+C7Z.Q6+B6)]("below"):a[(B0h+C7Z.V7+f2h+t8h+L0B+C7Z.c0h)]("below");w+15>h?b[(Q6B+C7Z.c0h)]((V2h+C7Z.R4h),15>g?-(g-15):-(w-h+15)):b[(D7+C7Z.c0h+C7Z.c0h)]((E4h+O7),15>g?-(g-15):0);return this;}
;f.prototype.buttons=function(a){var X3B="_b",b=this;(X3B+d8+K5B)===a?a=[{label:this[(O3h+s0)][this[C7Z.c0h][l6B]][W4r],fn:function(){this[W4r]();}
}
]:d[(i9c+O7B+C7Z.X3h)](a)||(a=[a]);d(this[(i9h+f2h)][f1]).empty();d[o6c](a,function(a,e){var j2h="keypress",C4r="eyu",k7="tabindex",e8B="className",i3c="<button/>";i2c===typeof e&&(e={label:e,fn:function(){var T0c="bmi";this[(g9+T0c+C7Z.R4h)]();}
}
);d(i3c,{"class":b[r9][S4r][(E3c+O8B)]+(e[e8B]?p7B+e[(D7+E8h+c8+y1c+f2h+C7Z.V7)]:m4h)}
)[N4h](m2B===typeof e[(E8h+C7Z.Q6+l0B)]?e[h4h](b):e[(i3h+C7Z.w6+s3)]||m4h)[(C7Z.U8+C7Z.R4h+B0h)](k7,l4)[d3]((s2h+C4r+q0h),function(a){C7h===a[(s2h+W1B+C7Z.i6+C7Z.V7)]&&e[(C7Z.p5h+C7Z.l8h)]&&e[C7Z.D4h][(D7+C7Z.Q6+k8h)](b);}
)[(d3)](j2h,function(a){C7h===a[T7B]&&a[j8]();}
)[d3]((I9B+K5B+s2h),function(a){var X6B="faul",V2="ev";a[(q0h+B0h+V2+Z3h+D5+C7Z.V7+X6B+C7Z.R4h)]();e[(C7Z.p5h+C7Z.l8h)]&&e[C7Z.D4h][K2h](b);}
)[(C7Z.Q6+q0h+q0h+C7Z.V7+C7Z.l8h+C7Z.i6+f7h)](b[j0B][f1]);}
);return this;}
;f.prototype.clear=function(a){var P0h="destroy",b=this,c=this[C7Z.c0h][S6h];(C7Z.c0h+m6h+d5h+C7Z.l8h+H6h)===typeof a?(c[a][P0h](),delete  c[a],a=d[(g4r+O7B+C7Z.X3h)](a,this[C7Z.c0h][(t8h+B0h+C7Z.i6+C7Z.W7)]),this[C7Z.c0h][V4c][(O9c+d5h+D7+C7Z.V7)](a,r4)):d[o6c](this[R3h](a),function(a,c){var W7h="clear";b[W7h](c);}
);return this;}
;f.prototype.close=function(){this[R5c](!r4);return this;}
;f.prototype.create=function(a,b,c,e){var e3B="Ma",l6="sembl",o0B="Cr",G6h="gs",C9B="_cru",C4h="itFie",j=this,o=this[C7Z.c0h][(C7Z.p5h+d5h+C7Z.V7+E8h+C7Z.i6+C7Z.c0h)],f=r4;if(this[(F9+C7Z.R4h+n8B+C7Z.X3h)](function(){j[r4h](a,b,c,e);}
))return this;v1c===typeof a&&(f=a,a=b,b=c);this[C7Z.c0h][(C7Z.V7+C7Z.i6+d5h+C7Z.R4h+S2B+C7Z.i6+C7Z.c0h)]={}
;for(var k=l4;k<f;k++)this[C7Z.c0h][(n1+C4h+E8h+F2h)][k]={fields:this[C7Z.c0h][S6h]}
;f=this[(C9B+C7Z.i6+J9c+B0h+G6h)](a,b,c,e);this[C7Z.c0h][(P9+C7Z.R4h+d5h+d3)]=r4h;this[C7Z.c0h][X7c]=x2c;this[j0B][(S4r)][x8B][(C7Z.i6+d5h+W5)]=S5B;this[(F9+C7Z.Q6+x1h+t8h+C7Z.l8h+p7c+E8h+C7Z.Q6+C7Z.c0h+C7Z.c0h)]();this[(E9B+b6+i3h+C7Z.X3h+G4+n7+T7h)](this[(C7Z.p5h+d5h+u8B)]());d[(C7Z.V7+C7Z.Q6+D7+n5h)](o,function(a,b){var z8="Rese";b[(f2h+t6B+C7Z.R4h+d5h+z8+C7Z.R4h)]();b[(C7Z.c0h+C7Z.D9)](b[J8h]());}
);this[(F9+F4c+g5c)]((d5h+C7Z.l8h+H1c+o0B+l2h+C7Z.V7));this[(F9+C7Z.Q6+C7Z.c0h+l6+C7Z.V7+e3B+g4r)]();this[(H6+B0h+f2h+P8+q0+L5B)](f[L2B]);f[(f2h+C7Z.Q6+K2+d6h+e4c)]();return this;}
;f.prototype.dependent=function(a,b,c){var C5c="ST",e=this,j=this[B2h](a),o={type:(E8+P8+C5c),dataType:(C7Z.G2h+Z4c)}
,c=d[(E5c+B1c)]({event:(I1B+j5h+C7Z.V7),data:null,preUpdate:null,postUpdate:null}
,c),f=function(a){var X3="ostUpdate";var Q8h="stUp";var I2="err";var N9h="messag";var X6c="eUp";c[(c6B+F3+q0h+q0B+C7Z.R4h+C7Z.V7)]&&c[(q0h+B0h+X6c+C7Z.i6+C7Z.U8+C7Z.V7)](a);d[(C7Z.V7+C7Z.Q6+D7+n5h)]({labels:(E8h+x7+C7Z.V7+E8h),options:(g5B+q0B+C7Z.R4h+C7Z.V7),values:(R3B+E8h),messages:(N9h+C7Z.V7),errors:(I2+t8h+B0h)}
,function(b,c){a[b]&&d[o6c](a[b],function(a,b){e[(r3+C7Z.i6)](a)[c](b);}
);}
);d[(C7Z.V7+C7Z.Q6+I1B)]([(U8h+Y1h),"show",(C7Z.V7+C7Z.l8h+C7Z.Q6+h7c+C7Z.V7),(C7Z.i6+d5h+C7Z.c0h+C7Z.Q6+C7Z.w6+E4h)],function(b,c){if(a[c])e[c](a[c]);}
);c[(q0h+t8h+Q8h+q0B+o0h)]&&c[(q0h+X3)](a);}
;j[(d5h+C7Z.l8h+F6h)]()[(t8h+C7Z.l8h)](c[(C7Z.V7+E4B+Z6+C7Z.R4h)],function(){var R0h="Pl",p5c="nct",I0c="values",S4B="editF",e5="ditF",I7="ows",a={}
;a[(B0h+I7)]=e[C7Z.c0h][(C7Z.V7+e5+Z8B+E8h+F2h)]?y(e[C7Z.c0h][(S4B+Z8B+P4h+C7Z.c0h)],(q0B+I3)):null;a[(B0h+i7)]=a[(B0h+I7)]?a[(d3c+Z1h)][0]:null;a[I0c]=e[(E4B+o4h)]();if(c.data){var g=c.data(a);g&&(c.data=g);}
(C7Z.p5h+C7Z.F4h+p5c+d5h+t8h+C7Z.l8h)===typeof b?(a=b(j[W8](),a,f))&&f(a):(d[(i9c+R0h+C7Z.Q6+d5h+C6B+L7c+C7Z.V7+D7+C7Z.R4h)](b)?d[(X2+C7Z.R4h+C7Z.V7+B1c)](o,b):o[X8B]=b,d[(c3+d2)](d[T2h](o,{url:b,data:a,success:f}
)));}
);return this;}
;f.prototype.disable=function(a){var b=this[C7Z.c0h][S6h];d[o6c](this[(Q1B+f2B+e0+Y4+C7Z.V7+C7Z.c0h)](a),function(a,e){b[e][B0B]();}
);return this;}
;f.prototype.display=function(a){return a===h?this[C7Z.c0h][a6B]:this[a?n2c:(D7+E8h+t8h+C7Z.c0h+C7Z.V7)]();}
;f.prototype.displayed=function(){return d[z4](this[C7Z.c0h][S6h],function(a,b){var h8="ye",j0h="displa";return a[(j0h+h8+C7Z.i6)]()?b:x2c;}
);}
;f.prototype.displayNode=function(){return this[C7Z.c0h][(C7Z.i6+d5h+b6+E8h+C7Z.Q6+C7Z.X3h+p7c+d3+C7Z.R4h+d3c+I5h+B0h)][(C7Z.l8h+t8h+C7Z.i6+C7Z.V7)](this);}
;f.prototype.edit=function(a,b,c,e,d){var A5="maybeOpen",p5B="udA",f=this;if(this[N1h](function(){f[(C7Z.V7+C7Z.i6+d5h+C7Z.R4h)](a,b,c,e,d);}
))return this;var n=this[(F9+D7+B0h+p5B+x0c+C7Z.c0h)](b,c,e,d);this[u3h](a,this[(h6B+I3+a4+m9+B0h+n1B)]((E1+u8B),a),(f2h+B5B));this[t3]();this[(F9+f6+B0h+f2h+y4+C7Z.R4h+B3c+N2c)](n[(B3+O6h)]);n[A5]();return this;}
;f.prototype.enable=function(a){var b=this[C7Z.c0h][S6h];d[o6c](this[(F9+E1+g1c+y1c+Y8B+C7Z.c0h)](a),function(a,e){b[e][(C7Z.V7+C7Z.l8h+C7Z.Q6+C7Z.w6+E8h+C7Z.V7)]();}
);return this;}
;f.prototype.error=function(a,b){var p4c="formError",n2="_message";b===h?this[n2](this[j0B][p4c],a):this[C7Z.c0h][(E1+u8B)][a].error(b);return this;}
;f.prototype.field=function(a){return this[C7Z.c0h][(E1+C7Z.V7+E8h+C7Z.i6+C7Z.c0h)][a];}
;f.prototype.fields=function(){return d[(f2h+C7Z.Q6+q0h)](this[C7Z.c0h][S6h],function(a,b){return b;}
);}
;f.prototype.get=function(a){var b=this[C7Z.c0h][(C7Z.p5h+d5h+u8B)];a||(a=this[S6h]());if(d[q6](a)){var c={}
;d[o6c](a,function(a,d){c[d]=b[d][j2]();}
);return c;}
return b[a][(H6h+C7Z.V7+C7Z.R4h)]();}
;f.prototype.hide=function(a,b){var H1h="Names",j6h="_fie",c=this[C7Z.c0h][S6h];d[o6c](this[(j6h+P4h+H1h)](a),function(a,d){c[d][(n5h+d5h+Y1h)](b);}
);return this;}
;f.prototype.inError=function(a){var s4B="Err";if(d(this[(j0B)][(C7Z.p5h+C7Z.N6+f2h+Z5+A1c+C7Z.N6)])[i9c]((F3c+E4B+i9c+d5h+C7Z.w6+E4h)))return !0;for(var b=this[C7Z.c0h][S6h],a=this[R3h](a),c=0,e=a.length;c<e;c++)if(b[a[c]][(d5h+C7Z.l8h+s4B+t8h+B0h)]())return !0;return !1;}
;f.prototype.inline=function(a,b,c){var I3h="po",h7='ton',R5='_Bu',n6='ne',U4h='I',S3='ie',D3='F',T9='e_',e8='E_',b5c='ine',W2c='Inl',I8='TE_',m8h="contents",y0h="_preopen",d8B="nli",Q9h="nline",p3h="ua",e=this;d[P5B](b)&&(c=b,b=h);var c=d[(C7Z.V7+H4+B1c)]({}
,this[C7Z.c0h][K5][(d5h+C7Z.l8h+E8h+d5h+Z1c)],c),j=this[L1]((d5h+F0B+Y8c+C7Z.i6+p3h+E8h),a,b),f,n,k=0,g,I=!1;d[o6c](j,function(a,b){var G4c="displayFields",K4="nno";if(k>0)throw (w7B+K4+C7Z.R4h+p7B+C7Z.V7+C7Z.i6+d5h+C7Z.R4h+p7B+f2h+t8h+z5c+p7B+C7Z.R4h+G3c+p7B+t8h+Z1c+p7B+B0h+i7+p7B+d5h+Q9h+p7B+C7Z.Q6+C7Z.R4h+p7B+C7Z.Q6+p7B+C7Z.R4h+d5h+Y8B);f=d(b[(p3+I1B)][0]);g=0;d[o6c](b[G4c],function(a,b){var D5c="Can";if(g>0)throw (D5c+C7Z.l8h+t8h+C7Z.R4h+p7B+C7Z.V7+C7Z.i6+d5h+C7Z.R4h+p7B+f2h+C7Z.N6+C7Z.V7+p7B+C7Z.R4h+K5h+C7Z.l8h+p7B+t8h+Z1c+p7B+C7Z.p5h+f2B+p7B+d5h+d8B+C7Z.l8h+C7Z.V7+p7B+C7Z.Q6+C7Z.R4h+p7B+C7Z.Q6+p7B+C7Z.R4h+d5h+f2h+C7Z.V7);n=b;g++;}
);k++;}
);if(d((C7Z.i6+E9c+C7Z.I4c+D5+C0+x7h+f2B),f).length||this[N1h](function(){e[(d5h+d8B+C7Z.l8h+C7Z.V7)](a,b,c);}
))return this;this[u3h](a,j,(Q4r));var z=this[(H6+B0h+f2h+m4c+Q9+C7Z.c0h)](c);if(!this[y0h]((d5h+Q9h)))return this;var N=f[m8h]()[j1c]();f[(k0c+Z6+C7Z.i6)](d((L2+u7h+h5+U7c+B7h+n3h+Z9h+r1B+r1B+Y6c+U7+p2h+U7c+U7+I8+W2c+b5c+u4c+u7h+d3h+P3B+U7c+B7h+y6B+r1B+r1B+Y6c+U7+U0h+e8+W2c+d3h+g1h+T9+D3+S3+n3h+u7h+l9c+u7h+h5+U7c+B7h+n3h+Z9h+r1B+r1B+Y6c+U7+U0h+e8+U4h+g1h+n3h+d3h+n6+R5+f4c+h7+r1B+h5c+u7h+d3h+P3B+J7)));f[M1c]("div.DTE_Inline_Field")[(C7Z.Q6+q0h+q0h+Z6+C7Z.i6)](n[(V6c+Y1h)]());c[(C7Z.w6+C7Z.F4h+C7Z.R4h+k8)]&&f[(E1+B1c)]((V4B+E4B+C7Z.I4c+D5+C0+Z5+I1c+E8h+g4r+k4h+K9c+C7Z.F4h+C7Z.R4h+Q5h+C7Z.l8h+C7Z.c0h))[T8c](this[(C7Z.i6+E3)][f1]);this[(F9+h4B+C7Z.c0h+C7Z.V7+G4+K3)](function(a){var e2B="cInfo",F8B="yna";I=true;d(r)[g1B]((I9B+d5h+D7+s2h)+z);if(!a){f[m8h]()[(L9+C7Z.Q6+D7+n5h)]();f[(L4+q0h+C7Z.V7+C7Z.l8h+C7Z.i6)](N);}
e[(F9+D7+T+D5+F8B+Q0B+e2B)]();}
);setTimeout(function(){if(!I)d(r)[(t8h+C7Z.l8h)]("click"+z,function(a){var B1h="aren",F3h="inAr",G6B="_t",Z3="addBack",b=d[(C7Z.D4h)][Z3]?"addBack":"andSelf";!n[(G6B+l3c+J1h+C7Z.l8h)]("owns",a[(C7Z.R4h+C7Z.Q6+x0c+C7Z.D9)])&&d[(F3h+B0h+C7Z.Q6+C7Z.X3h)](f[0],d(a[(C7Z.R4h+P0+F0+C7Z.R4h)])[(q0h+B1h+O6h)]()[b]())===-1&&e[Q0]();}
);}
,0);this[(F9+C7Z.p5h+t4)]([n],c[t0h]);this[(F9+I3h+C7Z.c0h+C7Z.R4h+B3+Z6)]("inline");return this;}
;f.prototype.message=function(a,b){var G3="formIn",J0B="ssag";b===h?this[(v0B+C7Z.V7+J0B+C7Z.V7)](this[(j0B)][(G3+f6)],a):this[C7Z.c0h][(C7Z.p5h+Z8B+h3h)][a][(Y8B+C7Z.c0h+C7Z.c0h+C7Z.Q6+H6h+C7Z.V7)](b);return this;}
;f.prototype.mode=function(){return this[C7Z.c0h][(P9+C7Z.R4h+d5h+d3)];}
;f.prototype.modifier=function(){var R8="fier";return this[C7Z.c0h][(U6+R8)];}
;f.prototype.multiGet=function(a){var b=this[C7Z.c0h][(J6c+E8h+C7Z.i6+C7Z.c0h)];a===h&&(a=this[(E1+u8B)]());if(d[q6](a)){var c={}
;d[o6c](a,function(a,d){c[d]=b[d][z9h]();}
);return c;}
return b[a][(g8h+h3)]();}
;f.prototype.multiSet=function(a,b){var C1B="tiSet",c=this[C7Z.c0h][(E1+s3+F2h)];d[P5B](a)&&b===h?d[o6c](a,function(a,b){c[a][J7B](b);}
):c[a][(f2h+t6B+C1B)](b);return this;}
;f.prototype.node=function(a){var x9B="ma",I6="der",b=this[C7Z.c0h][(C7Z.p5h+d5h+s3+F2h)];a||(a=this[(C7Z.N6+I6)]());return d[q6](a)?d[(x9B+q0h)](a,function(a){return b[a][M4r]();}
):b[a][(M4r)]();}
;f.prototype.off=function(a,b){var Z4B="Name";d(this)[g1B](this[(F9+C7Z.V7+A1B+g5c+Z4B)](a),b);return this;}
;f.prototype.on=function(a,b){d(this)[(d3)](this[k9B](a),b);return this;}
;f.prototype.one=function(a,b){d(this)[Z3B](this[k9B](a),b);return this;}
;f.prototype.open=function(){var N0h="yC",U8c="preo",v1="yR",a=this;this[(E9B+O9c+C7Z.Q6+v1+n7+L2c+C7Z.W7)]();this[U4c](function(){a[C7Z.c0h][(A1+i3h+C7Z.X3h+p7c+t8h+g5c+d3c+E8h+E8h+C7Z.W7)][(D7+E8h+t8h+C7Z.c0h+C7Z.V7)](a,function(){var g0h="_clearDynamicInfo";a[g0h]();}
);}
);if(!this[(F9+U8c+q0h+C7Z.V7+C7Z.l8h)]((f2h+B5B)))return this;this[C7Z.c0h][(C7Z.i6+d5h+O9c+C7Z.Q6+N0h+t8h+C7Z.l8h+m6h+t8h+E8h+E4h+B0h)][n2c](this,this[(i9h+f2h)][(A4B+B0h+a8+B0h)]);this[(F9+C7Z.p5h+c4+P2B)](d[(f2h+L4)](this[C7Z.c0h][V4c],function(b){return a[C7Z.c0h][(J6c+P4h+C7Z.c0h)][b];}
),this[C7Z.c0h][D1][t0h]);this[(I0B+m6+C7Z.R4h+t8h+e4c)]((f2h+n3+C7Z.l8h));return this;}
;f.prototype.order=function(a){var s8h="rderin",w6c="vided",F5="ditio",B2="joi",h0h="sort",g7c="slic";if(!a)return this[C7Z.c0h][(t8h+B0h+C7Z.i6+C7Z.W7)];arguments.length&&!d[q6](a)&&(a=Array.prototype.slice.call(arguments));if(this[C7Z.c0h][(V4c)][(C7Z.c0h+E8h+d5h+D7+C7Z.V7)]()[(C7Z.c0h+t8h+B0h+C7Z.R4h)]()[(p4h)](A0c)!==a[(g7c+C7Z.V7)]()[h0h]()[(B2+C7Z.l8h)](A0c))throw (J9c+E8h+E8h+p7B+C7Z.p5h+d5h+C7Z.V7+E8h+C7Z.i6+C7Z.c0h+l2c+C7Z.Q6+C7Z.l8h+C7Z.i6+p7B+C7Z.l8h+t8h+p7B+C7Z.Q6+C7Z.i6+F5+z3c+E8h+p7B+C7Z.p5h+d5h+C7Z.V7+E8h+C7Z.i6+C7Z.c0h+l2c+f2h+C7Z.F4h+C7Z.c0h+C7Z.R4h+p7B+C7Z.w6+C7Z.V7+p7B+q0h+B0h+t8h+w6c+p7B+C7Z.p5h+C7Z.N6+p7B+t8h+s8h+H6h+C7Z.I4c);d[(X2+C7Z.R4h+C7Z.V7+C7Z.l8h+C7Z.i6)](this[C7Z.c0h][(t8h+T7h)],a);this[u5B]();return this;}
;f.prototype.remove=function(a,b,c,e,j){var G7="focu",j5B="Ope",e1h="formO",E4c="itM",o2B="mov",V8c="itR",i5c="rce",p8c="_crudArgs",d7c="tid",f=this;if(this[(F9+d7c+C7Z.X3h)](function(){f[(y5h+g4c)](a,b,c,e,j);}
))return this;a.length===h&&(a=[a]);var n=this[p8c](b,c,e,j),k=this[(F9+C7Z.i6+w7+a4+t8h+C7Z.F4h+i5c)]((C7Z.p5h+d5h+s3+C7Z.i6+C7Z.c0h),a);this[C7Z.c0h][(C7Z.Q6+D7+r8h+t8h+C7Z.l8h)]=(B0h+d6+H9+C7Z.V7);this[C7Z.c0h][X7c]=a;this[C7Z.c0h][(n1+d5h+C7Z.R4h+Q5+Z8B+E8h+F2h)]=k;this[(C7Z.i6+t8h+f2h)][(C7Z.p5h+t8h+P0c)][(X6+C7Z.X3h+E4h)][(Z0+G3h+C7Z.X3h)]=(C7Z.l8h+d3+C7Z.V7);this[a5]();this[(m4r+Z3h)]((d5h+C7Z.l8h+V8c+C7Z.V7+o2B+C7Z.V7),[y(k,M4r),y(k,(C7Z.i6+C7Z.Q6+C7Z.R4h+C7Z.Q6)),a]);this[R7]((g4r+E4c+t6B+r8h+G4+C7Z.V7+u6B+A1B),[k,a]);this[t3]();this[(F9+e1h+q0h+r8h+d3+C7Z.c0h)](n[(t8h+q0h+O6h)]);n[(f2h+C7Z.Q6+K2+C7Z.V7+j5B+C7Z.l8h)]();n=this[C7Z.c0h][(C7Z.V7+A0+P8+q0h+C7Z.R4h+C7Z.c0h)];x2c!==n[(G7+C7Z.c0h)]&&d(G6,this[(C7Z.i6+E3)][f1])[(C7Z.V7+C7Z.C8h)](n[(f6+D7+C7Z.F4h+C7Z.c0h)])[t0h]();return this;}
;f.prototype.set=function(a,b){var c=this[C7Z.c0h][(C7Z.p5h+d4B+C7Z.i6+C7Z.c0h)];if(!d[P5B](a)){var e={}
;e[a]=b;a=e;}
d[(C7Z.V7+v4B)](a,function(a,b){c[a][(P1B)](b);}
);return this;}
;f.prototype.show=function(a,b){var c=this[C7Z.c0h][(C7Z.p5h+d5h+g1c+C7Z.c0h)];d[(C7Z.V7+v4B)](this[R3h](a),function(a,d){c[d][(C7Z.c0h+N9B+A4B)](b);}
);return this;}
;f.prototype.submit=function(a,b,c,e){var j=this,f=this[C7Z.c0h][S6h],n=[],k=l4,g=!r4;if(this[C7Z.c0h][(Y4B+c4+C7Z.V7+B6+d5h+i8c)]||!this[C7Z.c0h][(P9+C7Z.R4h+Q9)])return this;this[(F9+Y4B+t8h+D7+C7Z.V7+C7Z.c0h+C7Z.c0h+d5h+i8c)](!l4);var h=function(){var s1c="_submit";n.length!==k||g||(g=!0,j[s1c](a,b,c,e));}
;this.error();d[o6c](f,function(a,b){var H8B="inError";b[H8B]()&&n[(G7h+b2)](a);}
);d[o6c](n,function(a,b){f[b].error("",function(){k++;h();}
);}
);h();return this;}
;f.prototype.title=function(a){var z9="fu",Q8="heade",J3B="sses",a4B="div.",b=d(this[(C7Z.i6+E3)][(c4h+C7Z.Q6+Y1h+B0h)])[(I1B+c0B+C7Z.i6+m7h)](a4B+this[(I9B+C7Z.Q6+J3B)][(Q8+B0h)][j4B]);if(a===h)return b[(n5h+C7Z.R4h+y5B)]();(z9+C7Z.u1c+C7Z.R4h+d5h+t8h+C7Z.l8h)===typeof a&&(a=a(this,new t[(J9c+F8h)](this[C7Z.c0h][(C7Z.R4h+C7Z.Q6+h7c+C7Z.V7)])));b[(N4h)](a);return this;}
;f.prototype.val=function(a,b){return b===h?this[(H6h+C7Z.D9)](a):this[P1B](a,b);}
;var i=t[s3B][(z5c+H6h+d5h+C7Z.c0h+C7Z.R4h+C7Z.V7+B0h)];i((C7Z.V7+C7Z.i6+l8+B0h+f7c),function(){return v(this);}
);i((B0h+i7+C7Z.I4c+D7+z5c+B9+f7c),function(a){var Q5c="creat",b=v(this);b[(D7+B0h+C7Z.V7+B9)](A(b,a,(Q5c+C7Z.V7)));return this;}
);i(a9h,function(a){var b=v(this);b[N4B](this[l4][l4],A(b,a,(C7Z.V7+A0)));return this;}
);i((B0h+t8h+Z1h+Y7c+C7Z.V7+A0+f7c),function(a){var b=v(this);b[N4B](this[l4],A(b,a,(C7Z.V7+C7Z.i6+H1c)));return this;}
);i((B0h+i7+Y7c+C7Z.i6+l0c+C7Z.V7+f7c),function(a){var b=v(this);b[h1h](this[l4][l4],A(b,a,(B0h+C7Z.V7+f2h+t8h+E4B+C7Z.V7),r4));return this;}
);i(f9h,function(a){var G7c="move",b=v(this);b[h1h](this[0],A(b,a,(z5c+G7c),this[0].length));return this;}
);i((n1B+E8h+E8h+Y7c+C7Z.V7+C7Z.i6+d5h+C7Z.R4h+f7c),function(a,b){a?d[(U2B+E8h+C7Z.Q6+d5h+C7Z.l8h+P8+C7Z.w6+C7Z.G2h+C7Z.V7+D7+C7Z.R4h)](a)&&(b=a,a=Q4r):a=(d5h+C7Z.l8h+L0h+C7Z.l8h+C7Z.V7);v(this)[a](this[l4][l4],b);return this;}
);i(s0c,function(a){v(this)[(W4+C7Z.w6+E4h)](this[l4],a);return this;}
);i((C7Z.p5h+c0B+C7Z.V7+f7c),function(a,b){var M8B="file";return f[(M8B+C7Z.c0h)][a][b];}
);i((f6B+C7Z.V7+C7Z.c0h+f7c),function(a,b){if(!a)return f[z4h];if(!b)return f[(E1+C7Z.F0c)][a];f[z4h][a]=b;return this;}
);d(r)[(d3)]((K4B+n5h+B0h+C7Z.I4c+C7Z.i6+C7Z.R4h),function(a,b,c){var U5h="dt";U5h===a[(N7h+u9+q0h+P9+C7Z.V7)]&&c&&c[z4h]&&d[(C7Z.V7+C7Z.Q6+D7+n5h)](c[(C7Z.p5h+c0B+u9)],function(a,b){f[z4h][a]=b;}
);}
);f.error=function(a,b){var X4c="/",a2B="bles",w4c="://",D6h="tp",v9c="nformati",a5c="ore";throw b?a+(p7B+Q5+t8h+B0h+p7B+f2h+a5c+p7B+d5h+v9c+t8h+C7Z.l8h+l2c+q0h+E4h+C7Z.Q6+C7Z.c0h+C7Z.V7+p7B+B0h+C7Z.V7+C7Z.p5h+C7Z.W7+p7B+C7Z.R4h+t8h+p7B+n5h+C7Z.R4h+D6h+C7Z.c0h+w4c+C7Z.i6+C7Z.U8+C7Z.U8+C7Z.Q6+a2B+C7Z.I4c+C7Z.l8h+C7Z.D9+X4c+C7Z.R4h+C7Z.l8h+X4c)+b:a;}
;f[(c9h+C7Z.c0h)]=function(a,b,c){var g3c="nObj",e,j,f,b=d[T2h]({label:"label",value:(E4B+C7Z.Q6+E8h+c8B)}
,b);if(d[(d5h+C7Z.c0h+J9c+B0h+a2)](a)){e=0;for(j=a.length;e<j;e++)f=a[e],d[(U2B+E8h+n3+g3c+C7Z.a2c)](f)?c(f[b[B4c]]===h?f[b[(E8h+C7Z.Q6+C7Z.w6+C7Z.V7+E8h)]]:f[b[B4c]],f[b[(E8h+C7Z.Q6+l0B)]],e):c(f,f,e);}
else e=0,d[(j8h+D7+n5h)](a,function(a,b){c(b,a,e);e++;}
);}
;f[(C7Z.c0h+B1+C7Z.V7+r4c)]=function(a){return a[u3c](/\./g,A0c);}
;f[(C7Z.F4h+q0h+E2c+C7Z.i6)]=function(a,b,c,e,j){var Z0c="taU",H1="eadAsD",o9B="RL",h4c="onload",o=new FileReader,n=l4,k=[];a.error(b[(I8c)],"");o[h4c]=function(){var F2B="oad",U6c="Submi",V8B="ug",y0B="pload",T4B="Pla",w7c="ajaxData",g=new FormData,h;g[(a8+C7Z.l8h+C7Z.i6)]((C7Z.Q6+D7+r8h+t8h+C7Z.l8h),e6);g[T8c]((g5B+q5h+X9+S2B+C7Z.i6),b[I8c]);g[(C7Z.Q6+I4B+D2h)]((C7Z.F4h+q0h+E8h+t8h+C7Z.Q6+C7Z.i6),c[n]);b[(C7Z.Q6+I1h+J6B+C7Z.R4h+C7Z.Q6)]&&b[w7c](g);if(b[(c3+C7Z.Q6+K4B)])h=b[(C7Z.Q6+d5c+K4B)];else if((X6+B0h+g4r+H6h)===typeof a[C7Z.c0h][(C7Z.Q6+d5c+K4B)]||d[(i9c+T4B+d5h+C7Z.l8h+P8+C7Z.w6+C7Z.G2h+C7Z.a2c)](a[C7Z.c0h][(C7Z.Q6+d5c+K4B)]))h=a[C7Z.c0h][(q9h+K4B)];if(!h)throw (e0+t8h+p7B+J9c+C7Z.G2h+C7Z.Q6+K4B+p7B+t8h+q0h+C7Z.R4h+d5h+d3+p7B+C7Z.c0h+q0h+C7Z.V7+r9B+C7Z.p5h+d5h+n1+p7B+C7Z.p5h+C7Z.N6+p7B+C7Z.F4h+y0B+p7B+q0h+E8h+V8B+A0c+d5h+C7Z.l8h);i2c===typeof h&&(h={url:h}
);var z=!r4;a[(t8h+C7Z.l8h)]((c6B+U6c+C7Z.R4h+C7Z.I4c+D5+J3h+Q6c+E8h+F2B),function(){z=!l4;return !r4;}
);d[(C7Z.Q6+d5c+K4B)](d[T2h](h,{type:"post",data:g,dataType:"json",contentType:!1,processData:!1,xhr:function(){var y4c="nl",S9c="npro",W5B="xhr",W5c="ngs",d9h="xS",a=d[(C7Z.Q6+C7Z.G2h+C7Z.Q6+d9h+C7Z.D9+C7Z.R4h+d5h+W5c)][W5B]();a[e6]&&(a[e6][(t8h+S9c+H6h+B0h+C7Z.V7+C7Z.c0h+C7Z.c0h)]=function(a){var n8h="toFixed",K4h="mputa",i6h="gt";a[(E8h+C7Z.V7+C7Z.l8h+i6h+n5h+w3B+K4h+C7Z.w6+E4h)]&&(a=(100*(a[(q5h+C7Z.Q6+Y1h+C7Z.i6)]/a[(C7Z.R4h+t8h+I3+E8h)]))[n8h](0)+"%",e(b,1===c.length?a:n+":"+c.length+" "+a));}
,a[e6][(t8h+y4c+S0+C7Z.i6+Z6+C7Z.i6)]=function(){e(b);}
);return a;}
,success:function(b){var J2c="sD",T3B="dA",T3c="fieldErrors",y7="ldEr";a[(t8h+O9)]((Y4B+q7h+C7Z.F4h+C7c+H1c+C7Z.I4c+D5+C0+Z5+F9+F3+q0h+E2c+C7Z.i6));if(b[(J6c+G0c+C7B+z1c)]&&b[(C7Z.p5h+Z8B+y7+M0+C7Z.c0h)].length)for(var b=b[T3c],e=0,g=b.length;e<g;e++)a.error(b[e][(C7Z.l8h+C7Z.Q6+Y8B)],b[e][m1h]);else b.error?a.error(b.error):(b[(C7Z.p5h+d5h+E4h+C7Z.c0h)]&&d[(C7Z.V7+C7Z.Q6+D7+n5h)](b[(C7Z.p5h+d5h+C7Z.F0c)],function(a,b){f[(C7Z.p5h+c0B+C7Z.V7+C7Z.c0h)][a]=b;}
),k[(G7h+C7Z.c0h+n5h)](b[e6][n8B]),n<c.length-1?(n++,o[(z5c+C7Z.Q6+T3B+J2c+w7+F3+o9B)](c[n])):(j[(D7+C7Z.Q6+k8h)](a,k),z&&a[(Y9+Q0B+C7Z.R4h)]()));}
}
));}
;o[(B0h+H1+C7Z.Q6+Z0c+o9B)](c[l4]);}
;f.prototype._constructor=function(a){var Y0="nitC",s1B="hr",I7c="init",u6c="ssing",G1c="body_content",w2B="foot",v7c="ooter",t0B="form_content",z0c="vent",o5="TT",O4="BU",G6c="bleToo",G5h='_bu',B4B="ader",J9="info",v2h='fo',v2c='m_',H9c='_e',r1='rm',p9h='ent',s4h='nt',n7c="tag",i0c="ter",A2h="foo",F4B='oot',i1c='co',m4B='ody_',x9h="dic",U1='ssing',j1='roc',s6c="xtend",d9c="cyAj",b5="ega",v4="Option",v7="Source",V9="rces",s8B="domT",z5h="Tab",N2="domTable",x5="efault";a=d[T2h](!l4,{}
,f[(C7Z.i6+x5+C7Z.c0h)],a);this[C7Z.c0h]=d[(X2+o0h+B1c)](!l4,{}
,f[G8][b2B],{table:a[N2]||a[(R9c+E8h+C7Z.V7)],dbTable:a[(C7Z.i6+C7Z.w6+z5h+E8h+C7Z.V7)]||x2c,ajaxUrl:a[J5h],ajax:a[h3B],idSrc:a[(d5h+C7Z.i6+a4+m2c)],dataSource:a[(s8B+K8h+C7Z.V7)]||a[(I3+h7c+C7Z.V7)]?f[(C7Z.i6+C7Z.Q6+K0B+C7Z.F4h+V9)][t1]:f[(q0B+I3+v7+C7Z.c0h)][(N4h)],formOptions:a[(f6+P0c+v4+C7Z.c0h)],legacyAjax:a[(E8h+b5+d9c+d2)]}
);this[(I9B+C7Z.Q6+C7Z.c0h+C7Z.c0h+u9)]=d[(C7Z.V7+s6c)](!l4,{}
,f[(d4h+V9B+C7Z.c0h)]);this[(R8h)]=a[R8h];var b=this,c=this[(D7+i3h+V9B+C7Z.c0h)];this[j0B]={wrapper:d('<div class="'+c[(D1c+q0h+M8c)]+(u4c+u7h+h5+U7c+u7h+Z9h+f4c+Z9h+b0+u7h+f4c+I6h+b0+I6h+Y6c+j1B+j1+I6h+U1+w8B+B7h+Y7B+Y6c)+c[(q0h+B0h+c4+C7Z.V7+C7Z.c0h+C7Z.c0h+d5h+C7Z.l8h+H6h)][(g4r+x9h+C7Z.Q6+C7Z.R4h+C7Z.N6)]+(S8h+u7h+h5+A0h+u7h+d3h+P3B+U7c+u7h+Z1B+b0+u7h+v7B+b0+I6h+Y6c+n9h+A1h+u7h+F7B+w8B+B7h+Y7B+Y6c)+c[B2c][d5B]+(u4c+u7h+d3h+P3B+U7c+u7h+Z9h+f4c+Z9h+b0+u7h+v7B+b0+I6h+Y6c+n9h+m4B+i1c+g1h+v7B+g1h+f4c+w8B+B7h+y6B+r1B+r1B+Y6c)+c[(k5h+C7Z.X3h)][(N3B+o2c+C7Z.R4h)]+(h5c+u7h+h5+A0h+u7h+d3h+P3B+U7c+u7h+Z9h+a5B+b0+u7h+v7B+b0+I6h+Y6c+N6h+F4B+w8B+B7h+Y7B+Y6c)+c[(A2h+i0c)][(A4B+B0h+L4+q0h+C7Z.V7+B0h)]+'"><div class="'+c[(C7Z.p5h+t8h+t8h+C7Z.R4h+C7Z.W7)][j4B]+'"/></div></div>')[0],form:d('<form data-dte-e="form" class="'+c[S4r][(n7c)]+(u4c+u7h+h5+U7c+u7h+Z1B+b0+u7h+f4c+I6h+b0+I6h+Y6c+N6h+b0B+C1h+F9h+B7h+A1h+s4h+p9h+w8B+B7h+N1+r1B+Y6c)+c[S4r][(s7B+C7Z.l8h+C7Z.R4h+Z6+C7Z.R4h)]+'"/></form>')[0],formError:d((L2+u7h+h5+U7c+u7h+Z9h+f4c+Z9h+b0+u7h+v7B+b0+I6h+Y6c+N6h+A1h+r1+H9c+U1B+T0h+U1B+w8B+B7h+Y7B+Y6c)+c[(C7Z.p5h+t8h+P0c)].error+(z4B))[0],formInfo:d((L2+u7h+d3h+P3B+U7c+u7h+v8+Z9h+b0+u7h+f4c+I6h+b0+I6h+Y6c+N6h+A1h+U1B+v2c+d3h+g1h+v2h+w8B+B7h+n3h+X0+r1B+Y6c)+c[(K6h+f2h)][J9]+'"/>')[0],header:d((L2+u7h+d3h+P3B+U7c+u7h+Z1B+b0+u7h+v7B+b0+I6h+Y6c+c4B+F6+u7h+w8B+B7h+n3h+Z9h+r1B+r1B+Y6c)+c[(c4h+B4B)][(A4B+B0h+k0c+C7Z.V7+B0h)]+'"><div class="'+c[(n5h+C7Z.V7+B4B)][j4B]+'"/></div>')[0],buttons:d((L2+u7h+d3h+P3B+U7c+u7h+Z9h+a5B+b0+u7h+v7B+b0+I6h+Y6c+N6h+A1h+r1+G5h+u7c+g1h+r1B+w8B+B7h+y6B+e4B+Y6c)+c[(S4r)][(C7Z.w6+m9B+k8)]+(z4B))[0]}
;if(d[C7Z.D4h][t1][t7h]){var e=d[(C7Z.p5h+C7Z.l8h)][t1][(S+G6c+E8h+C7Z.c0h)][(O4+o5+P8+e0+a4)],j=this[R8h];d[o6c]([(D7+B0h+j8h+C7Z.R4h+C7Z.V7),(C7Z.V7+C7Z.i6+d5h+C7Z.R4h),h1h],function(a,b){var q1c="sButtonText",u9c="editor_";e[u9c+b][q1c]=j[b][G6];}
);}
d[o6c](a[(C7Z.V7+z0c+C7Z.c0h)],function(a,c){b[(d3)](a,function(){var T5h="ppl",a=Array.prototype.slice.call(arguments);a[g6h]();c[(C7Z.Q6+T5h+C7Z.X3h)](b,a);}
);}
);var c=this[(C7Z.i6+t8h+f2h)],o=c[(A4B+g6c+I4B+C7Z.V7+B0h)];c[(C7Z.p5h+b0c+p7c+t8h+g5c+C7Z.V7+C7Z.l8h+C7Z.R4h)]=u(t0B,c[(f6+P0c)])[l4];c[(C7Z.p5h+v7c)]=u((w2B),o)[l4];c[B2c]=u(B2c,o)[l4];c[(k5c+C7Z.i6+u9h+C7Z.l8h+C7Z.R4h+Z6+C7Z.R4h)]=u(G1c,o)[l4];c[(q0h+B0h+c4+C7Z.V7+u6c)]=u(S7c,o)[l4];a[S6h]&&this[l9B](a[S6h]);d(r)[(d3)]((I7c+C7Z.I4c+C7Z.i6+C7Z.R4h+C7Z.I4c+C7Z.i6+o0h),function(a,c){var g3="_editor",e5c="nTable";b[C7Z.c0h][(I3+h7c+C7Z.V7)]&&c[e5c]===d(b[C7Z.c0h][(C7Z.R4h+C7Z.Q6+m5)])[(H6h+C7Z.V7+C7Z.R4h)](l4)&&(c[g3]=b);}
)[(d3)]((K4B+s1B+C7Z.I4c+C7Z.i6+C7Z.R4h),function(a,c,e){e&&(b[C7Z.c0h][C7Z.A7c]&&c[(C7Z.l8h+C0+C7Z.Q6+C7Z.w6+E4h)]===d(b[C7Z.c0h][C7Z.A7c])[j2](l4))&&b[(F9+B3+r8h+L5B+F3+q0h+C7Z.i6+C7Z.Q6+C7Z.R4h+C7Z.V7)](e);}
);this[C7Z.c0h][i8B]=f[U8B][a[(A1+i3h+C7Z.X3h)]][(d5h+C7Z.l8h+d5h+C7Z.R4h)](this);this[(w1B+E4B+Z3h)]((d5h+Y0+t8h+f2h+q0h+E8h+C7Z.V7+C7Z.R4h+C7Z.V7),[]);}
;f.prototype._actionClass=function(){var F8="remov",w9B="ctions",a=this[r9][(C7Z.Q6+w9B)],b=this[C7Z.c0h][(P9+C7Z.R4h+Q9)],c=d(this[j0B][d5B]);c[(F8+y9c+c8)]([a[(x5B+j8h+C7Z.R4h+C7Z.V7)],a[(C7Z.V7+V4B+C7Z.R4h)],a[(B0h+Y4c+C7Z.V7)]][p4h](p7B));r4h===b?c[(X9+Q4c+i3h+B6)](a[r4h]):(C3B+C7Z.R4h)===b?c[(X9+Q4c+E8h+C7Z.Q6+C7Z.c0h+C7Z.c0h)](a[N4B]):h1h===b&&c[(X9+C7Z.i6+t8+C7Z.c0h)](a[(z5c+f2h+t8h+A1B)]);}
;f.prototype._ajax=function(a,b,c){var M3h="dexOf",V0c="rl",s6B="ET",p8B="EL",U5="unct",S5c="sF",i5h="replac",J0h="xUrl",D6B="rra",L7B="isA",k5B="dS",W6h="xU",d2c="POST",e={type:(d2c),dataType:(C7Z.G2h+Z4c),data:null,error:c,success:function(a,c,e){204===e[(C7Z.c0h+C7Z.R4h+C7Z.U8+P2B)]&&(a={}
);b(a);}
}
,j;j=this[C7Z.c0h][l6B];var f=this[C7Z.c0h][(h3B)]||this[C7Z.c0h][(c3+C7Z.Q6+W6h+B0h+E8h)],n="edit"===j||"remove"===j?y(this[C7Z.c0h][c5B],(d5h+k5B+B0h+D7)):null;d[(L7B+D6B+C7Z.X3h)](n)&&(n=n[(R6+g4r)](","));d[P5B](f)&&f[j]&&(f=f[j]);if(d[(d5h+C7Z.c0h+Q5+C7Z.F4h+C7Z.l8h+D7+l1c+C7Z.l8h)](f)){var g=null,e=null;if(this[C7Z.c0h][J5h]){var h=this[C7Z.c0h][(q9h+J0h)];h[(D7+b4)]&&(g=h[j]);-1!==g[(g4r+C7Z.i6+C7Z.V7+K4B+w3)](" ")&&(j=g[(C7Z.c0h+q0h+L0h+C7Z.R4h)](" "),e=j[0],g=j[1]);g=g[(i5h+C7Z.V7)](/_id_/,n);}
f(e,g,a,b,c);}
else(C7Z.c0h+C7Z.R4h+B0h+F6B)===typeof f?-1!==f[(d5h+B1c+C7Z.V7+K4B+P8+C7Z.p5h)](" ")?(j=f[(C7Z.c0h+q0h+E8h+d5h+C7Z.R4h)](" "),e[c7B]=j[0],e[(X8B)]=j[1]):e[X8B]=f:e=d[T2h]({}
,e,f||{}
),e[(X8B)]=e[(q2B+E8h)][(B0h+O6+i3h+D7+C7Z.V7)](/_id_/,n),e.data&&(c=d[(d5h+S5c+C7Z.F4h+C7Z.l8h+i6B+d5h+t8h+C7Z.l8h)](e.data)?e.data(a):e.data,a=d[(i9c+Q5+U5+Q9)](e.data)&&c?c:d[(n4c+D2h)](!0,a,c)),e.data=a,(D5+p8B+s6B+Z5)===e[(t9h+I0h)]&&(a=d[(q0h+C7Z.Q6+B0h+C7Z.Q6+f2h)](e.data),e[(C7Z.F4h+V0c)]+=-1===e[(C7Z.F4h+B0h+E8h)][(g4r+M3h)]("?")?"?"+a:"&"+a,delete  e.data),d[(C7Z.Q6+d5c+K4B)](e);}
;f.prototype._assembleMain=function(){var X9B="bodyContent",L9h="mErr",f1B="footer",a=this[j0B];d(a[(J9h+L4+I0h+B0h)])[(Y4B+C7Z.V7+q0h+C7Z.V7+B1c)](a[i3]);d(a[f1B])[(L4+q0h+C7Z.V7+B1c)](a[(C7Z.p5h+t8h+B0h+L9h+t8h+B0h)])[(C7Z.Q6+I4B+C7Z.V7+B1c)](a[(C7Z.w6+C7Z.F4h+M7h+t8h+C7Z.l8h+C7Z.c0h)]);d(a[X9B])[T8c](a[W4c])[T8c](a[(C7Z.p5h+t8h+B0h+f2h)]);}
;f.prototype._blur=function(){var H1B="onBlu",g8c="Opts",a=this[C7Z.c0h][(C7Z.V7+C7Z.i6+d5h+C7Z.R4h+g8c)];!r4!==this[(F9+F4c+g5c)]((c6B+K9c+E8h+C7Z.F4h+B0h))&&(W4r===a[(Z2)]?this[W4r]():n2h===a[(H1B+B0h)]&&this[R5c]());}
;f.prototype._clearDynamicInfo=function(){var A9h="veCl",a=this[(d4h+C7Z.c0h+C7Z.c0h+C7Z.V7+C7Z.c0h)][B2h].error,b=this[C7Z.c0h][S6h];d((V4B+E4B+C7Z.I4c)+a,this[(C7Z.i6+E3)][d5B])[(B0h+j7B+A9h+d8+C7Z.c0h)](a);d[(C7Z.V7+v4B)](b,function(a,b){b.error("")[(Y8B+B6+C7Z.Q6+H6h+C7Z.V7)]("");}
);this.error("")[(f2h+Y9c+H6h+C7Z.V7)]("");}
;f.prototype._close=function(a){var L5h="lose",Z7c="loseIcb",a8c="closeIcb",K7h="loseCb",e9B="los",Q4B="preC";!r4!==this[(m4r+Z6+C7Z.R4h)]((Q4B+e9B+C7Z.V7))&&(this[C7Z.c0h][(I9B+t8h+H5h)]&&(this[C7Z.c0h][(h4B+C7Z.c0h+D3h+C7Z.w6)](a),this[C7Z.c0h][(D7+K7h)]=x2c),this[C7Z.c0h][a8c]&&(this[C7Z.c0h][a8c](),this[C7Z.c0h][(D7+Z7c)]=x2c),d((C7Z.w6+t8h+C7Z.i6+C7Z.X3h))[(t8h+O9)]((f6+J2B+C7Z.c0h+C7Z.I4c+C7Z.V7+V4B+C7Z.R4h+t8h+B0h+A0c+C7Z.p5h+t4)),this[C7Z.c0h][a6B]=!r4,this[R7]((D7+L5h)));}
;f.prototype._closeReg=function(a){this[C7Z.c0h][(D7+q5h+H5h)]=a;}
;f.prototype._crudArgs=function(a,b,c,e){var j=this,f,g,k;d[(d5h+I3c+i3h+d5h+k6h+f2c+i6B)](a)||(P7c===typeof a?(k=a,a=b):(f=a,g=b,k=c,a=e));k===h&&(k=!l4);f&&j[K7](f);g&&j[(C7Z.w6+C7Z.F4h+M7h+t8h+N2c)](g);return {opts:d[T2h]({}
,this[C7Z.c0h][(C7Z.p5h+t8h+P0c+y4+C7Z.R4h+d5h+t8h+N2c)][X7B],a),maybeOpen:function(){k&&j[(B3+Z6)]();}
}
;}
;f.prototype._dataSource=function(a){var c9="ift",b=Array.prototype.slice.call(arguments);b[(C7Z.c0h+n5h+c9)]();var c=this[C7Z.c0h][(q0B+q8c+t8h+C7Z.F4h+m2c+C7Z.V7)][a];if(c)return c[(C7Z.Q6+I4B+R7B)](this,b);}
;f.prototype._displayReorder=function(a){var u1h="ayOrder",Y3c="childre",n6B="rde",b=d(this[(i9h+f2h)][(S4r+p7c+Z6B+C7Z.V7+C7Z.l8h+C7Z.R4h)]),c=this[C7Z.c0h][(C7Z.p5h+r8c)],e=this[C7Z.c0h][(t8h+n6B+B0h)];a?this[C7Z.c0h][a3c]=a:a=this[C7Z.c0h][a3c];b[(Y3c+C7Z.l8h)]()[(Y1h+C7Z.R4h+C7Z.Q6+D7+n5h)]();d[(C7Z.V7+v4B)](e,function(e,o){var p1B="inA",g=o instanceof f[U6h]?o[(z3c+Y8B)]():o;-r4!==d[(p1B+A1c+l5)](g,a)&&b[T8c](c[g][(C7Z.l8h+B8+C7Z.V7)]());}
);this[(w1B+A1B+g5c)]((C7Z.i6+i9c+C3h+u1h),[this[C7Z.c0h][(Z0+q0h+B2B+C7Z.V7+C7Z.i6)],this[C7Z.c0h][(P9+r8h+t8h+C7Z.l8h)],b]);}
;f.prototype._edit=function(a,b,c){var M4="tD",R5h="ayRe",b3h="splice",W8B="odif",e=this[C7Z.c0h][(C7Z.p5h+d5h+C7Z.V7+h3h)],j=[],f;this[C7Z.c0h][c5B]=b;this[C7Z.c0h][(f2h+W8B+d5h+C7Z.V7+B0h)]=a;this[C7Z.c0h][(P9+C7Z.R4h+d5h+t8h+C7Z.l8h)]=(C7Z.V7+C7Z.i6+d5h+C7Z.R4h);this[(j0B)][(f6+P0c)][(C7Z.c0h+t9h+E4h)][(Z0+C3h+C7Z.Q6+C7Z.X3h)]="block";this[a5]();d[(o6c)](e,function(a,c){var n4r="multiRese";c[(n4r+C7Z.R4h)]();f=!0;d[(L1h+n5h)](b,function(b,e){var r6c="yFi",o8B="ayFi";if(e[(C7Z.p5h+r8c)][a]){var d=c[(W8+c5+t8h+f2h+D5+C7Z.Q6+I3)](e.data);c[J7B](b,d!==h?d:c[(J8h)]());e[(A1+E8h+o8B+g1c+C7Z.c0h)]&&!e[(C7Z.i6+i9c+G3h+r6c+C7Z.V7+E8h+C7Z.i6+C7Z.c0h)][a]&&(f=!1);}
}
);0!==c[(a0+C7Z.R4h+d5h+b8+C7Z.i6+C7Z.c0h)]().length&&f&&j[(q0h+y2h)](a);}
);for(var e=this[(t8h+L2c+C7Z.V7+B0h)]()[(C7Z.c0h+E8h+K5B+C7Z.V7)](),g=e.length;0<=g;g--)-1===d[A9](e[g],j)&&e[b3h](g,1);this[(F9+C7Z.i6+i9c+C3h+R5h+t8h+L2c+C7Z.W7)](e);this[C7Z.c0h][(C7Z.V7+V4B+M4+C7Z.U8+C7Z.Q6)]=this[z9h]();this[(R7)]((d5h+C7Z.l8h+d5h+C7Z.R4h+c0),[y(b,"node")[0],y(b,"data")[0],a,c]);this[(m4r+C7Z.V7+C7Z.l8h+C7Z.R4h)]("initMultiEdit",[b,a,c]);}
;f.prototype._event=function(a,b){var S2c="result",M3B="dle",g8B="rH",r8="gg";b||(b=[]);if(d[q6](a))for(var c=0,e=a.length;c<e;c++)this[(m4r+C7Z.V7+g5c)](a[c],b);else return c=d[(Z5+E4B+C7Z.V7+C7Z.l8h+C7Z.R4h)](a),d(this)[(C7Z.R4h+B0h+d5h+r8+C7Z.V7+g8B+C7Z.Q6+C7Z.l8h+M3B+B0h)](c,b),c[S2c];}
;f.prototype._eventName=function(a){var r3B="bstrin";for(var b=a[(C7Z.c0h+C3h+H1c)](" "),c=0,e=b.length;c<e;c++){var a=b[c],d=a[(W0c)](/^on([A-Z])/);d&&(a=d[1][Y5]()+a[(g9+r3B+H6h)](3));b[c]=a;}
return b[(C7Z.G2h+t8h+d5h+C7Z.l8h)](" ");}
;f.prototype._fieldNames=function(a){return a===h?this[(E1+u8B)]():!d[q6](a)?[a]:a;}
;f.prototype._focus=function(a,b){var l3="setF",L5c="div.DTE ",r7="jq",c=this,e,j=d[(f2h+C7Z.Q6+q0h)](a,function(a){return (a4c+d5h+i8c)===typeof a?c[C7Z.c0h][(C7Z.p5h+d5h+s3+C7Z.i6+C7Z.c0h)][a]:a;}
);v1c===typeof b?e=j[b]:b&&(e=l4===b[(d5h+C7Z.l8h+Y1h+K4B+P8+C7Z.p5h)]((r7+F3c))?d(L5c+b[(B0h+C7Z.V7+C3h+q3h)](/^jq:/,m4h)):this[C7Z.c0h][(C7Z.p5h+f2B+C7Z.c0h)][b]);(this[C7Z.c0h][(l3+t8h+J2B+C7Z.c0h)]=e)&&e[(C7Z.p5h+t8h+D7+C7Z.F4h+C7Z.c0h)]();}
;f.prototype._formOptions=function(a){var P4c="cb",a3="down",d8h="essag",Z6c="titl",J4B="Back",F4="onBackground",v5="nBack",L3c="rn",A6="tOnRe",o5h="subm",u1B="onReturn",t9c="OnR",l4r="Bl",b3c="mitO",l1="eOnC",j9="onComplete",d4c="OnCom",a7B="teIn",b=this,c=M++,e=(C7Z.I4c+C7Z.i6+a7B+E8h+d5h+C7Z.l8h+C7Z.V7)+c;a[(h4B+w8+d4c+q0h+E4h+o0h)]!==h&&(a[j9]=a[(D7+E8h+t8h+C7Z.c0h+l1+t8h+a9c+C7Z.V7+C7Z.R4h+C7Z.V7)]?n2h:(C7Z.l8h+t8h+C7Z.l8h+C7Z.V7));a[(C7Z.c0h+D4B+f2h+d5h+C7Z.R4h+P8+C7Z.l8h+K9c+E8h+C7Z.F4h+B0h)]!==h&&(a[Z2]=a[(Y9+b3c+C7Z.l8h+l4r+q2B)]?(C7Z.c0h+C7Z.F4h+C7Z.w6+P):(D7+q5h+C7Z.c0h+C7Z.V7));a[(W4r+t9c+C7Z.V7+C7Z.R4h+q2B+C7Z.l8h)]!==h&&(a[u1B]=a[(o5h+d5h+A6+g7h+L3c)]?W4r:(i1h));a[(C7Z.w6+R9B+B0h+P8+v5+J7h+t8h+b5B+C7Z.i6)]!==h&&(a[F4]=a[(C7Z.w6+R9B+B0h+P8+C7Z.l8h+J4B+J7h+t8h+b5B+C7Z.i6)]?(h7c+C7Z.F4h+B0h):i1h);this[C7Z.c0h][(N4B+P8+q0h+O6h)]=a;this[C7Z.c0h][g2c]=c;if(i2c===typeof a[K7]||m2B===typeof a[K7])this[(C7Z.R4h+d5h+C7Z.R4h+E8h+C7Z.V7)](a[(Z6c+C7Z.V7)]),a[K7]=!l4;if(i2c===typeof a[a5h]||m2B===typeof a[a5h])this[a5h](a[(f2h+u9+h6c)]),a[(f2h+d8h+C7Z.V7)]=!l4;P7c!==typeof a[f1]&&(this[(C7Z.w6+m9B+O8B+C7Z.c0h)](a[(C7Z.w6+m9B+k8)]),a[(C7Z.w6+C7Z.F4h+M7h+d3+C7Z.c0h)]=!l4);d(r)[(d3)]((s2h+e2+a3)+e,function(c){var c2h="nex",Z5B="keyCo",V1c="_F",A5h="onEsc",o2h="tDefault",B3h="rev",W4B="eEl",e=d(r[(P9+C7Z.R4h+d5h+E4B+W4B+d6+C7Z.V7+g5c)]),f=e.length?e[0][(C7Z.l8h+y8c+y1c+f2h+C7Z.V7)][Y5]():null;d(e)[(C7Z.Q6+K7B)]("type");if(b[C7Z.c0h][(C7Z.i6+d5h+C7Z.c0h+G3h+C7Z.X3h+n1)]&&a[(d3+G4+C7Z.V7+C7Z.R4h+C7Z.F4h+B0h+C7Z.l8h)]===(Y9+f2h+d5h+C7Z.R4h)&&c[(s2h+W1B+Y1h)]===13&&(f==="input"||f===(w8+E8h+C7Z.V7+D7+C7Z.R4h))){c[j8]();b[(g9+C7c+d5h+C7Z.R4h)]();}
else if(c[T7B]===27){c[(q0h+B3h+Z6+o2h)]();switch(a[A5h]){case (C7Z.w6+R9B+B0h):b[(C7Z.w6+R9B+B0h)]();break;case "close":b[n2h]();break;case (g9+C7Z.w6+f2h+H1c):b[W4r]();}
}
else e[N3h]((C7Z.I4c+D5+H3+V1c+b0c+A3c+t2+N2c)).length&&(c[(Z5B+Y1h)]===37?e[(q0h+z5c+E4B)]((C2c+C7Z.R4h+C7Z.R4h+d3))[(C7Z.p5h+t8h+K6)]():c[(T0+C7Z.X3h+p7c+y8c)]===39&&e[(c2h+C7Z.R4h)]((C7Z.w6+C7Z.F4h+C7Z.R4h+C7Z.R4h+t8h+C7Z.l8h))[(C7Z.p5h+t4)]());}
);this[C7Z.c0h][(q0c+G4B+P4c)]=function(){var W3B="keyd";d(r)[(t8h+C7Z.p5h+C7Z.p5h)]((W3B+t8h+R1h)+e);}
;return e;}
;f.prototype._legacyAjax=function(a,b,c){var A3B="acyA",L8h="leg";if(this[C7Z.c0h][(L8h+A3B+I1h)])if((C7Z.c0h+Z6+C7Z.i6)===a)if((D7+B0h+C7Z.V7+C7Z.Q6+C7Z.R4h+C7Z.V7)===b||(n1+H1c)===b){var e;d[(C7Z.V7+P9+n5h)](c.data,function(a){var f8B="cy",h4="porte",F7="Edi";if(e!==h)throw (F7+C7Z.R4h+C7Z.N6+G9h+R0+t6B+C7Z.R4h+d5h+A0c+B0h+i7+p7B+C7Z.V7+C7Z.i6+d5h+C7Z.R4h+d5h+C7Z.l8h+H6h+p7B+d5h+C7Z.c0h+p7B+C7Z.l8h+t8h+C7Z.R4h+p7B+C7Z.c0h+g5B+h4+C7Z.i6+p7B+C7Z.w6+C7Z.X3h+p7B+C7Z.R4h+c4h+p7B+E8h+K3+C7Z.Q6+f8B+p7B+J9c+I1h+p7B+C7Z.i6+C7Z.U8+C7Z.Q6+p7B+C7Z.p5h+C7Z.N6+f2h+C7Z.Q6+C7Z.R4h);e=a;}
);c.data=c.data[e];(N4B)===b&&(c[n8B]=e);}
else c[(n8B)]=d[(f2h+C7Z.Q6+q0h)](c.data,function(a,b){return b;}
),delete  c.data;else c.data=!c.data&&c[(d3c+A4B)]?[c[(B0h+i7)]]:[];}
;f.prototype._optionsUpdate=function(a){var b=this;a[(O1h+d5h+t8h+C7Z.l8h+C7Z.c0h)]&&d[(C7Z.V7+v4B)](this[C7Z.c0h][(E1+s3+C7Z.i6+C7Z.c0h)],function(c){var r2B="update",w0B="upd";if(a[(t8h+q0h+C7Z.R4h+Q9+C7Z.c0h)][c]!==h){var e=b[B2h](c);e&&e[(w0B+C7Z.U8+C7Z.V7)]&&e[r2B](a[C0c][c]);}
}
);}
;f.prototype._message=function(a,b){var P9B="Out",e7B="ade",K3B="functio";(K3B+C7Z.l8h)===typeof b&&(b=b(this,new t[s3B](this[C7Z.c0h][C7Z.A7c])));a=d(a);!b&&this[C7Z.c0h][a6B]?a[l6c]()[(C7Z.p5h+e7B+P9B)](function(){a[(B9B+y5B)](m4h);}
):b?this[C7Z.c0h][a6B]?a[(X6+B3)]()[(N4h)](b)[O2c]():a[(n5h+O0)](b)[Q5B]((Z0+q0h+E8h+C7Z.Q6+C7Z.X3h),(h7c+H2)):a[N4h](m4h)[(D7+C7Z.c0h+C7Z.c0h)]((V4B+C7Z.c0h+q0h+E8h+C7Z.Q6+C7Z.X3h),(C7Z.l8h+Z3B));}
;f.prototype._multiInfo=function(){var l5B="foS",w8h="iI",y1B="multiInfoShown",x4B="ulti",a=this[C7Z.c0h][(r3+F2h)],b=this[C7Z.c0h][a3c],c=!0;if(b)for(var e=0,d=b.length;e<d;e++)a[b[e]][(d5h+M0c+x4B+y4r+E8h+c8B)]()&&c?(a[b[e]][y1B](c),c=!1):a[b[e]][(I9c+i7B+w8h+C7Z.l8h+l5B+n5h+i7+C7Z.l8h)](!1);}
;f.prototype._postopen=function(a){var D2c="_multiInfo",s3h="foc",R1B="submit.editor-internal",g2h="tern",v6B="reF",b=this,c=this[C7Z.c0h][i8B][(D7+C7Z.Q6+q0h+g7h+v6B+c4+C7Z.F4h+C7Z.c0h)];c===h&&(c=!l4);d(this[(j0B)][S4r])[(g1B)]((g9+C7Z.w6+f2h+H1c+C7Z.I4c+C7Z.V7+C7Z.i6+l8+B0h+A0c+d5h+C7Z.l8h+g2h+C7Z.Q6+E8h))[(d3)](R1B,function(a){var Z7h="Def",t2c="prev";a[(t2c+Z3h+Z7h+C7Z.Q6+E5h)]();}
);if(c&&((X7B)===a||X2c===a))d((C7Z.w6+B8+C7Z.X3h))[(t8h+C7Z.l8h)]((s3h+P2B+C7Z.I4c+C7Z.V7+V4B+C7Z.R4h+t8h+B0h+A0c+C7Z.p5h+c4+P2B),function(){var x6="ocu",M8="tF",D0h="setFocus",q9B="are",n5c="veE",f1c="leme",L4c="tiv";0===d(r[(P9+L4c+C7Z.V7+Z5+f1c+g5c)])[(M6h+B0h+C7Z.V7+g5c+C7Z.c0h)](".DTE").length&&0===d(r[(P9+r8h+n5c+E4h+f2h+C7Z.V7+C7Z.l8h+C7Z.R4h)])[(q0h+q9B+C7Z.l8h+C7Z.R4h+C7Z.c0h)]((C7Z.I4c+D5+C0+U0B)).length&&b[C7Z.c0h][D0h]&&b[C7Z.c0h][(w8+M8+x6+C7Z.c0h)][t0h]();}
);this[D2c]();this[(w1B+E4B+Z3h)](n2c,[a,this[C7Z.c0h][l6B]]);return !l4;}
;f.prototype._preopen=function(a){var x2="aye";if(!r4===this[R7]((c6B+P8+q0h+C7Z.V7+C7Z.l8h),[a,this[C7Z.c0h][l6B]]))return !r4;this[C7Z.c0h][(C7Z.i6+i9c+C3h+x2+C7Z.i6)]=a;return !l4;}
;f.prototype._processing=function(a){var z6="sing",N0="ven",j6="rocessing",a9="div.DTE",y9B="pro",b=d(this[j0B][(A4B+B0h+a8+B0h)]),c=this[(C7Z.i6+E3)][(y9B+y7B+C7Z.c0h+d5h+C7Z.l8h+H6h)][x8B],e=this[r9][S7c][(C7Z.Q6+D7+C7Z.R4h+d5h+E4B+C7Z.V7)];a?(c[U8B]=(C7Z.w6+q5h+a9B),b[W6B](e),d(a9)[W6B](e)):(c[U8B]=(V6c+Z1c),b[(z5c+f2h+H9+y9c+d8+C7Z.c0h)](e),d((V4B+E4B+C7Z.I4c+D5+H3))[U4](e));this[C7Z.c0h][(q0h+j6)]=a;this[(w1B+N0+C7Z.R4h)]((q0h+B0h+c4+u9+z6),[a]);}
;f.prototype._submit=function(a,b,c,e){var U2c="_ajax",m6c="oces",i3B="Sub",D4r="_legacyAjax",K4c="_c",J0c="let",g0B="nCom",i1="ged",a0c="lIfC",y5="dbTable",A5c="tOpts",L5="tDa",G2B="oAp",f=this,g,n=!1,k={}
,w={}
,m=t[n4c][(G2B+d5h)][y7h],l=this[C7Z.c0h][S6h],i=this[C7Z.c0h][(P9+C7Z.R4h+B3c+C7Z.l8h)],p=this[C7Z.c0h][(C3B+C7Z.R4h+p7c+t8h+b5B+C7Z.R4h)],q=this[C7Z.c0h][X7c],r=this[C7Z.c0h][(n1+d5h+C7Z.R4h+Q5+d5h+C7Z.V7+E8h+F2h)],s=this[C7Z.c0h][(C7Z.V7+C7Z.i6+d5h+L5+I3)],u=this[C7Z.c0h][(C7Z.V7+C7Z.i6+d5h+A5c)],v=u[(C7Z.c0h+D4B+f2h+d5h+C7Z.R4h)],x={action:this[C7Z.c0h][(C7Z.Q6+i6B+Q9)],data:{}
}
,y;this[C7Z.c0h][y5]&&(x[(C7Z.R4h+P6h)]=this[C7Z.c0h][y5]);if("create"===i||"edit"===i)if(d[(j8h+D7+n5h)](r,function(a,b){var T7="pty",c={}
,e={}
;d[(j8h+I1B)](l,function(f,j){var t1B="ount",i0B="[]",c2="dex",m7="sArra",d5="G";if(b[S6h][f]){var g=j[(I9c+E8h+C7Z.R4h+d5h+d5+C7Z.V7+C7Z.R4h)](a),o=m(f),h=d[(d5h+m7+C7Z.X3h)](g)&&f[(d5h+C7Z.l8h+c2+P8+C7Z.p5h)]((i0B))!==-1?m(f[u3c](/\[.*$/,"")+(A0c+f2h+t3h+A0c+D7+t1B)):null;o(c,g);h&&h(c,g.length);if(i===(C7Z.V7+V4B+C7Z.R4h)&&g!==s[f][a]){o(e,g);n=true;h&&h(e,g.length);}
}
}
);d[(i9c+Z5+f2h+T7+P8+C7Z.w6+f2c+i6B)](c)||(k[a]=c);d[s8](e)||(w[a]=e);}
),"create"===i||(o4h+E8h)===v||(o4h+a0c+n5h+j5h+n1)===v&&n)x.data=k;else if((I1B+C7Z.Q6+C7Z.l8h+i1)===v&&n)x.data=w;else{this[C7Z.c0h][l6B]=null;(D7+E8h+m6+C7Z.V7)===u[(t8h+g0B+q0h+J0c+C7Z.V7)]&&(e===h||e)&&this[(K4c+E8h+m6+C7Z.V7)](!1);a&&a[K2h](this);this[(F9+Y4B+c4+C7Z.V7+B6+d5h+C7Z.l8h+H6h)](!1);this[(m4r+C7Z.V7+g5c)]("submitComplete");return ;}
else "remove"===i&&d[o6c](r,function(a,b){x.data[a]=b.data;}
);this[D4r]("send",i,x);y=d[(C7Z.V7+K4B+o0h+B1c)](!0,{}
,x);c&&c(x);!1===this[(F9+F4c+g5c)]((Y4B+C7Z.V7+i3B+Q0B+C7Z.R4h),[x,i])?this[(F9+Y4B+m6c+C7Z.c0h+g4r+H6h)](!1):this[U2c](x,function(c){var m0c="bmit",u7B="_pr",A4c="ete",s5c="omp",q1B="nC",k3B="urce",W9="tRe",g9B="postE",e3c="event",Y0B="reC",T6B="urc",F0h="aS",x3B="dE",B1B="stSu",N2B="ive",n;f[D4r]((B0h+C7Z.V7+D7+C7Z.V7+N2B),i,c);f[(F9+C7Z.V7+E4B+C7Z.V7+g5c)]((q0h+t8h+B1B+C7c+H1c),[c,x,i]);if(!c.error)c.error="";if(!c[(C7Z.p5h+f2B+D6c+B0h+t8h+B0h+C7Z.c0h)])c[(C7Z.p5h+Z8B+G0c+A1c+t8h+z1c)]=[];if(c.error||c[(E1+C7Z.V7+P4h+Z5+B0h+B0h+C7Z.N6+C7Z.c0h)].length){f.error(c.error);d[(C7Z.V7+C7Z.Q6+I1B)](c[(C7Z.p5h+d5h+C7Z.V7+E8h+x3B+B0h+M0+C7Z.c0h)],function(a,b){var z0B="yCon",c=l[b[I8c]];c.error(b[m1h]||"Error");if(a===0){d(f[j0B][(C7Z.w6+t8h+C7Z.i6+z0B+o0h+g5c)],f[C7Z.c0h][d5B])[D7B]({scrollTop:d(c[(C7Z.l8h+y8c)]()).position().top}
,500);c[t0h]();}
}
);b&&b[(D7+C7Z.Q6+E8h+E8h)](f,c);}
else{var k={}
;f[(F9+T8+F0h+t8h+T6B+C7Z.V7)]((Y4B+C7Z.V7+q0h),i,q,y,c.data,k);if(i===(x5B+C7Z.V7+C7Z.U8+C7Z.V7)||i===(C7Z.V7+C7Z.i6+d5h+C7Z.R4h))for(g=0;g<c.data.length;g++){n=c.data[g];f[R7]((C7Z.c0h+C7Z.V7+L5+I3),[c,n,i]);if(i==="create"){f[(w1B+E4B+Z3h)]((q0h+Y0B+z5c+C7Z.Q6+C7Z.R4h+C7Z.V7),[c,n]);f[(J4c+C7Z.Q6+q8c+t8h+q2B+n1B)]("create",l,n,k);f[(F9+e3c)]([(D7+B0h+l2h+C7Z.V7),"postCreate"],[c,n]);}
else if(i==="edit"){f[R7]((Y4B+C7Z.V7+c0),[c,n]);f[L1]("edit",q,l,n,k);f[R7]([(n1+d5h+C7Z.R4h),(g9B+A0)],[c,n]);}
}
else if(i===(B0h+d6+g4c)){f[R7]("preRemove",[c]);f[(h6B+K0B+T6B+C7Z.V7)]((y5h+H9+C7Z.V7),q,l,k);f[(F9+F4c+g5c)]([(y5h+t8h+A1B),(q0h+t8h+C7Z.c0h+W9+f2h+g4c)],[c]);}
f[(J4c+C7Z.Q6+K0B+k3B)]((D7+E3+f2h+H1c),i,q,c.data,k);if(p===f[C7Z.c0h][g2c]){f[C7Z.c0h][(C7Z.Q6+i6B+d5h+t8h+C7Z.l8h)]=null;u[(t8h+q1B+s5c+E8h+A4c)]===(I9B+t8h+w8)&&(e===h||e)&&f[R5c](true);}
a&&a[(D7+o4h+E8h)](f,c);f[R7]("submitSuccess",[c,n]);}
f[(u7B+c4+u9+C7Z.c0h+g4r+H6h)](false);f[(w1B+A1B+g5c)]((C7Z.c0h+C7Z.F4h+m0c+w3B+p6B+G4r),[c,n]);}
,function(a,c,e){var i4h="_processing",c6="syst";f[R7]((q0h+t8h+X6+a4+C7Z.F4h+C7Z.w6+P),[a,c,e,x]);f.error(f[(O3h+s0)].error[(c6+C7Z.V7+f2h)]);f[i4h](false);b&&b[(K2h)](f,a,c,e);f[R7](["submitError","submitComplete"],[a,c,e,x]);}
);}
;f.prototype._tidy=function(a){var t6c="inl",W3h="tCo";if(this[C7Z.c0h][S7c])return this[(Z3B)]((C7Z.c0h+D4B+f2h+d5h+W3h+a9c+C7Z.V7+C7Z.R4h+C7Z.V7),a),!l4;if((t6c+d5h+Z1c)===this[U8B]()||X2c===this[U8B]()){var b=this;this[(Z3B)](n2h,function(){if(b[C7Z.c0h][S7c])b[(t8h+C7Z.l8h+C7Z.V7)](P3c,function(){var w9c="bServerSide",y1h="oFea",D0c="aTable",c=new d[C7Z.D4h][(C7Z.i6+C7Z.U8+D0c)][(S8+d5h)](b[C7Z.c0h][C7Z.A7c]);if(b[C7Z.c0h][C7Z.A7c]&&c[b2B]()[l4][(y1h+V9c+C7Z.V7+C7Z.c0h)][w9c])c[(d3+C7Z.V7)]((C7Z.i6+g6c+A4B),a);else setTimeout(function(){a();}
,I7h);}
);else setTimeout(function(){a();}
,I7h);}
)[Q0]();return !l4;}
return !r4;}
;f[(l3B+C7Z.F4h+E8h+O6h)]={table:null,ajaxUrl:null,fields:[],display:(E8h+K0c+x4h+u7),ajax:null,idSrc:(G0B+t5c+i7+r4c),events:{}
,i18n:{create:{button:(w4r+A4B),title:"Create new entry",submit:(p7c+L4h+C7Z.R4h+C7Z.V7)}
,edit:{button:(c0),title:"Edit entry",submit:(F3+q0h+q0B+C7Z.R4h+C7Z.V7)}
,remove:{button:(D5+C7Z.V7+G4r),title:"Delete",submit:(D5+C7Z.V7+E8h+C7Z.V7+C7Z.R4h+C7Z.V7),confirm:{_:(b1h+p7B+C7Z.X3h+m9+p7B+C7Z.c0h+w6B+p7B+C7Z.X3h+t8h+C7Z.F4h+p7B+A4B+O5c+p7B+C7Z.R4h+t8h+p7B+C7Z.i6+C7Z.V7+E8h+C7Z.D9+C7Z.V7+u2+C7Z.i6+p7B+B0h+t8h+A4B+C7Z.c0h+i6c),1:(b1h+p7B+C7Z.X3h+t8h+C7Z.F4h+p7B+C7Z.c0h+C7Z.F4h+B0h+C7Z.V7+p7B+C7Z.X3h+t8h+C7Z.F4h+p7B+A4B+d5h+C7Z.c0h+n5h+p7B+C7Z.R4h+t8h+p7B+C7Z.i6+w1c+C7Z.R4h+C7Z.V7+p7B+F8c+p7B+B0h+t8h+A4B+i6c)}
}
,error:{system:(q9+U7c+r1B+r2c+O2+U7c+I6h+W8h+A1h+U1B+U7c+c4B+X0+U7c+A1h+A5B+U1B+i9+F5c+Z9h+U7c+f4c+Z9h+j8B+f4c+Y6c+F9h+I9h+E1h+w8B+c4B+U1B+z5+Z4r+u7h+Z9h+f0B+I6h+r1B+y0+g1h+I6h+f4c+r0+f4c+g1h+r0+f8+B4+f0+a1+A1h+U1B+I6h+U7c+d3h+W6+b0B+S0h+u0+g1h+Y4r+Z9h+w4B)}
,multi:{title:(R0+C7Z.F4h+X9h+E4h+p7B+E4B+C7Z.Q6+R9B+C7Z.V7+C7Z.c0h),info:(D8+p7B+C7Z.c0h+s3+H8h+W7c+p7B+d5h+o0h+V5B+p7B+D7+q4B+C7Z.l8h+p7B+C7Z.i6+d5h+d1B+Z6+C7Z.R4h+p7B+E4B+C7Z.Q6+z6h+C7Z.c0h+p7B+C7Z.p5h+C7Z.N6+p7B+C7Z.R4h+U8h+C7Z.c0h+p7B+d5h+n9+w7h+C0+t8h+p7B+C7Z.V7+A0+p7B+C7Z.Q6+B1c+p7B+C7Z.c0h+C7Z.D9+p7B+C7Z.Q6+E8h+E8h+p7B+d5h+o0h+V5B+p7B+C7Z.p5h+t8h+B0h+p7B+C7Z.R4h+c1c+p7B+d5h+C7Z.l8h+q0h+C7Z.F4h+C7Z.R4h+p7B+C7Z.R4h+t8h+p7B+C7Z.R4h+n5h+C7Z.V7+p7B+C7Z.c0h+E7B+p7B+E4B+o4h+C7Z.F4h+C7Z.V7+l2c+D7+E8h+d5h+D7+s2h+p7B+t8h+B0h+p7B+C7Z.R4h+L4+p7B+n5h+k3+l2c+t8h+C7Z.R4h+c4h+C1+C7Z.V7+p7B+C7Z.R4h+n5h+C7Z.V7+C7Z.X3h+p7B+A4B+d5h+E8h+E8h+p7B+B0h+C7Z.V7+I3+g4r+p7B+C7Z.R4h+G0+p7B+d5h+F0B+Y8c+E8c+p7B+E4B+C7Z.Q6+E8h+t6+C7Z.I4c),restore:(S5+t8h+p7B+D7+k9c+C7Z.V7+C7Z.c0h)}
,datetime:{previous:(E8+B0h+h1+P2B),next:"Next",months:(w2+o4+C7Z.F4h+C7Z.Q6+B0h+C7Z.X3h+p7B+Q5+I5B+C7Z.X3h+p7B+R0+C7Z.Q6+m2c+n5h+p7B+J9c+o6B+E8h+p7B+R0+C7Z.Q6+C7Z.X3h+p7B+w2+b5B+C7Z.V7+p7B+w2+t6B+C7Z.X3h+p7B+J9c+t9B+X6+p7B+a4+O6+U5c+L9c+p7B+P8+D7+Q5h+C7Z.w6+C7Z.V7+B0h+p7B+e0+M6B+C7Z.w6+C7Z.W7+p7B+D5+C7Z.V7+n1B+E1B+C7Z.V7+B0h)[(C7Z.c0h+V0h+C7Z.R4h)](" "),weekdays:(a4+b5B+p7B+R0+d3+p7B+C0+c8B+p7B+v4h+n1+p7B+C0+u9B+p7B+Q5+u8c+p7B+a4+C7Z.Q6+C7Z.R4h)[(C7Z.c0h+C3h+d5h+C7Z.R4h)](" "),amPm:["am","pm"],unknown:"-"}
}
,formOptions:{bubble:d[T2h]({}
,f[(u6B+m3)][K5],{title:!1,message:!1,buttons:(F9+C1c+K5B),submit:"changed"}
),inline:d[(E5c+C7Z.l8h+C7Z.i6)]({}
,f[G8][(b1B+l1c+N2c)],{buttons:!1,submit:"changed"}
),main:d[T2h]({}
,f[(f2h+t8h+Y1h+E8h+C7Z.c0h)][K5])}
,legacyAjax:!1}
;var J=function(a,b,c){d[(C7Z.V7+C7Z.Q6+I1B)](c,function(e){var J2h="FromD",z2="aSr";(e=b[e])&&C(a,e[(C7Z.i6+C7Z.Q6+C7Z.R4h+z2+D7)]())[o6c](function(){var P7h="firstChild",W2h="Chi";for(;this[(D7+W3c+C7Z.i6+e0+t8h+Y1h+C7Z.c0h)].length;)this[(B0h+C7Z.V7+f2h+t8h+E4B+C7Z.V7+W2h+E8h+C7Z.i6)](this[P7h]);}
)[(B9B+y5B)](e[(W8+J2h+C7Z.Q6+I3)](c));}
);}
,C=function(a,b){var b4B='[data-editor-field="',c=M6===a?r:d(h6+a+(G0h));return d(b4B+b+G0h,c);}
,D=f[(C7Z.i6+f9+d2B+y7B)]={}
,K=function(a){a=d(a);setTimeout(function(){var f3B="highlight";a[W6B](f3B);setTimeout(function(){var Y8=550,s1h="moveC",s0h="noHighlight";a[W6B](s0h)[(B0h+C7Z.V7+s1h+q7B+C7Z.c0h)](f3B);setTimeout(function(){a[(B0h+C7Z.V7+f2h+g4c+a1B+C7Z.Q6+C7Z.c0h+C7Z.c0h)](s0h);}
,Y8);}
,r5);}
,z7h);}
,E=function(a,b,c,e,d){b[(A8+C7Z.c0h)](c)[K5c]()[o6c](function(c){var V6B="ifier",c=b[(d3c+A4B)](c),g=c.data(),k=d(g);k===h&&f.error((F3+z3c+C7Z.w6+E8h+C7Z.V7+p7B+C7Z.R4h+t8h+p7B+C7Z.p5h+Q2B+p7B+B0h+i7+p7B+d5h+C7Z.i6+C7Z.V7+C7Z.l8h+C7Z.R4h+V6B),14);a[k]={idSrc:k,data:g,node:c[(C7Z.l8h+B8+C7Z.V7)](),fields:e,type:"row"}
;}
);}
,F=function(a,b,c,e,j,g){var v8B="inde";b[I8B](c)[(v8B+p9B)]()[(j8h+D7+n5h)](function(c){var H2h="playF",N6c="eci",t0c="rom",s5h="mData",y5c="editField",P1h="aoColumns",k=b[(D7+J7c)](c),i=b[(B0h+t8h+A4B)](c[A8]).data(),i=j(i),l;if(!(l=g)){l=c[(D7+t8h+E8h+C7Z.F4h+H6B)];l=b[b2B]()[0][P1h][l];var m=l[(C7Z.V7+C7Z.i6+H1c+Q5+d5h+s3+C7Z.i6)]!==h?l[y5c]:l[s5h],p={}
;d[(j8h+D7+n5h)](e,function(a,b){var s5="Sr",s1="dataSr",k2="Arr";if(d[(i9c+k2+C7Z.Q6+C7Z.X3h)](m))for(var c=0;c<m.length;c++){var e=b,f=m[c];e[(s1+D7)]()===f&&(p[e[(C7Z.l8h+E7B)]()]=e);}
else b[(C7Z.i6+C7Z.Q6+C7Z.R4h+C7Z.Q6+s5+D7)]()===m&&(p[b[(z3c+f2h+C7Z.V7)]()]=b);}
);d[s8](p)&&f.error((F3+C7Z.l8h+P6h+p7B+C7Z.R4h+t8h+p7B+C7Z.Q6+C7Z.F4h+Q5h+t0+N3c+k8h+C7Z.X3h+p7B+C7Z.i6+C7Z.V7+o0h+B0h+f2h+X2B+p7B+C7Z.p5h+Z8B+E8h+C7Z.i6+p7B+C7Z.p5h+t0c+p7B+C7Z.c0h+m9+B0h+n1B+w7h+E8+E8h+j8h+C7Z.c0h+C7Z.V7+p7B+C7Z.c0h+q0h+N6c+C7Z.p5h+C7Z.X3h+p7B+C7Z.R4h+c4h+p7B+C7Z.p5h+d4B+C7Z.i6+p7B+C7Z.l8h+C7Z.Q6+f2h+C7Z.V7+C7Z.I4c),11);l=p;}
E(a,b,c[(A8)],e,j);a[i][(T4c+C7Z.Q6+I1B)]=[k[M4r]()];a[i][(C7Z.i6+d5h+C7Z.c0h+H2h+f2B+C7Z.c0h)]=l;}
);}
;D[(T8+N2h+C7Z.Q6+m5)]={individual:function(a,b){var o7B="index",O5B="pon",b5h="aFn",e9c="ctD",T8B="nG",c=t[(X2+C7Z.R4h)][(R3c+q0h+d5h)][(Q1B+T8B+C7Z.V7+C7Z.R4h+P8+L7c+C7Z.V7+e9c+C7Z.U8+b5h)](this[C7Z.c0h][k1B]),e=d(this[C7Z.c0h][(R9c+E4h)])[(D5+C7Z.Q6+I3+C0+C7Z.Q6+C7Z.w6+E4h)](),f=this[C7Z.c0h][S6h],g={}
,h,k;a[(C7Z.l8h+B8+C7Z.V7+y1c+Y8B)]&&d(a)[(n5h+C7Z.Q6+b8c+i3h+C7Z.c0h+C7Z.c0h)]("dtr-data")&&(k=a,a=e[(B0h+C7Z.V7+C7Z.c0h+O5B+m2+A1B)][o7B](d(a)[(I9B+h0+X6)]("li")));b&&(d[(i9c+n4+g6c+C7Z.X3h)](b)||(b=[b]),h={}
,d[(L1h+n5h)](b,function(a,b){h[b]=f[b];}
));F(g,e,a,f,c,h);k&&d[(C7Z.V7+C7Z.Q6+D7+n5h)](g,function(a,b){b[(p3+D7+n5h)]=[k];}
);return g;}
,fields:function(a){var H9B="ls",h0B="col",Y3B="Dat",f9c="tObject",b=t[n4c][(R3c+q0h+d5h)][(B7+Q1+f9c+Y3B+C7Z.Q6+Q5+C7Z.l8h)](this[C7Z.c0h][(k1B)]),c=d(this[C7Z.c0h][(C7Z.R4h+P6h)])[n9c](),e=this[C7Z.c0h][S6h],f={}
;d[P5B](a)&&(a[(B0h+i7+C7Z.c0h)]!==h||a[d4]!==h||a[I8B]!==h)?(a[(B0h+t8h+Z1h)]!==h&&E(f,c,a[S0c],e,b),a[d4]!==h&&c[I8B](null,a[(h0B+C7Z.F4h+H6B+C7Z.c0h)])[(g4r+Y1h+p9B)]()[(C7Z.V7+v4B)](function(a){F(f,c,a,e,b);}
),a[(D7+J7c+C7Z.c0h)]!==h&&F(f,c,a[(D7+C7Z.V7+E8h+H9B)],e,b)):E(f,c,a,e,b);return f;}
,create:function(a,b){var C6h="bServe",z8c="oFeatures",c=d(this[C7Z.c0h][C7Z.A7c])[(J6B+I3+C0+C7Z.Q6+m5)]();c[(w8+O3B+i8c+C7Z.c0h)]()[0][z8c][(C6h+B0h+a4+n8B+C7Z.V7)]||(c=c[(B0h+t8h+A4B)][(C7Z.Q6+C7Z.i6+C7Z.i6)](b),K(c[(V6c+C7Z.i6+C7Z.V7)]()));}
,edit:function(a,b,c,e){var c2B="plic",N8="ny",X3c="ataFn",U7h="Obj",c1B="rS",K2B="rve",w0c="atu",g0="tings";a=d(this[C7Z.c0h][(I3+C7Z.w6+E8h+C7Z.V7)])[n9c]();if(!a[(w8+C7Z.R4h+g0)]()[0][(t8h+Q5+C7Z.V7+w0c+B0h+u9)][(C7Z.w6+o3+K2B+c1B+p3B)]){var f=t[(n4c)][(R3c+F8h)][(F9+C7Z.D4h+Q1+C7Z.R4h+U7h+C7Z.V7+i6B+D5+X3c)](this[C7Z.c0h][(d5h+b2c+D7)]),g=f(c),b=a[A8]("#"+g);b[(t3h)]()||(b=a[A8](function(a,b){return g==f(b);}
));b[(C7Z.Q6+N8)]()&&(b.data(c),K(b[M4r]()),c=d[A9](g,e[H7]),e[H7][(C7Z.c0h+c2B+C7Z.V7)](c,1));}
}
,remove:function(a){var V7B="rSide",m0B="bSer",Y3h="oFeat",b=d(this[C7Z.c0h][C7Z.A7c])[(J6B+I3+S+h7c+C7Z.V7)]();b[b2B]()[0][(Y3h+C7Z.F4h+B0h+C7Z.V7+C7Z.c0h)][(m0B+A1B+V7B)]||b[S0c](a)[h1h]();}
,prep:function(a,b,c,e,f){"edit"===a&&(f[(H7)]=d[(f2h+C7Z.Q6+q0h)](c.data,function(a,b){var J6="sEmp";if(!d[(d5h+J6+t9h+P8+C7Z.w6+f2c+i6B)](c.data[b]))return b;}
));}
,commit:function(a,b,c,e){var W7B="wTyp",M9="draw",q4="taTab";b=d(this[C7Z.c0h][(R9c+E4h)])[(J6B+q4+E4h)]();if("edit"===a&&e[(B0h+t8h+A4B+b8+F2h)].length)for(var f=e[(A8+b8+C7Z.i6+C7Z.c0h)],g=t[n4c][V0B][(B7+h3+n4h+C7Z.G2h+H8h+C7Z.R4h+D5+C7Z.U8+C7Z.Q6+x4)](this[C7Z.c0h][(n8B+A4h)]),h=0,e=f.length;h<e;h++)a=b[(B0h+i7)]("#"+f[h]),a[(o4+C7Z.X3h)]()||(a=b[A8](function(a,b){return f[h]===g(b);}
)),a[(t3h)]()&&a[h1h]();b[M9](this[C7Z.c0h][D1][(X7h+C7Z.Q6+W7B+C7Z.V7)]);}
}
;D[(n5h+t2h+E8h)]={initField:function(a){var e2h='[',b=d((e2h+u7h+Z1B+b0+I6h+l6h+A1h+U1B+b0+n3h+Z9h+n9h+I6h+n3h+Y6c)+(a.data||a[I8c])+(G0h));!a[(i3h+h1c+E8h)]&&b.length&&(a[h4h]=b[N4h]());}
,individual:function(a,b){var S9B="mine",Q6h="lly",h9h="tomatica",C6="ot",b6B="nts",U0="pare",v4r="nodeName";if(a instanceof d||a[v4r])b||(b=[d(a)[(C7Z.U8+C7Z.R4h+B0h)]((G2+A0c+C7Z.V7+C7Z.i6+d5h+x0B+A0c+C7Z.p5h+d5h+g1c))]),a=d(a)[(U0+b6B)]((f3+C7Z.i6+w7+A0c+C7Z.V7+C7Z.i6+d5h+Q5h+B0h+A0c+d5h+C7Z.i6+p7)).data("editor-id");a||(a="keyless");b&&!d[q6](b)&&(b=[b]);if(!b||0===b.length)throw (w7B+C7Z.l8h+C7Z.l8h+C6+p7B+C7Z.Q6+C7Z.F4h+h9h+Q6h+p7B+C7Z.i6+C7Z.V7+C7Z.R4h+C7Z.V7+B0h+S9B+p7B+C7Z.p5h+d5h+s3+C7Z.i6+p7B+C7Z.l8h+E7B+p7B+C7Z.p5h+d3c+f2h+p7B+C7Z.i6+C7Z.U8+C7Z.Q6+p7B+C7Z.c0h+m9+B0h+n1B);var c=D[(n5h+C7Z.R4h+f2h+E8h)][S6h][(D7+o4h+E8h)](this,a),e=this[C7Z.c0h][S6h],f={}
;d[(C7Z.V7+P9+n5h)](b,function(a,b){f[b]=e[b];}
);d[o6c](c,function(c,g){var Y5c="playFiel",X1B="cel";g[(t9h+q0h+C7Z.V7)]=(X1B+E8h);for(var h=a,i=b,l=d(),m=0,p=i.length;m<p;m++)l=l[(l9B)](C(h,i[m]));g[c3h]=l[(Q5h+n4+g6c+C7Z.X3h)]();g[S6h]=e;g[(C7Z.i6+i9c+Y5c+C7Z.i6+C7Z.c0h)]=f;}
);return c;}
,fields:function(a){var p8="less",b={}
,c={}
,e=this[C7Z.c0h][(J6c+E8h+C7Z.i6+C7Z.c0h)];a||(a=(s2h+e2+p8));d[(C7Z.V7+v4B)](e,function(b,e){var K0="valToData",d=C(a,e[(T8+C7Z.Q6+A4h)]())[(N4h)]();e[K0](c,null===d?h:d);}
);b[a]={idSrc:a,data:c,node:r,fields:e,type:(B0h+i7)}
;return b;}
,create:function(a,b){if(b){var c=t[(X2+C7Z.R4h)][V0B][e7h](this[C7Z.c0h][(d5h+b2c+D7)])(b);d('[data-editor-id="'+c+(G0h)).length&&J(c,a,b);}
}
,edit:function(a,b,c){var v6="taFn",S1B="_fnG";a=t[n4c][(V0B)][(S1B+C7Z.D9+n4h+C7Z.G2h+C7Z.V7+D7+C7Z.R4h+J6B+v6)](this[C7Z.c0h][k1B])(c)||"keyless";J(a,b,c);}
,remove:function(a){d('[data-editor-id="'+a+(G0h))[(B0h+d6+t8h+A1B)]();}
}
;f[(I9B+c8+C7Z.V7+C7Z.c0h)]={wrapper:(D5+C0+Z5),processing:{indicator:(D5+C0+Z5+F9+E8+B0h+v0+l1B+d1h+C7Z.l8h+C7Z.i6+N3c+x0B),active:(K8c+B0h+t8h+o9c+i8c)}
,header:{wrapper:(W0B+F9+j5+C7Z.V7+C7Z.Q6+Y1h+B0h),content:(G0B+E2h+C7Z.V7+C7Z.Q6+C7Z.i6+C7Z.W7+F9+p7c+d3+o0h+C7Z.l8h+C7Z.R4h)}
,body:{wrapper:(D5+H3+D2B+C7Z.X3h),content:"DTE_Body_Content"}
,footer:{wrapper:(D5+H3+F9+v6h+C7Z.R4h+C7Z.W7),content:(D5+C0+x7h+a6+C7Z.l8h+G3B)}
,form:{wrapper:"DTE_Form",content:"DTE_Form_Content",tag:"",info:(J5c+t8h+B0h+f2h+I1c+C7Z.p5h+t8h),error:(D5+J3h+Q5+t8h+S2h+Z5+A1c+t8h+B0h),buttons:"DTE_Form_Buttons",button:(S9)}
,field:{wrapper:(G0B+x7h+d4B+C7Z.i6),typePrefix:"DTE_Field_Type_",namePrefix:(W0B+F9+Q5+d4B+C7Z.i6+E8B+F9),label:(D5+C0+Z5+s7h+E8h),input:(D5+H3+F9+L0+y2+q0h+m9B),inputControl:"DTE_Field_InputControl",error:"DTE_Field_StateError","msg-label":(D5+L1c+x7+C7Z.V7+e7c+m8c+t8h),"msg-error":(W0B+F9+Q5+d5h+C7Z.V7+P4h+D3c+k9),"msg-message":(G0B+L1B+U6h+F9+R0+u9+R6B+C7Z.V7),"msg-info":(D5+C0+Z5+F9+Q5+d5h+C7Z.V7+P4h+Q8c+C7Z.l8h+C7Z.p5h+t8h),multiValue:"multi-value",multiInfo:"multi-info",multiRestore:(a0+r8h+A0c+B0h+C7Z.V7+s6)}
,actions:{create:"DTE_Action_Create",edit:(D5+H3+X0h+t8h+C7Z.l8h+D3c+V4B+C7Z.R4h),remove:"DTE_Action_Remove"}
,bubble:{wrapper:"DTE DTE_Bubble",liner:(G0B+L1B+W8c+i0+r0c+d5h+Z1c+B0h),table:(M9h+k4h+C7Z.M7+C7Z.V7),close:(D5+C0+L1B+b9c+C7Z.w6+E4h+q3c+q5h+w8),pointer:(D5+C0+Z5+A3c+C7Z.F4h+C7Z.w6+C7Z.w6+E8h+C7Z.V7+F9+N1B+C7Z.Q6+C7Z.l8h+H6h+E4h),bg:(C9h+K9c+y7c+E8h+C7Z.V7+F9+K9c+C7Z.Q6+K6c+B1c)}
}
;if(t[(C0+x7+E8h+R2h+t8h+M4h+C7Z.c0h)]){var i=t[t7h][N8c],G={sButtonText:x2c,editor:x2c,formTitle:x2c}
;i[(C3B+Q5h+B0h+F9+D7+b4)]=d[(X2+o2c+C7Z.i6)](!l4,i[(C7Z.R4h+X2+C7Z.R4h)],G,{formButtons:[{label:x2c,fn:function(){this[(Y9+P)]();}
}
],fnClick:function(a,b){var k8c="abel",c=b[(n1+H1c+t8h+B0h)],e=c[R8h][r4h],d=b[(f6+P0c+K9c+C7Z.F4h+M7h+t8h+N2c)];if(!d[l4][(E8h+k8c)])d[l4][h4h]=e[W4r];c[r4h]({title:e[(C7Z.R4h+d5h+x2h+C7Z.V7)],buttons:d}
);}
}
);i[(C7Z.V7+a1h+B0h+F9+N4B)]=d[(C7Z.V7+K4B+C7Z.R4h+D2h)](!0,i[(C7Z.c0h+C7Z.V7+E8h+C7Z.V7+i6B+d1c+G1h+C7Z.V7)],G,{formButtons:[{label:null,fn:function(){this[(C7Z.c0h+C7Z.F4h+C7Z.w6+f2h+d5h+C7Z.R4h)]();}
}
],fnClick:function(a,b){var c=this[k7c]();if(c.length===1){var e=b[(C7Z.V7+i7h)],d=e[R8h][(C7Z.V7+C7Z.i6+d5h+C7Z.R4h)],f=b[I8h];if(!f[0][(E8h+C7Z.Q6+h1c+E8h)])f[0][(h4h)]=d[(C7Z.c0h+C7Z.F4h+C7Z.w6+f2h+d5h+C7Z.R4h)];e[(n1+d5h+C7Z.R4h)](c[0],{title:d[K7],buttons:f}
);}
}
}
);i[(N4B+t8h+B0h+M3)]=d[(n4B+C7Z.i6)](!0,i[(C7Z.c0h+C7Z.V7+E4h+D7+C7Z.R4h)],G,{question:null,formButtons:[{label:null,fn:function(){var a=this;this[W4r](function(){var Y5h="fnSelectNone",P0B="fnGetInstance";d[C7Z.D4h][t1][(S+C7Z.w6+E8h+R2h+t8h+M4h+C7Z.c0h)][P0B](d(a[C7Z.c0h][C7Z.A7c])[n9c]()[C7Z.A7c]()[(C7Z.l8h+B8+C7Z.V7)]())[Y5h]();}
);}
}
],fnClick:function(a,b){var E6c="epl",N1c="ir",N8B="fir",c=this[k7c]();if(c.length!==0){var e=b[(C7Z.V7+V4B+C7Z.R4h+t8h+B0h)],d=e[R8h][(B0h+Y4c+C7Z.V7)],f=b[(C7Z.p5h+b0c+K9c+t2+N2c)],g=typeof d[(s7B+C7Z.l8h+N8B+f2h)]===(a4c+F6B)?d[(e3+N1c+f2h)]:d[(D7+d3+E1+P0c)][c.length]?d[(N3B+E1+B0h+f2h)][c.length]:d[S1c][F9];if(!f[0][h4h])f[0][h4h]=d[(C7Z.c0h+D4B+P)];e[h1h](c,{message:g[(B0h+E6c+C7Z.Q6+D7+C7Z.V7)](/%d/g,c.length),title:d[(C7Z.R4h+d5h+C7Z.R4h+E4h)],buttons:f}
);}
}
}
);}
d[(X2+o2c+C7Z.i6)](t[n4c][(C7Z.w6+m9B+Q5h+C7Z.l8h+C7Z.c0h)],{create:{text:function(a,b,c){return a[R8h]((C7Z.w6+m9B+O8B+C7Z.c0h+C7Z.I4c+D7+z5c+C7Z.Q6+o0h),c[o6][R8h][(x5B+l2h+C7Z.V7)][(G6)]);}
,className:"buttons-create",editor:null,formButtons:{label:function(a){return a[(d5h+F8c+B4r+C7Z.l8h)][r4h][(C7Z.c0h+C7Z.F4h+C7Z.w6+P)];}
,fn:function(){this[(Y9+Q0B+C7Z.R4h)]();}
}
,formMessage:null,formTitle:null,action:function(a,b,c,e){var o2="itl",D2="18",K9B="mT",m3B="formMessage",n5="formB";a=e[o6];a[(D7+B0h+j8h+C7Z.R4h+C7Z.V7)]({buttons:e[(n5+m9B+C7Z.R4h+t8h+C7Z.l8h+C7Z.c0h)],message:e[m3B],title:e[(C7Z.p5h+t8h+B0h+K9B+d5h+x2h+C7Z.V7)]||a[(d5h+D2+C7Z.l8h)][r4h][(C7Z.R4h+o2+C7Z.V7)]}
);}
}
,edit:{extend:(M7B+H8h+C7Z.R4h+n1),text:function(a,b,c){return a[R8h]("buttons.edit",c[(C3B+C7Z.R4h+C7Z.N6)][R8h][(C7Z.V7+A0)][G6]);}
,className:"buttons-edit",editor:null,formButtons:{label:function(a){return a[(R8h)][(C3B+C7Z.R4h)][(g9+C7Z.w6+f2h+d5h+C7Z.R4h)];}
,fn:function(){this[(Y9+Q0B+C7Z.R4h)]();}
}
,formMessage:null,formTitle:null,action:function(a,b,c,e){var Z0h="ormTit",S1h="ssage",O0B="Me",h8h="xe",r3c="nde",a=e[o6],c=b[S0c]({selected:!0}
)[(Q2B+X2+u9)](),d=b[d4]({selected:!0}
)[(d5h+r3c+h8h+C7Z.c0h)](),b=b[(I8B)]({selected:!0}
)[K5c]();a[(N4B)](d.length||b.length?{rows:c,columns:d,cells:b}
:c,{message:e[(C7Z.p5h+C7Z.N6+f2h+O0B+S1h)],buttons:e[I8h],title:e[(C7Z.p5h+Z0h+E8h+C7Z.V7)]||a[(O3h+s0)][N4B][K7]}
);}
}
,remove:{extend:"selected",text:function(a,b,c){return a[(R8h)]("buttons.remove",c[(C7Z.V7+V4B+Q5h+B0h)][(d5h+A7)][(B0h+Y4c+C7Z.V7)][G6]);}
,className:(E3c+C7Z.R4h+t8h+C7Z.l8h+C7Z.c0h+A0c+B0h+d6+t8h+A1B),editor:null,formButtons:{label:function(a){var c6c="remo";return a[(d5h+A7)][(c6c+A1B)][(C7Z.c0h+D4B+f2h+d5h+C7Z.R4h)];}
,fn:function(){this[(C7Z.c0h+D4B+f2h+H1c)]();}
}
,formMessage:function(a,b){var M1h="nfi",c=b[(A8+C7Z.c0h)]({selected:!0}
)[(Q2B+X2+u9)](),e=a[R8h][h1h];return ((C7Z.c0h+C7Z.R4h+B0h+d5h+i8c)===typeof e[S1c]?e[(D7+t8h+m8c+d5h+B0h+f2h)]:e[(s7B+M1h+B0h+f2h)][c.length]?e[S1c][c.length]:e[(D7+t8h+M1h+P0c)][F9])[u3c](/%d/g,c.length);}
,formTitle:null,action:function(a,b,c,e){var O0h="formTitle";a=e[(C7Z.V7+V4B+Q5h+B0h)];a[(B0h+d6+H9+C7Z.V7)](b[(B0h+t8h+Z1h)]({selected:!0}
)[K5c](),{buttons:e[(K6h+f2h+K9c+C7Z.F4h+C7Z.R4h+C7Z.R4h+L5B)],message:e[(C7Z.p5h+C7Z.N6+f2h+R0+C7Z.V7+C7Z.c0h+E4+H6h+C7Z.V7)],title:e[O0h]||a[R8h][(B0h+j7B+E4B+C7Z.V7)][(C7Z.R4h+H1c+E8h+C7Z.V7)]}
);}
}
}
);f[(B2h+V6)]={}
;f[(D5+h9+d5h+Y8B)]=function(a,b){var Q3="alend",v9="editor-dateime-",H3h="alenda",P6="-title",s5B="-date",R2B="nds",A9c="eco",g5="<span>:</span>",w3c="inu",e1=">:</",o7c="pan",o8='ime',b6h='-calendar"/></div><div class="',k4c='onth',J1c='-iconRight"><button>',G5B="viou",u5h='tton',k9h='eft',k1c='conL',o1B='itle',i1B='ate',t8B='ct',g7B='/><',f8c='</button></div><div class="',a8h="rma",Z2h="hout",p1c="aul";this[D7]=d[T2h](!l4,{}
,f[(J6B+C7Z.R4h+C7Z.V7+C0+f4r+C7Z.V7)][(C7Z.i6+M1+p1c+C7Z.R4h+C7Z.c0h)],b);var c=this[D7][Z3c],e=this[D7][(O3h+s0)];if(!p[(f2h+M3c+g5c)]&&S3c!==this[D7][(C7Z.p5h+b0c+C7Z.U8)])throw (Z5+C7Z.i6+d5h+x0B+p7B+C7Z.i6+C7Z.Q6+C7Z.R4h+x1B+f2h+C7Z.V7+G9h+v4h+H1c+Z2h+p7B+f2h+E3+C7Z.V7+C7Z.l8h+C7Z.R4h+C7Z.G2h+C7Z.c0h+p7B+t8h+C7Z.l8h+E8h+C7Z.X3h+p7B+C7Z.R4h+n5h+C7Z.V7+p7B+C7Z.p5h+t8h+a8h+C7Z.R4h+H5+G1+G1+N5+A0c+R0+R0+A0c+D5+D5+v9B+D7+o4+p7B+C7Z.w6+C7Z.V7+p7B+C7Z.F4h+w8+C7Z.i6);var g=function(a){var Z8c="</button></div></div>",o0c="next",p4B='-iconDown"><button>',q1='ele',m1B='abe',F2c="revi",o4r='ut',t4h='U',b3B='meblo';return (L2+u7h+h5+U7c+B7h+n3h+X0+r1B+Y6c)+c+(b0+f4c+d3h+b3B+B7h+E1h+u4c+u7h+d3h+P3B+U7c+B7h+n3h+X0+r1B+Y6c)+c+(b0+d3h+B7h+I6B+t4h+j1B+u4c+n9h+o4r+f4c+A1h+g1h+J7)+e[(q0h+F2c+t8h+P2B)]+f8c+c+(b0+n3h+m1B+n3h+u4c+r1B+z3B+g1h+g7B+r1B+q1+t8B+U7c+B7h+n3h+w2c+Y6c)+c+A0c+a+(h5c+u7h+h5+A0h+u7h+h5+U7c+B7h+Y7B+Y6c)+c+p4B+e[o0c]+Z8c;}
,g=d((L2+u7h+d3h+P3B+U7c+B7h+n3h+w2c+Y6c)+c+(u4c+u7h+d3h+P3B+U7c+B7h+n3h+Z9h+r1B+r1B+Y6c)+c+(b0+u7h+i1B+u4c+u7h+d3h+P3B+U7c+B7h+n3h+w2c+Y6c)+c+(b0+f4c+o1B+u4c+u7h+h5+U7c+B7h+n3h+w2c+Y6c)+c+(b0+d3h+k1c+k9h+u4c+n9h+l4c+u5h+J7)+e[(c6B+G5B+C7Z.c0h)]+f8c+c+J1c+e[(Z1c+K4B+C7Z.R4h)]+(Y4r+n9h+o1+I6B+m1+u7h+d3h+P3B+A0h+u7h+d3h+P3B+U7c+B7h+N1+r1B+Y6c)+c+(b0+n3h+Z9h+j7+n3h+u4c+r1B+j1B+C4+g7B+r1B+l2+I6h+B7h+f4c+U7c+B7h+N1+r1B+Y6c)+c+(b0+C1h+k4c+h5c+u7h+d3h+P3B+A0h+u7h+d3h+P3B+U7c+B7h+n3h+Z9h+e4B+Y6c)+c+(b0+n3h+Z9h+Y3+u4c+r1B+z3B+g1h+g7B+r1B+I6h+n3h+I6h+t8B+U7c+B7h+n3h+w2c+Y6c)+c+(b0+F7B+I6h+Z9h+U1B+h5c+u7h+h5+m1+u7h+d3h+P3B+A0h+u7h+d3h+P3B+U7c+B7h+N1+r1B+Y6c)+c+b6h+c+(b0+f4c+o8+f0)+g(B8c)+(q7c+C7Z.c0h+o7c+e1+C7Z.c0h+M6h+C7Z.l8h+V7c)+g((f2h+w3c+w8c))+g5+g((C7Z.c0h+A9c+R2B))+g((C7Z.Q6+f2h+T1h))+(s3c+C7Z.i6+E9c+f4+C7Z.i6+E9c+V7c));this[(C7Z.i6+t8h+f2h)]={container:g,date:g[(E1+B1c)](C7Z.I4c+c+s5B),title:g[(n5B+C7Z.i6)](C7Z.I4c+c+P6),calendar:g[(C7Z.p5h+Q2B)](C7Z.I4c+c+(A0c+D7+H3h+B0h)),time:g[(n5B+C7Z.i6)](C7Z.I4c+c+(A0c+C7Z.R4h+d5h+Y8B)),input:d(a)}
;this[C7Z.c0h]={d:x2c,display:x2c,namespace:v9+f[z8B][W5h]++,parts:{date:x2c!==this[D7][H3B][W0c](/[YMD]/),time:x2c!==this[D7][H3B][W0c](/[Hhm]/),seconds:-r4!==this[D7][(C7Z.p5h+b0c+C7Z.U8)][(g4r+Y1h+K4B+w3)](C7Z.c0h),hours12:x2c!==this[D7][(f6+P0c+C7Z.Q6+C7Z.R4h)][(f2h+C7Z.U8+I1B)](/[haA]/)}
}
;this[(C7Z.i6+E3)][Y1B][T8c](this[j0B][n8])[T8c](this[(C7Z.i6+E3)][(C7Z.R4h+d5h+f2h+C7Z.V7)]);this[(j0B)][n8][(L4+q0h+D2h)](this[j0B][K7])[(L4+e4c+C7Z.i6)](this[j0B][(D7+Q3+P0)]);this[(F9+s7B+N2c+m6h+C7Z.F4h+D7+x0B)]();}
;d[(C7Z.V7+K4B+o0h+B1c)](f.DateTime.prototype,{destroy:function(){this[U9]();this[j0B][(D7+Z6B+C7Z.Q6+d5h+Z1c+B0h)]()[g1B]("").empty();this[(C7Z.i6+E3)][(s7c+C7Z.F4h+C7Z.R4h)][(d0+C7Z.p5h)]((C7Z.I4c+C7Z.V7+C7Z.i6+H1c+C7Z.N6+A0c+C7Z.i6+C7Z.U8+x1B+f2h+C7Z.V7));}
,max:function(a){var P5="_optionsTitle",V1="max";this[D7][(V1+C5)]=a;this[P5]();this[X8h]();}
,min:function(a){var j3c="ande",e0B="minDate";this[D7][e0B]=a;this[(T0B+B6h+Q9+C7Z.c0h+C0+o0)]();this[(F9+C7Z.c0h+z1h+C7Z.Q6+E8h+j3c+B0h)]();}
,owns:function(a){var j0c="filter";return 0<d(a)[(M6h+B0h+C7Z.V7+C7Z.l8h+C7Z.R4h+C7Z.c0h)]()[(j0c)](this[(C7Z.i6+t8h+f2h)][(D7+t8h+C7Z.l8h+I3+d5h+g5h)]).length;}
,val:function(a,b){var P7="Title",d3B="rin",Z5h="toS",k1="teO",D8B="_wri",t7B="toDate",d6B="isValid",C8="YYY",l3h="Utc",n8c="teTo";if(a===h)return this[C7Z.c0h][C7Z.i6];if(a instanceof Date)this[C7Z.c0h][C7Z.i6]=this[(J4c+C7Z.Q6+n8c+l3h)](a);else if(null===a||""===a)this[C7Z.c0h][C7Z.i6]=null;else if("string"===typeof a)if((C8+G1+A0c+R0+R0+A0c+D5+D5)===this[D7][(f6+P0c+C7Z.Q6+C7Z.R4h)]){var c=a[W0c](/(\d{4})\-(\d{2})\-(\d{2})/);this[C7Z.c0h][C7Z.i6]=c?new Date(Date[(z7B)](c[1],c[2]-1,c[3])):null;}
else c=p[(D4c+Z3h)][(C7Z.F4h+C7Z.R4h+D7)](a,this[D7][H3B],this[D7][(f2h+M3c+g5c+E2+t8h+D7+C7Z.Q6+E4h)],this[D7][(f2h+M3c+C7Z.l8h+k5+C7Z.R4h+B0h+d5h+i6B)]),this[C7Z.c0h][C7Z.i6]=c[d6B]()?c[t7B]():null;if(b||b===h)this[C7Z.c0h][C7Z.i6]?this[(D8B+k1+C7Z.F4h+C7Z.R4h+q0h+m9B)]():this[j0B][C4c][W8](a);this[C7Z.c0h][C7Z.i6]||(this[C7Z.c0h][C7Z.i6]=this[(J4c+B9+f7h+F3+C7Z.R4h+D7)](new Date));this[C7Z.c0h][(Z0+g4h)]=new Date(this[C7Z.c0h][C7Z.i6][(Z5h+C7Z.R4h+d3B+H6h)]());this[(O3c+P7)]();this[X8h]();this[M9B]();}
,_constructor:function(){var c7="change",k3c="_writeOutput",G2c="setUT",K9="setUTCMonth",Q2h="tain",j7h="yup",g3B="amPm",E5B="ment",e9="ndsIncr",V="seco",y2c="sTi",i4="men",G5="ute",x3="nsTi",A9B="s12",x3c="_optionsTime",l7="nsT",J4h="time",V8h="ldre",V3c="tim",g9h="econd",O4h="non",e7="efi",d0h="Pr",a=this,b=this[D7][(D7+E8h+C7Z.Q6+B6+d0h+e7+K4B)],c=this[D7][(d5h+A7)];this[C7Z.c0h][(N7c+O6h)][(T8+C7Z.V7)]||this[j0B][n8][Q5B]("display",(O4h+C7Z.V7));this[C7Z.c0h][(q0h+P0+O6h)][(C7Z.R4h+d5h+Y8B)]||this[(C7Z.i6+E3)][(C7Z.R4h+f4r+C7Z.V7)][Q5B]((C7Z.i6+i9c+q0h+i3h+C7Z.X3h),(V6c+C7Z.l8h+C7Z.V7));this[C7Z.c0h][B6c][(C7Z.c0h+g9h+C7Z.c0h)]||(this[(C7Z.i6+E3)][(V3c+C7Z.V7)][(D7+n5h+d5h+V8h+C7Z.l8h)]((C7Z.i6+d5h+E4B+C7Z.I4c+C7Z.V7+C7Z.i6+d5h+x0B+A0c+C7Z.i6+C7Z.U8+C7Z.V7+r8h+Y8B+A0c+C7Z.R4h+f4r+C7Z.V7+C7Z.w6+q5h+a9B))[(C7Z.V7+C7Z.C8h)](2)[h1h](),this[(i9h+f2h)][(r8h+Y8B)][T1c]("span")[(C7Z.V7+C7Z.C8h)](1)[(z5c+f2h+t8h+A1B)]());this[C7Z.c0h][(q0h+P0+C7Z.R4h+C7Z.c0h)][Q9c]||this[j0B][J4h][(I1B+d5h+P4h+B0h+C7Z.V7+C7Z.l8h)]("div.editor-datetime-timeblock")[k6B]()[h1h]();this[(T0B+B6h+B3c+l7+d5h+C7Z.R4h+E4h)]();this[x3c]("hours",this[C7Z.c0h][B6c][(N9B+C7Z.F4h+B0h+A9B)]?12:24,1);this[(F9+B3+l1c+x3+f2h+C7Z.V7)]("minutes",60,this[D7][(Q0B+C7Z.l8h+G5+C7Z.c0h+b8+C7Z.l8h+D7+B0h+C7Z.V7+i4+C7Z.R4h)]);this[(F9+t8h+q0h+C7Z.R4h+Q9+y2c+Y8B)]("seconds",60,this[D7][(V+e9+C7Z.V7+E5B)]);this[(F9+B3+C7Z.R4h+d5h+t8h+N2c)]("ampm",[(C7Z.Q6+f2h),(q0h+f2h)],c[g3B]);this[(i9h+f2h)][C4c][(d3)]((f6+D7+C7Z.F4h+C7Z.c0h+C7Z.I4c+C7Z.V7+C7Z.i6+H1c+C7Z.N6+A0c+C7Z.i6+C7Z.U8+C7Z.V7+V3c+C7Z.V7+p7B+D7+L0h+a9B+C7Z.I4c+C7Z.V7+C7Z.i6+d5h+C7Z.R4h+C7Z.N6+A0c+C7Z.i6+C7Z.U8+C7Z.V7+r8h+Y8B),function(){var K8="_sh",J5B="ib";if(!a[(j0B)][(s7B+g5c+n3+C7Z.l8h+C7Z.W7)][(d5h+C7Z.c0h)]((F3c+E4B+i9c+J5B+E4h))&&!a[(C7Z.i6+t8h+f2h)][(C2+C7Z.R4h)][i9c]((F3c+C7Z.i6+d5h+C7Z.c0h+x7+i2h))){a[(E4B+o4h)](a[j0B][(d5h+P6c+m9B)][W8](),false);a[(K8+i7)]();}
}
)[d3]((T0+j7h+C7Z.I4c+C7Z.V7+i7h+A0c+C7Z.i6+C7Z.U8+C7Z.D9+d5h+f2h+C7Z.V7),function(){var G5c="isible";a[(C7Z.i6+t8h+f2h)][(D7+Z6B+C7Z.Q6+d5h+g5h)][(d5h+C7Z.c0h)]((F3c+E4B+G5c))&&a[(W8)](a[(C7Z.i6+E3)][(d5h+C7Z.l8h+q0h+C7Z.F4h+C7Z.R4h)][(E4B+C7Z.Q6+E8h)](),false);}
);this[(j0B)][(D7+d3+Q2h+C7Z.V7+B0h)][d3]("change","select",function(){var E6="ite",J2="setSeconds",P5c="utput",k2B="etTime",U7B="nute",N7B="CHou",O1c="mpm",k7B="asC",f7B="hasCla",q1h="setCa",b1="Ye",l9="tFull",q8h="ear",r9c="ander",m4="tC",Y2="setT",c=d(this),f=c[W8]();if(c[(n5h+C7Z.Q6+b8c+E8h+c8)](b+"-month")){a[C7Z.c0h][(C7Z.i6+B0c+E8h+l5)][K9](f);a[(F9+Y2+o0)]();a[(j6B+C7Z.V7+m4+o4h+r9c)]();}
else if(c[(K5h+C7Z.c0h+p7c+q7B+C7Z.c0h)](b+(A0c+C7Z.X3h+q8h))){a[C7Z.c0h][(C7Z.i6+i9c+q0h+i3h+C7Z.X3h)][(C7Z.c0h+C7Z.V7+l9+b1+P0)](f);a[(F9+C7Z.c0h+C7Z.D9+f3h+x2h+C7Z.V7)]();a[(F9+q1h+E8h+C7Z.Q6+C7Z.l8h+Y1h+B0h)]();}
else if(c[(f7B+B6)](b+(A0c+n5h+m9+z1c))||c[(n5h+k7B+E8h+C7Z.Q6+B6)](b+(A0c+C7Z.Q6+O1c))){if(a[C7Z.c0h][(q0h+C7Z.Q6+B0h+C7Z.R4h+C7Z.c0h)][Q9c]){c=d(a[(C7Z.i6+E3)][Y1B])[M1c]("."+b+(A0c+n5h+t8h+q2B+C7Z.c0h))[(E4B+o4h)]()*1;f=d(a[(j0B)][(D7+t8h+C7Z.l8h+C7Z.R4h+B5B+C7Z.V7+B0h)])[(n5B+C7Z.i6)]("."+b+"-ampm")[W8]()==="pm";a[C7Z.c0h][C7Z.i6][(G2c+N7B+z1c)](c===12&&!f?0:f&&c!==12?c+12:c);}
else a[C7Z.c0h][C7Z.i6][(C7Z.c0h+C7Z.D9+F3+O3+j5+t8h+q2B+C7Z.c0h)](f);a[M9B]();a[k3c](true);}
else if(c[(n5h+k7B+i3h+C7Z.c0h+C7Z.c0h)](b+(A0c+f2h+d5h+C7Z.l8h+C7Z.F4h+C7Z.R4h+u9))){a[C7Z.c0h][C7Z.i6][(C7Z.c0h+C7Z.D9+F3+C0+p7c+R0+d5h+U7B+C7Z.c0h)](f);a[(F9+C7Z.c0h+k2B)]();a[(F9+J9h+H1c+d6h+P5c)](true);}
else if(c[(n5h+d8+a1B+C7Z.Q6+C7Z.c0h+C7Z.c0h)](b+"-seconds")){a[C7Z.c0h][C7Z.i6][J2](f);a[(O3c+C0+d5h+Y8B)]();a[(F9+J9h+E6+P8+m9B+q0h+m9B)](true);}
a[j0B][C4c][(C7Z.p5h+c4+P2B)]();a[(I0B+m6+d5h+C7Z.e8c)]();}
)[(d3)]("click",function(c){var R7c="setFullYear",l2B="oUt",o9="Inde",f5c="In",U="dInde",v5h="lec",o5B="lect",P2="selectedIndex",O5="edIndex",l4h="Titl",A2B="nR",o6h="sCla",W9B="nder",g9c="conL",v3="sCl",K1="pPr",M6c="sto",j2B="werC",p0B="toLo",v3h="Nam",f=c[E0B][(C7Z.l8h+t8h+Y1h+v3h+C7Z.V7)][(p0B+j2B+d8+C7Z.V7)]();if(f!==(M7B+H8h+C7Z.R4h)){c[(M6c+K1+t8h+P2c+C7Z.Q6+r8h+t8h+C7Z.l8h)]();if(f==="button"){c=d(c[E0B]);f=c.parent();if(!f[(d9B)]("disabled"))if(f[(K5h+v3+C7Z.Q6+C7Z.c0h+C7Z.c0h)](b+(A0c+d5h+g9c+M1+C7Z.R4h))){a[C7Z.c0h][(V4B+C7Z.c0h+G3h+C7Z.X3h)][K9](a[C7Z.c0h][U8B][f5B]()-1);a[(j6B+C7Z.D9+C0+d5h+C7Z.R4h+E4h)]();a[(j6B+z1h+C7Z.Q6+E8h+C7Z.Q6+W9B)]();a[(j0B)][C4c][(t0h)]();}
else if(f[(n5h+C7Z.Q6+o6h+B6)](b+(A0c+d5h+D7+t8h+A2B+D9c))){a[C7Z.c0h][U8B][K9](a[C7Z.c0h][(Z0+g4h)][f5B]()+1);a[(F9+C7Z.c0h+C7Z.D9+l4h+C7Z.V7)]();a[X8h]();a[(j0B)][(d5h+C7Z.l8h+q0h+m9B)][(C7Z.p5h+t8h+J2B+C7Z.c0h)]();}
else if(f[(n5h+C7Z.Q6+o6h+B6)](b+"-iconUp")){c=f.parent()[(C7Z.p5h+d5h+B1c)]("select")[0];c[(M7B+H8h+C7Z.R4h+O5)]=c[P2]!==c[(B3+r8h+t8h+N2c)].length-1?c[P2]+1:0;d(c)[(D7+n5h+j5h+C7Z.V7)]();}
else if(f[d9B](b+"-iconDown")){c=f.parent()[M1c]((w8+o5B))[0];c[(w8+v5h+C7Z.R4h+C7Z.V7+U+K4B)]=c[(C7Z.c0h+w1c+i6B+C7Z.V7+C7Z.i6+f5c+C7Z.i6+X2)]===0?c[C0c].length-1:c[(C7Z.c0h+s3+H8h+C7Z.R4h+C7Z.V7+C7Z.i6+o9+K4B)]-1;d(c)[c7]();}
else{if(!a[C7Z.c0h][C7Z.i6])a[C7Z.c0h][C7Z.i6]=a[(h6B+C7Z.R4h+C7Z.V7+C0+l2B+D7)](new Date);a[C7Z.c0h][C7Z.i6][R7c](c.data((C7Z.X3h+C7Z.V7+P0)));a[C7Z.c0h][C7Z.i6][K9](c.data("month"));a[C7Z.c0h][C7Z.i6][(G2c+p7c+J6B+C7Z.R4h+C7Z.V7)](c.data((C7Z.i6+C7Z.Q6+C7Z.X3h)));a[k3c](true);setTimeout(function(){a[(o3B+d5h+Y1h)]();}
,10);}
}
else a[(C7Z.i6+t8h+f2h)][(g4r+q0h+C7Z.F4h+C7Z.R4h)][(C7Z.p5h+t4)]();}
}
);}
,_compareDates:function(a,b){var O4c="ateStr";return a[(Q5h+D5+C7Z.U8+q7h+C7Z.R4h+u8c+C7Z.l8h+H6h)]()===b[(C7Z.R4h+t8h+D5+O4c+g4r+H6h)]();}
,_daysInMonth:function(a,b){return [31,0===a%4&&(0!==a%100||0===a%400)?29:28,31,30,31,30,31,31,30,31,30,31][b];}
,_dateToUtc:function(a){var f8h="getMinutes",j3="tHo",X1c="getDate",f6c="getMonth",v6c="Ful";return new Date(Date[z7B](a[(j2+v6c+M2B+C7Z.Q6+B0h)](),a[f6c](),a[X1c](),a[(H6h+C7Z.V7+j3+C7Z.F4h+B0h+C7Z.c0h)](),a[f8h](),a[(F0+k5+C7Z.V7+D7+d3+C7Z.i6+C7Z.c0h)]()));}
,_hide:function(){var p0="oll",a=this[C7Z.c0h][U5B];this[(C7Z.i6+t8h+f2h)][(D7+t8h+g5c+n3+Z1c+B0h)][j1c]();d(p)[(g1B)]("."+a);d(r)[(t8h+O9)]("keydown."+a);d((C7Z.i6+d5h+E4B+C7Z.I4c+D5+C0+L1B+K9c+m7c+h1B+o0h+g5c))[(d0+C7Z.p5h)]((N3+p0+C7Z.I4c)+a);d("body")[(d0+C7Z.p5h)]("click."+a);}
,_hours24To12:function(a){return 0===a?12:12<a?a-12:a;}
,_htmlDay:function(a){var g2="day",p2='ay',W1c="oday",A4r="today",T6c="efix",w0="sPr",V3h='pty';if(a.empty)return (L2+f4c+u7h+U7c+B7h+y6B+r1B+r1B+Y6c+I6h+C1h+V3h+S8h+f4c+u7h+J7);var b=["day"],c=this[D7][(I9B+C7Z.Q6+C7Z.c0h+w0+T6c)];a[w0h]&&b[(q0h+C7Z.F4h+b2)]("disabled");a[A4r]&&b[(G7h+b2)]((C7Z.R4h+W1c));a[a7c]&&b[(q0h+C7Z.F4h+C7Z.c0h+n5h)]("selected");return (L2+f4c+u7h+U7c+u7h+Z9h+a5B+b0+u7h+p2+Y6c)+a[g2]+'" class="'+b[(C7Z.G2h+t8h+d5h+C7Z.l8h)](" ")+'"><button class="'+c+"-button "+c+(b0+u7h+Z9h+F7B+w8B+f4c+C5B+Y6c+n9h+l4c+f4c+f4c+A1h+g1h+w8B+u7h+Z1B+b0+F7B+F6+U1B+Y6c)+a[G1B]+(w8B+u7h+Z1B+b0+C1h+I6B+f4c+c4B+Y6c)+a[(f2h+Z6B+n5h)]+(w8B+u7h+Z9h+f4c+Z9h+b0+u7h+p2+Y6c)+a[(g2)]+'">'+a[(q0B+C7Z.X3h)]+(s3c+C7Z.w6+m9B+Q5h+C7Z.l8h+f4+C7Z.R4h+C7Z.i6+V7c);}
,_htmlMonth:function(a,b){var R1="><",M5B="_htmlMonthHead",p6c='le',A6h="showWeekNumber",D5B="_htmlWeekOfYear",w1="unshift",N5c="umber",f0c="kN",e1B="We",L3h="lDa",t4B="funct",U6B="TCD",S7B="sAr",H6c="reDa",y1="compa",z7c="CMi",w5h="UT",x2B="Ho",b8B="Mi",w5B="setUTCHours",Y7h="minD",r3h="firstDay",I7B="Day",c0c="getUT",c3B="_daysInMonth",c=new Date,e=this[c3B](a,b),f=(new Date(Date[(z7B)](a,b,1)))[(c0c+p7c+D5+l5)](),g=[],h=[];0<this[D7][(E1+z1c+C7Z.R4h+I7B)]&&(f-=this[D7][r3h],0>f&&(f+=7));for(var k=e+f,i=k;7<i;)i-=7;var k=k+(7-i),i=this[D7][(Y7h+B9)],l=this[D7][(f2h+d2+C5)];i&&(i[w5B](0),i[(P1B+z7B+b8B+C7Z.l8h+C7Z.F4h+C7Z.R4h+u9)](0),i[(C7Z.c0h+C7Z.V7+k5+C7Z.V7+s7B+B1c+C7Z.c0h)](0));l&&(l[(P1B+F3+O3+x2B+C7Z.F4h+z1c)](23),l[(P1B+w5h+z7c+C7Z.l8h+C7Z.F4h+C7Z.R4h+C7Z.V7+C7Z.c0h)](59),l[(P1B+a4+C7Z.V7+D7+t8h+B1c+C7Z.c0h)](59));for(var m=0,p=0;m<k;m++){var q=new Date(Date[(F3+O3)](a,b,1+(m-f))),r=this[C7Z.c0h][C7Z.i6]?this[(F9+D7+t8h+p6B+C7Z.Q6+z5c+D5+C7Z.Q6+C7Z.R4h+u9)](q,this[C7Z.c0h][C7Z.i6]):!1,s=this[(F9+y1+H6c+w8c)](q,c),t=m<f||m>=e+f,u=i&&q<i||l&&q>l,v=this[D7][(C7Z.i6+i9c+K8h+C7Z.V7+J6B+C7Z.X3h+C7Z.c0h)];d[(d5h+S7B+g6c+C7Z.X3h)](v)&&-1!==d[(A9)](q[(w9h+U6B+C7Z.Q6+C7Z.X3h)](),v)?u=!0:(t4B+d5h+t8h+C7Z.l8h)===typeof v&&!0===v(q)&&(u=!0);h[(q0h+C7Z.F4h+C7Z.c0h+n5h)](this[(F9+n5h+C7Z.R4h+f2h+L3h+C7Z.X3h)]({day:1+(m-f),month:b,year:a,selected:r,today:s,disabled:u,empty:t}
));7===++p&&(this[D7][(C7Z.c0h+N9B+A4B+e1B+C7Z.V7+f0c+N5c)]&&h[w1](this[D5B](m-f,b,a)),g[(q0h+C7Z.F4h+b2)]("<tr>"+h[(C7Z.G2h+t8h+g4r)]("")+(s3c+C7Z.R4h+B0h+V7c)),h=[],p=0);}
c=this[D7][(D7+q7B+I3c+B0h+C7Z.V7+C0B)]+(A0c+C7Z.R4h+C7Z.Q6+m5);this[D7][A6h]&&(c+=" weekNumber");return (L2+f4c+b9h+p6c+U7c+B7h+n3h+Z9h+r1B+r1B+Y6c)+c+(u4c+f4c+c4B+I6h+Z9h+u7h+J7)+this[M5B]()+(s3c+C7Z.R4h+c4h+X9+R1+C7Z.R4h+k5c+h5h+V7c)+g[p4h]("")+(s3c+C7Z.R4h+k5h+C7Z.X3h+f4+C7Z.R4h+K8h+C7Z.V7+V7c);}
,_htmlMonthHead:function(){var P6B="um",a3h="eekN",O5h="first",a=[],b=this[D7][(O5h+D5+C7Z.Q6+C7Z.X3h)],c=this[D7][R8h],e=function(a){var f6h="weekdays";for(a+=b;7<=a;)a-=7;return c[f6h][a];}
;this[D7][(b2+t8h+A4B+v4h+a3h+P6B+h1c+B0h)]&&a[P3h]((q7c+C7Z.R4h+n5h+f4+C7Z.R4h+n5h+V7c));for(var d=0;7>d;d++)a[(G7h+C7Z.c0h+n5h)]((q7c+C7Z.R4h+n5h+V7c)+e(d)+(s3c+C7Z.R4h+n5h+V7c));return a[(C7Z.G2h+t8h+d5h+C7Z.l8h)]("");}
,_htmlWeekOfYear:function(a,b,c){var y8h="getUTCDay",e=new Date(c,0,1),a=Math[(n1B+d5h+E8h)](((new Date(c,b,a)-e)/864E5+e[y8h]()+1)/7);return '<td class="'+this[D7][Z3c]+'-week">'+a+(s3c+C7Z.R4h+C7Z.i6+V7c);}
,_options:function(a,b,c){c||(c=b);a=this[j0B][Y1B][(n5B+C7Z.i6)]("select."+this[D7][Z3c]+"-"+a);a.empty();for(var e=0,d=b.length;e<d;e++)a[T8c]('<option value="'+b[e]+(f0)+c[e]+(s3c+t8h+q0h+l1c+C7Z.l8h+V7c));}
,_optionSet:function(a,b){var H4r="unknown",M4B="ssP",c=this[(C7Z.i6+t8h+f2h)][(s7B+C7Z.l8h+I3+g4r+C7Z.W7)][(C7Z.p5h+Q2B)]((C7Z.c0h+w1c+D7+C7Z.R4h+C7Z.I4c)+this[D7][(d4h+M4B+z5c+C0B)]+"-"+a),e=c.parent()[(I1B+c0B+X7h+C7Z.V7+C7Z.l8h)]((C7Z.c0h+q0h+C7Z.Q6+C7Z.l8h));c[W8](b);c=c[M1c]((B3+C7Z.e8c+F3c+C7Z.c0h+C7Z.V7+E8h+C7Z.V7+D7+o0h+C7Z.i6));e[N4h](0!==c.length?c[t4c]():this[D7][(d5h+A7)][H4r]);}
,_optionsTime:function(a,b,c){var Q8B='ion',S6B="_pad",a=this[(C7Z.i6+E3)][(D7+d3+I3+d5h+g5h)][(C7Z.p5h+Q2B)]("select."+this[D7][Z3c]+"-"+a),e=0,d=b,f=12===b?function(a){return a;}
:this[S6B];12===b&&(e=1,d=13);for(b=e;b<d;b+=c)a[T8c]((L2+A1h+j1B+f4c+Q8B+U7c+P3B+S9h+Y6c)+b+(f0)+f(b)+(s3c+t8h+q0h+C7Z.R4h+B3c+C7Z.l8h+V7c));}
,_optionsTitle:function(){var Y6="ange",X5B="_r",i9B="months",O0c="_range",X5="_options",H4c="yearRange",A7B="Yea",F1B="tFu",D6="nge",F4r="xD",a=this[D7][(O3h+B4r+C7Z.l8h)],b=this[D7][(f2h+g4r+D5+C7Z.U8+C7Z.V7)],c=this[D7][(f2h+C7Z.Q6+F4r+C7Z.Q6+o0h)],b=b?b[E6B]():null,c=c?c[E6B]():null,b=null!==b?b:(new Date)[E6B]()-this[D7][(C7Z.X3h+C7Z.V7+P0+G4+C7Z.Q6+D6)],c=null!==c?c:(new Date)[(F0+F1B+k8h+A7B+B0h)]()+this[D7][H4c];this[X5]("month",this[O0c](0,11),a[i9B]);this[X5]("year",this[(X5B+Y6)](b,c));}
,_pad:function(a){return 10>a?"0"+a:a;}
,_position:function(){var L0c="Top",w4="sc",I9="Heig",Q2c="outer",a=this[j0B][C4c][m9h](),b=this[(i9h+f2h)][(D7+d3+C7Z.R4h+F7h)],c=this[(C7Z.i6+t8h+f2h)][(d5h+H5B+C7Z.R4h)][e4h]();b[(D7+C7Z.c0h+C7Z.c0h)]({top:a.top+c,left:a[(E8h+d1)]}
)[e5B]((C7Z.w6+t8h+h5h));var e=b[(Q2c+I9+n5h+C7Z.R4h)](),f=d((k5c+h5h))[(w4+B0h+t8h+E8h+E8h+L0c)]();a.top+c+e-f>d(p).height()&&(a=a.top-e,b[(Q5B)]((r0B),0>a?0:a));}
,_range:function(a,b){for(var c=[],e=a;e<=b;e++)c[(P3h)](e);return c;}
,_setCalander:function(){var W9h="lMont",r4B="htm",L8c="calendar";this[j0B][L8c].empty()[T8c](this[(F9+r4B+W9h+n5h)](this[C7Z.c0h][(C7Z.i6+B0c+i3h+C7Z.X3h)][E6B](),this[C7Z.c0h][(V4B+C7Z.c0h+q0h+i3h+C7Z.X3h)][f5B]()));}
,_setTitle:function(){var s9="UTCMont",n0c="onth",R6h="_op";this[(R6h+C7Z.R4h+Q9+a4+C7Z.D9)]((f2h+n0c),this[C7Z.c0h][(V4B+W5)][(F0+C7Z.R4h+s9+n5h)]());this[(F9+t8h+q0+d3+a4+C7Z.V7+C7Z.R4h)]((C7Z.X3h+C7Z.V7+P0),this[C7Z.c0h][U8B][E6B]());}
,_setTime:function(){var E2B="getSeconds",Y9B="ionSe",M8h="_opt",R1c="getUTCMinutes",T4="ionS",m8="12",u2h="rs24",V5h="_optionSet",V4r="Hours",b8h="etU",a=this[C7Z.c0h][C7Z.i6],b=a?a[(H6h+b8h+C0+p7c+V4r)]():0;this[C7Z.c0h][B6c][Q9c]?(this[V5h]("hours",this[(F9+n5h+m9+u2h+f7h+m8)](b)),this[(T0B+B6h+T4+C7Z.V7+C7Z.R4h)]((b9B),12>b?"am":(q0h+f2h))):this[(T0B+B6h+d5h+d3+a4+C7Z.V7+C7Z.R4h)]((N9B+q2B+C7Z.c0h),b);this[V5h]("minutes",a?a[R1c]():0);this[(M8h+Y9B+C7Z.R4h)]("seconds",a?a[E2B]():0);}
,_show:function(){var M5="iti",M0B="pos",a=this,b=this[C7Z.c0h][U5B];this[(F9+M0B+M5+t8h+C7Z.l8h)]();d(p)[(t8h+C7Z.l8h)]("scroll."+b+" resize."+b,function(){var v5B="itio",J9B="_po";a[(J9B+C7Z.c0h+v5B+C7Z.l8h)]();}
);d((C7Z.i6+d5h+E4B+C7Z.I4c+D5+C0+Z5+A3c+m7c+F9+w3B+C7Z.l8h+C7Z.R4h+Z3h))[d3]((N3+t8h+k8h+C7Z.I4c)+b,function(){var Z4="_position";a[Z4]();}
);d(r)[d3]("keydown."+b,function(b){(9===b[T7B]||27===b[(s2h+W1B+Y1h)]||13===b[(T0+u9h+Y1h)])&&a[(F9+n5h+p3B)]();}
);setTimeout(function(){d((B2c))[d3]((I9B+d5h+a9B+C7Z.I4c)+b,function(b){var M4c="lter";!d(b[(C7Z.R4h+P0+F0+C7Z.R4h)])[N3h]()[(E1+M4c)](a[(C7Z.i6+E3)][Y1B]).length&&b[(E0B)]!==a[(j0B)][(g4r+q0h+C7Z.F4h+C7Z.R4h)][0]&&a[(F9+U8h+C7Z.i6+C7Z.V7)]();}
);}
,10);}
,_writeOutput:function(a){var U9h="tStri",S3B="ca",u5="utc",U3h="moment",Z9c="UTCD",G9c="CF",b=this[C7Z.c0h][C7Z.i6],b="YYYY-MM-DD"===this[D7][H3B]?b[(w9h+C0+G9c+t6B+M2B+C7Z.Q6+B0h)]()+"-"+this[(F9+q0h+X9)](b[f5B]()+1)+"-"+this[(F9+M6h+C7Z.i6)](b[(H6h+C7Z.V7+C7Z.R4h+Z9c+C7Z.Q6+o0h)]()):p[(U3h)][u5](b,h,this[D7][(D4c+C7Z.V7+g5c+E2+t8h+S3B+E4h)],this[D7][(D4c+C7Z.V7+C7Z.l8h+U9h+D7+C7Z.R4h)])[H3B](this[D7][H3B]);this[(j0B)][C4c][(E4B+C7Z.Q6+E8h)](b);a&&this[(C7Z.i6+t8h+f2h)][(d5h+C7Z.l8h+q0h+C7Z.F4h+C7Z.R4h)][t0h]();}
}
);f[(C5+f3h+f2h+C7Z.V7)][W5h]=l4;f[z8B][(C7Z.i6+C7Z.V7+V0+E5h+C7Z.c0h)]={classPrefix:(R9+B0h+A0c+C7Z.i6+C7Z.U8+C7Z.D9+d5h+Y8B),disableDays:x2c,firstDay:r4,format:(G1+N5+G1+A0c+R0+R0+A0c+D5+D5),i18n:f[(C7Z.i6+C7Z.V7+C7Z.p5h+C7Z.Q6+y3c)][(d5h+F8c+B4r+C7Z.l8h)][w9],maxDate:x2c,minDate:x2c,minutesIncrement:r4,momentStrict:!l4,momentLocale:Z6,secondsIncrement:r4,showWeekNumber:!r4,yearRange:I7h}
;var H=function(a,b){var o7="Choose file...",E0="uploadText";if(x2c===b||b===h)b=a[E0]||o7;a[(F9+s7c+C7Z.F4h+C7Z.R4h)][(C7Z.p5h+d5h+C7Z.l8h+C7Z.i6)]((V4B+E4B+C7Z.I4c+C7Z.F4h+C3h+t8h+X9+p7B+C7Z.w6+C7Z.F4h+C7Z.R4h+C7Z.R4h+d3))[t4c](b);}
,L=function(a,b,c){var Q7c="=",Y9h="ppe",O9h="noDrop",N8h="plo",q3="dragover",I2B="over",z7="exit",r5h="drop",H4h="dragDropText",n1h="div.drop span",n0="dragDrop",O="FileR",F9B="_enabled",Z0B='ere',S7='nd',R8c='pan',x6c='eco',G4h='V',O2B='ear',P8h='ile',p1='" /><',U0c='tt',V2c='pl',J4r='ell',I3B='w',A3='bl',w2h='u_ta',k7h='oa',A6c='upl',e=a[r9][(f6+B0h+f2h)][G6],e=d((L2+u7h+h5+U7c+B7h+n3h+X0+r1B+Y6c+I6h+l6h+b0B+F9h+A6c+k7h+u7h+u4c+u7h+h5+U7c+B7h+Y7B+Y6c+I6h+w2h+A3+I6h+u4c+u7h+d3h+P3B+U7c+B7h+Y7B+Y6c+U1B+A1h+I3B+u4c+u7h+h5+U7c+B7h+y6B+e4B+Y6c+B7h+J4r+U7c+l4c+V2c+A1h+Z9h+u7h+u4c+n9h+l4c+U0c+A1h+g1h+U7c+B7h+y6B+e4B+Y6c)+e+(p1+d3h+C7+U7c+f4c+C5B+Y6c+N6h+P8h+h5c+u7h+d3h+P3B+A0h+u7h+h5+U7c+B7h+y6B+e4B+Y6c+B7h+J4r+U7c+B7h+n3h+O2B+G4h+S9h+u4c+n9h+o1+I6B+U7c+B7h+y6B+r1B+r1B+Y6c)+e+(b7c+u7h+h5+m1+u7h+d3h+P3B+A0h+u7h+h5+U7c+B7h+n3h+X0+r1B+Y6c+U1B+A1h+I3B+U7c+r1B+x6c+g1h+u7h+u4c+u7h+d3h+P3B+U7c+B7h+n3h+X0+r1B+Y6c+B7h+l2+n3h+u4c+u7h+d3h+P3B+U7c+B7h+n3h+X0+r1B+Y6c+u7h+U1B+A1h+j1B+u4c+r1B+R8c+q5c+u7h+h5+m1+u7h+d3h+P3B+A0h+u7h+d3h+P3B+U7c+B7h+n3h+w2c+Y6c+B7h+I6h+n3h+n3h+u4c+u7h+d3h+P3B+U7c+B7h+y6B+r1B+r1B+Y6c+U1B+I6h+S7+Z0B+u7h+h5c+u7h+d3h+P3B+m1+u7h+d3h+P3B+m1+u7h+h5+m1+u7h+h5+J7));b[j6c]=e;b[F9B]=!l4;H(b);if(p[(O+C7Z.V7+C7Z.Q6+C7Z.i6+C7Z.W7)]&&!r4!==b[n0]){e[M1c](n1h)[t4c](b[H4h]||(D5+B0h+c1+p7B+C7Z.Q6+B1c+p7B+C7Z.i6+d3c+q0h+p7B+C7Z.Q6+p7B+C7Z.p5h+d5h+E8h+C7Z.V7+p7B+n5h+C7Z.V7+B0h+C7Z.V7+p7B+C7Z.R4h+t8h+p7B+C7Z.F4h+q0h+E8h+t8h+C7Z.Q6+C7Z.i6));var g=e[M1c]((V4B+E4B+C7Z.I4c+C7Z.i6+B0h+B3));g[(t8h+C7Z.l8h)](r5h,function(e){var P1="dataTransfer",F7c="Ev",y9="gina";b[F9B]&&(f[e6](a,b,e[(t8h+u8c+y9+E8h+F7c+Z6+C7Z.R4h)][P1][(C7Z.p5h+c0B+C7Z.V7+C7Z.c0h)],H,c),g[U4]((H9+C7Z.V7+B0h)));return !r4;}
)[d3]((C7Z.i6+B0h+C7Z.Q6+H6h+E8h+C7Z.V7+C7Z.Q6+A1B+p7B+C7Z.i6+B0h+C7Z.Q6+H6h+z7),function(){var n7B="lass";b[F9B]&&g[(B0h+d6+t8h+E4B+C7Z.V7+p7c+n7B)](I2B);return !r4;}
)[d3](q3,function(){b[F9B]&&g[W6B]((H9+C7Z.V7+B0h));return !r4;}
);a[(t8h+C7Z.l8h)]((t8h+e4c),function(){var m0="TE_U",w3h="rag";d(B2c)[(t8h+C7Z.l8h)]((C7Z.i6+w3h+I2B+C7Z.I4c+D5+C0+Z5+F9+Q6c+E8h+t8h+X9+p7B+C7Z.i6+B0h+t8h+q0h+C7Z.I4c+D5+m0+N8h+C7Z.Q6+C7Z.i6),function(){return !r4;}
);}
)[d3](n2h,function(){var A3h="_Up",W0h="E_U",Y="ago";d(B2c)[(g1B)]((C7Z.i6+B0h+Y+A1B+B0h+C7Z.I4c+D5+C0+W0h+q0h+E8h+t8h+C7Z.Q6+C7Z.i6+p7B+C7Z.i6+B0h+t8h+q0h+C7Z.I4c+D5+H3+A3h+q5h+X9));}
);}
else e[(X9+C7Z.i6+p7c+E8h+d8+C7Z.c0h)](O9h),e[(C7Z.Q6+Y9h+C7Z.l8h+C7Z.i6)](e[(E1+C7Z.l8h+C7Z.i6)]((C7Z.i6+E9c+C7Z.I4c+B0h+Z6+C7Z.i6+k3+C7Z.i6)));e[(C7Z.p5h+d5h+B1c)](f4h)[(t8h+C7Z.l8h)](q5B,function(){var y2B="cal",m3h="uploa",B6B="dT";f[(C7Z.p5h+d5h+C7Z.V7+E8h+B6B+C7Z.X3h+E0c)][(m3h+C7Z.i6)][P1B][(y2B+E8h)](a,b,m4h);}
);e[(n5B+C7Z.i6)]((d5h+H5B+C7Z.R4h+f3+C7Z.R4h+l3c+C7Z.V7+Q7c+C7Z.p5h+c0B+C7Z.V7+p7))[(t8h+C7Z.l8h)]((I1B+C7Z.Q6+i8c+C7Z.V7),function(){f[(C7Z.F4h+N8h+X9)](a,b,this[z4h],H,c);}
);return e;}
,B=function(a){setTimeout(function(){var V4h="trigger";a[V4h]((D7+G3c+H6h+C7Z.V7),{editorSet:!l4}
);}
,l4);}
,s=f[(E1+s3+C7Z.i6+h2h+E0c)],i=d[T2h](!l4,{}
,f[(u6B+C7Z.i6+v2B)][(E1+J8c)],{get:function(a){return a[(N4c+C7Z.R4h)][(E4B+C7Z.Q6+E8h)]();}
,set:function(a,b){a[j6c][(E4B+C7Z.Q6+E8h)](b);B(a[(S8B+C7Z.l8h+q0h+m9B)]);}
,enable:function(a){a[(S8B+P6c+C7Z.F4h+C7Z.R4h)][(q0h+B0h+t8h+q0h)]((Z0+N0c),D1h);}
,disable:function(a){a[(F9+g4r+G7h+C7Z.R4h)][(q0h+B0h+B3)](w0h,w5c);}
}
);s[T2]={create:function(a){a[(F9+E4B+C7Z.Q6+E8h)]=a[(E4B+C7Z.Q6+z6h)];return x2c;}
,get:function(a){return a[J3];}
,set:function(a,b){a[(F9+W8)]=b;}
}
;s[f0h]=d[(C7Z.V7+H4+C7Z.l8h+C7Z.i6)](!l4,{}
,i,{create:function(a){a[j6c]=d((q7c+d5h+P6c+C7Z.F4h+C7Z.R4h+P1c))[(T4c+B0h)](d[T2h]({id:f[(E4+C7Z.p5h+G4B+C7Z.i6)](a[(d5h+C7Z.i6)]),type:(o0h+X7),readonly:(B0h+C7Z.V7+X9+d3+R7B)}
,a[h2c]||{}
));return a[j6c][l4];}
}
);s[(C7Z.R4h+n4c)]=d[(C7Z.V7+K4B+o0h+B1c)](!l4,{}
,i,{create:function(a){a[(F9+g4r+q0h+C7Z.F4h+C7Z.R4h)]=d((q7c+d5h+C7Z.l8h+G7h+C7Z.R4h+P1c))[(C7Z.Q6+K7B)](d[T2h]({id:f[(C7Z.c0h+B1+C7Z.V7+r4c)](a[(d5h+C7Z.i6)]),type:(C7Z.R4h+C7Z.V7+K4B+C7Z.R4h)}
,a[(C7Z.U8+C7Z.R4h+B0h)]||{}
));return a[(J4+C7Z.F4h+C7Z.R4h)][l4];}
}
);s[(M6h+Q3B+L2c)]=d[(C7Z.V7+K4B+T5B)](!l4,{}
,i,{create:function(a){var P3="password";a[(F9+d5h+n9)]=d((q7c+d5h+C7Z.l8h+F6h+P1c))[(h2c)](d[(C7Z.V7+X7+C7Z.V7+C7Z.l8h+C7Z.i6)]({id:f[(C7Z.c0h+B1+P7B)](a[(d5h+C7Z.i6)]),type:P3}
,a[h2c]||{}
));return a[(S8B+C7Z.l8h+F6h)][l4];}
}
);s[(C7Z.R4h+C7Z.V7+K4B+I3+B0h+j8h)]=d[(C7Z.V7+X7+Z6+C7Z.i6)](!l4,{}
,i,{create:function(a){var H0c="feId",v7h="<textarea/>";a[j6c]=d(v7h)[h2c](d[T2h]({id:f[(E4+H0c)](a[(d5h+C7Z.i6)])}
,a[(C7Z.Q6+C7Z.R4h+C7Z.R4h+B0h)]||{}
));return a[(F9+g4r+F6h)][l4];}
}
);s[m6B]=d[(n4c+C7Z.V7+C7Z.l8h+C7Z.i6)](!0,{}
,i,{_addOptions:function(a,b){var p9c="irs",B8B="Di",Q3c="sabled",s9h="rDi",C3="placeholderValue",S2="lde",c=a[j6c][0][C0c],e=0;c.length=0;if(a[z9B]!==h){e=e+1;c[0]=new Option(a[(C3h+q3h+N9B+S2+B0h)],a[C3]!==h?a[C3]:"");var d=a[(C3h+C7Z.Q6+n1B+n5h+t8h+S2+s9h+Q3c)]!==h?a[(C3h+P9+C7Z.V7+N9B+E8h+C7Z.i6+C7Z.V7+B0h+B8B+C7Z.c0h+N0c)]:true;c[0][T2]=d;c[0][(C7Z.i6+i9c+K8h+C7Z.V7+C7Z.i6)]=d;}
b&&f[(q0h+C7Z.Q6+p9c)](b,a[(t8h+q0h+C7Z.R4h+B3c+C7Z.l8h+C7Z.c0h+E8+n3+B0h)],function(a,b,d){var d7B="r_va";c[d+e]=new Option(b,a);c[d+e][(F9+R9+d7B+E8h)]=a;}
);}
,create:function(a){var D4="ipOpts",E9h="ptio";a[j6c]=d("<select/>")[(C7Z.U8+m6h)](d[(C7Z.V7+K4B+o0h+B1c)]({id:f[(C7Z.c0h+C7Z.Q6+C7Z.p5h+C7Z.V7+b8+C7Z.i6)](a[n8B]),multiple:a[(I9c+i7B+d5h+q0h+E4h)]===true}
,a[h2c]||{}
));s[m6B][(B3B+C7Z.i6+C7Z.i6+P8+E9h+N2c)](a,a[C0c]||a[D4]);return a[(F9+d5h+C7Z.l8h+q0h+C7Z.F4h+C7Z.R4h)][0];}
,update:function(a,b){var X1h="sele",D1B="_lastSet",c=s[m6B][(H6h+C7Z.D9)](a),e=a[D1B];s[m6B][u5c](a,b);!s[(X1h+i6B)][P1B](a,c,true)&&e&&s[m6B][(C7Z.c0h+C7Z.V7+C7Z.R4h)](a,e,true);}
,get:function(a){var d6c="rator",b=a[(S8B+C7Z.l8h+G7h+C7Z.R4h)][M1c]("option:selected")[z4](function(){return this[(w1B+C7Z.i6+d5h+Q5h+B0h+H2B+o4h)];}
)[(C7Z.R4h+t8h+n4+a2)]();return a[A6B]?a[(C7Z.c0h+O6+C7Z.Q6+d6c)]?b[(C7Z.G2h+t8h+g4r)](a[(w8+M6h+d6c)]):b:b.length?b[0]:null;}
,set:function(a,b,c){var s8c="ato",a0h="separator",z8h="ple";if(!c)a[(F9+k6B+o3+C7Z.R4h)]=b;var b=a[(a0+C7Z.R4h+d5h+z8h)]&&a[a0h]&&!d[q6](b)?b[(C7Z.c0h+C3h+H1c)](a[(w8+N7c+s8c+B0h)]):[b],e,f=b.length,g,h=false,c=a[(S8B+P6c+m9B)][(C7Z.p5h+d5h+C7Z.l8h+C7Z.i6)]("option");a[j6c][(C7Z.p5h+d5h+B1c)]("option")[(C7Z.V7+P9+n5h)](function(){var j0="or_va";g=false;for(e=0;e<f;e++)if(this[(F9+C3B+C7Z.R4h+j0+E8h)]==b[e]){h=g=true;break;}
this[(C7Z.c0h+C7Z.V7+E8h+H8h+W7c)]=g;}
);if(a[z9B]&&!h&&!a[A6B]&&c.length)c[0][a7c]=true;B(a[j6c]);return h;}
}
);s[(D7+n5h+C7Z.V7+D7+j4+t8h+K4B)]=d[(n4c+Z6+C7Z.i6)](!0,{}
,i,{_addOptions:function(a,b){var c=a[(F9+d5h+C7Z.l8h+q0h+m9B)].empty();b&&f[b7B](b,a[u8],function(b,g,h){var S6c="_ed",s2="safe",i8="fe";c[(T8c)]('<div><input id="'+f[(C7Z.c0h+C7Z.Q6+i8+r4c)](a[n8B])+"_"+h+'" type="checkbox" /><label for="'+f[(s2+b8+C7Z.i6)](a[n8B])+"_"+h+(f0)+g+(s3c+E8h+C7Z.Q6+C7Z.w6+s3+f4+C7Z.i6+d5h+E4B+V7c));d("input:last",c)[(C7Z.Q6+C7Z.R4h+C7Z.R4h+B0h)]("value",b)[0][(S6c+d5h+C7Z.R4h+C7Z.N6+F9+W8)]=b;}
);}
,create:function(a){var t3c="ip";a[j6c]=d("<div />");s[a6c][(B3B+Q1h+P8+q0h+C7Z.R4h+d5h+t8h+C7Z.l8h+C7Z.c0h)](a,a[(t8h+q0h+l1c+C7Z.l8h+C7Z.c0h)]||a[(t3c+P8+q0h+C7Z.R4h+C7Z.c0h)]);return a[(v5c+q0h+C7Z.F4h+C7Z.R4h)][0];}
,get:function(a){var p7h="sepa",r7c="eck",b=[];a[(J4+m9B)][(n5B+C7Z.i6)]((d5h+C7Z.l8h+q0h+m9B+F3c+D7+n5h+r7c+n1))[(C7Z.V7+P9+n5h)](function(){var n2B="_editor_val";b[(q0h+y2h)](this[n2B]);}
);return !a[(w8+q0h+C7Z.Q6+B0h+C7Z.Q6+Q5h+B0h)]?b:b.length===1?b[0]:b[(R6+g4r)](a[(p7h+T9h+t8h+B0h)]);}
,set:function(a,b){var C6c="tring",c=a[(F9+g4r+F6h)][(E1+B1c)]((g4r+F6h));!d[q6](b)&&typeof b===(C7Z.c0h+C6c)?b=b[(C7Z.c0h+q0h+E8h+d5h+C7Z.R4h)](a[(C7Z.c0h+O6+C7Z.Q6+T9h+t8h+B0h)]||"|"):d[q6](b)||(b=[b]);var e,f=b.length,g;c[(o6c)](function(){var p4="che";g=false;for(e=0;e<f;e++)if(this[(w1B+V4B+C7Z.R4h+C7Z.N6+F9+E4B+o4h)]==b[e]){g=true;break;}
this[(p4+D7+s2h+C7Z.V7+C7Z.i6)]=g;}
);B(c);}
,enable:function(a){a[(F9+d5h+H5B+C7Z.R4h)][M1c]((d5h+n9))[m5h]((Z0+C7Z.Q6+C7Z.w6+E8h+C7Z.V7+C7Z.i6),false);}
,disable:function(a){a[(F9+s7c+C7Z.F4h+C7Z.R4h)][M1c]((d5h+C7Z.l8h+G7h+C7Z.R4h))[m5h]("disabled",true);}
,update:function(a,b){var u4r="_ad",c=s[a6c],e=c[(j2)](a);c[(u4r+C7Z.i6+P8+q0h+l1c+N2c)](a,b);c[(P1B)](a,e);}
}
);s[O1B]=d[T2h](!0,{}
,i,{_addOptions:function(a,b){var c=a[j6c].empty();b&&f[b7B](b,a[u8],function(b,g,h){var g2B="saf";c[(C7Z.Q6+q0h+i7c)]((L2+u7h+h5+A0h+d3h+C7+U7c+d3h+u7h+Y6c)+f[(g2B+C7Z.V7+b8+C7Z.i6)](a[n8B])+"_"+h+'" type="radio" name="'+a[(N7h+C7Z.V7)]+'" /><label for="'+f[(g2B+P7B)](a[(d5h+C7Z.i6)])+"_"+h+'">'+g+(s3c+E8h+C7Z.Q6+C7Z.w6+C7Z.V7+E8h+f4+C7Z.i6+d5h+E4B+V7c));d((d5h+C7Z.l8h+G7h+C7Z.R4h+F3c+E8h+d8+C7Z.R4h),c)[h2c]("value",b)[0][(w1B+C7Z.i6+d5h+C7Z.R4h+C7Z.N6+F9+E4B+o4h)]=b;}
);}
,create:function(a){var L8="ipOpt";a[j6c]=d((q7c+C7Z.i6+E9c+B9h));s[(O1B)][u5c](a,a[C0c]||a[(L8+C7Z.c0h)]);this[(t8h+C7Z.l8h)]((t8h+I0h+C7Z.l8h),function(){a[(F9+g4r+G7h+C7Z.R4h)][M1c]((d5h+C7Z.l8h+q0h+m9B))[(C7Z.V7+C7Z.Q6+I1B)](function(){var k0h="_preChecked";if(this[k0h])this[a0B]=true;}
);}
);return a[(F9+C2+C7Z.R4h)][0];}
,get:function(a){var T5c="r_";a=a[j6c][M1c]((g4r+G7h+C7Z.R4h+F3c+D7+c4h+D7+s2h+n1));return a.length?a[0][(w1B+C7Z.i6+H1c+t8h+T5c+E4B+o4h)]:h;}
,set:function(a,b){var O7h="ecked";a[j6c][(C7Z.p5h+d5h+B1c)]((g4r+q0h+C7Z.F4h+C7Z.R4h))[o6c](function(){var K3c="hec",f7="cked",t5="_edito",s9B="Ch";this[(I0B+B0h+C7Z.V7+s9B+C7Z.V7+D7+T0+C7Z.i6)]=false;if(this[(t5+B0h+W9c+E8h)]==b)this[(F9+q0h+z5c+s9B+C7Z.V7+f7)]=this[a0B]=true;else this[(F9+q0h+z5c+p7c+K3c+s2h+C7Z.V7+C7Z.i6)]=this[a0B]=false;}
);B(a[j6c][(C7Z.p5h+g4r+C7Z.i6)]((g4r+q0h+m9B+F3c+D7+n5h+O7h)));}
,enable:function(a){var x4c="rop";a[(S8B+C7Z.l8h+q0h+C7Z.F4h+C7Z.R4h)][(M1c)]((g4r+q0h+C7Z.F4h+C7Z.R4h))[(q0h+x4c)]("disabled",false);}
,disable:function(a){a[j6c][(C7Z.p5h+g4r+C7Z.i6)]("input")[(Y4B+t8h+q0h)]((Z0+C7Z.Q6+C7Z.w6+E8h+C7Z.V7+C7Z.i6),true);}
,update:function(a,b){var g0c="alu",Z2B="lte",S0B="ption",Z7B="dO",c=s[O1B],e=c[(H6h+C7Z.V7+C7Z.R4h)](a);c[(F9+C7Z.Q6+C7Z.i6+Z7B+S0B+C7Z.c0h)](a,b);var d=a[j6c][M1c]((C4c));c[(C7Z.c0h+C7Z.D9)](a,d[(E1+Z2B+B0h)]('[value="'+e+'"]').length?e:d[(b7)](0)[h2c]((E4B+g0c+C7Z.V7)));}
}
);s[n8]=d[T2h](!0,{}
,i,{create:function(a){var L9B="Im",u6="teI",c3c="RFC_2822",c4r="cke",u1="dateFormat",y4h="epic",u4B="safeId";a[(F9+s7c+m9B)]=d((q7c+d5h+P6c+m9B+B9h))[(C7Z.Q6+C7Z.R4h+m6h)](d[T2h]({id:f[u4B](a[(n8B)]),type:"text"}
,a[(C7Z.Q6+C7Z.R4h+m6h)]));if(d[(T8+y4h+s2h+C7Z.W7)]){a[j6c][(X9+H8c+c8)]("jqueryui");if(!a[u1])a[u1]=d[(q0B+o0h+F8h+c4r+B0h)][c3c];if(a[(C7Z.i6+C7Z.Q6+u6+f2h+R2)]===h)a[(C7Z.i6+C7Z.Q6+o0h+L9B+R2)]="../../images/calender.png";setTimeout(function(){var D9B="epicker",C3c="dateImage",T4h="oth";d(a[j6c])[(q0B+o0h+q0h+K5B+s2h+C7Z.V7+B0h)](d[T2h]({showOn:(C7Z.w6+T4h),dateFormat:a[(q0B+C7Z.R4h+J1h+t8h+B0h+t0)],buttonImage:a[C3c],buttonImageOnly:true}
,a[L2B]));d((u2c+C7Z.F4h+d5h+A0c+C7Z.i6+C7Z.U8+D9B+A0c+C7Z.i6+d5h+E4B))[Q5B]((V4B+C7Z.c0h+q0h+E8h+C7Z.Q6+C7Z.X3h),(C7Z.l8h+d3+C7Z.V7));}
,10);}
else a[(v5c+F6h)][(C7Z.Q6+C7Z.R4h+m6h)]("type",(C7Z.i6+C7Z.Q6+C7Z.R4h+C7Z.V7));return a[j6c][0];}
,set:function(a,b){var f1h="hange",V5c="cker",m1c="has",y4B="datepicker";d[y4B]&&a[j6c][(n5h+C7Z.Q6+C7Z.c0h+a1B+d8+C7Z.c0h)]((m1c+J6B+o0h+q0h+d5h+V5c))?a[(S8B+C7Z.l8h+G7h+C7Z.R4h)][y4B]((P1B+D5+C7Z.Q6+C7Z.R4h+C7Z.V7),b)[(D7+f1h)]():d(a[j6c])[(E4B+C7Z.Q6+E8h)](b);}
,enable:function(a){d[(C7Z.i6+C7Z.Q6+o0h+F8h+a9B+C7Z.V7+B0h)]?a[(v5c+G7h+C7Z.R4h)][(C7Z.i6+C7Z.Q6+A8c+K5B+x7c)]("enable"):d(a[(v5c+q0h+C7Z.F4h+C7Z.R4h)])[(m5h)]("disabled",false);}
,disable:function(a){d[(n8+F8h+a9B+C7Z.V7+B0h)]?a[j6c][(q0B+A8c+K5B+x7c)]("disable"):d(a[(N4c+C7Z.R4h)])[m5h]("disabled",true);}
,owns:function(a,b){return d(b)[N3h]((C7Z.i6+d5h+E4B+C7Z.I4c+C7Z.F4h+d5h+A0c+C7Z.i6+C7Z.U8+C7Z.V7+q0h+S8c+C7Z.W7)).length||d(b)[N3h]("div.ui-datepicker-header").length?true:false;}
}
);s[(C7Z.i6+C7Z.U8+C7Z.V7+C7Z.R4h+d5h+Y8B)]=d[(C7Z.V7+X7+Z6+C7Z.i6)](!l4,{}
,i,{create:function(a){var O1="pic",s4c="tex",I5c="feI";a[(S8B+C7Z.l8h+q0h+m9B)]=d((q7c+d5h+C7Z.l8h+q0h+C7Z.F4h+C7Z.R4h+B9h))[h2c](d[(C7Z.V7+X7+C7Z.V7+C7Z.l8h+C7Z.i6)](w5c,{id:f[(C7Z.c0h+C7Z.Q6+I5c+C7Z.i6)](a[(n8B)]),type:(s4c+C7Z.R4h)}
,a[h2c]));a[(F9+O1+x7c)]=new f[z8B](a[j6c],d[T2h]({format:a[(S4r+C7Z.Q6+C7Z.R4h)],i18n:this[R8h][(C7Z.i6+C7Z.Q6+C7Z.R4h+x1B+f2h+C7Z.V7)]}
,a[L2B]));return a[(F9+d5h+C7Z.l8h+G7h+C7Z.R4h)][l4];}
,set:function(a,b){a[(F9+q0h+h7B)][W8](b);B(a[(J4+C7Z.F4h+C7Z.R4h)]);}
,owns:function(a,b){a[l9h][(i7+N2c)](b);}
,destroy:function(a){var V5="stroy";a[(I0B+h7B)][(C7Z.i6+C7Z.V7+V5)]();}
,minDate:function(a,b){a[l9h][(Q0B+C7Z.l8h)](b);}
,maxDate:function(a,b){var F6c="_pick";a[(F6c+C7Z.W7)][(f2h+C7Z.Q6+K4B)](b);}
}
);s[(g5B+E8h+t8h+C7Z.Q6+C7Z.i6)]=d[(C7Z.V7+K4B+T5B)](!l4,{}
,i,{create:function(a){var b=this;return L(b,a,function(c){f[k2h][(g5B+E8h+S0+C7Z.i6)][P1B][(D7+F1c)](b,a,c[l4]);}
);}
,get:function(a){return a[(W9c+E8h)];}
,set:function(a,b){var L7h="ploa",P9h="triggerHandler",e1c="oC",s7="noC",o4c="clearText",L3B="noFileText";a[(H2B+o4h)]=b;var c=a[(S8B+C7Z.l8h+F6h)];if(a[U8B]){var d=c[(E1+C7Z.l8h+C7Z.i6)](k6c);a[J3]?d[(n5h+t2h+E8h)](a[(U8B)](a[(F9+R3B+E8h)])):d.empty()[T8c]((q7c+C7Z.c0h+q0h+C7Z.Q6+C7Z.l8h+V7c)+(a[L3B]||(e0+t8h+p7B+C7Z.p5h+d5h+E8h+C7Z.V7))+(s3c+C7Z.c0h+q0h+o4+V7c));}
d=c[(E1+B1c)](f4h);if(b&&a[o4c]){d[N4h](a[o4c]);c[(z5c+u6B+E4B+C7Z.V7+t8+C7Z.c0h)]((s7+T));}
else c[(C7Z.Q6+C7Z.i6+Q4c+q7B+C7Z.c0h)]((C7Z.l8h+e1c+E8h+j8h+B0h));a[j6c][(C7Z.p5h+d5h+B1c)](C4c)[P9h]((C7Z.F4h+L7h+C7Z.i6+C7Z.I4c+C7Z.V7+V4B+C7Z.R4h+C7Z.N6),[a[J3]]);}
,enable:function(a){a[j6c][(M1c)]((d5h+C7Z.l8h+q0h+C7Z.F4h+C7Z.R4h))[m5h](w0h,D1h);a[(F9+Z6+C7Z.Q6+h7c+C7Z.V7+C7Z.i6)]=w5c;}
,disable:function(a){var y0c="nabl",k4="disab";a[(S8B+n9)][(E1+B1c)]((g4r+G7h+C7Z.R4h))[m5h]((k4+E8h+n1),w5c);a[(F9+C7Z.V7+y0c+C7Z.V7+C7Z.i6)]=D1h;}
}
);s[(K2c+X9+R0+t3h)]=d[T2h](!0,{}
,i,{create:function(a){var b=this,c=L(b,a,function(c){var G7B="loadM",v3B="onc";a[J3]=a[(F9+E4B+C7Z.Q6+E8h)][(D7+v3B+C7Z.U8)](c);f[k2h][(g5B+G7B+C7Z.Q6+C7Z.l8h+C7Z.X3h)][(P1B)][(K2h)](b,a,a[(F9+W8)]);}
);c[(W6B)]((f2h+t6B+r8h))[d3]("click",(C7Z.w6+C7Z.F4h+C7Z.R4h+C7Z.R4h+d3+C7Z.I4c+B0h+d6+t8h+A1B),function(c){var x0="Many",V3="ldT",W2="lic",T9B="stopPro";c[(T9B+P2c+C7Z.Q6+r8h+d3)]();c=d(this).data("idx");a[J3][(b6+W2+C7Z.V7)](c,1);f[(C7Z.p5h+Z8B+V3+C7Z.X3h+q0h+u9)][(g5B+E8h+S0+C7Z.i6+x0)][(w8+C7Z.R4h)][K2h](b,a,a[J3]);}
);return c;}
,get:function(a){return a[J3];}
,set:function(a,b){var G8c="dler",Q="rHa",Y0c="igg",h8c="No",Z9B="leText",u2B="ppend",A8h="Uplo";b||(b=[]);if(!d[(d5h+C7Z.c0h+J9c+B0h+B0h+C7Z.Q6+C7Z.X3h)](b))throw (A8h+X9+p7B+D7+t8h+I5h+D7+C7Z.R4h+B3c+N2c+p7B+f2h+C7Z.F4h+X6+p7B+n5h+C7Z.Q6+E4B+C7Z.V7+p7B+C7Z.Q6+C7Z.l8h+p7B+C7Z.Q6+A1c+l5+p7B+C7Z.Q6+C7Z.c0h+p7B+C7Z.Q6+p7B+E4B+C7Z.Q6+R9B+C7Z.V7);a[(W9c+E8h)]=b;var c=this,e=a[j6c];if(a[(V4B+b6+E8h+C7Z.Q6+C7Z.X3h)]){e=e[(M1c)]("div.rendered").empty();if(b.length){var f=d("<ul/>")[e5B](e);d[(o6c)](b,function(b,d){var E5='me',H0B='ove',M1B="ses",c8c=' <';f[(L4+q0h+Z6+C7Z.i6)]("<li>"+a[U8B](d,b)+(c8c+n9h+o1+I6B+U7c+B7h+y6B+e4B+Y6c)+c[(D7+q7B+M1B)][(C7Z.p5h+C7Z.N6+f2h)][G6]+(U7c+U1B+I6h+C1h+H0B+w8B+u7h+v8+Z9h+b0+d3h+u7h+l7B+Y6c)+b+(I1+f4c+d3h+E5+r1B+n6c+n9h+l4c+u7c+g1h+m1+n3h+d3h+J7));}
);}
else e[(C7Z.Q6+u2B)]((q7c+C7Z.c0h+q0h+o4+V7c)+(a[(C7Z.l8h+t8h+Q5+d5h+Z9B)]||(h8c+p7B+C7Z.p5h+d5h+C7Z.F0c))+(s3c+C7Z.c0h+q0h+C7Z.Q6+C7Z.l8h+V7c));}
a[j6c][M1c]((d5h+P6c+m9B))[(m6h+Y0c+C7Z.V7+Q+C7Z.l8h+G8c)]((C7Z.F4h+q0h+E2c+C7Z.i6+C7Z.I4c+C7Z.V7+A0+t8h+B0h),[a[(W9c+E8h)]]);}
,enable:function(a){a[(S8B+C7Z.l8h+q0h+m9B)][(C7Z.p5h+d5h+B1c)]("input")[(Y4B+B3)]((C7Z.i6+d5h+P9c+C7Z.V7+C7Z.i6),false);a[(F9+Z6+C7Z.Q6+C7Z.w6+i2h)]=true;}
,disable:function(a){var b1c="bled",G9="_ena";a[j6c][M1c]((d5h+H5B+C7Z.R4h))[m5h]("disabled",true);a[(G9+b1c)]=false;}
}
);t[(C7Z.V7+X7)][r2h]&&d[(C7Z.V7+K4B+T5B)](f[(J6c+P4h+N7+C7Z.c0h)],t[n4c][(n1+l8+d0c+C7Z.i6+C7Z.c0h)]);t[(n4c)][r2h]=f[k2h];f[(C7Z.p5h+c0B+u9)]={}
;f.prototype.CLASS=(O9B);f[(E4B+C7Z.V7+j5c+C7Z.l8h)]=P4B;return f;}
);

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to TableTools so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = "<h3>"+i18nDefaults.create.title+"</h3>";
i18nDefaults.edit.title = "<h3>"+i18nDefaults.edit.title+"</h3>";
i18nDefaults.remove.title = "<h3>"+i18nDefaults.remove.title+"</h3>";

var tt = DataTable.TableTools;
if ( tt ) {
	tt.BUTTONS.editor_create.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_edit.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_remove.formButtons[0].className = "btn btn-danger";
}


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn btn-default"
	},
	"field": {
		"wrapper": "DTE_Field",
		"label":   "col-lg-4 control-label",
		"input":   "col-lg-8 controls",
		"error":   "error has-error",
		"msg-labelInfo": "help-block",
		"msg-info":      "help-block",
		"msg-message":   "help-block",
		"msg-error":     "help-block",
		"multiValue":    "well well-sm multi-value",
		"multiInfo":     "small",
		"multiRestore":  "well well-sm multi-restore"
	}
} );


/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

var self;

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		self._dom.content = $(
			'<div class="modal fade">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content"/>'+
				'</div>'+
			'</div>'
		);
		self._dom.close = $('<button class="close">&times;</div>');

		self._dom.close.click( function () {
			self._dte.close('icon');
		} );

		$(document).on('click', 'div.modal', function (e) {
			if ( $(e.target).hasClass('modal') && self._shown ) {
				self._dte.background();
			}
		} );

		dte.on( 'open.dtebs', function ( e, type ) {
			if ( type === 'inline' || type === 'bubble' ) {
				$('div.DTE input[type=text], div.DTE select, div.DTE textarea').addClass( 'form-control' );
			}
		} );

		return self;
	},

	"open": function ( dte, append, callback ) {
		if ( self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		self._dte = dte;
		self._shown = true;

		var content = self._dom.content.find('div.modal-content');
		content.children().detach();
		content.append( append );

		$('div.modal-header', append).prepend( self._dom.close );

		$(self._dom.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( self._dte.s.setFocus ) {
					self._dte.s.setFocus.focus();
				}

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				self._shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				"backdrop": "static"
			} );

		$('input:not([type=checkbox]):not([type=radio]), select, textarea', self._dom.content)
			.addClass( 'form-control' );
	},

	"close": function ( dte, callback ) {
		if ( !self._shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		$(self._dom.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		self._dte = dte;
		self._shown = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return self._dom.content[0];
	},


	/*
	 * Private properties
	 */
	 "_shown": false,
	"_dte": null,
	"_dom": {}
} );

self = DataTable.Editor.display.bootstrap;


return DataTable.Editor;
}));


/*! Responsive 2.0.0
 * 2014-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     2.0.0
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014-2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.3+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function ( settings, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.3' ) ) {
		throw 'DataTables Responsive requires DataTables 1.10.3 or newer';
	}

	this.s = {
		dt: new DataTable.Api( settings ),
		columns: [],
		current: []
	};

	// Check if responsive has already been initialised on this table
	if ( this.s.dt.settings()[0].responsive ) {
		return;
	}

	// details is an object, but for simplicity the user can give it as a string
	if ( opts && typeof opts.details === 'string' ) {
		opts.details = { type: opts.details };
	}

	this.c = $.extend( true, {}, Responsive.defaults, DataTable.defaults.responsive, opts );
	settings.responsive = this;
	this._constructor();
};

$.extend( Responsive.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtPrivateSettings = dt.settings()[0];

		dt.settings()[0]._responsive = this;

		// Use DataTables' throttle function to avoid processor thrashing on
		// resize
		$(window).on( 'resize.dtr orientationchange.dtr', DataTable.util.throttle( function () {
			that._resize();
		} ) );

		// DataTables doesn't currently trigger an event when a row is added, so
		// we need to hook into its private API to enforce the hidden rows when
		// new data is added
		dtPrivateSettings.oApi._fnCallbackReg( dtPrivateSettings, 'aoRowCreatedCallback', function (tr, data, idx) {
			if ( $.inArray( false, that.s.current ) !== -1 ) {
				$('td, th', tr).each( function ( i ) {
					var idx = dt.column.index( 'toData', i );

					if ( that.s.current[idx] === false ) {
						$(this).css('display', 'none');
					}
				} );
			}
		} );

		// Destroy event handler
		dt.on( 'destroy.dtr', function () {
			dt.off( '.dtr' );
			$( dt.table().body() ).off( '.dtr' );
			$(window).off( 'resize.dtr orientationchange.dtr' );

			// Restore the columns that we've hidden
			$.each( that.s.current, function ( i, val ) {
				if ( val === false ) {
					that._setColumnVis( i, true );
				}
			} );
		} );

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort( function (a, b) {
			return a.width < b.width ? 1 :
				a.width > b.width ? -1 : 0;
		} );

		this._classLogic();
		this._resizeAuto();

		// Details handler
		var details = this.c.details;
		if ( details.type !== false ) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on( 'column-visibility.dtr', function (e, ctx, col, vis) {
				that._classLogic();
				that._resizeAuto();
				that._resize();
			} );

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on( 'draw.dtr', function () {
				that._redrawChildren();
			} );

			$(dt.table().node()).addClass( 'dtr-'+details.type );
		}

		dt.on( 'column-reorder.dtr', function (e, settings, details) {
			// This requires ColReorder 1.2.1 or newer
			if ( details.drop ) {
				that._classLogic();
				that._resizeAuto();
				that._resize();
			}
		} );

		// First pass - draw the table for the current viewport size
		this._resize();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisiblity: function ( breakpoint )
	{
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, ien;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map( function ( col, idx ) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			} )
			.sort( function ( a, b ) {
				if ( a.priority !== b.priority ) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			} );


		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map( columns, function ( col ) {
			return col.auto && col.minWidth === null ?
				false :
				col.auto === true ?
					'-' :
					$.inArray( breakpoint, col.includeIn ) !== -1;
		} );

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( display[i] === true ) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].oScroll;
		var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for ( i=0, ien=order.length ; i<ien ; i++ ) {
			var colIdx = order[i].columnIdx;

			if ( display[colIdx] === '-' && ! columns[colIdx].control && columns[colIdx].minWidth ) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if ( empty || usedWidth - columns[colIdx].minWidth < 0 ) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( ! columns[i].control && ! columns[i].never && ! display[i] ) {
				showControl = true;
				break;
			}
		}

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				display[i] = showControl;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if ( $.inArray( true, display ) === -1 ) {
			display[0] = true;
		}

		return display;
	},


	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function ()
	{
		var that = this;
		var calc = {};
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns = dt.columns().eq(0).map( function (i) {
			var column = this.column(i);
			var className = column.header().className;
			var priority = dt.settings()[0].aoColumns[i].responsivePriority;

			if ( priority === undefined ) {
				priority = $(column.header).data('priority') !== undefined ?
					$(column.header).data('priority') * 1 :
					10000;
			}

			return {
				className: className,
				includeIn: [],
				auto:      false,
				control:   false,
				never:     className.match(/\bnever\b/) ? true : false,
				priority:  priority
			};
		} );

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function ( colIdx, name ) {
			var includeIn = columns[ colIdx ].includeIn;

			if ( $.inArray( name, includeIn ) === -1 ) {
				includeIn.push( name );
			}
		};

		var column = function ( colIdx, name, operator, matched ) {
			var size, i, ien;

			if ( ! operator ) {
				columns[ colIdx ].includeIn.push( name );
			}
			else if ( operator === 'max-' ) {
				// Add this breakpoint and all smaller
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width <= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'min-' ) {
				// Add this breakpoint and all larger
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width >= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'not-' ) {
				// Add all but this breakpoint
				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].name.indexOf( matched ) === -1 ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each( function ( col, i ) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for ( var k=0, ken=classNames.length ; k<ken ; k++ ) {
				var className = $.trim( classNames[k] );

				if ( className === 'all' ) {
					// Include in all
					hasClass = true;
					col.includeIn = $.map( breakpoints, function (a) {
						return a.name;
					} );
					return;
				}
				else if ( className === 'none' || col.never ) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if ( className === 'control' ) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each( breakpoints, function ( j, breakpoint ) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp( '(min\\-|max\\-|not\\-)?('+brokenPoint[0]+')(\\-[_a-zA-Z0-9])?' );
					var match = className.match( re );

					if ( match ) {
						hasClass = true;

						if ( match[2] === brokenPoint[0] && match[3] === '-'+brokenPoint[1] ) {
							// Class name matches breakpoint name fully
							column( i, breakpoint.name, match[1], match[2]+match[3] );
						}
						else if ( match[2] === brokenPoint[0] && ! match[3] ) {
							// Class name matched primary breakpoint name with no qualifier
							column( i, breakpoint.name, match[1], match[2] );
						}
					}
				} );
			}

			// If there was no control class, then automatic sizing is used
			if ( ! hasClass ) {
				col.auto = true;
			}
		} );

		this.s.columns = columns;
	},


	/**
	 * Show the details for the child row
	 *
	 * @param  {DataTables.Api} row    API instance for the row
	 * @param  {boolean}        update Update flag
	 * @private
	 */
	_detailsDisplay: function ( row, update )
	{
		var that = this;
		var dt = this.s.dt;

		var res = this.c.details.display( row, update, function () {
			return that.c.details.renderer(
				dt, row[0], that._detailsObj(row[0])
			);
		} );

		if ( res === true || res === false ) {
			$(dt.table().node()).triggerHandler( 'responsive-display.dt', [dt, row, res, update] );
		}
	},


	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function ()
	{
		var that    = this;
		var dt      = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if ( details.type === 'inline' ) {
			details.target = 'td:first-child';
		}

		// Keyboard accessibility
		dt.on( 'draw.dtr', function () {
			that._tabIndexes();
		} );
		that._tabIndexes(); // Initial draw has already happened

		$( dt.table().body() ).on( 'keyup.dtr', 'td', function (e) {
			if ( e.keyCode === 13 && $(this).data('dtr-keyboard') ) {
				$(this).click();
			}
		} );

		// type.target can be a string jQuery selector or a column index
		var target   = details.target;
		var selector = typeof target === 'string' ? target : 'td';

		// Click handler to show / hide the details rows when they are available
		$( dt.table().body() )
			.on( 'mousedown.dtr', selector, function (e) {
				// For mouse users, prevent the focus ring from showing
				e.preventDefault();
			} )
			.on( 'click.dtr', selector, function () {
				// If the table is not collapsed (i.e. there is no hidden columns)
				// then take no action
				if ( ! $(dt.table().node()).hasClass('collapsed' ) ) {
					return;
				}

				// Check that the row is actually a DataTable's controlled node
				if ( ! dt.row( $(this).closest('tr') ).length ) {
					return;
				}

				// For column index, we determine if we should act or not in the
				// handler - otherwise it is already okay
				if ( typeof target === 'number' ) {
					var targetIdx = target < 0 ?
						dt.columns().eq(0).length + target :
						target;

					if ( dt.cell( this ).index().column !== targetIdx ) {
						return;
					}
				}

				// $().closest() includes itself in its check
				var row = dt.row( $(this).closest('tr') );

				// The renderer is given as a function so the caller can execute it
				// only when they need (i.e. if hiding there is no point is running
				// the renderer)
				that._detailsDisplay( row, false );
			} );
	},


	/**
	 * Get the details to pass to a renderer for a row
	 * @param  {int} rowIdx Row index
	 * @private
	 */
	_detailsObj: function ( rowIdx )
	{
		var that = this;
		var dt = this.s.dt;

		return $.map( this.s.columns, function( col, i ) {
			if ( col.never ) {
				return;
			}

			return {
				title:   dt.settings()[0].aoColumns[ i ].sTitle,
				data:    dt.cell( rowIdx, i ).render( that.c.orthogonal ),
				hidden:  dt.column( i ).visible() && !that.s.current[ i ]
			};
		} );
	},


	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 * @private
	 */
	_find: function ( name )
	{
		var breakpoints = this.c.breakpoints;

		for ( var i=0, ien=breakpoints.length ; i<ien ; i++ ) {
			if ( breakpoints[i].name === name ) {
				return breakpoints[i];
			}
		}
	},


	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 *
	 * @private
	 */
	_redrawChildren: function ()
	{
		var that = this;
		var dt = this.s.dt;

		dt.rows( {page: 'current'} ).iterator( 'row', function ( settings, idx ) {
			var row = dt.row( idx );

			that._detailsDisplay( dt.row( idx ), true );
		} );
	},


	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @private
	 */
	_resize: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var width = $(window).width();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, ien;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for ( i=breakpoints.length-1 ; i>=0 ; i-- ) {
			if ( width <= breakpoints[i].width ) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}
		
		// Show the columns for that break point
		var columnsVis = this._columnsVisiblity( breakpoint );
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columnsVis[i] === false && ! columns[i].never ) {
				collapsedClass = true;
				break;
			}
		}

		$( dt.table().node() ).toggleClass( 'collapsed', collapsedClass );

		var changed = false;

		dt.columns().eq(0).each( function ( colIdx, i ) {
			if ( columnsVis[i] !== oldVis[i] ) {
				changed = true;
				that._setColumnVis( colIdx, columnsVis[i] );
			}
		} );

		if ( changed ) {
			this._redrawChildren();
		}
	},


	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function ()
	{
		var dt = this.s.dt;
		var columns = this.s.columns;

		// Are we allowed to do auto sizing?
		if ( ! this.c.auto ) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if ( $.inArray( true, $.map( columns, function (c) { return c.auto; } ) ) === -1 ) {
			return;
		}

		// Clone the table with the current data in it
		var tableWidth   = dt.table().node().offsetWidth;
		var columnWidths = dt.columns;
		var clonedTable  = dt.table().node().cloneNode( false );
		var clonedHeader = $( dt.table().header().cloneNode( false ) ).appendTo( clonedTable );
		var clonedBody   = $( dt.table().body().cloneNode( false ) ).appendTo( clonedTable );

		// Header
		var headerCells = dt.columns()
			.header()
			.filter( function (idx) {
				return dt.column(idx).visible();
			} )
			.to$()
			.clone( false )
			.css( 'display', 'table-cell' );

		// Body rows - we don't need to take account of DataTables' column
		// visibility since we implement our own here (hence the `display` set)
		$(clonedBody)
			.append( $(dt.rows( { page: 'current' } ).nodes()).clone( false ) )
			.find( 'th, td' ).css( 'display', '' );

		// Footer
		var footer = dt.table().footer();
		if ( footer ) {
			var clonedFooter = $( footer.cloneNode( false ) ).appendTo( clonedTable );
			var footerCells = dt.columns()
				.header()
				.filter( function (idx) {
					return dt.column(idx).visible();
				} )
				.to$()
				.clone( false )
				.css( 'display', 'table-cell' );

			$('<tr/>')
				.append( footerCells )
				.appendTo( clonedFooter );
		}

		$('<tr/>')
			.append( headerCells )
			.appendTo( clonedHeader );

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if ( this.c.details.type === 'inline' ) {
			$(clonedTable).addClass( 'dtr-inline collapsed' );
		}

		var inserted = $('<div/>')
			.css( {
				width: 1,
				height: 1,
				overflow: 'hidden'
			} )
			.append( clonedTable );

		inserted.insertBefore( dt.table().node() );

		// The cloned header now contains the smallest that each column can be
		headerCells.each( function (i) {
			var idx = dt.column.index( 'fromVisible', i );
			columns[ idx ].minWidth =  this.offsetWidth || 0;
		} );

		inserted.remove();
	},

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param {integer} col      Column index
	 * @param {boolean} showHide Show or hide (true or false)
	 * @private
	 */
	_setColumnVis: function ( col, showHide )
	{
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		$( dt.column( col ).header() ).css( 'display', display );
		$( dt.column( col ).footer() ).css( 'display', display );
		dt.column( col ).nodes().to$().css( 'display', display );
	},


	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 *
	 * @private
	 */
	_tabIndexes: function ()
	{
		var dt = this.s.dt;
		var cells = dt.cells( { page: 'current' } ).nodes().to$();
		var ctx = dt.settings()[0];
		var target = this.c.details.target;

		cells.filter( '[data-dtr-keyboard]' ).removeData( '[data-dtr-keyboard]' );

		var selector = typeof target === 'number' ?
			':eq('+target+')' :
			target;

		$( selector, dt.rows( { page: 'current' } ).nodes() )
			.attr( 'tabIndex', ctx.iTabIndex )
			.data( 'dtr-keyboard', 1 );
	}
} );


/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop',  width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.display = {
	childRow: function ( row, update, render ) {
		if ( update ) {
			if ( $(row.node()).hasClass('parent') ) {
				row.child( render(), 'child' ).show();

				return true;
			}
		}
		else {
			if ( ! row.child.isShown()  ) {
				row.child( render(), 'child' ).show();
				$( row.node() ).addClass( 'parent' );

				return true;
			}
			else {
				row.child( false );
				$( row.node() ).removeClass( 'parent' );

				return false;
			}
		}
	},

	childRowImmediate: function ( row, update, render ) {
		if ( (! update && row.child.isShown()) || ! row.responsive.hasHidden() ) {
			// User interaction and the row is show, or nothing to show
			row.child( false );
			$( row.node() ).removeClass( 'parent' );

			return false;
		}
		else {
			// Display
			row.child( render(), 'child' ).show();
			$( row.node() ).addClass( 'parent' );

			return true;
		}
	},

	// This is a wrapper so the modal options for Bootstrap and jQuery UI can
	// have options passed into them. This specific one doesn't need to be a
	// function but it is for consistency in the `modal` name
	modal: function ( options ) {
		return function ( row, update, render ) {
			if ( ! update ) {
				// Show a modal
				var close = function () {
					modal.remove(); // will tidy events for us
					$(document).off( 'keypress.dtr' );
				};

				var modal = $('<div class="dtr-modal"/>')
					.append( $('<div class="dtr-modal-display"/>')
						.append( $('<div class="dtr-modal-content"/>')
							.append( render() )
						)
						.append( $('<div class="dtr-modal-close">&times;</div>' )
							.click( function () {
								close();
							} )
						)
					)
					.append( $('<div class="dtr-modal-background"/>')
						.click( function () {
							close();
						} )
					)
					.appendTo( 'body' );

				if ( options && options.header ) {
					modal.find( 'div.dtr-modal-content' ).prepend(
						'<h2>'+options.header( row )+'</h2>'
					);
				}

				$(document).on( 'keyup.dtr', function (e) {
					if ( e.keyCode === 27 ) {
						e.stopPropagation();

						close();
					}
				} );
			}
			else {
				$('div.dtr-modal-content')
					.empty()
					.append( render() );
			}
		};
	}
};


/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `display` - A function that is used to show and hide the hidden details
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		display: Responsive.display.childRow,

		renderer: function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col, i ) {
				return col.hidden ?
					'<li data-dtr-index="'+i+'">'+
						'<span class="dtr-title">'+
							col.title+
						'</span> '+
						'<span class="dtr-data">'+
							col.data+
						'</span>'+
					'</li>' :
					'';
			} ).join('');

			return data ?
				$('<ul data-dtr-index="'+rowIdx+'"/>').append( data ) :
				false;
		},

		target: 0,

		type: 'inline'
	},

	/**
	 * Orthogonal data request option. This is used to define the data type
	 * requested when Responsive gets the data to show in the child row.
	 *
	 * @type {String}
	 */
	orthogonal: 'display'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'responsive()', function () {
	return this;
} );

Api.register( 'responsive.index()', function ( li ) {
	li = $(li);

	return {
		column: li.data('dtr-index'),
		row:    li.parent().data('dtr-index')
	};
} );

Api.register( 'responsive.rebuild()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._classLogic();
		}
	} );
} );

Api.register( 'responsive.recalc()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	} );
} );

Api.register( 'responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive ?
		$.inArray( false, ctx._responsive.s.current ) !== -1 :
		false;
} );


/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '2.0.0';


$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( $(settings.nTable).hasClass( 'responsive' ) ||
		 $(settings.nTable).hasClass( 'dt-responsive' ) ||
		 settings.oInit.responsive ||
		 DataTable.defaults.responsive
	) {
		var init = settings.oInit.responsive;

		if ( init !== false ) {
			new Responsive( settings, $.isPlainObject( init ) ? init : {}  );
		}
	}
} );


return Responsive;
}));


/*! Select for DataTables 1.1.0
 * 2015 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.1.0
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};
DataTable.select.version = '1.1.0';

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item 
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().body() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var body = $( dt.table().body() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	body
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey ) {
				body
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}
		} )
		.on( 'mouseup.dtSelect', selector, function(e) {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			body.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			var ctx = dt.settings()[0];

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('tbody')[0] != body[0] ) {
				return;
			}

			var cell = $(e.target).closest('td, th');
			var cellIndex = dt.cell( cell ).index();

			// Check the cell actually belongs to the host DataTable (so child rows,
			// etc, are ignored)
			if ( ! dt.cell( cell ).any() ) {
				return;
			}

			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = dt.cell( cell ).index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = dt.cell( cell ).index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect', function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	args.unshift( api );

	$(api.table().node()).triggerHandler( type+'.dt', args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	var output  = $('<span class="select-info"/>');
	var add = function ( name, num ) {
		output.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	add( 'row',    api.rows( { selected: true } ).flatten().length );
	add( 'column', api.columns( { selected: true } ).flatten().length );
	add( 'cell',   api.cells( { selected: true } ).flatten().length );

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected === undefined ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
				 (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
			 (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		init: function ( dt, button, config ) {
			var that = this;

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var enable = that.rows( { selected: true } ).any() ||
				             that.columns( { selected: true } ).any() ||
				             that.cells( { selected: true } ).any();

				that.enable( enable );
			} );

			this.disable();
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt, button, config ) {
			var that = this;

			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt, button, config ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API
$(document).on( 'preInit.dt.dtSelect', function (e, ctx, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = ctx.oInit.select || DataTable.defaults.select;
	var dt = new DataTable.Api( ctx );

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.info( info );
	ctx._select.className = className;

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
} );


return DataTable.select;
}));


