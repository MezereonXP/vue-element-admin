# 清楚服务器上的文件
ssh -i ~/ali-cloud-kxp.pem root@112.126.68.240 "rm -rf /var/www/html/*"

# scp 文件到服务器
scp -i ~/ali-cloud-kxp.pem -r dist/* root@112.126.68.240:/var/www/html/

# 重启nginx
ssh -i ~/ali-cloud-kxp.pem root@112.126.68.240 "nginx -s reload"