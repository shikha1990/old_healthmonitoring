#!/usr/bin/env python
# -*- coding: utf-8 -*-
import kNN
import json
import numpy as np
#import nltk
#from nltk import tokenize
from TF_IDF_Classify import Document
from TF_IDF_Classify import TFIDF
#import re
from pprint import pprint
from WordSegmentation import deleteURL, deleteAt, fixLanguage, deleteTag
from Sentimental import *

data = []

"""
tweets_file = open('twitter_data.txt', "r")
for line in tweets_file:
    try:
        tweet = json.loads(line)
        data.append(tweet)
    except:
        continue
"""
with open('tweets.json') as data_file:
    for line in data_file:
        data.append(json.loads(line))
#pprint(data[0])
doc = []
for i in range (0, len(data)):
    text = data[i]['text']
    doc.insert(i, Document(data[i]['id'], text))    
print len(doc)

i = 0
while i < len(doc):
    match = re.search('^RT', doc[i].original_text)
    if match:
        doc.pop(i)
        continue
    i += 1
print len(doc)

Doc_Set = []
Doc_class = {}
 
f = open('garbage.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('garbage', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()


f = open('mot_diet.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('mot_diet', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()

    
f = open('mot_exercise.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('mot_exercise', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()


f = open('neg_diet.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('neg_diet', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()

  
f = open('pos_alcohol.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('pos_alcohol', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()

 
f = open('pos_diet.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('pos_diet', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()


f = open('pos_exercise.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('pos_exercise', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()

   
f = open('pos_smoking.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('pos_smoking', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()


quit_alcohol_tweets = []    
f = open('quit_alcohol.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('quit_alcohol', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()

  
f = open('quit_smoking.txt', 'r')
line = f.readline()
while line != '':
    line = deleteURL(line)
    line = deleteAt(line)
    line = deleteTag(line)
    line = fixLanguage(line)
    Doc_dict = Document('quit_smoking', line)
    Doc_Set.append(Doc_dict)
    line = f.readline()
f.close()

categories = ['garbage', 'mot_diet', 'mot_exercise', 'neg_diet', 'pos_alcohol', 'pos_diet', 'pos_exercise', 'pos_smoking', 'quit_alcohol', 'quit_smoking']

TrainSet = TFIDF(Doc_Set)
labels = []  

count = 0
for document in TrainSet.documents:
    count += 1
    count_inner = 0
    for category in categories:
        if count_inner == 0:
            sim = np.array([TrainSet.similar(category, document)])
        else:
            sim = np.append(sim, [TrainSet.similar(category, document)])
        count_inner += 1
    text = document.original_text
    text = re.sub("((http:|https:|ftp:|ftps:)//[\w$-_.+!*'(),%=]+)", '', text)
    text = re.sub("(@[\w_]+)", '', text)
    text = re.sub("(#[\w!$-_.+!*'(),%=]+)", '', text)
    text = re.sub("\p{P}+", '', text)
    text = re.sub("[\'\":#,!&]+", '', text)
    pos = classify_tweet(text).prob('positive')
    for category in categories:
        sim = np.append(sim, [pos])
    if count == 1:
        group = np.array([sim])
    else:
        group = np.append(group, [sim], axis = 0)
    labels.append(document.id)

group = kNN.autoNorm(group)

tweet_label = {}

count = 0
count_exer = 0
for document in doc:
    count += 1
    count_inner = 0
    for category in categories:
        if count_inner == 0:
            sim = np.array([TrainSet.similar(category, document)])
        else:
            sim = np.append(sim, [TrainSet.similar(category, document)])
        count_inner += 1
    text = document.original_text
    text = re.sub("((http:|https:|ftp:|ftps:)//[\w$-_.+!*'(),%=]+)", '', text)
    text = re.sub("(@[\w_]+)", '', text)
    text = re.sub("(#[\w!$-_.+!*'(),%=]+)", '', text)
    text = re.sub("\p{P}+", '', text)
    text = re.sub("[\'\":#,!&]+", '', text)
    pos = classify_tweet(text).prob('positive')
    for category in categories:
        sim = np.append(sim, [pos])
    if count == 1:
        doc_sim = np.array([sim])
    else:
        doc_sim = np.append(doc_sim, [sim], axis = 0)
    
    if kNN.classify0(sim, group, labels, 3) == 'pos_exercise':
        count_exer += 1
        if count_exer == 1:
            doc_exer = np.array([sim])
        else:
            doc_exer = np.append(doc_exer, [sim], axis = 0)
        print document.original_text
print count_exer 

import matplotlib
import matplotlib.pyplot as plt
fig = plt.figure()
ax = fig.add_subplot(111)
ax.scatter(doc_sim[:,7], doc_sim[:,10], color = 'blue')
plt.hold('on')
ax.scatter(doc_exer[:,7], doc_exer[:,10], color = 'red')
plt.show()

