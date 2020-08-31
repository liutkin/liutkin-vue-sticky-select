<template>
  <div :class="[baseClass, disabled ? `${baseClass}--disabled` : '']">
    <div
      ref="active"
      :class="`${baseClass}__option ${baseClass}__option--selected`"
      tabindex="0"
      :title="
        typeof selectedOption === 'object'
          ? selectedOption.text || placeholder
          : selectedOption
      "
      @click="open"
      @keyup.enter="open"
    >
      <template v-if="isValidIndex"
        ><div
          v-if="typeof selectedOption === 'object' && selectedOption.prefix"
          :class="`${baseClass}__option-prefix`"
        >
          <component
            :is="selectedOption.prefix"
            :class="`${baseClass}__option-prefix-content`"
          />
        </div>
        <div :class="`${baseClass}__option-text`">
          {{ getOptionText(selectedOption) }}
        </div></template
      >
      <div v-else :class="`${baseClass}__option-text`">
        {{ placeholder }}
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="isListShown"
        v-click-outside="close"
        :class="`${baseClass}__options-wrapper`"
        :style="{ top: `-${optionsOffsetTop}px` }"
      >
        <transition name="fade-in-up"
          ><div
            v-if="isScrollTopArrowShown"
            :class="`${baseClass}__arrow ${baseClass}__arrow--up`"
        /></transition>
        <transition name="fade-in-down"
          ><div
            v-if="isScrollBottomArrowShown"
            :class="`${baseClass}__arrow ${baseClass}__arrow--down`"
        /></transition>
        <div :class="`${baseClass}__options-body`">
          <ul
            ref="options"
            :class="`${baseClass}__options`"
            :style="{ height: `${optionsHeight}px` }"
          >
            <li
              v-for="(option, index) in options"
              :key="index"
              :class="[
                `${baseClass}__option`,
                option === selectedOption ? `${baseClass}__option--active` : '',
              ]"
              tabindex="0"
              :title="(typeof option === 'object' && option.text) || option"
              v-observe-visibility="{
                callback: (isVisible, entry) =>
                  visibilityChanged(isVisible, entry, index),
                throttle: 100,
                intersection: {
                  threshold: 1,
                },
              }"
              @keyup.enter="selectOption(index)"
              @click="selectOption(index)"
            >
              <div
                v-if="typeof option === 'object' && option.prefix"
                :class="`${baseClass}__option-prefix`"
              >
                <component
                  :is="option.prefix"
                  :class="`${baseClass}__option-prefix-content`"
                />
              </div>
              <div :class="`${baseClass}__option-text`">
                {{ getOptionText(option) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<script>
import vClickOutside from "v-click-outside";
import { ObserveVisibility } from "vue-observe-visibility";

export default {
  name: "StickySelect",
  directives: {
    clickOutside: vClickOutside.directive,
    observeVisibility: ObserveVisibility,
  },
  model: {
    prop: "selected",
    event: "change",
  },
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
      validator: options =>
        options.length &&
        options.every(
          option =>
            typeof option === "string" ||
            (typeof option === "object" &&
              option.hasOwnProperty("text") &&
              option.hasOwnProperty("prefix"))
        ),
    },
    selected: {
      type: Number,
      validator: value => value >= 0,
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: Boolean,
    baseClass: {
      type: String,
      default: "sticky-select",
    },
  },
  data: () => ({
    isListShown: false,
    isScrollTopArrowShown: null,
    isScrollBottomArrowShown: null,
  }),
  computed: {
    optionsScrollTop: self =>
      self.selected * self.activeHeight - 2 * self.activeHeight,
    isValidIndex: self =>
      self.selected >= 0 && typeof self.selected === "number",
    optionsHeight: self =>
      self.activeHeight * (self.options.length < 5 ? self.options.length : 5),
    activeHeight: self => self.$refs.active?.getBoundingClientRect().height,
    optionsOffsetTop: self => {
      const offset = {
        0: 0,
        1: self.activeHeight,
        [self.options.length - 2]: self.optionsHeight - self.activeHeight * 2,
        [self.options.length - 1]: self.optionsHeight - self.activeHeight,
      };

      return offset[self.selected] === undefined
        ? self.optionsHeight - self.optionsHeight / 2 - self.activeHeight / 2
        : offset[self.selected];
    },
    selectedOption: self =>
      self.isValidIndex ? self.options[self.selected] : {},
  },
  watch: {
    isListShown(shown) {
      this.$nextTick(
        () =>
          this.$refs.options &&
          (this.$refs.options.scrollTop = this.optionsScrollTop)
      );
      this.$emit(shown ? "open" : "close");
    },
  },
  methods: {
    open() {
      !this.disabled && (this.isListShown = true);
    },
    close() {
      this.isListShown = false;
    },
    selectOption(index) {
      this.close();
      this.$emit("change", index);
    },
    getOptionText(option) {
      return typeof option === "object" ? option.text : option;
    },
    visibilityChanged(isVisible, _, index) {
      index === 0
        ? (this.isScrollTopArrowShown = !isVisible)
        : index === this.options.length - 1
        ? (this.isScrollBottomArrowShown = !isVisible)
        : null;
    },
  },
};
</script>

<!-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 🛸-->

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-in-up-enter-active,
.fade-in-up-leave-active,
.fade-in-down-enter-active,
.fade-in-down-leave-active {
  transition: transform 0.15s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-in-up-enter,
.fade-in-up-leave-to {
  transform: translateY(1rem);
}

.fade-in-down-enter,
.fade-in-down-leave-to {
  transform: translateY(-1rem);
}

.sticky-select {
  position: relative;
  user-select: none;
}

.sticky-select:not(.sticky-select--disabled) .sticky-select__option {
  cursor: pointer;
}

.sticky-select.sticky-select--disabled {
  cursor: not-allowed;
  filter: invert(0.05);
}

.sticky-select.sticky-select--disabled .sticky-select__option {
  color: rgba(0, 0, 0, 0.35);
}

.sticky-select.sticky-select--disabled
  .sticky-select__option.sticky-select__option--selected:after {
  opacity: 0.35;
}

.sticky-select__arrow {
  position: absolute;
  left: 0;
  right: 0;
}

.sticky-select__arrow.sticky-select__arrow--up {
  bottom: calc(100% + 0.75rem);
}

.sticky-select__arrow.sticky-select__arrow--down {
  top: calc(100% + 0.75rem);
}

.sticky-select__options-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 9999;
}

.sticky-select__options-body {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.sticky-select__options {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
  overflow: auto;
  background-color: white;
}

.sticky-select__option {
  display: flex;
  height: 2.5rem;
  align-items: center;
  outline: none;
  padding-left: 1rem;
  padding-right: 1rem;
  transition: background-color 0.25s;
}

.sticky-select__option-prefix {
  width: 1.75rem;
  height: 70%;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 0.25rem;
}

.sticky-select__option-prefix-content {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.sticky-select__option-text {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sticky-select__option.sticky-select__option--active {
  background-color: #eaeaea;
}

.sticky-select__option.sticky-select__option--selected {
  position: relative;
  background-color: whitesmoke;
  border-radius: 0.5rem;
}

.sticky-select__option.sticky-select__option--selected:after {
  content: "";
  top: 0;
  bottom: 0;
  right: 0.75rem;
}

.sticky-select:not(.sticky-select--disabled)
  .sticky-select__option:hover:not(.sticky-select__option--active),
.sticky-select:not(.sticky-select--disabled)
  .sticky-select__option:focus:not(.sticky-select__option--active) {
  background-color: #eaeaea;
}

.sticky-select__arrow,
.sticky-select__option.sticky-select__option--selected:after {
  width: 0.6rem;
  height: 0.3rem;
  position: absolute;
  margin: auto;
  background-repeat: no-repeat;
  background-size: 100% auto;
}

.sticky-select__arrow--up {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzBweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMzAgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+ZG93bjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJkb3duIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNS4wMDAwMDAsIDguNTAwMDAwKSByb3RhdGUoLTE4MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTUuMDAwMDAwLCAtOC41MDAwMDApICIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPHBhdGggZD0iTTE2LjMwMjM5NTIsMTYuMzAyMzk1MiBMMjkuNDYxMDc3OCwzLjE4ODYyMjc1IEMzMC4xNzk2NDA3LDIuNDI1MTQ5NyAzMC4xNzk2NDA3LDEuMjU3NDg1MDMgMjkuNDYxMDc3OCwwLjUzODkyMjE1NiBDMjguNzQyNTE1LC0wLjE3OTY0MDcxOSAyNy41Mjk5NDAxLC0wLjE3OTY0MDcxOSAyNi44MTEzNzcyLDAuNTM4OTIyMTU2IEwxNSwxMi4zNTAyOTk0IEwzLjE4ODYyMjc1LDAuNTM4OTIyMTU2IEMyLjQyNTE0OTcsLTAuMTc5NjQwNzE5IDEuMjU3NDg1MDMsLTAuMTc5NjQwNzE5IDAuNTM4OTIyMTU2LDAuNTM4OTIyMTU2IEMtMC4xNzk2NDA3MTksMS4yNTc0ODUwMyAtMC4xNzk2NDA3MTksMi40MjUxNDk3IDAuNTM4OTIyMTU2LDMuMTg4NjIyNzUgTDEzLjY1MjY5NDYsMTYuMzAyMzk1MiBDMTQuNDE2MTY3NywxNy4wMjA5NTgxIDE1LjU4MzgzMjMsMTcuMDIwOTU4MSAxNi4zMDIzOTUyLDE2LjMwMjM5NTIgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==");
}

.sticky-select__arrow--down,
.sticky-select__option.sticky-select__option--selected:after {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzBweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMzAgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDY0ICg5MzUzNykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+UGF0aDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGQ9Ik0xNi4zMDIzOTUyLDE2LjMwMjM5NTIgTDI5LjQ2MTA3NzgsMy4xODg2MjI3NSBDMzAuMTc5NjQwNywyLjQyNTE0OTcgMzAuMTc5NjQwNywxLjI1NzQ4NTAzIDI5LjQ2MTA3NzgsMC41Mzg5MjIxNTYgQzI4Ljc0MjUxNSwtMC4xNzk2NDA3MTkgMjcuNTI5OTQwMSwtMC4xNzk2NDA3MTkgMjYuODExMzc3MiwwLjUzODkyMjE1NiBMMTUsMTIuMzUwMjk5NCBMMy4xODg2MjI3NSwwLjUzODkyMjE1NiBDMi40MjUxNDk3LC0wLjE3OTY0MDcxOSAxLjI1NzQ4NTAzLC0wLjE3OTY0MDcxOSAwLjUzODkyMjE1NiwwLjUzODkyMjE1NiBDLTAuMTc5NjQwNzE5LDEuMjU3NDg1MDMgLTAuMTc5NjQwNzE5LDIuNDI1MTQ5NyAwLjUzODkyMjE1NiwzLjE4ODYyMjc1IEwxMy42NTI2OTQ2LDE2LjMwMjM5NTIgQzE0LjQxNjE2NzcsMTcuMDIwOTU4MSAxNS41ODM4MzIzLDE3LjAyMDk1ODEgMTYuMzAyMzk1MiwxNi4zMDIzOTUyIFoiIGlkPSJQYXRoIiBmaWxsPSIjMDAwMDAwIj48L3BhdGg+CiAgICA8L2c+Cjwvc3ZnPg==");
}
</style>
