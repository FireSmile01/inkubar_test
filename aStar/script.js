var selected_start = null;
var selected_end = null;
var arr = [];
var wasCreated;

function AddFloor() {
	if (wasCreated == "true")
		deleteFloor();
	
	let x = document.getElementById("textbox1").value;
	let y = document.getElementById("textbox2").value;
	
	x = Math.min(Math.max(0, x), 20);
	y = Math.min(Math.max(0, y), 20);
	
	let id = 0;
	let i = 0;
	let l = 0;
	let div = document.getElementById("content");
	while (i<y) {
		arr[i] = [];
		while (l<x) {
			let El = document.createElement("div");
			El.className = "object";
			El.role = "way";
			El.style.background = "white";
			El.id = ++id;
			
			El.trueColor = El.style.background;
			El.onclick = ThisEl;
			arr[i].push(El);
			
			div.appendChild(El);
			l++;
		}	
	let cpayce = document.createElement("div");
	cpayce.id = "cpayce";
	div.appendChild(cpayce);
	i++;
	l=0;
	}
	wasCreated = "true";
}

function Clear() {
	unselectFloor();
	for (let i = 0; i < arr.length; ++i)
		for(let j = 0; j < arr[i].length; ++j) {
			arr[i][j].role = "way";
			arr[i][j].style.background = "white";
		}
}

function deleteFloor() {
	let div = document.getElementById("content");
	div.innerHTML = "";
	let y = document.getElementById("textbox2").value;
	let i = 0;
	arr.splice(arr[i],y);
	for(let i of FreeList)
	FreeList.splice(i);
	for(let i of StepList)
	StepList.splice(i);
}

function unselect_start(elem)
{	
	elem.style.background = elem.trueColor;
	selected_start = null;
	elem.role = "way";
}

function unselect_end(elem)
{	
	elem.style.background = elem.trueColor;
	selected_end = null;	
	elem.role = "way";
}

function unselectFloor() {
	for (let i = 0; i < arr.length; ++i)
		for(let j = 0; j < arr[i].length; ++j) {
			if (arr[i][j].role == "way") 
				arr[i][j].style.background = "white";
			arr[i][j].style.borderColor = "black";
			arr[i][j].innerHTML = "";
		}

	for(let i of FreeList)
		FreeList.splice(i);
	for(let i of StepList) {
		StepList.splice(i);
	}
	wasStarted = "false";
}

function ThisEl(event) {
	let Element =  event.target;
	let radio = document.getElementsByName("any radio");
	
	if (radio[1].checked) {
		if(Element.role != "Wall")
		{
			Element.style.background = "red";
			Element.role = "Wall";
		} else {
			Element.style.background = Element.trueColor;
			Element.role = "way";
		}
		if(wasStarted == "true")
			unselectFloor();
	}
	
	if (radio[2].checked) {
		if(selected_end != Element) {		
			for (let i = 0; i < arr.length; ++i)
				for(let j =0; j <arr[i].length; ++j)
					if (arr[i][j].role == "End")
						unselect_end(arr[i][j]);		
				Element.style.background = "blue";
				Element.role = "End";
				selected_end = Element;	
			} else
				unselect_end(Element);
		if(wasStarted == "true")		
			unselectFloor();
	}
		
	if (radio[0].checked) {
			if(selected_start != Element) {
			for (let i = 0; i < arr.length; ++i)
				for(let j = 0; j < arr[i].length; ++j)
					if (arr[i][j].role == "Start")
						unselect_start(arr[i][j]);					
				Element.style.background = "green";
				Element.role = "Start";
				selected_start = Element;
			} else
				unselect_start(Element);
			if(wasStarted == "true")
				unselectFloor();	
	}
}

//GUI
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Algoritm

let start_ind = null;
function getStart() {
	for (let i = 0; i < arr.length; ++i)
		for(let j = 0; j < arr[i].length; ++j)
			if (arr[i][j].role == "Start")
			{	
				start_ind = {'y': i, 'x': j};
				return;
			}
			start_ind = null;
}

let end_ind = null;
function getEnd() {
	for (let i = 0; i < arr.length; ++i)
		for(let j =0; j < arr[i].length; ++j)
			if (arr[i][j].role == "End")
			{
				end_ind = {'y': i, 'x': j, 'div': arr[i][j]};
				return;
			}
			end_ind = null;
}

function length(parentPoint){
	let radio = document.getElementsByName("radio");
	let x0 = parentPoint.x,
	       y0 = parentPoint.y;
	
	let x1 = end_ind.x,
	       y1 = end_ind.y;
	
	let x = x1 - x0,
	       y = y1 - y0;
	
	if(radio[0].checked){
		if(x<0)
			x = x*(-1);
		if(y<0)
			y = y*(-1);
		return	x+y; }
	else	
		if(radio[1].checked){
			if(x<0)
				x = x*(-1);
			if(y<0)
				y = y*(-1);
			return Math.max(x,y);}
		else	
			return Math.sqrt(x*x + y*y);	
}

function sortFunction(a, b)
{ return Number(a.f) - Number(b.f); }

function way(elOfWay) {
	let id = elOfWay.div.id;
	let div = document.getElementById(id);
	let redPoint = document.createElement("div");
	redPoint.className = "redPoint";
	redPoint.align = "center";
	div.appendChild(redPoint);
	if(elOfWay.path)
		way(elOfWay.path);
	else return;
}

function addFreeList(parentPoint) {
	let i = parentPoint.y;
	let j = parentPoint.x;
	let divY = document.getElementById("textbox1").value;
	let divX = document.getElementById("textbox2").value;
	FreeList.splice(0,1);	
	
	for (let k = i-1; k < i+2; ++k)
		for(let l = j-1; l < j+2; ++l)
			if(l >= 0 && k >= 0 &&  k < divX && l < divY)
				if( arr[k][l].role != "Wall"  &&  arr[k][j].role != "Wall"  && arr[i][l].role != "Wall"  &&  arr[k][l] != arr[i][j] && arr[k][l].style.borderColor != "blue" && arr[k][l].style.background != "gray none repeat scroll 0% 0%"){
					let obj = {'div': arr[k][l], 'x': l, 'y': k, 'path': parentPoint};
						if( obj.div == arr[k][j] || obj.div == arr[i][l]){
							var g1 = 10;
							obj.g = obj.path.g + 10;}
						else {
							obj.g = obj.path.g + 14;
							var g2 = 14;}
					obj.f = 10*length(obj)  + obj.g;
					if ( arr[k][l].role == "End"){
						if( obj.div == arr[k][j] || obj.div == arr[i][l]){
							end_ind.div.style.borderColor = "red";
							StepList.push(end_ind);
							end_ind.path = parentPoint;
							break;}
						else
							if( 2*g1 > g2) {
								end_ind.div.style.borderColor = "red";
								StepList.push(end_ind);
								end_ind.path = parentPoint;
								break;}
							else {
								continue;}
					}	
					FreeList.push(obj);	
				}		
	FreeList.sort(sortFunction);
	for (let a of FreeList)
		a.div.style.background = "gray";
	StepList.push(FreeList[0]);	
}
	var StepList = [];
	var FreeList = [];
	var wasStarted = "false";

function Start() {
	unselectFloor();
	wasStarted = "true";
	getStart(); 												//получение координат старта
	getEnd(); 													//получение координат финиша
	start_ind.div = arr[start_ind.y][start_ind.x]; 				//создаем объект по которому лежит div с координатами старта.
	start_ind.g =  0;
	start_ind.div.style.borderColor = "blue";
	addFreeList(start_ind); 									//создаем открытый список для стартовой позиции
	
	/*let timerId = setInterval( function() {						//поиск пути
		if(end_ind.div.style.borderColor == "red") {
			way(end_ind);										//маркируем кротчайший путь
			console.log(FreeList);
			console.log(StepList);
			clearInterval(timerId);
		}
		else{
			FreeList[0].div.style.borderColor = "blue";	 
			addFreeList(FreeList[0]);	
			if(FreeList.length == 0){
				way(end_ind);
				clearInterval(timerId);
			}
		}	
		}, 100);	*/
		
		while(end_ind.div.style.borderColor != "red"){
			FreeList[0].div.style.borderColor = "blue";	 
			addFreeList(FreeList[0]);
			if(FreeList.length == 0)
				break;
		}		
		
		way(end_ind);
		let last = StepList.pop();
/*	FreeListTest();
	EvristicCheck();
	WayCheck();
	CheckLists();*/
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------
//tests

function FreeListTest() {
	for(let i = 0; i<FreeList.length-1; ++i) 
		if(FreeList[0].div == FreeList[1].div) {
			alert("FreeListCheck false");
			alert("FreeList[i].div = " + div.FreeList[i].div + ", FreeList[i+1].div = " + div,FreeList[i+1].div);
			return;
		}
	alert("FreeListCheck true");
}

function EvristicCheck() {
	for(let i of StepList)
		if(i<StepList[0])
			return alert("EvristicCheck false");
	alert("EvristicCheck true");
}

function WayCheck() {
	for (let i = 0; i < arr.length; ++i)
		for(let j = 0; j < arr[i].length; ++j)
			if( arr[i][j].role == "Wall")
				return;
	if(start_ind.x == end_ind)
		for(let p = 0; p<StepList.length-1; p++)
			if(StepList[p].x != start_ind.x)
				return alert("WayCheck false");
	if(start_ind.y == end_ind.y	)
		for(let p = 0; p<StepList.length-1; p++)
			if(StepList[p].y != start_ind.y)
				return alert("WayCheck false");	
	if(start_ind.x != end_ind.x && start_ind.y != end_ind.y)
		return alert("WayCheck is not avalible");
	alert("WayCheck true");
}

function CheckLists() {
	for (let i of FreeList)
		for( let j of StepList)
			if (j.div == i.div){
				alert("FreeList = " + i.x+":"+i.y + " StepList = " + j.x+":"+j.y + " CheckLists False");
				return;}
	alert("CheckLists True");		
}