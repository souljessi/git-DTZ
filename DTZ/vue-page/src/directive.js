import Vue from "vue";
import store from "./store";
let genre = type => {
  let typetest = store.getters.getBtnPermission;
  if (typetest[type]) return typetest[type];
  return false;
};
/**
 * vue自定义指令
 * 实现弹出层点击div外部后关闭弹窗
 */
Vue.directive("clickoutside", {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  unbind(el, binding) {
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
});

Vue.directive("genre", {
  bind: (el, binding) => {
    if (!genre(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});
