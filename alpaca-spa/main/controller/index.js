/* 1 定义Main模块中的Index控制器 */
Alpaca.MainModule.IndexController = {
    //index动作，创建一个视图index
    indexAction: function () {
        //视图默认渲染到#content位置，可以通过参数中传递to字段改变渲染位置
        //视图模板默认位于index/view/index/index.html,可以通过参数中传递template字段改变模块路径
        //即：默认模板位置为：[模块名]/view/[控制器名]/[动作名].html
        var view = new Alpaca.View({data:{desc:'我是一条数据，在controller中传递到view视图模版里面！'}});

        //layout 布局视图
        var layout = new Alpaca.Layout();

        //part 部件视图，默认路由位于view/layout/part中，文件名默认与name属性相同
        //part 的默认渲染位置与其name属性相同，当然也可以通过to属性指定
        var part = new Alpaca.Part({name: 'leftMenu'});

        //将part添加到layout中，part的默认渲染位置与其name属性相同，也可以通过to属性指定
        layout.addChild(part);

        //设置视图的layout
        view.setLayout(layout);

        //在view中，向layout中传递数据
        view.setLayoutData({'layoutData': 666});

        //在view中，向part中传递数据
        view.setPartData({leftMenu: {'partData': 888}});

        return view;
    },

    //index2动作，创建视图index2
    index2Action: function () {
        var view   = new Alpaca.View();
        var layout = new Alpaca.Layout();
        var part   = new Alpaca.Part({name: 'leftMenu'});
        layout.addChild(part);
        view.setLayout(layout);
        view.setLayoutData({'layoutData': '666 - 2'});
        view.setPartData({leftMenu: {'partData': '888 - 2'}});
        return view;
    },

    //index3动作，创建视图index3
    index3Action: function () {
        var view   = new Alpaca.View();
        var layout = new Alpaca.Layout();
        var part   = new Alpaca.Part({name: 'leftMenu'});
        layout.addChild(part);
        view.setLayout(layout);
        view.setLayoutData({'layoutData': '666 -- 3'});
        view.setPartData({leftMenu: {'partData': '888 -- 3'}});
        return view;
    },
};