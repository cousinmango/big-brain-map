import { thisExportedFunctionToTranspile } from "./something-to-import.js";
console.log(doSomething());
function doSomething() {
    return 'Hi';
}
thisExportedFunctionToTranspile();
//# sourceMappingURL=index.js.map