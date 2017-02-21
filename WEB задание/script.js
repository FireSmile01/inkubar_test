document.addEventListener("DOMContentLoaded", ready);

function ready(){
	localStorage.clear();
}

function showEl(){
	let div = document.getElementById("createContact");
	div.classList.toggle("createContact");
}
var i = 0;
function saveEl(){
	let div = document.getElementById("patternContent");
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
	
	newEl.childNodes[1].childNodes[1].childNodes[1].childNodes[0].style.background = "#00ffff";
	newEl.childNodes[1].childNodes[3].childNodes[1].childNodes[0].style.background = "#00ffff";
	newEl.childNodes[1].childNodes[5].childNodes[1].childNodes[0].style.background = "#00ffff";
	newEl.childNodes[3].childNodes[1].style.background = "#00ffff";

	let obj = {'text1': text1.value, 'text2': text2.value, 'text3': text3.value, 'textInfo':textInfo.value};
	let serialObj = JSON.stringify(obj);
	localStorage.setItem(i, serialObj);
	
	text1.value = "";
	text2.value = "";
	text3.value = "";
	textInfo.value = "";
	
	div.insertBefore(newEl, div.firstChild);

	i++;
}

function deleteEl(event){
	let elem = event.path[1];
	let div = document.getElementById("patternContent");
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
let lastName;
let idRemember;
function newInf(value,event,name){
	let pathEl;
	if (name !="textInfo")
		pathEl = event.path[4];
	else  
		pathEl = event.path[2];
	
	let id = pathEl.id;	
	idRemember = id;
	
	let text1 = pathEl.childNodes[1].childNodes[1].childNodes[1].childNodes[0];  //забиваем div'ы с текстовыми полями в переменные
	let text2 = pathEl.childNodes[1].childNodes[3].childNodes[1].childNodes[0]; // родительский div элементов это элемент, в котором произошло событие
	let text3 = pathEl.childNodes[1].childNodes[5].childNodes[1].childNodes[0];
	let textInfo = pathEl.childNodes[3].childNodes[1];
	let div = document.getElementById('allPage');
	let arr = document.getElementsByClassName("newElem");  // добавляем в массив все записи
	
	for(let i=0; i<arr.length;i++){  // поиск по всем текстовым полям всех записей, ищем выделеные белым поля
		let elem = document.getElementById(String(i));
		let thisText1 = elem.childNodes[1].childNodes[1].childNodes[1].childNodes[0]; // div'ы текстовых полей,  перебираем их все
		let thisText2 = elem.childNodes[1].childNodes[3].childNodes[1].childNodes[0];
		let thisText3 = elem.childNodes[1].childNodes[5].childNodes[1].childNodes[0];
		let thisTextInfo = elem.childNodes[3].childNodes[1];
			
		if(thisText1.style.background=="white" ) 
			saveFix(thisText1,name); 
		
		if(thisText2.style.background=="white" ) 			
			saveFix(thisText2,name);
		
		if(thisText3.style.background=="white" ) 			
			saveFix(thisText3,name);
		
		if(thisTextInfo.style.background=="white" ) 			
			saveFix(thisTextInfo,name);	
	}
		
	
	if(name=="text1"){
			text1.style.background = "white";
			saveChange(text1,div,id,name);
	}
	else
		if(name=="text2"){
			text2.style.background = "white";
			saveChange(text2,div,id,name);
		}
		else
			if(name=="text3"){
				text3.style.background = "white";
				saveChange(text3,div,id,name);
			}
			else {
				textInfo.style.background = "white";
				saveChange(textInfo,div,id,name);
			}

}
function saveFix(text,name){
		let returnObj = JSON.parse(localStorage.getItem(idRemember)) ;
		returnObj [name] = text.value;
		let serialObj = JSON.stringify(returnObj );
		localStorage.setItem(idRemember, serialObj);
		text.style.background = "#00ffff";
}

function saveChange(text,div,id,name){ 
	div.onclick = function() {
		if(event.target != text){
			let returnObj = JSON.parse(localStorage.getItem(id)) 
			returnObj [name] = text.value;
			let serialObj = JSON.stringify(returnObj );
			localStorage.setItem(id, serialObj);
			text.style.background = "#00ffff";
		}
  };
}