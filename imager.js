<<<<<<< HEAD
const var characters = "@80GCLft1i;:,.";
const var numQuant = characters.length() - 1;
const var incr = 255.0/numQuant;
var totDens = 0.;
var pixval;
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
context.drawImage(img, 0, 0);

var ascii = function(img) { //TODO: send this ascii to the other person
   var ascii = "";
   var avg;
   var substr;
   for (var i = 0; i <= img.height; i+=10) {
      for (var j = 0; j <= img.width; j+=10) {
         avg = average(img, j, i);
         substr = Math.floor(avg/incr);
         ascii += characters.substring(substr, substr + 1);
      }
   }
   return ascii;
}

var average = function(img, x, y) {
   var total = 0.;
   var xWidth = 10;
   var yHeight = 10;
   if (x + 10 >= img.width)
      xWidth = img.width - x;
   if (y + 10 >= img.height)
      yHeight = img.height - y;
   var data = context.getImageData(x, y, xWidth, yHeight);
   for (var i = 0, n = data.length; i < n; i += 4)
      total += ((data[i] * 0.33) + (data[i + 1] * 0.33) + (data[i + 2] * 0.33)));
   return total / 100;
}
=======
const var characters = "œæ©¢øðþãêõûµ±¤ç¿ª®¦¡«‹—¬-“”„°¯¨…•ˆ‘’‚'()   ";
const var numQuant = characters.length() - 1;
const var incr = 270.0/numQuant;
var totDens = 0.;
var pixval;
var img = ;//TODO: get webcam image here
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
context.drawImage(img, 0, 0);

var ascii = function(img) { //TODO: send this ascii to the other person
    var ascii = "";
    var avg;
    var substr;
    for (var i = 0; i <= img.height; i+=10) {
        for (var j = 0; j <= img.width; j+=10) {
            avg = findAverage(img, j, i);
            substr = Math.floor(avg/incr);
            ascii += characters.substring(substr, substr + 1);
        }
    }
    return ascii;
}

var average = function(img, x, y) {
    var total = 0.;
    var xWidth = 10;
    var yHeight = 10;
    if (x + 10 >= img.width)
        xWidth = img.width - x;
    if (y + 10 >= img.height)
        yHeight = img.height - y;
    var data = context.getImageData(x, y, xWidth, yHeight);
    for (var i = 0, n = data.length; i < n; i += 4)
        total += ((data[i] * 0.33) + (data[i + 1] * 0.33) + (data[i + 2] * 0.33)));
    return total / 100;
}
>>>>>>> FETCH_HEAD
