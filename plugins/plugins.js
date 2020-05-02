import Vue from 'vue'
import moment from 'moment/moment'

Vue.prototype.$moment = date => moment(date)

import VueMq from 'vue-mq'

Vue.use(VueMq, {
  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: Infinity
  },
  defaultBreakpoint: 'lg'
})
