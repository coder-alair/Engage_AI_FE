#Base image
FROM node:18

#Set the working directory
WORKDIR /app

#Patch the OS
RUN apt update

#Copy the package.json and package-lock.json files
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy the rest of the application code
COPY . .

#Build the application
RUN npm run build

#Expose port 3005
EXPOSE 5173

#Start the application when container is started
CMD ["npm", "run","dev"]