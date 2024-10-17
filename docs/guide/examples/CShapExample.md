---
outlime: deep
title: C#范例
---

## Dll下载

1. .NET CLI命令安装

```
dotnet add package KstopaSmartPlc --version 5.3.0
```
2. Nuget下载

Nuget上搜索 ***KstopaSmartPlc***，安装最新版本

![Nuget KstopaSmartPLC](/images/nuget_smartplc.jpg)

## API

* 回调事件

> * OnSmartCommonBytesCallBack      公共区回调
> * OnSmartEventBytesCallBack       事件区回调
> * OnSmartOtherBytesCallBack       其他区回调
> * OnSmartStateCallBack            连接状态回调
> * OnErrorCallBack                 发生错误回调

* 方法
> * HubConnectionState GetConnected()                   获取连接状态
> * Task SetHostUrl(string hostUrl)                     设置服务器Url
> * Task JoinGroup(string groupName)                    加入分组
> * Task RemoveFromGroup(string groupName)              退出分组
> * Task &lt;bool&gt; ConnectAsync(bool frist = true)   连接服务器
> * Task CloseAsync()                                   断开服务器
> * Task SendSmartCommonBytesToServiceAsync(ToClientSignalR output, object objW)    发送公共区写对象到服务器
> * Task SendSmartEventAckBytesToServiceAsync(ToClientSignalR output, object objW)  发送收到事件消息给服务器
> * Task SendSmartEventBytesToServiceAsync(ToClientSignalR output, object objW)     发送事件处理完成写对象到服务器
> * Task SendSmartOtherBytesToServiceAsync(ToClientSignalR output, object objW)     发送其他区写对象到服务器
> * Task SendSmartOtherDiffBytesToServiceAsync(ToClientSignalR output, object objW) 发送其他区写对象到服务器（整体发送，服务器端进行差异对比）
> * Task SendSmartDiffOtherBytesToServiceAsync(ToClientSignalR output,object objS, object objW) 发送其他区写对象到服务器（客户端进行差异对比后再发送给服务器）

* 静态方法 在SmartUtils类中
> * ObjToClass 将Object对象转换为指定T类型
```cs
public static T ObjToClass<T>(this object obj) where T : class
{
    if (obj == null) throw new ArgumentNullException("obj is null");
    return JsonConvert.DeserializeObject<T>(obj.ToString());
}
```
其余内置静态方法，基本不会使用到，有兴趣可以定义到源码查看。内部有差异对比方法，字节数据转换对象方法等



## 使用SmartPLC客户端

### IOC注入模式

1. 单例注入

```cs
services.RegisterSingleton<ISmartService, SmartService>();
```

> <font color="red">注意：必须单例模式</font>

2. 配置服务器Url ***SetHostUrl***

```cs
// 配置文件
<add key="debugServiceUrl" value="http://192.168.115.98:5168/"/>
// 配置服务器Url
smartService.SetHostUrl(ConfigurationManager.AppSettings["debugServiceUrl"]);
```

3. 添加监听函数

> * OnSmartCommonBytesCallBack     公共区回调
> * OnSmartEventBytesCallBack      事件区回调
> * OnSmartOtherBytesCallBack      其他区回调
> * OnSmartStateCallBack           连接状态回调
> * OnErrorCallBack                发生错误回调

```cs
smartService.OnSmartCommonBytesCallBack += OnSmartCommonBytesCallBack;
smartService.OnSmartEventBytesCallBack += OnSmartEventBytesCallBack;
smartService.OnSmartOtherBytesCallBack += OnSmartOtherBytesCallBack;
smartService.OnSmartStateCallBack += OnSmartStateCallBack;
smartService.OnErrorCallBack += OnErrorCallBack;
```

OnSmartCommonBytesCallBack使用列子

```cs
private async Task OnSmartCommonBytesCallBack(ToClientSignalR output)
{
    // 心跳
    var objR = output.DataR.CreateObj<ClassBasePublicR>();
    var objw = output.DataW.CreateObj<ClassBasePublicW>();

    // 心跳交互逻辑   PLC:1 -> Eap:1 -> PLC:0 -> Eap:0 -> PLC:1
    if (objR.Heart == 1) objw.Heart = 1; else objw.Heart = 0;

    // 手动发送给PLC
    await smartService.SendSmartCommonBytesToServiceAsync(output, objw);
}
```
OnSmartEventBytesCallBack 使用列子

```cs
public async Task OnSmartEventBytesCallBack(ToClientSignalR output)
{
    if (output.NameR == nameof(ClassOP10EventSt3R))
    {
        var objR = output.DataR.CreateObj<ClassOP10EventSt3R>();
        var objW = output.DataW.CreateObj<ClassOP10EventSt3W>();
        await smartService.SendSmartEventAckBytesToServiceAsync(output, objW);// 收到了，后续处理中
        try
        {
            // 业务逻辑
            op10DataService.InsertCpk("GlassWidth", objR.GlassWidth);
            op10DataService.InsertCpk("GlassPointDis", objR.GlassPointDis);

            objW.ClassBaseEventW.ResultCode = 1;
            objW.ClassBaseEventW.Message = "ok";
        }
        catch (Exception ex)
        {
            AppLogs.Error($"事件处理异常:{ex.Message}");

            objW.ClassBaseEventW.ResultCode = 1;
            objW.ClassBaseEventW.Message = "error";
        }
        // 发送给服务器
        await smartService.SendSmartEventBytesToServiceAsync(output, objW);
    }
}
```

OnSmartOtherBytesCallBack 使用列子
```cs
private async Task OnSmartOtherBytesCallBack(ToClientSignalR output)
{
    // 参数下发
else if (output.NameW == nameof(ClassParameterTechnology) && output.Name == "OP10")
{
    // 只有发生变化才推送给服务器
    if (parameterService.GetWriteToPlcFlag10())
    {
        var objw = output.DataW.CreateObj<ClassParameterTechnology>();

        var p = parameterService.GetParameter();
        if (p != null)
        {
            objw.ClassParameterTechnologyLimitGlassWidth.LimitL = p.Op10St3GlassWidthL;
            objw.ClassParameterTechnologyLimitGlassWidth.LimitH = p.Op10St3GlassWidthU;
            objw.ClassParameterTechnologyLimitGlassPointDis.LimitL = p.Op10St3GlassPointDisL;
            objw.ClassParameterTechnologyLimitGlassPointDis.LimitH = p.Op10St3GlassPointDisU;
            objw.ClassParameterTechnologyLimitTension.LimitL = p.Op10St4TensionL;
            objw.ClassParameterTechnologyLimitTension.LimitH = p.Op10St4TensionU;
            objw.P_T_BodySmacPress = p.Op10St4BodySmacPress;
            objw.P_T_PinSmacPress = p.Op10St4PinSmacPress;
            objw.ClassParameterTechnologyLimitWireLen.LimitL = p.Op10St5WireLenL;
            objw.ClassParameterTechnologyLimitWireLen.LimitH = p.Op10St5WireLenU;
            objw.ClassParameterTechnologyLimitBodyPointWidth.LimitL = p.Op10St5BodyPointWidthL;
            objw.ClassParameterTechnologyLimitBodyPointWidth.LimitH = p.Op10St5BodyPointWidthU;
            objw.ClassParameterTechnologyLimitBodyPinPointWidth.LimitL = p.Op10St5PinPointWidthL;
            objw.ClassParameterTechnologyLimitBodyPinPointWidth.LimitH = p.Op10St5PinPointWidthU;
            objw.ClassParameterTechnologyLimitBodyPointLen.LimitL = p.Op10St5BodyPointLenL;
            objw.ClassParameterTechnologyLimitBodyPointLen.LimitH = p.Op10St5BodyPointLenL;
            objw.ClassParameterTechnologyLimitPinPointLen.LimitL = p.Op10St5PinPointLenL;
            objw.ClassParameterTechnologyLimitPinPointLen.LimitH = p.Op10St5PinPointLenU;
            objw.ClassParameterTechnologyLimitBodyPointDis.LimitL = p.Op10St5BodyPointDisL;
            objw.ClassParameterTechnologyLimitBodyPointDis.LimitH = p.Op10St5BodyPointDisL;
            objw.ClassParameterTechnologyLimitPinPointDis.LimitL = p.Op10St5PinPointDisL;
            objw.ClassParameterTechnologyLimitPinPointDis.LimitH = p.Op10St5PinPointDisL;
            objw.ClassParameterTechnologyLimitPointDis.LimitL = p.Op10St5PointDisL;
            objw.ClassParameterTechnologyLimitPointDis.LimitH = p.Op10St5PointDisL;
            objw.ClassParameterTechnologyLimitResis.LimitL = p.Op10St6ResisL;
            objw.ClassParameterTechnologyLimitResis.LimitH = p.Op10St6ResisU;

            parameterService.SetSendToPlc10();// 设置下发PLC完成
            // 发送
            await smartService.SendSmartOtherBytesToServiceAsync(output, objw);
        }
    }
}
```

OnSmartStateCallBack 使用列子 
```cs
public async Task OnSmartStateCallBack(GetConnsOutput output)
{
    var op10 = output.ConnOutputs.FirstOrDefault(it => it.Name == "OP10");
    if (op10 != null)
    {
        SystemService.Op10State = op10.ItemStatus;
    }
    var op20 = output.ConnOutputs.FirstOrDefault(it => it.Name == "OP20");
    if (op20 != null)
    {
        SystemService.Op20State = op20.ItemStatus;
    }
    var op30 = output.ConnOutputs.FirstOrDefault(it => it.Name == "OP30");
    if (op30 != null)
    {
        SystemService.Op30State = op30.ItemStatus;
    }

    await Task.CompletedTask;
}
```

OnErrorCallBack 使用列子

```cs
private async Task OnErrorCallBack(string errMessage)
{
    AppLogs.Error(errMessage);
    await Task.CompletedTask;
}
```

4. 连接服务器并加入分组
```cs
// 连接服务器
if(await smartPlcService.ConnectAsync())
{
    await smartPlcService.JoinGroup("OP10.Common");
    await smartPlcService.JoinGroup("OP10.Event");
    await smartPlcService.JoinGroup("OP10.Other");
    await smartPlcService.JoinGroup("OP20.Common");
    await smartPlcService.JoinGroup("OP20.Event");
    await smartPlcService.JoinGroup("OP20.Other");
    await smartPlcService.JoinGroup("OP30.Common");
    await smartPlcService.JoinGroup("OP30.Event");
    await smartPlcService.JoinGroup("OP30.Other");
    OnDialogClosed(ButtonResult.Ignore);
}
else
    OnDialogClosed(ButtonResult.No);
```

5. 退出程序前断开服务器连接
```cs
public async Task Exit()
{
    var smartplc = ContainerLocator.Container.Resolve<ISmartService>();
    // 断开服务器
    await smartplc.CloseAsync();
    if (Application.Current is IAppTaskBar appTaskBar)
        appTaskBar.Dispose();

    //Environment.Exit(0);
    Application.Current.Shutdown();
}
```

### 简单使用，程序没有使用IOC容器

需要手动new一个单例的对象，后续使用参考上述方法