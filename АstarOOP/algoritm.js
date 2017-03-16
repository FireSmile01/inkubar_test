var openList = [];
var closeList = [];

function start(){
	floor.unselectFloor();
	
	let start = new Point(floor.selected_start);  // создаем экземпляры класса Point используя поля объекта floor, по которым
	let end = new Point(floor.selected_end); // лежат div'ы начала и конца
	
	start.getCoordinats(); // получаем i и j начала и конца
	end.getCoordinats();
	
	start.g = 0; // g это расстояние от старта до текущей точки
	openList.push(start); 
	
	while(end.div.style.borderColor != "red"){ // цикл будет работать пока финишь не будет найден, либо пока программа может проверять новые точки
			openList[0].div.style.borderColor = "blue";	 // бордер клетки, на которую мы делаем шаг, красив в синий
			addOpenList(openList[0], end);
			if(openList.length == 0)
				break;
		}	
		
		showWay(end);
}

function addOpenList(parentPoint, end){ // функция отвечает за логику создания точек, и добавление точек в открытый и закрытый списки, цель функци - на шаг приблизиться к финишу
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
				if( arr[k][l].role != "wall"  &&  arr[k][i].role != "wall"  && arr[j][l].role != "wall" && // услове на непроходимость стен
				 arr[k][l].role != "step" && arr[k][l].role != "openList" && arr[k][l].role != "start"){ // и невозможность создать копию точки, которая была создана ранее
					let point = new Point(arr[k][l], parentPoint);
					point.getCoordinats();
					point.role = "openList";
				
					if( point.div == arr[k][i] || point.div == arr[j][l]) // 	условие на то, что точки по диагонали от данной
						point.g = point.parentPoint.g + 10; // будут стоить 14, остальные 10
					else 
						point.g = point.parentPoint.g + 14;					
					point.f = 10 * Point.getLength(point, end)  + point.g;
				
					if ( arr[k][l].role == "end"){ // если очередная точка окажется финишом, то помечаем ее и выходим
						end.div.style.borderColor = "red";
						closeList.push(end);
						end.parentPoint = parentPoint;
						return;
					}
					openList.push(point); // найденная точка - очердная точка открыого списка
				}
	openList.sort(sortFunction);
	for (let a in openList){ // маркируем точки открытого списка
		openList[a].div.style.background = "gray";
		openList[a].div.role = "openList";
	}
	openList[0].role = "step"; // в этом элементе открытого списка лежит точка, ближайшая к финишу, ее мы перенесем в закрытый список

	for(let i in closeList)
		if(closeList[i].x === openList[0].x && closeList[i].y === openList[0].y)
			closeList.push(openList[0]);	
}

function sortFunction(a, b){
	return Number(a.f) - Number(b.f); 
}

function showWay(elementOfWay){ // у всех точек есть дивы, в которых есть дивы со свойством hidden, просто уберем это свойство с
		let classProp = elementOfWay.div.firstChild.classList;  //  тех точек, по которым находится кротчайший путь
		classProp.remove("hidden");
		
		if(elementOfWay.parentPoint)
			showWay(elementOfWay.parentPoint); 
		else
			return;
}