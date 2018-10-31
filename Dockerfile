FROM ubuntu:18.04



RUN apt update
RUN apt install -y openjdk-8-jdk maven


RUN useradd -ms /bin/bash http
USER http
WORKDIR /home/http


COPY --chown=http:http jetty-distribution-9.3.9.v20160517 jetty
COPY --chown=http:http webpage-src jetty/demo-base/webapps/marvinjs
COPY --chown=http:http webservices.war jetty/demo-base/webapps/
COPY --chown=http:http post-tcp-proxy post-tcp-proxy
COPY --chown=http:http webservices-license.cxl .chemaxon/license.cxl
RUN cd post-tcp-proxy && mvn package && mv target/post-tcp-proxy-1.0.war ../jetty/demo-base/webapps/chem-server.war


EXPOSE 8080/tcp

ARG MAPPER_ADDR
ARG MAPPER_PORT
ENV MAPPER_ADDR "$MAPPER_ADDR"
ENV MAPPER_PORT "${MAPPER_PORT:-2727}"


CMD bash -c 'cd jetty/demo-base/ && /usr/lib/jvm/java-1.8.0-openjdk-amd64/bin/java -Xmx1G -jar ../start.jar'
