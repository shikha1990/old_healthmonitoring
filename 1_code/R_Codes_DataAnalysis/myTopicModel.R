load("r_smoking.tdm.RData")
library(tm)
dtm<-as.DocumentTermMatrix(r_smoking.tdm)
library(topicmodels)
lda<-LDA(dtm,k=8) #first 8 topics
term<-terms(lda,4) #first 4 terms of every topics
term
term<-apply(term,MARGIN=2,paste,collapse=", ")
topic<-topics(lda,1)

library(data.table)
library("twitteR")
load("r_smoking.RData")
r_smoking.df<-twListToDF(r_smoking)


topics<-data.frame(date=as.IDate(r_smoking.df$created),topic)
library(ggplot2)
qplot(date,..count..,date=topics,geom="density",fill=term[topic],position="stack")


