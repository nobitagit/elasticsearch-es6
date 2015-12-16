import bookService from './bookService';

var d = document
	, btn = d.getElementById('testPost')
	,	titleField = d.getElementById('bookTitle')
	, contentField = d.getElementById('bookContent');

btn.addEventListener('click', function(){

	bookService.addBook({
		title: titleField.value,
		content: contentField.value
	}).then(function(res){
		 console.log(res)
  }).catch(function(){
  	console.log('u-oo')
  })
});
