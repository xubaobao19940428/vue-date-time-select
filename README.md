
## vue-date-time-select
### 安装插件
 
```
npm install vue-date-time-select
或：yarn add vue-date-time-select
```
### 引入并注册插件
 
```
import Vue from 'vue'
import VueDateTimeSelect from 'vue-date-time-select'
import 'vue-date-time-select/lib/vueDateTimeSelect.css' // 引入样式
Vue.use(dateTimeSelect)
```
### Props
 
属性 | 说明 | 类型 | 默认值
:--- | :--- | :--- | :---
mode | date-单个日期选择，range-开始日期+结束日期选择,month月份选择,rangweek 周选择 | String | date
toolTip | 顶部的提示文字 | String | 选择日期
rangeBgColor | 范围内日期背景颜色 | String | #2979ff

### Events
 
事件名 | 说明 
:--- | :--- 
change-active-date | 单个日期选择
change-range-date | mode=range单个周选择
change-range-date | mode=rangeweek开始日期-结束日期选择
select-month | 月份选择
