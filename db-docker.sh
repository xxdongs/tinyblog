user=$1
pwd=$2
root_pwd=$pwd
if [ $# -ge 3 ]
then
root_pwd=$3
fi

docker run \
--name blog \
-p 3306:3306 \
-v C:/Users/Edgar/develop/web/site/TinyBlog/api/blog.sql:/docker-entrypoint-initdb.d/blog.sql \
-e MYSQL_ROOT_PASSWORD=$root_pwd \
-e MYSQL_USER=$user \
-e MYSQL_PASSWORD=$user \
-e MYSQL_DATABASE=blog \
-d mysql \
--default-authentication-plugin=mysql_native_password