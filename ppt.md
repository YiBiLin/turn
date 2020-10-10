# 服务端开发总结

> 虽然效果不是很理想，但还是可以分享一下，避免之后大家遇上同样的问题，减少无用功。

## [eggjs](https://eggjs.org/zh-cn/)

可选框架: express,koa2,nest,egg...  
koa2: **Application,Context,Request,Response**  
express: **Application,Route,Request,Response**

> node 底层封装，需要自己实现路由转发,数据库连接等逻辑。

nest: 与 Java spring 相似，学习难度较高。

> 截图

1. 优缺点

   #### 优点

   - 阿里开发，文档易读
   - 基于 Koa 开发，学习成本较低，上手快
   - 高度可扩展的插件机制(mysql,ejs 等)

   #### 缺点

   - 强调约定(自由度不高,不遵守约定就无法运行)
   - 生产环境无法热部署，需要负载均衡支持平滑重启
   - 对 ts 支持还不够完善，引入的插件需要手动声明方法

2. 快速开发

```
$ npm init egg --type=simple
$ npm install
```

本地开发时页面与 API 不在同一端口下，请求跨域

```javascript
//cmd
$npm i egg-cors

//plugin.js
  module.exports = {
    // 跨域请求
    cors: {
      enable: true,
      package: 'egg-cors'
    }
  };

// config.local.js
  config.cors = {
    origin: `http://${localhost}:8081`,
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  };
```

3. 目录结构

官方文档描述的大致结构在简化后：

```
egg-project
├── package.json
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── response_time.js
│   ├── schedule (可选)
│   |   └── my_task.js
│   ├── public
│   |   └── xxx.png
│   ├── view
│   |   └── xxx.ejs
├── config
|   ├── plugin.js
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.local.js
|   ├── config.test.js (可选)
└── test
    └── controller
        └── home.test.js

```

package.json 依赖管理自然不用说，除去这个文件分开来看：app、config、test 三个文件夹，app 负责业务逻辑，config 项目基本配置，test 用于单元测试

```
egg-project
├── app
|   ├── router.js
│   ├── controller
│   |   └── home.js
│   ├── service
│   |   └── user.js
│   ├── middleware (可选)
│   |   └── response_time.js
│   ├── schedule (可选)
│   |   └── my_task.js
│   ├── public
│   |   └── xxx.png
│   ├── view
│   |   └── xxx.ejs

```

router、controller 解析用户的输入，处理后返回相应的结果

service 业务数据处理

middleware 中间件

schedule 定时任务

view 页面模板(ejs)

`ctx.render(viewname,param)`

> mvc 架构截图

> 所有 route 定义于 route.js 中，一条规则对应一个 controller 中的方法

```typescript
//controller
ctx.query; //获取get请求参数
ctx.requerst.body; //获取post请求参数
ctx.body = {}; //返回数据
const { service, ctx, controller, app } = this;
// or
const { service, controller } = ctx;
```

```typescript
//service(mysql)、CURD
insert(tableName: String, rows: {} | Any[]): Promise<Any>;
get(tableName: String, rows: {}): Promise<Any>;
select(tableName: String, options?: {}): Promise<Any>;
update(tableName: String, rows: {}, options?: {}): Promise<Any>;
updateRows(tableName: string, options?: Any[]);
delete(tableName: String, find: {}): Promise<Any>;

query(sql: String, values?: Any[] | {}): Promise<Any>;

beginTransactionScope(scope: Function, ctx: Context): Promise<Any>;
beginTransaction(): Promise<Any>;

count(tableName: string, options?: {}): Promise<Any>;

```

> beginTransaction 事务，返回的对象也包含 insert 等方法，需要使用该对象进行操作才能正确执行事务。

---

## [wordpress]()

PHP 语言开发的博客平台

优点：

- 安装即用，无需基础
- 插件众多，易于扩充

缺点：不利于开发

- 文档难以查找
- 需要本地搭建 php+apache+mysql 环境。
- PHP 撰写，前后端耦合，自由度不高
- 结合业务需求，需要读懂源码并修改
- 自带样式重置，可能会影响细节

### 常用的方法

获取文章

```
get_posts()
query_posts()
```

获取分类/标签

```

```

获取某文件资源

```php
//根目录
home_url();
// wp-content目录下
content_url();
// 主题文件 themes/2020/xxx.js
get_theme_file_uri('/xxx.js');
```

```php
    // 分页功能
    the_posts_pagination( array(
        'current' => $pageNum ,
        'mid_size'  => 2,
        'prev_text' => sprintf('<span class="page-prev" ></span>'),
        'next_text' => sprintf('<span class="page-next"></span>'),
    ));
```

### 目录结构

- wp-admin // 后台管理页面
- wp-content // 前台页面，包括主题文件
- wp-includes // 一些功能函数,不经常修改
- .htaccess // wordpress 生成的分布式配置文件,通常无需修改(重写转发 url)
- wp-config.php // 初始化 wordpress 时的配置，通常无需修改

### 详细结构

> **wp-content**

- plugins : 插件
  - wp-postviews : 访问数统计
  - wp-smtp : 发送邮件，注册需要
  - wp-like : 点赞插件
- themes/twentytwenty : 主题 2020 仓库
  - assets -- 主题默认资源
  - css/images/js/libs/model -- 自定义资源
  - 404.php -- 网址错误页面
  - index.php -- 首页，页面默认模板（分类页，搜索结果页等）
  - header.php -- 默认公用头部组件
  - footer.php -- 默认公用底部组件
  - searchform.php -- 搜索框组件
  - singular.php -- 文章详情页
  - template-parts/content.php -- 内容(包括搜索页,文章页等)
  - template-parts/footer-menu-widtgets.php -- 页脚菜单(出现在非自定义页面底部)

### 默认规则

- category-xxx.php -- 分类页
  > 注：xxx 为分类别名
- page-xxx.php -- 某页面模板
  > xxx 为 url 地址最后一级目录. 如 [团队页](http://in.4399ued.com/blog/team)对应 page-team.php
- header-xxx.php -- 自定义头部模板
  > get_header('xxx')方法输出该模板
- footer-xxx.php -- 同头部
  > get_footer('xxx')方法输出该模板
- get_theme_file_uri('') -- 输出当前主题下的资源路径

### 开发流程

1. 编写静态页面
2. 搭建本地 wordpress (验证 php 函数功能，也可跳过此步)
3. 更新至线上
