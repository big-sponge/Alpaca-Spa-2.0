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

Alpaca-spa.js使用了dot.js数据模板引擎，并且优化了部分语法的表现形式。Alpaca 支持 {{ XXX }}, 与<?spa XXX  ?>两种语法格式

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


模板位置和要渲染的位置一样的时候，可以直接使用place 指定位置，而不用from，to,注意这中情况建议使用 {{ XXX }} 语法格式

```var data = {name:" Hello World! "};
   Alpaca.Tpl({data:data,place:'body'});
```

### 6. 获取路由参数

<pre>
  例如 路由地址 #/test/index/test4/123 ，

  获取模块名：                   Alpaca.Router.Module        // test

  获取控制器名：                 Alpaca.Router.Controller    //index

  获取动作名：                   Alpaca.Router.Action        //test4

  获取路由中的其他参数：         Alpaca.Router.Params[0]     //123
</pre>


## 第二部分，高级示例

### 1. 使用视图模板

在介绍使用视图功能之前，我们先介绍一下使用Alpaca-Spa.js推荐的目录结构。

注： 使用alpaca.js推荐的目录结构，需要使用web服务器，例如apache, nginx等，将网站的根目录设置为下图的alpacaSpaDemo目录

实例中使用的web服务器将 127.0.0.33 地址指向了alpacaSpaDemo目录


![图片名称](http://www.tkc8.com/index_files/Image%20[4].png)

参考上图，

<pre>
1. 图中的 alpacaSpaDemo是所有文件的根目录。

2. alpacaSpaDemo目录里面有两个子目录，三个html文件。
   common                        common目录是用来放公共资源，本示例中不使用。
   test                                 test目录是代表一个模块，在本示例中用来帮助大家熟悉视图模板的使用。
   index-view.html            本示例中，我们使用index-view.html文件。
   index.html                     示例一使用的文件
   index-router-hl.html     示例二使用的文件

3.test 目录里面有两个目录 controller ， view。一个js文件
   controller   用来存放test模块的控制器的js代码。里面有一个控制器js文件，index.js
   view            用来存放test模块的视图部分的js代码。里面有一个子目录index，index目录用户存放index控制器对应的模板。本示例中，有两个模板test3.html. test4.html
   test.js          test.js是test模块的模块级别的js代码。稍后会介绍里面可以填写哪些内容。
</pre>

下面介绍本示例的具体代码

1 alpacaSpaDemo/index-view.html 的代码如下

注意引用 test/test.js，test/controller/index.js

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-Spa</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script src="http://spa.tkc8.com/common/js/jquery-2.1.4.min.js" type="text/javascript"></script>
    <script src="http://spa.tkc8.com/common/js/alpaca-spa-2.0.js" type="text/javascript"></script>

    <script src="test/test.js" type="text/javascript"></script>
    <script src="test/controller/index.js" type="text/javascript"></script>

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

2 alpacaSpaDemo/test/test.js 的代码如下,本实例中，我们只是定义了一个模块

```
/* 1 定义模块 */
Alpaca.TestModule = {};

```

3 alpacaSpaDemo/test/controller/index.js 的代码如下,本实例中，定义了两个action，每个action中，分别 使用了 return new View（）；用来返回页面模板。默认情况下返回文件名与Action名相同的模板文件。

```
/* 1 定义Test模块中的Controller ,并且定义两个action方法，test1，test2*/
Alpaca.TestModule.IndexController = {
   test3Action : function (){
      return new View();
   },

   test4Action : function (){
      return new View();
   },
};
```
4 alpacaSpaDemo/test/view/index/test3.html代码 ， 访问相应的url之后，test3.html中内容会被填充到<body></body>中，后面会介绍如何使模板内容渲染到页面其他位置。

```
<div> This is View for test3 </div>
```

5 alpacaSpaDemo/test/view/index/test4.html代码 ， 访问相应的url之后，test3.html中内容会被填充到<body></body>中，后面会介绍如何使模板内容渲染到页面其他位置。

```
<div> This is View for test4 </div>

```


在浏览器中访问url  http://127.0.0.33/index-view.html#/test/index/test3 ， http://127.0.0.33/index-view.html#/test/index/test4


在上面的例子中，我们发现，Action中使用 return new View( ) 方法可以默认返回一个与Action同名的视图模板，并且，将该视图模板渲染到了页面中的<body></body>中。



## 第三部分，高级视图使用方法

### 1. 向视图模板中传递数据

Controller中代码如下： 使用  View({name:'Cheng'}); 或者 view.setData({name:'Sponge'}); ，向相应的模板中传递数据。

```
Alpaca.TestModule.IndexController = {
    test3Action : function (){
        var view = new Alpaca.View({data:{name:'Cheng'}});
        return view;
    },

    test4Action : function (){
        var view = new Alpaca.View();
        view.setData({name:'Sponge'});
        return view;
    },
};

```

在模板中，使用数据渲染语句处理传递过来的数据。例如在，test3.html中 代码如下：

```
<div> This is View for test3 .Name <?spa echo it.name ?></div>
```

浏览器中运行结果如下：


当然，可以使用其他的复杂语法，来渲染复杂的数据、页面。


### 2.自定义模板视图的渲染位置

使用 setCaptureTo("#destination") 方法可以指定渲染位置

```
var view = new Alpaca.View();
view.setCaptureTo("#destination");
return view;

```

### 3.使用Layout（公共）模板

使用 setUseLayout(true) 方法，为视图指定默认的layout模板。使用Layout模板时，Layout默认会被渲染到<body></body>， Action返回的视图默认会被渲染到 <div id="content"></div> 中。

```
var view = new View({data:{name:'Cheneg'}});
view.setUseLayout(true);
return view;
```

默认layout模板的位置位于 模块目录/view/layout/layout.html




关于自定义layout部分内容，在以后的章节中介绍。


### 4.使用子视图模板

使用   ```new ViewPart('leftMenu',"#id-left-menu"); ``` 创建一个名为leftMenu，渲染到#id-left-men位置的子视图。子视图模板的默认位置位于目录： 模块 /view/layout/part/ 中，文件名默认与子视图的名字相同，例如，在本示例中为 leftMenu.html

```
var view = new Alpaca.View({data: {name: 'Sponge'}});
var part = new Alpaca.Part({name: 'leftMenu'});
view.addChild(part);
return view;
```
模板位置：


关于自定义part部分内容，在以后的章节中介绍。

### 5.view.ready()方法，视图渲染结束后执行的方法

通过指定view的ready方法，可以实现视图渲染结束后执行的方法，建议把模板中js代码部分写到这里。

```
var view = new Alpaca.View({data: {name: 'Sponge'}});
view.ready(function(){
    alert('ready');
});
return view;
```

### 6.模块 init（） 方法。

执行当前模块中所有Action之前，会执行模块的init（）方法

### 7.控制器 init（） 方法。

执行当前控制器中所有Action之前，会执行模块的init（）方法


### 8. 自定义视图显示效果

下面的示例代码，实现了视图渲染后的闪入效果

```
var view = new Alpaca.View({data: {name: 'Sponge'}});
view.show=function (captureTo, html) {
    var that = this;
    $(captureTo).fadeOut("fast", function () {
        $(captureTo).html(html);
        $(captureTo).fadeIn("fast", function () {
            that.onLoad();
        });
    });
};
return view;

```
可以看出，通过使用 view的 show方法可以自定义视图的渲染效果。

注意，在自定义视图显示效果时，视图渲染结束后需要调用 onLaod 事件，来触发ready函数。


[未完待完善中 。。。]


交流方式：

QQ群： 298420174

![图片名称](http://www.tkc8.com/index_files/Image%20[10].png)

作者： Sponge
邮箱： 1796512918@qq.com

























