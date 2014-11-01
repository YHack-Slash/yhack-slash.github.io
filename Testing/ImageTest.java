import java.applet.Applet;
import java.awt.*;
import java.awt.image.*;
import java.io.*;
import java.net.URL;
import javax.imageio.*;
 
public class ImageTest  {

   private static BufferedImage img;
   private static final String characters = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
   private static final int numQuant = characters.length();

   public static void main(String[] args) throws IOException{
      img = ImageIO.read(new File("image.jpg"));
      String output = convertToAscii(img);
   }
   
   public static String convertToAscii(BufferedImage img) {
      int width = img.getWidth();
      int height = img.getHeight();
      for (int w = 10; w <= width; w += 10) {
         for (int h = 10; h <= width; h += 10) {
            double dens = findDensity(img, w, h);
            int ans = numQuant - ((int) Math.ceil(dens * numQuant/100));
            System.out.print(characters.substring(ans, ans + 1));
         }
         System.out.println();
      }
      return "";
   }
   
   public static double findDensity(BufferedImage img, int w, int h) {
      double overall = 0.0;
      for (int i = w; i < w + 10; i++) {
         for (int j = h; j < h + 10; j++) {
            if (i <= img.getWidth() && h <= img.getHeight()) {
               double average = 0.0;
               average += 255 - img.getRGB(i, j);
               average /= 3.0;
               overall += average;
            }
         }
      }
      overall /= 100;
      return overall;
   }
}