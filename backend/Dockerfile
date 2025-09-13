FROM node:20-alpine

WORKDIR /app

# Устанавливаем bash
RUN apk add --no-cache bash

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install && npm install -g tsx node-pg-migrate

# Копируем скрипт и делаем исполняемым
COPY start.sh ./
RUN chmod +x start.sh

# Копируем остальные файлы
COPY . .

EXPOSE 3000

CMD ["./start.sh"]