# 安装依赖包
npm install
# 数据库的初始化
1.创建一个数据库
2.使用 ' sequelize-cli ' 初始化项目的数据库配置信息
  ' npx sequelize init '
3.生成模型文件
  1. migrate文件
  2. model 文件
   ' npx sequelize model:generate --name Todo --attributes name:string,deadline:date,content:string '
4.持久化， 模型对应的[数据库表]
  // 生成数据表
  ' npx sequelize db:migrate ' 

# 运维发布
安装 pm2    
npm i pm2 -g

// 启动服务
pm2 init
pm2 start ecosystem.congif.js
// 重启服务 
pm2 restart [id]

pm2 list 
pm2 stop
pm2 delete




