// eslint.config.mjs   ← dosya adı .mjs olsun (ESM için daha temiz)
import js from "@eslint/js";
import globals from "globals";

export default [
  // 1. Resmi recommended kurallar (temel hataları yakalar)
  js.configs.recommended,

  // 2. Node.js ortamı için globals (process, module, __dirname vs. tanınsın)
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      // Eğer projende "type": "module" varsa sourceType'ı module yap
      sourceType: "module", // import/export kullanıyorsan
      // sourceType: 'commonjs'   // require kullanıyorsan
    },
  },

  // 3. Kendi ek kuralların / overrides (kursun önerdiği gibi basit tutabilirsin)
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"], // hangi dosyaları kapsasın
    rules: {
      semi: ["error", "always"], // noktalı virgül zorunlu
      "no-unused-vars": ["error", { args: "none" }], // kullanılmayan argümanları görmezden gel
      "no-undef": "error", // tanımlanmamış değişken hata
      "no-console": "warn", // console.log uyarısı (istersen 'off' yap)
      eqeqeq: "error", // == yerine === zorunlu
    },
  },
];
