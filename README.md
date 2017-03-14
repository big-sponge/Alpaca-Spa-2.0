# Alpaca-Spa-2.0

## 第一部分，快速入手

### 1.  Alpaca-spa-2.0.js简介

&emsp;&emsp;Alpaca-spa.js，是一款轻量的前端JS框架，提供前端路由功能，前端视图渲染功能。目的用于提高web项目开发的效率，同时使的前端代码结构更加整洁。使用Alapca-spa.js可以实现web项目的前后分离开发，有助于进行前端模块化开发，有助于前端实现代码复用功能等。

目前Alpaca-spa.js 依赖 jquery.js。使用Alpaca-spa.js 需要引用


1). Alpaca-spa-2.0.js&emsp;下载地址（或者直接在代码中引用）：   http://spa.tkc8.com/common/js/alpaca-spa-2.0.js <br>
2). jquery.js&emsp;&emsp;&emsp;&emsp;&emsp;下载地址（或者直接在代码中引用）：   http://spa.tkc8.com/common/js/jquery-2.1.4.min.js

### 2. 示例，加载Alpaca-spa

&emsp;&emsp;任意位置新建一个文件 index.html。在文件中编辑以下内容代码，保存，双击运行。结果会在浏览器空白页面中显示 “Welcome to use Alpaca SPA. ”，说明Alapca-spa.js加载成功。

代码：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-Spa-2.0 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script src="http://spa.tkc8.com/common/js/jquery-2.1.4.min.js" type="text/javascript"></script>
    <script src="http://spa.tkc8.com/common/js/alpaca-spa-2.0.js" type="text/javascript"></script>
    <link rel="shortcut icon" href="favicon.png">
    <script>
        $().ready(function(){
            Alpaca.run();
        });
    </script>
</head>
<body>
</body>
</html>

```

### 3. 示例，使用路由

&emsp;&emsp;新建html文件，编辑以下代码，保存，双击运行。然后在url地址后面分别加上 #/test/index/test1，#/test/index/test2. 回车后查看运行结果。

&emsp;&emsp;通过上面两个例子，我们发现，使用alpaca-sap.js 可以使url中的路由映射到代码中的js方法。 映射规则如下:

&emsp;&emsp;url地址: &emsp;&emsp;&emsp;&emsp;/#/[模块名]/[控制器名]/[动作名]
&emsp;&emsp;对应代码中的:&emsp;模块Module.控制器Controller.动作Action

### 4. 示例，使用代码调用路由，按钮，```<a>```标签等

按钮:&emsp;&emsp;&emsp;&emsp;指定按钮的onclick属性  ``` onclick='Alpaca.to("#/test/index/test2") ;```

```<a>```标签： &emsp;``` <a href="#/test/index/test2" >测试</a>```

### 5. 示例，使用模板，渲染数据

Alpaca-spa.js使用了dot.js数据模板引擎，并且优化了部分语法的表现形式。

新建html文件，编辑下面的代码内容。在下面的代码中，我们使用了  Alpaca.Tpl( option ) 方法，其中参数option.data是要渲染的数据，option.from 是模板的位置，option.to 是渲染的目标位置。

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-Spa-2.0 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script src="http://spa.tkc8.com/common/js/jquery-2.1.4.min.js" type="text/javascript"></script>
    <script src="http://spa.tkc8.com/common/js/alpaca-spa-2.0.js" type="text/javascript"></script>

    <script>
        $().ready(function () {
            var data = {"name": "Cheng", "age": 26 ,like:['Coding','thinking','eating'],isMan:true };
            Alpaca.Tpl( {data:data ,from:"#template", to:"#content" });
        });

    </script>

    <script id='template' type="text">
        <div>Name <?spa echo it.name ?>!</div>
        <div>Age:<?spa echo it.age ?>!</div>

        <div>Like: </div>
        <?spa foreach( it.like as key => value ) ?>
            <div> <?spa echo key ?> : <?spa echo value ?> </div>
        <?spa endForeach ?>

        <div>isMan:
        <?spa if( it.isMan == 1) { ?>
            男
        <?spa }else{ ?>
            女
        <?spa } ?>
        </div>
    </script>
</head>
<body>
<div id='content'></div>
</body>
</html>
```
双击运行，在浏览器中查看结果


###6. 获取路由参数

<pre>
  例如 路由地址 #/test/index/test4/123 ，

  获取模块名：                   Alpaca.Router.Module        // test

  获取控制器名：                 Alpaca.Router.Controller    //index

  获取动作名：                   Alpaca.Router.Action        //test4

  获取路由中的其他参数：         Alpaca.Router.Params[0]     //123
</pre>




























