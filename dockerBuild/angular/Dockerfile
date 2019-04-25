FROM node:lts-alpine
RUN npm install -g @angular/cli
WORKDIR "/usr/src"
COPY "build_and_run.sh" ./
RUN chmod +x build_and_run.sh
RUN mkdir app
VOLUME ["/usr/src/app"]
EXPOSE 4200
CMD ["/usr/src/build_and_run.sh"]
