import React, { useState } from 'react';

export default function TagInput({ tags = [], onChange, placeholder = 'Escribe y presiona Enter o coma...' }) {
  const [inputValue, setInputValue] = useState('');

  // Función para agregar un nuevo tag
  const addTag = (value) => {
    const trimmed = value.trim().replace(/^,+|,+$/g, ''); // Limpia comas al inicio o final
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  // Manejador de teclas (Enter, Coma, Backspace)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Elimina el último tag si presiona Backspace con el input vacío
      onChange(tags.slice(0, -1));
    }
  };

  // Manejador de evento al pegar texto (ej: "React, Unity, C#")
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const newTags = pastedData
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));

    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
  };

  // Eliminar tag específico
  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      {/* Contenedor principal con overflow-hidden para prevenir desbordamientos */}
      <div className="w-full overflow-hidden flex flex-wrap items-center gap-2 p-2 bg-white/60 border border-black/10 focus-within:border-black rounded-lg transition-colors min-h-[42px]">
        {/* Badges renderizados */}
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center justify-between gap-1.5 bg-black text-white px-2.5 py-1 rounded font-['JetBrains_Mono'] text-xs font-medium animate-fade-in max-w-full"
          >
            {/* break-all fuerza a las URLs extremadamente largas a saltar de línea sin salirse del badge */}
            <span className="break-all">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Eliminar"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </span>
        ))}

        {/* Input para escribir (ajustado para móviles con min-w-[100px] e flex-1) */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] bg-transparent border-none outline-none font-['JetBrains_Mono'] text-xs text-black py-1"
        />
      </div>

      <p className="font-['JetBrains_Mono'] text-[10px] text-[#45464d] mt-1">
        Presiona <kbd className="bg-black/5 px-1 py-0.5 rounded border border-black/10 font-bold">Enter</kbd> o <kbd className="bg-black/5 px-1 py-0.5 rounded border border-black/10 font-bold">,</kbd> para agregar.
      </p>
    </div>
  );
}