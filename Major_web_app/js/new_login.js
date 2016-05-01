var baseurl = "";
var token = "";

function store(k){
	if(typeof(Storage)!=="undefined"){
		localStorage.removeItem('requiredkey');
		localStorage.setItem("requiredkey",k);
	}
	else{
		alert("sorry your browser does not support some features needed for this web application ");
	}
}

function send()
{	console.log("inside send funciton");
	var id = document.getElementById("email").value;
	var pass = document.getElementById("password").value;
	var d = {
		"username": id,
		"password": pass
	};

	if(id!=""&pass!="")
	{	console.log('inside if statement....');
		var data = {'Id':id ,'Pass':pass}
		var req = new XMLHttpRequest();
		req.open('POST', baseurl+'/api/login/',true);
		req.setRequestHeader('Content-type', 'application/json');
		req.setRequestHeader("Authorisation",token);
		req.onreadystatechange = function(){
			if(req.readyState == 4 && req.status == 200)
			{	console.log('state change received');
				alert('Request Successfull :'+req.responseText)
				store(req.responseText.token);
				window.location = "/new_counter.html";
			}
			else{ console.log('request unsuccess'+req.responseText+','+req.status);}
		};
		req.send(JSON.stringify(data));
	}
	else
	{ alert("Please fill all the specified field"); }
}

