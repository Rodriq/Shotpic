const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const Unsplash = require('unsplash-js').default;
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const unsplash = new Unsplash({
	applicationId: "dcfdc07a0e58418158e22b05d40e4a00758b951ab756b1ea400227f318a7846c",
	secret: "cefe6b6b443613ce10a1932a9c8a33da0383a7d53e8986bdd2dba920b140ad43",
	callbackUrl: "/test"
});

const http = axios.create({
	baseURL: "https://api.unsplash.com/",
	params: {
		client_id: 'dcfdc07a0e58418158e22b05d40e4a00758b951ab756b1ea400227f318a7846c'
	}
});

var port = process.env.PORT || 3000;

app.get('/api/photos', (req, res) => {
	let term = req.query.term;
	http.get(`search/photos?query=${term}`)
	.then(us => {
		res.send(us.data)
	})
	.catch(err => {
		if (err.request) {
			console.log('Request error', err.request);
		} else if (err.response) {
			console.log('Response error', err.response);
		} else {
			console.log(err.message);
		}
	});
	
});

app.get('/api/download', (req, res) => {
	let id = req.query.id;
	console.log(unsplash)
	unsplash.photos.getPhoto(id)
	.then(toJson)
	.then(json => {
		unsplash.photos.downloadPhoto(json);
	});
	
});

app.listen(port, () => console.log('Unsplash server app listening on port 3000!'));