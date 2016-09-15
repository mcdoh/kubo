let Promise = require('bluebird');
let request = require('request');
let args = require('yargs').argv;

function identity (value) {
	return value;
}

function range (size, iteratee = identity) {
	return Array.from(Array(size), (value, index) => iteratee(index));
}

let endpoint = function (videoID = 'dfb6f5fe-0c8a-11e6-bc53-db634ca94a2a', segment = 8) {
	return `https://emojiplayer.washingtonpost.com/moments/${ videoID }/${ segment }`;
}

let votes = args.count || args.c || 1;

function vote () {
	return new Promise((resolve, reject) => {
		request(options, (error, response) => {
			if (error) reject(error);
			else resolve(response.body);
		});
	});
}

let options = {
	url: endpoint(args.video || args.v, args.segment || args.s),
	headers: {
		'Origin': 'washingtonpost.com',
		'Content-Type': 'application/json'
	},
	json: true,
	body: {type: args.type || args.t || 'angry'},
	method: 'PATCH'
};

Promise.map(range(votes), vote, {concurrency: 3})
.then(result => console.log(result))
.catch(error => console.log(error));

