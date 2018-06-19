import MCheckbox from "./MCheckbox.vue";
import MInput from "./MInput.vue";
import MRadio from "./MRadio.vue";
import MSearch from "./MSearch.vue";
import MSelector from "./MSelector.vue";
import MSignature from "./MSignature.vue";
import MSwitch from "./MSwitch.vue";
import MTextarea from "./MTextarea.vue";
import MTimepick from "./MTimepick.vue";
import MUpLoad from "./MUpLoad.vue";
// const requireAll = requireContext =>
//   requireContext.keys().map(item => {
//     let val = {};
//     val.name = item.replace(/^(\.\/)|(\.vue)$/g, "");
//     val.src = item;
//     return val;
//   });
// const req = require.context("../components/", true, /\.vue$/);
// const allComponents = requireAll(req);
// console.log("object:", allComponents);
// allComponents.map(item => {
//   console.log(` import ${item.name} from '${item.src}'`);
// });
export default {
  MCheckbox,
  MInput,
  MRadio,
  MSearch,
  MSelector,
  MSignature,
  MSwitch,
  MTextarea,
  MTimepick,
  MUpLoad
};
