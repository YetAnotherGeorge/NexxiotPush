-- > mysql -u root -p 
-- > source /scripts/create-kdev.sql
CREATE USER 'kdev'@'%' IDENTIFIED BY 'kdevpassword';
GRANT ALL PRIVILEGES ON *.* TO 'kdev'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

