FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5226

CMD ["npx", "tsc"]

CMD ["npm", "start"]