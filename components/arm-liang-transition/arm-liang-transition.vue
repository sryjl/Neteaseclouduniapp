<template>
  <!--如果传入了 destroyOnHide 使用v-if 替代v-show-->
  <view v-if="!destroyOnHide || innerShow" v-show="destroyOnHide ? true : innerShow" :class="comClass">
    <slot />
  </view>
</template>

<script>
export default {
  name: 'MyTransition',
  props: {
    appear: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    customClass: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      required: true
    },
    // 是否使用v-if 替代 v-show
    destroyOnHide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerShow: this.value,
      // 保存 动态状态 enter 、 enter-active, leave 、leave-active
      innerClass: ''
    }
  },
  computed: {
    // 组合之后的class
    // enter-active enter-to => name-enter-active name-enter-to
    comClass() {
      return this.innerClass.split(' ').filter(Boolean).map(state => this.name + '-' + state).join(' ') + ' ' + this.customClass
    }
  },
  created() {
    this.$watch('value', this.handler)
    // appear 出现动画
    if (this.appear) this.handler(this.value)
  },
  methods: {
    async handler(val) {
      if (val) {
        // hide => show
        this.innerShow = true
        await undefined
        this.innerClass = 'enter'
        await this.delay(30)
        this.innerClass = 'enter-active enter-to'
      } else {
        // show => hide
        this.innerClass = 'leave'
        await undefined
        this.innerClass = 'leave-active leave-to'
      }

      // 以最新的状态作为动画结束状态，清除之前的动画结束函数
      if (this.__timerId) clearTimeout(this.__timerId)

      this.__timerId = setTimeout(() => {
        // 等待动画完成修改 innerShow
        this.innerClass = ''
        this.innerShow = val

        this.__timerId = null
      }, this.duration)
    },
    delay(duration) {
      return new Promise(resolve => {
        const id = setTimeout(() => {
          resolve(id)
        }, duration)
      })
    }
  }
}
</script>
