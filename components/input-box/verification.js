// 输入框校验
const verification = {
	// 校验的正则和提示语
	verificationReg: {
		'isNull': {
			tip: '此项不能为空',
			reg: /(^\s*)|(\s*$)/g
		},
		// 校验验证码
		'code': {
			tip: '请输入正确的验证码',
			reg: /^\d{6}$/
		},
		'isPhoneNum': {
			tip: '请输入正确的手机号码',
			reg: /^(1[0-9])\d{9}$/
		},
		// 校验密码(由6-16数字和字母组成)
		'isPassWord': {
			tip: '请输入(6-16位)数字和字母组成',
			reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
		},
		// 校验正整数
		'isInt': {
			tip: '请输入正确的数字',
			reg: /^([1-9][0-9]*){1,3}$/
		},
		// 校验金额
		'isMoney': {
			tip: '请输入正确的金额',
			// reg: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
			reg: /^\d{1,8}(\.\d{1,2})?$/
		},
		// 校验数字和字母
		'isEnlishAndNumber': {
			tip: '请输入数字和字母',
			reg: /^[A-Za-z0-9]*$/
		},
		// 校验中文数字和字母
		'isChineseEnlishAndNumber': {
			tip: '只能输入中文、数字和字母',
			reg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/
		},
		// 校验中文和字母
		'isChineseAndEnlish': {
			tip: '只能输入中文和字母',
			reg: /^[A-Za-z\u4e00-\u9fa5]+$/
		},
		// 汉字,数字,字母,下划线
		'isEnCnUnderline': {
			tip: '只能输入中文、字母、数字和下划线',
			reg: /^[A-Za-z0-9\u4e00-\u9fa5a-zA-Z_]{4,8}$/
		},
		'isEmail':{
			tip: '请输入正确的邮箱地址',
			reg:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
		}
    },
	/**
	 * @name:输入框校验方法
	 * @param {name} 校验的正则和提示语名称
	 * @param {value} 输入框的值
	 */
	verificationFuc: (param) => {
		// 获取提示语
		const tip = verification.verificationReg[param.name].tip
		// 获取正则
		const reg = verification.verificationReg[param.name].reg
		// 获取输入框的值
		const value = param.value || ''

		const res = {
			flag: false,
			tip
		}
		const val = value ? reg.test(value) : false
		if (param.name === 'isNull') {
			res.flag = val ? (val.toString().length > 0) : false
		} else {
			res.flag = val || false
		}

		return res
	}
}
export default verification
