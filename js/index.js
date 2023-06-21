$getJSON('data.json', function(data) {
    var output = "<ul";
    for (var i in data.products) {
        output += "<li>" + data.products[i].name + "</li>"
        output += "<li>" + data.products[i].price + "</li>"
        output += "<li>" + data.products[i].category + "</li>"
    }
    output += "</ul>";
    document.getElementById('categories').innerHTML = output;
});
