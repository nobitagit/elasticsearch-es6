import express from 'express';
import bodyParser from 'body-parser';
import expressPromise from 'express-promise';
import * as es from './elastic';

let app = express();
let router = express.Router();

const port = 3000;

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressPromise());

app.get('/', function (req, res) {

});

app.get('/suggest/:input', function (req, res, next) {
  es.getSuggestions(req.params.input)
  	.then((result) => res.json(result) );
});

/* POST document to be indexed */
app.post('/addBook', function (req, res, next) {

	es.addDocument({
		title: req.body.title,
		content: req.body.content
	})
	.then(data => res.status(200).json(data))
	.catch(e => res.status(500));

});

app.get('/removeIndex',(req, res) => {
	es.indexExists().then(function(exists){
		if (!exists) {
			return res.status(200).json({
				message: "index does not exist"
			})
		} else {
			es.deleteIndex().then(()=>{
				res.status(200).json({
					message: 'deleted'
				});
			});
		}
	});

});

app.get('/createIndex',(req, res) => {

	es.indexExists().then(function(exists){
		if (exists) {
			return res.status(200).json({
				message: "index already exists"
			})
		} else {
			es.initIndex()
				.then(es.initMapping)
				.then((mapping)=>{
					return res.status(200).json({
						message: 'created'
					});
			});
		}
	});
});

app.listen(port, function () {
	console.log(`Listening. Open http://localhost:${port}`)
});

//export default app;