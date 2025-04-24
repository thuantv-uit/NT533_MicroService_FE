FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# COPY frontend.properties /app/config/frontend.properties
EXPOSE 3000
CMD ["npm", "start"]
