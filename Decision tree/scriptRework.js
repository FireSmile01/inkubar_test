process();
function readFile() {
	let fs = require('fs');
	let text = fs.readFileSync('readme.tsv', 'utf8');
	return text; 	
}

function process() {
	let text = readFile();
	let arr = text.split('\r'); //массив строчек 
	let perArrAtr = arr[0]; 
	let arrZnach = [];
	let arrObj;
	let targetAtr;
	
	for (let i of arr)
		arrZnach.push(i); 
	
	arrZnach.splice(0,1); // массив строчек значений атрибутов
	let arrAtr = perArrAtr.split(' ');	// массив атрибутов 
	
	arrObj = makeNewObj(arrAtr,arrZnach);
	
	let result = getTargetAtr(arrAtr,arrObj);
	if(~result.indexOf("(g)"))
		targetAtr = result;  // целевой атрибут
	else
		return console.log(result);
	
	arrAtr = AtrWithOutTA(arrAtr); // массив атрибутов без целевого атрибута
	
	let dTree = ID3(arrObj,arrAtr,targetAtr);
	console.log(dTree);
	console.log('\n');
	console.log('Pledge(d)',dTree['CreditHistory(d)']['No']['Pledge(d)'])
	console.log('\n');
	console.log('Salary(q)',dTree['CreditHistory(d)']['Good']['Salary(q)'])
}

function ID3(arrObj,arrAtr,targetAtr){	
	
	let znachs;
	let targetZnachs = getTarrZnach(arrObj,targetAtr);
	let unicT = getUnic(targetZnachs,targetAtr);
	if(unicT.length == 1){
		console.log('return',unicT);
		console.log('\n');
		return unicT;
	}
	let targetEntr = getTargEntr(targetZnachs); //энтропия целевого атрибута
	let IG = {}; 
	
	for (let i = 0; i < arrAtr.length; i++) {
		znachs = getArrZnach(arrObj,arrAtr,i);		
		infG = infGain(arrAtr[i],znachs,targetAtr,targetZnachs,targetEntr,arrObj);
		IG[arrAtr[i]] = infG;	
	}
	let rootAtr;
	let maxIG = -10;
	for(let i in IG) {
		if(isNaN(IG[i]))
			continue;
		else	
			maxIG = Math.max(IG[i],maxIG);
				if(IG[i] == maxIG)
					rootAtr = i; 
	}
	/*теперь поместить найденный атрибут в корень дерева, создать столько ветвей у узла, сколько есть уникальных значений у этого атрибута.
	если всем значениям из множества уникального значения атрибута принадлежат значения только из одного множества уникальных значений целевого атрибута, то
	ветка является листом со значением целевого атрибута иначе, для очередной ветки вызвать функцию 
	ID3(arrObj( - те объекты которым все значения из множества уникального значения принадлежат 
	значения только из одного множества уникальных значений целевого атрибута,arrAtr( - атрибуты из верхних уровней),targetAtr);
	P.S. допилить энтропию для не дискретных атрибутов.(сделано)
*/
	console.log('Information gain =',IG);
	console.log('\n');
	console.log('Max information gain =',maxIG);
	console.log('Root atribute =',rootAtr);
	console.log('\n');
	
	let znachAtr = [];
	
	for(let i = 0; i<arrObj.length;i++)
		znachAtr.push(arrObj[i][rootAtr]);
					
	console.log('after enrt');
	let counterA = getCounter(znachAtr,targetZnachs,rootAtr); 
	let counter = getInfCounter(rootAtr,znachAtr,targetAtr,targetZnachs,arrObj); 
	
	let dTree = {};
	let list = {};
	let vetv = {};
	
	for(let i in counterA)
		vetv[i] = clone(list);
	
	dTree[rootAtr] = clone(vetv);
		
	
	console.log('\n');
	console.log(counter);
	console.log('\n');
	console.log(dTree);
	console.log('\n');
	console.log('\n');
	//console.log(arrObjP);
	console.log('\n');
	//console.log(arrAtr);
			
	for(let i in counter){
		let arrObjP = []
		for(let j =0;j<arrObj.length;j++)
			if(~rootAtr.indexOf("(d)")){
				if(znachAtr[j] == i)
					arrObjP.push(arrObj[j]);
			else
				if(~i.indexOf('<=')){
					if(znachAtr[j] <= parseFloat(i))
						arrObjP.push(arrObj[j]);
				else
					if(znachAtr[j] > parseFloat(i))
						arrObjP.push(arrObj[j]);
				}
			}
			if(arrAtr[i] == rootAtr)	
				arrAtr.splice(i,1);			
						
			console.log(arrObjP); 
			console.log('\n');
			dTree[rootAtr][i] = ID3(arrObjP,arrAtr,targetAtr);
	}			
	return dTree;
}


function isEmpty(obj) {
	for (var key in obj)
		return false;
	return true;
}


function infGain(arrAtr,znachs,targetAtr,targetZnachs,targetEntr,arrObj) {
	atrEntr = getEntr(arrAtr,znachs,targetAtr,targetZnachs,arrObj); 
	return targetEntr - atrEntr;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function getInfCounter(Atr,znachs,targetAtr,targetZnachs,arrObj) {
	let unicT = getUnic(targetZnachs,targetAtr);
	let unicA = getUnic(znachs,Atr,targetZnachs);
	let counterA = getCounter(znachs,targetZnachs,Atr);
	let counterT = getCounterT(targetZnachs);
	let counterEntr = [];
	
	let unic = {};
	let counter = {};
	
	if(~Atr.indexOf("(d)")){
		for(let i =0; i<unicT.length;i++)
			unic[unicT[i]] = 0;
			
		for(let i =0; i<unicA.length;i++)	
			counter[unicA[i]] = clone(unic);	
			
		for(let i = 0;i<arrObj.length;i++)
			counter[znachs[i]][targetZnachs[i]] += 1;
		
		console.log(Atr,counter);
		console.log('\n');
		
		return counter;
	}
	else{
		for(let i =0; i<unicT.length;i++)
			unic[unicT[i]] = 0;
		for(let i =0; i<unicA.length;i++)	
			counter[unicA[i]] = clone(unic);	
		
		unicA[-1] = 0;	
					
		for(let j = 0;j<unicA.length;j++)
			for(let i = 0;i<znachs.length;i++)
				if(znachs[i]<=parseFloat(unicA[j]) && znachs[i] > parseFloat(unicA[j-1]))
					counter[unicA[j]][targetZnachs[i]] += 1;					
					
		for(let i = 0;i<znachs.length;i++)
			if(znachs[i]>parseFloat(unicA[unicA.length-1]))
				counter[unicA[unicA.length-1]][targetZnachs[i]] += 1; 
			
		console.log(Atr,counter);
		console.log('\n');
			
		return counter;
	}
}

function getEntr(Atr,znachs,targetAtr,targetZnachs,arrObj){
	let atrEntr = 0;
	let unicT = getUnic(targetZnachs,targetAtr);
	let unicA = getUnic(znachs,Atr,targetZnachs);
	let counterA = getCounter(znachs,targetZnachs,Atr);  
	let counterT = getCounterT(targetZnachs);
	let counterEntr = [];
	
	let unic = {};
	let counter = getInfCounter(Atr,znachs,targetAtr,targetZnachs,arrObj);
			
	for(let i in counter){
		counterA[i] = 0;
		for(let j in counter[i])
			counterA[i] += counter[i][j];
	}
		
	let pathOfEntr = {};
	let entropy = 0;	
	let p;
	let ch = 0;
	 
	for(let i = 0; i<unicA.length;i++){
		for(let j = 0; j<unicT.length;j++){		
			p = counter[unicA[i]][unicT[j]] / counterA[unicA[i]];
			
			if(p != 0) {
				entropy -= p * Math.log2(p);
				ch++; }
			else {
				entropy -= p;
				ch++; }
		}
		if(ch == unicT.length) {
			pathOfEntr[unicA[i]] = entropy;
			entropy = 0;
			ch = 0;
		}		
	}

	for(let i = 0; i<unicT.length;i++){
		if(counterA[unicA[i]] != 0)
			atrEntr += (counterA[unicA[i]]/arrObj.length)*pathOfEntr[unicA[i]];
		else atrEntr = 0;
	}

	return atrEntr;
}

function getTargEntr(targetZnachs){
	let counter = getCounterT(targetZnachs); //ведем подсчет уникальных значнений атрибута и их количество
		
	let entropy = 0;
    let p;
    for (let i in counter) {
		if(counter[i] != 0) {
			p = counter[i] / targetZnachs.length;
			entropy -= p * Math.log2(p);
		}
		else{
			p = 0;
			entropy -= p
		}
    } 
    return entropy;
}

function getUnic(Znachs,atr,targetZnachs) {
	if((~atr.indexOf("(d)")) || (~atr.indexOf("(g)"))){
			let checkArr = [];
			checkArr.push(Znachs[0]);
			let counter = {};
			for(let i =1; i<Znachs.length;i++){
				let flag = 0;
				checkArr.forEach(function(item) {
					if( item == Znachs[i]){
						flag = 1;
						counter[Znachs[i]] = 0;
					}
				});
				if(!flag)
					checkArr.push(Znachs[i]);		
			}
		return checkArr;
	}
	else {
		controlPoint = getCP(Znachs,atr,targetZnachs);
		let checkArr = [];
		checkArr.sort(sortFunction);
		for(let i = 0; i<controlPoint.length;i++)
			checkArr[i] = controlPoint[i] +' x<=';
		checkArr.push(controlPoint[controlPoint.length-1]+' x>'); 
		return checkArr;
	}		
}

function sortFunction(a, b)
{ return Number(a) - Number(b); }

function getCounterT(targetZnachs){       
		let checkArr = [];
		checkArr.push(targetZnachs[0]);
		let counter = {};
		for(let i =1; i<targetZnachs.length;i++){
			let flag = 0;
			checkArr.forEach(function(item) {
				if( item == targetZnachs[i]){
					flag = 1;
					counter[targetZnachs[i]] = 0;
				}
			});
			if(!flag)
				checkArr.push(targetZnachs[i]);		
		}
		
		for(let i = 0; i<targetZnachs.length;i++)
			for(let j = 0; j<checkArr.length;j++)
				if(checkArr[j]==targetZnachs[i])
					counter[checkArr[j]] += 1;
				
		for(let i in counter)
			if(isNaN(counter[i]))
				counter[i] = 1;
		
			
				
		return counter; 
}
	
function getCounter(Znachs,targetZnachs,atr){
	if(~atr.indexOf("(d)")){
		let checkArr = [];
		checkArr.push(Znachs[0]);
		let counter = {};
		for(let i =1; i<Znachs.length;i++){
			let flag = 0;
			checkArr.forEach(function(item) {
				if( item == Znachs[i]){
					flag = 1;
					counter[Znachs[i]] = 0;
				}
			});
			if(!flag)
				checkArr.push(Znachs[i]);		
		}
		
		for(let i = 0; i<Znachs.length;i++)
			for(let j = 0; j<checkArr.length;j++)
				if(checkArr[j]==Znachs[i])
					counter[checkArr[j]] += 1;
				
		for(let i in counter)
			if(isNaN(counter[i]))
				counter[i] = 1;
			
		return counter;
	}
		else {
			
			contrPoints = getCP(Znachs,atr,targetZnachs); //console.log(contrPoints);console.log('\n');
			
			let counter = {};			
			let checkArr = [];
			checkArr.sort(sortFunction);
			for(let i = 0; i<controlPoint.length;i++)
				checkArr[i] = controlPoint[i] +' x<=';
			checkArr.push(controlPoint[controlPoint.length-1]+' x>'); 
			
			for(let i =0; i<checkArr.length;i++)
				counter[checkArr[i]] = 0; 
			
			checkArr[-1] = 0;
			
			for(let j = 0;j<checkArr.length;j++)
				for(let i = 0;i<Znachs.length;i++)
					if(Znachs[i]<=parseFloat(checkArr[j]) && Znachs[i] > parseFloat(checkArr[j-1]))
						counter[checkArr[j]] += 1; 					
					
			for(let i = 0;i<Znachs.length;i++)
				if(Znachs[i]>parseFloat(checkArr[checkArr.length-1]))
					counter[checkArr[checkArr.length-1]] += 1;
			
			for(let i in counter)
				if(isNaN(counter[i]))
					counter[i] = 1;	
				
			return counter; 
		}
}

function getCP(Znachs,atr,targetZnachs){ 
	let numberZnachs = [];
	for(let i =0; i<Znachs.length; i++)
		numberZnachs.push(parseFloat(Znachs[i])); // делаем из строковых значений числовые
		
			
	//создам объект в котором будут лежать ключ - уникальное значение целевого атрибута: массив принадлежащих ему значений
	//количество объектов в объекте = количеству уникальных значений целевого атрибута.
	let obj = {};
	let arr = [];
	let unicT = [];
	let counterT = getCounterT(targetZnachs); 
	for(let i in counterT)
		unicT.push(i);

			
	for(let i = 0;i<unicT.length;i++) {
		let array = [];
		for(let j = 0;j<Znachs.length;j++)
			if(unicT[i] == targetZnachs[j]){
				let elem = numberZnachs[j];
				array.push(elem);
			}
		arr.push(array); 	// создание массива массивов 
	}												
			
	for(let i = 0; i<unicT.length; i++)		{	
		obj[unicT[i]] = arr[i]; 												
	}	
	
	for(let i =0;i<unicT.length;i++){
		let sum = 0;
		for(let j =0;j<obj[unicT[i]].length;j++)
			sum += obj[unicT[i]][j];
		sum = sum/obj[unicT[i]].length;
		obj[unicT[i]] = sum;
	}
	
	
	let contrPoints = [];
	for(let i =0;i<unicT.length;i++)
		for(let j =0;j<unicT.length;j++)
			if(j>i)
				contrPoints.push((obj[targetZnachs[i]]+obj[targetZnachs[j]])/2);
	
	return contrPoints;
}


function getArrZnach(arrObj,arrAtr,number){
	
	let znachs = [];
	for (let i = 0; i<arrObj.length; i++) 
		znachs.push(arrObj[i][arrAtr[number]]);
	return znachs;
}

function makeNewObj(arrAtr,arrZnach) {
	var arrObj = []; 
	for(let i = 0; i<arrZnach.length; i++){
		let arrZnachAtr = arrZnach[i]; 
		arrZnachAtr = arrZnachAtr.split(' ');
		let obj = {}; 
		for(let j = 0; j < arrZnachAtr.length; ++j){
			obj[arrAtr[j]] = arrZnachAtr[j];
		}
		arrObj.push(obj);
	} 
	return arrObj; 
}

function getTargetAtr(arrAtr,arrObj) {
	for( let i = 0; i<arrAtr.length; i++)
		if (~arrAtr[i].indexOf("(g)"))
			if (arrAtr.length == 1) {
				let yes = {};
				yes.length = 1;
				yes.value = arrObj[0];
				let no = {};
				no.length = 0;
				var ind = 1;
				var p;
				while(arrObj.length){
					if( yes.value == arrObj[ind]){
						yes.length++;
						ind++;}
					else {
						no.value = arrObj[ind];	
						p = ind;
						no.length++;
						ind++;}
					if (yes.length > no.length){
						let objTree = {
							root: {
								value: yes.value,
								leftList: null,
								rightList: null
							}
						};
						return objTree;}
					else {
						let objTree = {
							root: {
								value: no.value,
								leftList: null,
								rightList: null
							}
						};
						return objTree;}
				}
			}			
			else 
				return arrAtr[i]; 
	let objTree = {
		root: null
	};
	return objTree;				
}

function AtrWithOutTA(arrAtr) {
	for( let i = 0; i<arrAtr.length; i++)
		if (~arrAtr[i].indexOf("(g)"))
			arrAtr.splice(i,1);
	return arrAtr;
}

function getTarrZnach(arrObj,targetAtr){
	let tarZnach = [];
	for( let i = 0; i<arrObj.length; i++)
		tarZnach.push(arrObj[i][targetAtr]);
	return tarZnach;
}