const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'src/lib/colorTheory.ts'), 'utf8');

const transpiled = content
  .replace(/export\s+(function|interface|type|const)/g, '$1')
  .replace(/:\s*(string|number|RGB|HSL|ColorRecommendation|HarmonyType)\[\]/g, '')
  .replace(/:\s*(string|number|RGB|HSL|ColorRecommendation|HarmonyType)/g, '')
  .replace(/<.*?>/g, '')
  .replace(/\s*\?\s*/g, '')
  .replace(/\b(hsl:|rgb:|type:|name:|colors:)\s*/g, '$1 ')
  .replace(/interface.*?{[\s\S]*?}/g, '')
  .replace(/type.*?=/g, '// type ')
  .replace(/\/\/.*$/gm, '');

console.log('🚀 色彩理论库功能测试开始...');
console.log('='.repeat(60));

eval(transpiled + `

  console.log('🔹 测试1: 颜色格式转换');
  console.log('  红色 #FF0000 → RGB:', hexToRgb('#FF0000'));
  console.log('  RGB(255, 0, 0) → 十六进制:', rgbToHex(255, 0, 0));
  console.log('  红色 #FF0000 → HSL:', hexToHsl('#FF0000'));
  console.log('  HSL(0, 100, 50) → 十六进制:', hslToHex(0, 100, 50));
  console.log();

  console.log('🔹 测试2: 互补色推荐');
  const complement = getComplementary('#3498db');
  console.log('  蓝色 #3498db 的互补色:', complement);
  console.log();

  console.log('🔹 测试3: 类似色推荐');
  const analogous = getAnalogous('#2ecc71');
  console.log('  绿色 #2ecc71 的类似色:', analogous);
  console.log();

  console.log('🔹 测试4: 三元色推荐');
  const triadic = getTriadic('#e74c3c');
  console.log('  红色 #e74c3c 的三元色:', triadic);
  console.log();

  console.log('🔹 测试5: 同色系推荐');
  const monochromatic = getMonochromatic('#9b59b6', 4);
  console.log('  紫色 #9b59b6 的同色系:', monochromatic);
  console.log();

  console.log('🔹 测试6: 获取所有推荐方案');
  const allRecs = getAllRecommendations('#f39c12');
  console.log('  橙色 #f39c12 的推荐方案数量:', allRecs.length);
  allRecs.forEach(rec => {
    console.log('    -', rec.name, ':', rec.colors);
  });
  console.log();

  console.log('🔹 测试7: 获取最佳推荐方案');
  const bestRecs = getBestRecommendations('#1abc9c');
  console.log('  青色 #1abc9c 的最佳推荐方案数量:', bestRecs.length);
  bestRecs.forEach(rec => {
    console.log('    -', rec.name, ':', rec.colors);
  });

`);

console.log('\n' + '='.repeat(60));
console.log('✅ 所有色彩理论功能测试完成！');
