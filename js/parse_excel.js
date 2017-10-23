
// true: readAsBinaryString ; false: readAsArrayBuffer
var rABS = false;
var i, j, k, file, data, content, headers_str;
var counter = 0, filter_count = 0, col_count=2;
var headers = [];
var headerID = [];
function upload()
{	
	file = $("#file_upload")[0].files[0];
	var reader = new FileReader();
	var sheet_str = '<option value="" selected disabled>表單</option>';

	reader.onload = function(event)
	{
		data = event.target.result;
		if(!rABS) data = new Uint8Array(data);
		var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array', bookSheets: true});

		/* do sth with workbook*/
		// console.log(workbook.SheetNames);
		
		for(i=0; i<workbook.SheetNames.length; i++)
		{
			sheet_str += '<option value=\''+workbook.SheetNames[i]+'\'>';
			sheet_str += workbook.SheetNames[i];
			sheet_str += '</option>';
		}
		
		$("#sheet_name").html('');
		$("#sheet_name").append(sheet_str);
		$("#div_sheet").show();
		$("#div_title").hide();
		// var first_sheet_name = workbook.SheetNames[0];
		// var address_of_cell = 'A1';

		/* Get worksheet */
		// var worksheet = workbook.Sheets[first_sheet_name];

		/* Find desired cell */
		// var desired_cell = worksheet[address_of_cell];

		/* Get the value */
		// var desired_value = (desired_cell ? desired_cell.v : undefined);

		// console.log(desired_value);
	};

	if(rABS) reader.readAsBinaryString(file);
	else reader.readAsArrayBuffer(file);

	// console.log(workbook);
}

function parse_content(input)
{
	var worksheet, desired_cell, desired_value;

	var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});	
	var first_sheet_name = input;
	headers_str = '<option value="" selected disabled>欄位</option>' ;
	
	headers = [];
	$('#t1').html('');
	$('#place_name').html('');
	$('#person_name').html('');

	/* Get worksheet */
	worksheet = workbook.Sheets[first_sheet_name];

	content = XLSX.utils.sheet_to_json(worksheet, {header:1, defval:''});
	console.log(content);
	for(i=0; i<content[0].length;i++)
	{
		headers.push(content[0][i]);
	}
	

	for(i=0; i<headers.length;i++)
	{
		headers_str += '<option value = \''+headers[i]+'\' id = \''+i+'\'>';
		headers_str += headers[i];
		headers_str += '</option>';
	}

	// $('#title_name').html('');
	// $("#title_name").append(headers_str);
	$('#t1').html('');
	$("#t1").append(headers_str);

	$('#place_name').html('');
	$("#place_name").append(headers_str);

	$('#person_name').html('');
	$("#person_name").append(headers_str);
	$("#div_title").show();

	
	$('#content1').html('');
	
	$('#place_content').html('');
	
	$('#person_content').html('');
	/* Get the range */
	// var C, range = XLSX.utils.decode_range(worksheet['!ref']);
	// console.log(range);		
}

function add_col()
{
	var str = '請選擇欄位'+col_count+': <select id="t'+col_count+'" onchange="get_data(this.value,this.id,'+col_count+')">';
	str += headers_str;
	str += '</select><br><br>';
	
	$('#add_col').before(str);
	col_count++;
}

function get_data(input, id, mode)
{
	var doc = [];
	var doc_str = '';
	var selected_id = $('#'+id).children(":selected").attr("id");

	for(i=0; i<headers.length;i++)
	{		
		if(headers[i] == input)
		{			
			for(j=1; j<content.length; j++)
			{
				if(doc.indexOf(content[j][i]) != -1)
				{

				}
				if(content[j][i] != '' && content[j][i] != undefined)
				{
					// doc_str += '<input type = "checkbox" value = "'+content[j][i]+'">'+content[j][i]+'<br>';
					doc.push(content[j][i]);
				}
			}
			headerID.push(i);
			break;
		}
	}

	var result = {};
	for(i=0; i<doc.length; i++)
	{		
		if(!result[doc[i]])
			result[doc[i]] = 0;
		++result[doc[i]];
	}
	
	i = 0;	
	var result_arr = [];	
	var result_str = '';
	for(key in result)
	{
		result_str =  {'id':i, 'term':key, 'freq': result[key]};
		result_arr.push(result_str);
		i++;		
	}
	;
	result_arr = result_arr.sort(function(a, b){ return a.freq > b.freq ? -1 : 1;});    
	
	for(i=0; i<result_arr.length; i++)
	{
		doc_str += '<input type = "checkbox" name="type'+mode+'" value = "'+result_arr[i].term+'" id = "'+selected_id+'">'+result_arr[i].term+' ('+result_arr[i].freq+')<br>';		
	}
	// for checkbox condition
	doc_str += '<div id="area'+mode+'"><br>';
	doc_str += '<button class="btn btn-danger" onclick = "add_condition_show('+mode+')">增加條件</button>';

	doc_str += '<div id="area_div'+mode+'" style="display: none">標題:<input type="text" name="" id="group_option'+mode+'"><br>'+
			   '<button onclick="add_condition_exec('+mode+')"">確認</button></div>';			   

	if(mode == 1)
	{
		$('#content1').html('');
		$("#content1").append(doc_str);
	}
	else if(mode == 2)
	{
		$('#place_content').html('');
		$("#place_content").append(doc_str);		
	}
	else if(mode == 3)
	{
		$('#person_content').html('');
		$("#person_content").append(doc_str);		
	}
	$("#data_content").show();
	
	// console.log(doc);	
}

function add_condition_show(mode)
{
	$("#area_div"+mode).toggle();
}
function add_condition_exec(mode)
{
	check = ($('input:checkbox:checked[name="type'+mode+'"]').map(function() {
			$(this).prop('checked', false);
			return $(this).val(); }).get());
	var title = $('#group_option'+mode).val();

	var str = '<input type="checkbox" name="type'+mode+'" value="'+check+'">'+title+'<span id="condition_arrow'+counter+'" onclick="condition_show_detail('+counter+')" class="glyphicon glyphicon-chevron-right"></span><br>';
	
	str += '<ul id="condition_detail_'+counter+'" style="display:none">';
	for(i=0; i<check.length; i++)
	{	
		check_sp = check[i].split(',');
		for(j=0; j<check_sp.length; j++)
			str += '<li>'+check_sp[j]+'</li>';
	}
	str += '</ul>';
	
	counter++;
	$("#area"+mode).before(str);
	$('#area_div'+mode).toggle();
}
function condition_show_detail(id)
{
	$("#condition_arrow"+id).toggleClass('glyphicon-chevron-right glyphicon-chevron-down');
	$("#condition_detail_"+id).toggle();
}
function do_filter()
{
	var type1 = [];
	var type2 = [];
	var type3 = [];
	var type1_id, type2_id, type3_id;
	$("input[name='type1']:checked").each(function(){            
        type1.push($(this).val());
        type1_id = $(this).attr("id");    
    });

    $("input[name='type2']:checked").each(function(){            
        type2.push($(this).val());
        type2_id = $(this).attr("id");
    });

    $("input[name='type3']:checked").each(function(){            
        type3.push($(this).val());
        type3_id = $(this).attr("id");
    });

    // type1 = type1[0].split(',');

    // console.log(type1.length);
    
    
    var result_data = [];
    var type_all = [];
    var flag = 0;
    for(i=0; i<type1.length; i++)
    {    	
    	type_tmp = type1[i].split(',');
    	for(j=0; j<type_tmp.length; j++)
    	{    		
    		// judge if exists or not
    		for(k=0; k<type_all.length; k++)
    		{
    			if(type_all[k] == type_tmp[j])
    			{
    				flag = 1;
    				break;
    			}
    		}
    		if(flag == 0) type_all.push(type_tmp[j]);
    	}
    }    
    console.log(type_all);
    // console.log(content);

    for(j=0; j<content.length;j++)
    {    	
    	for(i=0; i<type_all.length; i++)
    	{
	    	for(k=0; k<headerID.length; k++)
	    	{
		    	if(type_all[i] == content[j][k])
		    	{
		    		// console.log(content[j]);	    			
		    		result_data.push(content[j]);
		    	}
	    	}
    	}
    	
    }
    console.log(result_data);
    show_data(result_data, filter_count);
    filter_count++;
    // do grouping
    
}

function show_data(data, index)
{
	$('#result_content').remove();
	var str = '<div class="col-lg-4" id="result_content">結果:<br>';
	
	for(var i=0; i<data.length; i++)
	{
		str += data[i]+'<br>';
	}

	str += '</div>';

	$('#data_content').append(str);
}