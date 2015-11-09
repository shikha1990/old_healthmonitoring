library(tm)
#read spectific lines
writeLines(strwrap(r_smoking.text.corpus[[4]],width=73))

library(SnowballC)

r_smoking.text.corpus.copy<-r_smoking.text.corpus

#stem
r_smoking.text.corpus<-tm_map(r_smoking.text.corpus,stemDocument)
inspect(r_smoking.text.corpus[5])

#stem completition

r_smoking.text.corpus<-tm_map(r_smoking.text.corpus,stemCompletion,dictionary=r_smoking.text.corpus.copy)

?tm_map

save(r_smoking.text.corpus,file="r_smoking.text.corpus.SC.RData")

#inspect(r_smoking.text.corpus)

# to TD matrix

library(tm)

#tdm
r_smoking.text.corpus <- tm_map(r_smoking.text.corpus, PlainTextDocument)
r_smoking.tdm<-TermDocumentMatrix(r_smoking.text.corpus, control=list(wordLengths=c(1,Inf)))


#inspect(r_smoking.text.corpus)

inspect(r_smoking.tdm)











