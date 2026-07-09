import { useState } from "react";
import { ArrowLeft, Sparkles, Bug, Zap, Shield, Code, Users, Eye, Palette, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const versionData = [
  {
    version: "v1.1.0",
    date: "2026-07",
    status: "latest",
    title: "AI 人设精调",
    description: "引入精调引擎，将用户描述自动编译为最佳 System Prompt，创造专属 AI 角色",
    features: [
      { icon: Palette, text: "AI 人设精调引擎" },
      { icon: Code, text: "System Prompt 自动优化" },
      { icon: Shield, text: "AES 本地加密存储" },
      { icon: Eye, text: "图片上传支持" },
    ],
    color: "brand",
  },
  {
    version: "v1.0.5",
    date: "2026-06",
    status: "stable",
    title: "多模型扩展",
    description: "新增多家 AI 服务商支持，一键切换引擎，一个应用畅享所有模型",
    features: [
      { icon: Users, text: "新增 5 家 AI 服务商" },
      { icon: Zap, text: "API 连接测试" },
      { icon: Code, text: "代码块优化" },
    ],
    color: "green",
  },
  {
    version: "v1.0.0",
    date: "2026-05",
    status: "stable",
    title: "正式发布",
    description: "九语正式发布，简洁直观的桌面 AI 体验，每个细节都精心打磨",
    features: [
      { icon: Globe, text: "11 家 AI 服务商接入" },
      { icon: Code, text: "代码高亮显示" },
      { icon: Bug, text: "基础功能完善" },
    ],
    color: "blue",
  },
  {
    version: "v0.9.0",
    date: "2026-04",
    status: "beta",
    title: "公测版本",
    description: "公开测试，收集用户反馈，优化核心体验",
    features: [
      { icon: Eye, text: "消息气泡优化" },
      { icon: Code, text: "Markdown 支持" },
    ],
    color: "yellow",
  },
  {
    version: "v0.5.0",
    date: "2026-03",
    status: "alpha",
    title: "内测版本",
    description: "内部测试，验证核心功能和架构稳定性",
    features: [
      { icon: Zap, text: "基础聊天功能" },
      { icon: Users, text: "多会话管理" },
    ],
    color: "purple",
  },
];

const colorMap = {
  brand: { bg: "bg-brand-500/10", border: "border-brand-500/30", text: "text-brand-400", glow: "shadow-brand-500/10" },
  green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", glow: "shadow-green-500/10" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/10" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", glow: "shadow-yellow-500/10" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/10" },
};

export default function Timeline() {
  const [activeVersion, setActiveVersion] = useState(0);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/50 to-dark-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-500/[0.02] blur-[150px]" />

        <div className="container relative z-10 mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-dark-400 hover:text-brand-400 hover:bg-white/[0.05] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">版本历程</h1>
              <p className="text-xs text-dark-500">记录九语的成长轨迹</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/30 via-white/[0.05] to-transparent" />

              <div className="space-y-8">
                {versionData.map((version, index) => {
                  const colors = colorMap[version.color as keyof typeof colorMap];
                  const isLeft = index % 2 === 0;

                  return (
                    <div key={version.version} className="relative">
                      <div
                        className={`absolute ${
                          index === 0 ? "left-6 md:left-1/2" : isLeft ? "left-6" : "md:right-6"
                        } top-0 w-3 h-3 rounded-full ${colors.bg} ${colors.border} border-2 -translate-x-1/2 z-10`}
                      />

                      <div className={`flex flex-col ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} items-start gap-6`}>
                        <div className={`flex-1 ${isLeft ? "md:pr-16" : "md:pl-16"}`}>
                          <div
                            className={`p-5 rounded-xl ${colors.bg} border ${colors.border} hover:shadow-lg hover:${colors.glow} transition-all duration-300 cursor-pointer`}
                            onClick={() => setActiveVersion(index)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${colors.text}`}>{version.version}</span>
                                {version.status === "latest" && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-500/20 text-[9px] font-bold text-brand-400">
                                    <Sparkles size={8} className="mr-0.5" />
                                    LATEST
                                  </span>
                                )}
                                {version.status === "beta" && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-500/20 text-[9px] font-bold text-yellow-400">
                                    BETA
                                  </span>
                                )}
                                {version.status === "alpha" && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-500/20 text-[9px] font-bold text-purple-400">
                                    ALPHA
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-dark-500">{version.date}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2">{version.title}</h3>
                            <p className="text-xs text-dark-400 mb-4">{version.description}</p>

                            <div className="flex flex-wrap gap-2">
                              {version.features.map((feature) => (
                                <div
                                  key={feature.text}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] text-[11px] text-dark-300"
                                >
                                  <feature.icon size={10} className={colors.text} />
                                  {feature.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">版本统计</h2>
              <p className="text-xs text-dark-400">九语的成长数据</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-5 rounded-xl glass">
                <div className="text-3xl font-bold text-white mb-1">5</div>
                <div className="text-[11px] text-dark-400">版本发布</div>
              </div>
              <div className="text-center p-5 rounded-xl glass">
                <div className="text-3xl font-bold text-white mb-1">3</div>
                <div className="text-[11px] text-dark-400">个月迭代</div>
              </div>
              <div className="text-center p-5 rounded-xl glass">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-[11px] text-dark-400">核心功能</div>
              </div>
              <div className="text-center p-5 rounded-xl glass">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-[11px] text-dark-400">下载量</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}