// Función para obtener el valor de una cookie específica
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(';').shift();

  return null;
};

// Función para establecer una nueva cookie en el navegador
export const setCookie = (name, value, minutes) => {
  let expires = '';

  if (minutes) {
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};