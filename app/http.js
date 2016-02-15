let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

let unwrap = res => res.json()

let s = {};
s.post = (url, payload) => {
  return fetch(url, {
    method: 'post',
    headers,
    body: JSON.stringify(payload)
  }).then(unwrap);
};

s.get = (url)  => {
  return fetch(url, {
    method: 'get',
    headers
  }).then(unwrap);
};

export default s;