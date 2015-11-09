/**
 * 
 */
package utils;

/**
 * @author hadoop
 *
 */
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader; 
import java.util.Vector;
  
 
public class TxtReader { 
  
    /**
     * ���ļ��ж�ȡ�ı�����, ��ȡʱʹ��ƽ̨Ĭ�ϱ�������ļ��е��ֽ�����
     * @param file Ŀ���ļ�
     * @return
     * @throws IOException
     */
    public static String loadStringFromFile(File file) throws IOException {
        return TxtReader.loadStringFromFile(file, System.getProperty("file.encoding"));
    } 
  
 
    /**
     * ���ļ��ж�ȡ�ı�����
    * @param file Ŀ���ļ�
     * @param encoding Ŀ���ļ����ı������ʽ
     * @return
     * @throws IOException
     */
    public static String loadStringFromFile(File file, String encoding) throws IOException {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
            StringBuilder builder = new StringBuilder();
            char[] chars = new char[4096];
 
            int length = 0;
 
            while (0 < (length = reader.read(chars))) {
 
                builder.append(chars, 0, length);
 
            }
 
            return builder.toString();
 
        } finally {
 
            try {
 
                if (reader != null) reader.close();
 
            } catch (IOException e) {
 
                throw new RuntimeException(e);
 
            }
 
        }
    } 
    
    public static Vector<String> loadVectorFromFile(File file, String encoding) throws IOException {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
            Vector<String> vc = new Vector<String>();
            String row = null;
            while((row = reader.readLine())!=null){
                //System.out.println(row);
                vc.add(row);
            }
 
            return vc;
 
        } finally {
 
            try {
 
                if (reader != null) reader.close();
 
            } catch (IOException e) {
 
                throw new RuntimeException(e);
 
            }
 
        }
    } 
}
