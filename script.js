function _updateTranslate() {
  updateTranslate();
}

let genes = [],
  geneIdCounter = 0;

function getLetterCase(n) {
  let letters = "";
  while (n > 0) {
    n--;
    const remainder = n % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    n = Math.floor(n / 26);
  }
  return [letters.toUpperCase(), letters.toLowerCase()];
}

function addGene() {
  const geneId = getLetterCase(geneIdCounter + 1);
  const newGene = {
    id: geneIdCounter++,
    symbol: "",
    name: `gene-${geneIdCounter}`,
    alleles: [
      {
        name: geneId[0],
        priority: 2,
      },
      {
        name: geneId[1],
        priority: 1,
      },
    ],
    phenotypes: {},
  };
  genes.push(newGene);
  updateUI();
}

function addAllele(geneId) {
  const gene = genes.find((g) => g.id === geneId);
  const newName = String.fromCharCode(65 + gene.alleles.length);
  gene.alleles.push({
    name: newName,
    priority: 1,
  });
  updateUI();
}

function deleteGene(geneId) {
  genes = genes.filter((g) => g.id !== geneId);
  updateUI();
}

function deleteAllele(geneId, index) {
  const gene = genes.find((g) => g.id === geneId);
  if (gene.alleles.length > 2) {
    gene.alleles.splice(index, 1);
    updateUI();
  } else {
    alert(
      savedLang === "zh"
        ? "每个基因至少需要保留二个等位基因"
        : "Each gene must have at least two alleles"
    );
  }
}

function generateGenotypeCombinations(gene) {
  const alleles = gene.alleles.map((a) => a.name);
  const combinations = [];
  for (let i = 0; i < alleles.length; i++) {
    for (let j = i; j < alleles.length; j++) {
      combinations.push([alleles[i], alleles[j]].sort().join(" "));
    }
  }
  return [...new Set(combinations)];
}

function getDefaultPhenotype(gene, genotype) {
  const alleles = genotype.split(" ");
  return getDominantAllele(gene, alleles);
}

function updateGeneProp(geneId, prop, value) {
  const gene = genes.find((g) => g.id === geneId);
  gene[prop] = value;
  updateUI();
}

function updateAlleleProp(geneId, index, prop, value) {
  const gene = genes.find((g) => g.id === geneId);
  gene.alleles[index][prop] = prop === "priority" ? Number(value) : value;
  updateUI();
}

function updatePhenotype(geneId, genotype, value) {
  const gene = genes.find((g) => g.id === geneId);
  if (value) gene.phenotypes[genotype] = value;
  else delete gene.phenotypes[genotype];
}

function updateUI() {
  saveSelections();
  renderGeneConfig();
  renderPhenotypeConfig();
  renderParentConfig();
  restoreSelections();
  _updateTranslate();
}

function saveSelections() {
  selectionCache = {};
  genes.forEach((gene) => {
    ["father", "mother"].forEach((parent) => {
      [1, 2].forEach((num) => {
        const select = document.getElementById(`${parent}-${gene.id}-${num}`);
        if (select) {
          selectionCache[`${parent}-${gene.id}-${num}`] = select.value;
        }
      });
    });
  });
}

function restoreSelections() {
  genes.forEach((gene) => {
    ["father", "mother"].forEach((parent) => {
      [1, 2].forEach((num) => {
        const select = document.getElementById(`${parent}-${gene.id}-${num}`);
        const cachedValue = selectionCache[`${parent}-${gene.id}-${num}`];
        if (select) {
          const validOptions = gene.alleles.map((a) => a.name);
          select.value = validOptions.includes(cachedValue)
            ? cachedValue
            : validOptions[0];
        }
      });
    });
  });
}

function renderGeneConfig() {
  const container = document.getElementById("genes-container");
  container.innerHTML = genes
    .map(
      (gene) => `
        <div class="gene-panel">
          <div>
              <input
                value="${gene.name}"
                onchange="updateGeneProp(${gene.id}, 'name', this.value)"
              >
              <br>
              <button class="delete-btn" onclick="deleteGene(${gene.id})"><span class="i18n" type="delete">删除</span></button>
              <button onclick="addAllele(${gene.id})"><span class="i18n" type="addAllele">+ 等位</span></button>
          </div>
          ${gene.alleles
          .map(
            (allele, index) => `
            <div class="allele-panel">
              <div>
                <span class="i18n" type="allele"></span>-${index + 1}:
                <br>
                <input
                  value="${allele.name}"
                  onchange="updateAlleleProp(${gene.id}, ${index}, 'name', this.value)"
                >
                <br>
                <span class="i18n" type="showPriority"></span>:
                <br>
                <input
                  type="number" value="${allele.priority}"
                  onchange="updateAlleleProp(${gene.id}, ${index}, 'priority', this.value)"
                >
                <br>
                <button
                  class="delete-btn"
                  onclick="deleteAllele(${gene.id}, ${index})" ${gene.alleles.length <= 1 ? "disabled" : ""}>
                  <span class="i18n" type="delete"></span>
                </button>
              </div>
            </div>
          `
          )
          .join("")}
        </div>
    `
    )
    .join("");
}

function createSelectors(parentType, gene) {
  return [1, 2]
    .map(
      (n) => `
    <select id="${parentType}-${gene.id}-${n}"
            style="margin: 2px;">
        ${gene.alleles
          .map(
            (a) => `
            <option value="${a.name}">${a.name}</option>
        `
          )
          .join("")}
    </select>
`
    )
    .join("");
}
function renderPhenotypeConfig() {
  const container = document.getElementById("phenotype-container");
  container.innerHTML = genes
    .map(
      (gene) => `
        <div class="gene-phenotype-panel">
          <h4>${gene.name}</h4>
          ${generateGenotypeCombinations(gene)
          .map(
            (genotype) => `
            <div class="phenotype-input">
              ${genotype}:
              <input
                value="${gene.phenotypes[genotype] || ""}"
                onchange="updatePhenotype(${gene.id}, '${genotype}', this.value)"
                placeholder="${getDefaultPhenotype(gene, genotype)}"
              >
            </div>
          `
          )
          .join("")}
        </div>
      `
    )
    .join("");
}

function renderParentConfig() {
  const container = document.getElementById("parents-container");
  container.innerHTML = `
        <div>
            <h4><span class="i18n" type="father"></span></h4>
            ${genes
      .map(
        (gene) => `
                <div>
                    <label>${gene.name}:</label>
                    ${createSelectors("father", gene)}
                </div>
            `
      )
      .join("")}
        </div>
        <div>
            <h4><span class="i18n" type="mother"></span></h4>
            ${genes
      .map(
        (gene) => `
                <div>
                    <label>${gene.name}:</label>
                    ${createSelectors("mother", gene)}
                </div>
            `
      )
      .join("")}
        </div>
    `;
}

function calculateOffspring() {
  const fatherGametes = getGametes("father"),
    motherGametes = getGametes("mother"),
    geneSum = fatherGametes.length * motherGametes.length,
    results = {};

  //console.log(fatherGametes, motherGametes)
  fatherGametes.forEach((fg) => {
    motherGametes.forEach((mg) => {
      const genotype = [],
        phenotype = [];

      genes.forEach((gene, idx) => {
        const alleles = [fg.alleles[idx], mg.alleles[idx]],
          geno = alleles.sort().join(" "),
          pheno = gene.phenotypes[geno] || getDominantAllele(gene, alleles);

        genotype.push(alleles.sort().join(" "));
        phenotype.push(pheno);
      });

      //console.log(genotype, phenotype)
      const genotypeStr = genotype.join(" "),
        phenotypeStr = phenotype.join(" "),
        probability = fg.probability * mg.probability,
        key = `${genotypeStr}|${phenotypeStr}`;

      //console.log(genes,genotypeStr, phenotypeStr, probability, key)
      if (!results[key]) results[key] = [0, 0];
      results[key] = [
        (results[key][0] || 0) + probability,
        (results[key][1] || 0) + geneSum * probability,
      ];
    });
  });

  return results;
}

function getGametes(parentType) {
  return genes.reduce((acc, gene) => {
    const alleles = [
      document.getElementById(`${parentType}-${gene.id}-1`).value,
      document.getElementById(`${parentType}-${gene.id}-2`).value,
    ];

    const uniqueAlleles = [...new Set(alleles)],
      combinations = uniqueAlleles.map((a) => ({
        allele: a,
        prob: 1 / uniqueAlleles.length,
      }));

    if (acc.length === 0) {
      return combinations.map((c) => ({
        alleles: [c.allele],
        probability: c.prob,
      }));
    }
    return acc.flatMap((g) =>
      combinations.map((c) => ({
        alleles: [...g.alleles, c.allele],
        probability: g.probability * c.prob,
      }))
    );
  }, []);
}

function getDominantAllele(gene, alleles) {
  return alleles.reduce((prev, curr) => {
    const prevAllele = gene.alleles.find((a) => a.name === prev),
      currAllele = gene.alleles.find((a) => a.name === curr);
    return currAllele.priority > prevAllele.priority ? curr : prev;
  });
}

function displayResults(results) {
  const sortType = document.getElementById("sortType").value,
    showType = document.getElementById("showType").value,
    resultArray = Object.entries(results),
    sortFunctions = {
      genotype: (a, b) => !a[0].split("|")[0].localeCompare(b[0].split("|")[0]),
      probability: (a, b) => b[1][0] - a[1][0],
    };

  const sortedResults = resultArray.sort(sortFunctions[sortType]);

  document.getElementById("results").innerHTML = `
        <table>
            <tr>
              <th>
                <span class="i18n" type="genoTypeInResult">
              </th>
              <th>
                <span class="i18n" type="showTypeInResult">
              </th>
              <th>
                <span class="i18n" type="${showType === "probability" ? "priority" : "number"}">
              </th>
            </tr>
            ${resultArray
      .map(([key, prob]) => {
        const [genotype, phenotype] = key.split("|");
        return `
                    <tr>
                        <td>${genotype}</td>
                        <td>${phenotype}</td>
                        <td>
                          ${showType === "probability"
            ? (prob[0] * 100).toFixed(2)
            : prob[1]
          }
                          ${showType === "probability" ? "%" : ""}
                        </td>
                    </tr>
                `;
      })
      .join("")}
        </table>
    `;
}

function runSimulation() {
  displayResults(calculateOffspring());
  _updateTranslate();
}

function exportConfig() {
  const config = {
    version: 1,
    genes: genes.map((gene) => ({
      id: gene.id,
      name: gene.name,
      alleles: gene.alleles.map((a) => ({
        name: a.name,
        priority: a.priority,
      })),
      phenotypes: gene.phenotypes,
    })),
    parents: {
      father: genes.map((gene) => ({
        geneId: gene.id,
        alleles: [
          document.getElementById(`father-${gene.id}-1`).value,
          document.getElementById(`father-${gene.id}-2`).value,
        ],
      })),
      mother: genes.map((gene) => ({
        geneId: gene.id,
        alleles: [
          document.getElementById(`mother-${gene.id}-1`).value,
          document.getElementById(`mother-${gene.id}-2`).value,
        ],
      })),
    },
  };

  const dataStr = JSON.stringify(config, null, 2);
  const blob = new Blob([dataStr], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `GeneSim_config_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importConfig(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target.result);
      if (!config.genes || !config.parents) {
        throw new Error(
          savedLang === "zh"
            ? "无效的配置文件格式"
            : "Invalid config file format"
        );
      }

      genes = config.genes.map((g) => ({
        id: g.id,
        name: g.name,
        alleles: g.alleles.map((a) => ({
          name: a.name,
          priority: a.priority,
        })),
        phenotypes: g.phenotypes || {},
      }));
      geneIdCounter =
        genes.length > 0 ? Math.max(...genes.map((g) => g.id)) + 1 : 0;

      updateUI();

      config.parents.father.forEach((parentGene) => {
        const gene = genes.find((g) => g.id === parentGene.geneId);
        if (gene) {
          [1, 2].forEach((num, idx) => {
            const select = document.getElementById(`father-${gene.id}-${num}`);
            if (select) {
              const validAlleles = gene.alleles.map((a) => a.name);
              select.value = validAlleles.includes(parentGene.alleles[idx])
                ? parentGene.alleles[idx]
                : validAlleles[0];
            }
          });
        }
      });

      config.parents.mother.forEach((parentGene) => {
        const gene = genes.find((g) => g.id === parentGene.geneId);
        if (gene) {
          [1, 2].forEach((num, idx) => {
            const select = document.getElementById(`mother-${gene.id}-${num}`);
            if (select) {
              const validAlleles = gene.alleles.map((a) => a.name);
              select.value = validAlleles.includes(parentGene.alleles[idx])
                ? parentGene.alleles[idx]
                : validAlleles[0];
            }
          });
        }
      });
    } catch (error) {
      alert(
        `${savedLang === "zh" ? "导入失败" : "Import failed"}: ${error.message}`
      );
    }
  };
  reader.readAsText(file);
}

window.onload = addGene;
