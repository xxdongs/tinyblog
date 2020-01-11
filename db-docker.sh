docker run \
--name blog \
-p 3306:3306 \
-v C:/Users/Edgar/develop/web/site/TinyBlog/blog.sql:/docker-entrypoint-initdb.d/blog.sql \
-e MYSQL_ROOT_PASSWORD=1234 \
-e MYSQL_USER=edgar \
-e MYSQL_PASSWORD=1234 \
-e MYSQL_DATABASE=blog \
-d mysql \
--default-authentication-plugin=mysql_native_password