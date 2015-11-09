#install the necessary packages
#install.packages("ROAuth")
#install.packages("twitteR")
#install.packages("wordcloud")
#install.packages("tm")

library("ROAuth")
library("twitteR")
library("wordcloud")
library("tm")

setwd("F:/Fall2015/SoftE/Proj/RV9_RCodes/")
#necessary step for Windows
download.file(url="http://curl.haxx.se/ca/cacert.pem", destfile="cacert.pem")

#to get your consumerKey and consumerSecret see the twitteR documentation for instructions
#https://dev.twitter.com
cred <- OAuthFactory$new(consumerKey='rmvV0qEUa0hewMGxJimgqk7Qj',
                         consumerSecret='jYBYFUVx5QNEMo9xuljWlN9LKIGW6ArPYdqSmdAAKJXX1W87gl',
                         requestURL='https://api.twitter.com/oauth/request_token',
                         accessURL='https://api.twitter.com/oauth/access_token',
                         authURL='https://api.twitter.com/oauth/authorize')

#necessary step for Windows
cred$handshake(cainfo="cacert.pem")
#save for later use for Windows

save(cred, file="twitter authentication.Rdata")
#registerTwitterOAuth(cred)

#the cainfo parameter is necessary on Windows
#r_stats<- searchTwitter("#Rstats", n=1500, cainfo="cacert.pem")
#save text
#r_stats_text <- sapply(r_stats, function(x) x$getText())
#create corpus
#r_stats_text_corpus <- Corpus(VectorSource(r_stats_text))
#clean up
#r_stats_text_corpus <- tm_map(r_stats_text_corpus, tolower) 
#r_stats_text_corpus <- tm_map(r_stats_text_corpus, removePunctuation)
#r_stats_text_corpus <- tm_map(r_stats_text_corpus, function(x)removeWords(x,stopwords()))
#wordcloud(r_stats_text_corpus)



