# Imagem base Node.js
FROM node:16

# Instalar dependências do sistema para compilar o 'canvas'
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libjpeg62-turbo-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho no container
WORKDIR /usr/src/app

# Copiar os arquivos do projeto para o container
COPY package*.json ./
COPY . .

# Instalar as dependências do Node.js
RUN npm install

# Expor a porta que o servidor irá rodar
EXPOSE 3000

# Iniciar o servidor
CMD ["npm", "start"]