var Ndata={},i,rdata,k=0;
var baseurl = "http://www.shopster-shopsterr.rhcloud.com";
var token;

function getstore(){
  return localStorage.getItem('requiredkey');
}

function deleteProduct(){
  var p = window.prompt('Are you sure ..? (yes/no)');
  if(p == 'yes')
  {
   $.ajax({
      type: 'DELETE',
      url:baseurl+'/api/products/'+producthash+'/',
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Token "+token);
      },
      success: function(data) {
          console.log("Hurray");    
          window.alert("Product deleted Successfully");
      }
    }); 
  }
}

function updateProduct()
{ var d = { "name" : document.getElementById("nameUpdate").value,
          "price" : document.getElementById("priceUpdate").value,
          "quantity" : document.getElementById("quantityUpdate").value,
          "category_id" : document.getElementById("categoryUpdate").value }
  producthash = localStorage.setItem('upkey');

  $.ajax({
      type: 'PUT',
      url:baseurl+'/api/products/'+producthash+'/',
      data: JSON.stringify(d),
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', "Token "+token);
      },
      success: function(data) {
          console.log("Hurray");
          console.log(data);       

          window.alert("Product updated> See the updation in admin panel");
          //window.location = "file:///C:/users/sam/desktop/Major/admin.html";   
      }
    }); 
}

function addProduct(){  
  console.log("inside generateqr");
  var d = { "name" : document.getElementById("nameAdd").value,
          "price" : document.getElementById("priceAdd").value,
          "quantity" : document.getElementById("quantityAdd").value,
          "category_id" : document.getElementById("categoryAdd").value }
  var hash ="";
  $.ajax({
      type: 'POST',
      url:baseurl+'/api/products/',
      data: JSON.stringify(d),
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', "Token "+token);
      },
      success: function(data) {
          console.log("Hurray");
          console.log(data.hash_token);
          generateProductQR(data.hash_token,data.name);
          $('qrmodal').model();
      }
    }); 

}

function fetchall(token){ 
   console.log('inside fetchall');
  $.ajax({
        type: 'GET',
        url:baseurl+'/api/products/',
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization',"Token "+token);
        },
        success: function(data) {
            console.log("Hurray");
            console.log(data);
            Ndata = data;
            plotgraph(data);
            prerender();
        }
   });
}

var hash = "",Name;

function generateProductQR(hash,Name){
  console.log("inside generate QR");
    var remP = document.getElementById("graph");
    var Cqr = document.getElementById('qrCode');
    remP.removeChild(Cqr);

    var div1 = document.createElement('div');
    div1.id = "qrCode";
    var h1 = document.createElement("h2");
    h1.innerHTML = "Product Name:"+Name;
    div1.appendChild(h1);
    remP.appendChild(div1);
   var q = new QRCode(document.getElementById("qrCode"), hash);
      }

function render(rdata){
  console.log("inside render");
  var table = document.getElementById("t01");
	 var newtr = document.createElement("tr");
   var td0 = document.createElement("td");
   td0.innerHTML = k;
   var td1 = document.createElement("td");
   td1.innerHTML = rdata.name;
   var td2 = document.createElement("td");
   td2.innerHTML = rdata.pid;
   var td3 = document.createElement("td");
   td3.innerHTML = rdata.quantity;
   var td4 = document.createElement("td");
   td4.innerHTML = rdata.price;
   var td5 = document.createElement("td");
    var button1 = document.createElement('button');
    button1.className = "btn btn-default btn-sm";
    button1.addEventListener('click',function(){  generateProductQR(rdata.hash_token, rdata.name); $("#qrmodal").modal(); });
     var span1 = document.createElement('span');
     span1.className = "glyphicon glyphicon-qrcode";
     button1.appendChild(span1);
    button1.innerHTML = "QRCode";

    var button2 = document.createElement('button');
    button2.className = "btn btn-default btn-sm";
    button1.addEventListener('click',function(){ localStorage.removeItem('upkey'); localStorage.setItem('upkey',rdata.hash_token); $("#updatemodal").modal(); });
     var span2 = document.createElement('span');
     span2.className = "glyphicon glyphicon-edit";
     button2.appendChild(span2);
     button2.innerHTML = "Edit";

    var button3 = document.createElement('button');
    button3.className = "btn btn-default btn-sm";
    button1.addEventListener('click',function(){ deleteProduct(rdata.hash_token); });
     var span3 = document.createElement('span');
     span3.className = "glyphicon glyphicon-trash";
     button3.appendChild(span3);
     button3.innerHTML = "Trash";

    td5.appendChild(button1);
    td5.appendChild(button2);
    td5.appendChild(button3);

   newtr.appendChild(td0);
   newtr.appendChild(td1);
   newtr.appendChild(td2);
   newtr.appendChild(td3);
   newtr.appendChild(td4);
   newtr.appendChild(td5);
   table.appendChild(newtr);
   k = K+1;
}

function prerender(){
  main = document.getElementById('t01');
  rems = document.getElementsByTagName('tr');
  for(i=1;i<rems.length-1;i++)
  {
    main.removeChild(rems[i]);
  }

  for(i=0;i<Ndata.length;i++){
     render(Ndata[i]); }
  //renderGraph();   
}

function plotgraph(dat){
  var xEl=[];
  var yEl=[];
  for(i=0;i<dat.length;i++)
  {
    xEl.push(dat[i].name);
    yEl.push(dat[i].quantity);
  }
  var data = [
  {
    x: xEl,
    y: yEl,
    mode: 'markers+lines',
    type: 'bar'
  }
  ];
  TESTER = document.getElementById('mygraph');
  Plotly.plot( TESTER, data);
}

function start(){
  token = getstore();
	setInterval(fetchall(token),60000);
  plotgraph();
}

window.onload = start();