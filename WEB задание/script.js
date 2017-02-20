function showEl(){
	let div = document.getElementById("createContact");
	div.classList.toggle("createContact");
}
var i = 0;
function saveEl(){
	let div = document.getElementById("content");
	let newEl = document.createElement("div");
	let pattern = document.getElementById("pattern");
	let search = document.getElementById("search");
	
	newEl.id = String(i);
	newEl.className = "newElem";	
	let div1 = document.getElementById("createContact");
	div1.classList.toggle("createContact");
	
	let text1 = document.getElementById("createInfo1");
	let text2 = document.getElementById("createInfo2");
	let text3 = document.getElementById("createInfo3");
	let textInfo = document.getElementById("createInfo4");
	
	newEl.innerHTML = pattern.innerHTML;
	
	newEl.childNodes[1].childNodes[1].childNodes[1].childNodes[0].value = text1.value;
	newEl.childNodes[1].childNodes[3].childNodes[1].childNodes[0].value = text2.value;
	newEl.childNodes[1].childNodes[5].childNodes[1].childNodes[0].value = text3.value;
	newEl.childNodes[3].childNodes[1].value = textInfo.value;

	let obj = {'text1': text1.value, 'text2': text2.value, 'text3': text3.value, 'textInfo':textInfo.value};
	let serialObj = JSON.stringify(obj);
	localStorage.setItem(i, serialObj);
	
	text1.value = "";
	text2.value = "";
	text3.value = "";
	textInfo.value = "";
	
	div.insertBefore(newEl, search);
	i++;
}

function deleteEl(event){
	let elem = event.path[1];
	let div = document.getElementById("content");
	let result = confirm("Вы точно хотите удалить запись?");
	if (result)
		div.removeChild(elem);
}

function find(value){
	console.log(value);
	
	for(let i=0;i<localStorage.length;i++)
		if (~localStorage[i].indexOf(value)) {
			let div = document.getElementById(i);
			div.classList.remove("this");
			continue;
		}
		else	{
				let div = document.getElementById(i);
				div.classList.add("this");
		}
		
			
}

function newInf(value,event,clas){
	let pathEl;
	if (clas !="patterInfo2")
		pathEl = event.path[4];
	else  
		pathEl = event.path[2];
	
	let id = pathEl.id;

	let text1 = pathEl.childNodes[1].childNodes[1].childNodes[1].childNodes[0];
	let text2 = pathEl.childNodes[1].childNodes[3].childNodes[1].childNodes[0];
	let text3 = pathEl.childNodes[1].childNodes[5].childNodes[1].childNodes[0];
	let textInfo = 	pathEl.childNodes[3].childNodes[1];
	
	let obj = {'text1': text1.value, 'text2': text2.value, 'text3': text3.value, 'textInfo':textInfo.value};
	let serialObj = JSON.stringify(obj);
	localStorage.setItem(id, serialObj);
}