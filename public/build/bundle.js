
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function children(element) {
        return Array.from(element.childNodes);
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

    class NoSpice {
        constructor() {
            this.name = "Kein Gewürz ausgewählt";
            this.description = "Wählen Sie ein Gewürz aus";
            this.spiceComponents = [];
        }
    }

    var SpiceComponents;
    (function (SpiceComponents) {
        SpiceComponents[SpiceComponents["component1"] = 0] = "component1";
        SpiceComponents[SpiceComponents["component2"] = 1] = "component2";
        SpiceComponents[SpiceComponents["component3"] = 2] = "component3";
        SpiceComponents[SpiceComponents["component4"] = 3] = "component4";
    })(SpiceComponents || (SpiceComponents = {}));
    var SpiceComponents$1 = SpiceComponents;

    class Pepper {
        constructor() {
            this.name = "Pfeffer";
            this.description = "Pfeffer ist ein anderes Standardgewürz";
            this.spiceComponents = [
                SpiceComponents$1.component1,
                SpiceComponents$1.component3,
                SpiceComponents$1.component4,
            ];
        }
    }

    class Salt {
        constructor() {
            this.name = "Salz";
            this.description = "Salz ist ein einfaches Gewürz.";
            this.spiceComponents = [
                SpiceComponents$1.component1,
                SpiceComponents$1.component2,
            ];
        }
    }

    class Test1 {
        constructor() {
            this.name = "Test1";
            this.description = "Test1";
            this.spiceComponents = [SpiceComponents$1.component1];
        }
    }

    class Test2 {
        constructor() {
            this.name = "Test2";
            this.description = "Test2";
            this.spiceComponents = [
                SpiceComponents$1.component3,
                SpiceComponents$1.component4,
            ];
        }
    }

    /* src/spices/SpiceDisplay.svelte generated by Svelte v3.44.3 */

    const file$2 = "src/spices/SpiceDisplay.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (12:4) {#each spices as spice}
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
    			add_location(option, file$2, 12, 6, 261);
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
    		source: "(12:4) {#each spices as spice}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*selectedSpice*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*selectedSpice*/ ctx[0].description + "";
    	let t2;
    	let t3;
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
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$2, 8, 2, 101);
    			add_location(p, file$2, 9, 2, 133);
    			if (/*selectedSpice*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[3].call(select));
    			add_location(select, file$2, 10, 2, 170);
    			add_location(div, file$2, 7, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    			append_dev(div, select);

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
    			if (dirty & /*selectedSpice*/ 1 && t0_value !== (t0_value = /*selectedSpice*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*selectedSpice*/ 1 && t2_value !== (t2_value = /*selectedSpice*/ ctx[0].description + "")) set_data_dev(t2, t2_value);

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
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('SpiceDisplay', slots, []);
    	let { selectedSpice } = $$props;
    	let { spices } = $$props;
    	let { onChange } = $$props;
    	const writable_props = ['selectedSpice', 'spices', 'onChange'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpiceDisplay> was created with unknown prop '${key}'`);
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

    class SpiceDisplay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { selectedSpice: 0, spices: 1, onChange: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpiceDisplay",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectedSpice*/ ctx[0] === undefined && !('selectedSpice' in props)) {
    			console.warn("<SpiceDisplay> was created without expected prop 'selectedSpice'");
    		}

    		if (/*spices*/ ctx[1] === undefined && !('spices' in props)) {
    			console.warn("<SpiceDisplay> was created without expected prop 'spices'");
    		}

    		if (/*onChange*/ ctx[2] === undefined && !('onChange' in props)) {
    			console.warn("<SpiceDisplay> was created without expected prop 'onChange'");
    		}
    	}

    	get selectedSpice() {
    		throw new Error("<SpiceDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedSpice(value) {
    		throw new Error("<SpiceDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spices() {
    		throw new Error("<SpiceDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spices(value) {
    		throw new Error("<SpiceDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onChange() {
    		throw new Error("<SpiceDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onChange(value) {
    		throw new Error("<SpiceDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/spices/SpiceSuggestion.svelte generated by Svelte v3.44.3 */

    const file$1 = "src/spices/SpiceSuggestion.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*spice*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*spice*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			button = element("button");
    			add_location(h3, file$1, 6, 2, 77);
    			add_location(p, file$1, 9, 2, 109);
    			add_location(button, file$1, 12, 2, 146);
    			add_location(div, file$1, 5, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*addToSelection*/ ctx[1](/*spice*/ ctx[0]))) /*addToSelection*/ ctx[1](/*spice*/ ctx[0]).apply(this, arguments);
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
    			if (dirty & /*spice*/ 1 && t0_value !== (t0_value = /*spice*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*spice*/ 1 && t2_value !== (t2_value = /*spice*/ ctx[0].description + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	validate_slots('SpiceSuggestion', slots, []);
    	let { spice } = $$props;
    	let { addToSelection } = $$props;
    	const writable_props = ['spice', 'addToSelection'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SpiceSuggestion> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('addToSelection' in $$props) $$invalidate(1, addToSelection = $$props.addToSelection);
    	};

    	$$self.$capture_state = () => ({ spice, addToSelection });

    	$$self.$inject_state = $$props => {
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('addToSelection' in $$props) $$invalidate(1, addToSelection = $$props.addToSelection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [spice, addToSelection];
    }

    class SpiceSuggestion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { spice: 0, addToSelection: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SpiceSuggestion",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*spice*/ ctx[0] === undefined && !('spice' in props)) {
    			console.warn("<SpiceSuggestion> was created without expected prop 'spice'");
    		}

    		if (/*addToSelection*/ ctx[1] === undefined && !('addToSelection' in props)) {
    			console.warn("<SpiceSuggestion> was created without expected prop 'addToSelection'");
    		}
    	}

    	get spice() {
    		throw new Error("<SpiceSuggestion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spice(value) {
    		throw new Error("<SpiceSuggestion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addToSelection() {
    		throw new Error("<SpiceSuggestion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addToSelection(value) {
    		throw new Error("<SpiceSuggestion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/spices/SelectedSpiceSuggestions.svelte generated by Svelte v3.44.3 */

    const file = "src/spices/SelectedSpiceSuggestions.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*spice*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*spice*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			button = element("button");
    			add_location(h1, file, 6, 2, 82);
    			add_location(p, file, 9, 2, 114);
    			add_location(button, file, 12, 2, 151);
    			add_location(div, file, 5, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*removeFromSelection*/ ctx[1](/*spice*/ ctx[0]))) /*removeFromSelection*/ ctx[1](/*spice*/ ctx[0]).apply(this, arguments);
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
    			if (dirty & /*spice*/ 1 && t0_value !== (t0_value = /*spice*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*spice*/ 1 && t2_value !== (t2_value = /*spice*/ ctx[0].description + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
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
    	validate_slots('SelectedSpiceSuggestions', slots, []);
    	let { spice } = $$props;
    	let { removeFromSelection } = $$props;
    	const writable_props = ['spice', 'removeFromSelection'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectedSpiceSuggestions> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('removeFromSelection' in $$props) $$invalidate(1, removeFromSelection = $$props.removeFromSelection);
    	};

    	$$self.$capture_state = () => ({ spice, removeFromSelection });

    	$$self.$inject_state = $$props => {
    		if ('spice' in $$props) $$invalidate(0, spice = $$props.spice);
    		if ('removeFromSelection' in $$props) $$invalidate(1, removeFromSelection = $$props.removeFromSelection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [spice, removeFromSelection];
    }

    class SelectedSpiceSuggestions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { spice: 0, removeFromSelection: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectedSpiceSuggestions",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*spice*/ ctx[0] === undefined && !('spice' in props)) {
    			console.warn("<SelectedSpiceSuggestions> was created without expected prop 'spice'");
    		}

    		if (/*removeFromSelection*/ ctx[1] === undefined && !('removeFromSelection' in props)) {
    			console.warn("<SelectedSpiceSuggestions> was created without expected prop 'removeFromSelection'");
    		}
    	}

    	get spice() {
    		throw new Error("<SelectedSpiceSuggestions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spice(value) {
    		throw new Error("<SelectedSpiceSuggestions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeFromSelection() {
    		throw new Error("<SelectedSpiceSuggestions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeFromSelection(value) {
    		throw new Error("<SelectedSpiceSuggestions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.3 */

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

    // (115:0) {#each selectedSuggestions as selection}
    function create_each_block_1(ctx) {
    	let selectedspicesuggestions;
    	let current;

    	selectedspicesuggestions = new SelectedSpiceSuggestions({
    			props: {
    				spice: /*selection*/ ctx[15],
    				removeFromSelection: /*removeFromSelection*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(selectedspicesuggestions.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectedspicesuggestions, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const selectedspicesuggestions_changes = {};
    			if (dirty & /*selectedSuggestions*/ 8) selectedspicesuggestions_changes.spice = /*selection*/ ctx[15];
    			selectedspicesuggestions.$set(selectedspicesuggestions_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectedspicesuggestions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectedspicesuggestions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectedspicesuggestions, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(115:0) {#each selectedSuggestions as selection}",
    		ctx
    	});

    	return block;
    }

    // (119:0) {#each spiceSuggestions as suggestion}
    function create_each_block(ctx) {
    	let spicesuggestion;
    	let current;

    	spicesuggestion = new SpiceSuggestion({
    			props: {
    				spice: /*suggestion*/ ctx[12],
    				addToSelection: /*addSuggestionToSelection*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spicesuggestion.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spicesuggestion, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const spicesuggestion_changes = {};
    			if (dirty & /*spiceSuggestions*/ 4) spicesuggestion_changes.spice = /*suggestion*/ ctx[12];
    			spicesuggestion.$set(spicesuggestion_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spicesuggestion.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spicesuggestion.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spicesuggestion, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(119:0) {#each spiceSuggestions as suggestion}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let spicedisplay0;
    	let updating_selectedSpice;
    	let t0;
    	let spicedisplay1;
    	let updating_selectedSpice_1;
    	let t1;
    	let t2;
    	let each1_anchor;
    	let current;

    	function spicedisplay0_selectedSpice_binding(value) {
    		/*spicedisplay0_selectedSpice_binding*/ ctx[8](value);
    	}

    	let spicedisplay0_props = {
    		spices: /*allSpices*/ ctx[4],
    		onChange: /*newSpiceSelection*/ ctx[5]
    	};

    	if (/*baseSpice1*/ ctx[0] !== void 0) {
    		spicedisplay0_props.selectedSpice = /*baseSpice1*/ ctx[0];
    	}

    	spicedisplay0 = new SpiceDisplay({
    			props: spicedisplay0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(spicedisplay0, 'selectedSpice', spicedisplay0_selectedSpice_binding));

    	function spicedisplay1_selectedSpice_binding(value) {
    		/*spicedisplay1_selectedSpice_binding*/ ctx[9](value);
    	}

    	let spicedisplay1_props = {
    		spices: /*allSpices*/ ctx[4],
    		onChange: /*newSpiceSelection*/ ctx[5]
    	};

    	if (/*baseSpice2*/ ctx[1] !== void 0) {
    		spicedisplay1_props.selectedSpice = /*baseSpice2*/ ctx[1];
    	}

    	spicedisplay1 = new SpiceDisplay({
    			props: spicedisplay1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(spicedisplay1, 'selectedSpice', spicedisplay1_selectedSpice_binding));
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
    			create_component(spicedisplay0.$$.fragment);
    			t0 = space();
    			create_component(spicedisplay1.$$.fragment);
    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(spicedisplay0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spicedisplay1, target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const spicedisplay0_changes = {};

    			if (!updating_selectedSpice && dirty & /*baseSpice1*/ 1) {
    				updating_selectedSpice = true;
    				spicedisplay0_changes.selectedSpice = /*baseSpice1*/ ctx[0];
    				add_flush_callback(() => updating_selectedSpice = false);
    			}

    			spicedisplay0.$set(spicedisplay0_changes);
    			const spicedisplay1_changes = {};

    			if (!updating_selectedSpice_1 && dirty & /*baseSpice2*/ 2) {
    				updating_selectedSpice_1 = true;
    				spicedisplay1_changes.selectedSpice = /*baseSpice2*/ ctx[1];
    				add_flush_callback(() => updating_selectedSpice_1 = false);
    			}

    			spicedisplay1.$set(spicedisplay1_changes);

    			if (dirty & /*selectedSuggestions, removeFromSelection*/ 136) {
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
    						each_blocks_1[i].m(t2.parentNode, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*spiceSuggestions, addSuggestionToSelection*/ 68) {
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
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
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
    			transition_in(spicedisplay0.$$.fragment, local);
    			transition_in(spicedisplay1.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spicedisplay0.$$.fragment, local);
    			transition_out(spicedisplay1.$$.fragment, local);
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
    			destroy_component(spicedisplay0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(spicedisplay1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
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
    	let allSpices = [new Salt(), new Pepper(), new Test1(), new Test2()];
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
    		$$invalidate(2, spiceSuggestions = []);

    		// Push current selected spice components into array
    		let targetSpiceComponents = [];

    		selectedSpices.forEach(spice => {
    			targetSpiceComponents.push(...spice.spiceComponents);
    		});

    		// calculate for all spices how many components match with the existing ones
    		let matchingSpiceComponents = [];

    		allSpices.forEach(spice => {
    			let matches = 0;

    			spice.spiceComponents.forEach(canidateComponent => {
    				targetSpiceComponents.forEach(targetComponents => {
    					if (canidateComponent === targetComponents) {
    						matches += 1;
    					}
    				});
    			});

    			matchingSpiceComponents.push({ spice, matches });
    		});

    		// sort spices by matches
    		matchingSpiceComponents.sort(function (a, b) {
    			return b.matches - a.matches;
    		});

    		// remove the two selected spices from the sorted spice array
    		matchingSpiceComponents = matchingSpiceComponents.filter(function (value, index, arr) {
    			for (const selection of selectedSpices) {
    				if (value.spice.name === selection.name) {
    					return false;
    				}
    			}

    			for (const selection of selectedSuggestions) {
    				if (value.spice.name === selection.name) {
    					return false;
    				}
    			}

    			return true;
    		});

    		// move first 5 suggestions to suggestions array
    		$$invalidate(2, spiceSuggestions = matchingSpiceComponents.slice(0, 5).map(x => x.spice));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function spicedisplay0_selectedSpice_binding(value) {
    		baseSpice1 = value;
    		$$invalidate(0, baseSpice1);
    	}

    	function spicedisplay1_selectedSpice_binding(value) {
    		baseSpice2 = value;
    		$$invalidate(1, baseSpice2);
    	}

    	$$self.$capture_state = () => ({
    		NoSpice,
    		Pepper,
    		Salt,
    		Test1,
    		Test2,
    		SpiceDisplay,
    		SpiceSuggestion,
    		SelectedSpiceSuggestions,
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
    		spicedisplay0_selectedSpice_binding,
    		spicedisplay1_selectedSpice_binding
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
