import type { FooterGroup, LegalGroup } from "./types";

/**
 * 页脚链接（按分组组织，告别原来 15 个法律链接塞进一个段落的 UX 灾难）
 */
export const footerLinks: FooterGroup[] = [
  {
    category: { zh: "产品", en: "Product" },
    links: [
      { label: { zh: "功能特色", en: "Features" }, href: "#features" },
      { label: { zh: "应用场景", en: "Use Cases" }, href: "#usecases" },
      { label: { zh: "下载应用", en: "Download" }, href: "#download" },
    ],
  },
  {
    category: { zh: "支持", en: "Support" },
    links: [
      { label: { zh: "常见问题", en: "FAQ" }, href: "#faq" },
      { label: { zh: "版本历程", en: "Changelog" }, href: "#/timeline" },
      { label: { zh: "公告中心", en: "Announcements" }, href: "#/announcements" },
    ],
  },
  {
    category: { zh: "关于", en: "About" },
    links: [
      { label: { zh: "关于 Quiddity", en: "About Quiddity" }, href: "#hero" },
      { label: { zh: "联系我们", en: "Contact" }, href: "mailto:qu9190agent@163.com" },
    ],
  },
];

/** 品牌标语 */
export const footerSlogan = {
  zh: "知所不尽，往复不止",
  en: "Know no bounds, repeat no end",
};

export const footerDescription = {
  zh: "多模型 AI 桌面应用——你的专属 AI 伙伴。",
  en: "Multi-model AI desktop app — your personal AI companion.",
};

/** 社交链接（占位，后续接入真实账号） */
export const footerSocial = {
  github: "https://github.com/jiuan-9/jiuyu-website",
  twitter: "#",
  email: "mailto:qu9190agent@163.com",
};

/** 版权信息（年份动态生成） */
export const footerCopyright = {
  zh: (year: number) => `© ${year} Quiddity. 保留所有权利。`,
  en: (year: number) => `© ${year} Quiddity. All rights reserved.`,
};

export const footerMadeWith = {
  zh: "由 Quiddity 开发者制作",
  en: "Crafted by Quiddity Developers",
};

/** 法律入口链接文案 */
export const legalLinkText = {
  zh: "查看完整法律信息",
  en: "View Full Legal Information",
};

/**
 * 法律链接分组（解决原 Footer.tsx 中 15 个法律链接塞进一段落的 UX 灾难）
 * 按类别分组，由专门的法律页面 / 折叠组件承载
 */
export const legalGroups: LegalGroup[] = [
  {
    category: { zh: "中国法规", en: "China Regulations" },
    links: [
      {
        label: { zh: "《生成式人工智能服务管理暂行办法》", en: "Generative AI Services Management Measures" },
        url: "https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm",
      },
      {
        label: { zh: "《人工智能拟人化互动服务管理暂行办法》", en: "AI Anthropomorphic Interaction Services Management Measures" },
        url: "https://www.cac.gov.cn/2025-03/14/c_1796715804888045.htm",
      },
      {
        label: { zh: "《互联网信息服务算法推荐管理规定》", en: "Internet Information Services Algorithm Recommendation Management Provisions" },
        url: "https://www.cac.gov.cn/2021-12/31/c_1648887370382482.htm",
      },
      {
        label: { zh: "《中华人民共和国网络安全法》", en: "PRC Cybersecurity Law" },
        url: "https://www.npc.gov.cn/npc/c30834/201611/7c4d7e2c62d042d380b54e19e8b74068.shtml",
      },
      {
        label: { zh: "《中华人民共和国数据安全法》", en: "PRC Data Security Law" },
        url: "https://www.npc.gov.cn/npc/c30834/202106/9dfc6cf54f6b421597da6e72e6880880.shtml",
      },
      {
        label: { zh: "《中华人民共和国个人信息保护法》", en: "PRC Personal Information Protection Law" },
        url: "https://www.npc.gov.cn/npc/c30834/202108/0d2752b77d534b418f19b509b565ed66.shtml",
      },
      {
        label: { zh: "《中华人民共和国科学技术进步法》", en: "PRC Science and Technology Progress Law" },
        url: "https://www.npc.gov.cn/npc/c30834/202112/f73d7c95c9a448be9a4d58391450187e.shtml",
      },
      {
        label: { zh: "《未成年人网络保护条例》", en: "Regulations on Minor's Online Protection" },
        url: "https://www.gov.cn/zhengce/content/2023-10/24/content_6912294.htm",
      },
      {
        label: { zh: "《互联网信息服务管理办法》", en: "Internet Information Services Management Measures" },
        url: "https://www.gov.cn/zhengce/content/2023-02/17/content_5742864.htm",
      },
      {
        label: { zh: "《中华人民共和国电信条例》", en: "PRC Telecommunications Regulations" },
        url: "https://www.gov.cn/zhengce/content/2023-07/20/content_6899369.htm",
      },
    ],
  },
  {
    category: { zh: "国际法规", en: "International Regulations" },
    links: [
      {
        label: { zh: "GitHub 服务条款", en: "GitHub Terms of Service" },
        url: "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service",
      },
      {
        label: { zh: "《数字千年版权法（DMCA）》", en: "Digital Millennium Copyright Act (DMCA)" },
        url: "https://www.copyright.gov/legislation/dmca.pdf",
      },
      {
        label: { zh: "《美国出口管制条例（EAR）》", en: "US Export Administration Regulations (EAR)" },
        url: "https://www.ecfr.gov/current/title-15/chapter-VII/subchapter-C",
      },
      {
        label: { zh: "《欧盟人工智能法案（EU AI Act）》", en: "EU AI Act" },
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52024PC0016",
      },
      {
        label: { zh: "《通用数据保护条例（GDPR）》", en: "General Data Protection Regulation (GDPR)" },
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679",
      },
      {
        label: { zh: "《世界知识产权组织（WIPO）相关条约》", en: "WIPO Treaties" },
        url: "https://www.wipo.int/treaties/en/",
      },
      {
        label: { zh: "《伯尔尼公约》", en: "Berne Convention" },
        url: "https://www.wipo.int/treaties/en/text.jsp?file_id=283698",
      },
    ],
  },
];

/** 免责声明 */
export const disclaimer = {
  zh: "Quiddity 是一款基于第三方大语言模型 API 的 AI 聊天桌面应用，目前尚未进行任何法律备案。使用本软件时请遵守相关法律法规。本软件仅供学习交流使用，用户需自行承担使用风险，开发者不对因使用本软件产生的任何直接或间接损失承担责任。",
  en: "Quiddity is an AI chat desktop app based on third-party LLM APIs and is not yet legally registered. Please comply with applicable laws when using this software. This software is for learning and exchange purposes only. Users bear all risks associated with its use, and the developers are not liable for any direct or indirect damages arising from the use of this software.",
};

/** 免责声明标题 */
export const disclaimerTitle = {
  zh: "免责声明",
  en: "Disclaimer",
};

/** 免责声明中"目前尚未进行任何法律备案"的强调片段 */
export const disclaimerHighlight = {
  zh: "目前尚未进行任何法律备案",
  en: "not yet legally registered",
};

/** 免责声明引导句 */
export const disclaimerIntro = {
  zh: "Quiddity 是一款基于第三方大语言模型 API 的 AI 聊天桌面应用，",
  en: "Quiddity is an AI chat desktop app based on third-party LLM APIs, ",
};

/** 免责声明尾句 */
export const disclaimerOutro = {
  zh: "。使用本软件时请遵守相关法律法规。本软件仅供学习交流使用，用户需自行承担使用风险，开发者不对因使用本软件产生的任何直接或间接损失承担责任。",
  en: ". Please comply with applicable laws. This software is for learning purposes only; users bear all risks, and developers are not liable for any direct or indirect damages.",
};
