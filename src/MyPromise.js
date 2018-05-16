const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(executor) {
	let _this = this
	this.status = PENDING
	this.value = undefined
	this.reason = '' // 失败原因
	this.onFulfilledCallbacks = [] // 成功回调
	this.onRejectedCallbacks = [] // 失败回调

	function resolve(value) {
		if (value instanceof Promise) {
			return value.then(resolve, reject)
		}

		setTimeout(() => {
			if (_this.status === PENDING) {
				_this.status = FULFILLED
				_this.value = value
				_this.onFulfilledCallbacks.map(fn => fn(_this.value))
			}
		}, 0)
	}

	function reject(value) {
		if (value instanceof Promise) {
			value.then(resolve, reject)
		}

		setTimeout(() => {
			if (_this.status === PENDING) {
				_this.status = REJECTED
				_this.reason = value
				_this.onRejectedCallbacks.map(fn => fn(_this.reason))
			}
		}, 0)
	}


	try {
		executor(resolve, reject)
	} catch (err) {
		reject(err)
	}
}

function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new TypeError('循环引用了'))
	}

	if (x instanceof Promise) {
		if (x.status === PENDING) {
			x.then(y => {
				x.status = FULFILLED
				resolvePromise(promise2, y, resolve, reject)
			}, err => {
				reject(err)
			})
		} else {
			x.then(resolve, reject)
		}

	} else {
		resolve(x)
	}
}


Promise.prototype.then = function(onFulfilled, onReject) {

	let peomise2 = undefined

	if (this.status === FULFILLED) {
		return promise2 = new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					let x = onFulfilled(this.value)
					resolvePromise(promise2, x, resolve, reject)
				} catch (err) {
					reject(err)
				}
			})
		})
	}

	if (this.status === REJECTED) {
		return promise2 = new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					let x = onReject(this.reason)
					resolvePromise(promise2, x, resolve, reject)
				} catch (err) {
					reject(err)
				}
			})
		})
	}

	if (this.status === PENDING) {
		return promise2 = new Promise((resolve, reject) => {
			this.onFulfilledCallbacks.push(value => {
				try {
					let x = onFulfilled(value)
					resolvePromise(promise2, x, resolve, reject)
				} catch (err) {
					reject(err)
				}
			})

			this.onRejectedCallbacks.push(value => {
				try {
					let x = onReject(value)
					resolvePromise(promise2, x, resolve, reject)
				} catch (err) {
					reject(err)
				}
			})
		})
	}
}

Promise.all = function(promises) {
	return new Promise((resolve, reject) => {
		var result = []
		promises.map((item, index) => {
			item.then(res => {
				result[index] = res
				if (++index === promises.length) {
					resolve(result)
				}
			}, err => {
				reject(err)
			})
		})
	})
}

Promise.race = function(promises) {
	return new Promise((resolve, reject) => {
		promises.forEach((promise, index) => {
			promise.then(resolve, reject);
		});
	});
}

Promise.prototype.catch = function(onRejected) {
	return this.then(null, onRejected)
}

Promise.resolve = function(value) {
	return new Promise((resolve, reject) => {
		resolve(value)
	})
}

Promise.reject = function(value) {
	return new Promise((resolve, reject) => {
		reject(value)
	})
}