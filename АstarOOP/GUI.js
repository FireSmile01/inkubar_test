'use strict';
let singleton = Symbol();
let singletonEnforcer = Symbol();
class Floor{
	constructor(enforcer){
		if (enforcer !== singletonEnforcer)
			throw "Instantiation failed: use Floor.instance instead of new.";
		
		this.getSize = function(){
			let x = document.getElementById( "textbox1" ).value;
			let y = document.getElementById( "textbox2" ).value;
				
			this.x = Math.min(Math.max(0, x), 15);
			this.y = Math.min(Math.max(0, y), 15);
		}
		
		this.content = document.getElementById( "content" );
		this.arr = [];
		this.selected_start = null; 
		this.selected_end = null;
		
		let unselect_start = function(elem, self){
				elem.style.background = elem.trueColor;
				self.selected_start = null;
				elem.role = "way";
		}
		
		let unselect_end = function(elem, self){
				elem.style.background = elem.trueColor;
				self.selected_end = null;
				elem.role = "way";
		}
		
		this.thisEl = function() {			
			let radio = document.getElementsByName("any radio");
			
			for(let i in radio)
				if(radio[i].checked)
					switch(i){
						case '0': 
								if(this.elem.selected_start != this) {
									if(this.role === "end")
										this.elem.selected_end = null;
									if(this.elem.selected_start)
										unselect_start(this.elem.selected_start, this.elem);													
									this.style.background = "green"; 
									this.role = "start";
									this.elem.selected_start = this; 
								}
								else
									unselect_start(this, this.elem);
									this.elem.unselectFloor();
								break;		
								
						case '1':
								if(this.role != "wall"){
									if(this.role === "start")
										this.elem.selected_start = null;
									if(this.role === "end")
										this.elem.selected_end = null;	
									
									this.style.background = "red";
									this.role = "wall";								
								}
	
								else {
									this.style.background = this.trueColor;
									this.role = "way";
								}
								this.elem.unselectFloor();
								break;
						
						case '2':
								if(this.elem.selected_end != this) {
									if(this.role === "start")
										this.elem.selected_start = null;
									if(this.elem.selected_end)
										unselect_end(this.elem.selected_end, this.elem);													
									this.style.background = "blue"; 
									this.role = "end";
									this.elem.selected_end = this; 
								}
								else
									unselect_end(this, this.elem);
									this.elem.unselectFloor();
								break;
					}
		}
	};
	
	addEl(){		
		this.clear();	
		
		this.getSize();
		
		for(let i = 0; i < this.x; i++){
			this.arr[i] = [];
			for(let j = 0; j < this.y; j++){
				let El = document.createElement("div");
				El.className = "object";
				El.role = "way";
				El.style.background = "white";
				El.elem = this;
				
				let redPoint = document.createElement("div");
				redPoint.className = "redPoint hidden";				
				
				El.trueBorder = El.style.borderColor;
				El.trueColor = El.style.background;
				El.onclick = this.thisEl;
				this.arr[i].push(El);
				
				this.content.appendChild(El);
				El.appendChild(redPoint);
			}
			
			let cpayce = document.createElement("div");
			cpayce.id = "cpayce";
			this.content.appendChild(cpayce);
		}
	};
	
	clear(){
		this.unselectFloor();
		this.content.innerHTML = "";
		let i = 0;
		this.arr.splice(this.arr[i],this.y);
	};
	
	unselectFloor(){
		let arr = this.arr;
		for(let i in arr)
			for(let j in arr[i]){
				if(arr[i][j].role === "step" || arr[i][j].role === "openList"){
					arr[i][j].style.background = arr[i][j].trueColor;
					arr[i][j].role = "way";				
				}
				arr[i][j].style.borderColor = arr[i][j].trueBorder;
				arr[i][j].firstChild.classList.add("hidden");
			}
		for(let i of openList)
			openList.splice(i);
		for(let i of closeList) 
			closeList.splice(i);			
			
	};		
	
	static get instance() {
		if (!this[singleton])
			this[singleton] = new Floor(singletonEnforcer);	
		return this[singleton];
	};
  
	static set instance(v) { 
		throw "Can't change constant property!" 
	};
}
