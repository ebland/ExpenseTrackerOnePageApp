
		/*
		Live - read data from server (cycle) or/and by request
		Version: 1.0
		Author: Thomas John (http://thomasjohn.eu), 2012
		This software is part od Muffin Table.
				
		Vars:
		
		live_counter - number of cycles
		live_time - time (in s) between readings
		live_hfunction - function started by live_read
		live_par - parameters for the server (used by live_read)
		
		
		Functions / interface: 
	
		live_request(req, f, par)	- request server data
			req - request for the server
			f - handle result function
			par - extra parameters for f function
		
		live_cycleOn(f)	- start live cycle
			
		*/
    	    	
    	
    	//var
    	var live_counter = 0; 	
    	var live_time = 2;
    	var live_hfunction; 
    	var life_par = "p=forserver";  	
    	
    	//cycle
    	
    	function live_read(){
		
    		colog("Read data from server...");
    		
    		
    		//read data from server code
    		//...
    		
    		//passing page_id to the server and reading data
    		live_counter++;
    		
    		
    		//fake - without server
    		
    		//fake answer
    		var txtres = "\
    		\
    		<data>\
    			<action type=\"1\">Hello!</action>\
    		</data>\
    		\
    		";
    			
    		if (typeof(live_hfunction) == "function")
    			live_hfunction(txtres);
    		
    		
    		setTimeout(live_read, live_time*1000);    	
    	}
    	
    	function live_cycleOn(f){
    		
    		colog("Live - start…");
    		
    		if (typeof(f) == "function")
    			live_hfunction = f;
    		
    		live_read();
    		
    	}

		//request
		
    	function live_request(req, f, par){
    			
    		//send data to the server
    	
    		//ajax		
    		
    	
    		//fake answer
    		var txtres = "";
    			
    			
    		if (typeof(f) == "function")
    			setTimeout(function(){
    				
    				par.push(req);
    				f(txtres, par);
    				
    			}, 750);	//simulation
    	
    	}
    	
 		//end
 		