import java.awt.Color;
import java.awt.image.*;
import java.io.*;
import javax.imageio.*;

const var characters = "œæ©¢øðþãêõûµ±¤ç¿ª®¦¡«‹—¬-“”„°¯¨…•ˆ‘’‚'()   ";
const var numQuant = characters.length() - 1;
const var incr = 270.0/numQuant;
var totDens = 0.;
var pixval;
var img = ;//TODO: get webcam image here
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
context.drawImage(img, 0, 0);
var myData = context.getImageData(0, 0, img.width, img.height);

var ascii = function(img) {
   String ascii = '';
   for (i = 0; i <= canvas.height; i+=10) {
      for (j = 0; j <= canvas.width; j+=10) {
         ascii += strChar(findAverage(img, j, i));
      }
   }
   return ascii;
}

var average = function(img, x, y) {
   var total = 0.;
   for (i = x; i < x + 10 && img.getWidth(); i++) {
      for (j = y; j < y + 10 && j < img.getHeight()) {
         var pixcol = new 
      }
   }
}
public double findAverage(BufferedImage img, int x, int y) {
   double total = 0.;
   for (int i = x; i < x + 10 && i < img.getWidth(); i++) {
      for (int j = y; j < y + 10 && j < img.getHeight(); j++) {
         Color pixcol = new Color(img.getRGB(i, j));
         total += (((pixcol.getRed() * 0.33) + (pixcol.getBlue() * 0.33) + (pixcol.getGreen() * 0.33)));
      }
   }
   return total / 100;
}

public String strChar(double g)
{
   int substr = (int)Math.floor(g/incr);
   return characters.substring(substr, substr + 1);
}


public void print(String str)
{
   try {
      prntwrt.print(str);
      prntwrt.flush();
      filewrt.flush();
   } 
   catch (Exception ex) {
   }
}

public static void main(String[] args) {
   Img2Ascii obj=new Img2Ascii();
   obj.convertToAscii("Photo on 11-1-14 at 4.07 PM.jpg");
}
