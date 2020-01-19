#### nextjs项目的创建
- 手动创建
    此项目使用的手动创建
- create-next-app
> npm i -g create-next-app
// 创建
> npx create-next-app projectname
> yarn create next-app projectname
> create-next-app projectname

#### next作为koa中间件
- nextjs自身带有服务器，只处理ssr
- 处理http请求，并根据请求数据返回相应的内容
无法处理
- 数据接口
- 数据库连接
- session状态