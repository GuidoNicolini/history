// scripts/combine-data.js

const fs = require('fs');
const path = require('path');

// 1. Definir las carpetas de origen y destino
const sourceDataDir = path.join(__dirname, '../src/data-assets');
const outputDataDir = path.join(__dirname, '../public/data');

// 2. Asegurarse de que las carpetas existan
if (!fs.existsSync(sourceDataDir)) {
  console.log(`La carpeta de origen "${sourceDataDir}" no existe. Creándola por ti.`);
  fs.mkdirSync(sourceDataDir, { recursive: true });
}
if (!fs.existsSync(outputDataDir)) {
  fs.mkdirSync(outputDataDir, { recursive: true });
}

console.log(`Buscando datos en: ${sourceDataDir}`);
console.log(`Los archivos combinados se guardarán en: ${outputDataDir}`);

// 3. Leer todas las subcarpetas en el directorio de origen (ej: 'heroes', 'locations')
const entityFolders = fs.readdirSync(sourceDataDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

if (entityFolders.length === 0) {
  console.log('No se encontraron carpetas de entidades en el directorio de origen. Saliendo.');
  return;
}

console.log(`\nSe encontraron las siguientes entidades: ${entityFolders.join(', ')}`);

// 4. Procesar cada carpeta de entidad
entityFolders.forEach(folderName => {
  const entityPath = path.join(sourceDataDir, folderName);
  const outputFilePath = path.join(outputDataDir, `${folderName}.json`);
  const combinedArray = [];

  // Leer todos los archivos .json dentro de la carpeta de la entidad
  const jsonFiles = fs.readdirSync(entityPath).filter(file => path.extname(file) === '.json');

  if (jsonFiles.length === 0) {
    console.log(`\n⚠️  Advertencia: No se encontraron archivos .json en la carpeta '${folderName}'.`);
    return;
  }

  console.log(`\nProcesando '${folderName}'... Se encontraron ${jsonFiles.length} archivos.`);

  jsonFiles.forEach(file => {
    const filePath = path.join(entityPath, file);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      combinedArray.push(JSON.parse(fileContent));
    } catch (error) {
      console.error(`\n❌ Error al procesar el archivo: ${filePath}`);
      console.error(error);
    }
  });

  // Escribir el array combinado en un único archivo de salida
  fs.writeFileSync(outputFilePath, JSON.stringify(combinedArray, null, 2));
  console.log(`✅  ¡Éxito! Se combinaron ${combinedArray.length} archivos en -> ${outputFilePath}`);
});

console.log('\n¡Proceso de combinación de datos completado!');
