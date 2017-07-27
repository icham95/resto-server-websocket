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
	// path sock in ubuntu 17.04 
	socketPath: '/var/run/mysqld/mysqld.sock'
})

io.on('connection', (socket) => {
	console.log('a user connected');

	io.emit('connect', true);

	// cashier login auth
	socket.on('cashierLogin', function(authParams){
	    pool.query(`select * from users where
	    			username = '${authParams.username}' 
	    			and 
	    			password = '${authParams.password}'`,
	    		(err, results, fields) => {
	    			if (err) {
	    				throw error;
	    				return
	    			}

	    			if (results.length > 0) {
	    				let userId = results[0].id;
		    			pool.query(`select * from user_level 
		    					where user_id = '${userId}' 
		    					and level_id = '2'`,
		    					(err, results, fields) => {
		    						if (err) {
		    							throw error;
		    							return
		    						}
		    						if (results.length > 0) {
		    							io.emit('logged_cashier', results)
		    						}
		    						else {
		    							io.emit('logged_cashier', 'rejected')
		    						}
		    					})
	    				
	    			}
	    			else {
	    				io.emit('logged_cashier', 'rejected')
	    			}
	    		}); // end pool query
  	}); 
  	// end socket cashierLogin auth

  	// waiter login auth
	socket.on('waiterLogin', function(authParams){
	    pool.query(`select * from users where
	    			username = '${authParams.username}' 
	    			and 
	    			password = '${authParams.password}'`,
	    		(err, results, fields) => {
	    			if (err) {
	    				throw error;
	    				return
	    			}

	    			if (results.length > 0) {
	    				let userId = results[0].id;
		    			pool.query(`select * from user_level 
		    					where user_id = '${userId}' 
		    					and level_id = '3'`,
		    					(err, results, fields) => {
		    						if (err) {
		    							throw error;
		    							return
		    						}
		    						if (results.length > 0) {
		    							io.emit('logged_waiter', results)			
		    						}
		    						else {
		    							io.emit('logged_waiter', 'rejected')
		    						}
		    					})
	    				
	    			}
	    			else {
	    				io.emit('logged_waiter', 'rejected')
	    			}
	    		}); // end pool query
  	}); 
  	// end socket supervisor login auth

  	// supervisor login auth
	socket.on('supervisorLogin', function(authParams){
	    pool.query(`select * from users where
	    			username = '${authParams.username}' 
	    			and 
	    			password = '${authParams.password}'`,
	    		(err, results, fields) => {
	    			if (err) {
	    				throw error;
	    				return
	    			}

	    			if (results.length > 0) {
	    				let userId = results[0].id;
		    			pool.query(`select * from user_level 
		    					where user_id = '${userId}' 
		    					and level_id = '1'`,
		    					(err, results, fields) => {
		    						if (err) {
		    							throw error;
		    							return
		    						}
		    						if (results.length > 0) {
		    							io.emit('logged_supervisor', true)			
		    						}
		    						else {
		    							io.emit('logged_supervisor', 'rejected')
		    						}
		    					})
	    				
	    			}
	    			else {
	    				io.emit('logged_supervisor', 'rejected')
	    			}
	    		}); // end pool query
  	}); 
  	// end socket supervisor login auth

  	// create user
  	socket.on('createUser', (params) => {
  		pool.query(`insert into users (username, password, status) values 
  				('${params.username}', '${params.password}', 2)`, (err, results, fields) => {
  			if (err) {
  				throw err;
  				return
  			}
			let userId = results.insertId;
			pool.query(`call insertUserLevel('${userId}', '${params.levelId}')`, (err, results, fields) => {
				if (err) {
					throw err;
  				return		
				}
				io.emit('statusCreateUser', true)
			})
  		})
  	})
  	//end create user

  	// get tables
  	socket.on('getTables', () => {
  		pool.query('select * from meja', (err, results, fields) => {
  			if (err) {
				throw err;
				return		
			}
			io.emit('dataTables', results)
  		})
  	})
  	// end get tables

  	// get tables
  	socket.on('getFoods', () => {
  		pool.query('select * from makanan', (err, results, fields) => {
  			if (err) {
				throw err;
				return		
			}
			io.emit('dataFoods', results)
  		})
  	})
  	// end get tables

})

http.listen(3000, () => {
	console.log('listening on *:3000');
});