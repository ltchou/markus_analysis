function file_upload()
{
	$("#file_upload").click();
}

function upload()
{	
	var file = $("#file_upload")[0].files[0];
	var reader = new FileReader();
	reader.readAsText(file);
	// reader.onload = loadHandler;
	reader.onload = function(event)
	{
		var csv = event.target.result;
		// get csv content
		processCSV(csv);	
	}

}

function processCSV(csv)
{
	var allTextLines = csv.split(/\r\n|\n/);
    var result = [];
    var i, j;
    for (i=0; i<allTextLines.length; i++) 
    {
        var data = allTextLines[i].split(';');
        var arr = [];
        for (j=0; j<data.length; j++) 
        {
            arr.push(data[j]);
        }
        result.push(arr);
    }
    
    var tag_type, filename ;
    var overall = {};
    // filename term的位置需要處理
    var titles =  result[0][0].split(',');
    var split_result;
    var term_position, title_result, freq_position;

    for(j=0; j<titles.length;j++)
    {    	
    	title_result = titles[j].replace(/"/g,"");
    	if('Term' == title_result)
    	{    		
    		term_position = j;
    		// break;
    	}
    	else if ('Frequency' == title_result)
    	{
    		freq_position = j;
    		// break;
    	}
    	if(term_position != undefined && freq_position != undefined) break;
    }    
    // 先只取100
    for(i = 1; i< 100; i++)
    {    	    	   
    	// 0: category 1:corpus 2: 
    	split_result = result[i][0].split(',');
    	tag_type = split_result[0];
    	filename = split_result[2];    	    
    	overall[filename]= {};
    }
    var count = 0;
    // 
    for(i = 1; i< 1000; i++)
    {
    	split_result = result[i][0].split(',');
    	tag_type = split_result[0];
    	if(filename == split_result[2])
    	{
    		count++;
    	}
    	else
    	{
    		count = 0;
    	}
    	filename = split_result[2];
    	overall[filename][count] = {'tag_type': tag_type, 'term': split_result[term_position], 'freq':split_result[freq_position]};	
    	// overall[filename][tag_type][count++]= split_result[8];
    }
    
 	console.log(overall);
 	var PersonName = [];
 	var LocName
 	for(key in overall)
 	{
 		console.log(key);
 		for(i=0; i<overall[key].length;i++)
 		{

 		}
 	}
}

