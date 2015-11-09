library("ROAuth")
library("twitteR")
library("wordcloud")


load("twitter authentication.Rdata")

CONSUMER_KEY <- 'rmvV0qEUa0hewMGxJimgqk7Qj'
CONSUMER_SECRET <- 'jYBYFUVx5QNEMo9xuljWlN9LKIGW6ArPYdqSmdAAKJXX1W87gl'
ACCESS_TOKEN <- '3145749259-ma66UlkfNGgXQSTk3xBUnUhHzlcLuEesigPCque'
ACCESS_SECRET <- '3ULLAFbVEAqSWJAUg2T4cYWdrfcUObJrFjUWeOWpt5Muj'

setup_twitter_oauth(consumer_key = CONSUMER_KEY, consumer_secret = CONSUMER_SECRET, access_token= ACCESS_TOKEN, access_secret= ACCESS_SECRET)


#search.string <- "#smoking"
#no.of.tweets <- 100


#tweets

#tweets <- searchTwitter(search.string, n=no.of.tweets, lang="en")

#tweetsmoking <- searchTwitter(¡°#nba¡±, n=1499, cainfo=¡±cacert.pem¡±, lang=¡±en¡±)

r_dietary<- searchTwitter("#dietary", n=1500)
r_dietary.text <- sapply(r_dietary, function(x) x$getText())    

#------------------------------------------

r_dietary.text=str_replace_all(r_dietary.text,"[^[:graph:]]", " ") 

#convert all text to lower case
r_dietary.text <- tolower(r_dietary.text)

# Replace blank space (¡°rt¡±)
r_dietary.text <- gsub("rt", "", r_dietary.text)

# Replace @UserName
r_dietary.text <- gsub("@\\w+", "", r_dietary.text)

# Remove punctuation
r_dietary.text <- gsub("[[:punct:]]", "", r_dietary.text)

# Remove links
r_dietary.text <- gsub("http\\w+", "", r_dietary.text)

# Remove tabs
r_dietary.text <- gsub("[ |\t]{2,}", "", r_dietary.text)


# Remove blank spaces at the beginning
r_dietary.text <- gsub("^ ", "", r_dietary.text)

# Remove blank spaces at the end
r_dietary.text <- gsub(" $", "", r_dietary.text)

#--------------


#create corpus
r_dietary.text.corpus <- Corpus(VectorSource(r_dietary.text))

#clean up by removing stop words
r_dietary.text.corpus <- tm_map(r_dietary.text.corpus, function(x)removeWords(x,stopwords()))

#---------------------------
wordcloud(r_dietary.text.corpus,min.freq = 5, scale=c(7,0.5),colors=brewer.pal(8, "Dark2"),  random.color= TRUE, random.order = FALSE, max.words = 100)


##########################smoking
r_smoking<- searchTwitter("#smoking", n=1500)
r_smoking.text <- sapply(r_smoking, function(x) x$getText())    

#save data
save(r_smoking.text,file="r_smoking.text.RData")
#r_smoking.text

#------------------------------------------
r_smoking.text=str_replace_all(r_smoking.text,"[^[:graph:]]", " ") 

#convert all text to lower case
r_smoking.text <- tolower(r_smoking.text)

# Replace blank space (¡°rt¡±)
r_smoking.text <- gsub("rt", "", r_smoking.text)

# Replace @UserName
r_smoking.text <- gsub("@\\w+", "", r_smoking.text)

# Remove punctuation
r_smoking.text <- gsub("[[:punct:]]", "", r_smoking.text)

# Remove links
r_smoking.text <- gsub("http\\w+", "", r_smoking.text)

# Remove tabs
r_smoking.text <- gsub("[ |\t]{2,}", "", r_smoking.text)


# Remove blank spaces at the beginning
r_smoking.text <- gsub("^ ", "", r_smoking.text)

# Remove blank spaces at the end
r_smoking.text <- gsub(" $", "", r_smoking.text)

#--------------


#create corpus
r_smoking.text.corpus <- Corpus(VectorSource(r_smoking.text))

#clean up by removing stop words
r_smoking.text.corpus <- tm_map(r_smoking.text.corpus, function(x)removeWords(x,stopwords()))

save("r_smoking.text.corpus",file="r_smoking.text.corpus.RData")

#---------------------------
wordcloud(r_smoking.text.corpus,min.freq = 3, scale=c(7,0.5),colors=brewer.pal(8, "Dark2"),  random.color= TRUE, random.order = FALSE, max.words = 100)



