exports.auth = function (socket, io, pool) {
	socket.on('loginCheft', function (params) {
		pool.query(`select * from users where username = '${params.username}' and password = '${params.password}'`
			,(err, results, fields) => {
			
			if (results.length > 0) {

				pool.query(`select * from user_level where user_id = '${results[0].id}' and level_id = 4`,
					(err, results, fields) => {
					if (results.length > 0) {

						let data = {
							success: true,
							body: results[0]
						}
						io.emit('loginCheftFeedback', data)

					} else {
						io.emit('loginCheftFeedback', { success: false })		
					}
				})

			} else {
				io.emit('loginCheftFeedback', { success: false })
			}
		})
	})
}

exports.updateOrderFromCheft = (socket, io, pool) => {
	socket.on('updateOrderFromCheft', (params) => {
		let pesananId = params.pesananId
		let statusId = params.statusDapur
		let query = `update pesanan set status_dapur = '${statusId}' where id = '${pesananId}'`
		pool.query(query,
			(err, results, fields) => {
				// emit getDataOrders and getDataOrder
				// dispatch ga bisa, nunggu pulsa ada cari di dokumentasi socket.io
				// nyoba langsung ke method events
				socket._events.getDataOrders({code: 4})
				socket._events.getDataOrder(pesananId)
			})
	})
}