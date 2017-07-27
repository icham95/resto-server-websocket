exports.auth = function (socket, io, pool) {
	socket.on('loginWaiter', function (params) {
		pool.query(`select * from users where username = '${params.username}' and password = '${params.password}'`
			,(err, results, fields) => {
			
			if (results.length > 0) {

				pool.query(`select * from user_level where user_id = '${results[0].id}' and level_id = 3`,
					(err, results, fields) => {
					if (results.length > 0) {

						let data = {
							success: true,
							body: results[0]
						}
						io.emit('loginWaiterFeedback', data)

					} else {
						io.emit('loginWaiterFeedback', { success: false })		
					}
				})

			} else {
				io.emit('loginWaiterFeedback', { success: false })
			}
		})
	})
}

exports.getDataTables = function (socket, io, pool) {
	socket.on('getDataTablesWaiter', function () {
		pool.query('select * from meja', (err, results, fields) => {
			let data = {
				success: true,
				body: results
			}
			io.emit('getDataTablesWaiterFeedback', data)
		})
	})
}

exports.getDataFoods = function (socket, io, pool) {
	socket.on('getDataFoodsWaiter', function () {
		pool.query('select * from makanan', (err, results, fields) => {
			let data = {
				success: true,
				body: results
			}
			io.emit('getDataFoodsWaiterFeedback', data)
		})
	})
}


exports.sendOrdersFromWaiter = (socket, io, pool) => {
	socket.on('sendOrdersFromWaiter', data => {
		let mejaId = data.table.id
		let statusPembayaranId = 1
		let statusDapur = 1
		let userId = data.from.user_id
		let keterangan = data.information
		let query = `insert into pesanan (meja_id, status_pembayaran, status_dapur, user_id, keterangan) values 
				('${mejaId}', 
				'${statusPembayaranId}', 
				'${statusDapur}', 
				'${userId}', 
				'${keterangan}')`
		pool.query(query, (err, results, fields) => {
					if (err) {
						throw err;
						return
						data.success = false
						io.emit('sendOrdersFromWaiterFeedback', data)
					}
					let pesananId = results.insertId
					let orders = data.orders
					for (let i = 0; i < orders.length; i++) {
						pool.query(`call insertPesananMakanan(
								'${pesananId}', 
								'${orders[i].id}',
								${orders[i].jumlah}
							)`, (err, results, fields) => {
								if (err) {
									throw err;
									return
								}
							})
					}
					data.success = true
					io.emit('sendOrdersFromWaiterFeedback', data)
		}) // end pool
	}) // end socket
}
