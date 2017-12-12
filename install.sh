sudo apt-get update 
#leave mysql "root" password as empty, 
sudo apt-get install -y --no-install-recommends --no-upgrade mysql-server mysql-client 
sudo /etc/init.d/mysql start 
sudo apt-get upgrade
sudo apt-get update 
sudo apt-get install redis-server
sudo cp /etc/redis/redis.conf   /etc/redis/redis.conf.defaul
