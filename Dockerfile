# Node.js imajını kullan
FROM node:20

# Çalışma dizinini belirle
WORKDIR /Users/kaangenis/Desktop/PersonalProjects/chem-lab-express-server

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm install

# Uygulama dosyalarını kopyala
COPY . .

# Uygulamayı 5226 portunda çalıştır
EXPOSE 5226

CMD ["npx", "tsc"]
# Uygulamayı başlat
CMD ["npm", "start"]