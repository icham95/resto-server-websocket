exports.now = () => {
	let d
	if (!Date.now) {
	  Date.now = function now() {
	    d = new Date().getTime();
	  }
	} else {
		d = Date.now()
	}
	
	let a = new Date(d)
	let year = a.getFullYear()
	let month = '' + (a.getMonth() + 1)
	let day = '' +  a.getDate()

	if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    let now = [year, month, day].join('-')
	return now
}
