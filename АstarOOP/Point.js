'use strict';
class Point{
	constructor(div, parentPoint){
		this.div = div;
		this.parentPoint = parentPoint;
	};
	
	getCoordinats(){
		for (let i = 0; i < floor.arr.length; ++i)
			for(let j = 0; j < floor.arr[i].length; ++j)
				if(this.div === floor.arr[i][j]){
					this.x = i;
					this.y = j;
		}				
	};
	
	static getLength(now, end){
		let radio = document.getElementsByName("radio");
		let x0 = now.x;
	        let y0 = now.y;
	
		let x1 = end.x;
	        let y1 = end.y;
	
		let x = x1 - x0;
	        let y = y1 - y0;
		
		for(let i in radio)
			if(radio[i].checked)
				switch(i){
					case '0':
						if(x<0)
							x = x*(-1);
						if(y<0)
							y = y*(-1);
						return	x+y; 
						
					case '1':
						if(x<0)
							x = x*(-1);
						if(y<0)
							y = y*(-1);
						return Math.max(x, y);						
				}
			else
				return Math.sqrt(x*x + y*y);
	};
}
