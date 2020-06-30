FROM centos:6.6

ENV PHP_VERSION 5.3.3

RUN yum install -y epel-release
RUN sed -i "s/mirrorlist=https/mirrorlist=http/" /etc/yum.repos.d/epel.repo
RUN yum install -y php php-mbstring php-xml php-mysql php-gd php-pear php-pear-Mail supervisor telnet zip ftp

WORKDIR /var/comauth/admin
COPY conf/httpd.conf /etc/httpd/conf/httpd.conf

EXPOSE 80
CMD [ "apachectl", "-D", "FOREGROUND" ]

# #
# # Apache + PHP
# #
# # 2018-03-15
# #   CentOS 7.3 + epel,remi
# #   Apache 2.4.6
# #   PHP 5.6.32
# 
# FROM centos:6
# MAINTAINER y-dobashi
# 
# # update yum
# # httpd, sshd, scp, openssl, sudo, which
# # gd-last (for php-gd)
# # git php php-pecl-memcached
# # php-pdo (for mysql)
# RUN yum update -y \
#   && yum install -y epel-release \
#   && yum install -y http://rpms.famillecollet.com/enterprise/remi-release-7.rpm \
#   && sed -i -e "s/enabled *= *1/enabled=0/g" /etc/yum.repos.d/epel.repo \
#   && sed -i -e "s/enabled *= *1/enabled=0/g" /etc/yum.repos.d/remi.repo \
#   && yum install -y \
#     httpd \
#     httpd-tools \
#     openssl \
#     sudo \
#     which \
#   && yum install --enablerepo=epel -y \
#     libmcrypt \
#   && yum install --enablerepo=remi -y \
#     gd-last \
#     remi-php56 \
#     php-pecl-memcached \
#   && yum install --enablerepo=remi-php56 -y \
#     php \
#     php-devel \
#     php-gd \
#     php-mbstring \
#     php-mcrypt \
#     php-json \
#     php-xml \
#     php-opcache \
#     php-pdo \
#     php-mysqlnd \
#     php-pecl-mysql \
#   && yum clean all \
#   && rm -rf /var/cache/yum \
#   && sed -i -e "s/;date.timezone *=.*$/date.timezone = Asia\/Tokyo/" /etc/php.ini
# 
# # composer
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# 
# # phpunit
# #RUN curl -L https://phar.phpunit.de/phpunit.phar > /usr/local/bin/phpunit && \
# #  chmod +x /usr/local/bin/phpunit
# 
# # create login user
# #RUN useradd -d /home/sysusr -m -s /bin/bash sysusr && \
# #  echo sysusr:****sysusr | chpasswd && \
# #  echo 'sysusr ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
# 
# # timezone
# RUN cp -p /usr/share/zoneinfo/Japan /etc/localtime
# 
# ENV WEBAPP_ROOT /var/comauth/admin
# 
# ADD ./conf/httpd.conf /etc/httpd/conf/httpd.conf
# 
# EXPOSE 80
# 
# CMD ["/usr/sbin/httpd","-DFOREGROUND"]
# 
