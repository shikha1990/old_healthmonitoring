/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mongoextraction;



import java.net.UnknownHostException;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.util.JSON;
import org.json.JSONObject;
import com.mongodb.BasicDBObject;

/**
 * Java MongoDB : Convert JSON data to DBObject
 * 
 */

public class MongoExtraction {
	public static void main(String[] args) {

		try {

			Mongo mongo = new Mongo("localhost", 27017);
			DB db = mongo.getDB("twitterdata2");
			DBCollection collection = db.getCollection("tweets2");

			// convert JSON to DBObject directly
			//DBObject dbObject = (DBObject) JSON
					//.parse("{'name':'harika', 'age':24}");

			//collection.insert(dbObject);
                        Integer count = 0;
			DBCursor cursorDoc = collection.find();
			while (cursorDoc.hasNext()) {
                                count++;
				//System.out.println(cursorDoc.next());
                                DBObject dbobj = cursorDoc.next();
                                //System.out.println(dbobj);
                                String jsonString = dbobj.toString();
                                //String loctmp = jsonString.
                                
			}
                        System.out.println(count);
			System.out.println("Done");

		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (MongoException e) {
			e.printStackTrace();
		}
	}
}