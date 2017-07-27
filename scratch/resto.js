function arr_search (item, arr) {
	let count = 0;
	for (key in arr) {
		if (item === arr[key]) {
			count += 1
		}
	}
	if (count > 0) {
		return true
	}
	return false
}


exports.getDataOrders = (socket, io, pool, now) => {
	socket.on('getDataOrders', (params = null) => {
		let query = 
		`select
		pesanan.id as pesanan_id,
		pesanan.status_pembayaran,
		pesanan.status_dapur,
		pesanan.created_at as pesanan_at,
		pesanan.user_id as pesanan_by,
		pesanan.keterangan as pesanan_keterangan,
		meja.id as meja_id,
		meja.no as meja_no,
		meja.nama as meja_nama,
		meja.keterangan as meja_keterangan,
		makanan.id as makanan_id,
		makanan.nama as makanan_nama,
		makanan.harga as makanan_harga,
		makanan.waktu as makanan_waktu,
		pesanan_makanan.jumlah as makanan_jumlah
		from pesanan 
		inner join meja 
		on meja.id = pesanan.meja_id
		RIGHT join pesanan_makanan
		on pesanan_makanan.pesanan_id = pesanan.id
		inner join makanan
		on pesanan_makanan.makanan_id = makanan.id
		where pesanan.created_at > '${now}' `

		if (params.code == 2) {
			query += ' and pesanan.status_pembayaran = 1'
		}
		if (params.code == 4) {
			query += ' and (pesanan.status_dapur = 1 or pesanan.status_dapur = 2)'
		}

		query += ' order by pesanan.created_at'
		
		pool.query(query, (err, results, fields) => {

			let datas = []
			let searched = []

			for (let i = 0; i < results.length; i++) {
				let result = results[i]

				if (arr_search(result.pesanan_id, searched) == false) {
					datas[result.pesanan_id] = {
						pesanan_makanan: [],
						meja: {},
						pesanan: {}
					}
					searched.push(result.pesanan_id)
				}

				datas[result.pesanan_id].pesanan_makanan.push({
					id: result.makanan_id,
					nama: result.makanan_nama,
					harga: result.makanan_harga,
					waktu: result.makanan_waktu,
					jumlah: result.makanan_jumlah
				})

				datas[result.pesanan_id].meja = {
					id: result.meja_id,
					no: result.meja_no,
					nama: result.meja_nama,
					keterangan: result.meja_keterangan
				}

				datas[result.pesanan_id].pesanan = {
					id: result.pesanan_id,
					status_pembayaran: result.status_pembayaran,
					status_dapur: result.status_dapur,
					keterangan: result.pesanan_keterangan,
					user_id: result.pesanan_by,
					created_at: result.pesanan_at
				}
			}
			let realDatas = {}
			realDatas.success = true
			realDatas.body = datas
			realDatas.code = params.code
			
			io.emit('getDataOrdersFeedback', realDatas)
		})
	})
}

exports.getDataOrder = (socket, io, pool) => {
	socket.on('getDataOrder', id => {
		let query = 
		`select
		pesanan.id as pesanan_id,
		pesanan.status_pembayaran,
		pesanan.status_dapur,
		pesanan.created_at as pesanan_at,
		pesanan.user_id as pesanan_by,
		pesanan.keterangan as pesanan_keterangan,
		meja.id as meja_id,
		meja.no as meja_no,
		meja.nama as meja_nama,
		meja.keterangan as meja_keterangan,
		makanan.id as makanan_id,
		makanan.nama as makanan_nama,
		makanan.harga as makanan_harga,
		makanan.waktu as makanan_waktu,
		pesanan_makanan.jumlah as makanan_jumlah
		from pesanan 
		inner join meja 
		on meja.id = pesanan.meja_id
		RIGHT join pesanan_makanan
		on pesanan_makanan.pesanan_id = pesanan.id
		inner join makanan
		on pesanan_makanan.makanan_id = makanan.id
		where pesanan.id = '${id}'`
		pool.query(query, (err, results, fields) => {
			let datas = []
			let searched = []

			for (let i = 0; i < results.length; i++) {
				let result = results[i]

				if (arr_search(result.pesanan_id, searched) == false) {
					datas[result.pesanan_id] = {
						pesanan_makanan: [],
						meja: {},
						pesanan: {}
					}
					searched.push(result.pesanan_id)
				}

				datas[result.pesanan_id].pesanan_makanan.push({
					id: result.makanan_id,
					nama: result.makanan_nama,
					harga: result.makanan_harga,
					waktu: result.makanan_waktu,
					jumlah: result.makanan_jumlah
				})

				datas[result.pesanan_id].meja = {
					id: result.meja_id,
					no: result.meja_no,
					nama: result.meja_nama,
					keterangan: result.meja_keterangan
				}

				datas[result.pesanan_id].pesanan = {
					id: result.pesanan_id,
					status_pembayaran: result.status_pembayaran,
					status_dapur: result.status_dapur,
					keterangan: result.pesanan_keterangan,
					user_id: result.pesanan_by,
					created_at: result.pesanan_at
				}
			}
			let realDatas = {}
			realDatas.success = true
			realDatas.body = datas

			io.emit('getDataOrderFeedback', realDatas)
		})		
	})
}

