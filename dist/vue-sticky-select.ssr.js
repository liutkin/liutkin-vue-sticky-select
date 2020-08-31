'use strict';Object.defineProperty(exports,'__esModule',{value:true});var vClickOutside=require('v-click-outside'),vueObserveVisibility=require('vue-observe-visibility');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var vClickOutside__default=/*#__PURE__*/_interopDefaultLegacy(vClickOutside);function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}var script = {
  name: "StickySelect",
  directives: {
    clickOutside: vClickOutside__default['default'].directive,
    observeVisibility: vueObserveVisibility.ObserveVisibility
  },
  model: {
    prop: "selected",
    event: "change"
  },
  props: {
    options: {
      type: Array,
      required: true,
      default: function _default() {
        return [];
      },
      validator: function validator(options) {
        return options.length && options.every(function (option) {
          return typeof option === "string" || _typeof(option) === "object" && option.hasOwnProperty("text") && option.hasOwnProperty("prefix");
        });
      }
    },
    selected: {
      type: Number,
      validator: function validator(value) {
        return value >= 0;
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: Boolean,
    baseClass: {
      type: String,
      default: "sticky-select"
    }
  },
  data: function data() {
    return {
      isListShown: false,
      isScrollTopArrowShown: null,
      isScrollBottomArrowShown: null
    };
  },
  computed: {
    optionsScrollTop: function optionsScrollTop(self) {
      return self.selected * self.activeHeight - 2 * self.activeHeight;
    },
    isValidIndex: function isValidIndex(self) {
      return self.selected >= 0 && typeof self.selected === "number";
    },
    optionsHeight: function optionsHeight(self) {
      return self.activeHeight * (self.options.length < 5 ? self.options.length : 5);
    },
    activeHeight: function activeHeight(self) {
      var _self$$refs$active;

      return (_self$$refs$active = self.$refs.active) === null || _self$$refs$active === void 0 ? void 0 : _self$$refs$active.getBoundingClientRect().height;
    },
    optionsOffsetTop: function optionsOffsetTop(self) {
      var _offset;

      var offset = (_offset = {
        0: 0,
        1: self.activeHeight
      }, _defineProperty(_offset, self.options.length - 2, self.optionsHeight - self.activeHeight * 2), _defineProperty(_offset, self.options.length - 1, self.optionsHeight - self.activeHeight), _offset);
      return offset[self.selected] === undefined ? self.optionsHeight - self.optionsHeight / 2 - self.activeHeight / 2 : offset[self.selected];
    },
    selectedOption: function selectedOption(self) {
      return self.isValidIndex ? self.options[self.selected] : {};
    }
  },
  watch: {
    isListShown: function isListShown(shown) {
      var _this = this;

      this.$nextTick(function () {
        return _this.$refs.options && (_this.$refs.options.scrollTop = _this.optionsScrollTop);
      });
      this.$emit(shown ? "open" : "close");
    }
  },
  methods: {
    open: function open() {
      !this.disabled && (this.isListShown = true);
    },
    close: function close() {
      this.isListShown = false;
    },
    selectOption: function selectOption(index) {
      this.close();
      this.$emit("change", index);
    },
    getOptionText: function getOptionText(option) {
      return _typeof(option) === "object" ? option.text : option;
    },
    visibilityChanged: function visibilityChanged(isVisible, _, index) {
      index === 0 ? this.isScrollTopArrowShown = !isVisible : index === this.options.length - 1 ? this.isScrollBottomArrowShown = !isVisible : null;
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: [_vm.baseClass, _vm.disabled ? _vm.baseClass + "--disabled" : '']
  }, [_vm._ssrNode("<div tabindex=\"0\"" + _vm._ssrAttr("title", _typeof(_vm.selectedOption) === 'object' ? _vm.selectedOption.text || _vm.placeholder : _vm.selectedOption) + _vm._ssrClass(null, _vm.baseClass + "__option " + _vm.baseClass + "__option--selected") + " data-v-116d52fd>", "</div>", [_vm.isValidIndex ? [_typeof(_vm.selectedOption) === 'object' && _vm.selectedOption.prefix ? _vm._ssrNode("<div" + _vm._ssrClass(null, _vm.baseClass + "__option-prefix") + " data-v-116d52fd>", "</div>", [_c(_vm.selectedOption.prefix, {
    tag: "component",
    class: _vm.baseClass + "__option-prefix-content"
  })], 1) : _vm._e(), _vm._ssrNode(" <div" + _vm._ssrClass(null, _vm.baseClass + "__option-text") + " data-v-116d52fd>" + _vm._ssrEscape("\n        " + _vm._s(_vm.getOptionText(_vm.selectedOption)) + "\n      ") + "</div>")] : _vm._ssrNode("<div" + _vm._ssrClass(null, _vm.baseClass + "__option-text") + " data-v-116d52fd>" + _vm._ssrEscape("\n      " + _vm._s(_vm.placeholder) + "\n    ") + "</div>")], 2), _vm._ssrNode(" "), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [_vm.isListShown ? _c('div', {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: _vm.close,
      expression: "close"
    }],
    class: _vm.baseClass + "__options-wrapper",
    style: {
      top: "-" + _vm.optionsOffsetTop + "px"
    }
  }, [_c('transition', {
    attrs: {
      "name": "fade-in-up"
    }
  }, [_vm.isScrollTopArrowShown ? _c('div', {
    class: _vm.baseClass + "__arrow " + _vm.baseClass + "__arrow--up"
  }) : _vm._e()]), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade-in-down"
    }
  }, [_vm.isScrollBottomArrowShown ? _c('div', {
    class: _vm.baseClass + "__arrow " + _vm.baseClass + "__arrow--down"
  }) : _vm._e()]), _vm._v(" "), _c('div', {
    class: _vm.baseClass + "__options-body"
  }, [_c('ul', {
    ref: "options",
    class: _vm.baseClass + "__options",
    style: {
      height: _vm.optionsHeight + "px"
    }
  }, _vm._l(_vm.options, function (option, index) {
    return _c('li', {
      directives: [{
        name: "observe-visibility",
        rawName: "v-observe-visibility",
        value: {
          callback: function callback(isVisible, entry) {
            return _vm.visibilityChanged(isVisible, entry, index);
          },
          throttle: 100,
          intersection: {
            threshold: 1
          }
        },
        expression: "{\n              callback: (isVisible, entry) =>\n                visibilityChanged(isVisible, entry, index),\n              throttle: 100,\n              intersection: {\n                threshold: 1,\n              },\n            }"
      }],
      key: index,
      class: [_vm.baseClass + "__option", option === _vm.selectedOption ? _vm.baseClass + "__option--active" : ''],
      attrs: {
        "tabindex": "0",
        "title": _typeof(option) === 'object' && option.text || option
      },
      on: {
        "keyup": function keyup($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
            return null;
          }

          return _vm.selectOption(index);
        },
        "click": function click($event) {
          return _vm.selectOption(index);
        }
      }
    }, [_typeof(option) === 'object' && option.prefix ? _c('div', {
      class: _vm.baseClass + "__option-prefix"
    }, [_c(option.prefix, {
      tag: "component",
      class: _vm.baseClass + "__option-prefix-content"
    })], 1) : _vm._e(), _vm._v(" "), _c('div', {
      class: _vm.baseClass + "__option-text"
    }, [_vm._v("\n              " + _vm._s(_vm.getOptionText(option)) + "\n            ")])]);
  }), 0)])], 1) : _vm._e()])], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-116d52fd_0", {
    source: ".fade-enter-active[data-v-116d52fd],.fade-leave-active[data-v-116d52fd]{transition:opacity .25s}.fade-in-down-enter-active[data-v-116d52fd],.fade-in-down-leave-active[data-v-116d52fd],.fade-in-up-enter-active[data-v-116d52fd],.fade-in-up-leave-active[data-v-116d52fd]{transition:transform .15s}.fade-enter[data-v-116d52fd],.fade-leave-to[data-v-116d52fd]{opacity:0}.fade-in-up-enter[data-v-116d52fd],.fade-in-up-leave-to[data-v-116d52fd]{transform:translateY(1rem)}.fade-in-down-enter[data-v-116d52fd],.fade-in-down-leave-to[data-v-116d52fd]{transform:translateY(-1rem)}.sticky-select[data-v-116d52fd]{position:relative;user-select:none}.sticky-select:not(.sticky-select--disabled) .sticky-select__option[data-v-116d52fd]{cursor:pointer}.sticky-select.sticky-select--disabled[data-v-116d52fd]{cursor:not-allowed;filter:invert(.05)}.sticky-select.sticky-select--disabled .sticky-select__option[data-v-116d52fd]{color:rgba(0,0,0,.35)}.sticky-select.sticky-select--disabled .sticky-select__option.sticky-select__option--selected[data-v-116d52fd]:after{opacity:.35}.sticky-select__arrow[data-v-116d52fd]{position:absolute;left:0;right:0}.sticky-select__arrow.sticky-select__arrow--up[data-v-116d52fd]{bottom:calc(100% + .75rem)}.sticky-select__arrow.sticky-select__arrow--down[data-v-116d52fd]{top:calc(100% + .75rem)}.sticky-select__options-wrapper[data-v-116d52fd]{position:absolute;left:0;right:0;z-index:9999}.sticky-select__options-body[data-v-116d52fd]{border-radius:.5rem;overflow:hidden;box-shadow:0 .5rem 1rem rgba(0,0,0,.1)}.sticky-select__options[data-v-116d52fd]{position:relative;margin-top:0;margin-bottom:0;padding-left:0;list-style:none;overflow:auto;background-color:#fff}.sticky-select__option[data-v-116d52fd]{display:flex;height:2.5rem;align-items:center;outline:0;padding-left:1rem;padding-right:1rem;transition:background-color .25s}.sticky-select__option-prefix[data-v-116d52fd]{width:1.75rem;height:70%;display:flex;justify-content:center;flex-shrink:0;margin-right:.25rem}.sticky-select__option-prefix-content[data-v-116d52fd]{height:100%;width:100%;object-fit:contain}.sticky-select__option-text[data-v-116d52fd]{flex-grow:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sticky-select__option.sticky-select__option--active[data-v-116d52fd]{background-color:#eaeaea}.sticky-select__option.sticky-select__option--selected[data-v-116d52fd]{position:relative;background-color:#f5f5f5;border-radius:.5rem}.sticky-select__option.sticky-select__option--selected[data-v-116d52fd]:after{content:\"\";top:0;bottom:0;right:.75rem}.sticky-select:not(.sticky-select--disabled) .sticky-select__option[data-v-116d52fd]:focus:not(.sticky-select__option--active),.sticky-select:not(.sticky-select--disabled) .sticky-select__option[data-v-116d52fd]:hover:not(.sticky-select__option--active){background-color:#eaeaea}.sticky-select__arrow[data-v-116d52fd],.sticky-select__option.sticky-select__option--selected[data-v-116d52fd]:after{width:.6rem;height:.3rem;position:absolute;margin:auto;background-repeat:no-repeat;background-size:100% auto}.sticky-select__arrow--up[data-v-116d52fd]{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzBweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMzAgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+ZG93bjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJkb3duIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNS4wMDAwMDAsIDguNTAwMDAwKSByb3RhdGUoLTE4MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTUuMDAwMDAwLCAtOC41MDAwMDApICIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTE2LjMwMjM5NTIsMTYuMzAyMzk1MiBMMjkuNDYxMDc3OCwzLjE4ODYyMjc1IEMzMC4xNzk2NDA3LDIuNDI1MTQ5NyAzMC4xNzk2NDA3LDEuMjU3NDg1MDMgMjkuNDYxMDc3OCwwLjUzODkyMjE1NiBDMjguNzQyNTE1LC0wLjE3OTY0MDcxOSAyNy41Mjk5NDAxLC0wLjE3OTY0MDcxOSAyNi44MTEzNzcyLDAuNTM4OTIyMTU2IEwxNSwxMi4zNTAyOTk0IEwzLjE4ODYyMjc1LDAuNTM4OTIyMTU2IEMyLjQyNTE0OTcsLTAuMTc5NjQwNzE5IDEuMjU3NDg1MDMsLTAuMTc5NjQwNzE5IDAuNTM4OTIyMTU2LDAuNTM4OTIyMTU2IEMtMC4xNzk2NDA3MTksMS4yNTc0ODUwMyAtMC4xNzk2NDA3MTksMi40MjUxNDk3IDAuNTM4OTIyMTU2LDMuMTg4NjIyNzUgTDEzLjY1MjY5NDYsMTYuMzAyMzk1MiBDMTQuNDE2MTY3NywxNy4wMjA5NTgxIDE1LjU4MzgzMjMsMTcuMDIwOTU4MSAxNi4zMDIzOTUyLDE2LjMwMjM5NTIgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==)}.sticky-select__arrow--down[data-v-116d52fd],.sticky-select__option.sticky-select__option--selected[data-v-116d52fd]:after{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzBweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMzAgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+UGF0aDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGQ9Ik0xNi4zMDIzOTUyLDE2LjMwMjM5NTIgTDI5LjQ2MTA3NzgsMy4xODg2MjI3NSBDMzAuMTc5NjQwNywyLjQyNTE0OTcgMzAuMTc5NjQwNywxLjI1NzQ4NTAzIDI5LjQ2MTA3NzgsMC41Mzg5MjIxNTYgQzI4Ljc0MjUxNSwtMC4xNzk2NDA3MTkgMjcuNTI5OTQwMSwtMC4xNzk2NDA3MTkgMjYuODExMzc3MiwwLjUzODkyMjE1NiBMMTUsMTIuMzUwMjk5NCBMMy4xODg2MjI3NSwwLjUzODkyMjE1NiBDMi40MjUxNDk3LC0wLjE3OTY0MDcxOSAxLjI1NzQ4NTAzLC0wLjE3OTY0MDcxOSAwLjUzODkyMjE1NiwwLjUzODkyMjE1NiBDLTAuMTc5NjQwNzE5LDEuMjU3NDg1MDMgLTAuMTc5NjQwNzE5LDIuNDI1MTQ5NyAwLjUzODkyMjE1NiwzLjE4ODYyMjc1IEwxMy42NTI2OTQ2LDE2LjMwMjM5NTIgQzE0LjQxNjE2NzcsMTcuMDIwOTU4MSAxNS41ODM4MzIzLDE3LjAyMDk1ODEgMTYuMzAyMzk1MiwxNi4zMDIzOTUyIFoiIGlkPSJQYXRoIiBmaWxsPSIjMDAwMDAwIj48L3BhdGg+CiAgICA8L2c+Cjwvc3ZnPg==)}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-116d52fd";
/* module identifier */

var __vue_module_identifier__ = "data-v-116d52fd";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function installStickySelect(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("StickySelect", __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== "undefined") {
    GlobalVue = window.Vue;
  } else if (typeof global !== "undefined") {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;