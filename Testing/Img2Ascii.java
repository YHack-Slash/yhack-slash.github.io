import java.awt.Color;
import java.awt.image.*;
import java.io.*;
import javax.imageio.*;


class Img2Ascii {


    BufferedImage img;
    double pixval;
    PrintWriter prntwrt;
    FileWriter filewrt;
    final String characters = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
    final int numQuant = characters.length() - 1;
    final double incr = 270.0/numQuant;
    


    public Img2Ascii() {
        try {
            prntwrt = new PrintWriter(filewrt = new FileWriter("asciiart.txt",true));
        } catch (IOException ex) {
        }
    }
    
    public void convertToAscii(String imgname) {
        try {
            img = ImageIO.read(new File(imgname));
        } catch (IOException e) {
        }


        for (int i = 10; i <= img.getHeight(); i+=10)
        {
            for (int j = 10; j <= img.getWidth(); j+=10)
            {
                Color pixcol = new Color(img.getRGB(j, i));
                findAverage(img, j, i)
                pixval = (((pixcol.getRed() * 0.30) + (pixcol.getBlue() * 0.59) + (pixcol.getGreen() * 0.11)));
                print(strChar(pixval));
            }
            try {
                prntwrt.println("");
                prntwrt.flush();
                filewrt.flush();
            } catch (Exception ex) {
            }
        }
    }
    
    public int findAverage(BufferedImage img, int x, int y) {
      for (


    public String strChar(double g)
    {
        int substr = numQuant - (int)Math.ceil(g/incr);
        return characters.substring(substr, substr + 1);
    }


    public void print(String str)
    {
        try {
            prntwrt.print(str);
            prntwrt.flush();
            filewrt.flush();
        } catch (Exception ex) {
        }
    }
    
    public static void main(String[] args) {
        Img2Ascii obj=new Img2Ascii();
        obj.convertToAscii("icon_smile2.png");
    }
}