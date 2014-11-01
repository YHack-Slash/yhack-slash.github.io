import java.awt.Color;
import java.awt.image.*;
import java.io.*;
import javax.imageio.*;
class Img2Ascii {

   BufferedImage img;
   double pixval;
   PrintWriter prntwrt;
   FileWriter filewrt;
   final String characters = "œæ©¢øðþãêõûµ±¤ç¿ª®¦¡«‹—¬-“”„°¯¨…•ˆ‘’‚'()   ";
   final int numQuant = characters.length() - 1;
   final double incr = 270.0/numQuant;
   double totDens = 0.;
   
   public Img2Ascii() {
      try {
         prntwrt = new PrintWriter(filewrt = new FileWriter("asciiart.txt",true));
      } 
      catch (IOException ex) {
      }
   }
   
   public void convertToAscii(String imgname) {
      try {
         img = ImageIO.read(new File(imgname));
      } 
      catch (IOException e) {
      }
   
   
      for (int i = 0; i <= img.getHeight(); i+=10)
      {
         for (int j = 0; j <= img.getWidth(); j+=10)
         {
            print(strChar(findAverage(img, j, i)));
         }
         try {
            prntwrt.println("");
            prntwrt.flush();
            filewrt.flush();
         } 
         catch (Exception ex) {
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
}