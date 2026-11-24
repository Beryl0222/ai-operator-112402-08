# 多摄像头输入的低精度空间重排与可逆交接

项目资料使用可独立读写的 JSON。Node.js 22.23.4 下运行 `npm ci --offline` 准备环境，然后运行 `npm run inspect` 检查合成数据字段，运行 `npm test` 校验样本引用及格式。

## 输入契约

输入 uint8 采用 HWC，坐标指统一网格，不随条带偏移。空间到深度相位顺序 y0x0、y0x1、y1x0、y1x1，每个相位内按输入通道。源值=(码值-zero)*scale。统一输出量化取 nearest ties to even，并夹至 [0,255]，缺位用 zero 且标无效。接收方 profiles 对允许的量化形式作约束。独立指数格式保留原码值与源尺度，将实际量化值解释回实数。模型块领取后的输出由调用方持有，待领内部副本与状态计设备预算。 源比例和零点随相位传播，统一格式以 scale 和 zero 为准。源缓冲回用后不能再通过原 tile 内容读回已领取的像素。

## 资料读取

样本位于 `inputs/session.json`，其中 `events` 是按到达顺序记下的操作，编号从零开始。fragment、reuse 指输入缓冲对应的片 ID；read、accept、inverse 依次给出接收方和以块计的 x、y 索引。
