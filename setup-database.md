# 🚀 数据库设置指南 - 解决表不存在错误

## ⚠️ 当前问题
你遇到的错误表明数据库表还没有创建：
- `Could not find the table 'public.study_sessions'`
- `404 (Not Found)` 错误

## 🔧 解决方案：通过Supabase控制台设置（最简单）

### 第1步：访问Supabase控制台
1. 打开浏览器，访问：https://supabase.com/dashboard
2. 登录你的账户
3. 选择项目：`brxfkttyajyawgkwvlfl`

### 第2步：执行数据库迁移
1. 点击左侧菜单的 **"SQL Editor"**
2. 点击 **"New query"** 创建新查询
3. 复制粘贴下面的完整SQL代码到编辑器中
4. 点击 **"Run"** 按钮执行

### 第3步：复制这段SQL代码
```sql
-- 完整的数据库架构创建脚本
-- 请复制下面的全部内容到Supabase SQL Editor中执行

## 方法2：使用Supabase CLI

```bash
# 安装Supabase CLI
npm install -g supabase

# 登录Supabase
npx supabase login

# 链接到你的项目
npx supabase link --project-ref brxfkttyajyawgkwvlfl

# 推送数据库架构
npx supabase db push
```

## 设置完成后

1. 启动开发服务器：`npm run dev`
2. 访问 http://localhost:5173
3. 点击"没有账户？立即注册"
4. 使用邮箱和密码注册新账户
5. 检查邮箱验证邮件（可能在垃圾邮件文件夹）
6. 验证后即可登录

## 测试账户（可选）

如果你想快速测试，可以在Supabase控制台的Authentication页面手动创建测试用户。