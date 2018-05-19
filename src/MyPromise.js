const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(executor) {
	var _this = this
	this.status = PENDING
	this.value = '' // 成功回调的值
	this.reason = '' // 失败回调的值
	this.onFulfilledCallback = [] // then 成功回调暂存
	this.onRejectedCallback = [] // then 失败回调暂存

	function resolve(res) {
		if (res instanceof Promise) {
			return res.then(resolve, reject);
		}
		setTimeout(() => {
			if (_this.status === PENDING) {
				_this.status = FULFILLED
				_this.value = res
				_this.onFulfilledCallback.map(fn => fn(_this.value))
			}
		})

	}

	function reject(err) {
		setTimeout(() => {
			if (_this.status === PENDING) {
				_this.status = REJECTED
				_this.reason = err
				_this.onRejectedCallback.map(fn => fn(_this.reason))
			}
		})

	}

	try {
		executor(resolve, reject)
	} catch (err) {
		reject(err)
	}
}

function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		reject(new TypeError('循环引用'))
	} else if (x instanceof Promise) {
		x.then(y => {
			resolvePromise(promise2, y, resolve, reject)
		}, err => {
			reject(err)
		})
	} else {
		resolve(x)
	}
}

Promise.prototype.then = function(onFulfilled, onRejected) {

	onFulfilled = (typeof onFulfilled === 'function') ? onFulfilled : val => val
	onReject = (typeof onReject === 'function') ? onReject : val => val

	var promise2 = ''

	if (this.status === FULFILLED) {
		return promise2 = new Promise((resolve, reject) => {
			try {
				var x = onFulfilled(this.value)
				resolvePromise(promise2, x, resolve, reject)
			} catch (err) {
				reject(err)
			}
		})

	}

	if (this.status === REJECTED) {
		return promise2 = new Promise((resolve, reject) => {
			try {
				var x = onRejected(this.reason)
				resolvePromise(promise2, x, resolve, reject)
			} catch (err) {
				reject(err)
			}
		})
	}

	if (this.status === PENDING) {
		return promise2 = new Promise((resolve, reject) => {
			this.onFulfilledCallback.push(value => {
				try {
					var x = onFulfilled(value)
					resolvePromise(promise2, x, resolve, reject)
				} catch (err) {
					reject(err)
				}
			})
			this.onRejectedCallback.push(err => {
				try {
					var x = onRejected(err)
					resolvePromise(promise2, x, resolve, reject)
				} catch (err) {
					reject(err)
				}
			})
		})
	}
}