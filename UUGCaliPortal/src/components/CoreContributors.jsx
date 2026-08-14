import React, { useState } from 'react';
import membersData from '../data/members.json';

export default function CoreContributors() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Seleccionar solo los primeros 4 para la vista previa
  const featuredMembers = membersData.slice(0, 4);

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Core Contributors</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Ver más ({membersData.length})
        </button>
      </div>

      {/* Grid de los 4 principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {featuredMembers.map((member) => (
          <div key={member.id} className="p-4 border rounded-xl shadow-sm bg-white text-center">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-20 h-20 mx-auto rounded-full object-cover mb-3"
            />
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
          </div>
        ))}
      </div>

      {/* Modal Emergente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            {/* Encabezado del Modal */}
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Todos los Core Contributors</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            {/* Listado completo scrolleable */}
            <div className="p-6 overflow-y-auto space-y-4">
              {membersData.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-base">{member.name}</h4>
                    <p className="text-xs text-indigo-600 font-medium">{member.role}</p>
                    {member.bio && <p className="text-xs text-gray-500 mt-1">{member.bio}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Pie del Modal */}
            <div className="p-4 border-t text-right bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}