var openList = [];
var closeList = [];

function start(){
	floor.unselectFloor();
	
	let start = new Point(floor.selected_start); 
	let end = new Point(floor.selected_end);
	
	start.getCoordinats();
	end.getCoordinats();
	
	start.g = 0;
	openList.push(start);
	
	while(end.div.style.borderColor != "red"){
			openList[0].div.style.borderColor = "blue";	 
			addOpenList(openList[0], end);
			if(openList.length == 0)
				break;
		}	
		
		showWay(end);
}

function addOpenList(parentPoint, end){ 
	let i = parentPoint.y;
	let j = parentPoint.x;
	
	let divY = document.getElementById("textbox1").value;
	let divX = document.getElementById("textbox2").value;
	
	closeList.push(parentPoint);
	openList.splice(0,1);
	let arr = floor.arr;
	
	for (let k = j-1; k < j+2; ++k)
		for(let l = i-1; l < i+2; ++l)
			if(l >= 0 && k >= 0 &&  k < divX && l < divY)
				if( arr[k][l].role != "wall"  &&  arr[k][i].role != "wall"  && arr[j][l].role != "wall" &&
				 arr[k][l].role != "step" && arr[k][l].role != "openList" && arr[k][l].role != "start"){
					let point = new Point(arr[k][l], parentPoint);
					point.getCoordinats();
					point.role = "openList";
				
					if( point.div == arr[k][i] || point.div == arr[j][l])
						point.g = point.parentPoint.g + 10;
					else 
						point.g = point.parentPoint.g + 14;					
					point.f = 10 * Point.getLength(point, end)  + point.g;
				
					if ( arr[k][l].role == "end"){
						end.div.style.borderColor = "red";
						closeList.push(end);
						end.parentPoint = parentPoint;
						return;
					}
					openList.push(point);
				}
	openList.sort(sortFunction);
	for (let a in openList){
		openList[a].div.style.background = "gray";
		openList[a].div.role = "openList";
	}
	openList[0].role = "step";

	for(let i in closeList)
		if(closeList[i].x === openList[0].x && closeList[i].y === openList[0].y)
			closeList.push(openList[0]);	
}

function sortFunction(a, b){
	return Number(a.f) - Number(b.f); 
}

function showWay(elementOfWay){
		let classProp = elementOfWay.div.firstChild.classList;
		classProp.remove("hidden");
		
		if(elementOfWay.parentPoint)
			showWay(elementOfWay.parentPoint);
		else
			return;
}