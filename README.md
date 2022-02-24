<h1 align="center">Instagram</h1>

# Backend

## 初始化

## 初始化 Postgres Docker

```bash
# 1. 创建 docker
docker run --name [container_name] -e POSTGRES_PASSWORD=[db_password] -p 5432:5432 -d postgres

# 2. 进入 docker 环境
docker exec [container_id] -it bash

# 3. 连接 postgres 数据库
psql -h localhost -p 5432 -U postgres -W

# 4. 创建 instagram 数据库
CREATE DATABASE instagram
```

## 初始化后端开发环境

```bash
# 1. 初始化 node 项目
yarn init -y

# 2. 安装 TS 开发环境
yarn add --dev nodemon ts-node typescript @types/node

# 3. 安装 Apollo 后端依赖包
yarn add apollo-server graphql
```

## 更新 package.json scripts

```diff
+ "scripts": {
+    "dev": "nodemon --exec ts-node index.ts"
+ },
```
