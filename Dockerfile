FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y     python3     curl     && rm -rf /var/lib/apt/lists/*

RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp     -o /usr/local/bin/yt-dlp &&     chmod a+rx /usr/local/bin/yt-dlp

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
