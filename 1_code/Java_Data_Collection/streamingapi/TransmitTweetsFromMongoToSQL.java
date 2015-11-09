package Crawler.streamingapi;


import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;

import org.json.JSONException;
import org.json.JSONObject;



import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.util.JSON;

public class TransmitTweetsFromMongoToSQL {
	    
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
	        createString = "CREATE TABLE  `PeopleData`.`tweets_rv9` ("+
                   "`TweetID` varchar(45) collate utf8_unicode_ci NOT NULL default ''," +
	           "`TweetText` varchar(245) collate utf8_unicode_ci NOT NULL default '',"+
	           "`UserID` varchar(45)  collate utf8_unicode_ci NOT NULL default '',"+
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
	                    "INSERT INTO tweets_rv9(TweetID, TweetText, UserID, CreateTime) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE TweetID=TweetID");
	            Mongo mongo = new Mongo("localhost", 27017);
	            
	            String DBName = "twitterdata3";
	            String CollectionName = "tweets3";
				DB db = mongo.getDB(DBName);
				DBCollection collection = db.getCollection(CollectionName);
				DBCursor cursorDoc = collection.find();
				String tmp;
				JSONObject obj;
				long count =0;
				while (cursorDoc.hasNext()) {
					tmp = cursorDoc.next().toString();
					
					String loctmp = "null";
					try {							// try is here because we want the program goes on even though there is an exception
						obj = new JSONObject(tmp);
							//extracting tweet id
                                                        loctmp = obj.getString("id");
                                                        //loctmp = obj.toString();
							ps.setString(1, loctmp);
                                                        //extracting tweet text
                                                        loctmp = obj.getString("text");
                                                        ps.setString(2, loctmp);
							loctmp = obj.getJSONObject("user").getString("id");
							ps.setString(3, loctmp);
                                                        ps.setNull(4, Types.TIMESTAMP);
							
							ps.executeUpdate();
				            ps.clearParameters();
						
						}
					catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					System.out.println(count++);
					
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
