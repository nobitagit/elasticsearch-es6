import bookService from './bookService';

var d = document
	, bait = d.getElementById('click-bait')
	, btn = d.getElementById('testPost')
	, searchTitleField = d.getElementById('searchTitle')
	, suggestField = d.getElementById('searchSuggestion')
	,	titleField = d.getElementById('bookTitle')
	, contentField = d.getElementById('bookContent')
	, well = d.getElementById('well')


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

bait.addEventListener('click', e => {

	let target = e.target
		, action = target.dataset.clickaction;

	if ( target &&  action ) {
		actionList[action]()
	}
});

let howManyResults = 0;

function doSearch (val) {
	bookService.getSuggestions(val).then(res => {
		if (!res) return;
		let opts = res.docsuggest[0].options;
		if (opts.length) {
			let frag = d.createDocumentFragment()
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
			howManyResults = len;
		}
	});
}

function highlightHint (pos) {
	var items = well.getElementsByTagName('li');
	for (let i = 0, len = items.length; i < len; i++) {
		if (i === pos) {
			items[i].classList.add('highlight-line');
		} else {
			items[i].classList.remove('highlight-line');
		}
	}
}

let timedSearch,
		cursorPos = -1;

const arrowKeys = [
	37, // left
	38, // up
	39, // right
	40, // down
];

function showSuggestions (e) {
	let val = e.target.value;

	if (arrowKeys.indexOf(e.which) !== -1) {
		switch (e.which) {
			case 38:
				cursorPos = cursorPos > 0 ? cursorPos - 1 : 0;
				e.preventDefault()
				break;
			case 40:
				cursorPos = cursorPos < howManyResults - 1 ? cursorPos + 1 : howManyResults - 1;
				break;
			default:
	      break;
		}
		highlightHint(cursorPos);
		return;
	}

	if (e.which === 13) {
		console.log('follow hint n.' + (cursorPos + 1))
		return;
	}

	window.clearTimeout(timedSearch);
	// only suggest for words over 2 chars long
	if ( val.length > 2)  {
		/**
		 * throttle the search: only look up for suggestions when user
		 * has stopped writing for at least n seconds (0.4s in this case)
		 **/
		timedSearch = window.setTimeout(() => doSearch(val),400);
	} else {
		noSuggestions();
	}
}

function noSuggestions () {
	cursorPos = -1;
	well.innerHTML = '';
}

searchTitleField.addEventListener('keyup', showSuggestions);
searchTitleField.addEventListener('focus', showSuggestions);

searchTitleField.addEventListener('blur', noSuggestions);

