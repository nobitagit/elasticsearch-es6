import http from './http';

let s = {};

s.addBook = (data) => {
	console.log('serv')
	return http.post('/addBook/', data);
};

export default s;