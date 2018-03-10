安装：
安装nodejs 8.X
npm install
运行客户端
修改src/client/js/Game.js里面_getServerUrl的地址
npm run build
运行服务端
node src/server/Server.js

# jfddz
尖峰斗地主小游戏

这是给各位参与开发的小伙伴们看的文档 :innocent: ：

## 项目安装与调试

#### 1. 如何编译
- 安装nodejs,git
- 进入git bash,在项目根目录下运行

```
npm install
npm run build
```

#### 2.开发调试
- 进入git bash,在项目根目录下运行

```
npm run debug
```
- 在浏览器中打开localhost:8080开始调试

## git开发流程

#### 1.注册码云账号
- 去[码云](http://git.oschina.net/)上注册账号
- 把码云上的账号ID告诉我，我把你的账号加入此项目的开发者列表

#### 2.设置git账号名、邮箱
- 在git bash里设置你的账号名，邮箱(使用码云的昵称和注册时用的邮箱)

```
git config --global user.name yourname
git config --global user.email youremail
git config --global core.autocrlf false
```

#### 3.clone项目到本机
- 开发的话只需要克隆dev分支到本地

```
git clone -b dev https://git.oschina.net/qq44547734/jfddz.git
```

#### 4.建立自己的分支，开发，完成后合并到dev分支
- 为了减少不必要的checkin,开发都在本机分支上做，做完以后合并到dev分支上去

```
//首先拉取最新的远程dev分支
git pull origin dev:dev
//在干净的代码上建立自己的分支
git checkout -b mybranch dev
//在自己的分支上add,commit
git add .
git commit ...
//开发好了之后，再次拉取远程dev分支到本地dev分支上
git pull origin dev:dev
//合并dev分支的代码
git merge dev
//再把自己的分支合并到dev分支上
git checkout dev
git merge --squash mybranch (为了将你自己分支上的提交记录去掉)
git commit (在这里总结本次merge你做的改动)
//将本次修改push到远程dev分支
git push origin dev:dev
//删除本次自己的开发分支
git branch -D mybranch
```
- git merge --squash mybranch之后的commit尽量写详细点，第一行写个概述，后面空一行再写详细信息，格式如下：


> 概述信息空行
>
> 空行
>
> 这里是详细信息

- --squash的作用可以看这里[https://segmentfault.com/q/1010000002477106](https://segmentfault.com/q/1010000002477106)
- 为什么要弄得这么麻烦，看文章[http://blog.jobbole.com/76867/](http://blog.jobbole.com/76867/)

#### 5.什么时候merge dev到master上
每2周一个小版本，周四晚上将一个发布分支（看[http://blog.jobbole.com/76867/](http://blog.jobbole.com/76867/)里面有）弄到master上