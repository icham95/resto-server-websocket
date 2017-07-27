
exports.auth = function (socket, io, pool) {
	socket.on('loginCashier', function (params) {
		pool.query(`select * from users where username = '${params.username}' and password = '${params.password}'`
			,(err, results, fields) => {
			
			if (results.length > 0) {

				pool.query(`select * from user_level where user_id = '${results[0].id}' and level_id = 2`,
					(err, results, fields) => {
					if (results.length > 0) {

						let data = {
							success: true,
							body: results[0]
						}
						io.emit('loginCashierFeedback', data)

					} else {
						io.emit('loginCashierFeedback', { success: false })		
					}
				})

			} else {
				io.emit('loginCashierFeedback', { success: false })
			}
		})
	})
}


exports.payFromCashier = (socket, io, pool) => {
	socket.on('payFromCashier', (params) => {
		pool.query(`update pesanan set pesanan.status_pembayaran = '${params.statusPembayaran}'
				where pesanan.id = '${params.id}'`, (err, results, fields) => {
			if (err) {
				throw err;
				return
			}
			let feedback = {
				id: params.id,
				success: true,
				meja: {
					nama: params.meja.nama,
					no: params.meja.no
				}
			}
			io.emit('payFromCashierFeedback', feedback)
		})
	})
}

exports.payGroupedFromCashier = (socket, io, pool) => {
	socket.on('payGroupedFromCashier', (params) => {
		let feedback = [];
		for (let i = 0; i < params.length; i++) {
			pool.query(`update pesanan set pesanan.status_pembayaran = '${params[i].statusPembayaran}'
					where pesanan.id = '${params[i].id}'`, (err, results, fields) => {
				if (err) {
					throw err;
					return
				}
			})
			feedback.push({
				id: params[i].id,
				meja: {
					nama: params[i].meja.nama,
					no: params[i].meja.no
				}
			})
		}
		feedback.push({success: true})
		io.emit('payGroupedFromCashierFeedback', feedback)
	})
}