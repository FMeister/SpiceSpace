
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var frappeCharts_min_cjs = createCommonjsModule(function (module, exports) {
    function styleInject(t,e){void 0===e&&(e={});var n=e.insertAt;if(t&&"undefined"!=typeof document){var i=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css","top"===n&&i.firstChild?i.insertBefore(a,i.firstChild):i.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t));}}function $(t,e){return "string"==typeof t?(e||document).querySelector(t):t||null}function getOffset(t){var e=t.getBoundingClientRect();return {top:e.top+(document.documentElement.scrollTop||document.body.scrollTop),left:e.left+(document.documentElement.scrollLeft||document.body.scrollLeft)}}function isHidden(t){return null===t.offsetParent}function isElementInViewport(t){var e=t.getBoundingClientRect();return e.top>=0&&e.left>=0&&e.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&e.right<=(window.innerWidth||document.documentElement.clientWidth)}function getElementContentWidth(t){var e=window.getComputedStyle(t),n=parseFloat(e.paddingLeft)+parseFloat(e.paddingRight);return t.clientWidth-n}function fire(t,e,n){var i=document.createEvent("HTMLEvents");i.initEvent(e,!0,!0);for(var a in n)i[a]=n[a];return t.dispatchEvent(i)}function getTopOffset(t){return t.titleHeight+t.margins.top+t.paddings.top}function getLeftOffset(t){return t.margins.left+t.paddings.left}function getExtraHeight(t){return t.margins.top+t.margins.bottom+t.paddings.top+t.paddings.bottom+t.titleHeight+t.legendHeight}function getExtraWidth(t){return t.margins.left+t.margins.right+t.paddings.left+t.paddings.right}function _classCallCheck$4(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function floatTwo(t){return parseFloat(t.toFixed(2))}function fillArray(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3];n||(n=i?t[0]:t[t.length-1]);var a=new Array(Math.abs(e)).fill(n);return t=i?a.concat(t):t.concat(a)}function getStringWidth(t,e){return (t+"").length*e}function getPositionByAngle(t,e){return {x:Math.sin(t*ANGLE_RATIO)*e,y:Math.cos(t*ANGLE_RATIO)*e}}function isValidNumber(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return !Number.isNaN(t)&&(void 0!==t&&(!!Number.isFinite(t)&&!(e&&t<0)))}function round(t){return Number(Math.round(t+"e4")+"e-4")}function deepClone(t){var e=void 0,n=void 0,i=void 0;if(t instanceof Date)return new Date(t.getTime());if("object"!==(void 0===t?"undefined":_typeof$2(t))||null===t)return t;e=Array.isArray(t)?[]:{};for(i in t)n=t[i],e[i]=deepClone(n);return e}function getBarHeightAndYAttr(t,e){var n=void 0,i=void 0;return t<=e?(n=e-t,i=t):(n=t-e,i=e),[n,i]}function equilizeNoOfElements(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e.length-t.length;return n>0?t=fillArray(t,n):e=fillArray(e,n),[t,e]}function truncateString(t,e){if(t)return t.length>e?t.slice(0,e-3)+"...":t}function shortenLargeNumber(t){var e=void 0;if("number"==typeof t)e=t;else if("string"==typeof t&&(e=Number(t),Number.isNaN(e)))return t;var n=Math.floor(Math.log10(Math.abs(e)));if(n<=2)return e;var i=Math.floor(n/3),a=Math.pow(10,n-3*i)*+(e/Math.pow(10,n)).toFixed(1);return Math.round(100*a)/100+" "+["","K","M","B","T"][i]}function getSplineCurvePointsStr(t,e){for(var n=[],i=0;i<t.length;i++)n.push([t[i],e[i]]);var a=function(t,e){var n=e[0]-t[0],i=e[1]-t[1];return {length:Math.sqrt(Math.pow(n,2)+Math.pow(i,2)),angle:Math.atan2(i,n)}},r=function(t,e,n,i){var r=a(e||t,n||t),o=r.angle+(i?Math.PI:0),s=.2*r.length;return [t[0]+Math.cos(o)*s,t[1]+Math.sin(o)*s]};return function(t,e){return t.reduce(function(t,n,i,a){return 0===i?n[0]+","+n[1]:t+" "+e(n,i,a)},"")}(n,function(t,e,n){var i=r(n[e-1],n[e-2],t),a=r(t,n[e-1],n[e+1],!0);return "C "+i[0]+","+i[1]+" "+a[0]+","+a[1]+" "+t[0]+","+t[1]})}function limitColor(t){return t>255?255:t<0?0:t}function lightenDarkenColor(t,e){var n=getColor(t),i=!1;"#"==n[0]&&(n=n.slice(1),i=!0);var a=parseInt(n,16),r=limitColor((a>>16)+e),o=limitColor((a>>8&255)+e),s=limitColor((255&a)+e);return (i?"#":"")+(s|o<<8|r<<16).toString(16)}function isValidColor(t){var e=/(^\s*)(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/i;return /(^\s*)(#)((?:[A-Fa-f0-9]{3}){1,2})$/i.test(t)||e.test(t)}function $$1(t,e){return "string"==typeof t?(e||document).querySelector(t):t||null}function createSVG(t,e){var n=document.createElementNS("http://www.w3.org/2000/svg",t);for(var i in e){var a=e[i];if("inside"===i)$$1(a).appendChild(n);else if("around"===i){var r=$$1(a);r.parentNode.insertBefore(n,r),n.appendChild(r);}else "styles"===i?"object"===(void 0===a?"undefined":_typeof$1(a))&&Object.keys(a).map(function(t){n.style[t]=a[t];}):("className"===i&&(i="class"),"innerHTML"===i?n.textContent=a:n.setAttribute(i,a));}return n}function renderVerticalGradient(t,e){return createSVG("linearGradient",{inside:t,id:e,x1:0,x2:0,y1:0,y2:1})}function setGradientStop(t,e,n,i){return createSVG("stop",{inside:t,style:"stop-color: "+n,offset:e,"stop-opacity":i})}function makeSVGContainer(t,e,n,i){return createSVG("svg",{className:e,inside:t,width:n,height:i})}function makeSVGDefs(t){return createSVG("defs",{inside:t})}function makeSVGGroup(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,i={className:t,transform:e};return n&&(i.inside=n),createSVG("g",i)}function makePath(t){return createSVG("path",{className:arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",d:t,styles:{stroke:arguments.length>2&&void 0!==arguments[2]?arguments[2]:"none",fill:arguments.length>3&&void 0!==arguments[3]?arguments[3]:"none","stroke-width":arguments.length>4&&void 0!==arguments[4]?arguments[4]:2}})}function makeArcPathStr(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,o=n.x+t.x,s=n.y+t.y,l=n.x+e.x,u=n.y+e.y;return "M"+n.x+" "+n.y+"\n\t\tL"+o+" "+s+"\n\t\tA "+i+" "+i+" 0 "+r+" "+(a?1:0)+"\n\t\t"+l+" "+u+" z"}function makeCircleStr(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,o=n.x+t.x,s=n.y+t.y,l=n.x+e.x,u=2*n.y,c=n.y+e.y;return "M"+n.x+" "+n.y+"\n\t\tL"+o+" "+s+"\n\t\tA "+i+" "+i+" 0 "+r+" "+(a?1:0)+"\n\t\t"+l+" "+u+" z\n\t\tL"+o+" "+u+"\n\t\tA "+i+" "+i+" 0 "+r+" "+(a?1:0)+"\n\t\t"+l+" "+c+" z"}function makeArcStrokePathStr(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,o=n.x+t.x,s=n.y+t.y,l=n.x+e.x,u=n.y+e.y;return "M"+o+" "+s+"\n\t\tA "+i+" "+i+" 0 "+r+" "+(a?1:0)+"\n\t\t"+l+" "+u}function makeStrokeCircleStr(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,o=n.x+t.x,s=n.y+t.y,l=n.x+e.x,u=2*i+s,c=n.y+t.y;return "M"+o+" "+s+"\n\t\tA "+i+" "+i+" 0 "+r+" "+(a?1:0)+"\n\t\t"+l+" "+u+"\n\t\tM"+o+" "+u+"\n\t\tA "+i+" "+i+" 0 "+r+" "+(a?1:0)+"\n\t\t"+l+" "+c}function makeGradient(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i="path-fill-gradient-"+e+"-"+(n?"lighter":"default"),a=renderVerticalGradient(t,i),r=[1,.6,.2];return n&&(r=[.4,.2,0]),setGradientStop(a,"0%",e,r[0]),setGradientStop(a,"50%",e,r[1]),setGradientStop(a,"100%",e,r[2]),i}function percentageBar(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:PERCENTAGE_BAR_DEFAULT_DEPTH,r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"none";return createSVG("rect",{className:"percentage-bar",x:t,y:e,width:n,height:i,fill:r,styles:{stroke:lightenDarkenColor(r,-25),"stroke-dasharray":"0, "+(i+n)+", "+n+", "+i,"stroke-width":a}})}function heatSquare(t,e,n,i,a){var r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"none",o=arguments.length>6&&void 0!==arguments[6]?arguments[6]:{},s={className:t,x:e,y:n,width:i,height:i,rx:a,fill:r};return Object.keys(o).map(function(t){s[t]=o[t];}),createSVG("rect",s)}function legendBar(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"none",a=arguments[4];a=arguments.length>5&&void 0!==arguments[5]&&arguments[5]?truncateString(a,LABEL_MAX_CHARS):a;var r={className:"legend-bar",x:0,y:0,width:n,height:"2px",fill:i},o=createSVG("text",{className:"legend-dataset-text",x:0,y:0,dy:2*FONT_SIZE+"px","font-size":1.2*FONT_SIZE+"px","text-anchor":"start",fill:FONT_FILL,innerHTML:a}),s=createSVG("g",{transform:"translate("+t+", "+e+")"});return s.appendChild(createSVG("rect",r)),s.appendChild(o),s}function legendDot(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"none",a=arguments[4];a=arguments.length>5&&void 0!==arguments[5]&&arguments[5]?truncateString(a,LABEL_MAX_CHARS):a;var r={className:"legend-dot",cx:0,cy:0,r:n,fill:i},o=createSVG("text",{className:"legend-dataset-text",x:0,y:0,dx:FONT_SIZE+"px",dy:FONT_SIZE/3+"px","font-size":1.2*FONT_SIZE+"px","text-anchor":"start",fill:FONT_FILL,innerHTML:a}),s=createSVG("g",{transform:"translate("+t+", "+e+")"});return s.appendChild(createSVG("circle",r)),s.appendChild(o),s}function makeText(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},r=a.fontSize||FONT_SIZE;return createSVG("text",{className:t,x:e,y:n,dy:(void 0!==a.dy?a.dy:r/2)+"px","font-size":r+"px",fill:a.fill||FONT_FILL,"text-anchor":a.textAnchor||"start",innerHTML:i})}function makeVertLine(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};a.stroke||(a.stroke=BASE_LINE_COLOR);var r=createSVG("line",{className:"line-vertical "+a.className,x1:0,x2:0,y1:n,y2:i,styles:{stroke:a.stroke}}),o=createSVG("text",{x:0,y:n>i?n+LABEL_MARGIN:n-LABEL_MARGIN-FONT_SIZE,dy:FONT_SIZE+"px","font-size":FONT_SIZE+"px","text-anchor":"middle",innerHTML:e+""}),s=createSVG("g",{transform:"translate("+t+", 0)"});return s.appendChild(r),s.appendChild(o),s}function makeHoriLine(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};a.stroke||(a.stroke=BASE_LINE_COLOR),a.lineType||(a.lineType=""),a.shortenNumbers&&(e=shortenLargeNumber(e));var r=createSVG("line",{className:"line-horizontal "+a.className+("dashed"===a.lineType?"dashed":""),x1:n,x2:i,y1:0,y2:0,styles:{stroke:a.stroke}}),o=createSVG("text",{x:n<i?n-LABEL_MARGIN:n+LABEL_MARGIN,y:0,dy:FONT_SIZE/2-2+"px","font-size":FONT_SIZE+"px","text-anchor":n<i?"end":"start",innerHTML:e+""}),s=createSVG("g",{transform:"translate(0, "+t+")","stroke-opacity":1});return 0!==o&&"0"!==o||(s.style.stroke="rgba(27, 31, 35, 0.6)"),s.appendChild(r),s.appendChild(o),s}function yLine(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};isValidNumber(t)||(t=0),i.pos||(i.pos="left"),i.offset||(i.offset=0),i.mode||(i.mode="span"),i.stroke||(i.stroke=BASE_LINE_COLOR),i.className||(i.className="");var a=-1*AXIS_TICK_LENGTH,r="span"===i.mode?n+AXIS_TICK_LENGTH:0;return "tick"===i.mode&&"right"===i.pos&&(a=n+AXIS_TICK_LENGTH,r=n),a+=i.offset,r+=i.offset,makeHoriLine(t,e,a,r,{stroke:i.stroke,className:i.className,lineType:i.lineType,shortenNumbers:i.shortenNumbers})}function xLine(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};isValidNumber(t)||(t=0),i.pos||(i.pos="bottom"),i.offset||(i.offset=0),i.mode||(i.mode="span"),i.stroke||(i.stroke=BASE_LINE_COLOR),i.className||(i.className="");var a=n+AXIS_TICK_LENGTH,r="span"===i.mode?-1*AXIS_TICK_LENGTH:n;return "tick"===i.mode&&"top"===i.pos&&(a=-1*AXIS_TICK_LENGTH,r=0),makeVertLine(t,e,a,r,{stroke:i.stroke,className:i.className,lineType:i.lineType})}function yMarker(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};i.labelPos||(i.labelPos="right");var a=createSVG("text",{className:"chart-label",x:"left"===i.labelPos?LABEL_MARGIN:n-getStringWidth(e,5)-LABEL_MARGIN,y:0,dy:FONT_SIZE/-2+"px","font-size":FONT_SIZE+"px","text-anchor":"start",innerHTML:e+""}),r=makeHoriLine(t,"",0,n,{stroke:i.stroke||BASE_LINE_COLOR,className:i.className||"",lineType:i.lineType});return r.appendChild(a),r}function yRegion(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},r=t-e,o=createSVG("rect",{className:"bar mini",styles:{fill:"rgba(228, 234, 239, 0.49)",stroke:BASE_LINE_COLOR,"stroke-dasharray":n+", "+r},x:0,y:0,width:n,height:r});a.labelPos||(a.labelPos="right");var s=createSVG("text",{className:"chart-label",x:"left"===a.labelPos?LABEL_MARGIN:n-getStringWidth(i+"",4.5)-LABEL_MARGIN,y:0,dy:FONT_SIZE/-2+"px","font-size":FONT_SIZE+"px","text-anchor":"start",innerHTML:i+""}),l=createSVG("g",{transform:"translate(0, "+e+")"});return l.appendChild(o),l.appendChild(s),l}function datasetBar(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,o=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,s=arguments.length>7&&void 0!==arguments[7]?arguments[7]:{},l=getBarHeightAndYAttr(e,s.zeroLine),u=_slicedToArray(l,2),c=u[0],h=u[1];h-=o,0===c&&(c=s.minHeight,h-=s.minHeight),isValidNumber(t)||(t=0),isValidNumber(h)||(h=0),isValidNumber(c,!0)||(c=0),isValidNumber(n,!0)||(n=0);var d=createSVG("rect",{className:"bar mini",style:"fill: "+i,"data-point-index":r,x:t,y:h,width:n,height:c});if((a+="")||a.length){d.setAttribute("y",0),d.setAttribute("x",0);var f=createSVG("text",{className:"data-point-value",x:n/2,y:0,dy:FONT_SIZE/2*-1+"px","font-size":FONT_SIZE+"px","text-anchor":"middle",innerHTML:a}),p=createSVG("g",{"data-point-index":r,transform:"translate("+t+", "+h+")"});return p.appendChild(d),p.appendChild(f),p}return d}function datasetDot(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,o=createSVG("circle",{style:"fill: "+i,"data-point-index":r,cx:t,cy:e,r:n});if((a+="")||a.length){o.setAttribute("cy",0),o.setAttribute("cx",0);var s=createSVG("text",{className:"data-point-value",x:0,y:0,dy:FONT_SIZE/2*-1-n+"px","font-size":FONT_SIZE+"px","text-anchor":"middle",innerHTML:a}),l=createSVG("g",{"data-point-index":r,transform:"translate("+t+", "+e+")"});return l.appendChild(o),l.appendChild(s),l}return o}function getPaths(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{},r=e.map(function(e,n){return t[n]+","+e}).join("L");i.spline&&(r=getSplineCurvePointsStr(t,e));var o=makePath("M"+r,"line-graph-path",n);if(i.heatline){var s=makeGradient(a.svgDefs,n);o.style.stroke="url(#"+s+")";}var l={path:o};if(i.regionFill){var u=makeGradient(a.svgDefs,n,!0),c="M"+t[0]+","+a.zeroLine+"L"+r+"L"+t.slice(-1)[0]+","+a.zeroLine;l.region=makePath(c,"region-fill","none","url(#"+u+")");}return l}function translate(t,e,n,i){var a="string"==typeof e?e:e.join(", ");return [t,{transform:n.join(", ")},i,STD_EASING,"translate",{transform:a}]}function translateVertLine(t,e,n){return translate(t,[n,0],[e,0],MARKER_LINE_ANIM_DUR)}function translateHoriLine(t,e,n){return translate(t,[0,n],[0,e],MARKER_LINE_ANIM_DUR)}function animateRegion(t,e,n,i){var a=e-n,r=t.childNodes[0];return [[r,{height:a,"stroke-dasharray":r.getAttribute("width")+", "+a},MARKER_LINE_ANIM_DUR,STD_EASING],translate(t,[0,i],[0,n],MARKER_LINE_ANIM_DUR)]}function animateBar(t,e,n,i){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,r=getBarHeightAndYAttr(n,(arguments.length>5&&void 0!==arguments[5]?arguments[5]:{}).zeroLine),o=_slicedToArray$2(r,2),s=o[0],l=o[1];return l-=a,"rect"!==t.nodeName?[[t.childNodes[0],{width:i,height:s},UNIT_ANIM_DUR,STD_EASING],translate(t,t.getAttribute("transform").split("(")[1].slice(0,-1),[e,l],MARKER_LINE_ANIM_DUR)]:[[t,{width:i,height:s,x:e,y:l},UNIT_ANIM_DUR,STD_EASING]]}function animateDot(t,e,n){return "circle"!==t.nodeName?[translate(t,t.getAttribute("transform").split("(")[1].slice(0,-1),[e,n],MARKER_LINE_ANIM_DUR)]:[[t,{cx:e,cy:n},UNIT_ANIM_DUR,STD_EASING]]}function animatePath(t,e,n,i,a){var r=[],o=n.map(function(t,n){return e[n]+","+t}).join("L");a&&(o=getSplineCurvePointsStr(e,n));var s=[t.path,{d:"M"+o},PATH_ANIM_DUR,STD_EASING];if(r.push(s),t.region){var l=e[0]+","+i+"L",u="L"+e.slice(-1)[0]+", "+i,c=[t.region,{d:"M"+l+o+u},PATH_ANIM_DUR,STD_EASING];r.push(c);}return r}function animatePathStr(t,e){return [t,{d:e},UNIT_ANIM_DUR,STD_EASING]}function _toConsumableArray$1(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function animateSVGElement(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"linear",a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0,r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},o=t.cloneNode(!0),s=t.cloneNode(!0);for(var l in e){var u=void 0;u="transform"===l?document.createElementNS("http://www.w3.org/2000/svg","animateTransform"):document.createElementNS("http://www.w3.org/2000/svg","animate");var c=r[l]||t.getAttribute(l),h=e[l],d={attributeName:l,from:c,to:h,begin:"0s",dur:n/1e3+"s",values:c+";"+h,keySplines:EASING[i],keyTimes:"0;1",calcMode:"spline",fill:"freeze"};a&&(d.type=a);for(var f in d)u.setAttribute(f,d[f]);o.appendChild(u),a?s.setAttribute(l,"translate("+h+")"):s.setAttribute(l,h);}return [o,s]}function transform(t,e){t.style.transform=e,t.style.webkitTransform=e,t.style.msTransform=e,t.style.mozTransform=e,t.style.oTransform=e;}function animateSVG(t,e){var n=[],i=[];e.map(function(t){var e=t[0],a=e.parentNode,r=void 0,o=void 0;t[0]=e;var s=animateSVGElement.apply(void 0,_toConsumableArray$1(t)),l=_slicedToArray$1(s,2);r=l[0],o=l[1],n.push(o),i.push([r,a]),a&&a.replaceChild(r,e);});var a=t.cloneNode(!0);return i.map(function(t,i){t[1]&&(t[1].replaceChild(n[i],t[0]),e[i][0]=n[i]);}),a}function runSMILAnimation(t,e,n){if(0!==n.length){var i=animateSVG(e,n);e.parentNode==t&&(t.removeChild(e),t.appendChild(i)),setTimeout(function(){i.parentNode==t&&(t.removeChild(i),t.appendChild(e));},REPLACE_ALL_NEW_DUR);}}function downloadFile(t,e){var n=document.createElement("a");n.style="display: none";var i=new Blob(e,{type:"image/svg+xml; charset=utf-8"}),a=window.URL.createObjectURL(i);n.href=a,n.download=t,document.body.appendChild(n),n.click(),setTimeout(function(){document.body.removeChild(n),window.URL.revokeObjectURL(a);},300);}function prepareForExport(t){var e=t.cloneNode(!0);e.classList.add("chart-container"),e.setAttribute("xmlns","http://www.w3.org/2000/svg"),e.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");var n=$.create("style",{innerHTML:CSSTEXT});e.insertBefore(n,e.firstChild);var i=$.create("div");return i.appendChild(e),i.innerHTML}function _classCallCheck$3(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck$2(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn$1(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits$1(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e);}function treatAsUtc(t){var e=new Date(t);return e.setMinutes(e.getMinutes()-e.getTimezoneOffset()),e}function getYyyyMmDd(t){var e=t.getDate(),n=t.getMonth()+1;return [t.getFullYear(),(n>9?"":"0")+n,(e>9?"":"0")+e].join("-")}function clone(t){return new Date(t.getTime())}function getWeeksBetween(t,e){var n=setDayToSunday(t);return Math.ceil(getDaysBetween(n,e)/NO_OF_DAYS_IN_WEEK)}function getDaysBetween(t,e){var n=SEC_IN_DAY*NO_OF_MILLIS;return (treatAsUtc(e)-treatAsUtc(t))/n}function areInSameMonth(t,e){return t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}function getMonthName(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=MONTH_NAMES[t];return e?n.slice(0,3):n}function getLastDateInMonth(t,e){return new Date(e,t+1,0)}function setDayToSunday(t){var e=clone(t),n=e.getDay();return 0!==n&&addDays(e,-1*n),e}function addDays(t,e){t.setDate(t.getDate()+e);}function _classCallCheck$5(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function getComponent(t,e,n){var i=Object.keys(componentConfigs).filter(function(e){return t.includes(e)}),a=componentConfigs[i[0]];return Object.assign(a,{constants:e,getData:n}),new ChartComponent(a)}function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function _classCallCheck$1(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e);}function _toConsumableArray$2(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function _classCallCheck$6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn$2(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits$2(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e);}function _toConsumableArray$4(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function normalize(t){if(0===t)return [0,0];if(isNaN(t))return {mantissa:-6755399441055744,exponent:972};var e=t>0?1:-1;if(!isFinite(t))return {mantissa:4503599627370496*e,exponent:972};t=Math.abs(t);var n=Math.floor(Math.log10(t));return [e*(t/Math.pow(10,n)),n]}function getChartRangeIntervals(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=Math.ceil(t),i=Math.floor(e),a=n-i,r=a,o=1;a>5&&(a%2!=0&&(a=++n-i),r=a/2,o=2),a<=2&&(o=a/(r=4)),0===a&&(r=5,o=1);for(var s=[],l=0;l<=r;l++)s.push(i+o*l);return s}function getChartIntervals(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=normalize(t),i=_slicedToArray$4(n,2),a=i[0],r=i[1],o=e?e/Math.pow(10,r):0,s=getChartRangeIntervals(a=a.toFixed(6),o);return s=s.map(function(t){return t*Math.pow(10,r)})}function calcChartIntervals(t){function e(t,e){for(var n=getChartIntervals(t),i=n[1]-n[0],a=0,r=1;a<e;r++)a+=i,n.unshift(-1*a);return n}var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=Math.max.apply(Math,_toConsumableArray$4(t)),a=Math.min.apply(Math,_toConsumableArray$4(t)),r=[];if(i>=0&&a>=0)normalize(i)[1],r=n?getChartIntervals(i,a):getChartIntervals(i);else if(i>0&&a<0){var o=Math.abs(a);i>=o?(normalize(i)[1],r=e(i,o)):(normalize(o)[1],r=e(o,i).reverse().map(function(t){return -1*t}));}else if(i<=0&&a<=0){var s=Math.abs(a),l=Math.abs(i);normalize(s)[1],r=(r=n?getChartIntervals(s,l):getChartIntervals(s)).reverse().map(function(t){return -1*t});}return r}function getZeroIndex(t){var e=getIntervalSize(t);return t.indexOf(0)>=0?t.indexOf(0):t[0]>0?-1*t[0]/e:-1*t[t.length-1]/e+(t.length-1)}function getIntervalSize(t){return t[1]-t[0]}function getValueRange(t){return t[t.length-1]-t[0]}function scale(t,e){return floatTwo(e.zeroLine-t*e.scaleMultiplier)}function getClosestInArray(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=e.reduce(function(e,n){return Math.abs(n-t)<Math.abs(e-t)?n:e},[]);return n?e.indexOf(i):i}function calcDistribution(t,e){for(var n=Math.max.apply(Math,_toConsumableArray$4(t)),i=1/(e-1),a=[],r=0;r<e;r++){var o=n*(i*r);a.push(o);}return a}function getMaxCheckpoint(t,e){return e.filter(function(e){return e<t}).length}function _toConsumableArray$3(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function _classCallCheck$7(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn$3(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits$3(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e);}function _toConsumableArray$6(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function dataPrep(t,e){t.labels=t.labels||[];var n=t.labels.length,i=t.datasets,a=new Array(n).fill(0);return i||(i=[{values:a}]),i.map(function(t){if(t.values){var i=t.values;i=(i=i.map(function(t){return isNaN(t)?0:t})).length>n?i.slice(0,n):fillArray(i,n-i.length,0),t.values=i;}else t.values=a;t.chartType||(t.chartType=e);}),t.yRegions&&t.yRegions.map(function(t){if(t.end<t.start){var e=[t.end,t.start];t.start=e[0],t.end=e[1];}}),t}function zeroDataPrep(t){var e=t.labels.length,n=new Array(e).fill(0),i={labels:t.labels.slice(0,-1),datasets:t.datasets.map(function(t){return {name:"",values:n.slice(0,-1),chartType:t.chartType}})};return t.yMarkers&&(i.yMarkers=[{value:0,label:""}]),t.yRegions&&(i.yRegions=[{start:0,end:0,label:""}]),i}function getShortenedLabels(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i=t/e.length;i<=0&&(i=1);var a=i/DEFAULT_CHAR_WIDTH,r=void 0;if(n){var o=Math.max.apply(Math,_toConsumableArray$6(e.map(function(t){return t.length})));r=Math.ceil(o/a);}return e.map(function(t,e){return (t+="").length>a&&(n?e%r!=0&&(t=""):t=a-3>0?t.slice(0,a-3)+" ...":t.slice(0,a)+".."),t})}function _toConsumableArray$5(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function _classCallCheck$8(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn$4(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits$4(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e);}function _toConsumableArray$7(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function _classCallCheck$9(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn$5(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits$5(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e);}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function getChartByType(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"line",e=arguments[1],n=arguments[2];return "axis-mixed"===t?(n.type="line",new AxisChart(e,n)):chartTypes[t]?new chartTypes[t](e,n):void console.error("Undefined chart type: "+t)}Object.defineProperty(exports,"__esModule",{value:!0});var css_248z='.chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ol,.graph-svg-tip ul{padding-left:0;display:-webkit-box;display:-ms-flexbox;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;-webkit-box-flex:1;-ms-flex:1;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:" ";border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}';styleInject(css_248z);var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};$.create=function(t,e){var n=document.createElement(t);for(var i in e){var a=e[i];if("inside"===i)$(a).appendChild(n);else if("around"===i){var r=$(a);r.parentNode.insertBefore(n,r),n.appendChild(r);}else "styles"===i?"object"===(void 0===a?"undefined":_typeof(a))&&Object.keys(a).map(function(t){n.style[t]=a[t];}):i in n?n[i]=a:n.setAttribute(i,a);}return n};var BASE_MEASURES={margins:{top:10,bottom:10,left:20,right:20},paddings:{top:20,bottom:40,left:30,right:10},baseHeight:240,titleHeight:20,legendHeight:30,titleFontSize:12},INIT_CHART_UPDATE_TIMEOUT=700,CHART_POST_ANIMATE_TIMEOUT=400,AXIS_LEGEND_BAR_SIZE=100,BAR_CHART_SPACE_RATIO=.5,MIN_BAR_PERCENT_HEIGHT=0,LINE_CHART_DOT_SIZE=4,DOT_OVERLAY_SIZE_INCR=4,PERCENTAGE_BAR_DEFAULT_HEIGHT=20,PERCENTAGE_BAR_DEFAULT_DEPTH=2,HEATMAP_DISTRIBUTION_SIZE=5,HEATMAP_SQUARE_SIZE=10,HEATMAP_GUTTER_SIZE=2,DEFAULT_CHAR_WIDTH=7,TOOLTIP_POINTER_TRIANGLE_HEIGHT=5,DEFAULT_CHART_COLORS=["light-blue","blue","violet","red","orange","yellow","green","light-green","purple","magenta","light-grey","dark-grey"],HEATMAP_COLORS_GREEN=["#ebedf0","#c6e48b","#7bc96f","#239a3b","#196127"],DEFAULT_COLORS={bar:DEFAULT_CHART_COLORS,line:DEFAULT_CHART_COLORS,pie:DEFAULT_CHART_COLORS,percentage:DEFAULT_CHART_COLORS,heatmap:HEATMAP_COLORS_GREEN,donut:DEFAULT_CHART_COLORS},ANGLE_RATIO=Math.PI/180,FULL_ANGLE=360,_createClass$3=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),SvgTip=function(){function t(e){var n=e.parent,i=void 0===n?null:n,a=e.colors,r=void 0===a?[]:a;_classCallCheck$4(this,t),this.parent=i,this.colors=r,this.titleName="",this.titleValue="",this.listValues=[],this.titleValueFirst=0,this.x=0,this.y=0,this.top=0,this.left=0,this.setup();}return _createClass$3(t,[{key:"setup",value:function(){this.makeTooltip();}},{key:"refresh",value:function(){this.fill(),this.calcPosition();}},{key:"makeTooltip",value:function(){var t=this;this.container=$.create("div",{inside:this.parent,className:"graph-svg-tip comparison",innerHTML:'<span class="title"></span>\n\t\t\t\t<ul class="data-point-list"></ul>\n\t\t\t\t<div class="svg-pointer"></div>'}),this.hideTip(),this.title=this.container.querySelector(".title"),this.dataPointList=this.container.querySelector(".data-point-list"),this.parent.addEventListener("mouseleave",function(){t.hideTip();});}},{key:"fill",value:function(){var t=this,e=void 0;this.index&&this.container.setAttribute("data-point-index",this.index),e=this.titleValueFirst?"<strong>"+this.titleValue+"</strong>"+this.titleName:this.titleName+"<strong>"+this.titleValue+"</strong>",this.title.innerHTML=e,this.dataPointList.innerHTML="",this.listValues.map(function(e,n){var i=t.colors[n]||"black",a=0===e.formatted||e.formatted?e.formatted:e.value,r=$.create("li",{styles:{"border-top":"3px solid "+i},innerHTML:'<strong style="display: block;">'+(0===a||a?a:"")+"</strong>\n\t\t\t\t\t"+(e.title?e.title:"")});t.dataPointList.appendChild(r);});}},{key:"calcPosition",value:function(){var t=this.container.offsetWidth;this.top=this.y-this.container.offsetHeight-TOOLTIP_POINTER_TRIANGLE_HEIGHT,this.left=this.x-t/2;var e=this.parent.offsetWidth-t,n=this.container.querySelector(".svg-pointer");if(this.left<0)n.style.left="calc(50% - "+-1*this.left+"px)",this.left=0;else if(this.left>e){var i="calc(50% + "+(this.left-e)+"px)";n.style.left=i,this.left=e;}else n.style.left="50%";}},{key:"setValues",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:-1;this.titleName=n.name,this.titleValue=n.value,this.listValues=i,this.x=t,this.y=e,this.titleValueFirst=n.valueFirst||0,this.index=a,this.refresh();}},{key:"hideTip",value:function(){this.container.style.top="0px",this.container.style.left="0px",this.container.style.opacity="0";}},{key:"showTip",value:function(){this.container.style.top=this.top+"px",this.container.style.left=this.left+"px",this.container.style.opacity="1";}}]),t}(),_typeof$2="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},PRESET_COLOR_MAP={"light-blue":"#7cd6fd",blue:"#5e64ff",violet:"#743ee2",red:"#ff5858",orange:"#ffa00a",yellow:"#feef72",green:"#28a745","light-green":"#98d85b",purple:"#b554ff",magenta:"#ffa3ef",black:"#36114C",grey:"#bdd3e6","light-grey":"#f0f4f7","dark-grey":"#b8c2cc"},getColor=function(t){return /rgb[a]{0,1}\([\d, ]+\)/gim.test(t)?/\D+(\d*)\D+(\d*)\D+(\d*)/gim.exec(t).map(function(t,e){return 0!==e?Number(t).toString(16):"#"}).reduce(function(t,e){return ""+t+e}):PRESET_COLOR_MAP[t]||t},_slicedToArray=function(){function t(t,e){var n=[],i=!0,a=!1,r=void 0;try{for(var o,s=t[Symbol.iterator]();!(i=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);i=!0);}catch(t){a=!0,r=t;}finally{try{!i&&s.return&&s.return();}finally{if(a)throw r}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_typeof$1="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},AXIS_TICK_LENGTH=6,LABEL_MARGIN=4,LABEL_MAX_CHARS=15,FONT_SIZE=10,BASE_LINE_COLOR="#dadada",FONT_FILL="#555b51",makeOverlay={bar:function(t){var e=void 0;"rect"!==t.nodeName&&(e=t.getAttribute("transform"),t=t.childNodes[0]);var n=t.cloneNode();return n.style.fill="#000000",n.style.opacity="0.4",e&&n.setAttribute("transform",e),n},dot:function(t){var e=void 0;"circle"!==t.nodeName&&(e=t.getAttribute("transform"),t=t.childNodes[0]);var n=t.cloneNode(),i=t.getAttribute("r"),a=t.getAttribute("fill");return n.setAttribute("r",parseInt(i)+DOT_OVERLAY_SIZE_INCR),n.setAttribute("fill",a),n.style.opacity="0.6",e&&n.setAttribute("transform",e),n},heat_square:function(t){var e=void 0;"circle"!==t.nodeName&&(e=t.getAttribute("transform"),t=t.childNodes[0]);var n=t.cloneNode(),i=t.getAttribute("r"),a=t.getAttribute("fill");return n.setAttribute("r",parseInt(i)+DOT_OVERLAY_SIZE_INCR),n.setAttribute("fill",a),n.style.opacity="0.6",e&&n.setAttribute("transform",e),n}},updateOverlay={bar:function(t,e){var n=void 0;"rect"!==t.nodeName&&(n=t.getAttribute("transform"),t=t.childNodes[0]);var i=["x","y","width","height"];Object.values(t.attributes).filter(function(t){return i.includes(t.name)&&t.specified}).map(function(t){e.setAttribute(t.name,t.nodeValue);}),n&&e.setAttribute("transform",n);},dot:function(t,e){var n=void 0;"circle"!==t.nodeName&&(n=t.getAttribute("transform"),t=t.childNodes[0]);var i=["cx","cy"];Object.values(t.attributes).filter(function(t){return i.includes(t.name)&&t.specified}).map(function(t){e.setAttribute(t.name,t.nodeValue);}),n&&e.setAttribute("transform",n);},heat_square:function(t,e){var n=void 0;"circle"!==t.nodeName&&(n=t.getAttribute("transform"),t=t.childNodes[0]);var i=["cx","cy"];Object.values(t.attributes).filter(function(t){return i.includes(t.name)&&t.specified}).map(function(t){e.setAttribute(t.name,t.nodeValue);}),n&&e.setAttribute("transform",n);}},_slicedToArray$2=function(){function t(t,e){var n=[],i=!0,a=!1,r=void 0;try{for(var o,s=t[Symbol.iterator]();!(i=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);i=!0);}catch(t){a=!0,r=t;}finally{try{!i&&s.return&&s.return();}finally{if(a)throw r}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),UNIT_ANIM_DUR=350,PATH_ANIM_DUR=350,MARKER_LINE_ANIM_DUR=UNIT_ANIM_DUR,REPLACE_ALL_NEW_DUR=250,STD_EASING="easein",_slicedToArray$1=function(){function t(t,e){var n=[],i=!0,a=!1,r=void 0;try{for(var o,s=t[Symbol.iterator]();!(i=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);i=!0);}catch(t){a=!0,r=t;}finally{try{!i&&s.return&&s.return();}finally{if(a)throw r}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),EASING={ease:"0.25 0.1 0.25 1",linear:"0 0 1 1",easein:"0.1 0.8 0.2 1",easeout:"0 0 0.58 1",easeinout:"0.42 0 0.58 1"},CSSTEXT=".chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ul{padding-left:0;display:flex}.graph-svg-tip ol{padding-left:0;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:' ';border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}",_createClass$2=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),BaseChart=function(){function t(e,n){if(_classCallCheck$3(this,t),n=deepClone(n),this.parent="string"==typeof e?document.querySelector(e):e,!(this.parent instanceof HTMLElement))throw new Error("No `parent` element to render on was provided.");this.rawChartArgs=n,this.title=n.title||"",this.type=n.type||"",this.realData=this.prepareData(n.data),this.data=this.prepareFirstData(this.realData),this.colors=this.validateColors(n.colors,this.type),this.config={showTooltip:1,showLegend:1,isNavigable:n.isNavigable||0,animate:void 0!==n.animate?n.animate:1,truncateLegends:n.truncateLegends||1},this.measures=JSON.parse(JSON.stringify(BASE_MEASURES));var i=this.measures;this.setMeasures(n),this.title.length||(i.titleHeight=0),this.config.showLegend||(i.legendHeight=0),this.argHeight=n.height||i.baseHeight,this.state={},this.options={},this.initTimeout=INIT_CHART_UPDATE_TIMEOUT,this.config.isNavigable&&(this.overlays=[]),this.configure(n);}return _createClass$2(t,[{key:"prepareData",value:function(t){return t}},{key:"prepareFirstData",value:function(t){return t}},{key:"validateColors",value:function(t,e){var n=[];return (t=(t||[]).concat(DEFAULT_COLORS[e])).forEach(function(t){var e=getColor(t);isValidColor(e)?n.push(e):console.warn('"'+t+'" is not a valid color.');}),n}},{key:"setMeasures",value:function(){}},{key:"configure",value:function(){var t=this,e=this.argHeight;this.baseHeight=e,this.height=e-getExtraHeight(this.measures),this.boundDrawFn=function(){return t.draw(!0)},ResizeObserver&&(this.resizeObserver=new ResizeObserver(this.boundDrawFn),this.resizeObserver.observe(this.parent)),window.addEventListener("resize",this.boundDrawFn),window.addEventListener("orientationchange",this.boundDrawFn);}},{key:"destroy",value:function(){this.resizeObserver&&this.resizeObserver.disconnect(),window.removeEventListener("resize",this.boundDrawFn),window.removeEventListener("orientationchange",this.boundDrawFn);}},{key:"setup",value:function(){this.makeContainer(),this.updateWidth(),this.makeTooltip(),this.draw(!1,!0);}},{key:"makeContainer",value:function(){this.parent.innerHTML="";var t={inside:this.parent,className:"chart-container"};this.independentWidth&&(t.styles={width:this.independentWidth+"px"}),this.container=$.create("div",t);}},{key:"makeTooltip",value:function(){this.tip=new SvgTip({parent:this.container,colors:this.colors}),this.bindTooltip();}},{key:"bindTooltip",value:function(){}},{key:"draw",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e&&isHidden(this.parent)||(this.updateWidth(),this.calc(e),this.makeChartArea(),this.setupComponents(),this.components.forEach(function(e){return e.setup(t.drawArea)}),this.render(this.components,!1),n&&(this.data=this.realData,setTimeout(function(){t.update(t.data);},this.initTimeout)),this.renderLegend(),this.setupNavigation(n));}},{key:"calc",value:function(){}},{key:"updateWidth",value:function(){this.baseWidth=getElementContentWidth(this.parent),this.width=this.baseWidth-getExtraWidth(this.measures);}},{key:"makeChartArea",value:function(){this.svg&&this.container.removeChild(this.svg);var t=this.measures;this.svg=makeSVGContainer(this.container,"frappe-chart chart",this.baseWidth,this.baseHeight),this.svgDefs=makeSVGDefs(this.svg),this.title.length&&(this.titleEL=makeText("title",t.margins.left,t.margins.top,this.title,{fontSize:t.titleFontSize,fill:"#666666",dy:t.titleFontSize}));var e=getTopOffset(t);this.drawArea=makeSVGGroup(this.type+"-chart chart-draw-area","translate("+getLeftOffset(t)+", "+e+")"),this.config.showLegend&&(e+=this.height+t.paddings.bottom,this.legendArea=makeSVGGroup("chart-legend","translate("+getLeftOffset(t)+", "+e+")")),this.title.length&&this.svg.appendChild(this.titleEL),this.svg.appendChild(this.drawArea),this.config.showLegend&&this.svg.appendChild(this.legendArea),this.updateTipOffset(getLeftOffset(t),getTopOffset(t));}},{key:"updateTipOffset",value:function(t,e){this.tip.offset={x:t,y:e};}},{key:"setupComponents",value:function(){this.components=new Map;}},{key:"update",value:function(t){t||console.error("No data to update."),this.data=this.prepareData(t),this.calc(),this.render(this.components,this.config.animate),this.renderLegend();}},{key:"render",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.components,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.config.isNavigable&&this.overlays.map(function(t){return t.parentNode.removeChild(t)});var i=[];e.forEach(function(t){i=i.concat(t.update(n));}),i.length>0?(runSMILAnimation(this.container,this.svg,i),setTimeout(function(){e.forEach(function(t){return t.make()}),t.updateNav();},CHART_POST_ANIMATE_TIMEOUT)):(e.forEach(function(t){return t.make()}),this.updateNav());}},{key:"updateNav",value:function(){this.config.isNavigable&&(this.makeOverlay(),this.bindUnits());}},{key:"renderLegend",value:function(){}},{key:"setupNavigation",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.config.isNavigable&&e&&(this.bindOverlay(),this.keyActions={13:this.onEnterKey.bind(this),37:this.onLeftArrow.bind(this),38:this.onUpArrow.bind(this),39:this.onRightArrow.bind(this),40:this.onDownArrow.bind(this)},document.addEventListener("keydown",function(e){isElementInViewport(t.container)&&(e=e||window.event,t.keyActions[e.keyCode]&&t.keyActions[e.keyCode]());}));}},{key:"makeOverlay",value:function(){}},{key:"updateOverlay",value:function(){}},{key:"bindOverlay",value:function(){}},{key:"bindUnits",value:function(){}},{key:"onLeftArrow",value:function(){}},{key:"onRightArrow",value:function(){}},{key:"onUpArrow",value:function(){}},{key:"onDownArrow",value:function(){}},{key:"onEnterKey",value:function(){}},{key:"addDataPoint",value:function(){}},{key:"removeDataPoint",value:function(){}},{key:"getDataPoint",value:function(){}},{key:"setCurrentDataPoint",value:function(){}},{key:"updateDataset",value:function(){}},{key:"export",value:function(){var t=prepareForExport(this.svg);downloadFile(this.title||"Chart",[t]);}}]),t}(),_createClass$1=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_get$1=function t(e,n,i){null===e&&(e=Function.prototype);var a=Object.getOwnPropertyDescriptor(e,n);if(void 0===a){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,n,i)}if("value"in a)return a.value;var o=a.get;if(void 0!==o)return o.call(i)},AggregationChart=function(t){function e(t,n){return _classCallCheck$2(this,e),_possibleConstructorReturn$1(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n))}return _inherits$1(e,t),_createClass$1(e,[{key:"configure",value:function(t){_get$1(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"configure",this).call(this,t),this.config.formatTooltipY=(t.tooltipOptions||{}).formatTooltipY,this.config.maxSlices=t.maxSlices||20,this.config.maxLegendPoints=t.maxLegendPoints||20;}},{key:"calc",value:function(){var t=this,e=this.state,n=this.config.maxSlices;e.sliceTotals=[];var i=this.data.labels.map(function(e,n){var i=0;return t.data.datasets.map(function(t){i+=t.values[n];}),[i,e]}).filter(function(t){return t[0]>=0}),a=i;if(i.length>n){i.sort(function(t,e){return e[0]-t[0]}),a=i.slice(0,n-1);var r=0;i.slice(n-1).map(function(t){r+=t[0];}),a.push([r,"Rest"]),this.colors[n-1]="grey";}e.labels=[],a.map(function(t){e.sliceTotals.push(round(t[0])),e.labels.push(t[1]);}),e.grandTotal=e.sliceTotals.reduce(function(t,e){return t+e},0),this.center={x:this.width/2,y:this.height/2};}},{key:"renderLegend",value:function(){var t=this,e=this.state;this.legendArea.textContent="",this.legendTotals=e.sliceTotals.slice(0,this.config.maxLegendPoints);var n=0,i=0;this.legendTotals.map(function(a,r){var o=150,s=Math.floor((t.width-getExtraWidth(t.measures))/o);t.legendTotals.length<s&&(o=t.width/t.legendTotals.length),n>s&&(n=0,i+=20);var l=o*n+5,u=t.config.truncateLegends?truncateString(e.labels[r],o/10):e.labels[r],c=t.config.formatTooltipY?t.config.formatTooltipY(a):a,h=legendDot(l,i,5,t.colors[r],u+": "+c,!1);t.legendArea.appendChild(h),n++;});}}]),e}(BaseChart),NO_OF_YEAR_MONTHS=12,NO_OF_DAYS_IN_WEEK=7,NO_OF_MILLIS=1e3,SEC_IN_DAY=86400,MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"],DAY_NAMES_SHORT=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],_slicedToArray$3=function(){function t(t,e){var n=[],i=!0,a=!1,r=void 0;try{for(var o,s=t[Symbol.iterator]();!(i=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);i=!0);}catch(t){a=!0,r=t;}finally{try{!i&&s.return&&s.return();}finally{if(a)throw r}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass$4=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),ChartComponent=function(){function t(e){var n=e.layerClass,i=void 0===n?"":n,a=e.layerTransform,r=void 0===a?"":a,o=e.constants,s=e.getData,l=e.makeElements,u=e.animateElements;_classCallCheck$5(this,t),this.layerTransform=r,this.constants=o,this.makeElements=l,this.getData=s,this.animateElements=u,this.store=[],this.labels=[],this.layerClass=i,this.layerClass="function"==typeof this.layerClass?this.layerClass():this.layerClass,this.refresh();}return _createClass$4(t,[{key:"refresh",value:function(t){this.data=t||this.getData();}},{key:"setup",value:function(t){this.layer=makeSVGGroup(this.layerClass,this.layerTransform,t);}},{key:"make",value:function(){this.render(this.data),this.oldData=this.data;}},{key:"render",value:function(t){var e=this;this.store=this.makeElements(t),this.layer.textContent="",this.store.forEach(function(t){e.layer.appendChild(t);}),this.labels.forEach(function(t){e.layer.appendChild(t);});}},{key:"update",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.refresh();var e=[];return t&&(e=this.animateElements(this.data)||[]),e}}]),t}(),componentConfigs={donutSlices:{layerClass:"donut-slices",makeElements:function(t){return t.sliceStrings.map(function(e,n){var i=makePath(e,"donut-path",t.colors[n],"none",t.strokeWidth);return i.style.transition="transform .3s;",i})},animateElements:function(t){return this.store.map(function(e,n){return animatePathStr(e,t.sliceStrings[n])})}},pieSlices:{layerClass:"pie-slices",makeElements:function(t){return t.sliceStrings.map(function(e,n){var i=makePath(e,"pie-path","none",t.colors[n]);return i.style.transition="transform .3s;",i})},animateElements:function(t){return this.store.map(function(e,n){return animatePathStr(e,t.sliceStrings[n])})}},percentageBars:{layerClass:"percentage-bars",makeElements:function(t){var e=this;return t.xPositions.map(function(n,i){return percentageBar(n,0,t.widths[i],e.constants.barHeight,e.constants.barDepth,t.colors[i])})},animateElements:function(t){if(t)return []}},yAxis:{layerClass:"y axis",makeElements:function(t){var e=this;return t.positions.map(function(n,i){return yLine(n,t.labels[i],e.constants.width,{mode:e.constants.mode,pos:e.constants.pos,shortenNumbers:e.constants.shortenNumbers})})},animateElements:function(t){var e=t.positions,n=t.labels,i=this.oldData.positions,a=this.oldData.labels,r=equilizeNoOfElements(i,e),o=_slicedToArray$3(r,2);i=o[0],e=o[1];var s=equilizeNoOfElements(a,n),l=_slicedToArray$3(s,2);return a=l[0],n=l[1],this.render({positions:i,labels:n}),this.store.map(function(t,n){return translateHoriLine(t,e[n],i[n])})}},xAxis:{layerClass:"x axis",makeElements:function(t){var e=this;return t.positions.map(function(n,i){return xLine(n,t.calcLabels[i],e.constants.height,{mode:e.constants.mode,pos:e.constants.pos})})},animateElements:function(t){var e=t.positions,n=t.calcLabels,i=this.oldData.positions,a=this.oldData.calcLabels,r=equilizeNoOfElements(i,e),o=_slicedToArray$3(r,2);i=o[0],e=o[1];var s=equilizeNoOfElements(a,n),l=_slicedToArray$3(s,2);return a=l[0],n=l[1],this.render({positions:i,calcLabels:n}),this.store.map(function(t,n){return translateVertLine(t,e[n],i[n])})}},yMarkers:{layerClass:"y-markers",makeElements:function(t){var e=this;return t.map(function(t){return yMarker(t.position,t.label,e.constants.width,{labelPos:t.options.labelPos,mode:"span",lineType:"dashed"})})},animateElements:function(t){var e=equilizeNoOfElements(this.oldData,t),n=_slicedToArray$3(e,2);this.oldData=n[0];var i=(t=n[1]).map(function(t){return t.position}),a=t.map(function(t){return t.label}),r=t.map(function(t){return t.options}),o=this.oldData.map(function(t){return t.position});return this.render(o.map(function(t,e){return {position:o[e],label:a[e],options:r[e]}})),this.store.map(function(t,e){return translateHoriLine(t,i[e],o[e])})}},yRegions:{layerClass:"y-regions",makeElements:function(t){var e=this;return t.map(function(t){return yRegion(t.startPos,t.endPos,e.constants.width,t.label,{labelPos:t.options.labelPos})})},animateElements:function(t){var e=equilizeNoOfElements(this.oldData,t),n=_slicedToArray$3(e,2);this.oldData=n[0];var i=(t=n[1]).map(function(t){return t.endPos}),a=t.map(function(t){return t.label}),r=t.map(function(t){return t.startPos}),o=t.map(function(t){return t.options}),s=this.oldData.map(function(t){return t.endPos}),l=this.oldData.map(function(t){return t.startPos});this.render(s.map(function(t,e){return {startPos:l[e],endPos:s[e],label:a[e],options:o[e]}}));var u=[];return this.store.map(function(t,e){u=u.concat(animateRegion(t,r[e],i[e],s[e]));}),u}},heatDomain:{layerClass:function(){return "heat-domain domain-"+this.constants.index},makeElements:function(t){var e=this,n=this.constants,i=n.index,a=n.colWidth,r=n.rowHeight,o=n.squareSize,s=n.radius,l=n.xTranslate,u=0;return this.serializedSubDomains=[],t.cols.map(function(t,n){1===n&&e.labels.push(makeText("domain-name",l,-12,getMonthName(i,!0).toUpperCase(),{fontSize:9})),t.map(function(t,n){if(t.fill){var i={"data-date":t.yyyyMmDd,"data-value":t.dataValue,"data-day":n},a=heatSquare("day",l,u,o,s,t.fill,i);e.serializedSubDomains.push(a);}u+=r;}),u=0,l+=a;}),this.serializedSubDomains},animateElements:function(t){if(t)return []}},barGraph:{layerClass:function(){return "dataset-units dataset-bars dataset-"+this.constants.index},makeElements:function(t){var e=this.constants;return this.unitType="bar",this.units=t.yPositions.map(function(n,i){return datasetBar(t.xPositions[i],n,t.barWidth,e.color,t.labels[i],i,t.offsets[i],{zeroLine:t.zeroLine,barsWidth:t.barsWidth,minHeight:e.minHeight})}),this.units},animateElements:function(t){var e=t.xPositions,n=t.yPositions,i=t.offsets,a=t.labels,r=this.oldData.xPositions,o=this.oldData.yPositions,s=this.oldData.offsets,l=this.oldData.labels,u=equilizeNoOfElements(r,e),c=_slicedToArray$3(u,2);r=c[0],e=c[1];var h=equilizeNoOfElements(o,n),d=_slicedToArray$3(h,2);o=d[0],n=d[1];var f=equilizeNoOfElements(s,i),p=_slicedToArray$3(f,2);s=p[0],i=p[1];var v=equilizeNoOfElements(l,a),g=_slicedToArray$3(v,2);l=g[0],a=g[1],this.render({xPositions:r,yPositions:o,offsets:s,labels:a,zeroLine:this.oldData.zeroLine,barsWidth:this.oldData.barsWidth,barWidth:this.oldData.barWidth});var y=[];return this.store.map(function(a,r){y=y.concat(animateBar(a,e[r],n[r],t.barWidth,i[r],{zeroLine:t.zeroLine}));}),y}},lineGraph:{layerClass:function(){return "dataset-units dataset-line dataset-"+this.constants.index},makeElements:function(t){var e=this.constants;return this.unitType="dot",this.paths={},e.hideLine||(this.paths=getPaths(t.xPositions,t.yPositions,e.color,{heatline:e.heatline,regionFill:e.regionFill,spline:e.spline},{svgDefs:e.svgDefs,zeroLine:t.zeroLine})),this.units=[],e.hideDots||(this.units=t.yPositions.map(function(n,i){return datasetDot(t.xPositions[i],n,t.radius,e.color,e.valuesOverPoints?t.values[i]:"",i)})),Object.values(this.paths).concat(this.units)},animateElements:function(t){var e=t.xPositions,n=t.yPositions,i=t.values,a=this.oldData.xPositions,r=this.oldData.yPositions,o=this.oldData.values,s=equilizeNoOfElements(a,e),l=_slicedToArray$3(s,2);a=l[0],e=l[1];var u=equilizeNoOfElements(r,n),c=_slicedToArray$3(u,2);r=c[0],n=c[1];var h=equilizeNoOfElements(o,i),d=_slicedToArray$3(h,2);o=d[0],i=d[1],this.render({xPositions:a,yPositions:r,values:i,zeroLine:this.oldData.zeroLine,radius:this.oldData.radius});var f=[];return Object.keys(this.paths).length&&(f=f.concat(animatePath(this.paths,e,n,t.zeroLine,this.constants.spline))),this.units.length&&this.units.map(function(t,i){f=f.concat(animateDot(t,e[i],n[i]));}),f}}},_createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_get=function t(e,n,i){null===e&&(e=Function.prototype);var a=Object.getOwnPropertyDescriptor(e,n);if(void 0===a){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,n,i)}if("value"in a)return a.value;var o=a.get;if(void 0!==o)return o.call(i)},PercentageChart=function(t){function e(t,n){_classCallCheck$1(this,e);var i=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return i.type="percentage",i.setup(),i}return _inherits(e,t),_createClass(e,[{key:"setMeasures",value:function(t){var e=this.measures;this.barOptions=t.barOptions||{};var n=this.barOptions;n.height=n.height||PERCENTAGE_BAR_DEFAULT_HEIGHT,n.depth=n.depth||PERCENTAGE_BAR_DEFAULT_DEPTH,e.paddings.right=30,e.legendHeight=60,e.baseHeight=8*(n.height+.5*n.depth);}},{key:"setupComponents",value:function(){var t=this.state,e=[["percentageBars",{barHeight:this.barOptions.height,barDepth:this.barOptions.depth},function(){return {xPositions:t.xPositions,widths:t.widths,colors:this.colors}}.bind(this)]];this.components=new Map(e.map(function(t){var e=getComponent.apply(void 0,_toConsumableArray(t));return [t[0],e]}));}},{key:"calc",value:function(){var t=this;_get(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"calc",this).call(this);var n=this.state;n.xPositions=[],n.widths=[];var i=0;n.sliceTotals.map(function(e){var a=t.width*e/n.grandTotal;n.widths.push(a),n.xPositions.push(i),i+=a;});}},{key:"makeDataByIndex",value:function(){}},{key:"bindTooltip",value:function(){var t=this,e=this.state;this.container.addEventListener("mousemove",function(n){var i=t.components.get("percentageBars").store,a=n.target;if(i.includes(a)){var r=i.indexOf(a),o=getOffset(t.container),s=getOffset(a),l=s.left-o.left+parseInt(a.getAttribute("width"))/2,u=s.top-o.top,c=(t.formattedLabels&&t.formattedLabels.length>0?t.formattedLabels[r]:t.state.labels[r])+": ",h=e.sliceTotals[r]/e.grandTotal;t.tip.setValues(l,u,{name:c,value:(100*h).toFixed(1)+"%"}),t.tip.showTip();}});}}]),e}(AggregationChart),_createClass$5=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_get$2=function t(e,n,i){null===e&&(e=Function.prototype);var a=Object.getOwnPropertyDescriptor(e,n);if(void 0===a){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,n,i)}if("value"in a)return a.value;var o=a.get;if(void 0!==o)return o.call(i)},PieChart=function(t){function e(t,n){_classCallCheck$6(this,e);var i=_possibleConstructorReturn$2(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return i.type="pie",i.initTimeout=0,i.init=1,i.setup(),i}return _inherits$2(e,t),_createClass$5(e,[{key:"configure",value:function(t){_get$2(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"configure",this).call(this,t),this.mouseMove=this.mouseMove.bind(this),this.mouseLeave=this.mouseLeave.bind(this),this.hoverRadio=t.hoverRadio||.1,this.config.startAngle=t.startAngle||0,this.clockWise=t.clockWise||!1;}},{key:"calc",value:function(){var t=this;_get$2(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"calc",this).call(this);var n=this.state;this.radius=this.height>this.width?this.center.x:this.center.y;var i=this.radius,a=this.clockWise,r=n.slicesProperties||[];n.sliceStrings=[],n.slicesProperties=[];var o=180-this.config.startAngle;n.sliceTotals.map(function(e,s){var l=o,u=e/n.grandTotal*FULL_ANGLE,c=u>180?1:0,h=a?-u:u,d=o+=h,f=getPositionByAngle(l,i),p=getPositionByAngle(d,i),v=t.init&&r[s],g=void 0,y=void 0;t.init?(g=v?v.startPosition:f,y=v?v.endPosition:f):(g=f,y=p);var m=360===u?makeCircleStr(g,y,t.center,t.radius,a,c):makeArcPathStr(g,y,t.center,t.radius,a,c);n.sliceStrings.push(m),n.slicesProperties.push({startPosition:f,endPosition:p,value:e,total:n.grandTotal,startAngle:l,endAngle:d,angle:h});}),this.init=0;}},{key:"setupComponents",value:function(){var t=this.state,e=[["pieSlices",{},function(){return {sliceStrings:t.sliceStrings,colors:this.colors}}.bind(this)]];this.components=new Map(e.map(function(t){var e=getComponent.apply(void 0,_toConsumableArray$2(t));return [t[0],e]}));}},{key:"calTranslateByAngle",value:function(t){var e=this.radius,n=this.hoverRadio,i=getPositionByAngle(t.startAngle+t.angle/2,e);return "translate3d("+i.x*n+"px,"+i.y*n+"px,0)"}},{key:"hoverSlice",value:function(t,e,n,i){if(t){var a=this.colors[e];if(n){transform(t,this.calTranslateByAngle(this.state.slicesProperties[e])),t.style.fill=lightenDarkenColor(a,50);var r=getOffset(this.svg),o=i.pageX-r.left+10,s=i.pageY-r.top-10,l=(this.formatted_labels&&this.formatted_labels.length>0?this.formatted_labels[e]:this.state.labels[e])+": ",u=(100*this.state.sliceTotals[e]/this.state.grandTotal).toFixed(1);this.tip.setValues(o,s,{name:l,value:u+"%"}),this.tip.showTip();}else transform(t,"translate3d(0,0,0)"),this.tip.hideTip(),t.style.fill=a;}}},{key:"bindTooltip",value:function(){this.container.addEventListener("mousemove",this.mouseMove),this.container.addEventListener("mouseleave",this.mouseLeave);}},{key:"mouseMove",value:function(t){var e=t.target,n=this.components.get("pieSlices").store,i=this.curActiveSliceIndex,a=this.curActiveSlice;if(n.includes(e)){var r=n.indexOf(e);this.hoverSlice(a,i,!1),this.curActiveSlice=e,this.curActiveSliceIndex=r,this.hoverSlice(e,r,!0,t);}else this.mouseLeave();}},{key:"mouseLeave",value:function(){this.hoverSlice(this.curActiveSlice,this.curActiveSliceIndex,!1);}}]),e}(AggregationChart),_slicedToArray$4=function(){function t(t,e){var n=[],i=!0,a=!1,r=void 0;try{for(var o,s=t[Symbol.iterator]();!(i=(o=s.next()).done)&&(n.push(o.value),!e||n.length!==e);i=!0);}catch(t){a=!0,r=t;}finally{try{!i&&s.return&&s.return();}finally{if(a)throw r}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass$6=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),COL_WIDTH=HEATMAP_SQUARE_SIZE+HEATMAP_GUTTER_SIZE,ROW_HEIGHT=COL_WIDTH,Heatmap=function(t){function e(t,n){_classCallCheck$7(this,e);var i=_possibleConstructorReturn$3(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));i.type="heatmap",i.countLabel=n.countLabel||"";var a=["Sunday","Monday"],r=a.includes(n.startSubDomain)?n.startSubDomain:"Sunday";return i.startSubDomainIndex=a.indexOf(r),i.setup(),i}return _inherits$3(e,t),_createClass$6(e,[{key:"setMeasures",value:function(t){var e=this.measures;this.discreteDomains=0===t.discreteDomains?0:1,e.paddings.top=3*ROW_HEIGHT,e.paddings.bottom=0,e.legendHeight=2*ROW_HEIGHT,e.baseHeight=ROW_HEIGHT*NO_OF_DAYS_IN_WEEK+getExtraHeight(e);var n=this.data,i=this.discreteDomains?NO_OF_YEAR_MONTHS:0;this.independentWidth=(getWeeksBetween(n.start,n.end)+i)*COL_WIDTH+getExtraWidth(e);}},{key:"updateWidth",value:function(){var t=this.discreteDomains?NO_OF_YEAR_MONTHS:0,e=this.state.noOfWeeks?this.state.noOfWeeks:52;this.baseWidth=(e+t)*COL_WIDTH+getExtraWidth(this.measures);}},{key:"prepareData",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data;if(t.start&&t.end&&t.start>t.end)throw new Error("Start date cannot be greater than end date.");if(t.start||(t.start=new Date,t.start.setFullYear(t.start.getFullYear()-1)),t.end||(t.end=new Date),t.dataPoints=t.dataPoints||{},parseInt(Object.keys(t.dataPoints)[0])>1e5){var e={};Object.keys(t.dataPoints).forEach(function(n){var i=new Date(n*NO_OF_MILLIS);e[getYyyyMmDd(i)]=t.dataPoints[n];}),t.dataPoints=e;}return t}},{key:"calc",value:function(){var t=this.state;t.start=clone(this.data.start),t.end=clone(this.data.end),t.firstWeekStart=clone(t.start),t.noOfWeeks=getWeeksBetween(t.start,t.end),t.distribution=calcDistribution(Object.values(this.data.dataPoints),HEATMAP_DISTRIBUTION_SIZE),t.domainConfigs=this.getDomains();}},{key:"setupComponents",value:function(){var t=this,e=this.state,n=this.discreteDomains?0:1,i=e.domainConfigs.map(function(i,a){return ["heatDomain",{index:i.index,colWidth:COL_WIDTH,rowHeight:ROW_HEIGHT,squareSize:HEATMAP_SQUARE_SIZE,radius:t.rawChartArgs.radius||0,xTranslate:e.domainConfigs.filter(function(t,e){return e<a}).map(function(t){return t.cols.length-n}).reduce(function(t,e){return t+e},0)*COL_WIDTH},function(){return e.domainConfigs[a]}.bind(t)]});this.components=new Map(i.map(function(t,e){var n=getComponent.apply(void 0,_toConsumableArray$3(t));return [t[0]+"-"+e,n]}));var a=0;DAY_NAMES_SHORT.forEach(function(e,n){if([1,3,5].includes(n)){var i=makeText("subdomain-name",-COL_WIDTH/2,a,e,{fontSize:HEATMAP_SQUARE_SIZE,dy:8,textAnchor:"end"});t.drawArea.appendChild(i);}a+=ROW_HEIGHT;});}},{key:"update",value:function(t){t||console.error("No data to update."),this.data=this.prepareData(t),this.draw(),this.bindTooltip();}},{key:"bindTooltip",value:function(){var t=this;this.container.addEventListener("mousemove",function(e){t.components.forEach(function(n){var i=n.store,a=e.target;if(i.includes(a)){var r=a.getAttribute("data-value"),o=a.getAttribute("data-date").split("-"),s=getMonthName(parseInt(o[1])-1,!0),l=t.container.getBoundingClientRect(),u=a.getBoundingClientRect(),c=parseInt(e.target.getAttribute("width")),h=u.left-l.left+c/2,d=u.top-l.top,f=r+" "+t.countLabel,p=" on "+s+" "+o[0]+", "+o[2];t.tip.setValues(h,d,{name:p,value:f,valueFirst:1},[]),t.tip.showTip();}});});}},{key:"renderLegend",value:function(){var t=this;this.legendArea.textContent="";var e=0,n=ROW_HEIGHT,i=this.rawChartArgs.radius||0,a=makeText("subdomain-name",e,n,"Less",{fontSize:HEATMAP_SQUARE_SIZE+1,dy:9});e=2*COL_WIDTH+COL_WIDTH/2,this.legendArea.appendChild(a),this.colors.slice(0,HEATMAP_DISTRIBUTION_SIZE).map(function(a,r){var o=heatSquare("heatmap-legend-unit",e+(COL_WIDTH+3)*r,n,HEATMAP_SQUARE_SIZE,i,a);t.legendArea.appendChild(o);});var r=makeText("subdomain-name",e+HEATMAP_DISTRIBUTION_SIZE*(COL_WIDTH+3)+COL_WIDTH/4,n,"More",{fontSize:HEATMAP_SQUARE_SIZE+1,dy:9});this.legendArea.appendChild(r);}},{key:"getDomains",value:function(){for(var t=this.state,e=[t.start.getMonth(),t.start.getFullYear()],n=e[0],i=e[1],a=[t.end.getMonth(),t.end.getFullYear()],r=a[0]-n+1+12*(a[1]-i),o=[],s=clone(t.start),l=0;l<r;l++){var u=t.end;if(!areInSameMonth(s,t.end)){var c=[s.getMonth(),s.getFullYear()];u=getLastDateInMonth(c[0],c[1]);}o.push(this.getDomainConfig(s,u)),addDays(u,1),s=u;}return o}},{key:"getDomainConfig",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=[t.getMonth(),t.getFullYear()],i=n[0],a=n[1],r=setDayToSunday(t),o={index:i,cols:[]};addDays(e=clone(e)||getLastDateInMonth(i,a),1);for(var s=getWeeksBetween(r,e),l=[],u=void 0,c=0;c<s;c++)u=this.getCol(r,i),l.push(u),addDays(r=new Date(u[NO_OF_DAYS_IN_WEEK-1].yyyyMmDd),1);return void 0!==u[NO_OF_DAYS_IN_WEEK-1].dataValue&&(addDays(r,1),l.push(this.getCol(r,i,!0))),o.cols=l,o}},{key:"getCol",value:function(t,e){for(var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=this.state,a=clone(t),r=[],o=0;o<NO_OF_DAYS_IN_WEEK;o++,addDays(a,1)){var s={},l=a>=i.start&&a<=i.end;n||a.getMonth()!==e||!l?s.yyyyMmDd=getYyyyMmDd(a):s=this.getSubDomainConfig(a),r.push(s);}return r}},{key:"getSubDomainConfig",value:function(t){var e=getYyyyMmDd(t),n=this.data.dataPoints[e];return {yyyyMmDd:e,dataValue:n||0,fill:this.colors[getMaxCheckpoint(n,this.state.distribution)]}}}]),e}(BaseChart),_createClass$7=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_get$3=function t(e,n,i){null===e&&(e=Function.prototype);var a=Object.getOwnPropertyDescriptor(e,n);if(void 0===a){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,n,i)}if("value"in a)return a.value;var o=a.get;if(void 0!==o)return o.call(i)},AxisChart=function(t){function e(t,n){_classCallCheck$8(this,e);var i=_possibleConstructorReturn$4(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return i.barOptions=n.barOptions||{},i.lineOptions=n.lineOptions||{},i.type=n.type||"line",i.init=1,i.setup(),i}return _inherits$4(e,t),_createClass$7(e,[{key:"setMeasures",value:function(){this.data.datasets.length<=1&&(this.config.showLegend=0,this.measures.paddings.bottom=30);}},{key:"configure",value:function(t){_get$3(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"configure",this).call(this,t),t.axisOptions=t.axisOptions||{},t.tooltipOptions=t.tooltipOptions||{},this.config.xAxisMode=t.axisOptions.xAxisMode||"span",this.config.yAxisMode=t.axisOptions.yAxisMode||"span",this.config.xIsSeries=t.axisOptions.xIsSeries||0,this.config.shortenYAxisNumbers=t.axisOptions.shortenYAxisNumbers||0,this.config.formatTooltipX=t.tooltipOptions.formatTooltipX,this.config.formatTooltipY=t.tooltipOptions.formatTooltipY,this.config.valuesOverPoints=t.valuesOverPoints;}},{key:"prepareData",value:function(){return dataPrep(arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data,this.type)}},{key:"prepareFirstData",value:function(){return zeroDataPrep(arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.data)}},{key:"calc",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.calcXPositions(),t||this.calcYAxisParameters(this.getAllYValues(),"line"===this.type),this.makeDataByIndex();}},{key:"calcXPositions",value:function(){var t=this.state,e=this.data.labels;t.datasetLength=e.length,t.unitWidth=this.width/t.datasetLength,t.xOffset=t.unitWidth/2,t.xAxis={labels:e,positions:e.map(function(e,n){return floatTwo(t.xOffset+n*t.unitWidth)})};}},{key:"calcYAxisParameters",value:function(t){var e=calcChartIntervals(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:"false"),n=this.height/getValueRange(e),i=getIntervalSize(e)*n,a=this.height-getZeroIndex(e)*i;this.state.yAxis={labels:e,positions:e.map(function(t){return a-t*n}),scaleMultiplier:n,zeroLine:a},this.calcDatasetPoints(),this.calcYExtremes(),this.calcYRegions();}},{key:"calcDatasetPoints",value:function(){var t=this.state,e=function(e){return e.map(function(e){return scale(e,t.yAxis)})};t.datasets=this.data.datasets.map(function(t,n){var i=t.values,a=t.cumulativeYs||[];return {name:t.name&&t.name.replace(/<|>|&/g,function(t){return "&"==t?"&amp;":"<"==t?"&lt;":"&gt;"}),index:n,chartType:t.chartType,values:i,yPositions:e(i),cumulativeYs:a,cumulativeYPos:e(a)}});}},{key:"calcYExtremes",value:function(){var t=this.state;if(this.barOptions.stacked)return void(t.yExtremes=t.datasets[t.datasets.length-1].cumulativeYPos);t.yExtremes=new Array(t.datasetLength).fill(9999),t.datasets.map(function(e){e.yPositions.map(function(e,n){e<t.yExtremes[n]&&(t.yExtremes[n]=e);});});}},{key:"calcYRegions",value:function(){var t=this.state;this.data.yMarkers&&(this.state.yMarkers=this.data.yMarkers.map(function(e){return e.position=scale(e.value,t.yAxis),e.options||(e.options={}),e})),this.data.yRegions&&(this.state.yRegions=this.data.yRegions.map(function(e){return e.startPos=scale(e.start,t.yAxis),e.endPos=scale(e.end,t.yAxis),e.options||(e.options={}),e}));}},{key:"getAllYValues",value:function(){var t,e=this,n="values";if(this.barOptions.stacked){n="cumulativeYs";var i=new Array(this.state.datasetLength).fill(0);this.data.datasets.map(function(t,a){var r=e.data.datasets[a].values;t[n]=i=i.map(function(t,e){return t+r[e]});});}var a=this.data.datasets.map(function(t){return t[n]});return this.data.yMarkers&&a.push(this.data.yMarkers.map(function(t){return t.value})),this.data.yRegions&&this.data.yRegions.map(function(t){a.push([t.end,t.start]);}),(t=[]).concat.apply(t,_toConsumableArray$5(a))}},{key:"setupComponents",value:function(){var t=this,e=[["yAxis",{mode:this.config.yAxisMode,width:this.width,shortenNumbers:this.config.shortenYAxisNumbers},function(){return this.state.yAxis}.bind(this)],["xAxis",{mode:this.config.xAxisMode,height:this.height},function(){var t=this.state;return t.xAxis.calcLabels=getShortenedLabels(this.width,t.xAxis.labels,this.config.xIsSeries),t.xAxis}.bind(this)],["yRegions",{width:this.width,pos:"right"},function(){return this.state.yRegions}.bind(this)]],n=this.state.datasets.filter(function(t){return "bar"===t.chartType}),i=this.state.datasets.filter(function(t){return "line"===t.chartType}),a=n.map(function(e){var i=e.index;return ["barGraph-"+e.index,{index:i,color:t.colors[i],stacked:t.barOptions.stacked,valuesOverPoints:t.config.valuesOverPoints,minHeight:t.height*MIN_BAR_PERCENT_HEIGHT},function(){var t=this.state,e=t.datasets[i],a=this.barOptions.stacked,r=this.barOptions.spaceRatio||BAR_CHART_SPACE_RATIO,o=t.unitWidth*(1-r),s=o/(a?1:n.length),l=t.xAxis.positions.map(function(t){return t-o/2});a||(l=l.map(function(t){return t+s*i}));var u=new Array(t.datasetLength).fill("");this.config.valuesOverPoints&&(u=a&&e.index===t.datasets.length-1?e.cumulativeYs:e.values);var c=new Array(t.datasetLength).fill(0);return a&&(c=e.yPositions.map(function(t,n){return t-e.cumulativeYPos[n]})),{xPositions:l,yPositions:e.yPositions,offsets:c,labels:u,zeroLine:t.yAxis.zeroLine,barsWidth:o,barWidth:s}}.bind(t)]}),r=i.map(function(e){var n=e.index;return ["lineGraph-"+e.index,{index:n,color:t.colors[n],svgDefs:t.svgDefs,heatline:t.lineOptions.heatline,regionFill:t.lineOptions.regionFill,spline:t.lineOptions.spline,hideDots:t.lineOptions.hideDots,hideLine:t.lineOptions.hideLine,valuesOverPoints:t.config.valuesOverPoints},function(){var t=this.state,e=t.datasets[n],i=t.yAxis.positions[0]<t.yAxis.zeroLine?t.yAxis.positions[0]:t.yAxis.zeroLine;return {xPositions:t.xAxis.positions,yPositions:e.yPositions,values:e.values,zeroLine:i,radius:this.lineOptions.dotSize||LINE_CHART_DOT_SIZE}}.bind(t)]}),o=[["yMarkers",{width:this.width,pos:"right"},function(){return this.state.yMarkers}.bind(this)]];e=e.concat(a,r,o);var s=["yMarkers","yRegions"];this.dataUnitComponents=[],this.components=new Map(e.filter(function(e){return !s.includes(e[0])||t.state[e[0]]}).map(function(e){var n=getComponent.apply(void 0,_toConsumableArray$5(e));return (e[0].includes("lineGraph")||e[0].includes("barGraph"))&&t.dataUnitComponents.push(n),[e[0],n]}));}},{key:"makeDataByIndex",value:function(){var t=this;this.dataByIndex={};var e=this.state,n=this.config.formatTooltipX,i=this.config.formatTooltipY;e.xAxis.labels.map(function(a,r){var o=t.state.datasets.map(function(e,n){var a=e.values[r];return {title:e.name,value:a,yPos:e.yPositions[r],color:t.colors[n],formatted:i?i(a):a}});t.dataByIndex[r]={label:a,formattedLabel:n?n(a):a,xPos:e.xAxis.positions[r],values:o,yExtreme:e.yExtremes[r]};});}},{key:"bindTooltip",value:function(){var t=this;this.container.addEventListener("mousemove",function(e){var n=t.measures,i=getOffset(t.container),a=e.pageX-i.left-getLeftOffset(n),r=e.pageY-i.top;r<t.height+getTopOffset(n)&&r>getTopOffset(n)?t.mapTooltipXPosition(a):t.tip.hideTip();});}},{key:"mapTooltipXPosition",value:function(t){var e=this.state;if(e.yExtremes){var n=getClosestInArray(t,e.xAxis.positions,!0);if(n>=0){var i=this.dataByIndex[n];this.tip.setValues(i.xPos+this.tip.offset.x,i.yExtreme+this.tip.offset.y,{name:i.formattedLabel,value:""},i.values,n),this.tip.showTip();}}}},{key:"renderLegend",value:function(){var t=this,e=this.data;e.datasets.length>1&&(this.legendArea.textContent="",e.datasets.map(function(e,n){var i=AXIS_LEGEND_BAR_SIZE,a=legendBar(i*n,"0",i,t.colors[n],e.name,t.config.truncateLegends);t.legendArea.appendChild(a);}));}},{key:"makeOverlay",value:function(){var t=this;if(this.init)return void(this.init=0);this.overlayGuides&&this.overlayGuides.forEach(function(t){var e=t.overlay;e.parentNode.removeChild(e);}),this.overlayGuides=this.dataUnitComponents.map(function(t){return {type:t.unitType,overlay:void 0,units:t.units}}),void 0===this.state.currentIndex&&(this.state.currentIndex=this.state.datasetLength-1),this.overlayGuides.map(function(e){var n=e.units[t.state.currentIndex];e.overlay=makeOverlay[e.type](n),t.drawArea.appendChild(e.overlay);});}},{key:"updateOverlayGuides",value:function(){this.overlayGuides&&this.overlayGuides.forEach(function(t){var e=t.overlay;e.parentNode.removeChild(e);});}},{key:"bindOverlay",value:function(){var t=this;this.parent.addEventListener("data-select",function(){t.updateOverlay();});}},{key:"bindUnits",value:function(){var t=this;this.dataUnitComponents.map(function(e){e.units.map(function(e){e.addEventListener("click",function(){var n=e.getAttribute("data-point-index");t.setCurrentDataPoint(n);});});}),this.tip.container.addEventListener("click",function(){var e=t.tip.container.getAttribute("data-point-index");t.setCurrentDataPoint(e);});}},{key:"updateOverlay",value:function(){var t=this;this.overlayGuides.map(function(e){var n=e.units[t.state.currentIndex];updateOverlay[e.type](n,e.overlay);});}},{key:"onLeftArrow",value:function(){this.setCurrentDataPoint(this.state.currentIndex-1);}},{key:"onRightArrow",value:function(){this.setCurrentDataPoint(this.state.currentIndex+1);}},{key:"getDataPoint",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.state.currentIndex,e=this.state;return {index:t,label:e.xAxis.labels[t],values:e.datasets.map(function(e){return e.values[t]})}}},{key:"setCurrentDataPoint",value:function(t){var e=this.state;(t=parseInt(t))<0&&(t=0),t>=e.xAxis.labels.length&&(t=e.xAxis.labels.length-1),t!==e.currentIndex&&(e.currentIndex=t,fire(this.parent,"data-select",this.getDataPoint()));}},{key:"addDataPoint",value:function(t,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.state.datasetLength;_get$3(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"addDataPoint",this).call(this,t,n,i),this.data.labels.splice(i,0,t),this.data.datasets.map(function(t,e){t.values.splice(i,0,n[e]);}),this.update(this.data);}},{key:"removeDataPoint",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.state.datasetLength-1;this.data.labels.length<=1||(_get$3(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"removeDataPoint",this).call(this,t),this.data.labels.splice(t,1),this.data.datasets.map(function(e){e.values.splice(t,1);}),this.update(this.data));}},{key:"updateDataset",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.data.datasets[e].values=t,this.update(this.data);}},{key:"updateDatasets",value:function(t){this.data.datasets.map(function(e,n){t[n]&&(e.values=t[n]);}),this.update(this.data);}}]),e}(BaseChart),_createClass$8=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_get$4=function t(e,n,i){null===e&&(e=Function.prototype);var a=Object.getOwnPropertyDescriptor(e,n);if(void 0===a){var r=Object.getPrototypeOf(e);return null===r?void 0:t(r,n,i)}if("value"in a)return a.value;var o=a.get;if(void 0!==o)return o.call(i)},DonutChart=function(t){function e(t,n){_classCallCheck$9(this,e);var i=_possibleConstructorReturn$5(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return i.type="donut",i.initTimeout=0,i.init=1,i.setup(),i}return _inherits$5(e,t),_createClass$8(e,[{key:"configure",value:function(t){_get$4(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"configure",this).call(this,t),this.mouseMove=this.mouseMove.bind(this),this.mouseLeave=this.mouseLeave.bind(this),this.hoverRadio=t.hoverRadio||.1,this.config.startAngle=t.startAngle||0,this.clockWise=t.clockWise||!1,this.strokeWidth=t.strokeWidth||30;}},{key:"calc",value:function(){var t=this;_get$4(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"calc",this).call(this);var n=this.state;this.radius=this.height>this.width?this.center.x-this.strokeWidth/2:this.center.y-this.strokeWidth/2;var i=this.radius,a=this.clockWise,r=n.slicesProperties||[];n.sliceStrings=[],n.slicesProperties=[];var o=180-this.config.startAngle;n.sliceTotals.map(function(e,s){var l=o,u=e/n.grandTotal*FULL_ANGLE,c=u>180?1:0,h=a?-u:u,d=o+=h,f=getPositionByAngle(l,i),p=getPositionByAngle(d,i),v=t.init&&r[s],g=void 0,y=void 0;t.init?(g=v?v.startPosition:f,y=v?v.endPosition:f):(g=f,y=p);var m=360===u?makeStrokeCircleStr(g,y,t.center,t.radius,t.clockWise,c):makeArcStrokePathStr(g,y,t.center,t.radius,t.clockWise,c);n.sliceStrings.push(m),n.slicesProperties.push({startPosition:f,endPosition:p,value:e,total:n.grandTotal,startAngle:l,endAngle:d,angle:h});}),this.init=0;}},{key:"setupComponents",value:function(){var t=this.state,e=[["donutSlices",{},function(){return {sliceStrings:t.sliceStrings,colors:this.colors,strokeWidth:this.strokeWidth}}.bind(this)]];this.components=new Map(e.map(function(t){var e=getComponent.apply(void 0,_toConsumableArray$7(t));return [t[0],e]}));}},{key:"calTranslateByAngle",value:function(t){var e=this.radius,n=this.hoverRadio,i=getPositionByAngle(t.startAngle+t.angle/2,e);return "translate3d("+i.x*n+"px,"+i.y*n+"px,0)"}},{key:"hoverSlice",value:function(t,e,n,i){if(t){var a=this.colors[e];if(n){transform(t,this.calTranslateByAngle(this.state.slicesProperties[e])),t.style.stroke=lightenDarkenColor(a,50);var r=getOffset(this.svg),o=i.pageX-r.left+10,s=i.pageY-r.top-10,l=(this.formatted_labels&&this.formatted_labels.length>0?this.formatted_labels[e]:this.state.labels[e])+": ",u=(100*this.state.sliceTotals[e]/this.state.grandTotal).toFixed(1);this.tip.setValues(o,s,{name:l,value:u+"%"}),this.tip.showTip();}else transform(t,"translate3d(0,0,0)"),this.tip.hideTip(),t.style.stroke=a;}}},{key:"bindTooltip",value:function(){this.container.addEventListener("mousemove",this.mouseMove),this.container.addEventListener("mouseleave",this.mouseLeave);}},{key:"mouseMove",value:function(t){var e=t.target,n=this.components.get("donutSlices").store,i=this.curActiveSliceIndex,a=this.curActiveSlice;if(n.includes(e)){var r=n.indexOf(e);this.hoverSlice(a,i,!1),this.curActiveSlice=e,this.curActiveSliceIndex=r,this.hoverSlice(e,r,!0,t);}else this.mouseLeave();}},{key:"mouseLeave",value:function(){this.hoverSlice(this.curActiveSlice,this.curActiveSliceIndex,!1);}}]),e}(AggregationChart),chartTypes={bar:AxisChart,line:AxisChart,percentage:PercentageChart,heatmap:Heatmap,pie:PieChart,donut:DonutChart},Chart=function t(e,n){return _classCallCheck(this,t),getChartByType(n.type,e,n)};exports.Chart=Chart,exports.PercentageChart=PercentageChart,exports.PieChart=PieChart,exports.Heatmap=Heatmap,exports.AxisChart=AxisChart;

    });

    /* node_modules/svelte-frappe-charts/src/components/base.svelte generated by Svelte v3.59.2 */
    const file$5 = "node_modules/svelte-frappe-charts/src/components/base.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$5, 89, 0, 2072);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[18](div);

    			if (!mounted) {
    				dispose = listen_dev(div, "data-select", /*data_select_handler*/ ctx[17], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[18](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Base', slots, []);

    	let { data = {
    		labels: [],
    		datasets: [{ values: [] }],
    		yMarkers: {},
    		yRegions: []
    	} } = $$props;

    	let { title = '' } = $$props;
    	let { type = 'line' } = $$props;
    	let { height = 300 } = $$props;
    	let { animate = true } = $$props;
    	let { axisOptions = {} } = $$props;
    	let { barOptions = {} } = $$props;
    	let { lineOptions = {} } = $$props;
    	let { tooltipOptions = {} } = $$props;
    	let { colors = [] } = $$props;
    	let { valuesOverPoints = 0 } = $$props;
    	let { isNavigable = false } = $$props;
    	let { maxSlices = 3 } = $$props;

    	/**
     *  COMPONENT
     */
    	//  The Chart returned from frappe
    	let chart = null;

    	//  DOM node for frappe to latch onto
    	let chartRef;

    	//  Helper HOF for calling a fn only if chart exists
    	function ifChartThen(fn) {
    		return function ifChart(...args) {
    			if (chart) {
    				return fn(...args);
    			}
    		};
    	}

    	const addDataPoint = ifChartThen((label, valueFromEachDataset, index) => chart.addDataPoint(label, valueFromEachDataset, index));
    	const removeDataPoint = ifChartThen(index => chart.removeDataPoint(index));
    	const exportChart = ifChartThen(() => chart.export());

    	//  Update the chart when incoming data changes
    	const updateChart = ifChartThen(newData => chart.update(newData));

    	/**
     *  Handle initializing the chart when this Svelte component mounts
     */
    	onMount(() => {
    		chart = new frappeCharts_min_cjs.Chart(chartRef,
    		{
    				data,
    				title,
    				type,
    				height,
    				animate,
    				colors,
    				axisOptions,
    				barOptions,
    				lineOptions,
    				tooltipOptions,
    				valuesOverPoints,
    				isNavigable,
    				maxSlices
    			});
    	});

    	//  Mark Chart references for garbage collection when component is unmounted
    	onDestroy(() => {
    		chart = null;
    	});

    	const writable_props = [
    		'data',
    		'title',
    		'type',
    		'height',
    		'animate',
    		'axisOptions',
    		'barOptions',
    		'lineOptions',
    		'tooltipOptions',
    		'colors',
    		'valuesOverPoints',
    		'isNavigable',
    		'maxSlices'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Base> was created with unknown prop '${key}'`);
    	});

    	function data_select_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chartRef = $$value;
    			$$invalidate(0, chartRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('animate' in $$props) $$invalidate(5, animate = $$props.animate);
    		if ('axisOptions' in $$props) $$invalidate(6, axisOptions = $$props.axisOptions);
    		if ('barOptions' in $$props) $$invalidate(7, barOptions = $$props.barOptions);
    		if ('lineOptions' in $$props) $$invalidate(8, lineOptions = $$props.lineOptions);
    		if ('tooltipOptions' in $$props) $$invalidate(9, tooltipOptions = $$props.tooltipOptions);
    		if ('colors' in $$props) $$invalidate(10, colors = $$props.colors);
    		if ('valuesOverPoints' in $$props) $$invalidate(11, valuesOverPoints = $$props.valuesOverPoints);
    		if ('isNavigable' in $$props) $$invalidate(12, isNavigable = $$props.isNavigable);
    		if ('maxSlices' in $$props) $$invalidate(13, maxSlices = $$props.maxSlices);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		Chart: frappeCharts_min_cjs.Chart,
    		data,
    		title,
    		type,
    		height,
    		animate,
    		axisOptions,
    		barOptions,
    		lineOptions,
    		tooltipOptions,
    		colors,
    		valuesOverPoints,
    		isNavigable,
    		maxSlices,
    		chart,
    		chartRef,
    		ifChartThen,
    		addDataPoint,
    		removeDataPoint,
    		exportChart,
    		updateChart
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('animate' in $$props) $$invalidate(5, animate = $$props.animate);
    		if ('axisOptions' in $$props) $$invalidate(6, axisOptions = $$props.axisOptions);
    		if ('barOptions' in $$props) $$invalidate(7, barOptions = $$props.barOptions);
    		if ('lineOptions' in $$props) $$invalidate(8, lineOptions = $$props.lineOptions);
    		if ('tooltipOptions' in $$props) $$invalidate(9, tooltipOptions = $$props.tooltipOptions);
    		if ('colors' in $$props) $$invalidate(10, colors = $$props.colors);
    		if ('valuesOverPoints' in $$props) $$invalidate(11, valuesOverPoints = $$props.valuesOverPoints);
    		if ('isNavigable' in $$props) $$invalidate(12, isNavigable = $$props.isNavigable);
    		if ('maxSlices' in $$props) $$invalidate(13, maxSlices = $$props.maxSlices);
    		if ('chart' in $$props) chart = $$props.chart;
    		if ('chartRef' in $$props) $$invalidate(0, chartRef = $$props.chartRef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 2) {
    			updateChart(data);
    		}
    	};

    	return [
    		chartRef,
    		data,
    		title,
    		type,
    		height,
    		animate,
    		axisOptions,
    		barOptions,
    		lineOptions,
    		tooltipOptions,
    		colors,
    		valuesOverPoints,
    		isNavigable,
    		maxSlices,
    		addDataPoint,
    		removeDataPoint,
    		exportChart,
    		data_select_handler,
    		div_binding
    	];
    }

    class Base extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			data: 1,
    			title: 2,
    			type: 3,
    			height: 4,
    			animate: 5,
    			axisOptions: 6,
    			barOptions: 7,
    			lineOptions: 8,
    			tooltipOptions: 9,
    			colors: 10,
    			valuesOverPoints: 11,
    			isNavigable: 12,
    			maxSlices: 13,
    			addDataPoint: 14,
    			removeDataPoint: 15,
    			exportChart: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Base",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get data() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animate() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animate(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get axisOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set axisOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get barOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set barOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipOptions() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipOptions(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valuesOverPoints() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valuesOverPoints(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isNavigable() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isNavigable(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSlices() {
    		throw new Error("<Base>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSlices(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addDataPoint() {
    		return this.$$.ctx[14];
    	}

    	set addDataPoint(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeDataPoint() {
    		return this.$$.ctx[15];
    	}

    	set removeDataPoint(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get exportChart() {
    		return this.$$.ctx[16];
    	}

    	set exportChart(value) {
    		throw new Error("<Base>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Base$1 = Base;

    var AromaGroups;
    (function (AromaGroups) {
        AromaGroups["None"] = "";
        AromaGroups["S\u00FC\u00DF_w\u00E4rmende_Phenole"] = "S\u00FC\u00DF w\u00E4rmende Phenole";
        AromaGroups["W\u00E4rmende_Terpene"] = "W\u00E4rmende Terpene";
        AromaGroups["Duftende_Terpene"] = "Duftende Terpene";
        AromaGroups["Erdige_Terpene"] = "Erdige_Terpene";
        AromaGroups["Durchdringende_Terpene"] = "Durchdringende Terpene";
        AromaGroups["Zitrust\u00F6nige_Terpene"] = "Zitrust\u00F6nige Terpene";
        AromaGroups["S\u00FC\u00DFsaure_S\u00E4uren"] = "S\u00FC\u00DFsaure S\u00E4uren";
        AromaGroups["Fruchtige_Aldehyde"] = "Fruchtige Aldehyde";
        AromaGroups["R\u00F6stige_Pysazine"] = "R\u00F6stige Pysazine";
        AromaGroups["Schwefelverbindungen"] = "Schwefelverbindungen";
        AromaGroups["Stechende_Verbindungen"] = "Stechende Verbindungen";
        AromaGroups["Einzigartige_Stoffe"] = "Einzigartige Stoffe";
    })(AromaGroups || (AromaGroups = {}));
    var AromaGroups$1 = AromaGroups;

    var AromaGroupsColors;
    (function (AromaGroupsColors) {
        AromaGroupsColors["None"] = "#EADEDE";
        AromaGroupsColors["S\u00FC\u00DF_w\u00E4rmende_Phenole"] = "#F6AE99";
        AromaGroupsColors["W\u00E4rmende_Terpene"] = "#9D9D9D";
        AromaGroupsColors["Duftende_Terpene"] = "#BFA2DB";
        AromaGroupsColors["Erdige_Terpene"] = "#7F7C82";
        AromaGroupsColors["Durchdringende_Terpene"] = "#87A7B3";
        AromaGroupsColors["Zitrust\u00F6nige_Terpene"] = "#A2B29F";
        AromaGroupsColors["S\u00FC\u00DFsaure_S\u00E4uren"] = "#EEC373";
        AromaGroupsColors["Fruchtige_Aldehyde"] = "#A68DAD";
        AromaGroupsColors["R\u00F6stige_Pysazine"] = "#876445";
        AromaGroupsColors["Schwefelverbindungen"] = "#8E806A";
        AromaGroupsColors["Stechende_Verbindungen"] = "#F29191";
        AromaGroupsColors["Einzigartige_Stoffe"] = "#A2B29F";
    })(AromaGroupsColors || (AromaGroupsColors = {}));
    var AromaGroupsColors$1 = AromaGroupsColors;

    /* src/SpiceContainer.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/SpiceContainer.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t0;
    	let t1_value = /*spice*/ ctx[0].nameSymbol + "";
    	let t1;
    	let t2;
    	let t3;
    	let h3;
    	let t4_value = /*spice*/ ctx[0].name + "";
    	let t4;
    	let t5;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("[");
    			t1 = text(t1_value);
    			t2 = text("]");
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = space();
    			if (default_slot) default_slot.c();
    			set_style(h1, "font-weight", "400");
    			set_style(h1, "padding-top", "2.7rem");
    			set_style(h1, "color", "#444444");
    			add_location(h1, file$4, 28, 4, 766);
    			attr_dev(div0, "class", "spiceBlob svelte-fcbxbh");
    			set_style(div0, "border-radius", /*shapeCss*/ ctx[1]);
    			set_style(div0, "background", "radial-gradient(ellipse at top left, " + /*spice*/ ctx[0].color + "A0 0%," + /*spice*/ ctx[0].color + "FF 50%)");
    			add_location(div0, file$4, 24, 2, 601);
    			set_style(h3, "color", "#444444");
    			add_location(h3, file$4, 32, 2, 880);
    			attr_dev(div1, "class", "spiceContainer svelte-fcbxbh");
    			add_location(div1, file$4, 23, 0, 570);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, h3);
    			append_dev(h3, t4);
    			append_dev(div1, t5);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*spice*/ 1) && t1_value !== (t1_value = /*spice*/ ctx[0].nameSymbol + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*spice*/ 1) {
    				set_style(div0, "background", "radial-gradient(ellipse at top left, " + /*spice*/ ctx[0].color + "A0 0%," + /*spice*/ ctx[0].color + "FF 50%)");
    			}

    			if ((!current || dirty & /*spice*/ 1) && t4_value !== (t4_value = /*spice*/ ctx[0].name + "")) set_data_dev(t4, t4_value);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpiceContainer', slots, ['default']);
    	let { shape } = $$props;
    	let { spice } = $$props;

    	let blobShapes = [
    		"47% 53% 42% 58% / 54% 34% 66% 46% ",
    		"30% 70% 42% 58% / 54% 34% 66% 46% ",
    		"30% 70% 58% 42% / 54% 43% 57% 46% ",
    		"60% 40% 58% 42% / 54% 43% 57% 46% ",
    		"60% 40% 58% 42% / 37% 43% 57% 63% ",
    		"60% 40% 58% 42% / 37% 62% 38% 63% ",
    		"60% 40% 58% 42% / 59% 62% 38% 41% ",
    		"58% 42% 39% 61% / 55% 62% 38% 45% "
    	];

    	let index = Math.round(shape * blobShapes.length);

    	if (index == blobShapes.length) {
    		index -= 1;
    	}

    	let shapeCss = blobShapes[index];

    	$$self.$$.on_mount.push(function () {
    		if (shape === undefined && !('shape' in $$props || $$self.$$.bound[$$self.$$.props['shape']])) {
    			console.warn("<SpiceContainer> was created without expected prop 'shape'");
    		}

    		if (spice === undefined && !('spice' in $$props || $$self.$$.bound[$$self.$$.props['spice']])) {
    			console.warn("<SpiceContainer> was created without expected prop 'spice'");
    		}
    	});

    	const writable_props = ['shape', 'spice'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpiceContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('shape' in $$props) $$invalidate(2, shape = $$props.shape);
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		shape,
    		spice,
    		blobShapes,
    		index,
    		shapeCss
    	});

    	$$self.$inject_state = $$props => {
    		if ('shape' in $$props) $$invalidate(2, shape = $$props.shape);
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('blobShapes' in $$props) blobShapes = $$props.blobShapes;
    		if ('index' in $$props) index = $$props.index;
    		if ('shapeCss' in $$props) $$invalidate(1, shapeCss = $$props.shapeCss);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [spice, shapeCss, shape, $$scope, slots];
    }

    class SpiceContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { shape: 2, spice: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpiceContainer",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get shape() {
    		throw new Error("<SpiceContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shape(value) {
    		throw new Error("<SpiceContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spice() {
    		throw new Error("<SpiceContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spice(value) {
    		throw new Error("<SpiceContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/SmallSpiceContainer.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/SmallSpiceContainer.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let div;
    	let h1;
    	let t0;
    	let t1_value = /*spice*/ ctx[0].nameSymbol + "";
    	let t1;
    	let t2;
    	let t3;
    	let p;
    	let t4_value = /*spice*/ ctx[0].description + "";
    	let t4;
    	let t5;
    	let h3;
    	let t6_value = /*spice*/ ctx[0].name + "";
    	let t6;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("[");
    			t1 = text(t1_value);
    			t2 = text("]");
    			t3 = space();
    			p = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			h3 = element("h3");
    			t6 = text(t6_value);
    			attr_dev(h1, "class", "nameSymbol svelte-1c8dsma");
    			add_location(h1, file$3, 29, 4, 794);
    			attr_dev(div, "class", "spiceBlob svelte-1c8dsma");
    			set_style(div, "border-radius", /*shapeCss*/ ctx[2]);
    			set_style(div, "background", "radial-gradient(ellipse at top left, " + /*spice*/ ctx[0].color + "A0 0%," + /*spice*/ ctx[0].color + "FF 50%)");
    			add_location(div, file$3, 25, 2, 629);
    			attr_dev(p, "class", "svelte-1c8dsma");
    			add_location(p, file$3, 33, 2, 866);
    			attr_dev(h3, "class", "svelte-1c8dsma");
    			add_location(h3, file$3, 36, 2, 903);
    			attr_dev(button, "class", "svelte-1c8dsma");
    			add_location(button, file$3, 24, 0, 592);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(button, t3);
    			append_dev(button, p);
    			append_dev(p, t4);
    			append_dev(button, t5);
    			append_dev(button, h3);
    			append_dev(h3, t6);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[1](/*spice*/ ctx[0]))) /*onClick*/ ctx[1](/*spice*/ ctx[0]).apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*spice*/ 1 && t1_value !== (t1_value = /*spice*/ ctx[0].nameSymbol + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*spice*/ 1) {
    				set_style(div, "background", "radial-gradient(ellipse at top left, " + /*spice*/ ctx[0].color + "A0 0%," + /*spice*/ ctx[0].color + "FF 50%)");
    			}

    			if (dirty & /*spice*/ 1 && t4_value !== (t4_value = /*spice*/ ctx[0].description + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*spice*/ 1 && t6_value !== (t6_value = /*spice*/ ctx[0].name + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SmallSpiceContainer', slots, []);
    	let { shape } = $$props;
    	let { spice } = $$props;
    	let { onClick } = $$props;

    	let blobShapes = [
    		"47% 53% 42% 58% / 54% 34% 66% 46% ",
    		"30% 70% 42% 58% / 54% 34% 66% 46% ",
    		"30% 70% 58% 42% / 54% 43% 57% 46% ",
    		"60% 40% 58% 42% / 54% 43% 57% 46% ",
    		"60% 40% 58% 42% / 37% 43% 57% 63% ",
    		"60% 40% 58% 42% / 37% 62% 38% 63% ",
    		"60% 40% 58% 42% / 59% 62% 38% 41% ",
    		"58% 42% 39% 61% / 55% 62% 38% 45% "
    	];

    	let index = Math.round(shape * blobShapes.length);

    	if (index == blobShapes.length) {
    		index -= 1;
    	}

    	let shapeCss = blobShapes[index];

    	$$self.$$.on_mount.push(function () {
    		if (shape === undefined && !('shape' in $$props || $$self.$$.bound[$$self.$$.props['shape']])) {
    			console.warn("<SmallSpiceContainer> was created without expected prop 'shape'");
    		}

    		if (spice === undefined && !('spice' in $$props || $$self.$$.bound[$$self.$$.props['spice']])) {
    			console.warn("<SmallSpiceContainer> was created without expected prop 'spice'");
    		}

    		if (onClick === undefined && !('onClick' in $$props || $$self.$$.bound[$$self.$$.props['onClick']])) {
    			console.warn("<SmallSpiceContainer> was created without expected prop 'onClick'");
    		}
    	});

    	const writable_props = ['shape', 'spice', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SmallSpiceContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('shape' in $$props) $$invalidate(3, shape = $$props.shape);
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('onClick' in $$props) $$invalidate(1, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({
    		shape,
    		spice,
    		onClick,
    		blobShapes,
    		index,
    		shapeCss
    	});

    	$$self.$inject_state = $$props => {
    		if ('shape' in $$props) $$invalidate(3, shape = $$props.shape);
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('onClick' in $$props) $$invalidate(1, onClick = $$props.onClick);
    		if ('blobShapes' in $$props) blobShapes = $$props.blobShapes;
    		if ('index' in $$props) index = $$props.index;
    		if ('shapeCss' in $$props) $$invalidate(2, shapeCss = $$props.shapeCss);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [spice, onClick, shapeCss, shape];
    }

    class SmallSpiceContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { shape: 3, spice: 0, onClick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SmallSpiceContainer",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get shape() {
    		throw new Error("<SmallSpiceContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shape(value) {
    		throw new Error("<SmallSpiceContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spice() {
    		throw new Error("<SmallSpiceContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spice(value) {
    		throw new Error("<SmallSpiceContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<SmallSpiceContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<SmallSpiceContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/spices/SpiceDropdown.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/spices/SpiceDropdown.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (9:2) {#each spices as spice}
    function create_each_block$1(ctx) {
    	let option;
    	let t0_value = /*spice*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*spice*/ ctx[4];
    			option.value = option.__value;
    			add_location(option, file$2, 9, 4, 180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*spices*/ 2 && t0_value !== (t0_value = /*spice*/ ctx[4].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*spices*/ 2 && option_value_value !== (option_value_value = /*spice*/ ctx[4])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(9:2) {#each spices as spice}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*spices*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "class", "svelte-1svztgs");
    			if (/*selectedSpice*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[3].call(select));
    			add_location(select, file$2, 7, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			select_option(select, /*selectedSpice*/ ctx[0], true);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[3]),
    					listen_dev(
    						select,
    						"change",
    						function () {
    							if (is_function(/*onChange*/ ctx[2])) /*onChange*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*spices*/ 2) {
    				each_value = /*spices*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selectedSpice, spices*/ 3) {
    				select_option(select, /*selectedSpice*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpiceDropdown', slots, []);
    	let { selectedSpice } = $$props;
    	let { spices } = $$props;
    	let { onChange } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (selectedSpice === undefined && !('selectedSpice' in $$props || $$self.$$.bound[$$self.$$.props['selectedSpice']])) {
    			console.warn("<SpiceDropdown> was created without expected prop 'selectedSpice'");
    		}

    		if (spices === undefined && !('spices' in $$props || $$self.$$.bound[$$self.$$.props['spices']])) {
    			console.warn("<SpiceDropdown> was created without expected prop 'spices'");
    		}

    		if (onChange === undefined && !('onChange' in $$props || $$self.$$.bound[$$self.$$.props['onChange']])) {
    			console.warn("<SpiceDropdown> was created without expected prop 'onChange'");
    		}
    	});

    	const writable_props = ['selectedSpice', 'spices', 'onChange'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpiceDropdown> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selectedSpice = select_value(this);
    		$$invalidate(0, selectedSpice);
    		$$invalidate(1, spices);
    	}

    	$$self.$$set = $$props => {
    		if ('selectedSpice' in $$props) $$invalidate(0, selectedSpice = $$props.selectedSpice);
    		if ('spices' in $$props) $$invalidate(1, spices = $$props.spices);
    		if ('onChange' in $$props) $$invalidate(2, onChange = $$props.onChange);
    	};

    	$$self.$capture_state = () => ({ selectedSpice, spices, onChange });

    	$$self.$inject_state = $$props => {
    		if ('selectedSpice' in $$props) $$invalidate(0, selectedSpice = $$props.selectedSpice);
    		if ('spices' in $$props) $$invalidate(1, spices = $$props.spices);
    		if ('onChange' in $$props) $$invalidate(2, onChange = $$props.onChange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedSpice, spices, onChange, select_change_handler];
    }

    class SpiceDropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { selectedSpice: 0, spices: 1, onChange: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpiceDropdown",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get selectedSpice() {
    		throw new Error("<SpiceDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedSpice(value) {
    		throw new Error("<SpiceDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spices() {
    		throw new Error("<SpiceDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spices(value) {
    		throw new Error("<SpiceDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onChange() {
    		throw new Error("<SpiceDropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onChange(value) {
    		throw new Error("<SpiceDropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/AromaGroupLegend.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/AromaGroupLegend.svelte";

    function create_fragment$1(ctx) {
    	let div36;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t2;
    	let div5;
    	let div3;
    	let t3;
    	let div4;
    	let t5;
    	let div8;
    	let div6;
    	let t6;
    	let div7;
    	let t8;
    	let div11;
    	let div9;
    	let t9;
    	let div10;
    	let t11;
    	let div14;
    	let div12;
    	let t12;
    	let div13;
    	let t14;
    	let div17;
    	let div15;
    	let t15;
    	let div16;
    	let t17;
    	let div20;
    	let div18;
    	let t18;
    	let div19;
    	let t20;
    	let div23;
    	let div21;
    	let t21;
    	let div22;
    	let t23;
    	let div26;
    	let div24;
    	let t24;
    	let div25;
    	let t26;
    	let div29;
    	let div27;
    	let t27;
    	let div28;
    	let t29;
    	let div32;
    	let div30;
    	let t30;
    	let div31;
    	let t32;
    	let div35;
    	let div33;
    	let t33;
    	let div34;

    	const block = {
    		c: function create() {
    			div36 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = `${AromaGroups$1.Süß_wärmende_Phenole}`;
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			div4.textContent = `${AromaGroups$1.Wärmende_Terpene}`;
    			t5 = space();
    			div8 = element("div");
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			div7.textContent = `${AromaGroups$1.Duftende_Terpene}`;
    			t8 = space();
    			div11 = element("div");
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			div10.textContent = `${AromaGroups$1.Erdige_Terpene}`;
    			t11 = space();
    			div14 = element("div");
    			div12 = element("div");
    			t12 = space();
    			div13 = element("div");
    			div13.textContent = `${AromaGroups$1.Durchdringende_Terpene}`;
    			t14 = space();
    			div17 = element("div");
    			div15 = element("div");
    			t15 = space();
    			div16 = element("div");
    			div16.textContent = `${AromaGroups$1.Zitrustönige_Terpene}`;
    			t17 = space();
    			div20 = element("div");
    			div18 = element("div");
    			t18 = space();
    			div19 = element("div");
    			div19.textContent = `${AromaGroups$1.Süßsaure_Säuren}`;
    			t20 = space();
    			div23 = element("div");
    			div21 = element("div");
    			t21 = space();
    			div22 = element("div");
    			div22.textContent = `${AromaGroups$1.Fruchtige_Aldehyde}`;
    			t23 = space();
    			div26 = element("div");
    			div24 = element("div");
    			t24 = space();
    			div25 = element("div");
    			div25.textContent = `${AromaGroups$1.Röstige_Pysazine}`;
    			t26 = space();
    			div29 = element("div");
    			div27 = element("div");
    			t27 = space();
    			div28 = element("div");
    			div28.textContent = `${AromaGroups$1.Schwefelverbindungen}`;
    			t29 = space();
    			div32 = element("div");
    			div30 = element("div");
    			t30 = space();
    			div31 = element("div");
    			div31.textContent = `${AromaGroups$1.Stechende_Verbindungen}`;
    			t32 = space();
    			div35 = element("div");
    			div33 = element("div");
    			t33 = space();
    			div34 = element("div");
    			div34.textContent = `${AromaGroups$1.Einzigartige_Stoffe}`;
    			attr_dev(div0, "class", "colorBlob svelte-lrqis3");
    			set_style(div0, "background", AromaGroupsColors$1.Süß_wärmende_Phenole);
    			add_location(div0, file$1, 7, 4, 194);
    			add_location(div1, file$1, 11, 4, 301);
    			attr_dev(div2, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div2, file$1, 6, 2, 161);
    			attr_dev(div3, "class", "colorBlob svelte-lrqis3");
    			set_style(div3, "background", AromaGroupsColors$1.Wärmende_Terpene);
    			add_location(div3, file$1, 17, 4, 404);
    			add_location(div4, file$1, 21, 4, 507);
    			attr_dev(div5, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div5, file$1, 16, 2, 371);
    			attr_dev(div6, "class", "colorBlob svelte-lrqis3");
    			set_style(div6, "background", AromaGroupsColors$1.Duftende_Terpene);
    			add_location(div6, file$1, 27, 4, 606);
    			add_location(div7, file$1, 31, 4, 709);
    			attr_dev(div8, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div8, file$1, 26, 2, 573);
    			attr_dev(div9, "class", "colorBlob svelte-lrqis3");
    			set_style(div9, "background", AromaGroupsColors$1.Erdige_Terpene);
    			add_location(div9, file$1, 37, 4, 808);
    			add_location(div10, file$1, 41, 4, 909);
    			attr_dev(div11, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div11, file$1, 36, 2, 775);
    			attr_dev(div12, "class", "colorBlob svelte-lrqis3");
    			set_style(div12, "background", AromaGroupsColors$1.Durchdringende_Terpene);
    			add_location(div12, file$1, 47, 4, 1006);
    			add_location(div13, file$1, 51, 4, 1115);
    			attr_dev(div14, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div14, file$1, 46, 2, 973);
    			attr_dev(div15, "class", "colorBlob svelte-lrqis3");
    			set_style(div15, "background", AromaGroupsColors$1.Zitrustönige_Terpene);
    			add_location(div15, file$1, 57, 4, 1220);
    			add_location(div16, file$1, 61, 4, 1327);
    			attr_dev(div17, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div17, file$1, 56, 2, 1187);
    			attr_dev(div18, "class", "colorBlob svelte-lrqis3");
    			set_style(div18, "background", AromaGroupsColors$1.Süßsaure_Säuren);
    			add_location(div18, file$1, 67, 4, 1430);
    			add_location(div19, file$1, 71, 4, 1532);
    			attr_dev(div20, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div20, file$1, 66, 2, 1397);
    			attr_dev(div21, "class", "colorBlob svelte-lrqis3");
    			set_style(div21, "background", AromaGroupsColors$1.Fruchtige_Aldehyde);
    			add_location(div21, file$1, 77, 4, 1630);
    			add_location(div22, file$1, 81, 4, 1735);
    			attr_dev(div23, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div23, file$1, 76, 2, 1597);
    			attr_dev(div24, "class", "colorBlob svelte-lrqis3");
    			set_style(div24, "background", AromaGroupsColors$1.Röstige_Pysazine);
    			add_location(div24, file$1, 87, 4, 1836);
    			add_location(div25, file$1, 91, 4, 1939);
    			attr_dev(div26, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div26, file$1, 86, 2, 1803);
    			attr_dev(div27, "class", "colorBlob svelte-lrqis3");
    			set_style(div27, "background", AromaGroupsColors$1.Schwefelverbindungen);
    			add_location(div27, file$1, 97, 4, 2038);
    			add_location(div28, file$1, 101, 4, 2145);
    			attr_dev(div29, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div29, file$1, 96, 2, 2005);
    			attr_dev(div30, "class", "colorBlob svelte-lrqis3");
    			set_style(div30, "background", AromaGroupsColors$1.Stechende_Verbindungen);
    			add_location(div30, file$1, 107, 4, 2248);
    			add_location(div31, file$1, 111, 4, 2357);
    			attr_dev(div32, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div32, file$1, 106, 2, 2215);
    			attr_dev(div33, "class", "colorBlob svelte-lrqis3");
    			set_style(div33, "background", AromaGroupsColors$1.Einzigartige_Stoffe);
    			add_location(div33, file$1, 117, 4, 2462);
    			add_location(div34, file$1, 121, 4, 2568);
    			attr_dev(div35, "class", "horizontalGrid svelte-lrqis3");
    			add_location(div35, file$1, 116, 2, 2429);
    			attr_dev(div36, "class", "verticalGrid svelte-lrqis3");
    			add_location(div36, file$1, 5, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div36, t2);
    			append_dev(div36, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div36, t5);
    			append_dev(div36, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div36, t8);
    			append_dev(div36, div11);
    			append_dev(div11, div9);
    			append_dev(div11, t9);
    			append_dev(div11, div10);
    			append_dev(div36, t11);
    			append_dev(div36, div14);
    			append_dev(div14, div12);
    			append_dev(div14, t12);
    			append_dev(div14, div13);
    			append_dev(div36, t14);
    			append_dev(div36, div17);
    			append_dev(div17, div15);
    			append_dev(div17, t15);
    			append_dev(div17, div16);
    			append_dev(div36, t17);
    			append_dev(div36, div20);
    			append_dev(div20, div18);
    			append_dev(div20, t18);
    			append_dev(div20, div19);
    			append_dev(div36, t20);
    			append_dev(div36, div23);
    			append_dev(div23, div21);
    			append_dev(div23, t21);
    			append_dev(div23, div22);
    			append_dev(div36, t23);
    			append_dev(div36, div26);
    			append_dev(div26, div24);
    			append_dev(div26, t24);
    			append_dev(div26, div25);
    			append_dev(div36, t26);
    			append_dev(div36, div29);
    			append_dev(div29, div27);
    			append_dev(div29, t27);
    			append_dev(div29, div28);
    			append_dev(div36, t29);
    			append_dev(div36, div32);
    			append_dev(div32, div30);
    			append_dev(div32, t30);
    			append_dev(div32, div31);
    			append_dev(div36, t32);
    			append_dev(div36, div35);
    			append_dev(div35, div33);
    			append_dev(div35, t33);
    			append_dev(div35, div34);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div36);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AromaGroupLegend', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AromaGroupLegend> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ AromaGroups: AromaGroups$1, AromaGroupsColors: AromaGroupsColors$1 });
    	return [];
    }

    class AromaGroupLegend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AromaGroupLegend",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var SpiceGroup;
    (function (SpiceGroup) {
        SpiceGroup["Aromatisch"] = "Aromatisch";
        SpiceGroup["Erding"] = "Erdig";
        SpiceGroup["Zitrisch"] = "Zitrisch";
        SpiceGroup["S\u00FC\u00DF"] = "S\u00FC\u00DF";
        SpiceGroup["Pikant"] = "Pikant";
        SpiceGroup["Scharf"] = "Scharf";
        SpiceGroup["None"] = "";
    })(SpiceGroup || (SpiceGroup = {}));
    var SpiceGroup$1 = SpiceGroup;

    class NoSpice {
        constructor() {
            this.name = "Kein Gewürz ausgewählt";
            this.nameSymbol = "No";
            this.description = "Wählen Sie ein Gewürz aus";
            this.aromaCompounds = [];
            this.aromaGroup = AromaGroups$1.None;
            this.color = AromaGroupsColors$1.None;
            this.spice_group = SpiceGroup$1.None;
            this.goes_well_with = [];
        }
    }

    var AromaCompounds;
    (function (AromaCompounds) {
        AromaCompounds["ACETOIN"] = "ACETOIN";
        AromaCompounds["ACETYL_PYRROLIN"] = "2-ACETYL-PYRROLIN";
        AromaCompounds["ANETHOL"] = "ANETHOL";
        AromaCompounds["ANISALDEHYD"] = "ANISALDEHYD";
        AromaCompounds["ANISALKOHOL"] = "ANISALKOHOL";
        AromaCompounds["AZULEN"] = "AZULEN";
        AromaCompounds["CADINENE"] = "CADINENE";
        AromaCompounds["ALPHA_CADINOL"] = "ALPHA-CADINOL";
        AromaCompounds["CAMPHEN"] = "CAMPHEN";
        AromaCompounds["KAMPFER"] = "KAMPFER";
        AromaCompounds["CAPSAICIN"] = "CAPSAICIN";
        AromaCompounds["CAPSAICINOIDE"] = "CAPSAICINOIDE";
        AromaCompounds["CAREN"] = "CAREN";
        AromaCompounds["CARVACROL"] = "CARVACROL";
        AromaCompounds["CARVEOL"] = "CARVEOL";
        AromaCompounds["D_CARVON"] = "D-CARVON";
        AromaCompounds["S_CARVON"] = "S-CARVON";
        AromaCompounds["CARYOPHYLLENE"] = "CARYOPHYLLENE";
        AromaCompounds["CEMBREN"] = "CEMBREN";
        AromaCompounds["CINEOL"] = "CINEOL";
        AromaCompounds["ZIMTALDEHYD"] = "ZIMTALDEHYD";
        AromaCompounds["CITRAL"] = "CITRAL";
        AromaCompounds["ZITRONENS\u00C4URE"] = "ZITRONENS\u00C4URE";
        AromaCompounds["CITRONELLAL"] = "CITRONELLAL";
        AromaCompounds["CITRONELLOL"] = "CITRONELLOL";
        AromaCompounds["ALPHA_COPAEN"] = "ALPHA_COPAEN";
        AromaCompounds["COUMARIN"] = "COUMARIN";
        AromaCompounds["CUMINALDEHYD"] = "CUMINALDEHYD";
        AromaCompounds["CURCUMIN"] = "CURCUMIN";
        AromaCompounds["CYCLOCITRAL"] = "CYCLOCITRAL";
        AromaCompounds["CYMOL"] = "CYMOL";
        AromaCompounds["CUBEBIN"] = "CUBEBIN";
        AromaCompounds["DIALLYDISULFID"] = "DIALLYDISULFID";
        AromaCompounds["DIALLYLTRISULFID"] = "DIALLYLTRISULFID";
        AromaCompounds["DIMETHOXYPHENOL"] = "DIMETHOXYPHENOL";
        AromaCompounds["DIMETHYLPYRAZIN"] = "DIMETHYLPYRAZIN";
        AromaCompounds["DIOXOLAN"] = "DIOXOLAN";
        AromaCompounds["ELEMAN"] = "ELEMAN";
        AromaCompounds["ELEMICIN"] = "ELEMICIN";
        AromaCompounds["ESTERVERBINDUNGEN"] = "ESTERVERBINDUNGEN";
        AromaCompounds["ESTRAGOL"] = "ESTRAGOL";
        AromaCompounds["ESSIGESTER"] = "ESSIGESTER";
        AromaCompounds["EUDESMOL"] = "EUDESMOL";
        AromaCompounds["EUGENOL"] = "EUGENOL";
        AromaCompounds["FARNESENE"] = "FARNESENE";
        AromaCompounds["FENCHON"] = "FENCHON";
        AromaCompounds["ALPHA_FENCHOL"] = "ALPHA_FENCHOL";
        AromaCompounds["FERULAS\u00C4URE"] = "FERULAS\u00C4URE";
        AromaCompounds["FURFURYLTHIOL"] = "FURFURYLTHIOL";
        AromaCompounds["FURANEOL"] = "FURANEOL";
        AromaCompounds["FURFURAL"] = "FURFURAL";
        AromaCompounds["FURFURYLTHIOL_2"] = "2-FURFURYLTHIOL";
        AromaCompounds["GALANGALACETAT"] = "GALANGALACETAT";
        AromaCompounds["GERANIOL"] = "GERANIOL";
        AromaCompounds["GERMACREN"] = "GERMACREN";
        AromaCompounds["GINGEROL"] = "GINGEROL";
        AromaCompounds["GYLKOSID_VERBINDUNGEN"] = "GYLKOSID-VERBINDUNGEN";
        AromaCompounds["GLYCYRRHIZIN"] = "GLYCYRRHIZIN";
        AromaCompounds["HEPTANON"] = "HEPTANON";
        AromaCompounds["HEXANAL"] = "HEXANAL";
        AromaCompounds["CAPRONS\u00C4URE"] = "CAPRONS\u00C4URE";
        AromaCompounds["HUMULEN"] = "HUMULEN";
        AromaCompounds["HUMULON"] = "HUMULON";
        AromaCompounds["HYDROXYBENZALDEHYD"] = "4-HYDROXYBENZALDEHYD";
        AromaCompounds["ISOTHIOCYANATE"] = "ISOTHIOCYANATE";
        AromaCompounds["ISOVALERALDEHYD"] = "ISOVALERALDEHYD";
        AromaCompounds["LANIERON"] = "LANIERON";
        AromaCompounds["LIMONEN"] = "LIMONEN";
        AromaCompounds["LINALOOL"] = "LINALOOL";
        AromaCompounds["\u00C4PFELS\u00C4URE"] = "\u00C4PFELS\u00C4URE";
        AromaCompounds["METHOXYCOUMARIN"] = "METHOXYCOUMARIN";
        AromaCompounds["METHOXYETHYLCINNAMAT"] = "METHOXYETHYLCINNAMAT";
        AromaCompounds["METHYLBUTANAL"] = "3-METHYLBUTANAL";
        AromaCompounds["ZIMTS\u00C4UREMETHYLESTER"] = "ZIMTS\u00C4UREMETHYLESTER";
        AromaCompounds["METHYLHEPTENON"] = "METHYLHEPTENON";
        AromaCompounds["SALICYLS\u00C4UREMETHYLESTER"] = "SALICYLS\u00C4UREMETHYLESTER";
        AromaCompounds["MYRCEN"] = "MYRCEN";
        AromaCompounds["MYRISTICIN"] = "MYRISTICIN";
        AromaCompounds["NEROL"] = "NEROL";
        AromaCompounds["NONANAL"] = "NONANAL";
        AromaCompounds["OCIMENE"] = "OCIMENE";
        AromaCompounds["PARADOL"] = "PARADOL";
        AromaCompounds["VALERIANS\u00C4URE"] = "VALERIANS\u00C4URE";
        AromaCompounds["PENTANOL"] = "PENTANOL";
        AromaCompounds["PENTYLFURAN"] = "2-PENTYLFURAN";
        AromaCompounds["PHELLANDREN"] = "PHELLANDREN";
        AromaCompounds["PHENOLVERBINDUNGEN"] = "PHENOLVERBINDUNGEN";
        AromaCompounds["PHENYLACETALDEHYD"] = "PHENYLACETALDEHYD";
        AromaCompounds["PHENYLACETALDEHYD_2"] = "2-PHENYLACETALDEHYD";
        AromaCompounds["PHENYLETHANTHIOL"] = "1-PHENYLETHANTHIOL";
        AromaCompounds["PICROCROCIN"] = "PICROCROCIN";
        AromaCompounds["PINENE"] = "PINENE";
        AromaCompounds["PIPERIN"] = "PIPERIN";
        AromaCompounds["PIPERONAL"] = "PIPERONAL";
        AromaCompounds["PYRAZINVERBINDUNGEN"] = "PYRAZINVERBINDUNGEN";
        AromaCompounds["ROSEN_KETONE"] = "ROSEN_KETONE";
        AromaCompounds["ROTUNDONE"] = "ROTUNDONE";
        AromaCompounds["SABINEN"] = "SABINEN";
        AromaCompounds["SAFRANAL"] = "SAFRANAL";
        AromaCompounds["SAFROL"] = "SAFROL";
        AromaCompounds["SANSHOOL"] = "SANSHOOL";
        AromaCompounds["SEDANOLID"] = "SEDANOLID";
        AromaCompounds["SELINENE"] = "SELINENE";
        AromaCompounds["SESAMOL"] = "SESAMOL";
        AromaCompounds["SHOGAOL"] = "SHOGAOL";
        AromaCompounds["SOTOLON"] = "SOTOLON";
        AromaCompounds["SULCATON"] = "SULCATON";
        AromaCompounds["SULFIDVERBINDUNGEN"] = "SULFIDVERBINDUNGEN";
        AromaCompounds["TANNINVERBINDUNGEN"] = "TANNINVERBINDUNGEN";
        AromaCompounds["WEINS\u00C4URE"] = "WEINS\u00C4URE";
        AromaCompounds["TERPINENE"] = "TERPINENE";
        AromaCompounds["TERPINEOL"] = "TERPINEOL";
        AromaCompounds["TERPINYLACETAT"] = "TERPINYLACETAT";
        AromaCompounds["THYMOL"] = "THYMOL";
        AromaCompounds["THYMOCHINON"] = "THYMOCHINON";
        AromaCompounds["AR_TURMERON"] = "AR-TURMERON";
        AromaCompounds["VANILLIN"] = "VANILLIN";
        AromaCompounds["VINYLAMYLKETON"] = "VINYLAMYLKETON";
        AromaCompounds["ZINGIBEREN"] = "ZINGIBEREN";
    })(AromaCompounds || (AromaCompounds = {}));
    var AromaCompounds$1 = AromaCompounds;

    var PairingTag;
    (function (PairingTag) {
        PairingTag["None"] = "";
        PairingTag["Gem\u00FCse"] = "Gem\u00FCse";
        PairingTag["Pilze"] = "Pilze";
        PairingTag["Reis"] = "Reis";
        PairingTag["H\u00FClsenfr\u00FCchte"] = "H\u00FClsenfr\u00FCchte";
        PairingTag["Linsen"] = "Linsen";
        PairingTag["Milchprodukte"] = "Milchprodukte";
        PairingTag["H\u00FChnchen"] = "H\u00FChnchen";
        PairingTag["Tomaten"] = "Tomaten";
        PairingTag["Steinfr\u00FCchte"] = "Steinfr\u00FCchte";
        PairingTag["\u00C4pfel"] = "\u00C4pfel";
        PairingTag["Feigen"] = "Feigen";
        PairingTag["Dunkle_Schokolade"] = "Dunkle Schokolade";
        PairingTag["Br\u00FChe"] = "Br\u00FChe";
        PairingTag["Zwiebelsuppe"] = "Zwiebelsuppe";
        PairingTag["Fischpastete"] = "Fischpastete";
        PairingTag["Ragu"] = "Rag\u00F9";
        PairingTag["Pfirsiche"] = "Pfirsiche";
        PairingTag["Pflaumen"] = "Pflaumen";
        PairingTag["Zitronenschale"] = "Zitronenschale";
        PairingTag["Eier"] = "Eier";
        PairingTag["Butter"] = "Butter";
        PairingTag["Lamm"] = "Lamm";
        PairingTag["Fisch"] = "Fisch";
        PairingTag["Meeresfr\u00FCchte"] = "Meeresfr\u00FCchte";
        PairingTag["Zitrusfr\u00FCchte"] = "Zitrusfr\u00FCchte";
        PairingTag["Fladenbrot"] = "Fladenbrot";
        PairingTag["Curry"] = "Curry";
        PairingTag["R\u00FChrei"] = "R\u00FChrei";
        PairingTag["Gr\u00FCne_Papaya"] = "Gr\u00FCne Papaya";
        PairingTag["Pomelo"] = "Pomelo";
        PairingTag["K\u00FCrbis"] = "K\u00FCrbis";
        PairingTag["Kartoffeln"] = "Kartoffeln";
        PairingTag["Rote_Beete"] = "Rote Beete";
        PairingTag["Kohl"] = "Kohl";
        PairingTag["Artischocken"] = "Artischocken";
        PairingTag["Wurzelgem\u00FCse"] = "Wurzelgem\u00FCse";
        PairingTag["Ingwer"] = "Ingwer";
        PairingTag["Oliven"] = "Oliven";
        PairingTag["Salbei"] = "Salbei";
        PairingTag["K\u00E4se"] = "K\u00E4se";
        PairingTag["Wildfleisch"] = "Wildfleisch";
        PairingTag["Ente"] = "Ente";
        PairingTag["Hase"] = "Hase";
        PairingTag["Gans"] = "Gans";
        PairingTag["Wachteln"] = "Wachteln";
        PairingTag["Schwarze_Johannisbeeren"] = "Schwarze Johannisbeeren";
        PairingTag["Getrocknete_Fr\u00FCchte"] = "Getrocknete Fr\u00FCchte";
        PairingTag["Lachs"] = "Lachs";
        PairingTag["Kaninchen"] = "Kaninchen";
        PairingTag["Makrele"] = "Makrele";
        PairingTag["Tiramisu"] = "Tiramisu";
        PairingTag["Bambussprossen"] = "Bambussprossen";
        PairingTag["Lotuswurzel"] = "Lotuswurzel";
        PairingTag["Nudeln"] = "Nudeln";
        PairingTag["Schwein"] = "Schwein";
        PairingTag["Rind"] = "Rind";
        PairingTag["Kokosnuss"] = "Kokosnuss";
        PairingTag["Tropische_Fr\u00FCchte"] = "Tropische Fr\u00FCchte";
        PairingTag["Muscheln"] = "Muscheln";
        PairingTag["Schalotten"] = "Schalotten";
        PairingTag["Knoblauch"] = "Knoblauch";
        PairingTag["Chili"] = "Chili";
        PairingTag["Galgant"] = "Galgant";
        PairingTag["Kokosnusscreme"] = "Kokosnusscreme";
        PairingTag["Thai_Basilikum"] = "Thai-Basilikum";
        PairingTag["Garnelen"] = "Garnelen";
        PairingTag["Kebab"] = "Kebab";
        PairingTag["Koriander"] = "Koriander";
        PairingTag["Karotten"] = "Karotten";
        PairingTag["Paprika"] = "Paprika";
        PairingTag["Gurke"] = "Gurke";
        PairingTag["Melone"] = "Melone";
        PairingTag["Beeren"] = "Beeren";
        PairingTag["Mandeln"] = "Mandeln";
        PairingTag["Kaffee"] = "Kaffee";
        PairingTag["Pistazien"] = "Pistazien";
        PairingTag["Rettich"] = "Rettich";
        PairingTag["Himbeeren"] = "Himbeeren";
        PairingTag["Whiskey"] = "Whiskey";
        PairingTag["Zimt"] = "Zimt";
        PairingTag["Limette"] = "Limette";
        PairingTag["Honig"] = "Honig";
        PairingTag["K\u00FCmmel"] = "K\u00FCmmel";
        PairingTag["Couscous"] = "Couscous";
        PairingTag["Datteln"] = "Datteln";
        PairingTag["Ochsenschwanz"] = "Ochsenschwanz";
        PairingTag["Rhabarbar"] = "Rhabarbar";
        PairingTag["Birne"] = "Birne";
        PairingTag["Pho"] = "Pho";
        PairingTag["F\u00FCnf_Gew\u00FCrz_Pulver"] = "F\u00FCnf_Gew\u00FCrz_Pulver";
        PairingTag["Biryani"] = "Biryani";
        PairingTag["Garam_Masala"] = "Garam Masala";
        PairingTag["Schwarzerk\u00FCmmel"] = "Schwarzerk\u00FCmmel";
        PairingTag["Bohnensprossen"] = "Bohnensprossen";
        PairingTag["Schweinebauch"] = "Schweinebauch";
        PairingTag["Sesam"] = "Sesam";
        PairingTag["Vanille"] = "Vanille";
        PairingTag["Blumenkohl"] = "Blumenkohl";
        PairingTag["Aubergine"] = "Aubergine";
        PairingTag["Okra"] = "Okra";
        PairingTag["Schalentiere"] = "Schalentiere";
        PairingTag["Pakoras"] = "Pakoras";
        PairingTag["Samosas"] = "Samosas";
        PairingTag["Mango"] = "Mango";
        PairingTag["Koriandersamen"] = "Koriandersamen";
        PairingTag["Currybl\u00E4tter"] = "Currybl\u00E4tter";
        PairingTag["Senf"] = "Senf";
        PairingTag["Zitronengras"] = "Zitronengras";
        PairingTag["Brokkoli"] = "Brokkoli";
        PairingTag["Spinat"] = "Spinat";
        PairingTag["Kichererbsen"] = "Kichererbsen";
        PairingTag["Avocado"] = "Avocado";
        PairingTag["Waln\u00FCsse"] = "Waln\u00FCsse";
        PairingTag["Kreuzk\u00FCmmel"] = "Kreuzk\u00FCmmel";
        PairingTag["Granatapfel"] = "Granatapfel";
        PairingTag["Orange"] = "Orange";
        PairingTag["Blattgem\u00FCse"] = "Blattgem\u00FCse";
        PairingTag["Staudensellerie"] = "Staudensellerie";
        PairingTag["Fenchel"] = "Fenchel";
        PairingTag["Gr\u00FCne_Bohnen"] = "Gr\u00FCne Bohnen";
        PairingTag["Lavendel"] = "Lavendel";
        PairingTag["Blutwurst"] = "Blutwurst";
        PairingTag["Thunfisch"] = "Thunfisch";
        PairingTag["Gl\u00FChwein"] = "Gl\u00FChwein";
        PairingTag["Gin"] = "Gin";
        PairingTag["Dal"] = "Dal";
        PairingTag["Jalapenos"] = "Jalape\u00F1os";
        PairingTag["Minze"] = "Minze";
        PairingTag["Oktopus"] = "Oktopus";
        PairingTag["Tintenfisch"] = "Tintenfisch";
        PairingTag["Rose"] = "Rose";
        PairingTag["N\u00FCsse"] = "N\u00FCsse";
        PairingTag["Dill"] = "Dill";
        PairingTag["Cayennepfeffer"] = "Cayennepfeffer";
        PairingTag["Safran"] = "Safran";
        PairingTag["Wei\u00DFe_Bohnen"] = "Wei\u00DFe Bohnen";
        PairingTag["Erdn\u00FCsse"] = "Erdn\u00FCsse";
        PairingTag["Tofu"] = "Tofu";
        PairingTag["Fleisch"] = "Fleisch";
        PairingTag["Dan_Dan_Nudeln"] = "Dan-Dan-Nudeln";
        PairingTag["Gin_Tonic"] = "Gin & Tonic";
        PairingTag["S\u00FC\u00DFkartoffeln"] = "S\u00FC\u00DFkartoffeln";
        PairingTag["Pak_Choi"] = "Pak Choi";
        PairingTag["Litschi"] = "Litschi";
        PairingTag["Orangenbl\u00FCten"] = "Orangenbl\u00FCten";
        PairingTag["Gnocchi"] = "Gnocchi";
        PairingTag["Chinakohl"] = "Chinakohl";
        PairingTag["Joghurt"] = "Joghurt";
        PairingTag["Feta"] = "Feta";
        PairingTag["Rotweinessig"] = "Rotweinessig";
        PairingTag["Mais"] = "Mais";
        PairingTag["Tahini"] = "Tahini";
        PairingTag["Ananas"] = "Ananas";
        PairingTag["Bulgur"] = "Bulgar";
        PairingTag["Zwiebeln"] = "Zwiebeln";
        PairingTag["Kohlgem\u00FCse"] = "Kohlgem\u00FCse";
        PairingTag["Erbsen"] = "Erbsen";
        PairingTag["Speck"] = "Speck";
        PairingTag["Karamell"] = "Karamell";
        PairingTag["Thymian"] = "Thymian";
        PairingTag["Sahne"] = "Sahne";
        PairingTag["Bananen"] = "Bananen";
        PairingTag["Erdbeeren"] = "Erdbeeren";
        PairingTag["Ziegenk\u00E4se"] = "Ziegenk\u00E4se";
        PairingTag["Kirschen"] = "Kirschen";
        PairingTag["Wei\u00DFkohl"] = "Wei\u00DFkohl";
        PairingTag["Weichk\u00E4se"] = "Weichk\u00E4se";
        PairingTag["Shortbread"] = "Shortbread";
        PairingTag["Sauerkraut"] = "Sauerkraut";
        PairingTag["Harissa"] = "Harissa";
        PairingTag["Haseln\u00FCsse"] = "Haseln\u00FCsse";
        PairingTag["Krautsalat"] = "Krautsalat";
        PairingTag["Zucchini"] = "Zucchini";
        PairingTag["Aprikosen"] = "Aprikosen";
        PairingTag["Falafel"] = "Falafel";
        PairingTag["Spargel"] = "Spargel";
        PairingTag["H\u00FCttenk\u00E4se"] = "H\u00FCttenk\u00E4se";
        PairingTag["Wei\u00DFweinessig"] = "Wei\u00DFweinessig";
        PairingTag["Zitrone"] = "Zitrone";
        PairingTag["Kalb"] = "Kalb";
        PairingTag["Gratins"] = "Gratins";
        PairingTag["Parmesan"] = "Parmesan";
        PairingTag["Ricotta"] = "Ricotta";
        PairingTag["Schokolade"] = "Schokolade";
        PairingTag["Lauch"] = "Lauch";
        PairingTag["Wei\u00DFe_Schokolade"] = "Wei\u00DFe Schokolade";
        PairingTag["Sardinen"] = "Sardinen";
        PairingTag["Pinienkerne"] = "Pinienkerne";
        PairingTag["Rosinen"] = "Rosinen";
        PairingTag["Sojasauce"] = "Sojasauce";
        PairingTag["Reisessig"] = "Reisessig";
        PairingTag["Wei\u00DFwein"] = "Wei\u00DFwein";
        PairingTag["Rotwein"] = "Rotwein";
        PairingTag["Bockshornklee"] = "Bockshornklee";
        PairingTag["Petersilie"] = "Petersilie";
        PairingTag["Estragon"] = "Estragon";
        PairingTag["Haferflocken"] = "Haferflocken";
        PairingTag["Mangold"] = "Mangold";
        PairingTag["Cashewn\u00FCsse"] = "Cashewn\u00FCsse";
        PairingTag["Rosenbl\u00E4tter"] = "Rosenbl\u00E4tter";
        PairingTag["Rosenkohl"] = "Rosenkohl";
        PairingTag["Rosmarin"] = "Rosmarin";
        PairingTag["Passionsfrucht"] = "Passionsfrucht";
        PairingTag["Gr\u00FCner_Kardamom"] = "Gr\u00FCner Kardamom";
        PairingTag["Innereien"] = "Innereien";
        PairingTag["Maniok"] = "Maniok";
        PairingTag["Frischk\u00E4se"] = "Frischk\u00E4se";
        PairingTag["Kimchi"] = "Kimchi";
        PairingTag["Liebst\u00F6ckel"] = "Liebst\u00F6ckel";
        PairingTag["Trauben"] = "Trauben";
        PairingTag["Schwarzer_Pfeffer"] = "Schwarzer Pfeffer";
        PairingTag["Langer_Pfeffer"] = "Langer Pfeffer";
        PairingTag["Grapefruit"] = "Grapefruit";
        PairingTag["Nelken"] = "Nelken";
        PairingTag["Paella"] = "Paella";
        PairingTag["Gulasch"] = "Gulasch";
        PairingTag["Lorbeer"] = "Lorbeer";
        PairingTag["Zuckererbsen"] = "Zuckererbsen";
        PairingTag["Buchweizen"] = "Buchweizen";
        PairingTag["Tr\u00FCffel"] = "Tr\u00FCffel";
        PairingTag["B\u00E4rlauch"] = "B\u00E4rlauch";
        PairingTag["Tonkabohnen"] = "Tonkabohnen";
        PairingTag["Mozzarella"] = "Mozzarella";
        PairingTag["Kurkuma"] = "Kurkuma";
        PairingTag["Chicoree"] = "Chicoree";
        PairingTag["Risotto"] = "Risotto";
        PairingTag["Knollensellerie"] = "Knollensellerie";
        PairingTag["Rotkohl"] = "Rotkohl";
        PairingTag["Rum"] = "Rum";
        PairingTag["Schinken"] = "Schinken";
        PairingTag["Pastinaken"] = "Pastinaken";
        PairingTag["Rucola"] = "Rucola";
        PairingTag["Tamarinde"] = "Tamarinde";
        PairingTag["Papadam"] = "Papadam";
        PairingTag["Bohnen"] = "Bohnen";
        PairingTag["Basilikum"] = "Basilikum";
        PairingTag["Papaya"] = "Papaya";
        PairingTag["Geb\u00E4ck"] = "Geb\u00E4ck";
        PairingTag["Muskatnuss"] = "Muskatnuss";
        PairingTag["Piment"] = "Piment";
        PairingTag["Pfeffer"] = "Pfeffer";
        PairingTag["Kakao"] = "Kakao";
    })(PairingTag || (PairingTag = {}));
    var PairingTag$1 = PairingTag;

    class Zimt {
        constructor() {
            this.name = "Zimt";
            this.nameSymbol = "Zi";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.ZIMTALDEHYD,
                AromaCompounds$1.ZIMTALDEHYD,
                AromaCompounds$1.ZIMTALDEHYD,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Blattgemüse,
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Ingwer,
                PairingTag$1.Tamarinde,
                PairingTag$1.Haferflocken,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Couscous,
                PairingTag$1.Eier,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Schalentiere,
                PairingTag$1.Fleisch,
                PairingTag$1.Tomaten,
                PairingTag$1.Aubergine,
                PairingTag$1.Äpfel,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Beeren,
                PairingTag$1.Orange,
                PairingTag$1.Kaffee,
                PairingTag$1.Mangold,
                PairingTag$1.Spinat,
                PairingTag$1.Pinienkerne,
                PairingTag$1.Rosinen,
                PairingTag$1.Feigen,
                PairingTag$1.Datteln,
                PairingTag$1.Granatapfel,
                PairingTag$1.Joghurt,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Cashewnüsse,
                PairingTag$1.Rosenblätter,
                PairingTag$1.Schwarzerkümmel,
                PairingTag$1.Garam_Masala,
            ];
        }
    }

    class Cassia_Zimt {
        constructor() {
            this.name = "Cassia-Zimt";
            this.nameSymbol = "Ca";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.KAMPFER,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.ZIMTALDEHYD,
                AromaCompounds$1.ZIMTALDEHYD,
                AromaCompounds$1.COUMARIN,
                AromaCompounds$1.HEPTANON,
                AromaCompounds$1.TANNINVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Blattgemüse,
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Ingwer,
                PairingTag$1.Tamarinde,
                PairingTag$1.Haferflocken,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Couscous,
                PairingTag$1.Eier,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Schalentiere,
                PairingTag$1.Fleisch,
                PairingTag$1.Tomaten,
                PairingTag$1.Aubergine,
                PairingTag$1.Äpfel,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Beeren,
                PairingTag$1.Orange,
                PairingTag$1.Kaffee,
                PairingTag$1.Mangold,
                PairingTag$1.Spinat,
                PairingTag$1.Pinienkerne,
                PairingTag$1.Rosinen,
                PairingTag$1.Feigen,
                PairingTag$1.Datteln,
                PairingTag$1.Granatapfel,
                PairingTag$1.Joghurt,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Cashewnüsse,
                PairingTag$1.Rosenblätter,
                PairingTag$1.Schwarzerkümmel,
                PairingTag$1.Garam_Masala,
            ];
        }
    }

    class Gewuerznelke {
        constructor() {
            this.name = "Gewürznelke";
            this.nameSymbol = "Gn";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.SALICYLSÄUREMETHYLESTER,
                AromaCompounds$1.TERPINEOL,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [];
        }
    }

    class Piment {
        constructor() {
            this.name = "Piment";
            this.nameSymbol = "Pi";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PHELLANDREN,
                AromaCompounds$1.PINENE,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Aubergine,
                PairingTag$1.Fleisch,
                PairingTag$1.Hühnchen,
                PairingTag$1.Fisch,
                PairingTag$1.Tomaten,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Curry,
                PairingTag$1.Reis,
                PairingTag$1.Erbsen,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Zwiebeln,
                PairingTag$1.Rosinen,
                PairingTag$1.Haselnüsse,
                PairingTag$1.Minze,
                PairingTag$1.Dill,
                PairingTag$1.Petersilie,
                PairingTag$1.Chili,
                PairingTag$1.Avocado,
                PairingTag$1.Käse,
                PairingTag$1.Lamm,
                PairingTag$1.Rote_Beete,
                PairingTag$1.Schwarzerkümmel,
                PairingTag$1.Orange,
                PairingTag$1.Mango,
            ];
        }
    }

    class Anis {
        constructor() {
            this.name = "Anis";
            this.nameSymbol = "An";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ANETHOL,
                AromaCompounds$1.ANETHOL,
                AromaCompounds$1.ANISALDEHYD,
                AromaCompounds$1.ANISALKOHOL,
                AromaCompounds$1.ANISALKOHOL,
                AromaCompounds$1.ESTRAGOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PINENE,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Lauch,
                PairingTag$1.Fenchel,
                PairingTag$1.Basilikum,
                PairingTag$1.Ingwer,
                PairingTag$1.Sahne,
                PairingTag$1.Rind,
                PairingTag$1.Schwein,
                PairingTag$1.Hühnchen,
                PairingTag$1.Ochsenschwanz,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Äpfel,
                PairingTag$1.Rhabarbar,
                PairingTag$1.Feigen,
                PairingTag$1.Mandeln,
                PairingTag$1.Schokolade,
                PairingTag$1.Karotten,
                PairingTag$1.Orange,
                PairingTag$1.Estragon,
                PairingTag$1.Tintenfisch,
                PairingTag$1.Speck,
                PairingTag$1.Grüne_Bohnen,
                PairingTag$1.Gurke,
            ];
        }
    }

    class Sternanis {
        constructor() {
            this.name = "Sternanis";
            this.nameSymbol = "St";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ANETHOL,
                AromaCompounds$1.ANETHOL,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.PHELLANDREN,
                AromaCompounds$1.SAFROL,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Aromatisch;
            this.goes_well_with = [
                PairingTag$1.Gemüse,
                PairingTag$1.Nudeln,
                PairingTag$1.Reis,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Eier,
                PairingTag$1.Meeresfrüchte,
                PairingTag$1.Fisch,
                PairingTag$1.Hühnchen,
                PairingTag$1.Rind,
                PairingTag$1.Schwein,
                PairingTag$1.Schweinebauch,
                PairingTag$1.Ente,
                PairingTag$1.Ochsenschwanz,
                PairingTag$1.Rhabarbar,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Birne,
                PairingTag$1.Dunkle_Schokolade,
                PairingTag$1.Pho,
                PairingTag$1.Fünf_Gewürz_Pulver,
                PairingTag$1.Biryani,
                PairingTag$1.Kaninchen,
                PairingTag$1.Ingwer,
                PairingTag$1.Garam_Masala,
                PairingTag$1.Schwarzerkümmel,
                PairingTag$1.Zimt,
                PairingTag$1.Ente,
                PairingTag$1.Pilze,
                PairingTag$1.Bohnensprossen,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Curry,
                PairingTag$1.Knoblauch,
                PairingTag$1.Vanille,
                PairingTag$1.Sesam,
            ];
        }
    }

    class Fenchel {
        constructor() {
            this.name = "Fenchelsamen";
            this.nameSymbol = "Fs";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ANETHOL,
                AromaCompounds$1.ANETHOL,
                AromaCompounds$1.ESTRAGOL,
                AromaCompounds$1.FENCHON,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PINENE,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Rote_Beete,
                PairingTag$1.Karotten,
                PairingTag$1.Fenchel,
                PairingTag$1.Kohl,
                PairingTag$1.Rosenkohl,
                PairingTag$1.Schwein,
                PairingTag$1.Rind,
                PairingTag$1.Kaninchen,
                PairingTag$1.Fisch,
                PairingTag$1.Avocado,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Curry,
                PairingTag$1.Mandeln,
                PairingTag$1.Käse,
                PairingTag$1.Tomaten,
                PairingTag$1.Rosmarin,
                PairingTag$1.Honig,
                PairingTag$1.Chili,
                PairingTag$1.Blattgemüse,
                PairingTag$1.Knoblauch,
                PairingTag$1.Weißwein,
                PairingTag$1.Orange,
                PairingTag$1.Senf,
                PairingTag$1.Oliven,
            ];
        }
    }

    class Sueßholz {
        constructor() {
            this.name = "Süßholz";
            this.nameSymbol = "Sü";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ANETHOL,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.ESTRAGOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.GLYCYRRHIZIN,
                AromaCompounds$1.GLYCYRRHIZIN,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.PHENOLVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Spargel,
                PairingTag$1.Fenchel,
                PairingTag$1.Rhabarbar,
                PairingTag$1.Minze,
                PairingTag$1.Fleisch,
                PairingTag$1.Wildfleisch,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Beeren,
                PairingTag$1.Äpfel,
                PairingTag$1.Birne,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Bananen,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Mandeln,
                PairingTag$1.Schokolade,
                PairingTag$1.Vanille,
                PairingTag$1.Pflaumen,
                PairingTag$1.Kirschen,
            ];
        }
    }

    class Mahlab {
        constructor() {
            this.name = "Mahlab";
            this.nameSymbol = "Ma";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.AZULEN,
                AromaCompounds$1.COUMARIN,
                AromaCompounds$1.COUMARIN,
                AromaCompounds$1.DIOXOLAN,
                AromaCompounds$1.METHOXYETHYLCINNAMAT,
                AromaCompounds$1.PENTANOL,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Fleisch,
                PairingTag$1.Tonkabohnen,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Aprikosen,
                PairingTag$1.Pistazien,
                PairingTag$1.Kirschen,
                PairingTag$1.Mandeln,
                PairingTag$1.Rose,
            ];
        }
    }

    class Vanille {
        constructor() {
            this.name = "Vanille";
            this.nameSymbol = "Va";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ANISALDEHYD,
                AromaCompounds$1.HYDROXYBENZALDEHYD,
                AromaCompounds$1.PIPERONAL,
                AromaCompounds$1.VANILLIN,
                AromaCompounds$1.VANILLIN,
            ];
            this.aromaGroup = AromaGroups$1.Süß_wärmende_Phenole;
            this.color = AromaGroupsColors$1.Süß_wärmende_Phenole;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Kürbis,
                PairingTag$1.Süßkartoffeln,
                PairingTag$1.Spinat,
                PairingTag$1.Ingwer,
                PairingTag$1.Rhabarbar,
                PairingTag$1.Kokosnusscreme,
                PairingTag$1.Eier,
                PairingTag$1.Hühnchen,
                PairingTag$1.Lamm,
                PairingTag$1.Schalentiere,
                PairingTag$1.Tomaten,
                PairingTag$1.Bananen,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Beeren,
                PairingTag$1.Ananas,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Kaffee,
                PairingTag$1.Nüsse,
                PairingTag$1.Kirschen,
                PairingTag$1.Muscheln,
                PairingTag$1.Pfirsiche,
                PairingTag$1.Rotwein,
            ];
        }
    }

    class Muskatnuss {
        constructor() {
            this.name = "Muskatnuss";
            this.nameSymbol = "Mu";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.MYRISTICIN,
                AromaCompounds$1.MYRISTICIN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.SABINEN,
                AromaCompounds$1.SAFROL,
            ];
            this.aromaGroup = AromaGroups$1.Wärmende_Terpene;
            this.color = AromaGroupsColors$1.Wärmende_Terpene;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Blattgemüse,
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Kohl,
                PairingTag$1.Pilze,
                PairingTag$1.Weichkäse,
                PairingTag$1.Käse,
                PairingTag$1.Avocado,
                PairingTag$1.Tomaten,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Hühnchen,
                PairingTag$1.Schwein,
                PairingTag$1.Lamm,
                PairingTag$1.Kalb,
                PairingTag$1.Bananen,
                PairingTag$1.Pflaumen,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Äpfel,
                PairingTag$1.Pfirsiche,
                PairingTag$1.Pistazien,
                PairingTag$1.Walnüsse,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Vanille,
                PairingTag$1.Gratins,
                PairingTag$1.Spinat,
                PairingTag$1.Parmesan,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Gnocchi,
                PairingTag$1.Kürbis,
                PairingTag$1.Ricotta,
                PairingTag$1.Salbei,
                PairingTag$1.Chili,
            ];
        }
    }

    class Muskatbluete {
        constructor() {
            this.name = "Muskatblüte";
            this.nameSymbol = "Mb";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ELEMICIN,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.MYRISTICIN,
                AromaCompounds$1.MYRISTICIN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.SABINEN,
                AromaCompounds$1.SAFROL,
                AromaCompounds$1.TERPINENE,
                AromaCompounds$1.TERPINEOL,
            ];
            this.aromaGroup = AromaGroups$1.Wärmende_Terpene;
            this.color = AromaGroupsColors$1.Wärmende_Terpene;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Kartoffeln,
                PairingTag$1.Süßkartoffeln,
                PairingTag$1.Karotten,
                PairingTag$1.Kohl,
                PairingTag$1.Kürbis,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Käse,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Eier,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Lamm,
                PairingTag$1.Kalb,
                PairingTag$1.Schwein,
                PairingTag$1.Äpfel,
                PairingTag$1.Mango,
                PairingTag$1.Curry,
                PairingTag$1.Rhabarbar,
                PairingTag$1.Vanille,
                PairingTag$1.Pfirsiche,
                PairingTag$1.Birne,
                PairingTag$1.Zimt,
            ];
        }
    }

    class Kuemmel {
        constructor() {
            this.name = "Kümmel";
            this.nameSymbol = "Kü";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARVEOL,
                AromaCompounds$1.S_CARVON,
                AromaCompounds$1.S_CARVON,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.SABINEN,
            ];
            this.aromaGroup = AromaGroups$1.Wärmende_Terpene;
            this.color = AromaGroupsColors$1.Wärmende_Terpene;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Weißkohl,
                PairingTag$1.Zwiebeln,
                PairingTag$1.Pilze,
                PairingTag$1.Weichkäse,
                PairingTag$1.Hühnchen,
                PairingTag$1.Ente,
                PairingTag$1.Gans,
                PairingTag$1.Schwein,
                PairingTag$1.Tomaten,
                PairingTag$1.Äpfel,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Walnüsse,
                PairingTag$1.Shortbread,
                PairingTag$1.Kohl,
                PairingTag$1.Sauerkraut,
                PairingTag$1.Gurke,
                PairingTag$1.Harissa,
                PairingTag$1.Haselnüsse,
                PairingTag$1.Krautsalat,
                PairingTag$1.Käse,
                PairingTag$1.Joghurt,
            ];
        }
    }

    class Dill {
        constructor() {
            this.name = "Dill";
            this.nameSymbol = "Di";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARVEOL,
                AromaCompounds$1.D_CARVON,
                AromaCompounds$1.D_CARVON,
                AromaCompounds$1.FENCHON,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PHELLANDREN,
                AromaCompounds$1.TERPINENE,
            ];
            this.aromaGroup = AromaGroups$1.Wärmende_Terpene;
            this.color = AromaGroupsColors$1.Wärmende_Terpene;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Pilze,
                PairingTag$1.Grüne_Bohnen,
                PairingTag$1.Erbsen,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Spargel,
                PairingTag$1.Hüttenkäse,
                PairingTag$1.Joghurt,
                PairingTag$1.Eier,
                PairingTag$1.Lamm,
                PairingTag$1.Rind,
                PairingTag$1.Schwein,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Zucchini,
                PairingTag$1.Aubergine,
                PairingTag$1.Avocado,
                PairingTag$1.Äpfel,
                PairingTag$1.Gurke,
                PairingTag$1.Karotten,
                PairingTag$1.Weißweinessig,
                PairingTag$1.Senf,
                PairingTag$1.Kakao,
                PairingTag$1.Zitrone,
                PairingTag$1.Feta,
                PairingTag$1.Knoblauch,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Käse,
            ];
        }
    }

    class Annatto {
        constructor() {
            this.name = "Annatto";
            this.nameSymbol = "Ao";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.ALPHA_COPAEN,
                AromaCompounds$1.ELEMAN,
                AromaCompounds$1.GERMACREN,
                AromaCompounds$1.GERMACREN,
            ];
            this.aromaGroup = AromaGroups$1.Wärmende_Terpene;
            this.color = AromaGroupsColors$1.Wärmende_Terpene;
            this.spice_group = SpiceGroup$1.Pikant;
            this.goes_well_with = [];
        }
    }

    class Mastix {
        constructor() {
            this.name = "Mastix";
            this.nameSymbol = "Mx";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CAMPHEN,
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.PINENE,
            ];
            this.aromaGroup = AromaGroups$1.Duftende_Terpene;
            this.color = AromaGroupsColors$1.Duftende_Terpene;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Reis,
                PairingTag$1.Käse,
                PairingTag$1.Sahne,
                PairingTag$1.Fleisch,
                PairingTag$1.Hühnchen,
                PairingTag$1.Äpfel,
                PairingTag$1.Feigen,
                PairingTag$1.Pistazien,
                PairingTag$1.Mandeln,
                PairingTag$1.Grüner_Kardamom,
                PairingTag$1.Piment,
                PairingTag$1.Granatapfel,
                PairingTag$1.Spinat,
                PairingTag$1.Muskatnuss,
                PairingTag$1.Basilikum,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Feta,
                PairingTag$1.Rote_Beete,
                PairingTag$1.Pinienkerne,
                PairingTag$1.Rettich,
                PairingTag$1.Pistazien,
                PairingTag$1.Ziegenkäse,
                PairingTag$1.Himbeeren,
                PairingTag$1.Weiße_Schokolade,
                PairingTag$1.Rosmarin,
            ];
        }
    }

    class Wacholder {
        constructor() {
            this.name = "Wacholder";
            this.nameSymbol = "Wa";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.TERPINEOL,
            ];
            this.aromaGroup = AromaGroups$1.Duftende_Terpene;
            this.color = AromaGroupsColors$1.Duftende_Terpene;
            this.spice_group = SpiceGroup$1.Aromatisch;
            this.goes_well_with = [
                PairingTag$1.Kartoffeln,
                PairingTag$1.Rote_Beete,
                PairingTag$1.Kohl,
                PairingTag$1.Artischocken,
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Ingwer,
                PairingTag$1.Oliven,
                PairingTag$1.Salbei,
                PairingTag$1.Reis,
                PairingTag$1.Käse,
                PairingTag$1.Wildfleisch,
                PairingTag$1.Ente,
                PairingTag$1.Hase,
                PairingTag$1.Gans,
                PairingTag$1.Wachteln,
                PairingTag$1.Fisch,
                PairingTag$1.Äpfel,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Schwarze_Johannisbeeren,
                PairingTag$1.Getrocknete_Früchte,
                PairingTag$1.Dunkle_Schokolade,
                PairingTag$1.Lachs,
                PairingTag$1.Kaninchen,
                PairingTag$1.Makrele,
                PairingTag$1.Tiramisu,
            ];
        }
    }

    class Rose {
        constructor() {
            this.name = "Rose";
            this.nameSymbol = "Ro";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CITRONELLOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.NEROL,
                AromaCompounds$1.ROSEN_KETONE,
            ];
            this.aromaGroup = AromaGroups$1.Duftende_Terpene;
            this.color = AromaGroupsColors$1.Duftende_Terpene;
            this.spice_group = SpiceGroup$1.Aromatisch;
            this.goes_well_with = [
                PairingTag$1.Paprika,
                PairingTag$1.Gurke,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Käse,
                PairingTag$1.Eier,
                PairingTag$1.Lamm,
                PairingTag$1.Hühnchen,
                PairingTag$1.Fisch,
                PairingTag$1.Melone,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Beeren,
                PairingTag$1.Himbeeren,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Äpfel,
                PairingTag$1.Mandeln,
                PairingTag$1.Dunkle_Schokolade,
                PairingTag$1.Kaffee,
                PairingTag$1.Whiskey,
                PairingTag$1.Pistazien,
                PairingTag$1.Rettich,
                PairingTag$1.Feigen,
                PairingTag$1.Datteln,
                PairingTag$1.Zimt,
                PairingTag$1.Limette,
                PairingTag$1.Honig,
                PairingTag$1.Kümmel,
                PairingTag$1.Couscous,
            ];
        }
    }

    class Koriander {
        constructor() {
            this.name = "Koriander";
            this.nameSymbol = "Ko";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CYMOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.TERPINENE,
            ];
            this.aromaGroup = AromaGroups$1.Duftende_Terpene;
            this.color = AromaGroupsColors$1.Duftende_Terpene;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Rote_Beete,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Pilze,
                PairingTag$1.Blattgemüse,
                PairingTag$1.Staudensellerie,
                PairingTag$1.Fenchel,
                PairingTag$1.Kohl,
                PairingTag$1.Artischocken,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Grüne_Bohnen,
                PairingTag$1.Knoblauch,
                PairingTag$1.Lavendel,
                PairingTag$1.Hühnchen,
                PairingTag$1.Schwein,
                PairingTag$1.Ente,
                PairingTag$1.Wildfleisch,
                PairingTag$1.Blutwurst,
                PairingTag$1.Schalentiere,
                PairingTag$1.Fisch,
                PairingTag$1.Thunfisch,
                PairingTag$1.Oliven,
                PairingTag$1.Tomaten,
                PairingTag$1.Beeren,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Äpfel,
                PairingTag$1.Kaffee,
                PairingTag$1.Glühwein,
                PairingTag$1.Gin,
                PairingTag$1.Dal,
                PairingTag$1.Curry,
                PairingTag$1.Eier,
                PairingTag$1.Schalotten,
                PairingTag$1.Jalapenos,
                PairingTag$1.Minze,
                PairingTag$1.Limette,
                PairingTag$1.Orange,
                PairingTag$1.Oktopus,
                PairingTag$1.Tintenfisch,
                PairingTag$1.Honig,
                PairingTag$1.Rose,
                PairingTag$1.Kreuzkümmel,
                PairingTag$1.Couscous,
            ];
        }
    }

    class Kreuzkuemmel {
        constructor() {
            this.name = "Kreuzkümmel";
            this.nameSymbol = "Kk";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CUMINALDEHYD,
                AromaCompounds$1.CUMINALDEHYD,
                AromaCompounds$1.CYMOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.TERPINENE,
            ];
            this.aromaGroup = AromaGroups$1.Erdige_Terpene;
            this.color = AromaGroupsColors$1.Erdige_Terpene;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Rote_Beete,
                PairingTag$1.Kohl,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Dill,
                PairingTag$1.Koriander,
                PairingTag$1.Couscous,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Joghurt,
                PairingTag$1.Eier,
                PairingTag$1.Feta,
                PairingTag$1.Fisch,
                PairingTag$1.Lamm,
                PairingTag$1.Hühnchen,
                PairingTag$1.Rind,
                PairingTag$1.Avocado,
                PairingTag$1.Oliven,
                PairingTag$1.Zucchini,
                PairingTag$1.Aubergine,
                PairingTag$1.Tomaten,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Aprikosen,
                PairingTag$1.Sesam,
                PairingTag$1.Walnüsse,
                PairingTag$1.Falafel,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Minze,
                PairingTag$1.Karotten,
                PairingTag$1.Granatapfel,
                PairingTag$1.Feigen,
            ];
        }
    }

    class Schwarzkuemmel {
        constructor() {
            this.name = "Schwarzkümmel";
            this.nameSymbol = "Sk";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARVACROL,
                AromaCompounds$1.D_CARVON,
                AromaCompounds$1.CYMOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.THYMOCHINON,
            ];
            this.aromaGroup = AromaGroups$1.Erdige_Terpene;
            this.color = AromaGroupsColors$1.Erdige_Terpene;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Rote_Beete,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Eier,
                PairingTag$1.Ziegenkäse,
                PairingTag$1.Lamm,
                PairingTag$1.Rind,
                PairingTag$1.Hühnchen,
                PairingTag$1.Tomaten,
                PairingTag$1.Mozzarella,
                PairingTag$1.Basilikum,
                PairingTag$1.Rührei,
                PairingTag$1.Feta,
                PairingTag$1.Granatapfel,
                PairingTag$1.Minze,
                PairingTag$1.Kichererbsen,
                PairingTag$1.Zitronenschale,
            ];
        }
    }

    class Mohrenpfeffer {
        constructor() {
            this.name = "Mohrenpfeffer";
            this.nameSymbol = "Mp";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.FENCHON,
                AromaCompounds$1.FENCHON,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.GERMACREN,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.VANILLIN,
            ];
            this.aromaGroup = AromaGroups$1.Durchdringende_Terpene;
            this.color = AromaGroupsColors$1.Durchdringende_Terpene;
            this.spice_group = SpiceGroup$1.Pikant;
            this.goes_well_with = [];
        }
    }

    class SchwarzerKardamom {
        constructor() {
            this.name = "Schwarzer Kardamom";
            this.nameSymbol = "Ska";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.DIMETHOXYPHENOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.SABINEN,
                AromaCompounds$1.TERPINYLACETAT,
            ];
            this.aromaGroup = AromaGroups$1.Durchdringende_Terpene;
            this.color = AromaGroupsColors$1.Durchdringende_Terpene;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Blattgemüse,
                PairingTag$1.Karotten,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Erbsen,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Ingwer,
                PairingTag$1.Reis,
                PairingTag$1.Linsen,
                PairingTag$1.Hühnchen,
                PairingTag$1.Ente,
                PairingTag$1.Speck,
                PairingTag$1.Rind,
                PairingTag$1.Lamm,
                PairingTag$1.Limette,
                PairingTag$1.Dunkle_Schokolade,
                PairingTag$1.Pho,
                PairingTag$1.Muscheln,
                PairingTag$1.Mais,
                PairingTag$1.Tomaten,
                PairingTag$1.Curryblätter,
                PairingTag$1.Chili,
                PairingTag$1.Rührei,
                PairingTag$1.Karamell,
                PairingTag$1.Käse,
                PairingTag$1.Thymian,
                PairingTag$1.Honig,
            ];
        }
    }

    class GruenerKardamom {
        constructor() {
            this.name = "Grüner Kardamom";
            this.nameSymbol = "Gka";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.ALPHA_FENCHOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.LINALOOL,
            ];
            this.aromaGroup = AromaGroups$1.Durchdringende_Terpene;
            this.color = AromaGroupsColors$1.Durchdringende_Terpene;
            this.spice_group = SpiceGroup$1.Süß;
            this.goes_well_with = [
                PairingTag$1.Kohl,
                PairingTag$1.Karotten,
                PairingTag$1.Safran,
                PairingTag$1.Reis,
                PairingTag$1.Eier,
                PairingTag$1.Sahne,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Lamm,
                PairingTag$1.Ente,
                PairingTag$1.Hühnchen,
                PairingTag$1.Birne,
                PairingTag$1.Aprikosen,
                PairingTag$1.Bananen,
                PairingTag$1.Mango,
                PairingTag$1.Schokolade,
                PairingTag$1.Kaffee,
                PairingTag$1.Mandeln,
                PairingTag$1.Aprikosen,
                PairingTag$1.Vanille,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Limette,
                PairingTag$1.Koriander,
                PairingTag$1.Rosenblätter,
                PairingTag$1.Passionsfrucht,
            ];
        }
    }

    class Lorbeer {
        constructor() {
            this.name = "Lorbeer";
            this.nameSymbol = "Lb";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.PHELLANDREN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.TERPINEOL,
            ];
            this.aromaGroup = AromaGroups$1.Durchdringende_Terpene;
            this.color = AromaGroupsColors$1.Durchdringende_Terpene;
            this.spice_group = SpiceGroup$1.Aromatisch;
            this.goes_well_with = [
                PairingTag$1.Gemüse,
                PairingTag$1.Pilze,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Linsen,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Hühnchen,
                PairingTag$1.Tomaten,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Äpfel,
                PairingTag$1.Feigen,
                PairingTag$1.Dunkle_Schokolade,
                PairingTag$1.Brühe,
                PairingTag$1.Zwiebelsuppe,
                PairingTag$1.Fischpastete,
                PairingTag$1.Ragu,
                PairingTag$1.Pfirsiche,
                PairingTag$1.Pflaumen,
                PairingTag$1.Zitronenschale,
            ];
        }
    }

    class Galgant {
        constructor() {
            this.name = "Galgant";
            this.nameSymbol = "Ga";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.KAMPFER,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.ALPHA_FENCHOL,
                AromaCompounds$1.GALANGALACETAT,
                AromaCompounds$1.ZIMTSÄUREMETHYLESTER,
            ];
            this.aromaGroup = AromaGroups$1.Durchdringende_Terpene;
            this.color = AromaGroupsColors$1.Durchdringende_Terpene;
            this.spice_group = SpiceGroup$1.Pikant;
            this.goes_well_with = [
                PairingTag$1.Karotten,
                PairingTag$1.Fenchel,
                PairingTag$1.Pilze,
                PairingTag$1.Chili,
                PairingTag$1.Knoblauch,
                PairingTag$1.Liebstöckel,
                PairingTag$1.Koriander,
                PairingTag$1.Reis,
                PairingTag$1.Nudeln,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Rind,
                PairingTag$1.Hühnchen,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Trauben,
                PairingTag$1.Birne,
                PairingTag$1.Curry,
                PairingTag$1.Grüne_Bohnen,
                PairingTag$1.Zitronengras,
                PairingTag$1.Limette,
                PairingTag$1.Pak_Choi,
                PairingTag$1.Gans,
                PairingTag$1.Gans,
            ];
        }
    }

    class Loomi {
        constructor() {
            this.name = "Loomi";
            this.nameSymbol = "Lo";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.FENCHON,
                AromaCompounds$1.HUMULEN,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.METHOXYCOUMARIN,
            ];
            this.aromaGroup = AromaGroups$1.Zitrustönige_Terpene;
            this.color = AromaGroupsColors$1.Zitrustönige_Terpene;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Lamm,
                PairingTag$1.Hühnchen,
                PairingTag$1.Schwein,
                PairingTag$1.Rind,
                PairingTag$1.Tomaten,
                PairingTag$1.Gurke,
                PairingTag$1.Nüsse,
                PairingTag$1.Weiße_Bohnen,
                PairingTag$1.Ingwer,
                PairingTag$1.Avocado,
                PairingTag$1.Dill,
                PairingTag$1.Cayennepfeffer,
                PairingTag$1.Chili,
                PairingTag$1.Granatapfel,
                PairingTag$1.Minze,
                PairingTag$1.Safran,
                PairingTag$1.Couscous,
                PairingTag$1.Linsen,
            ];
        }
    }

    class Zitronenmyrte {
        constructor() {
            this.name = "Zitronenmyrte";
            this.nameSymbol = "Zm";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.CITRONELLAL,
                AromaCompounds$1.CYCLOCITRAL,
                AromaCompounds$1.HEPTANON,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.SULCATON,
            ];
            this.aromaGroup = AromaGroups$1.Zitrustönige_Terpene;
            this.color = AromaGroupsColors$1.Zitrustönige_Terpene;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [];
        }
    }

    class Zitronengras {
        constructor() {
            this.name = "Zitronengras";
            this.nameSymbol = "Zg";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.NEROL,
            ];
            this.aromaGroup = AromaGroups$1.Zitrustönige_Terpene;
            this.color = AromaGroupsColors$1.Zitrustönige_Terpene;
            this.spice_group = SpiceGroup$1.Aromatisch;
            this.goes_well_with = [
                PairingTag$1.Pilze,
                PairingTag$1.Bambussprossen,
                PairingTag$1.Lotuswurzel,
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Karotten,
                PairingTag$1.Nudeln,
                PairingTag$1.Fisch,
                PairingTag$1.Schwein,
                PairingTag$1.Rind,
                PairingTag$1.Hühnchen,
                PairingTag$1.Tomaten,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Kokosnusscreme,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Fisch,
                PairingTag$1.Curry,
                PairingTag$1.Muscheln,
                PairingTag$1.Schalotten,
                PairingTag$1.Knoblauch,
                PairingTag$1.Ingwer,
                PairingTag$1.Chili,
                PairingTag$1.Galgant,
                PairingTag$1.Thai_Basilikum,
                PairingTag$1.Garnelen,
                PairingTag$1.Kebab,
                PairingTag$1.Koriander,
            ];
        }
    }

    class Amchur {
        constructor() {
            this.name = "Amchur";
            this.nameSymbol = "Am";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CADINENE,
                AromaCompounds$1.ZITRONENSÄURE,
                AromaCompounds$1.CUBEBIN,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.OCIMENE,
                AromaCompounds$1.OCIMENE,
                AromaCompounds$1.SELINENE,
            ];
            this.aromaGroup = AromaGroups$1.Süßsaure_Säuren;
            this.color = AromaGroupsColors$1.Süßsaure_Säuren;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Blumenkohl,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Aubergine,
                PairingTag$1.Okra,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Garnelen,
                PairingTag$1.Hühnchen,
                PairingTag$1.Lamm,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Pakoras,
                PairingTag$1.Samosas,
                PairingTag$1.Mango,
                PairingTag$1.Sesam,
                PairingTag$1.Koriander,
                PairingTag$1.Koriandersamen,
                PairingTag$1.Limette,
                PairingTag$1.Butter,
                PairingTag$1.Senf,
                PairingTag$1.Zitronengras,
                PairingTag$1.Curryblätter,
            ];
        }
    }

    class Anardana {
        constructor() {
            this.name = "Anardana";
            this.nameSymbol = "Ad";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CAREN,
                AromaCompounds$1.ZITRONENSÄURE,
                AromaCompounds$1.ZITRONENSÄURE,
                AromaCompounds$1.HEXANAL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.ÄPFELSÄURE,
                AromaCompounds$1.ÄPFELSÄURE,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.TANNINVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Süßsaure_Säuren;
            this.color = AromaGroupsColors$1.Süßsaure_Säuren;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Brokkoli,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Spinat,
                PairingTag$1.Kichererbsen,
                PairingTag$1.Reis,
                PairingTag$1.Hühnchen,
                PairingTag$1.Gurke,
                PairingTag$1.Avocado,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Walnüsse,
                PairingTag$1.Butter,
                PairingTag$1.Dunkle_Schokolade,
                PairingTag$1.Kreuzkümmel,
                PairingTag$1.Granatapfel,
                PairingTag$1.Sesam,
                PairingTag$1.Mango,
                PairingTag$1.Limette,
                PairingTag$1.Ente,
                PairingTag$1.Orange,
            ];
        }
    }

    class Sumach {
        constructor() {
            this.name = "Sumach";
            this.nameSymbol = "Su";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.CEMBREN,
                AromaCompounds$1.ZITRONENSÄURE,
                AromaCompounds$1.ÄPFELSÄURE,
                AromaCompounds$1.ÄPFELSÄURE,
                AromaCompounds$1.NONANAL,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.TANNINVERBINDUNGEN,
                AromaCompounds$1.WEINSÄURE,
            ];
            this.aromaGroup = AromaGroups$1.Süßsaure_Säuren;
            this.color = AromaGroupsColors$1.Süßsaure_Säuren;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Spinat,
                PairingTag$1.Minze,
                PairingTag$1.Kichererbsen,
                PairingTag$1.Linsen,
                PairingTag$1.Reis,
                PairingTag$1.Linsen,
                PairingTag$1.Reis,
                PairingTag$1.Joghurt,
                PairingTag$1.Käse,
                PairingTag$1.Fisch,
                PairingTag$1.Hühnchen,
                PairingTag$1.Lamm,
                PairingTag$1.Tomaten,
                PairingTag$1.Gurke,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Aubergine,
                PairingTag$1.Walnüsse,
                PairingTag$1.Fenchel,
                PairingTag$1.Rettich,
                PairingTag$1.Granatapfel,
                PairingTag$1.Ananas,
                PairingTag$1.Feta,
                PairingTag$1.Rotweinessig,
                PairingTag$1.Feigen,
                PairingTag$1.Mais,
                PairingTag$1.Datteln,
                PairingTag$1.Tahini,
            ];
        }
    }

    class Tamarinde {
        constructor() {
            this.name = "Tamarinde";
            this.nameSymbol = "Ta";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.FURFURAL,
                AromaCompounds$1.FURFURAL,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PHENYLACETALDEHYD_2,
                AromaCompounds$1.PHENYLACETALDEHYD_2,
                AromaCompounds$1.WEINSÄURE,
            ];
            this.aromaGroup = AromaGroups$1.Süßsaure_Säuren;
            this.color = AromaGroupsColors$1.Süßsaure_Säuren;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Pilze,
                PairingTag$1.Nudeln,
                PairingTag$1.Bulgur,
                PairingTag$1.Reis,
                PairingTag$1.Linsen,
                PairingTag$1.Joghurt,
                PairingTag$1.Fisch,
                PairingTag$1.Fleisch,
                PairingTag$1.Okra,
                PairingTag$1.Aubergine,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Datteln,
                PairingTag$1.Erdnüsse,
                PairingTag$1.Karotten,
                PairingTag$1.Zimt,
                PairingTag$1.Kreuzkümmel,
                PairingTag$1.Chili,
                PairingTag$1.Muscheln,
                PairingTag$1.Lamm,
                PairingTag$1.Curry,
            ];
        }
    }

    class Johannisbrotschote {
        constructor() {
            this.name = "Johannisbrotschote";
            this.nameSymbol = "Jo";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ZIMTALDEHYD,
                AromaCompounds$1.FARNESENE,
                AromaCompounds$1.FURANEOL,
                AromaCompounds$1.CAPRONSÄURE,
                AromaCompounds$1.CAPRONSÄURE,
                AromaCompounds$1.VALERIANSÄURE,
                AromaCompounds$1.VALERIANSÄURE,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Süßsaure_Säuren;
            this.color = AromaGroupsColors$1.Süßsaure_Säuren;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [];
        }
    }

    class Berberitze {
        constructor() {
            this.name = "Berberitze";
            this.nameSymbol = "Be";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ANISALDEHYD,
                AromaCompounds$1.ZITRONENSÄURE,
                AromaCompounds$1.HEXANAL,
                AromaCompounds$1.HEXANAL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.ÄPFELSÄURE,
                AromaCompounds$1.NONANAL,
                AromaCompounds$1.WEINSÄURE,
            ];
            this.aromaGroup = AromaGroups$1.Fruchtige_Aldehyde;
            this.color = AromaGroupsColors$1.Fruchtige_Aldehyde;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [];
        }
    }

    class Kakao {
        constructor() {
            this.name = "Kakao";
            this.nameSymbol = "Ka";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.DIMETHYLPYRAZIN,
                AromaCompounds$1.ESTERVERBINDUNGEN,
                AromaCompounds$1.FURANEOL,
                AromaCompounds$1.ISOVALERALDEHYD,
                AromaCompounds$1.ISOVALERALDEHYD,
                AromaCompounds$1.PHENOLVERBINDUNGEN,
                AromaCompounds$1.PHENYLACETALDEHYD,
            ];
            this.aromaGroup = AromaGroups$1.Fruchtige_Aldehyde;
            this.color = AromaGroupsColors$1.Fruchtige_Aldehyde;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Rote_Beete,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Sahne,
                PairingTag$1.Speck,
                PairingTag$1.Fleisch,
                PairingTag$1.Tomaten,
                PairingTag$1.Avocado,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Bananen,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Beeren,
                PairingTag$1.Nüsse,
                PairingTag$1.Kaffee,
                PairingTag$1.Chili,
                PairingTag$1.Pilze,
                PairingTag$1.Rose,
                PairingTag$1.Erdbeeren,
                PairingTag$1.Ziegenkäse,
                PairingTag$1.Kirschen,
            ];
        }
    }

    class Paprika {
        constructor() {
            this.name = "Paprika";
            this.nameSymbol = "Pa";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ACETOIN,
                AromaCompounds$1.CAPSAICIN,
                AromaCompounds$1.ZITRONENSÄURE,
                AromaCompounds$1.ESSIGESTER,
                AromaCompounds$1.ISOVALERALDEHYD,
                AromaCompounds$1.ÄPFELSÄURE,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Röstige_Pysazine;
            this.color = AromaGroupsColors$1.Röstige_Pysazine;
            this.spice_group = SpiceGroup$1.Pikant;
            this.goes_well_with = [
                PairingTag$1.Kohl,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Pilze,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Couscous,
                PairingTag$1.Eier,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Fisch,
                PairingTag$1.Meeresfrüchte,
                PairingTag$1.Fleisch,
                PairingTag$1.Artischocken,
                PairingTag$1.Gurke,
                PairingTag$1.Pflaumen,
                PairingTag$1.Paella,
                PairingTag$1.Gulasch,
                PairingTag$1.Oktopus,
                PairingTag$1.Tomaten,
                PairingTag$1.Petersilie,
                PairingTag$1.Knoblauch,
                PairingTag$1.Lorbeer,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Limette,
                PairingTag$1.Chili,
                PairingTag$1.Käse,
            ];
        }
    }

    class Akazie {
        constructor() {
            this.name = "Akazie";
            this.nameSymbol = "Ak";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.PHENOLVERBINDUNGEN,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Röstige_Pysazine;
            this.color = AromaGroupsColors$1.Röstige_Pysazine;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Kartoffeln,
                PairingTag$1.Süßkartoffeln,
                PairingTag$1.Pilze,
                PairingTag$1.Reis,
                PairingTag$1.Eier,
                PairingTag$1.Fisch,
                PairingTag$1.Rind,
                PairingTag$1.Hühnchen,
                PairingTag$1.Lamm,
                PairingTag$1.Nüsse,
                PairingTag$1.Schokolade,
                PairingTag$1.Kaffee,
                PairingTag$1.Sahne,
                PairingTag$1.Schokolade,
                PairingTag$1.Pflaumen,
                PairingTag$1.Ingwer,
                PairingTag$1.Cashewnüsse,
                PairingTag$1.Rotwein,
                PairingTag$1.Bananen,
                PairingTag$1.Kokosnuss,
            ];
        }
    }

    class Sesam {
        constructor() {
            this.name = "Sesam";
            this.nameSymbol = "Sm";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.FURFURYLTHIOL_2,
                AromaCompounds$1.HEXANAL,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
                AromaCompounds$1.SESAMOL,
            ];
            this.aromaGroup = AromaGroups$1.Röstige_Pysazine;
            this.color = AromaGroupsColors$1.Röstige_Pysazine;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Karotten,
                PairingTag$1.Rote_Beete,
                PairingTag$1.Kohl,
                PairingTag$1.Bohnen,
                PairingTag$1.Tofu,
                PairingTag$1.Nudeln,
                PairingTag$1.Käse,
                PairingTag$1.Meeresfrüchte,
                PairingTag$1.Hühnchen,
                PairingTag$1.Aubergine,
                PairingTag$1.Bananen,
                PairingTag$1.Äpfel,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Honig,
                PairingTag$1.Sojasauce,
                PairingTag$1.Reisessig,
                PairingTag$1.Fisch,
                PairingTag$1.Knoblauch,
                PairingTag$1.Chili,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Parmesan,
                PairingTag$1.Tahini,
                PairingTag$1.Aubergine,
                PairingTag$1.Granatapfel,
            ];
        }
    }

    class Knoblauch {
        constructor() {
            this.name = "Knoblauch";
            this.nameSymbol = "Kn";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CAREN,
                AromaCompounds$1.DIALLYLTRISULFID,
                AromaCompounds$1.DIALLYLTRISULFID,
                AromaCompounds$1.DIALLYDISULFID,
                AromaCompounds$1.DIALLYDISULFID,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.SABINEN,
            ];
            this.aromaGroup = AromaGroups$1.Schwefelverbindungen;
            this.color = AromaGroupsColors$1.Schwefelverbindungen;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Gemüse,
                PairingTag$1.Trüffel,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Ziegenkäse,
                PairingTag$1.Butter,
                PairingTag$1.Fleisch,
                PairingTag$1.Fisch,
                PairingTag$1.Meeresfrüchte,
                PairingTag$1.Nüsse,
                PairingTag$1.Curry,
                PairingTag$1.Weißwein,
                PairingTag$1.Ricotta,
                PairingTag$1.Melone,
                PairingTag$1.Käse,
                PairingTag$1.Chili,
                PairingTag$1.Bärlauch,
                PairingTag$1.Grüne_Bohnen,
            ];
        }
    }

    class Asant {
        constructor() {
            this.name = "Asant";
            this.nameSymbol = "As";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.EUDESMOL,
                AromaCompounds$1.FERULASÄURE,
                AromaCompounds$1.OCIMENE,
                AromaCompounds$1.PHELLANDREN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.SULFIDVERBINDUNGEN,
                AromaCompounds$1.SULFIDVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Schwefelverbindungen;
            this.color = AromaGroupsColors$1.Schwefelverbindungen;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Kohl,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Okra,
                PairingTag$1.Pilze,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Karotten,
                PairingTag$1.Spinat,
                PairingTag$1.Koriander,
                PairingTag$1.Minze,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Lamm,
                PairingTag$1.Hühnchen,
                PairingTag$1.Fisch,
                PairingTag$1.Dal,
                PairingTag$1.Mango,
                PairingTag$1.Chili,
                PairingTag$1.Kreuzkümmel,
                PairingTag$1.Grüner_Kardamom,
                PairingTag$1.Limette,
                PairingTag$1.Knoblauch,
                PairingTag$1.Zwiebeln,
                PairingTag$1.Petersilie,
                PairingTag$1.Käse,
                PairingTag$1.Lauch,
                PairingTag$1.Senf,
                PairingTag$1.Ingwer,
                PairingTag$1.Zimt,
            ];
        }
    }

    class Curryblaetter {
        constructor() {
            this.name = "Curryblätter";
            this.nameSymbol = "Cu";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.HEXANAL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PHENYLETHANTHIOL,
                AromaCompounds$1.PHENYLETHANTHIOL,
                AromaCompounds$1.PINENE,
            ];
            this.aromaGroup = AromaGroups$1.Schwefelverbindungen;
            this.color = AromaGroupsColors$1.Schwefelverbindungen;
            this.spice_group = SpiceGroup$1.Aromatisch;
            this.goes_well_with = [
                PairingTag$1.Gemüse,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Eier,
                PairingTag$1.Butter,
                PairingTag$1.Hühnchen,
                PairingTag$1.Lamm,
                PairingTag$1.Fisch,
                PairingTag$1.Meeresfrüchte,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Fladenbrot,
                PairingTag$1.Curry,
                PairingTag$1.Rührei,
                PairingTag$1.Grüne_Papaya,
                PairingTag$1.Pomelo,
                PairingTag$1.Kürbis,
            ];
        }
    }

    class Senf {
        constructor() {
            this.name = "Senf";
            this.nameSymbol = "Se";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.ACETYL_PYRROLIN,
                AromaCompounds$1.FURFURYLTHIOL,
                AromaCompounds$1.ISOTHIOCYANATE,
                AromaCompounds$1.ISOTHIOCYANATE,
                AromaCompounds$1.ISOVALERALDEHYD,
                AromaCompounds$1.METHYLBUTANAL,
                AromaCompounds$1.PINENE,
            ];
            this.aromaGroup = AromaGroups$1.Schwefelverbindungen;
            this.color = AromaGroupsColors$1.Schwefelverbindungen;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Kohl,
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Spinat,
                PairingTag$1.Eier,
                PairingTag$1.Käse,
                PairingTag$1.Hühnchen,
                PairingTag$1.Schwein,
                PairingTag$1.Rind,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Kaninchen,
                PairingTag$1.Tomaten,
                PairingTag$1.Curry,
                PairingTag$1.Dal,
                PairingTag$1.Limette,
                PairingTag$1.Rote_Beete,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Grüne_Bohnen,
                PairingTag$1.Orange,
                PairingTag$1.Haselnüsse,
                PairingTag$1.Karotten,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Dill,
                PairingTag$1.Minze,
                PairingTag$1.Papaya,
            ];
        }
    }

    class Paradieskoerner {
        constructor() {
            this.name = "Paradieskörner";
            this.nameSymbol = "Pk";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.GINGEROL,
                AromaCompounds$1.HUMULON,
                AromaCompounds$1.PARADOL,
                AromaCompounds$1.PARADOL,
            ];
            this.aromaGroup = AromaGroups$1.Stechende_Verbindungen;
            this.color = AromaGroupsColors$1.Stechende_Verbindungen;
            this.spice_group = SpiceGroup$1.Pikant;
            this.goes_well_with = [
                PairingTag$1.Schwarzer_Pfeffer,
                PairingTag$1.Langer_Pfeffer,
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Kürbis,
                PairingTag$1.Reis,
                PairingTag$1.Bohnen,
                PairingTag$1.Haferflocken,
                PairingTag$1.Käse,
                PairingTag$1.Sahne,
                PairingTag$1.Fisch,
                PairingTag$1.Fleisch,
                PairingTag$1.Aubergine,
                PairingTag$1.Tomaten,
                PairingTag$1.Orange,
                PairingTag$1.Pomelo,
                PairingTag$1.Grapefruit,
                PairingTag$1.Äpfel,
                PairingTag$1.Erdnüsse,
                PairingTag$1.Nelken,
                PairingTag$1.Safran,
                PairingTag$1.Ingwer,
                PairingTag$1.Grüner_Kardamom,
                PairingTag$1.Haselnüsse,
                PairingTag$1.Knoblauch,
            ];
        }
    }

    class Schwarzerpfeffer {
        constructor() {
            this.name = "Schwarzer Pfeffer";
            this.nameSymbol = "Pf";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PHELLANDREN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.PIPERIN,
                AromaCompounds$1.PIPERIN,
                AromaCompounds$1.ROTUNDONE,
            ];
            this.aromaGroup = AromaGroups$1.Stechende_Verbindungen;
            this.color = AromaGroupsColors$1.Stechende_Verbindungen;
            this.spice_group = SpiceGroup$1.Pikant;
            this.goes_well_with = [
                PairingTag$1.Kartoffeln,
                PairingTag$1.Fenchel,
                PairingTag$1.Tofu,
                PairingTag$1.Eier,
                PairingTag$1.Käse,
                PairingTag$1.Meeresfrüchte,
                PairingTag$1.Fisch,
                PairingTag$1.Hühnchen,
                PairingTag$1.Lamm,
                PairingTag$1.Innereien,
                PairingTag$1.Tomaten,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Steinfrüchte,
                PairingTag$1.Erdbeeren,
                PairingTag$1.Tintenfisch,
                PairingTag$1.Zitrone,
                PairingTag$1.Ananas,
                PairingTag$1.Zitronengras,
                PairingTag$1.Rotwein,
                PairingTag$1.Rotweinessig,
                PairingTag$1.Curry,
                PairingTag$1.Ingwer,
                PairingTag$1.Erbsen,
            ];
        }
    }

    class Szechuanpfeffer {
        constructor() {
            this.name = "Szechuan Pfeffer";
            this.nameSymbol = "Sz";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.SANSHOOL,
                AromaCompounds$1.SANSHOOL,
                AromaCompounds$1.TERPINEOL,
            ];
            this.aromaGroup = AromaGroups$1.Stechende_Verbindungen;
            this.color = AromaGroupsColors$1.Stechende_Verbindungen;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Kartoffeln,
                PairingTag$1.Pilze,
                PairingTag$1.Blattgemüse,
                PairingTag$1.Tofu,
                PairingTag$1.Nudeln,
                PairingTag$1.Dan_Dan_Nudeln,
                PairingTag$1.Eier,
                PairingTag$1.Fleisch,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Gin_Tonic,
                PairingTag$1.Zimt,
                PairingTag$1.Pflaumen,
                PairingTag$1.Süßkartoffeln,
                PairingTag$1.Ente,
                PairingTag$1.Pak_Choi,
                PairingTag$1.Litschi,
                PairingTag$1.Orangenblüten,
                PairingTag$1.Gnocchi,
                PairingTag$1.Chinakohl,
            ];
        }
    }

    class Ingwer {
        constructor() {
            this.name = "Ingwer";
            this.nameSymbol = "In";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.CURCUMIN,
                AromaCompounds$1.GERANIOL,
                AromaCompounds$1.GINGEROL,
                AromaCompounds$1.GINGEROL,
                AromaCompounds$1.LINALOOL,
                AromaCompounds$1.SHOGAOL,
                AromaCompounds$1.SHOGAOL,
                AromaCompounds$1.ZINGIBEREN,
                AromaCompounds$1.ZINGIBEREN,
            ];
            this.aromaGroup = AromaGroups$1.Stechende_Verbindungen;
            this.color = AromaGroupsColors$1.Stechende_Verbindungen;
            this.spice_group = SpiceGroup$1.Erding;
            this.goes_well_with = [
                PairingTag$1.Kürbis,
                PairingTag$1.Kohl,
                PairingTag$1.Gemüse,
                PairingTag$1.Rhabarbar,
                PairingTag$1.Eier,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Fisch,
                PairingTag$1.Meeresfrüchte,
                PairingTag$1.Schwein,
                PairingTag$1.Tomaten,
                PairingTag$1.Birne,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Erdnüsse,
                PairingTag$1.Sesam,
                PairingTag$1.Dunkle_Schokolade,
                PairingTag$1.Honig,
            ];
        }
    }

    class Chili {
        constructor() {
            this.name = "Chili";
            this.nameSymbol = "Ch";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CAPSAICIN,
                AromaCompounds$1.CAPSAICIN,
                AromaCompounds$1.CAPSAICINOIDE,
                AromaCompounds$1.ESTERVERBINDUNGEN,
                AromaCompounds$1.FURFURAL,
                AromaCompounds$1.HEXANAL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
            ];
            this.aromaGroup = AromaGroups$1.Stechende_Verbindungen;
            this.color = AromaGroupsColors$1.Stechende_Verbindungen;
            this.spice_group = SpiceGroup$1.Pikant;
            this.goes_well_with = [
                PairingTag$1.Mais,
                PairingTag$1.Süßkartoffeln,
                PairingTag$1.Maniok,
                PairingTag$1.Frischkäse,
                PairingTag$1.Bananen,
                PairingTag$1.Tomaten,
                PairingTag$1.Avocado,
                PairingTag$1.Gurke,
                PairingTag$1.Fisch,
                PairingTag$1.Tropische_Früchte,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Cashewnüsse,
                PairingTag$1.Schokolade,
                PairingTag$1.Kimchi,
                PairingTag$1.Melone,
                PairingTag$1.Feta,
                PairingTag$1.Minze,
                PairingTag$1.Kürbis,
                PairingTag$1.Lotuswurzel,
                PairingTag$1.Linsen,
                PairingTag$1.Paprika,
            ];
        }
    }

    class Safran {
        constructor() {
            this.name = "Safran";
            this.nameSymbol = "Sa";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.LANIERON,
                AromaCompounds$1.PICROCROCIN,
                AromaCompounds$1.PICROCROCIN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.SAFRANAL,
            ];
            this.aromaGroup = AromaGroups$1.Einzigartige_Stoffe;
            this.color = AromaGroupsColors$1.Einzigartige_Stoffe;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Lauch,
                PairingTag$1.Pilze,
                PairingTag$1.Spinat,
                PairingTag$1.Kürbis,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Karotten,
                PairingTag$1.Fenchel,
                PairingTag$1.Rhabarbar,
                PairingTag$1.Reis,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Fisch,
                PairingTag$1.Schalentiere,
                PairingTag$1.Kaninchen,
                PairingTag$1.Hühnchen,
                PairingTag$1.Tomaten,
                PairingTag$1.Orange,
                PairingTag$1.Mandeln,
                PairingTag$1.Honig,
                PairingTag$1.Weiße_Schokolade,
                PairingTag$1.Sardinen,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Pinienkerne,
                PairingTag$1.Rosinen,
                PairingTag$1.Fenchel,
                PairingTag$1.Chili,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Parmesan,
                PairingTag$1.Sahne,
                PairingTag$1.Schalotten,
                PairingTag$1.Limette,
                PairingTag$1.Papaya,
                PairingTag$1.Käse,
            ];
        }
    }

    class Mohn {
        constructor() {
            this.name = "Mohn";
            this.nameSymbol = "Mo";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.KAMPFER,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.GYLKOSID_VERBINDUNGEN,
                AromaCompounds$1.HEXANAL,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.PENTYLFURAN,
                AromaCompounds$1.PENTYLFURAN,
                AromaCompounds$1.PHENOLVERBINDUNGEN,
                AromaCompounds$1.PYRAZINVERBINDUNGEN,
                AromaCompounds$1.VINYLAMYLKETON,
            ];
            this.aromaGroup = AromaGroups$1.Einzigartige_Stoffe;
            this.color = AromaGroupsColors$1.Einzigartige_Stoffe;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Fenchel,
                PairingTag$1.Käse,
                PairingTag$1.Sahne,
                PairingTag$1.Eier,
                PairingTag$1.Fisch,
                PairingTag$1.Hühnchen,
                PairingTag$1.Zucchini,
                PairingTag$1.Gurke,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Birne,
                PairingTag$1.Mandeln,
                PairingTag$1.Schokolade,
                PairingTag$1.Gebäck,
                PairingTag$1.Zitrone,
                PairingTag$1.Karotten,
                PairingTag$1.Knoblauch,
                PairingTag$1.Walnüsse,
                PairingTag$1.Gurke,
                PairingTag$1.Pistazien,
                PairingTag$1.Vanille,
                PairingTag$1.Dunkle_Schokolade,
            ];
        }
    }

    class Ajowan {
        constructor() {
            this.name = "Ajowan";
            this.nameSymbol = "Aj";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CYMOL,
                AromaCompounds$1.MYRCEN,
                AromaCompounds$1.PINENE,
                AromaCompounds$1.TERPINENE,
                AromaCompounds$1.THYMOL,
                AromaCompounds$1.THYMOL,
            ];
            this.aromaGroup = AromaGroups$1.Einzigartige_Stoffe;
            this.color = AromaGroupsColors$1.Einzigartige_Stoffe;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Kartoffeln,
                PairingTag$1.Blumenkohl,
                PairingTag$1.Karotten,
                PairingTag$1.Grüne_Bohnen,
                PairingTag$1.Koriander,
                PairingTag$1.Koriandersamen,
                PairingTag$1.Spinat,
                PairingTag$1.Reis,
                PairingTag$1.Hühnchen,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Kichererbsen,
                PairingTag$1.Eier,
                PairingTag$1.Fisch,
                PairingTag$1.Tomaten,
                PairingTag$1.Linsen,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Curryblätter,
                PairingTag$1.Chili,
                PairingTag$1.Mango,
                PairingTag$1.Mais,
                PairingTag$1.Feta,
                PairingTag$1.Zuckererbsen,
                PairingTag$1.Nüsse,
                PairingTag$1.Buchweizen,
            ];
        }
    }

    class Selleriesamen {
        constructor() {
            this.name = "Selleriesamen";
            this.nameSymbol = "Si";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.HUMULEN,
                AromaCompounds$1.LIMONEN,
                AromaCompounds$1.SEDANOLID,
                AromaCompounds$1.SEDANOLID,
                AromaCompounds$1.SELINENE,
            ];
            this.aromaGroup = AromaGroups$1.Einzigartige_Stoffe;
            this.color = AromaGroupsColors$1.Einzigartige_Stoffe;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Kartoffeln,
                PairingTag$1.Käse,
                PairingTag$1.Eier,
                PairingTag$1.Fisch,
                PairingTag$1.Rind,
                PairingTag$1.Schwein,
                PairingTag$1.Hühnchen,
                PairingTag$1.Fisch,
                PairingTag$1.Zucchini,
                PairingTag$1.Curry,
                PairingTag$1.Mangold,
                PairingTag$1.Tahini,
                PairingTag$1.Joghurt,
            ];
        }
    }

    class Kurkuma {
        constructor() {
            this.name = "Kurkuma";
            this.nameSymbol = "Ku";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CINEOL,
                AromaCompounds$1.CITRAL,
                AromaCompounds$1.AR_TURMERON,
                AromaCompounds$1.AR_TURMERON,
                AromaCompounds$1.ZINGIBEREN,
            ];
            this.aromaGroup = AromaGroups$1.Einzigartige_Stoffe;
            this.color = AromaGroupsColors$1.Einzigartige_Stoffe;
            this.spice_group = SpiceGroup$1.Zitrisch;
            this.goes_well_with = [
                PairingTag$1.Wurzelgemüse,
                PairingTag$1.Aubergine,
                PairingTag$1.Blattgemüse,
                PairingTag$1.Spinat,
                PairingTag$1.Ingwer,
                PairingTag$1.Reis,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Eier,
                PairingTag$1.Milchprodukte,
                PairingTag$1.Fisch,
                PairingTag$1.Lamm,
                PairingTag$1.Schwein,
                PairingTag$1.Tomaten,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Weiße_Schokolade,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Pfeffer,
                PairingTag$1.Tamarinde,
                PairingTag$1.Datteln,
                PairingTag$1.Muscheln,
                PairingTag$1.Curryblätter,
                PairingTag$1.Schalotten,
                PairingTag$1.Knoblauch,
                PairingTag$1.Weißwein,
                PairingTag$1.Zitronenschale,
                PairingTag$1.Chili,
                PairingTag$1.Joghurt,
                PairingTag$1.Honig,
                PairingTag$1.Mandeln,
                PairingTag$1.Pilze,
                PairingTag$1.Äpfel,
                PairingTag$1.Kokosnuss,
                PairingTag$1.Kokosnusscreme,
                PairingTag$1.Limette,
                PairingTag$1.Kohl,
                PairingTag$1.Bockshornklee,
                PairingTag$1.Mais,
                PairingTag$1.Curry,
            ];
        }
    }

    class Bockshornklee {
        constructor() {
            this.name = "Bockshornklee";
            this.nameSymbol = "Bo";
            this.description = "";
            this.aromaCompounds = [
                AromaCompounds$1.CARYOPHYLLENE,
                AromaCompounds$1.EUGENOL,
                AromaCompounds$1.SOTOLON,
                AromaCompounds$1.VINYLAMYLKETON,
            ];
            this.aromaGroup = AromaGroups$1.Einzigartige_Stoffe;
            this.color = AromaGroupsColors$1.Einzigartige_Stoffe;
            this.spice_group = SpiceGroup$1.Scharf;
            this.goes_well_with = [
                PairingTag$1.Süßkartoffeln,
                PairingTag$1.Kartoffeln,
                PairingTag$1.Kürbis,
                PairingTag$1.Kohl,
                PairingTag$1.Grüne_Bohnen,
                PairingTag$1.Hülsenfrüchte,
                PairingTag$1.Sahne,
                PairingTag$1.Käse,
                PairingTag$1.Joghurt,
                PairingTag$1.Fisch,
                PairingTag$1.Lamm,
                PairingTag$1.Rind,
                PairingTag$1.Tomaten,
                PairingTag$1.Zitrusfrüchte,
                PairingTag$1.Walnüsse,
                PairingTag$1.Fladenbrot,
                PairingTag$1.Rosinen,
                PairingTag$1.Zimt,
                PairingTag$1.Kreuzkümmel,
                PairingTag$1.Fenchel,
                PairingTag$1.Koriander,
                PairingTag$1.Curry,
                PairingTag$1.Schwarzer_Pfeffer,
                PairingTag$1.Senf,
            ];
        }
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (366:6) <SpiceContainer shape={Math.random()} spice={baseSpice1}>
    function create_default_slot_1(ctx) {
    	let spicedropdown;
    	let updating_selectedSpice;
    	let current;

    	function spicedropdown_selectedSpice_binding(value) {
    		/*spicedropdown_selectedSpice_binding*/ ctx[9](value);
    	}

    	let spicedropdown_props = {
    		spices: /*allSpices*/ ctx[5],
    		onChange: /*newSpiceSelection*/ ctx[6]
    	};

    	if (/*baseSpice1*/ ctx[1] !== void 0) {
    		spicedropdown_props.selectedSpice = /*baseSpice1*/ ctx[1];
    	}

    	spicedropdown = new SpiceDropdown({
    			props: spicedropdown_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(spicedropdown, 'selectedSpice', spicedropdown_selectedSpice_binding));

    	const block = {
    		c: function create() {
    			create_component(spicedropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spicedropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const spicedropdown_changes = {};

    			if (!updating_selectedSpice && dirty & /*baseSpice1*/ 2) {
    				updating_selectedSpice = true;
    				spicedropdown_changes.selectedSpice = /*baseSpice1*/ ctx[1];
    				add_flush_callback(() => updating_selectedSpice = false);
    			}

    			spicedropdown.$set(spicedropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spicedropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spicedropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spicedropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(366:6) <SpiceContainer shape={Math.random()} spice={baseSpice1}>",
    		ctx
    	});

    	return block;
    }

    // (373:6) <SpiceContainer shape={Math.random()} spice={baseSpice2}>
    function create_default_slot(ctx) {
    	let spicedropdown;
    	let updating_selectedSpice;
    	let current;

    	function spicedropdown_selectedSpice_binding_1(value) {
    		/*spicedropdown_selectedSpice_binding_1*/ ctx[10](value);
    	}

    	let spicedropdown_props = {
    		spices: /*allSpices*/ ctx[5],
    		onChange: /*newSpiceSelection*/ ctx[6]
    	};

    	if (/*baseSpice2*/ ctx[2] !== void 0) {
    		spicedropdown_props.selectedSpice = /*baseSpice2*/ ctx[2];
    	}

    	spicedropdown = new SpiceDropdown({
    			props: spicedropdown_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(spicedropdown, 'selectedSpice', spicedropdown_selectedSpice_binding_1));

    	const block = {
    		c: function create() {
    			create_component(spicedropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spicedropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const spicedropdown_changes = {};

    			if (!updating_selectedSpice && dirty & /*baseSpice2*/ 4) {
    				updating_selectedSpice = true;
    				spicedropdown_changes.selectedSpice = /*baseSpice2*/ ctx[2];
    				add_flush_callback(() => updating_selectedSpice = false);
    			}

    			spicedropdown.$set(spicedropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spicedropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spicedropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spicedropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(373:6) <SpiceContainer shape={Math.random()} spice={baseSpice2}>",
    		ctx
    	});

    	return block;
    }

    // (418:6) {#each selectedSuggestions as selection}
    function create_each_block_1(ctx) {
    	let smallspicecontainer;
    	let current;

    	smallspicecontainer = new SmallSpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*selection*/ ctx[18],
    				onClick: /*removeFromSelection*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(smallspicecontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(smallspicecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const smallspicecontainer_changes = {};
    			if (dirty & /*selectedSuggestions*/ 16) smallspicecontainer_changes.spice = /*selection*/ ctx[18];
    			smallspicecontainer.$set(smallspicecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(smallspicecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(smallspicecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(smallspicecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(418:6) {#each selectedSuggestions as selection}",
    		ctx
    	});

    	return block;
    }

    // (431:6) {#each spiceSuggestions as suggestion}
    function create_each_block(ctx) {
    	let smallspicecontainer;
    	let current;

    	smallspicecontainer = new SmallSpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*suggestion*/ ctx[15],
    				onClick: /*addSuggestionToSelection*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(smallspicecontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(smallspicecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const smallspicecontainer_changes = {};
    			if (dirty & /*spiceSuggestions*/ 8) smallspicecontainer_changes.spice = /*suggestion*/ ctx[15];
    			smallspicecontainer.$set(smallspicecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(smallspicecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(smallspicecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(smallspicecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(431:6) {#each spiceSuggestions as suggestion}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div11;
    	let div4;
    	let div3;
    	let div0;
    	let aromagrouplegend;
    	let t0;
    	let spicecontainer0;
    	let t1;
    	let spicecontainer1;
    	let t2;
    	let div2;
    	let div1;
    	let chart;
    	let t3;
    	let div7;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div10;
    	let div8;
    	let t8;
    	let div9;
    	let current;
    	aromagrouplegend = new AromaGroupLegend({ $$inline: true });

    	spicecontainer0 = new SpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*baseSpice1*/ ctx[1],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spicecontainer1 = new SpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*baseSpice2*/ ctx[2],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	chart = new Base$1({
    			props: {
    				data: /*visualizationData*/ ctx[0],
    				colors: [
    					AromaGroupsColors$1.Süß_wärmende_Phenole,
    					AromaGroupsColors$1.Wärmende_Terpene,
    					AromaGroupsColors$1.Duftende_Terpene,
    					AromaGroupsColors$1.Erdige_Terpene,
    					AromaGroupsColors$1.Durchdringende_Terpene,
    					AromaGroupsColors$1.Zitrustönige_Terpene,
    					AromaGroupsColors$1.Süßsaure_Säuren,
    					AromaGroupsColors$1.Fruchtige_Aldehyde,
    					AromaGroupsColors$1.Röstige_Pysazine,
    					AromaGroupsColors$1.Schwefelverbindungen,
    					AromaGroupsColors$1.Stechende_Verbindungen,
    					AromaGroupsColors$1.Einzigartige_Stoffe
    				],
    				type: "donut",
    				maxSlices: "20",
    				height: 260,
    				animate: true,
    				truncateLegends: false,
    				valuesOverPoints: true,
    				axisOptions: {
    					xAxisMode: "tick",
    					yAxisMode: "tick",
    					xIsSeries: false
    				}
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*selectedSuggestions*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*spiceSuggestions*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(aromagrouplegend.$$.fragment);
    			t0 = space();
    			create_component(spicecontainer0.$$.fragment);
    			t1 = space();
    			create_component(spicecontainer1.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(chart.$$.fragment);
    			t3 = space();
    			div7 = element("div");
    			div5 = element("div");
    			div5.textContent = "Deine Gewürzmischung:";
    			t5 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div8.textContent = "Versuch doch mal...";
    			t8 = space();
    			div9 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "hideOnMobile svelte-qqz3tq");
    			add_location(div0, file, 362, 6, 11037);
    			attr_dev(div1, "class", "chartBox svelte-qqz3tq");
    			add_location(div1, file, 380, 8, 11611);
    			attr_dev(div2, "class", "hideOnMobile svelte-qqz3tq");
    			add_location(div2, file, 379, 6, 11576);
    			attr_dev(div3, "class", "flex svelte-qqz3tq");
    			add_location(div3, file, 361, 4, 11012);
    			attr_dev(div4, "class", "scrollableContainer svelte-qqz3tq");
    			add_location(div4, file, 360, 2, 10974);
    			attr_dev(div5, "class", "largerText svelte-qqz3tq");
    			add_location(div5, file, 415, 4, 12771);
    			attr_dev(div6, "class", "flex svelte-qqz3tq");
    			add_location(div6, file, 416, 4, 12827);
    			attr_dev(div7, "class", "scrollableContainer svelte-qqz3tq");
    			add_location(div7, file, 414, 2, 12733);
    			attr_dev(div8, "class", "largerText svelte-qqz3tq");
    			add_location(div8, file, 428, 4, 13108);
    			attr_dev(div9, "class", "flex svelte-qqz3tq");
    			add_location(div9, file, 429, 4, 13162);
    			attr_dev(div10, "class", "scrollableContainer svelte-qqz3tq");
    			add_location(div10, file, 427, 2, 13070);
    			attr_dev(div11, "class", "verticalGrid svelte-qqz3tq");
    			add_location(div11, file, 359, 0, 10945);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			mount_component(aromagrouplegend, div0, null);
    			append_dev(div3, t0);
    			mount_component(spicecontainer0, div3, null);
    			append_dev(div3, t1);
    			mount_component(spicecontainer1, div3, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(chart, div1, null);
    			append_dev(div11, t3);
    			append_dev(div11, div7);
    			append_dev(div7, div5);
    			append_dev(div7, t5);
    			append_dev(div7, div6);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(div6, null);
    				}
    			}

    			append_dev(div11, t6);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t8);
    			append_dev(div10, div9);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div9, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const spicecontainer0_changes = {};
    			if (dirty & /*baseSpice1*/ 2) spicecontainer0_changes.spice = /*baseSpice1*/ ctx[1];

    			if (dirty & /*$$scope, baseSpice1*/ 2097154) {
    				spicecontainer0_changes.$$scope = { dirty, ctx };
    			}

    			spicecontainer0.$set(spicecontainer0_changes);
    			const spicecontainer1_changes = {};
    			if (dirty & /*baseSpice2*/ 4) spicecontainer1_changes.spice = /*baseSpice2*/ ctx[2];

    			if (dirty & /*$$scope, baseSpice2*/ 2097156) {
    				spicecontainer1_changes.$$scope = { dirty, ctx };
    			}

    			spicecontainer1.$set(spicecontainer1_changes);
    			const chart_changes = {};
    			if (dirty & /*visualizationData*/ 1) chart_changes.data = /*visualizationData*/ ctx[0];
    			chart.$set(chart_changes);

    			if (dirty & /*Math, selectedSuggestions, removeFromSelection*/ 272) {
    				each_value_1 = /*selectedSuggestions*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div6, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*Math, spiceSuggestions, addSuggestionToSelection*/ 136) {
    				each_value = /*spiceSuggestions*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div9, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aromagrouplegend.$$.fragment, local);
    			transition_in(spicecontainer0.$$.fragment, local);
    			transition_in(spicecontainer1.$$.fragment, local);
    			transition_in(chart.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aromagrouplegend.$$.fragment, local);
    			transition_out(spicecontainer0.$$.fragment, local);
    			transition_out(spicecontainer1.$$.fragment, local);
    			transition_out(chart.$$.fragment, local);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_component(aromagrouplegend);
    			destroy_component(spicecontainer0);
    			destroy_component(spicecontainer1);
    			destroy_component(chart);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function removeFromArray(arr, value) {
    	return arr.filter(function (ele) {
    		return ele != value;
    	});
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let allSpices = [
    		new Ajowan(),
    		new Akazie(),
    		new Amchur(),
    		new Anardana(),
    		new Anis(),
    		new Annatto(),
    		new Asant(),
    		new Berberitze(),
    		new Bockshornklee(),
    		new Cassia_Zimt(),
    		new Chili(),
    		new Curryblaetter(),
    		new Dill(),
    		new Fenchel(),
    		new Galgant(),
    		new Gewuerznelke(),
    		new GruenerKardamom(),
    		new Ingwer(),
    		new Johannisbrotschote(),
    		new Kakao(),
    		new Knoblauch(),
    		new Koriander(),
    		new Kreuzkuemmel(),
    		new Kuemmel(),
    		new Kurkuma(),
    		new Mahlab(),
    		new Mastix(),
    		new Mohn(),
    		new Loomi(),
    		new Lorbeer(),
    		new Mohrenpfeffer(),
    		new Muskatbluete(),
    		new Muskatnuss(),
    		new Paprika(),
    		new Paradieskoerner(),
    		new Piment(),
    		new Rose(),
    		new Safran(),
    		new SchwarzerKardamom(),
    		new Schwarzerpfeffer(),
    		new Schwarzkuemmel(),
    		new Selleriesamen(),
    		new Senf(),
    		new Sesam(),
    		new Sueßholz(),
    		new Sumach(),
    		new Sternanis(),
    		new Szechuanpfeffer(),
    		new Tamarinde(),
    		new Vanille(),
    		new Wacholder(),
    		new Zimt(),
    		new Zitronengras(),
    		new Zitronenmyrte()
    	];

    	let visualizationData = { labels: [], datasets: [{ values: [] }] };
    	let selectedSpices = [];
    	let baseSpice1 = new NoSpice();
    	let baseSpice2 = new NoSpice();
    	let spiceSuggestions = [];
    	let selectedSuggestions = [];

    	function newSpiceSelection() {
    		$$invalidate(4, selectedSuggestions = []);
    		selectedSpices[0] = baseSpice1;
    		selectedSpices[1] = baseSpice2;
    		makeSpiceSuggestion();
    		$$invalidate(0, visualizationData = updateVisualization());
    	}

    	function addSuggestionToSelection(spice) {
    		$$invalidate(4, selectedSuggestions = selectedSuggestions.concat([spice]));
    		makeSpiceSuggestion();
    		$$invalidate(0, visualizationData = updateVisualization());
    	}

    	function removeFromSelection(spice) {
    		$$invalidate(4, selectedSuggestions = removeFromArray(selectedSuggestions, spice));
    		makeSpiceSuggestion();
    		$$invalidate(0, visualizationData = updateVisualization());
    	}

    	function isSpiceInSelection(spice) {
    		selectedSuggestions.forEach(selected_spices => {
    			if (selected_spices.name === spice.name) {
    				return true;
    			}
    		});

    		if (baseSpice1.name === spice.name || baseSpice2.name === spice.name) {
    			return true;
    		}
    	}

    	function makeSpiceSuggestion() {
    		// Idea:
    		// Two primary Spices - a suggestion should always share "n" (2?) compounds of each primary spice space
    		// Selections - another suggestion should always maximise the amount of compunds not yet in the total spice space
    		// All compounds of a new selection get added to the total spice space
    		$$invalidate(3, spiceSuggestions = []);

    		// Push current selected spice Compounds into array
    		let currentSelections = [];

    		selectedSuggestions.forEach(spice => {
    			currentSelections.push({
    				spice,
    				compounds: [...spice.aromaCompounds]
    			});
    		});

    		// Calculate matches with the primary and selected spice compounds
    		let matchesWithPrimarySpices = [];

    		allSpices.forEach(spice => {
    			let baseCounter = 0;
    			let selectedCounter = 0;

    			spice.aromaCompounds.forEach(compound => {
    				baseSpice1.aromaCompounds.forEach(baseCompound1 => {
    					if (compound === baseCompound1) {
    						baseCounter++;
    					}
    				});

    				baseSpice2.aromaCompounds.forEach(baseCompound2 => {
    					if (compound === baseCompound2) {
    						baseCounter++;
    					}
    				});

    				currentSelections.forEach(selectedSpice => {
    					selectedSpice.compounds.forEach(selectedCompound => {
    						if (compound === selectedCompound) {
    							selectedCounter++;
    						}
    					});
    				});
    			});

    			matchesWithPrimarySpices.push({
    				baseMatches: baseCounter,
    				selectedMatches: selectedCounter
    			});
    		});

    		// Calculate spice potential
    		let minPrimaryMatches = 2;

    		let spicePotentials = [];

    		for (let i = 0; i < allSpices.length; i++) {
    			let spice = allSpices[i];
    			let potential = spice.aromaCompounds.length - matchesWithPrimarySpices[i].baseMatches;
    			console.log(matchesWithPrimarySpices[i]);

    			if (matchesWithPrimarySpices[i].baseMatches < minPrimaryMatches || isSpiceInSelection(spice)) {
    				spicePotentials.push({ spice, potential: -100 });
    				continue;
    			}

    			spice.aromaCompounds.forEach(compound => {
    				currentSelections.forEach(selectedSpice => {
    					selectedSpice.spice.aromaCompounds.forEach(selectedCompound => {
    						if (compound === selectedCompound) {
    							potential--;
    						}
    					});
    				});
    			});

    			spicePotentials.push({
    				spice,
    				potential,
    				matches: matchesWithPrimarySpices[i].selectedMatches + matchesWithPrimarySpices[i].baseMatches
    			});
    		}

    		// sort spices by potential
    		spicePotentials.sort(function (a, b) {
    			return b.potential - a.potential;
    		});

    		// find first spice with -100 potential -> so first one to drop
    		let firstOneToDrop = 0;

    		for (let i = 0; i < spicePotentials.length; i++) {
    			if (spicePotentials[i].potential === -100) {
    				firstOneToDrop = i;
    				break;
    			}
    		}

    		// move first "n" suggestions to suggestions array
    		$$invalidate(3, spiceSuggestions = spicePotentials.slice(0, firstOneToDrop));

    		for (let i = 0; i < spiceSuggestions.length; i++) {
    			$$invalidate(3, spiceSuggestions[i] = spicePotentials[i].spice, spiceSuggestions);
    			let potential = spicePotentials[i].potential;
    			let matches = spicePotentials[i].matches;
    			$$invalidate(3, spiceSuggestions[i].description = "" + potential + " Ergänzend | " + matches + " Verstärkend", spiceSuggestions);
    		}
    	}

    	function updateVisualization() {
    		let spices = [...selectedSpices, ...selectedSuggestions];
    		let aromaGroupValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    		spices.forEach(spice => {
    			if (spice.aromaGroup === AromaGroups$1.Süß_wärmende_Phenole) {
    				aromaGroupValues[0] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Wärmende_Terpene) {
    				aromaGroupValues[1] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Duftende_Terpene) {
    				aromaGroupValues[2] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Erdige_Terpene) {
    				aromaGroupValues[3] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Durchdringende_Terpene) {
    				aromaGroupValues[4] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Zitrustönige_Terpene) {
    				aromaGroupValues[5] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Süßsaure_Säuren) {
    				aromaGroupValues[6] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Fruchtige_Aldehyde) {
    				aromaGroupValues[7] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Röstige_Pysazine) {
    				aromaGroupValues[8] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Schwefelverbindungen) {
    				aromaGroupValues[9] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Stechende_Verbindungen) {
    				aromaGroupValues[10] += 1;
    			}

    			if (spice.aromaGroup === AromaGroups$1.Einzigartige_Stoffe) {
    				aromaGroupValues[11] += 1;
    			}
    		});

    		let data = {
    			labels: [
    				AromaGroups$1.Süß_wärmende_Phenole,
    				AromaGroups$1.Wärmende_Terpene,
    				AromaGroups$1.Duftende_Terpene,
    				AromaGroups$1.Erdige_Terpene,
    				AromaGroups$1.Durchdringende_Terpene,
    				AromaGroups$1.Zitrustönige_Terpene,
    				AromaGroups$1.Süßsaure_Säuren,
    				AromaGroups$1.Fruchtige_Aldehyde,
    				AromaGroups$1.Röstige_Pysazine,
    				AromaGroups$1.Schwefelverbindungen,
    				AromaGroups$1.Stechende_Verbindungen,
    				AromaGroups$1.Einzigartige_Stoffe
    			],
    			datasets: [{ values: aromaGroupValues }]
    		};

    		return data;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function spicedropdown_selectedSpice_binding(value) {
    		baseSpice1 = value;
    		$$invalidate(1, baseSpice1);
    	}

    	function spicedropdown_selectedSpice_binding_1(value) {
    		baseSpice2 = value;
    		$$invalidate(2, baseSpice2);
    	}

    	$$self.$capture_state = () => ({
    		Chart: Base$1,
    		AromaGroups: AromaGroups$1,
    		AromaGroupsColors: AromaGroupsColors$1,
    		SpiceContainer,
    		SmallSpiceContainer,
    		SpiceDropdown,
    		AromaGroupLegend,
    		NoSpice,
    		Zimt,
    		Cassia_Zimt,
    		Gewuerznelke,
    		Piment,
    		Anis,
    		Sternanis,
    		Fenchel,
    		Sueßholz,
    		Mahlab,
    		Vanille,
    		Muskatnuss,
    		Muskatbluete,
    		Kuemmel,
    		Dill,
    		Annatto,
    		Mastix,
    		Wacholder,
    		Rose,
    		Koriander,
    		Kreuzkuemmel,
    		Schwarzkuemmel,
    		Mohrenpfeffer,
    		SchwarzerKardamom,
    		GruenerKardamom,
    		Lorbeer,
    		Galgant,
    		Loomi,
    		Zitronenmyrte,
    		Zitronengras,
    		Amchur,
    		Anardana,
    		Sumach,
    		Tamarinde,
    		Johannisbrotschote,
    		Berberitze,
    		Kakao,
    		Paprika,
    		Akazie,
    		Sesam,
    		Knoblauch,
    		Asant,
    		Curryblaetter,
    		Senf,
    		Paradieskoerner,
    		Schwarzerpfeffer,
    		Szechuanpfeffer,
    		Ingwer,
    		Chili,
    		Safran,
    		Mohn,
    		Ajowan,
    		Selleriesamen,
    		Kurkuma,
    		Bockshornklee,
    		allSpices,
    		visualizationData,
    		selectedSpices,
    		baseSpice1,
    		baseSpice2,
    		spiceSuggestions,
    		selectedSuggestions,
    		newSpiceSelection,
    		addSuggestionToSelection,
    		removeFromSelection,
    		isSpiceInSelection,
    		removeFromArray,
    		makeSpiceSuggestion,
    		updateVisualization
    	});

    	$$self.$inject_state = $$props => {
    		if ('allSpices' in $$props) $$invalidate(5, allSpices = $$props.allSpices);
    		if ('visualizationData' in $$props) $$invalidate(0, visualizationData = $$props.visualizationData);
    		if ('selectedSpices' in $$props) selectedSpices = $$props.selectedSpices;
    		if ('baseSpice1' in $$props) $$invalidate(1, baseSpice1 = $$props.baseSpice1);
    		if ('baseSpice2' in $$props) $$invalidate(2, baseSpice2 = $$props.baseSpice2);
    		if ('spiceSuggestions' in $$props) $$invalidate(3, spiceSuggestions = $$props.spiceSuggestions);
    		if ('selectedSuggestions' in $$props) $$invalidate(4, selectedSuggestions = $$props.selectedSuggestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visualizationData,
    		baseSpice1,
    		baseSpice2,
    		spiceSuggestions,
    		selectedSuggestions,
    		allSpices,
    		newSpiceSelection,
    		addSuggestionToSelection,
    		removeFromSelection,
    		spicedropdown_selectedSpice_binding,
    		spicedropdown_selectedSpice_binding_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
