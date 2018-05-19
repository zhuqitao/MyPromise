// var a = new Promise(function(resolve, reject) {

// 	resolve('ssss')
// 	reject('eeeee')
// })

// a.then(function(res) {

// 	return new Promise.resolve('ttt')
// }).then(res => {
// 	console.log(res)
// })

var p1 = new Promise((resolve, reject) => {
	var a = new Promise((res, rej) => {
		res('pa')
	})
	resolve(a)
})
p1.then(res => {
	console.log(res)
}, err => {
	console.log(err)
})

var p2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		reject('p2')
	}, 2000)
})

// Promise.race([p1, p2]).then(res => {
// 	console.log(res)
// })