import Vue from "vue";
import BaseIcon from "@/components/common/BaseSvgIcon"; // svg组件
import createIconMap from "view/iconDemo/createIconMap.js"; // just for @/views/icons , you can delete it

// register globally
Vue.component("base-icon", BaseIcon);

const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context("./svg", true, /\.svg$/);
const iconMap = requireAll(req);
createIconMap.generate(iconMap);
