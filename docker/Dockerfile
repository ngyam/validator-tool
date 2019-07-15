FROM node:8

WORKDIR /app/

COPY ./entrypoint.sh ./

RUN npm install ewf-validator-tool

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
