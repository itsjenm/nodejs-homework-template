# which environment am i going to create
FROM node:18

# where is all the code going to lie in this environment
WORKDIR /app

# what is needed for this environment to run properly, and where are we storing it
COPY package*.json /app/

# what command is needed to run for this app to work
RUN npm install

# what code am i copying, and where is it going
# first dot - copy everything 
# second dot - put it in the root directory
COPY . .
# send over any env variables to the environment
ENV PORT=3000
# what port is our environment listening for
EXPOSE 3000
# how do we start the app
CMD [ "npm": "start" ]




