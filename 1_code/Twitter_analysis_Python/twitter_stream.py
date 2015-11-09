#!/usr/bin/env python
# -*- coding: utf-8 -*-
#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
#import json
#from json.encoder import JSONEncoder

#Variables that contains the user credentials to access Twitter API 
access_token = "3800004675-DAxhyv1XzcatrCz0z1iYr1lhjT8bfyiROS6uCQd"
access_token_secret = "dVuQJclKVasg6bcaBLoaJCSfwU35E9ntoTZlrY0WVSHE4"
consumer_key = "6nUyxFD0e2hWrluyOmq1kyWzA"
consumer_secret = "1x6v5qeLV8JbhOp1uPzfUQbgM4AGRgkHCnNhEgrWJ9OJF47CAK"

#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    def on_data(self, data):
        print data
        return True

    def on_error(self, status):
        print status


if __name__ == '__main__':

    #This handles Twitter authentification and the connection to Twitter Streaming API
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    #This line filter Twitter Streams to capture data by the keywords
    
    stream.filter(track=['smoking'])
    