var langGoblal, savedLang;
window.langGoblal = langGoblal;
window.savedLang = savedLang;
const i18n = {
  en: {
    htmlTitle: 'GeneSim: Simulation of Mendelian Laws of Inheritance',
    title: "Simulation of Mendelian Laws of Inheritance",
    switchTheme: "🌓 Switch Theme",
    translate: "中文",
    export: "Export Config",
    import: "Import Config",
    geneConFig: "Gene Config",
    addGene: "+ Gene",
    delete: "delete",
    addAllele: "+ Allele",
    allele: "Allele",
    showPriority: "Show Priority",
    phenoConfig: "Phenotype Config",
    parentsConfig: "Parents Config",
    father: "Father",
    mother: "Mother",
    simulation: "Start Simulation",
    simulationResult: "Simulation Result",
    sortType: "Sort Type",
    sortWithGene: "Sort by Genotype",
    sortWithProbability: "Sort by Probability",
    showType: "Show Type",
    showProbability: "Show Probability",
    showNumber: "Show Number",
    genoTypeInResult: "Gene Type",
    showTypeInResult: "Show Type",

    priority: "Priority",
    number: "Number",
  },
  zh: {
    htmlTitle: 'GeneSim: 模拟孟德尔遗传定律',
    title: "孟德尔遗传定律模拟",
    switchTheme: "🌓 切换主题",
    translate: "EngLish",
    export: "导出配置",
    import: "导入配置",
    geneConFig: "基因配置",
    addGene: "+ 基因",
    delete: "删除",
    addAllele: "+ 等位基因",
    allele: "等位基因",
    showPriority: "显性优先度",
    phenoConfig: "表型配置",
    parentsConfig: "亲本配置",
    father: "父本",
    mother: "母本",
    simulation: "开始模拟",
    simulationResult: "模拟结果",
    sortType: "排序方式",
    sortWithGene: "按基因型排序",
    sortWithProbability: "按概率排序",
    showType: "显示方式",
    showProbability: "显示概率",
    showNumber: "显示数量",
    genoTypeInResult: "基因型",
    showTypeInResult: "表型",

    priority: "概率",
    number: "数量",
  },
};

savedLang = localStorage.getItem("GeneSim.lang") || "zh";
langGoblal = savedLang === "zh" ? "en" : "zh";

function translate(lang) {
  const elements = document.querySelectorAll(".i18n");
  console.log("translating...");

  document.title = i18n[lang].htmlTitle;
  elements.forEach((element) => {
    const key = element.attributes.type.nodeValue;
    if (!i18n[lang][key])
      console.log(`Translation for "${key}" not found in "${lang}" language.`);
    element.innerHTML = i18n[lang][key] || element.innerHTML;
  });
  console.log("translated.");
  localStorage.setItem("GeneSim.lang", lang);
  savedLang = lang;
  langGoblal = lang === "zh" ? "en" : "zh";
}

function updateTranslate() {
  let lang = savedLang;
  const elements = document.querySelectorAll(".i18n");
  console.log("translating...");
  elements.forEach((element) => {
    const key = element.attributes.type.nodeValue;
    if (!i18n[lang][key])
      console.log(`Translation for "${key}" not found in "${lang}" language.`);
    element.innerHTML = i18n[lang][key] || element.innerHTML;
  });
  console.log("translated.");
}
window.onload = translate;
