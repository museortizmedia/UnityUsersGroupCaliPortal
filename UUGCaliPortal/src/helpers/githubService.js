/**
 * Obtiene y decodifica un archivo JSON directamente desde la API de GitHub
 */
export async function fetchJsonFromGithub({ owner, repo, path, token }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`Error al obtener ${path}: ${res.statusText}`);
  }

  const fileData = await res.json();
  const currentContentText = decodeURIComponent(
    escape(atob(fileData.content.replace(/\n/g, '')))
  );

  return {
    data: JSON.parse(currentContentText),
    sha: fileData.sha,
  };
}

/**
 * Ejecuta operaciones CRUD o REEMPLAZO TOTAL sobre un archivo JSON en GitHub
 */
export async function applyJsonCrudOperation({
  owner,
  repo,
  path,
  token,
  action,
  item,
  itemId,
  commitMessage,
}) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  // 1. Obtener el contenido actual del archivo y su SHA
  const getFileRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!getFileRes.ok) throw new Error(`Error al obtener ${path}: ${getFileRes.statusText}`);

  const fileData = await getFileRes.json();
  const currentContentText = decodeURIComponent(
    escape(atob(fileData.content.replace(/\n/g, '')))
  );
  let jsonArray = JSON.parse(currentContentText);

  if (!Array.isArray(jsonArray) && action !== 'REPLACE_ALL') {
    throw new Error(`El archivo ${path} no contiene un arreglo JSON.`);
  }

  // 2. Aplicar la operación requerida
  if (action === 'REPLACE_ALL') {
    // Reemplaza todo el arreglo con el estado procesado en el UI
    jsonArray = item;
  } else if (action === 'DELETE') {
    jsonArray = jsonArray.filter((i) => i.id !== itemId);
  } else if (action === 'UPSERT') {
    const index = jsonArray.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      jsonArray[index] = { ...jsonArray[index], ...item };
    } else {
      jsonArray.push(item);
    }
  }

  // 3. Codificar y hacer Commit vía GitHub REST API
  const updatedJsonString = JSON.stringify(jsonArray, null, 2);
  const encodedContent = btoa(unescape(encodeURIComponent(updatedJsonString)));

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: commitMessage || `crud(${action}): update ${path}`,
      content: encodedContent,
      sha: fileData.sha,
    }),
  });

  if (!putRes.ok) {
    const errorData = await putRes.json();
    throw new Error(errorData.message || 'Error guardando cambios en GitHub.');
  }

  return await putRes.json();
}