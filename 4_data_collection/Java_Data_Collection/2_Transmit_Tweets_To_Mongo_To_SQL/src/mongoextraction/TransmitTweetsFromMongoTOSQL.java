package mongoextraction;



import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;

import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.io.UnsupportedEncodingException;

import org.json.JSONException;
import org.json.JSONObject;

//import mongodb.MongodbSaver;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.Mongo;
import com.mongodb.BasicDBObject;

	public class TransmitTweetsFromMongoTOSQL {
	    
	    private static final String DBURL = 
	              "jdbc:mysql://localhost:3306/PeopleData?user=root&password=root";
	    private static final String DBDRIVER = "org.gjt.mm.mysql.Driver";
	  
	    static {
	        try {
	            Class.forName(DBDRIVER).newInstance();
	        } catch (Exception e){
	            e.printStackTrace();
	        }
	    }

	    private static Connection getConnection() 
	    {
	        Connection connection = null;
	        try {
	            connection = DriverManager.getConnection(DBURL);
	        }
	        catch (Exception e) {
	            e.printStackTrace();
	        }
	        return connection;
	    }

	    public static void createEmployees()
	    {
	        Connection con = getConnection();
	        Statement stmt =null;
	        String createString;
	        createString = "CREATE TABLE  `PeopleData`.`twitter10` ("+
                   "`TweetID` varchar(145) collate utf8_unicode_ci NOT NULL default ''," +
	           "`TweetText` varchar(1245) collate utf8_unicode_ci NOT NULL default '',"+
	           "`UserID` varchar(1200)  collate utf8_unicode_ci NOT NULL default '',"+
	           "`CreateTime` timestamp NOT NULL default CURRENT_TIMESTAMP,"+
	           "PRIMARY KEY  (`TweetID`)"+
	           ") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";            
	        try {
	            stmt = con.createStatement();
	            stmt.executeUpdate(createString);
	        } catch(SQLException ex) {
	            System.err.println("SQLException: " + ex.getMessage());
	        }
	        finally {
	            if (stmt != null) {
	                try {
	                    stmt.close();
	                } catch (SQLException e) {
	                    System.err.println("SQLException: " + e.getMessage());
	                }
	            }
	            if (con != null) {
	                try {
	                    con.close();
	                } catch (SQLException e) {
	                    System.err.println("SQLException: " + e.getMessage());
	                }
	            }
	        }
	    }
	    
	    private static void insertEmployee() throws IOException 
	    {
	        Connection con = getConnection();
	        PreparedStatement ps = null;

	        try {
	            ps = con.prepareStatement(
	                    "INSERT INTO twitter10(TweetID, TweetText, UserID, CreateTime) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE TweetID=TweetID");
	            Mongo mongo = new Mongo("localhost", 27017);
	            
	            String DBName = "twitterdata2";
	            String CollectionName = "tweets2";
				DB db = mongo.getDB(DBName);
				DBCollection collection = db.getCollection(CollectionName);
				DBCursor cursorDoc = collection.find();
				String tmp;
				JSONObject obj;
				long count =0;
                                //BasicDBObject basicobj=new BasicDBObject();
                                
				while (cursorDoc.hasNext()) {
					tmp = cursorDoc.next().toString();
                                        BasicDBObject bObj = (BasicDBObject) cursorDoc.next();
                                        System.out.print(tmp);
                                        
					String loctmp = "null";
                                        loctmp=bObj.getString("id");
                                        ps.setString(1, loctmp);
                                        //System.out.print(loctmp);
                                        loctmp = bObj.getString("text");
                                        
                                        //removing emoticons
                                                String utf8tweet = "";
                                                utf8tweet = loctmp;
                                                Pattern unicodeOutliers = Pattern.compile("[^\\x00-\\x7F]",
                                                        Pattern.UNICODE_CASE | Pattern.CANON_EQ
                                                                | Pattern.CASE_INSENSITIVE);
                                                Matcher unicodeOutlierMatcher = unicodeOutliers.matcher(utf8tweet);

                                                System.out.println("Before: " + utf8tweet);
                                                utf8tweet = unicodeOutlierMatcher.replaceAll(" ");
                                                System.out.println("After: " + utf8tweet);
                                        
                                        //end
                                        
                                        
                                        
                                        
                                        
                                        ps.setString(2, utf8tweet);
                                        //System.out.print(utf8tweet);
                                        loctmp =  bObj.getString("user");
                                        //String str = "id";
                                        String result = loctmp.replaceAll("\"","");
                                        Pattern pattern = Pattern.compile("id(.*?)following");
                                        Matcher matcher = pattern.matcher(result);
                                        //loctmp = loctmp.getString("id");
                                        //System.out.print(result);
                                        if (matcher.find())
                                        {
                                            String res1 = matcher.group(1);
                                            String result1 = res1.replaceAll(",","");
                                            String result2 = result1.replaceAll(":", "");
                                            System.out.println(result2);
                                            ps.setString(3, result2);
                                        }
                                        count++;
                                        ps.setNull(4, Types.TIMESTAMP);
                                        System.out.println(count);
                                        ps.executeUpdate();
				        ps.clearParameters();
                                        //System.out.println(matcher.group(1));
					//System.out.println(count++);
					
				}
				
				
	        } catch (SQLException e) {
	            System.err.println("SQLException: " + e.getMessage());
	        }
	        finally {
	            if (ps != null) {
	                try {
	                    ps.close();
	                } catch (SQLException e) {
	                    System.err.println("SQLException: " + e.getMessage());
	                }
	            }
	            if (con != null) {
	                try {
	                    con.close();
	                } catch (SQLException e) {
	                    System.err.println("SQLException: " + e.getMessage());
	                }
	            }
	        }
	    }
	    
	    public static void main(String args[]) throws IOException{
	       createEmployees();
	        insertEmployee();
	    }
}
