	
    	/*
    	
		Tables - handle tables with data (all localy or in a part)
		Version: 1.01
		Author: Thomas John (http://thomasjohn.eu), 2012
		This software is part od Muffin Admin Cake.
				
		Vars:
		
		tables - array with tables
		
		
		Functions / interface: 
			Example: orders.html, lib_main.js
		
		table_init(id, style, colsname, compare, navi, decor, checkboxes, width, datafunction, search) - init table
			id - table id
			style - "class='table <style>"
			colsname - column names
			compare - optional values compare functions
			navi - array 
			decor - array with decoration strings or functions
			checkboxes - first column with checkboxes
			width - width of all columns in px
			datafunction - loading data function
			search - search field is 		
		
		table_update(id) - render table with id
		
		table_sort(id, n, desc) - sort table by colmn n (asc or desc)
		
		table_imback(id, par, data, alldata, datasize) - started after data was loaded, you should call this function after new data are loaded
			id - table id
			par - array
				update: par[2] - sortcol, par[3] - sortdesc						
				change rows number:	par[2] - new rows number
				change from: par[2] - from row
			data - new data
			alldata - true if all data are loaded
			datasize - if not all data are loaded, here you pass real size (on server)
						
		*/
	
    	//var
    	var tables=[];	//all tables	  	
    	
    	function table_init(id, style, colsname, compare, navi, decor, checkboxes, width, datafunction, search){
    		
    		if (tables[id]!=undefined)
    			return false;
    		
    		var table = [];
    		
    		table[0] = id;
    		table[1] = style;
    		table[2] = colsname;
    		
    		table[3] = null;	//data
    		table[4] = undefined;
    		table[5] = undefined;
    		
    		if (decor == undefined)
    			decor = ""; 
    		table[6] = decor;
    		
    		if (checkboxes == undefined)
    			checkboxes = false; 
    		table[7] = checkboxes;
    		
    		table[8] = width;
    		
    		table[9] = compare;
    		
    		//if (localnavi == undefined)
    		//	localnavi = [false];
    		navi[0] = null;	//all data
    		navi[3] = null;	//data size
    		table[10] = navi;	//[1] - from, [2] - max on page
    		
    		table[11] = datafunction;
    		
    		table[12] = false;
    		
    		//table events
    		
    		//checkboxes
    		if (checkboxes)
    		{
    		    $("#"+id+"_selectall").on('click', function(){    	
    				table_selectAll(id);
    			}
    			)
    	
    			$("#"+id+"_unselect").on('click', function(){
    				table_unselect(id);
    			}
    			)
    		}
			
			//search
			if (search==undefined)
				search = true;
				
    		if (search)
    		{
				$("#"+id+"_search").on('click', function(){
    				table_search(id);
    			}
    			)
    	
    			$("#"+id+"_srem").on('click', function(){
    				table_srem(id);
    			}
    			)
    		}
    		
    		
    		//save
    		tables[id] = table;
    		
    	}
    	
    	
    	
    	function table_localNavi(id, event)
    	{   	
    		if (event.target.dataset.tableNavi != undefined)	//navi
			{
				var page = event.target.dataset.tableNavi;
				
				var from = tables[id][10][1];
				var rowsn = tables[id][10][2];
				var maxrow = tables[id][10][3]-1;
				var nfrom = 0;
				
				
				switch (page){
				
					case "first":
						if (from > 0)
							nfrom=0;
						else
							return;
							
						break;
						
					case "l":
						if (from > 0)
						{
							if (from-rowsn >= 0)
								nfrom = from - rowsn;
							else
								nfrom = 0;
						}
						else
							return;
							
						break;
						
						
					case "r":
						if (from+rowsn <= maxrow)
							nfrom = from + rowsn;
						else
							return;
							
						break;
										
					case "last":
						if (from < maxrow-rowsn+1 && maxrow-rowsn+1>=0)
							nfrom = maxrow-rowsn+1;
						else
							return;
							
						break;
							
    				
					default:					
						return;
				}
				
				
				if ( !tables[id][10][0] )	//server request
    			{
    				tables[id][11]([id,4,nfrom]);
    				return;
    			}
				
				table_setNavi(id, nfrom);
				table_update(id);
			}
		
		
		
			if (event.type=="change" && event.target.dataset.tableRowsn == "yes")	//navi
			{
				var rowsn = parseInt($("#"+id+"_rowsn").val());
				
				if ( !tables[id][10][0] )	//server request
    			{
    				tables[id][11]([id,3,rowsn]);
    				return;
    			}

				table_setNavi(id, null, rowsn);
				table_update(id);
			}	
    	}
    	
    	
    	function table_setNavi(id, from, rowsn, sort, desc){
    	
    		if (from!=null)
    			tables[id][10][1] = from;
    		
    		if (rowsn!=null)
    			tables[id][10][2] = rowsn;
    			
    		if (sort!=null)
    			tables[id][4] = sort;
    		
    		if (desc!=null)
    			tables[id][5] = desc;
    			
    	}
    	
    	
    	function table_set(id, data, datasize)
    	{
    	
    		if (tables[id]==undefined)
    			return false;
    			
    		tables[id][3] = data;
    		
    		if (datasize == undefined)	//
    		{
    		
    			tables[id][10][0] = true;	//all data
    			tables[id][10][3] = tables[id][3].length;
    		}
    		else
    		{
    			tables[id][10][0] = false;	//not all data
    			tables[id][10][3] = datasize;	
    		}
    	}
    	
    	function table_remove(id)
    	{
    		if (tables[id]==undefined)
    			return false;
    			
    		tables[id][3]=[];
    		tables[id][10][3] = 0;
    	}
    	
    	
    	
    	function table_td(c, width)
    	{	
    		if (width!=undefined)
    			return "<td width=\""+width+"\">"+c+"</td>\n";
    		else
    			return "<td>"+c+"</td>\n";
    	}
    	
    	function table_th(c, width)
    	{
    		if (width!=undefined)
    			return "<th width=\""+width+"\">"+c+"</th>\n";
    		else
    			return "<th>"+c+"</th>\n";
    	}
    	
    	function table_button(id, label, data, navi)
    	{
    		if (navi)
    			return "<input data-table-navi=\""+data+"\" type=\"button\" class=\"btn btn-small "+id+"_navi\" value=\""+label+"\">";
    		else
    			return "<input data-table-navi=\""+data+"\" type=\"button\" class=\"btn btn-small disabled\" value=\""+label+"\">";
    	}
    	
    	
    	
    	function table_update(id){
    	
    		if (tables[id]==undefined)
    			return false;
    		
    		
    		if (tables[id][3]==undefined)	//no data
    		{
    			tables[id][11]([id,1]);
    			return;
    		}

    			
    		var html;
    		var value, decor;
    		
    		html = "<table class=\"table "+tables[id][1]+"\">\n";
    		
    		//head
    		html+= "<thead>\n<tr>\n";
    		
    		for (i=0; i<tables[id][2].length; i++)
    			if (tables[id][10][0])	//local navi
    				html+= table_th("<a href=\"javascript:table_sort('"+id+"',"+i+")\">"+tables[id][2][i]+"</a>", tables[id][8][i]);
    			else			
    				html+= table_th("<a href=\"javascript:table_sort('"+id+"',"+i+")\">"+tables[id][2][i]+"</a>", tables[id][8][i]);
    				
    			
    		html+= "</tr>\n</thead>\n";
    		
    		
    		//body
    		html+= "<tbody>\n";
    		
    		if (tables[id][10][0])	//local navi
    		{
    			var from = tables[id][10][1];
    			var rowsn = tables[id][10][2];
    			
    			if (from+rowsn >= tables[id][3].length)
    				rowsn = tables[id][3].length - from;
    		}
    		else
    		{
    			var from = 0;
    			var rowsn = tables[id][3].length;
    		}
    		
    		
    		for (i = from; i<from+rowsn; i++){

    			html+= "<tr>\n";		
    			
    			for (j=0; j<tables[id][2].length; j++){
    				   				
    				//data
    				if (tables[id][6][j]!="")	//decor defined
    				{
    					decor = tables[id][6][j];
    					
    					if (typeof(decor) == "function")
    						decor = decor( tables[id][3][i][j] );
    					
    					decor = decor.replace("<data>", tables[id][3][i][j]);
    					decor = decor.replace("<table>", tables[id][0]);
    					decor = decor.replace("<row>", i);
    					
    					value = decor;
    				} 				
    				else if (j==0 && tables[id][7]) //checkbox
    					value = "<input type='checkbox' class='"+id+"_check' data-row='"+i+"' "+tables[id][3][i][j]+">";
    				else
    					value = tables[id][3][i][j];
    				
    				html+= table_td(value);
    				
    			}
    			
    			html+= "</tr>\n";   			
    			
    		}
    		
    	
    		
    		html+= "</tbody>\n";
    		html += "</table>\n";
    		
    		
    		$("#"+tables[id][0]).html(html);
    		colog("Table: "+html);
    		
    		//navi
    			
    		html = table_button(id, "&laquo;", "first", true);
    		html+= table_button(id, "&lsaquo;", "l", true);   
    		if (tables[id][10][3]>0)		
    			html+= table_button(id, ""+(tables[id][10][1]+1)+" : "+tables[id][10][3]+"", "na"); 		
    		html+= table_button(id, "&rsaquo;", "r", true);
    		html+= table_button(id, "&raquo;", "last", true); 		

    		
    		$("#"+tables[id][0]+"_navi").html(html);
    		
    		
    		//event
    		$("."+id+"_navi").unbind('change');
    		$("."+id+"_navi").on('change', function(event){
    			table_localNavi(id, event);
    		}
    		)
    		
    		$("."+id+"_navi").unbind('click');
    		$("."+id+"_navi").on('click', function(event){
    			table_localNavi(id, event);
    		}
    		)
    		
    		$("."+id+"_check").on('change', function(event){
    			table_check(id, event);
    		}
    		)
    	
    	}
    	
    	
    	function table_sort(id, n, desc)
    	{
    		if (tables[id]==undefined)	//table not found
    			return false;

    		
    		var i, j, value, co, tmp, change;
    		
    		//column
    		if (n==undefined)
    			n=0;	//column 0 by defaultChecked   		
    		
    		//desc
    		if (desc==undefined)
    		{	
    			if (tables[id][4] == undefined)	//not sorted
    				desc = false;
    			else
    			{
    				if (n == tables[id][4])	//same column
    					desc = !tables[id][5];	//change desc
    				else	//dif column
    					desc = false;
    			}   		
    		}
    		
    		if (!tables[id][10][0] || tables[id][3]==undefined)	//no data or server request
    		{
    			tables[id][11]([id, 2, n, desc]);
    			return;
    		}
    		
    		
    		tables[id][4]=n;
    		tables[id][5]=desc;
    		
    		
    		co = tables[id][3].length;
    		
    		for (i=0; i<co; i++){
    			
    			value = tables[id][3][ i ][n];

    			for (j=i+1; j<co; j++){
    				
    				change = false;
    				
    				if ( tables[id][9]!=null && typeof(tables[id][9][n])=="function" )
    					change = tables[id][9][n](value, tables[id][3][ j ][n], desc);
    				else
    					change = ( (!desc && tables[id][3][ j ][n] < value) || (desc && tables[id][3][ j ][n] > value) );
    					
    				if (change){
    					
    					tmp = tables[id][3][ i ];
    					tables[id][3][i] = tables[id][3][ j ];
    					tables[id][3][j] = tmp;
    					
    					value = tables[id][3][ i ][n]; 
    				}
    			}
    		}
	
    		//change desc
    		
    		
    		//from start
    		table_setNavi(id, 0);
    		
    		
    		table_update(id);
    	}

		
		
		function table_imback(id, par, data, alldata, datasize){
		
			//setting data
		
			if (alldata){	//all data loaded
					
				//set new data
    			table_set(id, data);
    	
			}
			else{

				table_set(id, data, datasize );

			}		

    	
    		//back procedure
    	
    	
    		switch (par[1]){
		
			case 1:	//table update
				table_update(id);
				
				break;
			
			case 2:	//sort
				sortcol = par[2];
				sortdesc = par[3];
				
				if (alldata)
					table_sort(id, sortcol, sortdesc);
				else
				{
					table_setNavi(id,null,null,sortcol,sortdesc);
					table_update(id);
				}
					
				break;
			
			case 3: //change rows
				rowsn = par[2];
				
				table_setNavi(id,null,rowsn);
				table_update(id);
				
				break;
				
			case 4:	//change index
				from = par[2];
				
				table_setNavi(id,from);
				table_update(id);
				
				
				break;
			}
    	
		}


		//events
		
		function table_search(id)
    	{
    		table_setNavi(id, 0);
    		tables[id][11]([id,1]);
    	}
    	
    	function table_srem(id)
    	{
    		$('#'+id+"_svalue").val("");
    	}
    	
    	function table_selectAll(id)
    	{
    		if (tables[id]==undefined)
    			return false;
    			
    		for (i in tables[id][3]){
    		
    			tables[id][3][i][0] = "checked";
    			
    		}
    		
    		tables[id][12] = true;
    		
    		table_update(id);
    	}
    	
    	function table_unselect(id){
    	
    		if (tables[id]==undefined)
    			return false;
    			
    		for (i in tables[id][3]){
    		
    			tables[id][3][i][0] = "";
    			
    		}
    		
    		tables[id][12] = false;
    		
    		table_update(id);
    	}
    	
    	function table_check(id, event){
    	
    		if (tables[id]==undefined)
    			return false;
    		
    		if (!event.target.checked)
    			tables[id][12] = false;
    		
    	}
    	
    	function table_encode(data){
    	
			return jQuery('<div />').text(data).html();
		}
    	
    	//end
    	