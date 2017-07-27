var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit : 10,
	host            : 'localhost',
	user            : 'root',
	password        : 'root',
	database        : 'resto',
	// path sock in ubuntu 17.04, mysql ver 14.14 distrib 5.7.18
	socketPath: '/var/run/mysqld/mysqld.sock'
})

var cashier = require('./scratch/cashier')
var waiter = require('./scratch/waiter')
var resto = require('./scratch/resto')
var cheft = require('./scratch/cheft')
var date = require('./scratch/date')

io.on('connection', (socket) => {
	cashier.auth(socket, io, pool)
	cashier.payFromCashier(socket, io, pool)
	cashier.payGroupedFromCashier(socket, io, pool)

	waiter.auth(socket, io, pool)
	waiter.getDataTables(socket, io, pool)
	waiter.getDataFoods(socket, io, pool)
	waiter.sendOrdersFromWaiter(socket, io, pool)

	cheft.auth(socket, io, pool)
	cheft.updateOrderFromCheft(socket, io, pool)
	
	resto.getDataOrders(socket, io, pool, date.now())
	resto.getDataOrder(socket, io, pool)
})

http.listen(3000, () => {
	console.log('listening on *:3000');
});
