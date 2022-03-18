import VueDateTimeSelect from './src/index.vue';

/* istanbul ignore next */
VueDateTimeSelect.install = function(Vue) {
  Vue.component(VueDateTimeSelect.name, VueDateTimeSelect);
};

export default VueDateTimeSelect;