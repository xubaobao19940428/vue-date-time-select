<template>
  <div id="app">
      <VueDateTimeSelect  :mode="'date'" @change-active-date="changeActiveDate"></VueDateTimeSelect>
      <VueDateTimeSelect  :mode="'rangeweek'" @change-range-date="changeRangeDate"></VueDateTimeSelect>
      <VueDateTimeSelect  :mode="'range'" @change-range-date="changeRangeDate"></VueDateTimeSelect>
	  <VueDateTimeSelect  :mode="'month'" @select-month="selectMonth"></VueDateTimeSelect>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {

  },
  methods:{
      changeActiveDate(data){
          console.log(data)
      },
      changeRangeDate(data){
          console.log(data)
      },
      selectMonth(month){
          console.log(month)
      }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height:100%;
  width:100%;
}
</style>
