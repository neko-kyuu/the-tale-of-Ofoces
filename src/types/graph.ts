/**
 * 示例：
 * 1. 创建新分支：
 * {
    from: '1',        // 原始节点
    to: '3',          // 新建的节点
    type: 'branch'    // 表示这是一个分支操作
   }
 * 
 * 2. 在分支上提交：
 * {
    from: '3',        // 上一个节点
    to: '4',          // 新的提交节点
    type: 'commit'    // 表示这是一个普通提交
   }
 * 
 * 3. 合并分支：
 * {
    from: '4',        // 要被合并的节点
    to: '5',          // 合并目标节点
    type: 'merge'     // 表示这是一个合并操作
   }
 */

export interface Node {
  id: string;          // 类似 commit hash，用于唯一标识这个节点
  title: string;     // 类似 commit message
  content?: string;  // 节点的具体内容，矩形节点时显示
  timestamp: number;   // 类似 commit timestamp，用于确定提交时间顺序
  parentId?: string;   // 类似 git parent commit，表示这个节点是从哪个节点创建的
  nodeType: 'thought' | 'timestamp' | 'summary';  // 节点类型，这个是我们自定义的，用于区分普通想法、时间节点和总结
  displayType?: 'chat' | 'document'; // 用于区分是聊天记录还是文档
  path?: string; // 用于指定文档的路径，当displayType存在时有效
}

export interface Branch {
  level: number;      // 这个是用于展示的属性，决定分支在图上的垂直位置
  nodes: Node[];      // 这个分支上的所有节点
}

export interface Connection {
  from: string;      // 起始节点ID
  to: string;        // 目标节点ID
  type: 'branch' | 'merge'| 'commit';  // 连接类型：
                                       // branch: 创建新分支
                                       // merge: 合并分支
                                       // commit: 同一分支上的提交
}

export interface GraphData {
  branches: Branch[]; // 所有分支
  connections: Connection[]; // 分支之间的连接关系
} 