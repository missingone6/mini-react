# mini-react

自己实现的迷你react，支持函数组件，支持useState、useReducer两个hooks
## Scheduler
时间分片使用 MessageChannel 实现

采用Heap堆存放任务队列。根据优先级的高低，Scheduler采用位运算取中位节点的方式，交换heap堆中任务的位置。
添加任务、移除任务会用到Scheduler中的工具方法(例如push,peek等)。

taskQueue: 存放将被处理的任务

每个任务存放Heap堆之前，会根据sortIndex,id属性进行优先级排序。

sortIndex: 值越小，优先级越高
id：是任务创建的顺序，id越小，优先级越高

基本获取任务方式：Scheduler首先peek(获取)一个taskQueue的任务并执行，完成后从任务列表中pop移除。

## Reconcile

由于Diff操作本身也会带来性能损耗，React文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的时间复杂程度也要 O(n^3)，所以react为了降低算法复杂度，他做了以下几点。

react只对同级元素进行Diff。但是同级节点通过增加，删除，替换操作来实现复用，最少需要O(n^2)。react团队觉得时间复杂度还是太高了。
所以通过标记 key 来降低复杂度，做到O(n)。如果key和type都相同，即可以复用。例如，如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。

详情可以参考本人掘金：https://juejin.cn/post/7178495331586277413


## Render

这里用到了位运算。

根据不同的Flag去执行不同的函数。比如Placement标志位为1，就去找到他的兄弟节点，使用insertBefore插入。找不到兄弟节点就找父节点，使用insertBefore方法插入

## 使用方法
npm i

npm run dev