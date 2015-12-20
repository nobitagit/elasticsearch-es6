import bookService from './bookService';

var d = document
	, bait = d.getElementById('click-bait')
	, btn = d.getElementById('testPost')
	, searchTitleField = d.getElementById('searchTitle')
	, suggestField = d.getElementById('searchSuggestion')
	,	titleField = d.getElementById('bookTitle')
	, contentField = d.getElementById('bookContent');


let actionList = {
	removeIndex : bookService.removeIndex,
	createIndex: bookService.createIndex,
	addBook: () => {
		bookService.addBook({
			title: titleField.value,
			content: contentField.value
		}).then(function(res){
			 console.log(res)
	  }).catch(function(){
	  	console.log('u-oo')
	  })
	}
};

bait.addEventListener('click', function(e){

	let target = e.target
		, action = target.dataset.clickaction;

	if ( target &&  action ) {
		actionList[action]()
	}
});

let well = d.getElementById('well');

searchTitleField.addEventListener('keyup', function(e){
	let val = e.target.value;

	if ( val.length > 2)  {
		bookService.getSuggestions(val).then(res => {
			let opts = res.docsuggest[0].options;
			if (opts.length) {
				var frag = d.createDocumentFragment()
					, ul = d.createElement('ul')
					, len = (opts.length >= 5) ? 5 : opts.length
					, i = 0;

				while(i < len){
					let li = d.createElement('li');
					li.className = 'suggestions-list__item';
					li.appendChild(d.createTextNode(opts[i].text))
					ul.appendChild(li);
					i = i + 1;
				}
				ul.className = 'suggestion-list';
				frag.appendChild(ul);
				well.innerHTML = '';
				well.appendChild(frag);
			}
		});
	} else {
		well.innerHTML = '';
	}
});