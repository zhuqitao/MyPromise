const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(excutor) {
	var _this = this
	this.value = undefined
	this.status = PENDING
	this.onFulfilledCallbacks = [] // 存放then resolve的回调函数
	this.onRejectedCallbacks = [] // 存放then reject的回调函数
	this.resodn = '' // reject 的原因

	function resolve(value) {
		if (value instanceof Promise) {
			value.then(resolve, reject)
		}
	}
}