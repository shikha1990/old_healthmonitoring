#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
import nltk

def deleteURL(stringData):
    URL = re.compile("((http:|https:|ftp:|ftps:)//[\w$-_.+!*'(),%=]+)")
    stringData = URL.sub('', stringData)
    return stringData

def deleteAt(stringData):
    At = re.compile("(@[\w_]+)")
    stringData = At.sub('', stringData)
    return stringData

def deleteTag(stringData):
    Tag = re.compile("(#[\w!$-_.+!*'(),%=]+)")
    stringData = Tag.sub('', stringData)
    return stringData

def fixLanguage(stringSource):
    #stringSource = re.sub("RT", '', stringSource)
    stringSource = re.sub("\p{P}+", '', stringSource)
    stringSource = re.sub("[\'\":#,!&]+", '', stringSource)
    #stringSource = re.sub("(\u[\w]+)", '', stringSource)
    #stringSource = re.sub("[-?\\d+$]+", '', stringSource)
    return stringSource
    
#tweets = u'RT @林抽抽_不高兴 If u want to learn: "data structure" of python, please visit https://www.ibm.com/developerworks/cn/opensource/os-cn-pythonre/ or http://www.cnblogs.com/huxi/archive/2010/07/04/1771073.html and get started with python! #python#github'
#print nltk.word_tokenize(tweets)
#print tweets.split()
#tweets = deleteURL(tweets)
#tweets = deleteAt(tweets)
#tweets = fixLanguage(tweets)
