import http from './http';

let s = {};

s.addBook = (data) => {
	return http.post('/addBook/', data);
};

s.createIndex = () => {
	return http.get('/createIndex');
}

s.removeIndex = () => {
	return http.get('/removeIndex');
}

s.getSuggestions = (word) => {
	return http.get(`/suggest/${word}`);
}

export default s;