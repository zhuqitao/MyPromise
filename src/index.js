var a = new Promise(function(resolve, reject) {
	resolve('success')
	reject('reject')
})
var mypromise = function(value) {
	this.value = value
}
mypromise.prototype.then = function() {
	console.log(this.value)
}
a.then(function(res) {
	console.log(res)
	// var th = new Promise(function(res, rej) {
	// 	res('then1')
	// })
	// return th
})