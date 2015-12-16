let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

let s = {};
s.post = (url, payload) => {
	return fetch(url, {
		method: 'post',
		headers,
		body: JSON.stringify(payload)
	}).then((res) => res.json());
}

export default s;