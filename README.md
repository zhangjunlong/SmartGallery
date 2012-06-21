Smart Gallery | 智能媒体展示库
特性：
－ 基于HTML5技术栈
－ 基于纯网页技术，支持任何WEB服务器发布
－ 支持智能移动设备，包括苹果iOS、Andorid和BlackBerry等
－ 支持定义多个媒体库

使用说明
1.安装与部署
解压缩SmartGallery.zip到WEB服务器的根目录，启动WEB服务器；
尝试在浏览器中访问http://localhost/SmartGallery，正常常情况下可显示预置的图片库。
用户可以根据需要更改发布目录，复制SmartGallery内所有内容至需要发布的目录即可。

2.定义媒体库和添加内容
a. 定义媒体库
进入SmartGallery/gallery目录，用文本编辑器打开该目录下的layout.properties文件。
默认情况下可以看到以下内容：
	## Gallery Layout/ Albums list here
	new_arrival:新品上市:gallery
	review:精品回顾:gallery
	video:走秀视频:videos
	news:最新动态:news
此文件描述了系统将创建的媒体库的信息，每一行代表一个媒体库的定义（“＃”开头为注释）。
每条描述包含三个信息：库媒体文件存放目录、媒体库名称和媒体库类型。
每条合法的描述必须包含此三项，各项之间按顺序用“:”隔开（注意使用半角字符），每定义一个库，应该相应的在此目录下新建所声明名称的目录。
目前支持的媒体库类型有gallery（图片库）、videos（视频库）和news（混合内容－文本、图片和视频库）。
用户可以按照规则自行定义多个媒体库，定义的库将自动显示在主页上。
b. 添加内容
定义好媒体库以后就可以向库中添加需要展示的媒体文件了，用户可以直接把媒体文件添加到相应的目录下完成发布。
要使添加后的媒体文件在页面中显示，除了添加文件外，还需要在媒体库目录下的list.properties中进行声明，
以默认库“最新动态”为例，在news目录下，有43.jpg、DGVI_bdp.html和news.txt三个文件，相应地，在此
目录下list.properties内容如下：
	##list file name here
	news.txt
	43.jpg
	DGVI_bdp.html
此文件每行代表一个需要显示的媒体文件——直接声明媒体文件的文件名，只有声明后的文件才在页面显示。
＊对于视频文件，系统将显示一个视频的封面。此封面需要用户提供一个与声明的视频文件名相同的png图片文件，
比如视频文件名为“video1.mp4”，那么应该提供一个“video.mp4.png”图片作为封面。

定义媒体库和添加内容都无需重启WEB服务器，客户端刷新后即可看到更改