var w,a=23,b=0,main,updata = {};
var data,i,renderdata={};
var baseurl = "192.168.0.101:8000";
var token;

function processRequest(updata, el){
  var d = {"order_id": updata.order_id,
        "status": "D",
        "products":[]}
  for(i=0;i<updata.products.length;i++)
  {
    var a = {
        "order_item_id": updata.products[i].order_item_id,
        "price": updata.products[i].price,
        "name": updata.products[i].name,
        "quantity": updata.products[i].quantity,
        "status": updata.products[i].status,
        "order_id": updata.products[i].order_id,
        "product_id": updata.products[i].product_id 
       }
    d.products.push(a);
  }
  console.log(d);
  $.ajax({
      type: 'PUT',
      data : JSON.stringify(d),
      url:'http://'+baseurl+'/api/orders/1/',
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization',"Token "+token);
      },
      success: function(data) {
          console.log(data);
          el.innerHTML = "<strong>Order placed for processing - <span class='glyphicon glyphicon-ok-circle'></span></strong>";
          el.disabled = true;
      }
 });
}

var k=0;
function render(renderdata,main){
  k = k+1;
   var tr1 = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.innerHTML = k;
    var td2 = document.createElement('td');
    td2.innerHTML = "<strong>Name :</strong>"+renderdata.ordered_by+"<br><strong>Address :</strong>"+renderdata.add+"<br><strong>Ph. :</strong>"+renderdata.phone;
    var td3 = document.createElement('td');
    td3.innerHTML = "<strong>Order_id :</strong>"+renderdata.order_id+"<br><strong>List :</strong>"+renderdata.product;
    var td4 = document.createElement('td');
     var b1 = document.createElement('button');
     b1.className = "btn btn-default btn-sm";
     b1.innerHTML = "Process Order <span class='glyphicon glyphicon-circle-arrow-right'></span>";
     b1.onclick = function(){ processRequest(renderdata,this); };
    td4.appendChild(b1);

   tr1.appendChild(td1);
   tr1.appendChild(td2);
   tr1.appendChild(td3);
   tr1.appendChild(td4);
   main.appendChild(tr1);
}

function preWaiting(){
  main = document.getElementById('t01');
  rems = document.getElementsByTagName('tr');
  for(i=1;i<rems.length-1;i++)
  {
    main.removeChild(rems[i]);
  }
}

function preProcessing(){
  main = document.getElementById('t02');
  rems = document.getElementsByTagName('tr');
  for(i=1;i<rems.length-1;i++)
  {
    main.removeChild(rems[i]);
  }
}

function preProcessed(){
  main = document.getElementById('t03');
  rems = document.getElementsByTagName('tr');
  for(i=1;i<rems.length-1;i++)
  {
    main.removeChild(rems[i]);
  }
}

function fetchWaiting(){
  preWaiting();
	$.ajax({
      type: 'GET',
      url:'http://'+baseurl+'/api/orders/?status=O',
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization',"Token "+token);
      },
      success: function(data) {
          console.log("Hurray");
          console.log(data);
          var par = document.getElementById("t01");
          for(i=0;i<data.length;i++)
          {console.log("inside loop");
          	render(data[i],par);
          }
      }
 });
}

function fetchProcessing(){
  preProcessing();
	$.ajax({
      type: 'GET',
      url:'http://'+baseurl+'/api/orders/?status=T',
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization',"Token "+token);
      },
      success: function(data) {
          console.log("Hurray");
          console.log(data);
          var par = document.getElementById("t02");
          for(i=0;i<data.length;i++)
          {console.log("inside loop");
          	render(data[i],par);
          }
      }
 });
}

function fetchProcessed(){
  preProcessed();
	$.ajax({
      type: 'GET',
      url:'http://'+baseurl+'/api/orders/?status=D',
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization',"Token "+token);
      },
      success: function(data) {
          console.log("Hurray");
          console.log(data);
          var par = document.getElementById('t03');
          for(i=0;i<data.length;i++)
          {console.log("inside loop");
          	render(data[i],par);
          }
      }
 });
}

function start(){
  token = getstore();
 	setInterval(fetchWaiting(token),60000);
 	setInterval(fetchProcessed(token),60000);
 	setInterval(fetchProcessed(token),60000);
 }