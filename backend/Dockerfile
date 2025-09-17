FROM node:20-alpine

WORKDIR /app

# Устанавливаем системные зависимости
RUN apk add --no-cache bash

# Устанавливаем глобальные npm пакеты
RUN npm install -g tsx node-pg-migrate

# Копируем package files для кэширования слоев
COPY package*.json ./

# Устанавливаем зависимости проекта
RUN npm install

# Копируем и настраиваем start скрипт
COPY start.sh ./
RUN chmod +x start.sh

# Копируем остальной код приложения
COPY . .

EXPOSE 3000

CMD ["./start.sh"]