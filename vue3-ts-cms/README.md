# 后台管理系统
## token 登录  
  
### 图解  
当用户点击登录按钮后    
  
![图解](https://api2.mubu.com/v3/document_image/e993d6a4-5829-4159-bbaf-7120afff1224-11752736.jpg)  
  
### 详细过程  
1. 在登录页点击登录的时候，前端会带着用户名和密码去调用后端的登录接口.    
  
![过程1](https://cdn.jsdelivr.net/gh/jsdevin/imgBed/img/202206232225710.png)    
  
`formRef.value?.validate()`是验证form表单中输入的账号密码是否符合表单规则(比如密码需要在3个数字以上),如果验证通过返回true,然后就会将值传输给validate里的箭头函数的valid形参.      
图中有一个dispatch函数，它的作用机理是调用store中action的方法，然后通过action的方法调用mutation方法，再通过mutation方法改变state，达到改变state中数据的目的。    
[关于dispatch的详细介绍点这里](https://www.jianshu.com/p/ef348d1c8f2b)  
  
2. 后端收到请求，验证用户名和密码，验证失败，会返回错误信息，前端提示相应错误信息，如果验证成功，就会给前端返回一个token  
3. 前端拿到token，将token储存到Vuex和localStorage中，并跳转页面，即登录成功  
![过程3](https://api2.mubu.com/v3/document_image/9eececc4-d391-41af-9229-65a8bb9f2e9a-11752736.jpg)  
  
1. 前端每次跳转至需要具备登录状态的页面时，都需要判断当前token是否存在，不存在就跳转到登录页，存在则正常跳转(通常封装在路由守卫中)  
2. 另外，在向后端发送其他请求时，需要在请求头中带上token(项目中通常封装在请求拦截器中)，后端判断请求头中有无token，有则验证该token，验证成功就正常返回数据，验证失败(如已过期)则返回相应错误码。前端拿到错误信息，清除token并回退至登录页。  
  
### 补充：token、cookie、sessionStorage、localStorage  
[Token放在 cookie, sessionStorage 和 localStorage 中的区别](https://blog.csdn.net/qq_48960335/article/details/117674525)    
  
token 存储于 localStorage 中，长期有效，只要不删掉就都有效。容易受到xss攻击  
token 存储于 sessionStorage 中，短期有效，浏览器关闭自动删除。容易受到xss攻击  
token 存储于 cookie 中，调用接口就会自动发送。容易受到CSRF攻击  
  
  
> xss攻击：是一种注入代码攻击，通过在网站里注入script代码，当访问者浏览网站的时候通过注入的script代码窃取用户信息，盗用用户身份等  
> CSRF: 跨站点请求伪造，攻击者盗用已经认证过的用户信息，以用户信息的名义进行操作(转账，购买商品等),由于身份已经认证过了，所以网站会认为此操作是用户本人操作。 CSRF 并不能拿到用户信息，但它可以盗用用户的凭证进行操作。  
  
  

## 权限管理    
权限控制，虽说这是后端要实现的内容，但是我们了解一下也不妨。  

权限控制是后台管理系统中核心的知识点，动态路由与之也有关系，权限控制决定着动态路由能显示的内容。  
    
它的效果是使得不同的角色看到不同的内容，假设超级管理员是权限最高的角色，那么它就可以看到后台管理系统中所有的内容，而一般管理员是权限较低角色，仅能看到部分内容，  

按照此项目系统为例，超级管理员是可以看到`系统总览、系统管理、商品中心、随便聊聊`四个模块内容的，而一般管理员仅能看到`商品中心、随便聊聊`两个模块的内容。      
    
### 后端设计逻辑    
权限控制一般是由后端人员来实现的，为了更好地理解权限控制和扩展一下知识，我们去学习一下它。    
    
权限控制的后端逻辑原理是**基于角色的访问控制**（RBAC: role based access control）。  

一头雾水，怎么理解呢？   
基于**角色**的访问控制 中的角色指的是角色表。       
一般来说，权限控制后端会由四张表来实现，分别是用户表、角色表、关系表、权限表(也就是菜单表)    
    
用户表 是干嘛的呢？      
用户表就是用来存储用户信息(废话)，当我们在系统中注册一个用户的时候，用户的信息(账号密码)就会存储在用户表中，当然在注册用户的时候，我们会给它分配一个角色。  
（为了方便理解，我们就假设每一个用户只有一个角色，那么用户对角色就是一对一的关系）。    
    
![用户表与角色表的关系](https://api2.mubu.com/v3/document_image/bbbf18f1-916d-4a51-841c-389670bc5663-11752736.jpg)    
    
到此我们就知道了用户表和角色表的关系，然后我们只需要给不同的角色分配不同的权限即可。

给不同的角色分配不同的权限，理论上来说我们只需要角色表和权限表即可，但是角色和权限通常是多对多的关系，一个角色可能有多个权限，一个权限可能归属于多个角色，  
 所以通常在角色表和权限表之间我们还会添加一个关系表，关系表中存储的是角色和权限的关系。为了方便理解，我们假设没有关系表。    
    
![角色表 ~ 权限表](https://api2.mubu.com/v3/document_image/692505c2-8df9-4150-9344-bf1670dc89cc-11752736.jpg)    
  
至此，后端的权限管理逻辑实现了。    
  
权限管理实际流程:      
1. 从接口处获得对应用户的权限：    
    用户输入账号密码进行请求登录，登录成功之后返回特定的id和token以及userInfo`(用户信息)`, userInfo信息中会包含role`(角色)`，由role我们也就可以获得了该角色的id和name,有了角色的id和name，我们就可以确定userMenus`(权限)`。       
  
2. 有了具体的userMenus，**接下来就是前端的活了**。需要注意的是，用户所具有的权限就是菜单项所要展示的，所以用户权限 == 菜单项    
  

### 权限展示(动态路由) 
不同的角色有着不同的权限，不同的权限对应着左侧不同的菜单，通过动态路由来展示角色的权限控制。

#### 预期效果    
    
![动态路由需要实现的效果](https://api2.mubu.com/v3/document_image/de0f68e7-dfd8-412c-a09b-1ee432014244-11752736.jpg)    

1. 动态路由：用户点击菜单项A、S、F、E、T, main部分会依次显示菜单项A、S、F、E、T对应的页面。动态路由就是菜单和路由的映射关系。      
    
2. 简单说明动态路由**实现原理**：      
    用户点击了菜单项A，我们就能获得菜单项A对应的url`(也就是路径path)`，然后我们将路径path替换到地址栏中，浏览器就会访问地址栏path对应的component，通过`<router-view />`占位，我们可以将component内容替换到`<router-view />`占据的位置    
    
动态路由演示：    
![演示动态路由](https://api2.mubu.com/v3/document_image/e5850cd9-6c06-444f-bb2f-54593fa2ea21-11752736.jpg)  
 
#### 实现方式  
##### 方法一：写死所有的路由    
  
<img src='https://api2.mubu.com/v3/document_image/68f9edeb-dfc5-48a4-b49f-181c07a46e6f-11752736.jpg' style='width: 200px;'>  
  
以上图**系统管理**模块中四个小功能为例，假设超级管理员的权限是全部功能可见，而一般管理员权限仅仅可见用户管理和角色管理，  

以方法一来实现动态路由，就是不管你什么角色什么权限，四个小功能的路由直接写死，全部注册在系统管理路由的children下，  

因为超级管理员有四个组件文件，而一般管理员只有两个组件文件，所以最终显示的效果就是超级管理员有四个功能，而一般管理员仅仅有两个功能。  
  
```js  
// router 的index.js文件中  
  
const routes = [  
    ...  
    {  
        path: '/systemManege',  
        name: 'systemManege',  
        component: () => import('@/views/systemManege/systemManege.vue'),  
        children: [ // 直接将系统管理下的四个小功能写死，全注册了  
            {  
                path: '/userManege',  
                component: () => import('@/views/systemManege/userManege.vue')  
            },  
            { // 一般管理员没有这个文件，所以不渲染出来，列表也不显示  
                path: '/depManege',  
                component: () => import('@/views/systemManege/depManege.vue')   
            },  
            { // 一般管理员没有这个文件，所以不渲染出来，列表也不显示  
                path: '/menuManege',  
                component: () => import('@/views/systemManege/menuManege.vue')   
            },  
            {  
                path: '/roleManege',  
                component: () => import('@/views/systemManege/roleManege.vue')  
            },  
        ]  
    },  
  
]  
```  
  
方法一的缺陷：  
直接写死所有的小功能，会将路由全部注册，一般管理员虽然看不到部门管理和菜单管理的按钮，但是可以通过在**地址栏**手动输入路由`/systemManege/depManege`去到**本来不能访问**的页面。  
  
  
##### 方法二：给不同角色注册不同的路由  
给不同角色的children预先注册好不同的path
  
![方法2](https://api2.mubu.com/v3/document_image/f9ed54ff-b4fa-40b7-98bc-a1b5a584913b-11752736.jpg)  
  
动态路由实现原理：    
用户登录成功后，接口会返回信息userInfo，从userInfo中我们可以得到登陆的用户的角色role.name，    
已知角色，我们就可以去查询并得知它具有的权限，然后将其权限`二级菜单项`(相对于给了url)动态地添加到数组route中,   
然后**由url去寻找path,再由path去确定component**，最终将component页面渲染出来即可。  
  
看似很完美，解决了方法一中注册多余路由的问题，其实方法2还是存在缺陷的。  
  
方法2的缺陷：  
对于需要**新增大量角色**的场景，非常麻烦，比如我又新增了一个运营角色，它又有了新功能，我们就要去**修改前端的/router/index.ts文件下的/main/children属性代码，然后重新部署**，每新增一个角色都需要修改一次代码然后重新部署，维护起来非常不好。  
  
  
##### 方法三：由菜单url动态生成路由映射  
  
![方法3](https://api2.mubu.com/v3/document_image/ba4d8f59-d428-4ceb-9a35-712d25d92a97-11752736.jpg)  
  
实现原理：    
登录成功后，从接口返回的信息获得userMenus，userMenus下有各自菜单项的url, 我们需要去获取url, url的信息就是该菜单项的路由信息，可由路由信息(path)渲染特定的component组件，`path和component存在映射关系`，将这种映射关系添加到router/index.ts文件的数组routes中，然后动态地将这种**映射关系**添加到main组件的children属性中，就实现了动态路由。  
   
优势：  
方法三的实现原理是依据url来展开的，解决了方法二创建新对象需要去修改代码的麻烦，因为我方法三是依据给出的url来实现动态路由的，只要新建对象的userMenus里面存在url,我就能实现成功，不管你新增了什么功能，都会有对应的url，对于我来说是不需要去动别的代码的。  
  
示例：  
1. 一级菜单的url  
  
![一级菜单](https://api2.mubu.com/v3/document_image/e3ea46fe-cec1-490a-8f86-b97630d7e055-11752736.jpg)  
  
2. 二级菜单(菜单项)的url  
  
![二级菜单项](https://api2.mubu.com/v3/document_image/3916c97a-3168-4e58-968f-86a4864faf9d-11752736.jpg)  
  
本项目动态路由实现方式采用的是方法三。  

#### 代码实现  
##### 步骤一：创建 component 和 path  
 在views中创建二级菜单项的.vue文件，在router创建二级菜单项组件的path信息    
  
以系统管理下的菜单管理menu为例    
![.vue文件](https://api2.mubu.com/v3/document_image/26fe25b7-5372-4288-9f13-38352039bdab-11752736.jpg)  
  
![path信息](https://api2.mubu.com/v3/document_image/2fce0aaa-0526-4588-a59f-0e94b0f12a74-11752736.jpg)  
  
```ts  
// router/main/system/menu/menu.ts  
const menu = () => import('@/views/main/system/menu/menu.vue')  
export default {  
  path: '/main/system/menu',  
  name: 'menu',  
  component: menu,  
  children: []  
}  
  
```  
  
搞定了path和component后，我们就可以着手去实现动态路由了    
  
##### 步骤二：获取接口返回的所有菜单url  
获取所有菜单的url信息

![获取url](https://api2.mubu.com/v3/document_image/3867da57-9c16-440a-9461-53391ae7cbc8-11752736.jpg)  
  
在store/login/login.ts文件下引入mapMenusToRoutes函数，然后在changeUserMenus中使用mapMenusToRoutes函数即可得到所有的url信息，结果如下图所示：    
  
<img src='https://api2.mubu.com/v3/document_image/fa96d6e4-b105-4532-bb21-763ee9197b1f-11752736.jpg' style='width: 400px; height: 500px' alt='userMenus => routes'>    
<!-- ![userMenus => routes](https://api2.mubu.com/v3/document_image/fa96d6e4-b105-4532-bb21-763ee9197b1f-11752736.jpg) -->  
  
结果：    
<img src='https://api2.mubu.com/v3/document_image/d5744fb6-598d-47f8-a645-6beac775572c-11752736.jpg' style='width: 400px; height: 200px' alt='所有的url'>    
<!-- ![所有的url](https://api2.mubu.com/v3/document_image/d5744fb6-598d-47f8-a645-6beac775572c-11752736.jpg) -->  
  
##### 步骤三：处理返回的菜单url  
1. 将url都添加到allRouter中    
```ts  
// map-menus.ts  
import { RouteRecordRaw } from 'vue-router'  
  
export function mapMenusToRoutes(userMenus: any[]): RouteRecordRaw[] {  
  const routes: RouteRecordRaw[] = []  
  
  // 1. 先去加载默认所有的routes  
  const allRouters: RouteRecordRaw[] = []  
  // require.context()是webpack支持的方法，  
  // 第一个参数是文件夹的路径，第二个参数是是否需要递归，第三个参数是查找目标的条件  
  const routeFiles = require.context('../router/main', true, /\.ts/) // 这里的意思是在router的main文件夹下递归查找所有的ts文件  
    
  // 将url都添加到allRouter中  
  // routeFiles.keys()会返回string数组，其中的string就是我们的路径信息  
  routeFiles.keys().forEach((key) => {  
    const route = require('../router/main' + key.split('.')[1])  
    allRouters.push(route.default)  
  })  
  console.log(allRouters) // 打印所有路径  
    
  // 2.根据菜单获取需要添加的url，然后全部添加到route数组中  
  
  return routes  
}  
```  
  
结果：  
![allRouter](https://api2.mubu.com/v3/document_image/a03c209c-9ee2-400d-889f-150e76c20d86-11752736.jpg)  
  
2. 根据菜单获取需要添加的菜单项url，然后全部添加到第四行的route数组中, 并return出去  
  
![递归添加url到route数组中](https://api2.mubu.com/v3/document_image/6ca42963-1e70-4d26-b93a-da60067f1f33-11752736.jpg)  
  
在store/login/login.ts的changeUserMenus函数中用routes来接收mapMenusToRoutes返回的数组routes  
![routes逻辑](https://api2.mubu.com/v3/document_image/2c11439e-d403-4a8f-bac4-12fe7a1434ce-11752736.jpg)  
  
routes打印测试结果如下：  
![routes结果](https://api2.mubu.com/v3/document_image/6d13c5d1-a372-4e50-902e-ab096a7f0ddd-11752736.jpg)  
  
  
在store/login/login.ts的changeUserMenus函数中遍历routes，将其每一项添加到已知路由的children属性中，等待用户点击菜单项发送url确定要调用的哪个path, 然后调用对应的component来渲染即可，由此形成动态路由。  
![在changeUserMenus中遍历routes](https://api2.mubu.com/v3/document_image/45aef192-c02b-4c7c-8323-3a1dd157cdb1-11752736.jpg)  
  
子路由添加方法router.addRoute()发挥作用的实际位置(这里实际上是不需要写children，为了直观位置，我写出来标明助于理解)：  `views/router/index.ts`文件     
![子路由注册的实际位置](https://api2.mubu.com/v3/document_image/6e2af80c-0351-4445-aab8-c10fba09f2c1-11752736.jpg)  
  
  
main下的children属性子路由path添加完成，至此动态路由的跳转逻辑以及完成了。    

接下来就要去菜单模板组件中**模拟用户点击菜单项**即可，由菜单项url和路由path以及组件的关系，确定需要渲染的组件。比如点击了菜单项A，就要将菜单项A的url添加到router中，由router根据url去选择path, 由path确定需要渲染的组件，然后由`<router-view />`确定最终显示的位置。  
  
##### 步骤四：模拟用户点击菜单项  
需要实现的效果：点击菜单项，就跳转到该菜单项对应的页面。  
  
这一步骤在`nav-menu.vue`菜单模板组件中完成, 首先我们需要给菜单项绑定一个点击事件@click，一旦点击，就将该菜单项的url添加到router中，然后由`<router-view />`占据的位置显示出来。  

我们先来了解一下nav-menu的具体内容：    
![nav-menu](https://api2.mubu.com/v3/document_image/9d36b449-bfe5-429d-a6b7-f1abfcf29aef-11752736.jpg)  
  
然后了解@click事件，@click负责将路由和组件的映射关系添加到router中    
![@click事件](https://api2.mubu.com/v3/document_image/649fae40-87b4-46ad-9036-6bc1841ad5af-11752736.jpg)  
  
总结：    
**先** 创建好二级菜单项的component组件和组件对应的router信息，  
**然后** 获取所有菜单的url信息并添加到main路由下的children属性中，  
**最后** 在菜单模板组件的二级菜单项对应的模板处设置一个@click事件，实现一点击某菜单项就将其url添加到router中，由url可获得path进而获取到特定的component，然后将component渲染到`<router-view />`占据的位置。  
  
点击不同的菜单项，就会向router中添加不同的url，进而获取不同的component来渲染出不同的页面，由此实现了动态路由。  
  
最终动态路由演示：   
   
![演示动态路由](https://api2.mubu.com/v3/document_image/e5850cd9-6c06-444f-bb2f-54593fa2ea21-11752736.jpg)  
  

## 分层开发 - 高复用组件
分层开发：  

![分层](https://api2.mubu.com/v3/document_image/878848b1-5ab8-4295-b717-555bbc62d095-11752736.jpg)

HyForm组件、page-search组件等等都是公共组件，  
假如想要弄一个user.vue页面，只需要创建一些配置文件，然后使用这些公共组件可以很快构建出来页面，  
如果需要进行组件间的通信，比如page-search组件和page-content组件需要传输数据，可以先将数据用emit发送到user组件，然后在user组件中绑定给page-content标签，再在page-content组件中用props接收即可。  
