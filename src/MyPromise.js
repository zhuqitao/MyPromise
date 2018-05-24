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

// function resolvePromise(promise2, x, resolve, reject) {
// 	if (promise2 === x) {
// 		reject(new TypeError('循环引用'))
// 	} else if (x instanceof Promise) {
// 		x.then(y => {
// 			resolvePromise(promise2, y, resolve, reject)
// 		}, err => {
// 			reject(err)
// 		})
// 	} else {
// 		resolve(x)
// 	}
// }

function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) { // 如果从onFulfilled中返回的x 就是promise2 就会导致循环引用报错
		return reject(new TypeError('循环引用'));
	}

	let called = false; // 避免多次调用
	// 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
	if (x instanceof Promise) { // 获得它的终值 继续resolve
		if (x.status === PENDING) { // 如果为等待态需等待直至 x 被执行或拒绝 并解析y值
			x.then(y => {
				console.log('yyyyy:', y)
				resolvePromise(promise2, y, resolve, reject);
			}, reason => {
				reject(reason);
			});
		} else { // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
			x.then(resolve, reject);
		}
		// 如果 x 为对象或者函数
	} else if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
		try { // 是否是thenable对象（具有then方法的对象/函数）
			let then = x.then;
			if (typeof then === 'function') {
				then.call(x, y => {
					if (called) return;
					called = true;
					resolvePromise(promise2, y, resolve, reject);
				}, reason => {
					if (called) return;
					called = true;
					reject(reason);
				})
			} else { // 说明是一个普通对象/函数
				resolve(x);
			}
		} catch (e) {
			if (called) return;
			called = true;
			reject(e);
		}
	} else {
		resolve(x);
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