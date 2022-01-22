
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
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
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
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
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
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

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
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
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
            ctx: null,
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
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
        if (text.wholeText === data)
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

    /* src/SpiceContainer.svelte generated by Svelte v3.44.3 */

    const file$3 = "src/SpiceContainer.svelte";

    function create_fragment$3(ctx) {
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
    	let p;
    	let t6_value = /*spice*/ ctx[0].description + "";
    	let t6;
    	let t7;
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
    			p = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			if (default_slot) default_slot.c();
    			set_style(h1, "font-weight", "400");
    			set_style(h1, "padding-top", "2.7rem");
    			set_style(h1, "color", "#444444");
    			add_location(h1, file$3, 28, 4, 766);
    			attr_dev(div0, "class", "spiceBlob svelte-fcbxbh");
    			set_style(div0, "border-radius", /*shapeCss*/ ctx[1]);
    			set_style(div0, "background", "radial-gradient(ellipse at top left, " + /*spice*/ ctx[0].color + "A0 0%," + /*spice*/ ctx[0].color + "FF 50%)");
    			add_location(div0, file$3, 24, 2, 601);
    			set_style(h3, "color", "#444444");
    			add_location(h3, file$3, 32, 2, 880);
    			add_location(p, file$3, 33, 2, 927);
    			attr_dev(div1, "class", "spiceContainer svelte-fcbxbh");
    			add_location(div1, file$3, 23, 0, 570);
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
    			append_dev(div1, p);
    			append_dev(p, t6);
    			append_dev(div1, t7);

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
    			if ((!current || dirty & /*spice*/ 1) && t6_value !== (t6_value = /*spice*/ ctx[0].description + "")) set_data_dev(t6, t6_value);

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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { shape: 2, spice: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpiceContainer",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*shape*/ ctx[2] === undefined && !('shape' in props)) {
    			console.warn("<SpiceContainer> was created without expected prop 'shape'");
    		}

    		if (/*spice*/ ctx[0] === undefined && !('spice' in props)) {
    			console.warn("<SpiceContainer> was created without expected prop 'spice'");
    		}
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

    /* src/SmallSpiceContainer.svelte generated by Svelte v3.44.3 */

    const file$2 = "src/SmallSpiceContainer.svelte";

    function create_fragment$2(ctx) {
    	let button;
    	let div;
    	let h1;
    	let t0;
    	let t1_value = /*spice*/ ctx[0].nameSymbol + "";
    	let t1;
    	let t2;
    	let t3;
    	let h3;
    	let t4_value = /*spice*/ ctx[0].name + "";
    	let t4;
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
    			h3 = element("h3");
    			t4 = text(t4_value);
    			attr_dev(h1, "class", "nameSymbol svelte-7gwnrx");
    			add_location(h1, file$2, 29, 4, 794);
    			attr_dev(div, "class", "spiceBlob svelte-7gwnrx");
    			set_style(div, "border-radius", /*shapeCss*/ ctx[2]);
    			set_style(div, "background", "radial-gradient(ellipse at top left, " + /*spice*/ ctx[0].color + "A0 0%," + /*spice*/ ctx[0].color + "FF 50%)");
    			add_location(div, file$2, 25, 2, 629);
    			attr_dev(h3, "class", "svelte-7gwnrx");
    			add_location(h3, file$2, 33, 2, 866);
    			attr_dev(button, "class", "svelte-7gwnrx");
    			add_location(button, file$2, 24, 0, 592);
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
    			append_dev(button, h3);
    			append_dev(h3, t4);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[1](/*spice*/ ctx[0]))) /*onClick*/ ctx[1](/*spice*/ ctx[0]).apply(this, arguments);
    					},
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

    			if (dirty & /*spice*/ 1 && t4_value !== (t4_value = /*spice*/ ctx[0].name + "")) set_data_dev(t4, t4_value);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { shape: 3, spice: 0, onClick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SmallSpiceContainer",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*shape*/ ctx[3] === undefined && !('shape' in props)) {
    			console.warn("<SmallSpiceContainer> was created without expected prop 'shape'");
    		}

    		if (/*spice*/ ctx[0] === undefined && !('spice' in props)) {
    			console.warn("<SmallSpiceContainer> was created without expected prop 'spice'");
    		}

    		if (/*onClick*/ ctx[1] === undefined && !('onClick' in props)) {
    			console.warn("<SmallSpiceContainer> was created without expected prop 'onClick'");
    		}
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

    /* src/spices/SpiceDropdown.svelte generated by Svelte v3.44.3 */

    const file$1 = "src/spices/SpiceDropdown.svelte";

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
    			add_location(option, file$1, 9, 4, 180);
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

    function create_fragment$1(ctx) {
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
    			add_location(select, file$1, 7, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selectedSpice*/ ctx[0]);

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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SpiceDropdown', slots, []);
    	let { selectedSpice } = $$props;
    	let { spices } = $$props;
    	let { onChange } = $$props;
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { selectedSpice: 0, spices: 1, onChange: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpiceDropdown",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectedSpice*/ ctx[0] === undefined && !('selectedSpice' in props)) {
    			console.warn("<SpiceDropdown> was created without expected prop 'selectedSpice'");
    		}

    		if (/*spices*/ ctx[1] === undefined && !('spices' in props)) {
    			console.warn("<SpiceDropdown> was created without expected prop 'spices'");
    		}

    		if (/*onChange*/ ctx[2] === undefined && !('onChange' in props)) {
    			console.warn("<SpiceDropdown> was created without expected prop 'onChange'");
    		}
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

    var AromaGroups;
    (function (AromaGroups) {
        AromaGroups["None"] = "";
        AromaGroups["S\u00FC\u00DF_w\u00E4rmende_Phenole"] = "S\u00FC\u00DF_w\u00E4rmende Phenole";
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

    class NoSpice {
        constructor() {
            this.name = "Kein Gewürz ausgewählt";
            this.nameSymbol = "No";
            this.description = "Wählen Sie ein Gewürz aus";
            this.aromaCompounds = [];
            this.aromaGroup = AromaGroups$1.None;
            this.color = AromaGroupsColors$1.None;
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
        }
    }

    /* src/App.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (242:4) <SpiceContainer shape={Math.random()} spice={baseSpice1}>
    function create_default_slot_1(ctx) {
    	let spicedropdown;
    	let updating_selectedSpice;
    	let current;

    	function spicedropdown_selectedSpice_binding(value) {
    		/*spicedropdown_selectedSpice_binding*/ ctx[8](value);
    	}

    	let spicedropdown_props = {
    		spices: /*allSpices*/ ctx[4],
    		onChange: /*newSpiceSelection*/ ctx[5]
    	};

    	if (/*baseSpice1*/ ctx[0] !== void 0) {
    		spicedropdown_props.selectedSpice = /*baseSpice1*/ ctx[0];
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

    			if (!updating_selectedSpice && dirty & /*baseSpice1*/ 1) {
    				updating_selectedSpice = true;
    				spicedropdown_changes.selectedSpice = /*baseSpice1*/ ctx[0];
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
    		source: "(242:4) <SpiceContainer shape={Math.random()} spice={baseSpice1}>",
    		ctx
    	});

    	return block;
    }

    // (249:4) <SpiceContainer shape={Math.random()} spice={baseSpice2}>
    function create_default_slot(ctx) {
    	let spicedropdown;
    	let updating_selectedSpice;
    	let current;

    	function spicedropdown_selectedSpice_binding_1(value) {
    		/*spicedropdown_selectedSpice_binding_1*/ ctx[9](value);
    	}

    	let spicedropdown_props = {
    		spices: /*allSpices*/ ctx[4],
    		onChange: /*newSpiceSelection*/ ctx[5]
    	};

    	if (/*baseSpice2*/ ctx[1] !== void 0) {
    		spicedropdown_props.selectedSpice = /*baseSpice2*/ ctx[1];
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

    			if (!updating_selectedSpice && dirty & /*baseSpice2*/ 2) {
    				updating_selectedSpice = true;
    				spicedropdown_changes.selectedSpice = /*baseSpice2*/ ctx[1];
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
    		source: "(249:4) <SpiceContainer shape={Math.random()} spice={baseSpice2}>",
    		ctx
    	});

    	return block;
    }

    // (260:6) {#each selectedSuggestions as selection}
    function create_each_block_1(ctx) {
    	let smallspicecontainer;
    	let current;

    	smallspicecontainer = new SmallSpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*selection*/ ctx[15],
    				onClick: /*removeFromSelection*/ ctx[7]
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
    			if (dirty & /*selectedSuggestions*/ 8) smallspicecontainer_changes.spice = /*selection*/ ctx[15];
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
    		source: "(260:6) {#each selectedSuggestions as selection}",
    		ctx
    	});

    	return block;
    }

    // (272:6) {#each spiceSuggestions as suggestion}
    function create_each_block(ctx) {
    	let smallspicecontainer;
    	let current;

    	smallspicecontainer = new SmallSpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*suggestion*/ ctx[12],
    				onClick: /*addSuggestionToSelection*/ ctx[6]
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
    			if (dirty & /*spiceSuggestions*/ 4) smallspicecontainer_changes.spice = /*suggestion*/ ctx[12];
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
    		source: "(272:6) {#each spiceSuggestions as suggestion}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div5;
    	let div0;
    	let spicecontainer0;
    	let t0;
    	let spicecontainer1;
    	let t1;
    	let div2;
    	let div1;
    	let t2;
    	let div4;
    	let div3;
    	let current;

    	spicecontainer0 = new SpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*baseSpice1*/ ctx[0],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spicecontainer1 = new SpiceContainer({
    			props: {
    				shape: Math.random(),
    				spice: /*baseSpice2*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*selectedSuggestions*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*spiceSuggestions*/ ctx[2];
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
    			div5 = element("div");
    			div0 = element("div");
    			create_component(spicecontainer0.$$.fragment);
    			t0 = space();
    			create_component(spicecontainer1.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div4 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "horizontalGrid svelte-1e3pxnd");
    			add_location(div0, file, 240, 2, 7254);
    			attr_dev(div1, "class", "flex svelte-1e3pxnd");
    			add_location(div1, file, 258, 4, 7769);
    			attr_dev(div2, "class", "scrollableContainer svelte-1e3pxnd");
    			add_location(div2, file, 257, 2, 7731);
    			attr_dev(div3, "class", "flex svelte-1e3pxnd");
    			add_location(div3, file, 270, 4, 8050);
    			attr_dev(div4, "class", "scrollableContainer svelte-1e3pxnd");
    			add_location(div4, file, 269, 2, 8012);
    			attr_dev(div5, "class", "verticalGrid svelte-1e3pxnd");
    			add_location(div5, file, 239, 0, 7225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			mount_component(spicecontainer0, div0, null);
    			append_dev(div0, t0);
    			mount_component(spicecontainer1, div0, null);
    			append_dev(div5, t1);
    			append_dev(div5, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const spicecontainer0_changes = {};
    			if (dirty & /*baseSpice1*/ 1) spicecontainer0_changes.spice = /*baseSpice1*/ ctx[0];

    			if (dirty & /*$$scope, baseSpice1*/ 262145) {
    				spicecontainer0_changes.$$scope = { dirty, ctx };
    			}

    			spicecontainer0.$set(spicecontainer0_changes);
    			const spicecontainer1_changes = {};
    			if (dirty & /*baseSpice2*/ 2) spicecontainer1_changes.spice = /*baseSpice2*/ ctx[1];

    			if (dirty & /*$$scope, baseSpice2*/ 262146) {
    				spicecontainer1_changes.$$scope = { dirty, ctx };
    			}

    			spicecontainer1.$set(spicecontainer1_changes);

    			if (dirty & /*Math, selectedSuggestions, removeFromSelection*/ 136) {
    				each_value_1 = /*selectedSuggestions*/ ctx[3];
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
    						each_blocks_1[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*Math, spiceSuggestions, addSuggestionToSelection*/ 68) {
    				each_value = /*spiceSuggestions*/ ctx[2];
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
    						each_blocks[i].m(div3, null);
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
    			transition_in(spicecontainer0.$$.fragment, local);
    			transition_in(spicecontainer1.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spicecontainer0.$$.fragment, local);
    			transition_out(spicecontainer1.$$.fragment, local);
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
    			if (detaching) detach_dev(div5);
    			destroy_component(spicecontainer0);
    			destroy_component(spicecontainer1);
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

    	let selectedSpices = [];
    	let baseSpice1 = new NoSpice();
    	let baseSpice2 = new NoSpice();
    	let spiceSuggestions = [];
    	let selectedSuggestions = [];

    	function newSpiceSelection() {
    		$$invalidate(3, selectedSuggestions = []);
    		selectedSpices[0] = baseSpice1;
    		selectedSpices[1] = baseSpice2;
    		makeSpiceSuggestion();
    	}

    	function addSuggestionToSelection(spice) {
    		$$invalidate(3, selectedSuggestions = selectedSuggestions.concat([spice]));
    		makeSpiceSuggestion();
    	}

    	function removeFromSelection(spice) {
    		$$invalidate(3, selectedSuggestions = removeFromArray(selectedSuggestions, spice));
    		makeSpiceSuggestion();
    	}

    	function makeSpiceSuggestion() {
    		// Idea:
    		// Two primary Spices - a suggestion should always share "n" (2?) compounds of each primary spice space
    		// Selections - another suggestion should always maximise the amount of compunds not yet in the total spice space
    		// All compounds of a new selection get added to the total spice space
    		$$invalidate(2, spiceSuggestions = []);

    		// Push current selected spice Compounds into array
    		let currentSelections = [];

    		selectedSuggestions.forEach(spice => {
    			currentSelections.push({
    				spice,
    				compounds: [...spice.aromaCompounds]
    			});
    		});

    		// Calculate macthes with the primary compounds
    		let matchesWithPrimarySpices = [];

    		allSpices.forEach(spice => {
    			let counter = 0;

    			spice.aromaCompounds.forEach(compound => {
    				baseSpice1.aromaCompounds.forEach(baseCompond1 => {
    					if (compound === baseCompond1) {
    						counter++;
    					}
    				});

    				baseSpice2.aromaCompounds.forEach(baseCompond2 => {
    					if (compound === baseCompond2) {
    						counter++;
    					}
    				});
    			});

    			matchesWithPrimarySpices.push(counter);
    		});

    		// Calulate spice potential
    		let minPrimaryMatches = 2;

    		let spicePotentials = [];

    		for (let i = 0; i < allSpices.length; i++) {
    			let spice = allSpices[i];
    			let potential = spice.aromaCompounds.length - matchesWithPrimarySpices[i];

    			if (matchesWithPrimarySpices[i] < minPrimaryMatches) {
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

    			spicePotentials.push({ spice, potential });
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

    		console.log(firstOneToDrop);

    		// move first "n" suggestions to suggestions array
    		console.log(spicePotentials);

    		$$invalidate(2, spiceSuggestions = spicePotentials.slice(0, firstOneToDrop).map(x => x.spice));
    		console.log(spiceSuggestions);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function spicedropdown_selectedSpice_binding(value) {
    		baseSpice1 = value;
    		$$invalidate(0, baseSpice1);
    	}

    	function spicedropdown_selectedSpice_binding_1(value) {
    		baseSpice2 = value;
    		$$invalidate(1, baseSpice2);
    	}

    	$$self.$capture_state = () => ({
    		SpiceContainer,
    		SmallSpiceContainer,
    		SpiceDropdown,
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
    		selectedSpices,
    		baseSpice1,
    		baseSpice2,
    		spiceSuggestions,
    		selectedSuggestions,
    		newSpiceSelection,
    		addSuggestionToSelection,
    		removeFromSelection,
    		removeFromArray,
    		makeSpiceSuggestion
    	});

    	$$self.$inject_state = $$props => {
    		if ('allSpices' in $$props) $$invalidate(4, allSpices = $$props.allSpices);
    		if ('selectedSpices' in $$props) selectedSpices = $$props.selectedSpices;
    		if ('baseSpice1' in $$props) $$invalidate(0, baseSpice1 = $$props.baseSpice1);
    		if ('baseSpice2' in $$props) $$invalidate(1, baseSpice2 = $$props.baseSpice2);
    		if ('spiceSuggestions' in $$props) $$invalidate(2, spiceSuggestions = $$props.spiceSuggestions);
    		if ('selectedSuggestions' in $$props) $$invalidate(3, selectedSuggestions = $$props.selectedSuggestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
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
