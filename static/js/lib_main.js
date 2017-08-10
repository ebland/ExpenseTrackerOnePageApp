
	/*
		Main - common code
		Author: Thomas John (http://thomasjohn.eu), 2012
		This software is part od Muffin Table.
				
		Vars:
		
		log - shoud write messages? - console.log
		table_demodata1 - table demo
		table_demodata1 - table demo
		
		
		Functions: 
	
		colog(e) - log to the console
	*/
	
	
	//var
	
	var log = true;
	 
    var table_demodata1 = 0;
    var table_demodata2 = 0;
    
	
	//
	
	function colog(e)
	{
		if (log)
			console.log(e);	
	}
    	
    	
    //handle all tables
    
	function table_getData(par){
	
		var id = par[0];

		//data request
		var req = "";
		
		//get options
		
		var sortcol, sortdesc, from, rowsn;
		
		sortcol = tables[id][4];
		sortdesc = tables[id][5];
		from = tables[id][10][1];
		rowsn = tables[id][10][2];
		
		//new values
		switch (par[1]){
		
			case 1:	//table update
				break;
			
			case 2:	//sort
				sortcol = par[2];
				sortdesc = par[3];
				break;
			
			case 3: //change row size
				rowsn = par[2];
				break;
				
			case 4:	//change index
				from = par[2];
				break;
		}

		//based on par and search form build req
		
		
		//build server request
		//code...
		req = "r=fakeorders";	//fake request
		
		
		//make request
		//alert(id);
		if (id=="tab_3")
			$("#"+id).html("<div class=\"alert\">Loading data…</div>");		
		else
			$("#"+id).html("<div class=\"alert muffin\">Loading data…</div>");	
			
		live_request(req, table_setData, par);
	}
	
	
	function table_setData(txtres, par){
		
		var id, data, alldata, datasize;

			
		//parse data and table id
		
		id = par[0];
		
		
		//fake answer
		
		switch (id){
		
			case "tab_1":
				if (table_demodata1==-1)
				{
					colog("No server access - demo data loaded.");
					table_demodata1++;
				}
				data = getFakeData();
				
				alldata = true;
				datasize = null;
				
				break;
				
			case "tab_2":
			case "tab_3":
				if (table_demodata2==1)
					colog("No server access - demo data loaded.");
				
				table_demodata2++;
				data = getFakeData2();
				
				alldata = false;
				datasize = 43;	//example
				
				break;
		}
		
	
		table_imback(id, par, data, alldata, datasize);
		
	}
			
	function table_open(id, row){
		
		alert("Open row: '"+id+"', "+row);
		
		//add code here
		
	}
	
	function table_action(id, type){
		
		alert("Action ("+type+") on table: "+id);
		
		//add code here
		
	}
	
	function label(data){
	
		switch (data)
		{
			case "OK":
			case "Active":
			case "Available":
				return "<span class=\"label label-success\"><data></span>";
				break;
	
			case "Not Available":
				return "<span class=\"label label-important\"><data></span>";
				break;
	
			default:
				return "<span class=\"label label-info\"><data></span>";
		}
	}

	function label_muffin(data){
	
		switch (data)
		{
			case "OK":
			case "Active":
			case "Available":
				return "<span class=\"label muffin label-success label-90\"><data></span>";
				break;
	
			case "Not Available":
				return "<span class=\"label muffin label-important label-90\"><data></span>";
				break;
	
			default:
				return "<span class=\"label muffin label-info label-90\"><data></span>";
		}
	}
	
	function owncompare(v1, v2, desc)	//example
	{
		//own compare example
	
		var comp=false;
				
		//compare here
		comp=v2<v1; //standard
		
		//common
		if (desc)
			return !comp;
		return comp;
	}
	
	
    function main()
    {
    	//colog("all pages");    	
	
		return;
	}
	
	
	$(function () {
	
		main();	//common code
  		thispage();
  	
  	});