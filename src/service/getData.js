import { httpPost, httpGet, upLoadFile } from "@/service/http/http";
const setpromise = (data) => {
  return new Promise((resolve, reject) => {
    resolve(data);
  });
};
export const getSiteInfo = (params) =>
  httpGet("/chat-tool/index/getSiteInfo", params); //获取站点信息 getSiteInfo
export const initRegister = (params) =>
  httpGet("/chat-tool/index/initRegister", params); //初始化注册
export const getTokenInfo = (params) =>
  httpGet("/chat-tool/index/token", params); //获取登录信息
export const getUserInfo = (params) =>
  httpGet("/chat-tool/user/getUserInfo", params); //获取用户信息
export const chatRecord = (params) => httpPost("/chatRecord", params); //聊天记录
export const addFriendApply = (params) =>
  httpPost("/chat-tool/friend/addFriendApply", params); //好友申请
export const findByUserName = (params) =>
  httpGet("/chat-tool/user/findByUserName", params); //根据用户名搜索用户
export const findByNickName = (params) =>
  httpGet("/chat-tool/user/findByNickName", params); //根据昵称搜索用户
export const confirmApply = (params) =>
  httpPost("/chat-tool/friend/confirmApply", params); //处理好友申请
export const getApplyList = (params) =>
  httpGet("/chat-tool/friend/applyList", params); //好友申请列表
export const getLaterChatMessage = (params) =>
  httpGet("/chat-tool/msg/getChatLateMsg", params); //最近聊天列表
export const groupList = (params) => httpPost("/groupList", params); //查看群组列表
export const notice = (params) => httpPost("/notice", params); //查看公告
export const register = (params) =>
  httpPost("/chat-tool/index/registry", params); //注册
export const loginSubmit = (params) =>
  httpPost("/chat-tool/index/loginSubmit", params); //登录
export const initLogin = (params) =>
  httpGet("/chat-tool/index/initLogin", params); //登录初始化
export const getApplyCount = (params) =>
  httpGet("/chat-tool/friend/getApplyCount", params); //获取好友申请数量
export const contactList = (params) =>
  httpGet("/chat-tool/friend/getFriendList", params); //获取联系人列表
export const getPublicKey = () => httpGet("/chat-tool/index/getPublicKey"); //获取公钥
export const singleChatRecord = (params) =>
  httpGet("/chat-tool/msg/chatRecord", params); //获取单人聊天记录
export const delFriend = (params) =>
  httpPost("/chat-tool/friend/delFriend", params); //删除联系人
export const entryGroup = (params) =>
  httpPost("/chat-tool/group/entryGroup", params); //同意进群
export const createGroup = (params) =>
  httpPost("/chat-tool/group/createGroup", params); //创建新群
export const sendInviteMsg = (params) =>
  httpPost("/chat-tool/msg/sendInviteMsg", params); //邀请进群
export const getGroupList = (params) =>
  httpGet("/chat-tool/group/groupListByUserId", params); // 用户所在群列表
export const getGroupRecordList = (params) =>
  httpGet("/chat-tool/msg/groupRecordList", params); // 聊天记录（群聊）
export const getGroupUserList = (params) =>
  httpGet("/chat-tool/group/groupUserList", params); // 群成员列表
export const getGroupInfo = (params) =>
  httpGet("/chat-tool/group/getGroupInfo", params); // 群信息
export const sendMsg = (params) => httpPost("/chat-tool/msg/sendMsg", params); // 发送单聊消息
export const sendGroupMsg = (params) =>
  httpPost("/chat-tool/msg/sendGroupMsg", params); // 发送群聊消息
export const getVerifyCode = (params) =>
  httpGet("/chat-tool/index/getVerifyCode", params); //发送验证码
export const updFriendInfo = (params) =>
  httpPost("/chat-tool/friend/updFriendInfo", params); //修改朋友备注
export const updateUserInfo = (params) =>
  httpPost("/chat-tool/user/updateUserInfo", params); //修改自己昵称和头像
export const topChat = (params) => httpPost("/chat-tool/msg/topChat", params); //置顶
export const getGroupFriendList = (params) =>
  httpGet("/chat-tool/friend/group/getGroupList", params); //获取好友分组
export const getGroupFriendDetailList = (params) =>
  httpGet("/chat-tool/friend/group/getGroupFriendList", params); //获取好友分组详情
export const updFriendGroup = (params) =>
  httpPost("/chat-tool/friend/group/updFriendGroup", params); //好友分组修改组名
export const delFriendGroup = (params) =>
  httpPost("/chat-tool/friend/group/delFriendGroup", params); //删除好友分组
export const addGroupUsers = (params) =>
  httpPost("/chat-tool/friend/groupUser/addGroupUsers", params); //添加好友分组成员
export const addFriendGroup = (params) =>
  httpPost("/chat-tool/friend/group/addFriendGroup", params); //创建好友分组
export const delGroupUsers = (params) =>
  httpPost("/chat-tool/friend/groupUser/delGroupUsers", params); //删除好友分组成员
export const findNotice = (params) =>
  httpGet("/chat-tool/group/findNotice", params); //查看群公告
export const editGroupNotice = (params) =>
  httpPost("/chat-tool/group/editGroupNotice", params); //编辑群公告
export const updateUserPwd = (params) =>
  httpPost("/chat-tool/user/updateUserPwd", params); //修改登录密码
export const quitGroup = (params) =>
  httpPost("/chat-tool/group/quitGroup", params); //群成员退群
export const addOrUpdateConfig = (params) =>
  httpPost("/chat-tool/user/config/addOrUpdateConfig", params); //更新用户配置
export const removeFromGroup = (params) =>
  httpPost("/chat-tool/group/removeFromGroup", params); //移除群成员
export const updateGroup = (params) =>
  httpPost("/chat-tool/group/updateGroup", params); //更新群配置
export const ajaxUpload = (params) =>
  upLoadFile("/chat-tool/common/upload/ajaxUpload", params); //更新群配置
export const recallMsg = (params) =>
  httpPost("/chat-tool/msg/recallMsg", params); //消息撤回
export const deleteGroup = (params) =>
  httpPost("/chat-tool/group/deleteGroup", params); //解散群
export const pageListByUserId = (params) =>
  httpGet("/chat-tool/msg/system/pageListByUserId", params); //系统消息列表
export const getMsgById = (params) =>
  httpGet("/chat-tool/msg/system/getMsgById", params); //系统消息详情
export const getChatSiteSettingInfo = (params) =>
  httpGet("/chat-tool/msg/system/getChatSiteSettingInfo", params); //系统公告
export const unReadNumToZero = (params) =>
  httpPost("/chat-tool/msg/unReadNumToZero", params); //未读数清空
export const verifyCodeImg = (params) =>
  httpGet("/chat-tool/index/verifyCodeImg", params); //图片验证码
export const statusCheck = (params) =>
  httpGet("/chat-tool/user/statusCheck", params); //用户状态校验
export const delChatWin = (params) =>
  httpPost("/chat-tool/msg/delChatWin", params); //删除聊天窗口
export const delMsg = (params) => httpPost("/chat-tool/msg/delMsg", params); //删除单条聊天记录
export const getFriendPage = (params) =>
  httpGet("/chat-tool/friend/getFriendPage", params); //获取联系人列表（支持搜索）
export const nickNameCheck = (params) =>
  httpGet("/chat-tool/user/nickNameCheck", params); //昵称检查
export const ajaxUploadTemp = (params) =>
  upLoadFile("/chat-tool/common/upload/ajaxUploadTemp", params); //聊天图片上传
export const findUserForFriend = (params) =>
  httpGet("/chat-tool/user/findUserForFriend", params); //搜索好友
export const editGroupNickName = (params) =>
  httpPost("/chat-tool/group/editGroupNickName", params); //修改群昵称
export const getAdminUserList = (params) =>
  httpGet("chat-tool/group/getAdminUserList", params); //获取群管理员
export const getGroupUserExcludeAdmin = (params) =>
  httpGet("chat-tool/group/getGroupUserExcludeAdmin", params); //添加管理员时获取群成员
export const toGroupAdmin = (params) =>
  httpPost("/chat-tool/group/toGroupAdmin", params); //修改群昵称
export const addGroupUser = (params) =>
  httpPost("/chat-tool/group/addGroupUser", params); //克隆时获取群成员
export const removeGroupAdminUser = (params) =>
  httpPost("/chat-tool/group/removeGroupAdminUser", params); //移除群管理员
export const getGorupListOfAdmin = (params) =>
  httpGet("/chat-tool/group/getGorupListOfAdmin", params); //添加管理员时获取群成员
export const updateUserMessageAuth = (params) =>
  httpPost("/chat-tool/group/updateUserMessageAuth", params); //单人禁言
export const getGroupUserInfo = (params) =>
  httpGet("/chat-tool/group/getGroupUserInfo", params); //查询群成员信息
export const getImgDomain = (params) =>
  httpGet("/chat-tool/common/upload/getImgDomain", params); //获取图片域名
export const unReadMsgNum = () => httpGet("/chat-tool/msg/system/unReadMsgNum"); //获取图片域名
export const editNoticeStatus = (params) =>
  httpPost("/chat-tool/group/editNoticeStatus", params); //开启或屏蔽群消息
export const recallSingleMsg = (params) =>
  httpPost("/chat-tool/msg/recallSingleMsg", params); //单聊撤回
export const inviteEnterGroup = (params) =>
  httpPost("/chat-tool/msg/inviteEnterGroup", params); //群邀请
export const editGroupAvatar = (params) =>
  httpPost("/chat-tool/group/editGroupAvatar", params); //群头像上传
export const getApplyFriendSwitch = (params) =>
  httpGet("/chat-tool/group/getApplyFriendSwitch", params); //查询群内加好友开关是否开启
