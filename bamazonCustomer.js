var mysql = require('mysql');
var chalk = require('chalk');
// var pool  = mysql.createPool(...);
require('console.table');
var inquirer = require('inquirer');
var fs = require('fs');
var jsonfile = require('jsonfile');
var TransactionID = 0; //transactions per user per one entry
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'HelloWorld!',
	database: 'bamazone',
	port: 3306
});


connection.connect(function(err) {

});


var itemID = 4;
var currentDB = {}

var SETUPDATED = function() { 
connection.query("SELECT * FROM products", function(err, res) {

	if (err) {

		console.log(err)
		return;
	}
	console.table(res)

	Choise(res)
});
}

	






var Choise = function(res) {
	_this = this   
	inquirer.prompt({
		name: 'choice',
		type: 'list',
		message: 'What do you want to buy?',
		choices: function(_this) {
			var Picckarray = ['Exit'];

			for (var i = 0; i < res.length; i++) {

				Picckarray.push(res[i].product_name);
			}

			return Picckarray;

		}

	}).then(function(answer) {

		if (answer.choice === 'Exit') {
			console.log(chalk.green('See you later!'))
			process.exit()

		}

			// console.log(answer.choice)
			var itemPicked = answer.choice

			inquirer.prompt({
				name: 'amount',
				type: 'input',
				message: `How many units of ${itemPicked} would you like to buy? `,
			}).then(function(answers) {

					// console.log(answers.amount)

					var toBuy = parseInt(answers.amount);

					var FullDescription = function() {

						for (var i = 0; i < res.length; i++) {

							if (res[i].product_name === itemPicked) {

								var item = res[i];

								if (parseInt(item.stock_quantity) >= toBuy) {

									item.stock_quantity = item.stock_quantity - toBuy;

									// console.log(item.item_id)
									connection.query(`UPDATE products SET stock_quantity = ${item.stock_quantity} WHERE item_id = ${item.item_id};`, function(err, res) {


											if (err) {
												throw err;
											}
														//CREATING OUR JSON for Transaction log
											console.log(chalk.green('You made your purchase'));
											TransactionID++
											var ItemForLog = {
												TRANSACTION_NUMBER : TransactionID,
												DEPARTMENT: item.department_name,
												PRODUCT: item.product_name,
												PURCHASED: toBuy,
												PRICE_PER_UNIT: item.price,
												TOTAL_PROFIT: toBuy * item.price

											}
										

										fs.readFile('transactionlog.json', 'utf8', function readFileCallback(err, data) {
											if (err) {
												console.log(err);
											} else {
												obj = JSON.parse(data); //we Parsing JSON to be able acces the array in TRANSACTIONS
												obj.transactions.push(ItemForLog); //add our card Data to the TRANSACTIONS array as an object CARD
												json = JSON.stringify(obj, null, 4); //CONVERT BACK TO JSON
												fs.writeFile('transactionlog.json', json, 'utf8'); // REWRITE ADDITIONAL
											}


										});
											SETUPDATED()
									})



							} else {
								//if NAN then this RED!
								console.log(chalk.red('Insufficient quantity!'));
								Choise(res)
							}


						}
					}
				}
				FullDescription()


			});


	});



}

SETUPDATED()

