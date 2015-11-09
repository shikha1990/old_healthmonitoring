setwd('F:/Fall2015/SoftE/Proj/RV9_RCodes')
library("ROAuth")
library("twitteR")

load("twitter authentication.Rdata")

CONSUMER_KEY <- 'rmvV0qEUa0hewMGxJimgqk7Qj'
CONSUMER_SECRET <- 'jYBYFUVx5QNEMo9xuljWlN9LKIGW6ArPYdqSmdAAKJXX1W87gl'
ACCESS_TOKEN <- '3145749259-ma66UlkfNGgXQSTk3xBUnUhHzlcLuEesigPCque'
ACCESS_SECRET <- '3ULLAFbVEAqSWJAUg2T4cYWdrfcUObJrFjUWeOWpt5Muj'

setup_twitter_oauth(consumer_key = CONSUMER_KEY, consumer_secret = CONSUMER_SECRET, access_token= ACCESS_TOKEN, access_secret= ACCESS_SECRET)

r_smoking<- searchTwitter("#smoking", n=1500)
#r_smoking.tw <- lapply(r_smoking, function(x) x$getText())    
save(r_smoking,file="r_smoking.RData")

#to data.frame


r_smoking.df<-twListToDF(r_smoking)


dim(r_smoking.df)

library(tm)
library(stringr)

r_smoking.corpus <- Corpus(VectorSource(r_smoking.df$text))

#transformation

r_smoking.corpus=str_replace_all(r_smoking.corpus,"[^[:graph:]]", " ") 

tm_map(r_smoking.corpus, function(x) iconv(enc2utf8(x), sub = "byte"))
r_smoking.text.corpus <- tm_map(r_smoking.text.corpus, PlainTextDocument)

r_smoking.corpus<-tm_map(r_smoking.corpus,tolower)
r_smoking.corpus<-tm_map(r_smoking.corpus,removePunctuation)
r_smoking.corpus<-tm_map(r_smoking.corpus,removeNumbers)
removeURLs<-function(x) gsub("http[[:alnum:]]*","",x)
r_smoking.corpus<-tm_map(r_smoking.corpus,removeURLs)
myStopWords<-c(stopwords('english'),"avaiable","via")
myStopWords<-setdiff(myStopWords,c("smoking","rt")) ###test
r_smoking.corpus<-tm_map(r_smoking.corpus,removeWords,myStopWords)
save("r_smoking.corpus",file="r_smoking.corpus.RData")


#START HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
# Loading Corpus data obtained from Cloud2.R

load("r_smoking.text.corpus.RData")
#view
writeLines(strwrap(r_smoking.corpus[[4]],width=73))

##NOTNEEDDEDDD
#load("r_smoking.corpus.RData")
#stemming
#NOTNEEDEDD

#library(SnowballC)

r_smoking.corpus<-r_smoking.text.corpus
r_smoking.corpus.copy<-r_smoking.text.corpus

#stem

r_smoking.corpus<-tm_map(r_smoking.corpus,stemDocument)
inspect(r_smoking.corpus)

#time-consuming!
r_smoking.corpus<-tm_map(r_smoking.corpus, stemCompletion, dictionary=r_smoking.corpus.copy)


r_smoking.tdm<-TermDocumentMatrix(r_smoking.corpus,control=list(wordLengths=c(1,Inf)))

save(r_smoking.tdm,file="r_smoking.tdm.RData")
#r_smoking.tdm

###################
load("r_smoking.tdm.RData")
library(tm)
#inspect(r_smoking.tdm[5:20, 740:800])
#inspect freq words##################1



r_smoking.freq.terms<-findFreqTerms(r_smoking.tdm,lowfreq=15)


r_smoking.freq.terms

r_smoking.term.freq<-rowSums(as.matrix(r_smoking.tdm))

r_smoking.term.freq<-subset(r_smoking.term.freq,r_smoking.term.freq>15)

df<-data.frame(term=names(r_smoking.term.freq),freq=r_smoking.term.freq)

library(ggplot2)
library(labeling)

ggplot(df,aes(x=term,y=freq))+geom_bar(stat="identity")+xlab("Terms")+ylab("Count")+coord_flip()

#associate

findAssocs(r_smoking.tdm,"smoking",0.2)

#library(graph)
#library(Rgraphviz)
#plot(r_smoking.tdm,term=r_smoking.term.freq,corThreshold=0.12,weighting=T)

#wordcloud#########2
library(wordcloud)
m<-as.matrix(r_smoking.tdm)
word.freq<-sort(rowSums(m),decreasing=T)
wordcloud(words=names(word.freq),scale=c(7,0.5),freq=word.freq,colors=brewer.pal(8, "Dark2"),  random.color= TRUE,min.freq=15,random.order=F)

#Hierarchical Clustering#(ward,1963)
#The Ward2 criterion values are ¡°on a scale of distances¡± 
#whereas the Ward1 criterion values are ¡°on a scale of distances squared¡±.
tdm2<-removeSparseTerms(r_smoking.tdm,sparse=0.99)
m2<-as.matrix(tdm2)

distMatrix<-dist(scale(m2))
fit<-hclust(distMatrix,method="ward.D")#(Murtagh,1985)
#fit<-hclust(distMatrix,method="ward.D2")#(Kaufman&Rousseeuw,1990)
plot(fit)
#cut tree into n clusters
rect.hclust(fit,k=8)


###
m3<-t(m2)
set.seed(122)
k<-5
kmeansResult<-kmeans(m3,k)
round(kmeansResult$centers,digits=3)

##print tweets of every cluster

for(i in 1:k)
{
  cat(paste("cluster", i,": ", sep=""))
  s<-sort(kmeansResult$centers[i,],decreasing=T)
  cat(names(s)[1:5],"\n")
  
}

library(fpc)
#partitioning around medoids with estimation of number of clusters
pamResult<-pamk(m3,metric="r_smoking")
k<-pamResult$nc # no. of clusters indfed
pamResult<-pamResult$pamobject
# print cluster medoid
for(i in 1:k)
{
  cat("cluster",i,": ", colnames(pamResult$medoids)[which(pamResult$medoids[i,]==1)],"\n")
  
}

###plot cluster result

layout(matrix(c(1,2),1,2)) #two pages

plot(pamResult,col.p=pamResult$clustering)








