<template>
	<div class="u-calendar">
		<div class="u-calendar__action u-flex u-row-center">
			<!--左边图标-->
			<div class="u-calendar__action__icon_left">
				<div class="u-calendar__action__icon">
					<div v-if="changeYear" class="iconfont icon-arrow-double-left" 
						@click="changeYearHandler(0)"></div>
				</div>
				<div class="u-calendar__action__icon">
					<div v-if="changeMonth" class="iconfont icon-arrow-left" 
						@click="changeMonthHandler(0)"></div>
					
				</div>
			</div>
			<div class="u-calendar__action__text">{{ showTitle }}</div>
			<!--右边图标-->
			<div class="u-calendar__action__icon_right">
					<div class="u-calendar__action__icon">
						<div v-if="changeMonth" class="iconfont icon-arrow-right"
							@click="changeMonthHandler(1)"></div>
						<!-- <u-icon v-if="changeMonth" name="arrow-right" :color="monthArrowColor" @click="changeMonthHandler(1)">
						</u-icon> -->
					</div>
					<div class="u-calendar__action__icon">
						<div v-if="changeYear" class="iconfont icon-arrow-double-right"
							@click="changeYearHandler(1)"></div>
						<!-- <u-icon v-if="changeYear" name="arrow-right-double" :color="yearArrowColor"
							@click="changeYearHandler(1)"></u-icon> -->
					</div>
			</div>
			
		</div>
		<div class="u-calendar__week-day" v-if="mode=='date'||mode=='range'">
			<div class="u-calendar__week-day__text" v-for="(item, index) in weekDayZh" :key="index">{{item}}</div>
		</div>
		<!--日期选择单个日期选择-->
		<div class="u-calendar__content" v-if="mode=='date'">
			<!-- 前置空白部分 -->
			<block v-for="(item, index) in weekdayArr" :key="index">
				<div class="u-calendar__content__item"></div>
			</block>
			<div class="u-calendar__content__item" :class="{
							'u-calendar__content__item__disabled':openDisAbled(year,month,index+1),
							'u-calendar__content__item--active-date': mode == 'date'&&activeDate==`${year}-${month}-${index+1}`,
						}"  v-for="(item, index) in daysArr" :key="index"
				@click="dateClick(index)">
				<div class="u-calendar__content__item__inner">
					<div>{{ index + 1 }}</div>
				</div>
			</div>
		</div>
		<!--日期区间选择-->
		<div class="u-calendar__content" v-else-if="mode=='range'">
			<!-- 前置空白部分 -->
			<block v-for="(item, index) in weekdayArr" :key="index">
				<div class="u-calendar__content__item"></div>
			</block>
			<div class="u-calendar__content__item" :class="{
							'u-calendar__content__item__disabled':openDisAbled(year,month,index+1),
							'u-calendar__content--start-date': (mode == 'range' && startDate==`${year}-${month}-${index+1}`),
							'u-calendar__content--end-date':(mode== 'range' && endDate==`${year}-${month}-${index+1}`)
						}" :style="{backgroundColor: getColor(index,1)}" v-for="(item, index) in daysArr" :key="index"
				@click="dateClick(index)">
				<div class="u-calendar__content__item__inner" :style="{color: getColor(index,2)}">
					<div>{{ index + 1 }}</div>
				</div>
				<div class="u-calendar__content__item__tips" :style="{color:activeColor}"
					v-if="mode== 'range' && startDate==`${year}-${month}-${index+1}` && startDate!=endDate">
					{{startText}}</div>
				<div class="u-calendar__content__item__tips" :style="{color:activeColor}"
					v-if="mode== 'range' && endDate==`${year}-${month}-${index+1}`">{{endText}}</div>
			</div>
			<!-- <div class="u-calendar__content__bg-month">{{month}}</div> -->
		</div>
		<!--周选择-->
		<div class="u-calendar__content" v-else-if="mode=='rangeweek'">
			<div class="u-calendar__content_weeks_list">
				<div class="u-calendar__content_weeks_list_item" v-for="(item,index) in weeksSelectAll" :class="{
					'u-calendar__content_weeks_list_active':(activeWeek == item.activeWeekDate),
					'u-calendar__content_weeks_list_disabled':(item.disabled)
				}"
                :key="'_week'+index"
                 @click="getWeekDate(item)">
				<div class="">
					第{{index+1}}周
				</div>
					<span>{{item.startTime+'~'+item.endTime}}</span>
				</div>
			</div>
		</div>
		<!--月份选择-->
		<div class="u-calendar__content" v-else>
			<div class="u-calendar__content_month_list">
				<div class="u-calendar__content_month_list_item" v-for="(item,index) in monthArr" :class="{
					'u-calendar__content_month_list_active':(activeMonth == item.value),
					'u-calendar__content_month_list_disabled':(mounthString<item.value)
				}" 
                :key="'_month'+index"
                @click="getMonthDate(item.value)">
					{{item.label}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
        name:'VueDateTimeSelect',
		props: {
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			},
			
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			// 是否允许切换年份
			changeYear: {
				type: Boolean,
				default: true
			},
			// 是否允许切换月份
			changeMonth: {
				type: Boolean,
				default: true
			},
			// date-单个日期选择，range-开始日期+结束日期选择,month月份选择
			mode: {
				type: String,
				default: 'date'
			},
			// 可切换的最大年份
			maxYear: {
				type: [Number, String],
				default: 2050
			},
			// 可切换的最小年份
			minYear: {
				type: [Number, String],
				default: 1950
			},
			// 最小可选日期(不在范围内日期禁用不可选)
			minDate: {
				type: [Number, String],
				default: '1950-01-01'
			},
			/**
			 * 最大可选日期
			 * 默认最大值为今天，之后的日期不可选
			 * 2030-12-31
			 * */
			maxDate: {
				type: [Number, String],
				default: ''
			},
			// 弹窗顶部左右两边的圆角值
			borderRadius: {
				type: [String, Number],
				default: 20
			},
			// 月份切换按钮箭头颜色
			monthArrowColor: {
				type: String,
				default: '#3A7DEF'
			},
			// 年份切换按钮箭头颜色
			yearArrowColor: {
				type: String,
				default: '#909399'
			},
			// 默认日期字体颜色
			color: {
				type: String,
				default: '#303133'
			},
			// 选中|起始结束日期背景色
			activeBgColor: {
				type: String,
				default: '#2979ff'
			},
			// 选中|起始结束日期字体颜色
			activeColor: {
				type: String,
				default: '#ffffff'
			},
			// 范围内日期背景色
			rangeBgColor: {
				type: String,
				default: '#2979ff'
			},
			// 范围内日期字体颜色
			rangeColor: {
				type: String,
				default: '#fff'
			},
			// mode=range时生效，起始日期自定义文案
			startText: {
				type: String,
				default: ''
			},
			// mode=range时生效，结束日期自定义文案
			endText: {
				type: String,
				default: ''
			},
			//按钮样式类型
			btnType: {
				type: String,
				default: 'primary'
			},
			// 当前选中日期带选中效果
			isActiveCurrent: {
				type: Boolean,
				default: true
			},
			// 切换年月是否触发事件 mode=date时生效
			isChange: {
				type: Boolean,
				default: false
			},
			// 是否显示右上角的关闭图标
			closeable: {
				type: Boolean,
				default: true
			},
			// 顶部的提示文字
			toolTip: {
				type: String,
				default: '选择日期'
			},
		},
		data() {
			return {
				// 星期几,值为1-7
				weekday: 1,
				weekdayArr: [],
				// 当前月有多少天
				days: 0,
				daysArr: [],
				showTitle: '',
				year: 2020,
				month: 0,
				day: 0,
				startYear: 0,
				startMonth: 0,
				startDay: 0,
				endYear: 0,
				endMonth: 0,
				endDay: 0,
				today: '',
				activeDate: '',
				startDate: '',
				endDate: '',
				isStart: true,
				min: null,
				max: null,
				weekDayZh: ['日', '一', '二', '三', '四', '五', '六'],
				activeMonth:'',
				activeWeek:'',
				mounthString:'',
				monthStartDate:'',
				monthEndDate:'',
				currentDate: '',//当前月份的天数
				currentMonthDays: 30,//这个月多少天
				weeksSelectAll:[],
				monthArr:[{
					value:1,
					label:'1月'
				},
				{
					value:2,
					label:'2月'
				},
				{
					value:3,
					label:'3月'
				},
				{
					value:4,
					label:'4月'
				},{
					value:5,
					label:'5月'
				},
				{
					value:6,
					label:'6月'
				},
				{
					value:7,
					label:'7月'
				},
				{
					value:8,
					label:'8月'
				},{
					value:9,
					label:'9月'
				},{
					value:10,
					label:'10月'
				},{
					value:11,
					label:'11月'
				},
				{
					value:12,
					label:'12月'
				}
				]
			}
		},
		components:{
			
		},
		computed: {
			dataChange() {
				return `${this.mode}-${this.minDate}-${this.maxDate}`;
			},
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : 100
			}
		},
		watch: {
			dataChange(val) {
                console.log(val)
				this.init()
			}
		},
		created() {
			this.init()
			
		},
		methods: {
            dateToTimes(newDate) {
                var date = new Date(newDate);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = (date.getDate() + 1 <= 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                var h = (date.getHours() + 1 <= 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() + 1 <= 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
                var s = date.getSeconds() + 1 <= 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D;
            },
			getColor(index, type) {
				let color = type == 1 ? '' : this.color;
				let day = index + 1
				let date = `${this.year}-${this.month}-${day}`
				let timestamp = new Date(date.replace(/\-/g, '/')).getTime();
				let start = this.startDate.replace(/\-/g, '/')
				let end = this.endDate.replace(/\-/g, '/')
				if ((this.isActiveCurrent && this.activeDate == date) || this.startDate == date || this.endDate == date) {
					color = type == 1 ? this.activeBgColor : this.activeColor;
				} else if (this.endDate && timestamp > new Date(start).getTime() && timestamp < new Date(end).getTime()) {
					color = type == 1 ? this.rangeBgColor : this.rangeColor;
				}
				return color;
			},
			
			init() {
				let now = new Date();
				this.year = now.getFullYear();
				this.month = now.getMonth() + 1;
				//开始时间
				// if(this.mode=='month'){
				this.monthStartDate = this.dateToTimes(new Date(now.getFullYear(),now.getMonth(), 1))
				//结束时间
				this.monthEndDate = this.dateToTimes(new Date(now.getFullYear(),now.getMonth()+1, 0));
				// }
				this.day = now.getDate();
				this.today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
				this.activeDate = this.today;
				let nowMonth = ''
				if(now.getMonth()+1<10){
					nowMonth = '0'+ (now.getMonth()+1)
				}else{
					nowMonth = now.getMonth()+1
				}
				this.activeMonth =this.year+nowMonth;
				this.mounthString=this.year+nowMonth;
				this.min = this.initDate(this.minDate);
				this.max = this.initDate(this.maxDate || this.today);
				this.startDate = "";
				this.startYear = 0;
				this.startMonth = 0;
				this.startDay = 0;
				this.endYear = 0;
				this.endMonth = 0;
				this.endDay = 0;
				this.endDate = "";
				this.isStart = true;
				this.changeData();
				this.monthArr = [
					{
						value:this.year+'01',
						label:'1月'
					},
					{
						value:this.year+'02',
						label:'2月'
					},
					{
						value:this.year+'03',
						label:'3月'
					},
					{
						value:this.year+'04',
						label:'4月'
					},{
						value:this.year+'05',
						label:'5月'
					},
					{
						value:this.year+'06',
						label:'6月'
					},
					{
						value:this.year+'07',
						label:'7月'
					},
					{
						value:this.year+'08',
						label:'8月'
					},{
						value:this.year+'09',
						label:'9月'
					},{
						value:this.year+'10',
						label:'10月'
					},{
						value:this.year+'11',
						label:'11月'
					},
					{
						value:this.year+'12',
						label:'12月'
					}
				]
				this.gettime()
				this.weeksSelectAll.map((item,index)=>{
					if(item.monday<=this.today&&item.sunday<=this.today){
						this.activeWeek = item.activeWeekDate
						this.startDate = item.monday
						this.endDate = item.sunday
					}
				})
				this.$emit('select-month',{
					monthStartDate:this.monthStartDate,
					monthEndDate:this.monthEndDate,
				})
				this.$emit('change-active-date',this.activeDate)
				this.$emit('change-range-date',{
					startDate:this.startDate,
					endDate:this.endDate
				})
			},
			
			//日期处理
			initDate(date) {
				let fdate = date.split('-');
				return {
					year: Number(fdate[0] || 1920),
					month: Number(fdate[1] || 1),
					day: Number(fdate[2] || 1)
				}
			},
			openDisAbled: function(year, month, day) {
				let bool = true;
				let date = `${year}/${month}/${day}`;
				// let today = this.today.replace(/\-/g, '/');
				let min = `${this.min.year}/${this.min.month}/${this.min.day}`;
				let max = `${this.max.year}/${this.max.month}/${this.max.day}`;
				let timestamp = new Date(date).getTime();
				if (timestamp >= new Date(min).getTime() && timestamp <= new Date(max).getTime()) {
					bool = false;
				}
				return bool;
			},
			generateArray: function(start, end) {
				return Array.from(new Array(end + 1).keys()).slice(start);
			},
			formatNum: function(num) {
				return num < 10 ? '0' + num : num + '';
			},
			//一个月有多少天
			getMonthDay(year, month) {
				let days = new Date(year, month, 0).getDate();
				return days;
			},
			getWeekday(year, month) {
				let date = new Date(`${year}/${month}/01 00:00:00`);
				return date.getDay();
			},
			checkRange(year) {
				let overstep = false;
				if (year < this.minYear || year > this.maxYear) {
					// uni.showToast({
					// 	title: "日期超出范围啦~",
					// 	icon: 'none'
					// })
					overstep = true;
				}
				return overstep;
			},
			changeMonthHandler(isAdd) {
				if(this.mode!='month'){
					if (isAdd) {
						let month = this.month + 1;
						let year = month > 12 ? this.year + 1 : this.year;
						if (!this.checkRange(year)) {
							this.month = month > 12 ? 1 : month;
							this.year = year;
							this.changeData();
						}
					
					} else {
						let month = this.month - 1;
						let year = month < 1 ? this.year - 1 : this.year;
						if (!this.checkRange(year)) {
							this.month = month < 1 ? 12 : month;
							this.year = year;
							this.changeData();
						}
					}
					this.gettime()
				}else{
					return false
				}
			},
			changeYearHandler(isAdd) {
				let year = isAdd ? this.year + 1 : this.year - 1;
				if (!this.checkRange(year)) {
					this.year = year;
					this.changeData();
					if(this.mode=='month'){
						this.monthArr = [
							{
								value:this.year+'01',
								label:'1月'
							},
							{
								value:this.year+'02',
								label:'2月'
							},
							{
								value:this.year+'03',
								label:'3月'
							},
							{
								value:this.year+'04',
								label:'4月'
							},{
								value:this.year+'05',
								label:'5月'
							},
							{
								value:this.year+'06',
								label:'6月'
							},
							{
								value:this.year+'07',
								label:'7月'
							},
							{
								value:this.year+'08',
								label:'8月'
							},{
								value:this.year+'09',
								label:'9月'
							},{
								value:this.year+'10',
								label:'10月'
							},{
								value:this.year+'11',
								label:'11月'
							},
							{
								value:this.year+'12',
								label:'12月'
							}
						]
				}
				this.gettime()
				
				}
			},
			changeData() {
				this.days = this.getMonthDay(this.year, this.month);
				this.daysArr = this.generateArray(1, this.days)
				this.weekday = this.getWeekday(this.year, this.month);
				this.weekdayArr = this.generateArray(1, this.weekday)
				
				if(this.mode=='month'){
					this.showTitle = `${this.year}年`;
				}else{
					this.showTitle = `${this.year}年${this.month}月`;
				}
				if (this.isChange && this.mode == 'date') {
					this.btnFix(true);
				}
			},
			dateClick: function(day) {
				day += 1;
				if (!this.openDisAbled(this.year, this.month, day)) {
					this.day = day;
					let date = `${this.year}-${this.month}-${day}`;
					if (this.mode == 'date') {
						this.activeDate = date;
						this.$emit('change-active-date',this.activeDate)
					} else {
						let compare = new Date(date.replace(/\-/g, '/')).getTime() < new Date(this.startDate.replace(
							/\-/g, '/')).getTime()
						if (this.isStart || compare) {
							this.startDate = date;
							this.startYear = this.year;
							this.startMonth = this.month;
							this.startDay = this.day;
							this.endYear = 0;
							this.endMonth = 0;
							this.endDay = 0;
							this.endDate = "";
							this.activeDate = "";
							this.isStart = false;
						} else {
							this.endDate = date;
							this.endYear = this.year;
							this.endMonth = this.month;
							this.endDay = this.day;
							this.isStart = true;
						}
						this.$emit('change-range-date',{
							startDate:this.startDate,
							endDate:this.endDate
						})
					}
				}
			},
			close() {
				// 修改通过v-model绑定的父组件变量的值为false，从而隐藏日历弹窗
				this.$emit('input', false);
			},
			getWeekText(date) {
				date = new Date(`${date.replace(/\-/g, '/')} 00:00:00`);
				let week = date.getDay();
				return '星期' + ['日', '一', '二', '三', '四', '五', '六'][week];
			},
			btnFix(show) {
				if (!show) {
					this.close();
				}
				if (this.mode == 'date') {
					let arr = this.activeDate.split('-')
					let year = this.isChange ? this.year : Number(arr[0]);
					let month = this.isChange ? this.month : Number(arr[1]);
					let day = this.isChange ? this.day : Number(arr[2]);
					//当前月有多少天
					let days = this.getMonthDay(year, month);
					let result = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`;
					let weekText = this.getWeekText(result);
					let isToday = false;
					if (`${year}-${month}-${day}` == this.today) {
						//今天
						isToday = true;
					}
					this.$emit('change', {
						year: year,
						month: month,
						day: day,
						days: days,
						result: result,
						week: weekText,
						isToday: isToday,
						// switch: show //是否是切换年月操作
					});
				} else {
					if (!this.startDate || !this.endDate) return;
					let startMonth = this.formatNum(this.startMonth);
					let startDay = this.formatNum(this.startDay);
					let startDate = `${this.startYear}-${startMonth}-${startDay}`;
					let startWeek = this.getWeekText(startDate)

					let endMonth = this.formatNum(this.endMonth);
					let endDay = this.formatNum(this.endDay);
					let endDate = `${this.endYear}-${endMonth}-${endDay}`;
					let endWeek = this.getWeekText(endDate);
					this.$emit('change', {
						startYear: this.startYear,
						startMonth: this.startMonth,
						startDay: this.startDay,
						startDate: startDate,
						startWeek: startWeek,
						endYear: this.endYear,
						endMonth: this.endMonth,
						endDay: this.endDay,
						endDate: endDate,
						endWeek: endWeek
					});
				}
			},
			getMonthDate(value){
				if(value > this.mounthString){
					return false
				}else{
					this.activeMonth = value
					let year = value.substr(0,4)
					let month = Number(value.substr(4))-1
					let monthDays = this.getMonthDay(year, month);
					//开始时间
					this.monthStartDate =this.dateToTimes(new Date(year, month, 1))  
					//结束时间
					this.monthEndDate =this.dateToTimes(new Date(year, month+1, 0));
					this.$emit('select-month',{
						monthStartDate:this.monthStartDate,
						monthEndDate:this.monthEndDate,
					})
				}
			
				 
			},
			getMonthWeek(year, month) { //由于这里我以获取周一为例所以向上取整
				var d = new Date(year, month, 0);
				var t = Math.ceil(d.getDate() / 7)
				return t;
			},
			getMondayTime(year, month, weekday) {
				var d = new Date();
				// 该月第一天
				d.setFullYear(year, month - 1, 1);
				var w1 = d.getDay();
				if (w1 == 0) w1 = 7;
				// 该月天数
				d.setFullYear(year, month, 0);
				var dd = d.getDate();
				this.currentMonthDays = dd
				// 第一个周一
				let d1;
				if (w1 != 1) d1 = 7 - w1 + 2;
				else d1 = 1;
				var monday = d1 + (weekday - 1) * 7;
				return monday;
			},
			gettime() {
				var ds = new Date();
				let currentMonthDay = ds.getDate()
				let month = ds.getMonth() + 1; //当前月
				let weeks = this.getMonthWeek(this.year, this.month); //调用方法传入当前年和当前月获得本月几周
				//获取月第一个周一日期
				let oneDate = this.getMondayTime(this.year, this.month, 1);
				console.log(this.currentMonthDays,currentMonthDay)
				var weeksall = [] //所有周一
				for (var i = 0; i < weeks; i++) {
					weeksall.push(oneDate + i * 7)
				}
				console.log('weeksall',weeksall)
				this.weeksSelectAll=[]
				weeksall.map(item => {
					let obj={}
					console.log(this.activeDate)
					if(item<=9&&item+6<10){
						obj.monday = this.year+'-'+this.month +'-0'+item
						obj.sunday = this.year+'-'+this.month +'-0'+(item+6)
					}else if(item<=9&&item+6>10){
						obj.monday = this.year+'-'+this.month +'-0'+item
						obj.sunday = this.year+'-'+this.month +'-'+(item+6)
					}else if(item>9){
						obj.monday = this.year+'-'+this.month +'-'+item
						obj.sunday = this.year+'-'+this.month +'-'+(item+6)
					}
					
					if(obj.sunday>this.today){
						obj.disabled = true
					}
					if(item+6>this.currentMonthDays && item<=this.currentMonthDays){
						obj.startTime = this.month +'.'+ item
						if(this.month<=11){
							obj.endTime = this.month+1+'.'+(item+6-this.currentMonthDays)
						}else{
							obj.endTime = 1+'.'+(item+6-this.currentMonthDays)
						}
						obj.activeWeekDate = obj.startTime+'-'+obj.endTime
						this.weeksSelectAll.push(obj)
					}else if(item+6<this.currentMonthDays && item<=this.currentMonthDays){
						obj.startTime = this.month +'.'+ item
						obj.endTime = this.month+'.'+(item+6)
						obj.activeWeekDate = obj.startTime+'-'+obj.endTime
						this.weeksSelectAll.push(obj)
					}
				})
				
			},
			//week点击时置为已选择的值
			getWeekDate(date){
				if(!date.disabled){
					this.activeWeek = date.activeWeekDate
					this.startDate = date.monday
					this.endDate = date.sunday
					this.$emit('change-range-date',{
						startDate:this.startDate,
						endDate:this.endDate
					})
				}
			}
		}
	}
</script>

<style lang="scss">
$date-main-color: #303133;
$date-content-color: #606266;
$date-tips-color: #909399;
	@import './styles/iconfont.css';
	.u-calendar {
		color: $date-content-color;
		background-color:#ffffff;
		
		&__header {
			width: 100%;
			box-sizing: border-box;
			font-size: 15px;
			background-color: #fff;
			color: $date-main-color;

			&__text {
				margin-top: 15px;
				padding: 0 30px;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
			}
		}

		&__action {
			display:flex;
			justify-content: space-between;
			align-items: center;
			padding: 19px 21px;
			box-sizing: border-box;
			border-bottom: 1px solid #EEEEEE;
			&__icon {
				margin: 0 8px;
				display: inline-block;
				color:#3A7DEF;
				font-weight: 500;
			}

			&__text {
				padding: 0 8px;
				color: $date-main-color;
				font-size: 16px;
				line-height: 16px;
				font-weight: bold;
			}
		}

		&__week-day {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			padding: 6px 16px;
			box-sizing: border-box;
			overflow: hidden;

			&__text {
				flex: 1;
				text-align: center;
			}
		}

		&__content {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 6px 16px;
			box-sizing: border-box;
			background-color: #fff;
			position: relative;
			//月份选择
			&_month_list{
				width:100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding:0 10px;
				&_item{
					width:30%;
					height:55px;
					text-align: center;
					line-height:55px;
					font-size: 14px;
					font-weight: 400;
					color: #333333;
				}
				&_active{
					background: #3A7DEF;
					color: #FFFFFF;
				}
				&_disabled{
					background: #F6F6F6;
					color: #999999;
				}
				
			}
			//周数选择
			&_weeks_list{
				width:100%;
				display: flex;
				flex-wrap: wrap;
				padding:0 10px;
				&_item{
					width:30%;
					height:100px;
					text-align: center;
					line-height:55px;
					font-size: 14px;
					font-weight: 400;
					color: #333333;
					margin:5px;
				}
				&_active{
					background: #3A7DEF;
					color: #FFFFFF;
				}
				&_disabled{
					background: #F6F6F6;
					color: #999999;
				}
			}
			&--end-date {
				border-top-right-radius: 4px;
				border-bottom-right-radius: 4px;
			}

			&--start-date {
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
				
			}
			
			&__item {
				width: 14.2857%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				padding: 5px 0;
				overflow: hidden;
				position: relative;
				z-index: 2;
				margin-bottom:5px;

				&__inner {
					height: 22px;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					font-size: 16px;
					position: relative;
					border-radius: 50%;

					&__desc {
						width: 100%;
						font-size: 12px;
						line-height: 12px;
						transform: scale(0.75);
						transform-origin: center center;
						position: absolute;
						left: 0;
						text-align: center;
						bottom: 1px;
					}
				}

				&__tips {
					width: 100%;
					font-size: 12px;
					line-height: 12px;
					position: absolute;
					left: 0;
					transform: scale(0.8);
					transform-origin: center center;
					text-align: center;
					bottom: 4px;
					z-index: 2;
				}
				&--active-date{
					background: #3A7DEF;
					color: #FFFFFF;
				}
                &__disabled{
                    background: #F6F6F6;
					color: #999999;
                }
			}

			&__bg-month {
				position: absolute;
				font-size: 130px;
				line-height: 130px;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				color: #e4e7ed;
				z-index: 1;
			}
		}
		
		&__bottom {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background-color: #fff;
			padding: 0 20px 15px;
			box-sizing: border-box;
			font-size: 12px;
			color: $date-tips-color;

			&__choose {
				height: 25px;
			}

			&__btn {
				width: 100%;
			}
		}
	}
</style>
