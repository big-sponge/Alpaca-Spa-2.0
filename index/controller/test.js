/* 1 定义Index模块中的TestController */
Alpaca.IndexModule.TestController = {

	//init方法,当前控制下的所有动作在执行前，都回执行init方法
	init:function(){
		console.log('执行action之前，执行init()方法');
	},

	//release方法,当前控制下的所有动作在执行前，都回执行release方法
	release:function(){
		console.log('执行action之后，执行release)方法');
	},
};