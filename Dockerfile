FROM node:20-alpine

WORKDIR /alura-amf-backend

COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 3333

ENV TZ="UTC"
ENV PORT="3333"
ENV HOST="localhost"
ENV LOG_LEVEL="info"
ENV APP_KEY="-1WOYkYtlWLejS9_OonabOTsokg1CCnO"
ENV NODE_ENV="development"
ENV DB_HOST="127.0.0.1"
ENV DB_PORT="5433"
ENV DB_USER="postgres"
ENV DB_PASSWORD="postgres"
ENV DB_DATABASE="alura-amf-db"
ENV ADMIN_PASSWORD="senha_admin"
ENV SMTP_EMAIL="marco.a.lmc.16@gmail.com"
ENV SMTP_EMAIL_PASSWORD="iddh vlun pmya nzah"
ENV SMTP_HOST="smtp.gmail.com"
ENV SMTP_PORT="587"
ENV SMTP_SECURE="false"

COPY . .


CMD ["npm", "run", "dev"]
