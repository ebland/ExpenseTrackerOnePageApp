	
	/*
		Boxes/sections - Change -/+ icon while collapse
		Version: 1.0
		Author: Thomas John (http://thomasjohn.eu), 2012
		This software is part od Muffin Table.
				
		Vars:
		
		sections
		
		
		Functions / interface: 
	
		expandableBoxes(Box_content) - register expandable box
			par - array of ids (box_<id>_expand)
			
		expandableSections(Section_content) - register expandable section
			par - array of ids (section_<id>_expand)
	*/
	
	var sections = new Array();
	
	function expandableSpaces(Box_content, idname) {
		
		for (var name in Box_content)
		{
		
			//Events
	
			$('#'+idname+'_'+Box_content[name]+'_content').on('hide', { id: Box_content[name], idname: idname }, function (event) {
			
			var data = event.data;
			
			$('#'+data.idname+'_'+data.id+'_expand').removeClass('icon-minus-sign').addClass('icon-plus-sign');
			
			event.stopPropagation();
		
			});
	
			$('#'+idname+'_'+Box_content[name]+'_content').on('show', { id: Box_content[name], idname: idname }, function (event) {
			
			var data = event.data;
			
			$('#'+data.idname+'_'+data.id+'_expand').removeClass('icon-plus-sign').addClass('icon-minus-sign');
		
			event.stopPropagation();
			
			});
	
		}
    }
    
    function expandableBoxes(Box_content) {
	
		expandableSpaces(Box_content, "box");
    }
    
    function expandableSections(Section_content) {
		
		for (var id in Section_content)
		{
			
			$('#section_'+Section_content[id]).on('click', { id: Section_content[id] }, function(event){
			
				var data = event.data;
			
				if ($('#section_'+data.id+'_content').css('display') == 'none')
				{			
					$('#section_'+data.id+'_content').show();				
					$('#section_'+data.id+'_expand').removeClass('icon-plus-sign').addClass('icon-minus-sign');
				}
				else
				{
					$('#section_'+data.id+'_content').hide();
					$('#section_'+data.id+'_expand').removeClass('icon-minus-sign').addClass('icon-plus-sign');
				}
			
			});
		}
    }
    
    
    //end
    