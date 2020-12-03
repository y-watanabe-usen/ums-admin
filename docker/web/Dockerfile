FROM centos:6.6

ENV PHP_VERSION 5.3.3

# timezone
RUN cp -p /usr/share/zoneinfo/Japan /etc/localtime

RUN sed -i "s|#baseurl=|baseurl=|g" /etc/yum.repos.d/CentOS-Base.repo \
  && sed -i "s|mirrorlist=|#mirrorlist=|g" /etc/yum.repos.d/CentOS-Base.repo \
  && sed -i "s|http://mirror\.centos\.org/centos/\$releasever|https://vault\.centos\.org/6.6|g" /etc/yum.repos.d/CentOS-Base.repo

RUN yum update -y \
  && yum install -y epel-release \
  && sed -i "s/mirrorlist=https/mirrorlist=http/" /etc/yum.repos.d/epel.repo \
  && yum install -y \
    ftp \
    openssl \
    php \
    php-devel \
    php-gd \
    php-mbstring \
    php-mysql \
    php-pear \
    php-pear-Mail \
    php-xml \
    supervisor \
    telnet \
    zip \
  && yum clean all \
  && rm -rf /var/cache/yum \
  && sed -i -e "s/;date.timezone *=.*$/date.timezone = Asia\/Tokyo/" /etc/php.ini

WORKDIR /var/ums/ums-admin
COPY conf/httpd.conf /etc/httpd/conf/httpd.conf
COPY data /data
RUN chmod 777 -R /data

EXPOSE 80
CMD [ "apachectl", "-D", "FOREGROUND" ]
