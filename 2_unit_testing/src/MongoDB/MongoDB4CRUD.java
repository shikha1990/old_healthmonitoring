package MongoDB;
 
import Chapter2.restapi.*;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import org.bson.types.ObjectId;
import org.bson.BasicBSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import com.mongodb.BasicDBObject;
import com.mongodb.Bytes;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBList;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.QueryOperators;
import com.mongodb.util.JSON;
import java.util.Map;
 

public class MongoDB4CRUD {
    
    private Mongo mg = null;
    private DB db;
    private DBCollection users;
    public  DBObject in;
    
    @Before
    public void init() {
        try {
              mg = new Mongo();
            //mg = new Mongo("172.31.100.119");
            //mg = new Mongo("localhost", 27017);
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (MongoException e) {
            e.printStackTrace();
        }
       
        db = mg.getDB("temp");
        
        users = db.getCollection("users");
    }
    
    @After
    public void destory() {
        if (mg != null)
            mg.close();
        mg = null;
        db = null;
        users = null;
        System.gc();
    }
    
    public void print(Object o) {
        System.out.println(o);
    }

private void queryAll() {
    print("query all");
    
    DBCursor cur = users.find();
    while (cur.hasNext()) {
        print(cur.next());
    }
}
 
 
@Test
public void adddbobj(DBObject ino) {
    //先查询所有数据
       //queryAll();

     BasicDBList data = (BasicDBList) ino;
    for(int i=0; i < data.size(); i++){
        users.insert((DBObject) data.get(i));
    }
    
    
    
}

@Test
public int findminid() {
    //先查询所有数据
    users.find();
   
    //users.find().sort(in(id : 1));
     
     DBCursor cursor=users.find().sort(new BasicDBObject("id",-1));
     // DBCursor cursor = collection.find( query );
     BasicDBObject obj=new BasicDBObject();
       if( cursor.hasNext() ) 
            obj = (BasicDBObject) cursor.next();
       
     //print("age:"+obj.getString("id_str")); 
     int idn=obj.getInt("id");
     //String idn=obj.getString("id_str");
     return idn;

}

}