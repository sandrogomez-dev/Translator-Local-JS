let translator;

let translateBtn = document.querySelector("#translate");

let output = document.querySelector("#output");

translateBtn.addEventListener("click", async () => {
  const text = document.querySelector("#textInput").value.trim();
  const sourceLang = document.querySelector("#sourceLang");
  const targetLang = document.querySelector("#targetLang");

  if (!text) {
    output.textContent = "Por favor introduce un texto para traducir...";
  }
  if (sourceLang.value === targetLang.value) {
    output.textContent = "Elige dos idiomas diferentes";
    return;
  }

  if (!("Translator" in self)) {
    output.textContent = "Tu navegador no soporta el api de traducciones";

    return;
  }

  try {
    if (
      !translator ||
      translator.sourceLanguage !== sourceLang.value ||
      translator.targetLanguage !== targetLang.value
    ) {
      const disponible = await Translator.availability({
        sourceLanguage: sourceLang.value,
        targetLanguage: targetLang.value,
      });

      if (disponible === "unavailable") {
        output.textContent = "Estos idiomas no estan soportados.";
        return;
      }

      translator = await Translator.create({
        sourceLanguage: sourceLang.value,
        targetLanguage: targetLang.value,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            output.textContent =
              "Descargando modelo: " + Math.round(e.loaded * 100) + "%";
          });
        },
      });

      await translator.ready;
    }

    output.textContent = "Traduciendo...🌟";

    const translated = await translator.translate(text);
    output.textContent = translated;
  } catch (error) {
    output.textContent = "Error al traducir...";
    console.log(error);
  }
});
