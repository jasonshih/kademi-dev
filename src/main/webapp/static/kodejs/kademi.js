/* 
 *       Copyright FuseLMS
 */

/*
 * Kademi Core
 */
(function (exports) {
    var arr = [];

    var slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var support = {};

    var Kademi = {fn: {}};

    var
            version = "0.0.1",
            // Support: Android<4.1
            // Make sure we trim BOM and NBSP
            rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            // Matches dashed string for camelizing
            rmsPrefix = /^-ms-/,
            rdashAlpha = /-([\da-z])/gi,
            // Used by Kademi.camelCase as callback to replace()
            fcamelCase = function (all, letter) {
                return letter.toUpperCase();
            };

    Kademi.extend = Kademi.fn.extend = function () {
        var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !Kademi.isFunction(target)) {
            target = {};
        }

        // Extend Kademi itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[ i ]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (Kademi.isPlainObject(copy) || (copyIsArray = Kademi.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Kademi.isArray(src) ? src : [];

                        } else {
                            clone = src && Kademi.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = Kademi.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    Kademi.extend({
        // Unique for each copy of Kademi on the page
        expando: "Kademi" + (version + Math.random()).replace(/\D/g, ""),
        // Assume Kademi is ready without the ready module
        isReady: true,
        error: function (msg) {
            throw new Error(msg);
        },
        noop: function () {},
        isFunction: function (obj) {
            return Kademi.type(obj) === "function";
        },
        isArray: Array.isArray,
        isWindow: function (obj) {
            return obj != null && obj === obj.window;
        },
        isNumeric: function (obj) {
            // parseFloat NaNs numeric-cast false positives (null|true|false|"")
            // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
            // subtraction forces infinities to NaN
            // adding 1 corrects loss of precision from parseFloat (#15100)
            return !Kademi.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
        },
        isPlainObject: function (obj) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if (Kademi.type(obj) !== "object" || obj.nodeType || Kademi.isWindow(obj)) {
                return false;
            }

            if (obj.constructor &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }

            // If the function hasn't returned already, we're confident that
            // |obj| is a plain object, created by {} or constructed with new Object
            return true;
        },
        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        type: function (obj) {
            if (obj == null) {
                return obj + "";
            }
            // Support: Android<4.0, iOS<6 (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ?
                    class2type[ toString.call(obj) ] || "object" :
                    typeof obj;
        },
        typeOf: function (o) {
            var undef;

            if (o === undef) {
                return 'undefined';
            } else if (o === null) {
                return 'null';
            } else if (o.nodeType) {
                return 'node';
            }

            return ({}).toString.call(o).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
        },
        // Convert dashed to camelCase; data modules
        camelCase: function (string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        // args is for internal usage only
        each: function (obj, callback, args) {
            var value,
                    i = 0,
                    length = obj.length,
                    isArray = isArraylike(obj);

            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[ i ], args);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[ i ], args);

                        if (value === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[ i ], i, obj[ i ]);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[ i ], i, obj[ i ]);

                        if (value === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },
        // Support: Android<4.1
        trim: function (text) {
            return text == null ?
                    "" :
                    (text + "").replace(rtrim, "");
        },
        // results is for internal usage only
        makeArray: function (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    Kademi.merge(ret,
                            typeof arr === "string" ?
                            [arr] : arr
                            );
                } else {
                    push.call(ret, arr);
                }
            }

            return ret;
        },
        inArray: function (elem, arr, i) {
            return arr == null ? -1 : indexOf.call(arr, elem, i);
        },
        merge: function (first, second) {
            var len = +second.length,
                    j = 0,
                    i = first.length;

            for (; j < len; j++) {
                first[ i++ ] = second[ j ];
            }

            first.length = i;

            return first;
        },
        grep: function (elems, callback, invert) {
            var callbackInverse,
                    matches = [],
                    i = 0,
                    length = elems.length,
                    callbackExpect = !invert;

            // Go through the array, only saving the items
            // that pass the validator function
            for (; i < length; i++) {
                callbackInverse = !callback(elems[ i ], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[ i ]);
                }
            }

            return matches;
        },
        // arg is for internal usage only
        map: function (elems, callback, arg) {
            var value,
                    i = 0,
                    length = elems.length,
                    isArray = isArraylike(elems),
                    ret = [];

            // Go through the array, translating each of the items to their new values
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[ i ], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }

                // Go through every key on the object,
            } else {
                for (i in elems) {
                    value = callback(elems[ i ], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }
            }

            // Flatten any nested arrays
            return concat.apply([], ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function (fn, context) {
            var tmp, args, proxy;

            if (typeof context === "string") {
                tmp = fn[ context ];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!Kademi.isFunction(fn)) {
                return undefined;
            }

            // Simulated bind
            args = slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || Kademi.guid++;

            return proxy;
        },
        now: Date.now
    });

    // Populate the class2type map
    Kademi.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });

    function isArraylike(obj) {

        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = "length" in obj && obj.length,
                type = Kademi.type(obj);

        if (type === "function" || Kademi.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    var nonce = Kademi.now();

    var rquery = (/\?/);

    Kademi.parseJSON = function (data) {
        return JSON.parse(data + "");
    };

    Kademi.parseXML = function (data) {
        var xml;
        if (!data || typeof data !== "string") {
            return null;
        }

        // Support: IE9
        try {
            xml = fileManager.parseDOM(data);
        } catch (e) {
            xml = undefined;
        }

        if (!xml || xml.getElementsByTagName("parsererror").length) {
            Kademi.error("Invalid XML: " + data);
        }
        return xml;
    };

    Kademi.error = function (msg) {
        throw new Error("Syntax error, unrecognized expression: " + msg);
    };

    var rnotwhite = (/\S+/g);



// String to Object options format cache
    var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions(options) {
        var object = optionsCache[ options ] = {};
        Kademi.each(options.match(rnotwhite) || [], function (_, flag) {
            object[ flag ] = true;
        });
        return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    Kademi.Callbacks = function (options) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
                (optionsCache[ options ] || createOptions(options)) :
                Kademi.extend({}, options);

        var // Last fire value (for non-forgettable lists)
                memory,
                // Flag to know if list was already fired
                fired,
                // Flag to know if list is currently firing
                firing,
                // First callback to fire (used internally by add and fireWith)
                firingStart,
                // End of the loop when firing
                firingLength,
                // Index of currently firing callback (modified by remove if needed)
                firingIndex,
                // Actual callback list
                list = [],
                // Stack of fire calls for repeatable lists
                stack = !options.once && [],
                // Fire callbacks
                fire = function (data) {
                    memory = options.memory && data;
                    fired = true;
                    firingIndex = firingStart || 0;
                    firingStart = 0;
                    firingLength = list.length;
                    firing = true;
                    for (; list && firingIndex < firingLength; firingIndex++) {
                        if (list[ firingIndex ].apply(data[ 0 ], data[ 1 ]) === false && options.stopOnFalse) {
                            memory = false; // To prevent further calls using add
                            break;
                        }
                    }
                    firing = false;
                    if (list) {
                        if (stack) {
                            if (stack.length) {
                                fire(stack.shift());
                            }
                        } else if (memory) {
                            list = [];
                        } else {
                            self.disable();
                        }
                    }
                },
                // Actual Callbacks object
                self = {
                    // Add a callback or a collection of callbacks to the list
                    add: function () {
                        if (list) {
                            // First, we save the current length
                            var start = list.length;
                            (function add(args) {
                                Kademi.each(args, function (_, arg) {
                                    var type = Kademi.type(arg);
                                    if (type === "function") {
                                        if (!options.unique || !self.has(arg)) {
                                            list.push(arg);
                                        }
                                    } else if (arg && arg.length && type !== "string") {
                                        // Inspect recursively
                                        add(arg);
                                    }
                                });
                            })(arguments);
                            // Do we need to add the callbacks to the
                            // current firing batch?
                            if (firing) {
                                firingLength = list.length;
                                // With memory, if we're not firing then
                                // we should call right away
                            } else if (memory) {
                                firingStart = start;
                                fire(memory);
                            }
                        }
                        return this;
                    },
                    // Remove a callback from the list
                    remove: function () {
                        if (list) {
                            Kademi.each(arguments, function (_, arg) {
                                var index;
                                while ((index = Kademi.inArray(arg, list, index)) > -1) {
                                    list.splice(index, 1);
                                    // Handle firing indexes
                                    if (firing) {
                                        if (index <= firingLength) {
                                            firingLength--;
                                        }
                                        if (index <= firingIndex) {
                                            firingIndex--;
                                        }
                                    }
                                }
                            });
                        }
                        return this;
                    },
                    // Check if a given callback is in the list.
                    // If no argument is given, return whether or not list has callbacks attached.
                    has: function (fn) {
                        return fn ? Kademi.inArray(fn, list) > -1 : !!(list && list.length);
                    },
                    // Remove all callbacks from the list
                    empty: function () {
                        list = [];
                        firingLength = 0;
                        return this;
                    },
                    // Have the list do nothing anymore
                    disable: function () {
                        list = stack = memory = undefined;
                        return this;
                    },
                    // Is it disabled?
                    disabled: function () {
                        return !list;
                    },
                    // Lock the list in its current state
                    lock: function () {
                        stack = undefined;
                        if (!memory) {
                            self.disable();
                        }
                        return this;
                    },
                    // Is it locked?
                    locked: function () {
                        return !stack;
                    },
                    // Call all callbacks with the given context and arguments
                    fireWith: function (context, args) {
                        if (list && (!fired || stack)) {
                            args = args || [];
                            args = [context, args.slice ? args.slice() : args];
                            if (firing) {
                                stack.push(args);
                            } else {
                                fire(args);
                            }
                        }
                        return this;
                    },
                    // Call all the callbacks with the given arguments
                    fire: function () {
                        self.fireWith(this, arguments);
                        return this;
                    },
                    // To know if the callbacks have already been called at least once
                    fired: function () {
                        return !!fired;
                    }
                };

        return self;
    };

    Kademi.extend({
        Deferred: function (func) {
            var tuples = [
                // action, add listener, listener list, final state
                ["resolve", "done", Kademi.Callbacks("once memory"), "resolved"],
                ["reject", "fail", Kademi.Callbacks("once memory"), "rejected"],
                ["notify", "progress", Kademi.Callbacks("memory")]
            ],
                    state = "pending",
                    promise = {
                        state: function () {
                            return state;
                        },
                        always: function () {
                            deferred.done(arguments).fail(arguments);
                            return this;
                        },
                        then: function ( /* fnDone, fnFail, fnProgress */ ) {
                            var fns = arguments;
                            return Kademi.Deferred(function (newDefer) {
                                Kademi.each(tuples, function (i, tuple) {
                                    var fn = Kademi.isFunction(fns[ i ]) && fns[ i ];
                                    // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                    deferred[ tuple[1] ](function () {
                                        var returned = fn && fn.apply(this, arguments);
                                        if (returned && Kademi.isFunction(returned.promise)) {
                                            returned.promise()
                                                    .done(newDefer.resolve)
                                                    .fail(newDefer.reject)
                                                    .progress(newDefer.notify);
                                        } else {
                                            newDefer[ tuple[ 0 ] + "With" ](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                                        }
                                    });
                                });
                                fns = null;
                            }).promise();
                        },
                        // Get a promise for this deferred
                        // If obj is provided, the promise aspect is added to the object
                        promise: function (obj) {
                            return obj != null ? Kademi.extend(obj, promise) : promise;
                        }
                    },
            deferred = {};

            // Keep pipe for back-compat
            promise.pipe = promise.then;

            // Add list-specific methods
            Kademi.each(tuples, function (i, tuple) {
                var list = tuple[ 2 ],
                        stateString = tuple[ 3 ];

                // promise[ done | fail | progress ] = list.add
                promise[ tuple[1] ] = list.add;

                // Handle state
                if (stateString) {
                    list.add(function () {
                        // state = [ resolved | rejected ]
                        state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock);
                }

                // deferred[ resolve | reject | notify ]
                deferred[ tuple[0] ] = function () {
                    deferred[ tuple[0] + "With" ](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[ tuple[0] + "With" ] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise(deferred);

            // Call given func if any
            if (func) {
                func.call(deferred, deferred);
            }

            // All done!
            return deferred;
        },
        // Deferred helper
        when: function (subordinate /* , ..., subordinateN */) {
            var i = 0,
                    resolveValues = slice.call(arguments),
                    length = resolveValues.length,
                    // the count of uncompleted subordinates
                    remaining = length !== 1 || (subordinate && Kademi.isFunction(subordinate.promise)) ? length : 0,
                    // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                    deferred = remaining === 1 ? subordinate : Kademi.Deferred(),
                    // Update function for both resolve and progress values
                    updateFunc = function (i, contexts, values) {
                        return function (value) {
                            contexts[ i ] = this;
                            values[ i ] = arguments.length > 1 ? slice.call(arguments) : value;
                            if (values === progressValues) {
                                deferred.notifyWith(contexts, values);
                            } else if (!(--remaining)) {
                                deferred.resolveWith(contexts, values);
                            }
                        };
                    },
                    progressValues, progressContexts, resolveContexts;

            // Add listeners to Deferred subordinates; treat others as resolved
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[ i ] && Kademi.isFunction(resolveValues[ i ].promise)) {
                        resolveValues[ i ].promise()
                                .done(updateFunc(i, resolveContexts, resolveValues))
                                .fail(deferred.reject)
                                .progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }

            // If we're not waiting on anything, resolve the master
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }

            return deferred.promise();
        }
    });

    var
            rhash = /#.*$/,
            rts = /([?&])_=[^&]*/,
            rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
            // #7653, #8125, #8152: local protocol detection
            rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            rnoContent = /^(?:GET|HEAD)$/,
            rprotocol = /^\/\//,
            rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            /* Prefilters
             * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
             * 2) These are called:
             *    - BEFORE asking for a transport
             *    - AFTER param serialization (s.data is a string if s.processData is true)
             * 3) key is the dataType
             * 4) the catchall symbol "*" can be used
             * 5) execution will start with transport dataType and THEN continue down to "*" if needed
             */
            prefilters = {},
            /* Transports bindings
             * 1) key is the dataType
             * 2) the catchall symbol "*" can be used
             * 3) selection will start with transport dataType and THEN go to "*" if needed
             */
            transports = {},
            // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
            allTypes = "*/".concat("*"),
            // Document location
            ajaxLocation = "",
            // Segment location into parts
            ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

    // Base "constructor" for Kademi.ajaxPrefilter and Kademi.ajaxTransport
    function addToPrefiltersOrTransports(structure) {

        // dataTypeExpression is optional and defaults to "*"
        return function (dataTypeExpression, func) {

            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
                    i = 0,
                    dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

            if (Kademi.isFunction(func)) {
                // For each dataType in the dataTypeExpression
                while ((dataType = dataTypes[i++])) {
                    // Prepend if requested
                    if (dataType[0] === "+") {
                        dataType = dataType.slice(1) || "*";
                        (structure[ dataType ] = structure[ dataType ] || []).unshift(func);

                        // Otherwise append
                    } else {
                        (structure[ dataType ] = structure[ dataType ] || []).push(func);
                    }
                }
            }
        };
    }

// Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

        var inspected = {},
                seekingTransport = (structure === transports);

        function inspect(dataType) {
            var selected;
            inspected[ dataType ] = true;
            Kademi.each(structure[ dataType ] || [], function (_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ]) {
                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }

        return inspect(options.dataTypes[ 0 ]) || !inspected[ "*" ] && inspect("*");
    }

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
    function ajaxExtend(target, src) {
        var key, deep,
                flatOptions = Kademi.ajaxSettings.flatOptions || {};

        for (key in src) {
            if (src[ key ] !== undefined) {
                (flatOptions[ key ] ? target : (deep || (deep = {})))[ key ] = src[ key ];
            }
        }
        if (deep) {
            Kademi.extend(true, target, deep);
        }

        return target;
    }

    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses(s, jqXHR, responses) {

        var ct, type, finalDataType, firstDataType,
                contents = s.contents,
                dataTypes = s.dataTypes;

        // Remove auto dataType and get content-type in the process
        while (dataTypes[ 0 ] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }

        // Check if we're dealing with a known content-type
        if (ct) {
            for (type in contents) {
                if (contents[ type ] && contents[ type ].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if (dataTypes[ 0 ] in responses) {
            finalDataType = dataTypes[ 0 ];
        } else {
            // Try convertible dataTypes
            for (type in responses) {
                if (!dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if (finalDataType) {
            if (finalDataType !== dataTypes[ 0 ]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[ finalDataType ];
        }
    }

    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev,
                converters = {},
                // Work with a copy of dataTypes in case we need to modify it for conversion
                dataTypes = s.dataTypes.slice();

        // Create converters map with lowercased keys
        if (dataTypes[ 1 ]) {
            for (conv in s.converters) {
                converters[ conv.toLowerCase() ] = s.converters[ conv ];
            }
        }

        current = dataTypes.shift();

        // Convert to each sequential dataType
        while (current) {

            if (s.responseFields[ current ]) {
                jqXHR[ s.responseFields[ current ] ] = response;
            }

            // Apply the dataFilter if provided
            if (!prev && isSuccess && s.dataFilter) {
                response = s.dataFilter(response, s.dataType);
            }

            prev = current;
            current = dataTypes.shift();

            if (current) {

                // There's only work to do if current dataType is non-auto
                if (current === "*") {

                    current = prev;

                    // Convert response if prev dataType is non-auto and differs from current
                } else if (prev !== "*" && prev !== current) {

                    // Seek a direct converter
                    conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                    // If none found, seek a pair
                    if (!conv) {
                        for (conv2 in converters) {

                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if (tmp[ 1 ] === current) {

                                // If prev can be converted to accepted input
                                conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                        converters[ "* " + tmp[ 0 ] ];
                                if (conv) {
                                    // Condense equivalence converters
                                    if (conv === true) {
                                        conv = converters[ conv2 ];

                                        // Otherwise, insert the intermediate dataType
                                    } else if (converters[ conv2 ] !== true) {
                                        current = tmp[ 0 ];
                                        dataTypes.unshift(tmp[ 1 ]);
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if (conv !== true) {

                        // Unless errors are allowed to bubble, catch and return them
                        if (conv && s[ "throws" ]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return {state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current};
                            }
                        }
                    }
                }
            }
        }

        return {state: "success", data: response};
    }

    Kademi.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test(ajaxLocParts[ 1 ]),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
             timeout: 0,
             data: null,
             dataType: null,
             username: null,
             password: null,
             cache: null,
             throws: false,
             traditional: false,
             headers: {},
             */

            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
                // Convert anything to text
                "* text": String,
                // Text to html (true = no transformation)
                "text html": true,
                // Evaluate text as a json expression
                "text json": Kademi.parseJSON,
                // Parse text as xml
                "text xml": Kademi.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function (target, settings) {
            return settings ?
                    // Building a settings object
                    ajaxExtend(ajaxExtend(target, Kademi.ajaxSettings), settings) :
                    // Extending ajaxSettings
                    ajaxExtend(Kademi.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function (url, options) {

            // If url is an object, simulate pre-1.5 signature
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var transport,
                    // URL without anti-cache param
                    cacheURL,
                    // Response headers
                    responseHeadersString,
                    responseHeaders,
                    // timeout handle
                    timeoutTimer,
                    // Cross-domain detection vars
                    parts,
                    // To know if global events are to be dispatched
                    fireGlobals,
                    // Loop variable
                    i,
                    // Create the final options object
                    s = Kademi.ajaxSetup({}, options),
                    // Callbacks context
                    callbackContext = s.context || s,
                    // Context for global events is callbackContext if it is a DOM node or Kademi collection
                    globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ?
                    Kademi(callbackContext) :
                    Kademi.event,
                    // Deferreds
                    deferred = Kademi.Deferred(),
                    completeDeferred = Kademi.Callbacks("once memory"),
                    // Status-dependent callbacks
                    statusCode = s.statusCode || {},
                    // Headers (they are sent all at once)
                    requestHeaders = {},
                    requestHeadersNames = {},
                    // The jqXHR state
                    state = 0,
                    // Default abort message
                    strAbort = "canceled",
                    // Fake xhr
                    jqXHR = {
                        readyState: 0,
                        // Builds headers hashtable if needed
                        getResponseHeader: function (key) {
                            var match;
                            if (state === 2) {
                                if (!responseHeaders) {
                                    responseHeaders = {};
                                    while ((match = rheaders.exec(responseHeadersString))) {
                                        responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                    }
                                }
                                match = responseHeaders[ key.toLowerCase() ];
                            }
                            return match == null ? null : match;
                        },
                        // Raw string
                        getAllResponseHeaders: function () {
                            return state === 2 ? responseHeadersString : null;
                        },
                        // Caches the header
                        setRequestHeader: function (name, value) {
                            var lname = name.toLowerCase();
                            if (!state) {
                                name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                                requestHeaders[ name ] = value;
                            }
                            return this;
                        },
                        // Overrides response content-type header
                        overrideMimeType: function (type) {
                            if (!state) {
                                s.mimeType = type;
                            }
                            return this;
                        },
                        // Status-dependent callbacks
                        statusCode: function (map) {
                            var code;
                            if (map) {
                                if (state < 2) {
                                    for (code in map) {
                                        // Lazy-add the new callback in a way that preserves old ones
                                        statusCode[ code ] = [statusCode[ code ], map[ code ]];
                                    }
                                } else {
                                    // Execute the appropriate callbacks
                                    jqXHR.always(map[ jqXHR.status ]);
                                }
                            }
                            return this;
                        },
                        // Cancel the request
                        abort: function (statusText) {
                            var finalText = statusText || strAbort;
                            if (transport) {
                                transport.abort(finalText);
                            }
                            done(0, finalText);
                            return this;
                        }
                    };

            // Attach deferreds
            deferred.promise(jqXHR).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (prefilters might expect it)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "")
                    .replace(rprotocol, ajaxLocParts[ 1 ] + "//");

            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;

            // Extract dataTypes list
            s.dataTypes = Kademi.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                /*s.crossDomain = !!(parts &&
                 (parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
                 (parts[ 3 ] || (parts[ 1 ] === "http:" ? "80" : "443")) !==
                 (ajaxLocParts[ 3 ] || (ajaxLocParts[ 1 ] === "http:" ? "80" : "443")))
                 );*/
            }

            // Convert data if not already a string
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = Kademi.param(s.data, s.traditional);
            }

            // Apply prefilters
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

            // If request was aborted inside a prefilter, stop there
            if (state === 2) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            // Don't fire events if Kademi.event is undefined in an AMD-usage scenario (#15118)
            fireGlobals = Kademi.event && s.global;

            // Watch for a new set of requests
            if (fireGlobals && Kademi.active++ === 0) {
                Kademi.event.trigger("ajaxStart");
            }

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test(s.type);

            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url;

            // More options handling for requests with no content
            if (!s.hasContent) {

                // If data is available, append data to url
                if (s.data) {
                    cacheURL = (s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data);
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Add anti-cache in url if needed
                if (s.cache === false) {
                    s.url = rts.test(cacheURL) ?
                            // If there is already a '_' parameter, set its value
                            cacheURL.replace(rts, "$1_=" + nonce++) :
                            // Otherwise add one to the end
                            cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
                }
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if (s.ifModified) {
                if (Kademi.lastModified[ cacheURL ]) {
                    jqXHR.setRequestHeader("If-Modified-Since", Kademi.lastModified[ cacheURL ]);
                }
                if (Kademi.etag[ cacheURL ]) {
                    jqXHR.setRequestHeader("If-None-Match", Kademi.etag[ cacheURL ]);
                }
            }

            // Set the correct header, if data is being sent
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                    "Accept",
                    s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                    s.accepts[ s.dataTypes[0] ] + (s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
                    s.accepts[ "*" ]
                    );

            // Check for headers option
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[ i ]);
            }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                // Abort if not done already and return
                return jqXHR.abort();
            }

            // Aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for (i in {success: 1, error: 1, complete: 1}) {
                jqXHR[ i ](s[ i ]);
            }

            // Get transport
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

            // If no transport, we auto-abort
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;

                // Send global event
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                }
                // Timeout
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }

                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    // Propagate exception as error if not done
                    if (state < 2) {
                        done(-1, e);
                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            // Callback for when everything is done
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified,
                        statusText = nativeStatusText;

                // Called once
                if (state === 2) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Determine if successful
                isSuccess = status >= 200 && status < 300 || status === 304;

                // Get response data
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }

                // Convert no matter what (that way responseXXX fields are always set)
                response = ajaxConvert(s, response, jqXHR, isSuccess);

                // If successful, handle type chaining
                if (isSuccess) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            Kademi.lastModified[ cacheURL ] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if (modified) {
                            Kademi.etag[ cacheURL ] = modified;
                        }
                    }

                    // if no content
                    if (status === 204 || s.type === "HEAD") {
                        statusText = "nocontent";

                        // if not modified
                    } else if (status === 304) {
                        statusText = "notmodified";

                        // If we have data, let's convert it
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {
                    // Extract error from statusText and normalize for non-aborts
                    error = statusText;
                    if (status || !statusText) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";

                // Success/Error
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                } else {
                    deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                }

                // Status-dependent callbacks
                jqXHR.statusCode(statusCode);
                statusCode = undefined;

                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError",
                            [jqXHR, s, isSuccess ? success : error]);
                }

                // Complete
                completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                    // Handle the global AJAX counter
                    if (!(--Kademi.active)) {
                        Kademi.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },
        getJSON: function (url, data, callback) {
            return Kademi.get(url, data, callback, "json");
        },
        getScript: function (url, callback) {
            return Kademi.get(url, undefined, callback, "script");
        }
    });

    Kademi.each(["get", "post"], function (i, method) {
        Kademi[ method ] = function (url, data, callback, type) {
            // Shift arguments if data argument was omitted
            if (Kademi.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return Kademi.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });

    var r20 = /%20/g,
            rbracket = /\[\]$/,
            rCRLF = /\r?\n/g,
            rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
            rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams(prefix, obj, traditional, add) {
        var name;

        if (Kademi.isArray(obj)) {
            // Serialize array item.
            Kademi.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);

                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });

        } else if (!traditional && Kademi.type(obj) === "object") {
            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[ name ], traditional, add);
            }

        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }

// Serialize an array of form elements or a set of
// key/values into a query string
    Kademi.param = function (a, traditional) {
        var prefix,
                s = [],
                add = function (key, value) {
                    // If value is a function, invoke it and return its value
                    value = Kademi.isFunction(value) ? value() : (value == null ? "" : value);
                    s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                };

        // Set traditional to true for Kademi <= 1.3.2 behavior.
        if (traditional === undefined) {
            traditional = Kademi.ajaxSettings && Kademi.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if (Kademi.isArray(a) || (a.jquery && !Kademi.isPlainObject(a))) {
            // Serialize the form elements
            Kademi.each(a, function () {
                add(this.name, this.value);
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for (prefix in a) {
                buildParams(prefix, a[ prefix ], traditional, add);
            }
        }

        // Return the resulting serialization
        return s.join("&").replace(r20, "+");
    };

    Kademi.ajaxSettings.xhr = function () {
        try {
            return new XMLHttpRequest();
        } catch (e) {
        }
    };

    var xhrId = 0,
            xhrCallbacks = {},
            xhrSuccessStatus = {
                // file protocol always yields status code 0, assume 200
                0: 200,
                // Support: IE9
                // #1450: sometimes IE returns 1223 when it should be 204
                1223: 204
            },
    xhrSupported = Kademi.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info

    support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
    support.ajax = xhrSupported = !!xhrSupported;


    Kademi.ajaxTransport(function (options) {
        var callback;
        // Cross domain only allowed if supported through XMLHttpRequest
        if (support.cors || xhrSupported && !options.crossDomain) {
            return {
                send: function (headers, complete) {
                    var i,
                            xhr = options.xhr(),
                            id = ++xhrId;

                    xhr.open(options.type, options.url, options.async, options.username, options.password);

                    // Apply custom fields if provided
                    if (options.xhrFields) {
                        for (i in options.xhrFields) {
                            xhr[ i ] = options.xhrFields[ i ];
                        }
                    }

                    // Override mime type if needed
                    if (options.mimeType && xhr.overrideMimeType) {
                        xhr.overrideMimeType(options.mimeType);
                    }

                    // X-Requested-With header
                    // For cross-domain requests, seeing as conditions for a preflight are
                    // akin to a jigsaw puzzle, we simply never set it to be sure.
                    // (it can always be set on a per-request basis or even using ajaxSetup)
                    // For same-domain requests, won't change header if already provided.
                    if (!options.crossDomain && !headers["X-Requested-With"]) {
                        headers["X-Requested-With"] = "XMLHttpRequest";
                    }

                    // Set headers
                    for (i in headers) {
                        xhr.setRequestHeader(i, headers[ i ]);
                    }

                    // Callback
                    callback = function (type) {
                        return function () {
                            if (callback) {
                                delete xhrCallbacks[ id ];
                                callback = xhr.onload = xhr.onerror = null;

                                if (type === "abort") {
                                    xhr.abort();
                                } else if (type === "error") {
                                    complete(
                                            // file: protocol always yields status 0; see #8605, #14207
                                            xhr.status,
                                            xhr.statusText
                                            );
                                } else {
                                    complete(
                                            xhrSuccessStatus[ xhr.status ] || xhr.status,
                                            xhr.statusText,
                                            // Support: IE9
                                            // Accessing binary-data responseText throws an exception
                                            // (#11426)
                                            typeof xhr.responseText === "string" ? {
                                                text: xhr.responseText
                                            } : undefined,
                                            xhr.getAllResponseHeaders()
                                            );
                                }
                            }
                        };
                    };

                    // Listen to events
                    xhr.onload = callback();
                    xhr.onerror = callback("error");

                    // Create the abort callback
                    callback = xhrCallbacks[ id ] = callback("abort");

                    try {
                        // Do send the request (this may raise an exception)
                        xhr.send(options.hasContent && options.data || null);
                    } catch (e) {
                        // #14683: Only rethrow if this hasn't been notified as an error yet
                        if (callback) {
                            throw e;
                        }
                    }
                },
                abort: function () {
                    if (callback) {
                        callback();
                    }
                }
            };
        }
    });




// Install script dataType
    Kademi.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function (text) {
                Kademi.globalEval(text);
                return text;
            }
        }
    });

// Handle cache's special case and crossDomain
    Kademi.ajaxPrefilter("script", function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
        }
    });

// Bind script tag hack transport
    Kademi.ajaxTransport("script", function (s) {
        // This transport only deals with cross domain requests
        if (s.crossDomain) {
            var script, callback;
            return {
                send: function (_, complete) {
                    script = Kademi("<script>").prop({
                        async: true,
                        charset: s.scriptCharset,
                        src: s.url
                    }).on(
                            "load error",
                            callback = function (evt) {
                                script.remove();
                                callback = null;
                                if (evt) {
                                    complete(evt.type === "error" ? 404 : 200, evt.type);
                                }
                            }
                    );
                    document.head.appendChild(script[ 0 ]);
                },
                abort: function () {
                    if (callback) {
                        callback();
                    }
                }
            };
        }
    });




    var oldCallbacks = [],
            rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
    Kademi.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var callback = oldCallbacks.pop() || (Kademi.expando + "_" + (nonce++));
            this[ callback ] = true;
            return callback;
        }
    });

// Detect, normalize options and install callbacks for jsonp requests
    Kademi.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

        var callbackName, overwritten, responseContainer,
                jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
                        "url" :
                        typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data"
                        );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if (jsonProp || s.dataTypes[ 0 ] === "jsonp") {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = Kademi.isFunction(s.jsonpCallback) ?
                    s.jsonpCallback() :
                    s.jsonpCallback;

            // Insert callback into url or form data
            if (jsonProp) {
                s[ jsonProp ] = s[ jsonProp ].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
                s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function () {
                if (!responseContainer) {
                    Kademi.error(callbackName + " was not called");
                }
                return responseContainer[ 0 ];
            };

            // force json dataType
            s.dataTypes[ 0 ] = "json";

            // Install callback
            overwritten = window[ callbackName ];
            window[ callbackName ] = function () {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function () {
                // Restore preexisting value
                window[ callbackName ] = overwritten;

                // Save back as free
                if (s[ callbackName ]) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // save the callback name for future use
                    oldCallbacks.push(callbackName);
                }

                // Call if it was a function and we have a response
                if (responseContainer && Kademi.isFunction(overwritten)) {
                    overwritten(responseContainer[ 0 ]);
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });

// Keep a copy of the old load method
    var _load = Kademi.fn.load;

    /**
     * Load a url into a page
     */
    Kademi.fn.load = function (url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }

        var selector, type, response,
                self = this,
                off = url.indexOf(" ");

        if (off >= 0) {
            selector = Kademi.trim(url.slice(off));
            url = url.slice(0, off);
        }

        // If it's a function
        if (Kademi.isFunction(params)) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if (params && typeof params === "object") {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if (self.length > 0) {
            Kademi.ajax({
                url: url,
                // if "type" variable is undefined, then "GET" method will be used
                type: type,
                dataType: "html",
                data: params
            }).done(function (responseText) {

                // Save response for use in complete callback
                response = arguments;

                self.html(selector ?
                        // If a selector was specified, locate the right elements in a dummy div
                        // Exclude scripts to avoid IE 'Permission Denied' errors
                        Kademi("<div>").append(Kademi.parseHTML(responseText)).find(selector) :
                        // Otherwise use the full result
                        responseText);

            }).complete(callback && function (jqXHR, status) {
                self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
            });
        }

        return this;
    };




// Attach a bunch of functions for handling common AJAX events
    Kademi.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
        Kademi.fn[ type ] = function (fn) {
            return this.on(type, fn);
        };
    });

    exports.Kademi = exports.$k = Kademi;
})(this);