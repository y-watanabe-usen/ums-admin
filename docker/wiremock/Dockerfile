FROM openjdk:8-jre-alpine

ENV WIREMOCK_VERSION 2.18.0

RUN apk add --update openssl

# grab su-exec for easy step-down from root
# and bash for "bin/elasticsearch" among others
RUN apk add --no-cache 'su-exec>=0.2' bash

# grab wiremock standalone jar
RUN mkdir -p /var/wiremock/lib/ \
  && wget https://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/$WIREMOCK_VERSION/wiremock-standalone-$WIREMOCK_VERSION.jar \
    -O /var/wiremock/lib/wiremock-standalone.jar

EXPOSE 8080 8443
ENTRYPOINT ["/docker-entrypoint.sh"]

WORKDIR /home/wiremock

COPY ./docker-entrypoint.sh /
COPY ./stubs /home/wiremock

VOLUME /home/wiremock

CMD ["java", "-cp", "/var/wiremock/lib/*:/var/wiremock/extensions/*", "com.github.tomakehurst.wiremock.standalone.WireMockServerRunner"]
