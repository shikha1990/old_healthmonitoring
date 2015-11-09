package ProgramToAccessDatabase;

import java.io.IOException;
import java.sql.*;
import java.io.FileWriter;
import com.aliasi.classify.Classification;
import com.aliasi.classify.Classified;
import com.aliasi.classify.ConfusionMatrix;
import com.aliasi.classify.DynamicLMClassifier;
import com.aliasi.classify.JointClassification;
import com.aliasi.classify.JointClassifier;
import com.aliasi.classify.JointClassifierEvaluator;
import com.aliasi.classify.LMClassifier;

import com.aliasi.lm.NGramProcessLM;

import com.aliasi.util.AbstractExternalizable;

import java.io.File;
import java.io.IOException;

import com.aliasi.util.Files;
import static java.lang.Math.abs;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class ProgramToAccessDatabase {

    private static File TRAINING_DIR
            = new File("F:/Fall2015/SoftE/Proj/Training");

    /* private static File TESTING_DIR
     =  new File("C:/Users/ajoy/Documents/class_test/Test"); */
    private static String[] CATEGORIES
            = {"garbage.all", "mot.diet", "mot.exercise", "neg.diet",/*"neg.exercise",*/
                "pos.alcohol", "pos.diet", "pos.exercise", "pos.smoking", "quit.alcohol", "quit.smoking"
            };

    private static int NGRAM_SIZE = 12;

    static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    static final String DB_URL = "jdbc:mysql://localhost:3306/PeopleData?user=root&password=root";

    public static void main(String[] args) throws IOException, SQLException, ClassNotFoundException {
        DynamicLMClassifier<NGramProcessLM> classifier
                = DynamicLMClassifier.createNGramProcess(CATEGORIES, NGRAM_SIZE);

        for (int i = 0; i < CATEGORIES.length; ++i) {
            File classDir = new File(TRAINING_DIR, CATEGORIES[i]);
            if (!classDir.isDirectory()) {
                String msg = "Could not find training directory="
                        + classDir;
                System.out.println(msg); // in case exception gets lost in shell
                throw new IllegalArgumentException(msg);
            }

            String[] trainingFiles = classDir.list();
            for (int j = 0; j < trainingFiles.length; ++j) {

                File file = new File(classDir, trainingFiles[j]);
                String text = Files.readFromFile(file, "ISO-8859-1");
                System.out.println("Training on " + CATEGORIES[i] + "/" + trainingFiles[j]);
                Classification classification
                        = new Classification(CATEGORIES[i]);
                Classified<CharSequence> classified
                        = new Classified<CharSequence>(text, classification);
                classifier.handle(classified);
            }
        }
        //compiling
        System.out.println("Compiling");
        @SuppressWarnings("unchecked") // we created object so know it's safe
        JointClassifier<CharSequence> compiledClassifier
                = (JointClassifier<CharSequence>) AbstractExternalizable.compile(classifier);

        boolean storeCategories = true;
        JointClassifierEvaluator<CharSequence> evaluator
                = new JointClassifierEvaluator<CharSequence>(compiledClassifier,
                        CATEGORIES,
                        storeCategories);
        Connection conn = null;
        Statement stmt1 = null;
        ResultSet rs = null;

        int once = 0;
       // int tweet_count = 0;
       // int tweet_limit = 35000;
        int tweetmin = 0;
        int tweetsec = 0;

        int week1_mot_diet = 0;
        int week1_mot_exercise = 0;
        int week1_neg_diet = 0;
       // int week1_neg_exercise = 0;
        int week1_pos_alcohol = 0;
        int week1_pos_diet = 0;
        int week1_pos_exercise = 0;
        int week1_pos_smoking = 0;
        int week1_quit_alcohol = 0;
        int week1_quit_smoking = 0;

        int week2_mot_diet = 0;
        int week2_mot_exercise = 0;
        int week2_neg_diet = 0;
      //  int week2_neg_exercise = 0;
        int week2_pos_alcohol = 0;
        int week2_pos_diet = 0;
        int week2_pos_exercise = 0;
        int week2_pos_smoking = 0;
        int week2_quit_alcohol = 0;
        int week2_quit_smoking = 0;

        int week3_mot_diet = 0;
        int week3_mot_exercise = 0;
        int week3_neg_diet = 0;
     //   int week3_neg_exercise = 0;
        int week3_pos_alcohol = 0;
        int week3_pos_diet = 0;
        int week3_pos_exercise = 0;
        int week3_pos_smoking = 0;
        int week3_quit_alcohol = 0;
        int week3_quit_smoking = 0;

        int week4_mot_diet = 0;
        int week4_mot_exercise = 0;
        int week4_neg_diet = 0;
       // int week4_neg_exercise = 0;
        int week4_pos_alcohol = 0;
        int week4_pos_diet = 0;
        int week4_pos_exercise = 0;
        int week4_pos_smoking = 0;
        int week4_quit_alcohol = 0;
        int week4_quit_smoking = 0;

        int week1_total = 0;
        int week2_total = 0;
        int week3_total = 0;
        int week4_total = 0;

        try {
            //STEP 2: Register JDBC driver
            Class.forName("com.mysql.jdbc.Driver");

            //STEP 3: Open a connection
            System.out.println("Connecting to a selected database...");
            conn = DriverManager.getConnection(DB_URL);
            System.out.println("Connected database successfully...");
            stmt1 = conn.createStatement();
            
            Statement stmt3 = null;
            stmt3 = conn.createStatement();

            rs = stmt1.executeQuery("SELECT TweetID,TweetText,CreateTime,UserID FROM peopledata.tweets");

            while (rs.next()) {

                Statement stmt2 = null;
                stmt2 = conn.createStatement();

                String tweetID = rs.getString("TweetID"); // TweetID column in query
                String tweetText = rs.getString("TweetText"); // TweetText column in query
                String tweetTime = rs.getString("CreateTime"); // CreateTime column in query
                String UserID = rs.getString("UserID"); // CreateTime column in query
                            
                JointClassification jc = compiledClassifier.classify(tweetText);
                String bestCategory = jc.bestCategory();
                
                System.out.println("---------------");
                System.out.print("Testing on Tweet : " + tweetText + "\n");
                System.out.println("Got best category of: " + bestCategory);
                System.out.println(jc.toString());
                System.out.println("---------------");
                             
                if ((!bestCategory.equals(CATEGORIES[0])) /*&& tweet_count != tweet_limit*/){
                    
                    for (int k = 1; k < CATEGORIES.length; k++) {              

                    Classification classification = new Classification(CATEGORIES[k]);
                    Classified<CharSequence> classified = new Classified<CharSequence>(tweetText,jc );
                    evaluator.handle(classified);
                    }
                    
                    //tweet_count+=1;
                    
                    
                }
                
/*remove
                for (int j = 0; j < tweetText.length(); j++) {

                    char tweetchar = (tweetText.charAt(j));

                    if (tweetchar == '"' || tweetchar == '\\') {
                        tweetText = new StringBuffer(tweetText).insert(j, "\\").toString();
                        j++;
                    }
                }
                
                // System.out.print("Testing on " + CATEGORIES[i] + "/" );               

                /*    System.out.println("---------------");
                 System.out.println(tweetID);
                 System.out.println("Got best category of: " + bestCategory);
                 System.out.println(jc.toString());
                 System.out.println("---------------"); */
                String tweetText_sql = "\"" + tweetText + "\"";
                String tweetID_sql = "'" + tweetID + "'";
                String userID_sql = "'" + UserID + "'";

            //        System.out.println(tweetText_sql);
                //        System.out.println(tweetID_sql);
               if (once == 0) {

                    int m1 = Character.getNumericValue(tweetTime.charAt(14));
                    int m2 = Character.getNumericValue(tweetTime.charAt(15));
                    tweetmin = Integer.parseInt(Integer.toString(m1) + Integer.toString(m2));
                    int s1 = Character.getNumericValue(tweetTime.charAt(17));
                    int s2 = Character.getNumericValue(tweetTime.charAt(18));
                    tweetsec = Integer.parseInt(Integer.toString(s1) + Integer.toString(s2));
                    once = 1;

                }

                int m1 = Character.getNumericValue(tweetTime.charAt(14));
                int m2 = Character.getNumericValue(tweetTime.charAt(15));
                int tweetmin_temp = Integer.parseInt(Integer.toString(m1) + Integer.toString(m2));
                int s1 = Character.getNumericValue(tweetTime.charAt(17));
                int s2 = Character.getNumericValue(tweetTime.charAt(18));
                int tweetsec_temp = Integer.parseInt(Integer.toString(s1) + Integer.toString(s2));
                
                if (bestCategory.equals(CATEGORIES[0])) {         // "garbage.all"
                        String sql = "Insert INTO garbage_all (UserID,TweetID, TweetText) VALUES ("+ userID_sql + "," + tweetID_sql + "," + tweetText_sql + ")";
                        stmt2.executeUpdate(sql);
                    }
                
                 //week1
                if (/*((abs(tweetmin - tweetmin_temp) % 4 == 0)) &&*/((abs(tweetsec - tweetsec_temp) % 15 >= 0) && (abs(tweetsec - tweetsec_temp) % 15 < 4))) {
                    
                    week1_total+=1;

                    if (bestCategory.equals(CATEGORIES[1])) {    // "mot.diet"
                        String sql = "Insert INTO mot_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_mot_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[2])) {    // "mot.exercise"
                        String sql = "Insert INTO mot_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_mot_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[3])) {    // "neg.diet"
                        String sql = "Insert INTO neg_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_neg_diet += 1;
                        stmt2.executeUpdate(sql);
                    }/* else if (bestCategory.equals(CATEGORIES[4])) {    // "neg.exercise"
                        String sql = "Insert INTO neg_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_neg_exercise += 1;
                        stmt2.executeUpdate(sql);
                    }*/else if (bestCategory.equals(CATEGORIES[4])) {    // "pos.alcohol"
                        String sql = "Insert INTO pos_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_pos_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[5])) {    // "pos.diet"
                        String sql = "Insert INTO pos_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_pos_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[6])) {    // "pos.exercise" 
                        String sql = "Insert INTO pos_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_pos_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[7])) {    // "pos.smoking"
                        String sql = "Insert INTO pos_smoking (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_pos_smoking += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[8])) {    // "quit.alcohol" 
                        String sql = "Insert INTO quit_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_quit_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[9])) {   // "quit.smoking"
                        String sql = "Insert INTO quit_smoking (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week1_quit_smoking += 1;
                        stmt2.executeUpdate(sql);
                    }
                    
                }
                //week2   
                else if (/*(abs(tweetmin - tweetmin_temp) % 4 == 1))
                        && */((abs(tweetsec - tweetsec_temp) % 15 > 3) && (abs(tweetsec - tweetsec_temp) % 15 < 8))) {
                    
                    week2_total+=1;
                    
                    if (bestCategory.equals(CATEGORIES[1])) {    // "mot.diet"
                        String sql = "Insert INTO mot_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_mot_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[2])) {    // "mot.exercise"
                        String sql = "Insert INTO mot_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_mot_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[3])) {    // "neg.diet"
                        String sql = "Insert INTO neg_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_neg_diet += 1;
                        stmt2.executeUpdate(sql);
                    }/* else if (bestCategory.equals(CATEGORIES[4])) {    // "neg.exercise"
                        String sql = "Insert INTO neg_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_neg_exercise += 1;
                        stmt2.executeUpdate(sql);
                    }*/ else if (bestCategory.equals(CATEGORIES[4])) {    // "pos.alcohol"
                        String sql = "Insert INTO pos_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_pos_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[5])) {    // "pos.diet"
                        String sql = "Insert INTO pos_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_pos_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[6])) {    // "pos.exercise" 
                        String sql = "Insert INTO pos_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_pos_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[7])) {    // "pos.smoking"
                        String sql = "Insert INTO pos_smoking (UserID,TweetID, TweetText) VALUES (" + userID_sql + "," + tweetID_sql + "," + tweetText_sql + ")";
                        week2_pos_smoking += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[8])) {    // "quit.alcohol" 
                        String sql = "Insert INTO quit_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_quit_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[9])) {   // "quit.smoking"
                        String sql = "Insert INTO quit_smoking (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week2_quit_smoking += 1;
                        stmt2.executeUpdate(sql);
                    }

                }
                //week3   
                else if (/*(abs(tweetmin - tweetmin_temp) % 4 == 2))
                          &&*/((abs(tweetsec - tweetsec_temp) % 15 > 7) && (abs(tweetsec - tweetsec_temp) % 15 < 12))) {
                    
                    week3_total+=1;
                    
                    if (bestCategory.equals(CATEGORIES[1])) {    // "mot.diet"
                        String sql = "Insert INTO mot_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_mot_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[2])) {    // "mot.exercise"
                        String sql = "Insert INTO mot_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_mot_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[3])) {    // "neg.diet"
                        String sql = "Insert INTO neg_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_neg_diet += 1;
                        stmt2.executeUpdate(sql);
                    }/* else if (bestCategory.equals(CATEGORIES[4])) {    // "neg.exercise"
                        String sql = "Insert INTO neg_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_neg_exercise += 1;
                        stmt2.executeUpdate(sql);
                    }*/else if (bestCategory.equals(CATEGORIES[4])) {    // "pos.alcohol"
                        String sql = "Insert INTO pos_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_pos_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[5])) {    // "pos.diet"
                        String sql = "Insert INTO pos_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_pos_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[6])) {    // "pos.exercise" 
                        String sql = "Insert INTO pos_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_pos_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[7])) {    // "pos.smoking"
                        String sql = "Insert INTO pos_smoking (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_pos_smoking += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[8])) {    // "quit.alcohol" 
                        String sql = "Insert INTO quit_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_quit_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[9])) {   // "quit.smoking"
                        String sql = "Insert INTO quit_smoking (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week3_quit_smoking += 1;
                        stmt2.executeUpdate(sql);
                    }

                }
                //week4    
                else if (/*(abs(tweetmin - tweetmin_temp) % 4 == 3))
                        && */((abs(tweetsec - tweetsec_temp) % 15 > 11) && (abs(tweetsec - tweetsec_temp) % 15 < 15))) {
                    
                    week4_total+=1;
                    
                    if (bestCategory.equals(CATEGORIES[1])) {    // "mot.diet"
                        String sql = "Insert INTO mot_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_mot_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[2])) {    // "mot.exercise"
                        String sql = "Insert INTO mot_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_mot_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[3])) {    // "neg.diet"
                        String sql = "Insert INTO neg_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_neg_diet += 1;
                        stmt2.executeUpdate(sql);
                    }/* else if (bestCategory.equals(CATEGORIES[4])) {    // "neg.exercise"
                        String sql = "Insert INTO neg_exercise (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_neg_exercise += 1;
                        stmt2.executeUpdate(sql);
                    }*/ else if (bestCategory.equals(CATEGORIES[4])) {    // "pos.alcohol"
                        String sql = "Insert INTO pos_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_pos_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[5])) {    // "pos.diet"
                        String sql = "Insert INTO pos_diet (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_pos_diet += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[6])) {    // "pos.exercise" 
                        String sql = "Insert INTO pos_exercise (UserID,TweetID, TweetText) VALUES (" + userID_sql + "," + tweetID_sql + "," + tweetText_sql + ")";
                        week4_pos_exercise += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[7])) {    // "pos.smoking"
                        String sql = "Insert INTO pos_smoking (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_pos_smoking += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[8])) {    // "quit.alcohol" 
                        String sql = "Insert INTO quit_alcohol (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_quit_alcohol += 1;
                        stmt2.executeUpdate(sql);
                    } else if (bestCategory.equals(CATEGORIES[9])) {   // "quit.smoking"
                        String sql = "Insert INTO quit_smoking (UserID,TweetID, TweetText) VALUES ("+ userID_sql + ","  + tweetID_sql + "," + tweetText_sql + ")";
                        week4_quit_smoking += 1;
                        stmt2.executeUpdate(sql);
                    }

                }

                /*    FileWriter f0 = new FileWriter(bestCategory, true);
                 f0.write(tweetID + " - " + tweetText);
                 f0.write(System.lineSeparator());
                 f0.close(); */
       // }
            }
            
            //week1
            String w11 = "'" + Integer.toString(week1_pos_exercise) + "'";
            String w12 = "'" + Integer.toString(week1_mot_exercise) + "'";
            String w13 = "'" + Integer.toString(week1_pos_diet) + "'";
            String w14 = "'" + Integer.toString(week1_neg_diet) + "'";
            String w15 = "'" + Integer.toString(week1_mot_diet) + "'";
            String w16 = "'" + Integer.toString(week1_pos_alcohol) + "'";
            String w17 = "'" + Integer.toString(week1_quit_alcohol) + "'";
           // String w14 = "'" + Integer.toString(week1_neg_exercise) + "'";
            String w18 = "'" + Integer.toString(week1_pos_smoking) + "'";
            String w19 = "'" + Integer.toString(week1_quit_smoking) + "'";
            String w110 = "'" + Integer.toString(week1_total) + "'";
            
            //week2
            String w21 = "'" + Integer.toString(week2_pos_exercise) + "'";
            String w22 = "'" + Integer.toString(week2_mot_exercise) + "'";
            String w23 = "'" + Integer.toString(week2_pos_diet) + "'";
            String w24 = "'" + Integer.toString(week2_neg_diet) + "'";
            String w25 = "'" + Integer.toString(week2_mot_diet) + "'";
            String w26 = "'" + Integer.toString(week2_pos_alcohol) + "'";
            String w27 = "'" + Integer.toString(week2_quit_alcohol) + "'";
           // String w24 = "'" + Integer.toString(week2_neg_exercise) + "'";
            String w28 = "'" + Integer.toString(week2_pos_smoking) + "'";
            String w29 = "'" + Integer.toString(week2_quit_smoking) + "'";
            String w210 = "'" + Integer.toString(week2_total) + "'";
            
            //week3
            String w31 = "'" + Integer.toString(week3_pos_exercise) + "'";
            String w32 = "'" + Integer.toString(week3_mot_exercise) + "'";
            String w33 = "'" + Integer.toString(week3_pos_diet) + "'";
            String w34 = "'" + Integer.toString(week3_neg_diet) + "'";
            String w35 = "'" + Integer.toString(week3_mot_diet) + "'";
            String w36 = "'" + Integer.toString(week3_pos_alcohol) + "'";
            String w37 = "'" + Integer.toString(week3_quit_alcohol) + "'";
           // String w34 = "'" + Integer.toString(week3_neg_exercise) + "'";
            String w38 = "'" + Integer.toString(week3_pos_smoking) + "'";
            String w39 = "'" + Integer.toString(week3_quit_smoking) + "'";
            String w310 = "'" + Integer.toString(week3_total) + "'";
            
            //week4
            String w41 = "'" + Integer.toString(week4_pos_exercise) + "'";
            String w42 = "'" + Integer.toString(week4_mot_exercise) + "'";
            String w43 = "'" + Integer.toString(week4_pos_diet) + "'";
            String w44 = "'" + Integer.toString(week4_neg_diet) + "'";
            String w45 = "'" + Integer.toString(week4_mot_diet) + "'";
            String w46 = "'" + Integer.toString(week4_pos_alcohol) + "'";
            String w47 = "'" + Integer.toString(week4_quit_alcohol) + "'";
           // String w44 = "'" + Integer.toString(week4_neg_exercise) + "'";
            String w48 = "'" + Integer.toString(week4_pos_smoking) + "'";
            String w49 = "'" + Integer.toString(week4_quit_smoking) + "'";
            String w410 = "'" + Integer.toString(week4_total) + "'";
            
            //week1
            String sql = "INSERT INTO `histogram2`"
                    + "(`week`, `pos_exercise`, `mot_exercise`, `pos_diet`, `neg_diet`,"
                    + " `mot_diet`, `pos_alcohol`, `quit_alcohol`, `pos_smoking`, `quit_smoking`, `total`) "
                    + "VALUES (" +"1," + w11 + "," + w12 + "," + w13 + "," + w14 + "," + 
                                    w15 + "," + w16 + "," + w17 + "," + w18 + "," + w19 + "," + w110 +")";
            stmt3.executeUpdate(sql);
            
            //week2
            sql = "INSERT INTO `histogram2`"
                    + "(`week`, `pos_exercise`, `mot_exercise`, `pos_diet`, `neg_diet`,"
                    + " `mot_diet`, `pos_alcohol`, `quit_alcohol`, `pos_smoking`, `quit_smoking`, `total`) "
                    + "VALUES (" +"2," + w21 + "," + w22 + "," + w23 + "," + w24 + "," + 
                                    w25 + "," + w26 + "," + w27 + "," + w28 + "," + w29 + "," + w210 +")";
            stmt3.executeUpdate(sql);
            
            //week3
            sql = "INSERT INTO `histogram2`"
                    + "(`week`, `pos_exercise`, `mot_exercise`, `pos_diet`, `neg_diet`,"
                    + " `mot_diet`, `pos_alcohol`, `quit_alcohol`, `pos_smoking`, `quit_smoking`, `total`) "
                    + "VALUES (" +"3," + w31 + "," + w32 + "," + w33 + "," + w34 + "," + 
                                    w35 + "," + w36 + "," + w37 + "," + w38 + "," + w39 + "," + w310 +")";
            stmt3.executeUpdate(sql);
            
            //week4
            sql = "INSERT INTO `histogram2`"
                    + "(`week`, `pos_exercise`, `mot_exercise`, `pos_diet`, `neg_diet`,"
                    + " `mot_diet`, `pos_alcohol`, `quit_alcohol`, `pos_smoking`, `quit_smoking`, `total`) "
                    + "VALUES (" +"4," + w41 + "," + w42 + "," + w43 + "," + w44 + "," + 
                                    w45 + "," + w46 + "," + w47 + "," + w48 + "," + w49 + "," + w410 +")";
            stmt3.executeUpdate(sql);
      
        } catch (SQLException se) {
            //Handle errors for JDBC
            se.printStackTrace();
        } catch (Exception e) {
            //Handle errors for Class.forName
            e.printStackTrace();
        } finally {
            //finally block used to close resources
            try {
                if (stmt1 != null) {
                    conn.close();
                }
            } catch (SQLException se) {
            }// do nothing
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException se) {
                se.printStackTrace();
            }
        }//end finally
        System.out.println("Tweet Analysis & Sorting Complete");
        ConfusionMatrix confMatrix = evaluator.confusionMatrix();
        System.out.println("Total Accuracy: " + confMatrix.totalAccuracy());
        System.out.println("\nFULL EVAL");
        System.out.println(evaluator);
    }//end main
}
